import type {
  SchemaOptions as Options,
  TypeError,
  Unknown
} from '@traversable/registry'

import {
  Array_isArray,
  bindUserExtensions,
  getConfig,
  has,
  _isPredicate,
  Object_assign,
  parseArgs,
  symbol,
  tuple as tuple$,
  URI,
} from '@traversable/registry'

import type {
  Entry,
  FirstOptionalItem,
  invalid,
  Schema,
  SchemaLike,
  TupleType,
  ValidateTuple
} from '@traversable/schema-core/namespace'

import type { optional } from '../optional/core.js'

export { tuple }

function tuple<S extends readonly SchemaLike[], T extends { [I in keyof S]: Entry<S[I]> }>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, T>>
function tuple<S extends readonly Schema[]>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, S>>
function tuple<S extends readonly SchemaLike[], T extends { [I in keyof S]: Entry<S[I]> }>(...args: [...schemas: tuple.validate<S>, options: Options]): tuple<tuple.from<tuple.validate<S>, T>>
function tuple<S extends readonly Schema[]>(...args: [...schemas: tuple.validate<S>, options: Options]): tuple<tuple.from<tuple.validate<S>, S>>
function tuple<S extends readonly SchemaLike[], T extends { [I in keyof S]: Entry<S[I]> }>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, T>>
function tuple<S extends readonly Schema[]>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, S>>
function tuple(...args: [...SchemaLike[]] | [...SchemaLike[], Options]) {
  return tuple.def(...parseArgs(getConfig().schema, args))
}

interface tuple<S> extends tuple.core<S> {
  //<%= Types %>
}

namespace tuple {
  export let userDefinitions: Record<string, any> = {
    //<%= Definitions %>
  } as tuple<unknown>
  export function def<T extends readonly unknown[]>(xs: readonly [...T], $?: Options, opt_?: number): tuple<T>
  /* v8 ignore next 1 */
  export function def(xs: readonly unknown[], $: Options = getConfig().schema, opt_?: number): {} {
    let userExtensions: Record<string, any> = {
      //<%= Extensions %>
    }
    const opt = opt_ || xs.findIndex(has(symbol.optional))
    const options = {
      ...$, minLength: $.optionalTreatment === 'treatUndefinedAndOptionalAsTheSame' ? -1 : xs.findIndex(has(symbol.optional))
    } satisfies tuple.InternalOptions
    const predicate = !xs.every(_isPredicate) ? Array_isArray : tuple$(xs, options)
    function TupleSchema(src: unknown) { return predicate(src) }
    TupleSchema.tag = URI.tuple
    TupleSchema.def = xs
    TupleSchema.opt = opt
    Object_assign(TupleSchema, tuple.userDefinitions)
    return Object_assign(TupleSchema, bindUserExtensions(TupleSchema, userExtensions))
  }
}

declare namespace tuple {
  interface core<S> {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.tuple
    _type: TupleType<S>
    opt: FirstOptionalItem<S>
    def: S
  }
  type type<S, T = TupleType<S>> = never | T
  type InternalOptions = { minLength?: number }
  type validate<T extends readonly unknown[]> = ValidateTuple<T, optional<any>>

  type from<V extends readonly unknown[], T extends readonly unknown[]>
    = TypeError extends V[number] ? { [I in keyof V]: V[I] extends TypeError ? invalid<Extract<V[I], TypeError>> : V[I] } : T
}
