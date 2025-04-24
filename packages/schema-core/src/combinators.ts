import type * as T from './types.js'
import type { LowerBound } from './types.js'
import type { of } from './schemas/of.js'

/**
 * ## {@link filter `t.filter`}
 */
export function filter<S extends LowerBound, T extends LowerBound<S['_type']>>(schema: S, filter: T): T
export function filter<S extends LowerBound, T extends S['_type']>(schema: S, filter: (s: S['_type']) => s is T): of<T>
export function filter<S extends LowerBound>(schema: S, filter: (s: S['_type']) => boolean): S
export function filter<T, U extends T>(guard: T.Guard<T>, narrower: (x: T) => x is U): T.Guard<U>
export function filter<S extends { def?: any, _type?: any, (u: any): u is any }>(guard: S): (predicate: (x: S['_type']) => boolean) => S
export function filter<T>(guard: T.Guard<T>, predicate: (x: T) => boolean): T.Guard<T>
export function filter<T>(guard: T.Guard<T>): (predicate: (x: T) => boolean) => T.Guard<T>
export function filter<T>(...args: [any] | [any, any]) {
  if (args.length === 1) return (predicate: T.Predicate<T>) => filter(args[0], predicate)
  else return (x: T) => args[0](x) && args[1](x)
}

// TODO: investigate this more plz
//
// export function compose<A, B extends A, C extends B>(f: (a: A) => a is B, g: (b: B) => b is C): (b: B) => b is C
//
// compose(t.number, (x) => x === 9000)
//  ^? (u: number) => u is 9000       <-- INTERESTING...
//                                        this _actually_ seems type-safe, since t.number goes from unknown -> number?
//                                        might need to tweak the runtime impl a bit...

// /**
//  * ## {@link compose `t.compose`}
//  */
// export function compose<A extends t.Schema, B extends t.FullSchema<A['_type']>>(f: A, g: B): B
// export function compose<A extends t.Schema>(f: A, g: (t: A['_type']) => boolean): A
// export function compose<A, B extends A, C extends B>(f: (a: A) => a is B, g: (b: B) => b is C): t.inline<C>
// export function compose<A, B extends A>(f: (a: A) => a is B, g: (b: B) => boolean): t.inline<B>
// // export function compose<A, B extends A>(f: (a: A) => boolean, g: (a: A) => a is B): t.inline<B>
// export function compose<A, B extends A>(f: (a: A) => B | boolean, g: (a: A) => B | boolean): (a: A) => B | boolean {
//   return (a: A) => {
//     const b = f(a)
//     return b === false ? false : b === true ? g(a) : g(b)
//   }
// }
