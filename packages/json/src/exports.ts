import * as _ from './functor.js'

export { VERSION } from './version.js'

export * as Json from './json.js'
export type { Scalar } from './json.js'

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
  ? import('./json.js').Fixpoint
  : import('./json.js').Unary<T>
