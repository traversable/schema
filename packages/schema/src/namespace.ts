export * from './combinators.js'
export { toString, toTypeString } from './recursive.js'

import { toString, toTypeString } from './recursive.js'
import { t as core } from '@traversable/schema-core'

import * as _ from './schema.js'
import type { Schema } from './schema.js'

import typeOf = _.typeOf
//
import never_ = _.never
import unknown_ = _.unknown
import any_ = _.any
import undefined_ = _.undefined
import symbol_ = _.symbol
import boolean_ = _.boolean
import bigint_ = _.bigint
import integer_ = _.integer
import number_ = _.number
import string_ = _.string
import eq = _.eq
import array = _.array
import record = _.record
import optional = _.optional
import object_ = _.object
import tuple = _.tuple
import union = _.union
import intersect = _.intersect
import void_ = _.void_
import null_ = _.null_

import Functor = core.Functor
import Free = core.Free
import Leaf = core.Leaf
import F = core.F
import Fixpoint = core.Fixpoint
import inline = core.inline
import bottom = core.bottom
import top = core.top
import InvalidSchema = core.InvalidSchema
import is = core.is

export declare namespace t {
  export {
    typeOf as typeof,
    void_ as void,
    null_ as null,
    // re-exported as an escape hatch to avoid colliding with keywords
    typeOf,
    //
    never_ as never,
    unknown_ as unknown,
    any_ as any,
    undefined_ as undefined,
    symbol_ as symbol,
    boolean_ as boolean,
    bigint_ as bigint,
    integer_ as integer,
    number_ as number,
    string_ as string,
    eq,
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
    Schema,
    toString,
    toTypeString,
  }
}

export namespace t { export const isLeaf = core.isLeaf; }

t.never = never_
t.unknown = unknown_
t.any = any_
t.null = _.null
t.void = _.void
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
t.toString = toString
t.toTypeString = toTypeString
t.is = is
