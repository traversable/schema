import type { $, Guard, HKT, Kind, newtype, TypePredicate } from './types.js'
import type * as T from './types.js'
import { URI } from './uri.js'
import * as fn from './function.js'
import * as p from './predicates.js'

/** @internal */
const Object_assign = globalThis.Object.assign
/** @internal */

const Object_keys
  : <T>(x: T) => (keyof T)[]
  = globalThis.Object.keys

/** @internal */
const phantom
  : <T>() => T
  = () => void 0 as never

/** @internal */
const map = {
  object: <S, T>(f: (src: S) => T) => <F extends { [x: string]: S }>(xs: F) => {
    const keys = Object_keys(xs)
    let out: { [K in keyof F]: T } = {} as never
    for (let ix = 0, len = keys.length; ix < len; ix++) {
      const k: keyof F = keys[ix]
      out[k] = f(xs[k])
    }
    return out
  },
} as const

const constTrue = () => true as const
const constFalse = () => false as const

export type Source<T> = T extends (_: infer I) => unknown ? I : unknown
export type Target<T> = T extends (_: never) => infer O ? O : never
export type Param<T> = T extends (_: infer I) => unknown ? I : unknown
export type Entry<S>
  = S extends { def: unknown } ? S
  : S extends Guard<infer T> ? t.Inline<T>
  : S extends () => true ? t.Unknown
  : S extends () => false ? t.Never
  : S
  ;

export type Predicate = T.Predicate | Schema

export interface Schema<
  F extends
  | { tag: string, def: unknown, _type: unknown, (u: unknown): u is unknown }
  = { tag: string, def: unknown, _type: unknown, (u: unknown): u is unknown }
>
  extends TypePredicate<Source<F>, F['_type']> {
  tag?: F['tag']
  def?: F['def']
  _type?: F['_type']
}

export declare namespace Schema {
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

// type Entry<S>
//   = S extends { tag: string } ? S
//   : S extends Guard<infer T> ? t.inline<T>
//   : S extends () => true ? t.unknown
//   : S extends () => false ? t.never
//   : S extends Predicate ? t.unknown
//   // : S extends { [-1]: unknown } ? S[-1]
//   : S


export declare namespace Kinds {
  interface Id extends HKT { [-1]: this[0] }
  interface Optional extends HKT { [-1]: undefined | this[0] }
  interface Array extends HKT { [-1]: this[0][] }
}

export declare namespace Type {
  interface Array extends HKT { [-1]: readonly (this[0]['_type' & keyof this[0]])[] }
  interface Optional extends HKT { [-1]: undefined | this[0]['_type' & keyof this[0]] }
  interface Object extends HKT {
    [-1]: [this[0]] extends [infer T]
    ? { [K in keyof T]: Entry<T[K]['_type' & keyof T[K]]> }
    : never
  }
  interface Tuple extends HKT {
    [-1]: [this[0]] extends [infer T extends readonly unknown[]]
    ? { [Ix in keyof T]: Entry<T[Ix]['_type' & keyof T[Ix]]> }
    : never
  }
}

export declare namespace AST {
  interface Unknown<Meta extends {} = {}> extends newtype<Meta> { tag: URI.unknown, def: unknown }
  interface Never<Meta extends {} = {}> extends newtype<Meta> { tag: URI.never, def: never }
  interface Boolean<Meta extends {} = {}> extends newtype<Meta> { tag: URI.boolean, def: boolean }
  interface String<Meta extends {} = {}> extends newtype<Meta> { tag: URI.string, def: string }
  interface Number<Meta extends {} = {}> extends newtype<Meta> { tag: URI.number, def: number }
  type F<R>
    = AST.Leaf
    | AST.Array<R>
    | AST.Optional<R>
    | AST.Object<{ [x: string]: R }>
    | AST.Tuple<readonly R[]>
    ;
  interface Free extends HKT { [-1]: AST.F<this[0]> }
  type Leaf
    = AST.String
    | AST.Number
    | AST.Boolean
    | AST.Unknown
    | AST.Never
    ;
  type Fixpoint
    = AST.Leaf
    | AST.Array<Fixpoint>
    | AST.Optional<Fixpoint>
    | AST.Object<{ [x: string]: Fixpoint }>
    | AST.Tuple<readonly Fixpoint[]>
    ;
}

export namespace AST {
  export const Unknown: AST.Unknown = { tag: URI.unknown, def: void 0 as never }
  export const Never: AST.Never = { tag: URI.never, def: void 0 as never }
  export const Boolean: AST.Boolean = { tag: URI.boolean, def: false }
  export const Number: AST.Number = { tag: URI.number, def: 0 }
  export const String: AST.String = { tag: URI.string, def: '' }


  export interface Array<T = unknown, Meta extends {} = {}> extends newtype<Meta> {
    tag: URI.array
    def: T
  }
  export declare namespace Array {
    type Pointed<T, Meta extends {}> = never | [Meta] extends [never] ? AST.Array<T> : AST.Array<T, Meta>
  }
  export namespace Array {
    export function of<T, Meta extends {} = never>(x: T, meta?: Meta): AST.Array.Pointed<T, Meta> {
      return {
        tag: URI.array,
        def: x,
      }
    }
  }


  export interface Optional<T = unknown, Meta extends {} = {}> extends newtype<Meta> {
    tag: URI.optional
    def: T
  }
  export declare namespace Optional {
    type Pointed<T, Meta extends {}> = never | [Meta] extends [never] ? AST.Optional<T> : AST.Optional<T, Meta>
  }
  export namespace Optional {
    export function of<T, Meta extends {} = never>(x: T, meta?: Meta): AST.Optional.Pointed<T, Meta> {
      return {
        tag: URI.optional,
        def: x,
      }
    }
  }


  export interface Object<T = unknown, Meta extends {} = {}> extends newtype<Meta> {
    tag: URI.object
    def: T
  }
  export declare namespace Object {
    type Pointed<T, Meta extends {}> = never | [Meta] extends [never] ? AST.Object<T> : AST.Object<T, Meta>
  }
  export namespace Object {
    export function of<T, Meta extends {}>(xs: T, meta?: Meta): AST.Object.Pointed<T, Meta> {
      return {
        tag: URI.object,
        def: xs,
      }
    }
  }


  export interface Tuple<T = unknown, Meta extends {} = {}> extends newtype<Meta> {
    tag: URI.tuple
    def: T
  }
  export declare namespace Tuple {
    type Pointed<T, Meta extends {}> = never | [Meta] extends [never] ? AST.Tuple<T> : AST.Tuple<T, Meta>
  }
  export namespace Tuple {
    export function of<T, Meta extends {}>(xs: T, meta?: Meta): AST.Tuple.Pointed<T, Meta> {
      return {
        tag: URI.tuple,
        def: xs,
      }
    }
  }


  export const Functor: T.Functor<AST.Free, AST.Fixpoint> = {
    map(f) {
      return (x) => {
        switch (true) {
          default: return fn.exhaustive(x)
          case x.tag === URI.never:
          case x.tag === URI.unknown:
          case x.tag === URI.unknown:
          case x.tag === URI.boolean:
          case x.tag === URI.number:
          case x.tag === URI.string: return x
          case x.tag === URI.array: return AST.Array.of(f(x.def))
          case x.tag === URI.optional: return AST.Optional.of(f(x.def))
          case x.tag === URI.object: return AST.Object.of(map.object(f)(x.def))
          case x.tag === URI.tuple: return AST.Tuple.of(x.def.map(f))
        }
      }
    }
  }

  export const fold = fn.cata(AST.Functor)
  export const unfold = fn.ana(AST.Functor)
}

export declare namespace t {
  export { typeOf as typeof }
  export type typeOf<T extends { _type?: unknown }, _ extends {} & T['_type'] = {} & T['_type']> = never | _;
}
export declare namespace t {
  type F<R>
    = t.Leaf
    | t.Array.def<R>
    | t.Optional.def<R>
    | t.Object.def<{ [x: string]: R }>
    | t.Tuple.def<readonly R[]>
    ;
  //
  interface Free extends HKT { [-1]: t.F<this[0]> }
  type Leaf
    = t.Never
    | t.Unknown
    | t.Boolean
    | t.Number
    | t.String
    ;
  type Fixpoint
    = t.Leaf
    | t.Array.def<Fixpoint>
    | t.Optional.def<Fixpoint>
    | t.Object.def<{ [x: string]: Fixpoint }>
    | t.Tuple.def<readonly Fixpoint[]>
    ;
}

export namespace t {
  const def = {
    Unknown: { ...AST.Unknown, _type: phantom() } as t.Unknown,
    Boolean: { ...AST.Boolean, _type: phantom<boolean>() } as t.Boolean,
    Number: { ...AST.Number, _type: phantom<number>() } as t.Number,
    String: { ...AST.String, _type: phantom<string>() } as t.String,
    Never: { ...AST.Never, _type: phantom() } as t.Never,
    Array: <T extends { _type?: unknown, def: unknown }>(x: T) => AST.Array.of(
      (x.def ?? AST.Unknown as never) as T['def'],
      { _type: phantom<readonly T['_type'][]>() },
    ),
    Optional: <T extends { _type?: unknown, def: unknown }>(x: T) => AST.Optional.of(
      (x.def ?? AST.Unknown as never) as T['def'],
      { _type: phantom<T['_type'] | undefined>() },
    ),
    Object: <T extends { def: { [x: string]: unknown } }>(x: T) => AST.Object.of(
      (x.def ?? {}) as T['def'],
      { _type: phantom() as never },
    ),
    Tuple: <T extends { def: readonly unknown[] }>(x: T) => AST.Tuple.of(
      (x.def ?? []) as T['def'],
      { _type: phantom() as never },
    ),
  } as const

  export interface Inline<T> { _type: T }

  export interface Never extends Guard<never>, AST.Never { _type: never }
  export const Never
    : t.Never
    = Object_assign((u: unknown) => p.never(u), def.Never)

  export interface Unknown extends Guard<unknown>, AST.Unknown { _type: unknown }
  export const Unknown
    : t.Unknown
    = Object_assign((u: unknown) => p.any(u), def.Unknown)

  export interface Boolean extends Guard<boolean>, AST.Boolean { _type: boolean }
  export const Boolean
    : t.Boolean
    = Object_assign((u: unknown) => p.boolean(u), def.Boolean)

  export interface Number extends Guard<number>, AST.Number { _type: number }
  export const Number
    : t.Number
    = Object_assign((u: unknown) => p.number(u), def.Number)

  export interface String extends Guard<string>, AST.String { _type: string }
  export const String
    : t.String
    = Object_assign((u: unknown) => p.string(u), def.String)


  export interface Array<F extends Schema>
    extends TypePredicate<unknown, readonly F['_type'][]>,
    AST.Array<F, { _type: readonly F['_type'][] }> { }
  //
  export function Array<F extends Schema>(q: F): t.Array<F>
  export function Array<F extends Schema>(q: F) {
    return t.Array.of(q)
  }
  export namespace Array {
    export interface def<Def, F extends HKT = Type.Array> extends
      AST.Array<Def, { _type: Kind<F, Def> }> { }
    //
    export function of<F>(q: F): t.Array.def<F>
    export function of<F>(q: F) {
      return Object_assign(
        (src: unknown) => typeof q === 'function' ? p.array(src) && src.every(q as never) : q,
        def.Array({ def: q })
      )
    }
  }

  export interface Optional<F extends Schema>
    extends TypePredicate<unknown, F['_type'] | undefined>,
    AST.Optional<F, { _type: F['_type'] | undefined }> { }
  //
  export function Optional<F extends Schema>(q: F): t.Optional<F>
  export function Optional<F extends Schema>(q: F) {
    return Optional.of(q)
  }
  export namespace Optional {
    export interface def<Def, F extends HKT = Type.Optional>
      extends AST.Optional<Def, { _type: Kind<F, Def> }> { (u: unknown): u is this['_type'] }
    //
    export function of<F>(q: F): t.Optional.def<F>
    export function of<F>(q: F) {
      return Object_assign(
        (src: unknown): src is never => typeof q === 'function' ? src === void 0 || q(src) : q,
        def.Optional({ def: q })
      )
    }
  }
  export declare namespace Optional {
    type type<F extends Schema> = never | undefined | t.typeof<F>
    interface Codec<
      S extends Schema = Schema,
      T extends Schema = Schema
    > extends TypePredicate<t.typeof<S>, Optional.type<T>> {
      decode(source: t.typeof<S>): Optional.type<T>
      encode(target: Optional.type<T>): t.typeof<S>
    }
  }


  export interface Object<F extends { [x: string]: unknown }>
    extends TypePredicate<unknown, Object.type<F>>,
    AST.Object<F, { _type: Object.type<F> }> { }
  //
  export function Object<
    F extends { [x: string]: Predicate },
    T extends { [K in keyof F]: Entry<F[K]> }
  >(q: F, $?: Schema.Options): t.Object<T>
  //
  export function Object<F extends { [x: string]: Predicate }>(q: F, $?: Schema.Options) {
    return t.Object.of(q, $)
  }
  export namespace Object {
    export interface def<Def extends { [x: string]: unknown }, F extends HKT = Type.Object>
      extends AST.Object<Def, { _type: Kind<F, Def> }> { }
    //
    export function of<F extends { [x: string]: unknown }>(q: F, $?: Schema.Options): t.Object.def<F>
    export function of<F extends { [x: string]: unknown }>(q: F, $?: Schema.Options) {
      return Object_assign(
        (src: unknown) => p.object$(q as never, { ...t.Object.defaults, ...$ })(src),
        def.Object({ def: q })
      )
    }
  }
  export declare namespace Object {
    type type<
      F extends { [x: string]: unknown },
      Opt extends Object.Optionals<F> = Object.Optionals<F>,
      Req extends Exclude<keyof F, Opt> = Exclude<keyof F, Opt>
    > = T.Force<
      & { [K in Opt]+?: F[K]['_type' & keyof F[K]] }
      & { [K in Req]-?: F[K]['_type' & keyof F[K]] }
    >
    type Optionals<S, K extends keyof S = keyof S>
      = K extends K ? S[K] extends t.Optional<any> ? K : never : never
  }
  Object.defaults = {
    optionalTreatment: 'presentButUndefinedIsOK',
    treatArraysAsObjects: false,
  } satisfies Required<Schema.Options>


  export interface Tuple<F extends readonly unknown[]>
    extends TypePredicate<unknown, Tuple.type<F>>,
    AST.Tuple<F, { _type: Tuple.type<F> }> { }
  //
  export function Tuple<
    F extends readonly Predicate[],
    T extends { -readonly [Ix in keyof F]: Entry<F[Ix]> }
  >(...guard: T.ValidateTuple<F>): t.Tuple<T>
  export function Tuple<F extends readonly Predicate[]>(...guards: F) {
    return t.Tuple.of(guards)
  }
  export namespace Tuple {
    export interface def<Def extends readonly unknown[], F extends HKT = Type.Tuple>
      extends AST.Tuple<Def, { _type: Kind<F, Def> }> { }
    //
    export function of<F extends readonly unknown[]>(guards: F): t.Tuple.def<F>
    export function of<F extends readonly unknown[]>(guards: F) {
      return Object_assign(
        (src: unknown) => p.tuple$(Tuple.defaults)(...guards as never)(src),
        def.Tuple({ def: guards })
      )
    }
  }
  export declare namespace Tuple {
    type type<T extends readonly unknown[], Out extends readonly unknown[] = []>
      = t.Optional<any> extends T[number]
      ? T extends readonly [infer Head, ...infer Tail]
      ? [Head] extends [t.Optional<any>] ? [
        ...req: { [ix in keyof Out]: Out[ix]['_type' & keyof Out[ix]] },
        ...opt: T.Label<{ [ix in keyof T]: T[ix]['_type' & keyof T[ix]] }>
      ]
      : Tuple.type<Tail, [...Out, Head]>
      : never
      : T
      ;
  }
  Tuple.defaults = {
    optionalTreatment: 'presentButUndefinedIsOK',
    treatArraysAsObjects: false,
  } satisfies Required<Schema.Options>

  export const Functor: T.Functor<t.Free, t.Fixpoint> = {
    map(f) {
      return (x) => {
        switch (true) {
          default: return fn.exhaustive(x)
          case x.tag === URI.unknown:
          case x.tag === URI.never:
          case x.tag === URI.boolean:
          case x.tag === URI.number:
          case x.tag === URI.string: return x
          case x.tag === URI.array: return Array.of(f(x.def))
          case x.tag === URI.optional: return Optional.of(f(x.def))
          case x.tag === URI.tuple: return Tuple.of(x.def.map(f))
          case x.tag === URI.object: return Object.of(map.object(f)(x.def))
        }
      }
    }
  }

  export const fold = fn.cata(t.Functor)
  export const unfold = fn.ana(t.Functor)
}
