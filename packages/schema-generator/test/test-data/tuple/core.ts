import type {
  SchemaOptions as Options,
  TypeError,
} from '@traversable/registry'

import {
  bindUserDefinitions,
  getConfig,
  Object_assign,
  parseArgs,
  replaceBooleanConstructor,
  URI
} from '@traversable/registry'

import type {
  FirstOptionalItem,
  TupleType,
  ValidateTuple,
} from '@traversable/schema'
import {
  t,
  Predicate,
} from '@traversable/schema'


const replaceBoolean = replaceBooleanConstructor(t.nonnullable)

interface tuple<S> extends tuple.core<S> {
  //<%= types %>
}

export { tuple }
function tuple<S extends readonly t.Schema[]>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, S>>
function tuple<S extends readonly t.Predicate[], T extends { [I in keyof S]: t.Entry<S[I]> }>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, T>>
function tuple<S extends readonly t.Schema[]>(...args: [...schemas: tuple.validate<S>, options: Options]): tuple<tuple.from<tuple.validate<S>, S>>
function tuple<S extends readonly t.Predicate[], T extends { [I in keyof S]: t.Entry<S[I]> }>(...args: [...schemas: tuple.validate<S>, options: Options]): tuple<tuple.from<tuple.validate<S>, T>>
function tuple<S extends readonly t.Schema[]>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, S>>
function tuple<S extends readonly t.Predicate[], T extends { [I in keyof S]: t.Entry<S[I]> }>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, T>>
function tuple<S extends readonly t.Predicate[]>(...args: | [...S] | [...S, Options]) { return tuple.def(...parseArgs(getConfig().schema, args)) }
namespace tuple {
  export let proto = {} as tuple<unknown>
  export type type<S, T = TupleType<S>> = never | T
  export function def<T extends readonly unknown[]>(xs: readonly [...T], $?: Options, opt_?: number): tuple<T>
  export function def(xs: readonly unknown[], $: Options = getConfig().schema, opt_?: number): {} {
    let userDefinitions: Record<string, any> = {
      //<%= terms %>
    }
    const opt = opt_ || xs.findIndex(t.optional.is)
    const options = {
      ...$, minLength: $.optionalTreatment === 'treatUndefinedAndOptionalAsTheSame' ? -1 : xs.findIndex(t.optional.is)
    } satisfies tuple.InternalOptions
    const tupleGuard = xs.every(t.isPredicate)
      ? Predicate.is.tuple(options)(xs.map(replaceBoolean))
      : Predicate.is.anyArray
    function TupleSchema(src: unknown) { return tupleGuard(src) }
    TupleSchema.tag = URI.tuple
    TupleSchema.def = xs
    TupleSchema.opt = opt
    Object_assign(TupleSchema, tuple.proto)
    return Object_assign(TupleSchema, bindUserDefinitions(TupleSchema, userDefinitions))
  }
}
declare namespace tuple {
  interface core<S> {
    (u: unknown): u is this['_type']
    tag: URI.tuple
    def: S
    _type: TupleType<S>
    opt: FirstOptionalItem<S>
  }
  type validate<T extends readonly unknown[]> = ValidateTuple<T, t.optional<any>>
  type from<V extends readonly unknown[], T extends readonly unknown[]>
    = TypeError extends V[number] ? { [I in keyof V]: V[I] extends TypeError ? t.invalid<Extract<V[I], TypeError>> : V[I] } : T
  type InternalOptions = { minLength?: number }
}
