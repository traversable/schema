import type {
  $,
  Force,
  Functor,
  Guard,
  HKT,
  Predicate,
  Thunk,
  TypePredicate,
} from './types.js'
import { type as t } from './type.js'
import { symbol as Symbol, URI } from './uri.js'
import * as parse from './parse.js'
import { equals } from './eq.js'
import { exhaustive } from './function.js'
import * as p from './predicates.js'
import * as fn from './function.js'
import { Registry } from './extension.js'

export type Param<T> = T extends (_: infer I) => unknown ? I : never

/**
 * ## {@link Schema `t.Schema`}
 *
 * The {@link Schema `t.Schema`} type describes an input node.
 *
 * The `-1` property is intentionally out-of-band, and can be
 * used as an extension point, or to store arbitrary metadata
 * about a given node.
 *
 * If your use case is simple, you probably won't ever need to
 * use it. It mostly comes in handy when you're building a set
 * of combinators for others to use, and would like to add a
 * piece of data to every node in the tree.
 */
export type Schema<I = unknown, O = unknown>
  = Predicate<I>
  | TypePredicate<I, O>
  | { [-1]: Predicate<I> | TypePredicate<I, O> }

export declare namespace Schema {
  type Options = {
    optionalTreatment?: OptionalTreatment
    treatArraysAsObjects?: boolean
  }
  type OptionalTreatment = never
    | 'exactOptional'
    | 'presentButUndefinedIsOK'
    | 'treatUndefinedAndOptionalAsTheSame'
    ;
}

/** @internal */
interface InternalModel<T = unknown> extends Thunk<T>, Predicate<T> {
  [Symbol.tag]?: unknown
  [Symbol.type]?: unknown
  [Symbol.def]?: unknown
}

export type Identifiable = { [Symbol.tag]?: unknown }
export type Typeable = { [Symbol.type]?: unknown }
export type Introspectable = { [Symbol.def]?: unknown }

/** @internal */
const Object_values = globalThis.Object.values

/** @internal */
const constTrue = () => true as const

/** @internal */
const constFalse = () => false as const


export {
  /**
   * ## {@link typeOf `t.typeof`}
   *
   * Access the type that it holds.
   */
  typeOf as typeof
}

type typeOf<T> = T[Symbol.type & keyof T]
function typeOf<T extends Typeable>(x: T): typeOf<T> { return x[Symbol.def as never] }


/**
 * ## {@link identify `t.identify`}
 *
 * Access a schema's tag.
 */
export type identify<T> = T[Symbol.tag & keyof T]
export function identify<T extends Identifiable>(x: T): identify<T> { return x[Symbol.tag] }


/**
 * ## {@link reflect `t.reflect`}
 *
 * Access a node's internal structure.
 *
 * Most of the time you won't need this. The primary use case is when you're building
 * a visitor.
 */
export type reflect<T> = T[Symbol.def & keyof T]
export function reflect<T extends Introspectable>(x: T): reflect<T> { return x[Symbol.def] }

declare namespace Visitor { export { Entry, Exit } }
type Exit<S> = S extends Guard<infer T> ? T : S[Symbol.type & keyof S]
// type Exit<S> = S extends Guard<infer T> ? T : S[Symbol.type & keyof S]
type Entry<S>
  = S extends { [Symbol.def]: unknown } ? S
  : S extends Guard<infer T> ? t.inline<T>
  : S extends () => true ? t.unknown
  : S extends () => false ? t.never
  : S extends Predicate ? t.unknown
  // : S extends { [-1]: unknown } ? S[-1]
  : S


export {
  /**
   * # {@link never_ `t.never`}
   */
  never_ as never
}

const never_: never_ = <never_>((_?: unknown) => constFalse())
never_[Symbol.tag] = URI.never
never_[Symbol.def] = t('never')
interface never_ extends t.never { (u?: unknown): u is never, [Symbol.def]: t.never }


export {
  /**
   * # {@link unknown_ `t.unknown`}
   */
  unknown_ as unknown
}

const unknown_: unknown_ = <unknown_>((_?: unknown) => constTrue())
unknown_[Symbol.tag] = URI.unknown
unknown_[Symbol.def] = t('unknown')
//
interface unknown_ extends unknown_.def { (u: unknown): u is unknown }
declare namespace unknown_ {
  interface def extends t.unknown { [Symbol.def]: t.unknown }
}


export {
  any_ as any
}

/**
 * # {@link any_ `t.any`}
 */
const any_: any_ = <never>((_?: unknown) => constTrue())
any_[Symbol.tag] = URI.any
any_[Symbol.def] = t('any')
//
interface any_ extends any_.def { (u?: unknown): u is any }
declare namespace any_ {
  interface def extends t.any { [Symbol.def]: t.any }
}


export {
  /**
   * # {@link void_ `t.void`}
   */
  void_ as void
}
const void_: void_ = <void_>((u: unknown) => u === void 0)
void_[Symbol.tag] = URI.void
void_[Symbol.def] = t('void')
//
interface void_ extends void_.def { (u: unknown): u is void }
declare namespace void_ {
  interface def extends t.void { [Symbol.def]: t.void }
}


export {
  /**
   * # {@link undefined_ `t.undefined`}
   */
  undefined_ as undefined
}

const undefined_: undefined_ = <undefined_>((u: unknown) => u === void 0)
undefined_[Symbol.tag] = URI.undefined
undefined_[Symbol.def] = t('undefined')
//
interface undefined_ extends undefined_.def { (u: unknown): u is undefined }
declare namespace undefined_ {
  interface def extends t.undefined { [Symbol.def]: t.undefined }
}


export {
  /**
   * # {@link null_ `t.null`}
   */
  null_ as null
}

const null_: null_ = <null_>((u: unknown) => u === null)
null_[Symbol.tag] = URI.null
null_[Symbol.def] = t('null')
//
interface null_ extends null_.def { (u: unknown): u is null }
declare namespace null_ {
  interface def extends t.null { [Symbol.def]: t.null }
}


export {
  /**
   * # {@link symbol_ `t.symbol`}
   */
  symbol_ as symbol
}
const symbol_: symbol_ = <symbol_>((u: unknown) => typeof u === 'symbol')
symbol_[Symbol.tag] = URI.symbol_
symbol_[Symbol.def] = t('symbol_')
//
interface symbol_ extends symbol_.def { (u: unknown): u is symbol }
declare namespace symbol_ {
  interface def extends t.symbol { [Symbol.def]: t.symbol }
}


export {
  /**
   * # {@link boolean_ `t.boolean`}
   */
  boolean_ as boolean
}
const boolean_: boolean_ = <boolean_>((u: unknown) => typeof u === 'boolean')
boolean_[Symbol.tag] = URI.boolean
boolean_[Symbol.def] = t('boolean')
//
interface boolean_ extends boolean_.def { (u: unknown): u is boolean }
declare namespace boolean_ {
  interface def extends t.boolean { [Symbol.def]: t.boolean }
}


export {
  /**
   * # {@link bigint_ `t.bigint`}
   */
  bigint_ as bigint
}

const bigint_: bigint_ = <bigint_>((u: unknown) => typeof u === 'bigint')
bigint_[Symbol.tag] = URI.bigint
bigint_[Symbol.def] = t('bigint')
//
interface bigint_ extends bigint_.def { (u: unknown): u is bigint }
declare namespace bigint_ {
  interface def extends t.bigint { [Symbol.def]: t.bigint }
}


export {
  /**
   * # {@link number_ `t.number`}
   */
  number_ as number
}

const number_: number_ = <number_>((u: unknown) => typeof u === 'number')
number_[Symbol.tag] = URI.number
number_[Symbol.def] = t('number')
//
interface number_ extends number_.def { (u: unknown): u is number }
declare namespace number_ {
  interface def extends t.number { [Symbol.def]: t.number }
}


export {
  /**
   * # {@link string_ `t.string`}
   */
  string_ as string
}

const string_: string_ = <string_>((u: unknown) => typeof u === 'string')
string_[Symbol.tag] = URI.string
string_[Symbol.def] = t('string')
//
interface string_ extends string_.def { (u: unknown): u is string }
//
declare namespace string_ {
  interface def extends t.string { [Symbol.def]: t.string }
}


/**
 * # {@link eq `t.eq`}
 */
export function eq<const V>(value: V): eq<V>
export function eq<const V>(value: V): eq<V> {
  function eq(src: unknown): src is V { return equals(src, value) }
  eq[Symbol.tag] = URI.eq;
  (eq as any)[Symbol.def] = { [Symbol.tag]: URI.eq, def: value }
  return eq as eq<V>
}
//
export interface eq<S> extends eq.def<S> { (src: unknown): src is this[Symbol.type] }
//
export declare namespace eq {
  interface def<S> extends t.eq<eq.type<S>> { [Symbol.def]: t.eq<S> }
  type type<S> = never | S
}


/**
 * # {@link array `t.array`}
 */
export function array<F extends Schema, T extends Visitor.Entry<F>>(guard: F): array<T>
export function array<F extends InternalModel>(f: F): {} {
  function arrayPredicate(src: unknown) { return p.array(src) && src.every(f) }
  return array.def(arrayPredicate, f[Symbol.def] ?? f[Symbol.tag])
}

array.empty = {
  [Symbol.tag]: URI.array,
  // [Symbol.def]: { tag: URI.array, def: void 0},
  [Symbol.def]: { [Symbol.tag]: URI.array, def: void 0 as void },
}


array.def = <F, S>(f: F, x: S) => {
  if (typeof f === 'function') {
    let g
      : { [Symbol.tag]: URI.array, [Symbol.def]: { [Symbol.tag]: URI.array, def: S } } & F
      = ((x: Param<F>) => f(x)) as never;
    g[Symbol.tag] = URI.array
    g[Symbol.def] ??= { [Symbol.tag]: URI.array, def: x }
    return g
  }
  else {
    return {
      [Symbol.tag]: URI.array,
      [Symbol.def]: { [Symbol.tag]: URI.array, def: x }
    }
  }
}

//   f == null ? array.empty : (
//   (f as { [x: symbol]: unknown })[Symbol.tag] = URI.array,
//   (f as { [x: symbol]: unknown })[Symbol.def] ??= { [Symbol.tag]: URI.array, def: x },
//   f
// )

// array.def = <T>(x: T) => {
//   if (x == null) return array(unknown_)
//   else {
//     const y: { [x: symbol]: unknown } = x
//     y[Symbol.def] = y[Symbol.def] ?? y[Symbol.tag]
//     return y as array.def<unknown>
//   }
//   // q[Symbol.tag] = URI.array;
//   // (q)[Symbol.def] ??= { [Symbol.tag]: URI.array, def: q[Symbol.def] ?? q[Symbol.tag] }
// }
// export function array<F extends Guard, T extends Visitor.Entry<F>>(guard: F): array<T>
//

export interface array<S> extends array.def<S> { (src: unknown): src is this[Symbol.type] }
//
export declare namespace array {
  interface def<S> extends t.array<array.type<S>> { [Symbol.def]: t.array<S> }
  type type<S> = never | readonly (S[Symbol.type & keyof S])[]
}


/**
 * # {@link record `t.record`}
 */
export function record<F extends Schema, T extends Visitor.Entry<F>>(predicate: F): record<T>
export function record<F extends InternalModel>(f: F) {
  function record(src: unknown) { return p.object(src) && Object_values(src).every(f) }
  record[Symbol.tag] = URI.record;
  (record as any)[Symbol.def] = { [Symbol.tag]: URI.record, def: f[Symbol.def] ?? f[Symbol.tag] }
  return record
}
// export function record<F extends Guard, T extends Visitor.Entry<F>>(guard: F): record<T>
//
export interface record<S> extends record.def<S> { (src: unknown): src is this[Symbol.type] }
//
export declare namespace record {
  interface def<S> extends t.record<record.type<S>> { [Symbol.def]: t.record<S> }
  type type<S> = never | globalThis.Record<string, S[Symbol.type & keyof S]>
}


/**
 * # {@link optional `t.optional`}
 */
export function optional<F extends Schema, T extends Visitor.Entry<F>>(schema: F, options?: Schema.Options): optional<T>
export function optional<F extends InternalModel>(q: F, { optionalTreatment }: Schema.Options = object_.defaults) {
  function optional(src: unknown): boolean {
    return optionalTreatment === 'treatUndefinedAndOptionalAsTheSame'
      ? (src === undefined || q(src))
      : q(src)
  }
  optional[Symbol.tag] = URI.optional;
  (optional as any)[Symbol.def] = { [Symbol.tag]: URI.optional, def: q[Symbol.def] ?? q[Symbol.tag] }
  return optional
}
// export function optional<F extends Guard, T extends Visitor.Entry<F>>(guard: F): optional<T>
// export function optional<F extends Guard, T extends Visitor.Entry<F>>(guard: F, options?: Schema.Options): optional<T>
//
export interface optional<S> extends optional.def<S> { (u: unknown): u is undefined | this[Symbol.type] }
/* TODO: fix issue where undefined isn't being applied ^^ to primitive types */
export declare namespace optional {
  interface def<S> extends t.optional<optional.type<S>> { [Symbol.def]: t.optional<S> }
  type type<S> = S[Symbol.type & keyof S]
}


/**
 * # {@link union `t.union`}
 */
export function union<F extends readonly Schema[], T extends union.targets<F>>(...predicate: [...F]): union<T>
export function union<F extends readonly InternalModel[]>(...fs: [...F]) {
  function union(src: unknown) { return fs.some((f) => f(src)) }
  union[Symbol.tag] = URI.union;
  (union as any)[Symbol.def] ??= { [Symbol.tag]: URI.union, def: [] };
  fs.forEach((f) => (union as any)[Symbol.def].def.push(f[Symbol.def] ?? f[Symbol.def]))
  return union
}
// export function union<F extends readonly Guard[], T extends union.targets<F>>(...guard: [...F]): union<T>
//
export interface union<S> extends union.def<S> { (src: unknown): src is this[Symbol.type] }
//
export declare namespace union {
  interface def<S> extends t.union<union.type<S>> { [Symbol.def]: S }
  type targets<S> = never | { [ix in keyof S]: Visitor.Entry<S[ix]> }
  type type<S> = never | S[number & keyof S][Symbol.type & keyof S[number & keyof S]]
}


/**
 * # {@link intersect `t.intersect`}
 */
export function intersect<F extends readonly Schema[], T extends intersect.targets<F>>(...guard: [...F]): intersect<T>
export function intersect<F extends readonly InternalModel[]>(...fs: [...F]) {
  function intersect(src: unknown): boolean { return fs.every((f) => f(src)) }
  intersect[Symbol.tag] = URI.intersect;
  (intersect as any)[Symbol.def] ??= { [Symbol.tag]: URI.intersect, def: [] };
  fs.forEach((f) => (intersect as any)[Symbol.def].def.push(f[Symbol.type] ?? f[Symbol.tag]))
  return intersect
}
// export function intersect<F extends readonly Guard[], T extends intersect.targets<F>>(...guard: [...F]): intersect<T>
export interface intersect<S> extends intersect.def<S> { (src: unknown): src is this[Symbol.type] }
export declare namespace intersect {
  interface def<S> extends t.intersect<intersect.type<S>> { [Symbol.def]: t.intersect<S> }
  type targets<S> = never | { [ix in keyof S]: Visitor.Entry<S[ix]> }
  type type<S> = never | intersect<S>
  type intersect<Todo, Out = unknown>
    = Todo extends readonly [infer H, ...infer T]
    ? intersect<T, Out & H[Symbol.type & keyof H]>
    : Out
}


/**
 * # {@link tuple `t.tuple`}
 */
export function tuple<F extends readonly TypePredicate[], S extends tuple.targets<F>>(...guard: F): tuple<S>
export function tuple<F extends readonly InternalModel[]>(...qs: F) {
  function tuple(src: unknown): boolean {
    return p.array(src) && qs.every((q, ix) => q(src[ix])) && src.length === qs.length
  }
  tuple[Symbol.tag] = URI.tuple;
  (tuple as any)[Symbol.def] ??= { [Symbol.tag]: URI.tuple, def: [] };
  qs.forEach((q) => (tuple as any)[Symbol.def].def.push(q[Symbol.def]))
  return tuple
}
// export function tuple<F extends readonly Guard[], S extends tuple.targets<F>>(...guard: F): tuple<S>
//
export interface tuple<S> extends tuple.def<S> { (src: unknown): src is this[Symbol.type] }
//
export declare namespace tuple {
  interface def<S> extends t.tuple<tuple.type<S>> { [Symbol.def]: t.tuple<S> }
  type targets<S> = never | { [ix in keyof S]: Visitor.Entry<S[ix]> }
  type type<S, T = opt<S>> = T
  type opt<Todo, Req extends readonly unknown[] = []>
    = [Todo] extends [readonly [infer H, ...infer T]]
    ? [H] extends [optional<any>]
    ? [...Req, ...Part<Label<{ [ix in keyof Todo]: Todo[ix][Symbol.type & keyof Todo[ix]] }>>]
    : opt<T, [...Req, H[Symbol.type & keyof H]]>
    : Req
  // TODO: remove this Extract, super annoying
  type Part<S extends readonly unknown[]> = Extract<{ [ix in keyof S]+?: S[ix] }, readonly unknown[]>
  type Label<S extends readonly unknown[], T = S['length'] extends keyof labels ? labels[S['length']] : never>
    = never | [T] extends [never]
    ? { [ix in keyof S]: S[ix] }
    : { [ix in keyof T]: S[ix & keyof S] }
    ;
  type _ = never | unknown
  interface labels {
    1: readonly [ᙚ: _]
    2: readonly [ᙚ: _, ᙚ: _]
    3: readonly [ᙚ: _, ᙚ: _, ᙚ: _]
    4: readonly [ᙚ: _, ᙚ: _, ᙚ: _, ᙚ: _]
    5: readonly [ᙚ: _, ᙚ: _, ᙚ: _, ᙚ: _, ᙚ: _]
    6: readonly [ᙚ: _, ᙚ: _, ᙚ: _, ᙚ: _, ᙚ: _, ᙚ: _]
    7: readonly [ᙚ: _, ᙚ: _, ᙚ: _, ᙚ: _, ᙚ: _, ᙚ: _, ᙚ: _]
    8: readonly [ᙚ: _, ᙚ: _, ᙚ: _, ᙚ: _, ᙚ: _, ᙚ: _, ᙚ: _, ᙚ: _]
    9: readonly [ᙚ: _, ᙚ: _, ᙚ: _, ᙚ: _, ᙚ: _, ᙚ: _, ᙚ: _, ᙚ: _, ᙚ: _]
  }
}


export {
  /**
   * # {@link object$ `t.object`}
   */
  object_ as object
}

function object_<
  F extends { [x: string]: Schema | void },
  T extends object_.Targets<F>
>(predicates: F, options?: Schema.Options): object_<T>
//
function object_<F extends { [x: string]: InternalModel }>(qs: F, $: Schema.Options = object_.defaults) {
  function object(src: unknown): boolean { return p.object$(qs, { ...object_.defaults, ...$ })(src) }
  object[Symbol.tag] = URI.object;
  (object as any)[Symbol.def] ??= { [Symbol.tag]: URI.object, def: {} }
  for (const k in qs) {
    const q = qs[k];
    (object as any)[Symbol.def].def[k] = q[Symbol.def] ?? q[Symbol.tag]
  }
  return object
}

// function object$<F extends { [x: string]: Guard | void }, T extends object$.targets<F>>(predicates: F, options?: object$.Options): object$<T>
// function object$<F extends { [x: string]: Guard }, T extends object$.targets<F>>(guards: F, options?: object$.Options): object$<T>
// function object$<F extends { [x: string]: Predicate }, T extends object$.targets<F>>(predicates: F, options?: object$.Options): object$<T>

object_.defaults = {
  optionalTreatment: 'presentButUndefinedIsOK',
  treatArraysAsObjects: false,
} satisfies Required<Schema.Options>

interface object_<S> extends object_.def<S> { (src: unknown): src is this[Symbol.type] }
//
declare namespace object_ {
  interface def<S> extends t.object<object_.type<S>> { [Symbol.def]: t.object<S> }
  // interface def<S> extends t.object<object_.type<S>> { [Symbol.def]: t.object<S> }
  type Targets<F> = never | { [K in keyof F]: Entry<F[K]> }
  type type<
    S,
    opt extends object_.opt<S> = object_.opt<S>,
    req extends Exclude<keyof S, opt> = Exclude<keyof S, opt>
  > = never | Force<
    & $<{ [K in opt]+?: Exit<S[K]> }>
    & $<{ [K in req]-?: Exit<S[K]> }>
  >
  type opt<S, K extends keyof S = keyof S>
    = K extends K ? S[K] extends optional.def<any> ? K : never : never
}


/**
 * ## {@link inline$ `t.inline`}
 */
export function inline(alwaysTrue: typeof constTrue): unknown_
export function inline(alwaysFalse: typeof constFalse): never_
export function inline<F extends Guard, T extends Visitor.Entry<F>>(guard: F): inline<T>
export function inline<F extends Predicate, T extends Visitor.Entry<F>>(guard: F): inline<T>
export function inline<F extends Guard | Predicate>(guard: F): inline<Visitor.Entry<F>>
export function inline(): any_
export function inline<F extends InternalModel>(guard?: F): {} {
  if (guard === undefined) return any_
  if (guard === constTrue) return unknown_
  if (guard === constFalse) return never_
  function inline(src: unknown): boolean { return guard!(src) }
  const parsed = parse.inline(guard)
  let def: symbol
  switch (true) {
    default: return exhaustive(parsed)
    case parsed === null: { def = Symbol.null; break; }
    case parsed === void 0: { def = Symbol.undefined; break; }
    case typeof parsed === 'string': { def = Symbol.string; break; }
    case typeof parsed === 'number': { def = Symbol.number; break; }
    case typeof parsed === 'boolean': { def = Symbol.boolean; break; }
    case typeof parsed === 'bigint': { def = Symbol.bigint; break; }
    case typeof parsed === 'symbol': { def = parsed; break; }
  }
  inline[Symbol.tag] = Symbol.inline
  inline[Symbol.def] = def
  return inline
}

export interface inline<T> extends inline.def<T> { }

export declare namespace inline {
  interface def<T> extends t.inline<T> { [Symbol.def]: T }
}


export type Tree<Rec>
  = Tree.Leaf
  | optional<Rec>
  | array<Rec>
  | record<Rec>
  | optional<Rec>
  | union<readonly Rec[]>
  | intersect<readonly Rec[]>
  | tuple<readonly Rec[]>
  | object_<{ [x: string]: Rec }>
  ;

export declare namespace Tree {
  type Leaf
    = never_
    | any_
    | unknown_
    | void_
    | null_
    | undefined_
    | symbol_
    | boolean_
    | bigint_
    | number_
    | string_

  type Fixpoint
    = Tree.Leaf
    | array<Fixpoint>
    | record<Fixpoint>
    | optional<Fixpoint>
    | union<readonly Fixpoint[]>
    | intersect<readonly Fixpoint[]>
    | tuple<readonly Fixpoint[]>
    | object_<{ [x: string]: Fixpoint }>

  interface F extends HKT { [-1]: Tree<this[0]> }
}


type Nullary = UserDefinedNullary | BuiltinNullary
type UserDefinedNullary = Registry['nullary']
type BuiltinNullary =
  | null_
  | undefined_
  | symbol_
  | boolean_
  | bigint_
  | number_
  | string_
  | void_
  | unknown_
  | any_
  | never_


const isBuiltinNullary = (u: unknown): u is BuiltinNullary =>
  !!u &&
  typeof u === 'object' &&
  Symbol.tag in u &&
  typeof u[Symbol.tag] === 'string' && (
    u[Symbol.tag] === URI.null ||
    u[Symbol.tag] === URI.undefined ||
    u[Symbol.tag] === URI.symbol_ ||
    u[Symbol.tag] === URI.bigint ||
    u[Symbol.tag] === URI.number ||
    u[Symbol.tag] === URI.string ||
    u[Symbol.tag] === URI.void ||
    u[Symbol.tag] === URI.unknown ||
    u[Symbol.tag] === URI.any ||
    u[Symbol.tag] === URI.never ||
    Registry.nullary.has(u[Symbol.tag])
  )

const isUserDefinedNullary = (u: unknown): u is UserDefinedNullary => !!u &&
  typeof u === 'object' &&
  Symbol.tag in u &&
  Registry.nullary.has(u[Symbol.tag])

const isNullary = (u: unknown): u is Nullary => isBuiltinNullary(u) || isUserDefinedNullary(u)

// export { functor as Functor }
// const functor: Functor<Tree.F> = {
//   map(f) {
//     return (x) => {
//       switch (true) {
//         default: return fn.exhaustive(x)
//         case isBuiltinNullary(x): return x
//         case x[Symbol.tag] === URI.array: {
//           f(x[Symbol.def][Symbol.type])
//           return { ...x, [Symbol.def]: array.def(x, f(reflect(x))) } satisfies ReturnType<typeof f>
//         }
//         // case x[0] === Symbol.array: return [x[0], f(x[1])]
//         // case x[0] === Symbol.optional: return [x[0], f(x[1])]
//         // case x[0] === Symbol.record: return [x[0], f(x[1])]
//         // case x[0] === Symbol.tuple: return [x[0], x[1].map(f)]
//         // case x[0] === Symbol.union: return [x[0], x[1].map(f)]
//         // case x[0] === Symbol.intersect: return [x[0], x[1].map(f)]
//         // case x[0] === Symbol.object:
//         //   return [x[0], x[1].map(([k, v]) => [k, f(v)] satisfies [any, any])]
//       }
//     }
//   }
// }
