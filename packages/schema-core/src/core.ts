import type { Const, Force, HKT, Identity, Kind, Mut, Mutable, TypeError } from '@traversable/registry'
import { URI } from '@traversable/registry'
import { Json } from '@traversable/json'

import type { SchemaOptions as Options } from './options.js'
import type { Guard, Label, Predicate as AnyPredicate, TypePredicate, ValidateTuple } from './types.js'
import * as AST from './ast.js'
import { deep as deepEquals, lax as laxEquals } from './equals.js'
import { getConfig } from './config.js'
import { is as Combinator } from './predicate.js'
import { parseArgs } from './parseArgs.js'

/** @internal */
type BoolLookup = {
  true: t.Top
  false: t.Bottom
  boolean: t.Unknown
}

/** @internal */
const Object_assign = globalThis.Object.assign

/** @internal */
const isPredicate
  : <S, T extends S>(u: unknown) => u is { (): boolean; (x: S): x is T }
  = (u: unknown): u is never => typeof u === 'function'

export type Source<T> = T extends (_: infer I) => unknown ? I : unknown
export type Entry<S>
  = S extends { def: unknown } ? S
  : S extends Guard<infer T> ? t.Inline<T>
  : S extends (() => infer _ extends boolean)
  ? BoolLookup[`${_}`]
  : S

export declare namespace Type {
  interface Array extends HKT { [-1]: this[0]['_type' & keyof this[0]][] }
  interface ReadonlyArray extends HKT { [-1]: readonly this[0]['_type' & keyof this[0]][] }
  interface Record extends HKT { [-1]: globalThis.Record<string, this[0]['_type' & keyof this[0]]> }
  interface Optional extends HKT { [-1]: undefined | this[0]['_type' & keyof this[0]] }
  interface Object extends HKT { [-1]: Properties<this[0]> }
  interface Tuple<LowerBound = t.Optional<any>> extends HKT { [-1]: Items<this[0], LowerBound> }
  interface Intersect extends HKT { [-1]: Intersection<this[0]> }
  interface Union extends HKT { [-1]: Unify<this[0]> }
  /** @internal */
  type Unify<T> = never | T[number & keyof T]['_type' & keyof T[number & keyof T]]
  /** @internal */
  type Intersection<Todo, Out = unknown>
    = Todo extends readonly [infer H, ...infer T]
    ? Intersection<T, Out & H['_type' & keyof H]>
    : Out
  /** @internal */
  type Optionals<S, K extends keyof S = keyof S> =
    string extends K ? string : K extends K ? S[K] extends t.Bottom | t.Optional<any> ? K : never : never
  /** @internal */
  type Properties<
    F,
    Opt extends Optionals<F> = Optionals<F>,
    Req extends globalThis.Exclude<keyof F, Opt> = globalThis.Exclude<keyof F, Opt>
  > = Force<
    & { [K in Req]-?: F[K]['_type' & keyof F[K]] }
    & { [K in Opt]+?: F[K]['_type' & keyof F[K]] }
  >
  /** @internal */
  type Items<T, LowerBound = t.Optional<any>, Out extends readonly unknown[] = []>
    = LowerBound extends T[number & keyof T]
    ? T extends readonly [infer Head, ...infer Tail]
    ? [Head] extends [LowerBound] ? Label<
      { [ix in keyof Out]: Out[ix]['_type' & keyof Out[ix]] },
      { [ix in keyof T]: T[ix]['_type' & keyof T[ix]] }
    >
    : Items<Tail, LowerBound, [...Out, Head]>
    : never
    : { [ix in keyof T]: T[ix]['_type' & keyof T[ix]] }
}

export type Predicate = AnyPredicate | Schema

export type typeOf<
  T extends { _type?: unknown },
  _ extends
  | T['_type']
  = T['_type']
> = never | _

export interface Unspecified extends AnySchema { }
export interface AnySchema {
  (u: unknown): u is unknown
  tag?: string
  def?: unknown
  _type?: unknown
}

export interface Schema<Fn extends AnySchema = Unspecified>
  extends TypePredicate<Source<Fn>, Fn['_type']> {
  tag?: Fn['tag']
  def?: Fn['def']
  _type?: Fn['_type']
}

export declare namespace t {
  interface Free extends HKT { [-1]: t.F<this[0]> }
  type Fixpoint
    = t.Leaf
    | t.Eq.def<Json, Const>
    | t.Array.def<Fixpoint, Const>
    | t.Record.def<Fixpoint, Const>
    | t.Optional.def<Fixpoint, Const>
    | t.Object.def<{ [x: string]: Fixpoint }, Const>
    | t.Tuple.def<readonly Fixpoint[], t.Optional<any>, Const>
    | t.Union.def<readonly Fixpoint[], Const>
    | t.Intersect.def<readonly Fixpoint[], Const>
    ;
  type F<_>
    = t.Leaf
    | t.Eq.def<_>
    | t.Array.def<_>
    | t.Optional.def<_>
    | t.Record.def<_>
    | t.Object.def<{ [x: string]: _ }>
    | t.Tuple.def<readonly _[]>
    | t.Union.def<readonly _[]>
    | t.Intersect.def<readonly _[]>
    ;
}

export declare namespace t {
  type _ = unknown
  interface Inline<T> extends Guard<T> { readonly _type: T, tag: URI.inline }
  interface Top { readonly _type: unknown, tag: URI.top, }
  interface Bottom { readonly _type: never, tag: URI.bottom, }
  interface InvalidSchema<_Err> extends TypeError<''>, t.Never { }
  interface Never extends Guard<never>, AST.never { readonly _type: never }
  interface Any extends Guard<any>, AST.any { readonly _type: any }
  interface Unknown extends Guard<_>, AST.unknown { readonly _type: unknown }
  interface Void extends Guard<void>, AST.void { readonly _type: void }
  interface Null extends Guard<null>, AST.null { readonly _type: null }
  interface Undefined extends Guard<undefined>, AST.undefined { readonly _type: undefined }
  interface BigInt extends Guard<bigint>, AST.bigint { readonly _type: bigint }
  interface Symbol extends Guard<symbol>, AST.symbol { readonly _type: symbol }
  interface Boolean extends Guard<boolean>, AST.boolean { readonly _type: boolean }
  interface Integer extends Guard<number>, AST.integer { readonly _type: number }
  interface Number extends Guard<number>, AST.number { readonly _type: number }
  interface String extends Guard<string>, AST.string { readonly _type: string }
}

export namespace t {
  export const Never: t.Never = Object_assign((_: _): _ is never => false, <t.Never>AST.never)
  export const Any: t.Any = Object_assign((_: _): _ is any => true, <t.Any>AST.any)
  export const Unknown: t.Unknown = Object_assign((_: _): _ is unknown => true, <t.Unknown>AST.unknown)
  export const Void: t.Void = Object_assign((_: _): _ is void => _ === void 0, <t.Void>AST.void)
  export const Null: t.Null = Object_assign((_: _) => _ === null, <t.Null>AST.null)
  export const Undefined: t.Undefined = Object_assign((_: _) => _ === void 0, <t.Undefined>AST.undefined)
  export const BigInt: t.BigInt = Object_assign((_: _) => typeof _ === 'bigint', <t.BigInt>AST.bigint)
  export const Symbol: t.Symbol = Object_assign((_: _) => typeof _ === 'symbol', <t.Symbol>AST.symbol)
  export const Boolean: t.Boolean = Object_assign((_: _) => typeof _ === 'boolean', <t.Boolean>AST.boolean)
  export const Integer: t.Integer = Object_assign(globalThis.Number.isInteger, <t.Integer>AST.integer)
  export const Number: t.Number = Object_assign((_: _) => typeof _ === 'number', <t.Number>AST.number)
  export const String: t.String = Object_assign((_: _) => typeof _ === 'string', <t.String>AST.string)
  export function Inline<S>(guard: Guard<S>): t.Inline<S>
  export function Inline<P extends AnyPredicate>(guard: P): t.Inline<Entry<P>>
  export function Inline<S>(guard: (Guard<S> | AnyPredicate<S>) & { tag?: URI.inline }) {
    guard.tag = URI.inline
    return guard
  }

  export type Leaf = typeof Leaves[number]
  export const Leaves = [
    t.Unknown, t.Never, t.Any, t.Void, t.Undefined, t.Null, t.Symbol, t.BigInt, t.Boolean, t.Integer, t.Number, t.String
  ] as const satisfies any[]
  export const leafTags = Leaves.map((_) => _.tag) satisfies typeof AST.leafTags
  export const isLeaf = (u: unknown): u is Leaf =>
    typeof u === 'function' && 'tag' in u && typeof u.tag === 'string' && (<string[]>leafTags).includes(u.tag)

  export interface Eq<S = Unspecified> extends t.Eq.def<S> { }
  export function Eq<const V>(equalsFn: (value: V) => boolean, options?: Options): t.Eq<V>
  export function Eq<V extends Mut<V>>(value: V, options?: Options): t.Eq<Mutable<V>>
  export function Eq<const V>(value: V, options?: Options): t.Eq<Mutable<V>>
  export function Eq(v: unknown, $: Options = getConfig().schema) { return t.Eq.def(v, $) }
  export namespace Eq {
    export interface def<T, F extends HKT = Identity> extends AST.eq<T> {
      readonly _type: Kind<F, T>
      (u: unknown): u is this['_type']
    }
    export function def<const T>(x: T, $?: Options): t.Eq.def<T>
    export function def(x: unknown, $: Options = getConfig().schema) {
      const equal = $.optionalTreatment === 'treatUndefinedAndOptionalAsTheSame' ? laxEquals : deepEquals
      return Object_assign((src: unknown) => typeof x === 'function' ? x(src) : equal(src, x), AST.eq(x))
    }
  }

  export function Array<S extends Schema>(schema: S, readonly: 'readonly'): t.ReadonlyArray<S>
  export function Array<S extends Schema>(schema: S): t.Array<S>
  export function Array(x: Schema) { return t.Array.def(x) }
  export interface Array<S extends Schema = Unspecified> extends t.Array.def<S> { }
  export namespace Array {
    export interface def<T, F extends HKT = Type.Array> extends AST.array<T> {
      readonly _type: Kind<F, T>
      (u: unknown): u is this['_type']
    }
    export function def<T>(x: T): t.Array.def<T>
    export function def(x: unknown): {} {
      return Object_assign((src: unknown) => isPredicate(x) ? Combinator.array(x)(src) : x, AST.array(x))
    }
  }

  export interface ReadonlyArray<S extends Schema = Unspecified> extends t.Array.def<S, Type.ReadonlyArray> { }

  export function Record<S extends Schema>(schema: S): t.Record<S>
  export function Record(x: Schema) { return t.Record.def(x) }
  export interface Record<S extends AnySchema = Unspecified> extends t.Record.def<S> { }
  export namespace Record {
    export interface def<T, F extends HKT = Type.Record> extends AST.record<T> {
      readonly _type: Kind<F, T>
      (u: unknown): u is this['_type']
    }
    export function def<T>(x: T): t.Record.def<T>
    export function def(x: unknown): {} {
      return Object_assign((src: unknown) => isPredicate(x) ? Combinator.record(x)(src) : x, AST.record(x))
    }
  }

  export function Union<S extends readonly Schema[]>(...schemas: S): t.Union<S>
  export function Union(...xs: Schema[]) { return t.Union.def(xs) }
  export interface Union<S extends readonly Schema[] = Schema[]> extends Union.def<S> { }
  export namespace Union {
    export interface def<T, F extends HKT = Type.Union> extends AST.union<T> {
      readonly _type: Kind<F, T>
      (u: unknown): u is this['_type']
    }
    export function def<T extends readonly unknown[]>(xs: T): t.Union.def<T>
    export function def(xs: unknown[]) {
      return Object_assign(
        (src: unknown) => xs.every(isPredicate) ? Combinator.union(...xs)(src) : xs,
        AST.union(xs)
      )
    }
  }

  export function Intersect<S extends readonly Schema[]>(...schemas: S): t.Intersect<S>
  export function Intersect(...xs: Schema[]) { return t.Intersect.def(xs) }
  export interface Intersect<S extends readonly Schema[] = Schema[]> extends Intersect.def<S> { }
  export namespace Intersect {
    export interface def<
      T,
      F extends HKT = Type.Intersect
    > extends AST.intersect<T> {
      readonly _type: Kind<F, T>
      (u: unknown): u is this['_type']
    }
    export function def<T extends readonly unknown[]>(xs: T): t.Intersect.def<T>
    export function def(xs: unknown[]) {
      return Object_assign(
        (src: unknown) => xs.every(isPredicate) ? Combinator.intersect(...xs)(src) : xs,
        AST.intersect(xs)
      )
    }
  }

  export function Optional<S extends Schema>(schema: S): t.Optional<S>
  export function Optional(x: Schema) { return Optional.def(x) }
  export interface Optional<S extends Schema = Unspecified> extends t.Optional.def<S> { }
  export namespace Optional {
    export interface def<T, F extends HKT = Type.Optional> extends
      AST.optional<T> {
      readonly _type: Kind<F, T>
      (u: unknown): u is this['_type']
    }
    export function def<T>(x: T): t.Optional.def<T>
    export function def(x: unknown): {} {
      return Object_assign(
        (src: unknown) => isPredicate(x) ? Combinator.optional(x)(src) : x,
        AST.optional(x)
      )
    }
    export const is
      : <S extends Schema>(u: unknown) => u is t.Optional<S>
      = (u): u is never => !!u && (
        typeof u === 'function' || typeof u === 'object'
      ) && 'tag' in u && u.tag === URI.optional
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

  export function Object<
    S extends { [x: string]: Schema },
    T extends { [K in keyof S]: Entry<S[K]> }
  >(schemas: S, options?: Options): t.Object<T>
  export function Object<
    S extends { [x: string]: Predicate },
    T extends { [K in keyof S]: Entry<S[K]> }
  >(schemas: S, options?: Options): t.Object<T>
  export function Object(xs: { [x: string]: Predicate }, $: Options = getConfig().schema): {} {
    return t.Object.def(xs, $)
  }

  export interface Object<
    S extends
    | { [x: string]: unknown }
    = { [x: string]: unknown },
  > extends t.Object.def<S> { }

  export namespace Object {
    export interface def<T, F extends HKT = Type.Object> extends AST.object<T> {
      readonly _type: Kind<F, T>
      readonly opt: Type.Optionals<T>[]
      (u: unknown): u is this['_type']
    }
    export function def<T extends { [x: string]: unknown }>(ps: T, $?: Options): t.Object.def<T>
    export function def(xs: { [x: string]: unknown }, $?: Options): {} {
      return Object_assign(
        (src: unknown) => Combinator.record(isPredicate)(xs) ? Combinator.object(xs, { ...getConfig().schema, ...$ })(src) : xs,
        { opt: globalThis.Object.keys(xs).filter((k) => Optional.is(xs[k])) },
        AST.object(xs),
      )
    }
  }

  export function Tuple<
    S extends readonly Schema[],
    T extends { -readonly [Ix in keyof S]: Entry<S[Ix]> }
  >(...schemas: ValidateTuple<S>): t.Tuple<Tuple.from<typeof schemas, T>>
  //
  export function Tuple<
    S extends readonly Schema[],
    T extends { -readonly [Ix in keyof S]: Entry<S[Ix]> },
    V extends ValidateTuple<S>
  >(...schemas: [...guards: ValidateTuple<S>, options?: Options]): Tuple<Tuple.from<ValidateTuple<S>, T>>
  //
  export function Tuple(
    ...args:
      | [...guard: readonly Predicate[]]
      | [...guard: readonly Predicate[], $: Options]
  ): {} {
    const [guards, $] = parseArgs(getConfig().schema, args)
    return t.Tuple.def(guards, $)
  }

  export interface Tuple<S extends readonly unknown[] = unknown[]> extends Tuple.def<S> { }
  export namespace Tuple {
    export interface def<T, LowerBound = t.Optional<any>, F extends HKT = Type.Tuple<LowerBound>> extends AST.tuple<T> {
      readonly _type: Kind<F, T>
      (u: unknown): u is this['_type']
    }
    export function def<T extends readonly unknown[]>(xs: readonly [...T], $?: Options): t.Tuple.def<T>
    export function def(xs: readonly unknown[], $: Options = getConfig().schema) {
      const options = {
        ...$, minLength: $.optionalTreatment === 'treatUndefinedAndOptionalAsTheSame' ? -1 : xs.findIndex(t.Optional.is)
      } satisfies Tuple.InternalOptions
      return Object_assign(
        (src: unknown) => xs.every(isPredicate) ? Combinator.tuple(options)(...xs)(src) : xs,
        AST.tuple(xs)
      )
    }
  }
  export declare namespace Tuple {
    type InternalOptions = { minLength?: number }
    type from<V extends readonly unknown[], T extends readonly unknown[]>
      = TypeError extends V[number] ? { [I in keyof V]: V[I] extends TypeError ? InvalidSchema<Extract<V[I], TypeError>> : V[I] }
      : T
      ;
  }
}
