import type {
  SchemaOptions as Options,
  TypeError,
} from '@traversable/registry'

import {
  getConfig,
  Object_assign,
  parseArgs,
  replaceBooleanConstructor,
  URI
} from '@traversable/registry'

import type {
  Label,
  ValidateTuple,
} from '@traversable/schema'
import {
  t,
  Predicate,
  __within as within,
} from '@traversable/schema'


export type FirstOptionalItem<S, Offset extends 1[] = []>
  = S extends readonly [infer H, ...infer T] ? t.optional<any> extends H ? Offset['length'] : FirstOptionalItem<T, [...Offset, 1]> : never
  ;

export type TupleType<T, Out extends readonly unknown[] = []> = never
  | t.optional<any> extends T[number & keyof T]
  ? T extends readonly [infer Head, ...infer Tail]
  ? [Head] extends [t.optional<any>] ? Label<
    { [ix in keyof Out]: Out[ix]['_type' & keyof Out[ix]] },
    { [ix in keyof T]: T[ix]['_type' & keyof T[ix]] }
  >
  : TupleType<Tail, [...Out, Head]>
  : never
  : { [ix in keyof T]: T[ix]['_type' & keyof T[ix]] }
  ;

const replaceBoolean = replaceBooleanConstructor(t.nonnullable)


export { tuple }
function tuple<S extends readonly t.Schema[]>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, S>>
function tuple<S extends readonly t.Predicate[], T extends { [I in keyof S]: t.Entry<S[I]> }>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, T>>
function tuple<S extends readonly t.Schema[]>(...args: [...schemas: tuple.validate<S>, options: Options]): tuple<tuple.from<tuple.validate<S>, S>>
function tuple<S extends readonly t.Predicate[], T extends { [I in keyof S]: t.Entry<S[I]> }>(...args: [...schemas: tuple.validate<S>, options: Options]): tuple<tuple.from<tuple.validate<S>, T>>
function tuple<S extends readonly t.Schema[]>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, S>>
function tuple<S extends readonly t.Predicate[], T extends { [I in keyof S]: t.Entry<S[I]> }>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, T>>
function tuple<S extends readonly t.Predicate[]>(...args: | [...S] | [...S, Options]) { return tuple.def(...parseArgs(getConfig().schema, args)) }
interface tuple<S> { (u: unknown): u is this['_type'], tag: URI.tuple, def: S, _type: TupleType<S>, opt: FirstOptionalItem<S> }
namespace tuple {
  export let prototype = { tag: URI.tuple } as tuple<unknown>
  export type type<S, T = TupleType<S>> = never | T
  export function def<T extends readonly unknown[]>(xs: readonly [...T], $?: Options, opt_?: number): tuple<T>
  /* v8 ignore next 1 */
  export function def<T extends readonly unknown[]>(xs: readonly [...T], $: Options = getConfig().schema, opt_?: number) {
    const opt = opt_ || xs.findIndex(t.optional.is)
    const options = {
      ...$, minLength: $.optionalTreatment === 'treatUndefinedAndOptionalAsTheSame' ? -1 : xs.findIndex(t.optional.is)
    } satisfies tuple.InternalOptions
    const tupleGuard = xs.every(t.isPredicate)
      ? Predicate.tuple$(options)(xs.map(replaceBoolean<any>))
      : Predicate.is.anyArray
    function TupleSchema(src: unknown) { return tupleGuard(src) }
    TupleSchema.def = xs
    TupleSchema.opt = opt
    return Object_assign(TupleSchema, tuple.prototype)
  }
}
declare namespace tuple {
  type validate<T extends readonly unknown[]> = ValidateTuple<T, t.optional<any>>
  type from<V extends readonly unknown[], T extends readonly unknown[]>
    = TypeError extends V[number] ? { [I in keyof V]: V[I] extends TypeError ? t.invalid<Extract<V[I], TypeError>> : V[I] } : T
  type InternalOptions = { minLength?: number }
}
