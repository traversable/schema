import { z } from 'zod'
import {
  Equal,
  ident,
  joinPath,
  Object_is,
  Object_hasOwn,
  Object_keys,
  stringifyKey,
  stringifyLiteral,
} from '@traversable/registry'
import type { Discriminated } from '@traversable/zod-types'
import {
  F,
  hasTypeName,
  tagged,
  TypeName,
  areAllObjects,
  getTags,
  inlinePrimitiveCheck,
  isPrimitive,
  schemaOrdering,
} from '@traversable/zod-types'

import { check } from './check.js'
import { toType } from './to-type.js'

export type Path = (string | number)[]

export interface Scope extends F.CompilerIndex {
  bindings: Map<string, string>
  useGlobalThis: deepEqual.Options['useGlobalThis']
}

export type Builder = (left: Path, right: Path, index: Scope) => string

const defaultIndex = () => ({
  ...F.defaultIndex,
  useGlobalThis: false,
  bindings: new Map(),
}) satisfies Scope

const deepEqual_unsupported = [
  'promise',
  'transform',
] as const satisfies any[]

const deepEqual_unfuzzable = [
  ...deepEqual_unsupported,
  'custom',
  'default',
  'prefault',
  'promise',
  'success',
  'never',
  'unknown',
  'any',
  'nonoptional',
  'catch',
  'file',
] as const satisfies any[]

type UnsupportedSchema = F.Z.Catalog[typeof deepEqual_unsupported[number]]

function isUnsupported(x: unknown): x is UnsupportedSchema {
  return hasTypeName(x) && deepEqual_unsupported.includes(x._zod.def.type as never)
}

function isCompositeTypeName(x: string) {
  if (x === 'object') return true
  else if (x === 'array') return true
  else if (x === 'record') return true
  else if (x === 'tuple') return true
  else return false
}

function requiresObjectIs(x: unknown): boolean {
  return tagged('nan', x)
    || tagged('int', x)
    || tagged('number', x)
    || tagged('bigint', x)
    || tagged('enum', x)
    || tagged('literal', x)
    || (tagged('union', x) && x._zod.def.options.some(requiresObjectIs))
}

/**
 * Specialization of
 * [`TC39: SameValueZero`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevaluezero)
 * that operates on numbers
 */
function SameNumberOrFail(l: (string | number)[], r: (string | number)[], ix: F.CompilerIndex) {
  const X = joinPath(l, ix.isOptional)
  const Y = joinPath(r, ix.isOptional)
  return `if (${X} !== ${Y} && (${X} === ${X} || ${Y} === ${Y})) return false;`
}

/**
 * As specified by
 * [`TC39: SameValue`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevalue)
 */
function SameValueOrFail(l: (string | number)[], r: (string | number)[], ix: F.CompilerIndex) {
  const X = joinPath(l, ix.isOptional)
  const Y = joinPath(r, ix.isOptional)
  return `if (!Object.is(${X}, ${Y})) return false;`
}

/**
 * As specified by
 * [`TC39: IsStrictlyEqual`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isstrictlyequal)
 */
function StrictlyEqualOrFail(l: (string | number)[], r: (string | number)[], ix: F.CompilerIndex) {
  const X = joinPath(l, ix.isOptional)
  const Y = joinPath(r, ix.isOptional)
  return `if (${X} !== ${Y}) return false;`
}

export const defaults = {
  [TypeName.unknown]: Object_is,
  [TypeName.any]: Object_is,
  [TypeName.never]: Object_is,
  [TypeName.void]: Equal.IsStrictlyEqual<void>,
  [TypeName.undefined]: Equal.IsStrictlyEqual,
  [TypeName.null]: Equal.IsStrictlyEqual<null>,
  [TypeName.symbol]: Equal.IsStrictlyEqual<symbol>,
  [TypeName.boolean]: Equal.IsStrictlyEqual<boolean>,
  [TypeName.nan]: Equal.SameValueNumber,
  [TypeName.int]: Equal.SameValueNumber,
  [TypeName.bigint]: Equal.IsStrictlyEqual<bigint>,
  [TypeName.number]: Equal.SameValueNumber,
  [TypeName.string]: Equal.IsStrictlyEqual<string>,
  [TypeName.literal]: Object_is,
  [TypeName.date]: ((l, r) => Object_is(l?.getTime(), r?.getTime())) satisfies Equal<Date>,
  [TypeName.file]: Object_is,
  [TypeName.enum]: Object_is,
  [TypeName.template_literal]: Object_is,
} as const

export const writeableDefaults = {
  [TypeName.never]: function continueNeverEquals(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [TypeName.any]: function continueAnyEquals(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [TypeName.unknown]: function continueUnknownEquals(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [TypeName.void]: function continueVoidEquals(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [TypeName.undefined]: function continueUndefinedEquals(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [TypeName.null]: function continueNullEquals(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) },
  [TypeName.symbol]: function continueSymbolEquals(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) },
  [TypeName.boolean]: function continueBooleanEquals(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) },
  [TypeName.nan]: function continueNaNEquals(l, r, ix) { return SameNumberOrFail(l, r, ix) },
  [TypeName.int]: function continueIntEquals(l, r, ix) { return SameNumberOrFail(l, r, ix) },
  [TypeName.bigint]: function continueBigIntEquals(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) },
  [TypeName.number]: function continueNumberEquals(l, r, ix) { return SameNumberOrFail(l, r, ix) },
  [TypeName.string]: function continueStringEquals(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) },
  [TypeName.enum]: function continueEnumEquals(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [TypeName.template_literal]: function continueTemplateLiteralEquals(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [TypeName.file]: function continueFileEquals(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) },
  [TypeName.date]: function continueDateEquals(l, r, ix) {
    return `if (!Object.is(${joinPath(l, ix.isOptional)}?.getTime(), ${joinPath(r, ix.isOptional)}?.getTime())) return false;`
  },
} as const satisfies Record<string, Builder>

function literalEquals(x: F.Z.Literal, ix: F.CompilerIndex): Builder {
  return function continueLiteralEquals(LEFT, RIGHT, IX) {
    const { values } = x._zod.def
    return (
      values.every((v) => typeof v === 'number') ? SameNumberOrFail(LEFT, RIGHT, IX)
        : values.some((v) => typeof v === 'number') ? SameValueOrFail(LEFT, RIGHT, IX)
          : StrictlyEqualOrFail(LEFT, RIGHT, IX)
    )
  }
}

function nullable<T>(deepEqualFn: Equal<T>): Equal<T | null> {
  return (l, r) => Object_is(l, r) || deepEqualFn(l!, r!)
}

nullable.writeable = function nullableEquals(
  x: F.Z.Nullable<Builder>,
  input: z.ZodNullable
): Builder {
  return function continueNullableEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
    return F.isNullary(input._zod.def.innerType)
      ? [
        `if ((${LEFT} === null || ${RIGHT} === null) && ${LEFT} !== ${RIGHT}) return false`,
        x._zod.def.innerType(LEFT_PATH, RIGHT_PATH, IX)
      ].join('\n')
      : [
        `if ((${LEFT} === null || ${RIGHT} === null) && ${LEFT} !== ${RIGHT}) return false`,
        `if (${LEFT} !== ${RIGHT}) {`,
        x._zod.def.innerType(LEFT_PATH, RIGHT_PATH, IX),
        `}`,
      ].join('\n')
  }
}

function optional<T>(deepEqualFn: Equal<T>): Equal<T | undefined> {
  return (l, r) => Object_is(l, r) || deepEqualFn(l!, r!)
}

optional.writeable = function optionalEquals(
  x: F.Z.Optional<Builder>,
  input: z.ZodOptional
): Builder {
  return function continueOptionalEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
    return F.isNullary(input._zod.def.innerType)
      ? [
        `if ((${LEFT} === undefined || ${RIGHT} === undefined) && ${LEFT} !== ${RIGHT}) return false`,
        x._zod.def.innerType(LEFT_PATH, RIGHT_PATH, IX)
      ].join('\n')
      : [
        `if ((${LEFT} === undefined || ${RIGHT} === undefined) && ${LEFT} !== ${RIGHT}) return false`,
        `if (${LEFT} !== ${RIGHT}) {`,
        x._zod.def.innerType(LEFT_PATH, RIGHT_PATH, IX),
        `}`,
      ].join('\n')
  }
}

function set<T>(deepEqualFn: Equal<T>): Equal<Set<T>> {
  return (l, r) => {
    if (Object_is(l, r)) return true
    else if (l?.size !== r?.size) return false
    else return array(deepEqualFn)(Array.from(l).sort(), Array.from(r).sort())
  }
}

set.writeable = function setEquals(x: F.Z.Set<Builder>): Builder {
  return function continueSetEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
    const LEFT_IDENT = ident(LEFT, IX.bindings)
    const RIGHT_IDENT = ident(RIGHT, IX.bindings)
    const LEFT_VALUES_IDENT = `${LEFT_IDENT}_values`
    const RIGHT_VALUES_IDENT = `${RIGHT_IDENT}_values`
    const LEFT_VALUE_IDENT = `${LEFT_IDENT}_value`
    const RIGHT_VALUE_IDENT = `${RIGHT_IDENT}_value`
    const LENGTH = ident('length', IX.bindings)
    return [
      `if (${LEFT}?.size !== ${RIGHT}?.size) return false;`,
      `const ${LEFT_VALUES_IDENT} = Array.from(${LEFT}).sort();`,
      `const ${RIGHT_VALUES_IDENT} = Array.from(${RIGHT}).sort();`,
      `let ${LENGTH} = ${LEFT_VALUES_IDENT}.length;`,
      `for (let ix = ${LENGTH}; ix-- !== 0;) {`,
      `const ${LEFT_VALUE_IDENT} = ${LEFT_VALUES_IDENT}[ix];`,
      `const ${RIGHT_VALUE_IDENT} = ${RIGHT_VALUES_IDENT}[ix];`,
      x._zod.def.valueType([LEFT_VALUE_IDENT], [RIGHT_VALUE_IDENT], IX),
      `}`,
    ].join('\n')
  }
}

function map<K, V>(keyEqualsFn: Equal<K>, valueEqualsFn: Equal<V>): Equal<Map<K, V>> {
  return (l, r) => {
    if (Object_is(l, r)) return true
    else if (l.size !== r.size) return false
    else {
      const leftEntries = Array.from(l).sort()
      const rightEntries = Array.from(r).sort()
      for (let ix = 0, len = l.size; ix < len; ix++) {
        const [lk, lv] = leftEntries[ix]
        const [rk, rv] = rightEntries[ix]
        if (!keyEqualsFn(lk, rk)) return false
        if (!valueEqualsFn(lv, rv)) return false
      }
      return true
    }
  }
}

map.writeable = function mapEquals(x: F.Z.Map<Builder>): Builder {
  return function continueMapEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT_ACCESSOR = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT_ACCESSOR = joinPath(RIGHT_PATH, IX.isOptional)
    const LEFT_IDENT = ident(LEFT_ACCESSOR, IX.bindings)
    const RIGHT_IDENT = ident(RIGHT_ACCESSOR, IX.bindings)
    const LEFT_ENTRIES = `${LEFT_IDENT}_entries`
    const RIGHT_ENTRIES = `${RIGHT_IDENT}_entries`
    const LEFT_KEY = `${LEFT_IDENT}_key`
    const RIGHT_KEY = `${RIGHT_IDENT}_key`
    const LEFT_VALUE = `${LEFT_IDENT}_value`
    const RIGHT_VALUE = `${RIGHT_IDENT}_value`
    return [
      `if (${LEFT_ACCESSOR}?.size !== ${RIGHT_ACCESSOR}?.size) return false;`,
      `const ${LEFT_ENTRIES} = Array.from(${LEFT_ACCESSOR}).sort();`,
      `const ${RIGHT_ENTRIES} = Array.from(${RIGHT_ACCESSOR}).sort();`,
      `for (let ix = 0, len = ${LEFT_ENTRIES}.length; ix < len; ix++) {`,
      `const [${LEFT_KEY}, ${LEFT_VALUE}] = ${LEFT_ENTRIES}[ix];`,
      `const [${RIGHT_KEY}, ${RIGHT_VALUE}] = ${RIGHT_ENTRIES}[ix];`,
      x._zod.def.keyType([LEFT_KEY], [RIGHT_KEY], IX),
      x._zod.def.valueType([LEFT_VALUE], [RIGHT_VALUE], IX),
      `}`,
    ].join('\n')
  }
}

function array<T>(deepEqualFn: Equal<T>): Equal<readonly T[]> {
  return (l, r) => {
    if (Object_is(l, r)) return true
    let length = l.length
    if (length !== r.length) return false
    for (let ix = length; ix-- !== 0;) {
      if (!deepEqualFn(l[ix], r[ix])) return false
    }
    return true
  }
}

array.writeable = function arrayEquals(x: F.Z.Array<Builder>): Builder {
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
      x._zod.def.element([LEFT_ITEM_IDENT], [RIGHT_ITEM_IDENT], IX),
      `}`,
    ].join('\n')
  }
}

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

record.writeable = function recordEquals(x: F.Z.Record<Builder>): Builder {
  return function continueRecordEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
    const LEFT_IDENT = ident(LEFT, IX.bindings)
    const RIGHT_IDENT = ident(RIGHT, IX.bindings)
    const LEFT_KEYS_IDENT = `${LEFT_IDENT}_keys`
    const RIGHT_KEYS_IDENT = `${RIGHT_IDENT}_keys`
    const LEFT_VALUE_IDENT = ident(`${LEFT_IDENT}[k]`, IX.bindings)
    const RIGHT_VALUE_IDENT = ident(`${RIGHT_IDENT}[k]`, IX.bindings)
    const LENGTH = ident('length', IX.bindings)
    return [
      `const ${LEFT_KEYS_IDENT} = Object.keys(${LEFT});`,
      `const ${RIGHT_KEYS_IDENT} = Object.keys(${RIGHT});`,
      `const ${LENGTH} = ${LEFT_KEYS_IDENT}.length;`,
      `if (${LENGTH} !== ${RIGHT_KEYS_IDENT}.length) return false;`,
      `for (let ix = 0; ix < ${LENGTH}; ix++) {`,
      `const k = ${LEFT_KEYS_IDENT}[ix];`,
      `if (!${RIGHT_KEYS_IDENT}.includes(k)) return false;`,
      `const ${LEFT_VALUE_IDENT} = ${LEFT}[k];`,
      `const ${RIGHT_VALUE_IDENT} = ${RIGHT}[k];`,
      x._zod.def.valueType([LEFT_VALUE_IDENT], [RIGHT_VALUE_IDENT], IX),
      `}`,
    ].join('\n')
  }
}

function union<T>(deepEqualFns: readonly Equal<T>[]): Equal<T> {
  return (l, r) => Object_is(l, r) || deepEqualFns.reduce((bool, deepEqualFn) => bool || deepEqualFn(l, r), false)
}

union.writeable = (
  x: F.Z.Union<Builder>,
  input: z.ZodUnion
): Builder => {
  if (!areAllObjects(input._zod.def.options)) {
    return unionEquals(x, input._zod.def.options)
  } else {
    const withTags = getTags(input._zod.def.options)
    return withTags === null
      ? unionEquals(x, input._zod.def.options)
      : disjunctiveEquals(x, withTags)
  }
}

function unionEquals(
  x: F.Z.Union<Builder>,
  options: readonly z.core.$ZodType[]
): Builder {
  return function continueUnionEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
    const SATISFIED = ident('satisfied', IX.bindings)
    const CHECKS = options
      .map((option, i) => [option, i] satisfies [any, any])
      .toSorted(schemaOrdering).map(([option, I]) => {
        const continuation = x._zod.def.options[I]
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
            check.writeable(option, { functionName: FUNCTION_NAME }),
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

function disjunctiveEquals(
  x: F.Z.Union<Builder>,
  [discriminant, TAGGED]: Discriminated
): Builder {
  return function continueDisjunctiveEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, false)
    const RIGHT = joinPath(RIGHT_PATH, false)
    const SATISFIED = ident('satisfied', IX.bindings)
    return [
      `let ${SATISFIED} = false;`,
      ...TAGGED.map(({ tag }, I) => {
        const TAG = stringifyLiteral(tag)
        const continuation = x._zod.def.options[I]
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

function intersection<L, R>(leftEquals: Equal<L>, rightEquals: Equal<R>): Equal<L & R> {
  return (l, r) => Object_is(l, r) || leftEquals(l, r) && rightEquals(l, r)
}

intersection.writeable = function intersectionEquals(x: F.Z.Intersection<Builder>): Builder {
  return function continueIntersectionEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
    return [
      x._zod.def.left([LEFT], [RIGHT], IX),
      x._zod.def.right([LEFT], [RIGHT], IX),
    ].join('\n')
  }
}

function tuple<T>(deepEqualFns: Equal<T>[], restEquals?: Equal<T>): Equal<readonly T[]> {
  return (l, r) => {
    if (Object_is(l, r)) return true
    if (l.length !== r.length) return false
    const len = deepEqualFns.length
    for (let ix = len; ix-- !== 0;) {
      const deepEqualFn = deepEqualFns[ix]
      if (!deepEqualFn(l[ix], r[ix])) return false
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

tuple.writeable = function tupleEquals(
  x: F.Z.Tuple<Builder>,
  input: z.ZodTuple
): Builder {
  return function continueTupleEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, false)   // `false` because `*_PATH` already takes optionality into account
    const RIGHT = joinPath(RIGHT_PATH, false) // `false` because `*_PATH` already takes optionality into account
    // if we got `z.tuple([])`, just check that the lengths are the same
    if (x._zod.def.items.length === 0) return `if (${LEFT}.length !== ${RIGHT}.length) return false`

    const LENGTH = ident('length', IX.bindings)
    const LEFT_ITEM_IDENT = ident(`${LEFT}_item`, IX.bindings)
    const RIGHT_ITEM_IDENT = ident(`${RIGHT}_item`, IX.bindings)
    const LENGTH_CHECK = !x._zod.def.rest ? null : [
      `const ${LENGTH} = ${LEFT}.length;`,
      `if (${LENGTH} !== ${RIGHT}.length) return false;`,
    ].join('\n')
    const FOR_LOOP = !x._zod.def.rest ? null : [
      `if (${LENGTH} > ${x._zod.def.items.length}) {`,
      `for (let ix = ${LENGTH}; ix-- !== ${x._zod.def.items.length};) {`,
      `const ${LEFT_ITEM_IDENT} = ${LEFT}[ix];`,
      `const ${RIGHT_ITEM_IDENT} = ${RIGHT}[ix];`,
      x._zod.def.rest?.([LEFT_ITEM_IDENT], [RIGHT_ITEM_IDENT], IX),
      `}`,
      `}`,
    ].join('\n')

    return [
      LENGTH_CHECK,
      ...x._zod.def.items.map((continuation, i) => {
        if (!isCompositeTypeName(input._zod.def.items[i]._zod.def.type)) {
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

function object<T, R>(deepEqualFns: { [x: string]: Equal<T> }, catchAllEquals?: Equal<T>): Equal<{ [x: string]: T }> {
  return (l, r) => {
    if (Object_is(l, r)) return true
    const lKeys = Object_keys(l)
    const rKeys = Object_keys(r)
    if (lKeys.length !== rKeys.length) return false
    const keysSet = catchAllEquals ? new Set(lKeys.concat(rKeys)) : null
    for (const k in deepEqualFns) {
      keysSet?.delete(k)
      const deepEqualFn = deepEqualFns[k]
      const lHas = Object_hasOwn(l, k)
      const rHas = Object_hasOwn(r, k)
      if (lHas) {
        if (!rHas) return false
        if (!deepEqualFn(l[k], r[k])) return false
      }
      if (rHas) {
        if (!lHas) return false
        if (!deepEqualFn(l[k], r[k])) return false
      }
      if (!deepEqualFn(l[k], r[k])) return false
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

object.writeable = function objectEquals(
  x: F.Z.Object<Builder>,
  input: z.ZodObject
): Builder {
  return function continueObjectEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, false)   // `false` because `*_PATH` already takes optionality into account
    const RIGHT = joinPath(RIGHT_PATH, false) // `false` because `*_PATH` already takes optionality into account
    const keys = Object_keys(x._zod.def.shape)
    // if we got `z.object({})`, just check that the number of keys are the same
    if (keys.length === 0) return `if (Object.keys(${LEFT}).length !== Object.keys(${RIGHT}).length) return false`

    const LENGTH = ident('length', IX.bindings)
    const LEFT_KEYS_IDENT = ident(`${LEFT_PATH}_keys`, IX.bindings)
    const KEY_IDENT = ident('key', IX.bindings)
    const KNOWN_KEY_CHECK = Object_keys(x._zod.def.shape).map((k) => `${KEY_IDENT} === ${stringifyKey(k)}`).join(' || ')
    const LEFT_VALUE_IDENT = ident(`${LEFT}_value`, IX.bindings)
    const RIGHT_VALUE_IDENT = ident(`${RIGHT}_value`, IX.bindings)
    const LENGTH_CHECK = !x._zod.def.catchall ? null : [
      `const ${LEFT_KEYS_IDENT} = Object.keys(${LEFT})`,
      `const ${LENGTH} = ${LEFT_KEYS_IDENT}.length`,
      `if (${LENGTH} !== Object.keys(${RIGHT}).length) return false`,
    ].join('\n')
    const FOR_LOOP = !x._zod.def.catchall ? null : [
      `for (let ix = ${LENGTH}; ix-- !== 0; ) {`,
      `const ${KEY_IDENT} = ${LEFT_KEYS_IDENT}[ix];`,
      `if (${KNOWN_KEY_CHECK}) continue;`,
      `const ${LEFT_VALUE_IDENT} = ${LEFT}[${KEY_IDENT}];`,
      `const ${RIGHT_VALUE_IDENT} = ${RIGHT}[${KEY_IDENT}];`,
      x._zod.def.catchall([LEFT_VALUE_IDENT], [RIGHT_VALUE_IDENT], { ...IX, isOptional: true }),
      `}`,
    ].join('\n')

    return [
      ...Object.entries(x._zod.def.shape).map(([key, continuation]) => {
        if (!isCompositeTypeName(input._zod.def.shape[key]._zod.def.type))
          return continuation([LEFT, key], [RIGHT, key], IX)
        else {
          const LEFT_ACCESSOR = joinPath([LEFT, key], IX.isOptional)
          const RIGHT_ACCESSOR = joinPath([RIGHT, key], IX.isOptional)
          return [
            `if (${LEFT_ACCESSOR} !== ${RIGHT_ACCESSOR}) {`,
            continuation([LEFT, key], [RIGHT, key], IX),
            `}`,
          ].join('\n')
        }
      }),
      LENGTH_CHECK,
      FOR_LOOP,
    ].filter((_) => _ !== null).join('\n')
  }
}

const fold = F.fold<Equal<never>>((x) => {
  switch (true) {
    default: return (void (x satisfies never), Object_is)
    case tagged('enum')(x):
    case F.isNullary(x): return defaults[x._zod.def.type]
    case tagged('custom')(x): return Object_is
    case tagged('lazy')(x): return x._zod.def.getter()
    case tagged('pipe')(x): return x._zod.def.out
    case tagged('catch')(x): return x._zod.def.innerType
    case tagged('readonly')(x): return x._zod.def.innerType
    case tagged('nonoptional')(x): return x._zod.def.innerType
    case tagged('default')(x): return x._zod.def.innerType
    case tagged('prefault')(x): return x._zod.def.innerType
    case tagged('success')(x): return x._zod.def.innerType
    case tagged('optional')(x): return optional.fromZod(x)
    case tagged('nullable')(x): return nullable.fromZod(x)
    case tagged('set')(x): return set.fromZod(x)
    case tagged('array')(x): return array.fromZod(x)
    case tagged('map')(x): return map.fromZod(x)
    case tagged('tuple')(x): return tuple.fromZod(x)
    case tagged('object')(x): return object.fromZod(x)
    case tagged('union')(x): return union.fromZod(x)
    case tagged('intersection')(x): return intersection.fromZod(x)
    case tagged('record')(x): return record.fromZod(x)
    case isUnsupported(x): return import('@traversable/zod-types').then(({ Invariant }) =>
      Invariant.Unimplemented(x._zod.def.type, 'zx.deepEqual')) as never
  }
})

const compileWriteable = F.compile<Builder>((x, ix, input) => {
  switch (true) {
    default: return (void (x satisfies never), writeableDefaults.never)
    case tagged('literal')(x): return literalEquals(x, ix)
    case tagged('enum')(x):
    case F.isNullary(x): return writeableDefaults[x._zod.def.type]
    case tagged('custom')(x): return SameValueOrFail
    case tagged('lazy')(x): return x._zod.def.getter()
    case tagged('pipe')(x): return x._zod.def.out
    case tagged('catch')(x): return x._zod.def.innerType
    case tagged('readonly')(x): return x._zod.def.innerType
    case tagged('default')(x): return x._zod.def.innerType
    case tagged('prefault')(x): return x._zod.def.innerType
    case tagged('success')(x): return x._zod.def.innerType
    case tagged('nonoptional')(x): return x._zod.def.innerType
    case tagged('optional')(x): return optional.writeable(x, input as z.ZodOptional)
    case tagged('nullable')(x): return nullable.writeable(x, input as z.ZodNullable)
    case tagged('set')(x): return set.writeable(x)
    case tagged('map')(x): return map.writeable(x)
    case tagged('array')(x): return array.writeable(x)
    case tagged('intersection')(x): return intersection.writeable(x)
    case tagged('tuple')(x): return tuple.writeable(x, input as z.ZodTuple)
    case tagged('union')(x): return union.writeable(x, input as z.ZodUnion)
    case tagged('object')(x): return object.writeable(x, input as z.ZodObject)
    case tagged('record')(x): return record.writeable(x)
    case isUnsupported(x): return import('@traversable/zod-types').then(({ Invariant }) =>
      Invariant.Unimplemented(x._zod.def.type, 'zx.deepEqual')) as never
  }
})

/**
 * ## {@link deepEqual `zx.deepEqual`}
 *
 * Derive a _"deep equal"_ function from a zod schema (v4, classic).
 *
 * A "deep equal" function" (see also, {@link Equal `Equal`}) is similar to
 * lodash's `isEqual` function, except more performant, because
 * when the shape of the values being compared is known ahead of time,
 * we can optimize ahead of time, and only check what's necessary.
 *
 * Note that the deep equal generated by {@link deepEqual `zx.deepEqual`}
 * **assumes that both values have already been validated**. Passing
 * unvalidated values to the function might result in undefined behavior.
 * 
 * See also:
 * - {@link deepEqual_writeable `zx.deepEqual.writeable`}
 * - {@link deepEqual_classic `zx.deepEqual.classic`}
 *
 * @example
 * import { z } from 'zod'
 * import { zx } from '@traversable/zod'
 * 
 * const Address = z.object({
 *   street1: z.string(),
 *   street2: z.optional(z.string()),
 *   city: z.string(),
 * })
 * 
 * const addressEquals = zx.deepEqual(Address)
 * 
 * addressEquals(
 *   { street1: '221B Baker St', city: 'London' },
 *   { street1: '221B Baker St', city: 'London' }
 * ) // => true
 * 
 * addressEquals(
 *   { street1: '221B Baker St', city: 'London' },
 *   { street1: '4 Privet Dr', city: 'Little Whinging' }
 * ) // => false
 */

export function deepEqual<T extends z.core.$ZodType>(type: T): Equal<z.infer<T>>
export function deepEqual<T extends z.core.$ZodType>(type: T) {
  const index = defaultIndex()
  const ROOT_CHECK = requiresObjectIs(type) ? `if (Object.is(l, r)) return true` : `if (l === r) return true`
  const BODY = compileWriteable(type)(['l'], ['r'], index)
  return F.isNullary(type) || tagged('enum', type)
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

deepEqual.writeable = deepEqual_writeable
deepEqual.classic = deepEqual_classic
deepEqual.unfuzzable = deepEqual_unfuzzable

export declare namespace deepEqual {
  type Options = toType.Options & {
    /**
     * Configure the name of the generated deepEqual function
     * @default "deepEqual"
     */
    functionName?: string
    /**
     * Whether to access global identifiers like `Date` from the `globalThis` namespace
     * @default false
     */
    useGlobalThis?: boolean
    /**
     * Whether to skip generating a type.
     * @default false
     */
    noType?: boolean
  }
  /**
   * ## {@link unsupported `deepEqual.Unsupported`}
   *
   * These are the schema types that {@link deepEqual `zx.deepEqual`} does not
   * support, either because they haven't been implemented yet, or because
   * we haven't found a reasonable interpretation of them in this context.
   *
   * If you'd like to see one of these supported or have an idea for how
   * it could be done, we'd love to hear from you!
   *
   * Here's the link to [raise an issue](https://github.com/traversable/schema/issues).
   */
  type Unsupported = typeof deepEqual_unsupported
}

/**
 * ## {@link deepEqual_classic `zx.deepEqual.classic`}
 *
 * Derive an in-memory _"deep equal"_ function from a zod schema (v4, classic).
 *
 * A "deep equal" function (see also, {@link Equal `Equal`}) is similar to
 * Lodash's `deepEquals` function, except more performant, because
 * when the shape of the values being compared is known ahead of time,
 * we can optimize ahead of time, and only check what's necessary.
 *
 * Note that the "deepEqual function" generated by {@link deepEqual `zx.deepEqual`}
 * **assumes that both values have already been validated**. Passing
 * unvalidated values to the function might result in undefined behavior.
 * 
 * See also:
 * - {@link deepEqual `zx.deepEqual`}
 * - {@link deepEqual_writeable `zx.deepEqual.writeable`}
 * 
 * @example
 * import { z } from 'zod'
 * import { zx } from '@traversable/zod'
 * 
 * const Address = z.object({
 *   street1: z.string(),
 *   street2: z.optional(z.string()),
 *   city: z.string(),
 * })
 * 
 * const addressEquals = zx.deepEqual(Address)
 * 
 * addressEquals(
 *   { street1: '221B Baker St', city: 'London' },
 *   { street1: '221B Baker St', city: 'London' }
 * ) // => true
 * 
 * addressEquals(
 *   { street1: '221B Baker St', city: 'London' },
 *   { street1: '4 Privet Dr', city: 'Little Whinging' }
 * ) // => false
 */

function deepEqual_classic<T extends z.ZodType | z.core.$ZodType>(type: T): Equal<z.infer<T>>
function deepEqual_classic(type: z.core.$ZodType): Equal<never> {
  return fold(type as never)
}

/**
 * ## {@link deepEqual_writeable `zx.deepEqual.writeable`}
 *
 * Derive a writeable (stringified) _"deep equal"_ function 
 * from a zod schema (v4, classic).
 *
 * A "deep equal" function (see also, {@link Equal `Equal`}) is similar to
 * Lodash's `isEqual` function, except more performant, because
 * when the shape of the values being compared is known ahead of time,
 * we can optimize ahead of time, and only check what's necessary.
 *
 * Note that the deep equal function generated by {@link deepEqual `zx.deepEqual`}
 * **assumes that both values have already been validated**. Passing
 * unvalidated values to the function might result in undefined behavior.
 * 
 * {@link deepEqual_writeable `zx.deepEqual.writeable`} accepts an optional
 * configuration object as its second argument; documentation for those
 * options are available via hover on autocompletion.
 * 
 * See also:
 * - {@link deepEqual `zx.deepEqual`}
 * - {@link deepEqual_classic `zx.deepEqual.classic`}
 *
 * @example
 * import { z } from 'zod'
 * import { zx } from '@traversable/zod'
 * 
 * const deepEqual = zx.deepEqual.writeable(
 *   z.object({
 *     street1: z.string(),
 *     street2: z.optional(z.string()),
 *     city: z.string(),
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

function deepEqual_writeable<T extends z.ZodType | z.core.$ZodType>(type: T, options?: deepEqual.Options): string {
  const index = { ...defaultIndex(), ...options } satisfies Scope
  const compiled = compileWriteable(type)(['l'], ['r'], index)
  const FUNCTION_NAME = options?.functionName ?? 'deepEqual'
  const inputType = options?.noType ? null : toType(type, options)
  const TYPE = options?.noType ? '' : `: ${options?.typeName ?? inputType}`
  const ROOT_CHECK = requiresObjectIs(type) ? `if (Object.is(l, r)) return true` : `if (l === r) return true`
  const BODY = compiled.length === 0 ? null : compiled
  return (
    F.isNullary(type) || tagged('enum', type)
      ? [
        options?.typeName === undefined ? null : inputType,
        `function ${FUNCTION_NAME} (l${TYPE}, r${TYPE}) {`,
        BODY,
        `return true;`,
        `}`,
      ]
      : [
        options?.typeName === undefined ? null : inputType,
        `function ${FUNCTION_NAME} (l${TYPE}, r${TYPE}) {`,
        ROOT_CHECK,
        BODY,
        `return true;`,
        `}`
      ]
  ).filter((_) => _ !== null).join('\n')
}

set.fromZod = <T>(x: F.Z.Set<Equal<T>>): Equal<Set<T>> => set(x._zod.def.valueType)
map.fromZod = <T>(x: F.Z.Map<Equal<T>>): Equal<Map<T, T>> => map(x._zod.def.keyType, x._zod.def.valueType)
array.fromZod = <T>(x: F.Z.Array<Equal<T>>): Equal<readonly T[]> => array(x._zod.def.element)
nullable.fromZod = <T>(x: F.Z.Nullable<Equal<T>>): Equal<T | null> => nullable(x._zod.def.innerType)
optional.fromZod = <T>(x: F.Z.Optional<Equal<T>>): Equal<T | undefined> => optional(x._zod.def.innerType)
tuple.fromZod = <T>(x: F.Z.Tuple<Equal<T>>): Equal<readonly T[]> => tuple(x._zod.def.items, x._zod.def.rest)
object.fromZod = <T>(x: F.Z.Object<Equal<T>>): Equal<{ [x: string]: T }> => object(x._zod.def.shape, x._zod.def.catchall)
union.fromZod = <T>(x: F.Z.Union<Equal<T>>): Equal<T> => union(x._zod.def.options)
intersection.fromZod = <T>(x: F.Z.Intersection<Equal<T>>): Equal<T> => intersection(x._zod.def.left, x._zod.def.right)
record.fromZod = <T>(x: F.Z.Record<Equal<T>>): Equal<Record<string, T>> => {
  const { keyType, valueType } = x._zod.def
  if (tagged('string', keyType)) return record(valueType)
  else return record(valueType, keyType)
}
