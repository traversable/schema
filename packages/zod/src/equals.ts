import { z } from 'zod/v4'
import {
  Equal,
  Object_hasOwn,
  Object_keys,
} from '@traversable/registry'

import * as F from './functor.js'
import { tagged, TypeName } from './typename.js'

const neverEqual = (() => false) satisfies Equal<never>

export const defaults = {
  [TypeName.unknown]: Equal.SameValue<unknown>,
  [TypeName.any]: Equal.SameValue<any>,
  [TypeName.never]: neverEqual,
  [TypeName.void]: Equal.IsStrictlyEqual<void>,
  [TypeName.undefined]: Equal.IsStrictlyEqual,
  [TypeName.null]: Equal.IsStrictlyEqual<null>,
  [TypeName.symbol]: Equal.IsStrictlyEqual<symbol>,
  [TypeName.boolean]: Equal.IsStrictlyEqual<boolean>,
  [TypeName.nan]: Equal.SameValueNumber,
  [TypeName.int]: Equal.SameValueNumber,
  [TypeName.bigint]: Equal.IsStrictlyEqual<bigint>,
  [TypeName.number]: Equal.SameValueNumber,
  [TypeName.string]: Equal.SameValue<string>,
  [TypeName.literal]: Equal.SameValue<z.core.util.Literal>,
  [TypeName.date]: ((l, r) => l.getTime() === r.getTime()) satisfies Equal<Date>,
  [TypeName.enum]: Equal.SameValue<string | number>,
  [TypeName.success]: Equal.SameValue<string>,
  [TypeName.template_literal]: Equal.SameValue<string>,
} as const

function nullable<T>(equalsFn: Equal<T>): Equal<T | null> {
  return (l, r) => Equal.SameValue(l, r) || equalsFn(l!, r!)
}

function optional<T>(equalsFn: Equal<T>): Equal<T | undefined> {
  return (l, r) => Equal.SameValue(l, r) || equalsFn(l!, r!)
}

function array<T>(equalsFn: Equal<T>): Equal<readonly T[]> {
  return (l, r) => {
    if (Equal.SameValue(l, r)) return true
    let len = l.length
    if (len !== r.length) return false
    for (let ix = len; ix-- !== 0;) {
      if (!equalsFn(l[ix], r[ix])) return false
    }
    return true
  }
}

function record<T>(equalsFn: Equal<T>): Equal<Record<string, T>> {
  return (l, r) => {
    if (Equal.SameValue(l, r)) return true
    const lhs = Object_keys(l)
    const rhs = Object_keys(r)
    let len = lhs.length
    let k: string
    if (len !== rhs.length) return false
    for (let ix = len; ix-- !== 0;) {
      k = lhs[ix]
      if (!Object_hasOwn(r, k)) return false
      if (!(equalsFn(l[k], r[k]))) return false
    }
    len = rhs.length
    for (let ix = len; ix-- !== 0;) {
      k = rhs[ix]
      if (!Object_hasOwn(l, k)) return false
      if (!(equalsFn(l[k], r[k]))) return false
    }
    return true
  }
}

function union<T>(equalsFns: readonly Equal<T>[]): Equal<T> {
  return (l, r) => Equal.SameValue(l, r) || equalsFns.reduce((bool, equalsFn) => bool || equalsFn(l, r), false)
}

function intersection<L, R>(leftEquals: Equal<L>, rightEquals: Equal<R>): Equal<L & R> {
  return (l, r) => Equal.SameValue(l, r) || leftEquals(l, r) && rightEquals(l, r)
}

function set<T>(equalsFn: Equal<T>): Equal<Set<T>> {
  return (l, r) => {
    if (Equal.SameValue(l, r)) return true
    else if (l.size !== r.size) return false
    else return array(equalsFn)(Array.from(l).sort(), Array.from(r).sort())
  }
}

function map<K, V>(keyEquals: Equal<K>, valueEquals: Equal<V>): Equal<Map<K, V>> {
  return (l, r) => {
    if (Equal.SameValue(l, r)) return true
    else if (l.size !== r.size) return false
    else {
      const leftEntries = Array.from(l).sort()
      const rightEntries = Array.from(r).sort()
      for (let ix = 0, len = l.size; ix < len; ix++) {
        const [lk, lv] = leftEntries[ix]
        const [rk, rv] = rightEntries[ix]
        if (!keyEquals(lk, rk)) return false
        if (!valueEquals(lv, rv)) return false
      }
      return true
    }
  }
}

function tuple<T>(equalsFns: readonly Equal<T>[], restEquals?: Equal<T>): Equal<readonly T[]> {
  return (l, r) => {
    if (Equal.SameValue(l, r)) return true
    if (l.length !== r.length) return false
    const len = equalsFns.length
    for (let ix = len; ix-- !== 0;) {
      const equalsFn = equalsFns[ix]
      if (!equalsFn(l[ix], r[ix])) return false
    }
    if (l.length > len) {
      if (restEquals == null) return false
      for (let ix = len; ix < l.length; ix++) {
        if (!restEquals(l[ix], r[ix])) return false
      }
    }
    return true
  }
}

function object<T>(equalsFns: { [x: string]: Equal<T> }, catchallEquals?: Equal<T>): Equal<{ [x: string]: T }> {
  return (l, r) => {
    if (Equal.SameValue(l, r)) return true
    const lhs = Object_keys(l)
    const rhs = Object_keys(r)
    if (lhs.length !== rhs.length) return false
    const keysSet = catchallEquals ? new Set(lhs.concat(rhs)) : null
    for (const k in equalsFns) {
      keysSet?.delete(k)
      const equalsFn = equalsFns[k]
      const lHas = Object_hasOwn(l, k)
      const rHas = Object_hasOwn(r, k)
      if (lHas) {
        if (!rHas) return false
        if (!equalsFn(l[k], r[k])) return false
      }
      if (rHas) {
        if (!lHas) return false
        if (!equalsFn(l[k], r[k])) return false
      }
      if (!equalsFn(l[k], r[k])) return false
    }
    if (catchallEquals && keysSet) {
      const catchallKeys = Array.from(keysSet)
      let k: string | undefined
      while ((k = catchallKeys.shift()) !== undefined) {
        if (!Object_hasOwn(l, k)) return false
        if (!Object_hasOwn(r, k)) return false
        if (!catchallEquals(l[k], r[k])) return false
      }
    }
    return true
  }
}

const fold = F.fold<Equal<any>>((x) => {
  switch (true) {
    default: return (void (x satisfies never), neverEqual)
    case tagged('never')(x):
    case tagged('any')(x):
    case tagged('void')(x):
    case tagged('unknown')(x):
    case tagged('null')(x):
    case tagged('undefined')(x):
    case tagged('boolean')(x):
    case tagged('symbol')(x):
    case tagged('nan')(x):
    case tagged('int')(x):
    case tagged('bigint')(x):
    case tagged('number')(x):
    case tagged('string')(x):
    case tagged('date')(x):
    case tagged('enum')(x):
    case tagged('literal')(x):
    case tagged('success')(x):
    case tagged('template_literal')(x): return defaults[x._zod.def.type]
    case tagged('pipe')(x): return x._zod.def.out
    case tagged('catch')(x): return x._zod.def.innerType
    case tagged('default')(x): return x._zod.def.innerType
    case tagged('prefault')(x): return x._zod.def.innerType
    case tagged('readonly')(x): return x._zod.def.innerType
    case tagged('optional')(x): return optional(x._zod.def.innerType)
    case tagged('nullable')(x): return nullable(x._zod.def.innerType)
    case tagged('nonoptional')(x): return x._zod.def.innerType
    case tagged('set')(x): return set(x._zod.def.valueType)
    case tagged('lazy')(x): return x._zod.def.getter()
    case tagged('array')(x): return array(x._zod.def.element)
    case tagged('map')(x): return map(x._zod.def.keyType, x._zod.def.valueType)
    case tagged('record')(x): return record(x._zod.def.valueType)
    case tagged('tuple')(x): return tuple(x._zod.def.items, x._zod.def.rest)
    case tagged('object')(x): return object(x._zod.def.shape, x._zod.def.catchall)
    case tagged('union')(x): return union(x._zod.def.options)
    case tagged('intersection')(x): return intersection(x._zod.def.left, x._zod.def.right)
    // not supported
    case tagged('file')(x): return import('./utils.js').then(({ Invariant }) => Invariant.Unimplemented('file', 'zx.equals')) as never
    case tagged('custom')(x): return import('./utils.js').then(({ Invariant }) => Invariant.Unimplemented('custom', 'zx.equals')) as never
    case tagged('promise')(x): return import('./utils.js').then(({ Invariant }) => Invariant.Unimplemented('promise', 'zx.equals')) as never
    case tagged('transform')(x): return import('./utils.js').then(({ Invariant }) => Invariant.Unimplemented('transform', 'zx.equals')) as never
  }
})

/**
 * ## {@link equals `zx.equals`}
 *
 * Derive an _equals function_ from a zod schema (v4, classic).
 *
 * An "equals function" (see also, {@link Equal `Equal`}) is similar to
 * lodash's `deepEquals` function, except more performant, because
 * when the shape of the values being compared is known ahead of time,
 * we can optimize ahead of time, and only check what's necessary.
 * 
 * Note that the "equals function" generated by {@link equals `zx.equals`}
 * **assumes that both values have already been validated**. Passing 
 * unvalidated values to the function might result in undefined behavior.
 * 
 * @example
 * import { z } from 'zod/v4'
 * import { zx } from '@traversable/zod'
 * 
 * const equals = zx.equals(
 *   z.object({
 *     a: z.number(),
 *     b: z.array(z.string()),
 *     c: z.tuple([z.boolean(), z.literal(1)]),
 *   })
 * )
 * 
 * console.log(equals(
 *   { a: 1, b: ['hey', 'ho'], c: [false, 1] },
 *   { a: 1, b: ['hey', 'ho'], c: [false, 1] }
 * )) // => true
 * 
 * console.log(equals(
 *   { a: 9000, b: [], c: [true, 1] },
 *   { a: 9000, b: [], c: [true, 1] }
 * )) //  => true
 * 
 * console.log(equals(
 *   { a: 1, b: ['hey', 'ho'], c: [false, 1] },
 *   { a: 1, b: ['hey'], c: [false, 1] }
 * )) // => false
 * 
 * console.log(equals(
 *   { a: 9000, b: [], c: [true, 1] },
 *   { a: 9000, b: [], c: [false, 1] }
 * )) // => false
 */

export function equals<T extends z.core.$ZodType>(type: T): Equal<z.infer<T>>
export function equals(type: z.core.$ZodType): Equal<never> {
  return fold(type as never, [])
}
