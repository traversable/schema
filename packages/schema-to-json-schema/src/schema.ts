// export type * from '@traversable/schema-core'

import type { AnySchema, Schema, Unspecified } from '@traversable/schema-core'
import { t as T } from '@traversable/schema-core'
import * as _ from './jsonSchema.js'

/* schemas that don't have a corresponding JSON Schema representation */
import never_ = _.Never
import void_ = _.Void
import undefined_ = _.Undefined
import symbol_ = _.Symbol
import bigint_ = _.BigInt
import inline_ = _.Inline

/* data types */
import unknown_ = _.Unknown
import any_ = _.Any
import null_ = _.Null
import boolean_ = _.Boolean
import integer_ = _.Integer
import number_ = _.Number
import string_ = _.String
import eq_ = _.Eq
import optional_ = _.Optional
import array_ = _.Array
import record_ = _.Record
import union_ = _.Union
import intersect_ = _.Intersect
import tuple_ = _.Tuple
import object_ = _.Object

/* types */
import F = T.F
import Fixpoint = T.Fixpoint
import Free = T.Free
import InvalidSchema = T.InvalidSchema
import Leaf = T.Leaf
import bottom = T.bottom
import top = T.top
import typeOf = T.typeOf

export declare namespace t {
  export {
    /* re-exports to avoid keyword collision */
    typeOf,
    /* schemas that don't have a corresponding JSON Schema representation */
    never_ as never,
    void_ as void,
    undefined_ as undefined,
    symbol_ as symbol,
    bigint_ as bigint,
    inline_ as inline,
    /* data types */
    unknown_ as unknown,
    any_ as any,
    null_ as null,
    boolean_ as boolean,
    integer_ as integer,
    number_ as number,
    string_ as string,
    eq_ as eq,
    optional_ as optional,
    array_ as array,
    record_ as record,
    union_ as union,
    intersect_ as intersect,
    tuple_ as tuple,
    object_ as object,
    /* types */
    typeOf as typeof,
    F,
    Fixpoint,
    Free,
    InvalidSchema,
    Leaf,
    bottom,
    top,
    AnySchema,
    Schema,
    Unspecified,
  }
}

export namespace t {
  export const Functor = T.Functor
  export const fold = T.fold
  export const is = T.is
  export const isLeaf = T.isLeaf
  export const unfold = T.unfold
}

/* schemas that don't have a corresponding JSON Schema representation */
t.never = never_
t.void = void_
t.undefined = undefined_
t.symbol = symbol_
t.bigint = bigint_
t.inline = inline_
/* data types */
t.unknown = unknown_
t.any = any_
t.null = null_
t.boolean = boolean_
t.integer = integer_
t.number = number_
t.string = string_
t.inline = inline_
t.eq = eq_
t.optional = optional_
t.array = array_
t.record = record_
t.union = union_
t.intersect = intersect_
t.tuple = tuple_
t.object = object_
