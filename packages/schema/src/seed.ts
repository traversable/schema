import type * as T from '@traversable/registry'
import type { Entries } from '@traversable/registry'
import { fn, NS, parseKey, URI } from '@traversable/registry'
import { Json } from '@traversable/json'

import { t } from './schema.js'
import * as fc from './fast-check.js'

export {
  // model
  type Fixpoint,
  type Nullary,
  type Builder,
  type Free,
  type Seed,
  Functor,
  fold,
  unfold,
  isNullary,
  isUnary,
  isPositional,
  isAssociative,
  isSpecialCase,
  isSeed,
  defineSeed,
  // algebra
  data,
  dataFromSeed,
  fromJsonLiteral,
  fromSchema,
  identity,
  Recursive,
  toSchema,
  schema,
  schemaWithData,
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
const opts = { optionalTreatment: 'treatUndefinedAndOptionalAsTheSame' } as const
/** @internal */
const Array_isArray = globalThis.Array.isArray

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
  URI.symbol_,
  URI.bigint,
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

type Unary<T = unknown> = [UnaryTag, T]
type UnaryTag = typeof UnaryTags[number]
const UnaryTags = [
  URI.array,
  URI.record,
  URI.optional,
] as const satisfies typeof URI[keyof typeof URI][]

const isUnaryTag = (u: unknown): u is UnaryTag => UnaryTags.includes(u as never)
const isUnary = <T>(u: unknown): u is Unary<T> => Array_isArray(u) && isUnaryTag(u[0])

type Positional<T = unknown> = [PositionalTag, readonly T[]]
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

type Associative<T = unknown> = [AssociativeTag, Entries<T>]
type AssociativeTag = typeof AssociativeTags[number]
const AssociativeTags = [
  URI.object,
] as const satisfies typeof URI[keyof typeof URI][]

const isAssociativeTag = (u: unknown): u is AssociativeTag => AssociativeTags.includes(u as never)
const isAssociative = <T>(u: unknown): u is Associative<T> =>
  Array_isArray(u) &&
  isAssociativeTag(u[0])
// !!u[1] &&
// Array_isArray(u[1]) &&
// u[1].every(Array_isArray)

const isSeed = (u: unknown) => isNullary(u) || isUnary(u) || isPositional(u) || isAssociative(u) || isSpecialCase(u)

type Seed<F>
  = Nullary
  | [tag: URI.eq, def: Json]
  | [tag: UnaryTag, def: F]
  | [tag: PositionalTag, def: readonly F[]]
  | [tag: AssociativeTag, def: Entries<F>]
  ;

type Fixpoint
  = Nullary
  | [tag: URI.eq, def: Json]
  | [tag: UnaryTag, def: Fixpoint]
  | [tag: PositionalTag, def: readonly Fixpoint[]]
  | [tag: AssociativeTag, def: Entries<Fixpoint>]
  ;

interface Free extends T.HKT { [-1]: Seed<this[0]> }

type Inductive<S>
  = [S] extends [infer T extends Nullary] ? T
  : [S] extends [readonly [Unary, infer T]] ? [S[0], Inductive<T>]
  : [S] extends [readonly [Positional, infer T extends readonly unknown[]]]
  ? [S[0], { -readonly [Ix in keyof T]: Inductive<T[Ix]> }]
  : [S] extends [readonly [Associative, infer T extends Entries]]
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
  symbol: URI.symbol_
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
  object: [tag: URI.object, seed: T.Entries<Fixpoint>]
  tree: Omit<this, 'tree'>[keyof Omit<this, 'tree'>]
}

const SchemaMap = {
  [URI.never]: t.never,
  [URI.void]: t.void,
  [URI.unknown]: t.unknown,
  [URI.any]: t.any,
  [URI.symbol_]: t.symbol,
  [URI.null]: t.null,
  [URI.undefined]: t.undefined,
  [URI.boolean]: t.boolean,
  [URI.number]: t.number,
  [URI.bigint]: t.bigint,
  [URI.string]: t.string,
} as const satisfies Record<Nullary, t.Fixpoint>

const ArbitraryMap = {
  [URI.never]: fc.constant(void 0 as never),
  [URI.void]: fc.constant(void 0 as void),
  [URI.unknown]: fc.anything(),
  [URI.any]: fc.anything() as fc.Arbitrary<any>,
  [URI.symbol_]: fc.string().map(Symbol.for),
  [URI.null]: fc.constant(null),
  [URI.undefined]: fc.constant(undefined),
  [URI.boolean]: fc.boolean(),
  [URI.number]: fc.float(),
  [URI.bigint]: fc.bigInt(),
  [URI.string]: fc.string(),
} as const satisfies Record<Nullary, fc.Arbitrary>

const StringMap = {
  [URI.never]: 'never',
  [URI.void]: 'void',
  [URI.unknown]: 'unknown',
  [URI.any]: 'any',
  [URI.symbol_]: 'symbol',
  [URI.null]: 'null',
  [URI.undefined]: 'undefined',
  [URI.boolean]: 'boolean',
  [URI.number]: 'number',
  [URI.bigint]: 'bigint',
  [URI.string]: 'string',
} as const satisfies Record<Nullary, string>

const Functor: T.Functor<Seed.Free, Seed.Fixpoint> = {
  map(f) {
    return (x) => {
      if (!isSeed(x)) return x as never
      switch (true) {
        default: return x
        case isNullary(x): return x satisfies Nullary
        case isSpecialCase(x): return [x[0], f(x[1] as never) as Json]
        case isUnary(x): return [x[0], f(x[1])] satisfies Unary<ReturnType<typeof f>>
        case isPositional(x): return [x[0], x[1].map(f)] satisfies Positional<ReturnType<typeof f>>
        case isAssociative(x): return [x[0], x[1].map(([k, v]) => [k, f(v)])] satisfies Associative<ReturnType<typeof f>>
      }
    }
  }
}

const fold = fn.cata(Functor)
const unfold = fn.ana(Functor)

namespace Recursive {
  export const identity: T.Functor.Algebra<Seed.Free, Seed.Fixpoint> = (x) => x
  export const sort: T.Functor.Coalgebra<Seed.Free, Seed.Fixpoint> = (x) => {
    if (typeof x !== 'string' && x[0] === URI.tuple) {
      return [x[0], [...x[1]].sort(sortSeedOptionalsLast)]
    }
    else return x
  }

  export const toSchema: T.Functor.Algebra<Seed.Free, t.Fixpoint> = (x) => {
    if (!isSeed(x)) return x                                 // <-- TODO
    switch (true) {
      default: return fn.exhaustive(x)
      case isNullary(x): return SchemaMap[x]
      case isSpecialCase(x): switch (true) {
        case x[0] === URI.eq: return t.eq.fix(x[1])
        default: return x
      }
      case isUnary(x): switch (true) {
        case x[0] === URI.array: return t.array.fix(x[1])
        case x[0] === URI.record: return t.record.fix(x[1])
        case x[0] === URI.optional: return t.optional.fix(x[1])
        default: return x as never
      }
      case isPositional(x): switch (true) {
        case x[0] === URI.tuple: return t.tuple.fix([...x[1]].sort(sortOptionalsLast), opts)
        case x[0] === URI.union: return t.union.fix(x[1])
        case x[0] === URI.intersect: return t.intersect.fix(x[1])
        default: return x as never
      }
      case isAssociative(x):
        return t.object.fix(Object_fromEntries(x[1].map(([k, v]) => [parseKey(k), v])), opts)
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

  export const dataFromSeed: T.Functor.Algebra<Seed.Free, fc.Arbitrary> = (x) => {
    if (!isSeed(x)) return x as never                        // <-- TODO
    switch (true) {
      default: return x
      case isNullary(x): return ArbitraryMap[x]
      case isSpecialCase(x): switch (true) {
        case x[0] === URI.eq: return fc.constant(x[1])
        default: return x
      }
      case isUnary(x): switch (true) {
        case x[0] === URI.array: return fc.array(x[1])
        case x[0] === URI.record: return fc.dictionary(fc.string(), x[1])
        case x[0] === URI.optional: return fc.optional(x[1])
        default: return x as never
      }
      case isPositional(x): switch (true) {
        case x[0] === URI.tuple: return fc.tuple(...x[1])
        case x[0] === URI.union: return fc.oneof(...x[1])
        case x[0] === URI.intersect: return fc.tuple(...x[1]).map((xs) => xs.reduce(Object_assign, {}))
        default: return x as never
      }
      case isAssociative(x): return fc.record(Object_fromEntries(x[1]))
    }
  }

  export const toString: T.Functor.Algebra<Seed.Free, string> = (x) => {
    switch (true) {
      default: return x                                      // <-- TODO
      case isNullary(x): return StringMap[x]
      case isSpecialCase(x): switch (true) {
        case x[0] === URI.eq: return x[1] as never
        default: return x
      }
      case isUnary(x): switch (true) {
        case x[0] === URI.array: return 'Array<' + x[1] + '>'
        case x[0] === URI.record: return 'Record<string, ' + x[1] + '>'
        case x[0] === URI.optional: return x[1] + '?'
        default: return x as never
      }
      case isPositional(x): switch (true) {
        case x[0] === URI.tuple: return '[' + x[1].join(', ') + ']'
        case x[0] === URI.union: return x[1].join(' | ')
        case x[0] === URI.intersect: return x[1].join(' & ')
        default: return x as never
      }
      case isAssociative(x):
        return '{ ' + x[1].flatMap(([k, v]) => `${parseKey(k)}: ${v}`).join(', ') + ' }'
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
}

export type SortBias<T>
  = Compare<keyof T>
  /** 
   * If you provide a partial weight map, missing properties will fall back to 0
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
} as const satisfies Record<TypeName, number>

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

export const sortOptionalsLast = (l: t.Fixpoint, r: t.Fixpoint) => (
  l.tag === URI.optional ? 1 : r.tag === URI.optional ? -1 : 0
);

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
    const sortFn: Compare<TypeName> = sortBias === undefined ? defaults.sortBias
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
  [URI.symbol_]: globalThis.Symbol().toString(),
  [URI.boolean]: false,
  [URI.bigint]: 0,
  [URI.number]: 0,
  [URI.string]: "",
} as const satisfies Record<Nullary, Json>

export const toJson
  : (seed: Seed.Fixpoint) => Json.Recursive
  = fold((x: Seed<Json.Recursive>) => {
    if (x == null) return x
    switch (true) {
      default: return x
      case isNullary(x): return JsonMap[x]
      case x[0] === URI.eq: return x[1]
      case x[0] === URI.array: return []
      case x[0] === URI.record: return {}
      case x[0] === URI.optional: return x[1]
      case x[0] === URI.object: return Object_fromEntries(x[1])
      case x[0] === URI.tuple: return x[1]
      case x[0] === URI.record: return x[1]
      case x[0] === URI.union: return x[1][0]
      case x[0] === URI.intersect:
        return x[1].reduce((acc, y) => acc == null ? acc : y == null ? y : Object_assign(acc, y), {})
    }
  })

const Nullaries = {
  never: fc.constant(URI.never),
  any: fc.constant(URI.any),
  unknown: fc.constant(URI.unknown),
  void: fc.constant(URI.void),
  null: fc.constant(URI.null),
  undefined: fc.constant(URI.undefined),
  symbol: fc.constant(URI.symbol_),
  boolean: fc.constant(URI.boolean),
  bigint: fc.constant(URI.bigint),
  number: fc.constant(URI.number),
  string: fc.constant(URI.string),
}

function seed(_: Constraints = defaults) {
  const $ = parseConstraints(_)
  return (go: fc.LetrecTypedTie<Builder>) => ({
    ...Nullaries,
    eq: go('tree').map((_) => [URI.eq, toJson(_)]), // <-- TODO
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

const toSchema = fold(Recursive.toSchema)
//    ^?

const dataFromSeed = fold(Recursive.dataFromSeed)
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
const schema = (constraints?: Constraints) => fc
  .letrec(seed(constraints))
  .tree.map(toSchema)

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
const data = (constraints?: Constraints) => fc
  .letrec(seed(constraints))
  .tree.chain(dataFromSeed)

/**
 * @deprecated - use the smaller components in this module 
 * to assemble the builder you need, instead
 * 
 * ## {@link schemaWithData `Seed.schemaWithData`}
 * 
 * A composite generator. Component parts include:
 * 
 * - {@link data `Seed.data`}
 * - {@link schema `Seed.schema`}
 * - {@link toString `Seed.toString`}
 * 
 * Internally, schemas are generated from a 
 * {@link Seed `seed value`}, which is itself generated by a library 
 * called [`fast-check`](https://github.com/dubzzz/fast-check).
 */
const schemaWithData = (constraints: Constraints = defaults) => {
  const arbitrary = seed(constraints)
  return fc.letrec(arbitrary)
    .tree.chain((s) => { // TODO: look into removing '.chain' call so fast-check can shrink better
      const schema = toSchema(s)
      return fc.record({
        seed: fc.constant(s),
        arbitrary: fc.constant(arbitrary),
        // data: dataFromSeed(s),
        schema: fc.constant(schema),
        stringType: fc.constant(toString(s)),
        string: fc.constant(t.toString(schema))
      })
    })
}
