import * as z from 'zod/v4/core'
import type * as T from '@traversable/registry'
import { fn, has, symbol } from '@traversable/registry'

import type { Ctx } from './utils.js'
import { indexAccessor, isOptional, keyAccessor, Invariant } from './utils.js'
import type { AnyTypeName } from './typename.js'
import { TypeName, tagged, hasTypeName } from './typename.js'

export type Options = {
  initialIndex?: (string | number)[]
  namespaceAlias?: string
}

export interface Config extends Required<Options> {}

export type Index = {
  path: (keyof any)[]
  seen: WeakMap<WeakKey, unknown>
}

export const functorDefaultOptions = {
  initialIndex: Array.of<string | number>(),
  namespaceAlias: 'z',
} satisfies Config

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
    [TypeName.file]: Z.File
    [TypeName.template_literal]: Z.TemplateLiteral
    [TypeName.enum]: Z.Enum<S>
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

  type ZodLookup<K extends AnyTypeName, T extends z.$ZodType = z.$ZodType> = ZodCatalog<T>[TypeName[K]]
  type ZodCatalog<T extends z.$ZodType> = {
    // nullary
    [TypeName.any]: z.$ZodAny
    [TypeName.bigint]: z.$ZodBigInt
    [TypeName.boolean]: z.$ZodBoolean
    [TypeName.date]: z.$ZodDate
    [TypeName.nan]: z.$ZodNaN
    [TypeName.never]: z.$ZodNever
    [TypeName.null]: z.$ZodNull
    [TypeName.number]: z.$ZodNumber
    [TypeName.string]: z.$ZodString
    [TypeName.symbol]: z.$ZodSymbol
    [TypeName.undefined]: z.$ZodUndefined
    [TypeName.unknown]: z.$ZodUnknown
    [TypeName.void]: z.$ZodVoid
    [TypeName.int]: z.$ZodNumber,
    // nullary-ish
    [TypeName.literal]: z.$ZodLiteral
    [TypeName.enum]: z.$ZodEnum
    [TypeName.file]: z.$ZodFile
    [TypeName.template_literal]: z.$ZodTemplateLiteral
    // unary
    [TypeName.array]: z.$ZodArray<T>
    [TypeName.catch]: z.$ZodCatch<T>
    [TypeName.default]: z.$ZodDefault<T>
    [TypeName.lazy]: z.$ZodLazy<T>
    [TypeName.map]: z.$ZodMap<T>
    [TypeName.nullable]: z.$ZodNullable<T>
    [TypeName.object]: z.$ZodObject<{ [x: string]: T }>
    [TypeName.optional]: z.$ZodOptional<T>
    [TypeName.prefault]: z.$ZodPrefault<T>
    [TypeName.readonly]: z.$ZodReadonly<T>
    [TypeName.record]: z.$ZodRecord<z.$ZodRecordKey, T>
    [TypeName.set]: z.$ZodSet<T>
    [TypeName.tuple]: z.$ZodTuple<[T, ...T[]], T>
    [TypeName.union]: z.$ZodUnion<T[]>
    [TypeName.intersection]: z.$ZodIntersection<T, T>
    [TypeName.pipe]: z.$ZodPipe<T, T>
    [TypeName.custom]: z.$ZodCustom<T, T>
    [TypeName.nonoptional]: z.$ZodNonOptional<T>
    [TypeName.success]: z.$ZodSuccess<T>
    [TypeName.transform]: z.$ZodTransform<T, T>
    /** @deprecated */
    [TypeName.promise]: z.$ZodPromise<T>
  }

  interface Proto { safeParse(x: unknown): { success: boolean } }
  interface Bag {}

  interface Never extends Proto { _zod: { def: { type: TypeName['never'] } } }
  interface Any extends Proto { _zod: { def: { type: TypeName['any'] } } }
  interface Unknown extends Proto { _zod: { def: { type: TypeName['unknown'] } } }
  interface Undefined extends Proto { _zod: { def: { type: TypeName['undefined'] } } }
  interface Null extends Proto { _zod: { def: { type: TypeName['null'] } } }
  interface Void extends Proto { _zod: { def: { type: TypeName['void'] } } }
  interface NaN extends Proto { _zod: { def: { type: TypeName['nan'] } } }
  interface Symbol extends Proto { _zod: { def: { type: TypeName['symbol'] } } }
  interface Boolean extends Proto { _zod: { def: { type: TypeName['boolean'] } } }
  interface BigInt extends Proto { _zod: { def: { type: TypeName['bigint'] }, bag: BigInt.Bag } }
  interface Number extends Proto { _zod: { def: { type: TypeName['number'], checks?: Number.Check[] }, bag: Number.Bag }, isInt: boolean }
  interface Integer extends Proto, Number.Bag { _zod: { def: { type: TypeName['int'], checks?: Integer.Check[] }, bag: Integer.Bag } }
  interface String extends Proto, String.Bag { _zod: { def: { type: TypeName['string'] } } }
  interface Date extends Proto { _zod: { def: { type: TypeName['date'] } } }
  interface File extends Proto { _zod: { def: { type: TypeName['file'] } } }

  interface Enum<N = unknown> extends Proto { _zod: { def: { type: TypeName['enum'], entries: N }, values: globalThis.Set<string | number> } }
  interface Literal<N = unknown> extends Proto { _zod: { def: { type: TypeName['literal'], values: N[] } } }
  interface TemplateLiteral extends Proto { _zod: { def: { type: TypeName['template_literal'], parts: unknown[] }, pattern: RegExp } }

  interface Optional<S = unknown> extends Proto { _zod: { def: { type: TypeName['optional'], innerType: S } } }
  interface Nullable<S = unknown> extends Proto { _zod: { def: { type: TypeName['nullable'], innerType: S } } }
  interface Array<S = unknown> extends Omit<z.$ZodArray, '_zod'> { _zod: { def: { type: TypeName['array'], element: S }, bag: Array.Bag } }
  interface Set<S = unknown> extends Proto { _zod: { def: { type: TypeName['set'], valueType: S } } }
  interface Map<S = unknown> extends Proto { _zod: { def: { type: TypeName['map'], keyType: S, valueType: S } } }
  interface Readonly<S = unknown> extends Proto { _zod: { def: { type: TypeName['readonly'], innerType: S } } }
  interface Object<S = unknown> extends Proto, Omit<z.$ZodObject, '_zod'> { _zod: { def: { type: TypeName['object'], shape: { [x: string]: S }, catchall?: S } } }
  interface Record<S = unknown> extends Proto { _zod: { def: { type: TypeName['record'], keyType: S, valueType: S } } }
  interface Tuple<S = unknown> extends Proto, Omit<z.$ZodTuple, '_zod'> { _zod: { def: { type: TypeName['tuple'], items: [S, ...S[]], rest?: S } } }
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
    | Z.Literal
    | Z.TemplateLiteral

  type Unary<_> =
    | Z.Enum<_>
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
    | Z.Enum<_>
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
    | Z.Enum<Fixpoint>
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

  interface NumericBag<T> {
    minimum?: T
    maximum?: T
    exclusiveMinimum?: T
    exclusiveMaximum?: T
    multipleOf?: T
  }

  namespace BigInt {
    interface Bag extends NumericBag<bigint> {}
  }

  namespace Integer {
    interface Bag extends NumericBag<number> {}
  }

  namespace Number {
    interface Bag extends NumericBag<number> {}
    type GTE = { check: 'greater_than', value: number, inclusive: true }
    type GT = { check: 'greater_than', value: number, inclusive: false }
    type LTE = { check: 'less_than', value: number, inclusive: true }
    type LT = { check: 'less_than', value: number, inclusive: false }
    type Format = { format: string }
    type CheckVariant = GTE | GT | LTE | LT | Format
    interface Check { _zod: { def: CheckVariant } }
  }

  namespace String {
    interface Bag {
      minLength?: number
      maxLength?: number
    }
  }

  namespace Array {
    interface Bag {
      minimum?: number
      maximum?: number
      length?: number
    }
  }
}

export type Algebra<T> = T.IndexedAlgebra<(string | number)[], Z.Free, T>
export type CompilerAlgebra<T> = { (src: T.Kind<Z.Free, T>, ix: CompilerIndex, input: any): T }
export interface CompilerIndex {
  dataPath: (string | number)[]
  isOptional: boolean
  isProperty: boolean
  schemaPath: (keyof any)[]
  varName: string
}
export interface EqCompilerIndex {
  depth: number
  dataPath: (string | number)[]
  isOptional: boolean
  isProperty: boolean
  schemaPath: (keyof any)[]
  leftName: string
  rightName: string
}

export const defaultEqIndex = {
  dataPath: [],
  depth: 0,
  isOptional: false,
  isProperty: false,
  leftName: 'l',
  rightName: 'r',
  schemaPath: [],
} satisfies EqCompilerIndex

export { In as in }
function In<T extends z.$ZodType>(x: T): Z.Hole<T>
function In<T>(x: T): Z.Hole<T>
function In<T extends z.$ZodType>(x: T) { return x }

export { Out as out }
function Out<T>(x: Z.Hole<T>): T
function Out<T>(x: Z.Hole<T>) { return x }

export function lift<T>(f: (x: T) => T): Algebra<T>
export function lift<T>(f: (x: T) => T) { return f }

export const Functor: T.Functor<Z.Free, Any> = {
  map(g) {
    return (x) => {
      switch (true) {
        default: return x satisfies never
        //   leaves, a.k.a. terminal or "nullary" types
        case isNullary(x): return x
        case tagged('enum')(x): return x as never
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

function mapWithIndex_<S, T>(g: (src: S, ix: Index, x: Z.Hole<S>) => T) {
  return (x: Z.Hole<S>, ix: Index): Z.Hole<T> => {
    switch (true) {
      default: return x satisfies never
      ///  unimplemented
      case tagged('custom')(x): return x
      /** @deprecated */
      case tagged('promise')(x): return { ...x, _zod: { ...x._zod.def, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
      ///  leaves, a.k.a "nullary" types
      case isNullary(x): return x
      case tagged('enum')(x): return x as never
      ///  branches, a.k.a. "unary" types
      case tagged('intersection')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, left: g(x._zod.def.left, ix, x), right: g(x._zod.def.right, ix, x) } } }
      case tagged('catch')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
      case tagged('success')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
      case tagged('default')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
      case tagged('prefault')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
      case tagged('readonly')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
      case tagged('nullable')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
      case tagged('lazy')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, getter: () => g(x._zod.def.getter(), ix, x) } } }
      case tagged('set')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, valueType: g(x._zod.def.valueType, ix, x) } } }
      case tagged('pipe')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, in: g(x._zod.def.in, ix, x), out: g(x._zod.def.out, ix, x) } } }
      case tagged('map')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, keyType: g(x._zod.def.keyType, ix, x), valueType: g(x._zod.def.valueType, ix, x) } } }
      case tagged('nonoptional')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
      case tagged('transform')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, transform: fn.flow(x._zod.def.transform, (y) => g(y, ix, x)) } } }
      case tagged('array')(x): return {
        ...x,
        _zod: {
          ...x._zod,
          def: {
            ...x._zod.def,
            element: g(
              x._zod.def.element,
              { ...ix, path: [symbol.array, ...ix.path] },
              x
            )
          }
        }
      }
      case tagged('optional')(x): return {
        ...x,
        _zod: {
          ...x._zod,
          def: {
            ...x._zod.def,
            innerType: g(
              x._zod.def.innerType,
              ix,
              x
            )
          }
        }
      }
      case tagged('union')(x): return {
        ...x,
        _zod: {
          ...x._zod,
          def: {
            ...x._zod.def,
            options: fn.map(
              x._zod.def.options,
              (v, i) => g(
                v,
                { ...ix, path: [...ix.path, symbol.union, i] },
                x
              )
            )
          }
        }
      }
      case tagged('tuple')(x): {
        const { items, rest, ...def } = x._zod.def
        return {
          ...x,
          _zod: {
            ...x._zod,
            def: {
              ...def,
              items: fn.map(
                items,
                (v, i) => g(
                  v,
                  { ...ix, path: [...ix.path, symbol.tuple, i] },
                  x
                )
              ),
              ...rest && { rest: g(rest, ix, x) }
            }
          }
        }
      }
      case tagged('object')(x): {
        const { shape, catchall, ...def } = x._zod.def
        return {
          ...x,
          _zod: {
            ...x._zod,
            def: {
              ...def,
              shape: fn.map(
                shape,
                (v, k) => g(
                  v,
                  { ...ix, path: [...ix.path, symbol.object, k] },
                  x
                )
              ),
              ...catchall && { catchall: g(catchall, ix, x) }
            }
          }
        }
      }
      case tagged('record')(x): {
        const { keyType, valueType } = x._zod.def
        return {
          ...x,
          _zod: {
            ...x._zod,
            def: {
              ...x._zod.def,
              keyType: g(
                keyType,
                { ...ix, path: [...ix.path, symbol.record] },
                x
              ),
              valueType: g(
                valueType,
                { ...ix, path: [...ix.path, symbol.record] },
                x
              )
            }
          }
        }
      }
    }
  }
}

function isCacheable(x: unknown): boolean {
  return tagged('object', x)
    || tagged('array', x)
    || tagged('tuple', x)
    || tagged('record', x)
    || tagged('union', x)
    || tagged('intersection', x)
    || tagged('set', x)
    || tagged('map', x)
}

export const IndexedFunctor: T.Functor.Ix<Index, Z.Free> = {
  map: Functor.map,
  mapWithIndex(g) {
    return (x, ix) => {
      const prev = ix.seen.get(x)
      if (prev === symbol.circular) {
        /**
         * Credit goes to @jaens for prior art: 
         * - https://gist.github.com/jaens/7e15ae1984bb338c86eb5e452dee3010
         */
        return Invariant.CircularSchemaDetected(x._zod.def.type, g.name)
      } else if (prev !== undefined) {
        return prev as never
      }
      else {
        if (isCacheable(x)) {
          ix.seen.set(x, symbol.circular)
          const next = mapWithIndex_(g)(x, ix)
          ix.seen.set(x, next)
          return next
        } else {
          return mapWithIndex_(g)(x, ix)
        }
      }
    }
  }
}

export const CompilerFunctor: T.Functor.Ix<CompilerIndex, Z.Free> = {
  map: Functor.map,
  mapWithIndex(g) {
    return (x, { isProperty, ..._ix }) => {
      const ix = { ..._ix, isProperty: false } satisfies CompilerIndex
      switch (true) {
        default: return x satisfies never
        ///  unimplemented
        case tagged('custom')(x): return x
        /** @deprecated */
        case tagged('promise')(x): return { ...x, _zod: { ...x._zod.def, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
        ///  leaves, a.k.a "nullary" types
        case isNullary(x): return x
        case tagged('enum')(x): return x as never
        ///  branches, a.k.a. "unary" types
        case tagged('catch')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
        case tagged('success')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
        case tagged('default')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
        case tagged('prefault')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
        case tagged('readonly')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
        case tagged('nullable')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
        case tagged('lazy')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, getter: () => g(x._zod.def.getter(), ix, x) } } }
        case tagged('pipe')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, in: g(x._zod.def.in, ix, x), out: g(x._zod.def.out, ix, x) } } }
        case tagged('nonoptional')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
        case tagged('transform')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, transform: fn.flow(x._zod.def.transform, (y) => g(y, ix, x)) } } }
        case tagged('set')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, valueType: g(x._zod.def.valueType, { ...ix, varName: 'value' }, x) } } }
        case tagged('map')(x): {
          const { keyType, valueType } = x._zod.def
          return {
            ...x,
            _zod: {
              ...x._zod,
              def: {
                ...x._zod.def,
                keyType: g(keyType, { ...ix, varName: 'key' }, x),
                valueType: g(valueType, { ...ix, varName: 'value' }, x)
              }
            }
          }
        }
        case tagged('optional')(x): {
          const { innerType } = x._zod.def
          return {
            ...x,
            _zod: {
              ...x._zod,
              def: {
                ...x._zod.def,
                innerType: g(innerType, { ...ix, isProperty, isOptional: true, schemaPath: [...ix.schemaPath, symbol.optional] }, x)
              }
            }
          }
        }
        case tagged('intersection')(x): {
          const { left, right } = x._zod.def
          return {
            ...x,
            _zod: {
              ...x._zod,
              def: {
                ...x._zod.def,
                left: g(left, { ...ix, schemaPath: [...ix.schemaPath, symbol.intersect, 'left'] }, x),
                right: g(right, { ...ix, schemaPath: [...ix.schemaPath, symbol.intersect, 'right'] }, x)
              }
            }
          }
        }
        case tagged('array')(x): return {
          ...x,
          _zod: {
            ...x._zod,
            def: {
              ...x._zod.def,
              element: g(
                x._zod.def.element,
                {
                  ...ix,
                  schemaPath: [...ix.schemaPath, symbol.array],
                  varName: 'value',
                },
                x
              )
            }
          }
        }
        case tagged('union')(x): return {
          ...x,
          _zod: {
            ...x._zod,
            def: {
              ...x._zod.def,
              options: fn.map(x._zod.def.options, (v, i) => g(v, { ...ix, schemaPath: [...ix.schemaPath, i] }, x))
            }
          }
        }
        case tagged('tuple')(x): {
          const { items, rest, ...def } = x._zod.def
          return {
            ...x,
            _zod: {
              ...x._zod,
              def: {
                ...def,
                items: fn.map(
                  items,
                  (v, i) => g(
                    v,
                    {
                      ...ix,
                      dataPath: [...ix.dataPath, i],
                      schemaPath: [...ix.schemaPath, i],
                      varName: ix.varName + indexAccessor(i, isOptional(items[i])),
                    },
                    x
                  )
                ),
                ...rest && { rest: g(rest, ix, x) }
              }
            }
          }
        }
        case tagged('object')(x): {
          const { shape, catchall, ...def } = x._zod.def
          return {
            ...x,
            _zod: {
              ...x._zod,
              def: {
                ...def,
                shape: fn.map(
                  shape,
                  (v, k) => g(
                    v,
                    {
                      isProperty: true,
                      isOptional: ix.isOptional,
                      dataPath: [...ix.dataPath, k],
                      schemaPath: [...ix.schemaPath, k],
                      varName: ix.varName + keyAccessor(k, isOptional(shape[k])),
                    },
                    x
                  )
                ),
                ...catchall && { catchall: g(catchall, ix, x) }
              }
            }
          }
        }
        case tagged('record')(x): {
          const { keyType, valueType } = x._zod.def
          return {
            ...x,
            _zod: {
              ...x._zod,
              def: {
                ...x._zod.def,
                keyType: g(keyType, { ...ix, schemaPath: [...ix.schemaPath, symbol.record, 'key'], varName: 'key' }, x),
                valueType: g(valueType, { ...ix, schemaPath: [...ix.schemaPath, symbol.record, 'value'], varName: 'value' }, x)
              }
            }
          }
        }
      }
    }
  }
}

export const EqCompilerFunctor: T.Functor.Ix<EqCompilerIndex, Z.Free> = {
  map: Functor.map,
  mapWithIndex(g) {
    return (x, { isProperty, ..._ix }) => {
      const ix = { ..._ix, isProperty: false } satisfies EqCompilerIndex
      switch (true) {
        default: return x satisfies never
        ///  unimplemented
        case tagged('custom')(x): return x
        /** @deprecated */
        case tagged('promise')(x): return { ...x, _zod: { ...x._zod.def, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
        ///  leaves, a.k.a "nullary" types
        case isNullary(x): return x
        case tagged('enum')(x): return x as never
        ///  branches, a.k.a. "unary" types
        case tagged('catch')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
        case tagged('success')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
        case tagged('default')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
        case tagged('prefault')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
        case tagged('readonly')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
        case tagged('nullable')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
        case tagged('lazy')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, getter: () => g(x._zod.def.getter(), ix, x) } } }
        case tagged('pipe')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, in: g(x._zod.def.in, ix, x), out: g(x._zod.def.out, ix, x) } } }
        case tagged('nonoptional')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix, x) } } }
        case tagged('transform')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, transform: fn.flow(x._zod.def.transform, (y) => g(y, ix, x)) } } }
        case tagged('set')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, valueType: g(x._zod.def.valueType, { ...ix, leftName: 'left' }, x) } } }
        case tagged('map')(x): {
          const { keyType, valueType } = x._zod.def
          return {
            ...x,
            _zod: {
              ...x._zod,
              def: {
                ...x._zod.def,
                keyType: g(keyType, { ...ix, leftName: 'leftKey' }, x),
                valueType: g(valueType, { ...ix, leftName: 'leftValue' }, x)
              }
            }
          }
        }
        case tagged('optional')(x): {
          const { innerType } = x._zod.def
          return {
            ...x,
            _zod: {
              ...x._zod,
              def: {
                ...x._zod.def,
                innerType: g(innerType, { ...ix, isProperty, isOptional: true, schemaPath: [...ix.schemaPath, symbol.optional] }, x)
              }
            }
          }
        }
        case tagged('intersection')(x): {
          const { left, right } = x._zod.def
          return {
            ...x,
            _zod: {
              ...x._zod,
              def: {
                ...x._zod.def,
                left: g(left, { ...ix, depth: ix.depth + 1, schemaPath: [...ix.schemaPath, symbol.intersect, 'left'] }, x),
                right: g(right, { ...ix, depth: ix.depth + 1, schemaPath: [...ix.schemaPath, symbol.intersect, 'right'] }, x)
              }
            }
          }
        }
        case tagged('array')(x): return {
          ...x,
          _zod: {
            ...x._zod,
            def: {
              ...x._zod.def,
              element: g(
                x._zod.def.element,
                {
                  ...ix,
                  depth: ix.depth + 1,
                  schemaPath: [...ix.schemaPath, symbol.array],
                  leftName: `l${ix.depth + 1}`,
                  rightName: `r${ix.depth + 1}`,
                },
                x
              )
            }
          }
        }
        case tagged('union')(x): return {
          ...x,
          _zod: {
            ...x._zod,
            def: {
              ...x._zod.def,
              options: fn.map(x._zod.def.options, (v, i) => g(v, { ...ix, schemaPath: [...ix.schemaPath, i] }, x))
            }
          }
        }
        case tagged('tuple')(x): {
          const { items, rest, ...def } = x._zod.def
          return {
            ...x,
            _zod: {
              ...x._zod,
              def: {
                ...def,
                items: fn.map(
                  items,
                  (v, i) => g(
                    v,
                    {
                      ...ix,
                      depth: ix.depth + 1,
                      dataPath: [...ix.dataPath, i],
                      schemaPath: [...ix.schemaPath, i],
                      rightName: ix.rightName + indexAccessor(i, isOptional(items[i])),
                      leftName: 'left',
                    },
                    x
                  )
                ),
                ...rest && { rest: g(rest, ix, x) }
              }
            }
          }
        }
        case tagged('object')(x): {
          const { shape, catchall, ...def } = x._zod.def
          return {
            ...x,
            _zod: {
              ...x._zod,
              def: {
                ...def,
                shape: fn.map(
                  shape,
                  (v, k) => g(
                    v,
                    {
                      depth: ix.depth + 1,
                      isProperty: true,
                      isOptional: ix.isOptional,
                      dataPath: [...ix.dataPath, k],
                      schemaPath: [...ix.schemaPath, k],
                      leftName: ix.leftName + keyAccessor(k, isOptional(shape[k])),
                      rightName: ix.rightName + keyAccessor(k, isOptional(shape[k])),
                    },
                    x
                  )
                ),
                ...catchall && { catchall: g(catchall, ix, x) }
              }
            }
          }
        }
        case tagged('record')(x): {
          const { keyType, valueType } = x._zod.def
          return {
            ...x,
            _zod: {
              ...x._zod,
              def: {
                ...x._zod.def,
                keyType: g(
                  keyType, {
                  ...ix,
                  depth: ix.depth + 1,
                  schemaPath: [...ix.schemaPath, symbol.record, 'key'],
                  leftName: `lKey${ix.depth + 1}`,
                  rightName: `rKey${ix.depth + 1}`,
                },
                  x
                ),
                valueType: g(
                  valueType,
                  {
                    ...ix,
                    depth: ix.depth + 1,
                    schemaPath: [...ix.schemaPath, symbol.record, 'value'],
                    leftName: `l${ix.depth + 1}`,
                    rightName: `r${ix.depth + 1}`,
                  },
                  x
                )
              }
            }
          }
        }
      }
    }
  }
}

export const fold
  : <T>(g: (src: Z.Hole<T>, ix: Index, x: Z.Hole<Z.Hole<unknown>>) => T) => (src: Z.Hole<T>, ix?: Index) => T
  = fn.catamorphism(IndexedFunctor, { path: [], seen: new WeakMap() }) as never

export const compile
  : <T>(g: (src: Z.Hole<T>, ix: CompilerIndex, x: z.$ZodType) => T) => (src: z.$ZodType, ix?: CompilerIndex) => T
  = fn.catamorphism(
    CompilerFunctor, {
    dataPath: [],
    isProperty: false,
    isOptional: false,
    schemaPath: [],
    varName: 'value'
  }) as never

export const compileEq
  : <T>(g: (src: Z.Hole<T>, ix: EqCompilerIndex, x: z.$ZodType) => T) => (src: z.$ZodType, ix?: EqCompilerIndex) => T
  = <never>fn.catamorphism(EqCompilerFunctor, { ...defaultEqIndex })

export type Any<T extends z.$ZodType = z.$ZodType> =
  | z.$ZodAny
  | z.$ZodUnion<readonly [T, ...T[]]>
  | z.$ZodArray<T>
  | z.$ZodBigInt
  | z.$ZodBoolean
  | z.$ZodCatch<T>
  | z.$ZodDate
  | z.$ZodDefault<T>
  | z.$ZodEnum<Record<string, string | number>>
  | z.$ZodIntersection<T, T>
  | z.$ZodLazy<T>
  | z.$ZodLiteral<z.util.Literal>
  | z.$ZodMap<T, T>
  | z.$ZodNaN
  | z.$ZodNever
  | z.$ZodNull
  | z.$ZodNullable<T>
  | z.$ZodNumber
  | z.$ZodObject<{ [x: string]: T }>
  | z.$ZodArray<T>
  | z.$ZodPipe<T, T>
  | z.$ZodPromise<T>
  | z.$ZodReadonly<T>
  | z.$ZodRecord<z.$ZodString<keyof any>, T>
  | z.$ZodSet<T>
  | z.$ZodString
  | z.$ZodSymbol
  | z.$ZodTuple<[T, ...T[]], T | null>
  | z.$ZodUndefined
  | z.$ZodUnknown
  | z.$ZodVoid

export type NullaryTypeName = Z.Nullary['_zod']['def']['type']
export const nullaryTypeNames = [
  'any',
  'bigint',
  'boolean',
  'date',
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
export const isUnary = <T>(x: unknown): x is Z.Unary<T> => hasTypeName(x) && !isNullary(x)
