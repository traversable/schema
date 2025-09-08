import * as T from '@sinclair/typebox'
import { Equal, ident, joinPath, Object_is, Object_values } from '@traversable/registry'
import type { Type } from '@traversable/typebox-types'
import { F, Invariant, check, toType } from '@traversable/typebox-types'

export type Path = (string | number)[]

export type Builder = (left: Path, right: Path, index: Scope) => string

export interface Scope extends F.Index {
  identifiers: Map<string, string>
  useGlobalThis: boolean
}

const deepEqual_unfuzzable = [
  'never',
  'unknown',
  'any',
] as const

export function defaultIndex(): Scope {
  return {
    ...F.defaultIndex,
    identifiers: new Map(),
    useGlobalThis: false,
  }
}

function isCompositeTypeName(x?: string) {
  if (x === 'object') return true
  else if (x === 'array') return true
  else if (x === 'record') return true
  else if (x === 'tuple') return true
  else return false
}

function requiresObjectIs(x: unknown): boolean {
  return F.tagged('integer')(x)
    || F.tagged('number')(x)
    || F.tagged('bigInt')(x)
    || F.tagged('literal')(x)
    || (F.tagged('anyOf')(x) && x.anyOf.some(requiresObjectIs))
}

/**
 * Specialization of
 * [`TC39: SameValueZero`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevaluezero)
 * that operates on numbers
 */
function SameNumberOrFail(l: (string | number)[], r: (string | number)[], ix: F.Index) {
  const X = joinPath(l, ix.isOptional)
  const Y = joinPath(r, ix.isOptional)
  return `if (${X} !== ${Y} && (${X} === ${X} || ${Y} === ${Y})) return false`
}

/**
 * Specified by
 * [`TC39: SameValue`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevalue)
 */
function SameValueOrFail(l: (string | number)[], r: (string | number)[], ix: F.Index) {
  const X = joinPath(l, ix.isOptional)
  const Y = joinPath(r, ix.isOptional)
  return `if (!Object.is(${X}, ${Y})) return false`
}

/**
 * Specified by
 * [`TC39: IsStrictlyEqual`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isstrictlyequal)
 */
function StictlyEqualOrFail(l: (string | number)[], r: (string | number)[], ix: F.Index) {
  const X = joinPath(l, ix.isOptional)
  const Y = joinPath(r, ix.isOptional)
  return `if (${X} !== ${Y}) return false`
}

export const writeableDefaults = {
  [F.TypeName.never]: function neverDeepEqual(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [F.TypeName.any]: function anyDeepEqual(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [F.TypeName.unknown]: function unknownDeepEqual(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [F.TypeName.void]: function voidDeepEqual(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [F.TypeName.undefined]: function undefinedDeepEqual(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [F.TypeName.null]: function nullDeepEqual(l, r, ix) { return StictlyEqualOrFail(l, r, ix) },
  [F.TypeName.symbol]: function symbolDeepEqual(l, r, ix) { return StictlyEqualOrFail(l, r, ix) },
  [F.TypeName.boolean]: function booleanDeepEqual(l, r, ix) { return StictlyEqualOrFail(l, r, ix) },
  [F.TypeName.integer]: function integerDeepEqual(l, r, ix) { return SameNumberOrFail(l, r, ix) },
  [F.TypeName.bigInt]: function bigIntDeepEqual(l, r, ix) { return SameNumberOrFail(l, r, ix) },
  [F.TypeName.number]: function numberDeepEqual(l, r, ix) { return SameNumberOrFail(l, r, ix) },
  [F.TypeName.string]: function stringDeepEqual(l, r, ix) { return StictlyEqualOrFail(l, r, ix) },
  [F.TypeName.literal]: function literalDeepEqual(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [F.TypeName.date]: function dateDeepEqual(l, r, ix) {
    const NS = ix.useGlobalThis ? 'globalThis.' : ''
    return `if (!${NS}Object.is(${joinPath(l, ix.isOptional)}?.getTime(), ${joinPath(r, ix.isOptional)}?.getTime())) return false`
  },
} as const satisfies Record<string, Builder>

function optional(
  x: F.Type.Optional<Builder>,
  ix: F.Index,
  input: Partial<T.TSchema>
): Builder {
  if (!F.tagged('optional')(input)) {
    return Invariant.IllegalState('deepEqual', 'expected input to be a union schema', input)
  } else return function optionalDeepEqual(LEFT_PATH, RIGHT_PATH, IX) {
    return F.isNullary(input.schema)
      ? x.schema(LEFT_PATH, RIGHT_PATH, IX)
      : [
        `if (${joinPath(LEFT_PATH, ix.isOptional)} !== ${joinPath(RIGHT_PATH, ix.isOptional)}) {`,
        x.schema(LEFT_PATH, RIGHT_PATH, IX),
        `}`,
      ].join('\n')
  }
}

function array(
  x: F.Type.Array<Builder>,
  ix: F.Index
): Builder {
  return function arrayDeepEqual(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, ix.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, ix.isOptional)
    const LEFT_ITEM_IDENT = `${ident(LEFT, IX.identifiers)}_item`
    const RIGHT_ITEM_IDENT = `${ident(RIGHT, IX.identifiers)}_item`
    const LENGTH = ident('length', IX.identifiers)
    const DOT = IX.isOptional ? '?.' : '.'
    return [
      `const ${LENGTH} = ${LEFT}${DOT}length`,
      `if (${LENGTH} !== ${RIGHT}${DOT}length) return false`,
      `for (let ix = ${LENGTH}; ix-- !== 0;) {`,
      `const ${LEFT_ITEM_IDENT} = ${LEFT}[ix]`,
      `const ${RIGHT_ITEM_IDENT} = ${RIGHT}[ix]`,
      x.items([LEFT_ITEM_IDENT], [RIGHT_ITEM_IDENT], IX),
      `}`,
    ].join('\n')
  }
}

function record(
  x: F.Type.Record<Builder>,
  ix: F.Index
): Builder {
  return function recordDeepEqual(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, ix.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, ix.isOptional)
    const LEFT_IDENT = ident(LEFT, IX.identifiers)
    const RIGHT_IDENT = ident(RIGHT, IX.identifiers)
    const LEFT_KEYS_IDENT = `${LEFT_IDENT}_keys`
    const RIGHT_KEYS_IDENT = `${RIGHT_IDENT}_keys`
    const LEFT_VALUE_IDENT = ident(`${LEFT_IDENT}[k]`, IX.identifiers)
    const RIGHT_VALUE_IDENT = ident(`${RIGHT_IDENT}[k]`, IX.identifiers)
    const LENGTH = ident('length', IX.identifiers)
    return [
      `const ${LEFT_KEYS_IDENT} = Object.keys(${LEFT})`,
      `const ${RIGHT_KEYS_IDENT} = Object.keys(${RIGHT})`,
      `const ${LENGTH} = ${LEFT_KEYS_IDENT}.length`,
      `if (${LENGTH} !== ${RIGHT_KEYS_IDENT}.length) return false`,
      `for (let ix = 0; ix < ${LENGTH}; ix++) {`,
      `const k = ${LEFT_KEYS_IDENT}[ix]`,
      `if (!${RIGHT_KEYS_IDENT}.includes(k)) return false`,
      `const ${LEFT_VALUE_IDENT} = ${LEFT}[k]`,
      `const ${RIGHT_VALUE_IDENT} = ${RIGHT}[k]`,
      Object_values(x.patternProperties)[0]([LEFT_VALUE_IDENT], [RIGHT_VALUE_IDENT], IX),
      `}`,
    ].join('\n')
  }
}

function union(
  x: Type.Union<Builder>,
  _: F.Index,
  input: Partial<T.TSchema>
): Builder {
  if (!F.tagged('anyOf')<T.TSchema>(input)) {
    return Invariant.IllegalState('deepEqual', 'expected input to be a union schema', input)
  } else return function unionDeepEqual(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, false)
    const RIGHT = joinPath(RIGHT_PATH, false)
    const SATISFIED = ident('satisfied', IX.identifiers)
    const withPredicates = input.anyOf.map((option, I) => [
      check.writeable(option, { functionName: `check_${I}` }),
      x.anyOf[I]
    ] as const)
    return [
      `{`,
      `let ${SATISFIED} = false`,
      ...withPredicates.map(([check, continuation], I) => {
        const FUNCTION_NAME = `check_${I}`
        return [
          check,
          `if (${FUNCTION_NAME}(${LEFT}) && ${FUNCTION_NAME}(${RIGHT})) {`,
          `${SATISFIED} = true`,
          continuation([LEFT], [RIGHT], IX),
          `}`
        ].join('\n')
      }),
      `if (!${SATISFIED}) return false`,
      `}`,
    ].join('\n')
  }
}

function intersect(
  x: F.Type.Intersect<Builder>,
  ix: F.Index
): Builder {
  return function intersectDeepEqual(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, ix.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, ix.isOptional)
    return x.allOf.flatMap(
      (continuation) => [
        '{',
        continuation([LEFT], [RIGHT], IX),
        '}',
      ]
    ).join('\n')
  }
}

function tuple(
  x: F.Type.Tuple<Builder>,
  ix: F.Index,
  input: Partial<T.TSchema>
): Builder {
  if (!F.tagged('tuple')<T.TSchema>(input)) {
    return Invariant.IllegalState('deepEqual', `expected input to be a tuple schema`, input)
  } else return function tupleEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, false)
    const RIGHT = joinPath(RIGHT_PATH, false)
    return x.items.map((continuation, i) => {
      if (!isCompositeTypeName(input.items?.[i][T.Kind])) {
        return continuation([LEFT, i], [RIGHT, i], IX)
      } else {
        const LEFT_ACCESSOR = joinPath([LEFT, i], ix.isOptional)
        const RIGHT_ACCESSOR = joinPath([RIGHT, i], ix.isOptional)
        return [
          `if (${LEFT_ACCESSOR} !== ${RIGHT_ACCESSOR}) {`,
          continuation([LEFT, i], [RIGHT, i], IX),
          `}`,
        ].join('\n')
      }
    }).join('\n')
  }
}

function object(
  x: F.Type.Object<Builder>,
  ix: F.Index,
  input: Partial<T.TSchema>
): Builder {
  if (!F.tagged('object')<T.TSchema>(input)) {
    return Invariant.IllegalState('deepEqual', 'expected input to be an object schema', input)
  } return function objectEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, false)
    const RIGHT = joinPath(RIGHT_PATH, false)
    return Object.entries(x.properties).map(([key, continuation]) => {
      if (!isCompositeTypeName((input.properties[key])[T.Kind]))
        return continuation([LEFT, key], [RIGHT, key], IX)
      else {
        const LEFT_ACCESSOR = joinPath([LEFT, key], ix.isOptional)
        const RIGHT_ACCESSOR = joinPath([RIGHT, key], ix.isOptional)
        return [
          `if (${LEFT_ACCESSOR} !== ${RIGHT_ACCESSOR}) {`,
          continuation([LEFT, key], [RIGHT, key], IX),
          `}`,
        ].join('\n')
      }
    }).join('\n')
  }
}

const fold = F.fold<Builder>((x, ix, input) => {
  switch (true) {
    case F.isNullary(x): return writeableDefaults[x[T.Kind]]
    case F.tagged('anyOf')(x): return union(x, ix, input)
    case F.tagged('optional')(x): return optional(x, ix, input)
    case F.tagged('array')(x): return array(x, ix)
    case F.tagged('allOf')(x): return intersect(x, ix)
    case F.tagged('tuple')(x): return tuple(x, ix, input)
    case F.tagged('object')(x): return object(x, ix, input)
    case F.tagged('record')(x): return record(x, ix)
    default: return (void (x satisfies never), writeableDefaults.Unknown)
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
  }
}

deepEqual.writeable = deepEqual_writeable
deepEqual.unfuzzable = deepEqual_unfuzzable

/**
 * ## {@link deepEqual `box.deepEqual`}
 *
 * Derive a _"deep equal"_ function from a TypeBox schema.
 *
 * A "deep equal" function (see also, {@link Equal `Equal`}) is similar to
 * lodash's `isEqual` function, except more performant, because
 * when the shape of the values being compared is known ahead of time,
 * we can optimize ahead of time, and only check what's necessary.
 *
 * Note that the deep equal function generated by {@link deepEqual `box.deepEqual`}
 * **assumes that both values have already been validated**. Passing
 * unvalidated values to the function might result in undefined behavior.
 *
 * @example
 * import * as T from '@sinclair/typebox'
 * import { deepEqual } from '@traversable/typebox'
 *
 * const addressEquals = deepEqual(
 *   T.Object({
 *     street1: T.String(),
 *     street2: T.Optional(T.String()),
 *     city: T.String(),
 *   })
 * )
 *
 * addressEquals(
 *   { street1: '221 Baker St', street2: '#B', city: 'London' },
 *   { street1: '221 Baker St', street2: '#B', city: 'London' },
 * ) // => true
 *
 * addressEquals(
 *   { street1: '221 Baker St', street2: '#B', city: 'London' },
 *   { street1: '4 Privet Dr', city: 'Little Whinging' },
 * ) //  => false
 */

export function deepEqual<S extends T.TSchema, T = T.Static<S>>(schema: S): Equal<T>
export function deepEqual<S extends T.TSchema, T = T.Static<S>>(schema: Partial<S>): Equal<T>
export function deepEqual(schema: Partial<T.TSchema>) {
  const ROOT_CHECK = requiresObjectIs(schema) ? `if (Object.is(l, r)) return true` : `if (l === r) return true`
  const BODY = fold(schema as Type.F<Builder>)(['l'], ['r'], defaultIndex())
  return F.isNullary(schema)
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
 * ## {@link deepEqual_writeable `box.deepEqual.writeable`}
 *
 * Derive a "writeable" (stringified) _"deep equal"_ function from a Json Schema spec.
 *
 * A "deep equal" function (see also, {@link Equal `Equal`}) is similar to
 * lodash's `isEqual` function, except more performant, because
 * when the shape of the values being compared is known ahead of time,
 * we can optimize ahead of time, and only check what's necessary.
 *
 * Note that the deep equal function generated by {@link deepEqual `box.deepEqual`}
 * **assumes that both values have already been validated**. Passing
 * unvalidated values to the function might result in undefined behavior.
 * 
 * {@link deepEqual_writeable `box.deepEqual.writeable`} accepts an optional
 * configuration object as its second argument; documentation for those
 * options are available via hover on autocompletion.
 * 
 * See also:
 * - {@link deepEqual `box.deepEqual`}
 *
 * @example
 * import * as T from '@sinclair/typebox'
 * import { deepEqual } from '@traversable/typebox'
 * 
 * const addressEquals = deepEqual.writeable(
 *   T.Object({
 *     street1: T.String(),
 *     street2: T.Optional(T.String()),
 *     city: T.String(),
 *   }), 
 *   { typeName: 'Address' }
 * )
 * 
 * console.log(addressEquals) 
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

function deepEqual_writeable(schema: T.TSchema, options?: deepEqual.Options): string
function deepEqual_writeable(schema: Partial<T.TSchema>, options?: deepEqual.Options): string
function deepEqual_writeable(schema: Partial<T.TSchema>, options?: deepEqual.Options) {
  const target = fold(schema as Type.F<Builder>)(['l'], ['r'], defaultIndex())
  const inputType = toType(schema, options)
  const FUNCTION_NAME = options?.functionName ?? 'equals'
  const TYPE = `: ${options?.typeName ?? inputType}`
  const ROOT_CHECK = requiresObjectIs(schema) ? `if (Object.is(l, r)) return true` : `if (l === r) return true`
  const BODY = target.length === 0 ? null : target
  return (
    F.isNullary(schema)
      ? [
        options?.typeName === undefined ? null : inputType,
        `function ${FUNCTION_NAME} (l${TYPE}, r${TYPE}) {`,
        BODY,
        `return true`,
        `}`,
      ]
      : [
        options?.typeName === undefined ? null : inputType,
        `function ${FUNCTION_NAME} (l${TYPE}, r${TYPE}) {`,
        ROOT_CHECK,
        BODY,
        `return true`,
        `}`
      ]
  ).filter((_) => _ !== null).join('\n')
}
