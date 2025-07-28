import {
  joinPath,
  Object_entries,
  parseKey,
  stringifyLiteral,
  isPrimitive as isPrimitiveValue,
  has,
} from '@traversable/registry'
import { Json } from '@traversable/json'
import type { Discriminated } from '@traversable/json-schema-types'
import {
  F,
  check,
  JsonSchema,
  areAllObjects,
  getTags,
  deepCloneInlinePrimitiveCheck as inlinePrimitiveCheck,
  deepCloneIsPrimitive as isPrimitive,
  deepCloneSchemaOrdering as schemaOrdering,
  toType,
  Invariant,
} from '@traversable/json-schema-types'

export type Path = (string | number)[]
export type Builder = (prev: Path, next: Path, ix: Scope) => string

export interface Scope extends F.CompilerIndex {
  bindings: Map<string, string>
  isRoot: boolean
  isProperty: boolean
  mutateDontAssign: boolean
  useGlobalThis: deepClone.Options['useGlobalThis']
  needsReturnStatement: boolean
  stripTypes: boolean
}

export function defaultIndex(partial?: Partial<Scope>): Scope {
  return {
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
    ...partial,
  }
}

type IndexedSchema = JsonSchema & { index?: number }
interface ExtractedUnions {
  unions: IndexedSchema[]
  schema: JsonSchema
}

const isPrimitiveMember = (x: unknown) =>
  isPrimitive(x) || JsonSchema.isEnum(x) || (JsonSchema.isConst(x) && isPrimitiveValue(x.const))

const isNonPrimitiveMember = (x: unknown) => !isPrimitiveMember(x)

function getPredicates(unions: IndexedSchema[], stripTypes: boolean) {
  return unions
    .filter(isNonPrimitiveMember)
    .map(({ index, ...x }) => check.writeable(x, { stripTypes, functionName: `check_${index}`, }))
}

function extractUnions(schema: JsonSchema<JsonSchema.Fixpoint>): ExtractedUnions {
  let index = 0
  let unions = Array.of<IndexedSchema>()
  const out = F.fold<JsonSchema.Fixpoint>((x) => {
    if (!JsonSchema.isUnion(x)) {
      return x
    } else if (getTags(x.anyOf) !== null) {
      return x
    } else {
      const sorted = x.anyOf.toSorted(schemaOrdering).map(
        (union) => {
          if (isPrimitiveMember(union)) return union
          else {
            return { ...union, index: index++ }
          }
        }
      )
      if (sorted.length === 1) unions.push(sorted[0])
      else unions.push(...sorted.slice(0, -1))
      return { anyOf: sorted }
    }
  })(schema)
  return {
    unions,
    schema: out
  }
}

function isAtomic(x: JsonSchema): boolean {
  switch (true) {
    default: return false
    case JsonSchema.isNull(x):
    case JsonSchema.isBoolean(x):
    case JsonSchema.isInteger(x):
    case JsonSchema.isNumber(x):
    case JsonSchema.isString(x):
    case JsonSchema.isEnum(x):
    case JsonSchema.isNever(x): return true
    case JsonSchema.isConst(x): return isPrimitiveValue(x.const)
    case JsonSchema.isUnion(x): return x.anyOf.some(isAtomic)
  }
}


function assign(_: Path, NEXT_PATH: Path, IX: Scope) {
  return `${IX.needsReturnStatement ? 'return ' : ''}${joinPath(NEXT_PATH, IX.isOptional)}`
}

function buildConstDeepCloner(schema: JsonSchema.Const) {
  const foldJson = Json.fold<Builder>((x) => {
    switch (true) {
      default: return (void (x satisfies never), () => '')
      case Json.isScalar(x):
        return assign
      case Json.isArray(x): {
        return (PREV_PATH, NEXT_PATH, IX) => {
          const RETURN = IX.needsReturnStatement ? 'return ' : ''
          return ''
            + RETURN
            + [
              '[',
              x.map((continuation, I) => continuation(
                [...PREV_PATH, I],
                [...NEXT_PATH, I],
                { ...IX, needsReturnStatement: false },
              )
              ).join(', '),
              ']',
            ].join('\n')
        }
      }
      case Json.isObject(x): {
        return (PREV_PATH, NEXT_PATH, IX) => {
          const RETURN = IX.needsReturnStatement ? 'return ' : ''
          return ''
            + RETURN
            + [
              `{`,
              Object_entries(x).map(
                ([k, continuation]) => `${parseKey(k)}: ${continuation(
                  [...PREV_PATH, k],
                  [...NEXT_PATH, k],
                  { ...IX, needsReturnStatement: false },
                )}`
              ).join(', '),
              `}`,
            ].join('\n')
        }
      }
    }
  })
  return foldJson(schema.const as Json<Builder>)
}

const fold = F.fold<Builder>((x, _, input) => {
  switch (true) {
    default: return (void (x satisfies never), () => '')
    case JsonSchema.isConst(x): return buildConstDeepCloner(x)
    case JsonSchema.isEnum(x): return function cloneEnum(...args) { return assign(...args) }
    case JsonSchema.isNever(x): return function cloneNever(...args) { return assign(...args) }
    case JsonSchema.isNull(x): return function cloneNull(...args) { return assign(...args) }
    case JsonSchema.isBoolean(x): return function cloneBoolean(...args) { return assign(...args) }
    case JsonSchema.isInteger(x): return function cloneInteger(...args) { return assign(...args) }
    case JsonSchema.isNumber(x): return function cloneNumber(...args) { return assign(...args) }
    case JsonSchema.isString(x): return function cloneString(...args) { return assign(...args) }

    case JsonSchema.isArray(x): {
      if (!JsonSchema.isArray(input)) return Invariant.IllegalState('deepClone', 'expected input to be an array schema', input)
      return function deepCloneArray(PREV_PATH, NEXT_PATH, IX) {
        const isNullary = JsonSchema.isNullary(input.items)
        const needsReturnStatement = !isNullary
        const OPEN = IX.needsReturnStatement ? 'return ' : ''
        const OPEN_BRACKET = isNullary ? '(' : '{'
        const CLOSE_BRACKET = isNullary ? ')' : '}'
        return [
          `${OPEN}${joinPath(NEXT_PATH, IX.isOptional)}.map((value) => ${OPEN_BRACKET}`,
          `${x.items([...PREV_PATH, 'value'], ['value'], { ...IX, needsReturnStatement })}`,
          `${CLOSE_BRACKET})`,
        ].join('\n')
      }
    }

    case JsonSchema.isObject(x): {
      if (!JsonSchema.isObject(input)) return Invariant.IllegalState('deepClone', 'expected input to be an object', input)
      return function deepCloneObject(PREV_PATH, NEXT_PATH, IX) {
        const OPEN = IX.needsReturnStatement ? 'return (' : null
        const CLOSE = IX.needsReturnStatement ? ')' : null
        return [
          OPEN,
          `{`,
          Object_entries(x.properties).map(
            ([k, continuation]) => {
              const VALUE = continuation([...PREV_PATH, k], [...NEXT_PATH, k], { ...IX, needsReturnStatement: false })
              if (!input.required.includes(k))
                if (JsonSchema.isNullary(input.properties[k]))
                  return `...${joinPath([...NEXT_PATH, k], IX.isOptional)} !== undefined && { ${parseKey(k)}: ${VALUE} }`
                else
                  return `...${joinPath([...NEXT_PATH, k], IX.isOptional)} && { ${parseKey(k)}: ${VALUE} }`
              else
                return `${parseKey(k)}: ${VALUE}`
            }
          ).join(', '),
          `}`,
          CLOSE,
        ].filter((_) => _ !== null).join('\n')
      }
    }

    case JsonSchema.isRecord(x): {
      return function deepCloneRecord(PREV_PATH, NEXT_PATH, IX) {
        const index = { ...IX, needsReturnStatement: false } satisfies Scope
        const NS = IX.useGlobalThis ? 'globalThis.' : ''
        const BODY = x.additionalProperties?.([...PREV_PATH, 'value'], ['value'], { ...IX, needsReturnStatement: false }) ?? null
        const RETURN = IX.needsReturnStatement ? 'return ' : ''
        const PATTERN_PROPERTIES = !x.patternProperties ? null
          : Object_entries(x.patternProperties).map(([pattern, continuation], i, xs) => {
            const TEST = `/${pattern.length === 0 ? '^$' : pattern}/.test(key)`
            const BODY = continuation([...PREV_PATH, 'value'], ['value'], index)
            return xs.length === 1 && !x.additionalProperties ? BODY : `${TEST} ? ${BODY}`
          })
        const JOINER = x.additionalProperties && PATTERN_PROPERTIES && PATTERN_PROPERTIES.length > 0 ? ' : ' : null

        if (!x.additionalProperties && PATTERN_PROPERTIES && PATTERN_PROPERTIES.length === 0)
          return `${RETURN}{}`
        else
          return ''
            + RETURN
            + [
              `${NS}Object.entries(${joinPath(NEXT_PATH, IX.isOptional)}).reduce(`,
              `  (acc, [key, value]) => {`,
              `    acc[key] = `,
              PATTERN_PROPERTIES === null || PATTERN_PROPERTIES.length === 0 ? null : PATTERN_PROPERTIES.join(' : '),
              PATTERN_PROPERTIES && PATTERN_PROPERTIES.length === 0 ? null : JOINER,
              BODY,
              `    return acc`,
              `  },`,
              `  ${NS}Object.create(null)`,
              `)`,
            ].filter((_) => _ !== null).join('\n')
      }
    }

    case JsonSchema.isTuple(x): {
      if (!JsonSchema.isTuple(input)) return Invariant.IllegalState(
        'deepClone',
        'expected input to be a tuple schema',
        input
      )

      return function deepCloneTuple(_, NEXT_PATH, IX) {
        const index = { ...IX, needsReturnStatement: false }
        const RETURN = IX.needsReturnStatement ? 'return ' : ''
        const TYPE_ASSERTION = IX.stripTypes === true ? '' : !input.items ? '' : ` as Array<${toType(input.items)}>`
        const OPEN = TYPE_ASSERTION === '' ? '' : '('
        const CLOSE = TYPE_ASSERTION === '' ? '' : ')'
        const REST = !x.items ? null : ''
          + (x.prefixItems.length === 0 ? '' : ', ')
          + '...'
          + OPEN
          + joinPath(NEXT_PATH, IX.isOptional)
          + '.slice('
          + x.prefixItems.length
          + ')'
          + TYPE_ASSERTION
          + CLOSE
          + '.map((value) => ('
          + x.items([], ['value'], index)
          + '))'

        return ''
          + RETURN
          + [
            '[',
            x.prefixItems.map((continuation, I) => continuation([], [...NEXT_PATH, I], index)).join(', '),
            REST,
            ']',
          ].filter((_) => _ !== null).join('\n')
      }
    }

    case JsonSchema.isIntersection(x): {
      if (!JsonSchema.isIntersection(input)) {
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
        } else if (input.allOf.every(JsonSchema.isObject)) {
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

    case JsonSchema.isUnion(x): {
      if (!JsonSchema.isUnion(input)) {
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
    }

    case JsonSchema.isUnknown(x): return function cloneUnknown(...args) { return assign(...args) }
  }
})

function buildInclusiveUnionCloner(
  x: JsonSchema.Union<Builder>,
  input: JsonSchema.Union<JsonSchema>
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
              { path: PREV_PATH, ident: joinPath(NEXT_PATH, IX.isOptional) },
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
            const IDENT = joinPath(NEXT_PATH, IX.isOptional)
            return `${i === 0 ? RETURN : ' : '}${FUNCTION_NAME}(${IDENT}) ? ${continuation(PREV_PATH, NEXT_PATH, index)}`
          }
        })
        .join('\n')
    }
  }
}

function buildExclusiveUnionCloner(
  x: JsonSchema.Union<Builder>,
  [discriminant, TAGGED]: Discriminated
): Builder {
  return function cloneDisjointUnion(PREV_PATH, NEXT_PATH, IX) {
    const RETURN = IX.needsReturnStatement ? 'return ' : ''
    return ''
      + RETURN
      + TAGGED.map(({ tag }, I) => {
        const continuation = x.anyOf[I]
        const TAG = stringifyLiteral(tag)
        const PREV_ACCESSOR = joinPath([...PREV_PATH, discriminant], IX.isOptional)
        return [
          I === x.anyOf.length - 1 ? '' : `${PREV_ACCESSOR} === ${TAG} ? `,
          continuation(PREV_PATH, NEXT_PATH, { ...IX, needsReturnStatement: false }),
          I === x.anyOf.length - 1 ? '' : ' : ',
        ].join('\n')
      }).join('\n')
  }
}

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
deepClone.defaultIndex = defaultIndex

/**
 * ## {@link deepClone `JsonSchema.deepClone`}
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
 * Note that the "deep clone function" generated by {@link deepClone `JsonSchema.deepClone`}
 * **assumes that both values have already been validated**. Passing
 * invalid data to the clone function will result in undefined behavior.
 * 
 * Note that {@link deepClone `JsonSchema.deepClone`} works in any environment that 
 * supports defining functions using the `Function` constructor. If your
 * environment does not support the `Function` constructor, use 
 * {@link deepClone_writeable `JsonSchema.deepClone.writeable`}.
 * 
 * See also:
 * - {@link deepClone_writeable `JsonSchema.deepClone.writeable`}
 *
 * @example
 * import { assert } from 'vitest'
 * import { JsonSchema } from '@traversable/json-schema'
 * 
 * const deepClone = JsonSchema.deepClone({
 *   type: 'object',
 *   required: ['street1', 'city'],
 *   properties: {
 *     street1: { type: 'string' },
 *     street2: { type: 'string' },
 *     city: { type: 'string' },
 *   }
 * })
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
export function deepClone<const S extends JsonSchema, T = toType<S>>(schema: S): (cloneMe: T) => T
export function deepClone(jsonSchema: JsonSchema) {
  const $ = defaultIndex({ stripTypes: true })
  const { unions, schema } = extractUnions(jsonSchema)
  const predicates = getPredicates(unions, $.stripTypes)
  const compiled = fold(schema)(['prev'], ['prev'], $)
  const BODY = compiled.length === 0 ? null : compiled
  return globalThis.Function('prev', [
    ...predicates,
    BODY,
  ].filter((_) => _ !== null).join('\n'))
}

/**
 * ## {@link deepClone_writeable `JsonSchema.deepClone.writeable`}
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
 * {@link deepClone_writeable `JsonSchema.deepClone.writeable`}
 * **assumes that both values have already been validated**. Passing
 * invalid data to the clone function will result in undefined behavior.
 * You don't have to worry about this as long as you
 * 
 * {@link deepClone_writeable `JsonSchema.deepClone.writeable`} accepts an optional
 * configuration object as its second argument; documentation for those
 * options are available via hover on autocompletion.
 * 
 * See also:
 * - {@link deepClone `JsonSchema.deepClone`}
 *
 * @example
* import { JsonSchema } from '@traversable/json-schema'
* 
* const deepClone = JsonSchema.deepClone.writeable({
*   type: 'object',
*   required: ['street1', 'city'],
*   properties: {
*     street1: { type: 'string' },
*     street2: { type: 'string' },
*     city: { type: 'string' },
*   }
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

function deepClone_writeable(jsonSchema: JsonSchema, options?: deepClone.Options): string {
  const $ = defaultIndex(options)
  const FUNCTION_NAME = options?.functionName ?? 'deepClone'
  const { unions, schema } = extractUnions(jsonSchema)
  const predicates = getPredicates(unions, $.stripTypes)
  const compiled = fold(schema)(['prev'], ['prev'], $)
  const inputType = toType(schema, options)
  const TYPE = $.stripTypes ? '' : `: ${options?.typeName ?? inputType}`
  const BODY = compiled.length === 0 ? null : compiled
  return [
    $.stripTypes ? null : options?.typeName === undefined ? null : inputType,
    `function ${FUNCTION_NAME} (prev${TYPE}) {`,
    ...predicates,
    BODY,
    `}`,
  ].filter((_) => _ !== null).join('\n')
}
