import { z } from 'zod/v4'
import type * as T from '@traversable/registry'
import { fn, has } from '@traversable/registry'

import type { Ctx } from './utils.js'
import type { AnyTypeName } from './typename.js'
import { TypeName, tagged } from './typename.js'

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
  type Lookup<K extends AnyTypeName, S = unknown> = Z.Catalog<S>[TypeName[K]]
  type Catalog<S = unknown> = {
    // nullary
    [TypeName.any]: Z.Any
    [TypeName.bigint]: Z.BigInt
    [TypeName.boolean]: Z.Boolean
    [TypeName.date]: Z.Date
    [TypeName.nan]: Z.NaN
    [TypeName.never]: Z.Never
    [TypeName.null]: Z.Null
    [TypeName.number]: Z.Number
    [TypeName.string]: Z.String
    [TypeName.symbol]: Z.Symbol
    [TypeName.undefined]: Z.Undefined
    [TypeName.unknown]: Z.Unknown
    [TypeName.void]: Z.Void
    [TypeName.int]: Z.Integer,
    // nullary-ish
    [TypeName.literal]: Z.Literal
    [TypeName.enum]: Z.Enum
    [TypeName.file]: Z.File
    [TypeName.template_literal]: Z.TemplateLiteral
    // unary
    [TypeName.array]: Z.Array<S>
    [TypeName.catch]: Z.Catch<S>
    [TypeName.default]: Z.Default<S>
    [TypeName.lazy]: Z.Lazy<S>
    [TypeName.map]: Z.Map<S>
    [TypeName.nullable]: Z.Nullable<S>
    [TypeName.object]: Z.Object<S>
    [TypeName.optional]: Z.Optional<S>
    [TypeName.prefault]: Z.Prefault<S>
    [TypeName.readonly]: Z.Readonly<S>
    [TypeName.record]: Z.Record<S>
    [TypeName.set]: Z.Set<S>
    [TypeName.tuple]: Z.Tuple<S>
    [TypeName.union]: Z.Union<S>
    [TypeName.intersection]: Z.Intersection<S>
    [TypeName.pipe]: Z.Pipe<S>
    [TypeName.custom]: Z.Custom<S>
    [TypeName.nonoptional]: Z.NonOptional<S>
    [TypeName.success]: Z.Success<S>
    [TypeName.transform]: Z.Transform<S>
    /** @deprecated */
    [TypeName.promise]: Z.Promise<S>
  }

  type ZodLookup<K extends AnyTypeName, T extends z.ZodType = z.ZodType> = ZodCatalog<T>[TypeName[K]]
  type ZodCatalog<T extends z.ZodType> = {
    // nullary
    [TypeName.any]: z.ZodAny
    [TypeName.bigint]: z.ZodBigInt
    [TypeName.boolean]: z.ZodBoolean
    [TypeName.date]: z.ZodDate
    [TypeName.nan]: z.ZodNaN
    [TypeName.never]: z.ZodNever
    [TypeName.null]: z.ZodNull
    [TypeName.number]: z.ZodNumber
    [TypeName.string]: z.ZodString
    [TypeName.symbol]: z.ZodSymbol
    [TypeName.undefined]: z.ZodUndefined
    [TypeName.unknown]: z.ZodUnknown
    [TypeName.void]: z.ZodVoid
    [TypeName.int]: z.ZodNumber,
    // nullary-ish
    [TypeName.literal]: z.ZodLiteral
    [TypeName.enum]: z.ZodEnum
    [TypeName.file]: z.ZodFile
    [TypeName.template_literal]: z.ZodTemplateLiteral
    // unary
    [TypeName.array]: z.ZodArray<T>
    [TypeName.catch]: z.ZodCatch<T>
    [TypeName.default]: z.ZodDefault<T>
    [TypeName.lazy]: z.ZodLazy<T>
    [TypeName.map]: z.ZodMap<T>
    [TypeName.nullable]: z.ZodNullable<T>
    [TypeName.object]: z.ZodObject<{ [x: string]: T }>
    [TypeName.optional]: z.ZodOptional<T>
    [TypeName.prefault]: z.ZodPrefault<T>
    [TypeName.readonly]: z.ZodReadonly<T>
    [TypeName.record]: z.ZodRecord<z.core.$ZodRecordKey, T>
    [TypeName.set]: z.ZodSet<T>
    [TypeName.tuple]: z.ZodTuple<[T, ...T[]], T>
    [TypeName.union]: z.ZodUnion<T[]>
    [TypeName.intersection]: z.ZodIntersection<T, T>
    [TypeName.pipe]: z.ZodPipe<T, T>
    [TypeName.custom]: z.ZodCustom<T, T>
    [TypeName.nonoptional]: z.ZodNonOptional<T>
    [TypeName.success]: z.ZodSuccess<T>
    [TypeName.transform]: z.ZodTransform<T, T>
    /** @deprecated */
    [TypeName.promise]: z.ZodPromise<T>
  }

  interface Proto { safeParse(x: unknown): { success: boolean } }

  interface Never extends Proto { _zod: { def: { type: TypeName['never'] } } }
  interface Any extends Proto { _zod: { def: { type: TypeName['any'] } } }
  interface Unknown extends Proto { _zod: { def: { type: TypeName['unknown'] } } }
  interface Undefined extends Proto { _zod: { def: { type: TypeName['undefined'] } } }
  interface Null extends Proto { _zod: { def: { type: TypeName['null'] } } }
  interface Void extends Proto { _zod: { def: { type: TypeName['void'] } } }
  interface NaN extends Proto { _zod: { def: { type: TypeName['nan'] } } }
  interface Symbol extends Proto { _zod: { def: { type: TypeName['symbol'] } } }
  interface Boolean extends Proto { _zod: { def: { type: TypeName['boolean'] } } }
  interface BigInt extends Proto { _zod: { def: { type: TypeName['bigint'] } } }
  interface Number extends Proto { _zod: { def: { type: TypeName['number'], checks?: Number.Check[] } }, isInt: boolean }
  interface Integer extends Proto { _zod: { def: { type: TypeName['int'], checks?: Integer.Check[] } } }
  interface String extends Proto, String.Proto { _zod: { def: { type: TypeName['string'] } } }
  interface Date extends Proto { _zod: { def: { type: TypeName['date'] } } }
  interface File extends Proto { _zod: { def: { type: TypeName['file'] } } }

  interface Enum<N = unknown> extends Proto { _zod: { def: { type: TypeName['enum'], entries: EnumEntries<N> } } }
  interface Literal<N = unknown> extends Proto { _zod: { def: { type: TypeName['literal'], values: N[] } } }
  interface TemplateLiteral extends Proto { _zod: { def: { type: TypeName['template_literal'], parts: unknown[] } } }

  interface Optional<S = unknown> extends Proto { _zod: { def: { type: TypeName['optional'], innerType: S } } }
  interface Nullable<S = unknown> extends Proto { _zod: { def: { type: TypeName['nullable'], innerType: S } } }
  interface Array<S = unknown> extends Omit<z.ZodArray, '_zod'> { _zod: { def: { type: TypeName['array'], element: S } } }
  interface Set<S = unknown> extends Proto { _zod: { def: { type: TypeName['set'], valueType: S } } }
  interface Map<S = unknown> extends Proto { _zod: { def: { type: TypeName['map'], keyType: S, valueType: S } } }
  interface Readonly<S = unknown> extends Proto { _zod: { def: { type: TypeName['readonly'], innerType: S } } }
  interface Object<S = unknown> extends Proto, Omit<z.core.$ZodObject, '_zod'> { _zod: { def: { type: TypeName['object'], shape: { [x: string]: S }, catchall?: S } } }
  interface Record<S = unknown> extends Proto { _zod: { def: { type: TypeName['record'], keyType: S, valueType: S } } }
  interface Tuple<S = unknown> extends Proto, Omit<z.core.$ZodTuple, '_zod'> { _zod: { def: { type: TypeName['tuple'], items: [S, ...S[]], rest?: S } } }
  interface Lazy<S = unknown> extends Proto { _zod: { def: { type: TypeName['lazy'], getter(): S } } }
  interface Intersection<S = unknown> extends Proto { _zod: { def: { type: TypeName['intersection'], left: S, right: S } } }
  interface Union<S = unknown> extends Proto { _zod: { def: { type: TypeName['union'], options: readonly [S, S, ...S[]] } } }
  interface Catch<S = unknown> extends Proto { _zod: { def: { type: TypeName['catch'], innerType: S, catchValue(ctx: Ctx): unknown } } }
  interface Custom<S = unknown> extends Proto { _zod: { def: { type: TypeName['custom'] } } }
  interface Default<S = unknown> extends Proto { _zod: { def: { type: TypeName['default'], innerType: S, defaultValue: (ctx: Ctx) => unknown } } }
  interface Prefault<S = unknown> extends Proto { _zod: { def: { type: TypeName['prefault'], innerType: S, defaultValue: (ctx: Ctx) => unknown } } }
  interface NonOptional<S = unknown> extends Proto { _zod: { def: { type: TypeName['nonoptional'], innerType: S } } }
  interface Pipe<S = unknown> extends Proto { _zod: { def: { type: TypeName['pipe'], in: S, out: S } } }
  interface Transform<S = unknown> extends Proto { _zod: { def: { type: TypeName['transform'], transform: (x: unknown) => S } } }
  interface Success<S = unknown> extends Proto { _zod: { def: { type: TypeName['success'], innerType: S } } }
  /** @deprecated */
  interface Promise<S = unknown> extends Proto { _zod: { def: { type: TypeName['promise'], innerType: S } } }

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
    | Z.File
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
    | Z.Prefault<_>
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
    | Z.Prefault<Fixpoint>
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

export type Algebra<T> = T.IndexedAlgebra<(string | number)[], Z.Free, T>
// export type RCoalgebra<T> = T.RCoalgebra<Z.Free, T>

export { In as in }
function In<T extends z.ZodType>(x: T): Z.Hole<T>
function In<T extends z.core.$ZodType>(x: T): Z.Hole<T>
function In<T extends z.ZodType>(x: T) { return x }

export { Out as out }
function Out<T>(x: Z.Hole<T>): T
function Out<T>(x: Z.Hole<T>) { return x }

export function lift<T>(f: (x: T) => T): Algebra<T>
export function lift<T>(f: (x: T) => T) { return f }

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
        case tagged('file')(x): return x
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
        case tagged('prefault')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType) } } }
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

export const IndexedFunctor: T.Functor.Ix<(string | number)[], Z.Free> = {
  map: Functor.map,
  mapWithIndex(g) {
    return (x, ix) => {
      switch (true) {
        default: return fn.exhaustive(x)
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
        case tagged('prefault')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix) } } }
        case tagged('readonly')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix) } } }
        case tagged('nullable')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix) } } }
        case tagged('lazy')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, getter: () => g(x._zod.def.getter(), ix) } } }
        case tagged('set')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, valueType: g(x._zod.def.valueType, ix) } } }
        case tagged('pipe')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, in: g(x._zod.def.in, ix), out: g(x._zod.def.out, ix) } } }
        case tagged('map')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, keyType: g(x._zod.def.keyType, ix), valueType: g(x._zod.def.valueType, ix) } } }
        case tagged('nonoptional')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix) } } }
        case tagged('transform')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, transform: fn.flow(x._zod.def.transform, (y) => g(y, ix)) } } }
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
export const foldPara = fn.para(Functor)

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

export type NullaryTypeName = Z.Nullary['_zod']['def']['type']
export const nullaryTypeNames = [
  'any',
  'bigint',
  'boolean',
  'date',
  'enum',
  'literal',
  'nan',
  'never',
  'null',
  'number',
  'string',
  'symbol',
  'template_literal',
  'undefined',
  'unknown',
  'void',
] as const satisfies NullaryTypeName[]

export const isNullaryTypeName = (x: unknown): x is NullaryTypeName => typeof x === 'string' && nullaryTypeNames.includes(x as never)
export const isNullary = (x: unknown): x is Z.Nullary => has('_zod', 'def', 'type', isNullaryTypeName)(x)
