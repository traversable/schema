import type { LowerBound, Entry, Predicate, Schema, Unspecified } from './core.js'
import { t as _, typeOf } from './core.js'
import { Functor, fold, foldWithIndex, IndexedFunctor, unfold } from './functor.js'
import { clone } from './extend.js'
import { is } from './is.js'

import never_ = _.Never
import unknown_ = _.Unknown
import any_ = _.Any
import void_ = _.Void
import null_ = _.Null
import undefined_ = _.Undefined
import symbol_ = _.Symbol
import boolean_ = _.Boolean
import bigint_ = _.BigInt
import integer_ = _.Integer
import number_ = _.Number
import string_ = _.String
import eq = _.Eq
import array = _.Array
import ReadonlyArray = _.ReadonlyArray
import record = _.Record
import optional = _.Optional
import object_ = _.Object
import tuple = _.Tuple
import union = _.Union
import intersect = _.Intersect
//
import Free = _.Free
import Leaf = _.Leaf
import F = _.F
import Fixpoint = _.Fixpoint
import inline = _.Inline
import bottom = _.Bottom
import top = _.Top
import InvalidSchema = _.InvalidSchema

export namespace t { export const isLeaf = _.isLeaf }
export declare namespace t {
  export {
    null_ as null,
    void_ as void,
    typeOf as typeof,
    // re-exported as an escape hatch to avoid colliding with keywords
    null_,
    void_,
    typeOf,
    //
    never_ as never,
    unknown_ as unknown,
    any_ as any,
    undefined_ as undefined,
    symbol_ as symbol,
    boolean_ as boolean,
    integer_ as integer,
    bigint_ as bigint,
    number_ as number,
    string_ as string,
    eq,
    array,
    ReadonlyArray,
    record,
    optional,
    object_ as object,
    tuple,
    union,
    intersect,
    //
    top,
    bottom,
    inline,
    clone,
    //
    LowerBound,
    Entry,
    F,
    Fixpoint,
    Free,
    Functor,
    IndexedFunctor,
    fold,
    foldWithIndex,
    unfold,
    InvalidSchema,
    Predicate,
    is,
    Leaf,
    Schema,
    Unspecified,
  }
}

t.never = never_
t.unknown = unknown_
t.any = any_
t.void = void_
t.null = null_
t.undefined = undefined_
t.symbol = symbol_
t.boolean = boolean_
t.bigint = bigint_
t.integer = integer_
t.number = number_
t.string = string_
t.eq = eq
t.array = array
t.record = record
t.optional = optional
t.object = object_
t.tuple = tuple
t.union = union
t.intersect = intersect
//
t.clone = clone
t.Functor = Functor
t.IndexedFunctor = IndexedFunctor
t.fold = fold
t.foldWithIndex = foldWithIndex
t.unfold = unfold
t.is = is
t.inline = inline
