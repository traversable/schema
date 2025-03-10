import type { HKT, Mut } from '@traversable/registry'
import { parseArgs, symbol } from '@traversable/registry'

import type { SchemaOptions as Options, ValidateTuple } from '@traversable/schema-core'
import { t as core, getConfig } from '@traversable/schema-core'
import { v } from '@traversable/derive-validators'
import { JsonSchema } from '@traversable/schema-to-json-schema'
import { pipe } from '@traversable/schema-codec'

import * as toString from './toString.js'

/** @internal */
const Object_assign = globalThis.Object.assign

export type typeOf<T extends { _type?: unknown }> = core.typeof<T>
export interface Any extends core.AnySchema { }
export interface Schema<S extends Schema.any = Schema.Unspecified> extends core.Schema<S> { }
export declare namespace Schema { export { Any as any, Unspecified } }
export interface Unspecified extends core.Unspecified { }

export { never_ as never }
interface never_ extends
  core.never,
  v.never,
  toString.never,
  JsonSchema.never,
  pipe<core.never> { }

const never_: never_ = Object_assign(
  core.never,
  v.never,
  toString.never,
  JsonSchema.never,
  pipe(core.never),
)

export { unknown_ as unknown }
interface unknown_ extends
  core.unknown,
  v.unknown,
  toString.unknown,
  JsonSchema.unknown,
  pipe<core.unknown> { }

const unknown_: unknown_ = Object_assign(
  core.unknown,
  v.unknown,
  toString.unknown,
  JsonSchema.unknown,
  pipe(core.unknown),
)

export { any_ as any }
interface any_ extends
  core.any,
  v.any,
  toString.any,
  JsonSchema.any,
  pipe<core.any> { }

const any_: any_ = Object_assign(
  core.any,
  v.any,
  toString.any,
  JsonSchema.any,
  pipe(core.any),
)

export { void_ as void }
export interface void_ extends
  core.void,
  v.void,
  toString.void,
  JsonSchema.void,
  pipe<core.void> { }

export const void_: void_ = Object_assign(
  core.void,
  v.void,
  toString.void,
  JsonSchema.void,
  pipe(core.void),
)

export { string_ as string }
interface string_ extends
  core.string,
  v.string,
  toString.string,
  JsonSchema.string,
  pipe<core.string> { }

const string_: string_ = Object_assign(
  core.string,
  v.string,
  toString.string,
  JsonSchema.string,
  pipe(core.string),
)

export { number_ as number }
interface number_ extends
  core.number,
  v.number,
  toString.number,
  JsonSchema.number,
  pipe<core.number> { }

const number_: number_ = Object_assign(
  core.number,
  v.number,
  toString.number,
  JsonSchema.number,
  pipe(core.number),
)

export { boolean_ as boolean }
interface boolean_ extends
  core.boolean,
  v.boolean,
  toString.boolean,
  JsonSchema.boolean,
  pipe<core.boolean> { }

const boolean_: boolean_ = Object_assign(
  core.boolean,
  v.boolean,
  toString.boolean,
  JsonSchema.boolean,
  pipe(core.boolean),
)

export { null_ as null }
export interface null_ extends
  core.null,
  v.null,
  toString.null,
  JsonSchema.null,
  pipe<core.null> { }

export const null_: null_ = Object_assign(
  core.null,
  v.null,
  toString.null,
  JsonSchema.null,
  pipe(core.null),
)

export { integer_ as integer }
interface integer_ extends
  core.integer,
  v.integer,
  toString.integer,
  JsonSchema.integer,
  pipe<core.integer> { }

const integer_: integer_ = Object_assign(
  core.integer,
  v.integer,
  toString.integer,
  JsonSchema.integer,
  pipe(core.integer),
)

export { symbol_ as symbol }
interface symbol_ extends
  core.symbol,
  v.symbol,
  toString.symbol,
  pipe<core.symbol> { }

const symbol_: symbol_ = Object_assign(
  core.symbol,
  v.symbol,
  toString.symbol,
  JsonSchema.symbol,
  pipe(core.symbol),
)

export { bigint_ as bigint }
interface bigint_ extends
  core.bigint,
  v.bigint,
  toString.bigint,
  pipe<core.bigint> { }

const bigint_: bigint_ = Object_assign(
  core.bigint,
  v.bigint,
  toString.bigint,
  JsonSchema.bigint,
  pipe(core.bigint),
)

export { undefined_ as undefined }
interface undefined_ extends
  core.undefined,
  v.undefined,
  toString.undefined,
  pipe<core.undefined> { }

const undefined_: undefined_ = Object_assign(
  core.undefined,
  v.undefined,
  toString.undefined,
  JsonSchema.undefined,
  pipe(core.undefined),
)

export function eq<const V extends Mut<V>>(value: V): eq<V> { return eq.fix(value) }
export interface eq<V> extends eq.def<V> { }
export namespace eq {
  export interface def<T> extends
    core.eq.def<T>,
    toString.eq<T>,
    JsonSchema.eq<T>,
    pipe<core.eq.def<T>> { validate: v.ValidationFn }

  export function fix<T>(value: T): eq.def<T>
  export function fix<T>(value: T) {
    const schema = core.eq.fix(value);
    (schema as any).validate = v.eq(value)
    return Object_assign(
      schema,
      toString.eq(value),
      JsonSchema.eq(value),
      pipe(schema),
    )
  }
}

export function optional<S extends Schema>(schema: S): optional<S> { return optional.fix(schema) }
export interface optional<S extends Schema> extends optional.def<S> { }
export namespace optional {
  export interface def<T> extends
    core.optional.def<T>,
    toString.optional<T>,
    JsonSchema.optional<T>,
    pipe<core.optional.def<T>> { validate: v.ValidationFn }

  export function fix<T>(x: T) {
    const schema = core.optional.fix(x)
    return Object_assign(
      schema,
      v.optional(x),
      toString.optional(x),
      JsonSchema.optional(x),
      pipe(schema),
      { [symbol.optional]: true },
    )
  }
}

export function array<S extends Schema>(schema: S): array<S> { return array.fix(schema) }
export interface array<S extends Schema> extends array.def<S> { }
export namespace array {
  export interface def<T> extends
    core.array.def<T>,
    toString.array<T>,
    JsonSchema.array<T>,
    pipe<core.array.def<T>> { validate: v.ValidationFn }

  export function fix<T>(x: T) {
    const schema = core.array.fix(x)
    return Object_assign(
      schema,
      v.array(x),
      toString.array(x),
      JsonSchema.array(x),
      pipe(schema),
    )
  }
}

export function record<S extends Schema>(schema: S): record<S> { return record.fix(schema) }
export interface record<S extends Schema> extends record.def<S> { }
export namespace record {
  export interface def<T> extends
    core.record.def<T>,
    toString.record<T>,
    JsonSchema.record<T>,
    pipe<core.record.def<T>> { validate: v.ValidationFn }

  export function fix<T>(x: T) {
    const schema = core.record.fix(x)
    return Object_assign(
      schema,
      v.record(x),
      toString.record(x),
      JsonSchema.record(x),
      pipe(schema),
    )
  }
}

export function union<S extends readonly Schema[]>(...schemas: S): union<S> { return union.fix(schemas) }
export interface union<S extends readonly Schema[]> extends union.def<S> { }
export namespace union {
  export interface def<T extends readonly unknown[]> extends
    core.union.def<T>,
    toString.union<T>,
    JsonSchema.union<T>,
    pipe<core.union.def<T>> { validate: v.ValidationFn }

  export function fix<T extends readonly unknown[]>(xs: T): union.def<T>
  export function fix<T extends readonly unknown[]>(xs: T): {} {
    const schema = core.union.fix(xs)
    return Object_assign(
      schema,
      v.union(xs),
      toString.union(xs),
      JsonSchema.union(xs),
      pipe(schema),
    )
  }
}


export function intersect<S extends readonly Schema[]>(...schemas: S): intersect<S> { return intersect.fix(schemas) }
export interface intersect<S extends readonly Schema[]> extends intersect.def<S> { }
export namespace intersect {
  export interface def<T extends readonly unknown[]> extends
    core.intersect.def<T>,
    toString.intersect<T>,
    JsonSchema.intersect<T>,
    pipe<core.intersect.def<T>> { validate: v.ValidationFn }

  export function fix<T extends readonly unknown[]>(xs: T): intersect.def<T>
  export function fix<T extends readonly unknown[]>(xs: T): {} {
    const schema = core.intersect.fix(xs)
    return Object.assign(
      schema,
      v.intersect(xs),
      toString.intersect(xs),
      JsonSchema.intersect(xs),
      pipe(schema),
    )
  }
}

export function tuple<S extends readonly Schema[]>(...schemas: tuple.validate<S>):
  tuple<core.tuple.from<tuple.validate<S>, S>>

export function tuple<S extends readonly Schema[]>(
  ...args: [...schemas: tuple.validate<S>, options: Options]
): tuple<core.tuple.from<tuple.validate<S>, S>>

export function tuple<S extends readonly Schema[]>(
  ...args:
    | [...S]
    | [...S, Options]
) {
  const [schemas, options] = parseArgs(getConfig().schema, args)
  return tuple.fix(schemas, options)
}

export interface tuple<S extends readonly unknown[]> extends tuple.def<S> { }
export namespace tuple {
  export type validate<T extends readonly unknown[]> = ValidateTuple<T, optional<any>>
  export interface def<T extends readonly unknown[]> extends
    core.tuple.def<T, optional<any>>,
    toString.tuple<T>,
    JsonSchema.tuple<T>,
    pipe<core.tuple.def<T>> { validate: v.ValidationFn }

  export function fix<T extends readonly unknown[]>(xs: T, $?: Options) {
    const schema = v.tuple(xs, $)
    return Object_assign(
      schema,
      toString.tuple(xs),
      JsonSchema.tuple(xs),
      pipe(schema),
    )
  }
}

export { object_ as object }
function object_<
  S extends { [x: string]: Schema },
  T extends { [K in keyof S]: core.Entry<S[K]> }
>(schemas: S, options?: Options): object_<T>

function object_<
  S extends { [x: string]: core.Predicate },
  T extends { [K in keyof S]: core.Entry<S[K]> }
>(schemas: S, options?: Options): object_<T>

function object_<S extends { [x: string]: Schema }>(schemas: S, options?: Options) {
  return object_.fix(schemas, options)
}

interface object_<S extends { [x: string]: unknown }> extends object_.def<S> { }
namespace object_ {
  export interface def<T extends { [x: string]: unknown }> extends
    core.object.def<T>,
    toString.object<T>,
    JsonSchema.object<T>,
    pipe<core.object.def<T>> { validate: v.ValidationFn }

  export function fix<T extends { [x: string]: unknown }>(xs: T, $?: Options): object_.def<T> {
    const schema = core.object.fix(xs, $)
    return Object_assign(
      schema,
      v.object(xs, $),
      toString.object(xs),
      JsonSchema.object(xs),
      pipe(schema),
    )
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
  integer_,
  number_,
  string_,
]

export const leafTags = leaves.map((leaf) => leaf.tag)

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
  | array.def<Fixpoint>
  | record.def<Fixpoint>
  | optional.def<Fixpoint>
  | union.def<readonly Fixpoint[]>
  | intersect.def<readonly Fixpoint[]>
  | tuple.def<readonly Fixpoint[]>
  | object_.def<{ [x: string]: Fixpoint }>

export interface Free extends HKT { [-1]: F<this[0]> }

object_({ a: optional(number_), b: string_ })
