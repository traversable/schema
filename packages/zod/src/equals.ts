import { z } from 'zod/v4'
import {
  Equal,
  fn,
  Object_is,
  Object_hasOwn,
  Object_keys,
  parseKey,
} from '@traversable/registry'

import * as F from './functor.js'
import { tagged, TypeName } from './typename.js'
import { indexAccessor, isOptional, keyAccessor } from './utils.js'
import { toType } from './to-type.js'

export type EqBuilder = (l: string, r: string, ix: F.EqCompilerIndex) => string

const neverEqual = (() => false) satisfies Equal<never>

const createIdentifier = (x: string) => {
  const out = x.replace(/[^$_a-zA-Z]/, '_').replaceAll(/[^$_a-zA-Z0-9]/g, '_')
  return out.length === 0 ? '_' : out
}

const ident = (x: string, set: Map<string, string>) => {
  const original = x
  x = createIdentifier(x)
  let count = 1
  while (set.has(x))
    x = `${x}${count++}`
  set.set(original, x)
  set.set(x, original)
  return x
}

const WriteableObjectIs = (l: string, r: string) => `Object.is(${l}, ${r})`

export const defaults = {
  [TypeName.unknown]: Object_is,
  [TypeName.any]: Object_is,
  [TypeName.never]: neverEqual,
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
  [TypeName.date]: ((l, r) => l?.getTime() === r?.getTime()) satisfies Equal<Date>,
  [TypeName.file]: Object_is,
  [TypeName.enum]: Object_is,
  [TypeName.success]: Object_is,
  [TypeName.template_literal]: Object_is,
} as const

export const writeableDefaults = {
  [TypeName.never]: function writableNeverEq() { return 'false' },
  [TypeName.any]: function writableAnyEq() { return 'true' },
  [TypeName.unknown]: function writableUnknownEq() { return 'true' },
  [TypeName.void]: function writeableVoidEq(l, r) { return `Object.is(${l}, ${r})` },
  [TypeName.undefined]: function writeableUndefinedEq(l, r) { return `Object.is(${l}, ${r})` },
  [TypeName.null]: function writableNullEq(l, r) { return `Object.is(${l}, ${r})` },
  [TypeName.symbol]: function writableSymbolEq(l, r) { return `Object.is(${l}, ${r})` },
  [TypeName.boolean]: function writableBooleanEq(l, r) { return `Object.is(${l}, ${r})` },
  [TypeName.nan]: function writableNaNEq(l, r) { return `Object.is(${l}, ${r})` },
  [TypeName.int]: function writableIntEq(l, r) { return `Object.is(${l}, ${r})` },
  [TypeName.bigint]: function writableBigIntEq(l, r) { return `Object.is(${l}, ${r})` },
  [TypeName.number]: function writableNumberEq(l, r) { return `Object.is(${l}, ${r})` },
  [TypeName.string]: function writableStringEq(l, r) { return `Object.is(${l}, ${r})` },
  [TypeName.enum]: function writableEnumEq(l, r) { return `Object.is(${l}, ${r})` },
  [TypeName.literal]: function writableLiteralEq(l, r) { return `Object.is(${l}, ${r})` },
  [TypeName.template_literal]: function writableTemplateLiteralEq(l, r) { return `Object.is(${l}, ${r})` },
  [TypeName.file]: function writableFileEq(l, r) { return `Object.is(${l}, ${r})` },
  [TypeName.date]: function writableDateEq(l, r) { return `${l}?.getTime() === ${r}?.getTime()` },
  [TypeName.success]: function writableSuccessEq(l, r) { return `Object.is(${l}, ${r})` },
} as const satisfies Record<string, EqBuilder>

const setGuard = (eqBuilder: EqBuilder): EqBuilder => (L, R, ix) => `${L} instanceof Set && ${R} instanceof Set && ${eqBuilder(L, R, ix)}`
const mapGuard = (eqBuilder: EqBuilder): EqBuilder => (L, R, ix) => `${L} instanceof Map && ${R} instanceof Map && ${eqBuilder(L, R, ix)}`
const arrayGuard = (eqBuilder: EqBuilder): EqBuilder => (L, R, ix) => `Array.isArray(${L}) && Array.isArray(${R}) && ${eqBuilder(L, R, ix)}`
const objectGuard = (eqBuilder: EqBuilder): EqBuilder => (L, R, ix) =>
  `!!${L} && typeof ${L} === 'object' && !Array.isArray(${L}) && !!${R} && typeof ${R} === 'object' && !Array.isArray(${R}) && ${eqBuilder(L, R, ix)}`

function union<T>(equalsFns: readonly Equal<T>[]): Equal<T> {
  return (l, r) => Object_is(l, r) || equalsFns.reduce((bool, equalsFn) => bool || equalsFn(l, r), false)
}


union.writeable = function unionEqBuilder(x: F.Z.Union<EqBuilder>, ix: F.EqCompilerIndex, input: z.ZodUnion): EqBuilder {
  return function writeableUnionEquals(LEFT, RIGHT, IX) {
    const BODY = x._zod.def.options.map((option, i) => {
      const schema = input._zod.def.options[i]
      switch (true) {
        case tagged('array', schema): return `(${arrayGuard(option)(LEFT, RIGHT, IX)})`
        case tagged('tuple', schema): return `(${arrayGuard(option)(LEFT, RIGHT, IX)})`
        case tagged('object', schema): return `(${objectGuard(option)(LEFT, RIGHT, IX)})`
        case tagged('record', schema): return `(${objectGuard(option)(LEFT, RIGHT, IX)})`
        case tagged('set', schema): return `(${setGuard(option)(LEFT, RIGHT, IX)})`
        case tagged('map', schema): return `(${mapGuard(option)(LEFT, RIGHT, IX)})`
        default: return `(${option(LEFT, RIGHT, IX)})`
      }
    })
    return BODY.length === 0
      ? `Object.is(${LEFT}, ${RIGHT})`
      : `Object.is(${LEFT}, ${RIGHT}) || (${BODY.join(' || ')})`
  }
}

function intersection<L, R>(leftEquals: Equal<L>, rightEquals: Equal<R>): Equal<L & R> {
  return (l, r) => Object_is(l, r) || leftEquals(l, r) && rightEquals(l, r)
}


intersection.writeable = function intersectionEqBuilder(
  x: F.Z.Intersection<EqBuilder>,
  ix: F.EqCompilerIndex
): EqBuilder {
  return function writeableIntersectionEquals(LEFT, RIGHT, IX) {
    return `Object.is(${LEFT}, ${RIGHT}) || (${x._zod.def.left(LEFT, RIGHT, IX)} && ${x._zod.def.right(LEFT, RIGHT, IX)})`
  }
}

function set<T>(equalsFn: Equal<T>): Equal<Set<T>> {
  return (l, r) => {
    if (Object_is(l, r)) return true
    else if (l.size !== r.size) return false
    else return array(equalsFn)(Array.from(l).sort(), Array.from(r).sort())
  }
}


set.writeable = function setEqBuilder(x: F.Z.Set<EqBuilder>, ix: F.EqCompilerIndex): EqBuilder {
  return function writeableSetEquals(LEFT, RIGHT, IX) {
    const PAD_0 = ' '.repeat(ix.depth * 2)
    const PAD_2 = ' '.repeat(ix.depth * 2 + 2)
    const PAD_4 = ' '.repeat(ix.depth * 2 + 4)
    return [
      `Object.is(${LEFT}, ${RIGHT}) || (${LEFT}.size === ${RIGHT}.size && (() => {`,
      `${PAD_2}const ${LEFT}Values = Array.from(${LEFT}).sort()`,
      `${PAD_2}const ${RIGHT}Values = Array.from(${RIGHT}).sort()`,
      `${PAD_2}for (let ix = 0, len = ${LEFT}Values.length; ix < len; ix++) {`,
      `${PAD_4}const ${LEFT}Value = ${LEFT}Values[ix]`,
      `${PAD_4}const ${RIGHT}Value = ${RIGHT}Values[ix]`,
      `${PAD_4}if (!${x._zod.def.valueType(`${LEFT}Value`, `${RIGHT}Value`, ix)}) return false`,
      `${PAD_2}}`,
      `${PAD_2}return true`,
      `${PAD_0}})())`,
    ].filter((_) => _ !== null).join('\n')
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

map.writeable = function mapEqBuilder(x: F.Z.Map<EqBuilder>, ix: F.EqCompilerIndex): EqBuilder {
  return function writeableMapEquals(LEFT, RIGHT, IX) {
    const PAD_0 = ' '.repeat(ix.depth * 2)
    const PAD_2 = ' '.repeat(ix.depth * 2 + 2)
    const PAD_4 = ' '.repeat(ix.depth * 2 + 4)
    return [
      `Object.is(${LEFT}, ${RIGHT}) || (${LEFT}.size === ${RIGHT}.size && (() => {`,
      `${PAD_2}const ${LEFT}Entries = Array.from(${LEFT}).sort()`,
      `${PAD_2}const ${RIGHT}Entries = Array.from(${RIGHT}).sort()`,
      `${PAD_2}for (let ix = 0, len = ${LEFT}Entries.length; ix < len; ix++) {`,
      `${PAD_4}const [${LEFT}Key, ${LEFT}Value] = ${LEFT}Entries[ix]`,
      `${PAD_4}const [${RIGHT}Key, ${RIGHT}Value] = ${RIGHT}Entries[ix]`,
      `${PAD_4}if (!${x._zod.def.keyType(`${LEFT}Key`, `${RIGHT}Key`, ix)}) return false`,
      `${PAD_4}if (!${x._zod.def.valueType(`${LEFT}Value`, `${RIGHT}Value`, ix)}) return false`,
      `${PAD_2}}`,
      `${PAD_2}return true`,
      `${PAD_0}})())`,
    ].filter((_) => _ !== null).join('\n')
  }
}

function nullable<T>(equalsFn: Equal<T>): Equal<T | null> {
  return (l, r) => Object_is(l, r) || equalsFn(l!, r!)
}

nullable.writeable = function nullableEqBuilder(x: F.Z.Nullable<EqBuilder>, ix: F.EqCompilerIndex): EqBuilder {
  return function writeableNullableEquals(LEFT, RIGHT, IX) {
    return `Object.is(${LEFT}, ${RIGHT}) || ${x._zod.def.innerType(LEFT, RIGHT, ix)}` // IX?
  }
}

function optional<T>(equalsFn: Equal<T>): Equal<T | undefined> {
  return (l, r) => Object_is(l, r) || equalsFn(l!, r!)
}

optional.writeable = function optionalEqBuilder(x: F.Z.Optional<EqBuilder>, ix: F.EqCompilerIndex): EqBuilder {
  return function writeableOptionalEquals(LEFT, RIGHT, IX) {
    return `Object.is(${LEFT}, ${RIGHT}) || ${x._zod.def.innerType(LEFT, RIGHT, ix)}` // IX?
  }
}

function array<T>(equalsFn: Equal<T>): Equal<readonly T[]> {
  return (l, r) => {
    if (Object_is(l, r)) return true
    let len = l.length
    if (len !== r.length) return false
    for (let ix = len; ix-- !== 0;) {
      if (!equalsFn(l[ix], r[ix])) return false
    }
    return true
  }
}

array.writeable = function arrayEqBuilder(x: F.Z.Array<EqBuilder>, ix: F.EqCompilerIndex): EqBuilder {
  return function writeableArrayEquals(LEFT, RIGHT, IX) {
    const buildEq = x._zod.def.element
    const NEXT_LEFT = `l${ix.depth}`
    const NEXT_RIGHT = `r${ix.depth}`
    const PAD_0 = ' '.repeat(ix.depth * 2)
    const PAD_2 = ' '.repeat(ix.depth * 2 + 2)
    return [
      `${LEFT}.length === ${RIGHT}.length && ${LEFT}.every(`,
      `${PAD_0}(${NEXT_LEFT}, i) => {`,
      `${PAD_2}const ${NEXT_RIGHT} = ${RIGHT}[i];`,
      `${PAD_2}return ${buildEq(NEXT_LEFT, NEXT_RIGHT, ix)}`,
      `${PAD_0}})`
    ].join('\n')
  }
}

function record<T>(valueEqualsFn: Equal<T>): Equal<Record<string, T>> {
  return (l, r) => {
    if (Object_is(l, r)) return true
    const lhs = Object_keys(l)
    const rhs = Object_keys(r)
    let len = lhs.length
    let k: string
    if (len !== rhs.length) return false
    for (let ix = len; ix-- !== 0;) {
      k = lhs[ix]
      if (!Object_hasOwn(r, k)) return false
      if (!(valueEqualsFn(l[k], r[k]))) return false
    }
    len = rhs.length
    for (let ix = len; ix-- !== 0;) {
      k = rhs[ix]
      if (!Object_hasOwn(l, k)) return false
      if (!(valueEqualsFn(l[k], r[k]))) return false
    }
    return true
  }
}

record.writeable = function recordEqBuilder(x: F.Z.Record<EqBuilder>, ix: F.EqCompilerIndex): EqBuilder {
  return function writeableRecordEquals(LEFT, RIGHT, IX) {
    const PAD_0 = ' '.repeat(ix.depth * 2)
    const PAD_2 = ' '.repeat(ix.depth * 2 + 2)
    const PAD_4 = ' '.repeat(ix.depth * 2 + 4)
    const NEXT_LEFT = `l${ix.depth}`
    const NEXT_RIGHT = `r${ix.depth}`
    const NEXT_KEY = `k${ix.depth}`
    const LEFT_KEYS = `${LEFT}Keys`
    const RIGHT_KEYS = `${RIGHT}Keys`
    return [
      `Object.is(${LEFT}, ${RIGHT}) || (() => {`,
      `${PAD_0}const ${LEFT_KEYS} = Object.keys(${LEFT})`,
      `${PAD_0}const ${RIGHT_KEYS} = Object.keys(${RIGHT})`,
      `${PAD_0}return ${LEFT_KEYS}.length === ${RIGHT_KEYS}.length && `,
      `${PAD_0}(${LEFT_KEYS}.every((${NEXT_KEY}) => {`,
      `${PAD_2}const ${NEXT_LEFT} = ${LEFT}[${NEXT_KEY}]`,
      `${PAD_2}if (!Object.hasOwn(${RIGHT}, ${NEXT_KEY})) return false`,
      `${PAD_2}else {`,
      `${PAD_4}const ${NEXT_RIGHT} = ${RIGHT}[${NEXT_KEY}]`,
      `${PAD_4}return ${x._zod.def.valueType(NEXT_LEFT, NEXT_RIGHT, ix)}`,
      `${PAD_2}}`,
      `${PAD_0}}))`,
      `})()`,
    ].join('\n')
  }
}

function object<T, R>(equalsFns: { [x: string]: Equal<T> }, catchAllEquals?: Equal<T>): Equal<{ [x: string]: T }> {
  return (l, r) => {
    if (Object_is(l, r)) return true
    const lhs = Object_keys(l)
    const rhs = Object_keys(r)
    if (lhs.length !== rhs.length) return false
    const keysSet = catchAllEquals ? new Set(lhs.concat(rhs)) : null
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

object.writeable = function objectEqBuilder(
  x: F.Z.Object<EqBuilder>,
  ix: F.EqCompilerIndex,
  input: z.ZodObject
): EqBuilder {
  const PAD_0 = ' '.repeat(ix.depth * 2)
  const PAD_2 = ' '.repeat(ix.depth * 2 + 2)
  const PAD_4 = ' '.repeat(ix.depth * 2 + 4)
  const PAD_6 = ' '.repeat(ix.depth * 2 + 6)
  return function writeableObjectEquals(LEFT, RIGHT, IX) {
    const { shape, catchall } = x._zod.def
    const entries = Object.entries(input._zod.def.shape)
    const keys = Object.keys(shape)
    const seen = new Map<string, string>()
    const lookup = fn.map(shape, (v, k) => ({ id: ident(k, seen), v }))
    const REQ_KEYS = entries.filter(([, v]) => !isOptional(v)).map(([k]) => [k, lookup[k].id] satisfies [any, any])
    const OPT_KEYS = entries.filter(([, v]) => isOptional(v)).map(([k]) => [k, lookup[k].id] satisfies [any, any])
    const builders = Object.entries(lookup).map(([KEY, { v, id }]) => `(${v(`${LEFT}${id}`, `${RIGHT}${id}`, ix)})`)
    const assignments = [
      ...REQ_KEYS.map(([ORIGINAL, DEDUP]) => [
        `${PAD_2}${LEFT}${DEDUP} = ${LEFT}${keyAccessor(ORIGINAL, ix.isOptional)}`,
        `${PAD_2}${RIGHT}${DEDUP} = ${RIGHT}${keyAccessor(ORIGINAL, ix.isOptional)}`,
      ].join(',\n')),
      ...OPT_KEYS.map(([ORIGINAL, DEDUP]) => [
        `${PAD_2}${LEFT}${DEDUP} = ${LEFT}${keyAccessor(ORIGINAL, true)}`,
        `${PAD_2}${RIGHT}${DEDUP} = ${RIGHT}${keyAccessor(ORIGINAL, true)}`,
      ].join(',\n')),
    ].join(',\n')
    const ASSIGNMENTS = assignments.length === 0
      ? []
      : [`${PAD_0}const`, assignments]
    const CATCH_ALL_KEYS = catchall === undefined ? null : [
      `${PAD_0}const knownKeys_${ix.depth} = ${keys.length === 0 ? '{}' : `{ ${keys.map((k) => `"${parseKey(k)}": true`).join(', ')} }`}`,
      `${PAD_0}const allKeys = new Set(Object.keys(${LEFT}).concat(Object.keys(${RIGHT})))`,
    ].join('\n')
    const CATCH_ALL = catchall === undefined ? null : [
      `${PAD_2}&& Array.from(allKeys).every((key) => {`,
      `${PAD_4}if (knownKeys_${ix.depth}[key]) return true`,
      `${PAD_4}else {`,
      `${PAD_6}const ${LEFT}Value = ${LEFT}[key]`,
      `${PAD_6}const ${RIGHT}Value = ${RIGHT}[key]`,
      `${PAD_6}return ${catchall(`${LEFT}Value`, `${RIGHT}Value`, ix)}`,
      `${PAD_4}}`,
      `${PAD_2}})`,
    ].join('\n')
    const BODY = builders.length === 0
      ? `${PAD_0}return Object.keys(${LEFT}).length === 0 && Object.keys(${RIGHT}).length === 0`
      : `${PAD_0}return ${builders.join(' && ')}`

    return [
      `Object.is(${LEFT}, ${RIGHT}) || (() => {`,
      ...ASSIGNMENTS,
      CATCH_ALL_KEYS,
      BODY,
      CATCH_ALL,
      `})()`,
    ].filter((_) => _ !== null).join('\n')
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

tuple.writeable = function tupleEqBuilder(
  x: F.Z.Tuple<EqBuilder>,
  ix: F.EqCompilerIndex,
): EqBuilder {
  const PAD_0 = ' '.repeat(ix.depth * 2)
  const PAD_2 = ' '.repeat(ix.depth * 2 + 2)
  return function writeableTupleEquals(LEFT, RIGHT, IX) {
    const { items, rest } = x._zod.def
    const REQ = items.filter((v) => !isOptional(v))
    const OPT = items.filter((v) => isOptional(v))
    const builders = items.map((builder, I) => `(${builder(`${LEFT}${I}`, `${RIGHT}${I}`, ix)})`)
    if (rest === undefined) {
      const assignments = [
        ...REQ.map((_, I) => [
          `${PAD_2}${LEFT}${I} = ${LEFT}${indexAccessor(I, ix.isOptional)}`,
          `${PAD_2}${RIGHT}${I} = ${RIGHT}${indexAccessor(I, ix.isOptional)}`,
        ].join(',\n')),
        ...OPT.map((_, I) => [
          `${PAD_2}${LEFT}${I} = ${LEFT}${indexAccessor(I, true)}`,
          `${PAD_2}${RIGHT}${I} = ${RIGHT}${indexAccessor(I, true)}`,
        ].join(',\n')),
      ].join(',\n')
      const ASSIGNMENTS = assignments.length === 0 ? [] : [`${PAD_0}const`, assignments]
      const BODY = `${PAD_0}return ${builders.join(' && ')}`

      if (builders.length === 0)
        return `Object.is(${LEFT}, ${RIGHT}) || ${LEFT}.length === 0 && ${RIGHT}.length === 0`
      else
        return [
          `Object.is(${LEFT}, ${RIGHT}) || (${LEFT}.length === ${RIGHT}.length && (() => {`,
          ...ASSIGNMENTS,
          BODY,
          `})())`,
        ].filter((_) => _ !== null).join('\n')
    } else {
      const assignments = [
        ...REQ.map((_, I) => [
          `${PAD_2}${LEFT}${I} = ${LEFT}${indexAccessor(I, ix.isOptional)}`,
          `${PAD_2}${RIGHT}${I} = ${RIGHT}${indexAccessor(I, ix.isOptional)}`,
        ].join(',\n')),
      ].join(',\n')
      const ASSIGNMENTS = assignments.length === 0
        ? []
        : [`${PAD_0}const`, assignments]
      const HEADER = REQ.map(
        (builder, I) => `${PAD_0}if (!${builder(`${LEFT}${I}`, `${RIGHT}${I}`, ix)}) return false`
      ).join('\n')

      const FOR_LOOP = [
        `${PAD_0}for (let ix = ${REQ.length}, len = ${LEFT}.length; ix < len; ix++) {`,
        `${PAD_2}const ${LEFT}Value = ${LEFT}[ix]`,
        `${PAD_2}const ${RIGHT}Value = ${RIGHT}[ix]`,
        `${PAD_2}if (!(${rest(`${LEFT}Value`, `${RIGHT}Value`, ix)})) return false`,
        `${PAD_0}}`,
        `${PAD_0}return true`,
      ].filter((_) => _ !== null).join('\n')

      return [
        `Object.is(${LEFT}, ${RIGHT}) || (${LEFT}.length === ${RIGHT}.length && (() => {`,
        ...ASSIGNMENTS,
        HEADER,
        FOR_LOOP,
        `})())`,
      ].filter((_) => _ !== null).join('\n')
    }
  }
}

const fold = F.fold<Equal<any>>((x) => {
  switch (true) {
    default: return (void (x satisfies never), neverEqual)
    case tagged('success')(x):
    case tagged('enum')(x):
    case F.isNullary(x): return defaults[x._zod.def.type]
    case tagged('lazy')(x): return x._zod.def.getter()
    case tagged('pipe')(x): return x._zod.def.out
    case tagged('catch')(x): return x._zod.def.innerType
    case tagged('default')(x): return x._zod.def.innerType
    case tagged('prefault')(x): return x._zod.def.innerType
    case tagged('readonly')(x): return x._zod.def.innerType
    case tagged('nonoptional')(x): return x._zod.def.innerType
    case tagged('optional')(x): return optional.fromZod(x)
    case tagged('nullable')(x): return nullable.fromZod(x)
    case tagged('set')(x): return set.fromZod(x)
    case tagged('array')(x): return array.fromZod(x)
    case tagged('map')(x): return map.fromZod(x)
    case tagged('record')(x): return record.fromZod(x)
    case tagged('tuple')(x): return tuple.fromZod(x)
    case tagged('object')(x): return object.fromZod(x)
    case tagged('union')(x): return union.fromZod(x)
    case tagged('intersection')(x): return intersection.fromZod(x)
    // not supported
    case tagged('custom')(x): return import('./utils.js').then(({ Invariant }) => Invariant.Unimplemented('custom', 'zx.equals')) as never
    case tagged('promise')(x): return import('./utils.js').then(({ Invariant }) => Invariant.Unimplemented('promise', 'zx.equals')) as never
    case tagged('transform')(x): return import('./utils.js').then(({ Invariant }) => Invariant.Unimplemented('transform', 'zx.equals')) as never
  }
})

const compile = F.compileEq<EqBuilder>((x, ix, input) => {
  switch (true) {
    default: return (void (x satisfies never), writeableDefaults.never)
    case tagged('enum')(x):
    case tagged('success')(x):
    case F.isNullary(x): return writeableDefaults[x._zod.def.type]
    case tagged('lazy')(x): return x._zod.def.getter()
    case tagged('pipe')(x): return x._zod.def.out
    case tagged('catch')(x): return x._zod.def.innerType
    case tagged('default')(x): return x._zod.def.innerType
    case tagged('prefault')(x): return x._zod.def.innerType
    case tagged('readonly')(x): return x._zod.def.innerType
    case tagged('nonoptional')(x): return x._zod.def.innerType
    case tagged('optional')(x): return optional.writeable(x, ix)
    case tagged('nullable')(x): return nullable.writeable(x, ix)
    case tagged('set')(x): return set.writeable(x, ix)
    case tagged('map')(x): return map.writeable(x, ix)
    case tagged('array')(x): return array.writeable(x, ix)
    // TODO: handle `keyType`
    case tagged('record')(x): return record.writeable(x, ix)
    case tagged('intersection')(x): return intersection.writeable(x, ix)
    case tagged('tuple')(x): return tuple.writeable(x, ix)
    case tagged('union')(x): return union.writeable(x, ix, input as z.ZodUnion)
    case tagged('object')(x): return object.writeable(x, ix, input as z.ZodObject)
    // not supported
    case tagged('custom')(x): return import('./utils.js').then(({ Invariant }) => Invariant.Unimplemented('custom', 'zx.equals')) as never
    case tagged('promise')(x): return import('./utils.js').then(({ Invariant }) => Invariant.Unimplemented('promise', 'zx.equals')) as never
    case tagged('transform')(x): return import('./utils.js').then(({ Invariant }) => Invariant.Unimplemented('transform', 'zx.equals')) as never
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
 * @example
 * import { z } from 'zod/v4'
 * import { zx } from '@traversable/zod'
 *
 * const equals = zx.equals(
 *   z.object({
 *     a: z.number(),
 *     b: z.array(z.string()),
 *     c: z.tuple([z.boolean(), z.literal(1)]),
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

export function equals<T extends z.core.$ZodType>(type: T): Equal<z.infer<T>>
export function equals(type: z.core.$ZodType): Equal<never> {
  return fold(type as never, [])
}

const defaultEqIndex = {
  dataPath: [],
  depth: 0,
  isOptional: false,
  isProperty: false,
  leftName: 'l',
  rightName: 'r',
  schemaPath: [],
} satisfies F.EqCompilerIndex

function writeableEquals<T extends z.core.$ZodType>(type: T, options?: writeableEquals.Options): string
function writeableEquals(type: z.core.$ZodType, options?: writeableEquals.Options) {
  const BODY = compile(type)('l', 'r', defaultEqIndex)
  const FUNCTION_NAME = options?.functionName ?? 'equals'
  const inputType = toType(type, options)
  const TYPE = options?.typeName ?? inputType
  return [
    options?.typeName === undefined ? null : inputType,
    `function ${FUNCTION_NAME}(l: ${TYPE}, r: ${TYPE}) {`,
    `  return ${BODY}`,
    `}`
  ].filter((_) => _ !== null).join('\n')
}

declare namespace writeableEquals {
  type Options = toType.Options & {
    functionName?: string
  }
}

function compileEquals<T extends z.core.$ZodType>(type: T): Equal<z.infer<T>>
function compileEquals<T extends z.core.$ZodType>(type: T) {
  const BODY = compile(type)('l', 'r', defaultEqIndex)
  return globalThis.Function('l', 'r', `return ${BODY}`)
}

equals.writeable = writeableEquals
equals.compile = compileEquals

set.fromZod = <T>(x: F.Z.Set<Equal<T>>): Equal<Set<T>> => set(x._zod.def.valueType)
map.fromZod = <T>(x: F.Z.Map<Equal<T>>): Equal<Map<T, T>> => map(x._zod.def.keyType, x._zod.def.valueType)
array.fromZod = <T>(x: F.Z.Array<Equal<T>>): Equal<readonly T[]> => array(x._zod.def.element)
nullable.fromZod = <T>(x: F.Z.Nullable<Equal<T>>): Equal<T | null> => nullable(x._zod.def.innerType)
optional.fromZod = <T>(x: F.Z.Optional<Equal<T>>): Equal<T | undefined> => optional(x._zod.def.innerType)
record.fromZod = <T>(x: F.Z.Record<Equal<T>>): Equal<Record<string, T>> => record(x._zod.def.valueType)
tuple.fromZod = <T>(x: F.Z.Tuple<Equal<T>>): Equal<readonly T[]> => tuple(x._zod.def.items, x._zod.def.rest)
object.fromZod = <T>(x: F.Z.Object<Equal<T>>): Equal<{ [x: string]: T }> => object(x._zod.def.shape, x._zod.def.catchall)
union.fromZod = <T>(x: F.Z.Union<Equal<T>>): Equal<T> => union(x._zod.def.options)
intersection.fromZod = <T>(x: F.Z.Intersection<Equal<T>>): Equal<T> => intersection(x._zod.def.left, x._zod.def.right)
