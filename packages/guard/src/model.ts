import type { Guard, HKT, Kind, newtype, TypePredicate } from './types.js'
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
const isPredicate
  : <S, T extends S>(u: unknown) => u is (x: S) => x is T
  = p.function as never

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

export type intersect<Todo, Out = unknown>
  = Todo extends readonly [infer H, ...infer T]
  ? intersect<T, Out & H['_type' & keyof H]>
  : Out

export type Predicate = T.Predicate | Schema

export interface Schema<
  F extends
  | { tag: string, def: unknown, _type: unknown, (u: unknown): u is unknown }
  = { tag: string, def: unknown, _type: unknown, (u: unknown): u is unknown }
> extends TypePredicate<Source<F>, F['_type']> {
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


export declare namespace Kinds {
  interface Id extends HKT { [-1]: this[0] }
  interface Optional extends HKT { [-1]: undefined | this[0] }
  interface Array extends HKT { [-1]: this[0][] }
}

export declare namespace Type {
  type Map<T> = never | { -readonly [K in keyof T]: Entry<T[K]['_type' & keyof T[K]]> }
  type Unify<T> = never | T[number & keyof T]['_type' & keyof T[number & keyof T]]
  interface Array extends HKT { [-1]: readonly (this[0]['_type' & keyof this[0]])[] }
  interface Record extends HKT { [-1]: globalThis.Record<string, this[0]> }
  interface Optional extends HKT { [-1]: undefined | this[0]['_type' & keyof this[0]] }
  interface Object extends HKT { [-1]: Map<this[0]> }
  interface Tuple extends HKT { [-1]: Map<this[0]> }
  interface Intersect extends HKT { [-1]: intersect<this[0]> }
  interface Union extends HKT { [-1]: Unify<this[0]> }
}

export declare namespace AST {
  interface Unknown<Meta extends {} = {}> extends newtype<Meta> { tag: URI.unknown, def: unknown }
  interface Never<Meta extends {} = {}> extends newtype<Meta> { tag: URI.never, def: never }
  interface Any<Meta extends {} = {}> extends newtype<Meta> { tag: URI.any, def: unknown }
  interface Void<Meta extends {} = {}> extends newtype<Meta> { tag: URI.void, def: void }
  interface Null<Meta extends {} = {}> extends newtype<Meta> { tag: URI.null, def: null }
  interface Undefined<Meta extends {} = {}> extends newtype<Meta> { tag: URI.undefined, def: undefined }
  interface BigInt<Meta extends {} = {}> extends newtype<Meta> { tag: URI.bigint, def: bigint }
  interface Symbol<Meta extends {} = {}> extends newtype<Meta> { tag: URI.symbol_, def: symbol }
  interface Boolean<Meta extends {} = {}> extends newtype<Meta> { tag: URI.boolean, def: boolean }
  interface String<Meta extends {} = {}> extends newtype<Meta> { tag: URI.string, def: string }
  interface Number<Meta extends {} = {}> extends newtype<Meta> { tag: URI.number, def: number }
  type F<Rec>
    = AST.Leaf
    | AST.Array<Rec>
    | AST.Record<Rec>
    | AST.Optional<Rec>
    | AST.Object<{ [x: string]: Rec }>
    | AST.Tuple<readonly Rec[]>
    | AST.Union<readonly Rec[]>
    | AST.Intersect<readonly Rec[]>
    ;
  interface Free extends HKT { [-1]: AST.F<this[0]> }
  type Fixpoint
    = AST.Leaf
    | AST.Array<Fixpoint>
    | AST.Record<Fixpoint>
    | AST.Optional<Fixpoint>
    | AST.Object<{ [x: string]: Fixpoint }>
    | AST.Tuple<readonly Fixpoint[]>
    | AST.Union<readonly Fixpoint[]>
    | AST.Intersect<readonly Fixpoint[]>
    ;
}

export namespace AST {
  export const Unknown: AST.Unknown = { tag: URI.unknown, def: void 0 as never }
  export const Never: AST.Never = { tag: URI.never, def: void 0 as never }
  export const Any: AST.Any = { tag: URI.any, def: void 0 as never }
  export const Void: AST.Void = { tag: URI.void, def: void 0 as void }
  export const Null: AST.Null = { tag: URI.null, def: null }
  export const Undefined: AST.Undefined = { tag: URI.undefined, def: void 0 as never }
  export const Symbol: AST.Symbol = { tag: URI.symbol_, def: globalThis.Symbol() }
  export const Boolean: AST.Boolean = { tag: URI.boolean, def: false }
  export const Number: AST.Number = { tag: URI.number, def: 0 }
  export const BigInt: AST.BigInt = { tag: URI.bigint, def: 0n }
  export const String: AST.String = { tag: URI.string, def: '' }
  export type Leaf = typeof Leaves[number]
  export const Leaves = [
    AST.Unknown,
    AST.Never,
    AST.Any,
    AST.Void,
    AST.Null,
    AST.Undefined,
    AST.Symbol,
    AST.Boolean,
    AST.Number,
    AST.BigInt,
    AST.String,
  ]
  export const LeafTags = Leaves.map((leaf) => leaf.tag)

  export const isLeaf = (u: unknown): u is Leaf =>
    !!u && typeof u === 'object' && 'tag' in u && typeof u.tag === 'string' && (LeafTags as string[]).includes(u.tag)

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

  export interface Record<T = unknown, Meta extends {} = {}> extends newtype<Meta> {
    tag: URI.record
    def: T
  }
  export declare namespace Record {
    type Pointed<T, Meta extends {}> = never | [Meta] extends [never] ? AST.Record<T> : AST.Record<T, Meta>
  }
  export namespace Record {
    export function of<T, Meta extends {} = never>(x: T, meta?: Meta): AST.Record.Pointed<T, Meta> {
      return {
        tag: URI.record,
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


  export interface Intersect<T = unknown, Meta extends {} = {}> extends newtype<Meta> {
    tag: URI.intersect
    def: T
  }
  export declare namespace Intersect {
    type Pointed<T, Meta extends {}> = never | [Meta] extends [never] ? AST.Intersect<T> : AST.Intersect<T, Meta>
  }
  export namespace Intersect {
    export function of<T, Meta extends {} = never>(x: T, meta?: Meta): AST.Intersect.Pointed<T, Meta> {
      return {
        tag: URI.intersect,
        def: x,
      }
    }
  }


  export interface Union<T = unknown, Meta extends {} = {}> extends newtype<Meta> {
    tag: URI.union
    def: T
  }
  export declare namespace Union {
    type Pointed<T, Meta extends {}> = never | [Meta] extends [never] ? AST.Union<T> : AST.Union<T, Meta>
  }
  export namespace Union {
    export function of<T, Meta extends {} = never>(x: T, meta?: Meta): AST.Union.Pointed<T, Meta> {
      return {
        tag: URI.union,
        def: x,
      }
    }
  }


  export const Functor: T.Functor<AST.Free, AST.Fixpoint> = {
    map(f) {
      return (x) => {
        switch (true) {
          default: return fn.exhaustive(x)
          case AST.isLeaf(x): return x
          case x.tag === URI.array: return AST.Array.of(f(x.def))
          case x.tag === URI.record: return AST.Record.of(f(x.def))
          case x.tag === URI.optional: return AST.Optional.of(f(x.def))
          case x.tag === URI.object: return AST.Object.of(map.object(f)(x.def))
          case x.tag === URI.tuple: return AST.Tuple.of(x.def.map(f))
          case x.tag === URI.union: return AST.Union.of(x.def.map(f))
          case x.tag === URI.intersect: return AST.Intersect.of(x.def.map(f))
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
  //
  interface Free extends HKT { [-1]: t.F<this[0]> }
  //
  type Fixpoint
    = t.Leaf
    | t.Array.def<Fixpoint>
    | t.Record.def<Fixpoint>
    | t.Optional.def<Fixpoint>
    | t.Object.def<{ [x: string]: Fixpoint }>
    | t.Tuple.def<readonly Fixpoint[]>
    | t.Union.def<readonly Fixpoint[]>
    | t.Intersect.def<readonly Fixpoint[]>
    ;
}

export namespace t {
  const def = {
    Unknown: { ...AST.Unknown, _type: phantom() } as t.Unknown,
    Never: { ...AST.Never, _type: phantom() } as t.Never,
    Any: { ...AST.Any, _type: phantom() } as t.Any,
    Void: { ...AST.Void, _type: phantom() } as t.Void,
    Null: { ...AST.Null, _type: phantom() } as t.Null,
    Undefined: { ...AST.Undefined, _type: phantom() } as t.Undefined,
    BigInt: { ...AST.BigInt, _type: phantom() } as t.BigInt,
    Symbol: { ...AST.Symbol, _type: phantom() } as t.Symbol,
    Boolean: { ...AST.Boolean, _type: phantom<boolean>() } as t.Boolean,
    Number: { ...AST.Number, _type: phantom<number>() } as t.Number,
    String: { ...AST.String, _type: phantom<string>() } as t.String,
    Array: <T extends { _type?: unknown, def: unknown }>(x: T) => AST.Array.of(
      (x.def ?? AST.Unknown as never) as T['def'],
      { _type: phantom<readonly T['_type'][]>() },
    ),
    Record: <T extends { _type?: unknown, def: unknown }>(x: T) => AST.Record.of(
      (x.def ?? AST.Unknown as T['def']),
      { _type: phantom<globalThis.Record<string, T['_type']>>() }
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
    Intersect: <T extends { def: readonly unknown[] }>(x: T) => AST.Intersect.of(
      (x.def ?? []) as T['def'],
      { _type: phantom() as never },
    ),
    Union: <T extends { def: readonly unknown[] }>(x: T) => AST.Union.of(
      (x.def ?? []) as T['def'],
      { _type: phantom() as never },
    ),
  } as const
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

  export const isLeaf: (u: unknown) => u is t.Leaf = AST.isLeaf as never

  export interface Inline<T> { _type: T }
  export interface InvalidSchema<_Err> extends T.TypeError<''>, t.Never { }

  export interface Never extends Guard<never>, AST.Never<{ _type: never }> { }
  export const Never: t.Never = Object_assign((u: unknown) => p.never(u), def.Never)
  export interface Unknown extends Guard<unknown>, AST.Unknown<{ _type: unknown }> { }
  export const Unknown: t.Unknown = Object_assign((u: unknown) => p.any(u), def.Unknown)
  export interface Any extends Guard<any>, AST.Any<{ _type: any }> { }
  export const Any: t.Any = Object_assign((u: unknown) => p.any(u), def.Any)
  export interface Void extends Guard<void>, AST.Void<{ _type: void }> { }
  export const Void: t.Void = Object_assign((u: unknown) => p.undefined(u), def.Void)
  export interface Null extends Guard<null>, AST.Null<{ _type: null }> { }
  export const Null: t.Null = Object_assign((u: unknown) => p.null(u), def.Null)
  export interface Undefined extends Guard<undefined>, AST.Undefined<{ _type: undefined }> { }
  export const Undefined: t.Undefined = Object_assign((u: unknown) => p.undefined(u), def.Undefined)
  export interface BigInt extends Guard<bigint>, AST.BigInt<{ _type: bigint }> { }
  export const BigInt: t.BigInt = Object_assign((u: unknown) => p.bigint(u), def.BigInt)
  export interface Symbol extends Guard<symbol>, AST.Symbol<{ _type: symbol }> { }
  export const Symbol: t.Symbol = Object_assign((u: unknown) => p.symbol(u), def.Symbol)
  export interface Boolean extends Guard<boolean>, AST.Boolean { _type: boolean }
  export const Boolean: t.Boolean = Object_assign((u: unknown) => p.boolean(u), def.Boolean)
  export interface Number extends Guard<number>, AST.Number { _type: number }
  export const Number: t.Number = Object_assign((u: unknown) => p.number(u), def.Number)
  export interface String extends Guard<string>, AST.String { _type: string }
  export const String: t.String = Object_assign((u: unknown) => p.string(u), def.String)


  export interface Array<F extends Schema>
    extends TypePredicate<unknown, Kind<Type.Array, F>>,
    AST.Array<F, { _type: Kind<Type.Array, F> }> { }
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


  export interface Record<F extends Schema>
    extends TypePredicate<unknown, Kind<Type.Record, F>>,
    AST.Record<F, { _type: Kind<Type.Record, F> }> { }
  //
  export function Record<F extends Schema>(q: F): t.Record<F>
  export function Record<F extends Schema>(q: F) {
    return t.Record.of(q)
  }
  export namespace Record {
    export interface def<Def, F extends HKT = Type.Record> extends
      AST.Record<Def, { _type: Kind<F, Def> }> { }
    //
    export function of<F>(q: F): t.Record.def<F>
    export function of<F>(q: F) {
      return Object_assign(
        (src: unknown) => typeof q === 'function' ? p.record$(q as never)(src) : q,
        def.Record({ def: q })
      )
    }
  }


  export interface Intersect<F extends readonly Schema[]>
    extends TypePredicate<unknown, Kind<Type.Intersect, F>>,
    AST.Intersect<F, { _type: Kind<Type.Intersect, F> }> { }
  //
  export function Intersect<F extends readonly Schema[]>(...qs: F): t.Intersect<F>
  export function Intersect<F extends readonly Schema[]>(...qs: F) {
    return t.Intersect.of(qs)
  }
  export namespace Intersect {
    export interface def<Def, F extends HKT = Type.Intersect> extends
      AST.Intersect<Def, { _type: Kind<F, Def> }> { }
    //
    export function of<F extends readonly unknown[]>(qs: F): t.Intersect.def<F>
    export function of<F extends readonly unknown[]>(qs: F) {
      return Object_assign(
        (src: unknown) => qs.every(isPredicate) ? p.intersect$(...qs)(src) : qs,
        def.Intersect({ def: qs })
      )
    }
  }

  export interface Union<F extends readonly Schema[]>
    extends TypePredicate<unknown, Kind<Type.Union, F>>,
    AST.Union<F, { _type: Kind<Type.Union, F> }> { }
  //
  export function Union<F extends readonly Schema[]>(...qs: F): t.Union<F>
  export function Union<F extends readonly Schema[]>(...qs: F) {
    return t.Union.of(qs)
  }
  export namespace Union {
    export interface def<Def, F extends HKT = Type.Union> extends
      AST.Union<Def, { _type: Kind<F, Def> }> { }
    //
    export function of<F extends readonly unknown[]>(qs: F): t.Union.def<F>
    export function of<F extends readonly unknown[]>(qs: F) {
      return Object_assign(
        (src: unknown) => qs.every(isPredicate) ? p.union$(...qs)(src) : qs,
        def.Union({ def: qs })
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
    export function is<T extends Schema>(u: unknown): u is t.Optional<T> {
      return typeof u === 'function' && 'tag' in u && u.tag === URI.optional
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
    extends TypePredicate<unknown, Tuple.type<F>>, AST.Tuple<F, { _type: Tuple.type<F> }> { }

  export function Tuple<
    F extends readonly Predicate[],
    T extends { -readonly [Ix in keyof F]: Entry<F[Ix]> }
  >(...guard: T.ValidateTuple<F>): Tuple.from<typeof guard, T>

  export function Tuple<F extends readonly Predicate[]>(...guards: F): {} {
    return t.Tuple.of(guards)
  }
  export namespace Tuple {
    export interface def<Def extends readonly unknown[], F extends HKT = Type.Tuple>
      extends AST.Tuple<Def, { _type: Kind<F, Def> }> { }
    //
    export function of<F extends readonly unknown[]>(guards: F): t.Tuple.def<F>
    export function of<F extends readonly unknown[]>(guards: F) {
      return Object_assign(
        (src: unknown) => p.tuple$({ minLength: guards.findIndex(t.Optional.is) })(...guards as never)(src),
        def.Tuple({ def: guards })
      )
    }
  }
  export declare namespace Tuple {
    type InternalOptions = { minLength?: number }
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

    type from<V extends readonly unknown[], T extends readonly unknown[]>
      = T.TypeError extends V[number] ? InvalidSchema<Extract<V[number], T.TypeError>>
      : t.Tuple<T>
  }


  export const Functor: T.Functor<t.Free, t.Fixpoint> = {
    map(f) {
      return (x) => {
        switch (true) {
          default: return fn.exhaustive(x)
          case t.isLeaf(x): return x
          case x.tag === URI.array: return Array.of(f(x.def))
          case x.tag === URI.record: return Record.of(f(x.def))
          case x.tag === URI.optional: return Optional.of(f(x.def))
          case x.tag === URI.tuple: return Tuple.of(x.def.map(f))
          case x.tag === URI.object: return Object.of(map.object(f)(x.def))
          case x.tag === URI.union: return Union.of(x.def.map(f))
          case x.tag === URI.intersect: return Intersect.of(x.def.map(f))
        }
      }
    }
  }

  export const fold = fn.cata(t.Functor)
  export const unfold = fn.ana(t.Functor)
}
