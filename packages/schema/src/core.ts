import type { Const, HKT, Identity, Kind, Mut, Mutable, TypeError } from './registry.js'
import type * as T from './registry.js'
import { fn, parseArgs, symbol, URI } from './registry.js'
import type { Json } from './json.js'

import type { SchemaOptions as Options } from './options.js'
import * as free from './free.js'
import type { Guard, Predicate as AnyPredicate, TypePredicate, ValidateTuple } from './types.js'
import * as AST from './ast.js'
import { applyOptions, getConfig } from './config.js'
import { is as Combinator } from './predicates.js'

import type { ValidationError } from './errors.js'
import { ERROR } from './errors.js'

export type {
  AnySchema,
  bottom,
  Entry,
  F,
  Fixpoint,
  Free,
  invalid,
  Leaf,
  Predicate,
  Schema,
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
  : <S, T extends S>(u: unknown) => u is { (): boolean; (x: S): x is T }
  = (u: unknown): u is never => typeof u === 'function'

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
  = (algebra) => (x, ix) => { return (console.log('x in foldWithIndex', x), foldWithIndex_(algebra)(x, ix ?? [])) }

interface never_ extends Guard<never>, AST.never { readonly _type: never, validate: ValidationFn }
interface any_ extends Guard<any>, AST.any { readonly _type: any, validate: ValidationFn }
interface unknown_ extends Guard<_>, AST.unknown { readonly _type: unknown, validate: ValidationFn }
interface void_ extends Guard<void>, AST.void { readonly _type: void, validate: ValidationFn }
interface null_ extends Guard<null>, AST.null { readonly _type: null, validate: ValidationFn }
interface undefined_ extends Guard<undefined>, AST.undefined { readonly _type: undefined, validate: ValidationFn }
interface bigint_ extends Guard<bigint>, AST.bigint { readonly _type: bigint, validate: ValidationFn }
interface symbol_ extends Guard<symbol>, AST.symbol { readonly _type: symbol, validate: ValidationFn }
interface boolean_ extends Guard<boolean>, AST.boolean { readonly _type: boolean, validate: ValidationFn }
interface integer extends Guard<number>, AST.integer { readonly _type: number, validate: ValidationFn }
interface number_ extends Guard<number>, AST.number { readonly _type: number, validate: ValidationFn }
interface string_ extends Guard<string>, AST.string { readonly _type: string, validate: ValidationFn }

const never_: never_ = Object_assign(
  (_: _): _ is never => false,
  <never_>AST.never,
  { validate: (_: unknown, __: Functor.Index) => false },
)

const any_: any_ = Object_assign(
  (_: _): _ is any => true,
  <any_>AST.any,
  { validate: (_: unknown, __: Functor.Index) => true },
)
const unknown_: unknown_ = Object_assign(
  (_: _): _ is unknown => true,
  <unknown_>AST.unknown,
  { validate: (_: unknown, __: Functor.Index) => true },
)

const void_: void_ = Object_assign(
  (_: _): _ is void => _ === void 0,
  <void_>AST.void,
  { validate: (u: unknown, ctx: Functor.Index) => u === void 0 || [ERROR.symbol(ctx, u)] },
)

const null_: null_ = Object_assign(
  (_: _) => _ === null,
  <null_>AST.null,
  { validate: (u: unknown, ctx: Functor.Index) => u === null || [ERROR.symbol(ctx, u)] },
)

const undefined_: undefined_ = Object_assign(
  (_: _) => _ === void 0,
  <undefined_>AST.undefined,
  { validate: (u: unknown, ctx: Functor.Index) => u === void 0 || [ERROR.symbol(ctx, u)] },
)

const bigint_: bigint_ = Object_assign(
  (_: _) => typeof _ === 'bigint',
  <bigint_>AST.bigint,
  { validate: (u: unknown, ctx: Functor.Index) => typeof u === 'bigint' || [ERROR.symbol(ctx, u)] },
)

const symbol_: symbol_ = Object_assign(
  (_: _) => typeof _ === 'symbol',
  <symbol_>AST.symbol,
  { validate: (u: unknown, ctx: Functor.Index) => typeof u === 'symbol' || [ERROR.symbol(ctx, u)] },
)

const boolean_: boolean_ = Object_assign(
  (_: _) => typeof _ === 'boolean',
  <boolean_>AST.boolean,
  { validate: (u: unknown, ctx: Functor.Index) => typeof u === 'boolean' || [ERROR.boolean(ctx, u)] },
)

const integer: integer = Object_assign(
  (u: unknown): u is number => globalThis.Number.isInteger(u),
  <integer>AST.integer,
  { validate: (u: unknown, ctx: Functor.Index) => globalThis.Number.isInteger(u) || [ERROR.integer(ctx, u)] },
)

const number_: number_ = Object_assign(
  (_: _) => typeof _ === 'number',
  <number_>AST.number,
  { validate: (u: unknown, ctx: Functor.Index) => typeof u === 'number' || [ERROR.integer(ctx, u)] },
)

const string_: string_ = Object_assign(
  (_: _) => typeof _ === 'string',
  <string_>AST.string,
  { validate: (u: unknown, ctx: Functor.Index) => typeof u === 'string' || [ERROR.integer(ctx, u)] },
)

function inline<S>(guard: Guard<S>): inline<S>
function inline<S extends AnyPredicate>(guard: S): inline<Entry<S>>
function inline<S>(guard: (Guard<S> | AnyPredicate<S>) & { tag?: URI.inline }) {
  guard.tag = URI.inline
  return guard
}

type ValidationFn = never | { (u: unknown): true | ValidationError[] }

type Source<T> = T extends (_: infer I) => unknown ? I : unknown
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
    validate: ValidationFn
  }
  export function def<const T>(x: T, $?: Options): eq.def<T>
  export function def(x: unknown, $: Options = getConfig().schema) {
    const config = applyOptions($)
    const schema = Object_assign(
      (src: unknown): src is unknown => typeof x === 'function' ? x(src) : config.eq.equalsFn(src, x),
      AST.eq(x),
    )
    return schema
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
    validate: ValidationFn
  }
  export function def<T>(x: T): array.def<T>
  export function def(x: unknown): {} {
    const schema = Object_assign((src: unknown): src is unknown => isPredicate(x) ? Combinator.array(x)(src) : x as never, AST.array(x))
    return schema
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
    validate: ValidationFn
  }
  export function def<T>(x: T): record.def<T>
  export function def(x: unknown): {} {
    const schema = Object_assign((src: unknown): src is unknown => isPredicate(x) ? Combinator.record(x)(src) : x as never, AST.record(x))
    return schema
  }
}

function union<S extends readonly Schema[]>(...schemas: S): union<S>
function union(...xs: Schema[]) { return union.def(xs) }
interface union<S extends readonly Schema[] = Schema[]> extends union.def<S> { }
namespace union {
  export interface def<T, F extends HKT = free.Union> extends AST.union<T> {
    readonly _type: Kind<F, T>
    (u: unknown): u is this['_type']
    validate: ValidationFn
  }
  export function def<T extends readonly unknown[]>(xs: T): union.def<T>
  export function def(xs: unknown[]) {
    const schema = Object_assign(
      (src: unknown): src is unknown => xs.every(isPredicate) ? Combinator.union(...xs)(src) : xs as never,
      AST.union(xs)
    )
    return schema
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
    validate: ValidationFn
  }
  export function def<T extends readonly unknown[]>(xs: T): intersect.def<T>
  export function def(xs: unknown[]) {
    const schema = Object_assign(
      (src: unknown): src is unknown => xs.every(isPredicate) ? Combinator.intersect(...xs)(src) : xs as never,
      AST.intersect(xs)
    )
    return schema
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
    validate: ValidationFn
  }
  export function def<T>(x: T): optional.def<T>
  export function def(x: unknown): {} {
    const schema = Object_assign(
      (src: unknown): src is unknown => isPredicate(x) ? Combinator.optional(x)(src) : x as never,
      AST.optional(x)
    )
    return schema
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
function object_(xs: { [x: string]: Predicate }, $: Options = getConfig().schema): {} {
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
    validate: ValidationFn
  }
  export function def<T extends { [x: string]: unknown }>(ps: T, $?: Options): object_.def<T>
  export function def(xs: { [x: string]: unknown }, $?: Options): {} {
    const schema = Object_assign(
      (src: unknown): src is unknown => Combinator.record(isPredicate)(xs) ? Combinator.object(xs, { ...getConfig().schema, ...$ })(src) : xs as never,
      { opt: globalThis.Object.keys(xs).filter((k) => optional.is(xs[k])) },
      AST.object(xs),
    )
    return schema
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
    validate: ValidationFn
  }
  export function def<T extends readonly unknown[]>(xs: readonly [...T], $?: Options): tuple.def<T>
  export function def(xs: readonly unknown[], $: Options = getConfig().schema) {
    const options = {
      ...$, minLength: $.optionalTreatment === 'treatUndefinedAndOptionalAsTheSame' ? -1 : xs.findIndex(optional.is)
    } satisfies tuple.InternalOptions
    const schema = Object_assign(
      (src: unknown): src is unknown => xs.every(isPredicate) ? Combinator.tuple(options)(...xs)(src) : xs as never,
      AST.tuple(xs)
    )
    return schema
  }
}
declare namespace tuple {
  type InternalOptions = { minLength?: number }
  type from<V extends readonly unknown[], T extends readonly unknown[]>
    = TypeError extends V[number] ? { [I in keyof V]: V[I] extends TypeError ? invalid<Extract<V[I], TypeError>> : V[I] }
    : T
    ;
}

// function validatorFromSchema(x: AnySchema, ix?: Functor.Index): (u: unknown) => true | ValidationError[]
// function validatorFromSchema(x: unknown, ix?: Functor.Index): {} {
//   console.log('x', x)
//   return foldWithIndex(Recursive.fromSchema)(x as never, ix)
// }

// namespace Recursive {
//   export const fromSchema: T.IndexedAlgebra<Functor.Index, Free, ValidationFn> = (x, ctx) => {
//     switch (true) {
//       default: return (console.log('exhaustive in Recursive.fromSchema', x), fn.exhaustive(x))
//       case isLeaf(x): return vNullary[typeName(x)](ctx)
//       case x.tag === URI.eq: return mapEq(x.def, ctx)
//       case x.tag === URI.optional: return mapOptional(x.def, ctx)
//       case x.tag === URI.array: return mapArray(x.def, ctx)
//       case x.tag === URI.record: return mapRecord(x.def, ctx)
//       case x.tag === URI.tuple: return mapTuple(x.def, ctx)
//       case x.tag === URI.union: return mapUnion(x.def, ctx)
//       case x.tag === URI.intersect: return mapIntersect(x.def, ctx)
//       case x.tag === URI.object: return mapObject(x.def, ctx)
//     }
//   }
// }

// interface vNever extends never_ { validate: ValidationFn }
// const vNever: vNever = Object.assign(never_, { validate: vNullary.never([]) })

// interface vUnknown extends unknown_ { validate: ValidationFn }
// const vUnknown: vUnknown = Object.assign(unknown_, { validate: vNullary.unknown([]) })

// interface vAny extends any_ { validate: ValidationFn }
// const vAny: vAny = Object.assign(any_, { validate: vNullary.any([]) })

// interface vVoid extends void_ { validate: ValidationFn }
// const vVoid: vVoid = Object.assign(void_, { validate: vNullary.void([]) })

// interface vString extends string_ { validate: ValidationFn }
// const vString: vString = Object.assign(string_, { validate: vNullary.string([]) })

// interface vNumber extends number_ { validate: ValidationFn }
// const vNumber: vNumber = Object.assign(number_, { validate: vNullary.number([]) })

// interface vBoolean extends boolean_ { validate: ValidationFn }
// const vBoolean: vBoolean = Object.assign(boolean_, { validate: vNullary.boolean([]) })

// interface vNull extends null_ { validate: ValidationFn }
// const vNull: vNull = Object.assign(null_, { validate: vNullary.null([]) })

// interface vInteger extends integer { validate: ValidationFn }
// const vInteger: vInteger = Object.assign(integer, { validate: vNullary.integer([]) })

// interface vSymbol extends symbol_ { validate: ValidationFn }
// const vSymbol: vSymbol = Object.assign(symbol_, { validate: vNullary.symbol([]) })

// interface vBigInt extends bigint_ { validate: ValidationFn }
// const vBigInt: vBigInt = Object.assign(bigint_, { validate: vNullary.bigint([]) })

// interface vUndefined extends undefined_ { validate: ValidationFn }
// const vUndefined: vUndefined = Object.assign(undefined_, { validate: vNullary.undefined([]) })

// interface vEq<V> extends eq.def<V> { validate: ValidationFn }
// const vEq
//   : <V>(value: V, options?: Options) => eq<V>
//   = (x, $) => {
//     const schema = eq.def(x, $)
//     const validate = validatorFromSchema(schema)
//     return Object.assign(schema, { validate })
//   }

// interface vOptional<S> extends optional.def<S> { validate: ValidationFn }
// function vOptional<S>(x: S): vOptional<S> {
//   const _ = optional.def(x)
//   const validate = validatorFromSchema(_)
//   return Object.assign(_, { validate })
// }

// vOptional.is = isOptional

// interface vArray<S> extends array.def<S> { validate: ValidationFn }
// function vArray<S>(x: S): vArray<S> {
//   const _ = array.def(x)
//   const validate = validatorFromSchema(_)
//   return Object.assign(_, { validate })
// }

// interface vRecord<S> extends record.def<S> { validate: ValidationFn }
// function vRecord<S>(x: S): vRecord<S> {
//   const schema = record.def(x)
//   const validate = validatorFromSchema(schema)
//   return Object.assign(schema, { validate })
// }

// interface vUnion<S extends readonly unknown[]> extends union.def<S> { validate: ValidationFn }
// function vUnion<S extends readonly unknown[]>(xs: S): vUnion<S> {
//   const schema = union.def(xs)
//   const validate = validatorFromSchema(schema)
//   return Object.assign(schema, { validate })
// }

// interface vIntersect<S extends readonly unknown[]> extends intersect.def<S> { validate: ValidationFn }
// function vIntersect<S extends readonly unknown[]>(xs: S): vIntersect<S> {
//   const schema = intersect.def(xs)
//   const validate = validatorFromSchema(schema)
//   return Object.assign(schema, { validate })
// }

// interface vTuple<S extends readonly unknown[]> extends tuple.def<S> { validate: ValidationFn }
// function vTuple<S extends readonly unknown[]>(xs: S, options?: Options): vTuple<S> {
//   const schema = tuple.def<S>(xs, options)
//   const validate = validatorFromSchema(schema)
//   return Object.assign(schema, { validate })
// }

// interface vObject<S extends { [x: string]: unknown }> extends object_.def<S> { validate: ValidationFn }
// function vObject<S extends { [x: string]: unknown }>(xs: S, options?: Options): vObject<S> {
//   const schema = object_.def(xs, options)
//   const validate = validatorFromSchema(schema)
//   return Object.assign(schema, { validate })
// }

// const exactOptional = (
//   u: { [x: string]: unknown },
//   x: { [x: string]: ValidationFn },
//   ctx: Functor.Index,
//   errors: ValidationError[]
// ) => {
//   const keys = Object_keys(x)
//   const len = keys.length;
//   for (let ix = 0; ix < len; ix++) {
//     const k = keys[ix]
//     const validationFn = x[k]
//     const path = [...ctx, k]
//     // if ('tag' in y && y.tag === URI.undefined) {
//     //   if (!hasOwn(u, k)) {
//     //     // console.log('exactOptional: 1', k, ctx.path)
//     //     errors.push(UNARY.object.missing(u, [...ctx, k]))
//     //     continue
//     //   }
//     // }
//     if (symbol.optional in validationFn) {
//       if (hasOwn(u, k) && u[k] === undefined) {
//         let results = validationFn(u[k])
//         if (results === true) {
//           errors.push(UNARY.object.invalid(u[k], path))
//           continue
//         }
//         errors.push(...results)
//         continue
//       }
//       if (!hasOwn(u, k)) { continue }
//     }
//     if (!hasOwn(u, k)) {
//       errors.push(UNARY.object.missing(u, [...ctx, k]))
//       continue
//     }
//     let results = validationFn(u[k])
//     if (results !== true) {
//       for (let iz = 0; iz < results.length; iz++) {
//         let result = results[iz]
//         errors.push(result)
//       }
//     }
//   }
//   return errors.length > 0 ? errors : true
// }

// const presentButUndefinedIsOK = (
//   u: { [x: string]: unknown },
//   x: { [x: string]: ValidationFn },
//   ctx: Functor.Index,
//   errors: ValidationError[]
// ) => {
//   const keys = Object_keys(x)
//   const len = keys.length;
//   for (let i = 0; i < len; i++) {
//     const k = keys[i]
//     const validationFn = x[k]
//     if (symbol.optional in validationFn) {
//       if (!hasOwn(u, k)) continue
//       if (symbol.optional in validationFn && hasOwn(u, k)) {
//         if (u[k] === undefined) continue
//         let results = validationFn(u[k])
//         if (results === true) continue
//         for (let j = 0; j < results.length; j++) {
//           let result = results[j]
//           errors.push(result)
//           continue
//         }
//       }
//     }
//     if (!hasOwn(u, k)) {
//       errors.push(UNARY.object.missing(u, [...ctx, k]))
//       continue
//     }
//     let results = validationFn(u[k])
//     if (results === true) continue
//     for (let iz = 0; iz < results.length; iz++) {
//       let result = results[iz]
//       errors.push(result)
//     }
//   }
//   return errors.length > 0 ? errors : true
// }

// const treatUndefinedAndOptionalAsTheSame = (
//   u: { [x: string]: unknown },
//   x: { [x: string]: ValidationFn },
//   ctx: Functor.Index,
//   errors: ValidationError[]
// ) => {
//   const keys = Object_keys(x)
//   const len = keys.length;
//   for (let ix = 0; ix < len; ix++) {
//     const k = keys[ix]
//     const validationFn = x[k]
//     if (!hasOwn(u, k) && !(symbol.optional in validationFn)) {
//       errors.push(UNARY.object.missing(u, [...ctx, k]))
//       continue
//     }
//     let results = validationFn(u[k])
//     if (results === true) continue
//     for (let iz = 0; iz < results.length; iz++) {
//       let result = results[iz]
//       errors.push(result)
//     }
//   }
//   return errors.length > 0 ? errors : true
// }

// const mapArray
//   : (validationFn: ValidationFn, ctx: Functor.Index) => ValidationFn
//   = (validationFn, ctx) => {
//     function validateArray(u: unknown): true | ValidationError[] {
//       if (!Array_isArray(u)) return [ERROR.array(ctx, u)]
//       let errors = Array.of<ValidationError>()
//       const len = u.length
//       for (let i = 0; i < len; i++) {
//         const v = u[i]
//         const results = validationFn(v)
//         if (results !== true) {
//           for (let j = 0; j < results.length; j++) {
//             let result = results[j]
//             result.path.push(i)
//             errors.push(results[j])
//           }
//           // errors.push(ERROR.arrayElement([...ctx, ix], u[ix]))
//         }
//       }
//       if (errors.length > 0) return errors
//       return true
//     }
//     return validateArray
//   }

// const mapRecord
//   : (validationFn: ValidationFn, ctx: Functor.Index) => ValidationFn
//   = (validationFn, ctx) => {
//     function validateRecord(u: unknown): true | ValidationError[] {
//       if (!isObject(u)) return [ERROR.object(ctx, u)]
//       let errors = Array.of<ValidationError>()
//       const keys = Object_keys(u)
//       const len = keys.length
//       for (let ix = 0; ix < len; ix++) {
//         const k = keys[ix]
//         const v = u[k]
//         const results = validationFn(v)
//         if (results !== true) {
//           for (let iy = 0; iy < results.length; iy++) {
//             const result = results[iy]
//             result.path.push(k)
//             errors.push(result)
//           }
//           results.push(ERROR.objectValue([...ctx, k], u[k]))
//         }
//       }
//       return errors.length > 0 ? errors : true
//     }
//     return validateRecord
//   }

// const mapObject
//   : (validationFns: { [x: string]: ValidationFn }, ix: Functor.Index) => ValidationFn
//   = (validationFns, ctx) => {
//     function validateObject(u: unknown): true | ValidationError[] {
//       if (!isObject(u)) return [ERROR.object(ctx, u)]
//       let errors = Array.of<ValidationError>()
//       const { schema: { optionalTreatment } } = getConfig()

//       if (optionalTreatment === 'exactOptional')
//         return exactOptional(u, validationFns, ctx, errors)
//       if (optionalTreatment === 'presentButUndefinedIsOK')
//         return presentButUndefinedIsOK(u, validationFns, ctx, errors)
//       if (optionalTreatment === 'treatUndefinedAndOptionalAsTheSame')
//         return treatUndefinedAndOptionalAsTheSame(u, validationFns, ctx, errors)

//       const keys = Object_keys(validationFns)
//       const len = keys.length;
//       for (let ix = 0; ix < len; ix++) {
//         const k = keys[ix]
//         const validationFn = validationFns[k]
//         if (!hasOwn(u, k) && !(symbol.optional in validationFn)) {
//           errors.push(ERROR.missingKey([...ctx, k], u))
//           continue
//         }
//         const results = validationFn(u[k])
//         if (results !== true) {
//           for (let iy = 0; iy < results.length; iy++) errors.push(results[iy])
//           results.push(ERROR.objectValue([...ctx, k], u[k]))
//         }
//       }
//       return errors.length > 0 ? errors : true
//     }
//     return validateObject
//   }

// const mapTuple
//   : (validationFns: readonly ValidationFn[], ctx: Functor.Index) => ValidationFn
//   = (validationFns, ctx) => {
//     function validateTuple(u: unknown): true | ValidationError[] {
//       let errors = Array.of<ValidationError>()
//       if (!Array_isArray(u)) return [ERROR.array(ctx, u)]
//       const len = validationFns.length
//       for (let ix = 0; ix < len; ix++) {
//         const validationFn = validationFns[ix]
//         if (!(ix in u) && !(symbol.optional in validationFn)) {
//           errors.push(ERROR.missingIndex([...ctx, ix], u))
//           continue
//         }
//         const results = validationFn(u[ix])
//         if (results !== true) {
//           for (let iy = 0; iy < results.length; iy++) errors.push(results[iy])
//           results.push(ERROR.arrayElement([...ctx, ix], u[ix]))
//         }
//       }
//       if (u.length > validationFns.length) {
//         const len = validationFns.length;
//         for (let iz = len; iz < u.length; iz++) {
//           const excess = u[iz]
//           errors.push(ERROR.excessItems([...ctx, iz], excess))
//         }
//       }
//       return errors.length > 0 ? errors : true
//     }
//     return validateTuple
//   }

// const mapUnion
//   : (validationFns: readonly ValidationFn[], ctx: Functor.Index) => ValidationFn
//   = (validationFns, _ctx) => {
//     function validateUnion(u: unknown): true | ValidationError[] {
//       const len = validationFns.length
//       let errors = Array.of<ValidationError>()
//       for (let ix = 0; ix < len; ix++) {
//         const validationFn = validationFns[ix]
//         const results = validationFn(u)
//         if (results === true) return true
//         for (let iy = 0; iy < results.length; iy++) errors.push(results[iy])
//       }
//       return errors.length > 0 ? errors : true
//     }
//     if (validationFns.every(optional.is)) validateUnion[symbol.optional] = true
//     return validateUnion
//   }

// const mapIntersect
//   : (validationFns: readonly ValidationFn[], ctx: Functor.Index) => ValidationFn
//   = (validationFns, _ctx) => {
//     function validateIntersection(u: unknown): true | ValidationError[] {
//       const len = validationFns.length
//       let errors = Array.of<ValidationError>()
//       for (let ix = 0; ix < len; ix++) {
//         const validationFn = validationFns[ix]
//         const results = validationFn(u)
//         if (results !== true)
//           for (let iy = 0; iy < results.length; iy++) errors.push(results[iy])
//       }
//       return errors.length > 0 ? errors : true
//     }
//     return validateIntersection
//   }

// const mapEq
//   : (value: ValidationFn, ctx: Functor.Index) => ValidationFn
//   = (value, ctx) => {
//     function validateEq(u: unknown): true | ValidationError[] {
//       const results = value(u)
//       if (results === true) return true
//       return [ERROR.eq(ctx, u, value)]
//     }
//     return validateEq
//   }

// function mapOptional(validationFn: ValidationFn, _: Functor.Index): ValidationFn {
//   function validateOptional(u: unknown) {
//     if (u === void 0) return true
//     const results = validationFn(u)
//     const { schema: { optionalTreatment } } = getConfig()
//     if (results === true) return true
//     if (optionalTreatment === 'exactOptional') {
//       for (let i = 0; i < results.length; i++) {
//         let _result = results[i]
//         // if (!result.msg?.endsWith(' or optional')) {
//         //   result.msg += ' or optional'
//         // }
//       }
//     }
//     return results
//   }
//   validateOptional[symbol.optional] = true
//   return validateOptional
// }

// const isOptional = <S extends Schema>(u: unknown): u is optional<S> =>
//   !!u && typeof u === 'function' && symbol.optional in u && u[symbol.optional] === true