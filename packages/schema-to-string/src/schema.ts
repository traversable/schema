import type { HKT } from '@traversable/registry'
import { parseArgs } from '@traversable/registry'
import type { SchemaOptions as Options, ValidateTuple } from '@traversable/schema-core'
import { t as core, getConfig } from '@traversable/schema-core'
import * as toString from './toString.js'

/** @internal */
const Object_assign = globalThis.Object.assign

export { never_ as never }
interface never_ extends core.never, toString.never { }
const never_: never_ = Object_assign(core.never, toString.never)

export { unknown_ as unknown }
interface unknown_ extends core.unknown, toString.unknown { }
const unknown_: unknown_ = Object_assign(core.unknown, toString.unknown)

export { any_ as any }
interface any_ extends core.any, toString.any { }
const any_: any_ = Object_assign(core.any, toString.any)

export { void_ as void }
export interface void_ extends core.void, toString.void { }
export const void_: void_ = Object_assign(core.void, toString.void)

export { string_ as string }
interface string_ extends core.string, toString.string { }
const string_: string_ = Object_assign(core.string, toString.string)

export { number_ as number }
interface number_ extends core.number, toString.number { }
const number_: number_ = Object_assign(core.number, toString.number)

export { boolean_ as boolean }
interface boolean_ extends core.boolean, toString.boolean { }
const boolean_: boolean_ = Object_assign(core.boolean, toString.boolean)

export { null_ as null }
export interface null_ extends core.null, toString.null { }
export const null_: null_ = Object_assign(core.null, toString.null)

export { integer_ as integer }
interface integer_ extends core.integer, toString.integer { }
const integer_: integer_ = Object_assign(core.integer, toString.integer)

export { symbol_ as symbol }
interface symbol_ extends core.symbol, toString.symbol { }
const symbol_: symbol_ = Object_assign(core.symbol, toString.symbol)

export { bigint_ as bigint }
interface bigint_ extends core.bigint, toString.bigint { }
const bigint_: bigint_ = Object_assign(core.bigint, toString.bigint)

export { undefined_ as undefined }
interface undefined_ extends core.undefined, toString.undefined { }
const undefined_: undefined_ = Object_assign(core.undefined, toString.undefined)

export function eq<const V>(value: V): eq<V> { return eq.def(value) }
export interface eq<V> extends eq.def<V> { }
export namespace eq {
  export interface def<T> extends core.eq.def<T>, toString.eq<T> { }
  export function def<T>(value: T): eq.def<T> { return Object_assign(core.eq.def(value), toString.eq(value)) }
}

export function optional<S extends core.Schema>(schema: S): optional<S> { return optional.def(schema) }
export interface optional<S extends core.Schema> extends optional.def<S> { }
export namespace optional {
  export interface def<T> extends core.optional.def<T>, toString.optional<T> { }
  export function def<T>(x: T): def<T> { return Object_assign(core.optional.def(x), toString.optional(x)) }
}

export function array<S extends core.Schema>(schema: S): array<S> { return array.def(schema) }
export interface array<S extends core.Schema> extends array.def<S> { }
export namespace array {
  export interface def<T> extends core.array.def<T>, toString.array<T> { }
  export function def<T>(x: T) { return Object_assign(core.array.def(x), toString.array(x)) }
}

export function record<S extends core.Schema>(schema: S): record<S> { return record.def(schema) }
export interface record<S extends core.Schema> extends record.def<S> { }
export namespace record {
  export interface def<T> extends core.record.def<T>, toString.record<T> { }
  export function def<T>(x: T) { return Object_assign(core.record.def(x), toString.record(x)) }
}

export function union<S extends readonly core.Schema[]>(...schemas: S): union<S> { return union.def(schemas) }
export interface union<S extends readonly core.Schema[]> extends union.def<S> { }
export namespace union {
  export interface def<T extends readonly unknown[]> extends core.union.def<T>, toString.union<T> { }
  export function def<T extends readonly unknown[]>(xs: T): union.def<T>
  export function def<T extends readonly unknown[]>(xs: T): {} { return Object_assign(core.union.def(xs), toString.union(xs)) }
}

export function intersect<S extends readonly core.Schema[]>(...schemas: S): intersect<S> { return intersect.def(schemas) }
export interface intersect<S extends readonly core.Schema[]> extends intersect.def<S> { }
export namespace intersect {
  export interface def<T extends readonly unknown[]> extends core.intersect.def<T>, toString.intersect<T> { }
  export function def<T extends readonly unknown[]>(xs: T): intersect.def<T>
  export function def<T extends readonly unknown[]>(xs: T): {} { return Object.assign(core.intersect.def(xs), toString.intersect(xs)) }
}

export function tuple<S extends readonly core.Schema[]>(...schemas: tuple.validate<S>):
  tuple<core.tuple.from<tuple.validate<S>, S>>
export function tuple<S extends readonly core.Schema[]>(...args: [...schemas: tuple.validate<S>, options: Options]):
  tuple<core.tuple.from<tuple.validate<S>, S>>
export function tuple<S extends readonly core.Schema[]>(...args: | [...S] | [...S, Options]) {
  const [schemas, options] = parseArgs(getConfig().schema, args)
  return tuple.def(schemas, options)
}
export interface tuple<S extends readonly unknown[]> extends tuple.def<S> { }
export namespace tuple {
  export type validate<T extends readonly unknown[]> = ValidateTuple<T, optional<any>>
  export interface def<T extends readonly unknown[]> extends core.tuple.def<T, optional<any>>, toString.tuple<T> { }
  export function def<T extends readonly unknown[]>(xs: T, $?: Options) {
    return Object_assign(core.tuple.def(xs, $), toString.tuple(xs))
  }
}

export { object_ as object }
function object_<
  S extends { [x: string]: core.Schema },
  T extends { [K in keyof S]: core.Entry<S[K]> }
>(schemas: S, options?: Options): object_<T>
//
function object_<
  S extends { [x: string]: core.Predicate },
  T extends { [K in keyof S]: core.Entry<S[K]> }
>(schemas: S, options?: Options): object_<T>
//
function object_<S extends { [x: string]: core.Schema }>(schemas: S, options?: Options) { return object_.def(schemas, options) }
interface object_<S extends { [x: string]: unknown }> extends object_.def<S> { }
namespace object_ {
  export interface def<T extends { [x: string]: unknown }> extends core.object.def<T>, toString.object<T> { }
  export function def<T extends { [x: string]: unknown }>(xs: T, $?: Options): object_.def<T> {
    return Object_assign(core.object.def(xs, $), toString.object(xs))
  }
}

export type Leaf = unknown_ | never_ | any_ | void_ | undefined_ | null_ | symbol_ | bigint_ | boolean_ | integer_ | number_ | string_
export interface Free extends HKT { [-1]: F<this[0]> }
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
  ;
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
  ;
