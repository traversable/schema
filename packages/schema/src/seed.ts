import type * as T from '@traversable/registry'
import { fn, NS, parseKey, URI } from '@traversable/registry'
import { Json } from '@traversable/json'

import { t } from './schema.js'
import * as fc from './fast-check.js'

export {
  type Fixpoint,
  type Nullary,
  type Builder,
  type Free,
  type Seed,
  data,
  dataFromSeed,
  Functor,
  fold,
  unfold,
  identity,
  isNullary,
  isSeed,
  Recursive,
  toSchema,
  schema,
  schemaWithData,
  seed,
  toString,
}

declare namespace Seed {
  export {
    Builder,
    Free,
    Fixpoint,
    Nullary,
  }
}

type Seed<F>
  = [tag: Nullary]
  | [tag: URI.eq, rec: F]
  | [tag: URI.optional, rec: F]
  | [tag: URI.array, rec: F]
  | [tag: URI.record, rec: F]
  | [tag: URI.union, rec: readonly F[]]
  | [tag: URI.intersect, rec: readonly F[]]
  | [tag: URI.tuple, rec: readonly F[]]
  | [tag: URI.object, rec: T.Entries<F>]

interface Free extends T.HKT { [-1]: Seed<this[0]> }
type Fixpoint
  = [tag: Nullary]
  | [tag: URI.eq, def: Fixpoint]
  | [tag: URI.optional, def: Fixpoint]
  | [tag: URI.array, def: Fixpoint]
  | [tag: URI.record, def: Fixpoint]
  | [tag: URI.union, def: readonly Fixpoint[]]
  | [tag: URI.intersect, def: readonly Fixpoint[]]
  | [tag: URI.tuple, def: readonly Fixpoint[]]
  | [tag: URI.object, def: T.Entries<Fixpoint>]

interface Builder {
  never: [URI.never]
  any: [URI.any]
  unknown: [URI.unknown]
  void: [URI.void]
  null: [URI.null]
  undefined: [URI.undefined]
  symbol: [URI.symbol_]
  boolean: [URI.boolean]
  bigint: [URI.bigint]
  number: [URI.number]
  string: [URI.string]
  eq: [tag: URI.eq, seed: Fixpoint]
  array: [tag: URI.array, seed: Fixpoint]
  record: [tag: URI.record, seed: Fixpoint]
  optional: [tag: URI.optional, seed: Fixpoint]
  tuple: [tag: URI.tuple, seed: readonly Fixpoint[]]
  object: [tag: URI.object, seed: T.Entries<Fixpoint>]
  union: [tag: URI.union, seed: readonly Seed.Fixpoint[]]
  intersect: [tag: URI.intersect, seed: readonly Seed.Fixpoint[]]
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
        case isNullary(x): return x
        case x[0] === URI.eq: return [x[0], f(x[1])]
        case x[0] === URI.array: return [x[0], f(x[1])]
        case x[0] === URI.optional: return [x[0], f(x[1])]
        case x[0] === URI.record: return [x[0], f(x[1])]
        case x[0] === URI.tuple: return [x[0], x[1].map(f)]
        case x[0] === URI.union: return [x[0], x[1].map(f)]
        case x[0] === URI.intersect: return [x[0], x[1].map(f)]
        case x[0] === URI.object:
          return [x[0], x[1].map(([k, v]) => [k, f(v)] satisfies [any, any])]
      }
    }
  }
}

const fold = fn.cata(Functor)
const unfold = fn.ana(Functor)

/** @internal */
const opts = { optionalTreatment: 'treatUndefinedAndOptionalAsTheSame' } as const
const Object_fromEntries = globalThis.Object.fromEntries
const Object_assign = globalThis.Object.assign

export const sortOptionalsLast = (l: t.Fixpoint, r: t.Fixpoint) => l.tag === URI.optional ? 1 : r.tag === URI.optional ? -1 : 0

namespace Recursive {
  export const toSchema: T.Functor.Algebra<Seed.Free, t.Fixpoint> = (x) => {
    if (!isSeed(x)) return x as never                       // <-- TODO
    switch (true) {
      default: return fn.exhaustive(x)
      case isNullary(x): return SchemaMap[x[0]]
      case x[0] === URI.eq: return t.eq.fix(x[1]) as never  // <-- TODO
      case x[0] === URI.array: return t.array.fix(x[1])
      case x[0] === URI.record: return t.record.fix(x[1])
      case x[0] === URI.optional: return t.optional.fix(x[1])
      case x[0] === URI.tuple: return t.tuple.fix([...x[1]].sort(sortOptionalsLast), opts)
      case x[0] === URI.union: return t.union.fix(x[1])
      case x[0] === URI.intersect: return t.intersect.fix(x[1])
      case x[0] === URI.object:
        return t.object.fix(Object_fromEntries(x[1].map(([k, v]) => [parseKey(k), v])), opts)
    }
  }

  export const dataFromSeed: T.Functor.Algebra<Seed.Free, fc.Arbitrary> = (x) => {
    if (!isSeed(x)) return x as never                        // <-- TODO
    switch (true) {
      default: return x
      case isNullary(x): return ArbitraryMap[x[0]]
      case x[0] === URI.eq: return fc.constant(x[1])
      case x[0] === URI.array: return fc.array(x[1])
      case x[0] === URI.record: return fc.dictionary(fc.string(), x[1])
      case x[0] === URI.optional: return fc.optional(x[1])
      case x[0] === URI.tuple: return fc.tuple(...x[1])
      case x[0] === URI.union: return fc.oneof(...x[1])
      case x[0] === URI.intersect: return fc.tuple(...x[1]).map((xs) => xs.reduce(Object_assign, {}))
      case x[0] === URI.object: return fc.record(Object_fromEntries(x[1]))
    }
  }

  export const identity: T.Functor.Algebra<Seed.Free, Seed.Fixpoint> = (x) => x

  export const toString: T.Functor.Algebra<Seed.Free, string> = (x) => {
    if (!isSeed(x)) return x as never                        // <-- TODO
    switch (true) {
      default: return x                                      // <-- TODO
      case isNullary(x): return StringMap[x[0]]
      case x[0] === URI.eq: return x[1]
      case x[0] === URI.array: return 'Array<' + x[1] + '>'
      case x[0] === URI.record: return 'Record<string, ' + x[1] + '>'
      case x[0] === URI.optional: return x[1] + '?'
      case x[0] === URI.tuple: return '[' + x[1].join(', ') + ']'
      case x[0] === URI.union: return x[1].join(' | ')
      case x[0] === URI.intersect: return x[1].join(' & ')
      case x[0] === URI.object:
        return '{ ' + x[1].flatMap(([k, v]) => `${parseKey(k)}: ${v}`).join(', ') + ' }'
    }
  }
}

type Nullary = typeof Nullary[number]
const Nullary = [
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
] as const satisfies string[]

const isNullary = (u: unknown): u is [tag: Nullary] =>
  Array.isArray(u) && Nullary.includes(u[0])

const isSeed = (u: unknown) =>
  Array.isArray(u) && initialOrder.map((tag) => `${NS}${tag}`).includes(u[0])

export type SortBias<T>
  = Compare<keyof T>
  | Record<keyof T, number>

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
} as const satisfies Record<Exclude<keyof Builder, 'tree'>, number>

const initialOrder
  : (keyof typeof initialOrderMap)[]
  = Object
    .entries(initialOrderMap)
    .sort(([, l], [, r]) => l < r ? -1 : l > r ? 1 : 0)
    .map(([k]) => k as keyof typeof initialOrderMap)

type LibConstraints = {
  sortBias?: SortBias<Builder>
  exclude?: (keyof Builder)[]
  include?: (keyof Builder)[]
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
} satisfies Required<Constraints>

interface Compare<T> { (left: T, right: T): number }

const pickAndSortNodes
  : (nodes: readonly (keyof Builder)[]) => (constraints?: TargetConstraints) => (keyof Builder)[]
  = (nodes) => (constraints = defaults) => {
    const { include, exclude, sortBias } = constraints
    const sortFn: Compare<keyof Builder> = sortBias === undefined ? defaults.sortBias
      : typeof sortBias === 'function' ? sortBias
        : (l, r) => sortBias[l] < sortBias[r] ? -1 : sortBias[l] > sortBias[r] ? 1 : 0;
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
    if (!isSeed(x)) return x
    switch (true) {
      default: return x
      case isNullary(x): return JsonMap[x[0]]
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

function seed(constraints?: Constraints): fc.LetrecTypedBuilder<Builder>
//
function seed(_: Constraints = defaults) {
  const $ = parseConstraints(_)
  return (go: fc.LetrecTypedTie<Builder>) => ({
    never: fc.constant([URI.never]),
    any: fc.constant([URI.any]),
    unknown: fc.constant([URI.unknown]),
    void: fc.constant([URI.void]),
    null: fc.constant([URI.null]),
    undefined: fc.constant([URI.undefined]),
    symbol: fc.constant([URI.symbol_]),
    boolean: fc.constant([URI.boolean]),
    bigint: fc.constant([URI.bigint]),
    number: fc.constant([URI.number]),
    string: fc.constant([URI.string]),
    eq: go('tree').map((_) => [URI.eq, toJson(_) as never]), // <-- TODO
    array: go('tree').map((_) => [URI.array, _]),
    record: go('tree').map((_) => [URI.record, _]),
    optional: fc.optional(go('tree')).map((_) => [URI.optional, _]),
    tuple: fc.array(go('tree'), $.tuple).map((_) => [URI.tuple, _]),
    object: fc.entries(go('tree'), $.object).map((_) => [URI.object, _]),
    union: fc.array(go('tree'), $.union).map((_) => [URI.union, _]),
    intersect: fc.array(go('tree'), $.intersect).map((_) => [URI.intersect, _]),
    tree: fc.oneof($.tree, ...pickAndSortNodes(initialOrder)($).map(go) as ReturnType<typeof go<keyof Builder>>[]),
  } satisfies fc.LetrecValue<Builder>)
}

const toSchema = fold(Recursive.toSchema)
//    ^?

const dataFromSeed = fold(Recursive.dataFromSeed)
//    ^?

const toString = fold(Recursive.toString)
//    ^?

const identity = fold(Recursive.identity)
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
        data: dataFromSeed(s),
        schema: fc.constant(schema),
        stringType: fc.constant(toString(s)),
        string: fc.constant(t.toString(schema))
      })
    })
}
