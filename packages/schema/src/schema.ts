export type { Schema } from './core.js'

import type * as T from './registry.js'
import { fn, parseArgs, symbol, URI } from './registry.js'

import * as AST from './ast.js'
import * as core from './core.js'
import type {
  Schema,
  Unspecified,
} from './core.js'

// import { pipe } from './codec.js'
import { getConfig } from './config.js'
import type {
  SchemaOptions as Options,
} from './options.js'
import type {
  Guard,
  ValidateTuple,
  Label,
} from './types.js'

/** @internal */
const Object_assign = globalThis.Object.assign

export type typeOf<
  T extends { _type?: unknown },
  _ extends
  | T['_type']
  = T['_type']
> = never | _

type BoolLookup = {
  true: core.top
  false: core.bottom
  boolean: unknown_
}

export interface LowerBound {
  (u: unknown): u is any
  tag?: typeof tags[number]
  def?: any
  _type?: any
}

export interface FullSchema<T = unknown> {
  (u: unknown): u is T
  tag: typeof tags[number]
  def?: unknown
  _type: T
  // pipe: unknown
  // extend: unknown
}


type Target<S> = never | S extends (_: any) => _ is infer T ? T : S
type Inline<T> = never | inline<Target<T>>

type Entry<S>
  = S extends { def: unknown } ? S
  : S extends Guard<infer T> ? inline<T>
  : S extends (() => infer _ extends boolean)
  ? BoolLookup[`${_}`]
  : S

export type F<T> =
  | Leaf
  | eq.def<T>
  | array.def<T>
  | record.def<T>
  | optional.def<T>
  | union.def<readonly T[]>
  | intersect.def<readonly T[]>
  | tuple.def<readonly T[]>
  | object_.def<{ [x: string]: T }>

export type Fixpoint =
  | Leaf
  | eq.def<Fixpoint>
  | intersect.def<readonly Fixpoint[]>
  | array<Fixpoint>
  | record<Fixpoint>
  | optional<Fixpoint>
  | union<readonly Fixpoint[]>
  | tuple<readonly Fixpoint[]>
  | object_<{ [x: string]: Fixpoint }>

export interface Free extends T.HKT { [-1]: F<this[0]> }

export interface inline<T> extends inline.def<T> { }
export function inline<S extends Guard>(guard: S): inline<S>
export function inline<S extends core.Predicate>(guard: S): inline<Entry<S>>
export function inline<S>(guard: (Guard<S>) & { tag?: URI.inline, def?: Guard<S> }) {
  guard.tag = URI.inline
  guard.def = guard
  return guard
}

export namespace inline {
  export interface def<T> extends core.inline<Target<T>> { def: T }
  export function def<T extends Guard>(x: T): inline.def<T>
  export function def<T extends Guard>(x: T) {
    // const schema = core.inline(x)
    return Object_assign(
      x,
      { def: x, tag: URI.inline }
      // pipe(schema),
    )
  }
}

export { never_ as never }
interface never_ extends
  core.never
// pipe<core.never> 
{ }


const never_ = <never_>Object_assign(
  core.never,
  // pipe(core.never),
)

export { unknown_ as unknown }
interface unknown_ extends
  core.unknown
// pipe<core.unknown> 
{ }

const unknown_ = <unknown_>Object_assign(
  core.unknown,
  // pipe(core.unknown),
)

export { any_ as any }
interface any_ extends
  core.any
// pipe<core.any>
{ }

const any_ = <any_>Object_assign(
  core.any,
  // pipe(core.any),
)

export { void_ as void }
export interface void_ extends
  core.void
// pipe<core.void> 
{ }

export const void_ = <void_>Object_assign(
  core.void,
  // pipe(core.void),
)

export { null_ as null }
export interface null_ extends
  core.null
// pipe<core.null>
{ }

export const null_ = <null_>Object_assign(
  core.null,
  // pipe(core.null),
)

export { undefined_ as undefined }
interface undefined_ extends
  core.undefined
// pipe<core.undefined>
{ }

const undefined_ = <undefined_>Object_assign(
  core.undefined,
  // pipe(core.undefined),
)

export { symbol_ as symbol }
interface symbol_ extends
  core.symbol
// pipe<core.symbol>
{ }

const symbol_ = <symbol_>Object_assign(
  core.symbol,
  // pipe(core.symbol),
)

export { boolean_ as boolean }
interface boolean_ extends
  core.boolean
// pipe<core.boolean>
{ }

const boolean_ = <boolean_>Object_assign(
  core.boolean,
  // pipe(core.boolean),
)

export interface integer extends
  core.integer
// pipe<core.integer> { }
{ }

export const integer = <integer>Object_assign(
  core.integer,
  // pipe(core.integer),
)

export { bigint_ as bigint }
interface bigint_ extends
  core.bigint
// pipe<core.bigint> 
{ }

const bigint_ = <bigint_>Object_assign(
  core.bigint,
  // pipe(core.bigint),
)

export { number_ as number }
interface number_ extends
  core.number
// pipe<core.number> 
{ }

const number_ = <number_>Object_assign(
  core.number,
  // pipe(core.number),
)

export { string_ as string }
interface string_ extends
  core.string
// pipe<core.string> 
{ }

const string_ = <string_>Object_assign(
  core.string,
  // pipe(core.string),
)

export function eq<const V extends T.Mut<V>>(value: V, options?: Options): eq<T.Mutable<V>>
export function eq<const V>(value: V, options?: Options): eq<V>
export function eq<const V>(value: V, options?: Options): eq<V> {
  return <eq<V>>eq.def(value, options)
}
export interface eq<V> extends eq.def<V> { }
export namespace eq {
  export interface def<T> extends
    AST.eq<T> {
    // pipe<eq.def<T>> 
    _type: T
    (u: unknown): u is T
  }
  export function def<T>(value: T, options?: Options): eq.def<T>
  export function def<T>(value: T, options?: Options): {} {
    const schema = core.eq.def(value, options);
    return Object_assign(
      schema,
      // pipe(schema),
    )
  }
  export const fix: <T>(value: T, options?: Options) => eq.fix<T> = def
  export interface fix<T> extends
    AST.eq<T> {
    // pipe<eq.fix<T>>
    _type: unknown
    (u: unknown): u is unknown
  }
}

export function optional<S extends Schema>(schema: S): optional<S>
export function optional<S extends core.Predicate>(schema: S): optional<Inline<S>>
export function optional<S>(schema: S): {} { return optional.def(schema) }

export interface optional<S> extends optional.def<S> { }
export namespace optional {
  export interface def<T, _type = undefined | T['_type' & keyof T]> extends
    AST.optional<T> {
    [symbol.optional]: number
    _type: _type
    (u: unknown): u is _type
  }
  // pipe<optional.def<T, _type>> 
  export function def<T>(x: T): optional.def<T>
  export function def<T>(x: T): {} {
    const schema = core.optional.def(x)
    return Object_assign(
      schema,
      // pipe(schema),
      { [symbol.optional]: 1 }
    )
  }
  export interface fix<T> extends
    AST.optional<T> {
    // pipe<optional.fix<T>>
    _type: T
    (u: unknown): u is unknown
  }
}

export interface ReadonlyArray<T extends Schema = Unspecified> extends array.def<T, never | readonly T['_type' & keyof T][]> { }

export function array<S extends Schema>(schema: S, readonly: 'readonly'): ReadonlyArray<S>
export function array<S extends Schema>(schema: S): array<S>
export function array<S extends { (u: unknown): boolean } | core.Predicate>(schema: S): array<Inline<S>>
export function array<S extends Schema>(schema: S): {} { return array.def(schema) }
export interface array<S> extends array.def<S> { }
export namespace array {
  export type _type<T> = never | T['_type' & keyof T][]
  export interface def<T, _type = never | T['_type' & keyof T][]> extends
    AST.array<T> {
    // pipe<array.def<T, _type>> {
    _type: _type
    (u: unknown): u is _type
  }
  export function def<T>(x: T): array.def<T>
  export function def<T>(x: T) {
    const schema = core.array.def(x)
    return Object_assign(
      schema,
      // pipe(schema),
    )
  }
  export interface fix<T> extends
    AST.array<T> {
    // pipe<array.fix<T>> {
    _type: unknown
    (u: unknown): u is unknown
  }
}


export function record<S extends Schema>(schema: S): record<S>
export function record<S extends core.Predicate>(schema: S): record<Inline<S>>
export function record<S extends Schema>(schema: S): {} {
  return record.def(schema)
}
export interface record<S> extends record.def<S> { }
export namespace record {
  export type _type<T> = never | globalThis.Record<string, T['_type' & keyof T]>
  export interface def<T, _type = record._type<T>> extends
    AST.record<T> {
    // pipe<record.def<T, _type>> {
    _type: _type
    (u: unknown): u is _type
  }
  export function def<T>(x: T): record.def<T>
  export function def<T>(x: T) {
    const schema = core.record.def(x)
    return Object_assign(
      schema,
      // pipe(schema),
    )
  }
  export interface fix<T> extends
    AST.record<T> {
    // pipe<record.fix<T>> {
    _type: unknown
    (u: unknown): u is unknown
  }
}

export function union<S extends readonly Schema[]>(...schemas: S): union<S>
export function union<
  S extends readonly core.Predicate[],
  T extends { [I in keyof S]: Entry<S[I]> } = { [I in keyof S]: Entry<S[I]> }
>(...schemas: S): union<T>
export function union<S extends core.Predicate[]>(...schemas: S): {} {
  return union.def(schemas)
}

export interface union<S extends readonly unknown[]> extends union.def<S> { }
export namespace union {
  export type _type<S> = S[number & keyof S]['_type' & keyof S[number & keyof S]]
  export interface def<T, _type = union._type<T>> extends
    AST.union<T> {
    // pipe<union.def<T, _type>> {
    _type: _type
    (u: unknown): u is _type
  }
  export function def<T extends readonly unknown[]>(xs: T): union.def<T>
  export function def<T extends readonly unknown[]>(xs: T): {} {
    const schema = core.union.def(xs)
    return Object_assign(
      schema,
      // pipe(schema),
    )
  }
  export const fix
    : <T extends readonly unknown[]>(xs: T) => union.fix<T>
    = def
  export interface fix<T> extends
    AST.union<T> {
    // pipe<union.fix<T>> {
    _type: unknown
    (u: unknown): u is unknown
  }
}

export function intersect<S extends readonly Schema[]>(...schemas: S): intersect<S>
export function intersect<
  S extends readonly core.Predicate[],
  T extends { [I in keyof S]: Entry<S[I]> } = { [I in keyof S]: Entry<S[I]> }
>(...schemas: S): intersect<T>
export function intersect<S extends unknown[]>(...schemas: S) { return intersect.def(schemas) }

export interface intersect<S extends readonly unknown[]> extends intersect.def<S> { }
export namespace intersect {
  export type _type<Todo, Out = unknown>
    = Todo extends readonly [infer H, ...infer T]
    ? intersect._type<T, Out & H['_type' & keyof H]>
    : Out
  export interface def<T, _type = intersect._type<T>> extends
    AST.intersect<T> {
    // pipe<intersect.def<T, _type>> {
    _type: _type
    (u: unknown): u is _type
  }
  export function def<T extends readonly unknown[]>(xs: T): intersect.def<T>
  export function def<T extends readonly unknown[]>(xs: T): {} {
    const schema = core.intersect.def(xs)
    return Object.assign(
      schema,
      // pipe(schema),
    )
  }
  export interface fix<T> extends
    AST.intersect<T> {
    // pipe<intersect.fix<T>> {
    _type: unknown
    (u: unknown): u is unknown
  }
}

export function tuple<S extends readonly Schema[]>(...schemas: tuple.validate<S>):
  tuple<core.tuple.from<tuple.validate<S>, S>>

export function tuple<
  S extends readonly core.Predicate[],
  T extends { [I in keyof S]: Entry<S[I]> }
>(...schemas: tuple.validate<S>):
  tuple<core.tuple.from<tuple.validate<S>, T>>

export function tuple<S extends readonly Schema[]>(...args: [...schemas: tuple.validate<S>, options: Options]):
  tuple<core.tuple.from<tuple.validate<S>, S>>

export function tuple<
  S extends readonly core.Predicate[],
  T extends { [I in keyof S]: Entry<S[I]> }
>(...args: [...schemas: tuple.validate<S>, options: Options]):
  tuple<core.tuple.from<tuple.validate<S>, T>>

export function tuple<S extends readonly core.Predicate[]>(
  ...args:
    | [...S]
    | [...S, Options]
): {} {
  const [schemas, options] = parseArgs(getConfig().schema, args)
  return tuple.def(schemas, options)
}

export interface tuple<S extends readonly unknown[]> extends tuple.def<S> { }
export namespace tuple {
  export type validate<T extends readonly unknown[]> = ValidateTuple<T, optional<any>>
  export interface def<T, _type = tuple._type<T>> extends
    AST.tuple<T> {
    // pipe<tuple.def<T, _type>> {
    readonly _type: _type
    (u: unknown): u is this['_type']
  }
  export type _type<T> = never | Items<T, optional<any>>
  export type Items<T, LowerBound = optional<any>, Out extends readonly unknown[] = []>
    = LowerBound extends T[number & keyof T]
    ? T extends readonly [infer Head, ...infer Tail]
    ? [Head] extends [LowerBound] ? Label<
      { [ix in keyof Out]: Out[ix]['_type' & keyof Out[ix]] },
      { [ix in keyof T]: T[ix]['_type' & keyof T[ix]] }
    >
    : Items<Tail, LowerBound, [...Out, Head]>
    : never
    : { [ix in keyof T]: T[ix]['_type' & keyof T[ix]] }
    ;
  export function def<T extends readonly unknown[]>(xs: T, $?: Options): tuple.def<T>
  export function def<T extends readonly unknown[]>(xs: T, $?: Options) {
    const schema = core.tuple.def(xs, $)
    return Object_assign(
      schema,
      // pipe(schema),
    )
  }
  export interface fix<T> extends
    AST.tuple<T> {
    // pipe<tuple.fix<T>> {
    readonly _type: unknown
    (u: unknown): u is this['_type']
  }
}

export { object_ as object }
function object_<
  S extends { [x: string]: Schema },
  T extends { [K in keyof S]: Entry<S[K]> }
>(schemas: S, options?: Options): object_<T>

function object_<
  S extends { [x: string]: core.Predicate },
  T extends { [K in keyof S]: Entry<S[K]> }
>(schemas: S, options?: Options): object_<T>

function object_<S extends { [x: string]: Schema }>(schemas: S, options?: Options) {
  return object_.def(schemas, options)
}

interface object_<S extends { [x: string]: unknown }> extends object_.def<S> { }
namespace object_ {
  export type Force<T> = never | { -readonly [K in keyof T]: T[K] }
  export type Optionals<S, K extends keyof S = keyof S> =
    string extends K ? string : K extends K ? S[K] extends core.bottom | optional<any> ? K : never : never
  export type Required<S, K extends keyof S = keyof S> =
    string extends K ? string : K extends K ? S[K] extends core.bottom | optional<any> ? never : K : never
  export interface def<
    T,
    Opt extends Optionals<T> = Optionals<T>,
    Req extends Required<T> = Required<T>,
    _type =
    & { [K in Req]-?: T[K]['_type' & keyof T[K]] }
    & { [K in Opt]+?: T[K]['_type' & keyof T[K]] }
  > extends
    AST.object<T> {
    // pipe<object_.def<T, Opt, Req, _type>> {
    _type: Force<_type>
    (u: unknown): u is this['_type']
  }

  export function def<T extends { [x: string]: unknown }>(xs: T, $?: Options): object_.def<T>
  export function def<T extends { [x: string]: unknown }>(xs: T, $?: Options): {} {
    const schema = core.object.def(xs, $)
    return Object_assign(
      schema,
      // pipe(schema),
    )
  }
  export interface fix<T> extends
    AST.object<T> {
    // pipe<object_.fix<T>> {
    _type: unknown
    (u: unknown): u is unknown
  }
}

export type Leaf = typeof leaves[number]
export const leaves = [
  unknown_,
  never_,
  any_,
  void_,
  undefined_,
  null_,
  symbol_,
  bigint_,
  boolean_,
  integer,
  number_,
  string_,
]

export const leafTags = leaves.map((leaf) => leaf.tag)
export const tags = [...leafTags, URI.optional, URI.eq, URI.array, URI.record, URI.tuple, URI.union, URI.intersect, URI.object]

export const Functor: T.Functor<Free, Fixpoint> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case core.isLeaf(x): return x
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

export const fold = fn.cata(Functor)
export const unfold = fn.ana(Functor)
