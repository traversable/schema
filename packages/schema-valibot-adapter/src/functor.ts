import * as v from 'valibot'

import type * as T from '@traversable/registry'
import { fn, has, parseKey } from '@traversable/registry'
import { Json } from '@traversable/json'
import * as Print from './print.js'

type _ = unknown

export {
  toString,
}

const Tag = {
  // nullary
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
  // special cases
  enum: v.enum({}).type,
  custom: v.custom(() => true).type,
  instance: v.instance(class { }).type,
  literal: v.literal(false).type,
  picklist: v.picklist([]).type,
  lazy: v.lazy(() => v.any()).type,
  // unary
  array: v.array(v.any()).type,
  exactOptional: v.exactOptional(v.any()).type,
  nonNullable: v.nonNullable(v.any()).type,
  nonNullish: v.nonNullish(v.any()).type,
  nonOptional: v.nonOptional(v.any()).type,
  nullable: v.nullable(v.any()).type,
  nullish: v.nullish(v.any()).type,
  optional: v.optional(v.any()).type,
  set: v.set(v.any()).type,
  undefinedable: v.undefinedable(v.any()).type,
  // positional
  strictTuple: v.strictTuple([]).type,
  tuple: v.tuple([]).type,
  union: v.union([]).type,
  variant: v.variant('', []).type,
  looseTuple: v.looseTuple([]).type,
  intersect: v.intersect([]).type,
  // associative
  strictObject: v.strictObject({}).type,
  object: v.object({}).type,
  looseObject: v.looseObject({}).type,
  // binary
  record: v.record(v.string(), v.any()).type,
  map: v.map(v.string(), v.any()).type,
  // binary positional
  tupleWithRest: v.tupleWithRest([], v.any()).type,
  // binary associative
  objectWithRest: v.objectWithRest({}, v.any()).type,
} as const

type Tag = typeof Tag
const Tags = [
  // special cases
  Tag.enum,
  Tag.custom,
  Tag.instance,
  Tag.literal,
  Tag.picklist,
  Tag.lazy,
  // nullary
  Tag.any,
  Tag.bigint,
  Tag.blob,
  Tag.boolean,
  Tag.date,
  Tag.file,
  Tag.function,
  Tag.NaN,
  Tag.never,
  Tag.null,
  Tag.number,
  Tag.promise,
  Tag.string,
  Tag.symbol,
  Tag.undefined,
  Tag.unknown,
  Tag.void,
  // unary
  Tag.array,
  Tag.exactOptional,
  Tag.nonNullable,
  Tag.nonNullish,
  Tag.nonOptional,
  Tag.nullable,
  Tag.nullish,
  Tag.optional,
  Tag.set,
  Tag.undefinedable,
  // binary
  Tag.record,
  Tag.map,
  // positional
  Tag.strictTuple,
  Tag.tuple,
  Tag.union,
  Tag.variant,
  Tag.looseTuple,
  Tag.intersect,
  // binary positional
  Tag.tupleWithRest,
  // associative
  Tag.strictObject,
  Tag.object,
  Tag.looseObject,
  // binary associative
  Tag.objectWithRest,
] as const satisfies any[]

const Array_isArray
  : <T>(u: unknown) => u is readonly T[]
  = globalThis.Array.isArray

declare namespace V {
  type lookup<K extends keyof Tag, S = _> = V.byTag<S>[Tag[K]]
  type byTag<S> = {
    // nullary
    [Tag.intersect]: V.AllOf<S>
    [Tag.union]: V.AnyOf<S>
    [Tag.variant]: V.OneOf<S>
    [Tag.any]: V.Any
    [Tag.array]: V.Array<S>
    [Tag.bigint]: V.BigInt
    [Tag.boolean]: V.Boolean
    [Tag.date]: V.Date
    [Tag.enum]: V.Enum
    [Tag.blob]: V.Blob
    [Tag.file]: V.File
    [Tag.promise]: V.Promise
    [Tag.function]: V.Function
    // special cases
    [Tag.custom]: V.Custom
    [Tag.instance]: V.Instance
    [Tag.picklist]: V.PickList
    [Tag.lazy]: V.Lazy<S>
    [Tag.literal]: V.Literal<S>
    [Tag.map]: V.Map<S>
    [Tag.NaN]: V.NaN
    [Tag.never]: V.Never
    [Tag.null]: V.Null
    [Tag.nullable]: V.Nullable<S>
    [Tag.number]: V.Number
    [Tag.object]: V.Object<S>
    [Tag.optional]: V.Optional<S>
    [Tag.record]: V.Record<S>
    [Tag.set]: V.Set<S>
    [Tag.string]: V.String
    [Tag.symbol]: V.Symbol
    [Tag.tuple]: V.Tuple<S>
    [Tag.undefined]: V.Undefined
    [Tag.unknown]: V.Unknown
    [Tag.void]: V.Void

    [Tag.nullish]: V.Nullish<S>
    [Tag.undefinedable]: V.Undefinedable<S>
    [Tag.exactOptional]: V.ExactOptional<S>
    [Tag.nonNullable]: V.NonNullable<S>
    [Tag.nonNullish]: V.NonNullish<S>
    [Tag.nonOptional]: V.NonOptional<S>
    [Tag.strictTuple]: V.StrictTuple<S>
    [Tag.looseTuple]: V.LooseTuple<S>
    [Tag.strictObject]: V.StrictObject<S>
    [Tag.looseObject]: V.LooseObject<S>
    [Tag.tupleWithRest]: V.TupleWithRest<S>
    [Tag.objectWithRest]: V.ObjectWithRest<S>
  }

  interface Custom { type: typeof Tag.custom /* TODO: check:  */ }
  interface Instance<
    T extends
    | { new(...args: never): unknown }
    = { new(...args: never): unknown }
  > { type: typeof Tag.instance, class: T }
  interface PickList<
    T extends
    | readonly (boolean | number | bigint | string)[]
    = readonly (boolean | number | bigint | string)[]
  > { type: typeof Tag.picklist, options: T }

  interface Enum<N = _> { type: Tag['enum'], enum: { [x: string]: N }, options: readonly N[] }
  interface Literal<N = _> { type: Tag['literal'], literal: N }

  interface Never { type: Tag['never'] }
  interface Any { type: Tag['any'] }
  interface Unknown { type: Tag['unknown'] }
  interface Undefined { type: Tag['undefined'] }
  interface Null { type: Tag['null'] }
  interface Void { type: Tag['void'] }
  interface NaN { type: Tag['NaN'] }
  interface Symbol { type: Tag['symbol'] }
  interface Boolean { type: Tag['boolean'] }
  interface BigInt { type: Tag['bigint'] }
  interface Blob { type: Tag['blob'] }
  interface File { type: Tag['file'] }
  interface Number { type: Tag['number'] } /* TODO: , checks?: Number.Check[] */
  interface String { type: Tag['string'] }
  interface Date { type: Tag['date'] }
  interface Function { type: Tag['function'] }
  interface Promise { type: Tag['promise'] }
  interface Nullish<S = _> { type: Tag['nullish'], wrapped: S }
  interface Undefinedable<S = _> { type: Tag['undefinedable'], wrapped: S }
  interface ExactOptional<S = _> { type: Tag['exactOptional'], wrapped: S }
  interface NonNullable<S = _> { type: Tag['nonNullable'], wrapped: S }
  interface NonNullish<S = _> { type: Tag['nonNullish'], wrapped: S }
  interface NonOptional<S = _> { type: Tag['nonOptional'], wrapped: S }
  interface Optional<S = _> { type: Tag['optional'], wrapped: S }
  interface Nullable<S = _> { type: Tag['nullable'], wrapped: S }
  interface Array<S = _> { type: Tag['array'], item: S } /* TODO: & Array.Check */
  interface Set<S = _> { type: Tag['set'], value: S }
  interface Map<S = _> { type: Tag['map'], key: S, value: S }
  interface Record<S = _> { type: Tag['record'], key: S, value: S }
  interface Object<S = _> { type: Tag['object'], entries: { [x: string]: S } }
  interface Lazy<S = _> { type: Tag['lazy'], getter(): S }
  interface Tuple<S = _> { type: Tag['tuple'], items: readonly S[] }
  interface StrictTuple<S = _> { type: Tag['strictTuple'], items: readonly S[] }
  interface LooseTuple<S = _> { type: Tag['looseTuple'], items: readonly S[] }
  interface TupleWithRest<S = _> { type: Tag['tupleWithRest'], items: readonly S[], rest: S }
  interface AllOf<S = _> { type: Tag['intersect'], options: readonly S[] }
  interface AnyOf<S = _> { type: Tag['union'], options: readonly S[] }
  interface OneOf<S = _, K extends keyof any = keyof any> { type: Tag['variant'], key: K, options: readonly (V.Object<S>)[] }
  interface StrictObject<S = _> { type: Tag['strictObject'], entries: { [x: string]: S } }
  interface LooseObject<S = _> { type: Tag['looseObject'], entries: { [x: string]: S } }
  interface ObjectWithRest<S = _> { type: Tag['objectWithRest'], entries: { [x: string]: S }, rest: S }

  /** 
   * ## {@link Nullary `V.Hole`}
   * 
   * These are our base cases, a.k.a. terminal or "leaf" nodes
   */
  type Nullary
    = V.Never
    | V.Any
    | V.Unknown
    | V.Undefined
    | V.Null
    | V.Void
    | V.NaN
    | V.Symbol
    | V.Boolean
    | V.BigInt
    | V.Number
    | V.String
    | V.Date
    | V.Enum
    | V.Literal
    | V.Blob
    | V.File
    | V.Instance
    | V.PickList
    | V.Custom
    | V.Promise
    | V.Function
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
   * - A talk by Runar Bjarnason's called 
   * ["Constraints Liberate, Liberties Constrain"](https://www.youtube.com/watch?v=GqmsQeSzMdw)
   */
  type Hole<_> =
    | Nullary
    | V.Lazy<_>
    | V.ExactOptional<_>
    | V.Optional<_>
    | V.Nullable<_>
    | V.Nullish<_>
    | V.NonNullable<_>
    | V.NonNullish<_>
    | V.NonOptional<_>
    | V.Undefinedable<_>
    | V.Array<_>
    | V.Set<_>
    | V.Map<_>
    | V.Record<_>
    | V.AllOf<_>
    | V.AnyOf<_>
    | V.OneOf<_>
    | V.Tuple<_>
    | V.LooseTuple<_>
    | V.StrictTuple<_>
    | V.TupleWithRest<_>
    | V.Object<_>
    | V.LooseObject<_>
    | V.StrictObject<_>
    | V.ObjectWithRest<_>
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
    | V.Lazy<Fixpoint>
    | V.ExactOptional<Fixpoint>
    | V.Optional<Fixpoint>
    | V.Nullable<Fixpoint>
    | V.Nullish<Fixpoint>
    | V.NonNullable<Fixpoint>
    | V.NonNullish<Fixpoint>
    | V.NonOptional<Fixpoint>
    | V.Undefinedable<Fixpoint>
    | V.Array<Fixpoint>
    | V.Set<Fixpoint>
    | V.Map<Fixpoint>
    | V.Record<Fixpoint>
    | V.AllOf<Fixpoint>
    | V.AnyOf<Fixpoint>
    | V.OneOf<Fixpoint>
    | V.Tuple<Fixpoint>
    | V.LooseTuple<Fixpoint>
    | V.StrictTuple<Fixpoint>
    | V.TupleWithRest<Fixpoint>
    | V.Object<Fixpoint>
    | V.LooseObject<Fixpoint>
    | V.StrictObject<Fixpoint>
    | V.ObjectWithRest<Fixpoint>
    ;

  /**
   * ## {@link Free `V.Free`}
   * 
   * Makes {@link Hole V.Hole} higher-kinded 
   */
  interface Free extends T.HKT { [-1]: V.Hole<this[0]> }

  // TODO: make this more granular
  namespace Number {
    interface Check {
      kind: 'int' | 'min' | 'max' | 'finite' | 'multipleOf',
      value?: number,
      inclusive?: boolean
    }
  }
  namespace Array {
    interface Check {
      minLength: null | { value: number }
      maxLength: null | { value: number }
      exactLength: null | { value: number }
    }
  }
}

const tagged
  : <K extends keyof Tag>(tag: K) => <S>(u: unknown) => u is V.lookup<K, S>
  = (tag) => has('type', (u): u is never => u === Tag[tag]) as never

const mapObject
  : <S, T>(f: (s: S) => T) => (x: V.Object<S>) => V.Object<T>
  = (f) => ({ entries, ...x }) => ({
    ...x,
    entries: fn.map(entries, f),
  })

const mapTuple
  : <S, T>(f: (s: S) => T) => (x: V.Tuple<S>) => V.Tuple<T>
  = (f) => ({ items, ...x }) =>
    ({ ...x, items: fn.map(items, f) })

export const Functor: T.Functor<V.Free, Any> = {
  map(g) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        ///  leaves, a.k.a "nullary" types
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
        ///  branches, a.k.a. "unary" types
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
        ///  positional
        case tagged('tuple')(x): return mapTuple(g)(x) satisfies V.Tuple
        case tagged('looseTuple')(x): return { ...x, items: fn.map(x.items, g) } satisfies V.LooseTuple
        case tagged('strictTuple')(x): return { ...x, items: fn.map(x.items, g) } satisfies V.StrictTuple
        case tagged('tupleWithRest')(x): return { ...x, items: fn.map(x.items, g), rest: g(x.rest) } satisfies V.TupleWithRest
        case tagged('union')(x): return { ...x, options: fn.map(x.options, g) } satisfies V.AnyOf
        case tagged('intersect')(x): return { ...x, options: fn.map(x.options, g) } satisfies V.AllOf
        case tagged('variant')(x): return { ...x, options: fn.map(x.options, mapObject(g)) } satisfies V.OneOf
        ///  associative
        case tagged('object')(x): return mapObject(g)(x) satisfies V.Object
        case tagged('looseObject')(x): return { ...x, entries: fn.map(x.entries, g) } satisfies V.LooseObject
        case tagged('strictObject')(x): return { ...x, entries: fn.map(x.entries, g) } satisfies V.StrictObject
        case tagged('objectWithRest')(x): return { ...x, entries: fn.map(x.entries, g), rest: g(x.rest) } satisfies V.ObjectWithRest
      }
    }
  }
}

export declare namespace Functor {
  interface Index {
    depth: number
    path: (keyof any)[]
  }
}

function compileObjectNode<S>(x: V.Object<S>) {
  const xs = Object.entries(x.entries)
  return xs.length === 0 ? `v.object({})`
    : `v.object({ ${xs.map(([k, v]) => parseKey(k) + ': ' + v).join(', ')} })`
}

// const applyNumberConstraints = (x: V.Number) => ''
//   + (!x._def.checks?.length ? '' : '.')
//   + (x._def.checks?.map((check) =>
//     !Number.isFinite(check.value) ? `${check.kind}()`
//       : check.kind === 'min' ? `${check.inclusive ? 'min' : 'gt'}(${check.value})`
//         : check.kind === 'max' ? `${check.inclusive ? 'max' : 'lt'}(${check.value})`
//           : `${check.kind}(${check.value})`
//   ).join('.')
//   )

// const applyArrayConstraints = (x: V.Array) => ([
//   Number.isFinite(x._def.minLength?.value) && `.min(${x._def.minLength?.value})`,
//   Number.isFinite(x._def.maxLength?.value) && `.max(${x._def.maxLength?.value})`,
//   Number.isFinite(x._def.exactLength?.value) && `.length(${x._def.exactLength?.value})`
// ]).filter((_) => typeof _ === 'string').join('')


const next
  : (prev: Functor.Index, ...segments: Functor.Index['path']) => Functor.Index
  = ({ depth, path }, ...segments) => ({ depth: depth + 1, path: [...path, ...segments] })

export const IndexedFunctor: T.Functor.Ix<Functor.Index, Json.Free, Json.Fixpoint> = {
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

export const fold = fn.cata(Functor)
export const unfold = fn.ana(Functor)
export const foldWithIndex = fn.cataIx(IndexedFunctor)

namespace Algebra {
  export const toString: T.Functor.Algebra<V.Free, string> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      ///  leaves, a.k.a. "nullary" types
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
      case tagged('number')(x): return `v.number()`                                  // TODO: ${applyNumberConstraints(x)}
      case tagged('string')(x): return 'v.string()'
      case tagged('blob')(x): return 'v.blob()'
      case tagged('file')(x): return 'v.file()'
      case tagged('custom')(x): return `v.custom(() => true)`                        // TODO: `v.custom(${x.check.toString})`
      case tagged('promise')(x): return `v.promise()`
      case tagged('function')(x): return `v.function()`
      case tagged('enum')(x): return `v.enum({ ${Object.entries(x.enum).map(([k, v]) => `${parseKey(k)}: ${JSON.stringify(v)}`).join(', ')} })`
      case tagged('instance')(x): return `v.instance(${x.class.toString()})`
      case tagged('picklist')(x): return `v.picklist([${x.options.join(', ')}])`
      case tagged('literal')(x): return `v.literal(${JSON.stringify(x.literal)})`
      ///  unary
      case tagged('nullable')(x): return `v.nullable(${x.wrapped})`
      case tagged('optional')(x): return `v.optional(${x.wrapped})`
      case tagged('exactOptional')(x): return `v.exactOptional(${x.wrapped})`
      case tagged('nullish')(x): return `v.nullish(${x.wrapped})`
      case tagged('nonNullable')(x): return `v.nonNullable(${x.wrapped})`
      case tagged('nonNullish')(x): return `v.nonNullish(${x.wrapped})`
      case tagged('nonOptional')(x): return `v.nonOptional(${x.wrapped})`
      case tagged('undefinedable')(x): return `v.nullable(${x.wrapped})`
      case tagged('set')(x): return `v.set(${x.value})`
      case tagged('array')(x): return `v.array(${x.item})`                           // TODO: ${applyArrayConstraints(x)}`
      case tagged('lazy')(x): return `v.lazy(() => ${x.getter()})`
      /// binary types
      case tagged('map')(x): return `v.map(${x.key}, ${x.value})`
      case tagged('record')(x): return `v.record(${x.key}, ${x.value})`
      ///  positional
      case tagged('intersect')(x): return `v.intersect([${x.options.join(', ')}])`
      case tagged('union')(x): return `v.union([${x.options.join(', ')}])`
      case tagged('variant')(x): return `v.variant("${String(x.key)}", [${x.options.map(compileObjectNode).join(', ')}])`
      case tagged('tuple')(x): return `v.tuple([${x.items.join(', ')}])`
      case tagged('looseTuple')(x): return `v.looseTuple([${x.items.join(', ')}])`
      case tagged('strictTuple')(x): return `v.strictTuple([${x.items.join(', ')}])`
      ///  binary positional
      case tagged('tupleWithRest')(x): return `v.tupleWithRest([${x.items.join(', ')}], ${x.rest})`
      ///  associative
      case tagged('object')(x): return compileObjectNode(x)
      case tagged('looseObject')(x): return `v.looseObject({ ${Object.entries(x.entries).map(([k, v]) => `${parseKey(k)}: ${v}`).join(', ')} })`
      case tagged('strictObject')(x): return `v.strictObject({ ${Object.entries(x.entries).map(([k, v]) => `${parseKey(k)}: ${v}`).join(', ')} })`
      ///  binary associative
      case tagged('objectWithRest')(x): return `v.objectWithRest({ ${Object.entries(x.entries).map(([k, v]) => `${parseKey(k)}: ${v}`).join(', ')} }, ${x.rest})`
    }
  }

  export const fromValueObject: T.Functor.Algebra<Json.Free, v.BaseSchema<any, any, any>> = (x) => {
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

  export const fromConstant: T.Functor.Algebra<Json.Free, Any> = (x) => {
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
          const xs = Object.entries(x)
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
          const xs = Object.entries(x)
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
 * import { valibot } from "@traversable/schema-valibot-adapter"
 * import * as vi from "vitest"
 * 
 * vi.expect(valibot.toString( v.union([v.object({ tag: v.literal("Left") }), v.object({ tag: v.literal("Right") })])))
 * .toMatchInlineSnapshot(`v.union([v.object({ tag: v.literal("Left") }), v.object({ tag: v.literal("Right") })]))`)
 */
const toString = fn.cata(Functor)(Algebra.toString)

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

const serializeShort
  : (value: {} | null) => string
  = fn.cata(Json.Functor)(Algebra._serializeShort)

export const fromUnknown
  : (value: unknown) => Any | undefined
  = (value) => !Json.is(value) ? void 0 : fromConstant(value)

export const fromConstantToSchemaString = fn.cataIx(IndexedFunctor)(Algebra.schemaStringFromJson)

type AnySchema = v.BaseSchema<any, any, any>

type Any<T extends AnySchema = AnySchema>
  = v.AnySchema
  | v.UnionSchema<readonly T[], undefined>
  | v.VariantSchema<string, v.ObjectSchema<{ [x: string]: T }, undefined>[], undefined>
  | v.ArraySchema<T, undefined>
  | v.BigintSchema<undefined>
  | v.BooleanSchema<undefined>
  | v.DateSchema<undefined>
  | v.ExactOptionalSchema<T, undefined>
  | v.EnumSchema<{}, undefined>
  | v.FunctionSchema<undefined>
  | v.IntersectSchema<readonly T[], undefined>
  | v.LazySchema<T>
  | v.LiteralSchema<bigint | boolean | number | string | symbol, undefined>
  | v.MapSchema<T, T, undefined>
  | v.NanSchema<undefined>
  | v.NeverSchema<undefined>
  | v.NullSchema<undefined>
  | v.NullableSchema<T, undefined>
  | v.NonNullableSchema<T, undefined>
  | v.NonOptionalSchema<T, undefined>
  | v.NullableSchema<T, undefined>
  | v.NumberSchema<undefined>
  | v.ObjectSchema<{ [x: string]: T }, undefined>
  | v.LooseObjectSchema<{ [x: string]: T }, undefined>
  | v.StrictObjectSchema<{ [x: string]: T }, undefined>
  | v.ObjectWithRestSchema<{ [x: string]: T }, T, undefined>
  | v.ArraySchema<T, undefined>
  | v.PromiseSchema<undefined>
  | v.RecordSchema<v.StringSchema<undefined>, T, undefined>
  | v.SetSchema<T, undefined>
  | v.StringSchema<undefined>
  | v.SymbolSchema<undefined>
  | v.TupleSchema<readonly T[], undefined>
  | v.LooseTupleSchema<readonly T[], undefined>
  | v.StrictTupleSchema<readonly T[], undefined>
  | v.TupleWithRestSchema<readonly T[], T, undefined>
  | v.UndefinedSchema<undefined>
  | v.UndefinedableSchema<T, undefined>
  | v.UnknownSchema
  | v.VoidSchema<undefined>
  ;
