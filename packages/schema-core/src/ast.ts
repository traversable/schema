import * as T from '@traversable/registry'
import { fn, URI } from '@traversable/registry'

export {
  never_ as never,
  unknown_ as unknown,
  any_ as any,
  void_ as void,
  null_ as null,
  undefined_ as undefined,
  bigint_ as bigint,
  symbol_ as symbol,
  boolean_ as boolean,
  number_ as number,
  string_ as string,
  //
  eq,
  array,
  record,
  optional,
  object_ as object,
  tuple,
  union,
  intersect,
  //
  type Leaf,
  type Free,
  type F,
  leafTags,
  Leaves,
  isLeaf,
  Functor,
  fold,
  unfold,
}

interface never_ { tag: URI.never, def: never }
interface unknown_ { tag: URI.unknown, def: unknown }
interface any_ { tag: URI.any, def: any }
interface void_ { tag: URI.void, def: void }
interface null_ { tag: URI.null, def: null }
interface undefined_ { tag: URI.undefined, def: undefined }
interface bigint_ { tag: URI.bigint, def: bigint }
interface symbol_ { tag: URI.symbol_, def: symbol }
interface boolean_ { tag: URI.boolean, def: boolean }
interface number_ { tag: URI.number, def: number }
interface string_ { tag: URI.string, def: string }
interface eq<T = unknown> { tag: URI.eq, def: T }
interface array<T = unknown> { tag: URI.array, def: T }
interface record<T = unknown> { tag: URI.record, def: T }
interface optional<T = unknown> { tag: URI.optional, def: T }
interface object_<T = unknown> { tag: URI.object, def: T }
interface tuple<T = unknown> { tag: URI.tuple, def: T }
interface union<T = unknown> { tag: URI.union, def: T }
interface intersect<T = unknown> { tag: URI.intersect, def: T }

type Leaf = typeof Leaves[number]
interface Free extends T.HKT { [-1]: F<this[0]> }

type F<_>
  = Leaf
  | eq<_>
  | array<_>
  | record<_>
  | optional<_>
  | object_<{ [x: string]: _ }>
  | tuple<readonly _[]>
  | union<readonly _[]>
  | intersect<readonly _[]>
  ;

type Fixpoint
  = Leaf
  | eq<Fixpoint>
  | array<Fixpoint>
  | record<Fixpoint>
  | optional<Fixpoint>
  | object_<{ [x: string]: Fixpoint }>
  | tuple<readonly Fixpoint[]>
  | union<readonly Fixpoint[]>
  | intersect<readonly Fixpoint[]>
  ;

const unknown_: unknown_ = { tag: URI.unknown, def: void 0 as unknown }
const never_: never_ = { tag: URI.never, def: void 0 as never }
const any_: any_ = { tag: URI.any, def: void 0 as any }
const void_: void_ = { tag: URI.void, def: void 0 as void }
const null_: null_ = { tag: URI.null, def: null }
const undefined_: undefined_ = { tag: URI.undefined, def: void 0 as never }
const symbol_: symbol_ = { tag: URI.symbol_, def: globalThis.Symbol() }
const boolean_: boolean_ = { tag: URI.boolean, def: false }
const number_: number_ = { tag: URI.number, def: 0 }
const bigint_: bigint_ = { tag: URI.bigint, def: 0n }
const string_: string_ = { tag: URI.string, def: '' }
function eq<T>(x: T): eq<T> { return { tag: URI.eq, def: x } }
function array<T>(x: T): array<T> { return { tag: URI.array, def: x } }
function record<T>(x: T): record<T> { return { tag: URI.record, def: x } }
function optional<T>(x: T): optional<T> { return { tag: URI.optional, def: x } }
function tuple<T>(xs: T): tuple<T> { return { tag: URI.tuple, def: xs } }
function object_<T>(xs: T): object_<T> { return { tag: URI.object, def: xs } }
function union<T>(x: T): union<T> { return { tag: URI.union, def: x } }
function intersect<T>(x: T): intersect<T> { return { tag: URI.intersect, def: x } }

const Leaves = [
  unknown_,
  never_,
  any_,
  void_,
  null_,
  undefined_,
  symbol_,
  boolean_,
  number_,
  bigint_,
  string_,
]

const leafTags = Leaves.map((l) => l.tag)

const isLeaf = (u: unknown): u is Leaf =>
  typeof u === 'function' &&
  'tag' in u &&
  typeof u.tag === 'string' &&
  (<string[]>leafTags).includes(u.tag)


const Functor: T.Functor<Free, Fixpoint> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isLeaf(x): return x
        case x.tag === URI.eq: return eq(f(x.def))
        case x.tag === URI.array: return array(f(x.def))
        case x.tag === URI.record: return record(f(x.def))
        case x.tag === URI.optional: return optional(f(x.def))
        case x.tag === URI.object: return object_(fn.map(x.def, f))
        case x.tag === URI.tuple: return tuple(fn.map(x.def, f))
        case x.tag === URI.union: return union(fn.map(x.def, f))
        case x.tag === URI.intersect: return intersect(fn.map(x.def, f))
      }
    }
  }
}

const fold = fn.cata(Functor)
const unfold = fn.ana(Functor)
