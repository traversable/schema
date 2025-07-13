import * as T from '@sinclair/typebox'
import { Equal, ident, keyAccessor, indexAccessor, Object_is, Object_hasOwn, Object_keys } from '@traversable/registry'

import * as F from './functor.js'
import { toType } from './to-type.js'
import { check } from './check.js'

export type Path = (string | number)[]

export interface Scope extends F.Index {
  identifiers: Map<string, string>
}

export type EqBuilder = (left: Path, right: Path, index: Scope) => string

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
  [F.TypeName.never]: function continueNeverEquals(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [F.TypeName.any]: function continueAnyEquals(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [F.TypeName.unknown]: function continueUnknownEquals(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [F.TypeName.void]: function continueVoidEquals(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [F.TypeName.undefined]: function continueUndefinedEquals(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [F.TypeName.null]: function continueNullEquals(l, r, ix) { return StictlyEqualOrFail(l, r, ix) },
  [F.TypeName.symbol]: function continueSymbolEquals(l, r, ix) { return StictlyEqualOrFail(l, r, ix) },
  [F.TypeName.boolean]: function continueBooleanEquals(l, r, ix) { return StictlyEqualOrFail(l, r, ix) },
  [F.TypeName.integer]: function continueIntEquals(l, r, ix) { return SameNumberOrFail(l, r, ix) },
  [F.TypeName.bigInt]: function continueBigIntEquals(l, r, ix) { return SameNumberOrFail(l, r, ix) },
  [F.TypeName.number]: function continueNumberEquals(l, r, ix) { return SameNumberOrFail(l, r, ix) },
  [F.TypeName.string]: function continueStringEquals(l, r, ix) { return StictlyEqualOrFail(l, r, ix) },
  [F.TypeName.literal]: function continueLiteralEquals(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [F.TypeName.date]: function continueDateEquals(l, r, ix) {
    return `if (!Object.is(${joinPath(l, ix.isOptional)}?.getTime(), ${joinPath(r, ix.isOptional)}?.getTime())) return false`
  },
} as const satisfies Record<string, EqBuilder>

function optional<T>(equalsFn: Equal<T>): Equal<T | undefined> {
  return (l, r) => Object_is(l, r) || equalsFn(l!, r!)
}

function buildOptionalEquals(
  buildEquals: EqBuilder,
  ix: F.Index,
  input: T.TOptional<T.TSchema>
): EqBuilder {
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
  x: F.Type.Optional<EqBuilder>,
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

function arrayEqualsContinuation(continuation: EqBuilder, ix: F.Index): EqBuilder {
  return function continueArrayEquals(LEFT_PATH, RIGHT_PATH, IX) {
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

array.writeable = (x: F.Type.Array<EqBuilder>, ix: F.Index) => arrayEqualsContinuation(x.items, ix)

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

function recordEqualsContinuation(continuation: EqBuilder, ix: F.Index): EqBuilder {
  return function continueRecordEquals(LEFT_PATH, RIGHT_PATH, IX) {
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

record.writeable = (x: F.Type.Record<EqBuilder>, ix: F.Index) => recordEqualsContinuation(Object.values(x.patternProperties)[0], ix)

function union<T>(equalsFns: readonly Equal<T>[]): Equal<T> {
  return (l, r) => Object_is(l, r) || equalsFns.reduce((bool, equalsFn) => bool || equalsFn(l, r), false)
}
function unionEqualsContinuation(
  x: EqBuilder[],
  ix: F.Index,
  input: T.TUnion
): EqBuilder {
  return function continueUnionEquals(LEFT_PATH, RIGHT_PATH, IX) {
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
  x: F.Type.Union<EqBuilder>,
  ix: F.Index,
  input: T.TUnion
): EqBuilder => unionEqualsContinuation(x.anyOf, ix, input)

function intersection<L, R>(leftEquals: Equal<L>, rightEquals: Equal<R>): Equal<L & R> {
  return (l, r) => Object_is(l, r) || leftEquals(l, r) && rightEquals(l, r)
}

function intersectEqualsContinuation(
  continuations: EqBuilder[],
  ix: F.Index
): EqBuilder {
  return function continueIntersectionEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, ix.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, ix.isOptional)
    return continuations.flatMap((continuation) => ['{', continuation([LEFT], [RIGHT], IX), '}']).join('\n')
  }
}

intersection.writeable = (
  x: F.Type.Intersect<EqBuilder>,
  ix: F.Index
) => intersectEqualsContinuation(x.allOf, ix)

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

function tupleEqualsContinuation(
  continuations: EqBuilder[],
  ix: F.Index,
  input: T.TTuple
): EqBuilder {
  return function continueTupleEquals(LEFT_PATH, RIGHT_PATH, IX) {
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
  x: F.Type.Tuple<EqBuilder>,
  ix: F.Index,
  input: T.TTuple
) => tupleEqualsContinuation(x.items, ix, input)

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

function objectEqualsContinuation(
  continuations: { [x: string]: EqBuilder },
  ix: F.Index,
  input: T.TObject
): EqBuilder {
  return function continueObjectEquals(LEFT_PATH, RIGHT_PATH, IX) {
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
  x: F.Type.Object<EqBuilder>,
  ix: F.Index,
  input: T.TObject
) => objectEqualsContinuation(x.properties, ix, input)

const compile = F.fold<EqBuilder>((x, ix, input) => {
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


/**
 * ## {@link equals `box.equals`}
 *
 * Derive an _equals function_ from a TypeBox schema.
 *
 * An "equals function" (see also, {@link Equal `Equal`}) is similar to
 * lodash's `deepEquals` function, except more performant, because
 * when the shape of the values being compared is known ahead of time,
 * we can optimize ahead of time, and only check what's necessary.
 *
 * Note that the "equals function" generated by {@link equals `box.equals`}
 * **assumes that both values have already been validated**. Passing
 * unvalidated values to the function might result in undefined behavior.
 *
 * @example
 * import * as T from '@sinclair/typebox'
 * import { box } from '@traversable/typebox'
 *
 * const equals = box.equals(
 *   T.Object({
 *     a: T.Number(),
 *     b: T.Array(T.String()),
 *     c: T.Tuple([T.Boolean(), T.Literal(1)]),
 *   })
 * )
 *
 * console.log(equals(
 *   { a: 1, b: ['hey', 'ho'], c: [false, 1] },
 *   { a: 1, b: ['hey', 'ho'], c: [false, 1] }
 * )) // => true
 *
 * console.log(equals(
 *   { a: 9000, b: [], c: [true, 1] },
 *   { a: 9000, b: [], c: [true, 1] }
 * )) //  => true
 *
 * console.log(equals(
 *   { a: 1, b: ['hey', 'ho'], c: [false, 1] },
 *   { a: 1, b: ['hey'], c: [false, 1] }
 * )) // => false
 *
 * console.log(equals(
 *   { a: 9000, b: [], c: [true, 1] },
 *   { a: 9000, b: [], c: [false, 1] }
 * )) // => false
 */
export function equals<T extends T.TSchema>(schema: T): Equal<T.Static<T>>
export function equals<T extends T.TSchema>(schema: T) {
  const ROOT_CHECK = requiresObjectIs(schema) ? `if (Object.is(l, r)) return true` : `if (l === r) return true`
  const BODY = compile(schema as never)(['l'], ['r'], { ...F.defaultIndex, identifiers: new Map() })
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

equals.writeable = writeableEquals

declare namespace equals {
  type Options = toType.Options & {
    functionName?: string
  }
}

function writeableEquals<T extends T.TSchema>(schema: T, options?: equals.Options): string
function writeableEquals(schema: T.TSchema, options?: equals.Options) {
  const compiled = compile(schema as never)(['l'], ['r'], { ...F.defaultIndex, identifiers: new Map() })
  const FUNCTION_NAME = options?.functionName ?? 'equals'
  const inputType = toType(schema, options)
  const TYPE = options?.typeName ?? inputType
  const ROOT_CHECK = requiresObjectIs(schema) ? `if (Object.is(l, r)) return true` : `if (l === r) return true`
  const BODY = compiled.length === 0 ? null : compiled
  return (
    F.isNullary(schema)
      ? [
        options?.typeName === undefined ? null : inputType,
        `function ${FUNCTION_NAME} (l: ${TYPE}, r: ${TYPE}) {`,
        BODY,
        `return true`,
        `}`,
      ]
      : [
        options?.typeName === undefined ? null : inputType,
        `function ${FUNCTION_NAME} (l: ${TYPE}, r: ${TYPE}) {`,
        ROOT_CHECK,
        BODY,
        `return true`,
        `}`
      ]
  ).filter((_) => _ !== null).join('\n')
}
