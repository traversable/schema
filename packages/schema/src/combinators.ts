import type { Primitive, newtype } from '@traversable/registry'
import type { Guard, Predicate } from '@traversable/schema-core'

interface Extensible<T extends {} = {}> extends newtype<T> {
  [-1]?: T
}

interface ext<T extends {}> extends newtype<T> { [-1]: T }

function ext<F extends Guard>(guard: F): ext<F>
function ext<F extends Predicate>(guard: F): ext<F>
function ext<F extends Extensible>(guard: F) {
  guard[-1] = guard
  return guard
}

/** @internal */
const Object_values = globalThis.Object.values


/**
 * ## {@link refine `t.refine`}
 */
export function refine<T>(guard: Guard<T>, predicate: Predicate<T>): Guard<T>
export function refine<T>(guard: Guard<T>): (predicate: Predicate<T>) => Guard<T>
export function refine<T>(...args: [guard: Guard<T>] | [guard: Guard<T>, predicate: Predicate<T>]) {
  if (args.length === 1) return (predicate: Predicate<T>) => refine(args[0], predicate)
  else return (x: T) => args[0](x) && args[1](x)
}

/**
 * ## {@link compose `t.compose`}
 */
export function compose<A, B extends A, C extends B>(f: (a: A) => a is B, g: (b: B) => b is C): (b: B) => b is C
export function compose<A, B extends A>(f: (a: A) => a is B, g: (b: B) => boolean): Guard<B>
export function compose<A, B extends A>(f: (a: A) => boolean, g: (a: A) => a is B): Guard<B>
export function compose<A, B extends A>(f: (a: A) => B | boolean, g: (a: A) => B | boolean): (a: A) => B | boolean {
  return (a: A) => {
    const b = f(a)
    return b === false ? false : b === true ? g(a) : g(b)
  }
}

interface memberOf<T> extends Guard<T extends readonly unknown[] ? T[number] : T[keyof T]> { }

/**
 * ## {@link memberOf `t.memberOf`}
 */
export function memberOf<T extends readonly Primitive[]>(...primitives: [...T]): ext<memberOf<T>>
export function memberOf<T extends Record<string, Primitive>>(record: T): ext<memberOf<T>>
export function memberOf(
  ...[head, ...tail]:
    | [...primitives: readonly unknown[]]
    | [record: Record<string, unknown>]
) {
  return ext(
    (u) => {
      if (!!head && typeof head === 'object') return Object_values(head).includes(u)
      else return u === head || tail.includes(u)
    })
}
