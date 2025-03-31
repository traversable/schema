import type * as T from '@traversable/registry'
import { fn, parseKey, unsafeCompact, URI } from '@traversable/registry'
import { Json } from '@traversable/json'

import type { SchemaOptions } from '@traversable/schema'
import { t } from '@traversable/schema'
import * as fc from './fast-check.js'

export {
  // model
  type Fixpoint,
  type Nullary,
  type Builder,
  type Free,
  type Seed,
  type Unary,
  type Positional,
  type SpecialCase,
  arrayF as array,
  recordF as record,
  objectF as object,
  tupleF as tuple,
  eqF as eq,
  optionalF as optional,
  unionF as union,
  intersectF as intersect,
  Functor,
  fold,
  unfold,
  initialOrder,
  is,
  isNullary,
  isUnary,
  isPositional,
  isAssociative,
  isSpecialCase,
  isSeed,
  defineSeed,
  // algebra
  data,
  extensibleArbitrary,
  toArbitrary,
  fromJsonLiteral,
  fromSchema,
  identity,
  Recursive,
  toSchema,
  schema,
  schemaWithMinDepth,
  seed,
  toString,
  parseConstraints,
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

interface eqF<S = Json> extends T.inline<[tag: URI.eq, def: S]> { }
interface optionalF<S> extends T.inline<[tag: URI.optional, def: S]> { }
interface arrayF<S> extends T.inline<[tag: URI.array, def: S]> { }
interface recordF<S> extends T.inline<[tag: URI.record, def: S]> { }
interface objectF<S> extends T.inline<[tag: URI.object, def: S]> { }
interface tupleF<S> extends T.inline<[tag: URI.tuple, def: S]> { }
interface unionF<S> extends T.inline<[tag: URI.union, def: S]> { }
interface intersectF<S> extends T.inline<[tag: URI.intersect, def: S]> { }

function eqF<S = Json>(def: S): eqF<S> { return [URI.eq, def] }
function optionalF<S>(def: S): optionalF<S> { return [URI.optional, def] }
function arrayF<S>(def: S): arrayF<S> { return [URI.array, def] }
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
  ;

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
  // URI.bigint,
  // URI.integer,
  // URI.number,
  // URI.string,
] as const satisfies typeof URI[keyof typeof URI][]
const isNullary = (u: unknown): u is Nullary => NullaryTags.includes(u as never)

interface InclusiveBounds<T = number> {
  minimum?: T
  maximum?: T
}

interface ExclusiveBounds<T = number> {
  exclusiveMinimum?: T
  exclusiveMaximum?: T
}

interface StringBounds extends InclusiveBounds { }
interface NumberBounds extends InclusiveBounds, ExclusiveBounds { }
interface IntegerBounds extends InclusiveBounds, ExclusiveBounds { }
interface BigIntBounds extends InclusiveBounds<bigint>, ExclusiveBounds<bigint> { }

const makeInclusiveBounds = <T>(model: fc.Arbitrary<T>) => ({ minimum: model, maximum: model })
const makeExclusiveBounds = <T>(model: fc.Arbitrary<T>) => ({ exclusiveMinimum: model, exclusiveMaximum: model })

const pickBounds = <T>({ exclusiveMinimum: xMin, exclusiveMaximum: xMax, minimum: min, maximum: max }: InclusiveBounds<T> & ExclusiveBounds<T>) => {
  const [exclusiveMinimum, exclusiveMaximum] = [xMin, ...xMin === xMax ? [] : [xMax]].sort()
  const [minimum, maximum] = [min, ...min === max ? [] : [max]].sort()
  if (t.bigint(exclusiveMinimum)) {
    if (t.bigint(exclusiveMaximum)) {
      return { exclusiveMinimum, exclusiveMaximum }
    }
    else if (t.bigint(maximum)) {
      return { exclusiveMinimum, maximum }
    }
    else return { exclusiveMinimum }
  }
  else if (t.bigint(exclusiveMaximum)) {
    if (t.bigint(minimum)) {
      return { exclusiveMaximum, minimum }
    }
    else return { exclusiveMaximum }
  }
  else if (t.bigint(minimum)) {
    if (t.bigint(maximum)) return { minimum, maximum }
    else return { minimum }
  }
  else if (t.bigint(maximum)) return { maximum }
  else return void 0
}

const inclusiveBounds = makeInclusiveBounds(fc.integer({ min: 0, max: 255 }))
const exclusiveBounds = makeExclusiveBounds(fc.integer({ min: 0, max: 255 }))
const stringBounds = fc.record(inclusiveBounds, { requiredKeys: [] })
const integerBounds = fc.record({ ...inclusiveBounds, ...exclusiveBounds }, { requiredKeys: [] }).map(pickBounds)
const numberBounds = integerBounds
const bigintBounds = fc.record({ ...makeInclusiveBounds(fc.bigInt()), ...makeExclusiveBounds(fc.bigInt()) }, { requiredKeys: [] }).map(pickBounds)

interface stringF extends T.inline<[tag: URI.string, constraints?: StringBounds]> { }
interface integerF extends T.inline<[tag: URI.integer, constraints?: IntegerBounds]> { }
interface numberF extends T.inline<[tag: URI.number, constraints?: NumberBounds]> { }
interface bigintF extends T.inline<[tag: URI.bigint, constraints?: BigIntBounds]> { }

function integerF(constraints?: IntegerBounds): integerF { return !constraints ? [URI.integer] : [URI.integer, constraints] }
function numberF(constraints?: NumberBounds): numberF { return !constraints ? [URI.number] : [URI.number, constraints] }
function bigintF(constraints?: BigIntBounds): bigintF { return !constraints ? [URI.bigint] : [URI.bigint, constraints] }
function stringF(constraints?: StringBounds): stringF { return !constraints ? [URI.string] : [URI.string, constraints] }

const BoundableSeedMap = {
  [URI.integer]: integerF,
  [URI.number]: numberF,
  [URI.bigint]: bigintF,
  [URI.string]: stringF,
}

type BoundableTag = typeof BoundableTags[number]
const BoundableTags = [
  URI.bigint,
  URI.integer,
  URI.number,
  URI.string,
] as const satisfies any[]
type Boundable =
  | integerF
  | bigintF
  | numberF
  | stringF

// interface Boundable extends T.inline<[tag: BoundableTag, constraints?: InclusiveBounds & ExclusiveBounds]> { }

export const isBoundableTag = (u: unknown): u is BoundableTag => BoundableTags.includes(u as never)
export const isBoundable = (u: unknown): u is Boundable => t.has(0, isBoundableTag)(u)


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
const AssociativeTags = [
  URI.object,
] as const satisfies typeof URI[keyof typeof URI][]

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

const makeMinimum = <S extends t.Schema>(schema: S) => t.has(1, t.object({ minimum: schema }))
const makeMaximum = <S extends t.Schema>(schema: S) => t.has(1, t.object({ maximum: schema }))
const makeMinAndMax = <S extends t.Schema>(schema: S) => t.has(1, t.object({ minimum: schema, maximum: schema }))
const makeGreaterThan = <S extends t.Schema>(schema: S) => t.has(1, t.object({ exclusiveMinimum: schema }))
const makeLessThan = <S extends t.Schema>(schema: S) => t.has(1, t.object({ exclusiveMaximum: schema }))
const minimum = makeMinimum(t.integer)
const maximum = makeMaximum(t.integer)
const minAndMax = makeMinAndMax(t.integer)
const greaterThan = makeGreaterThan(t.integer)
const lessThan = makeLessThan(t.integer)

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
is.stringWithMin = t.intersect(t.has(0, (x) => x === URI.string), minimum)
is.stringWithMax = t.intersect(t.has(0, (x) => x === URI.string), maximum)
is.stringWithMinMax = t.intersect(t.has(0, (x) => x === URI.string), minAndMax)

is.number = t.has(0, (u) => u === URI.number)
is.numberWithMin = t.intersect(t.has(0, (x) => x === URI.number), minimum)
is.numberWithMax = t.intersect(t.has(0, (x) => x === URI.number), maximum)
is.numberWithMinMax = t.intersect(t.has(0, (x) => x === URI.number), minAndMax)
is.numberWithGreaterThan = t.intersect(t.has(0, (x) => x === URI.number), greaterThan)
is.numberWithLessThan = t.intersect(t.has(0, (x) => x === URI.number), lessThan)

is.integer = t.has(0, (u) => u === URI.integer)
is.integerWithMin = t.intersect(t.has(0, (x) => x === URI.integer), minimum)
is.integerWithMax = t.intersect(t.has(0, (x) => x === URI.integer), maximum)
is.integerWithMinMax = t.intersect(t.has(0, (x) => x === URI.integer), minAndMax)
is.integerWithGreaterThan = t.intersect(t.has(0, (x) => x === URI.integer), greaterThan)
is.integerWithLessThan = t.intersect(t.has(0, (x) => x === URI.integer), lessThan)

is.bigint = t.has(0, (u) => u === URI.bigint)
is.bigintWithMin = t.intersect(t.has(0, (x) => x === URI.bigint), makeMinimum(t.bigint))
is.bigintWithMax = t.intersect(t.has(0, (x) => x === URI.bigint), makeMaximum(t.bigint))
is.bigintWithMinMax = t.intersect(t.has(0, (x) => x === URI.bigint), makeMinAndMax(t.bigint))
is.bigintWithGreaterThan = t.intersect(t.has(0, (x) => x === URI.bigint), makeGreaterThan(t.bigint))
is.bigintWithLessThan = t.intersect(t.has(0, (x) => x === URI.bigint), makeLessThan(t.bigint))


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
  bigint: [URI.bigint, BigIntBounds]
  integer: [URI.integer, IntegerBounds]
  number: [URI.number, NumberBounds]
  string: [URI.string, StringBounds]
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
  // [URI.integer]: t.integer,
  // [URI.number]: t.number,
  // [URI.bigint]: t.bigint,
  // [URI.string]: t.string,
} as const satisfies Record<Nullary, t.Fixpoint>

type BoundedInteger =
  | t.integer.min<number>
  | t.integer.max<number>
  | t.integer.moreThan<number>
  | t.integer.lessThan<number>
  ;
type BoundedNumber =
  | t.number.min<number>
  | t.number.max<number>
  | t.number.moreThan<number>
  | t.number.lessThan<number>
  ;
type BoundedBigInt =
  | t.bigint.min<bigint>
  | t.bigint.max<bigint>
  | t.bigint.moreThan<bigint>
  | t.bigint.lessThan<bigint>
  ;
type BoundedString =
  | t.string.min<number>
  | t.string.max<number>
  ;

const BoundableSchemaMap = {
  [URI.integer]: (bounds): t.integer | BoundedInteger => {
    let schema: t.integer | BoundedInteger = t.integer
    if (!bounds) return schema
    if (t.number(bounds.exclusiveMinimum)) schema = (schema as t.integer).moreThan(bounds.exclusiveMinimum)
    if (t.number(bounds.exclusiveMaximum)) schema = (schema as t.integer).lessThan(bounds.exclusiveMaximum)
    if (t.number(bounds.minimum)) schema = (schema as t.integer).min(bounds.minimum)
    if (t.number(bounds.maximum)) schema = (schema as t.integer).max(bounds.maximum)
    return schema
  },
  [URI.bigint]: (bounds?: InclusiveBounds<bigint> & ExclusiveBounds<bigint>): t.bigint | BoundedBigInt => {
    let schema: t.bigint | BoundedBigInt = t.bigint
    if (!bounds) return schema
    if (t.bigint(bounds.exclusiveMinimum)) schema = (schema as t.bigint).moreThan(bounds.exclusiveMinimum)
    if (t.bigint(bounds.exclusiveMaximum)) schema = (schema as t.bigint).lessThan(bounds.exclusiveMaximum)
    if (t.bigint(bounds.minimum)) schema = (schema as t.bigint).min(bounds.minimum)
    if (t.bigint(bounds.maximum)) schema = (schema as t.bigint).max(bounds.maximum)
    return schema
  },
  [URI.number]: (bounds): t.number | BoundedNumber => {
    let schema: t.number | BoundedNumber = t.number
    if (!bounds) return schema
    if (t.number(bounds.exclusiveMinimum)) schema = (schema as t.number).moreThan(bounds.exclusiveMinimum)
    if (t.number(bounds.exclusiveMaximum)) schema = (schema as t.number).lessThan(bounds.exclusiveMaximum)
    if (t.number(bounds.minimum)) schema = (schema as t.number).min(bounds.minimum)
    if (t.number(bounds.maximum)) schema = (schema as t.number).max(bounds.maximum)
    return schema
  },
  [URI.string]: (bounds): t.string | BoundedString => {
    let schema: t.string | BoundedString = t.string
    if (!bounds) return schema
    if (t.number(bounds.minimum)) schema = (schema as t.string).min(bounds.minimum)
    if (t.number(bounds.maximum)) schema = (schema as t.string).max(bounds.maximum)
    return schema
  }
} as const satisfies Record<Boundable[0], (bounds?: InclusiveBounds<any> & ExclusiveBounds<any>) => unknown>

const NullaryArbitraryMap = {
  [URI.never]: fc.constant(void 0 as never),
  [URI.void]: fc.constant(void 0 as void),
  [URI.unknown]: fc.jsonValue(),
  [URI.any]: fc.jsonValue() as fc.Arbitrary<any>,
  [URI.symbol]: fc.string().map(Symbol.for),
  [URI.null]: fc.constant(null),
  [URI.undefined]: fc.constant(undefined),
  [URI.boolean]: fc.boolean(),
  // [URI.integer]: fc.integer(),
  // [URI.number]: fc.float(),
  // [URI.bigint]: fc.bigInt(),
  // [URI.string]: fc.string(),
} as const satisfies Record<Nullary, fc.Arbitrary>

/** @internal */
const isNumeric = (u: unknown) => typeof u === 'number' || typeof u === 'bigint'

const integerConstraintsFromBounds = ({
  exclusiveMinimum: xMin = NaN,
  exclusiveMaximum: xMax = NaN,
  maximum: max = NaN,
  minimum: min = NaN
}: InclusiveBounds & ExclusiveBounds = {}) => {
  let constraints: fc.IntegerConstraints = {}
  let minimum = getMin(min, max)
  let maximum = getMax(max, min)
  let exclusiveMinimum = getMin(xMin, xMax)
  let exclusiveMaximum = getMax(xMax, xMin)
  if (t.integer(minimum)) constraints.min = minimum
  if (t.integer(maximum)) constraints.max = maximum
  if (t.integer(exclusiveMinimum)) {
    if (t.integer(constraints.max) && exclusiveMinimum < constraints.max) constraints.min = exclusiveMinimum
    else if (!t.integer(constraints.max)) constraints.min = exclusiveMinimum
  }
  if (t.integer(exclusiveMaximum)) {
    if (t.integer(constraints.min) && exclusiveMaximum > constraints.min) constraints.max = exclusiveMaximum
  }
  return constraints
}

// let constraints: fc.BigIntConstraints = {}
// let minimum = bigMin(min, max)
// let maximum = bigMax(max, min)
// let exclusiveMinimum = bigMin(xMin, xMax)
// let exclusiveMaximum = bigMax(xMax, xMin)
// if (t.bigint(minimum)) constraints.min = minimum
// if (t.bigint(maximum)) constraints.max = maximum
// if (t.bigint(exclusiveMinimum)) {
//   if (t.bigint(constraints.max) && exclusiveMinimum < constraints.max) constraints.min = exclusiveMinimum
//   else if (!t.bigint(constraints.max)) constraints.min = exclusiveMinimum
// }
// if (t.bigint(exclusiveMaximum)) {
//   if (t.bigint(constraints.min) && exclusiveMaximum > constraints.min) constraints.max = exclusiveMaximum
// }
// return constraints

/*
let constraints: fc.IntegerConstraints = {}
let min = isNumeric(bounds?.minimum) ? isNumeric(bounds.maximum) ? Math.min(bounds.minimum, bounds.maximum) : bounds.minimum : void 0
let max = isNumeric(bounds?.maximum) ? isNumeric(bounds.minimum) ? Math.max(bounds.minimum, bounds.maximum) : bounds.maximum : void 0
let exclusiveMin
  = isNumeric(bounds?.exclusiveMinimum)
    ? isNumeric(bounds.exclusiveMaximum)
      ? Math.min(bounds.exclusiveMinimum, bounds.exclusiveMaximum)
      : bounds.exclusiveMinimum
    : void 0
let exclusiveMax
  = isNumeric(bounds?.exclusiveMaximum)
    ? isNumeric(bounds.exclusiveMinimum)
      ? Math.max(bounds.exclusiveMinimum, bounds.exclusiveMaximum)
      : bounds.exclusiveMaximum
    : void 0
if (isNumeric(min)) constraints.min = min
if (isNumeric(max)) constraints.max = max
if (isNumeric(exclusiveMin)) constraints.min = exclusiveMin + 1
if (isNumeric(exclusiveMax)) constraints.max = exclusiveMax - 1
return constraints
*/

const numberConstraintsFromBounds = (bounds?: InclusiveBounds & ExclusiveBounds) => {
  let constraints: fc.FloatConstraints = {}
  if (!bounds || Object.keys(bounds).length === 0) return {}
  let min
    = isNumeric(bounds?.minimum)
      ? isNumeric(bounds.maximum)
        ? Math.min(bounds.minimum, bounds.maximum)
        : bounds.minimum
      : void 0
  let max
    = isNumeric(bounds?.maximum)
      ? isNumeric(bounds.minimum)
        ? bounds.minimum === bounds.maximum ? void 0
          : Math.max(bounds.minimum, bounds.maximum)
        : bounds.maximum
      : void 0
  let exclusiveMin
    = isNumeric(bounds?.exclusiveMinimum)
      ? isNumeric(bounds.exclusiveMaximum)
        ? Math.min(bounds.exclusiveMinimum, bounds.exclusiveMaximum)
        : bounds.exclusiveMinimum
      : void 0
  let exclusiveMax
    = isNumeric(bounds?.exclusiveMaximum)
      ? isNumeric(bounds.exclusiveMinimum)
        ? bounds.exclusiveMinimum === bounds.exclusiveMaximum
          ? void 0
          : Math.max(bounds.exclusiveMinimum, bounds.exclusiveMaximum)
        : bounds.exclusiveMaximum
      : void 0

  if (isNumeric(exclusiveMin)) {
    void (constraints.minExcluded = true)
    void (constraints.min = Math.fround(exclusiveMin))
    isNumeric(exclusiveMax) && (
      void (constraints.maxExcluded = true),
      void (constraints.max = Math.fround(exclusiveMax))
    )
    isNumeric(max) && void (constraints.max = Math.fround(max))
    return constraints
  }
  else if (isNumeric(exclusiveMax)) {
    void (constraints.maxExcluded = true)
    void (constraints.max = Math.fround(exclusiveMax))
    isNumeric(exclusiveMin) && (
      void (constraints.minExcluded = true),
      void (constraints.min = Math.fround(exclusiveMin))
    )
    isNumeric(min) && void (constraints.min = Math.fround(min))
    return constraints
  }
  else if (isNumeric(min)) {
    void (constraints.min = Math.fround(min))
    if (isNumeric(max)) {
      void (constraints.max = Math.fround(max))
    }
    return constraints
  }
  else if (isNumeric(max)) {
    void (constraints.max = Math.fround(max))
    return constraints
  }
  else return fn.exhaustive(bounds as never)
}

const isNaN = globalThis.Number.isNaN
const isNotNaN = (x: unknown): x is number => !isNaN(x)
const absorbNaN = (x?: number | bigint) => isNaN(x) ? void 0 : x

const getMin = (x: bigint | number, y?: bigint | number) => absorbNaN(y === void 0 ? x : x < y ? x : y < x ? y : void 0)
const getMax = (x: bigint | number, y?: bigint | number) => absorbNaN(y === void 0 ? x : x === y ? void 0 : x > y ? x : y > x ? y : void 0)

const bigintConstraintsFromBounds = ({
  exclusiveMinimum: xMin = NaN,
  exclusiveMaximum: xMax = NaN,
  maximum: max = NaN,
  minimum: min = NaN
}: InclusiveBounds & ExclusiveBounds = {}) => {
  let constraints: fc.BigIntConstraints = {}
  let minimum = getMin(min, max)
  let maximum = getMax(max, min)
  let exclusiveMinimum = getMin(xMin, xMax)
  let exclusiveMaximum = getMax(xMax, xMin)
  if (t.bigint(minimum)) constraints.min = minimum
  if (t.bigint(maximum)) constraints.max = maximum
  if (t.bigint(exclusiveMinimum)) {
    if (t.bigint(constraints.max) && exclusiveMinimum < constraints.max) constraints.min = exclusiveMinimum
    else if (!t.bigint(constraints.max)) constraints.min = exclusiveMinimum
  }
  if (t.bigint(exclusiveMaximum)) {
    if (t.bigint(constraints.min) && exclusiveMaximum > constraints.min) constraints.max = exclusiveMaximum
  }
  return constraints
}

const stringConstraintsFromBounds = ({ minimum: min = NaN, maximum: max = NaN }: InclusiveBounds = {}) => {
  let constraints: fc.StringConstraints = {}
  let minimum = getMin(min, max)
  let maximum = getMax(max, min)
  if (t.integer(minimum)) void (constraints.minLength = minimum)
  if (t.integer(maximum))
    if (maximum > (constraints.minLength ?? Number.MIN_SAFE_INTEGER))
      void (constraints.maxLength = maximum)
  return constraints
}

const BoundableArbitraryMap = {
  [URI.integer]: (bounds) => fc.integer(integerConstraintsFromBounds(bounds)),
  [URI.number]: (bounds) => fc.float(numberConstraintsFromBounds(bounds)),
  [URI.bigint]: (bounds) => fc.bigInt(bigintConstraintsFromBounds(bounds)),
  [URI.string]: (bounds) => fc.string(stringConstraintsFromBounds(bounds)),
} as const satisfies Record<Boundable[0], (bounds?: InclusiveBounds & ExclusiveBounds) => fc.Arbitrary<unknown>>

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
} as const satisfies Record<Boundable[0], string>

const Functor: T.Functor<Seed.Free, Seed.Fixpoint> = {
  map(f) {
    type T = ReturnType<typeof f>
    return (x) => {
      if (!isSeed(x)) return x
      switch (true) {
        default: return x
        case isBoundable(x): return BoundableSeedMap[x[0]](x[1] as never) satisfies Seed<T>
        case isNullary(x): return x satisfies Seed.Fixpoint
        case x[0] === URI.eq: return eqF(x[1] as never) satisfies Seed<T>
        case x[0] === URI.array: return arrayF(f(x[1])) satisfies Seed<T>
        case x[0] === URI.record: return recordF(f(x[1])) satisfies Seed<T>
        case x[0] === URI.optional: return optionalF(f(x[1])) satisfies Seed<T>
        case x[0] === URI.tuple: return tupleF(x[1].map(f)) satisfies Seed<T>
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
        case x[0] === URI.eq: return $?.eq?.(x[1]) ?? t.eq.def(x[1])
        case x[0] === URI.array: return $?.array?.(x[1]) ?? t.array.def(x[1])
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
      case isBoundable(x): return BoundableSchemaMap[x[0]](x[1] as never)
      case x[0] === URI.eq: return t.eq.def(x[1])
      case x[0] === URI.array: return t.array.def(x[1])
      case x[0] === URI.record: return t.record.def(x[1])
      case x[0] === URI.optional: return t.optional.def(x[1])
      case x[0] === URI.tuple: return t.tuple.def([...x[1]].sort(sortOptionalsLast), opts)
      case x[0] === URI.union: return t.union.def(x[1])
      case x[0] === URI.intersect: return t.intersect.def(x[1])
      case x[0] === URI.object: return t.object.def(Object_fromEntries(x[1].map(([k, v]) => [parseKey(k), v])), opts)
    }
  }

  const getMin = (x: t.Boundable) =>
    t.has('minimum', t.union(t.number, t.bigint))(x) ? x.minimum as number
      : t.has('minLength')(x) ? x.minLength as number
        : void 0

  const getMax = (x: t.Boundable) =>
    t.has('maximum', t.union(t.number, t.bigint))(x) ? x.maximum as number
      : t.has('maxLength')(x) ? x.maxLength as number
        : void 0

  const getExclusiveMin = (x: t.Boundable) =>
    t.has('exclusiveMinimum')(x) ? x.exclusiveMinimum : void 0

  const getExclusiveMax = (x: t.Boundable) =>
    t.has('exclusiveMaximum')(x) ? x.exclusiveMaximum : void 0

  function getBounds(x: t.Boundable): (IntegerBounds & NumberBounds & BigIntBounds & StringBounds) | undefined {
    const out = unsafeCompact({
      minimum: <never>getMin(x),
      maximum: <never>getMax(x),
      exclusiveMinimum: <never>getExclusiveMin(x),
      exclusiveMaximum: <never>getExclusiveMax(x),
    })
    return Object.keys(out).length === 0 ? void 0 : out
  }

  export const fromSchema: T.Functor.Algebra<t.Free, Seed.Fixpoint> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case t.isNullary(x): return x.tag satisfies Seed.Fixpoint
      case t.isBoundable(x): return BoundableSeedMap[x.tag](getBounds(x))
      case x.tag === URI.array: return [x.tag, x.def] satisfies Seed.Fixpoint
      case x.tag === URI.record: return [x.tag, x.def] satisfies Seed.Fixpoint
      case x.tag === URI.optional: return [x.tag, x.def] satisfies Seed.Fixpoint
      case x.tag === URI.eq: return [x.tag, x.def as Json] satisfies Seed.Fixpoint
      case x.tag === URI.tuple: return [x.tag, x.def] satisfies Seed.Fixpoint
      case x.tag === URI.union: return [x.tag, x.def] satisfies Seed.Fixpoint
      case x.tag === URI.intersect: return [x.tag, x.def] satisfies Seed.Fixpoint
      case x.tag === URI.object: return [x.tag, Object.entries(x.def)] satisfies Seed.Fixpoint
    }
  }

  export const toArbitrary: T.Functor.Algebra<Seed.Free, fc.Arbitrary> = (x) => {
    if (!isSeed(x)) return fn.exhaustive(x)
    switch (true) {
      default: return fn.exhaustive(x)
      case isNullary(x): return NullaryArbitraryMap[x]
      case isBoundable(x): return BoundableArbitraryMap[x[0]](x[1] as never)
      case x[0] === URI.eq: return fc.constant(x[1])
      case x[0] === URI.array: return fc.array(x[1])
      case x[0] === URI.record: return fc.dictionary(fc.identifier(), x[1])
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

export type TypeName = Exclude<keyof Builder, 'tree'>

const initialOrder
  : (keyof typeof initialOrderMap)[]
  = Object
    .entries(initialOrderMap)
    .sort(([, l], [, r]) => l < r ? -1 : l > r ? 1 : 0)
    .map(([k]) => k as keyof typeof initialOrderMap)

type autocomplete<T> = T | (string & {})

type LibConstraints<
  Exclude extends TypeName,
  Include extends TypeName = TypeName
> = {
  sortBias?: SortBias<Builder>
  exclude?: Exclude[]
  include?: Include[]
  // groupScalars?: boolean
}

/** @internal */
type TargetConstraints<
  T = unknown,
  U = T,
  Exclude extends TypeName = never,
  Include extends TypeName = TypeName,
> = LibConstraints<Exclude, Include> & {
  union: fc.ArrayConstraints,
  intersect: fc.ArrayConstraints,
  tree: fc.OneOfConstraints,
  object: fc.UniqueArrayConstraintsRecommended<T, U>
  tuple: fc.ArrayConstraints,
}

type ObjectConstraints<T, U> =
  & { min?: number, max?: number }
  & Omit<TargetConstraints<T, U>['object'], 'minLength' | 'maxLength'>

export type Constraints<
  Exclude extends TypeName,
  Include extends TypeName = TypeName,
  T = unknown,
  U = T
> = LibConstraints<Exclude, Include> & {
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
} satisfies Required<Constraints<never, TypeName>>

interface Compare<T> { (left: T, right: T): number }

const isIndexableBy = <K extends keyof any>(u: unknown, k: K): u is (globalThis.Function | { [x: string]: unknown }) & { [P in K]: unknown } => true

export const sortOptionalsLast = (l: unknown, r: unknown) => (
  isIndexableBy(l, 'tag') && l.tag === URI.optional ? 1
    : isIndexableBy(r, 'tag') && r.tag === URI.optional ? -1
      : 0
)

const sortSeedOptionalsLast = (l: Seed.Fixpoint, r: Seed.Fixpoint) =>
  isOptional(l) ? 1 : isOptional(r) ? -1 : 0

const isOptional = (node: Seed.Fixpoint): node is [URI.optional, Seed.Fixpoint] =>
  typeof node === 'string' ? false : node[0] === URI.optional

type _ = unknown

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
    const sortFn: Compare<TypeName> = sortBias === undefined ? defaults.sortBias
      : typeof sortBias === 'function' ? sortBias
        : (l, r) => (sortBias[l] ?? 0) < (sortBias[r] ?? 0) ? 1 : (sortBias[l] ?? 0) > (sortBias[r] ?? 0) ? -1 : 0;
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
  exclude = defaults.exclude as never,
  include = defaults.include as never,
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
}: Constraints<TypeName> = defaults) {
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
    exclude,
    include: include.filter((_) => !exclude.includes(_)),
    intersect,
    object,
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

const BoundableJsonMap = {
  [URI.bigint]: 0,
  [URI.integer]: 0,
  [URI.number]: 0,
  [URI.string]: "",
}

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

const dropEmptyBounds = <T extends string, B extends {}>([uri, bounds]: [uri: T, bounds?: B]): [T] | [T, B] =>
  bounds === void 0 || Object.keys(bounds).length === 0 ? [uri] satisfies [any] : [uri, bounds] satisfies [any, any]

type Boundables = typeof Boundables
const Boundables = {
  integer: fc.tuple(fc.constant(URI.integer), integerBounds).map(dropEmptyBounds),
  bigint: fc.tuple(fc.constant(URI.bigint), bigintBounds).map(dropEmptyBounds),
  number: fc.tuple(fc.constant(URI.number), numberBounds).map(dropEmptyBounds),
  string: fc.tuple(fc.constant(URI.string), stringBounds).map(dropEmptyBounds),
}

type Unaries = { [K in keyof typeof Unaries]: ReturnType<typeof Unaries[K]> }
const Unaries = {
  eq: (fix: fc.Arbitrary<Fixpoint>, _: TargetConstraints) => fix.chain(() => fc.jsonValue()).map(eqF),
  array: (fix: fc.Arbitrary<Fixpoint>, _: TargetConstraints) => fix.map(arrayF),
  record: (fix: fc.Arbitrary<Fixpoint>, _: TargetConstraints) => fix.map(recordF),
  optional: (fix: fc.Arbitrary<Fixpoint>, _: TargetConstraints) => fc.optional(fix).map(optionalF),
  tuple: (fix: fc.Arbitrary<Fixpoint>, $: TargetConstraints) => fc.array(fix, $.tuple).map(fn.flow((_) => _.sort(sortSeedOptionalsLast), tupleF)),
  object: (fix: fc.Arbitrary<Fixpoint>, $: TargetConstraints) => fc.entries(fix, $.object).map(objectF),
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

function seed<
  Include extends TypeName,
  Exclude extends TypeName = never,
>(_: Constraints<Exclude, Include>): (go: fc.LetrecTypedTie<Builder>) => SeedResult<Exclude, Include>

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
    }
    return {
      ...builder,
      tree: fc.oneof($.tree, ...Object.values(builder)),
    }
  }
}

function seedWithChain<Exclude extends TypeName, Include extends TypeName>(_: Constraints<Exclude, Include> = defaults as never) {
  const $ = parseConstraints(_)
  const nodes = pickAndSortNodes(initialOrder)($)
  return (go: fc.LetrecTypedTie<Builder>) => {
    const builder = {
      ...getNullaries(nodes),
      ...getBoundables(nodes),
      ...getUnaries(nodes, $, go('tree')),
    }
    return {
      ...builder,
      tree: fc.oneof($.tree, ...Object.values(builder)),
    }
  }
}

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
  optional: <T, U, X extends TypeName, I extends TypeName>(seeds: Seeds[], $: TargetConstraints<T, U, X, I>) => fc.oneof(...seeds).map(optionalF),
  object: <T, U, X extends TypeName, I extends TypeName>(seeds: Seeds[], $: TargetConstraints<T, U, X, I>) =>
    fc.array(fc.tuple(fc.identifier(), fc.oneof(...seeds)), { maxLength: $.object.maxLength, minLength: $.object.minLength }).map(objectF),
  tuple: <T, U, X extends TypeName, I extends TypeName>(seeds: Seeds[], $: TargetConstraints<T, U, X, I>) =>
    fc.array(fc.oneof(...seeds), { minLength: $.tuple.minLength, maxLength: $.tuple.maxLength }).map(tupleF),
  union: <T, U, X extends TypeName, I extends TypeName>(seeds: Seeds[], $: TargetConstraints<T, U, X, I>) =>
    fc.array(fc.oneof(...seeds), { minLength: $.union.minLength, maxLength: $.union.maxLength }).map(unionF),
  intersect: <T, U, X extends TypeName, I extends TypeName>(seeds: Seeds[], $: TargetConstraints<T, U, X, I>) =>
    fc.array(fc.oneof(...seeds), { minLength: $.intersect.minLength, maxLength: $.intersect.maxLength }).map(intersectF),
}

const minDepthBranchOrder = ['object', 'optional', 'tuple', 'union', 'intersect', 'array', 'record'] as const

const minDepths = {
  [0]: minDepth[minDepthBranchOrder[0]],
  [1]: minDepth[minDepthBranchOrder[1]],
  [2]: minDepth[minDepthBranchOrder[2]],
  [3]: minDepth[minDepthBranchOrder[3]],
  [4]: minDepth[minDepthBranchOrder[4]],
  [5]: minDepth[minDepthBranchOrder[5]],
  [6]: minDepth[minDepthBranchOrder[6]],
}

function schemaWithMinDepth<Exclude extends TypeName, Include extends TypeName>(
  _: Constraints<Exclude, Include> = defaults as never,
  n: number
): fc.Arbitrary<t.Schema> {
  let $ = parseConstraints(_)
  let seed = fc.letrec(seedWithChain($))
  let seeds = Object.values(seed)
  let branches = minDepthBranchOrder.filter(((_) => $.include.includes(_ as never) && !$.exclude.includes(_ as never)))
  let arb: fc.Arbitrary<Fixpoint> = seed.tree
  while (n-- >= 0)
    arb = fc.nat(branches.length - 1).chain(
      (x): fc.Arbitrary<
        | objectF<[string, Fixpoint][]>
        | tupleF<readonly Fixpoint[]>
        | unionF<readonly Fixpoint[]>
        | intersectF<readonly Fixpoint[]>
        | arrayF<Fixpoint>
        | recordF<Fixpoint>
        | optionalF<Fixpoint>
      > => {
        switch (true) {
          default: return fn.exhaustive(x as never)
          case x === 0: return minDepths[x](seeds, $)
          case x === 1: return minDepths[x](seeds, $)
          case x === 2: return minDepths[x](seeds, $)
          case x === 3: return minDepths[x](seeds, $)
          case x === 4: return minDepths[x](seeds, $)
          case x === 5: return minDepths[x](seeds, $)
          case x === 6: return minDepths[x](seeds, $)
        }
      });
  return arb.map(toSchema)
}

const identity = fold(Recursive.identity)
//    ^?

const toSchema = fold(Recursive.toSchema)
//    ^?

const toArbitrary = fold(Recursive.toArbitrary)
//    ^?

const toString = fold(Recursive.toString)
//    ^?

const fromSchema = fn.cata(t.Functor)(Recursive.fromSchema)
//    ^?

const fromJsonLiteral = fold(Recursive.fromJsonLiteral)
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
function schema<Include extends TypeName, Exclude extends TypeName>(constraints?: Constraints<Exclude, Include>): fc.Arbitrary<globalThis.Exclude<t.F<Fixpoint>, { tag: `${T.NS}${Exclude}` }>>
function schema(constraints?: Constraints<never>): fc.Arbitrary<t.LowerBound>
function schema<Include extends TypeName, Exclude extends TypeName = never>(constraints?: Constraints<Exclude, Include>) {
  return fc.letrec(seed(constraints as never)).tree.map(toSchema) as never
}

const extensibleArbitrary = <T>(constraints?: Constraints<never>) =>
  fc.letrec(seed(constraints)).tree.map(fold(Recursive.toExtensibleSchema(constraints?.arbitraries)))

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
