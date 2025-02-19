import * as _ from './json.js'
import { Arbitrary } from './arbitrary.js'

import Scalar = _.Scalar
import Unary = _.Unary
import Free = _.Free
import Recursive = _.Recursive

export declare namespace Json {
  export {
    type Scalar,
    type Unary,
    type Free,
    type Recursive,
  }
}

export function Json() { }

Json.is = _.isJson
Json.isScalar = _.isScalar
Json.isObject = _.isObject
Json.isArray = _.isArray
Json.Functor = _.Functor

/** 
 * ## {@link Json.map `Json.map`}
 */
Json.Arbitrary = Arbitrary
Json.fold = _.fold
Json.unfold = _.unfold
Json.toString = _.toString

/**
 * ## {@link Json `Json`}
 *
 * If {@link T `T`} is not specified, defaults to the traditional
 * definition of JSON as a recursive type.
 *
 * If {@link T `T`} is provided, {@link Json `Json<T>`} resolves
 * to the non-recursive definition of JSON.
 *
 * The non-recursive definition allows you to be more precise when
 * you're applying a transformation to some JSON value one level
 * at a time.
 *
 * This comes up when you're working with a traversal like the
 * Visitor pattern, where you've separated your concerns:
 *
 * 1. recursively "walking" the data structure
 * 2. applying a function at each node in the data structure
 *
 * This comes up a lot in the context of this library, which heavily
 * exploits __recursion schemes__ to "factor out" recursion.
 *
 * Recursion schemes are well-founded and well-known in the Haskell
 * community, but the technique has not found its way into the industry
 * yet.
 *
 * It is this library's explicit goal is to showcase how useful recursion
 * schemes are, and how you can use them to write recursive programs that:
 *
 * 1. are simple, almost trivial, to implement
 * 2. are easy to read and understand
 * 3. will, over time, help clarify and solidify your understanding of
 *    recursion in general
 */
export type Json<T = never> = [T] extends [never]
  ? Json.Recursive
  : Json.Unary<T>
