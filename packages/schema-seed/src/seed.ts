/**
 * - [ ] TODO: look into adding back the `groupScalars` config option, that way
 *       the generated schemas are more likely to be "deeper" without risk of stack overflow
 */
import * as fc from 'fast-check'

import type * as T from '@traversable/registry'
import { fn, parseKey, unsafeCompact, URI } from '@traversable/registry'
import { Json } from '@traversable/json'
import type { SchemaOptions } from '@traversable/schema'
import { t } from '@traversable/schema'

export {
  type Arbitraries,
  type Builder,
  type Constraints,
  type Fixpoint,
  type Free,
  type Nullary,
  type Positional,
  type Seed,
  type SortBias,
  type SpecialCase,
  type TypeName,
  type Unary,
  integerF as integer,
  bigintF as bigint,
  numberF as number,
  stringF as string,
  eqF as eq,
  optionalF as optional,
  arrayF as array,
  recordF as record,
  unionF as union,
  intersectF as intersect,
  objectF as object,
  tupleF as tuple,
  data,
  defaults,
  defineSeed,
  extensibleArbitrary,
  fold,
  fromJsonLiteral,
  fromSchema,
  Functor,
  getBounds,
  identity,
  initialOrder,
  is,
  isBoundable,
  isBoundableTag,
  isAssociative,
  isNullary,
  isPositional,
  isSeed,
  isSpecialCase,
  isUnary,
  numberConstraintsFromBounds,
  parseConstraints,
  Algebra,
  schema,
  schemaWithMinDepth,
  seed,
  stringConstraintsFromBounds,
  arbitraryFromSchema,
  invalidArbitraryFromSchema,
  invalidValue,
  toArbitrary,
  toInvalidArbitrary,
  toSchema,
  toString,
  unfold,
}

/** @internal */
type _ = unknown
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
/** @internal */
const isNumeric = t.union(t.number, t.bigint)

export const LEAST_UPPER_BOUND = 0x100000000
export const GREATEST_LOWER_BOUND = 1e-8

export type UniqueArrayDefaults<T = unknown, U = unknown> = fc.UniqueArrayConstraintsRecommended<T, U>

let identifier = fc.stringMatching(new RegExp('^[$_a-zA-Z][$_a-zA-Z0-9]*$', 'u'))

let entries = <T, U>(model: fc.Arbitrary<T>, constraints?: UniqueArrayDefaults<T, U>) => fc.uniqueArray(
  fc.tuple(
    identifier,
    model),
  { ...constraints, selector: ([k]) => k }
)


declare namespace InferSchema {
  type SchemaMap = {
    [URI.never]: t.never
    [URI.any]: t.any
    [URI.unknown]: t.unknown
    [URI.void]: t.void
    [URI.null]: t.null
    [URI.undefined]: t.undefined
    [URI.boolean]: t.boolean
    [URI.symbol]: t.symbol
    [URI.integer]: t.integer
    [URI.bigint]: t.bigint
    [URI.number]: t.number
    [URI.string]: t.string
    [URI.eq]: t.eq<any>
    [URI.array]: t.array<any>
    [URI.optional]: t.optional<any>
    [URI.record]: t.record<any>
    [URI.union]: t.union<any>
    [URI.intersect]: t.intersect<any>
    [URI.tuple]: t.tuple<any>
    [URI.object]: t.object<any>
  }
  type LookupSchema<T> = SchemaMap[(T extends Boundable ? T[0] : T) & keyof SchemaMap]
  type CatchUnknown<T> = unknown extends T ? SchemaMap[keyof SchemaMap] : T
  type fromFixpoint<T> = CatchUnknown<
    T extends { 0: infer Head, 1: infer Tail }
    ? [Head, Tail] extends [[URI.integer] | [URI.integer, any], any] ? t.integer
    : [Head, Tail] extends [URI.eq, any] ? t.eq<any>
    : [Head, Tail] extends [URI.optional, Fixpoint] ? t.optional<LookupSchema<Tail>>
    : [Head, Tail] extends [URI.array, Fixpoint] ? t.array<LookupSchema<Tail>>
    : [Head, Tail] extends [URI.record, Fixpoint] ? t.record<LookupSchema<Tail>>
    : [Head, Tail] extends [URI.union, Fixpoint[]] ? t.union<{ [I in keyof Tail]: LookupSchema<Tail[I]> }>
    : [Head, Tail] extends [URI.intersect, Fixpoint[]] ? t.intersect<{ [I in keyof Tail]: LookupSchema<Tail[I]> }>
    : [Head, Tail] extends [URI.tuple, Fixpoint[]] ? t.tuple<{ [I in keyof Tail]: LookupSchema<Tail[I]> }>
    : [Head, Tail] extends [URI.object, infer Entries extends [k: string, v: any][]] ? t.object<{ [E in Entries[number]as E[0]]: LookupSchema<E[1]> }>
    : LookupSchema<T>
    : unknown
  >
}

/**
 * If you provide a partial weight map, missing properties will fall back to `0`
 */
type SortBias<T>
  = T.Comparator<keyof T>
  | { [K in keyof T]+?: number }

type TypeName = Exclude<keyof Builder, 'tree'>

const initialOrderMap = {
  string: 0,
  number: 1,
  object: 2,
  boolean: 3,
  undefined: 4,
  symbol: 5,
  integer: 6,
  bigint: 7,
  null: 8,
  eq: 9,
  array: 9,
  record: 10,
  optional: 11,
  tuple: 12,
  intersect: 13,
  union: 14,
  any: 15,
  unknown: 16,
  void: 17,
  never: 18,
} as const satisfies globalThis.Record<TypeName, number>

const initialOrder
  : (keyof typeof initialOrderMap)[]
  = Object
    .entries(initialOrderMap)
    .sort(([, l], [, r]) => l < r ? -1 : l > r ? 1 : 0)
    .map(([k]) => k as keyof typeof initialOrderMap)

interface Bounds {
  [URI.integer]: {
    typeName: T.TypeName<URI.integer>
    bounds: IntegerBounds
    ctor: typeof integerF
    arbitrary: (bounds?: IntegerBounds) => fc.Arbitrary<number>
    schema:
    | t.integer
    | t.integer.min<number>
    | t.integer.max<number>
  }
  [URI.bigint]: {
    typeName: T.TypeName<URI.bigint>
    bounds: BigIntBounds
    ctor: typeof bigintF
    arbitrary: (bounds?: BigIntBounds) => fc.Arbitrary<bigint | number>
    schema:
    | t.bigint
    | t.bigint.min<bigint>
    | t.bigint.max<bigint>
  }
  [URI.number]: {
    typeName: T.TypeName<URI.number>
    bounds: NumberBounds
    ctor: typeof numberF
    arbitrary: (bounds?: NumberBounds) => fc.Arbitrary<number>
    schema:
    | t.number
    | t.number.min<number>
    | t.number.max<number>
    | t.number.moreThan<number>
    | t.number.lessThan<number>
  }
  [URI.string]: {
    typeName: T.TypeName<URI.string>
    bounds: StringBounds
    ctor: typeof stringF
    arbitrary: (bounds?: StringBounds) => fc.Arbitrary<string>
    schema:
    | t.string
    | t.string.min<number>
    | t.string.max<number>
  }
  [URI.array]: {
    typeName: T.TypeName<URI.array>
    bounds: ArrayBounds
    ctor: typeof arrayF
    arbitrary: (arb: fc.Arbitrary<unknown>, bounds?: ArrayBounds) => fc.Arbitrary<unknown[]>
    schema:
    | t.array<{}>
    | t.array.min<number, {}>
    | t.array.max<number, {}>
  }
}

/** @internal */
type TargetConstraints<
  T = unknown,
  U = T,
  Exclude extends TypeName = never,
  Include extends TypeName = TypeName,
> = LibConstraints<Exclude, Include> & {
  integer: fc.IntegerConstraints
  number: fc.DoubleConstraints
  bigint: fc.BigIntConstraints
  string: fc.IntegerConstraints
  array: fc.IntegerConstraints
  union: fc.ArrayConstraints
  intersect: fc.ArrayConstraints
  tree: fc.OneOfConstraints
  object: fc.UniqueArrayConstraintsRecommended<T, U>
  tuple: fc.ArrayConstraints
  eq: EqConstraints
}

type EqConstraints = {
  arbitrary?: fc.Arbitrary<unknown>
}

type LibConstraints<
  Exclude extends TypeName,
  Include extends TypeName = TypeName
> = {
  sortBias?: SortBias<Builder>
  exclude?: Exclude[]
  include?: Include[]
  forceInvalid?: boolean
  // groupScalars?: boolean
}

type ObjectConstraints<T, U> =
  & { min?: number, max?: number }
  & Omit<TargetConstraints<T, U>['object'], 'minLength' | 'maxLength'>

type Arbitraries = {
  never?: unknown
  unknown?: unknown
  void?: unknown
  any?: unknown
  undefined?: unknown
  null?: unknown
  symbol?: unknown
  boolean?: unknown
  integer?: unknown
  number?: unknown
  bigint?: unknown
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

type Constraints<
  Exclude extends TypeName,
  Include extends TypeName = TypeName,
  T = unknown,
  U = T
> = LibConstraints<Exclude, Include> & {
  arbitraries?: Arbitraries
  integer?: TargetConstraints['integer']
  bigint?: TargetConstraints['bigint']
  number?: TargetConstraints['number']
  string?: TargetConstraints['string']
  array?: TargetConstraints['array']
  union?: TargetConstraints['union']
  intersect?: TargetConstraints['intersect']
  tree?: TargetConstraints['tree'],
  object?: ObjectConstraints<T, U>
  tuple?: TargetConstraints['tuple'],
  eq?: TargetConstraints['eq']
}

const defaultDepthIdentifier = fc.createDepthIdentifier()
const defaultTupleConstraints = { minLength: 1, maxLength: 3, size: 'xsmall', depthIdentifier: defaultDepthIdentifier } as const satisfies fc.ArrayConstraints
const defaultIntersectConstraints = { minLength: 1, maxLength: 2, size: 'xsmall', depthIdentifier: defaultDepthIdentifier } as const satisfies fc.ArrayConstraints
const defaultUnionConstraints = { minLength: 2, maxLength: 2, size: 'xsmall' } as const satisfies fc.ArrayConstraints
const defaultObjectConstraints = { min: 1, max: 3, size: 'xsmall' } satisfies ObjectConstraints<never, never>
const defaultEqConstraints = { arbitrary: fc.jsonValue() } satisfies EqConstraints

const defaultTreeConstraints = {
  maxDepth: 3,
  depthIdentifier: defaultDepthIdentifier,
  depthSize: 'xsmall',
  withCrossShrink: false,
} as const satisfies fc.OneOfConstraints

const defaultIntegerConstraints = { min: -0x100, max: 0x100 } satisfies fc.IntegerConstraints
const defaultNumberConstraints = { min: -0x10000, max: 0x10000, noNaN: true, noDefaultInfinity: true } satisfies fc.DoubleConstraints
const defaultBigIntConstraints = { min: -0x1000000n, max: 0x1000000n } satisfies fc.BigIntConstraints
const defaultStringConstraints = { min: 0, max: 0x100 } satisfies fc.IntegerConstraints
const defaultArrayConstraints = { min: 0, max: 0x10 } satisfies fc.IntegerConstraints

const defaults = {
  arbitraries: {},
  integer: defaultIntegerConstraints,
  bigint: defaultBigIntConstraints,
  number: defaultNumberConstraints,
  string: defaultStringConstraints,
  array: defaultArrayConstraints,
  union: defaultUnionConstraints,
  intersect: defaultIntersectConstraints,
  tuple: defaultTupleConstraints,
  object: defaultObjectConstraints,
  eq: defaultEqConstraints,
  tree: defaultTreeConstraints,
  sortBias: () => 0,
  include: initialOrder,
  exclude: [] as [],
  forceInvalid: false,
  // groupScalars: true,
} satisfies Required<Constraints<never, TypeName>>

interface InclusiveBounds<T = number> {
  minimum?: T
  maximum?: T
}

interface ExclusiveBounds<T = number> {
  exclusiveMinimum?: T
  exclusiveMaximum?: T
}

interface StringBounds extends InclusiveBounds {}
interface ArrayBounds extends InclusiveBounds {}
interface IntegerBounds extends InclusiveBounds {}
interface NumberBounds extends InclusiveBounds, ExclusiveBounds {}
interface BigIntBounds extends InclusiveBounds<bigint | number> {}

interface integerF extends T.inline<[tag: URI.integer, constraints?: IntegerBounds]> {}
interface bigintF extends T.inline<[tag: URI.bigint, constraints?: BigIntBounds]> {}
interface numberF extends T.inline<[tag: URI.number, constraints?: NumberBounds]> {}
interface stringF extends T.inline<[tag: URI.string, constraints?: StringBounds]> {}
interface arrayF<S> extends T.inline<[tag: URI.array, def: S, constraints?: ArrayBounds]> {}

function integerF(constraints?: IntegerBounds): integerF { return !constraints ? [URI.integer] : [URI.integer, constraints] }
function bigintF(constraints?: BigIntBounds): bigintF { return !constraints ? [URI.bigint] : [URI.bigint, constraints] }
function numberF(constraints?: NumberBounds): numberF { return !constraints ? [URI.number] : [URI.number, constraints] }
function stringF(constraints?: StringBounds): stringF { return !constraints ? [URI.string] : [URI.string, constraints] }
function arrayF<S>(def: S, constraints?: ArrayBounds): arrayF<S> { return !constraints ? [URI.array, def] : [URI.array, def, constraints] }

interface eqF<S = Json> extends T.inline<[tag: URI.eq, def: S]> {}
interface optionalF<S> extends T.inline<[tag: URI.optional, def: S]> {}
interface recordF<S> extends T.inline<[tag: URI.record, def: S]> {}
interface objectF<S> extends T.inline<[tag: URI.object, def: S]> {}
interface tupleF<S> extends T.inline<[tag: URI.tuple, def: S]> {}
interface unionF<S> extends T.inline<[tag: URI.union, def: S]> {}
interface intersectF<S> extends T.inline<[tag: URI.intersect, def: S]> {}

function eqF<V = Json>(def: V): eqF<V> { return [URI.eq, def] }
function optionalF<S>(def: S): optionalF<S> { return [URI.optional, def] }
function recordF<S>(def: S): recordF<S> { return [URI.record, def] }
function objectF<S extends [k: string, v: unknown][]>(def: readonly [...S]): objectF<[...S]> { return [URI.object, [...def]] }
function tupleF<S extends readonly unknown[]>(def: readonly [...S]): tupleF<readonly [...S]> { return [URI.tuple, [...def]] }
function unionF<S extends readonly unknown[]>(def: readonly [...S]): unionF<readonly [...S]> { return [URI.union, [...def]] }
function intersectF<S extends readonly unknown[]>(def: readonly [...S]): intersectF<readonly [...S]> { return [URI.intersect, [...def]] }

type Seed<F>
  = Nullary
  | Boundable
  | eqF<F>
  | arrayF<F>
  | recordF<F>
  | optionalF<F>
  | tupleF<readonly F[]>
  | unionF<readonly F[]>
  | intersectF<readonly F[]>
  | objectF<[k: string, v: F][]>


type Fixpoint
  = Nullary
  | Boundable
  | eqF
  | arrayF<Fixpoint>
  | recordF<Fixpoint>
  | optionalF<Fixpoint>
  | tupleF<readonly Fixpoint[]>
  | unionF<readonly Fixpoint[]>
  | intersectF<readonly Fixpoint[]>
  | objectF<[k: string, v: Fixpoint][]>


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
] as const satisfies typeof URI[keyof typeof URI][]
const isNullary = (u: unknown): u is Nullary => NullaryTags.includes(u as never)

export const laxMin = (...xs: (number | undefined)[]) => {
  const ys = xs.filter(t.number)
  return ys.length === 0 ? void 0 : Math.min(...ys)
}
export const laxMax = (...xs: (number | undefined)[]) => {
  const ys = xs.filter(t.number)
  return ys.length === 0 ? void 0 : Math.max(...ys)
}

const makeInclusiveBounds = <T>(model: fc.Arbitrary<T>) => ({ minimum: model, maximum: model })
const makeExclusiveBounds = <T>(model: fc.Arbitrary<T>) => ({ ...makeInclusiveBounds(model), exclusiveMinimum: model, exclusiveMaximum: model })

/** Related: https://github.com/dubzzz/fast-check/issues/5934 */
const minimumMinMaxDelta = 0.00000018
const checkIfBoundsAreTooClose = (bounds: { max?: number, min?: number, xMax?: number, xMin?: number }) => {
  return t.object({ min: t.number, max: t.number, xMin: t.number, xMax: t.number })(bounds)
    && Math.abs(bounds.max - bounds.min) < minimumMinMaxDelta
}

/**
 * It's _crazy_ how complicated this is.
 *
 * Surely there's a more elegant way to accomplish this.
 */
export const preprocessNumberBounds = ({ minimum: min_, maximum: max_, exclusiveMinimum: xMin_, exclusiveMaximum: xMax_ }: NumberBounds): NumberBounds => {
  let min = laxMin(min_, max_)
  let max = laxMax(min_, max_)
  let xMin = laxMin(xMin_, xMax_)
  let xMax = laxMax(xMin_, xMax_)
  let noExclusiveMin = (xMin === xMax && xMin !== xMin_)
  let noExclusiveMax = (xMin === xMax && xMax !== xMax_) || (t.number(xMin) && t.number(xMax) && xMin === xMax)
  let noMin = (t.number(xMin) && !noExclusiveMin) || (min === max && min !== min_) || !t.number(min) || t.number(xMin) || (t.number(xMax) && min > xMax)
  let noMax = (t.number(xMax) && !noExclusiveMax) || (min === max && max !== max_) || !t.number(max) || t.number(xMax) || (t.number(xMin) && max > xMin)
  // let boundsAreTooClose = t.number(min) && t.number(max) ? Math.abs(max - min) > minimumMinMaxDelta : false
  let boundsAreTooClose = checkIfBoundsAreTooClose({ min, max, xMin, xMax })
  return unsafeCompact({
    minimum: noMin ? void 0 : min, // t.number(min) ? Math.fround(min) : min,
    maximum: noMax ? void 0 : max, // noMin ? max : t.number(max) && boundsAreTooClose ? Math.fround(max + 1) : max,
    // maximum: noMax ? void 0 : max,
    exclusiveMinimum: noExclusiveMin ? void 0 : xMin,
    exclusiveMaximum: noExclusiveMax ? void 0 : xMax,
  })
}

const preprocessInclusiveBounds = <T>({ minimum, maximum }: InclusiveBounds<T>) => {
  if (isNumeric(minimum))
    if (isNumeric(maximum)) return {
      minimum: minimum < maximum ? minimum : maximum,
      maximum: minimum > maximum ? minimum : maximum,
    }
    else return { minimum }
  else if (isNumeric(maximum)) return { maximum }
  else return void 0
}

const stringBounds = fc.record(makeInclusiveBounds(fc.integer(defaultStringConstraints)), { requiredKeys: [] }).map(preprocessInclusiveBounds)
const arrayBounds = fc.record(makeInclusiveBounds(fc.integer(defaultArrayConstraints)), { requiredKeys: [] }).map(preprocessInclusiveBounds)
const integerBounds = fc.record(makeInclusiveBounds(fc.integer(defaultIntegerConstraints)), { requiredKeys: [] }).map(preprocessInclusiveBounds)
const bigintBounds = fc.record(makeInclusiveBounds(fc.bigInt(defaultBigIntConstraints)), { requiredKeys: [] }).map(preprocessInclusiveBounds)
const numberBounds = fc.record(makeExclusiveBounds(fc.float(defaultNumberConstraints)), { requiredKeys: [] }).map(preprocessNumberBounds)

type Boundable =
  | integerF
  | bigintF
  | numberF
  | stringF

type BoundableTag = typeof BoundableTags[number]
const BoundableTags = [
  URI.bigint,
  URI.integer,
  URI.number,
  URI.string,
] as const satisfies typeof URI[keyof typeof URI][]
const isBoundableTag = (u: unknown): u is BoundableTag => BoundableTags.includes(u as never)
const isBoundable = (u: unknown): u is Boundable => t.has(0, isBoundableTag)(u)

type SpecialCase<T = unknown> = [SpecialCaseTag, T]
type SpecialCaseTag = typeof SpecialCaseTags[number]
const SpecialCaseTags = [
  URI.eq
] as const satisfies typeof URI[keyof typeof URI][]
const isSpecialCaseTag = (u: unknown): u is SpecialCaseTag => SpecialCaseTags.includes(u as never)
const isSpecialCase = <T>(u: unknown): u is SpecialCase<T> => Array_isArray(u) && isSpecialCaseTag(u[0])

type Unary<T = unknown> = arrayF<T> | recordF<T> | optionalF<T> // [UnaryTag, T]
type UnaryTag = typeof UnaryTags[number]
const UnaryTags = [
  URI.array,
  URI.record,
  URI.optional,
] as const satisfies typeof URI[keyof typeof URI][]

const isUnaryTag = (u: unknown): u is UnaryTag => UnaryTags.includes(u as never)
const isUnary = <T>(u: unknown): u is Unary<T> => Array_isArray(u) && isUnaryTag(u[0])

type Positional<T = unknown> = tupleF<T> | unionF<T> | intersectF<T>
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
const AssociativeTags = [URI.object] as const satisfies typeof URI[keyof typeof URI][]

const isAssociativeTag = (u: unknown): u is AssociativeTag => AssociativeTags.includes(u as never)
const isAssociative = <T>(u: unknown): u is Associative<T> =>
  Array_isArray(u) &&
  isAssociativeTag(u[0])

const isSeed = (u: unknown): u is unknown => isNullary(u)
  || isUnary(u)
  || isBoundable(u)
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
is.never = (u: unknown) => u === URI.never
is.any = (u: unknown) => u === URI.any
is.unknown = (u: unknown) => u === URI.unknown
is.void = (u: unknown) => u === URI.void
is.null = (u: unknown) => u === URI.null
is.undefined = (u: unknown) => u === URI.undefined
is.boolean = (u: unknown) => u === URI.boolean
is.symbol = (u: unknown) => u === URI.symbol
is.string = t.has(0, (u) => u === URI.string)
is.number = t.has(0, (u) => u === URI.number)
is.integer = t.has(0, (u) => u === URI.integer)
is.bigint = t.has(0, (u) => u === URI.bigint)
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
  : [S] extends [readonly [Unary, infer T]] ? [tag: S[0], unary: Inductive<T>]
  : [S] extends [readonly [Positional, infer T extends readonly unknown[]]]
  ? [S[0], { -readonly [Ix in keyof T]: Inductive<T[Ix]> }]
  : [S] extends [readonly [Associative, infer T extends readonly [k: string, v: unknown][]]]
  ? [S[0], { -readonly [Ix in keyof T]: [k: T[Ix][0], v: Inductive<T[Ix][1]>] }]
  : T.TypeError<'Expected: Fixpoint'>

/**
 * Hand-tuned constructor that gives you both more precise and
 * more localized feedback than the TS compiler when you make a mistake
 * in an inline {@link Seed `Seed`} definition.
 *
 * When you're working with deeply nested tuples where only certain sequences
 * are valid constructions, this turns out to be pretty useful / necessary.
 */
function defineSeed<T extends Inductive<T>>(seed: T): T { return seed }

interface Builder {
  never: URI.never
  any: URI.any
  unknown: URI.unknown
  void: URI.void
  null: URI.null
  undefined: URI.undefined
  symbol: URI.symbol
  boolean: URI.boolean
  bigint: [URI.bigint, BigIntBounds]
  integer: [URI.integer, IntegerBounds]
  number: [URI.number, NumberBounds]
  string: [URI.string, StringBounds]
  eq: [tag: URI.eq, seed: Json]
  array: [tag: URI.array, seed: Fixpoint, ArrayBounds]
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
} as const satisfies Record<Nullary, t.Fixpoint>

const BoundableSchemaMap = {
  [URI.integer]: (bounds) => {
    let schema = t.integer
    if (!bounds) return schema
    if (t.integer(bounds.minimum)) void (schema = schema.min(bounds.minimum))
    if (t.integer(bounds.maximum)) void (schema = schema.max(bounds.maximum))
    return schema
  },
  [URI.bigint]: (bounds) => {
    let schema = t.bigint
    if (!bounds) return schema
    if (t.bigint(bounds.minimum)) void (schema = schema.min(bounds.minimum))
    if (t.bigint(bounds.maximum)) void (schema = schema.max(bounds.maximum))
    return schema
  },
  [URI.number]: (bounds) => {
    let schema = t.number
    if (!bounds) return schema
    if (t.number(bounds.exclusiveMinimum)) void (schema = schema.moreThan(bounds.exclusiveMinimum))
    if (t.number(bounds.exclusiveMaximum)) void (schema = schema.lessThan(bounds.exclusiveMaximum))
    if (t.number(bounds.minimum)) void (schema = schema.min(bounds.minimum))
    if (t.number(bounds.maximum)) void (schema = schema.max(bounds.maximum))
    return schema
  },
  [URI.string]: (bounds) => {
    let schema = t.string
    if (!bounds) return schema
    if (t.integer(bounds.minimum)) void (schema = schema.min(bounds.minimum))
    if (t.integer(bounds.maximum)) void (schema = schema.max(bounds.maximum))
    return schema
  },
  [URI.array]: (bounds, child) => {
    let schema = t.array.def(!child ? t.unknown : child)
    if (!bounds) return schema
    if (t.integer(bounds?.minimum)) void (schema = schema.min(bounds.minimum))
    if (t.integer(bounds?.maximum)) void (schema = schema.max(bounds.maximum))
    return schema
  },
} as const satisfies { [K in keyof Bounds]: (bounds?: Bounds[K]['bounds'], child?: unknown) => Bounds[K]['schema'] }

const NullaryArbitraryMap = {
  [URI.never]: fc.constant(void 0 as never),
  [URI.void]: fc.constant(void 0 as void),
  [URI.unknown]: fc.jsonValue(),
  [URI.any]: fc.jsonValue() as fc.Arbitrary<any>,
  [URI.symbol]: fc.string().map(Symbol.for),
  [URI.null]: fc.constant(null),
  [URI.undefined]: fc.constant(undefined),
  [URI.boolean]: fc.boolean(),
} as const satisfies Record<Nullary, fc.Arbitrary<unknown>>

const integerConstraintsFromBounds = (bounds: InclusiveBounds = {}) => {
  const {
    maximum: max = NaN,
    minimum: min = NaN
  } = bounds
  let constraints: fc.IntegerConstraints = {}
  let minimum = getMin(min, max)
  let maximum = getMax(max, min)
  if (t.integer(minimum)) constraints.min = minimum
  if (t.integer(maximum)) constraints.max = maximum
  return constraints
}

const numberConstraintsFromBounds = (bounds: InclusiveBounds<number> & ExclusiveBounds<number> = {}): fc.DoubleConstraints => {
  if (Object.keys(bounds).length === 0) return {}
  let { minimum: min_, maximum: max_, exclusiveMinimum: xMin, exclusiveMaximum: xMax } = bounds
  let exclusiveMinimum = isNumeric(xMin) ? isNumeric(xMax) ? getExclusiveMin(xMin, xMax) : xMin : void 0
  let exclusiveMaximum = isNumeric(xMax) ? isNumeric(xMin) ? getExclusiveMax(xMax, xMin) : xMax : void 0
  let minimum = isNumeric(min_) ? isNumeric(max_) ? getMin(min_, max_) : min_ : void 0
  let maximum = isNumeric(max_) ? isNumeric(min_) ? getMax(max_, min_) : max_ : void 0
  let min = isNumeric(exclusiveMinimum) ? !isNumeric(minimum) ? exclusiveMinimum : getMax(minimum, exclusiveMinimum) : minimum
  let max = isNumeric(exclusiveMaximum) ? !isNumeric(maximum) ? exclusiveMaximum : getMin(maximum, exclusiveMaximum) : maximum
  return unsafeCompact({
    min: isNumeric(min) ? getMin(min, max) : void 0,
    max: isNumeric(max) ? getMax(max, min) : void 0,
    minExcluded: isNumeric(exclusiveMinimum) && min === exclusiveMinimum,
    maxExcluded: isNumeric(exclusiveMaximum) && max === exclusiveMaximum,
    // noDefaultInfinity: true,
    // noNaN: true,
  })
}

const isNaN = globalThis.Number.isNaN
const absorbNaN = <T extends number | bigint>(x?: T) => isNaN(x) ? void 0 : x

const getMin = <T extends bigint | number>(x_: T, y_?: T, x: typeof y_ = absorbNaN(x_), y: typeof y_ = absorbNaN(y_)) => absorbNaN(
  x === void 0 ? void 0 : y === void 0 ? x : x <= y ? x : y <= x ? y : void 0
)

const getExclusiveMin = <T extends bigint | number>(x_: T, y_?: T, x: typeof y_ = absorbNaN(x_), y: typeof y_ = absorbNaN(y_)) => absorbNaN(
  x === void 0 ? void 0 : y === void 0 ? x : x < y ? x : y < x ? y : void 0
)

const getMax = <T extends bigint | number>(x_: T, y_?: T, x: typeof y_ = absorbNaN(x_), y: typeof y_ = absorbNaN(y_)) => absorbNaN(
  x === void 0 ? void 0 : y === void 0 ? x : x >= y ? x : y >= x ? y : void 0
)

const getExclusiveMax = <T extends bigint | number>(x_: T, y_?: T, x: typeof y_ = absorbNaN(x_), y: typeof y_ = absorbNaN(y_)) => absorbNaN(
  x === void 0 ? void 0 : y === void 0 ? x : x > y ? x : y > x ? y : void 0
)

const bigintConstraintsFromBounds = ({
  maximum: max = NaN,
  minimum: min = NaN
}: Bounds[URI.bigint]['bounds'] = {}) => {
  let constraints: fc.BigIntConstraints = {}
  let minimum = getMin(min, max)
  let maximum = getMax(max, min)
  if (t.bigint(minimum)) constraints.min = minimum
  if (t.bigint(maximum)) constraints.max = maximum
  return constraints
}

const stringConstraintsFromBounds = ({ minimum: min = NaN, maximum: max = NaN }: InclusiveBounds = {}) => {
  let constraints: fc.StringConstraints = {}
  let minimum = getMin(min, max)
  let maximum = getMax(max, min)
  if (t.integer(minimum)) void (constraints.minLength = minimum)
  if (t.integer(maximum))
    if (maximum >= (constraints.minLength ?? Number.MIN_SAFE_INTEGER))
      void (constraints.maxLength = maximum)
  return constraints
}

const arrayConstraintsFromBounds = ({ minimum: min = NaN, maximum: max = NaN }: InclusiveBounds = {}) => {
  let constraints: fc.ArrayConstraints = {}
  let minimum = getMin(min, max)
  let maximum = getMax(max, min)
  if (t.integer(minimum)) void (constraints.minLength = minimum)
  if (t.integer(maximum))
    if (maximum >= (constraints.minLength ?? Number.MIN_SAFE_INTEGER))
      void (constraints.maxLength = maximum)
  return constraints
}

const double = (constraints: fc.DoubleConstraints = defaultNumberConstraints) => fc.double({ ...defaultNumberConstraints, ...constraints })
// fc.oneof(
//   fc.double({ ...constraints, min: +GREATEST_LOWER_BOUND }),
//   fc.double({ ...constraints, max: -GREATEST_LOWER_BOUND }),
// ).map((x) => )
// // fc.double(constraints)
// .filter((x) => x <= -GREATEST_LOWER_BOUND || +GREATEST_LOWER_BOUND <= x)

const BoundableArbitraryMap = {
  [URI.integer]: (bounds) => fc.integer(integerConstraintsFromBounds(bounds)),
  [URI.number]: (bounds) => double(numberConstraintsFromBounds(bounds)),
  [URI.bigint]: (bounds) => fc.bigInt(bigintConstraintsFromBounds(bounds)),
  [URI.string]: (bounds) => fc.string(stringConstraintsFromBounds(bounds)),
  [URI.array]: (arb, bounds) => fc.array(arb, arrayConstraintsFromBounds(bounds)),
} as const satisfies { [K in keyof Bounds]: Bounds[K]['arbitrary'] }

const NullaryStringMap = {
  [URI.never]: 'never',
  [URI.void]: 'void',
  [URI.unknown]: 'unknown',
  [URI.any]: 'any',
  [URI.symbol]: 'symbol',
  [URI.null]: 'null',
  [URI.undefined]: 'undefined',
  [URI.boolean]: 'boolean',
} as const satisfies Record<Nullary, string>

const BoundableStringMap = {
  [URI.integer]: 'integer',
  [URI.number]: 'number',
  [URI.bigint]: 'bigint',
  [URI.string]: 'string',
  [URI.array]: 'array',
} as const satisfies { [K in keyof Bounds]: Bounds[K]['typeName'] }

const BoundableSeedMap = {
  [URI.integer]: integerF,
  [URI.number]: numberF,
  [URI.bigint]: bigintF,
  [URI.string]: stringF,
  [URI.array]: arrayF,
} as const satisfies { [K in keyof Bounds]: Bounds[K]['ctor'] }

const Functor: T.Functor<Seed.Free, Seed.Fixpoint> = {
  map(f) {
    type T = ReturnType<typeof f>
    return (x) => {
      if (!isSeed(x)) return x
      switch (true) {
        default: return x
        case isBoundable(x): return BoundableSeedMap[x[0]](x[1] as never)
        case isNullary(x): return x
        case x[0] === URI.eq: return eqF(x[1] as never)
        case x[0] === URI.array: return arrayF(f(x[1]), x[2])
        case x[0] === URI.record: return recordF(f(x[1]))
        case x[0] === URI.optional: return optionalF(f(x[1]))
        case x[0] === URI.tuple: return tupleF(x[1].map(f))
        case x[0] === URI.union: return unionF(x[1].map(f))
        case x[0] === URI.intersect: return intersectF(x[1].map(f))
        case x[0] === URI.object: return objectF(x[1].map(([k, v]) => [k, f(v)]))
      }
    }
  }
}

type Index = {
  mode: 'INVALID' | 'VALID'
  invalidGeneratedForLevel: boolean
}

const defaultIndex = {
  invalidGeneratedForLevel: false,
  mode: 'INVALID',
} satisfies Index

const invalidValue: any = Symbol.for('invalidValue')

const IndexedFunctor: T.Functor.Ix<Index, Seed.Free, Seed.Fixpoint> = {
  map: Functor.map,
  mapWithIndex(f) {
    return (x, ix) => {
      if (!isSeed(x)) return x
      switch (true) {
        default: return x
        case isBoundable(x): return BoundableSeedMap[x[0]](x[1] as never)
        case isNullary(x): return x
        case x[0] === URI.eq: return eqF(x[1] as never)
        case x[0] === URI.array: return arrayF(f(x[1], ix), x[2])
        case x[0] === URI.record: return recordF(f(x[1], ix))
        case x[0] === URI.optional: return optionalF(f(x[1], ix))
        case x[0] === URI.tuple: return tupleF(x[1].map((y) => f(y, ix)))
        case x[0] === URI.union: return unionF(x[1].map((y) => f(y, ix)))
        case x[0] === URI.intersect: return intersectF(x[1].map((y) => f(y, ix)))
        case x[0] === URI.object: return objectF(x[1].map(([k, v]) => [k, f(v, ix)]))
      }

      // switch (true) {
      //   case isBoundable(x): return ix.mode === 'INVALID' && !ix.invalidGeneratedForLevel
      //     ? (void (ix.invalidGeneratedForLevel = true), invalidValue)
      //     : BoundableSeedMap[x[0]](x[1] as never)
      //   case isNullary(x): return ix.mode === 'INVALID' && !ix.invalidGeneratedForLevel
      //     ? (void (ix.invalidGeneratedForLevel = true), invalidValue)
      //     : x
      //   case x[0] === URI.eq: return ix.mode === 'INVALID' && !ix.invalidGeneratedForLevel
      //     ? (void (ix.invalidGeneratedForLevel = true), invalidValue)
      //     : eqF(x[1] as never)
      //   case x[0] === URI.array: return ix.mode === 'INVALID' && !ix.invalidGeneratedForLevel
      //     ? (void (ix.invalidGeneratedForLevel = true), invalidValue)
      //     : arrayF(f(x[1], ix), x[2])
      //   case x[0] === URI.record: return ix.mode === 'INVALID' && !ix.invalidGeneratedForLevel
      //     ? (void (ix.invalidGeneratedForLevel = true), invalidValue)
      //     : recordF(f(x[1], ix))
      //   case x[0] === URI.optional: return ix.mode === 'INVALID' && !ix.invalidGeneratedForLevel
      //     ? (void (ix.invalidGeneratedForLevel = true), invalidValue)
      //     : optionalF(f(x[1], ix))
      //   case x[0] === URI.tuple: return ix.mode === 'INVALID' && !ix.invalidGeneratedForLevel
      //     ? (void (ix.invalidGeneratedForLevel = true), invalidValue)
      //     : tupleF(x[1].map((y) => f(y, ix)))
      //   case x[0] === URI.union: return ix.mode === 'INVALID' && !ix.invalidGeneratedForLevel
      //     ? (void (ix.invalidGeneratedForLevel = true), invalidValue)
      //     : unionF(x[1].map((y) => f(y, ix)))
      //   case x[0] === URI.intersect: return ix.mode === 'INVALID' && !ix.invalidGeneratedForLevel
      //     ? (void (ix.invalidGeneratedForLevel = true), invalidValue)
      //     : intersectF(x[1].map((y) => f(y, ix)))
      //   case x[0] === URI.object: return ix.mode === 'INVALID' && !ix.invalidGeneratedForLevel
      //     ? (void (ix.invalidGeneratedForLevel = true), invalidValue)
      //     : objectF(x[1].map(([k, v]) => [k, f(v, ix)]))

    }
  },
}

const fold = fn.cata(Functor)
const foldWithIndex = fn.cataIx(IndexedFunctor)
const unfold = fn.ana(Functor)

type t_Boundable = t.Boundable | t.array<any>

const normalizeMin = (x: t_Boundable) =>
  t.has('minimum', t.union(t.number, t.bigint))(x) ? x.minimum as number
    : t.has('minLength')(x) ? x.minLength as number
      : void 0

const normalizeMax = (x: t_Boundable) =>
  t.has('maximum', t.union(t.number, t.bigint))(x) ? x.maximum as number
    : t.has('maxLength')(x) ? x.maxLength as number
      : void 0

const normalizeExclusiveMin = (x: t_Boundable) =>
  t.has('exclusiveMinimum', isNumeric)(x) ? x.exclusiveMinimum : void 0

const normalizeExclusiveMax = (x: t_Boundable) =>
  t.has('exclusiveMaximum', isNumeric)(x) ? x.exclusiveMaximum : void 0


function getBounds(x: t_Boundable): (IntegerBounds & NumberBounds & BigIntBounds & StringBounds) | undefined {
  let min_ = normalizeMin(x)
  let max_ = normalizeMax(x)
  let xMin_ = normalizeExclusiveMin(x)
  let xMax_ = normalizeExclusiveMax(x)
  let min = isNumeric(min_) ? getMin(min_, max_) : void 0
  let max = isNumeric(max_) ? getMax(max_, min_) : void 0
  let xMin = isNumeric(xMin_) ? getMin(xMin_, xMax_) : void 0
  let xMax = isNumeric(xMax_) ? getMax(xMax_, xMin_) : void 0
  let out = unsafeCompact({
    exclusiveMinimum: isNumeric(xMin) ? xMin : void 0,
    exclusiveMaximum: isNumeric(xMax) ? xMax : void 0,
    minimum: isNumeric(xMin) ? void 0 : isNumeric(min) ? isNumeric(xMax) ? xMax < min ? void 0 : min : min : void 0,
    maximum: isNumeric(xMax) ? void 0 : isNumeric(max) ? isNumeric(xMin) ? max < xMin ? void 0 : max : max : void 0,
  })
  return Object.keys(out).length === 0 ? void 0 : out as never
}

namespace Algebra {
  export const identity: T.Functor.Algebra<Seed.Free, Seed.Fixpoint> = (x) => x as never

  // export const sort: T.Functor.Coalgebra<Seed.Free, Seed.Fixpoint> = (x) =>
  //   typeof x !== 'string' && x[0] === URI.tuple
  //     ? [x[0], [...x[1]].sort(sortSeedOptionalsLast)]
  //     : x

  export const toExtensibleSchema
    : (constraints?: Constraints<never>['arbitraries']) => T.Functor.Algebra<Seed.Free, unknown>
    = ($) => (x) => {
      if (!isSeed(x)) return fn.exhaustive(x)
      switch (true) {
        default: return fn.exhaustive(x)
        case isNullary(x): return NullarySchemaMap[x]
        case x[0] === URI.never: return $?.never ?? NullarySchemaMap[x]
        case x[0] === URI.unknown: return $?.unknown ?? NullarySchemaMap[x]
        case x[0] === URI.void: return $?.void ?? NullarySchemaMap[x]
        case x[0] === URI.any: return $?.any ?? NullarySchemaMap[x]
        case x[0] === URI.undefined: return $?.undefined ?? NullarySchemaMap[x]
        case x[0] === URI.null: return $?.null ?? NullarySchemaMap[x]
        case x[0] === URI.symbol: return $?.symbol ?? NullarySchemaMap[x]
        case x[0] === URI.boolean: return $?.boolean ?? NullarySchemaMap[x]
        case x[0] === URI.integer: return $?.integer ?? BoundableSchemaMap[x[0]](x[1])
        case x[0] === URI.bigint: return $?.bigint ?? BoundableSchemaMap[x[0]](x[1])
        case x[0] === URI.number: return $?.number ?? BoundableSchemaMap[x[0]](x[1])
        case x[0] === URI.string: return $?.string ?? BoundableSchemaMap[x[0]](x[1])
        case x[0] === URI.array: return $?.array?.(x[1]) ?? BoundableSchemaMap[x[0]](x[2], x[1])
        case x[0] === URI.eq: return $?.eq?.(x[1]) ?? t.eq.def(x[1])
        case x[0] === URI.record: return $?.record?.(x[1]) ?? t.record.def(x[1])
        case x[0] === URI.optional: return $?.optional?.(x[1]) ?? t.optional.def(x[1])
        case x[0] === URI.tuple: return $?.tuple?.(x[1]) ?? t.tuple.def([...x[1]].sort(sortOptionalsLast), opts)
        case x[0] === URI.union: return $?.union?.(x[1]) ?? t.union.def(x[1])
        case x[0] === URI.intersect: return $?.intersect?.(x[1]) ?? t.intersect.def(x[1])
        case x[0] === URI.object: {
          const wrap = $?.object ?? t.object
          return wrap(Object_fromEntries(x[1].map(([k, v]) => [parseKey(k), v])), opts)
        }
      }
    }

  export const toSchema: T.Functor.Algebra<Seed.Free, t.Schema> = (x) => {
    if (!isSeed(x)) return x // fn.exhaustive(x)
    switch (true) {
      default: return fn.exhaustive(x)
      case isNullary(x): return NullarySchemaMap[x]
      case x[0] === URI.array: return BoundableSchemaMap[x[0]](x[2], x[1])
      case isBoundable(x): return BoundableSchemaMap[x[0]](x[1] as never)
      case x[0] === URI.eq: return t.eq.def(x[1])
      case x[0] === URI.record: return t.record.def(x[1])
      case x[0] === URI.optional: return t.optional.def(x[1])
      case x[0] === URI.tuple: return t.tuple.def([...x[1]].sort(sortOptionalsLast), opts)
      case x[0] === URI.union: return t.union.def(x[1])
      case x[0] === URI.intersect: return t.intersect.def(x[1])
      case x[0] === URI.object: return t.object.def(Object_fromEntries(x[1].map(([k, v]) => [parseKey(k), v])), opts)
    }
  }

  export const fromSchema: T.Functor.Algebra<t.Free, Seed.Fixpoint> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case t.isNullary(x): return x.tag satisfies Seed.Fixpoint
      case t.isBoundable(x): return BoundableSeedMap[x.tag](getBounds(x))
      case x.tag === URI.array: return arrayF(x.def, getBounds(x))
      case x.tag === URI.record: return [x.tag, x.def] satisfies Seed.Fixpoint
      case x.tag === URI.optional: return [x.tag, x.def] satisfies Seed.Fixpoint
      case x.tag === URI.eq: return [x.tag, x.def as Json] satisfies Seed.Fixpoint
      case x.tag === URI.tuple: return [x.tag, x.def] satisfies Seed.Fixpoint
      case x.tag === URI.union: return [x.tag, x.def] satisfies Seed.Fixpoint
      case x.tag === URI.intersect: return [x.tag, x.def] satisfies Seed.Fixpoint
      case x.tag === URI.object: return [x.tag, Object.entries(x.def)] satisfies Seed.Fixpoint
    }
  }

  export const toArbitrary: T.Functor.Algebra<Seed.Free, fc.Arbitrary<unknown>> = (x) => {
    if (!isSeed(x)) return fn.exhaustive(x)
    switch (true) {
      default: return fn.exhaustive(x)
      case isNullary(x): return NullaryArbitraryMap[x]
      case isBoundable(x): return BoundableArbitraryMap[x[0]](x[1] as never)
      case x[0] === URI.eq: return fc.constant(x[1])
      case x[0] === URI.array: return BoundableArbitraryMap[x[0]](x[1], x[2])
      case x[0] === URI.record: return fc.dictionary(identifier, x[1])
      case x[0] === URI.optional: return fc.option(x[1], { nil: undefined })
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

  export const arbitraryFromSchema: T.Functor.Algebra<t.Free, fc.Arbitrary<unknown>> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case t.isNullary(x): return NullaryArbitraryMap[x.tag]
      case x.tag === URI.integer: return fc.integer(integerConstraintsFromBounds(x))
      case x.tag === URI.bigint: return fc.bigInt(bigintConstraintsFromBounds(x))
      case x.tag === URI.number: return double(numberConstraintsFromBounds(x))
      case x.tag === URI.string: return fc.string(stringConstraintsFromBounds({ minimum: x.minLength, maximum: x.maxLength }))
      case x.tag === URI.eq: return fc.constant(x.def)
      case x.tag === URI.array: return BoundableArbitraryMap[x.tag](x.def, { minimum: x.minLength, maximum: x.maxLength })
      case x.tag === URI.record: return fc.dictionary(identifier, x.def)
      case x.tag === URI.optional: return fc.option(x.def, { nil: undefined })
      case x.tag === URI.tuple: return fc.tuple(...x.def)
      case x.tag === URI.union: return fc.oneof(...x.def)
      case x.tag === URI.object: return fc.record(x.def)
      case x.tag === URI.intersect: {
        if (x.def.length === 1) return x.def[0]
        const ys = x.def.filter((_) => !isNullary(_))
        return ys.length === 0 ? x.def[0] : fc.tuple(...ys).map(
          ([head, ...tail]) => !isComposite(head) ? head
            : tail.reduce<typeof head>((acc, y) => isComposite(y) ? Object_assign(acc, y) : acc, head)
        )
      }
    }
  }

  const getRandomIndexOf = <T>(xs: T[]) => Math.floor((Math.random() * 100) % Math.max(xs.length, 1))
  const mutateRandomElementOf = <S, T>(xs: S[], x: T = invalidValue as never): S[] => {
    if (xs.length === 0) return x as never
    else {
      const index = getRandomIndexOf(xs)
      xs.splice(index, 1, x as never)
      return xs
    }
  }

  const mutateRandomValueOf = <S, T>(before: Record<string, S>, x: T = invalidValue as never): Record<string, S> => {
    const xs = Object.entries(before)
    if (xs.length === 0) return x as never
    else {
      const index = getRandomIndexOf(xs)
      const [key] = xs[index]
      void xs.splice(index, 1, [key, x as never])
      const after = Object.fromEntries(xs)
      return after
    }
  }

  export const invalidArbitraryFromSchema: T.Functor.Algebra<t.Free, fc.Arbitrary<unknown>> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case t.isNullary(x): return NullaryArbitraryMap[x.tag]
      case x.tag === URI.integer: return fc.integer(integerConstraintsFromBounds(x))
      case x.tag === URI.bigint: return fc.bigInt(bigintConstraintsFromBounds(x))
      case x.tag === URI.number: return double(numberConstraintsFromBounds(x))
      case x.tag === URI.string: return fc.string(stringConstraintsFromBounds({ minimum: x.minLength, maximum: x.maxLength }))
      case x.tag === URI.eq: return fc.constant(x.def)
      case x.tag === URI.array: return BoundableArbitraryMap[x.tag](x.def, { minimum: x.minLength, maximum: x.maxLength }).map(mutateRandomElementOf)
      case x.tag === URI.record: return fc.dictionary(identifier, x.def).map(mutateRandomValueOf)
      case x.tag === URI.optional: return fc.option(x.def, { nil: undefined })
      case x.tag === URI.tuple: return fc.tuple(...x.def).map(mutateRandomElementOf)
      case x.tag === URI.union: return fc.constant(invalidValue)
      case x.tag === URI.object: return fc.record(x.def).map(mutateRandomValueOf)
      case x.tag === URI.intersect: {
        if (x.def.length === 1) return x.def[0]
        const ys = x.def.filter((_) => !isNullary(_))
        return ys.length === 0 ? invalidValue : fc.tuple(...ys).map(
          ([_, ...tail]) => tail.reduce<{}>((acc, y) => isComposite(y) ? Object_assign(acc, y) : acc, { [invalidValue]: fc.constant(invalidValue) })
        )
      }
    }
  }

  export const toInvalidArbitrary: T.Functor.Algebra<Seed.Free, fc.Arbitrary<unknown>> = (x) => {
    if (typeof x === 'symbol') return fc.constant(x) as never
    if (!isSeed(x)) return (console.log('!isSeed(x), x: ' + String(x)), fn.exhaustive(x))
    switch (true) {
      default: return (console.log('!exhaustive, x: ' + String(x)), fn.exhaustive(x))
      case isNullary(x): return NullaryArbitraryMap[x]
      case isBoundable(x): return BoundableArbitraryMap[x[0]](x[1] as never)
      case x[0] === URI.eq: return fc.constant(x[1])
      case x[0] === URI.array: return BoundableArbitraryMap[x[0]](x[1], x[2])
      case x[0] === URI.record: return fc.dictionary(identifier, x[1])
      case x[0] === URI.optional: return fc.option(x[1], { nil: undefined })
      case x[0] === URI.tuple: return fc.tuple(...x[1])
      case x[0] === URI.union: return fc.oneof(...x[1])
      case x[0] === URI.object: {
        const xs = x[1]
        xs.splice(Math.floor(xs.length / 2), 1, [xs[Math.floor(xs.length / 2)][0], fc.constant(invalidValue)])
        return fc.record(Object_fromEntries(x[1]))
      }
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
      case isBoundable(x): return BoundableStringMap[x[0]]
      case x[0] === URI.eq: return x[1] as never
      case x[0] === URI.array: return 'Array<' + x[1] + '>'
      case x[0] === URI.record: return 'Record<string, ' + x[1] + '>'
      case x[0] === URI.optional: return x[1] + '?'
      case x[0] === URI.tuple: return '[' + x[1].join(', ') + ']'
      case x[0] === URI.union: return x[1].join(' | ')
      case x[0] === URI.intersect: return x[1].join(' & ')
      case x[0] == URI.object: return '{ ' + x[1].flatMap(([k, v]) => `${parseKey(k)}: ${v}`).join(', ') + ' }'
    }
  }

  export const fromJsonLiteral: T.Functor.Algebra<Json.Free, Seed.Fixpoint> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x === null: return URI.null
      case x === void 0: return URI.undefined
      case typeof x === 'boolean': return URI.boolean
      case typeof x === 'number': return [URI.number, {}] satisfies [any, any]
      case typeof x === 'string': return [URI.string, {}] satisfies [any, any]
      case Json.isArray(x): return [URI.tuple, x] satisfies Seed.Fixpoint
      case Json.isObject(x): return [URI.object, Object.entries(x)] satisfies Seed.Fixpoint
    }
  }
}

const hasOptionalTag = t.has('tag', (x) => x === URI.optional)

export const sortOptionalsLast = (l: unknown, r: unknown) => (
  hasOptionalTag(l) ? 1
    : hasOptionalTag(r) ? -1
      : 0
)

const sortSeedOptionalsLast = (l: Seed.Fixpoint, r: Seed.Fixpoint) =>
  isOptional(l) ? 1 : isOptional(r) ? -1 : 0

const isOptional = (node: Seed.Fixpoint): node is [URI.optional, Seed.Fixpoint] =>
  typeof node === 'string' ? false : node[0] === URI.optional

export const pickAndSortNodes
  : (nodes: readonly TypeName[]) => <
    Exclude extends TypeName,
    Include extends TypeName
  >(constraints?: Pick<TargetConstraints<_, _, Exclude, Include>, 'exclude' | 'include' | 'sortBias'>) => TypeName[]
  = (nodes) => ({
    include,
    exclude,
    sortBias,
  } = defaults as never) => {
    const sortFn: T.Comparator<TypeName> = sortBias === undefined ? defaults.sortBias
      : typeof sortBias === 'function' ? sortBias
        : (l, r) => (sortBias[l] ?? 0) < (sortBias[r] ?? 0) ? 1 : (sortBias[l] ?? 0) > (sortBias[r] ?? 0) ? -1 : 0
    return nodes
      .filter(
        (x) =>
          (include ? include.includes(x as never) : true) &&
          (exclude ? !exclude.includes(x as never) : true)
      )
      .sort(sortFn)
  }

function parseConstraints<Exclude extends TypeName, Include extends TypeName, T, U>(
  constraints?: Constraints<Exclude, Include, T, U>
): Required<TargetConstraints<T, U, Exclude, Include>>
function parseConstraints({
  exclude = defaults.exclude,
  include = defaults.include,
  sortBias = defaults.sortBias,
  forceInvalid = defaults.forceInvalid,
  // groupScalars = defaults.groupScalars,
  integer: {
    min: integerMin = defaults.integer.min,
    max: integerMax = defaults.integer.max,
  } = defaults.integer,
  bigint: {
    min: bigintMin = defaults.bigint.min,
    max: bigintMax = defaults.bigint.max,
  } = defaults.bigint,
  number: {
    min: numberMin = defaults.number.min,
    max: numberMax = defaults.number.max,
    minExcluded: numberMinExcluded,
    maxExcluded: numberMaxExcluded,
    ...numberRest
  } = defaults.number,
  string: {
    min: stringMinLength = defaults.string.min,
    max: stringMaxLength = defaults.string.max,
    ...stringRest
  } = defaults.string,
  array: {
    min: arrayMinLength = defaults.array.min,
    max: arrayMaxLength = defaults.array.max,
  } = defaults.array,
  intersect: {
    minLength: intersectMinLength,
    maxLength: intersectMaxLength,
    size: intersectSize,
    depthIdentifier: intersectDepthIdentifier,
  } = defaults.intersect,
  union: {
    minLength: unionMinLength,
    maxLength: unionMaxLength,
    size: unionSize,
  } = defaults.union,
  tuple: {
    minLength: tupleMinLength = defaults.tuple.minLength,
    maxLength: tupleMaxLength = defaults.tuple.maxLength,
    size: tupleSize = defaults.tuple.size,
    depthIdentifier: tupleDepthIdentifier = defaults.tuple.depthIdentifier,
  } = defaults.tuple,
  object: {
    min: objectMinLength = defaults.object.min,
    max: objectMaxLength = defaults.object.max,
    size: objectSize = defaults.object.size,
  } = defaults.object,
  eq: {
    arbitrary: eqArbitrary = defaults.eq.arbitrary,
  } = defaults.eq,
  tree: {
    depthIdentifier: treeDepthIdentifier = defaults.tree.depthIdentifier,
    depthSize: treeDepthSize = defaults.tree.depthSize,
    maxDepth: treeMaxDepth = defaults.tree.maxDepth,
    withCrossShrink: treeWithCrossShrink = defaults.tree.withCrossShrink,
  } = defaults.tree,
}: Constraints<TypeName> = defaults): Required<TargetConstraints> {
  const integer = {
    min: integerMin,
    max: integerMax,
  } satisfies Required<TargetConstraints['integer']>
  const bigint = {
    min: bigintMin,
    max: bigintMax,
  } satisfies Required<TargetConstraints['bigint']>
  const number = {
    min: numberMin,
    max: numberMax,
    minExcluded: numberMinExcluded,
    maxExcluded: numberMaxExcluded,
    ...numberRest,
  } satisfies TargetConstraints['number']
  const string = {
    min: stringMinLength,
    max: stringMaxLength,
    ...stringRest,
  } satisfies TargetConstraints['string']
  const array = {
    min: arrayMinLength,
    max: arrayMaxLength,
  } satisfies TargetConstraints['array']
  const object = {
    size: objectSize,
    minLength: objectMinLength,
    maxLength: objectMaxLength,
  } satisfies TargetConstraints['object']
  const tree = {
    depthIdentifier: treeDepthIdentifier,
    depthSize: treeDepthSize,
    maxDepth: treeMaxDepth,
    withCrossShrink: treeWithCrossShrink,
  } satisfies TargetConstraints['tree']
  const tuple = {
    depthIdentifier: tupleDepthIdentifier,
    minLength: tupleMinLength,
    maxLength: tupleMaxLength,
    size: tupleSize,
  } satisfies TargetConstraints['tuple']
  const intersect = {
    depthIdentifier: intersectDepthIdentifier,
    minLength: intersectMinLength,
    maxLength: intersectMaxLength,
    size: intersectSize,
  } satisfies TargetConstraints['intersect']
  const union = {
    depthIdentifier: defaultDepthIdentifier,
    minLength: unionMinLength,
    maxLength: unionMaxLength,
    size: unionSize,
  } satisfies TargetConstraints['union']
  const eq = {
    arbitrary: eqArbitrary,
  } satisfies TargetConstraints['eq']

  return {
    exclude: exclude as [],
    include: include.filter((_) => !exclude.includes(_)),
    forceInvalid,
    integer,
    bigint,
    number,
    string,
    array,
    intersect,
    object,
    eq,
    sortBias,
    tree,
    tuple,
    union,
    // groupScalars,
  }
}

const NullaryJsonMap = {
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
} as const

const isKeyOf = <T>(k: unknown, x: T): k is keyof T =>
  !!x && typeof x === 'object' && (
    typeof k === 'string'
    || typeof k === 'number'
    || typeof k === 'symbol'
  ) && k in x

export const toJson
  : (seed: Seed.Fixpoint) => Json.Fixpoint
  = fold((x: Seed<Json.Fixpoint>) => {
    if (x == null) return x
    switch (true) {
      default: return x
      case isKeyOf(x, NullaryJsonMap): return NullaryJsonMap[x]
      case x[0] === URI.number: return 0
      case x[0] === URI.integer: return 0
      case x[0] === URI.bigint: return 0
      case x[0] === URI.string: return ''
      case x[0] === URI.eq: return toJson(x[1] as never)
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
      )
    }
  })

type Nullaries = typeof Nullaries
const Nullaries = {
  never: fc.constant(URI.never),
  any: fc.constant(URI.any),
  unknown: fc.constant(URI.unknown),
  void: fc.constant(URI.void),
  null: fc.constant(URI.null),
  undefined: fc.constant(URI.undefined),
  symbol: fc.constant(URI.symbol),
  boolean: fc.constant(URI.boolean),
}

const isNonEmpty = <T extends {}>(x?: T): x is T => !!x && 0 < Object.keys(x).length

const dropEmptyBounds = <T extends string, B extends {}>([uri, bounds]: [uri: T, bounds?: B]): [T] | [T, B] =>
  isNonEmpty(bounds) ? [uri, bounds] : [uri]

type Boundables = typeof Boundables
const Boundables = {
  integer: fc.tuple(fc.constant(URI.integer), integerBounds).map(dropEmptyBounds),
  bigint: fc.tuple(fc.constant(URI.bigint), bigintBounds).map(dropEmptyBounds),
  number: fc.tuple(fc.constant(URI.number), numberBounds).map(dropEmptyBounds),
  string: fc.tuple(fc.constant(URI.string), stringBounds).map(dropEmptyBounds),
}

type Unaries = { [K in keyof typeof Unaries]: ReturnType<typeof Unaries[K]> }
const Unaries = {
  eq: (fix: fc.Arbitrary<Fixpoint>, $: TargetConstraints) => fix.chain(() => $.eq.arbitrary ?? fc.jsonValue()).map(eqF),
  array: (fix: fc.Arbitrary<Fixpoint>, _: TargetConstraints) => fc.tuple(fix, arrayBounds).map(([def, bounds]) => arrayF(def, bounds)),
  record: (fix: fc.Arbitrary<Fixpoint>, _: TargetConstraints) => fix.map(recordF),
  optional: (fix: fc.Arbitrary<Fixpoint>, _: TargetConstraints) => fix.map(optionalF),
  tuple: (fix: fc.Arbitrary<Fixpoint>, $: TargetConstraints) => fc.array(fix, $.tuple).map(fn.flow((_) => _.sort(sortSeedOptionalsLast), tupleF)),
  object: (fix: fc.Arbitrary<Fixpoint>, $: TargetConstraints) => entries(fix, $.object).map(objectF),
  union: (fix: fc.Arbitrary<Fixpoint>, $: TargetConstraints) => fc.array(fix, $.union).map(unionF),
  intersect: (fix: fc.Arbitrary<Fixpoint>, $: TargetConstraints) => fc.array(fix, $.intersect).map(intersectF),
}

function getNullaries(typeNames: TypeName[]): Partial<Nullaries> {
  return Object.fromEntries(
    Object
      .keys(Nullaries)
      .filter((nullary) => typeNames.includes(nullary as TypeName))
      .map((nullary) => [nullary, Nullaries[nullary as keyof Nullaries]] satisfies [any, any])
  )
}

function getBoundables(typeNames: TypeName[]): Partial<Boundables> {
  return Object.fromEntries(
    Object
      .keys(Boundables)
      .filter((boundable) => typeNames.includes(boundable as TypeName))
      .map((boundable) => [boundable, Boundables[boundable as keyof Boundables]] satisfies [any, any])
  )
}

function getUnaries<
  Exclude extends TypeName,
  Include extends TypeName
>(
  typeNames: TypeName[],
  $: TargetConstraints<_, _, Exclude, Include>,
  fix: fc.Arbitrary<Fixpoint>
): Partial<Unaries>

function getUnaries(
  typeNames: TypeName[],
  $: TargetConstraints<_, _, TypeName>,
  fix: fc.Arbitrary<Fixpoint>
): Partial<Unaries> {
  return Object.fromEntries(
    Object
      .keys(Unaries)
      .filter((unary) => typeNames.includes(unary as TypeName))
      .map((unary) => [unary, Unaries[unary as keyof typeof Unaries](fix, $ as never)] satisfies [any, any])
  )
}

type SeedIR = {
  eq: fc.Arbitrary<eqF<fc.JsonValue>>
  array: fc.Arbitrary<arrayF<Fixpoint>>
  record: fc.Arbitrary<recordF<Fixpoint>>
  optional: fc.Arbitrary<optionalF<Fixpoint>>
  tuple: fc.Arbitrary<tupleF<readonly Fixpoint[]>>
  object: fc.Arbitrary<objectF<[k: string, v: Fixpoint][]>>
  union: fc.Arbitrary<unionF<readonly Fixpoint[]>>
  intersect: fc.Arbitrary<intersectF<readonly Fixpoint[]>>
  never: fc.Arbitrary<URI.never>
  any: fc.Arbitrary<URI.any>
  unknown: fc.Arbitrary<URI.unknown>
  void: fc.Arbitrary<URI.void>
  null: fc.Arbitrary<URI.null>
  undefined: fc.Arbitrary<URI.undefined>
  symbol: fc.Arbitrary<URI.symbol>
  boolean: fc.Arbitrary<URI.boolean>
  integer: fc.Arbitrary<[URI.integer, _?: IntegerBounds]>
  bigint: fc.Arbitrary<[URI.bigint, _?: BigIntBounds]>
  number: fc.Arbitrary<[URI.number, _?: NumberBounds]>
  string: fc.Arbitrary<[URI.string, _?: StringBounds]>
}

type SeedResult<
  Exclude extends TypeName,
  Include extends TypeName = TypeName,
> = Pick<SeedIR, globalThis.Exclude<Include, Exclude>> & Omit<SeedIR, Exclude> & Tree<Exclude>

type Tree<K extends keyof SeedIR = never> = { tree: Omit<SeedIR, 'tree' | K>[keyof Omit<SeedIR, 'tree' | K>] }

interface SeedBuilder {
  never?: fc.Arbitrary<URI.never>
  any?: fc.Arbitrary<URI.any>
  unknown?: fc.Arbitrary<URI.unknown>
  void?: fc.Arbitrary<URI.void>
  null?: fc.Arbitrary<URI.null>
  undefined?: fc.Arbitrary<URI.undefined>
  symbol?: fc.Arbitrary<URI.symbol>
  boolean?: fc.Arbitrary<URI.boolean>
  integer?: fc.Arbitrary<[URI.integer, IntegerBounds]>
  bigint?: fc.Arbitrary<[URI.bigint, BigIntBounds]>
  number?: fc.Arbitrary<[URI.number, NumberBounds]>
  string?: fc.Arbitrary<[URI.string, StringBounds]>
  eq: fc.Arbitrary<eqF<fc.JsonValue>>
  array: fc.Arbitrary<arrayF<Fixpoint>>
  record: fc.Arbitrary<recordF<Fixpoint>>
  optional: fc.Arbitrary<optionalF<Fixpoint>>
  tuple: fc.Arbitrary<tupleF<readonly Fixpoint[]>>
  object: fc.Arbitrary<objectF<[k: string, v: Fixpoint][]>>
  union: fc.Arbitrary<unionF<readonly Fixpoint[]>>
  intersect: fc.Arbitrary<intersectF<readonly Fixpoint[]>>
  tree: fc.Arbitrary<Fixpoint>
}

type Seeds = Exclude<SeedBuilder[keyof SeedBuilder], undefined>

const minDepth = {
  array: <T, U, X extends TypeName, I extends TypeName>(seeds: Seeds[], _: TargetConstraints<T, U, X, I>) => fc.oneof(...seeds).map(arrayF),
  record: <T, U, X extends TypeName, I extends TypeName>(seeds: Seeds[], _: TargetConstraints<T, U, X, I>) => fc.oneof(...seeds).map(recordF),
  object: <T, U, X extends TypeName, I extends TypeName>(seeds: Seeds[], $: TargetConstraints<T, U, X, I>) =>
    fc.array(fc.tuple(identifier, fc.oneof(...seeds)), { maxLength: $.object.maxLength, minLength: $.object.minLength }).map(objectF),
  tuple: <T, U, X extends TypeName, I extends TypeName>(seeds: Seeds[], $: TargetConstraints<T, U, X, I>) =>
    fc.array(fc.oneof(...seeds), { minLength: $.tuple.minLength, maxLength: $.tuple.maxLength }).map(tupleF),
}

const minDepthBranchOrder = ['object', /* 'optional', */ 'tuple', /* 'union', 'intersect', */ 'array', 'record'] as const

const minDepths = {
  [0]: minDepth[minDepthBranchOrder[0]],
  [1]: minDepth[minDepthBranchOrder[1]],
  [2]: minDepth[minDepthBranchOrder[2]],
  [3]: minDepth[minDepthBranchOrder[3]],
}

function schemaWithMinDepth<Exclude extends TypeName, Include extends TypeName>(
  _: Constraints<Exclude, Include> = defaults as never,
  n: number
): fc.Arbitrary<t.Schema> {
  let $ = parseConstraints(_)
  let arbitraries = fc.letrec(seed($))
  let seeds = Object.values(arbitraries)
  let branches = minDepthBranchOrder.filter(((_) => $.include.includes(_ as never) && !$.exclude.includes(_ as never)))
  let arb = arbitraries.tree
  while (n-- >= 0)
    arb = fc.nat(branches.length - 1).chain(
      (x): fc.Arbitrary<
        | objectF<[string, Fixpoint][]>
        | tupleF<readonly Fixpoint[]>
        | arrayF<Fixpoint>
        | recordF<Fixpoint>
      > => {
        switch (true) {
          default: return fn.exhaustive(x as never)
          case x === 0: return minDepths[x](seeds, $)
          case x === 1: return minDepths[x](seeds, $)
          case x === 2: return minDepths[x](seeds, $)
          case x === 3: return minDepths[x](seeds, $)
        }
      })
  return arb.map(toSchema)
}

function seed<Include extends TypeName, Exclude extends TypeName = never>(_: Constraints<Exclude, Include>):
  (go: fc.LetrecTypedTie<Builder>) => SeedResult<Exclude, Include>
function seed(): (go: fc.LetrecTypedTie<Builder>) => SeedResult<never>
function seed(_?: Constraints<never>): (go: fc.LetrecTypedTie<Builder>) => SeedResult<never>
function seed(_: Constraints<TypeName> = defaults as never): {} {
  const $ = parseConstraints(_)
  const nodes = pickAndSortNodes(initialOrder)($)
  return (go: fc.LetrecTypedTie<Builder>) => {
    const builder = {
      ...getNullaries(nodes),
      ...getBoundables(nodes),
      ...getUnaries(nodes, $, go('tree')),
      ...$.forceInvalid && { invalid: fc.constant(invalidValue) },
    }
    return {
      ...builder,
      tree: fc.oneof($.tree, ...Object.values(builder)),
    }
  }
}


const identity = fold(Algebra.identity)
//    ^?

const toSchema
  : <T extends Fixpoint>(fixpoint: T) => InferSchema.fromFixpoint<T>
  = fold(Algebra.toSchema) as never

const toArbitrary = fold(Algebra.toArbitrary)
//    ^?

const arbitraryFromSchema = t.fold(Algebra.arbitraryFromSchema)
//    ^?

const invalidArbitraryFromSchema = t.fold(Algebra.invalidArbitraryFromSchema)
//    ^?

const toInvalidArbitrary = foldWithIndex(Algebra.toInvalidArbitrary)
//    ^?

const toString = fold(Algebra.toString)
//    ^?

const fromSchema = fn.cata(t.Functor)(Algebra.fromSchema)
//    ^?

const fromJsonLiteral = fold(Algebra.fromJsonLiteral)
//    ^?

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
function schema<
  Include extends TypeName = TypeName,
  Exclude extends TypeName = never
>(constraints?: Constraints<Exclude, Include>):
  fc.Arbitrary<globalThis.Exclude<t.F<Fixpoint>, { tag: `${T.NS}${Exclude}` }>>

function schema(constraints?: Constraints<never>): fc.Arbitrary<t.LowerBound>
function schema<Include extends TypeName, Exclude extends TypeName = never>(constraints?: Constraints<Exclude, Include>) {
  return fc.letrec(seed(constraints as never)).tree.map(toSchema) as never
}

const extensibleArbitrary = <T>(constraints?: Constraints<never>) =>
  fc.letrec(seed(constraints)).tree.map(fold(Algebra.toExtensibleSchema(constraints?.arbitraries)))

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
 */
const data = (constraints?: Constraints<never>) =>
  fc.letrec(seed(constraints)).tree.chain(toArbitrary)
