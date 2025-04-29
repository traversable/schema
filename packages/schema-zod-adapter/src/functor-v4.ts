import { z } from 'zod4'

import type * as T from '@traversable/registry'
import { fn, has, Number_isNatural, parseKey, Print } from '@traversable/registry'
import { Json } from '@traversable/json'

export {
  toString,
}

type _ = unknown

const Array_isArray
  : <T>(u: unknown) => u is readonly T[]
  = globalThis.Array.isArray

type Options = {
  initialIndex?: (string | number)[]
  namespaceAlias?: string
  preferInterfaces?: boolean
}

interface Config extends Required<Options> {}

export const defaults = {
  initialIndex: Array.of<string | number>(),
  namespaceAlias: 'z',
  preferInterfaces: true,
} satisfies Config

const Invariant = {
  Unimplemented: (schemaName: string) => { throw Error(`z.${schemaName} has not yet been implemented`) },
}

type AllTags = z.ZodType['_zod']['def']['type']
type Tag = { [K in AllTags]: K }
const Tag = {
  any: 'any',
  array: 'array',
  bigint: 'bigint',
  boolean: 'boolean',
  catch: 'catch',
  custom: 'custom',
  date: 'date',
  default: 'default',
  enum: 'enum',
  file: 'file',
  int: 'int',
  interface: 'interface',
  intersection: 'intersection',
  lazy: 'lazy',
  literal: 'literal',
  map: 'map',
  nan: 'nan',
  never: 'never',
  nonoptional: 'nonoptional',
  null: 'null',
  nullable: 'nullable',
  number: 'number',
  object: 'object',
  optional: 'optional',
  pipe: 'pipe',
  promise: 'promise',
  readonly: 'readonly',
  record: 'record',
  set: 'set',
  string: 'string',
  success: 'success',
  symbol: 'symbol',
  template_literal: 'template_literal',
  transform: 'transform',
  tuple: 'tuple',
  undefined: 'undefined',
  union: 'union',
  unknown: 'unknown',
  void: 'void',
} satisfies Tag

export declare namespace Z {
  type lookup<K extends keyof Tag, S = _> = Z.catalog<S>[Tag[K]]
  type catalog<S = _> = {
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
    [Tag.interface]: Z.Interface<S>
    [Tag.lazy]: Z.Lazy<S>
    [Tag.map]: Z.Map<S>
    [Tag.nullable]: Z.Nullable<S>
    [Tag.object]: Z.Object<S>
    [Tag.optional]: Z.Optional<S>
    [Tag.promise]: Z.Promise<S>
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

  interface Enum<N = _> { _zod: { def: { type: Tag['enum'], values: [N, ...N[]] } } }
  interface Literal<N = _> { _zod: { def: { type: Tag['literal'], values: N[] } } }
  interface TemplateLiteral { _zod: { def: { type: Tag['template_literal'], parts: unknown[] } } }

  interface Optional<S = _> { _zod: { def: { type: Tag['optional'], innerType: S } } }
  interface Nullable<S = _> { _zod: { def: { type: Tag['nullable'], innerType: S } } }
  interface Array<S = _> extends Array.Proto { _zod: { def: { type: Tag['array'], element: S } } }
  interface Set<S = _> { _zod: { def: { type: Tag['set'], valueType: S } } }
  interface Map<S = _> { _zod: { def: { type: Tag['map'], keyType: S, valueType: S } } }
  interface Readonly<S = _> { _zod: { def: { type: Tag['readonly'], innerType: S } } }
  interface Promise<S = _> { _zod: { def: { type: Tag['promise'], innerType: S } } }
  interface Object<S = _> { _zod: { def: { type: Tag['object'], shape: { [x: string]: S }, catchall?: S } } }
  interface Record<S = _> { _zod: { def: { type: Tag['record'], keyType: S, valueType: S } } }
  interface Tuple<S = _> { _zod: { def: { type: Tag['tuple'], items: [S, ...S[]], rest?: S } } }
  interface Lazy<S = _> { _zod: { def: { type: Tag['lazy'], getter(): S } } }
  interface Intersection<S = _> { _zod: { def: { type: Tag['intersection'], left: S, right: S } } }
  interface Union<S = _> { _zod: { def: { type: Tag['union'], options: readonly [S, S, ...S[]] } } }
  interface Catch<S = _> { _zod: { def: { type: Tag['catch'], innerType: S, catchValue(ctx: Ctx): unknown } } }
  interface Custom<S = _> { _zod: { def: { type: Tag['custom'] } } }
  interface Default<S = _> { _zod: { def: { type: Tag['default'], innerType: S, defaultValue: (ctx: Ctx) => unknown } } }
  interface Interface<S = _> { _zod: { def: { type: Tag['interface'], shape: { [x: string]: S }, catchall?: S } } }
  interface NonOptional<S = _> { _zod: { def: { type: Tag['nonoptional'], innerType: S } } }
  interface Pipe<S = _> { _zod: { def: { type: Tag['pipe'], in: S, out: S } } }
  interface Transform<S = _> { _zod: { def: { type: Tag['transform'] /* , TODO: transform: () => ... */ } } }
  interface Success<S = _> { _zod: { def: { type: Tag['success'] } } }

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
    | Z.Promise<_>
    | Z.Object<_>
    | Z.Interface<_>
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
    | Unary<_>

  /**
   * ## {@link Fixpoint `Z.Fixpoint`}
   *
   * This (I believe) is our Functor's greatest fixed point.
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
    | Z.Promise<Fixpoint>
    | Z.Object<Fixpoint>
    | Z.Interface<Fixpoint>
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

  /**
   * ## {@link Free `Z.Free`}
   * 
   * Makes {@link Hole Z.Hole} higher-kinded 
   */
  interface Free extends T.HKT { [-1]: Z.Hole<this[0]> }

  namespace Integer {
    interface Check {

    }
  }

  // TODO: make this more granular
  namespace Number {
    type GTE = { check: 'greater_than', value: number, inclusive: true }
    type GT = { check: 'greater_than', value: number, inclusive: false }
    type LTE = { check: 'less_than', value: number, inclusive: true }
    type LT = { check: 'less_than', value: number, inclusive: false }
    type Format = { format: string }
    type CheckVariant = GTE | GT | LTE | LT | Format


    interface Check {
      _zod: {
        def: CheckVariant
      }
      // kind: 'int' | 'min' | 'max' | 'finite' | 'multipleOf',
      // value?: number,
      // inclusive?: boolean
    }
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

const tagged
  : <K extends keyof Tag>(tag: K) => <S>(u: unknown) => u is Z.lookup<K, S>
  = (tag) => has('_zod', 'def', 'type', (x): x is never => x === tag) as never

const hasMinimum = has('_zod', 'computed', 'minimum', Number_isNatural)
const hasMaximum = has('_zod', 'computed', 'maximum', Number_isNatural)
const hasExactLength = has('_zod', 'computed', 'length', Number_isNatural)
const hasOptional = has('_zod', 'def', 'optional', (x): x is string[] => Array.isArray(x))
const isLT = (u: unknown): u is Z.Number.LT => has('check', (x) => x === 'less_than')(u) && has('inclusive', (x) => x === false)(u)
const isLTE = (u: unknown): u is Z.Number.LTE => has('check', (x) => x === 'less_than')(u) && has('inclusive', (x) => x === true)(u)
const isGT = (u: unknown): u is Z.Number.GT => has('check', (x) => x === 'greater_than')(u) && has('inclusive', (x) => x === false)(u)
const isGTE = (u: unknown): u is Z.Number.GTE => has('check', (x) => x === 'greater_than')(u) && has('inclusive', (x) => x === true)(u)

interface Ctx { input: unknown, error: z.ZodError }
const ctx = { input: null, error: new z.ZodError([]) } satisfies Ctx

export const Functor: T.Functor<Z.Free, Any> = {
  map(g) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        //// unimplemented
        case tagged('success')(x): return Invariant.Unimplemented('success')
        case tagged('transform')(x): return Invariant.Unimplemented('transform')
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
        case tagged('enum')(x): return x
        case tagged('literal')(x): return x
        case tagged('template_literal')(x): return x
        //// branches, a.k.a. "unary" types
        case tagged('array')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, element: g(x._zod.def.element) } } }
        case tagged('record')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, keyType: g(x._zod.def.keyType), valueType: g(x._zod.def.valueType) } } }
        case tagged('optional')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType) } } }
        case tagged('union')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, options: fn.map(x._zod.def.options, g) } } }
        case tagged('intersection')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, left: g(x._zod.def.left), right: g(x._zod.def.right) } } }
        case tagged('promise')(x): return { ...x, _zod: { ...x._zod.def, def: { ...x._zod.def, innerType: g(x._zod.def.innerType) } } }
        case tagged('catch')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType) } } }
        case tagged('default')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType) } } }
        case tagged('readonly')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType) } } }
        case tagged('nullable')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType) } } }
        case tagged('lazy')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, getter: () => g(x._zod.def.getter()) } } }
        case tagged('set')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, valueType: g(x._zod.def.valueType) } } }
        case tagged('pipe')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, in: g(x._zod.def.in), out: g(x._zod.def.out) } } }
        case tagged('map')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, keyType: g(x._zod.def.keyType), valueType: g(x._zod.def.valueType) } } }
        case tagged('nonoptional')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType) } } }
        case tagged('tuple')(x): {
          const { items, rest, ...def } = x._zod.def
          return { ...x, _zod: { ...x._zod, def: { ...def, items: fn.map(items, g), ...rest && { rest: g(rest) } } } }
        }
        case tagged('object')(x): {
          const { shape, catchall, ...def } = x._zod.def
          return { ...x, _zod: { ...x._zod, def: { ...def, shape: fn.map(shape, g), ...catchall && { catchall: g(catchall) } } } }
        }
        case tagged('interface')(x): {
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
    type T = ReturnType<typeof g>
    return (x, ix) => {
      switch (true) {
        default: return fn.exhaustive(x)
        //// unimplemented
        case tagged('success')(x): return Invariant.Unimplemented('success')
        case tagged('transform')(x): return Invariant.Unimplemented('transform')
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
        case tagged('enum')(x): return x
        case tagged('literal')(x): return x
        case tagged('template_literal')(x): return x
        //// branches, a.k.a. "unary" types
        case tagged('array')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, element: g(x._zod.def.element, ix) } } }
        case tagged('record')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, keyType: g(x._zod.def.keyType, ix), valueType: g(x._zod.def.valueType, ix) } } }
        case tagged('optional')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix) } } }
        case tagged('union')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, options: fn.map(x._zod.def.options, (v) => g(v, ix)) } } }
        case tagged('intersection')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, left: g(x._zod.def.left, ix), right: g(x._zod.def.right, ix) } } }
        case tagged('promise')(x): return { ...x, _zod: { ...x._zod.def, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix) } } }
        case tagged('catch')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix) } } }
        case tagged('default')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix) } } }
        case tagged('readonly')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix) } } }
        case tagged('nullable')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix) } } }
        case tagged('lazy')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, getter: () => g(x._zod.def.getter(), ix) } } }
        case tagged('set')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, valueType: g(x._zod.def.valueType, ix) } } }
        case tagged('pipe')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, in: g(x._zod.def.in, ix), out: g(x._zod.def.out, ix) } } }
        case tagged('map')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, keyType: g(x._zod.def.keyType, ix), valueType: g(x._zod.def.valueType, ix) } } }
        case tagged('nonoptional')(x): return { ...x, _zod: { ...x._zod, def: { ...x._zod.def, innerType: g(x._zod.def.innerType, ix) } } }
        case tagged('tuple')(x): {
          const { items, rest, ...def } = x._zod.def
          return { ...x, _zod: { ...x._zod, def: { ...def, items: fn.map(items, (v, i) => g(v, [...ix, i])), ...rest && { rest: g(rest, ix) } } } }
        }
        case tagged('object')(x): {
          const { shape, catchall, ...def } = x._zod.def
          return { ...x, _zod: { ...x._zod, def: { ...def, shape: fn.map(shape, (v, k) => g(v, [...ix, k])), ...catchall && { catchall: g(catchall, ix) } } } }
        }
        case tagged('interface')(x): {
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

const applyNumberConstraints = (x: Z.Number) => ''
  + (x.isInt ? `.int()` : '')
  + ((x._zod.def.checks?.length ?? 0) > 0 ? x._zod.def.checks?.reduce(
    (acc, { _zod: { def } }) =>
      acc + (isLT(def) ? `.lt(${def.value})`
        : isLTE(def) ? `.max(${def.value})`
          : isGT(def) ? `.gt(${def.value})`
            : isGTE(def) ? `.min(${def.value})`
              : ''
      ), ''
  ) : '')

const applyStringConstraints = (x: Z.String) => ([
  Number.isFinite(x.minLength) && `.min(${x.minLength})`,
  Number.isFinite(x.maxLength) && `.max(${x.maxLength})`,
]).filter((_) => typeof _ === 'string').join('')

const applyArrayConstraints = (x: Z.Array) => ([
  hasMinimum(x) && `.min(${x._zod.computed.minimum})`,
  hasMaximum(x) && `.max(${x._zod.computed.maximum})`,
  hasExactLength(x) && `.length(${x._zod.computed.length})`,
]).filter((_) => typeof _ === 'string').join('')

const next
  : (prev: Functor.Index, ...segments: Functor.Index['path']) => Functor.Index
  = ({ depth, path }, ...segments) => ({ depth: depth + 1, path: [...path, ...segments] })

export const IndexedJsonFunctor: T.Functor.Ix<Functor.Index, Json.Free, Json.Fixpoint> = {
  map: Json.Functor.map,
  mapWithIndex(f) {
    return (x, ix) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case x === null:
        case x === undefined:
        case x === true:
        case x === false:
        case typeof x === 'number':
        case typeof x === 'string': return x
        case Array_isArray(x): return fn.map(x, (s, i) => f(s, next(ix, i)))
        case !!x && typeof x === 'object': return fn.map(x, (s, k) => f(s, next(ix, k)))
      }
    }
  }
}

namespace Algebra {
  export declare namespace toString {
    interface options extends Options {
      maxWidth?: number
    }
    export { options as Options }
    export interface Config extends Required<toString.Options> {}
  }

  export const toStringDefaults = {
    ...defaults,
    initialIndex: Array.of<string | number>(),
    maxWidth: 99,
  } satisfies toString.Config

  const parseOptions = ({
    namespaceAlias = toStringDefaults.namespaceAlias,
    preferInterfaces = toStringDefaults.preferInterfaces,
    maxWidth = toStringDefaults.maxWidth,
    initialIndex = toStringDefaults.initialIndex,
  }: toString.Options = toStringDefaults
  ): toString.Config => ({
    initialIndex,
    maxWidth,
    namespaceAlias,
    preferInterfaces,
  })

  export const toString
    : (options?: toString.Options) => T.Functor.IndexedAlgebra<(string | number)[], Z.Free, string>
    = (options = toStringDefaults) => (x, ix) => {
      const { namespaceAlias: z, preferInterfaces, maxWidth: MAX_WIDTH } = parseOptions(options)
      const JOIN = ',\n' + '  '.repeat(ix.length + 1)
      switch (true) {
        default: return fn.exhaustive(x)
        //// unimplemented
        case tagged('success')(x): return Invariant.Unimplemented('success')
        case tagged('transform')(x): return Invariant.Unimplemented('transform')
        ///  leaves, a.k.a. "nullary" types
        case tagged('never')(x): return `${z}.never()`
        case tagged('any')(x): return `${z}.any()`
        case tagged('unknown')(x): return `${z}.unknown()`
        case tagged('void')(x): return `${z}.void()`
        case tagged('undefined')(x): return `${z}.undefined()`
        case tagged('null')(x): return `${z}.null()`
        case tagged('symbol')(x): return `${z}.symbol()`
        case tagged('nan')(x): return `${z}.NaN()`
        case tagged('boolean')(x): return `${z}.boolean()`
        case tagged('bigint')(x): return `${z}.bigint()`
        case tagged('date')(x): return `${z}.date()`
        case tagged('number')(x): return `${z}.number()${applyNumberConstraints(x)}`
        case tagged('string')(x): return `${z}.string()${applyStringConstraints(x)}`
        case tagged('catch')(x): return `${x._zod.def.innerType}.catch(${serializeShort(x._zod.def.catchValue(ctx)!)})`
        ///  branches, a.k.a. "unary" types
        case tagged('set')(x): return `${z}.set(${x._zod.def.valueType})`
        case tagged('promise')(x): return `${z}.promise(${x._zod.def.type})`
        case tagged('map')(x): return `${z}.map(${x._zod.def.keyType}, ${x._zod.def.valueType})`
        case tagged('readonly')(x): return `${x._zod.def.innerType}.readonly()`
        case tagged('nullable')(x): return `${x._zod.def.innerType}.nullable()`
        case tagged('optional')(x): return `${x._zod.def.innerType}.optional()`
        case tagged('literal')(x): return `${z}.literal(${x._zod.def.values.map((v) => JSON.stringify(v)).join(', ')})`
        case tagged('array')(x): return `${z}.array(${x._zod.def.element})${applyArrayConstraints(x)}`
        case tagged('record')(x): return `${z}.record(${x._zod.def.keyType}, ${x._zod.def.valueType})`
        case tagged('intersection')(x): return `${z}.intersection(${x._zod.def.left}, ${x._zod.def.right})`
        case tagged('union')(x): return `${z}.union([${x._zod.def.options.join(', ')}])`
        case tagged('lazy')(x): return `${z}.lazy(() => ${x._zod.def.getter()})`
        case tagged('pipe')(x): return `${x._zod.def.in}.pipe(${x._zod.def.out})`
        case tagged('default')(x): return `${x._zod.def.innerType}.default(${serializeShort(x._zod.def.defaultValue(ctx)!)})`
        case tagged('enum')(x): return `${z}.enum([${x._zod.def.values.map((_) => JSON.stringify(_)).join(', ')}])`
        case tagged('template_literal')(x): return `${z}.templateLiteral([${x._zod.def.parts.join(', ')}])`
        case tagged('nonoptional')(x): return `${z}.nonoptional(${x._zod.def.innerType})`
        case tagged('object')(x): {
          const xs = Object
            .entries(x._zod.def.shape)
            .map(([k, v]) => parseKey(k) + ': ' + v)
          const WIDTH = (`${z}.object({ `.length + xs.reduce((acc, x) => acc + ', '.length + x.length, ix.length * 2) + ' })'.length)
          return xs.length === 0 ? `${z}.object({})`
            : WIDTH < MAX_WIDTH ? `${z}.object({ ${xs.join(', ')} })`
              : '${z}.object({'
              + '\n'
              + '  '.repeat(ix.length + 1)
              + xs.join(JOIN)
              + '\n'
              + '  '.repeat(ix.length)
              + '})'
        }
        case tagged('interface')(x): {
          const xs = Object
            .entries(x._zod.def.shape)
            .map(([k, v]) => (hasOptional(x) && x._zod.def.optional.includes(k) ? parseKey(k + '?') : parseKey(k)) + ': ' + v)
          const WIDTH = (`${z}.interface({ `.length + xs.reduce((acc, x) => acc + ', '.length + x.length, ix.length * 2) + ' })'.length)
          return xs.length === 0 ? `${z}.interface({})`
            : WIDTH < MAX_WIDTH ? `${z}.interface({ ${xs.join(', ')} })`
              : `${z}.interface({`
              + '\n'
              + '  '.repeat(ix.length + 1)
              + xs.join(JOIN)
              + '\n'
              + '  '.repeat(ix.length)
              + '})'
        }
        case tagged('tuple')(x): {
          const xs = x._zod.def.items
          const WIDTH = `${z}.tuple([`.length + xs.reduce((acc, x) => acc + ', '.length + x.length, ix.length * 2) + '])'.length
          return xs.length === 0 ? `${z}.tuple([])`
            : WIDTH < MAX_WIDTH ? `${z}.tuple([${xs.join(', ')}])`
              : `${z}.tuple([`
              + '\n'
              + '  '.repeat(ix.length + 1)
              + xs.join(JOIN)
              + '\n'
              + '  '.repeat(ix.length)
              + `])`
        }
      }
    }

  export const fromJson: T.Functor.Algebra<Json.Free, z.ZodTypeAny> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x === null: return z.null()
      case x === undefined: return z.undefined()
      case typeof x === 'boolean': return z.boolean()
      case typeof x === 'symbol': return z.symbol()
      case typeof x === 'number': return z.number()
      case typeof x === 'string': return z.string()
      case Array_isArray(x):
        return x.length === 0 ? z.tuple([]) : z.tuple([x[0], ...x.slice(1)])
      case !!x && typeof x === 'object': return z.object(x)
    }
  }

  export const fromConstant
    : (options?: Options) => T.Functor.Algebra<Json.Free, z.ZodTypeAny>
    = (options = defaults) => (x) => {
      const { preferInterfaces } = { ...defaults, ...options }
      switch (true) {
        default: return fn.exhaustive(x)
        case x === null:
        case x === undefined:
        case typeof x === 'symbol':
        case typeof x === 'boolean':
        case typeof x === 'number':
        case typeof x === 'string': return z.literal(x)
        case Array_isArray(x):
          return x.length === 0 ? z.tuple([]) : z.tuple([x[0], ...x.slice(1)])
        case !!x && typeof x === 'object': return preferInterfaces ? z.strictInterface(x) : z.object(x).strict()
      }
    }

  export const stringFromJson
    : T.Functor.IndexedAlgebra<Functor.Index, Json.Free, string>
    = (x, { depth }) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case x === null:
        case x === undefined:
        case typeof x === 'boolean':
        case typeof x === 'number': return `z.literal(${String(x)})`
        case typeof x === 'string': return `z.literal("${x}")`
        case Array_isArray(x): {
          return x.length === 0 ? `z.tuple([])`
            : Print.lines({ indent: depth * 2 })(`z.tuple([`, x.join(', '), `])`)
        }
        case !!x && typeof x === 'object': {
          const xs = Object.entries(x)
          return xs.length === 0 ? `z.object({})`
            : Print.lines({ indent: depth * 2 })(
              `z.object({`,
              ...xs.map(([k, v]) => parseKey(k) + ': ' + v),
              `})`,
            )
        }
      }
    }

  export const _serializeShort
    : T.Functor.Algebra<Json.Free, string>
    = (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case x === null:
        case x === undefined:
        case typeof x === 'boolean':
        case typeof x === 'number':
        case typeof x === 'string': return globalThis.JSON.stringify(x)
        case Array_isArray(x): return x.length === 0 ? '[]' : '[' + x.join(', ') + ']'
        case !!x && typeof x === 'object': {
          const xs = Object.entries(x)
          return xs.length === 0 ? '{}' : '{' + xs.map(([k, v]) => parseKey(k) + ': ' + v).join(',') + '}]'
        }
      }
    }
}

/** 
 * ## {@link toString `zod.toString`}
 * 
 * Converts an arbitrary zod schema back into string form. Used internally 
 * for testing/debugging.
 * 
 * Very useful when you're applying transformations to a zod schema. 
 * Can be used (for example) to reify a schema, or perform codegen, 
 * and has more general applications in dev environments.
 * 
 * @example
 * import { zod } from "@traversable/algebra"
 * import * as vi from "vitest"
 * 
 * vi.expect(zod.toString( z.union([z.object({ tag: z.literal("Left") }), z.object({ tag: z.literal("Right") })])))
 * .toMatchInlineSnapshot(`z.union([z.object({ tag: z.literal("Left") }), z.object({ tag: z.literal("Right") })]))`)
 * 
 * vi.expect(zod.toString( z.tuple([z.number().min(0).lt(2), z.number().multipleOf(2), z.number().max(2).nullable()])))
 * .toMatchInlineSnapshot(`z.tuple([z.number().min(0).lt(2), z.number().multipleOf(2), z.number().max(2).nullable()])`)
 */
const toString
  : (schema: z.ZodType, options?: Algebra.toString.Options) => string
  = (schema, options = Algebra.toStringDefaults) => fn.cataIx(IndexedFunctor)(Algebra.toString(options))(schema as never, options.initialIndex ?? [])

/** 
 * ## {@link fromConstant `zod.fromConstant`}
 * 
 * Derive a zod schema from an arbitrary
 * [value object](https://en.wikipedia.org/wiki/Value_object). 
 * 
 * Used to make zod scemas compatible with the JSON Schema spec -- specifically, to support the
 * [`const` keyword](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-00#rfc.section.6.1.3),
 * added in [2020-12](https://json-schema.org/draft/2020-12/schema).
 */
export const fromConstant
  : (json: Json, options?: Options) => z.ZodType<unknown, unknown>
  = (json, options = defaults) => fn.cata(Json.Functor)(Algebra.fromConstant(options))(json)

const serializeShort
  : (value: {} | null) => string
  = fn.cata(Json.Functor)(Algebra._serializeShort)

export const fromUnknown
  : (value: unknown) => z.ZodTypeAny | undefined
  = (value) => !Json.is(value) ? void 0 : fromConstant(value)

export const fromConstantToSchemaString = fn.cataIx(IndexedJsonFunctor)(Algebra.stringFromJson)

export type Any<T extends z.ZodTypeAny = z.ZodTypeAny> =
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
