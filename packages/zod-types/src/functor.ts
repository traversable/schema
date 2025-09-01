import * as z from 'zod/v4/core'
import type * as T from '@traversable/registry'
import { fn, has, symbol, indexAccessor, keyAccessor } from '@traversable/registry'

import type { Ctx } from './utils.js'
import type { Config } from './utils.js'
import { isOptional, Invariant } from './utils.js'
import type { AnyTypeName } from './typename.js'
import { TypeName, tagged, hasTypeName } from './typename.js'

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

  interface Never { _zod: { def: { type: TypeName['never'] } } }
  interface Any { _zod: { def: { type: TypeName['any'] } } }
  interface Unknown { _zod: { def: { type: TypeName['unknown'] } } }
  interface Undefined { _zod: { def: { type: TypeName['undefined'] } } }
  interface Null { _zod: { def: { type: TypeName['null'] } } }
  interface Void { _zod: { def: { type: TypeName['void'] } } }
  interface NaN { _zod: { def: { type: TypeName['nan'] } } }
  interface Symbol { _zod: { def: { type: TypeName['symbol'] } } }
  interface Boolean { _zod: { def: { type: TypeName['boolean'] } } }
  interface BigInt { _zod: { def: { type: TypeName['bigint'] }, bag: BigInt.Bag } }
  interface Number { _zod: { def: { type: TypeName['number'], checks?: Number.Check[] }, bag: Number.Bag }, isInt: boolean }
  interface Integer extends Number.Bag { _zod: { def: { type: TypeName['int'], checks?: Integer.Check[] }, bag: Integer.Bag } }
  interface String extends String.Bag { _zod: { def: { type: TypeName['string'] } } }
  interface Date { _zod: { def: { type: TypeName['date'] } } }
  interface File { _zod: { def: { type: TypeName['file'] } } }

  interface Enum<N = unknown> { _zod: { def: { type: TypeName['enum'], entries: N }, values: globalThis.Set<string | number> } }
  interface Literal<N = unknown> { _zod: { def: { type: TypeName['literal'], values: N[] } } }
  interface TemplateLiteral { _zod: { def: { type: TypeName['template_literal'], parts: unknown[] }, pattern: RegExp } }

  interface Optional<S = unknown> { _zod: { def: { type: TypeName['optional'], innerType: S } } }
  interface Nullable<S = unknown> { _zod: { def: { type: TypeName['nullable'], innerType: S } } }
  interface Array<S = unknown> { _zod: { def: { type: TypeName['array'], element: S }, bag: Array.Bag } }
  interface Set<S = unknown> { _zod: { def: { type: TypeName['set'], valueType: S } } }
  interface Map<S = unknown> { _zod: { def: { type: TypeName['map'], keyType: S, valueType: S } } }
  interface Readonly<S = unknown> { _zod: { def: { type: TypeName['readonly'], innerType: S } } }
  interface Object<S = unknown> { _zod: { def: { type: TypeName['object'], shape: { [x: string]: S }, catchall?: S } } }
  interface Record<S = unknown> { _zod: { def: { type: TypeName['record'], keyType: S, valueType: S } } }
  interface Tuple<S = unknown> { _zod: { def: { type: TypeName['tuple'], items: [S, ...S[]], rest?: S } } }
  interface Lazy<S = unknown> { _zod: { def: { type: TypeName['lazy'], getter(): S } } }
  interface Intersection<S = unknown> { _zod: { def: { type: TypeName['intersection'], left: S, right: S } } }
  interface Union<S = unknown> { _zod: { def: { type: TypeName['union'], options: readonly [S, S, ...S[]] } } }
  interface Catch<S = unknown> { _zod: { def: { type: TypeName['catch'], innerType: S, catchValue(ctx: Ctx): unknown } } }
  interface Custom<S = unknown> { _zod: { def: { type: TypeName['custom'] } } }
  interface Default<S = unknown> { _zod: { def: { type: TypeName['default'], innerType: S, defaultValue: (ctx: Ctx) => unknown } } }
  interface Prefault<S = unknown> { _zod: { def: { type: TypeName['prefault'], innerType: S, defaultValue: (ctx: Ctx) => unknown } } }
  interface NonOptional<S = unknown> { _zod: { def: { type: TypeName['nonoptional'], innerType: S } } }
  interface Pipe<S = unknown> { _zod: { def: { type: TypeName['pipe'], in: S, out: S } } }
  interface Transform<S = unknown> { _zod: { def: { type: TypeName['transform'], transform: (x: unknown) => S } } }
  interface Success<S = unknown> { _zod: { def: { type: TypeName['success'], innerType: S } } }
  /** @deprecated */
  interface Promise<S = unknown> { _zod: { def: { type: TypeName['promise'], innerType: S } } }

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

export type CompilerAlgebra<T> = { (src: T.Kind<Z.Free, T>, ix: CompilerIndex, input: any): T }
export interface CompilerIndex {
  dataPath: (string | number)[]
  isOptional: boolean
  isProperty: boolean
  schemaPath: (keyof any)[]
  varName: string
}

export const defaultIndex = {
  dataPath: [],
  isOptional: false,
  isProperty: false,
  schemaPath: [],
  varName: 'value',
} satisfies CompilerIndex

export { In as in }
function In<T extends z.$ZodType>(x: T): Z.Hole<T>
function In<T>(x: T): Z.Hole<T>
function In<T extends z.$ZodType>(x: T) { return x }

export { Out as out }
function Out<T>(x: Z.Hole<T>): T
function Out<T>(x: Z.Hole<T>) { return x }

export function lift<T>(f: (x: T) => T): Algebra<T>
export function lift<T>(f: (x: T) => T) { return f }

export const map: T.Functor<Z.Free, Any>['map'] = (g) => (x) => {
  switch (true) {
    default: return x satisfies never
    //   leaves, a.k.a. terminal or "nullary" types
    case isNullary(x): return x
    case tagged('enum')(x): return x as never
    //   branches, a.k.a. non-terminal or "unary" types
    case tagged('array')(x): return { ...x, _zod: { ...x._zod, bag: x._zod.bag, def: { ...x._zod.def, type: x._zod.def.type, element: g(x._zod.def.element) } } }
    case tagged('record')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, keyType: g(x._zod.def.keyType), valueType: g(x._zod.def.valueType) } } }
    case tagged('optional')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, innerType: g(x._zod.def.innerType) } } }
    case tagged('union')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, options: fn.map(x._zod.def.options, g) } } }
    case tagged('intersection')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, left: g(x._zod.def.left), right: g(x._zod.def.right) } } }
    case tagged('promise')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, innerType: g(x._zod.def.innerType) } } }
    case tagged('success')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, innerType: g(x._zod.def.innerType) } } }
    case tagged('readonly')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, innerType: g(x._zod.def.innerType) } } }
    case tagged('nullable')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, innerType: g(x._zod.def.innerType) } } }
    case tagged('lazy')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, getter: () => g(x._zod.def.getter()) } } }
    case tagged('set')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, valueType: g(x._zod.def.valueType) } } }
    case tagged('pipe')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, in: g(x._zod.def.in), out: g(x._zod.def.out) } } }
    case tagged('map')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, keyType: g(x._zod.def.keyType), valueType: g(x._zod.def.valueType) } } }
    case tagged('nonoptional')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, innerType: g(x._zod.def.innerType) } } }
    case tagged('transform')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, transform: fn.flow(x._zod.def.transform, g) } } }
    case tagged('catch')(x): {
      const { catchValue, innerType, type, ...def } = x._zod.def
      return { ...x, _zod: { ...x._zod, def: { ...def, type, catchValue, innerType: g(innerType) } } }
    }
    case tagged('default')(x): {
      const { defaultValue, innerType, type, ...def } = x._zod.def
      return { ...x, _zod: { ...x._zod, def: { ...def, type, defaultValue, innerType: g(innerType) } } }
    }
    case tagged('prefault')(x): {
      const { defaultValue, innerType, type, ...def } = x._zod.def
      return { ...x, _zod: { ...x._zod, def: { ...def, type, defaultValue, innerType: g(innerType) } } }
    }
    case tagged('tuple')(x): {
      const { items, rest, type, ...def } = x._zod.def
      return { ...x, _zod: { ...x._zod, def: { ...def, type, items: fn.map(items, g), ...rest && { rest: g(rest) } } } }
    }
    case tagged('object')(x): {
      const { shape, catchall, type, ...def } = x._zod.def
      return { ...x, _zod: { ...x._zod, def: { ...def, type, shape: fn.map(shape, g), ...catchall && { catchall: g(catchall) } } } }
    }
  }
}

function mapWithIndex<S, T>(g: (src: S, ix: Index, x: Z.Hole<S>) => T) {
  return (x: Z.Hole<S>, ix: Index): Z.Hole<T> => {
    switch (true) {
      default: return x satisfies never
      ///  unimplemented
      case tagged('custom')(x): return x
      /** @deprecated */
      case tagged('promise')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, innerType: g(x._zod.def.innerType, ix, x) } } }
      case isNullary(x): return x
      case tagged('enum')(x): return x as never
      case tagged('intersection')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, left: g(x._zod.def.left, ix, x), right: g(x._zod.def.right, ix, x) } } }
      case tagged('success')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, innerType: g(x._zod.def.innerType, ix, x) } } }
      case tagged('readonly')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, innerType: g(x._zod.def.innerType, ix, x) } } }
      case tagged('nullable')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, innerType: g(x._zod.def.innerType, ix, x) } } }
      case tagged('lazy')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, getter: () => g(x._zod.def.getter(), ix, x) } } }
      case tagged('set')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, valueType: g(x._zod.def.valueType, ix, x) } } }
      case tagged('pipe')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, in: g(x._zod.def.in, ix, x), out: g(x._zod.def.out, ix, x) } } }
      case tagged('map')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, keyType: g(x._zod.def.keyType, ix, x), valueType: g(x._zod.def.valueType, ix, x) } } }
      case tagged('nonoptional')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, innerType: g(x._zod.def.innerType, ix, x) } } }
      case tagged('transform')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, transform: fn.flow(x._zod.def.transform, (y) => g(y, ix, x)) } } }
      case tagged('array')(x): {
        const { type, element } = x._zod.def
        return { ...x, _zod: { ...x._zod, bag: x._zod.bag, def: { ...x._zod.def, type, element: g(element, { ...ix, path: [symbol.array, ...ix.path] }, x) } } }
      }
      case tagged('optional')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, innerType: g(x._zod.def.innerType, ix, x) } } }
      case tagged('catch')(x): {
        const { catchValue, innerType, type, ...def } = x._zod.def
        return { ...x, _zod: { ...x._zod, def: { ...def, type, catchValue, innerType: g(innerType, ix, x) } } }
      }
      case tagged('default')(x): {
        const { defaultValue, innerType, type, ...def } = x._zod.def
        return { ...x, _zod: { ...x._zod, def: { ...def, type, defaultValue, innerType: g(innerType, ix, x) } } }
      }
      case tagged('prefault')(x): {
        const { defaultValue, innerType, type, ...def } = x._zod.def
        return { ...x, _zod: { ...x._zod, def: { ...def, type, defaultValue, innerType: g(innerType, ix, x) } } }
      }
      case tagged('union')(x): {
        const { options, type, ...def } = x._zod.def
        return {
          ...x,
          _zod: {
            ...x._zod,
            def: {
              ...def,
              type,
              options: fn.map(
                options,
                (v, i) => g(
                  v,
                  { ...ix, path: [...ix.path, symbol.union, i] },
                  x
                )
              )
            }
          }
        }
      }
      case tagged('tuple')(x): {
        const { items, rest, type, ...def } = x._zod.def
        return {
          ...x,
          _zod: {
            ...x._zod,
            def: {
              ...def,
              type,
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
        const { shape, catchall, type, ...def } = x._zod.def
        return {
          ...x,
          _zod: {
            ...x._zod,
            def: {
              ...def,
              type,
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
        const { keyType, valueType, type, ...def } = x._zod.def
        return {
          ...x,
          _zod: {
            ...x._zod,
            def: {
              ...def,
              type,
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

export const Functor: T.Functor.Ix<Index, Z.Free> = {
  map,
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
      } else if (isCacheable(x)) {
        ix.seen.set(x, symbol.circular)
        const next = mapWithIndex(g)(x, ix)
        ix.seen.set(x, next)
        return next
      } else {
        return mapWithIndex(g)(x, ix)
      }
    }
  }
}

export const CompilerFunctor: T.Functor.Ix<CompilerIndex, Z.Free> = {
  map: Functor.map,
  mapWithIndex(g) {
    return (x, _ix) => {
      const ix = { ..._ix, isProperty: false } satisfies CompilerIndex
      switch (true) {
        default: return x satisfies never
        ///  unimplemented
        case tagged('custom')(x): return x
        /** @deprecated */
        case tagged('promise')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, innerType: g(x._zod.def.innerType, ix, x) } } }
        ///  leaves, a.k.a "nullary" types
        case isNullary(x): return x
        case tagged('enum')(x): return x as never
        ///  branches, a.k.a. "unary" types
        case tagged('success')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, innerType: g(x._zod.def.innerType, ix, x) } } }
        case tagged('readonly')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, innerType: g(x._zod.def.innerType, ix, x) } } }
        case tagged('nullable')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, innerType: g(x._zod.def.innerType, ix, x) } } }
        case tagged('lazy')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, getter: () => g(x._zod.def.getter(), ix, x) } } }
        case tagged('pipe')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, in: g(x._zod.def.in, ix, x), out: g(x._zod.def.out, ix, x) } } }
        case tagged('nonoptional')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, innerType: g(x._zod.def.innerType, ix, x) } } }
        case tagged('transform')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, transform: fn.flow(x._zod.def.transform, (y) => g(y, ix, x)) } } }
        case tagged('set')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, type: x._zod.def.type, valueType: g(x._zod.def.valueType, { ...ix, varName: 'value' }, x) } } }
        case tagged('default')(x): {
          const { type, innerType, defaultValue, ...def } = x._zod.def
          return { ...x, _zod: { ...x._zod, def: { ...def, type, defaultValue, innerType: g(innerType, ix, x) } } }
        }
        case tagged('prefault')(x): {
          const { type, innerType, defaultValue, ...def } = x._zod.def
          return { ...x, _zod: { ...x._zod, def: { ...def, type, defaultValue, innerType: g(innerType, ix, x) } } }
        }
        case tagged('catch')(x): {
          const { type, innerType, catchValue, ...def } = x._zod.def
          return { ...x, _zod: { ...x._zod, def: { ...def, type, catchValue, innerType: g(innerType, ix, x) } } }
        }
        case tagged('map')(x): {
          const { keyType, valueType, type, ...def } = x._zod.def
          return {
            ...x,
            _zod: {
              ...x._zod,
              def: {
                ...def,
                type,
                keyType: g(keyType, { ...ix, varName: 'key' }, x),
                valueType: g(valueType, { ...ix, varName: 'value' }, x)
              }
            }
          }
        }
        case tagged('optional')(x): {
          const { innerType, type, ...def } = x._zod.def
          return {
            ...x,
            _zod: {
              ...x._zod,
              def: {
                ...def,
                type,
                innerType: g(innerType, { ...ix, isOptional: true, schemaPath: [...ix.schemaPath, symbol.optional] }, x)
              }
            }
          }
        }
        case tagged('intersection')(x): {
          const { left, right, type, ...def } = x._zod.def
          return {
            ...x,
            _zod: {
              ...x._zod,
              def: {
                ...def,
                type,
                left: g(left, { ...ix, schemaPath: [...ix.schemaPath, symbol.intersect, 'left'] }, x),
                right: g(right, { ...ix, schemaPath: [...ix.schemaPath, symbol.intersect, 'right'] }, x)
              }
            }
          }
        }
        case tagged('array')(x): {
          const { type, element, ...def } = x._zod.def
          return {
            ...x,
            _zod: {
              ...x._zod,
              bag: x._zod.bag,
              def: {
                ...def,
                type,
                element: g(
                  element,
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
        }
        case tagged('union')(x): {
          const { type, options, ...def } = x._zod.def
          return {
            ...x,
            _zod: {
              ...x._zod,
              def: {
                ...def,
                type,
                options: fn.map(options, (v, i) => g(v, { ...ix, schemaPath: [...ix.schemaPath, i] }, x))
              }
            }
          }
        }
        case tagged('tuple')(x): {
          const { items, rest, type, ...def } = x._zod.def
          return {
            ...x,
            _zod: {
              ...x._zod,
              def: {
                ...def,
                type,
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
          const { shape, catchall, type, ...def } = x._zod.def
          return {
            ...x,
            _zod: {
              ...x._zod,
              def: {
                ...def,
                type,
                shape: fn.map(
                  shape,
                  (v, k) => g(
                    v,
                    {
                      ...ix,
                      isProperty: true,
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
          const { keyType, valueType, type, ...def } = x._zod.def
          return {
            ...x,
            _zod: {
              ...x._zod,
              def: {
                ...def,
                type,
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

export type Algebra<T> = {
  (src: Z.Hole<T>, ix?: Index): T
  (src: z.$ZodType, ix?: Index): T
  (src: Z.Hole<T>, ix?: Index): T
}

export type Fold = <T>(g: (src: Z.Hole<T>, ix: Index, x: z.$ZodType) => T) => Algebra<T>

export const fold: Fold = <never>fn.catamorphism(Functor, { path: [], seen: new WeakMap() })

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
