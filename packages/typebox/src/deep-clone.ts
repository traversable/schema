import * as T from '@sinclair/typebox'
import { fn, has, joinPath, Object_entries, Object_values, parseKey, stringifyLiteral } from '@traversable/registry'
import type { Discriminated } from '@traversable/typebox-types'
import {
  F,
  Invariant,
  Type,
  check,
  areAllObjects,
  getTags,
  isOptional,
  tagged,
  toType,
  deepCloneInlinePrimitiveCheck as inlinePrimitiveCheck,
  deepCloneIsPrimitive as isPrimitive,
  deepCloneSchemaOrdering as schemaOrdering,
  isLiteral,
  isUnion,
} from '@traversable/typebox-types'

export type Path = (string | number)[]
export type Builder = (prev: Path, next: Path, ix: Scope) => string

export interface Scope extends F.CompilerIndex {
  bindings: Map<string, string>
  isProperty: boolean
  isRoot: boolean
  mutateDontAssign: boolean
  needsReturnStatement: boolean
  stripTypes: boolean
  useGlobalThis: deepClone.Options['useGlobalThis']
}

function isVoidOrUndefined<T>(x: Type.F<T> | T): boolean {
  switch (true) {
    default: return false
    case tagged('void')(x):
    case tagged('undefined')(x): return true
    case tagged('optional')(x): return isVoidOrUndefined(x.schema)
    case tagged('anyOf')(x): return x.anyOf.some(isVoidOrUndefined)
  }
}

const isDefinedOptional = <T>(x: unknown): x is Type.Optional<T> => isOptional(x) && !isVoidOrUndefined(x.schema)

const defaultIndex = (options?: Partial<Scope>) => ({
  ...F.defaultIndex,
  bindings: new Map(),
  dataPath: [],
  isOptional: false,
  isProperty: false,
  isRoot: true,
  mutateDontAssign: false,
  schemaPath: [],
  useGlobalThis: false,
  varName: 'value',
  needsReturnStatement: true,
  stripTypes: false,
  ...options,
}) satisfies Scope

type IndexedSchema = T.TSchema & { index?: number }
interface ExtractedUnions {
  unions: IndexedSchema[]
  schema: Type.Fixpoint
}

const isPrimitiveMember = (x: unknown) => isPrimitive(x) || isLiteral(x)
const isNonPrimitiveMember = (x: unknown) => !isPrimitiveMember(x)

function getPredicates(unions: IndexedSchema[], stripTypes: boolean) {
  return unions
    .filter(isNonPrimitiveMember)
    .map(({ index, ...x }) => check.writeable(x, { stripTypes, functionName: `check_${index}`, }))
  // return predicates.length === 1 ? [] : predicates.length === 2 ? [predicates[0]] : predicates
  // return predicates.length === 1 ? [] : predicates.length === 2 ? [predicates[0]] : predicates.slice(1, -1)
}

function extractUnions(schema: T.TSchema): ExtractedUnions {
  let index = 0
  let unions = Array.of<IndexedSchema>()
  const out = F.fold<Type.Fixpoint>((x) => {
    if (!isUnion(x)) {
      return x satisfies Type.Fixpoint
    } else if (getTags(x.anyOf) !== null) {
      return x satisfies Type.Fixpoint
    } else {
      const sorted: Type.Fixpoint[] = x.anyOf.toSorted(schemaOrdering).map(
        (union) => isPrimitiveMember(union) ? union : { ...union, index: index++ }
      )
      // const nonPrimitives = sorted.filter((_) => !isPrimitive(_))

      // console.log('sorted', sorted)
      // console.log('nonPrimitives', nonPrimitives)

      // if (sorted.length - nonPrimitives.length === 1) unions.push(nonPrimitives[0] as IndexedSchema)
      if (sorted.length === 1) unions.push(sorted[0] as IndexedSchema)
      else unions.push(...sorted.slice(0, -1) as IndexedSchema[])
      return { anyOf: sorted, [T.Kind]: 'Union' } satisfies Type.Fixpoint
    }
  })(schema as Type.Fixpoint)
  return {
    unions,
    schema: out
  } satisfies ExtractedUnions
}


function isAtomic(x: unknown): boolean {
  switch (true) {
    default: return false
    case tagged('null')(x):
    case tagged('boolean')(x):
    case tagged('integer')(x):
    case tagged('number')(x):
    case tagged('string')(x):
    case tagged('never')(x): return true
    case tagged('anyOf')(x): return x.anyOf.some(isAtomic)
  }
}

function assign(_: Path, NEXT_PATH: Path, IX: Scope) {
  return `${IX.needsReturnStatement ? 'return ' : ''}${joinPath(NEXT_PATH, false)}`
}

function buildUnionCloner(x: Type.Union<Builder>, input: Type.F<unknown>): Builder {
  if (!tagged('anyOf')(input)) return Invariant.IllegalState('cloneUnion', 'expected input to be a union schema', input)
  if (!areAllObjects(input.anyOf)) {
    return buildInclusiveUnionCloner(x, input)
  } else {
    const withTags = getTags(x.anyOf as never)
    return withTags === null
      ? buildInclusiveUnionCloner(x, input)
      : buildExclusiveUnionCloner(x, withTags)
  }
}

function buildInclusiveUnionCloner(
  x: Type.Union<Builder>,
  input: Type.Union<unknown>
): Builder {
  if (x.anyOf.length === 1) return x.anyOf[0]
  return function deepCloneUnion(PREV_PATH, NEXT_PATH, IX) {
    const index = { ...IX, needsReturnStatement: false }
    if (input.anyOf.every(isAtomic)) return assign(PREV_PATH, NEXT_PATH, IX)
    else {
      return input.anyOf
        .map((option, i) => {
          const continuation = x.anyOf[i]
          const RETURN = IX.needsReturnStatement ? 'return ' : ''
          if (i === x.anyOf.length - 1) {
            return ` : ${continuation(PREV_PATH, NEXT_PATH, index)}`
          } else if (isPrimitive(option)) {
            const CHECK = inlinePrimitiveCheck(
              option,
              { path: PREV_PATH, ident: joinPath(NEXT_PATH, false) },
              undefined,
              IX.useGlobalThis
            )
            return `${i === 0 ? RETURN : ' : '}${CHECK} ? ${continuation(PREV_PATH, NEXT_PATH, index)}`
          } else {
            if (!has('index')(option))
              return Invariant.IllegalState(
                'deepClone',
                'expected non-primitive union member to have an index',
                option
              )
            const FUNCTION_NAME = `check_${option.index}`
            const IDENT = joinPath(NEXT_PATH, false)
            return `${i === 0 ? RETURN : ' : '}${FUNCTION_NAME}(${IDENT}) ? ${continuation(PREV_PATH, NEXT_PATH, index)}`
          }
        })
        .join('\n')
    }
  }
}

function buildExclusiveUnionCloner(
  x: Type.Union<Builder>,
  [discriminant, TAGGED]: Discriminated
): Builder {
  return function cloneDisjointUnion(PREV_PATH, NEXT_PATH, IX) {
    const RETURN = IX.needsReturnStatement ? 'return ' : ''
    return ''
      + RETURN
      + TAGGED.map(({ tag }, I) => {
        const continuation = x.anyOf[I]
        const TAG = stringifyLiteral(tag)
        const PREV_ACCESSOR = joinPath([...PREV_PATH, discriminant], false)
        return [
          I === x.anyOf.length - 1 ? '' : `${PREV_ACCESSOR} === ${TAG} ? `,
          continuation(PREV_PATH, NEXT_PATH, { ...IX, needsReturnStatement: false }),
          I === x.anyOf.length - 1 ? '' : ' : ',
        ].join('\n')
      }).join('\n')
  }
}

const fold = F.fold<Builder>((x, _, input) => {
  switch (true) {
    default: return (void (x satisfies never), () => '')
    case tagged('never')(x): return function deepCloneNever(...args: Parameters<Builder>) { return assign(...args) }
    case tagged('any')(x): return function deepCloneAny(...args: Parameters<Builder>) { return assign(...args) }
    case tagged('unknown')(x): return function deepCloneUnknown(...args: Parameters<Builder>) { return assign(...args) }
    case tagged('void')(x): return function deepCloneVoid(...args: Parameters<Builder>) { return assign(...args) }
    case tagged('null')(x): return function deepCloneNull(...args: Parameters<Builder>) { return assign(...args) }
    case tagged('undefined')(x): return function deepCloneUndefined(...args: Parameters<Builder>) { return assign(...args) }
    case tagged('boolean')(x): return function deepCloneBoolean(...args: Parameters<Builder>) { return assign(...args) }
    case tagged('integer')(x): return function deepCloneInteger(...args: Parameters<Builder>) { return assign(...args) }
    case tagged('bigInt')(x): return function deepCloneBigInt(...args: Parameters<Builder>) { return assign(...args) }
    case tagged('number')(x): return function deepCloneNumber(...args: Parameters<Builder>) { return assign(...args) }
    case tagged('string')(x): return function deepCloneString(...args: Parameters<Builder>) { return assign(...args) }
    case tagged('symbol')(x): return function deepCloneSymbol(...args: Parameters<Builder>) { return assign(...args) }
    case tagged('literal')(x): return function deepCloneLiteral(...args: Parameters<Builder>) { return assign(...args) }
    case tagged('date')(x): return function deepCloneDate(PREV_PATH: Path, NEXT_PATH: Path, IX: Scope) {
      const RETURN = IX.needsReturnStatement ? 'return ' : ''
      // `${IX.needsReturnStatement ? 'return ' : ''}${joinPath(NEXT_PATH, false)}`
      return `${RETURN} new ${IX.useGlobalThis ? 'globalThis.' : ''}Date(${joinPath(NEXT_PATH, false)}?.getTime())`
    }
    case tagged('array')(x): {
      if (!tagged('array')(input))
        return Invariant.IllegalState(
          'deepClone',
          'expected input to be an array schema',
          input
        )
      return function deepCloneArray(PREV_PATH, NEXT_PATH, IX) {
        const isNullary = F.isNullary(input.items)
        const needsReturnStatement = !isNullary
        const OPEN = IX.needsReturnStatement ? 'return ' : ''
        const OPEN_BRACKET = isNullary ? '(' : '{'
        const CLOSE_BRACKET = isNullary ? ')' : '}'
        return [
          `${OPEN}${joinPath(NEXT_PATH, false)}.map((value) => ${OPEN_BRACKET}`,
          `${x.items([...PREV_PATH, 'value'], ['value'], { ...IX, needsReturnStatement })}`,
          `${CLOSE_BRACKET})`,
        ].join('\n')
      }
    }
    case tagged('record')(x): {
      return function deepCloneRecord(_, NEXT_PATH, IX) {
        const index = { ...IX, needsReturnStatement: false } satisfies Scope
        const NS = IX.useGlobalThis ? 'globalThis.' : ''
        const RETURN = IX.needsReturnStatement ? 'return ' : ''
        const [continuation] = Object_values(x.patternProperties)
        const BODY = continuation(['value'], ['value'], index)
        return ''
          + RETURN
          + [
            `${NS}Object.entries(${joinPath(NEXT_PATH, false)}).reduce(`,
            `  (acc, [key, value]) => {`,
            `    acc[key] = ${BODY}`,
            `    return acc`,
            `  },`,
            `  ${NS}Object.create(null)`,
            `)`,
          ].filter((_) => _ !== null).join('\n')
      }
    }
    case tagged('optional')(x): {
      if (!tagged('optional')(input)) {
        return Invariant.IllegalState(
          'cloneUnion',
          'expected input to be an optional schema',
          input
        )
      }

      return function deepCloneOptional(PREV_PATH, NEXT_PATH, IX) {
        if (IX.isProperty) return x.schema(PREV_PATH, NEXT_PATH, IX)
        else return x.schema(PREV_PATH, NEXT_PATH, IX)
      }
    }
    case tagged('allOf')(x): {
      if (!tagged('allOf')(input)) {
        return Invariant.IllegalState(
          'cloneUnion',
          'expected input to be an intersection schema',
          input
        )
      }
      return function deepCloneIntersection(PREV_PATH, NEXT_PATH, IX) {
        const RETURN = IX.needsReturnStatement ? 'return ' : ''
        if (input.allOf.every(isPrimitiveMember)) {
          return assign(PREV_PATH, NEXT_PATH, IX)
        } else if (input.allOf.every(tagged('object'))) {
          return ''
            + RETURN
            + [
              '{',
              x.allOf.map((continuation) => '...' + continuation(
                PREV_PATH,
                NEXT_PATH,
                { ...IX, needsReturnStatement: false }
              )).join(','),
              '}',
            ].join('\n')
        } else {
          return Invariant.IllegalState(
            'deepClone',
            'expected intersection members to be primitives, or all objects',
            x.allOf,
          )
        }
      }
    }
    case tagged('anyOf')(x): {
      if (!isUnion(input)) {
        return Invariant.IllegalState(
          'cloneUnion',
          'expected input to be a union schema',
          input
        )
      }
      if (!areAllObjects(input.anyOf)) {
        return buildInclusiveUnionCloner(x, input)
      } else {
        const withTags = getTags(input.anyOf)
        return withTags === null
          ? buildInclusiveUnionCloner(x, input)
          : buildExclusiveUnionCloner(x, withTags)
      }
      // return buildUnionCloner(x, input)
    }
    case tagged('tuple')(x): {
      if (!tagged('tuple')(input)) {
        return Invariant.IllegalState(
          'deepClone',
          'expected input to be a tuple schema',
          input
        )
      }
      return function deepCloneTuple(_, NEXT_PATH, IX) {
        const index = { ...IX, needsReturnStatement: false }
        const RETURN = IX.needsReturnStatement ? 'return ' : ''
        const ITEMS = x.items.map((continuation, I) => continuation([], [...NEXT_PATH, I], index))
        return `${RETURN}[${ITEMS.join(', ')}]`
      }
    }
    case tagged('object')(x): {
      if (!tagged('object')(input))
        return Invariant.IllegalState(
          'deepClone',
          'expected input to be an object',
          input
        )
      return function deepCloneObject(PREV_PATH, NEXT_PATH, IX) {
        const OPEN = IX.needsReturnStatement ? 'return (' : null
        const CLOSE = IX.needsReturnStatement ? ')' : null
        return [
          OPEN,
          `{`,
          Object_entries(x.properties).map(
            ([k, continuation]) => {
              const VALUE = continuation(
                [...PREV_PATH, k],
                [...NEXT_PATH, k],
                { ...IX, needsReturnStatement: false }
              )
              if (isDefinedOptional(input.properties[k])) {
                if (F.isNullary(input.properties[k].schema)) {
                  return `...${joinPath([...NEXT_PATH, k], false)} !== undefined && { ${parseKey(k)}: ${VALUE} }`
                } else {
                  return `...${joinPath([...NEXT_PATH, k], false)} && { ${parseKey(k)}: ${VALUE} }`
                }
              } else {
                return `${parseKey(k)}: ${VALUE}`
              }
            }
          ).join(', '),
          `}`,
          CLOSE,
        ].filter((_) => _ !== null).join('\n')
      }
    }
  }
})

export declare namespace deepClone {
  type Options = toType.Options & {
    /**
     * Configure the name of the generated deep clone function
     * @default "deepClone"
     */
    functionName?: string
    /**
     * Whether to access global identifiers like `Date` from the `globalThis` namespace
     * @default false
     */
    useGlobalThis?: boolean
    /**
     * Whether to remove TypeScript type annotations from the generated output
     * @default false
     */
    stripTypes?: boolean
  }
}

deepClone.writeable = deepClone_writeable

/**
 * ## {@link deepClone `box.deepClone`}
 *
 * Derive a _deep clone function_ from a zod schema (v4, classic).
 * 
 * The generated cloning function is significantly faster than JavaScript's built-in
 * {@link structuredClone `structuredClone`}: 
 * 
 * - __~3x__ faster with shallow schemas
 * - __~10x__ faster with large schemas
 * 
 * It's even faster when compared with Lodash's `cloneDeep`:
 * 
 * - __~9x__ faster with shallow schemas
 * - __~25x__ faster with large schemas
 * 
 * This is possible because the cloning function knows the shape of your data ahead
 * of time, and will do the minimum amount of work necessary to create a new copy
 * of your data.
 *
 * Note that the "deep clone function" generated by {@link deepClone `box.deepClone`}
 * **assumes that both values have already been validated**. Passing
 * invalid data to the clone function will result in undefined behavior.
 * 
 * Note that {@link deepClone `box.deepClone`} works in any environment that 
 * supports defining functions using the `Function` constructor. If your
 * environment does not support the `Function` constructor, use 
 * {@link deepClone_writeable `box.deepClone.writeable`}.
 * 
 * See also:
 * - {@link deepClone_writeable `box.deepClone.writeable`}
 *
 * @example
 * import { assert } from 'vitest'
 * import { box } from '@traversable/typebox'
 * 
 * const deepClone = box.deepClone(
 *   T.Object({
 *     street1: T.String(),
 *     street2: T.Optional(T.String()),
 *     city: T.String(),
 *   })
 * )
 * 
 * const sherlock = { street1: '221 Baker St', street2: '#B', city: 'London' }
 * const harry = { street1: '4 Privet Dr', city: 'Little Whinging' }
 * 
 * const sherlockCloned = deepClone(sherlock)
 * const harryCloned = deepClone(harry)
 * 
 * // values are deeply equal:
 * assert.deepEqual(sherlockCloned, sherlock) // ✅
 * assert.deepEqual(harryCloned, harry)       // ✅
 * 
 * // values are fresh copies:
 * assert.notEqual(sherlockCloned, sherlock)  // ✅
 * assert.notEqual(harryCloned, harry)        // ✅
 */

export function deepClone<const S extends T.TSchema, T = T.Static<S>>(schematic: S): (cloneMe: T) => T
export function deepClone(schematic: T.TSchema) {
  const $ = defaultIndex({ stripTypes: true })
  const { unions, schema } = extractUnions(schematic)
  const predicates = getPredicates(unions, $.stripTypes)
  const compiled = fold(schema as Type.F<Builder>)(['prev'], ['prev'], $)
  const BODY = compiled.length === 0 ? null : compiled
  return globalThis.Function('prev', [
    ...predicates,
    BODY,
  ].filter((_) => _ !== null).join('\n'))
}

/**
 * ## {@link deepClone_writeable `box.deepClone.writeable`}
 *
 * Derive a "writeable" (stringified) _deep clone function_ 
 * from a JSON Schema spec.
 * 
 * The generated cloning function is significantly faster than JavaScript's built-in
 * {@link structuredClone `structuredClone`}: 
 * 
 * - __~3x__ faster with shallow schemas
 * - __~10x__ faster with large schemas
 * 
 * It's even faster when compared with Lodash's `cloneDeep`:
 * 
 * - __~9x__ faster with shallow schemas
 * - __~25x__ faster with large schemas
 * 
 * This is possible because the cloning function knows the shape of your data ahead
 * of time, and will do the minimum amount of work necessary to create a new copy
 * of your data.
 *
 * Note that the "deep clone function" generated by 
 * {@link deepClone_writeable `box.deepClone.writeable`}
 * **assumes that both values have already been validated**. Passing
 * invalid data to the clone function will result in undefined behavior.
 * You don't have to worry about this as long as you
 * 
 * {@link deepClone_writeable `box.deepClone.writeable`} accepts an optional
 * configuration object as its second argument; documentation for those
 * options are available via hover on autocompletion.
 * 
 * See also:
 * - {@link deepClone `box.deepClone`}
 *
 * @example
 * import { box } from '@traversable/typebox'
 * 
 * const deepClone = box.deepClone.writeable({
 *   T.Object({
 *     street1: T.String(),
 *     street2: T.Optional(T.String()),
 *     city: T.String(),
 *   })
 * }, { typeName: 'Type' })
 * 
 * console.log(deepClone) 
 * // =>
 * // type Address = { street1: string; street2?: string; city: string; }
 * // function clone(prev: Address): Address {
 * //   return {
 * //     street1: prev.street1,
 * //     ...prev.street2 !== undefined && { street2: prev.street2 },
 * //     city: prev.city
 * //   }
 * // }
 */

function deepClone_writeable(schematic: T.TSchema, options?: deepClone.Options): string {
  const $ = defaultIndex(options)
  const FUNCTION_NAME = options?.functionName ?? 'deepClone'
  const { unions, schema } = extractUnions(schematic)
  const predicates = getPredicates(unions, $.stripTypes)
  const compiled = fold(schema as Type.F<Builder>)(['prev'], ['prev'], $)
  const inputType = toType(schema as T.TSchema, options)
  const TYPE = $.stripTypes ? '' : `: ${options?.typeName ?? inputType}`
  const BODY = compiled.length === 0 ? null : compiled
  return [
    options?.typeName === undefined ? null : inputType,
    `function ${FUNCTION_NAME} (prev${TYPE}) {`,
    ...predicates,
    BODY,
    `}`,
  ].filter((_) => _ !== null).join('\n')
}
