import type * as T from '@traversable/registry'
import { fn, has, symbol, URI } from '@traversable/registry'

import type { Guarded, Schema } from './types.js'

import type { of } from './schemas/of.js'
import { never as never_ } from './schemas/never.js'
import { any as any_ } from './schemas/any.js'
import { unknown as unknown_ } from './schemas/unknown.js'
import { void as void_ } from './schemas/void.js'
import { null as null_ } from './schemas/null.js'
import { undefined as undefined_ } from './schemas/undefined.js'
import { symbol as symbol_ } from './schemas/symbol.js'
import { boolean as boolean_ } from './schemas/boolean.js'
import { integer as integer } from './schemas/integer.js'
import { bigint as bigint_ } from './schemas/bigint.js'
import { number as number_ } from './schemas/number.js'
import { string as string_ } from './schemas/string.js'
import { eq } from './schemas/eq.js'
import { optional } from './schemas/optional.js'
import { array } from './schemas/array.js'
import { record } from './schemas/record.js'
import { union } from './schemas/union.js'
import { intersect } from './schemas/intersect.js'
import { tuple } from './schemas/tuple.js'
import { object as object_ } from './schemas/object.js'

export type Inline<S> = never | of<Guarded<S>>

export type typeOf<
  T extends { _type?: unknown },
  _ extends
  | T['_type']
  = T['_type']
> = never | _

export type Unary =
  | eq<Unary>
  | array<Unary>
  | record<Unary>
  | optional<Unary>
  | union<Unary[]>
  | intersect<readonly Unary[]>
  | tuple<Unary[]>
  | object_<{ [x: string]: Unary }>


export type F<T> =
  | Leaf
  | eq<T>
  | array<T>
  | record<T>
  | optional<T>
  | union<T[]>
  | intersect<readonly T[]>
  | tuple<T[]>
  | object_<{ [x: string]: T }>

export declare namespace F {
  type Unary<T> =
    | eq<T>
    | array<T>
    | record<T>
    | optional<T>
    | union<T[]>
    | intersect<readonly T[]>
    | tuple<T[]>
    | object_<{ [x: string]: T }>
}

export type Fixpoint =
  | Leaf
  | Unary

export interface Free extends T.HKT { [-1]: F<this[0]> }

export type Leaf = typeof leaves[number]
export type LeafTag = Leaf['tag']
export type Nullary = typeof nullaries[number]
export type NullaryTag = Nullary['tag']
export type Boundable = typeof boundables[number]
export type BoundableTag = Boundable['tag']
export type Tag = typeof tags[number]
export type UnaryTag = typeof unaryTags[number]
export type TypeName = T.TypeName<Tag>

interface NullaryCatalog {
  never: never_
  any: any_
  unknown: unknown_
  void: void_
  null: null_
  undefined: undefined_
  symbol: symbol_
  boolean: boolean_
}

interface BoundableCatalog {
  integer: integer
  number: number_
  bigint: bigint_
  string: string_
}

interface UnaryCatalog<T = unknown> {
  eq: eq<T>
  optional: optional<T>
  array: array<T>
  record: record<T>
  union: union<T[]>
  intersect: intersect<readonly T[]>
  tuple: tuple<readonly T[]>
  object: object_<{ [x: string]: T }>
}

export interface Catalog extends Catalog.Boundable, Catalog.Nullary, Catalog.Unary {}
export declare namespace Catalog {
  export {
    BoundableCatalog as Boundable,
    NullaryCatalog as Nullary,
    UnaryCatalog as Unary,
  }
}

const hasTag = has('tag', (tag) => typeof tag === 'string')

export const nullaries = [unknown_, never_, any_, void_, undefined_, null_, symbol_, boolean_]
export const nullaryTags = nullaries.map((x) => x.tag)
export const isNullaryTag = (u: unknown): u is NullaryTag => nullaryTags.includes(u as never)
export const isNullary = (u: unknown): u is Nullary => hasTag(u) && nullaryTags.includes(u.tag as never)

export const boundables = [integer, bigint_, number_, string_]
export const boundableTags = boundables.map((x) => x.tag)
export const isBoundableTag = (u: unknown): u is BoundableTag => boundableTags.includes(u as never)
export const isBoundable = (u: unknown): u is Boundable => hasTag(u) && boundableTags.includes(u.tag as never)

export const leaves = [...nullaries, ...boundables]
export const leafTags = leaves.map((leaf) => leaf.tag)
export const isLeaf = (u: unknown): u is Leaf => hasTag(u) && leafTags.includes(u.tag as never)

export const unaryTags = [URI.optional, URI.eq, URI.array, URI.record, URI.tuple, URI.union, URI.intersect, URI.object]
export const tags = [...leafTags, ...unaryTags]
export const isUnary = (u: unknown): u is Unary => hasTag(u) && unaryTags.includes(u.tag as never)

export const isCore: {
  <S>(u: F<S>): u is F<S>
  (u: unknown): u is Fixpoint
  <S>(u: F<S>): u is F<S>
} = ((u: unknown) => hasTag(u) && tags.includes(u.tag as never)) as never


export declare namespace Functor {
  export type Algebra<T> = T.Algebra<Free, T>
  export type Index = (keyof any)[]
  export type IndexedAlgebra<T> = T.IndexedAlgebra<T, Free, Index>
  export {
    F,
    Free,
    Fixpoint,
  }
}

export const Functor: T.Functor<Free, Schema> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isLeaf(x): return x
        case x.tag === URI.eq: return eq.def(x.def as never) as never
        case x.tag === URI.array: return array.def(f(x.def), x)
        case x.tag === URI.record: return record.def(f(x.def))
        case x.tag === URI.optional: return optional.def(f(x.def))
        case x.tag === URI.tuple: return tuple.def(fn.map(x.def, f))
        case x.tag === URI.object: return object_.def(fn.map(x.def, f))
        case x.tag === URI.union: return union.def(fn.map(x.def, f))
        case x.tag === URI.intersect: return intersect.def(fn.map(x.def, f))
      }
    }
  }
}

export const IndexedFunctor: T.Functor.Ix<Functor.Index, Free, Fixpoint> = {
  ...Functor,
  mapWithIndex(f) {
    return (x, ix) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isLeaf(x): return x
        case x.tag === URI.eq: return eq.def(x.def as never) as never
        case x.tag === URI.array: return array.def(f(x.def, ix), x)
        case x.tag === URI.record: return record.def(f(x.def, ix))
        case x.tag === URI.optional: return optional.def(f(x.def, ix))
        case x.tag === URI.tuple: return tuple.def(fn.map(x.def, (y, iy) => f(y, [...ix, iy])), x.opt)
        case x.tag === URI.object: return object_.def(fn.map(x.def, (y, iy) => f(y, [...ix, iy])), {}, x.opt as never)
        case x.tag === URI.union: return union.def(fn.map(x.def, (y, iy) => f(y, [...ix, symbol.union, iy])))
        case x.tag === URI.intersect: return intersect.def(fn.map(x.def, (y, iy) => f(y, [...ix, symbol.intersect, iy])))
      }
    }
  }
}

export const unfold = fn.ana(Functor)
export const fold = fn.cata(Functor)
export const foldWithIndex = fn.cataIx(IndexedFunctor)
