import * as T from '@sinclair/typebox'
import { Equal, ident, keyAccessor, indexAccessor, Object_is, Object_hasOwn, Object_keys, Object_values } from '@traversable/registry'
import { F } from '@traversable/typebox-types'

import { toType } from './to-type.js'
import { check } from './check.js'

export type Path = (string | number)[]

export interface Scope extends F.Index {
  identifiers: Map<string, string>
  useGlobalThis: boolean
}

export function defaultIndex(): Scope {
  return {
    ...F.defaultIndex,
    identifiers: new Map(),
    useGlobalThis: false,
  }
}

export type Builder = (left: Path, right: Path, index: Scope) => string

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
 * As specified by
 * [`TC39: SameValue`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevalue)
 */
function SameValueOrFail(l: (string | number)[], r: (string | number)[], ix: F.Index) {
  const X = joinPath(l, ix.isOptional)
  const Y = joinPath(r, ix.isOptional)
  return `if (!Object.is(${X}, ${Y})) return false`
}

/**
 * As specified by
 * [`TC39: IsStrictlyEqual`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isstrictlyequal)
 */
function StictlyEqualOrFail(l: (string | number)[], r: (string | number)[], ix: F.Index) {
  const X = joinPath(l, ix.isOptional)
  const Y = joinPath(r, ix.isOptional)
  return `if (${X} !== ${Y}) return false`
}

function joinPath(path: (string | number)[], isOptional: boolean) {
  return path.reduce<string>
    ((xs, k, i) => i === 0 ? `${k}`
      : typeof k === 'number' ? `${xs}${indexAccessor(k, isOptional)}`
        : `${xs}${keyAccessor(k, isOptional)}`,
      ''
    )
}

export const defaults = {
  [F.TypeName.unknown]: Object_is,
  [F.TypeName.any]: Object_is,
  [F.TypeName.never]: Object_is,
  [F.TypeName.void]: Equal.IsStrictlyEqual<void>,
  [F.TypeName.undefined]: Equal.IsStrictlyEqual,
  [F.TypeName.null]: Equal.IsStrictlyEqual<null>,
  [F.TypeName.symbol]: Equal.IsStrictlyEqual<symbol>,
  [F.TypeName.boolean]: Equal.IsStrictlyEqual<boolean>,
  [F.TypeName.integer]: Equal.SameValueNumber,
  [F.TypeName.bigInt]: Equal.IsStrictlyEqual<bigint>,
  [F.TypeName.number]: Equal.SameValueNumber,
  [F.TypeName.string]: Object_is,
  [F.TypeName.literal]: Object_is,
  [F.TypeName.date]: ((l, r) => Object_is(l?.getTime(), r?.getTime())) satisfies Equal<Date>,
} as const

export const writeableDefaults = {
  [F.TypeName.never]: function neverEquals(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [F.TypeName.any]: function anyEquals(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [F.TypeName.unknown]: function unknownEquals(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [F.TypeName.void]: function voidEquals(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [F.TypeName.undefined]: function undefinedEquals(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [F.TypeName.null]: function nullEquals(l, r, ix) { return StictlyEqualOrFail(l, r, ix) },
  [F.TypeName.symbol]: function symbolEquals(l, r, ix) { return StictlyEqualOrFail(l, r, ix) },
  [F.TypeName.boolean]: function booleanEquals(l, r, ix) { return StictlyEqualOrFail(l, r, ix) },
  [F.TypeName.integer]: function integerEquals(l, r, ix) { return SameNumberOrFail(l, r, ix) },
  [F.TypeName.bigInt]: function bigIntEquals(l, r, ix) { return SameNumberOrFail(l, r, ix) },
  [F.TypeName.number]: function numberEquals(l, r, ix) { return SameNumberOrFail(l, r, ix) },
  [F.TypeName.string]: function stringEquals(l, r, ix) { return StictlyEqualOrFail(l, r, ix) },
  [F.TypeName.literal]: function literalEquals(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [F.TypeName.date]: function dateEquals(l, r, ix) {
    const NS = ix.useGlobalThis ? 'globalThis.' : ''
    return `if (!${NS}Object.is(${joinPath(l, ix.isOptional)}?.getTime(), ${joinPath(r, ix.isOptional)}?.getTime())) return false`
  },
} as const satisfies Record<string, Builder>

function optional<T>(equalsFn: Equal<T>): Equal<T | undefined> {
  return (l, r) => Object_is(l, r) || equalsFn(l!, r!)
}

function buildOptionalEquals(
  buildEquals: Builder,
  ix: F.Index,
  input: T.TOptional<T.TSchema>
): Builder {
  return function continueOptionalEquals(LEFT_PATH, RIGHT_PATH, IX) {
    return F.isNullary(input.schema)
      ? buildEquals(LEFT_PATH, RIGHT_PATH, IX)
      : [
        `if (${joinPath(LEFT_PATH, ix.isOptional)} !== ${joinPath(RIGHT_PATH, ix.isOptional)}) {`,
        buildEquals(LEFT_PATH, RIGHT_PATH, IX),
        `}`,
      ].join('\n')
  }
}

optional.writeable = (
  x: F.Type.Optional<Builder>,
  ix: F.Index,
  input: T.TOptional<T.TSchema>
) => buildOptionalEquals(x.schema, ix, input)

function array<T>(equalsFn: Equal<T>): Equal<readonly T[]> {
  return (l, r) => {
    if (Object_is(l, r)) return true
    let length = l.length
    if (length !== r.length) return false
    for (let ix = length; ix-- !== 0;) {
      if (!equalsFn(l[ix], r[ix])) return false
    }
    return true
  }
}

function buildArrayEquals(continuation: Builder, ix: F.Index): Builder {
  return function arrayEquals(LEFT_PATH, RIGHT_PATH, IX) {
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
      continuation([LEFT_ITEM_IDENT], [RIGHT_ITEM_IDENT], IX),
      `}`,
    ].join('\n')
  }
}

array.writeable = (x: F.Type.Array<Builder>, ix: F.Index) => buildArrayEquals(x.items, ix)

function record<T>(valueEqualsFn: Equal<T>, _keyEqualsFn?: Equal<T>): Equal<Record<string, T>> {
  return (l, r) => {
    if (Object_is(l, r)) return true
    const lKeys = Object_keys(l)
    const rKeys = Object_keys(r)
    let length = lKeys.length
    let k: string
    if (length !== rKeys.length) return false
    for (let ix = length; ix-- !== 0;) {
      k = lKeys[ix]
      if (!Object_hasOwn(r, k)) return false
      if (!(valueEqualsFn(l[k], r[k]))) return false
    }
    length = rKeys.length
    for (let ix = length; ix-- !== 0;) {
      k = rKeys[ix]
      if (!Object_hasOwn(l, k)) return false
      if (!(valueEqualsFn(l[k], r[k]))) return false
    }
    return true
  }
}

function buildRecordEquals(continuation: Builder, ix: F.Index): Builder {
  return function recordEquals(LEFT_PATH, RIGHT_PATH, IX) {
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
      `for (let ix = ${LENGTH}; ix-- !== 0;) {`,
      `const k = ${LEFT_KEYS_IDENT}[ix]`,
      `if (!${RIGHT_KEYS_IDENT}.includes(k)) return false`,
      `const ${LEFT_VALUE_IDENT} = ${LEFT}[k]`,
      `const ${RIGHT_VALUE_IDENT} = ${RIGHT}[k]`,
      continuation([LEFT_VALUE_IDENT], [RIGHT_VALUE_IDENT], IX),
      `}`,
    ].join('\n')
  }
}

record.writeable = (x: F.Type.Record<Builder>, ix: F.Index) => buildRecordEquals(Object_values(x.patternProperties)[0], ix)

function union<T>(equalsFns: readonly Equal<T>[]): Equal<T> {
  return (l, r) => Object_is(l, r) || equalsFns.reduce((bool, equalsFn) => bool || equalsFn(l, r), false)
}
function buildUnionEquals(
  x: Builder[],
  _: F.Index,
  input: T.TUnion
): Builder {
  return function unionEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, false)
    const RIGHT = joinPath(RIGHT_PATH, false)
    const SATISFIED = ident('satisfied', IX.identifiers)
    const pairs = input.anyOf.map((option, I) => [
      check.writeable(option, { functionName: `check_${I}` }),
      x[I]
    ] as const)
    return [
      `{`,
      `let ${SATISFIED} = false`,
      ...pairs.map(([check, continuation], I) => {
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

union.writeable = (
  x: F.Type.Union<Builder>,
  ix: F.Index,
  input: T.TUnion
): Builder => buildUnionEquals(x.anyOf, ix, input)

function intersection<L, R>(leftEquals: Equal<L>, rightEquals: Equal<R>): Equal<L & R> {
  return (l, r) => Object_is(l, r) || leftEquals(l, r) && rightEquals(l, r)
}

function buildIntersectionEquals(
  continuations: Builder[],
  ix: F.Index
): Builder {
  return function intersectionEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, ix.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, ix.isOptional)
    return continuations.flatMap((continuation) => ['{', continuation([LEFT], [RIGHT], IX), '}']).join('\n')
  }
}

intersection.writeable = (
  x: F.Type.Intersect<Builder>,
  ix: F.Index
) => buildIntersectionEquals(x.allOf, ix)

function tuple<T>(equalsFns: Equal<T>[], restEquals?: Equal<T>): Equal<readonly T[]> {
  return (l, r) => {
    if (Object_is(l, r)) return true
    if (l.length !== r.length) return false
    const len = equalsFns.length
    for (let ix = len; ix-- !== 0;) {
      const equalsFn = equalsFns[ix]
      if (!equalsFn(l[ix], r[ix])) return false
    }
    if (l.length > len) {
      if (!restEquals) return false
      for (let ix = len; ix < l.length; ix++) {
        if (!restEquals(l[ix], r[ix])) return false
      }
    }
    return true
  }
}

function buildTupleEquals(
  continuations: Builder[],
  ix: F.Index,
  input: T.TTuple
): Builder {
  return function tupleEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, false)   // `false` because `*_PATH` already takes optionality into account
    const RIGHT = joinPath(RIGHT_PATH, false) // `false` because `*_PATH` already takes optionality into account
    return continuations.map((continuation, i) => {
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

tuple.writeable = (
  x: F.Type.Tuple<Builder>,
  ix: F.Index,
  input: T.TTuple
) => buildTupleEquals(x.items, ix, input)

function object<T, R>(equalsFns: { [x: string]: Equal<T> }, catchAllEquals?: Equal<T>): Equal<{ [x: string]: T }> {
  return (l, r) => {
    if (Object_is(l, r)) return true
    const lKeys = Object_keys(l)
    const rKeys = Object_keys(r)
    if (lKeys.length !== rKeys.length) return false
    const keysSet = catchAllEquals ? new Set(lKeys.concat(rKeys)) : null
    for (const k in equalsFns) {
      keysSet?.delete(k)
      const equalsFn = equalsFns[k]
      const lHas = Object_hasOwn(l, k)
      const rHas = Object_hasOwn(r, k)
      if (lHas) {
        if (!rHas) return false
        if (!equalsFn(l[k], r[k])) return false
      }
      if (rHas) {
        if (!lHas) return false
        if (!equalsFn(l[k], r[k])) return false
      }
      if (!equalsFn(l[k], r[k])) return false
    }
    if (catchAllEquals && keysSet) {
      const catchallKeys = Array.from(keysSet)
      let k: string | undefined
      while ((k = catchallKeys.shift()) !== undefined) {
        if (!Object_hasOwn(l, k)) return false
        if (!Object_hasOwn(r, k)) return false
        if (!catchAllEquals(l[k], r[k])) return false
      }
    }
    return true
  }
}

function buildObjectEquals(
  continuations: { [x: string]: Builder },
  ix: F.Index,
  input: T.TObject
): Builder {
  return function objectEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, false)   // `false` because `*_PATH` already takes optionality into account
    const RIGHT = joinPath(RIGHT_PATH, false) // `false` because `*_PATH` already takes optionality into account
    return Object.entries(continuations).map(([key, continuation]) => {
      if (!isCompositeTypeName(input.properties[key][T.Kind]))
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

object.writeable = (
  x: F.Type.Object<Builder>,
  ix: F.Index,
  input: T.TObject
) => buildObjectEquals(x.properties, ix, input)

const compile = F.fold<Builder>((x, ix, input) => {
  switch (true) {
    /** TODO: */
    default: return (void (x satisfies never), writeableDefaults.Never)
    case F.isNullary(x): return writeableDefaults[x[T.Kind]]
    /** TODO: */
    case F.tagged('anyOf')(x): return union.writeable(x, ix, input as T.TUnion)
    case F.tagged('optional')(x): return optional.writeable(x, ix, input as T.TOptional<T.TSchema>)
    case F.tagged('array')(x): return array.writeable(x, ix)
    case F.tagged('allOf')(x): return intersection.writeable(x, ix)
    case F.tagged('tuple')(x): return tuple.writeable(x, ix, input as T.TTuple)
    case F.tagged('object')(x): return object.writeable(x, ix, input as T.TObject)
    case F.tagged('record')(x): return record.writeable(x, ix)
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
 * import { box } from '@traversable/typebox'
 *
 * const deepEqual = box.deepEqual(
 *   T.Object({
 *     street1: T.String(),
 *     street2: T.Optional(T.String()),
 *     city: T.String(),
 *   })
 * )
 *
 * deepEqual(
 *   { street1: '221 Baker St', street2: '#B', city: 'London' },
 *   { street1: '221 Baker St', street2: '#B', city: 'London' },
 * ) // => true
 *
 * deepEqual(
 *   { street1: '221 Baker St', street2: '#B', city: 'London' },
 *   { street1: '4 Privet Dr', city: 'Little Whinging' },
 * ) //  => false
 */

export function deepEqual<T extends T.TSchema>(schema: T): Equal<T.Static<T>>
export function deepEqual<T extends T.TSchema>(schema: T) {
  const ROOT_CHECK = requiresObjectIs(schema) ? `if (Object.is(l, r)) return true` : `if (l === r) return true`
  const BODY = compile(schema as never)(['l'], ['r'], defaultIndex())
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
 * import { box } from '@traversable/typebox'
 * 
 * const deepEqual = box.deepEqual.writeable(
 *   T.Object({
 *     street1: T.String(),
 *     street2: T.Optional(T.String()),
 *     city: T.String(),
 *   }), 
 *   { typeName: 'Address' }
 * )
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

function deepEqual_writeable<T extends T.TSchema>(schema: T, options?: deepEqual.Options): string
function deepEqual_writeable(schema: T.TSchema, options?: deepEqual.Options) {
  const compiled = compile(schema as never)(['l'], ['r'], defaultIndex())
  const FUNCTION_NAME = options?.functionName ?? 'equals'
  const inputType = toType(schema, options)
  const TYPE = `: ${options?.typeName ?? inputType}`
  const ROOT_CHECK = requiresObjectIs(schema) ? `if (Object.is(l, r)) return true` : `if (l === r) return true`
  const BODY = compiled.length === 0 ? null : compiled
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
