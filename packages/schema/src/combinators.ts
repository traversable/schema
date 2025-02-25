import type { Finite, HKT, Kind, newtype, Primitive } from '@traversable/registry'
import { fn, TypeError as TE } from '@traversable/registry'
import type { Guard, Predicate } from '@traversable/schema-core'
import { Json } from '@traversable/json'
import { t } from '@traversable/schema-core'

/** @internal */
const Object_values = globalThis.Object.values

type TypeError<Msg extends string, T = unknown> = TE.Unary<Msg, T>

declare namespace Type {
  interface json extends HKT<{ _type?: unknown }> {
    [-1]: Json.Scalar | readonly t.typeof<this[0]>[] | globalThis.Record<string, t.typeof<this[0]>>
  }
}

interface Extensible<T extends {} = {}> extends newtype<T> {
  [-1]?: T
}

interface Ext<T extends {}> extends newtype<T> { [-1]: T }
function Ext<F extends Guard>(guard: F): Ext<F>
function Ext<F extends Predicate>(guard: F): Ext<F>
function Ext<F extends Extensible>(guard: F) {
  guard[-1] = guard
  return guard
}

/**
 * ## {@link refine `t.refine`}
 */
export function refine<T>(guard: Guard<T>, predicate: Predicate<T>): Guard<T>
export function refine<T>(guard: Guard<T>): (predicate: Predicate<T>) => Guard<T>
export function refine<T>(...args: [guard: Guard<T>] | [guard: Guard<T>, predicate: Predicate<T>]) {
  if (args.length === 1) return (predicate: Predicate<T>) => refine(args[0], predicate)
  else return (x: T) => args[0](x) && args[1](x)
}

/**
 * ## {@link compose `t.compose`}
 */
export function compose<A, B extends A, C extends B>(f: (a: A) => a is B, g: (b: B) => b is C): (b: B) => b is C
export function compose<A, B extends A>(f: (a: A) => a is B, g: (b: B) => boolean): Guard<B>
export function compose<A, B extends A>(f: (a: A) => boolean, g: (a: A) => a is B): Guard<B>
export function compose<A, B extends A>(f: (a: A) => B | boolean, g: (a: A) => B | boolean): (a: A) => B | boolean {
  return (a: A) => {
    const b = f(a)
    return b === false ? false : b === true ? g(a) : g(b)
  }
}

export interface Enum<T> extends Guard<T extends readonly unknown[] ? T[number] : T[keyof T]> { }

/**
 * ## {@link memberOf `t.memberOf`}
 */
export function Enum<T extends readonly Primitive[]>(...primitives: [...T]): Ext<Enum<T>>
export function Enum<T extends Record<string, Primitive>>(record: T): Ext<Enum<T>>
export function Enum(
  ...[head, ...tail]:
    | [...primitives: readonly unknown[]]
    | [record: Record<string, unknown>]
) {
  return Ext(
    (u) => {
      if (!!head && typeof head === 'object') return Object_values(head).includes(u)
      else return u === head || tail.includes(u)
    })
}

const json_scalar = t.union(
  t.null,
  t.boolean,
  t.number,
  t.string,
) satisfies { _type: Json.Scalar }

const json_shallow = <S extends t.Schema>(schema: S) => t.union(
  t.array(t.union(json_scalar, t.array(schema))),
  t.record(t.union(json_scalar, schema)),
)

function json_of<S extends t.Schema>(options: json.Options<S> & { includeUndefined: true }): S
function json_of<S extends t.Schema>(options: json.Options<S> & { includeUndefined: false }): S
function json_of(options?: json.Options): unknown
function json_of({
  includeUndefined = json.defaults.includeUndefined,
  schema = json.defaults.schema,
}: json.Options = json.defaults as never) {
  return t.union(
    ...(includeUndefined ? [t.undefined] : []),
    t.null,
    t.boolean,
    t.number,
    t.string,
    t.array(schema),
    t.record(schema),
  )
}

/**
 * ## {@link json `t.json`}
 * 
 * When called with __no arguments__, {@link json `t.json`} returns a schema
 * that represents __any JSON value__.
 * 
 * When called with __a schema__ (`S`), {@link json `t.json`} returns a schema
 * that represents {@link Json.Unary `Json.Unary<S>`}
 * 
 * When called with __any JSON value__, {@link json `t.json`} behaves similar
 * to {@link t.eq `t.eq`}, except that in addition to returning a schema that 
 * represents the literal value, it also constructs an AST that you can use for
 * reflection.
 */

export function json<const T extends Finite<T>>(jsonLiteral: T): json<T>
export function json(): json.any
export function json<S extends t.Schema>(schema: S): json.def<S>
export function json(_?: Json.Fixed | t.Schema) {
  if (_ === void 0 || typeof _ === 'function')
    return json.of({ ...typeof _ === 'function' && { schema: _ } })
  else return fn.cataIx(Json.IndexedFunctor)(
    (x: Json.Unary<t.AnySchema>) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case Json.isScalar(x): return t.eq(x)
        case Json.isArray(x): return t.tuple(...x)
        case Json.isObject(x): return t.object(x)
      }
    }
  )(_, { depth: 0, path: [] })
}

json.of = json_of
json.scalar = json_scalar
json.shallow = json_shallow
json.defaults = {
  includeUndefined: true,
  schema: json.shallow(
    t.union(
      json.scalar,
      t.array(json.shallow(t.unknown)),
      t.record(json.shallow(t.unknown)),
    )
  )
} satisfies Required<json.Options<unknown>>

export type json<S>
  = [S] extends [TypeError<string, any>] ? S
  : [S] extends [Primitive] ? t.eq<S>
  : [S] extends [readonly unknown[]] ? t.tuple<{ -readonly [Ix in keyof S]: json<S[Ix]> }>
  : t.object<{ -readonly [Ix in keyof S]: json<S[Ix]> }>

export declare namespace json { export { json_any as any } }
export declare namespace json {
  type Options<S = t.AnySchema> = {
    includeUndefined?: boolean
    schema?: S
  }
  interface def<T, F extends HKT = Type.json> {
    readonly _type: Kind<F, T>
    (u: unknown): u is this['_type']
  }
  interface json_any {
    (u: unknown): u is this['_type']
    _type: Json.Fixed
    def: t.union<[
      typeof json.scalar,
      t.array.def<JSON>,
      t.record.def<JSON>
    ]>
  }
}
