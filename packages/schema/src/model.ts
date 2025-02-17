import type { Guard, HKT, Kind, newtype, TypePredicate } from './types.js'
import type * as T from './types.js'
import { NS, URI } from './uri.js'
import * as fn from './function.js'
import * as p from './predicates.js'
import { key as parseKey } from './parse.js'


/** @internal */
const Object_assign = globalThis.Object.assign
/** @internal */
const Object_values = globalThis.Object.values
/** @internal */
const Object_entries = globalThis.Object.entries

/** @internal */
const Object_keys
  : <T>(x: T) => (keyof T)[]
  = globalThis.Object.keys

/** @internal */
const phantom
  : <T = never>() => T
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

/** @internal */
const OPT = '<<>>' as const
/** @internal */
const trim = (s: string) => s.startsWith(OPT) ? s.substring(OPT.length) : s

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

export type intersect_<Todo, Out = unknown>
  = Todo extends readonly [infer H, ...infer T]
  ? intersect_<T, Out & H['_type' & keyof H]>
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
  interface Array extends HKT { [-1]: this[0]['_type' & keyof this[0]][] }
  interface Record extends HKT { [-1]: globalThis.Record<string, this[0]['_type' & keyof this[0]]> }
  interface Optional extends HKT { [-1]: undefined | this[0]['_type' & keyof this[0]] }
  interface Object extends HKT { [-1]: t.Object.type<this[0]> }
  // interface Object extends HKT { [-1]: Map<this[0]> }
  interface Tuple extends HKT { [-1]: Map<this[0]> }
  interface Intersect extends HKT { [-1]: intersect_<this[0]> }
  interface Union extends HKT { [-1]: Unify<this[0]> }
  interface Const<T = unknown> extends HKT { [-1]: T }
}

export declare namespace AST {
  interface Unknown { tag: URI.unknown, def: unknown }
  interface Never { tag: URI.never, def: never }
  interface Any { tag: URI.any, def: any }
  interface Void { tag: URI.void, def: void }
  interface Null { tag: URI.null, def: null }
  interface Undefined { tag: URI.undefined, def: undefined }
  interface BigInt { tag: URI.bigint, def: bigint }
  interface Symbol { tag: URI.symbol_, def: symbol }
  interface Boolean { tag: URI.boolean, def: boolean }
  interface String { tag: URI.string, def: string }
  interface Number { tag: URI.number, def: number }
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
  export const Unknown: AST.Unknown = { tag: URI.unknown, def: void 0 as unknown }
  export const Never: AST.Never = { tag: URI.never, def: void 0 as never }
  export const Any: AST.Any = { tag: URI.any, def: void 0 as any }
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
  export const leafTags = Leaves.map((l) => l.tag)

  export const isLeaf = (u: unknown): u is Leaf =>
    p.function(u) &&
    'tag' in u &&
    p.string(u.tag) &&
    (<string[]>leafTags).includes(u.tag)

  export interface Array<T = unknown> { tag: URI.array, def: T }
  export function Array<T>(x: T): AST.Array<T> { return { tag: URI.array, def: x } }

  export interface Record<T = unknown> { tag: URI.record, def: T }
  export function Record<T>(x: T): AST.Record<T> { return { tag: URI.record, def: x } }

  export interface Optional<T = unknown> { tag: URI.optional, def: T }
  export function Optional<T>(x: T): AST.Optional<T> { return { tag: URI.optional, def: x } }

  export interface Object<T = unknown> { tag: URI.object, def: T }
  export function Object<T>(xs: T): AST.Object<T> { return { tag: URI.object, def: xs } }

  export interface Tuple<T = unknown> { tag: URI.tuple, def: T }
  export function Tuple<T>(xs: T): AST.Tuple<T> { return { tag: URI.tuple, def: xs } }

  export interface Intersect<T = unknown> { tag: URI.intersect, def: T }
  export function Intersect<T>(x: T): AST.Intersect<T> { return { tag: URI.intersect, def: x } }

  export interface Union<T = unknown> { tag: URI.union, def: T }
  export function Union<T>(x: T): AST.Union<T> { return { tag: URI.union, def: x } }

  export const Functor: T.Functor<AST.Free, AST.Fixpoint> = {
    map(f) {
      return (x) => {
        switch (true) {
          default: return fn.exhaustive(x)
          case AST.isLeaf(x): return x
          case x.tag === URI.array: return AST.Array(f(x.def))
          case x.tag === URI.record: return AST.Record(f(x.def))
          case x.tag === URI.optional: return AST.Optional(f(x.def))
          case x.tag === URI.object: return AST.Object(map.object(f)(x.def))
          case x.tag === URI.tuple: return AST.Tuple(x.def.map(f))
          case x.tag === URI.union: return AST.Union(x.def.map(f))
          case x.tag === URI.intersect: return AST.Intersect(x.def.map(f))
        }
      }
    }
  }

  export const fold = fn.cata(AST.Functor)
  export const unfold = fn.ana(AST.Functor)
}

export declare namespace t {
  export { typeOf as typeof }
  export type typeOf<
    T extends { _type?: unknown },
    _ extends
    | T['_type']
    = T['_type']
  > = never | _;
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
  export interface Never extends Guard<never>, AST.Never { _type: never }
  export const Never: t.Never = Object_assign((u: unknown) => p.never(u), { ...AST.Never } as t.Never)
  export interface Unknown extends Guard<unknown>, AST.Unknown { _type: unknown }
  export const Unknown: t.Unknown = Object_assign((u: unknown): u is unknown => p.any(u), { ...AST.Unknown } as t.Unknown)
  export interface Any extends Guard<any>, AST.Any { _type: any }
  export const Any: t.Any = Object_assign((u: unknown): u is any => p.any(u), { ...AST.Any } as t.Any)
  export interface Void extends Guard<void>, AST.Void { _type: void }
  export const Void: t.Void = Object_assign((u: unknown) => p.undefined(u), { ...AST.Void } as t.Void)
  export interface Null extends Guard<null>, AST.Null { _type: null }
  export const Null: t.Null = Object_assign((u: unknown) => p.null(u), { ...AST.Null } as t.Null)
  export interface Undefined extends Guard<undefined>, AST.Undefined { _type: undefined }
  export const Undefined: t.Undefined = Object_assign((u: unknown) => p.undefined(u), { ...AST.Undefined } as t.Undefined)
  export interface BigInt extends Guard<bigint>, AST.BigInt { _type: bigint }
  export const BigInt: t.BigInt = Object_assign((u: unknown) => p.bigint(u), { ...AST.BigInt } as t.BigInt)
  export interface Symbol extends Guard<symbol>, AST.Symbol { _type: symbol }
  export const Symbol: t.Symbol = Object_assign((u: unknown) => p.symbol(u), { ...AST.Symbol } as t.Symbol)
  export interface Boolean extends Guard<boolean>, AST.Boolean { _type: boolean }
  export const Boolean: t.Boolean = Object_assign((u: unknown) => p.boolean(u), { ...AST.Boolean } as t.Boolean)
  export interface Number extends Guard<number>, AST.Number { _type: number }
  export const Number: t.Number = Object_assign((u: unknown) => p.number(u), { ...AST.Number } as t.Number)
  export interface String extends Guard<string>, AST.String { _type: string }
  export const String: t.String = Object_assign((u: unknown) => p.string(u), { ...AST.String } as t.String)
  const def = {
    Record: <T extends { _type?: unknown, def: unknown }>(x: T) => AST.Record(x.def),
    Optional: <T extends { _type?: unknown, def: unknown }>(x: T) => AST.Optional(x.def),
    Object: <T extends { def: { [x: string]: unknown } }>(x: T) => AST.Object(x.def),
    Tuple: <T extends { def: readonly unknown[] }>(x: T) => AST.Tuple(x.def),
    Intersect: <T extends { def: readonly unknown[] }>(x: T) => AST.Intersect(x.def),
    Union: <T extends { def: readonly unknown[] }>(x: T) => AST.Union(x.def),
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

  export const leafTags = Leaves.map((l) => l.tag) satisfies typeof AST.leafTags

  export const isLeaf = (u: unknown): u is Leaf =>
    p.function(u) &&
    'tag' in u &&
    p.string(u.tag) &&
    (<string[]>leafTags).includes(u.tag)

  export interface Array<F extends Schema> extends t.Array.def<F> { }
  export function Array<F extends Schema>(typeguard: F): t.Array<F>
  export function Array<F extends Schema>(q: F) {
    return t.Array.fix(q)
  }
  export namespace Array {
    export interface def<Def, F extends HKT = Type.Array> extends
      AST.Array<Def> {
      _type: Kind<F, Def>
      // _type: Def['def']
      (u: unknown): u is this['_type']
    }
    //
    export function fix<F>(q: F): t.Array.def<F>
    export function fix<F>(q: F) {
      return Object_assign(
        (src: unknown) => isPredicate(q) ? p.array$(q)(src) : q,
        AST.Array(q)
      )
    }
  }

  export interface Record<F extends Schema> extends t.Record.def<F> { }
  export function Record<F extends Schema>(q: F): t.Record<F>
  export function Record<F extends Schema>(q: F) {
    return t.Record.fix(q)
  }
  export namespace Record {
    export interface def<Def, F extends HKT = Type.Record> extends
      AST.Record<Def> {
      _type: Kind<F, Def>
      (u: unknown): u is this['_type']
    }
    //
    export function fix<F>(q: F): t.Record.def<F>
    export function fix<F>(q: F) {
      return Object_assign(
        (src: unknown) => isPredicate(q) ? p.record$(q)(src) : q,
        AST.Record(q),
      )
    }
  }

  export interface Optional<F extends Schema> extends t.Optional.def<F> { }
  export function Optional<F extends Schema>(typeguard: F, options?: Schema.Options): t.Optional<F>
  export function Optional<F extends Schema>(q: F, $: Schema.Options = t.Object.defaults) { return Optional.fix(q, $) }
  export namespace Optional {
    export interface def<Def, F extends HKT = Type.Optional> extends
      AST.Optional<Def> {
      _type: Kind<F, Def>
      (u: unknown): u is this['_type']
    }
    //
    export function fix<F>(q: F, $?: Schema.Options): t.Optional.def<F>
    export function fix<F>(q: F, $: Schema.Options = t.Object.defaults) {
      return Object_assign(
        (src: unknown) => isPredicate(q) ? p.optional$(q)(src) : q,
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

  export interface Object<F extends { [x: string]: unknown }> extends t.Object.def<F> { }
  export function Object<
    F extends { [x: string]: Predicate },
    T extends { [K in keyof F]: Entry<F[K]> }
  >(shape: F, options?: Schema.Options): t.Object<T>
  //
  export function Object<F extends { [x: string]: Predicate }>(qs: F, $?: Schema.Options) {
    return t.Object.fix(qs, $)
  }
  export namespace Object {
    export interface def<
      Def extends { [x: string]: unknown },
      F extends HKT = Type.Object
    > extends AST.Object<Def> {
      _type: Kind<F, Def>
      (u: unknown): u is this['_type']
    }
    //
    export function fix<F extends { [x: string]: unknown }>(qs: F, $?: Schema.Options): t.Object.def<F>
    export function fix<F extends { [x: string]: unknown }>(qs: F, $?: Schema.Options): {} {
      return Object_assign(
        (src: unknown) => p.record$(isPredicate)(qs) ? p.object$(qs, { ...t.Object.defaults, ...$ })(src) : qs,
        def.Object({ def: qs })
      )
    }
  }
  export declare namespace Object {
    type type<
      F,
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

  export interface Tuple<F extends readonly unknown[]> extends Tuple.def<F, Type.Tuple> { }
  //
  export function Tuple<
    F extends readonly [] | readonly Predicate[],
    T extends { -readonly [Ix in keyof F]: Entry<F[Ix]> }
  >(...guard: T.ValidateTuple<F>): Tuple.from<typeof guard, T>
  //
  export function Tuple<
    F extends readonly Predicate[],
    T extends { -readonly [Ix in keyof F]: Entry<F[Ix]> }
  >(...args: [...guard: T.ValidateTuple<F>, options?: Schema.Options]): Tuple.from<T.ValidateTuple<F>, T>

  //
  export function Tuple<F extends readonly Predicate[]>(
    ...args:
      | [...guard: F]
      | [...guard: F, $: Schema.Options]
    // guards: F
  ): {} {
    const [guards, $] = p.parseArgs(t.Object.defaults, args)
    return t.Tuple.fix(guards, $)
  }
  //
  export namespace Tuple {
    export interface def<
      Def extends readonly unknown[],
      F extends HKT = Type.Tuple
    > extends AST.Tuple<Def> {
      _type: Kind<F, Def>
      (u: unknown): u is this['_type']
    }
    //
    export function fix<F extends readonly unknown[]>(qs: readonly [...F], $?: Schema.Options): t.Tuple.def<F>
    export function fix<F extends readonly unknown[]>(qs: readonly [...F], $: Schema.Options = Object.defaults): {} {
      const options = {
        ...$, minLength: $.optionalTreatment === 'treatUndefinedAndOptionalAsTheSame' ? -1
          : qs.findIndex(t.Optional.is)
      }
      return Object_assign(
        (src: unknown) => qs.every(isPredicate) ? p.tuple$(options)(...qs)(src) : qs,
        def.Tuple({ def: qs })
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
      ;
    type from<V extends readonly unknown[], T extends readonly unknown[]>
      = T.TypeError extends V[number] ? InvalidSchema<Extract<V[number], T.TypeError>>
      : t.Tuple<T>
      ;
  }

  export interface Union<F extends readonly Schema[]> extends Union.def<F> { }
  export function Union<F extends readonly Schema[]>(...qs: F): t.Union<F>
  export function Union<F extends readonly Schema[]>(...qs: F) { return t.Union.fix(qs) }
  export namespace Union {
    export interface def<
      T,
      F extends HKT = Type.Union
    > extends AST.Union<T> {
      _type: Kind<F, T>
      (u: unknown): u is this['_type']
    }
    //
    export function fix<F extends readonly unknown[]>(qs: F): t.Union.def<F>
    export function fix<F extends readonly unknown[]>(qs: F): {} {
      return Object_assign(
        (src: unknown) => qs.every(isPredicate) ? p.union$(...qs)(src) : qs,
        def.Union({ def: qs })
      )
    }
  }

  export interface Intersect<F extends readonly Schema[]> extends Intersect.def<F> { }
  export function Intersect<F extends readonly Schema[]>(...qs: F): t.Intersect<F>
  export function Intersect<F extends readonly Schema[]>(...qs: F) { return t.Intersect.fix(qs) }
  export namespace Intersect {
    export interface def<
      T,
      F extends HKT = Type.Intersect
    > extends AST.Intersect<T> {
      _type: Kind<F, T>
      (u: unknown): u is this['_type']
    }
    //
    export function fix<F extends readonly unknown[]>(qs: F): t.Intersect.def<F>
    export function fix<F extends readonly unknown[]>(qs: F): {} {
      return Object_assign(
        (src: unknown) => qs.every(isPredicate) ? p.intersect$(...qs)(src) : qs,
        def.Intersect({ def: qs })
      )
    }
  }

  export const Functor: T.Functor<t.Free, t.Fixpoint> = {
    map(f) {
      return (x) => {
        switch (true) {
          default: return fn.exhaustive(x)
          case t.isLeaf(x): return x
          case x.tag === URI.array: return Array.fix(f(x.def))
          case x.tag === URI.record: return Record.fix(f(x.def))
          case x.tag === URI.optional: return Optional.fix(f(x.def))
          case x.tag === URI.tuple: return Tuple.fix(fn.map(x.def, f))
          case x.tag === URI.object: return Object.fix(fn.map(x.def, f))
          case x.tag === URI.union: return Union.fix(fn.map(x.def, f))
          case x.tag === URI.intersect: return Intersect.fix(fn.map(x.def, f))
        }
      }
    }
  }

  export namespace Recursive {
    const typeName = <T>(x: t.F<T>) => x.tag.substring(NS.length)

    export const toString: T.Functor.Algebra<t.Free, string> = (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isLeaf(x): return 't.' + typeName(x)
        case x.tag === URI.array: return `t.${typeName(x)}(${x.def})`
        case x.tag === URI.record: return `t.${typeName(x)}(${x.def})`
        case x.tag === URI.optional: return `t.${typeName(x)}(${x.def})`
        case x.tag === URI.tuple: return `t.${typeName(x)}(${x.def.join(', ')})`
        case x.tag === URI.union: return `t.${typeName(x)}(${x.def.join(', ')})`
        case x.tag === URI.intersect: return `t.${typeName(x)}(${x.def.join(', ')})`
        case x.tag === URI.object: {
          const xs = Object_entries(x.def)
          return xs.length === 0
            ? `t.${typeName(x)}({})`
            : `t.${typeName(x)}({ ${xs.map(([k, v]) => parseKey(k) + `: ${v}`).join(', ')} })`
        }
      }
    }


    export const toTypeString: T.Functor.Algebra<t.Free, string> = (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isLeaf(x): return typeName(x)
        case x.tag === URI.array: return `(${trim(x.def)})[]`
        case x.tag === URI.record: return `Record<string, ${trim(x.def)}>`
        case x.tag === URI.optional: return `${OPT}${trim(x.def)} | undefined`
        case x.tag === URI.tuple: return `[${x.def.map(trim).join(', ')}]`
        case x.tag === URI.union: return `(${x.def.map(trim).join(' | ')})`
        case x.tag === URI.intersect: return `${x.def.map(trim).join(' & ')}`
        case x.tag === URI.object: {
          const xs = Object_entries(x.def)
          return xs.length === 0
            ? `{}`
            : `{ ${xs.map(([k, v]) => parseKey(k) + (v.startsWith(OPT) ? '?' : '') + `: ${trim(v)}`).join(', ')} }`
        }
      }
    }
  }

  export const fold = fn.cata(t.Functor)
  export const unfold = fn.ana(t.Functor)
  export const toString = fn.cata(t.Functor)(Recursive.toString)
  export const toTypeString
    : <S extends Fixpoint>(schema: S) => string
    = (schema) => trim(fn.cata(t.Functor)(Recursive.toTypeString)(schema))
}

const schema = t.Object({ a: t.Optional(t.Number), b: t.String })
type tt = t.typeOf<typeof schema>
