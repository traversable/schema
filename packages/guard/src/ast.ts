import { type as t } from './type.js'
import type { _, $, Force, Guard, Predicate, HKT } from './types.js'
import { symbol as Symbol, URI } from './uri.js'
import * as p from './predicates.js'
import * as P from './combinators.js'
import { parseInline } from './parse.js'
import { equals } from './eq.js'
import { exhaustive } from './function.js'

/** @internal */
interface TypeGuard<T = unknown> extends Guard<T> {
  [Symbol.tag]?: _
  [Symbol.def]?: _
  [Symbol.type]?: _
}
/** @internal */
const Object_values = globalThis.Object.values

const constTrue = () => true as const
const constFalse = () => false as const

export type Identifiable = { [Symbol.tag]?: _ }
export type Introspectable = { [Symbol.def]?: _ }
export type Typeable = { [Symbol.type]?: _ }

export { typeOf as typeof }
/**
 * ## {@link typeOf `t.typeof`}
 */
type typeOf<T> = T[Symbol.type & keyof T]
function typeOf<T extends Typeable>(x: T): typeOf<T> { return x[Symbol.type] }

export { identify }
/**
 * ## {@link identify `t.identify`}
 */
type identify<T> = T[Symbol.tag & keyof T]
function identify<T extends Identifiable>(x: T): identify<T> { return x[Symbol.tag] }

export { reflect }
/**
 * ## {@link reflect `t.reflect`}
 */
type reflect<T> = T[Symbol.def & keyof T]
function reflect<T extends Introspectable>(x: T): reflect<T> { return x[Symbol.def] }


type target<S>
  = S extends { [Symbol.def]: _ } ? S
  : S extends Guard<infer T> ? t.inline<T>
  : S extends () => true ? t.any
  : S extends () => false ? t.never
  : S extends Predicate ? t.unknown
  : S


////////////////////
///    INLINE    ///
export { inline$ as inline }
/**
 * ## {@link inline$ `t.inline`}
 */
function inline$(alwaysTrue: typeof constTrue): unknown$
function inline$(alwaysFalse: typeof constFalse): never$
function inline$<F extends Guard, T extends target<F>>(guard: F): inline$<T>
function inline$<F extends Predicate, T extends target<F>>(guard: F): inline$<T>
function inline$<F extends TypeGuard | Predicate>(guard: F): inline$<target<F>>
function inline$(): any$
function inline$<F extends TypeGuard | ((x?: unknown) => boolean) | Predicate>(guard?: F): {} {
  if (guard === undefined) return any$
  if (guard === constTrue) return unknown$
  if (guard === constFalse) return never$
  function inline(src: _): boolean { return guard!(src) }
  const parsed = parseInline(guard)
  let type: symbol
  switch (true) {
    default: return exhaustive(parsed)
    case parsed === null: { type = Symbol.null; break; }
    case parsed === void 0: { type = Symbol.undefined; break; }
    case typeof parsed === 'string': { type = Symbol.string; break; }
    case typeof parsed === 'number': { type = Symbol.number; break; }
    case typeof parsed === 'boolean': { type = Symbol.boolean; break; }
    case typeof parsed === 'bigint': { type = Symbol.bigint; break; }
    case typeof parsed === 'symbol': { type = parsed; break; }
  }
  inline[Symbol.tag] = Symbol.inline
  inline[Symbol.def] = type
  return inline
}
interface inline$<T> extends inline$.def<T> { }
declare namespace inline$ {
  interface def<T> extends t.inline<T> { [Symbol.def]: T }
}
///    INLINE    ///
////////////////////


export { never$ as never }
///////////////////
///    NEVER    ///
/**
 * # {@link never$ `t.never`}
 */
// const never$ = inline$(constFalse)
const never$: never$ = <never$>((_?: unknown) => constFalse())
never$[Symbol.tag] = URI.never
never$[Symbol.def] = t('never')
//
interface never$ extends t.never { (u: unknown): u is never, [Symbol.def]: t.never }
///    NEVER    ///
///////////////////


export { unknown$ as unknown }
/////////////////////
///    UNKNOWN    ///
/**
 * # {@link unknown$ `t.unknown`}
 */
const unknown$: unknown$ = <unknown$>((_?: unknown) => constTrue())
unknown$[Symbol.tag] = URI.unknown
unknown$[Symbol.def] = t('unknown')
//
interface unknown$ extends unknown$.def { (u: unknown): u is unknown }
declare namespace unknown$ {
  interface def extends t.unknown { [Symbol.def]: t.unknown }
}
///    UNKNOWN    ///
/////////////////////


export { void$ as void }
//////////////////
///    VOID    ///
/**
 * # {@link void$ `t.void`}
 */
const void$: void$ = <void$>((u: unknown) => u === void 0)
void$[Symbol.tag] = URI.void
void$[Symbol.def] = t('void')
//
interface void$ extends void$.def { (u: unknown): u is void }
declare namespace void$ {
  interface def extends t.void { [Symbol.def]: t.void }
}
///    VOID    ///
//////////////////

export { any$ as any }
/////////////////
///    ANY    ///
/**
 * # {@link any$ `t.any`}
 */
const any$: any$ = <never>((_?: unknown) => constTrue())
any$[Symbol.tag] = URI.any
any$[Symbol.def] = t('any')
//
interface any$ extends any$.def { (u?: unknown): u is any }
declare namespace any$ {
  interface def extends t.any { [Symbol.def]: t.any }
}
///    UNDEFINED    ///
///////////////////////




export { undefined$ as undefined }
///////////////////////
///    UNDEFINED    ///
/**
 * # {@link undefined$ `t.undefined`}
 */
const undefined$: undefined$ = <undefined$>((u: unknown) => u === void 0)
undefined$[Symbol.tag] = URI.undefined
undefined$[Symbol.def] = t('undefined')
//
interface undefined$ extends undefined$.def { (u: unknown): u is undefined }
declare namespace undefined$ {
  interface def extends t.undefined { [Symbol.def]: t.undefined }
}
///    UNDEFINED    ///
///////////////////////


export { null$ as null }
//////////////////
///    NULL    ///
/**
 * # {@link null$ `t.null`}
 */
const null$: null$ = <null$>((u: unknown) => u === null)
null$[Symbol.tag] = URI.null
null$[Symbol.def] = t('null')
//
interface null$ extends null$.def { (u: unknown): u is null }
declare namespace null$ {
  interface def extends t.null { [Symbol.def]: t.null }
}
///    null    ///
//////////////////


export { symbol$ as symbol }
////////////////////
///    SYMBOL    ///
/**
 * # {@link symbol$ `t.symbol`}
 */
const symbol$: symbol$ = <symbol$>((u: unknown) => typeof u === 'symbol')
symbol$[Symbol.tag] = URI.symbol_
symbol$[Symbol.def] = t('symbol_')
//
interface symbol$ extends symbol$.def { (u: unknown): u is symbol }
declare namespace symbol$ {
  interface def extends t.symbol { [Symbol.def]: t.symbol }
}
///    SYMBOL    ///
////////////////////


export { boolean$ as boolean }
/////////////////////
///    BOOLEAN    ///
/**
 * # {@link boolean$ `t.boolean`}
 */
const boolean$: boolean$ = <boolean$>((u: unknown) => typeof u === 'boolean')
boolean$[Symbol.tag] = URI.boolean
boolean$[Symbol.def] = t('boolean')
//
interface boolean$ extends boolean$.def { (u: unknown): u is boolean }
declare namespace boolean$ {
  interface def extends t.boolean { [Symbol.def]: t.boolean }
}
///    BOOLEAN    ///
/////////////////////


export { bigint$ as bigint }
////////////////////
///    BIGINT    ///
/**
 * # {@link bigint$ `t.bigint`}
 */
const bigint$: bigint$ = <bigint$>((u: unknown) => typeof u === 'bigint')
bigint$[Symbol.tag] = URI.bigint
bigint$[Symbol.def] = t('bigint')
//
interface bigint$ extends bigint$.def { (u: unknown): u is bigint }
declare namespace bigint$ {
  interface def extends t.bigint { [Symbol.def]: t.bigint }
}
///    BIGINT    ///
////////////////////


export { number$ as number }
////////////////////
///    NUMBER    ///
/**
 * # {@link number$ `t.number`}
 */
const number$: number$ = <number$>((u: unknown) => typeof u === 'number')
number$[Symbol.tag] = URI.number
number$[Symbol.def] = t('number')
//
interface number$ extends number$.def { (u: unknown): u is number }
declare namespace number$ {
  interface def extends t.number { [Symbol.def]: t.number }
}
///    NUMBER    ///
////////////////////


export { string$ as string }
////////////////////
///    STRING    ///
/**
 * # {@link string$ `t.string`}
 */
const string$: string$ = <string$>((u: unknown) => typeof u === 'string')
string$[Symbol.tag] = URI.string
string$[Symbol.def] = t('string')
//
interface string$ extends string$.def { (u: unknown): u is string }
declare namespace string$ {
  interface def extends t.string { [Symbol.def]: t.string }
}
///    STRING    ///
////////////////////


export { eq$ as eq }
////////////////
///    eq    ///
/**
 * # {@link eq$ `t.eq`}
 */
function eq$<const V>(value: V): eq$<V>
function eq$<const V>(value: V): eq$<V> {
  function eq(src: _): src is V { return equals(src, value) }
  eq[Symbol.tag] = URI.eq;
  (eq as any)[Symbol.def] = { [Symbol.tag]: URI.eq, def: value }
  // eq[Symbol.type] = value
  return eq as eq$<V>
}
//
interface eq$<S> extends eq$.def<S> { (src: _): src is this[Symbol.type] }
//
declare namespace eq$ {
  interface def<S> extends t.eq<eq$.type<S>> { [Symbol.def]: t.eq<S> }
  type type<S> = never | S
}
///    ARRAY    ///
///////////////////


export { array$ as array }
///////////////////
///    ARRAY    ///
/**
 * # {@link array$ `t.array`}
 */
function array$<F extends Guard, T extends target<F>>(guard: F): array$<T>
function array$<F extends Predicate, T extends target<F>>(guard: F): array$<T>
function array$<F extends TypeGuard>(f: F) {
  function array(src: _) { return p.array(src) && src.every(f) }
  array[Symbol.tag] = URI.array;
  (array as any)[Symbol.def] ??= { [Symbol.tag]: URI.array, def: f[Symbol.def] ?? f[Symbol.tag] }
  return array
}
//
interface array$<S> extends array$.def<S> { (src: _): src is this[Symbol.type] }
//
declare namespace array$ {
  interface def<S> extends t.array<array$.type<S>> { [Symbol.def]: t.array<S> }
  type type<S> = never | readonly (S[Symbol.type & keyof S])[]
}
///    ARRAY    ///
///////////////////


export { record$ as record }
////////////////////
///    RECORD    ///
/**
 * # {@link record$ `t.record`}
 */
function record$<F extends Guard, T extends target<F>>(guard: F): record$<T>
function record$<F extends Predicate, T extends target<F>>(predicate: F): record$<T>
function record$<F extends TypeGuard>(f: F) {
  function record(src: _) { return p.object(src) && Object_values(src).every(f) }
  record[Symbol.tag] = URI.record;
  (record as any)[Symbol.def] = { [Symbol.tag]: URI.record, def: f[Symbol.def] ?? f[Symbol.tag] }
  return record
}
//
interface record$<S> extends record$.def<S> { (src: _): src is this[Symbol.type] }
//
declare namespace record$ {
  interface def<S> extends t.record<record$.type<S>> { [Symbol.def]: t.record<S> }
  type type<S> = never | globalThis.Record<string, S[Symbol.type & keyof S]>
}
///    RECORD    ///
////////////////////


export { optional$ as optional }
//////////////////////
///    OPTIONAL    ///
/**
 * # {@link optional$ `t.optional`}
 */
function optional$<F extends Guard, T extends target<F>>(guard: F): optional$<T>
function optional$<F extends Guard, T extends target<F>>(guard: F, options?: object$.Options): optional$<T>
function optional$<F extends Predicate, T extends target<F>>(predicate: F): optional$<T>
function optional$<F extends TypeGuard>(q: F, { optionalTreatment }: object$.Options = object$.defaults) {
  function optional(src: _): boolean {
    return optionalTreatment === 'treatUndefinedAndOptionalAsTheSame'
      ? (src === undefined || q(src))
      : q(src)
  }
  optional[Symbol.tag] = URI.optional;
  (optional as any)[Symbol.def] = { [Symbol.tag]: URI.optional, def: q[Symbol.def] ?? q[Symbol.tag] }
  return optional
}
//
interface optional$<S> extends optional$.def<S> { (u: _): u is undefined | this[Symbol.type] }
//        /* TODO: fix issue where undefined isn't being applied ^^ to primitive types */
declare namespace optional$ {
  interface def<S> extends t.optional<optional$.type<S>> { [Symbol.def]: t.optional<S> }
  type type<S> = S[Symbol.type & keyof S]
}
///    OPTIONAL    ///
//////////////////////



export { union$ as union }
///////////////////
///    UNION    ///
/**
 * # {@link union$ `t.union`}
 */
function union$<F extends readonly Guard[], T extends union$.targets<F>>(...guard: [...F]): union$<T>
function union$<F extends readonly Predicate[], T extends union$.targets<F>>(...predicate: [...F]): union$<T>
function union$<F extends readonly TypeGuard[]>(...fs: [...F]) {
  function union(src: _) { return fs.some((f) => f(src)) }
  union[Symbol.tag] = URI.union;
  (union as any)[Symbol.def] ??= { [Symbol.tag]: URI.union, def: [] };
  fs.forEach((f) => (union as any)[Symbol.def].def.push(f[Symbol.def] ?? f[Symbol.def]))
  return union
}
//
interface union$<S> extends union$.def<S> { (src: _): src is this[Symbol.type] }
//
declare namespace union$ {
  interface def<S> extends t.union<union$.type<S>> { [Symbol.def]: S }
  type targets<S> = never | { [ix in keyof S]: target<S[ix]> }
  type type<S> = never | S[number & keyof S][Symbol.type & keyof S[number & keyof S]]
}
///    UNION    ///
///////////////////


export { intersect$ as intersect }
///////////////////////
///    INTERSECT    ///
/**
 * # {@link intersect$ `t.intersect`}
 */
function intersect$<F extends readonly Guard[], T extends intersect$.targets<F>>(...guard: [...F]): intersect$<T>
function intersect$<F extends readonly Predicate[], T extends intersect$.targets<F>>(...predicate: [...F]): intersect$<T>
function intersect$<F extends readonly TypeGuard[]>(...fs: [...F]) {
  function intersect(src: _): boolean { return fs.every((f) => f(src)) }
  intersect[Symbol.tag] = URI.intersect;
  (intersect as any)[Symbol.def] ??= { [Symbol.tag]: URI.intersect, def: [] };
  fs.forEach((f) => (intersect as any)[Symbol.def].def.push(f[Symbol.type] ?? f[Symbol.tag]))
  return intersect
}
interface intersect$<S> extends intersect$.def<S> { (src: _): src is this[Symbol.type] }
declare namespace intersect$ {
  interface def<S> extends t.intersect<intersect$.type<S>> { [Symbol.def]: t.intersect<S> }
  type targets<S> = never | { [ix in keyof S]: target<S[ix]> }
  type type<S> = never | intersect<S>
  type intersect<Todo, Out = unknown>
    = Todo extends readonly [infer H, ...infer T]
    ? intersect<T, Out & H[Symbol.type & keyof H]>
    : Out
}
///    INTERSECT    ///
///////////////////////


export { tuple$ as tuple }
///////////////////
///    TUPLE    ///
/**
 * # {@link tuple$ `t.tuple`}
 */
function tuple$<F extends readonly Guard[], S extends tuple$.targets<F>>(...guard: F): tuple$<S>
function tuple$<F extends readonly Predicate[], S extends tuple$.targets<F>>(...guard: F): tuple$<S>
function tuple$<F extends readonly TypeGuard[]>(...qs: F) {
  function tuple(src: _): boolean {
    return p.array(src) && qs.every((q, ix) => q(src[ix])) && src.length === qs.length
  }
  tuple[Symbol.tag] = URI.tuple;
  (tuple as any)[Symbol.def] ??= { [Symbol.tag]: URI.tuple, def: [] };
  qs.forEach((q) => (tuple as any)[Symbol.def].def.push(q[Symbol.def]))
  return tuple
}
//
interface tuple$<S> extends tuple$.def<S> { (src: _): src is this[Symbol.type] }
//
declare namespace tuple$ {
  interface def<S> extends t.tuple<tuple$.type<S>> { [Symbol.def]: t.tuple<S> }
  type targets<S> = never | { [ix in keyof S]: target<S[ix]> }
  type type<S, T = opt<S>> = T
  type opt<Todo, Req extends readonly _[] = []>
    = [Todo] extends [readonly [infer H, ...infer T]]
    ? [H] extends [optional$<any>]
    ? [...Req, ...Part<Label<{ [ix in keyof Todo]: Todo[ix][Symbol.type & keyof Todo[ix]] }>>]
    : opt<T, [...Req, H[Symbol.type & keyof H]]>
    : never
  // TODO: remove this Extract, super annoying
  type Part<S extends readonly _[]> = Extract<{ [ix in keyof S]+?: S[ix] }, readonly _[]>
  type Label<S extends readonly _[], T = S['length'] extends keyof labels ? labels[S['length']] : never>
    = never | [T] extends [never]
    ? { [ix in keyof S]: S[ix] }
    : { [ix in keyof T]: S[ix & keyof S] }
    ;
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
///    TUPLE    ///
///////////////////

export { object$ as object }
////////////////////
///    OBJECT    ///
/**
 * # {@link object$ `t.object`}
 */
function object$<F extends { [x: string]: Guard }, T extends object$.targets<F>>(guards: F, options?: object$.Options): object$<T>
function object$<F extends { [x: string]: Predicate }, T extends object$.targets<F>>(predicates: F, options?: object$.Options): object$<T>
function object$<F extends { [x: string]: TypeGuard }>(qs: F, $: object$.Options = object$.defaults) {
  function object(src: _): boolean { return p.object$(qs, { ...object$.defaults, ...$ })(src) }
  object[Symbol.tag] = URI.object;
  (object as any)[Symbol.def] ??= { [Symbol.tag]: URI.object, def: {} }
  for (const k in qs) {
    const q = qs[k]
      // console.log(f);
      ; (object as any)[Symbol.def].def[k] = q[Symbol.def] ?? q[Symbol.tag]
  }
  return object
}

object$.defaults = {
  // exactOptionalPropertyTypes: false,
  optionalTreatment: 'presentButUndefinedIsOK',
  // treatUndefinedAsOptional: false,
  treatArraysAsObjects: false,
} satisfies Required<object$.Options>

//
interface object$<S> extends object$.def<S> { (src: _): src is this[Symbol.type] }
//
declare namespace object$ {
  type Options = {
    optionalTreatment?: 'exactOptional' | 'presentButUndefinedIsOK' | 'treatUndefinedAndOptionalAsTheSame'
    // exactOptionalPropertyTypes?: boolean
    // treatUndefinedAsOptional?: boolean
    treatArraysAsObjects?: boolean
  }
  interface def<S> extends t.object<object$.type<S>> { [Symbol.def]: t.object<S> }
  type targets<F> = never | { [K in keyof F]: target<F[K]> }
  type type<
    S,
    opt extends object$.opt<S> = object$.opt<S>,
    req extends Exclude<keyof S, opt> = Exclude<keyof S, opt>
  > = never | Force<
    & $<{ [K in opt]+?: S[K][Symbol.type & keyof S[K]] }>
    & $<{ [K in req]-?: S[K][Symbol.type & keyof S[K]] }>
  >
  type opt<S, K extends keyof S = keyof S>
    = K extends K ? S[K] extends optional$.def<any> ? K
    : never : never
    ;
}
///    OBJECT    ///
////////////////////

export type Tree<Rec>
  = Tree.Leaf
  | optional$<Rec>
  | array$<Rec>
  | record$<Rec>
  | union$<readonly Rec[]>
  | intersect$<readonly Rec[]>
  | tuple$<readonly Rec[]>
  | object$<{ [x: string]: Rec }>
  ;

export declare namespace Tree {
  type Leaf
    = never$
    | any$
    | unknown$
    | void$
    | null$
    | undefined$
    | symbol$
    | boolean$
    | bigint$
    | number$
    | string$
    ;

  type Fixpoint
    = Tree.Leaf
    | array$<Fixpoint>
    | record$<Fixpoint>
    | optional$<Fixpoint>
    | union$<Fixpoint[]>
    | intersect$<Fixpoint[]>
    | tuple$<Fixpoint[]>
    | object$<{ [x: string]: Fixpoint }>
    ;

  interface lambda extends HKT { [-1]: Tree<this[0]> }
}

