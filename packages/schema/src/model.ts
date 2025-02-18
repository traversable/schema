import type { Guard, HKT, Kind, TypePredicate } from './types.js'
import type * as T from './types.js'
import { URI } from './uri.js'
import * as P from './predicates.js'
import { AST } from './ast.js'
import { getConfig } from './config.js'

/** @internal */
const Object_assign = globalThis.Object.assign

/** @internal */
const isPredicate
  : <S, T extends S>(u: unknown) => u is (x: S) => x is T
  = P.function as never

export type Source<T> = T extends (_: infer I) => unknown ? I : unknown
export type Target<T> = T extends (_: never) => infer O ? O : never
export type Param<T> = T extends (_: infer I) => unknown ? I : unknown
export type Entry<S>
  = S extends { def: unknown } ? S
  : S extends Guard<infer T> ? t.Inline<T>
  : S extends () => true ? t.Unknown
  : S extends () => false ? t.Never
  : S

export type intersect_<Todo, Out = unknown>
  = Todo extends readonly [infer H, ...infer T]
  ? intersect_<T, Out & H['_type' & keyof H]>
  : Out

export type Predicate = T.Predicate | Schema

export interface Unspecified extends Schema.Any { }

export interface Schema<Fn extends Schema.Any = Unspecified>
  extends TypePredicate<Source<Fn>, Fn['_type']> {
  tag?: Fn['tag']
  def?: Fn['def']
  _type?: Fn['_type']
}

export declare namespace Schema {
  interface Any { (u: unknown): u is unknown; tag?: string, def?: unknown, _type?: unknown }
  type Options = {
    optionalTreatment?: OptionalTreatment
    treatArraysAsObjects?: boolean
  }
  type OptionalTreatment = never
    | 'exactOptional'
    | 'presentButUndefinedIsOK'
    | 'treatUndefinedAndOptionalAsTheSame'
    ;
}

export declare namespace Type {
  interface Array extends HKT { [-1]: this[0]['_type' & keyof this[0]][] }
  interface Record extends HKT { [-1]: globalThis.Record<string, this[0]['_type' & keyof this[0]]> }
  interface Optional extends HKT { [-1]: undefined | this[0]['_type' & keyof this[0]] }
  interface Object extends HKT { [-1]: t.Object.Type<this[0]> }
  interface Tuple extends HKT { [-1]: TupleType<this[0]> }
  interface Intersect extends HKT { [-1]: intersect_<this[0]> }
  interface Union extends HKT { [-1]: Unify<this[0]> }
  interface Const<T = unknown> extends HKT { [-1]: T }
  type Map<T> = never | { -readonly [K in keyof T]: Entry<T[K]['_type' & keyof T[K]]> }
  type Unify<T> = never | T[number & keyof T]['_type' & keyof T[number & keyof T]]

  type TupleType<T, Out extends readonly unknown[] = []>
    = t.Optional<any> extends T[number & keyof T]
    ? T extends readonly [infer Head, ...infer Tail]
    ? [Head] extends [t.Optional<any>] ? [
      ...req: { [ix in keyof Out]: Out[ix]['_type' & keyof Out[ix]] },
      ...opt: T.Label<{ [ix in keyof T]: T[ix]['_type' & keyof T[ix]] }>
    ]
    : TupleType<Tail, [...Out, Head]>
    : never
    : { [ix in keyof T]: T[ix]['_type' & keyof T[ix]] }
    ;
}

export type typeOf<
  T extends { _type?: unknown },
  _ extends
  | T['_type']
  = T['_type']
> = never | _

export declare namespace t {
  type F<Rec>
    = t.Leaf
    | t.Array.def<Rec>
    | t.Optional.def<Rec>
    | t.Record.def<Rec>
    | t.Object.def<{ [x: string]: Rec }>
    | t.Tuple.def<readonly Rec[]>
    | t.Union.def<readonly Rec[]>
    | t.Intersect.def<readonly Rec[]>
    ;

  interface Free extends HKT { [-1]: t.F<this[0]> }

  type Fixpoint
    = t.Leaf
    | t.Array.def<Fixpoint, Type.Const>
    | t.Record.def<Fixpoint, Type.Const>
    | t.Optional.def<Fixpoint, Type.Const>
    | t.Object.def<{ [x: string]: Fixpoint }, Type.Const>
    | t.Tuple.def<readonly Fixpoint[], Type.Const>
    | t.Union.def<readonly Fixpoint[], Type.Const>
    | t.Intersect.def<readonly Fixpoint[], Type.Const>
    ;
}

export namespace t {
  export interface Inline<T> { _type: T }
  export interface InvalidSchema<_Err> extends T.TypeError<''>, t.Never { }
  export interface Never extends Guard<never>, AST.never { _type: never }
  export const Never: t.Never = Object_assign((u: unknown) => P.never(u), AST.never as t.Never)
  export interface Unknown extends Guard<unknown>, AST.unknown { _type: unknown }
  export const Unknown: t.Unknown = Object_assign((u: unknown): u is unknown => P.any(u), AST.unknown as t.Unknown)
  export interface Any extends Guard<any>, AST.any { _type: any }
  export const Any: t.Any = Object_assign((u: unknown): u is any => P.any(u), AST.any as t.Any)
  export interface Void extends Guard<void>, AST.void { _type: void }
  export const Void: t.Void = Object_assign((u: unknown) => P.undefined(u), AST.void as t.Void)
  export interface Null extends Guard<null>, AST.null { _type: null }
  export const Null: t.Null = Object_assign((u: unknown) => P.null(u), AST.null as t.Null)
  export interface Undefined extends Guard<undefined>, AST.undefined { _type: undefined }
  export const Undefined: t.Undefined = Object_assign((u: unknown) => P.undefined(u), AST.undefined as t.Undefined)
  export interface BigInt extends Guard<bigint>, AST.bigint { _type: bigint }
  export const BigInt: t.BigInt = Object_assign((u: unknown) => P.bigint(u), AST.bigint as t.BigInt)
  export interface Symbol extends Guard<symbol>, AST.symbol { _type: symbol }
  export const Symbol: t.Symbol = Object_assign((u: unknown) => P.symbol(u), AST.symbol as t.Symbol)
  export interface Boolean extends Guard<boolean>, AST.boolean { _type: boolean }
  export const Boolean: t.Boolean = Object_assign((u: unknown) => P.boolean(u), AST.boolean as t.Boolean)
  export interface Number extends Guard<number>, AST.number { _type: number }
  export const Number: t.Number = Object_assign((u: unknown) => P.number(u), AST.number as t.Number)
  export interface String extends Guard<string>, AST.string { _type: string }
  export const String: t.String = Object_assign((u: unknown) => P.string(u), AST.string as t.String)

  export type Leaf = typeof Leaves[number]
  export const Leaves = [
    t.Unknown,
    t.Never,
    t.Any,
    t.Void,
    t.Undefined,
    t.Null,
    t.Symbol,
    t.BigInt,
    t.Boolean,
    t.Number,
    t.String,
  ] as const satisfies any[]

  export const leafTags = Leaves.map((l) => l.tag) satisfies typeof AST.leafTags

  export const isLeaf = (u: unknown): u is Leaf =>
    P.function(u) &&
    'tag' in u &&
    typeof u.tag === 'string' &&
    (<string[]>leafTags).includes(u.tag)

  export function Array<S extends Schema>(typeguard: S): t.Array<S>
  export function Array(p: Schema) { return t.Array.fix(p) }
  export interface Array<S extends Schema = Unspecified> extends t.Array.def<S> { }
  export namespace Array {
    export interface def<T, F extends HKT = Type.Array> extends AST.array<T> {
      _type: Kind<F, T>
      (u: unknown): u is this['_type']
    }
    export function fix<F>(p: F): t.Array.def<F>
    export function fix<F>(p: F) {
      return Object_assign(
        (src: unknown) => isPredicate(p) ? P.array$(p)(src) : p,
        AST.array(p)
      )
    }
  }

  export function Record<S extends Schema>(p: S): t.Record<S>
  export function Record(p: Schema) { return t.Record.fix(p) }
  export interface Record<S extends Schema.Any = Unspecified> extends t.Record.def<S> { }
  export namespace Record {
    export interface def<T, F extends HKT = Type.Record> extends AST.record<T> {
      _type: Kind<F, T>
      (u: unknown): u is this['_type']
    }
    export function fix<F>(p: F): t.Record.def<F>
    export function fix<F>(p: F) {
      return Object_assign(
        (src: unknown) => isPredicate(p) ? P.record$(p)(src) : p,
        AST.record(p),
      )
    }
  }

  export function Union<S extends readonly Schema[]>(...guards: S): t.Union<S>
  export function Union(...ps: readonly Schema[]) { return t.Union.fix(ps) }
  export interface Union<S extends readonly Schema[] = readonly Schema[]> extends Union.def<S> { }
  export namespace Union {
    export interface def<T, F extends HKT = Type.Union> extends AST.union<T> {
      _type: Kind<F, T>
      (u: unknown): u is this['_type']
    }
    export function fix<T extends readonly unknown[]>(ps: T): t.Union.def<T>
    export function fix<T extends readonly unknown[]>(ps: T): {} {
      return Object_assign(
        (src: unknown) => ps.every(isPredicate) ? P.union$(...ps)(src) : ps,
        AST.union(ps)
      )
    }
  }

  export function Intersect<S extends readonly Schema[]>(...guards: S): t.Intersect<S>
  export function Intersect(...ps: readonly Schema[]) { return t.Intersect.fix(ps) }
  export interface Intersect<S extends readonly Schema[] = readonly Schema[]> extends Intersect.def<S> { }
  export namespace Intersect {
    export interface def<
      T,
      F extends HKT = Type.Intersect
    > extends AST.intersect<T> {
      _type: Kind<F, T>
      (u: unknown): u is this['_type']
    }
    //
    export function fix<T extends readonly unknown[]>(ps: T): t.Intersect.def<T>
    export function fix<T extends readonly unknown[]>(ps: T): {} {
      return Object_assign(
        (src: unknown) => ps.every(isPredicate) ? P.intersect$(...ps)(src) : ps,
        AST.intersect(ps)
      )
    }
  }

  export function Optional<S extends Schema>(typeguard: S): t.Optional<S>
  export function Optional(p: Schema) { return Optional.fix(p) }
  export interface Optional<S extends Schema = Unspecified> extends t.Optional.def<S> { }
  export namespace Optional {
    export interface def<T, F extends HKT = Type.Optional> extends
      AST.optional<T> {
      _type: Kind<F, T>
      (u: unknown): u is this['_type']
    }
    export function fix<F>(p: F): t.Optional.def<F>
    export function fix<F>(p: F) {
      return Object_assign(
        (src: unknown) => isPredicate(p) ? P.optional$(p)(src) : p,
        AST.optional(p)
      )
    }
    export const is = <S extends Schema>(u: unknown): u is t.Optional<S> =>
      P.function(u) && P.has('tag', P.literally(URI.optional))(u)
  }
  export declare namespace Optional {
    interface Codec<
      S extends Schema = Unspecified,
      T extends Schema = Unspecified
    > extends TypePredicate<typeOf<S>, undefined | typeOf<T>> {
      decode(source: typeOf<S>): undefined | typeOf<T>
      encode(target: undefined | typeOf<T>): typeOf<S>
    }
  }

  export function Object<S extends { [x: string]: Schema }>(shape: S, options?: Schema.Options): t.Object<S>
  export function Object(ps: { [x: string]: Predicate }, $?: Schema.Options) { return t.Object.fix(ps, $) }
  export interface Object<
    S extends
    | { [x: string]: Schema }
    = { [x: string]: Schema }
  > extends t.Object.def<S> { }

  export namespace Object {
    export interface def<T, F extends HKT = Type.Object> extends AST.object<T> {
      _type: Kind<F, T>
      (u: unknown): u is this['_type']
    }
    export type Optionals<S, K extends keyof S = keyof S> =
      K extends K ? S[K] extends t.Optional<any> ? K : never : never
    export type Type<
      F,
      Opt extends Object.Optionals<F> = Object.Optionals<F>,
      Req extends Exclude<keyof F, Opt> = Exclude<keyof F, Opt>
    > = T.Force<
      & { [K in Opt]+?: F[K]['_type' & keyof F[K]] }
      & { [K in Req]-?: F[K]['_type' & keyof F[K]] }
    >
    export function fix<F extends { [x: string]: unknown }>(ps: F, $?: Schema.Options): t.Object.def<F>
    export function fix<F extends { [x: string]: unknown }>(ps: F, $?: Schema.Options): {} {
      return Object_assign(
        (src: unknown) => P.record$(isPredicate)(ps) ? P.object$(ps, { ...getConfig().schema, ...$ })(src) : ps,
        AST.object(ps),
      )
    }
  }

  export function Tuple<
    S extends readonly Schema[],
    T extends { -readonly [Ix in keyof S]: Entry<S[Ix]> }
  >(...guards: T.ValidateTuple<S>): Tuple.from<typeof guards, T>
  //
  export function Tuple<
    S extends readonly Schema[],
    T extends { -readonly [Ix in keyof S]: Entry<S[Ix]> },
    V extends T.ValidateTuple<S>
  >(...args: [...guards: T.ValidateTuple<S>, options?: Schema.Options]): Tuple.from<T.ValidateTuple<S>, T>
  //
  export function Tuple(
    ...args:
      | [...guard: readonly Predicate[]]
      | [...guard: readonly Predicate[], $: Schema.Options]
  ): {} {
    const [guards, $] = P.parseArgs(getConfig().schema, args)
    return t.Tuple.fix(guards, $)
  }

  export interface Tuple<S extends readonly unknown[] = readonly unknown[]> extends Tuple.def<S> { }
  export namespace Tuple {
    export interface def<T, F extends HKT = Type.Tuple> extends AST.tuple<T> {
      _type: Kind<F, T>
      (u: unknown): u is this['_type']
    }

    export function fix<F extends readonly unknown[]>(ps: readonly [...F], $?: Schema.Options): t.Tuple.def<F>
    export function fix<F extends readonly unknown[]>(ps: readonly [...F], $: Schema.Options = getConfig().schema): {} {
      const options = {
        ...$, minLength: $.optionalTreatment === 'treatUndefinedAndOptionalAsTheSame' ? -1
          : ps.findIndex(t.Optional.is)
      } satisfies InternalOptions
      return Object_assign(
        (src: unknown) => ps.every(isPredicate) ? P.tuple$(options)(...ps)(src) : ps,
        AST.tuple(ps)
      )
    }
  }
  export declare namespace Tuple {
    type InternalOptions = { minLength?: number }
    type from<V extends readonly unknown[], T extends readonly unknown[]>
      = T.TypeError extends V[number] ? InvalidSchema<Extract<V[number], T.TypeError>>
      : t.Tuple<T>
      ;
  }
  export const is = {
    never: (u: unknown): u is t.Never => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.never,
    any: (u: unknown): u is t.Any => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.any,
    void: (u: unknown): u is t.Void => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.void,
    unknown: (u: unknown): u is t.Unknown => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.unknown,
    null: (u: unknown): u is t.Null => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.null,
    undefined: (u: unknown): u is t.Undefined => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.undefined,
    symbol: (u: unknown): u is t.Symbol => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.symbol_,
    boolean: (u: unknown): u is t.Boolean => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.boolean,
    bigint: (u: unknown): u is t.BigInt => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.bigint,
    number: (u: unknown): u is t.Number => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.number,
    string: (u: unknown): u is t.String => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.string,
    array: <S>(u: S): u is T.Conform<S, t.Array<any>, t.Array> => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.array,
    record: <S>(u: S): u is T.Conform<S, t.Record<any>, t.Record> => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.record,
    optional: <S>(u: S): u is T.Conform<S, t.Optional<any>, t.Optional> => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.optional,
    union: <S>(u: unknown): u is T.Conform<S, t.Union<any>, t.Union> => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.union,
    intersect: <S>(u: unknown): u is T.Conform<S, t.Intersect<any>, t.Intersect> => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.intersect,
    tuple: <S>(u: S): u is T.Conform<S, t.Tuple<any>, t.Tuple> => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.tuple,
    object: <S>(u: unknown): u is T.Conform<S, t.Object<any>, t.Object> => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.object,
  } as const
}
