import { z } from 'zod4'
import type * as T from '@traversable/registry'
import { fn } from '@traversable/registry'

import type { Ctx } from './utils-v4.js'
import { Tag, tagged } from './typename-v4.js'

export type Options = {
  initialIndex?: (string | number)[]
  namespaceAlias?: string
}

export interface Config extends Required<Options> {}

export const functorDefaultOptions = {
  initialIndex: Array.of<string | number>(),
  namespaceAlias: 'z',
} satisfies Config

type EnumEntries<T>
  = unknown extends T ? Record<string, number | string>
  : T extends readonly (keyof any)[] ? { [I in T[number]]: I }
  : T

export declare namespace Z {
  type lookup<K extends keyof Tag, S = unknown> = Z.catalog<S>[Tag[K]]
  type catalog<S = unknown> = {
    // nullary
    [Tag.any]: Z.Any
    [Tag.bigint]: Z.BigInt
    [Tag.boolean]: Z.Boolean
    [Tag.date]: Z.Date
    [Tag.nan]: Z.NaN
    [Tag.never]: Z.Never
    [Tag.null]: Z.Null
    [Tag.number]: Z.Number
    [Tag.string]: Z.String
    [Tag.symbol]: Z.Symbol
    [Tag.undefined]: Z.Undefined
    [Tag.unknown]: Z.Unknown
    [Tag.void]: Z.Void
    [Tag.int]: Z.Integer,
    // nullary-ish
    [Tag.literal]: Z.Literal
    [Tag.enum]: Z.Enum
    [Tag.file]: Z.File
    [Tag.template_literal]: Z.TemplateLiteral
    // unary
    [Tag.array]: Z.Array<S>
    [Tag.catch]: Z.Catch<S>
    [Tag.default]: Z.Default<S>
    [Tag.lazy]: Z.Lazy<S>
    [Tag.map]: Z.Map<S>
    [Tag.nullable]: Z.Nullable<S>
    [Tag.object]: Z.Object<S>
    [Tag.optional]: Z.Optional<S>
    [Tag.readonly]: Z.Readonly<S>
    [Tag.record]: Z.Record<S>
    [Tag.set]: Z.Set<S>
    [Tag.tuple]: Z.Tuple<S>
    [Tag.union]: Z.Union<S>
    [Tag.intersection]: Z.Intersection<S>
    [Tag.pipe]: Z.Pipe<S>
    [Tag.custom]: Z.Custom<S>
    [Tag.nonoptional]: Z.NonOptional<S>
    [Tag.success]: Z.Success<S>
    [Tag.transform]: Z.Transform<S>
    /** @deprecated */
    [Tag.promise]: Z.Promise<S>
  }

  interface Never { _zod: { def: { type: Tag['never'] } } }
  interface Any { _zod: { def: { type: Tag['any'] } } }
  interface Unknown { _zod: { def: { type: Tag['unknown'] } } }
  interface Undefined { _zod: { def: { type: Tag['undefined'] } } }
  interface Null { _zod: { def: { type: Tag['null'] } } }
  interface Void { _zod: { def: { type: Tag['void'] } } }
  interface NaN { _zod: { def: { type: Tag['nan'] } } }
  interface Symbol { _zod: { def: { type: Tag['symbol'] } } }
  interface Boolean { _zod: { def: { type: Tag['boolean'] } } }
  interface BigInt { _zod: { def: { type: Tag['bigint'] } } }
  interface Number { _zod: { def: { type: Tag['number'], checks?: Number.Check[] } }, isInt: boolean }
  interface Integer { _zod: { def: { type: Tag['int'], checks?: Integer.Check[] } } }
  interface String extends String.Proto { _zod: { def: { type: Tag['string'] } } }
  interface Date { _zod: { def: { type: Tag['date'] } } }
  interface File { _zod: { def: { type: Tag['file'] } } }

  interface Enum<N = unknown> { _zod: { def: { type: Tag['enum'], entries: EnumEntries<N> } } }
  interface Literal<N = unknown> { _zod: { def: { type: Tag['literal'], values: N[] } } }
  interface TemplateLiteral { _zod: { def: { type: Tag['template_literal'], parts: unknown[] } } }

  interface Optional<S = unknown> { _zod: { def: { type: Tag['optional'], innerType: S } } }
  interface Nullable<S = unknown> { _zod: { def: { type: Tag['nullable'], innerType: S } } }
  interface Array<S = unknown> extends Omit<z.ZodArray, '_zod'> { _zod: { def: { type: Tag['array'], element: S } } }
  interface Set<S = unknown> { _zod: { def: { type: Tag['set'], valueType: S } } }
  interface Map<S = unknown> { _zod: { def: { type: Tag['map'], keyType: S, valueType: S } } }
  interface Readonly<S = unknown> { _zod: { def: { type: Tag['readonly'], innerType: S } } }
  interface Object<S = unknown> extends Omit<z.core.$ZodObject, '_zod'> { _zod: { def: { type: Tag['object'], shape: { [x: string]: S }, catchall?: S } } }
  interface Record<S = unknown> { _zod: { def: { type: Tag['record'], keyType: S, valueType: S } } }
  interface Tuple<S = unknown> extends Omit<z.core.$ZodTuple, '_zod'> { _zod: { def: { type: Tag['tuple'], items: [S, ...S[]], rest?: S } } }
  interface Lazy<S = unknown> { _zod: { def: { type: Tag['lazy'], getter(): S } } }
  interface Intersection<S = unknown> { _zod: { def: { type: Tag['intersection'], left: S, right: S } } }
  interface Union<S = unknown> { _zod: { def: { type: Tag['union'], options: readonly [S, S, ...S[]] } } }
  interface Catch<S = unknown> { _zod: { def: { type: Tag['catch'], innerType: S, catchValue(ctx: Ctx): unknown } } }
  interface Custom<S = unknown> { _zod: { def: { type: Tag['custom'] } } }
  interface Default<S = unknown> { _zod: { def: { type: Tag['default'], innerType: S, defaultValue: (ctx: Ctx) => unknown } } }
  interface NonOptional<S = unknown> { _zod: { def: { type: Tag['nonoptional'], innerType: S } } }
  interface Pipe<S = unknown> { _zod: { def: { type: Tag['pipe'], in: S, out: S } } }
  interface Transform<S = unknown> { _zod: { def: { type: Tag['transform'], transform: (x: unknown) => S } } }
  interface Success<S = unknown> { _zod: { def: { type: Tag['success'], innerType: S } } }
  /** @deprecated */
  interface Promise<S = unknown> { _zod: { def: { type: Tag['promise'], innerType: S } } }

  /** 
   * ## {@link Nullary `Z.Hole`}
   * 
   * These are our base cases, a.k.a. terminal or "leaf" nodes
   */

  type Nullary =
    | Z.Never
    | Z.Any
    | Z.Unknown
    | Z.Void
    | Z.Undefined
    | Z.Null
    | Z.NaN
    | Z.Symbol
    | Z.Boolean
    | Z.BigInt
    | Z.Number
    | Z.String
    | Z.Date
    //
    | Z.Enum
    | Z.Literal
    | Z.TemplateLiteral

  type Unary<_> =
    | Z.Catch<_>
    | Z.Optional<_>
    | Z.Nullable<_>
    | Z.Array<_>
    | Z.Set<_>
    | Z.Map<_>
    | Z.Readonly<_>
    | Z.Object<_>
    | Z.Record<_>
    | Z.Tuple<_>
    | Z.Lazy<_>
    | Z.Intersection<_>
    | Z.Union<_>
    | Z.Default<_>
    | Z.Success<_>
    | Z.NonOptional<_>
    | Z.Pipe<_>
    | Z.Transform<_>
    /** @deprecated */
    | Z.Promise<_>

  /** 
   * ## {@link Hole `Z.Hole`}
   * 
   * The members of {@link Hole `Z.Hole`} map 1-1 to the corresponding
   * zod schema, with the important difference that __recursion is "factored out"__.
   * 
   * If you take a closer look at the type, you'll see what I mean: everywhere
   * where I would have made a recursive call has been replaced with {@link _ `_`}.
   * 
   * Why do this?
   * 
   * Well, for starters, it gives us a way to invert control.
   * 
   * This part's important, because it mirrors what we're going to do at the value-
   * level: factor out the recursion). We don't know, or care, what {@link _ `_`}
   * will be -- all we care about is preserving the surrounding structure. 
   * 
   * That lets us get out of the way. Responsibilities are clear: the caller is
   * responsible for writing the interpreter, and we're responsible for handling
   * the recursion.
   *
   * Taking this approach is more ergonomic, but it's also mathematically rigorous,
   * since it allows our Functor to be homomorphic (see the video below
   * called "Constraints Liberate, Liberties Constrain" below).
   *
   * See also:
   * - {@link Fixpoint `Z.Fixpoint`}
   * - {@link Any `z.Any`}
   * - A talk by Runar Bjarnason's called 
   * ["Constraints Liberate, Liberties Constrain"](https://www.youtube.com/watch?v=GqmsQeSzMdw)
   */
  type Hole<_> =
    | Nullary
    | Z.Catch<_>
    | Z.Optional<_>
    | Z.Nullable<_>
    | Z.Array<_>
    | Z.Set<_>
    | Z.Map<_>
    | Z.Readonly<_>
    | Z.Object<_>
    | Z.Record<_>
    | Z.Tuple<_>
    | Z.Lazy<_>
    | Z.Intersection<_>
    | Z.Union<_>
    | Z.Default<_>
    | Z.Success<_>
    | Z.NonOptional<_>
    | Z.Pipe<_>
    | Z.Transform<_>
    /** @deprecated */
    | Z.Promise<_>

  /**
   * ## {@link Fixpoint `Z.Fixpoint`}
   *
   * This (I believe) is our Functor's greatest fix-point.
   * Similar to {@link Hole `Z.Hole`}, except rather than taking
   * a type parameter, it "fixes" its value to itself.
   * 
   * Interestingly, in TypeScript (and I would imagine most languages),
   * there's no obvious way to implement {@link Fixpoint `Z.Fixpoint`}
   * in terms of {@link Hole `Z.Hole`}. If you're not sure what I
   * mean, it might be a useful exercise to try, since it will give you
   * some intuition for why adding constraints prematurely might cause
   * us probems down the line.
   */

  type Fixpoint =
    | Nullary
    | Z.Catch<Fixpoint>
    | Z.Optional<Fixpoint>
    | Z.Nullable<Fixpoint>
    | Z.Array<Fixpoint>
    | Z.Set<Fixpoint>
    | Z.Map<Fixpoint>
    | Z.Readonly<Fixpoint>
    | Z.Object<Fixpoint>
    | Z.Record<Fixpoint>
    | Z.Tuple<Fixpoint>
    | Z.Lazy<Fixpoint>
    | Z.Intersection<Fixpoint>
    | Z.Union<Fixpoint>
    | Z.Default<Fixpoint>
    | Z.Success<Fixpoint>
    | Z.NonOptional<Fixpoint>
    | Z.Pipe<Fixpoint>
    | Z.Transform<Fixpoint>
    /** @deprecated */
    | Z.Promise<Fixpoint>

  /**
   * ## {@link Free `Z.Free`}
   * 
   * Makes {@link Hole Z.Hole} higher-kinded 
   */
  interface Free extends T.HKT { [-1]: Z.Hole<this[0]> }

  namespace Integer { interface Check {} }
  namespace Number {
    type GTE = { check: 'greater_than', value: number, inclusive: true }
    type GT = { check: 'greater_than', value: number, inclusive: false }
    type LTE = { check: 'less_than', value: number, inclusive: true }
    type LT = { check: 'less_than', value: number, inclusive: false }
    type Format = { format: string }
    type CheckVariant = GTE | GT | LTE | LT | Format
    interface Check { _zod: { def: CheckVariant } }
  }

  namespace String {
    interface Proto {
      minLength: null | number
      maxLength: null | number
    }
  }

  namespace Array {
    interface Proto {
      minLength: null | { value: number }
      maxLength: null | { value: number }
      exactLength: null | { value: number }
    }
  }
}

export const Functor: T.Functor<Z.Free, Any> = {
  map(g) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        //   leaves, a.k.a. terminal or "nullary" types
        case tagged('never')(x): return x
        case tagged('any')(x): return x
        case tagged('unknown')(x): return x
        case tagged('void')(x): return x
        case tagged('undefined')(x): return x
        case tagged('null')(x): return x
        case tagged('symbol')(x): return x
        case tagged('nan')(x): return x
        case tagged('boolean')(x): return x
        case tagged('bigint')(x): return x
        case tagged('date')(x): return x
        case tagged('number')(x): return x
        case tagged('string')(x): return x
        case tagged('enum')(x): return x
        case tagged('literal')(x): return x
        case tagged('template_literal')(x): return x
        //   branches, a.k.a. non-terminal or "unary" types
        case tagged('array')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, element: g(x._zod.def.element) } } }
        case tagged('record')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, keyType: g(x._zod.def.keyType), valueType: g(x._zod.def.valueType) } } }
        case tagged('optional')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType) } } }
        case tagged('union')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, options: fn.map(x._zod.def.options, g) } } }
        case tagged('intersection')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, left: g(x._zod.def.left), right: g(x._zod.def.right) } } }
        case tagged('promise')(x): return { ...x, _zod: { ...x._zod.def, def: { ...x._zod.def, innerType: g(x._zod.def.innerType) } } }
        case tagged('catch')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType) } } }
        case tagged('success')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType) } } }
        case tagged('default')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType) } } }
        case tagged('readonly')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType) } } }
        case tagged('nullable')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType) } } }
        case tagged('lazy')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, getter: () => g(x._zod.def.getter()) } } }
        case tagged('set')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, valueType: g(x._zod.def.valueType) } } }
        case tagged('pipe')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, in: g(x._zod.def.in), out: g(x._zod.def.out) } } }
        case tagged('map')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, keyType: g(x._zod.def.keyType), valueType: g(x._zod.def.valueType) } } }
        case tagged('nonoptional')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType) } } }
        case tagged('transform')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, transform: fn.flow(x._zod.def.transform, g) } } }
        case tagged('tuple')(x): {
          const { items, rest, ...def } = x._zod.def
          return { ...x, _zod: { ...x._zod, def: { ...def, items: fn.map(items, g), ...rest && { rest: g(rest) } } } }
        }
        case tagged('object')(x): {
          const { shape, catchall, ...def } = x._zod.def
          return { ...x, _zod: { ...x._zod, def: { ...def, shape: fn.map(shape, g), ...catchall && { catchall: g(catchall) } } } }
        }
      }
    }
  }
}

export const IndexedFunctor: T.Functor.Ix<(string | number)[], Z.Free, Any> = {
  map: Functor.map,
  mapWithIndex(g) {
    return (x, ix) => {
      switch (true) {
        default: return (console.error('Exhaustive failure: ', x), fn.exhaustive(x))
        case tagged('promise')(x): return { ...x, _zod: { ...x._zod.def, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix) } } }
        //// unimplemented
        case tagged('custom')(x): return x
        //// leaves, a.k.a "nullary" types
        case tagged('never')(x): return x
        case tagged('any')(x): return x
        case tagged('unknown')(x): return x
        case tagged('void')(x): return x
        case tagged('undefined')(x): return x
        case tagged('null')(x): return x
        case tagged('symbol')(x): return x
        case tagged('nan')(x): return x
        case tagged('boolean')(x): return x
        case tagged('bigint')(x): return x
        case tagged('date')(x): return x
        case tagged('number')(x): return x
        case tagged('string')(x): return x
        case tagged('file')(x): return x
        case tagged('enum')(x): return x
        case tagged('literal')(x): return x
        case tagged('template_literal')(x): return x
        //// branches, a.k.a. "unary" types
        case tagged('array')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, element: g(x._zod.def.element, ix) } } }
        case tagged('record')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, keyType: g(x._zod.def.keyType, ix), valueType: g(x._zod.def.valueType, ix) } } }
        case tagged('optional')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix) } } }
        case tagged('union')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, options: fn.map(x._zod.def.options, (v) => g(v, ix)) } } }
        case tagged('intersection')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, left: g(x._zod.def.left, ix), right: g(x._zod.def.right, ix) } } }
        case tagged('catch')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix) } } }
        case tagged('success')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix) } } }
        case tagged('default')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix) } } }
        case tagged('readonly')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix) } } }
        case tagged('nullable')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix) } } }
        case tagged('lazy')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, getter: () => g(x._zod.def.getter(), ix) } } }
        case tagged('set')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, valueType: g(x._zod.def.valueType, ix) } } }
        case tagged('pipe')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, in: g(x._zod.def.in, ix), out: g(x._zod.def.out, ix) } } }
        case tagged('map')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, keyType: g(x._zod.def.keyType, ix), valueType: g(x._zod.def.valueType, ix) } } }
        case tagged('nonoptional')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix) } } }
        case tagged('transform')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, transform: fn.flow(x._zod.def.transform, (y) => g(y, ix)) } } }
        // case tagged('transform')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, transform: fn.flow(x._zod.def.transform, (y) => g(y, ix)) } } }
        case tagged('tuple')(x): {
          const { items, rest, ...def } = x._zod.def
          return { ...x, _zod: { ...x._zod, def: { ...def, items: fn.map(items, (v, i) => g(v, [...ix, i])), ...rest && { rest: g(rest, ix) } } } }
        }
        case tagged('object')(x): {
          const { shape, catchall, ...def } = x._zod.def
          return { ...x, _zod: { ...x._zod, def: { ...def, shape: fn.map(shape, (v, k) => g(v, [...ix, k])), ...catchall && { catchall: g(catchall, ix) } } } }
        }
      }
    }
  }
}

export declare namespace Functor {
  interface Index {
    depth: number
    path: (keyof any)[]
  }
}

export const fold = fn.cataIx(IndexedFunctor, [])

export type Any<T extends z.core.$ZodType = z.core.$ZodType> =
  | z.ZodAny
  | z.ZodUnion<readonly [T, ...T[]]>
  | z.ZodArray<T>
  | z.ZodBigInt
  | z.ZodBoolean
  | z.ZodCatch<T>
  | z.ZodDate
  | z.ZodDefault<T>
  | z.ZodEnum<Record<string, string | number>>
  | z.ZodIntersection<T, T>
  | z.ZodLazy<T>
  | z.ZodLiteral<z.core.util.Primitive>
  | z.ZodMap<T, T>
  | z.ZodNaN
  | z.ZodNever
  | z.ZodNull
  | z.ZodNullable<T>
  | z.ZodNumber
  | z.ZodObject<{ [x: string]: T }>
  | z.ZodArray<T>
  | z.ZodPipe<T, T>
  | z.ZodPromise<T>
  | z.ZodReadonly<T>
  | z.ZodRecord<z.ZodString, T>
  | z.ZodSet<T>
  | z.ZodString
  | z.ZodSymbol
  | z.ZodTuple<[T, ...T[]], T | null>
  | z.ZodUndefined
  | z.ZodUnknown
  | z.ZodVoid
