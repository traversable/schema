import type { HKT, Mut } from '@traversable/registry'
import { parseArgs, symbol } from '@traversable/registry'

import type {
  SchemaOptions as Options,
  ValidateTuple as Validate,
} from '@traversable/schema-core'
import {
  t as core,
  getConfig,
} from '@traversable/schema-core'

import { v } from '@traversable/derive-validators'

import * as toString from './toString.js'

/** @internal */
type ValidateTuple<T extends readonly unknown[]> = Validate<T, optional<any>>

/** @internal */
const Object_assign = globalThis.Object.assign


export type typeOf<T extends { _type?: unknown }> = core.typeof<T>
export interface Any extends core.AnySchema { }
export interface Schema<S extends Schema.any = Schema.Unspecified> extends core.Schema<S> { }
export declare namespace Schema { export { Any as any, Unspecified } }
export interface Unspecified extends core.Unspecified { }

export { never_ as never }

interface never_ extends core.never, v.never, toString.never { }
const never_: never_ = Object_assign(
  core.never,
  v.never,
  toString.never,
)

export { unknown_ as unknown }
interface unknown_ extends core.unknown, v.unknown, toString.unknown { }
const unknown_: unknown_ = Object_assign(
  core.unknown,
  v.unknown,
  toString.unknown,
)

export { any_ as any }
interface any_ extends core.any, v.any, toString.any { }
const any_: any_ = Object_assign(
  core.any,
  v.any,
  toString.any,
)

export { void_ as void }
export interface void_ extends core.void, v.void, toString.void { }
export const void_: void_ = Object_assign(
  core.void,
  v.void,
  toString.void,
)

export { string_ as string }
interface string_ extends core.string, v.string, toString.string { }
const string_: string_ = Object_assign(
  core.string,
  v.string,
  toString.string,
)

export { number_ as number }
interface number_ extends core.number, v.number, toString.number { }
const number_: number_ = Object_assign(
  core.number,
  v.number,
  toString.number,
)

export { boolean_ as boolean }
interface boolean_ extends core.boolean, v.boolean, toString.boolean { }
const boolean_: boolean_ = Object_assign(
  core.boolean,
  v.boolean,
  toString.boolean,
)

export { null_ as null }
export interface null_ extends core.null, v.null, toString.null { }
export const null_: null_ = Object_assign(
  core.null,
  v.null,
  toString.null,
)

export { integer_ as integer }
interface integer_ extends core.integer, v.integer, toString.integer { }
const integer_: integer_ = Object_assign(
  core.integer,
  v.integer,
  toString.integer,
)

export { symbol_ as symbol }
interface symbol_ extends core.symbol, v.symbol, toString.symbol { }
const symbol_: symbol_ = Object_assign(
  core.symbol,
  v.symbol,
  toString.symbol,
)

export { bigint_ as bigint }
interface bigint_ extends core.bigint, v.bigint, toString.bigint { }
const bigint_: bigint_ = Object_assign(
  core.bigint,
  v.bigint,
  toString.bigint,
)

export { undefined_ as undefined }
interface undefined_ extends core.undefined, v.undefined, toString.undefined { }
const undefined_: undefined_ = Object_assign(
  core.undefined,
  v.undefined,
  toString.undefined,
)

export function eq<const V extends Mut<V>>(value: V): eq<V> {
  return eq.fix(value)
}
export interface eq<V> extends eq.def<V> { }
export namespace eq {
  export interface def<T> extends
    core.eq.def<T>,
    toString.eq<T> { validate: v.ValidationFn }

  export function fix<T>(value: T): eq.def<T>
  export function fix<T>(value: T) {
    const schema = core.eq.fix(value);
    (schema as any).validate = v.eq(value)
    return Object_assign(
      schema,
      toString.eq(value),
    )
  }
}

export function optional<S extends Schema>(schema: S): optional<S> {
  return optional.fix(schema)
}


export interface optional<S extends Schema> extends optional.def<S> { }
export namespace optional {
  export interface def<T> extends
    core.optional.def<T>,
    // v.optional<T>,
    toString.optional<T> { validate: v.ValidationFn }

  export function fix<T>(x: T) {
    return Object_assign(
      core.optional.fix(x),
      v.optional(x),
      toString.optional(x),
      { [symbol.optional]: true }
    )
  }
}

export function array<S extends Schema>(schema: S): array<S> { return array.fix(schema) }
export interface array<S extends Schema> extends array.def<S> { }
export namespace array {
  export interface def<T> extends
    core.array.def<T>,
    // v.array<T>,
    toString.array<T> { validate: v.ValidationFn }

  export function fix<T>(x: T) {
    return Object_assign(
      core.array.fix(x),
      v.array(x),
      toString.array(x),
    )
  }
}

export function record<S extends Schema>(schema: S): record<S> { return record.fix(schema) }
export interface record<S extends Schema> extends record.def<S> { }
export namespace record {
  export interface def<T> extends
    core.record.def<T>,
    // v.record<T>,
    toString.record<T> { validate: v.ValidationFn }

  export function fix<T>(x: T) {
    return Object_assign(
      core.record.fix(x),
      v.record(x),
      toString.record(x),
    )
  }
}

export function union<S extends readonly Schema[]>(...schemas: S): union<S> { return union.fix(schemas) }
export interface union<S extends readonly Schema[]> extends union.def<S> { }
export namespace union {
  export interface def<T extends readonly unknown[]> extends
    core.union.def<T>,
    // v.union<T>,
    toString.union<T> { validate: v.ValidationFn }

  export function fix<T extends readonly unknown[]>(xs: T): union.def<T>
  export function fix<T extends readonly unknown[]>(xs: T): {} {
    return Object_assign(
      core.union.fix(xs),
      v.union(xs),
      toString.union(xs),
    )
  }
}


export function intersect<S extends readonly Schema[]>(...schemas: S): intersect<S> { return intersect.fix(schemas) }
export interface intersect<S extends readonly Schema[]> extends intersect.def<S> { }
export namespace intersect {
  export interface def<T extends readonly unknown[]> extends
    core.intersect.def<T>,
    // v.intersect<T>,
    toString.intersect<T> { validate: v.ValidationFn }

  export function fix<T extends readonly unknown[]>(xs: T): intersect.def<T>
  export function fix<T extends readonly unknown[]>(xs: T): {} {
    return Object.assign(
      core.intersect.fix(xs),
      v.intersect(xs),
      toString.intersect(xs),
    )
  }
}

export function tuple<S extends readonly Schema[]>(...schemas: ValidateTuple<S>): tuple<core.tuple.from<ValidateTuple<S>, S>>
export function tuple<S extends readonly Schema[]>(...args: [...schemas: ValidateTuple<S>, options: Options]): tuple<core.tuple.from<ValidateTuple<S>, S>>
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
  export interface def<T extends readonly unknown[]> extends
    core.tuple.def<T, optional<any>>,
    toString.tuple<T> { validate: v.ValidationFn }

  export function fix<T extends readonly unknown[]>(xs: T, $?: Options) {
    return Object_assign(
      // core.tuple.fix(xs, $),
      v.tuple(xs, $),
      toString.tuple(xs),
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
    // v.object<T>,
    toString.object<T> { validate: v.ValidationFn }

  export function fix<T extends { [x: string]: unknown }>(xs: T, $?: Options): object_.def<T> {
    return Object_assign(
      core.object.fix(xs, $),
      toString.object(xs),
      v.object(xs, $),
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
