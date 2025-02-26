import * as v from 'valibot'

import type * as T from '@traversable/registry'
import { fn, has, parseKey } from '@traversable/registry'
import { Json } from '@traversable/json'
import * as Print from './print.js'

export {
  toString,
}

/** @internal */
type _ = unknown
/** @internal */
type Pickable = readonly (boolean | number | bigint | string)[]
/** @internal */
interface Class { new(...args: never): unknown }


/** @internal */
const constFalse = (): true => true

/** @internal */
const Object_entries = globalThis.Object.entries

/** @internal */
const Array_isArray
  : <T>(u: unknown) => u is readonly T[]
  = globalThis.Array.isArray

type Tag = typeof Tag
const Tag = {
  /// nullary
  any: v.any().type,
  bigint: v.bigint().type,
  blob: v.blob().type,
  boolean: v.boolean().type,
  date: v.date().type,
  file: v.file().type,
  function: v.function().type,
  NaN: v.nan().type,
  never: v.never().type,
  null: v.null().type,
  number: v.number().type,
  promise: v.promise().type,
  string: v.string().type,
  symbol: v.symbol().type,
  undefined: v.undefined().type,
  unknown: v.unknown().type,
  void: v.void().type,
  /// special cases
  enum: v.enum({}).type,
  custom: v.custom(constFalse).type,
  instance: v.instance(class { }).type,
  literal: v.literal(false).type,
  picklist: v.picklist([]).type,
  lazy: v.lazy(v.never).type,
  /// unary
  array: v.array(v.never()).type,
  exactOptional: v.exactOptional(v.never()).type,
  nonNullable: v.nonNullable(v.never()).type,
  nonNullish: v.nonNullish(v.never()).type,
  nonOptional: v.nonOptional(v.never()).type,
  nullable: v.nullable(v.never()).type,
  nullish: v.nullish(v.never()).type,
  optional: v.optional(v.never()).type,
  set: v.set(v.never()).type,
  undefinedable: v.undefinedable(v.never()).type,
  /// positional
  strictTuple: v.strictTuple([]).type,
  tuple: v.tuple([]).type,
  union: v.union([]).type,
  variant: v.variant('', []).type,
  looseTuple: v.looseTuple([]).type,
  intersect: v.intersect([]).type,
  /// associative
  strictObject: v.strictObject({}).type,
  object: v.object({}).type,
  looseObject: v.looseObject({}).type,
  /// binary
  record: v.record(v.string(), v.never()).type,
  map: v.map(v.string(), v.never()).type,
  tupleWithRest: v.tupleWithRest([], v.never()).type,
  objectWithRest: v.objectWithRest({}, v.never()).type,
} as const

interface AnySchema<Type extends string = string> {
  kind: 'schema'
  type: Type
  async: false
  reference: any
  expects: string
  "~standard": v.StandardProps<any, any>
  "~run": any
}

declare namespace V {
  type lookup<K extends keyof Tag, S = _> = V.byTag<S>[Tag[K]]
  type byTag<S> = {
    [Tag.any]: V.Any
    [Tag.bigint]: V.BigInt
    [Tag.blob]: V.Blob
    [Tag.boolean]: V.Boolean
    [Tag.date]: V.Date
    [Tag.enum]: V.Enum
    [Tag.file]: V.File
    [Tag.function]: V.Function
    [Tag.NaN]: V.NaN
    [Tag.never]: V.Never
    [Tag.null]: V.Null
    [Tag.number]: V.Number
    [Tag.promise]: V.Promise
    [Tag.string]: V.String
    [Tag.symbol]: V.Symbol
    [Tag.undefined]: V.Undefined
    [Tag.unknown]: V.Unknown
    [Tag.void]: V.Void
    [Tag.custom]: V.Custom
    [Tag.instance]: V.Instance
    [Tag.lazy]: V.Lazy<S>
    [Tag.literal]: V.Literal<S>
    [Tag.picklist]: V.PickList
    [Tag.array]: V.Array<S>
    [Tag.exactOptional]: V.ExactOptional<S>
    [Tag.nonNullable]: V.NonNullable<S>
    [Tag.nonNullish]: V.NonNullish<S>
    [Tag.nonOptional]: V.NonOptional<S>
    [Tag.nullable]: V.Nullable<S>
    [Tag.nullish]: V.Nullish<S>
    [Tag.optional]: V.Optional<S>
    [Tag.set]: V.Set<S>
    [Tag.undefinedable]: V.Undefinedable<S>
    [Tag.intersect]: V.AllOf<S>
    [Tag.union]: V.AnyOf<S>
    [Tag.variant]: V.OneOf<S>
    [Tag.map]: V.Map<S>
    [Tag.record]: V.Record<S>
    [Tag.object]: V.Object<S>
    [Tag.looseObject]: V.LooseObject<S>
    [Tag.objectWithRest]: V.ObjectWithRest<S>
    [Tag.strictObject]: V.StrictObject<S>
    [Tag.tuple]: V.Tuple<S>
    [Tag.looseTuple]: V.LooseTuple<S>
    [Tag.strictTuple]: V.StrictTuple<S>
    [Tag.tupleWithRest]: V.TupleWithRest<S>
  }

  interface Any { type: Tag['any'] }
  interface BigInt { type: Tag['bigint'] }
  interface Blob { type: Tag['blob'] }
  interface Boolean { type: Tag['boolean'] }
  interface Date { type: Tag['date'] }
  interface File { type: Tag['file'] }
  interface Function { type: Tag['function'] }
  interface NaN { type: Tag['NaN'] }
  interface Never { type: Tag['never'] }
  interface Null { type: Tag['null'] }
  interface Number { type: Tag['number'] }
  interface Promise { type: Tag['promise'] }
  interface String { type: Tag['string'] }
  interface Symbol { type: Tag['symbol'] }
  interface Undefined { type: Tag['undefined'] }
  interface Unknown { type: Tag['unknown'] }
  interface Void { type: Tag['void'] }

  interface Custom { type: typeof Tag.custom /* TODO: check:  */ }
  interface Enum<N = _> { type: Tag['enum'], enum: { [x: string]: N }, options: readonly N[] }
  interface Instance<T extends Class = Class> { type: typeof Tag.instance, class: T }
  interface Lazy<S = _> { type: Tag['lazy'], getter(): S }
  interface Literal<N = _> { type: Tag['literal'], literal: N }
  interface PickList<T extends Pickable = Pickable> { type: typeof Tag.picklist, options: T }

  interface Array<S = _> { type: Tag['array'], item: S } /* TODO: & Array.Check */
  interface ExactOptional<S = _> { type: Tag['exactOptional'], wrapped: S }
  interface NonNullable<S = _> { type: Tag['nonNullable'], wrapped: S }
  interface NonNullish<S = _> { type: Tag['nonNullish'], wrapped: S }
  interface NonOptional<S = _> { type: Tag['nonOptional'], wrapped: S }
  interface Nullable<S = _> { type: Tag['nullable'], wrapped: S }
  interface Nullish<S = _> { type: Tag['nullish'], wrapped: S }
  interface Optional<S = _> { type: Tag['optional'], wrapped: S }
  interface Set<S = _> { type: Tag['set'], value: S }
  interface Undefinedable<S = _> { type: Tag['undefinedable'], wrapped: S }

  interface Map<S = _> { type: Tag['map'], key: S, value: S }
  interface Record<S = _> { type: Tag['record'], key: S, value: S }

  interface AllOf<S = _> { type: Tag['intersect'], options: readonly S[] }
  interface AnyOf<S = _> { type: Tag['union'], options: readonly S[] }
  interface OneOf<S = _, K extends keyof any = keyof any> { type: Tag['variant'], key: K, options: readonly (V.Object<S>)[] }

  interface Tuple<S = _> { type: Tag['tuple'], items: readonly S[] }
  interface StrictTuple<S = _> { type: Tag['strictTuple'], items: readonly S[] }
  interface LooseTuple<S = _> { type: Tag['looseTuple'], items: readonly S[] }
  interface TupleWithRest<S = _> { type: Tag['tupleWithRest'], items: readonly S[], rest: S }

  interface Object<S = _> { type: Tag['object'], entries: { [x: string]: S } }
  interface LooseObject<S = _> { type: Tag['looseObject'], entries: { [x: string]: S } }
  interface ObjectWithRest<S = _> { type: Tag['objectWithRest'], entries: { [x: string]: S }, rest: S }
  interface StrictObject<S = _> { type: Tag['strictObject'], entries: { [x: string]: S } }

  /** 
   * ## {@link Nullary `V.Nullary`}
   * 
   * These are our base cases, a.k.a. terminal or "leaf" nodes
   */
  type Nullary =
    | V.Any
    | V.BigInt
    | V.Blob
    | V.Boolean
    | V.Custom
    | V.Date
    | V.Enum
    | V.File
    | V.Function
    | V.Instance
    | V.Literal
    | V.NaN
    | V.Never
    | V.Null
    | V.Number
    | V.PickList
    | V.Promise
    | V.String
    | V.Symbol
    | V.Undefined
    | V.Unknown
    | V.Void
    ;

  /** 
   * ## {@link Hole `V.Hole`}
   * 
   * The members of {@link Hole `V.Hole`} map 1-1 to the corresponding
   * valibot schema, with the important difference that __recursion is "factored out"__.
   * 
   * If you take a closer look at the type, you'll see what I mean: everywhere
   * where I would have made a recursive call has been replaced with {@link _ `_`}.
   * 
   * Why do this?
   * 
   * Well, for starters, it gives us a way to invert control.
   * 
   * This part's important, because it mirrors what we're going to do at the value-
   * level: factor out the recursion). We don't know, or care, what {@link _ `_`}
   * will be -- all we care about is preserving the surrounding structure. 
   * 
   * That lets us get out of the way. Responsibilities are clear: the caller is
   * responsible for writing the interpreter, and we're responsible for handling
   * the recursion.
   *
   * Taking this approach is more ergonomic, but it's also mathematically rigorous,
   * since it allows our Functor to be homomorphic (see the video below
   * called "Constraints Liberate, Liberties Constrain" below).
   *
   * See also:
   * - {@link Fixpoint `V.Fixpoint`}
   * - {@link Any `V.Any`}
   * - A talk by Runar Bjarnason called 
   * ["Constraints Liberate, Liberties Constrain"](https://www.youtube.com/watch?v=GqmsQeSzMdw)
   */
  type Hole<_> =
    | Nullary
    | V.Array<_>
    | V.ExactOptional<_>
    | V.Lazy<_>
    | V.NonNullable<_>
    | V.NonNullish<_>
    | V.NonOptional<_>
    | V.Nullable<_>
    | V.Nullish<_>
    | V.Optional<_>
    | V.Set<_>
    | V.Undefinedable<_>
    | V.AllOf<_>
    | V.AnyOf<_>
    | V.OneOf<_>
    | V.Map<_>
    | V.Record<_>
    | V.Tuple<_>
    | V.LooseTuple<_>
    | V.StrictTuple<_>
    | V.TupleWithRest<_>
    | V.Object<_>
    | V.LooseObject<_>
    | V.ObjectWithRest<_>
    | V.StrictObject<_>
    ;

  /**
   * ## {@link Fixpoint `V.Fixpoint`}
   *
   * This (I believe) is our Functor's greatest fixed point.
   * Similar to {@link Hole `V.Hole`}, except rather than taking
   * a type parameter, it "fixes" its value to itself.
   * 
   * Interestingly, in TypeScript (and I would imagine most languages),
   * the isn't an easy way to implement {@link Fixpoint `V.Fixpoint`}
   * in terms of {@link Hole `V.Hole`}. If you're not sure what I
   * mean, it might be a useful exercise to try, since it will give you
   * some intuition for why adding constraints prematurely might cause
   * us probems down the line.
   */
  type Fixpoint
    = Nullary
    | V.Array<Fixpoint>
    | V.ExactOptional<Fixpoint>
    | V.Lazy<Fixpoint>
    | V.NonNullable<Fixpoint>
    | V.NonNullish<Fixpoint>
    | V.NonOptional<Fixpoint>
    | V.Nullable<Fixpoint>
    | V.Nullish<Fixpoint>
    | V.Optional<Fixpoint>
    | V.Set<Fixpoint>
    | V.Undefinedable<Fixpoint>
    | V.Map<Fixpoint>
    | V.Record<Fixpoint>
    | V.AllOf<Fixpoint>
    | V.AnyOf<Fixpoint>
    | V.OneOf<Fixpoint>
    | V.Tuple<Fixpoint>
    | V.LooseTuple<Fixpoint>
    | V.TupleWithRest<Fixpoint>
    | V.StrictTuple<Fixpoint>
    | V.Object<Fixpoint>
    | V.LooseObject<Fixpoint>
    | V.ObjectWithRest<Fixpoint>
    | V.StrictObject<Fixpoint>
    ;

  /**
   * ## {@link Free `V.Free`}
   * 
   * Makes {@link Hole V.Hole} higher-kinded 
   */
  interface Free extends T.HKT { [-1]: V.Hole<this[0]> }
}

const tagged
  : <K extends keyof Tag>(tag: K) => <S>(u: unknown) => u is V.lookup<K, S>
  = (tag) => has('type', (u): u is never => u === Tag[tag]) as never

const next
  : (prev: Functor.Index, ...segments: Functor.Index['path']) => Functor.Index
  = ({ depth, path }, ...segments) => ({ depth: depth + 1, path: [...path, ...segments] })

export const Functor: T.Functor.Ix<Functor.Index, V.Free, AnySchema> = {
  map(g) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case tagged('never')(x): return x
        case tagged('any')(x): return x
        case tagged('unknown')(x): return x
        case tagged('void')(x): return x
        case tagged('undefined')(x): return x
        case tagged('null')(x): return x
        case tagged('symbol')(x): return x
        case tagged('NaN')(x): return x
        case tagged('boolean')(x): return x
        case tagged('bigint')(x): return x
        case tagged('date')(x): return x
        case tagged('number')(x): return x
        case tagged('string')(x): return x
        case tagged('enum')(x): return x
        case tagged('literal')(x): return x
        case tagged('blob')(x): return x
        case tagged('file')(x): return x
        case tagged('instance')(x): return x
        case tagged('picklist')(x): return x
        case tagged('promise')(x): return x
        case tagged('function')(x): return x
        case tagged('custom')(x): return x
        case tagged('array')(x): return { ...x, item: g(x.item) } satisfies V.Array
        case tagged('optional')(x): return { ...x, wrapped: g(x.wrapped) } satisfies V.Optional
        case tagged('exactOptional')(x): return { ...x, wrapped: g(x.wrapped) } satisfies V.ExactOptional
        case tagged('nullable')(x): return { ...x, wrapped: g(x.wrapped) } satisfies V.Nullable
        case tagged('nullish')(x): return { ...x, wrapped: g(x.wrapped) } satisfies V.Nullish
        case tagged('nonNullable')(x): return { ...x, wrapped: g(x.wrapped) } satisfies V.NonNullable
        case tagged('nonNullish')(x): return { ...x, wrapped: g(x.wrapped) } satisfies V.NonNullish
        case tagged('nonOptional')(x): return { ...x, wrapped: g(x.wrapped) } satisfies V.NonOptional
        case tagged('undefinedable')(x): return { ...x, wrapped: g(x.wrapped) } satisfies V.Undefinedable
        case tagged('set')(x): return { ...x, value: g(x.value) } satisfies V.Set
        case tagged('lazy')(x): return { ...x, getter: () => g(x.getter()) } satisfies V.Lazy
        case tagged('map')(x): return { ...x, key: g(x.key), value: g(x.value) } satisfies V.Map
        case tagged('record')(x): return { ...x, key: g(x.key), value: g(x.value) } satisfies V.Record
        case tagged('union')(x): return { ...x, options: fn.map(x.options, g) } satisfies V.AnyOf
        case tagged('intersect')(x): return { ...x, options: fn.map(x.options, g) } satisfies V.AllOf
        case tagged('variant')(x): return { ...x, options: fn.map(x.options, (y) => ({ ...y, entries: fn.map(y.entries, g) })) } satisfies V.OneOf
        case tagged('object')(x): return { ...x, entries: fn.map(x.entries, g) } satisfies V.Object
        case tagged('looseObject')(x): return { ...x, entries: fn.map(x.entries, g) } satisfies V.LooseObject
        case tagged('strictObject')(x): return { ...x, entries: fn.map(x.entries, g) } satisfies V.StrictObject
        case tagged('objectWithRest')(x): return { ...x, entries: fn.map(x.entries, g), rest: g(x.rest) } satisfies V.ObjectWithRest
        case tagged('tuple')(x): return { ...x, items: fn.map(x.items, g) }
        case tagged('looseTuple')(x): return { ...x, items: fn.map(x.items, g) } satisfies V.LooseTuple
        case tagged('strictTuple')(x): return { ...x, items: fn.map(x.items, g) } satisfies V.StrictTuple
        case tagged('tupleWithRest')(x): return { ...x, items: fn.map(x.items, g), rest: g(x.rest) } satisfies V.TupleWithRest
      }
    }
  },
  //
  mapWithIndex(g) {
    return (x, ix) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case tagged('never')(x): return x
        case tagged('any')(x): return x
        case tagged('unknown')(x): return x
        case tagged('void')(x): return x
        case tagged('undefined')(x): return x
        case tagged('null')(x): return x
        case tagged('symbol')(x): return x
        case tagged('NaN')(x): return x
        case tagged('boolean')(x): return x
        case tagged('bigint')(x): return x
        case tagged('date')(x): return x
        case tagged('number')(x): return x
        case tagged('string')(x): return x
        case tagged('enum')(x): return x
        case tagged('literal')(x): return x
        case tagged('blob')(x): return x
        case tagged('file')(x): return x
        case tagged('instance')(x): return x
        case tagged('picklist')(x): return x
        case tagged('promise')(x): return x
        case tagged('function')(x): return x
        case tagged('custom')(x): return x
        case tagged('array')(x): return { ...x, item: g(x.item, ix) } satisfies V.Array
        case tagged('optional')(x): return { ...x, wrapped: g(x.wrapped, ix) } satisfies V.Optional
        case tagged('exactOptional')(x): return { ...x, wrapped: g(x.wrapped, ix) } satisfies V.ExactOptional
        case tagged('nullable')(x): return { ...x, wrapped: g(x.wrapped, ix) } satisfies V.Nullable
        case tagged('nullish')(x): return { ...x, wrapped: g(x.wrapped, ix) } satisfies V.Nullish
        case tagged('nonNullable')(x): return { ...x, wrapped: g(x.wrapped, ix) } satisfies V.NonNullable
        case tagged('nonNullish')(x): return { ...x, wrapped: g(x.wrapped, ix) } satisfies V.NonNullish
        case tagged('nonOptional')(x): return { ...x, wrapped: g(x.wrapped, ix) } satisfies V.NonOptional
        case tagged('undefinedable')(x): return { ...x, wrapped: g(x.wrapped, ix) } satisfies V.Undefinedable
        case tagged('set')(x): return { ...x, value: g(x.value, ix) } satisfies V.Set
        case tagged('lazy')(x): return { ...x, getter: () => g(x.getter(), ix) } satisfies V.Lazy
        case tagged('map')(x): return { ...x, key: g(x.key, ix), value: g(x.value, ix) } satisfies V.Map
        case tagged('record')(x): return { ...x, key: g(x.key, ix), value: g(x.value, ix) } satisfies V.Record
        case tagged('union')(x): return { ...x, options: fn.map(x.options, (y) => g(y, ix)) } satisfies V.AnyOf
        case tagged('intersect')(x): return { ...x, options: fn.map(x.options, (y) => g(y, ix)) } satisfies V.AllOf
        case tagged('variant')(x): return { ...x, options: fn.map(x.options, (y) => mapObject(g)(y, ix)) } satisfies V.OneOf
        case tagged('object')(x): return mapObject(g)(x, ix) satisfies V.Object
        case tagged('looseObject')(x): return { ...x, entries: fn.map(x.entries, (y) => g(y, ix)) } satisfies V.LooseObject
        case tagged('strictObject')(x): return { ...x, entries: fn.map(x.entries, (y) => g(y, ix)) } satisfies V.StrictObject
        case tagged('objectWithRest')(x): return { ...x, entries: fn.map(x.entries, (y) => g(y, ix)), rest: g(x.rest, ix) } satisfies V.ObjectWithRest
        case tagged('tuple')(x): return { ...x, items: fn.map(x.items, (y) => g(y, ix)) } satisfies V.Tuple
        case tagged('looseTuple')(x): return { ...x, items: fn.map(x.items, (y) => g(y, ix)) } satisfies V.LooseTuple
        case tagged('strictTuple')(x): return { ...x, items: fn.map(x.items, (y) => g(y, ix)) } satisfies V.StrictTuple
        case tagged('tupleWithRest')(x): return { ...x, items: fn.map(x.items, (y) => g(y, ix)), rest: g(x.rest, ix) } satisfies V.TupleWithRest
      }
    }
  }
}

const mapObject
  : <S, T>(f: (s: S, ix: Functor.Index) => T) => (x: V.Object<S>, ix: Functor.Index) => V.Object<T>
  = (f) => (x, ix) => ({ ...x, entries: fn.map(x.entries, (y) => f(y, ix)) })

export declare namespace Functor {
  interface Index {
    depth: number
    path: (string | number)[]
  }
}

const defaultIndex = {
  depth: 0,
  path: [],
} satisfies Required<Functor.Index>

export const Iso: T.Functor.Ix<Functor.Index, Json.Free, Json.Fixpoint> = {
  map: Json.Functor.map,
  mapWithIndex(f) {
    return (x, ix) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case x === null:
        case x === undefined:
        case x === true:
        case x === false:
        case typeof x === 'number':
        case typeof x === 'string': return x
        case Array_isArray(x): return fn.map(x, (s, i) => f(s, next(ix, i)))
        case !!x && typeof x === 'object': return fn.map(x, (s, k) => f(s, next(ix, k)))
      }
    }
  }
}

export const fold = fn.cataIx(Functor)

namespace Algebra {
  const stringifyEntries
    : (x: { [x: string]: unknown; }, toString?: (y: unknown) => string) => string[]
    = (x, toString) => Object_entries(x).map(([k, v]) => `${parseKey(k)}: ${toString?.(v) ?? v}`)

  function compileObjectNode<S>(x: V.Object<S>) {
    const xs = Object_entries(x.entries)
    return xs.length === 0
      ? `v.object({})`
      : `v.object({ ${xs.map(([k, v]) => parseKey(k) + ': ' + v).join(', ')} })`
  }

  export const toString: T.Functor.IndexedAlgebra<Functor.Index, V.Free, string> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case tagged('never')(x): return 'v.never()'
      case tagged('any')(x): return 'v.any()'
      case tagged('unknown')(x): return 'v.unknown()'
      case tagged('void')(x): return 'v.void()'
      case tagged('undefined')(x): return 'v.undefined()'
      case tagged('null')(x): return 'v.null()'
      case tagged('symbol')(x): return 'v.symbol()'
      case tagged('NaN')(x): return 'v.nan()'
      case tagged('boolean')(x): return 'v.boolean()'
      case tagged('bigint')(x): return 'v.bigint()'
      case tagged('date')(x): return 'v.date()'
      case tagged('number')(x): return `v.number()`
      case tagged('string')(x): return 'v.string()'
      case tagged('blob')(x): return 'v.blob()'
      case tagged('file')(x): return 'v.file()'
      case tagged('custom')(x): return `v.custom(() => true)`
      case tagged('promise')(x): return `v.promise()`
      case tagged('function')(x): return `v.function()`
      case tagged('enum')(x): return `v.enum({ ${stringifyEntries(x.enum, JSON.stringify).join(', ')} })`
      case tagged('instance')(x): return `v.instance(${x.class.toString()})`
      case tagged('picklist')(x): return `v.picklist([${x.options.join(', ')}])`
      case tagged('literal')(x): return `v.literal(${JSON.stringify(x.literal)})`
      case tagged('nullable')(x): return `v.nullable(${x.wrapped})`
      case tagged('optional')(x): return `v.optional(${x.wrapped})`
      case tagged('exactOptional')(x): return `v.exactOptional(${x.wrapped})`
      case tagged('nullish')(x): return `v.nullish(${x.wrapped})`
      case tagged('nonNullable')(x): return `v.nonNullable(${x.wrapped})`
      case tagged('nonNullish')(x): return `v.nonNullish(${x.wrapped})`
      case tagged('nonOptional')(x): return `v.nonOptional(${x.wrapped})`
      case tagged('undefinedable')(x): return `v.nullable(${x.wrapped})`
      case tagged('set')(x): return `v.set(${x.value})`
      case tagged('array')(x): return `v.array(${x.item})`
      case tagged('lazy')(x): return `v.lazy(() => ${x.getter()})`
      case tagged('map')(x): return `v.map(${x.key}, ${x.value})`
      case tagged('record')(x): return `v.record(${x.key}, ${x.value})`
      case tagged('intersect')(x): return `v.intersect([${x.options.join(', ')}])`
      case tagged('union')(x): return `v.union([${x.options.join(', ')}])`
      case tagged('variant')(x): return `v.variant("${String(x.key)}", [${x.options.map(compileObjectNode).join(', ')}])`
      case tagged('tuple')(x): return `v.tuple([${x.items.join(', ')}])`
      case tagged('looseTuple')(x): return `v.looseTuple([${x.items.join(', ')}])`
      case tagged('strictTuple')(x): return `v.strictTuple([${x.items.join(', ')}])`
      case tagged('tupleWithRest')(x): return `v.tupleWithRest([${x.items.join(', ')}], ${x.rest})`
      case tagged('object')(x): return compileObjectNode(x)
      case tagged('looseObject')(x): return `v.looseObject({ ${stringifyEntries(x.entries).join(', ')} })`
      case tagged('strictObject')(x): return `v.strictObject({ ${stringifyEntries(x.entries).join(', ')} })`
      case tagged('objectWithRest')(x): return `v.objectWithRest({ ${stringifyEntries(x.entries).join(', ')} }, ${x.rest})`
    }
  }

  export const fromValueObject: T.Functor.Algebra<Json.Free, AnySchema> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x === null: return v.null()
      case x === undefined: return v.undefined()
      case typeof x === 'boolean': return v.boolean()
      case typeof x === 'symbol': return v.symbol()
      case typeof x === 'number': return v.number()
      case typeof x === 'string': return v.string()
      case Array_isArray(x):
        return x.length === 0 ? v.tuple([]) : v.tuple([x[0], ...x.slice(1)])
      case !!x && typeof x === 'object': return v.object(x)
    }
  }

  export const fromConstant: T.Functor.Algebra<Json.Free, AnySchema> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x === null: return v.null()
      case x === undefined: return v.undefined()
      case typeof x === 'symbol':
      case typeof x === 'boolean':
      case typeof x === 'number':
      case typeof x === 'bigint':
      case typeof x === 'string': return v.literal(x)
      case Array_isArray(x): return x.length === 0 ? v.tuple([]) : v.strictTuple(x)
      case !!x && typeof x === 'object': return v.strictObject(x)
    }
  }

  export const schemaStringFromJson
    : T.Functor.IndexedAlgebra<Functor.Index, Json.Free, string>
    = (x, { depth }) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case x === null: return 'v.null()'
        case x === undefined: return 'v.undefined()'
        case typeof x === 'boolean': return `v.literal(${String(x)})`
        case typeof x === 'number': return `v.literal(${String(x)})`
        case typeof x === 'string': return `v.literal("${x}")`
        case Array_isArray(x): {
          return x.length === 0 ? `v.tuple([])`
            : Print.lines({ indent: depth * 2 })(`v.tuple([`, x.join(', '), `])`)
        }
        case !!x && typeof x === 'object': {
          const xs = Object_entries(x)
          return xs.length === 0 ? `v.object({})`
            : Print.lines({ indent: depth * 2 })(
              `v.object({`,
              ...xs.map(([k, v]) => parseKey(k) + ': ' + v),
              `})`,
            )
        }
      }
    }

  export const _serializeShort
    : T.Functor.Algebra<Json.Free, string>
    = (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case x === null:
        case x === undefined:
        case typeof x === 'boolean':
        case typeof x === 'number':
        case typeof x === 'string': return globalThis.JSON.stringify(x)
        case Array_isArray(x): return x.length === 0 ? '[]' : '[' + x.join(', ') + ']'
        case !!x && typeof x === 'object': {
          const xs = Object_entries(x)
          return xs.length === 0 ? '{}' : '{' + xs.map(([k, v]) => parseKey(k) + ': ' + v).join(',') + '}]'
        }
      }
    }
}


/** 
 * ## {@link toString `valibot.toString`}
 * 
 * Converts an arbitrary valibot schema back into string form. Used internally 
 * for testing/debugging.
 * 
 * Very useful when you're applying transformations to a valibot schema. 
 * Can be used (for example) to reify a schema, or perform codegen, 
 * and has more general applications in dev environments.
 * 
 * @example
 * import { valibot as Schema } from "@traversable/schema-valibot-adapter"
 * import * as vi from "vitest"
 * 
 * vi.expect(Schema.toString(v.union([v.object({ tag: v.literal("Left") }), v.object({ tag: v.literal("Right") })])) )
 *   .toMatchInlineSnapshot(`v.union([v.object({ tag: v.literal("Left") }), v.object({ tag: v.literal("Right") })]))`)
 */
const toString
  : <S extends AnySchema<string>>(schema: S, ix?: Functor.Index) => string
  = (x, ix = defaultIndex) => fn.cataIx(Functor)(Algebra.toString)(x, ix)

/** 
 * ## {@link fromConstant `valibot.fromConstant`}
 * 
 * Derive a valibot schema from an arbitrary
 * [value object](https://en.wikipedia.org/wiki/Value_object). 
 * 
 * Used to make valibot scemas compatible with the JSON Schema spec -- specifically, to support the
 * [`const` keyword](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-00#rfc.section.6.1.3),
 * added in [2020-12](https://json-schema.org/draft/2020-12/schema).
 */
export const fromConstant = fn.cata(Json.Functor)(Algebra.fromConstant)

export const fromUnknown
  : (value: unknown) => AnySchema | undefined
  = (value) => !Json.is(value) ? void 0 : fromConstant(value)

export const fromConstantToSchemaString = fn.cataIx(Iso)(Algebra.schemaStringFromJson)
