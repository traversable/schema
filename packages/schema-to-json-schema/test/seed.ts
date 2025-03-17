import type * as T from '@traversable/registry'
import { fn, parseKey, symbol, URI } from '@traversable/registry'

import type { SchemaOptions } from '@traversable/schema'
import { Equal, Json, Predicate, t } from '@traversable/schema'

import * as fc from './fast-check.js'

export {
  /* model */
  type Fixpoint,
  type Nullary,
  type Builder,
  type Free,
  type Seed,
  Functor,
  fold,
  unfold,
  is,
  isNullary,
  isUnary,
  isPositional,
  isAssociative,
  isSpecialCase,
  isSeed,
  defineSeed,
  /* algebra */
  data,
  extensibleArbitrary,
  toArbitrary,
  fromJsonLiteral,
  fromSchema,
  identity,
  predicate,
  predicateWithData,
  Recursive,
  toJson,
  toData,
  toBadData,
  toSchema,
  schema,
  seed,
  toString,
}

/**
 * - [ ] TODO: look into adding back the `groupScalars` config option, that way
 *       the generated schemas are more likely to be "deeper" without risk of stack overflow
 */

/** @internal */
const Object_fromEntries = globalThis.Object.fromEntries
/** @internal */
const Object_assign = globalThis.Object.assign
/** @internal */
const Array_isArray = globalThis.Array.isArray
/** @internal */
const opts = { optionalTreatment: 'treatUndefinedAndOptionalAsTheSame' } as const
/** @internal */
const isComposite = (u: unknown) => Array_isArray(u) || (u !== null && typeof u === 'object')

interface EqF<S = Json> extends T.inline<[tag: URI.eq, def: S]> { _schema?: t.eq.def<S> }
interface OptionalF<S> extends T.inline<[tag: URI.optional, def: S]> { _schema?: t.optional.def<S> }
interface ArrayF<S> extends T.inline<[tag: URI.array, def: S]> { _schema?: t.array.def<S> }
interface RecordF<S> extends T.inline<[tag: URI.record, def: S]> { _schema?: t.record.def<S> }
interface ObjectF<S> extends T.inline<[tag: URI.object, def: S]> { _schema?: t.object.def<S> }
interface TupleF<S> extends T.inline<[tag: URI.tuple, def: S]> { _schema?: t.tuple.def<S> }
interface UnionF<S> extends T.inline<[tag: URI.union, def: S]> { _schema?: t.union.def<S> }
interface IntersectF<S> extends T.inline<[tag: URI.intersect, def: S]> { _schema?: t.intersect.def<Extract<S, readonly unknown[]>> }

function eqF<S = Json>(def: S): EqF<S> { return [URI.eq, def] }
function optionalF<S>(def: S): OptionalF<S> { return [URI.optional, def] }
function arrayF<S>(def: S): ArrayF<S> { return [URI.array, def] }
function recordF<S>(def: S): RecordF<S> { return [URI.record, def] }
function objectF<S extends [k: string, v: unknown][]>(def: readonly [...S]): ObjectF<[...S]> { return [URI.object, [...def]] }
function tupleF<S extends readonly unknown[]>(def: readonly [...S]): TupleF<readonly [...S]> { return [URI.tuple, [...def]] }
function unionF<S extends readonly unknown[]>(def: readonly [...S]): UnionF<readonly [...S]> { return [URI.union, [...def]] }
function intersectF<S extends readonly unknown[]>(def: readonly [...S]): IntersectF<[...S]> { return [URI.intersect, [...def]] }

type Seed<F> =
  | Nullary
  | EqF
  | ArrayF<F>
  | RecordF<F>
  | OptionalF<F>
  | TupleF<readonly F[]>
  | UnionF<readonly F[]>
  | IntersectF<readonly F[]>
  | ObjectF<[k: string, v: F][]>
  ;

type Fixpoint
  = Nullary
  | EqF
  | ArrayF<Fixpoint>
  | RecordF<Fixpoint>
  | OptionalF<Fixpoint>
  | TupleF<readonly Fixpoint[]>
  | UnionF<readonly Fixpoint[]>
  | IntersectF<readonly Fixpoint[]>
  | ObjectF<[k: string, v: Fixpoint][]>
  ;

interface Free extends T.HKT { [-1]: Seed<this[0]> }

declare namespace Seed {
  export {
    Builder,
    Free,
    Fixpoint,
    Inductive,
    Nullary,
  }
}

type Nullary = typeof NullaryTags[number]
const NullaryTags = [
  URI.never,
  URI.any,
  URI.unknown,
  URI.void,
  URI.undefined,
  URI.null,
  URI.boolean,
  URI.symbol,
  URI.bigint,
  URI.integer,
  URI.number,
  URI.string,
] as const satisfies typeof URI[keyof typeof URI][]
const isNullary = (u: unknown): u is Nullary => NullaryTags.includes(u as never)

type SpecialCase<T = unknown> = [SpecialCaseTag, T]
type SpecialCaseTag = typeof SpecialCaseTags[number]
const SpecialCaseTags = [
  URI.eq
] as const satisfies typeof URI[keyof typeof URI][]
const isSpecialCaseTag = (u: unknown): u is SpecialCaseTag => SpecialCaseTags.includes(u as never)
const isSpecialCase = <T>(u: unknown): u is SpecialCase<T> => Array_isArray(u) && isSpecialCaseTag(u[0])

type Unary<T = unknown> = ArrayF<T> | RecordF<T> | OptionalF<T> // [UnaryTag, T]
type UnaryTag = typeof UnaryTags[number]
const UnaryTags = [
  URI.array,
  URI.record,
  URI.optional,
] as const satisfies typeof URI[keyof typeof URI][]

const isUnaryTag = (u: unknown): u is UnaryTag => UnaryTags.includes(u as never)
const isUnary = <T>(u: unknown): u is Unary<T> => Array_isArray(u) && isUnaryTag(u[0])

type Positional<T = unknown> = TupleF<T> | UnionF<T> | IntersectF<T>
// [PositionalTag, readonly T[]]
type PositionalTag = typeof PositionalTags[number]
const PositionalTags = [
  URI.union,
  URI.intersect,
  URI.tuple,
] as const satisfies typeof URI[keyof typeof URI][]

const isPositionalTag = (u: unknown): u is PositionalTag => PositionalTags.includes(u as never)
const isPositional = <T>(u: unknown): u is Positional<T> =>
  Array_isArray(u) &&
  isPositionalTag(u[0]) &&
  Array_isArray(u[1])

type Associative<T = unknown> = [AssociativeTag, [k: string, v: T][]]
type AssociativeTag = typeof AssociativeTags[number]
const AssociativeTags = [
  URI.object,
] as const satisfies typeof URI[keyof typeof URI][]

const isAssociativeTag = (u: unknown): u is AssociativeTag => AssociativeTags.includes(u as never)
const isAssociative = <T>(u: unknown): u is Associative<T> =>
  Array_isArray(u) &&
  isAssociativeTag(u[0])

const isSeed = (u: unknown) => isNullary(u)
  || isUnary(u)
  || isPositional(u)
  || isAssociative(u)
  || isSpecialCase(u)

/**
 * ## {@link is `is`}
 *
 * Type-guard from `unknown` to {@link Seed `Seed`}.
 *
 * The {@link is `is`} function is also an object whose properties narrow
 * to a particular member or subset of members of {@link Seed `Seed`}.
 */
function is(u: unknown) { return isSeed(u) }

is.nullary = isNullary
is.unary = isUnary
is.positional = isPositional
is.associative = isAssociative
is.special = isSpecialCase
is.string = (u: unknown) => u === URI.string
is.number = (u: unknown) => u === URI.number
is.bigint = (u: unknown) => u === URI.bigint
is.boolean = (u: unknown) => u === URI.boolean
is.undefined = (u: unknown) => u === URI.undefined
is.null = (u: unknown) => u === URI.null
is.any = (u: unknown) => u === URI.any
is.never = (u: unknown) => u === URI.never
is.null = (u: unknown) => u === URI.null
is.symbol = (u: unknown) => u === URI.symbol
is.unknown = (u: unknown) => u === URI.unknown
is.void = (u: unknown) => u === URI.void
is.eq = <T>(u: unknown): u is [tag: URI.eq, def: T] => Array_isArray(u) && u[0] === URI.eq
is.array = <T>(u: unknown): u is [tag: URI.array, T] => Array_isArray(u) && u[0] === URI.array
is.optional = <T>(u: unknown): u is [tag: URI.optional, T] => Array_isArray(u) && u[0] === URI.optional
is.record = <T>(u: unknown): u is [tag: URI.record, T] => Array_isArray(u) && u[0] === URI.record
is.union = <T>(u: unknown): u is [tag: URI.union, readonly T[]] => Array_isArray(u) && u[0] === URI.union
is.intersect = <T>(u: unknown): u is [tag: URI.intersect, readonly T[]] => Array_isArray(u) && u[0] === URI.intersect
is.tuple = <T>(u: unknown): u is [tag: URI.tuple, readonly T[]] => Array_isArray(u) && u[0] === URI.tuple
is.object = <T>(u: unknown): u is [tag: URI.tuple, { [x: string]: T }] => Array_isArray(u) && u[0] === URI.object

type Inductive<S>
  = [S] extends [infer T extends Nullary] ? T
  : [S] extends [readonly [Unary, infer T]] ? [S[0], Inductive<T>]
  : [S] extends [readonly [Positional, infer T extends readonly unknown[]]]
  ? [S[0], { -readonly [Ix in keyof T]: Inductive<T[Ix]> }]
  : [S] extends [readonly [Associative, infer T extends readonly [k: string, v: unknown][]]]
  ? [S[0], { -readonly [Ix in keyof T]: [T[Ix][0], Inductive<T[Ix][1]>] }]
  : T.TypeError<'Expected: Fixpoint'>

/**
 * Hand-tuned constructor that gives you both more precise and
 * more localized feedback than the TS compiler when you make a mistake
 * in an inline {@link Seed `Seed`} definition.
 *
 * When you're working with deeply nested tuples where only certain sequences
 * are valid constructions, this turns out to be pretty useful / necessary.
 */
function defineSeed<const T extends Inductive<T>>(seed: T): T { return seed }

interface Builder {
  never: URI.never
  any: URI.any
  unknown: URI.unknown
  void: URI.void
  null: URI.null
  undefined: URI.undefined
  symbol: URI.symbol
  boolean: URI.boolean
  bigint: URI.bigint
  number: URI.number
  string: URI.string
  eq: [tag: URI.eq, seed: Json]
  array: [tag: URI.array, seed: Fixpoint]
  record: [tag: URI.record, seed: Fixpoint]
  optional: [tag: URI.optional, seed: Fixpoint]
  tuple: [tag: URI.tuple, seed: readonly Fixpoint[]]
  union: [tag: URI.union, seed: readonly Seed.Fixpoint[]]
  intersect: [tag: URI.intersect, seed: readonly Seed.Fixpoint[]]
  object: [tag: URI.object, seed: [k: string, Fixpoint][]]
  tree: Omit<this, 'tree'>[keyof Omit<this, 'tree'>]
}

const NullarySchemaMap = {
  [URI.never]: t.never,
  [URI.void]: t.void,
  [URI.unknown]: t.unknown,
  [URI.any]: t.any,
  [URI.symbol]: t.symbol,
  [URI.null]: t.null,
  [URI.undefined]: t.undefined,
  [URI.boolean]: t.boolean,
  [URI.integer]: t.integer,
  [URI.number]: t.number,
  [URI.bigint]: t.bigint,
  [URI.string]: t.string,
} as const satisfies Record<Nullary, t.Fixpoint>

const NullaryArbitraryMap = {
  [URI.never]: fc.constant(void 0 as never),
  [URI.void]: fc.constant(void 0 as void),
  [URI.unknown]: fc.jsonValue(),
  [URI.any]: fc.jsonValue() as fc.Arbitrary<any>,
  [URI.symbol]: fc.string().map(Symbol.for),
  [URI.null]: fc.constant(null),
  [URI.undefined]: fc.constant(undefined),
  [URI.boolean]: fc.boolean(),
  [URI.integer]: fc.integer(),
  [URI.number]: fc.float(),
  [URI.bigint]: fc.bigInt(),
  [URI.string]: fc.string(),
} as const satisfies Record<Nullary, fc.Arbitrary<unknown>>

const NullaryStringMap = {
  [URI.never]: 'never',
  [URI.void]: 'void',
  [URI.unknown]: 'unknown',
  [URI.any]: 'any',
  [URI.symbol]: 'symbol',
  [URI.null]: 'null',
  [URI.undefined]: 'undefined',
  [URI.boolean]: 'boolean',
  [URI.integer]: 'integer',
  [URI.number]: 'number',
  [URI.bigint]: 'bigint',
  [URI.string]: 'string',
} as const satisfies Record<Nullary, string>

const NullaryPredicateMap = {
  [URI.never]: Predicate.never,
  [URI.void]: Predicate.undefined,
  [URI.unknown]: Predicate.any,
  [URI.any]: Predicate.any,
  [URI.symbol]: (u): u is symbol => Predicate.symbol(u) && u !== symbol.bad_data,
  [URI.null]: Predicate.null,
  [URI.undefined]: Predicate.undefined,
  [URI.boolean]: Predicate.boolean,
  [URI.integer]: (u): u is number => globalThis.Number.isInteger(u),
  [URI.number]: Predicate.number,
  [URI.bigint]: Predicate.bigint,
  [URI.string]: Predicate.string,
} as const satisfies Record<Nullary, (u: any) => boolean>


const Functor: T.Functor<Seed.Free, Seed.Fixpoint> = {
  map(f) {
    return (x) => {
      if (x == null) return x
      type T = ReturnType<typeof f>
      switch (true) {
        default: return x satisfies never
        case isNullary(x): return x satisfies Nullary
        case x[0] === URI.eq: return eqF(x[1]) satisfies Seed<T>
        case x[0] === URI.array: return arrayF(f(x[1])) satisfies Seed<T>
        case x[0] === URI.record: return recordF(f(x[1])) satisfies Seed<T>
        case x[0] === URI.optional: return optionalF(f(x[1])) satisfies Seed<T>
        case x[0] === URI.tuple: return tupleF(fn.map(x[1], f)) satisfies Seed<T>
        case x[0] === URI.union: return unionF(x[1].map(f)) satisfies Seed<T>
        case x[0] === URI.intersect: return intersectF(x[1].map(f)) satisfies Seed<T>
        case x[0] === URI.object: return objectF(x[1].map(([k, v]) => [k, f(v)])) satisfies Seed<T>
      }
    }
  }
}

const fold = fn.cata(Functor)
const unfold = fn.ana(Functor)

namespace Recursive {
  export const identity: T.Functor.Algebra<Seed.Free, Seed.Fixpoint> = (x) => x

  export const sort: T.Functor.Coalgebra<Seed.Free, Seed.Fixpoint> = (x) =>
    typeof x !== 'string' && x[0] === URI.tuple
      ? [x[0], [...x[1]].sort(sortSeedOptionalsLast)]
      : x

  export const toSchema_
    : (constraints?: Constraints['arbitraries']) => T.Functor.Algebra<Seed.Free, unknown>
    = ($) => (x) => {
      if (x == null) return x
      switch (true) {
        default: return fn.exhaustive(x)
        case isNullary(x): return NullarySchemaMap[x]
        case x[0] === URI.never: return ($?.never ?? NullarySchemaMap[x])
        case x[0] === URI.unknown: return ($?.unknown ?? NullarySchemaMap[x])
        case x[0] === URI.void: return ($?.void ?? NullarySchemaMap[x])
        case x[0] === URI.any: return ($?.any ?? NullarySchemaMap[x])
        case x[0] === URI.undefined: return ($?.undefined ?? NullarySchemaMap[x])
        case x[0] === URI.null: return ($?.null ?? NullarySchemaMap[x])
        case x[0] === URI.symbol: return ($?.symbol ?? NullarySchemaMap[x])
        case x[0] === URI.boolean: return ($?.boolean ?? NullarySchemaMap[x])
        case x[0] === URI.bigint: return ($?.bigint ?? NullarySchemaMap[x])
        case x[0] === URI.integer: return ($?.integer ?? NullarySchemaMap[x])
        case x[0] === URI.number: return ($?.number ?? NullarySchemaMap[x])
        case x[0] === URI.string: return ($?.string ?? NullarySchemaMap[x])
        case x[0] === URI.eq: return ($?.eq?.(x[1]) ?? t.eq.def(x[1]))
        case x[0] === URI.array: return ($?.array?.(x[1]) ?? t.array.def(x[1]))
        case x[0] === URI.record: return ($?.record?.(x[1]) ?? t.record.def(x[1]))
        case x[0] === URI.optional: return ($?.optional?.(x[1]) ?? t.optional.def(x[1]))
        case x[0] === URI.tuple: return ($?.tuple?.(x[1]) ?? t.tuple.def([...x[1]].sort(sortOptionalsLast), opts))
        case x[0] === URI.union: return ($?.union?.(x[1]) ?? t.union.def(x[1]))
        case x[0] === URI.intersect: return ($?.intersect?.(x[1]) ?? t.intersect.def(x[1]))
        case x[0] === URI.object: {
          const wrap = $?.object ?? t.object
          return (wrap(Object_fromEntries(x[1].map(([k, v]) => [parseKey(k), v])), opts))
        }
      }
    }

  export const toSchema: T.Functor.Algebra<Seed.Free, t.FullSchema> = (x) => {
    if (x == null) return x
    switch (true) {
      default: return fn.exhaustive(x)
      case isNullary(x): return NullarySchemaMap[x] satisfies t.FullSchema
      case x[0] === URI.eq: return t.eq.def(x[1]) satisfies t.FullSchema
      case x[0] === URI.array: return t.array.def(x[1]) satisfies t.FullSchema
      case x[0] === URI.record: return t.record.def(x[1]) satisfies t.FullSchema
      case x[0] === URI.optional: return t.optional.def(x[1] satisfies t.FullSchema)
      case x[0] === URI.union: return t.union.def(x[1]) satisfies t.FullSchema
      case x[0] === URI.intersect: return t.intersect.def(x[1]) satisfies t.FullSchema
      case x[0] === URI.tuple: return t.tuple.def([...x[1]].sort(sortOptionalsLast), opts) satisfies t.FullSchema
      case x[0] === URI.object: return t.object.def(Object_fromEntries(x[1].map(([k, v]) => [parseKey(k), v])), opts) satisfies t.FullSchema
    }
  }

  export const fromSchema: T.Functor.Algebra<t.Free, Seed.Fixpoint> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case t.isLeaf(x): return x.tag satisfies Seed.Fixpoint
      case x.tag === URI.array: return [x.tag, x.def] satisfies Seed.Fixpoint
      case x.tag === URI.record: return [x.tag, x.def] satisfies Seed.Fixpoint
      case x.tag === URI.optional: return [x.tag, x.def] satisfies Seed.Fixpoint
      case x.tag === URI.eq: return [x.tag, x.def] satisfies Seed.Fixpoint
      case x.tag === URI.tuple: return [x.tag, x.def] satisfies Seed.Fixpoint
      case x.tag === URI.union: return [x.tag, x.def] satisfies Seed.Fixpoint
      case x.tag === URI.intersect: return [x.tag, x.def] satisfies Seed.Fixpoint
      case x.tag === URI.object: return [x.tag, Object.entries(x.def)] satisfies Seed.Fixpoint
    }
  }

  export const toArbitrary: T.Functor.Algebra<Seed.Free, fc.Arbitrary<unknown>> = (x) => {
    if (x == null) return x
    switch (true) {
      default: return fn.exhaustive(x)
      case isNullary(x): return NullaryArbitraryMap[x]
      case x[0] === URI.eq: return fc.constant(x[1])
      case x[0] === URI.array: return fc.array(x[1])
      case x[0] === URI.record: return fc.dictionary(fc.string(), x[1])
      case x[0] === URI.optional: return fc.optional(x[1])
      case x[0] === URI.tuple: return fc.tuple(...x[1])
      case x[0] === URI.union: return fc.oneof(...x[1])
      case x[0] === URI.object: return fc.record(Object_fromEntries(x[1]))
      case x[0] === URI.intersect: {
        if (x[1].length === 1) return x[1][0]
        const ys = x[1].filter((_) => !isNullary(_))
        return ys.length === 0 ? x[1][0] : fc.tuple(...ys).map(
          ([head, ...tail]) => !isComposite(head) ? head
            : tail.reduce<typeof head>((acc, y) => isComposite(y) ? Object_assign(acc, y) : acc, head)
        )
      }
    }
  }

  export const toString: T.Functor.Algebra<Seed.Free, string> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case isNullary(x): return NullaryStringMap[x]
      case x[0] === URI.eq: return x[1] as never
      case x[0] === URI.array: return 'Array<' + x[1] + '>'
      case x[0] === URI.record: return 'Record<string, ' + x[1] + '>'
      case x[0] === URI.optional: return x[1] + '?'
      case x[0] === URI.union: return x[1].join(' | ')
      case x[0] === URI.intersect: return x[1].join(' & ')
      case x[0] === URI.tuple: return '[' + x[1].join(', ') + ']'
      case x[0] == URI.object: return '{ ' + x[1].flatMap(([k, v]) => `${parseKey(k)}: ${v}`).join(', ') + ' }'
    }
  }

  export const fromJsonLiteral: T.Functor.Algebra<Json.Free, Seed.Fixpoint> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x === null: return URI.null
      case x === void 0: return URI.undefined
      case typeof x === 'boolean': return URI.boolean
      case typeof x === 'number': return URI.number
      case typeof x === 'string': return URI.string
      case Json.isArray(x): return [URI.tuple, x] satisfies Seed.Fixpoint
      case Json.isObject(x): return [URI.object, Object.entries(x)] satisfies Seed.Fixpoint
    }
  }

  const eq
    : <T>(x: T) => (u: unknown) => u is T
    = (x) => (u): u is never => Equal.deep(x, u)

  export const toPredicate
    : (options: Required<SchemaOptions> & { minLength?: number }) => T.Functor.Algebra<Seed.Free, (x: any) => x is unknown>
    = (options) => (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isNullary(x): return NullaryPredicateMap[x]
        case x[0] === URI.eq: return eq(x[1])
        case x[0] === URI.array: return Predicate.is.array(x[1])
        case x[0] === URI.record: return Predicate.is.record(x[1])
        case x[0] === URI.optional: return Predicate.optional$(x[1])
        case x[0] === URI.union: return Predicate.is.union(x[1])
        case x[0] === URI.intersect: return Predicate.is.intersect(x[1])
        case x[0] === URI.tuple: return Predicate.is.tuple(options)(x[1])
        case x[0] === URI.object: return Predicate.is.object(Object_fromEntries(x[1]), options)
      }
    }

  export const toJson
    : T.Functor.Algebra<Seed.Free, Json<unknown>>
    = (x) => {
      if (x == null) return x
      switch (true) {
        default: return x
        case isNullary(x): return JsonMap[x] satisfies Json<unknown>
        case x[0] === URI.eq: return toJson(x[1] as never) satisfies Json<unknown>
        case x[0] === URI.array: return [] satisfies Json<unknown>
        case x[0] === URI.record: return {} satisfies Json<unknown>
        case x[0] === URI.optional: return x[1] satisfies Json<unknown>
        case x[0] === URI.object: return Object_fromEntries(x[1]) satisfies Json<unknown>
        case x[0] === URI.tuple: return x[1] satisfies Json<unknown>
        case x[0] === URI.record: return x[1] satisfies Json<unknown>
        case x[0] === URI.union: return x[1][0] satisfies Json<unknown>
        case x[0] === URI.intersect: return x[1].reduce(
          (acc, y) => acc == null ? acc : y == null ? y : Object_assign(acc, y),
          {}
        ) satisfies Json<unknown>
      }
    }

  /** 
   * ## {@link toData `Recursive.toData`}
   * 
   * The difference between {@link toData `Recursive.toData`} and {@link Recursive.toJson}
   * is that {@link toData `Recursive.toData`} can return any data value, whereas 
   * {@link Recursive.toJson} is only capable of returning valid JSON values (no symbols, 
   * no bigints, etc).
   */
  export const toData
    : T.Functor.Algebra<Seed.Free, {} | null | undefined>
    = (x) => {
      if (x == null) return x
      switch (true) {
        default: return x
        case isNullary(x): return DataMap[x]
        case x[0] === URI.eq: return toData(x[1] as never)
        case x[0] === URI.array: return []
        case x[0] === URI.record: return {}
        case x[0] === URI.optional: return x[1]
        case x[0] === URI.object: return Object_fromEntries(x[1])
        case x[0] === URI.tuple: return x[1]
        case x[0] === URI.record: return x[1]
        case x[0] === URI.union: return x[1][0]
        case x[0] === URI.intersect: return x[1].reduce(
          (acc, y) => acc == null ? acc : y == null ? y : Object_assign(acc, y),
          {}
        ) satisfies Json<unknown>
      }
    }

  export const toBadData
    : T.Functor.Algebra<Seed.Free, BadData<unknown>>
    = (x) => {
      if (x == null) return x
      switch (true) {
        default: return x
        case isNullary(x): return symbol.bad_data
        case x[0] === URI.eq: return symbol.bad_data
        case x[0] === URI.array: return [symbol.bad_data]
        case x[0] === URI.record: return { badData: symbol.bad_data }
        case x[0] === URI.optional: return symbol.bad_data
        case x[0] === URI.record: return x[1]
        case x[0] === URI.union: return symbol.bad_data
        case x[0] === URI.intersect: return symbol.bad_data
        case x[0] === URI.tuple: {
          // TODO: this implementation is lacking, because it only generates bad data
          // in the first slot of the tuple. If we're using this generator to test a
          // predicate, for example, that means we're only testing that the tuple
          // properly handles bad data when it's in the first slot.
          const [_, ...tail] = x[1]
          return [symbol.bad_data, ...tail]
        }
        case x[0] === URI.object: {
          const [head, ...tail] = x[1]
          const badData = [head[0], symbol.bad_data]
          return Object_fromEntries([badData, ...tail])
        }
      }
    }
}

export type SortBias<T>
  = Compare<keyof T>
  /**
   * If you provide a partial weight map, missing properties will fall back to `0`
   */
  | { [K in keyof T]+?: number }

const initialOrderMap = {
  string: 0,
  number: 1,
  object: 2,
  boolean: 3,
  undefined: 4,
  symbol: 5,
  bigint: 6,
  null: 7,
  eq: 8,
  array: 8,
  record: 9,
  optional: 10,
  tuple: 11,
  intersect: 12,
  union: 13,
  any: 14,
  unknown: 15,
  void: 16,
  never: 17,
} as const satisfies globalThis.Record<TypeName, number>

type TypeName = Exclude<keyof Builder, 'tree'>

export const initialOrder
  : (keyof typeof initialOrderMap)[]
  = Object
    .entries(initialOrderMap)
    .sort(([, l], [, r]) => l < r ? -1 : l > r ? 1 : 0)
    .map(([k]) => k as keyof typeof initialOrderMap)

type LibConstraints = {
  sortBias?: SortBias<Builder>
  exclude?: TypeName[]
  include?: TypeName[]
  // groupScalars?: boolean
}

/** @internal */
type TargetConstraints<T = unknown, U = T> = LibConstraints & {
  union: fc.ArrayConstraints,
  intersect: fc.ArrayConstraints,
  tree: fc.OneOfConstraints,
  object: fc.UniqueArrayConstraintsRecommended<T, U>
  tuple: fc.ArrayConstraints,
}

type ObjectConstraints<T, U> =
  & { min?: number, max?: number }
  & Omit<TargetConstraints<T, U>['object'], 'minLength' | 'maxLength'>

export type Constraints<T = unknown, U = T> = LibConstraints & {
  arbitraries?: {
    never?: unknown
    unknown?: unknown
    void?: unknown
    any?: unknown
    undefined?: unknown
    null?: unknown
    symbol?: unknown
    boolean?: unknown
    bigint?: unknown
    integer?: unknown
    number?: unknown
    string?: unknown
    eq?(x: unknown, $?: SchemaOptions): unknown
    array?(x: unknown, $?: SchemaOptions): unknown
    record?(x: unknown, $?: SchemaOptions): unknown
    optional?(x: unknown, $?: SchemaOptions): unknown
    union?(x: readonly unknown[], $?: SchemaOptions): unknown
    intersect?(x: readonly unknown[], $?: SchemaOptions): unknown
    tuple?(x: readonly unknown[], $?: SchemaOptions): unknown
    object?(x: { [x: string]: unknown }, $?: SchemaOptions): unknown
  }
  union?: TargetConstraints['union']
  intersect?: TargetConstraints['intersect']
  tree?: TargetConstraints['tree'],
  object?: ObjectConstraints<T, U>
  tuple?: TargetConstraints['tuple'],
}

const defaultDepthIdentifier = fc.createDepthIdentifier()
const defaultTupleConstraints = { minLength: 1, maxLength: 3, size: 'xsmall', depthIdentifier: defaultDepthIdentifier } as const satisfies fc.ArrayConstraints
const defaultIntersectConstraints = { minLength: 1, maxLength: 2, size: 'xsmall', depthIdentifier: defaultDepthIdentifier } as const satisfies fc.ArrayConstraints
const defaultUnionConstraints = { minLength: 2, maxLength: 2, size: 'xsmall' } as const satisfies fc.ArrayConstraints
const defaultObjectConstraints = { min: 1, max: 3, size: 'xsmall' } satisfies ObjectConstraints<never, never>

const defaultTreeConstraints = {
  maxDepth: 3,
  depthIdentifier: defaultDepthIdentifier,
  depthSize: 'xsmall',
  withCrossShrink: false,
} as const satisfies fc.OneOfConstraints

const defaults = {
  arbitraries: {},
  union: defaultUnionConstraints,
  intersect: defaultIntersectConstraints,
  tuple: defaultTupleConstraints,
  object: defaultObjectConstraints,
  tree: defaultTreeConstraints,
  sortBias: () => 0,
  include: initialOrder,
  exclude: [],
  // groupScalars: true,
} satisfies Required<Constraints>

interface Compare<T> { (left: T, right: T): number }

const isIndexableBy
  : <K extends keyof any>(u: unknown, k: K) => u is (Function | { [x: string]: unknown; }) & { [P in K]: unknown; }
  = (u, k): u is never => (typeof u === 'object' || typeof u === 'function') && !!u && k in u;

export const sortOptionalsLast = (l: unknown, r: unknown) => (
  isIndexableBy(l, 'tag') && l.tag === URI.optional ? 1
    : isIndexableBy(r, 'tag') && r.tag === URI.optional ? -1
      : 0
)

const sortSeedOptionalsLast = (l: Seed.Fixpoint, r: Seed.Fixpoint) =>
  isOptional(l) ? 1 : isOptional(r) ? -1 : 0

const isOptional = (node: Seed.Fixpoint): node is [URI.optional, Seed.Fixpoint] =>
  typeof node === 'string' ? false : node[0] === URI.optional

export const pickAndSortNodes
  : (nodes: readonly TypeName[]) => (constraints?: Pick<TargetConstraints, 'exclude' | 'include' | 'sortBias'>) => TypeName[]
  = (nodes) => ({
    include,
    exclude,
    sortBias,
  }: Pick<TargetConstraints, 'exclude' | 'include' | 'sortBias'> = defaults) => {
    const sortFn: Compare<TypeName> = sortBias === void 0 ? defaults.sortBias
      : typeof sortBias === 'function' ? sortBias
        : (l, r) => (sortBias[l] ?? 0) < (sortBias[r] ?? 0) ? 1 : (sortBias[l] ?? 0) > (sortBias[r] ?? 0) ? -1 : 0;
    return nodes
      .filter(
        (x) =>
          (include ? include.includes(x) : true) &&
          (exclude ? !exclude.includes(x) : true)
      )
      .sort(sortFn)
  }

const parseConstraints: <T, U>(constraints?: Constraints<T, U>) => Required<TargetConstraints<T, U>> = ({
  exclude = defaults.exclude,
  include = defaults.include,
  sortBias = defaults.sortBias,
  // groupScalars = defaults.groupScalars,
  object: {
    max: objectMaxLength = defaults.object.max,
    min: objectMinLength = defaults.object.min,
    size: objectSize = defaults.object.size,
  } = defaults.object,
  tree: {
    depthIdentifier: treeDepthIdentifier = defaults.tree.depthIdentifier,
    depthSize: treeDepthSize = defaults.tree.depthSize,
    maxDepth: treeMaxDepth = defaults.tree.maxDepth,
    withCrossShrink: treeWithCrossShrink = defaults.tree.withCrossShrink,
  } = defaults.tree,
  tuple: {
    maxLength: tupleMaxLength = defaults.tuple.maxLength,
    minLength: tupleMinLength = defaults.tuple.minLength,
    size: tupleSize = defaults.tuple.size,
    depthIdentifier: tupleDepthIdentifier = defaults.tuple.depthIdentifier,
  } = defaults.tuple,
  intersect: {
    maxLength: intersectMaxLength,
    minLength: intersectMinLength,
    size: intersectSize,
    depthIdentifier: intersectDepthIdentifier,
  } = defaults.intersect,
  union: {
    maxLength: unionMaxLength,
    minLength: unionMinLength,
    size: unionSize,
  } = defaults.union,
} = defaults) => {
  const object = {
    size: objectSize,
    maxLength: objectMaxLength,
    minLength: objectMinLength,
  } satisfies TargetConstraints['object']
  const tree = {
    depthIdentifier: treeDepthIdentifier,
    depthSize: treeDepthSize,
    maxDepth: treeMaxDepth,
    withCrossShrink: treeWithCrossShrink,
  } satisfies TargetConstraints['tree']
  const tuple = {
    depthIdentifier: tupleDepthIdentifier,
    maxLength: tupleMaxLength,
    minLength: tupleMinLength,
    size: tupleSize,
  } satisfies TargetConstraints['tuple']
  const intersect = {
    depthIdentifier: intersectDepthIdentifier,
    maxLength: intersectMaxLength,
    minLength: intersectMinLength,
    size: intersectSize,
  } satisfies TargetConstraints['intersect']
  const union = {
    depthIdentifier: defaultDepthIdentifier,
    maxLength: unionMaxLength,
    minLength: unionMinLength,
    size: unionSize,
  } satisfies TargetConstraints['union']

  return {
    include,
    exclude,
    sortBias,
    // groupScalars,
    object,
    tree,
    tuple,
    intersect,
    union,
  }
}

const JsonMap = {
  [URI.never]: void 0,
  [URI.unknown]: void 0,
  [URI.void]: void 0,
  [URI.any]: void 0,
  [URI.undefined]: void 0,
  [URI.null]: null,
  [URI.symbol]: globalThis.Symbol().toString(),
  [URI.boolean]: false,
  [URI.bigint]: 0,
  [URI.integer]: 0,
  [URI.number]: 0,
  [URI.string]: "",
} as const satisfies Record<Nullary, Json>

const DataMap = {
  [URI.never]: void 0,
  [URI.unknown]: void 0,
  [URI.void]: void 0,
  [URI.any]: void 0,
  [URI.undefined]: void 0,
  [URI.null]: null,
  [URI.symbol]: Symbol(),
  [URI.boolean]: false,
  [URI.bigint]: 0n,
  [URI.integer]: 0,
  [URI.number]: 0,
  [URI.string]: "",
} as const satisfies Record<Nullary, {} | null | undefined>

export type BadData<T = unknown>
  = symbol.bad_data
  | Json.Scalar
  | readonly T[]
  | { [x: string]: T }

const Nullaries = {
  never: fc.constant(URI.never),
  any: fc.constant(URI.any),
  unknown: fc.constant(URI.unknown),
  void: fc.constant(URI.void),
  null: fc.constant(URI.null),
  undefined: fc.constant(URI.undefined),
  symbol: fc.constant(URI.symbol),
  boolean: fc.constant(URI.boolean),
  bigint: fc.constant(URI.bigint),
  number: fc.constant(URI.number),
  string: fc.constant(URI.string),
}

function seed(_: Constraints = defaults) {
  const $ = parseConstraints(_)
  return (go: fc.LetrecTypedTie<Builder>) => ({
    ...Nullaries,
    eq: go('tree').map((_) => [URI.eq, toJson(_)]),
    array: go('tree').map((_) => [URI.array, _]),
    record: go('tree').map((_) => [URI.record, _]),
    optional: fc.optional(go('tree')).map((_) => [URI.optional, _]),
    tuple: fc.array(go('tree'), $.tuple).map((_) => [URI.tuple, _.sort(sortSeedOptionalsLast)] satisfies [any, any]),
    object: fc.entries(go('tree'), $.object).map((_) => [URI.object, _]),
    union: fc.array(go('tree'), $.union).map((_) => [URI.union, _]),
    intersect: fc.array(go('tree'), $.intersect).map((_) => [URI.intersect, _]),
    tree: fc.oneof($.tree, ...pickAndSortNodes(initialOrder)($).map(go) as ReturnType<typeof go<TypeName>>[]),
  } satisfies fc.LetrecValue<Builder>)
}

const identity = fold(Recursive.identity)
//    ^?

const toSchema
  : <S extends Fixpoint>(term: S) => t.FullSchema
  = fold(Recursive.toSchema)

const toArbitrary = fold(Recursive.toArbitrary)
//    ^?

const toString = fold(Recursive.toString)
//    ^?

const fromSchema = fn.cata(t.Functor)(Recursive.fromSchema as never)
//    ^?

const fromJsonLiteral = fold(Recursive.fromJsonLiteral)
//    ^?

const toBadData = fold(Recursive.toBadData)
//    ^?

const toData = fold(Recursive.toData)
//    ^?

const toJson
  : <S extends Fixpoint>(term: S) => Json
  = fold<Json>(Recursive.toJson as never)

const toPredicate = (options: Required<SchemaOptions> & { minLength?: number; }) => fold(Recursive.toPredicate(options))


/**
 * ## {@link schema `Seed.schema`}
 *
 * Generates an arbitrary,
 * [pseudo-random](https://en.wikipedia.org/wiki/Pseudorandomness)
 * {@link t `t`} schema.
 *
 * Internally, schemas are generated from a 
 * {@link Seed `seed value`}, which is itself generated by a library 
 * called [`fast-check`](https://github.com/dubzzz/fast-check).
 */
const schema
  : (constraints?: Constraints) => fc.Arbitrary<t.LowerBound>
  = (constraints) => fc.letrec(seed(constraints)).tree.map(toSchema) as never

const extensibleArbitrary = (constraints?: Constraints) =>
  fc.letrec(seed(constraints)).tree.map(fold(Recursive.toSchema_(constraints?.arbitraries)))

/**
 * ## {@link data `Seed.data`}
 *
 * Generates an arbitrary, 
 * [pseudo-random](https://en.wikipedia.org/wiki/Pseudorandomness) 
 * data generator.
 * 
 * Internally, schemas are generated from a 
 * {@link Seed `seed value`}, which is itself generated by a library 
 * called [`fast-check`](https://github.com/dubzzz/fast-check).
 * 
 * **Note:** Because the seed is generated via fast-check, and the
 * arbitrary is generated from the seed (also via fast-check), this
 * operation is monadic, which basically disqualifies the values this 
 * arbitrary generates from "shrinking".
 * 
 * There might be a clever way around this issue; see 
 * [this discussion](https://github.com/dubzzz/fast-check/discussions/5214)
 * for a good overview of the problem.
 */
const data
  : (constraints?: Constraints) => fc.Arbitrary<unknown>
  = (constraints) => fc.letrec(seed(constraints)).tree.chain(toArbitrary)

const predicate
  : (
    schemaOptions: Required<SchemaOptions> & { minLength?: number },
    constraints?: Constraints
  ) => fc.Arbitrary<(u: any) => u is unknown>
  = (
    schemaOptions,
    constraints
  ) => fc.letrec(seed(constraints)).tree.map(fold(Recursive.toPredicate(schemaOptions)))

type PredicateWithData<T = unknown> = {
  seed: Seed<T>
  data: Json<T>
  badData: BadData
  predicate: (u: any) => u is unknown
}

const predicateWithData
  : (
    schemaOptions: Required<SchemaOptions> & { minLength?: number },
    constraints?: Constraints
  ) => fc.Arbitrary<PredicateWithData>
  = (
    schemaOptions,
    constraints
  ) => fc.letrec(seed(constraints)).tree.map((s) => ({
    seed: s,
    data: toData(s),
    badData: toBadData(s),
    predicate: toPredicate(schemaOptions)(s),
  }))

