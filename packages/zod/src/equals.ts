import { z } from 'zod'
import type { Target } from '@traversable/registry'
import {
  Equal,
  ident,
  indexAccessor,
  keyAccessor,
  Object_is,
  Object_hasOwn,
  Object_keys,
  stringifyKey,
  intersectKeys,
} from '@traversable/registry'

import * as F from './functor.js'
import { check } from './check.js'
import { toType } from './to-type.js'
import { hasTypeName, tagged, TypeName } from './typename.js'

export type Path = (string | number)[]

export interface Scope extends F.CompilerIndex {
  identifiers: Map<string, string>
  useGlobalThis: equals.Options['useGlobalThis']
}

export type EqBuilder = (left: Path, right: Path, index: Scope) => string

const unsupported = [
  'custom',
  'default',
  'prefault',
  'promise',
  'success',
  'transform',
] as const satisfies any[]

type UnsupportedSchema = F.Z.Catalog[typeof unsupported[number]]

function isUnsupported(x: unknown): x is UnsupportedSchema {
  return hasTypeName(x) && unsupported.includes(x._zod.def.type as never)
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

function joinPath(path: (string | number)[], isOptional: boolean) {
  return path.reduce<string>
    ((xs, k, i) => i === 0 ? `${k}`
      : typeof k === 'number' ? `${xs}${indexAccessor(k, isOptional)}`
        : `${xs}${keyAccessor(k, isOptional)}`,
      ''
    )
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
  [TypeName.string]: Object_is,
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
} as const satisfies Record<string, EqBuilder>

function literalEquals(x: F.Z.Literal, ix: F.CompilerIndex): EqBuilder {
  return function continueLiteralEquals(LEFT, RIGHT, IX) {
    const { values } = x._zod.def
    return (
      values.every((v) => typeof v === 'number') ? SameNumberOrFail(LEFT, RIGHT, IX)
        : values.some((v) => typeof v === 'number') ? SameValueOrFail(LEFT, RIGHT, IX)
          : StrictlyEqualOrFail(LEFT, RIGHT, IX)
    )
  }
}

function nullable<T>(equalsFn: Equal<T>): Equal<T | null> {
  return (l, r) => Object_is(l, r) || equalsFn(l!, r!)
}

nullable.writeable = function nullableEquals(
  x: F.Z.Nullable<EqBuilder>,
  // ix: F.CompilerIndex,
  input: z.ZodNullable
): EqBuilder {
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

function optional<T>(equalsFn: Equal<T>): Equal<T | undefined> {
  return (l, r) => Object_is(l, r) || equalsFn(l!, r!)
}

optional.writeable = function optionalEquals(
  x: F.Z.Optional<EqBuilder>,
  input: z.ZodOptional
): EqBuilder {
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

function set<T>(equalsFn: Equal<T>): Equal<Set<T>> {
  return (l, r) => {
    if (Object_is(l, r)) return true
    else if (l?.size !== r?.size) return false
    else return array(equalsFn)(Array.from(l).sort(), Array.from(r).sort())
  }
}

set.writeable = function setEquals(x: F.Z.Set<EqBuilder>): EqBuilder {
  return function continueSetEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
    const LEFT_IDENT = ident(LEFT, IX.identifiers)
    const RIGHT_IDENT = ident(RIGHT, IX.identifiers)
    const LEFT_VALUES_IDENT = `${LEFT_IDENT}_values`
    const RIGHT_VALUES_IDENT = `${RIGHT_IDENT}_values`
    const LEFT_VALUE_IDENT = `${LEFT_IDENT}_value`
    const RIGHT_VALUE_IDENT = `${RIGHT_IDENT}_value`
    const LENGTH = ident('length', IX.identifiers)
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

map.writeable = function mapEquals(x: F.Z.Map<EqBuilder>): EqBuilder {
  return function continueMapEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT_ACCESSOR = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT_ACCESSOR = joinPath(RIGHT_PATH, IX.isOptional)
    const LEFT_IDENT = ident(LEFT_ACCESSOR, IX.identifiers)
    const RIGHT_IDENT = ident(RIGHT_ACCESSOR, IX.identifiers)
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

array.writeable = function arrayEquals(x: F.Z.Array<EqBuilder>): EqBuilder {
  return function continueArrayEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
    const LEFT_ITEM_IDENT = `${ident(LEFT, IX.identifiers)}_item`
    const RIGHT_ITEM_IDENT = `${ident(RIGHT, IX.identifiers)}_item`
    const LENGTH = ident('length', IX.identifiers)
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

record.writeable = function recordEquals(x: F.Z.Record<EqBuilder>): EqBuilder {
  return function continueRecordEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
    const LEFT_IDENT = ident(LEFT, IX.identifiers)
    const RIGHT_IDENT = ident(RIGHT, IX.identifiers)
    const LEFT_KEYS_IDENT = `${LEFT_IDENT}_keys`
    const RIGHT_KEYS_IDENT = `${RIGHT_IDENT}_keys`
    const LEFT_VALUE_IDENT = ident(`${LEFT_IDENT}[k]`, IX.identifiers)
    const RIGHT_VALUE_IDENT = ident(`${RIGHT_IDENT}[k]`, IX.identifiers)
    const LENGTH = ident('length', IX.identifiers)
    return [
      `const ${LEFT_KEYS_IDENT} = Object.keys(${LEFT});`,
      `const ${RIGHT_KEYS_IDENT} = Object.keys(${RIGHT});`,
      `const ${LENGTH} = ${LEFT_KEYS_IDENT}.length;`,
      `if (${LENGTH} !== ${RIGHT_KEYS_IDENT}.length) return false;`,
      `for (let ix = ${LENGTH}; ix-- !== 0;) {`,
      `const k = ${LEFT_KEYS_IDENT}[ix];`,
      `if (!${RIGHT_KEYS_IDENT}.includes(k)) return false;`,
      `const ${LEFT_VALUE_IDENT} = ${LEFT}[k];`,
      `const ${RIGHT_VALUE_IDENT} = ${RIGHT}[k];`,
      x._zod.def.valueType([LEFT_VALUE_IDENT], [RIGHT_VALUE_IDENT], IX),
      `}`,
    ].join('\n')
  }
}

function union<T>(equalsFns: readonly Equal<T>[]): Equal<T> {
  return (l, r) => Object_is(l, r) || equalsFns.reduce((bool, equalsFn) => bool || equalsFn(l, r), false)
}

const areAllObjects = (xs: readonly unknown[]) => xs.every((x) => tagged('object', x))

const getTags = (xs: readonly unknown[]): Discriminated | null => {
  if (!xs.every((x) => tagged('object', x))) {
    return null
  } else {
    const shapes = xs.map((x) => x._zod.def.shape)
    const discriminants = intersectKeys(...shapes)
    const [discriminant] = discriminants
    if (discriminants.length !== 1) return null
    else {
      let seen = new Set()
      const withTags = shapes.map((shape) => {
        const withTag = shape[discriminant]
        if (!tagged('literal', withTag)) {
          return null
        } else {
          if (withTag._zod.def.values.length !== 1) return null
          else {
            const [tag] = withTag._zod.def.values
            seen.add(tag)
            return { shape, tag }
          }
        }
      })
      if (withTags.every((_) => _ !== null) && withTags.length === seen.size) return [discriminant, withTags]
      else return null
    }
  }
}

type Tagged = {
  shape: Record<string, z.ZodType>
  tag: string | number | bigint | boolean | null | undefined
}

type Discriminated = [
  discriminant: string | number,
  tagged: Tagged[]
]

union.writeable = (
  x: F.Z.Union<EqBuilder>,
  input: z.ZodUnion
): EqBuilder => {
  if (!areAllObjects(input._zod.def.options)) {
    return unionEquals(x, input._zod.def.options)
  } else {
    const withTags = getTags(input._zod.def.options)
    return withTags === null
      ? unionEquals(x, input._zod.def.options)
      : disjunctiveEquals(x, withTags)
  }
}

const isSpecialCase = (x: unknown) =>
  tagged('date', x)
  || tagged('literal', x)
  || tagged('template_literal', x)

const isNumeric = (x: unknown) =>
  tagged('number', x)
  || tagged('int', x)
  || tagged('nan', x)

const isScalar = (x: unknown) =>
  tagged('boolean', x)
  || tagged('symbol', x)
  || tagged('bigint', x)
  || tagged('string', x)

const isNullish = (x: unknown) =>
  tagged('null', x)
  || tagged('undefined', x)
  || tagged('void', x)

const isTypelevelNullary = (x: unknown) =>
  tagged('any', x)
  || tagged('unknown', x)
  || tagged('never', x)

type Primitive = Target<typeof isPrimitive>
const isPrimitive = (x: unknown) =>
  isScalar(x)
  || isNumeric(x)
  || isSpecialCase(x)

function schemaOrdering(x: readonly [z.core.$ZodType, number], y: readonly [z.core.$ZodType, number]) {
  return isSpecialCase(x) ? -1 : isSpecialCase(y) ? 1
    : isNumeric(x) ? -1 : isNumeric(y) ? 1
      : isScalar(x) ? -1 : isScalar(y) ? 1
        : isTypelevelNullary(x) ? 1 : isTypelevelNullary(y) ? -1
          : isNullish(x) ? 1 : isNullish(y) ? -1
            : 0
}

function inlinePrimitiveCheck(x: Primitive, LEFT: string, RIGHT: string, IX: Scope) {
  switch (true) {
    default: return x satisfies never
    case tagged('int', x):
    case tagged('nan', x):
    case tagged('number', x): return `typeof ${LEFT} === 'number' && typeof ${RIGHT} === 'number'`
    case tagged('symbol', x): return `typeof ${LEFT} === 'symbol' && typeof ${RIGHT} === 'symbol'`
    case tagged('bigint', x): return `typeof ${LEFT} === 'bigint' && typeof ${RIGHT} === 'bigint'`
    case tagged('string', x): return `typeof ${LEFT} === 'string' && typeof ${RIGHT} === 'string'`
    case tagged('boolean', x): return `typeof ${LEFT} === 'boolean' && typeof ${RIGHT} === 'boolean'`
    case tagged('literal', x): return `${LEFT} === ${RIGHT}`
    case tagged('template_literal', x): return `${LEFT} === ${RIGHT}`
    case tagged('date', x): {
      const NS = IX.useGlobalThis ? 'globalThis.' : ''
      return `${LEFT} instanceof ${NS}Date && ${RIGHT} instanceof ${NS}Date`
    }
  }

}

function unionEquals(
  x: F.Z.Union<EqBuilder>,
  options: readonly z.core.$ZodType[]
): EqBuilder {
  return function continueUnionEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
    const SATISFIED = ident('satisfied', IX.identifiers)
    const CHECKS = options
      .map((option, i) => [option, i] satisfies [any, any])
      .toSorted(schemaOrdering).map(([option, I]) => {
        const continuation = x._zod.def.options[I]
        if (isPrimitive(option)) {
          return [
            `if (${inlinePrimitiveCheck(option, LEFT, RIGHT, IX)}) {`,
            continuation([LEFT], [RIGHT], IX),
            `${SATISFIED} = true;`,
            `}`,
          ].join('\n')

        } else {
          const FUNCTION_NAME = ident('check', IX.identifiers)
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
  x: F.Z.Union<EqBuilder>,
  [discriminant, TAGGED]: Discriminated
): EqBuilder {
  return function continueDisjunctiveEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, false)
    const RIGHT = joinPath(RIGHT_PATH, false)
    const SATISFIED = ident('satisfied', IX.identifiers)
    return [
      `let ${SATISFIED} = false;`,
      ...TAGGED.map(({ tag }, I) => {
        const TAG = typeof tag === 'string' ? stringifyKey(tag) : typeof tag === 'bigint' ? `${tag}n` : `${tag}`
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

intersection.writeable = function intersectionEquals(x: F.Z.Intersection<EqBuilder>): EqBuilder {
  return function continueIntersectionEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
    return [
      x._zod.def.left([LEFT], [RIGHT], IX),
      x._zod.def.right([LEFT], [RIGHT], IX),
    ].join('\n')
  }
}

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

tuple.writeable = function tupleEquals(
  x: F.Z.Tuple<EqBuilder>,
  input: z.ZodTuple
): EqBuilder {
  return function continueTupleEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, false)   // `false` because `*_PATH` already takes optionality into account
    const RIGHT = joinPath(RIGHT_PATH, false) // `false` because `*_PATH` already takes optionality into account
    // if we got `z.tuple([])`, just check that the lengths are the same
    if (x._zod.def.items.length === 0) return `if (${LEFT}.length !== ${RIGHT}.length) return false`

    const LENGTH = ident('length', IX.identifiers)
    const LEFT_ITEM_IDENT = ident(`${LEFT}_item`, IX.identifiers)
    const RIGHT_ITEM_IDENT = ident(`${RIGHT}_item`, IX.identifiers)
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

object.writeable = function objectEquals(
  x: F.Z.Object<EqBuilder>,
  input: z.ZodObject
): EqBuilder {
  return function continueObjectEquals(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, false)   // `false` because `*_PATH` already takes optionality into account
    const RIGHT = joinPath(RIGHT_PATH, false) // `false` because `*_PATH` already takes optionality into account
    const keys = Object_keys(x._zod.def.shape)
    // if we got `z.object({})`, just check that the number of keys are the same
    if (keys.length === 0) return `if (Object.keys(${LEFT}).length !== Object.keys(${RIGHT}).length) return false`

    const LENGTH = ident('length', IX.identifiers)
    const LEFT_KEYS_IDENT = ident(`${LEFT_PATH}_keys`, IX.identifiers)
    const KEY_IDENT = ident('key', IX.identifiers)
    const KNOWN_KEY_CHECK = Object_keys(x._zod.def.shape).map((k) => `${KEY_IDENT} === ${stringifyKey(k)}`).join(' || ')
    const LEFT_VALUE_IDENT = ident(`${LEFT}_value`, IX.identifiers)
    const RIGHT_VALUE_IDENT = ident(`${RIGHT}_value`, IX.identifiers)
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
    case tagged('lazy')(x): return x._zod.def.getter()
    case tagged('pipe')(x): return x._zod.def.out
    case tagged('catch')(x): return x._zod.def.innerType
    case tagged('readonly')(x): return x._zod.def.innerType
    case tagged('nonoptional')(x): return x._zod.def.innerType
    case tagged('optional')(x): return optional.fromZod(x)
    case tagged('nullable')(x): return nullable.fromZod(x)
    case tagged('set')(x): return set.fromZod(x)
    case tagged('array')(x): return array.fromZod(x)
    case tagged('map')(x): return map.fromZod(x)
    case tagged('tuple')(x): return tuple.fromZod(x)
    case tagged('object')(x): return object.fromZod(x)
    case tagged('union')(x): return union.fromZod(x)
    case tagged('intersection')(x): return intersection.fromZod(x)
    //   TODO: handle `keyType`?
    case tagged('record')(x): return record.fromZod(x)
    case isUnsupported(x): return import('./utils.js').then(({ Invariant }) =>
      Invariant.Unimplemented(x._zod.def.type, 'zx.equals')) as never
  }
})

const compileWriteable = F.compile<EqBuilder>((x, ix, input) => {
  switch (true) {
    default: return (void (x satisfies never), writeableDefaults.never)
    case tagged('literal')(x): return literalEquals(x, ix)
    case tagged('enum')(x):
    case F.isNullary(x): return writeableDefaults[x._zod.def.type]
    case tagged('lazy')(x): return x._zod.def.getter()
    case tagged('pipe')(x): return x._zod.def.out
    case tagged('catch')(x): return x._zod.def.innerType
    case tagged('readonly')(x): return x._zod.def.innerType
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
    case isUnsupported(x): return import('./utils.js').then(({ Invariant }) =>
      Invariant.Unimplemented(x._zod.def.type, 'zx.equals')) as never
  }
})

/**
 * ## {@link equals `zx.equals`}
 *
 * Derive an _equals function_ from a zod schema (v4, classic).
 *
 * An "equals function" (see also, {@link Equal `Equal`}) is similar to
 * lodash's `deepEquals` function, except more performant, because
 * when the shape of the values being compared is known ahead of time,
 * we can optimize ahead of time, and only check what's necessary.
 *
 * Note that the "equals function" generated by {@link equals `zx.equals`}
 * **assumes that both values have already been validated**. Passing
 * unvalidated values to the function might result in undefined behavior.
 * 
 * See also:
 * - {@link writeableEquals `zx.equals.writeable`}
 * - {@link classicEquals `zx.equals.classic`}
 *
 * @example
 * import { z } from 'zod'
 * import { zx } from '@traversable/zod'
 * 
 * const Address = z.object({
 *   street1: z.string(),
 *   strret2: z.optional(z.string()),
 *   city: z.string(),
 * })
 * 
 * const addressEquals = zx.equals(Address)
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

export function equals<T extends z.core.$ZodType>(type: T): Equal<z.infer<T>>
export function equals<T extends z.core.$ZodType>(type: T) {
  const index = { useGlobalThis: false, ...F.defaultIndex, identifiers: new Map() }
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

equals.writeable = writeableEquals
equals.classic = classicEquals
equals.unsupported = unsupported

declare namespace equals {
  type Options = toType.Options & {
    /**
     * Configure the name of the generated equals function
     * @default "equals"
     */
    functionName?: string
    /**
     * Whether to access global identifiers like `Date` from the `globalThis` namespace
     * @default false
     */
    useGlobalThis?: boolean
  }
  /**
   * ## {@link unsupported `equals.Unsupported`}
   *
   * These are the schema types that {@link equals `zx.equals`} does not
   * support, either because they haven't been implemented yet, or because
   * we haven't found a reasonable interpretation of them in this context.
   *
   * If you'd like to see one of these supported or have an idea for how
   * it could be done, we'd love to hear from you!
   *
   * Here's the link to [raise an issue](https://github.com/traversable/schema/issues).
   */
  type Unsupported = typeof unsupported
}

/**
 * ## {@link classicEquals `zx.equals.classic`}
 *
 * Derive an in-memory _equals function_ from a zod schema (v4, classic).
 *
 * An "equals function" (see also, {@link Equal `Equal`}) is similar to
 * lodash's `deepEquals` function, except more performant, because
 * when the shape of the values being compared is known ahead of time,
 * we can optimize ahead of time, and only check what's necessary.
 *
 * Note that the "equals function" generated by {@link equals `zx.equals`}
 * **assumes that both values have already been validated**. Passing
 * unvalidated values to the function might result in undefined behavior.
 * 
 * See also:
 * - {@link equals `zx.equals`}
 * - {@link writeableEquals `zx.equals.writeable`}
 * 
 * @example
 * import { z } from 'zod'
 * import { zx } from '@traversable/zod'
 * 
 * const Address = z.object({
 *   street1: z.string(),
 *   strret2: z.optional(z.string()),
 *   city: z.string(),
 * })
 * 
 * const addressEquals = zx.equals(Address)
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

function classicEquals<T extends z.core.$ZodType>(type: T): Equal<z.infer<T>>
function classicEquals(type: z.core.$ZodType): Equal<never> {
  return fold(type as never)
}

/**
 * ## {@link writeableEquals `zx.equals.writeable`}
 *
 * Derive a "writeable" (stringified) _equals function_ 
 * from a zod schema (v4, classic).
 *
 * An "equals function" (see also, {@link Equal `Equal`}) is similar to
 * lodash's `deepEquals` function, except more performant, because
 * when the shape of the values being compared is known ahead of time,
 * we can optimize ahead of time, and only check what's necessary.
 *
 * Note that the "equals function" generated by {@link equals `zx.equals`}
 * **assumes that both values have already been validated**. Passing
 * unvalidated values to the function might result in undefined behavior.
 * 
 * {@link writeableEquals `zx.equals.writeable`} accepts an optional
 * configuration object as its second argument; documentation for those
 * options are available via hover on autocompletion.
 * 
 * See also:
 * - {@link equals `zx.equals`}
 * - {@link classicEquals `zx.equals.classic`}
 *
 * @example
 * import { z } from 'zod'
 * import { zx } from '@traversable/zod'
 * 
 * const Address = z.object({
 *   street1: z.string(),
 *   strret2: z.optional(z.string()),
 *   city: z.string(),
 * })
 * 
 * const addressEquals = zx.equals.writeable(Address)
 * 
 * console.log(addressEquals) 
 * // =>
 * // function equals(
 * //   x: { street1: string; street2?: string; city: string; },
 * //   y: { street1: string; street2?: string; city: string; }
 * // ) => {
 * //   if (x === y) return true;
 * //   if (x.street1 !== y.street1) return false;
 * //   if (x.street2 !== y.street2) return false;
 * //   if (x.city !== y.city) return false;
 * //   return true;
 * // }
 */

function writeableEquals<T extends z.core.$ZodType>(type: T, options?: equals.Options): string
function writeableEquals(type: z.core.$ZodType, options?: equals.Options) {
  const index = { useGlobalThis: options?.useGlobalThis, ...F.defaultIndex, identifiers: new Map() }
  const compiled = compileWriteable(type)(['l'], ['r'], index)
  const FUNCTION_NAME = options?.functionName ?? 'equals'
  const inputType = toType(type, options)
  const TYPE = options?.typeName ?? inputType
  const ROOT_CHECK = requiresObjectIs(type) ? `if (Object.is(l, r)) return true` : `if (l === r) return true`
  const BODY = compiled.length === 0 ? null : compiled
  return (
    F.isNullary(type) || tagged('enum', type)
      ? [
        options?.typeName === undefined ? null : inputType,
        `function ${FUNCTION_NAME} (l: ${TYPE}, r: ${TYPE}) {`,
        BODY,
        `return true;`,
        `}`,
      ]
      : [
        options?.typeName === undefined ? null : inputType,
        `function ${FUNCTION_NAME} (l: ${TYPE}, r: ${TYPE}) {`,
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
