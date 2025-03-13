import type { Const, HKT, Identity, Kind, Mut, Mutable, TypeError } from './registry.js'
import type * as T from './registry.js'
import { fn, parseArgs, symbol, URI } from './registry.js'
import type { Json } from './json.js'

import type { SchemaOptions as Options } from './options.js'
import * as free from './free.js'
import type { Guard, Predicate as AnyPredicate, TypePredicate, ValidateTuple } from './types.js'
import * as AST from './ast.js'
import { applyOptions, getConfig } from './config.js'
import { is as guard } from './predicates.js'

export type {
  AnySchema,
  Schema,
  bottom,
  Entry,
  F,
  Fixpoint,
  Free,
  invalid,
  Leaf,
  Predicate,
  ReadonlyArray,
  top,
  typeOf,
  Unspecified,
}

export {
  isLeaf,
  inline,
}

export {
  never_ as never,
  any_ as any,
  unknown_ as unknown,
  void_ as void,
  null_ as null,
  undefined_ as undefined,
  bigint_ as bigint,
  symbol_ as symbol,
  boolean_ as boolean,
  integer,
  number_ as number,
  string_ as string,
  eq,
  optional,
  array,
  record,
  union,
  intersect,
  tuple,
  object_ as object,
}

/** @internal */
type BoolLookup = {
  true: top
  false: bottom
  boolean: unknown_
}

/** @internal */
const Object_assign = globalThis.Object.assign

/** @internal */
const isPredicate
  : <S, T extends S>(src: unknown) => src is { (): boolean; (x: S): x is T }
  = (src: unknown): src is never => typeof src === 'function'

export declare namespace Functor {
  type Index = (keyof any)[]
}

export const Functor: T.Functor<Free, Fixpoint> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isLeaf(x): return x
        case x.tag === URI.eq: return eq.def(x.def as never)
        case x.tag === URI.array: return array.def(f(x.def))
        case x.tag === URI.record: return record.def(f(x.def))
        case x.tag === URI.optional: return optional.def(f(x.def))
        case x.tag === URI.tuple: return tuple.def(fn.map(x.def, f))
        case x.tag === URI.object: return object_.def(fn.map(x.def, f))
        case x.tag === URI.union: return union.def(fn.map(x.def, f))
        case x.tag === URI.intersect: return intersect.def(fn.map(x.def, f))
      }
    }
  }
}

export const IndexedFunctor: T.Functor.Ix<Functor.Index, Free, Fixpoint> = {
  ...Functor,
  mapWithIndex(f) {
    return (x, ix) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isLeaf(x): return x
        case x.tag === URI.eq: return eq.def(x.def as never)
        case x.tag === URI.array: return array.def(f(x.def, ix))
        case x.tag === URI.record: return record.def(f(x.def, ix))
        case x.tag === URI.optional: return optional.def(f(x.def, ix))
        case x.tag === URI.tuple: return tuple.def(fn.map(x.def, (y, iy) => f(y, [...ix, iy])))
        case x.tag === URI.object: return object_.def(fn.map(x.def, (y, iy) => f(y, [...ix, iy])))
        case x.tag === URI.union: return union.def(fn.map(x.def, (y, iy) => f(y, [...ix, symbol.union, iy])))
        case x.tag === URI.intersect: return intersect.def(fn.map(x.def, (y, iy) => f(y, [...ix, symbol.intersect, iy])))
      }
    }
  },
}

export const fold = fn.cata(Functor)
export const unfold = fn.ana(Functor)
const foldWithIndex_ = fn.cataIx(IndexedFunctor)
export const foldWithIndex
  : <T>(algebra: T.IndexedAlgebra<Functor.Index, Free, T>) => <S extends Fixpoint>(x: S, ix?: Functor.Index) => T
  = (algebra) => (x, ix) => { return foldWithIndex_(algebra)(x, ix ?? []) }

interface never_ extends Guard<never>, AST.never { readonly _type: never }
interface any_ extends Guard<any>, AST.any { readonly _type: any }
interface unknown_ extends Guard<_>, AST.unknown { readonly _type: unknown }
interface void_ extends Guard<void>, AST.void { readonly _type: void }
interface null_ extends Guard<null>, AST.null { readonly _type: null }
interface undefined_ extends Guard<undefined>, AST.undefined { readonly _type: undefined }
interface bigint_ extends Guard<bigint>, AST.bigint { readonly _type: bigint }
interface symbol_ extends Guard<symbol>, AST.symbol { readonly _type: symbol }
interface boolean_ extends Guard<boolean>, AST.boolean { readonly _type: boolean }
interface integer extends Guard<number>, AST.integer { readonly _type: number }
interface number_ extends Guard<number>, AST.number { readonly _type: number }
interface string_ extends Guard<string>, AST.string { readonly _type: string }

const never_: never_ = Object_assign(
  (_src: unknown): _src is never => false,
  <never_>AST.never,
  // { validate: (_: unknown, __: Functor.Index) => false },
)

const any_: any_ = Object_assign(
  (_src: unknown): _src is any => true,
  <any_>AST.any,
  // { validate: (_: unknown, __: Functor.Index) => true },
)
const unknown_: unknown_ = Object_assign(
  (_src: unknown): _src is unknown => true,
  <unknown_>AST.unknown,
  // { validate: (_: unknown, __: Functor.Index) => true },
)

const void_: void_ = Object_assign(
  (src: unknown): src is void => src === void 0,
  <void_>AST.void,
  // { validate: (u: unknown, ctx: Functor.Index) => u === void 0 || [ERROR.symbol(ctx, u)] },
)

const null_: null_ = Object_assign(
  (src: unknown) => src === null,
  <null_>AST.null,
  // { validate: (u: unknown, ctx: Functor.Index) => u === null || [ERROR.symbol(ctx, u)] },
)

const undefined_: undefined_ = Object_assign(
  (src: unknown) => src === void 0,
  <undefined_>AST.undefined,
  // { validate: (u: unknown, ctx: Functor.Index) => u === void 0 || [ERROR.symbol(ctx, u)] },
)

const bigint_: bigint_ = Object_assign(
  (src: unknown) => typeof src === 'bigint',
  <bigint_>AST.bigint,
  // { validate: (u: unknown, ctx: Functor.Index) => typeof u === 'bigint' || [ERROR.symbol(ctx, u)] },
)

const symbol_: symbol_ = Object_assign(
  (src: unknown) => typeof src === 'symbol',
  <symbol_>AST.symbol,
  // { validate: (u: unknown, ctx: Functor.Index) => typeof u === 'symbol' || [ERROR.symbol(ctx, u)] },
)

const boolean_: boolean_ = Object_assign(
  (src: unknown) => typeof src === 'boolean',
  <boolean_>AST.boolean,
  // { validate: (u: unknown, ctx: Functor.Index) => typeof u === 'boolean' || [ERROR.boolean(ctx, u)] },
)

const integer: integer = Object_assign(
  (src: unknown): src is number => globalThis.Number.isInteger(src),
  <integer>AST.integer,
  // { validate: (u: unknown, ctx: Functor.Index) => globalThis.Number.isInteger(u) || [ERROR.integer(ctx, u)] },
)

const number_: number_ = Object_assign(
  (src: unknown) => typeof src === 'number',
  <number_>AST.number,
  // { validate: (u: unknown, ctx: Functor.Index) => typeof u === 'number' || [ERROR.integer(ctx, u)] },
)

const string_: string_ = Object_assign(
  (src: unknown) => typeof src === 'string',
  <string_>AST.string,
  // { validate: (u: unknown, ctx: Functor.Index) => typeof u === 'string' || [ERROR.integer(ctx, u)] },
)

function inline<S>(guard: Guard<S>): inline<S>
function inline<S extends AnyPredicate>(guard: S): inline<Entry<S>>
function inline<S>(guard: (Guard<S> | AnyPredicate<S>) & { tag?: URI.inline }) {
  guard.tag = URI.inline
  return guard
}

export type Source<T> = T extends (_: infer I) => unknown ? I : unknown
type Entry<S>
  = S extends { def: unknown } ? S
  : S extends Guard<infer T> ? inline<T>
  : S extends (() => infer _ extends boolean)
  ? BoolLookup[`${_}`]
  : S

type Predicate = AnyPredicate | Schema

type typeOf<
  T extends { _type?: unknown },
  _ extends
  | T['_type']
  = T['_type']
> = never | _

interface Unspecified extends AnySchema { }
interface AnySchema<T = unknown> {
  (u: unknown): u is T
  tag?: string
  def?: unknown
  _type?: T
}

interface Schema<Fn extends AnySchema = Unspecified>
  extends TypePredicate<Source<Fn>, Fn['_type']> {
  tag?: Fn['tag']
  def?: Fn['def']
  _type?: Fn['_type']
}

interface Free extends HKT { [-1]: F<this[0]> }
type Fixpoint
  = Leaf
  | eq.def<Json, Const>
  | array.def<Fixpoint, Const>
  | record.def<Fixpoint, Const>
  | optional.def<Fixpoint, Const>
  | object_.def<{ [x: string]: Fixpoint }, Const>
  | tuple.def<readonly Fixpoint[], optional<any>, Const>
  | union.def<readonly Fixpoint[], Const>
  | intersect.def<readonly Fixpoint[], Const>
  ;

type F<_>
  = Leaf
  | eq.def<_>
  | array.def<_>
  | optional.def<_>
  | record.def<_>
  | object_.def<{ [x: string]: _ }>
  | tuple.def<readonly _[]>
  | union.def<readonly _[]>
  | intersect.def<readonly _[]>
  ;

type _ = unknown
interface inline<T> extends Guard<T> { readonly _type: T, tag: URI.inline }
interface top { readonly _type: unknown, tag: URI.top, }
interface bottom { readonly _type: never, tag: URI.bottom, }
interface invalid<_Err> extends TypeError<''>, never_ { }

type Leaf = typeof Leaves[number]
const Leaves = [
  unknown_, never_, any_, void_, undefined_, null_, symbol_, bigint_, boolean_, integer, number_, string_
] as const satisfies any[]
const leafTags = Leaves.map((_) => _.tag) satisfies typeof AST.leafTags
const isLeaf = (u: unknown): u is Leaf =>
  typeof u === 'function' && 'tag' in u && typeof u.tag === 'string' && (<string[]>leafTags).includes(u.tag)

interface eq<S = Unspecified> extends eq.def<S> { }
function eq<V extends Mut<V>>(value: V, options?: Options): eq<Mutable<V>>
function eq<V extends Mut<V>>(value: V, options?: Options): eq<Mutable<V>>
function eq<const V>(value: V, options?: Options): eq<Mutable<V>>
function eq(v: unknown, $?: Options) { return eq.def(v, $) }
namespace eq {
  export interface def<T, F extends HKT = Identity> extends AST.eq<T> {
    readonly _type: Kind<F, T>
    (u: unknown): u is this['_type']
    // validate: ValidationFn
  }
  export function def<const T>(x: T, $?: Options): eq.def<T>
  export function def(x: unknown, $: Options = getConfig().schema) {
    const config = applyOptions($)
    const equals = isPredicate(x) ? x : (src: unknown) => config.eq.equalsFn(src, x)
    return Object_assign(
      (src: unknown) => equals(src),
      AST.eq(x),
    )
  }
}

function array<S extends Schema>(schema: S, readonly: 'readonly'): ReadonlyArray<S>
function array<S extends Schema>(schema: S): array<S>
function array(x: Schema) { return array.def(x) }
interface array<S extends Schema = Unspecified> extends array.def<S> { }
namespace array {
  export interface def<T, F extends HKT = free.Array> extends AST.array<T> {
    readonly _type: Kind<F, T>
    (u: unknown): u is this['_type']
    // validate: ValidationFn
  }
  export function def<T>(x: T): array.def<T>
  export function def(x: unknown): {} {
    const arrayGuard = isPredicate(x) ? guard.array(x) : guard.anyArray
    return Object_assign(
      (src: unknown) => arrayGuard(src),
      AST.array(x),
    )
  }
}

interface ReadonlyArray<S extends Schema = Unspecified> extends array.def<S, free.ReadonlyArray> { }

function record<S extends Schema>(schema: S): record<S>
function record(x: Schema) { return record.def(x) }
interface record<S extends AnySchema = Unspecified> extends record.def<S> { }
namespace record {
  export interface def<T, F extends HKT = free.Record> extends AST.record<T> {
    readonly _type: Kind<F, T>
    (u: unknown): u is this['_type']
    // validate: ValidationFn
  }
  export function def<T>(x: T): record.def<T>
  export function def(x: unknown): {} {
    const recordGuard = isPredicate(x) ? guard.record(x) : guard.anyObject
    return Object_assign((src: unknown) => recordGuard(src), AST.record(x))
  }
}

function union<S extends readonly Schema[]>(...schemas: S): union<S>
function union(...xs: Schema[]) { return union.def(xs) }
interface union<S extends readonly Schema[] = Schema[]> extends union.def<S> { }
namespace union {
  export interface def<T, F extends HKT = free.Union> extends AST.union<T> {
    readonly _type: Kind<F, T>
    (u: unknown): u is this['_type']
    // validate: ValidationFn
  }
  export function def<T extends readonly unknown[]>(xs: T): union.def<T>
  export function def(xs: unknown[]) {
    const anyOf = xs.every(isPredicate) ? guard.union(xs) : guard.unknown
    return Object_assign(
      (src: unknown) => anyOf(src),
      AST.union(xs)
    )
  }
}

function intersect<S extends readonly Schema[]>(...schemas: S): intersect<S>
function intersect(...xs: Schema[]) { return intersect.def(xs) }
interface intersect<S extends readonly Schema[] = Schema[]> extends intersect.def<S> { }
namespace intersect {
  export interface def<
    T,
    F extends HKT = free.Intersect
  > extends AST.intersect<T> {
    readonly _type: Kind<F, T>
    (u: unknown): u is this['_type']
    // validate: ValidationFn
  }
  export function def<T extends readonly unknown[]>(xs: T): intersect.def<T>
  export function def(xs: unknown[]) {
    const allOf = xs.every(isPredicate) ? guard.intersect(xs) : guard.unknown
    return Object_assign(
      (src: unknown) => allOf(src),
      AST.intersect(xs)
    )
  }
}

function optional<S extends Schema>(schema: S): optional<S>
function optional(x: Schema) { return optional.def(x) }
interface optional<S extends Schema = Unspecified> extends optional.def<S> { }
namespace optional {
  export interface def<T, F extends HKT = free.Optional> extends
    AST.optional<T> {
    readonly _type: Kind<F, T>
    (u: unknown): u is this['_type']
    // validate: ValidationFn
  }
  export function def<T>(x: T): optional.def<T>
  export function def(x: unknown): {} {
    const optionalGuard = isPredicate(x) ? guard.optional(x) : guard.unknown
    return Object_assign(
      (src: unknown) => optionalGuard(src),
      AST.optional(x)
    )
  }
  export const is
    : <S extends Schema>(u: unknown) => u is optional<S>
    = (u): u is never => !!u && (
      typeof u === 'function' || typeof u === 'object'
    ) && 'tag' in u && u.tag === URI.optional
}

function object_<
  S extends { [x: string]: Schema },
  T extends { [K in keyof S]: Entry<S[K]> }
>(schemas: S, options?: Options): object_<T>
function object_<
  S extends { [x: string]: Predicate },
  T extends { [K in keyof S]: Entry<S[K]> }
>(schemas: S, options?: Options): object_<T>
function object_(xs: { [x: string]: Predicate }, $?: Options): {} {
  return object_.def(xs, $)
}

interface object_<
  S extends
  | { [x: string]: unknown }
  = { [x: string]: unknown },
> extends object_.def<S> { }

namespace object_ {
  export interface def<T, F extends HKT = free.Object> extends AST.object<T> {
    readonly _type: Kind<F, T>
    readonly opt: free.Optionals<T>[]
    (u: unknown): u is this['_type']
    // validate: ValidationFn
  }
  export function def<T extends { [x: string]: unknown }>(ps: T, $?: Options): object_.def<T>
  export function def(xs: { [x: string]: unknown }, $?: Options): {} {
    const objectGuard = guard.record(isPredicate)(xs) ? guard.object(xs, applyOptions($)) : guard.anyObject
    const opt = globalThis.Object.keys(xs).filter((k) => optional.is(xs[k]))
    return Object_assign(
      (src: unknown) => objectGuard(src),
      { opt },
      AST.object(xs),
    )
  }
}

function tuple<
  S extends readonly Schema[],
  T extends { -readonly [Ix in keyof S]: Entry<S[Ix]> }
>(...schemas: ValidateTuple<S>): tuple<tuple.from<typeof schemas, T>>
//
function tuple<
  S extends readonly Schema[],
  T extends { -readonly [Ix in keyof S]: Entry<S[Ix]> },
  V extends ValidateTuple<S>
>(...schemas: [...guards: ValidateTuple<S>, options?: Options]): tuple<tuple.from<ValidateTuple<S>, T>>
//
function tuple(
  ...args:
    | [...guard: readonly Predicate[]]
    | [...guard: readonly Predicate[], $: Options]
): {} {
  const [guards, $] = parseArgs(getConfig().schema, args)
  return tuple.def(guards, $)
}

interface tuple<S extends readonly unknown[] = unknown[]> extends tuple.def<S> { }
namespace tuple {
  export interface def<T, LowerBound = optional<any>, F extends HKT = free.Tuple<LowerBound>> extends AST.tuple<T> {
    readonly _type: Kind<F, T>
    (u: unknown): u is this['_type']
    // validate: ValidationFn
  }
  export function def<T extends readonly unknown[]>(xs: readonly [...T], $?: Options): tuple.def<T>
  export function def(xs: readonly unknown[], $: Options = getConfig().schema) {
    const options = {
      ...$, minLength: $.optionalTreatment === 'treatUndefinedAndOptionalAsTheSame' ? -1 : xs.findIndex(optional.is)
    } satisfies tuple.InternalOptions
    const tupleGuard = xs.every(isPredicate) ? guard.tuple(options)(xs) : guard.anyArray
    return Object_assign(
      (src: unknown) => tupleGuard(src),
      AST.tuple(xs)
    )
  }
}
declare namespace tuple {
  type InternalOptions = { minLength?: number }
  type from<V extends readonly unknown[], T extends readonly unknown[]>
    = TypeError extends V[number]
    ? { [I in keyof V]: V[I] extends TypeError ? invalid<Extract<V[I], TypeError>> : V[I] }
    : T
}
