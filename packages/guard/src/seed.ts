import type { Entries, _, Functor, HKT } from './types.js'
import * as t from './schema.js'
import { symbol as Symbol } from './uri.js'
import * as fn from './function.js'
import * as fc from './fast-check.js'

export {
  type Fixpoint,
  type Nullary,
  type Builder,
  type F,
  data,
  dataFromSeed,
  functor as Functor,
  identity,
  isNullary,
  Recursive,
  schema,
  schemaFromSeed,
  schemaWithData,
  Seed,
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
  | [tag: Symbol.optional, rec: F]
  | [tag: Symbol.array, rec: F]
  | [tag: Symbol.record, rec: F]
  | [tag: Symbol.union, rec: F[]]
  | [tag: Symbol.intersect, rec: F[]]
  | [tag: Symbol.tuple, rec: F[]]
  | [tag: Symbol.object, rec: Entries<F>]

interface F extends HKT { [-1]: Seed<this[0]> }
type Fixpoint
  = [tag: Nullary]
  | [tag: Symbol.optional, def: Fixpoint]
  | [tag: Symbol.array, def: Fixpoint]
  | [tag: Symbol.record, def: Fixpoint]
  | [tag: Symbol.union, def: Fixpoint[]]
  | [tag: Symbol.intersect, def: Fixpoint[]]
  | [tag: Symbol.tuple, def: Fixpoint[]]
  | [tag: Symbol.object, def: Entries<Fixpoint>]

interface Builder {
  never: [Symbol.never]
  any: [Symbol.any]
  unknown: [Symbol.unknown]
  void: [Symbol.void]
  null: [Symbol.null]
  undefined: [Symbol.undefined]
  symbol: [Symbol.symbol_]
  boolean: [Symbol.boolean]
  bigint: [Symbol.bigint]
  number: [Symbol.number]
  string: [Symbol.string]
  array: [Symbol.array, Fixpoint]
  record: [Symbol.record, Fixpoint]
  optional: [Symbol.optional, Fixpoint]
  tuple: [Symbol.tuple, Fixpoint[]]
  object: [Symbol.object, Entries<Fixpoint>]
  union: [Symbol.union, Seed.Fixpoint[]]
  intersect: [Symbol.intersect, Seed.Fixpoint[]]
  tree: Omit<this, 'tree'>[keyof Omit<this, 'tree'>]
}

const SchemaMap = {
  [Symbol.never]: t.never,
  [Symbol.void]: t.void,
  [Symbol.unknown]: t.unknown,
  [Symbol.any]: t.any,
  [Symbol.symbol_]: t.symbol,
  [Symbol.null]: t.null,
  [Symbol.undefined]: t.undefined,
  [Symbol.boolean]: t.boolean,
  [Symbol.number]: t.number,
  [Symbol.bigint]: t.bigint,
  [Symbol.string]: t.string,
} as const satisfies Record<Nullary, t.Tree.Fixpoint>

const DataMap = {
  [Symbol.never]: fc.constant(void 0 as never),
  [Symbol.void]: fc.constant(void 0 as void),
  [Symbol.unknown]: fc.anything(),
  [Symbol.any]: fc.anything() as fc.Arbitrary<any>,
  [Symbol.symbol_]: fc.string().map((s) => globalThis.Symbol.for(s)),
  [Symbol.null]: fc.constant(null),
  [Symbol.undefined]: fc.constant(undefined),
  [Symbol.boolean]: fc.boolean(),
  [Symbol.number]: fc.float(),
  [Symbol.bigint]: fc.bigInt(),
  [Symbol.string]: fc.string(),
} as const satisfies Record<Nullary, fc.Arbitrary<unknown>>

const StringMap = {
  [Symbol.never]: 'never',
  [Symbol.void]: 'void',
  [Symbol.unknown]: 'unknown',
  [Symbol.any]: 'any',
  [Symbol.symbol_]: 'symbol',
  [Symbol.null]: 'null',
  [Symbol.undefined]: 'undefined',
  [Symbol.boolean]: 'boolean',
  [Symbol.number]: 'number',
  [Symbol.bigint]: 'bigint',
  [Symbol.string]: 'string',
} as const satisfies Record<Nullary, string>

const functor: Functor<F, Fixpoint> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isNullary(x): return x
        case x[0] === Symbol.array: return [x[0], f(x[1])]
        case x[0] === Symbol.optional: return [x[0], f(x[1])]
        case x[0] === Symbol.record: return [x[0], f(x[1])]
        case x[0] === Symbol.tuple: return [x[0], x[1].map(f)]
        case x[0] === Symbol.union: return [x[0], x[1].map(f)]
        case x[0] === Symbol.intersect: return [x[0], x[1].map(f)]
        case x[0] === Symbol.object:
          return [x[0], x[1].map(([k, v]) => [k, f(v)] satisfies [any, any])]
      }
    }
  }
}

namespace Recursive {
  export const schemaFromSeed: Functor.Algebra<F, t.Tree.Fixpoint> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case isNullary(x): return SchemaMap[x[0]]
      case x[0] === Symbol.array: return t.array(x[1])
      case x[0] === Symbol.record: return t.record(x[1])
      case x[0] === Symbol.optional: return t.optional(x[1], { optionalTreatment: 'treatUndefinedAndOptionalAsTheSame' })
      case x[0] === Symbol.tuple: return t.tuple(...x[1])
      case x[0] === Symbol.union: return t.union(...x[1])
      case x[0] === Symbol.intersect: return t.intersect(...x[1])
      case x[0] === Symbol.object: return t.object(
        Object.fromEntries(
          x[1]
            .map(([k, v]) => [JSON.stringify(k), v] satisfies [any, any])
        ),
        { optionalTreatment: 'treatUndefinedAndOptionalAsTheSame' }
      )
    }
  }

  export const dataFromSeed: Functor.Algebra<F, fc.Arbitrary<unknown>> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case isNullary(x): return DataMap[x[0]]
      case x[0] === Symbol.array: return fc.array(x[1])
      case x[0] === Symbol.record: return fc.dictionary(fc.string(), x[1])
      case x[0] === Symbol.optional: return fc.optional(x[1])
      case x[0] === Symbol.tuple: return fc.tuple(...x[1])
      case x[0] === Symbol.union: return fc.oneof(...x[1])
      // TODO: filter for only objects, before reducing??
      case x[0] === Symbol.intersect: return fc.tuple(...x[1]).map((xs) => xs.reduce(Object.assign, {}))
      case x[0] === Symbol.object: return fc.record(Object.fromEntries(x[1]))
    }
  }

  export const identity: Functor.Algebra<F, Fixpoint> = (x) => {
    return x
  }

  export const show: Functor.Algebra<F, string> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case isNullary(x): return StringMap[x[0]]
      case x[0] === Symbol.array: return 'Array<' + x[1] + '>'
      case x[0] === Symbol.record: return 'Record<string, ' + x[1] + '>'
      case x[0] === Symbol.optional: return x[1] + '?'
      case x[0] === Symbol.tuple: return '[' + x[1].join(', ') + ']'
      case x[0] === Symbol.union: return x[1].join(' | ')
      case x[0] === Symbol.intersect: return x[1].join(' & ')
      case x[0] === Symbol.object:
        return '{ ' + x[1].flatMap(([k, v]) => `${JSON.stringify(k)}: ${v}`).join(', ') + ' }'
    }
  }
}

type Nullary = typeof Nullary[number]
const Nullary = [
  Symbol.never,
  Symbol.any,
  Symbol.unknown,
  Symbol.void,
  Symbol.undefined,
  Symbol.null,
  Symbol.boolean,
  Symbol.symbol_,
  Symbol.bigint,
  Symbol.number,
  Symbol.string,
] as const satisfies symbol[]

const isNullary = (u: unknown): u is [tag: Nullary] =>
  Array.isArray(u) && Nullary.includes(u[0])

type SortBias<T>
  = Compare<keyof T>
  | Record<keyof T, number>

type Constraints<T = unknown, U = T> = {
  union?: fc.ArrayConstraints,
  intersect?: fc.ArrayConstraints,
  tree?: fc.OneOfConstraints,
  object?: fc.UniqueArrayConstraintsRecommended<T, U>
  tuple?: fc.ArrayConstraints,
  sortBias?: SortBias<Builder>
  exclude?: (keyof Builder)[]
  include?: (keyof Builder)[]
}

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

const defaultDepthIdentifier = fc.createDepthIdentifier()
const defaultArrayConstraints = { minLength: 0, maxLength: 2, size: 'xsmall' } as const satisfies fc.ArrayConstraints
const defaultTupleConstraints = { minLength: 1, maxLength: 3, size: 'xsmall' } as const satisfies fc.ArrayConstraints
const defaultIntersectConstraints = { minLength: 1, maxLength: 2, size: 'xsmall' } as const satisfies fc.ArrayConstraints
const defaultUnionConstraints = { minLength: 2, maxLength: 2, size: 'xsmall' } as const satisfies fc.ArrayConstraints
const defaultObjectConstraints = { minLength: 1, maxLength: 3, size: 'xsmall' } satisfies fc.UniqueArrayDefaults<any, any>
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
  : (nodes: (keyof Builder)[]) => (constraints?: Constraints) => (keyof Builder)[]
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

const parseConstraints = ({
  exclude = defaults.exclude,
  include = defaults.include,
  intersect = defaults.intersect,
  object = defaults.object,
  sortBias = defaults.sortBias,
  tree = defaults.tree,
  tuple = defaults.tuple,
  union = defaults.union,
}: Constraints = defaults): Required<Constraints> => {
  return {
    include,
    exclude,
    sortBias,
    intersect: {
      ...defaults.intersect,
      ...intersect,
    },
    object: {
      ...defaults.object,
      ...object,
    },
    tree: {
      ...defaults.tree,
      ...tree,
    },
    tuple: {
      ...defaults.tuple,
      ...tuple,
    },
    union: {
      ...defaults.union,
      ...union,
    },
  }
}

function seed(constraints?: Constraints): (go: fc.LetrecTypedTie<Builder>) => fc.LetrecValue<Builder>
function seed(_: Constraints = defaults) {
  const $ = parseConstraints(_)
  return (go: fc.LetrecTypedTie<Builder>) => ({
    never: fc.constant([Symbol.never]),
    any: fc.constant([Symbol.any]),
    unknown: fc.constant([Symbol.unknown]),
    void: fc.constant([Symbol.void]),
    null: fc.constant([Symbol.null]),
    undefined: fc.constant([Symbol.undefined]),
    symbol: fc.constant([Symbol.symbol_]),
    boolean: fc.constant([Symbol.boolean]),
    bigint: fc.constant([Symbol.bigint]),
    number: fc.constant([Symbol.number]),
    string: fc.constant([Symbol.string]),
    array: fc.tuple(fc.constant(Symbol.array), go('tree')),
    record: fc.tuple(fc.constant(Symbol.record), go('tree')),
    optional: fc.tuple(fc.constant(Symbol.optional), fc.optional(go('tree'))),
    tuple: fc.tuple(fc.constant(Symbol.tuple), fc.array(go('tree'), $.tuple)),
    object: fc.tuple(fc.constant(Symbol.object), fc.entries(go('tree'), $.object)),
    union: fc.tuple(fc.constant(Symbol.union), fc.array(go('tree'), $.union)),
    intersect: fc.tuple(fc.constant(Symbol.intersect), fc.array(go('tree'), $.intersect)),
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
 * {@link t.Tree `schema`} function.
 * 
 * Internally, schemas are generated from a 
 * {@link Seed `seed value`}, which is itself generated by a library 
 * called [`fast-check`](https://github.com/dubzzz/fast-check).
 */
const schema = (constraints?: Constraints) => fc.letrec(seed(parseConstraints(constraints))).tree.map(schemaFromSeed)
//    ^?

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
const data = (constraints?: Constraints) => fc.letrec(seed(parseConstraints(constraints))).tree.chain(dataFromSeed)

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
const schemaWithData = (constraints: Constraints = defaults) => fc
  .letrec(seed(parseConstraints(constraints)))
  .tree.chain( // TODO: look into removing '.chain' call
    (s) => fc.record({
      seed: fc.constant(s),
      data: dataFromSeed(s),
      schema: fc.constant(schemaFromSeed(s)),
      string: fc.constant(show(s)),
    })
  )
