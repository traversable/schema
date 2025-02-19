export * from './combinators.js'
export { Functor } from './functor.js'

import { t as _, typeOf } from './model.js'
import { toString, toTypeString } from './recursive.js'
import { Functor } from './functor.js'

import never_ = _.Never
import unknown_ = _.Unknown
import any_ = _.Any
import void_ = _.Void
import null_ = _.Null
import undefined_ = _.Undefined
import symbol_ = _.Symbol
import boolean_ = _.Boolean
import bigint_ = _.BigInt
import number_ = _.Number
import string_ = _.String
import array = _.Array
import record = _.Record
import optional = _.Optional
import object_ = _.Object
import tuple = _.Tuple
import union = _.Union
import intersect = _.Intersect

import Free = _.Free
import Leaf = _.Leaf
import F = _.F
import Fixpoint = _.Fixpoint
import inline = _.Inline
import bottom = _.Bottom
import top = _.Top
import InvalidSchema = _.InvalidSchema
import is = _.is

export declare namespace t {
  export {
    never_ as never,
    unknown_ as unknown,
    any_ as any,
    void_ as void,
    null_ as null,
    undefined_ as undefined,
    symbol_ as symbol,
    boolean_ as boolean,
    bigint_ as bigint,
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
    top,
    bottom,
    inline,
    //
    F,
    Fixpoint,
    Free,
    Functor,
    InvalidSchema,
    is,
    Leaf,
    typeOf as typeof,
    toString,
    toTypeString,
  }
}

export namespace t { export const isLeaf = _.isLeaf }

t.never = never_
t.unknown = unknown_
t.any = any_
t.void = void_
t.null = null_
t.undefined = undefined_
t.symbol = symbol_
t.boolean = boolean_
t.bigint = bigint_
t.number = number_
t.string = string_
t.array = array
t.record = record
t.optional = optional
t.object = object_
t.tuple = tuple
t.union = union
t.intersect = intersect
//
t.Functor = Functor
t.toString = toString
t.toTypeString = toTypeString
t.is = is
