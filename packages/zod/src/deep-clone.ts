import { z } from 'zod'
import { has, joinPath, Object_entries, parseKey, stringifyLiteral } from '@traversable/registry'
import type { AnyTypeName, Discriminated } from '@traversable/zod-types'
import {
  F,
  Invariant,
  TypeName,
  hasTypeName,
  tagged,
  areAllObjects,
  getTags,
  isOptional,
  deepCloneIsPrimitive as isPrimitive,
  deepCloneInlinePrimitiveCheck as inlinePrimitiveCheck,
  deepCloneSchemaOrdering as schemaOrdering,
} from '@traversable/zod-types'

import { check } from './check.js'
import { toType } from './to-type.js'

export type Path = (string | number)[]
export type Builder = (prev: Path, next: Path, ix: Scope) => string

export interface Scope extends F.CompilerIndex {
  bindings: Map<string, string>
  isRoot: boolean
  isProperty: boolean
  mutateDontAssign: boolean
  needsReturnStatement: boolean
  stripTypes: boolean
  useGlobalThis: deepClone.Options['useGlobalThis']
}

type IndexedSchema = z.core.$ZodType & { index?: number }
interface ExtractedUnions {
  unions: IndexedSchema[]
  schema: F.Z.Fixpoint
}

function defaultIndex(options?: Partial<Scope>): Scope {
  return {
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
  }
}

type UnsupportedSchema = F.Z.Catalog[typeof deepClone_unsupported[number]]
const deepClone_unsupported = [
  // 'success',
  'transform',
  'promise',
  // 'custom',
] satisfies AnyTypeName[]

function isUnsupported(x: unknown): x is UnsupportedSchema {
  return hasTypeName(x) && deepClone_unsupported.includes(x._zod.def.type as never)
}

function isVoidOrUndefined(x: unknown): boolean {
  switch (true) {
    default: return false
    case tagged('void', x):
    case tagged('undefined', x): return true
    case tagged('catch', x):
    case tagged('default', x):
    case tagged('nonoptional', x):
    case tagged('nullable', x):
    case tagged('optional', x):
    case tagged('prefault', x):
    case tagged('readonly', x): return isVoidOrUndefined(x._zod.def.innerType)
    case tagged('lazy', x): return isVoidOrUndefined(x._zod.def.getter())
    case tagged('pipe', x): return isVoidOrUndefined(x._zod.def.out)
    case tagged('literal', x): return x._zod.def.values.includes(undefined)
    case tagged('union', x): return x._zod.def.options.some(isVoidOrUndefined)
  }
}

function isDefinedOptional<T>(x: unknown): x is F.Z.Optional<T> {
  return isOptional(x) && !isVoidOrUndefined(x._zod.def.innerType)
}

function isDeepPrimitive(x: unknown): boolean {
  switch (true) {
    default: return false
    case isPrimitive(x): return true
    case tagged('catch')(x):
    case tagged('default')(x):
    case tagged('nonoptional')(x):
    case tagged('nullable')(x):
    case tagged('optional')(x):
    case tagged('prefault')(x):
    case tagged('readonly')(x): return isDeepPrimitive(x._zod.def.innerType)
    case tagged('lazy')(x): return isDeepPrimitive(x._zod.def.getter())
    case tagged('pipe')(x): return isDeepPrimitive(x._zod.def.out)
    case tagged('union', x): return x._zod.def.options.every(isVoidOrUndefined)
  }
}

function isAtomic(x: unknown): boolean {
  switch (true) {
    default: return false
    case tagged('void', x):
    case tagged('null', x):
    case tagged('undefined', x):
    case tagged('symbol', x):
    case tagged('boolean', x):
    case tagged('nan', x):
    case tagged('int', x):
    case tagged('bigint', x):
    case tagged('number', x):
    case tagged('string', x):
    case tagged('enum', x):
    case tagged('literal', x):
    case tagged('template_literal', x): return true
    case tagged('optional', x):
    case tagged('nullable', x):
    case tagged('readonly', x):
    case tagged('nonoptional', x): return isAtomic(x._zod.def.innerType)
  }
}

const isPrimitiveMember = (x: unknown) => isPrimitive(x) || tagged('literal')(x)
const isNonPrimitiveMember = (x: unknown) => !isPrimitiveMember(x)

function getPredicates(unions: IndexedSchema[], stripTypes: boolean) {
  return unions
    .filter(isNonPrimitiveMember)
    .map(({ index, ...x }) => check.writeable(x, { stripTypes, functionName: `check_${index}`, }))
}

function extractUnions(schema: z.core.$ZodType): ExtractedUnions {
  let index = 0
  let unions = Array.of<IndexedSchema>()
  const out = F.fold<F.Z.Fixpoint>((x) => {
    if (!tagged('union')(x)) {
      return x
    } else if (getTags(x._zod.def.options) !== null) {
      return x
    } else {
      const sorted = x._zod.def.options.toSorted(schemaOrdering).map(
        (union) => isPrimitiveMember(union) ? union : { ...union, index: index++ }
      )
      if (sorted.length === 1) unions.push(sorted[0] as IndexedSchema)
      else unions.push(...sorted.slice(0, -1) as IndexedSchema[])
      return { _zod: { def: { type: 'union', options: sorted as [F.Z.Fixpoint, F.Z.Fixpoint] } } } satisfies F.Z.Union
    }
  })(schema as F.Z.Fixpoint)
  return {
    unions,
    schema: out
  } satisfies ExtractedUnions
}

function assign(_: Path, NEXT_PATH: Path, IX: Scope) {
  return `${IX.needsReturnStatement ? 'return ' : ''}${joinPath(NEXT_PATH, false)}`
}

const defaultWriteable = {
  [TypeName.custom]: function deepCloneAny(...args) { return assign(...args) },
  [TypeName.any]: function deepCloneAny(...args) { return assign(...args) },
  [TypeName.unknown]: function deepCloneUnknown(...args) { return assign(...args) },
  [TypeName.never]: function deepCloneNever(...args) { return assign(...args) },
  [TypeName.void]: function deepCloneVoid(...args) { return assign(...args) },
  [TypeName.undefined]: function deepCloneUndefined(...args) { return assign(...args) },
  [TypeName.null]: function deepCloneNull(...args) { return assign(...args) },
  [TypeName.nan]: function deepCloneNaN(...args) { return assign(...args) },
  [TypeName.boolean]: function deepCloneBoolean(...args) { return assign(...args) },
  [TypeName.symbol]: function deepCloneSymbol(...args) { return assign(...args) },
  [TypeName.int]: function deepCloneInt(...args) { return assign(...args) },
  [TypeName.bigint]: function deepCloneBigInt(...args) { return assign(...args) },
  [TypeName.number]: function deepCloneNumber(...args) { return assign(...args) },
  [TypeName.string]: function deepCloneString(...args) { return assign(...args) },
  [TypeName.enum]: function deepCloneEnum(...args) { return assign(...args) },
  [TypeName.literal]: function deepCloneLiteral(...args) { return assign(...args) },
  [TypeName.template_literal]: function deepCloneTemplateLiteral(...args) { return assign(...args) },
  [TypeName.file]: function deepCloneFile(_, NEXT_PATH, IX) {
    const RETURN = IX.needsReturnStatement ? 'return ' : ''
    const NS = IX.useGlobalThis ? 'globalThis.' : ''
    const IDENT = joinPath(NEXT_PATH, false)
    const OPTIONS = `{ type: ${IDENT}.type, lastModified: ${IDENT}.lastModified }`
    return `${RETURN} new ${NS}File([${IDENT}], ${IDENT}.name, ${OPTIONS})`
  },
  [TypeName.date]: function deepCloneDate(_, NEXT_PATH, IX) {
    const RETURN = IX.needsReturnStatement ? 'return ' : ''
    return `${RETURN} new ${IX.useGlobalThis ? 'globalThis.' : ''}Date(${joinPath(NEXT_PATH, false)}?.getTime())`
  },
} satisfies Record<string, Builder>

function buildInclusiveUnionCloner(
  x: F.Z.Union<Builder>,
  input: z.core.$ZodUnion
): Builder {
  if (x._zod.def.options.length === 1) return x._zod.def.options[0]
  return function deepCloneUnion(PREV_PATH, NEXT_PATH, IX) {
    const index = { ...IX, needsReturnStatement: false }
    if (input._zod.def.options.every(isAtomic))
      return assign(PREV_PATH, NEXT_PATH, IX)
    else {
      return input._zod.def.options
        .map((option, i) => {
          const continuation = x._zod.def.options[i]
          const RETURN = IX.needsReturnStatement ? 'return ' : ''
          const IDENT = joinPath(NEXT_PATH, false)
          if (i === x._zod.def.options.length - 1) {
            return ` : ${continuation(PREV_PATH, NEXT_PATH, index)}`
          } else if (isPrimitive(option)) {
            const CHECK = inlinePrimitiveCheck(option, [IDENT], undefined, IX.useGlobalThis)
            return `${i === 0 ? RETURN : ' : '}${CHECK} ? ${continuation([IDENT], [IDENT], index)}`
          } else {
            if (!has('index')(option))
              return Invariant.IllegalState(
                'deepClone',
                'expected non-primitive union member to have an index',
                option
              )
            const FUNCTION_NAME = `check_${option.index}`
            return `${i === 0 ? RETURN : ' : '}${FUNCTION_NAME}(${IDENT}) ? ${continuation(PREV_PATH, NEXT_PATH, index)}`
          }
        })
        .join('\n')
    }
  }
}

function buildExclusiveUnionCloner(
  x: F.Z.Union<Builder>,
  [discriminant, TAGGED]: Discriminated
): Builder {
  return function cloneDisjointUnion(PREV_PATH, NEXT_PATH, IX) {
    const RETURN = IX.needsReturnStatement ? 'return ' : ''
    return ''
      + RETURN
      + TAGGED.map(({ tag }, I) => {
        const continuation = x._zod.def.options[I]
        const TAG = stringifyLiteral(tag)
        const PREV_ACCESSOR = joinPath([...PREV_PATH, discriminant], false)
        return [
          I === x._zod.def.options.length - 1 ? '' : `${PREV_ACCESSOR} === ${TAG} ? `,
          continuation(PREV_PATH, NEXT_PATH, { ...IX, needsReturnStatement: false }),
          I === x._zod.def.options.length - 1 ? '' : ' : ',
        ].join('\n')
      }).join('\n')
  }
}

const fold = F.fold<Builder>((x, _, input) => {
  switch (true) {
    default: return (void (x satisfies never), () => '')
    case tagged('file')(x):
    case tagged('enum')(x):
    case F.isNullary(x): return defaultWriteable[x._zod.def.type]
    case tagged('lazy')(x): return x._zod.def.getter()
    case tagged('catch')(x): return x._zod.def.innerType
    case tagged('default')(x): return x._zod.def.innerType
    case tagged('prefault')(x): return x._zod.def.innerType
    case tagged('pipe')(x): return x._zod.def.out
    case tagged('nonoptional')(x): return x._zod.def.innerType
    case tagged('success')(x): return x._zod.def.innerType
    case tagged('readonly')(x): return x._zod.def.innerType
    case tagged('union')(x): {
      if (!tagged('union', input)) {
        return Invariant.IllegalState(
          'deepClone',
          'expected input to be a union schema',
          input
        )
      }
      if (!areAllObjects(input._zod.def.options)) {
        return buildInclusiveUnionCloner(x, input)
      } else {
        const withTags = getTags(input._zod.def.options)
        return withTags === null
          ? buildInclusiveUnionCloner(x, input)
          : buildExclusiveUnionCloner(x, withTags)
      }
    }
    case tagged('array')(x): {
      if (!tagged('array', input))
        return Invariant.IllegalState(
          'deepClone',
          'expected input to be an array schema',
          input
        )
      return function deepCloneArray(PREV_PATH, NEXT_PATH, IX) {
        const isNullary = F.isNullary(input._zod.def.element)
        const needsReturnStatement = !isNullary
        const index = { ...IX, needsReturnStatement, isProperty: false } satisfies Scope
        const OPEN = IX.needsReturnStatement ? 'return ' : ''
        const OPEN_BRACKET = isNullary ? '(' : '{'
        const CLOSE_BRACKET = isNullary ? ')' : '}'
        if (isDeepPrimitive(input._zod.def.element)) return [
          `${OPEN}${joinPath(NEXT_PATH, false)}.slice()`,
        ].join('\n')

        else return [
          `${OPEN}${joinPath(NEXT_PATH, false)}.map((value) => ${OPEN_BRACKET}`,
          `${x._zod.def.element([...PREV_PATH, 'value'], ['value'], index)}`,
          `${CLOSE_BRACKET})`,
        ].join('\n')
      }
    }
    case tagged('record')(x): {
      return function deepCloneRecord(_, NEXT_PATH, IX) {
        const index = { ...IX, needsReturnStatement: false, isProperty: false } satisfies Scope
        const NS = IX.useGlobalThis ? 'globalThis.' : ''
        const RETURN = IX.needsReturnStatement ? 'return ' : ''
        const continuation = x._zod.def.valueType
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
    case tagged('tuple')(x): {
      if (!tagged('tuple', input)) {
        return Invariant.IllegalState(
          'deepClone',
          'expected input to be a tuple schema',
          input
        )
      }
      return function deepCloneTuple(_, NEXT_PATH, IX) {
        const index = { ...IX, needsReturnStatement: false, isProperty: false } satisfies Scope
        const RETURN = IX.needsReturnStatement ? 'return ' : ''
        const ITEMS = x._zod.def.items.map((continuation, I) => continuation([], [...NEXT_PATH, I], index))
        const TYPE_ASSERTION = IX.stripTypes === true ? '' : !input._zod.def.rest ? '' : ` as Array<${toType(input._zod.def.rest)}>`
        const OPEN = TYPE_ASSERTION === '' ? '' : '('
        const CLOSE = TYPE_ASSERTION === '' ? '' : ')'
        const MAPPED = x._zod.def.rest !== undefined && isDeepPrimitive(input._zod.def.rest)
          ? ''
          : `.map((value) => (${x._zod.def.rest?.([], ['value'], index)}))`
        const REST = !x._zod.def.rest ? '' : ''
          + (x._zod.def.items.length === 0 ? '' : ', ')
          + '...'
          + OPEN
          + joinPath(NEXT_PATH, IX.isOptional)
          + '.slice('
          + x._zod.def.items.length
          + ')'
          + TYPE_ASSERTION
          + CLOSE
          + MAPPED
        return `${RETURN}[${ITEMS.join(', ')}${REST}]`
      }
    }
    case tagged('object')(x): {
      if (!tagged('object', input))
        return Invariant.IllegalState(
          'deepClone',
          'expected input to be an object',
          input
        )
      return function deepCloneObject(PREV_PATH, NEXT_PATH, IX) {
        const OPEN = IX.needsReturnStatement ? 'return (' : null
        const CLOSE = IX.needsReturnStatement ? ')' : null
        // TODO: catchall
        const CATCHALL = x._zod.def.catchall
        return [
          OPEN,
          `{`,
          Object_entries(x._zod.def.shape).map(
            ([k, continuation]) => {
              const VALUE = continuation(
                [...PREV_PATH, k],
                [...NEXT_PATH, k],
                { ...IX, needsReturnStatement: false, isProperty: true }
              )
              if (isDefinedOptional(input._zod.def.shape[k])) {
                if (isDeepPrimitive(input._zod.def.shape[k]._zod.def.innerType)) {
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
    case tagged('intersection')(x): {
      if (!tagged('intersection', input)) {
        return Invariant.IllegalState(
          'deepClone',
          'expected input to be an intersection schema',
          input
        )
      }
      return function deepCloneIntersection(PREV_PATH, NEXT_PATH, IX) {
        const RETURN = IX.needsReturnStatement ? 'return ' : ''
        const index = { ...IX, needsReturnStatement: false }
        if (isPrimitiveMember(input._zod.def.left) && isPrimitiveMember(input._zod.def.right)) {
          return assign(PREV_PATH, NEXT_PATH, IX)
        } else if (tagged('object', input._zod.def.left) && tagged('object', input._zod.def.right)) {
          return ''
            + RETURN
            + '{'
            + '...'
            + x._zod.def.left(PREV_PATH, NEXT_PATH, index)
            + ','
            + '...'
            + x._zod.def.right(PREV_PATH, NEXT_PATH, index)
            + '}'
        } else {
          return Invariant.IllegalState(
            'deepClone',
            'expected intersection members to be primitives, or all objects',
            { left: x._zod.def.left, right: x._zod.def.right },
          )
        }
      }
    }
    case tagged('optional')(x): {
      if (!tagged('optional', input)) {
        return Invariant.IllegalState(
          'deepClone',
          'expected input to be an optional schema',
          input
        )
      }
      return function deepCloneOptional(PREV_PATH, NEXT_PATH, IX) {
        const index = { ...IX, needsReturnStatement: false } satisfies Scope
        const IDENT = joinPath(NEXT_PATH, false)
        const RETURN = IX.needsReturnStatement ? 'return ' : ''
        if (IX.isProperty) return x._zod.def.innerType(PREV_PATH, NEXT_PATH, index)
        else if (isDeepPrimitive(input._zod.def.innerType)) return `${RETURN}${IDENT}`
        else return `${RETURN}${IDENT} === undefined ? ${IDENT} : ${x._zod.def.innerType(PREV_PATH, NEXT_PATH, index)}`
      }
    }
    case tagged('nullable')(x): {
      if (!tagged('nullable', input)) {
        return Invariant.IllegalState(
          'deepClone',
          'expected input to be a nullable schema',
          input
        )
      }
      return function deepCloneNullable(PREV_PATH, NEXT_PATH, IX) {
        const index = { ...IX, needsReturnStatement: false } satisfies Scope
        const IDENT = joinPath(NEXT_PATH, false)
        const RETURN = IX.needsReturnStatement ? 'return ' : ''
        if (isPrimitive(input._zod.def.innerType)) return `${RETURN}${IDENT}`
        else return `${RETURN}${IDENT} === null ? ${IDENT} : ${x._zod.def.innerType(PREV_PATH, NEXT_PATH, index)}`
      }
    }
    case tagged('set')(x): {
      if (!tagged('set', input)) {
        return Invariant.IllegalState(
          'deepClone',
          'expected input to be a nullable schema',
          input
        )
      }
      return function deepCloneSet(_, NEXT_PATH, IX) {
        const RETURN = IX.needsReturnStatement ? 'return ' : ''
        const NS = IX.useGlobalThis ? 'globalThis.' : ''
        const IDENT = joinPath(NEXT_PATH, false)
        const index = { ...IX, needsReturnStatement: false, isProperty: false } satisfies Scope
        if (isDeepPrimitive(input._zod.def.valueType))
          return `${RETURN}new ${NS}Set(${IDENT})`
        else
          return ''
            + RETURN
            + `new ${NS}Set(${NS}Array.from(${IDENT}).map((value) => (${x._zod.def.valueType([], ['value'], index)})))`
      }
    }
    case tagged('map')(x): {
      if (!tagged('map', input)) {
        return Invariant.IllegalState(
          'deepClone',
          'expected input to be a nullable schema',
          input
        )
      }
      return function deepCloneMap(_, NEXT_PATH, IX) {
        const RETURN = IX.needsReturnStatement ? 'return ' : ''
        const NS = IX.useGlobalThis ? 'globalThis.' : ''
        const IDENT = joinPath(NEXT_PATH, false)
        const index = { ...IX, needsReturnStatement: false, isProperty: false } satisfies Scope
        const KEY = x._zod.def.keyType([], ['key'], index)
        const VALUE = x._zod.def.valueType([], ['value'], index)
        if (isDeepPrimitive(input._zod.def.keyType) && isDeepPrimitive(input._zod.def.valueType)) {
          return `${RETURN}new ${NS}Map(${IDENT})`
        } else {
          return `${RETURN}new ${NS}Map([...${IDENT}].map(([key, value]) => ([${KEY}, ${VALUE}])))`
        }
      }
    }
    case isUnsupported(x): return Invariant.Unimplemented(x._zod.def.type, 'zx.deepClone')
  }
})

export declare namespace deepClone {
  type Options = toType.Options & {
    /**
     * Configure the name of the generated deepClone function
     * @default "deepClone"
     */
    functionName?: string
    /**
     * Whether to access global identifiers like `Date` from the `globalThis` namespace
     * @default false
     */
    useGlobalThis?: boolean
    /**
     * Configure the name of the generated deepClone function
     * @default "deepClone"
     */
    /**
     * Whether to remove TypeScript type annotations from the generated output
     * @default false
     */
    stripTypes?: boolean
  }
}

deepClone.writeable = deepClone_writeable
deepClone.unsupported = deepClone_unsupported

/**
 * ## {@link deepClone `zx.deepClone`}
 *
 * Derive a _"deep clone"_ function from a zod schema (v4, classic).
 *
 * The generated cloning function is significantly faster than JavaScript's built-in
 * {@link structuredClone `structuredClone`}:
 *
 * - __~3x__ faster with shallow schemas
 * - __~10x__ faster with large schemas
 *
 * It's even faster when compared with Lodash's `deepCloneDeep`:
 *
 * - __~9x__ faster with shallow schemas
 * - __~25x__ faster with large schemas
 *
 * This is possible because the cloning function knows the shape of your data ahead
 * of time, and will do the minimum amount of work necessary to create a new copy
 * of your data.
 *
 * Note that the deep clone function generated by {@link deepClone `zx.deepClone`}
 * **assumes that both values have already been validated**. Passing
 * invalid data to the deepClone function will result in undefined behavior.
 *
 * Note that {@link deepClone `zx.deepClone`} works in any environment that
 * supports defining functions using the `Function` constructor. If your
 * environment does not support the `Function` constructor, use
 * {@link deepClone_writeable `zx.deepClone_writeable`}.
 *
 * See also:
 * - {@link deepClone_writeable `zx.deepClone.writeable`}
 *
 * @example
 * import { assert } from 'vitest'
 * import { z } from 'zod'
 * import { zx } from '@traversable/zod'
 *
 * const Address = z.object({
 *   street1: z.string(),
 *   street2: z.optional(z.string()),
 *   city: z.string(),
 * })
 *
 * const deepClone = zx.deepClone(Address)
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

export function deepClone<T extends z.core.$ZodType>(type: T): (deepCloneMe: z.infer<T>) => z.infer<T>
export function deepClone(type: z.core.$ZodType) {
  const $ = defaultIndex({ stripTypes: true })
  const { unions, schema } = extractUnions(type)
  const predicates = getPredicates(unions, $.stripTypes)
  const compiled = fold(schema as F.Z.Hole<Builder>)(['prev'], ['prev'], $)
  const BODY = compiled.length === 0 ? null : compiled
  return globalThis.Function('prev', [
    ...predicates,
    BODY,
  ].join('\n'))
}

/**
 * ## {@link deepClone_writeable `zx.deepClone.writeable`}
 *
 * Derive a "writeable" (stringified) _"deep clone"_ function
 * from a zod schema (v4, classic).
 *
 * The generated cloning function is significantly faster than JavaScript's built-in
 * {@link structuredClone `structuredClone`}:
 *
 * - __~3x__ faster with shallow schemas
 * - __~10x__ faster with large schemas
 *
 * It's even faster when compared with Lodash's `deepCloneDeep`:
 *
 * - __~9x__ faster with shallow schemas
 * - __~25x__ faster with large schemas
 *
 * This is possible because the cloning function knows the shape of your data ahead
 * of time, and will do the minimum amount of work necessary to create a new copy
 * of your data.
 *
 * Note that the deep clone function generated by
 * {@link deepClone_writeable `zx.deepClone.writeable`}
 * **assumes that both values have already been validated**. Passing
 * invalid data to the deepClone function will result in undefined behavior.
 * You don't have to worry about this as long as you
 *
 * {@link deepClone_writeable `zx.deepClone.writeable`} accepts an optional
 * configuration object as its second argument; documentation for those
 * options are available via hover on autocompletion.
 *
 * See also:
 * - {@link deepClone `zx.deepClone`}
 *
 * @example
 * import { z } from 'zod'
 * import { zx } from '@traversable/zod'
 *
 * const deepClone = zx.deepClone.writeable(
 *   z.object({
 *     street1: z.string(),
 *     street2: z.optional(z.string()),
 *     city: z.string(),
 *   }), { typeName: 'Address' }
 * )
 *
 * console.log(deepClone)
 * // =>
 * // type Address = { street1: string; street2?: string; city: string; }
 * // function deepClone(prev: Address) {
 * //   return {
 * //     street1: prev.street1,
 * //     ...prev.street2 !== undefined && { street2: prev.street2 },
 * //     city: prev.city
 * //   }
 * // }
 */

function deepClone_writeable<T extends z.core.$ZodType>(type: T, options?: deepClone.Options): string {
  const $ = defaultIndex(options)
  const FUNCTION_NAME = options?.functionName ?? 'deepClone'
  const { unions, schema } = extractUnions(type)
  const predicates = getPredicates(unions, $.stripTypes)
  const compiled = fold(schema as F.Z.Hole<Builder>)(['prev'], ['prev'], $)
  const inputType = toType(schema as z.core.$ZodType, options)
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
