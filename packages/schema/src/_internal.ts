import * as T from './types.js'
import * as fn from './function.js'
import { function as isFunction } from './predicates.js'
import { URI } from './uri.js'

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
interface array<T = unknown> { tag: URI.array, def: T }
interface record<T = unknown> { tag: URI.record, def: T }
interface optional<T = unknown> { tag: URI.optional, def: T }
interface object_<T = unknown> { tag: URI.object, def: T }
interface tuple<T = unknown> { tag: URI.tuple, def: T }
interface union<T = unknown> { tag: URI.union, def: T }
interface intersect<T = unknown> { tag: URI.intersect, def: T }

type Leaf = typeof Leaves[number]
interface Free extends T.HKT { [-1]: F<this[0]> }

type F<Rec>
  = Leaf
  | array<Rec>
  | record<Rec>
  | optional<Rec>
  | object_<{ [x: string]: Rec }>
  | tuple<readonly Rec[]>
  | union<readonly Rec[]>
  | intersect<readonly Rec[]>
  ;

/**
 * ### {@link Fixpoint `AST.Fixpoint`}
 * 
 * 
 */
type Fixpoint
  = Leaf
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
  isFunction(u) &&
  'tag' in u &&
  typeof u.tag === 'string' &&
  (<string[]>leafTags).includes(u.tag)


const Functor: T.Functor<Free, Fixpoint> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isLeaf(x): return x
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
