export type { AnySchema, Schema } from './core.js'

import type * as T from './registry.js'
import { fn, parseArgs, symbol, URI, typeName } from './registry.js'

import * as JsonSchema from './jsonSchema.js'
import * as toString from './toString.js'
import * as core from './core.js'
import type {
  Schema,
} from './core.js'

import { pipe } from './codec.js'
import { getConfig } from './config.js'
import type {
  SchemaOptions as Options,
} from './options.js'
import type {
  ValidateTuple
} from './types.js'

/** @internal */
const Object_assign = globalThis.Object.assign

export type typeOf<
  T extends { _type?: unknown },
  _ extends
  | T['_type']
  = T['_type']
> = never | _

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

export interface Free extends T.HKT { [-1]: F<this[0]> }


// const fromSchema_
//   : <T extends t.AnySchema>(x: T, ix?: Functor.Index) => (u: unknown) => true | ValidationError[]
//   = foldWithIndex(Recursive.fromSchema)

// export const fromSchema
//   : <T extends t.AnySchema>(schema: T) => (u: unknown) => true | ValidationError[]
//   = fromSchema_ as never

export { never_ as never }
interface never_ extends
  core.never,
  toString.never,
  JsonSchema.never,
  pipe<core.never> { }

const never_: never_ = Object_assign(
  core.never,
  toString.never,
  JsonSchema.never,
  pipe(core.never),
)

export { unknown_ as unknown }
interface unknown_ extends
  core.unknown,
  toString.unknown,
  JsonSchema.unknown,
  pipe<core.unknown> { }

const unknown_: unknown_ = Object_assign(
  core.unknown,
  toString.unknown,
  JsonSchema.unknown,
  pipe(core.unknown),
)

export { any_ as any }
interface any_ extends
  core.any,
  toString.any,
  JsonSchema.any,
  pipe<core.any> { }

const any_: any_ = Object_assign(
  core.any,
  toString.any,
  JsonSchema.any,
  pipe(core.any),
)

export { void_ as void }
export interface void_ extends
  core.void,
  toString.void,
  JsonSchema.void,
  pipe<core.void> { }

export const void_: void_ = Object_assign(
  core.void,
  toString.void,
  JsonSchema.void,
  pipe(core.void),
)

export { null_ as null }
export interface null_ extends
  core.null,
  toString.null,
  JsonSchema.null,
  pipe<core.null> { }

export const null_: null_ = Object_assign(
  core.null,
  toString.null,
  JsonSchema.null,
  pipe(core.null),
)

export { undefined_ as undefined }
interface undefined_ extends
  core.undefined,
  toString.undefined,
  pipe<core.undefined> { }

const undefined_: undefined_ = Object_assign(
  core.undefined,
  toString.undefined,
  JsonSchema.undefined,
  pipe(core.undefined),
)

export { symbol_ as symbol }
interface symbol_ extends
  core.symbol,
  toString.symbol,
  pipe<core.symbol> { }

const symbol_: symbol_ = Object_assign(
  core.symbol,
  toString.symbol,
  JsonSchema.symbol,
  pipe(core.symbol),
)

export { boolean_ as boolean }
interface boolean_ extends
  core.boolean,
  toString.boolean,
  JsonSchema.boolean,
  pipe<core.boolean> { }

const boolean_: boolean_ = Object_assign(
  core.boolean,
  toString.boolean,
  JsonSchema.boolean,
  pipe(core.boolean),
)

export interface integer extends
  core.integer,
  toString.integer,
  JsonSchema.integer,
  pipe<core.integer> { }

export const integer: integer = Object_assign(
  core.integer,
  toString.integer,
  JsonSchema.integer,
  pipe(core.integer),
)

export { bigint_ as bigint }
interface bigint_ extends
  core.bigint,
  toString.bigint,
  pipe<core.bigint> { }

const bigint_: bigint_ = Object_assign(
  core.bigint,
  toString.bigint,
  JsonSchema.bigint,
  pipe(core.bigint),
)

export { number_ as number }
interface number_ extends
  core.number,
  toString.number,
  JsonSchema.number,
  pipe<core.number> { }

const number_: number_ = Object_assign(
  core.number,
  toString.number,
  JsonSchema.number,
  pipe(core.number),
)

export { string_ as string }
interface string_ extends
  core.string,
  toString.string,
  JsonSchema.string,
  pipe<core.string> { }

const string_: string_ = Object_assign(
  core.string,
  toString.string,
  JsonSchema.string,
  pipe(core.string),
)

export function eq<const V extends T.Mut<V>>(value: V, options?: Options): eq<V> { return eq.def(value, options) }
export interface eq<V> extends eq.def<V> { }
export namespace eq {
  export interface def<T> extends
    core.eq.def<T>,
    toString.eq<T>,
    JsonSchema.eq<T>,
    pipe<core.eq.def<T>> { }

  export function def<T>(value: T, options?: Options): eq.def<T>
  export function def<T>(value: T, options?: Options) {
    const schema = core.eq.def(value, options);
    return Object_assign(
      schema,
      toString.eq(value),
      JsonSchema.eq(value),
      pipe(schema),
    )
  }
}

export function optional<S extends Schema>(schema: S): optional<S> { return optional.def(schema) }
export interface optional<S extends Schema> extends optional.def<S> { }
export namespace optional {
  export interface def<T> extends
    core.optional.def<T>,
    toString.optional<T>,
    JsonSchema.optional<T>,
    pipe<core.optional.def<T>> { }

  export function def<T>(x: T) {
    const schema = core.optional.def(x)
    return Object_assign(
      schema,
      toString.optional(x),
      JsonSchema.optional(x),
      pipe(schema),
      { [symbol.optional]: true },
    )
  }
}

export function array<S extends Schema>(schema: S): array<S> { return array.def(schema) }
export interface array<S extends Schema> extends array.def<S> { }
export namespace array {
  export interface def<T> extends
    core.array.def<T>,
    toString.array<T>,
    JsonSchema.array<T>,
    pipe<core.array.def<T>> { }

  export function def<T>(x: T) {
    const schema = core.array.def(x)
    return Object_assign(
      schema,
      toString.array(x),
      JsonSchema.array(x),
      pipe(schema),
    )
  }
}

export function record<S extends Schema>(schema: S): record<S> { return record.def(schema) }
export interface record<S extends Schema> extends record.def<S> { }
export namespace record {
  export interface def<T> extends
    core.record.def<T>,
    toString.record<T>,
    JsonSchema.record<T>,
    pipe<core.record.def<T>> { }

  export function def<T>(x: T) {
    const schema = core.record.def(x)
    return Object_assign(
      schema,
      toString.record(x),
      JsonSchema.record(x),
      pipe(schema),
    )
  }
}

export function union<S extends readonly Schema[]>(...schemas: S): union<S> { return union.def(schemas) }
export interface union<S extends readonly Schema[]> extends union.def<S> { }
export namespace union {
  export interface def<T> extends
    core.union.def<T>,
    toString.union<T>,
    JsonSchema.union<T>,
    pipe<core.union.def<T>> { }

  export function def<T extends readonly unknown[]>(xs: T): union.def<T>
  export function def<T extends readonly unknown[]>(xs: T): {} {
    const schema = core.union.def(xs)
    return Object_assign(
      schema,
      toString.union(xs),
      JsonSchema.union(xs),
      pipe(schema),
    )
  }
}


export function intersect<S extends readonly Schema[]>(...schemas: S): intersect<S> { return intersect.def(schemas) }
export interface intersect<S extends readonly Schema[]> extends intersect.def<S> { }
export namespace intersect {
  export interface def<T> extends
    core.intersect.def<T>,
    toString.intersect<T>,
    JsonSchema.intersect<T>,
    pipe<core.intersect.def<T>> { }

  export function def<T extends readonly unknown[]>(xs: T): intersect.def<T>
  export function def<T extends readonly unknown[]>(xs: T): {} {
    const schema = core.intersect.def(xs)
    return Object.assign(
      schema,
      toString.intersect(xs),
      JsonSchema.intersect(xs),
      pipe(schema),
    )
  }
}

export function tuple<S extends readonly Schema[]>(...schemas: tuple.validate<S>): tuple<core.tuple.from<tuple.validate<S>, S>>

export function tuple<S extends readonly Schema[]>(...args: [...schemas: tuple.validate<S>, options: Options]): tuple<core.tuple.from<tuple.validate<S>, S>>

export function tuple<S extends readonly Schema[]>(
  ...args:
    | [...S]
    | [...S, Options]
) {
  const [schemas, options] = parseArgs(getConfig().schema, args)
  return tuple.def(schemas, options)
}

export interface tuple<S extends readonly unknown[]> extends tuple.def<S> { }
export namespace tuple {
  export type validate<T extends readonly unknown[]> = ValidateTuple<T, optional<any>>
  export interface def<T> extends
    core.tuple.def<T, optional<any>>,
    toString.tuple<T>,
    JsonSchema.tuple<T>,
    pipe<core.tuple.def<T>> { }

  export function def<T extends readonly unknown[]>(xs: T, $?: Options) {
    const schema = core.tuple.def(xs, $)
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
  return object_.def(schemas, options)
}

interface object_<S extends { [x: string]: unknown }> extends object_.def<S> { }
namespace object_ {
  export interface def<T> extends
    core.object.def<T>,
    toString.object<T>,
    JsonSchema.object<T>,
    pipe<core.object.def<T>> { }

  export function def<T extends { [x: string]: unknown }>(xs: T, $?: Options): object_.def<T> {
    const schema = core.object.def(xs, $)
    return Object_assign(
      schema,
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
  integer,
  number_,
  string_,
]

export const leafTags = leaves.map((leaf) => leaf.tag)

tuple(string_, optional(number_))
object_({ abc: string_, def: optional(number_) })
