import type { Entries, Functor, HKT } from './types.js'
import { t } from './schema.js'
import { URI } from './uri.js'
import * as fn from './function.js'
import * as fc from './fast-check.js'
import * as parse from './parse.js'

export {
  type Fixpoint,
  type Nullary,
  type Builder,
  type F,
  type Seed,
  data,
  dataFromSeed,
  functor as Functor,
  identity,
  isNullary,
  Recursive,
  schema,
  schemaFromSeed,
  schemaWithData,
  seed,
  show,
}

declare namespace Seed {
  export {
    Builder,
    F,
    Fixpoint,
    Nullary,
  }
}

type Seed<F>
  = [tag: Nullary]
  | [tag: URI.optional, rec: F]
  | [tag: URI.array, rec: F]
  | [tag: URI.record, rec: F]
  | [tag: URI.union, rec: readonly F[]]
  | [tag: URI.intersect, rec: readonly F[]]
  | [tag: URI.tuple, rec: readonly F[]]
  | [tag: URI.object, rec: Entries<F>]

interface F extends HKT { [-1]: Seed<this[0]> }
type Fixpoint
  = [tag: Nullary]
  | [tag: URI.optional, def: Fixpoint]
  | [tag: URI.array, def: Fixpoint]
  | [tag: URI.record, def: Fixpoint]
  | [tag: URI.union, def: readonly Fixpoint[]]
  | [tag: URI.intersect, def: readonly Fixpoint[]]
  | [tag: URI.tuple, def: readonly Fixpoint[]]
  | [tag: URI.object, def: Entries<Fixpoint>]

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
  array: [URI.array, Fixpoint]
  record: [URI.record, Fixpoint]
  optional: [URI.optional, Fixpoint]
  tuple: [URI.tuple, readonly Fixpoint[]]
  object: [URI.object, Entries<Fixpoint>]
  union: [URI.union, readonly Seed.Fixpoint[]]
  intersect: [URI.intersect, readonly Seed.Fixpoint[]]
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

const DataMap = {
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

const functor: Functor<F, Fixpoint> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isNullary(x): return x
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

/** @internal */
const opts = { optionalTreatment: 'treatUndefinedAndOptionalAsTheSame' } as const
const Object_fromEntries = globalThis.Object.fromEntries
const Object_assign = globalThis.Object.assign

export const optionalsLast = (l: t.Fixpoint, r: t.Fixpoint) => l.tag === URI.optional ? 1 : r.tag === URI.optional ? -1 : 0

namespace Recursive {

  export const schemaFromSeed: Functor.Algebra<F, t.Fixpoint> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case isNullary(x): return SchemaMap[x[0]]
      case x[0] === URI.array: return t.array.fix(x[1])
      case x[0] === URI.record: return t.record.fix(x[1])
      case x[0] === URI.optional: return t.optional.fix(x[1], opts)
      case x[0] === URI.tuple: return t.tuple.fix([...x[1]].sort(optionalsLast), opts)
      case x[0] === URI.union: return t.union.fix(x[1])
      case x[0] === URI.intersect: return t.intersect.fix(x[1])
      case x[0] === URI.object:
        return t.object.fix(Object_fromEntries(x[1].map(([k, v]) => [parse.key(k), v])), opts)
    }
  }

  export const dataFromSeed: Functor.Algebra<F, fc.Arbitrary> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case isNullary(x): return DataMap[x[0]]
      case x[0] === URI.array: return fc.array(x[1])
      case x[0] === URI.record: return fc.dictionary(fc.string(), x[1])
      case x[0] === URI.optional: return fc.optional(x[1])
      case x[0] === URI.tuple: return fc.tuple(...x[1])
      case x[0] === URI.union: return fc.oneof(...x[1])
      case x[0] === URI.intersect: return fc.tuple(...x[1]).map((xs) => xs.reduce(Object_assign, {}))
      case x[0] === URI.object: return fc.record(Object_fromEntries(x[1]))
    }
  }

  export const identity: Functor.Algebra<F, Fixpoint> = (x) => x

  export const show: Functor.Algebra<F, string> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case isNullary(x): return StringMap[x[0]]
      case x[0] === URI.array: return 'Array<' + x[1] + '>'
      case x[0] === URI.record: return 'Record<string, ' + x[1] + '>'
      case x[0] === URI.optional: return x[1] + '?'
      case x[0] === URI.tuple: return '[' + x[1].join(', ') + ']'
      case x[0] === URI.union: return x[1].join(' | ')
      case x[0] === URI.intersect: return x[1].join(' & ')
      case x[0] === URI.object:
        return '{ ' + x[1].flatMap(([k, v]) => `${parse.key(k)}: ${v}`).join(', ') + ' }'
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

export type SortBias<T>
  = Compare<keyof T>
  | Record<keyof T, number>

const initialOrder = [
  // 'never',
  'string',
  'number',
  'object',
  'boolean',
  'undefined',
  'symbol',
  'bigint',
  'null',
  'array',
  'record',
  'optional',
  'tuple',
  'intersect',
  'union',
  'any',
  'unknown',
  'void',
] as const satisfies (keyof Builder)[]

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
    array: fc.tuple(fc.constant(URI.array), go('tree')),
    record: fc.tuple(fc.constant(URI.record), go('tree')),
    optional: fc.tuple(fc.constant(URI.optional), fc.optional(go('tree'))),
    tuple: fc.tuple(fc.constant(URI.tuple), fc.array(go('tree'), $.tuple)),
    object: fc.tuple(fc.constant(URI.object), fc.entries(go('tree'), $.object)),
    union: fc.tuple(fc.constant(URI.union), fc.array(go('tree'), $.union)),
    intersect: fc.tuple(fc.constant(URI.intersect), fc.array(go('tree'), $.intersect)),
    tree: fc.oneof($.tree, ...pickAndSortNodes(initialOrder)($).map(go) as ReturnType<typeof go<keyof Builder>>[]),
  } satisfies fc.LetrecValue<Builder>)
}

const schemaFromSeed = fn.cata(functor)(Recursive.schemaFromSeed)
//    ^?

const dataFromSeed = fn.cata(functor)(Recursive.dataFromSeed)
//    ^?

const show = fn.cata(functor)(Recursive.show)
//    ^?

const identity = fn.cata(functor)(Recursive.identity)
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
  .tree.map(schemaFromSeed)

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
 * - {@link show `Seed.show`}
 * 
 * Internally, schemas are generated from a 
 * {@link Seed `seed value`}, which is itself generated by a library 
 * called [`fast-check`](https://github.com/dubzzz/fast-check).
 */
const schemaWithData = (constraints: Constraints = defaults) => {
  const arbitrary = seed(constraints)
  return fc.letrec(arbitrary)
    // TODO: look into removing '.chain' call so fast-check can shrink better
    .tree.chain((s) => {
      const schema = schemaFromSeed(s)
      return fc.record({
        seed: fc.constant(s),
        arbitrary: fc.constant(arbitrary),
        data: dataFromSeed(s),
        schema: fc.constant(schema),
        stringType: fc.constant(show(s)),
        string: fc.constant(t.toString(schema))
      })
    })
}
