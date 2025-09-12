import { Json } from '@traversable/json'
import {
  Equal,
  ident,
  joinPath,
  Object_keys,
  stringifyLiteral,
  Object_entries,
} from '@traversable/registry'
import type { Discriminated } from '@traversable/json-schema-types'
import {
  check,
  JsonSchema,
  toType,
  areAllObjects,
  getTags,
  deepEqualInlinePrimitiveCheck as inlinePrimitiveCheck,
  deepEqualIsPrimitive as isPrimitive,
  deepEqualSchemaOrdering as schemaOrdering,
} from '@traversable/json-schema-types'

export interface Scope extends JsonSchema.Index {
  bindings: Map<string, string>
  useGlobalThis: deepEqual.Options['useGlobalThis']
}

export type Path = (string | number)[]

export type Builder = (left: Path, right: Path, index: Scope) => string

const defaultIndex = () => ({
  ...JsonSchema.defaultIndex,
  useGlobalThis: false,
  bindings: new Map(),
}) satisfies Scope

const deepEqual_unfuzzable = [
  'never',
  'unknown',
] as const

function isCompositeType(x: unknown) {
  return JsonSchema.isObject(x)
    || JsonSchema.isRecord(x)
    || JsonSchema.isTuple(x)
    || JsonSchema.isArray(x)
}

function requiresObjectIs(x: unknown): boolean {
  return JsonSchema.isNever(x)
    || JsonSchema.isInteger(x)
    || JsonSchema.isNumber(x)
    || JsonSchema.isEnum(x)
    || JsonSchema.isAnyOf(x) && x.anyOf.some(requiresObjectIs)
    || JsonSchema.isOneOf(x) && x.oneOf.some(requiresObjectIs)
    || JsonSchema.isUnknown(x)
}

/**
 * Specialization of
 * [`TC39: SameValueZero`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevaluezero)
 * that operates on numbers
 */
function SameNumberOrFail(l: (string | number)[], r: (string | number)[], ix: JsonSchema.Index) {
  const X = joinPath(l, ix.isOptional)
  const Y = joinPath(r, ix.isOptional)
  return `if (${X} !== ${Y} && (${X} === ${X} || ${Y} === ${Y})) return false;`
}

/**
 * As specified by
 * [`TC39: SameValue`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevalue)
 */
function SameValueOrFail(l: (string | number)[], r: (string | number)[], ix: JsonSchema.Index) {
  const X = joinPath(l, ix.isOptional)
  const Y = joinPath(r, ix.isOptional)
  return `if (!Object.is(${X}, ${Y})) return false;`
}

/**
 * As specified by
 * [`TC39: IsStrictlyEqual`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isstrictlyequal)
 */
function StrictlyEqualOrFail(l: (string | number)[], r: (string | number)[], ix: JsonSchema.Index) {
  const X = joinPath(l, ix.isOptional)
  const Y = joinPath(r, ix.isOptional)
  return `if (${X} !== ${Y}) return false;`
}

function enumEquals(x: JsonSchema.Enum): Builder {
  return function continueEnumEquals(LEFT, RIGHT, IX) {
    return (
      x.enum.every((v) => typeof v === 'number') ? SameNumberOrFail(LEFT, RIGHT, IX)
        : x.enum.some((v) => typeof v === 'number') ? SameValueOrFail(LEFT, RIGHT, IX)
          : StrictlyEqualOrFail(LEFT, RIGHT, IX)
    )
  }
}

function arrayEquals(x: JsonSchema.Array<Builder>): Builder {
  return function continueArrayEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
    const LEFT_ITEM_IDENT = `${ident(LEFT, IX.bindings)}_item`
    const RIGHT_ITEM_IDENT = `${ident(RIGHT, IX.bindings)}_item`
    const LENGTH = ident('length', IX.bindings)
    const DOT = IX.isOptional ? '?.' : '.'
    return [
      `const ${LENGTH} = ${LEFT}${DOT}length;`,
      `if (${LENGTH} !== ${RIGHT}${DOT}length) return false`,
      `for (let ix = ${LENGTH}; ix-- !== 0;) {`,
      `const ${LEFT_ITEM_IDENT} = ${LEFT}[ix];`,
      `const ${RIGHT_ITEM_IDENT} = ${RIGHT}[ix];`,
      x.items([LEFT_ITEM_IDENT], [RIGHT_ITEM_IDENT], IX),
      `}`,
    ].join('\n')
  }
}

function recordEquals(x: JsonSchema.Record<Builder>): Builder {
  return function continueRecordEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LENGTH = ident('length', IX.bindings)
    const KEY_IDENT = ident('key', IX.bindings)
    const LEFT = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
    const LEFT_IDENT = ident(LEFT, IX.bindings)
    const RIGHT_IDENT = ident(RIGHT, IX.bindings)
    const LEFT_KEYS_IDENT = `${LEFT_IDENT}_keys`
    const RIGHT_KEYS_IDENT = `${RIGHT_IDENT}_keys`
    const LEFT_VALUE_IDENT = ident(`${LEFT_IDENT}[k]`, IX.bindings)
    const RIGHT_VALUE_IDENT = ident(`${RIGHT_IDENT}[k]`, IX.bindings)
    const PATTERN_PROPERTIES = !x.patternProperties ? null
      : Object_entries(x.patternProperties).map(([k, continuation]) => [
        `if(/${k.length === 0 ? '^$' : k}/.test(${KEY_IDENT})) {`,
        continuation([LEFT_VALUE_IDENT], [RIGHT_VALUE_IDENT], { ...IX /* , isOptional: true */ }),
        '}',
      ].join('\n')).join('\n')

    const FOR_LOOP = [
      `for (let ix = 0; ix < ${LENGTH}; ix++) {`,
      `const ${KEY_IDENT} = ${LEFT_KEYS_IDENT}[ix];`,
      `const ${LEFT_VALUE_IDENT} = ${LEFT}[${KEY_IDENT}];`,
      `const ${RIGHT_VALUE_IDENT} = ${RIGHT}[${KEY_IDENT}];`,
      !x.patternProperties ? null : PATTERN_PROPERTIES,
      !x.additionalProperties ? null : x.additionalProperties([LEFT_VALUE_IDENT], [RIGHT_VALUE_IDENT], IX),
      `}`,
    ].filter((_) => _ !== null).join('\n')

    return [
      `const ${LEFT_KEYS_IDENT} = Object.keys(${LEFT});`,
      `const ${RIGHT_KEYS_IDENT} = Object.keys(${RIGHT});`,
      `const ${LENGTH} = ${LEFT_KEYS_IDENT}.length;`,
      `if (${LENGTH} !== ${RIGHT_KEYS_IDENT}.length) return false;`,
      FOR_LOOP,
    ].filter((_) => _ !== null).join('\n')
  }
}

function anyOfEquals(
  x: JsonSchema.AnyOf<Builder>,
  input: JsonSchema.AnyOf<JsonSchema>
): Builder {
  if (x.anyOf.length === 0) {
    return () => 'false'
  } else if (x.anyOf.length === 1) {
    return x.anyOf[0]
  } else {
    if (!areAllObjects(input.anyOf)) {
      return nonDisjunctiveAnyOfEquals(x, input)
    } else {
      const withTags = getTags(input.anyOf)
      return withTags === null
        ? nonDisjunctiveAnyOfEquals(x, input)
        : disjunctiveAnyOfEquals(x, withTags)
    }
  }
}

function oneOfEquals(
  x: JsonSchema.OneOf<Builder>,
  input: JsonSchema.OneOf<JsonSchema>
): Builder {
  if (x.oneOf.length === 0) {
    return () => 'false'
  } else if (x.oneOf.length === 1) {
    return x.oneOf[0]
  } else {
    if (!areAllObjects(input.oneOf)) {
      return nonDisjunctiveOneOfEquals(x, input)
    } else {
      const withTags = getTags(input.oneOf)
      return withTags === null
        ? nonDisjunctiveOneOfEquals(x, input)
        : disjunctiveOneOfEquals(x, withTags)
    }
  }
}

function nonDisjunctiveAnyOfEquals(
  x: JsonSchema.AnyOf<Builder>,
  input: JsonSchema.AnyOf<JsonSchema>
): Builder {
  return function continueAnyOfEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
    const SATISFIED = ident('satisfied', IX.bindings)
    const CHECKS = input.anyOf
      .map((option, i) => [option, i] satisfies [any, any])
      .toSorted(schemaOrdering).map(([option, I]) => {
        const continuation = x.anyOf[I]
        if (isPrimitive(option)) {
          return [
            `if (${inlinePrimitiveCheck(
              option,
              { path: LEFT_PATH, ident: LEFT },
              { path: RIGHT_PATH, ident: RIGHT },
              IX.useGlobalThis
            )}) {`,
            continuation([LEFT], [RIGHT], IX),
            `${SATISFIED} = true;`,
            `}`,
          ].join('\n')

        } else {
          const FUNCTION_NAME = ident('check', IX.bindings)
          return [
            check.writeable(option, { functionName: FUNCTION_NAME, stripTypes: true }),
            `if (${FUNCTION_NAME}(${LEFT}) && ${FUNCTION_NAME}(${RIGHT})) {`,
            continuation([LEFT], [RIGHT], IX),
            `${SATISFIED} = true;`,
            `}`
          ].join('\n')
        }
      })
    return [
      `let ${SATISFIED} = false;`,
      ...CHECKS,
      `if (!${SATISFIED}) return false;`,
    ].join('\n')
  }
}

function nonDisjunctiveOneOfEquals(
  x: JsonSchema.OneOf<Builder>,
  input: JsonSchema.OneOf<JsonSchema>
): Builder {
  return function continueOneOfEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
    const SATISFIED = ident('satisfied', IX.bindings)
    const CHECKS = input.oneOf
      .map((option, i) => [option, i] satisfies [any, any])
      .toSorted(schemaOrdering).map(([option, I]) => {
        const continuation = x.oneOf[I]
        if (isPrimitive(option)) {
          return [
            `if (${inlinePrimitiveCheck(
              option,
              { path: LEFT_PATH, ident: LEFT },
              { path: RIGHT_PATH, ident: RIGHT },
              IX.useGlobalThis
            )}) {`,
            continuation([LEFT], [RIGHT], IX),
            `${SATISFIED} = true;`,
            `}`,
          ].join('\n')

        } else {
          const FUNCTION_NAME = ident('check', IX.bindings)
          return [
            check.writeable(option, { functionName: FUNCTION_NAME, stripTypes: true }),
            `if (${FUNCTION_NAME}(${LEFT}) && ${FUNCTION_NAME}(${RIGHT})) {`,
            continuation([LEFT], [RIGHT], IX),
            `${SATISFIED} = true;`,
            `}`
          ].join('\n')
        }
      })
    return [
      `let ${SATISFIED} = false;`,
      ...CHECKS,
      `if (!${SATISFIED}) return false;`,
    ].join('\n')
  }
}


function disjunctiveAnyOfEquals(
  x: JsonSchema.AnyOf<Builder>,
  [discriminant, TAGGED]: Discriminated
): Builder {
  return function continueDisjunctiveAnyOfEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, false)
    const RIGHT = joinPath(RIGHT_PATH, false)
    const SATISFIED = ident('satisfied', IX.bindings)
    return [
      `let ${SATISFIED} = false;`,
      ...TAGGED.map(({ tag }, I) => {
        const TAG = stringifyLiteral(tag)
        const continuation = x.anyOf[I]
        const LEFT_ACCESSOR = joinPath([LEFT, discriminant], IX.isOptional)
        return [
          `if (${LEFT_ACCESSOR} === ${TAG}) {`,
          continuation([LEFT], [RIGHT], IX),
          `${SATISFIED} = true;`,
          `}`,
        ].join('\n')
      }),
      `if (!${SATISFIED}) return false;`,
    ].join('\n')
  }
}

function disjunctiveOneOfEquals(
  x: JsonSchema.OneOf<Builder>,
  [discriminant, TAGGED]: Discriminated
): Builder {
  return function continueDisjunctiveOneOfEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, false)
    const RIGHT = joinPath(RIGHT_PATH, false)
    const SATISFIED = ident('satisfied', IX.bindings)
    return [
      `let ${SATISFIED} = false;`,
      ...TAGGED.map(({ tag }, I) => {
        const TAG = stringifyLiteral(tag)
        const continuation = x.oneOf[I]
        const LEFT_ACCESSOR = joinPath([LEFT, discriminant], IX.isOptional)
        return [
          `if (${LEFT_ACCESSOR} === ${TAG}) {`,
          continuation([LEFT], [RIGHT], IX),
          `${SATISFIED} = true;`,
          `}`,
        ].join('\n')
      }),
      `if (!${SATISFIED}) return false;`,
    ].join('\n')
  }
}


function allOfEquals(x: JsonSchema.AllOf<Builder>): Builder {
  return function continueAllOfEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
    return x.allOf.map((continuation) => continuation([LEFT], [RIGHT], IX)).join('\n')
  }
}

function tupleEquals(
  x: JsonSchema.Tuple<Builder>,
  input: JsonSchema.Tuple<JsonSchema>
): Builder {
  return function continueTupleEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, false)   // `false` because `*_PATH` already takes optionality into account
    const RIGHT = joinPath(RIGHT_PATH, false) // `false` because `*_PATH` already takes optionality into account
    // if we got `{ prefixItems: [] }`, just check that the lengths are the same
    if (x.prefixItems.length === 0) return `if (${LEFT}.length !== ${RIGHT}.length) return false`
    const LENGTH = ident('length', IX.bindings)
    const LEFT_ITEM_IDENT = ident(`${LEFT}_item`, IX.bindings)
    const RIGHT_ITEM_IDENT = ident(`${RIGHT}_item`, IX.bindings)
    const LENGTH_CHECK = !x.items ? null : [
      `const ${LENGTH} = ${LEFT}.length;`,
      `if (${LENGTH} !== ${RIGHT}.length) return false;`,
    ].join('\n')
    const FOR_LOOP = !x.items ? null : [
      `if (${LENGTH} > ${x.prefixItems.length}) {`,
      `for (let ix = ${LENGTH}; ix-- !== ${x.prefixItems.length};) {`,
      `const ${LEFT_ITEM_IDENT} = ${LEFT}[ix];`,
      `const ${RIGHT_ITEM_IDENT} = ${RIGHT}[ix];`,
      x.items?.([LEFT_ITEM_IDENT], [RIGHT_ITEM_IDENT], IX),
      `}`,
      `}`,
    ].join('\n')
    return [
      LENGTH_CHECK,
      ...x.prefixItems.map((continuation, i) => {
        if (!isCompositeType(input.prefixItems[i])) {
          return continuation([LEFT, i], [RIGHT, i], IX)
        } else {
          const LEFT_ACCESSOR = joinPath([LEFT, i], IX.isOptional)
          const RIGHT_ACCESSOR = joinPath([RIGHT, i], IX.isOptional)
          return [
            `if (${LEFT_ACCESSOR} !== ${RIGHT_ACCESSOR}) {`,
            continuation([LEFT, i], [RIGHT, i], IX),
            `}`,
          ].join('\n')
        }
      }),
      FOR_LOOP,
    ].filter((_) => _ !== null).join('\n')
  }
}

function optionalEquals(
  continuation: Builder,
  input: JsonSchema
): Builder {
  return function continueOptionalEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
    return JsonSchema.isNullary(input)
      ? [
        `if ((${LEFT} === undefined || ${RIGHT} === undefined) && ${LEFT} !== ${RIGHT}) return false`,
        continuation(LEFT_PATH, RIGHT_PATH, IX),
      ].join('\n')
      : [
        `if ((${LEFT} === undefined || ${RIGHT} === undefined) && ${LEFT} !== ${RIGHT}) return false`,
        `if (${LEFT} !== ${RIGHT}) {`,
        continuation(LEFT_PATH, RIGHT_PATH, IX),
        `}`,
      ].join('\n')
  }
}

function objectEquals(x: JsonSchema.Object<Builder>, input: JsonSchema.Object<JsonSchema>): Builder {
  return function continueObjectEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, false)   // `false` because `*_PATH` already takes optionality into account
    const RIGHT = joinPath(RIGHT_PATH, false) // `false` because `*_PATH` already takes optionality into account
    const keys = Object_keys(x.properties)
    // if we got `{ type: 'object', properties: {} }`, just check that the number of keys are the same
    if (keys.length === 0) return `if (Object.keys(${LEFT}).length !== Object.keys(${RIGHT}).length) return false`
    return [
      ...Object.entries(x.properties).map(([key, continuation]) => {
        const isOptional = !x.required || !x.required.includes(key)
        const CHILD = isOptional
          ? optionalEquals(continuation, input.properties[key])(
            [LEFT, key],
            [RIGHT, key],
            { ...IX, isOptional }
          )
          : continuation(
            [LEFT, key],
            [RIGHT, key],
            { ...IX, isOptional }
          )
        if (!isCompositeType(input.properties[key])) {
          return CHILD
        } else {
          const LEFT_ACCESSOR = joinPath([LEFT, key], isOptional)
          const RIGHT_ACCESSOR = joinPath([RIGHT, key], isOptional)
          return [
            `if (${LEFT_ACCESSOR} !== ${RIGHT_ACCESSOR}) {`,
            CHILD,
            `}`,
          ].join('\n')
        }
      }),
    ].filter((_) => _ !== null).join('\n')
  }
}

const foldJson = Json.fold<Builder>((x, _, input) => {
  switch (true) {
    default: return (void (x satisfies never), SameValueOrFail)
    case x == null: return function continueJsonNullEquals(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) }
    case typeof x === 'number': return function continueJsonNumberEquals(l, r, ix) { return SameNumberOrFail(l, r, ix) }
    case typeof x === 'string': return function continueJsonStringEquals(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) }
    case typeof x === 'boolean': return function continueJsonBooleanEquals(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) }
    case Json.isArray(x): {
      if (!Json.isArray(input)) throw Error('illegal state')
      return function continueJsonArrayEquals(LEFT_PATH, RIGHT_PATH, IX): string {
        const LEFT = joinPath(LEFT_PATH, IX.isOptional)   // `false` because `*_PATH` already takes optionality into account
        const RIGHT = joinPath(RIGHT_PATH, IX.isOptional) // `false` because `*_PATH` already takes optionality into account
        const LENGTH = ident('length', IX.bindings)
        const DOT = IX.isOptional ? '?.' : '.'
        const LENGTH_CHECK = [
          `const ${LENGTH} = ${LEFT}${DOT}length;`,
          `if (${LENGTH} !== ${RIGHT}${DOT}length) return false;`,
        ].join('\n')
        return [
          LENGTH_CHECK,
          ...x.map((continuation, i) => {
            if (Json.isScalar(input[i])) {
              return continuation([LEFT, i], [RIGHT, i], IX)
            } else {
              const LEFT_CHILD_ACCESSOR = joinPath([LEFT, i], IX.isOptional)
              const RIGHT_CHILD_ACCESSOR = joinPath([RIGHT, i], IX.isOptional)
              return [
                `if (${LEFT_CHILD_ACCESSOR} !== ${RIGHT_CHILD_ACCESSOR}) {`,
                continuation([LEFT, i], [RIGHT, i], IX),
                `}`,
              ].join('\n')
            }
          }),
        ].filter((_) => _ !== null).join('\n')
      }
    }
    case Json.isObject(x): {
      if (!Json.isObject(input)) throw Error('illegal state')
      return function continueJsonObjectEquals(LEFT_PATH, RIGHT_PATH, IX): string {

        const LEFT = joinPath(LEFT_PATH, IX.isOptional)   // `false` because `*_PATH` already takes optionality into account
        const RIGHT = joinPath(RIGHT_PATH, IX.isOptional) // `false` because `*_PATH` already takes optionality into account
        const keys = Object_keys(x)
        // if we got `{ type: 'object', properties: {} }`, just check that the number of keys are the same
        if (keys.length === 0) return `if (Object.keys(${LEFT}).length !== Object.keys(${RIGHT}).length) return false`
        return [
          ...Object.entries(x).map(([key, continuation]) => {
            const CHILD = continuation([LEFT, key], [RIGHT, key], IX)
            if (Json.isScalar(input[key])) {
              return CHILD
            } else {
              const LEFT_ACCESSOR = joinPath([LEFT, key], IX.isOptional)
              const RIGHT_ACCESSOR = joinPath([RIGHT, key], IX.isOptional)
              return [
                `if (${LEFT_ACCESSOR} !== ${RIGHT_ACCESSOR}) {`,
                CHILD,
                `}`,
              ].join('\n')
            }
          }),
        ].filter((_) => _ !== null).join('\n')

      }
    }
  }
})

const fold = JsonSchema.fold<Builder>((x, _, input) => {
  switch (true) {
    default: return (void (x satisfies never), SameValueOrFail)
    case JsonSchema.isConst(x): return foldJson(x.const as Json.Unary<Builder>)
    case JsonSchema.isNever(x): return function continueNeverEquals(l, r, ix) { return SameValueOrFail(l, r, ix) }
    case JsonSchema.isNull(x): return function continueNullEquals(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) }
    case JsonSchema.isBoolean(x): return function continueBooleanEquals(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) }
    case JsonSchema.isInteger(x): return function continueIntegerEquals(l, r, ix) { return SameNumberOrFail(l, r, ix) }
    case JsonSchema.isNumber(x): return function continueNumberEquals(l, r, ix) { return SameNumberOrFail(l, r, ix) }
    case JsonSchema.isString(x): return function continueStringEquals(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) }
    case JsonSchema.isEnum(x): return enumEquals(x)
    case JsonSchema.isArray(x): return arrayEquals(x)
    case JsonSchema.isRecord(x): return recordEquals(x)
    case JsonSchema.isAllOf(x): return allOfEquals(x)
    case JsonSchema.isTuple(x): return tupleEquals(x, input as JsonSchema.Tuple<JsonSchema>)
    case JsonSchema.isAnyOf(x): return anyOfEquals(x, input as JsonSchema.AnyOf<JsonSchema>)
    case JsonSchema.isOneOf(x): return oneOfEquals(x, input as JsonSchema.OneOf<JsonSchema>)
    case JsonSchema.isObject(x): return objectEquals(x, input as JsonSchema.Object<JsonSchema>)
    case JsonSchema.isUnknown(x): return function continueUnknownEquals(l, r, ix) { return SameValueOrFail(l, r, ix) }
  }
})

export declare namespace deepEqual {
  type Options = toType.Options & {
    /**
     * Configure the name of the generated deep equal function
     * @default "deepEqual"
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

deepEqual.writeable = deepEqual_writeable
deepEqual.defaultIndex = defaultIndex
deepEqual.unfuzzable = deepEqual_unfuzzable

/**
 * ## {@link deepEqual `JsonSchema.deepEqual`}
 *
 * Derive an _"deep equal"_ function from a Json Schema spec.
 *
 * A "deep equal" function" (see also, {@link Equal `Equal`}) is similar to
 * lodash's `isEqual` function, except more performant, because
 * when the shape of the values being compared is known ahead of time,
 * we can optimize ahead of time, and only check what's necessary.
 *
 * Note that the deep equal function generated by {@link deepEqual `JsonSchema.deepEqual`}
 * **assumes that both values have already been validated**. Passing
 * unvalidated values to the function might result in undefined behavior.
 * 
 * See also:
 * - {@link deepEqual_writeable `JsonSchema.deepEqual.writeable`}
 *
 * @example
 * import { JsonSchema } from '@traversable/json-schema'
 * 
 * const deepEqual = JsonSchema.deepEqual({
 *   type: 'object',
 *   required: ['street1', 'city'],
 *   properties: {
 *     street1: { type: 'string' },
 *     street2: { type: 'string' },
 *     city: { type: 'string' },
 *   }
 * })
 * 
 * deepEqual(
 *   { street1: '221 Baker St', street2: '#B', city: 'London' },
 *   { street1: '221 Baker St', street2: '#B', city: 'London' }
 * ) // => true
 * 
 * deepEqual(
 *   { street1: '221 Baker St', street2: '#B', city: 'London' },
 *   { street1: '4 Privet Dr', city: 'Little Whinging' }
 * ) // => false
 */

export function deepEqual<const S extends JsonSchema, T = toType<S>>(schema: S): Equal<T>
export function deepEqual(schema: JsonSchema) {
  const index = defaultIndex()
  const ROOT_CHECK = requiresObjectIs(schema) ? `if (Object.is(l, r)) return true` : `if (l === r) return true`
  const BODY = fold(schema).result(['l'], ['r'], index)
  return JsonSchema.isNullary(schema)
    ? globalThis.Function('l', 'r', [
      BODY,
      'return true'
    ].join('\n'))
    : globalThis.Function('l', 'r', [
      ROOT_CHECK,
      BODY,
      'return true'
    ].join('\n'))
}

/**
 * ## {@link deepEqual_writeable `JsonSchema.deepEqual.writeable`}
 *
 * Derive a "writeable" (stringified) _"deep equal"_ function from a Json Schema spec.
 *
 * A "deep equal" function (see also, {@link Equal `Equal`}) is similar to
 * lodash's `isEqual` function, except more performant, because
 * when the shape of the values being compared is known ahead of time,
 * we can optimize ahead of time, and only check what's necessary.
 *
 * Note that the deep equal function generated by {@link deepEqual `JsonSchema.deepEqual`}
 * **assumes that both values have already been validated**. Passing
 * unvalidated values to the function might result in undefined behavior.
 * 
 * {@link deepEqual_writeable `JsonSchema.deepEqual.writeable`} accepts an optional
 * configuration object as its second argument; documentation for those
 * options are available via hover on autocompletion.
 * 
 * See also:
 * - {@link deepEqual `JsonSchema.deepEqual`}
 *
 * @example
 * import { JsonSchema } from '@traversable/json-schema'
 * 
 * const deepEqual = JsonSchema.deepEqual.writeable({
 *   type: 'object',
 *   required: ['street1', 'city'],
 *   properties: {
 *     street1: { type: 'string' },
 *     street2: { type: 'string' },
 *     city: { type: 'string' },
 *   }
 * }, { typeName: 'Address' })
 * 
 * console.log(deepEqual) 
 * // =>
 * // type Address = { street1: string; street2?: string; city: string; }
 * // function deepEqual(x: Address, y: Address) {
 * //   if (x === y) return true;
 * //   if (x.street1 !== y.street1) return false;
 * //   if (x.street2 !== y.street2) return false;
 * //   if (x.city !== y.city) return false;
 * //   return true;
 * // }
 */

function deepEqual_writeable(schema: JsonSchema, options?: deepEqual.Options): string {
  const index = { ...defaultIndex(), ...options } satisfies Scope
  const compiled = fold(schema).result(['l'], ['r'], index)
  const FUNCTION_NAME = options?.functionName ?? 'deepEqual'
  const targetType = options?.stripTypes === true ? { refs: [], result: '' } : toType(schema, options)
  const REF_TYPES = Object.values(targetType.refs).join('\n')
  const AMBIENT_TYPES = options?.stripTypes === true ? null : options?.typeName === undefined ? REF_TYPES : `${REF_TYPES}\n${targetType.result}`
  const TARGET_TYPE = options?.stripTypes ? '' : `: ${options?.typeName ?? targetType.result}`
  const ROOT_CHECK = requiresObjectIs(schema) ? `if (Object.is(l, r)) return true` : `if (l === r) return true`
  const BODY = compiled.length === 0 ? null : compiled
  return (
    JsonSchema.isNullary(schema)
      ? [
        AMBIENT_TYPES,
        `function ${FUNCTION_NAME} (l${TARGET_TYPE}, r${TARGET_TYPE}) {`,
        BODY,
        `return true;`,
        `}`,
      ]
      : [
        AMBIENT_TYPES,
        `function ${FUNCTION_NAME} (l${TARGET_TYPE}, r${TARGET_TYPE}) {`,
        ROOT_CHECK,
        BODY,
        `return true;`,
        `}`
      ]
  ).filter((_) => _ !== null).join('\n')
}
