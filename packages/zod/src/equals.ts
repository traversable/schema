import type { Algebra, Kind } from '@traversable/registry'
import { Equal, fn, URI } from '@traversable/registry'
import type { Json } from '@traversable/json'
import { z } from 'zod/v4'

import * as F from './functor.js'
import { tagged, TypeName } from './typename.js'

/** @internal */
type FixUnknown<T> = 0 extends T & 1 ? unknown : T

/** @internal */
const Object_keys = globalThis.Object.keys

/** @internal */
const Array_isArray = globalThis.Array.isArray

/** @internal */
const hasOwn = <K extends keyof any>(u: unknown, k: K): u is Record<K, unknown> =>
  !!u && typeof u === 'object' && Object.prototype.hasOwnProperty.call(u, k)

declare const TypeMap: {
  [URI.unknown]: unknown
  [URI.any]: any
  [URI.never]: never
  [URI.void]: void
  [URI.undefined]: undefined
  [URI.null]: null
  [URI.symbol]: symbol
  [URI.boolean]: boolean
  [URI.bigint]: bigint
  [URI.number]: number
  [URI.integer]: number
  [URI.string]: string
  [URI.eq]: Json
}

export const defaults = {
  [TypeName.unknown]: Equal.SameValue<unknown>,
  [TypeName.any]: Equal.SameValue<any>,
  [TypeName.never]: Equal.IsStrictlyEqual<unknown>,
  [TypeName.void]: Equal.IsStrictlyEqual<void>,
  [TypeName.undefined]: Equal.IsStrictlyEqual<undefined>,
  [TypeName.null]: Equal.IsStrictlyEqual<null>,
  [TypeName.symbol]: Equal.IsStrictlyEqual<symbol>,
  [TypeName.boolean]: Equal.IsStrictlyEqual<boolean>,
  [TypeName.bigint]: Equal.IsStrictlyEqual<bigint>,
  [TypeName.int]: Equal.SameValueNumber,
  [TypeName.number]: Equal.SameValueNumber,
  [TypeName.nan]: Equal.SameValueNumber,
  [TypeName.string]: Equal.SameValue<string>,
  [TypeName.date]: ((l, r) => l.getTime() === r.getTime()) satisfies Equal<Date>
} as const
// satisfies { [K in keyof typeof TypeMap]: Equal<typeof TypeMap[K]> }

const alwaysEqual = (() => true) satisfies Equal<never>
const neverEqual = (() => false) satisfies Equal<never>

F.fold<Equal<any>>((x) => {
  switch (true) {
    default: return (void (x satisfies never), alwaysEqual)
    case tagged('never')(x):
    case tagged('any')(x):
    case tagged('void')(x):
    case tagged('unknown')(x):
    case tagged('null')(x):
    case tagged('undefined')(x):
    case tagged('boolean')(x):
    case tagged('symbol')(x): return defaults[x._zod.def.type]
    case tagged('nan')(x): return alwaysEqual
    case tagged('int')(x): return alwaysEqual
    case tagged('bigint')(x): return alwaysEqual
    case tagged('number')(x): return alwaysEqual
    case tagged('string')(x): return alwaysEqual
    case tagged('date')(x): return alwaysEqual


    case tagged('literal')(x): return alwaysEqual
    case tagged('enum')(x): return alwaysEqual
    case tagged('template_literal')(x): return alwaysEqual

    case tagged('array')(x): return alwaysEqual
    case tagged('set')(x): return alwaysEqual
    case tagged('optional')(x): return (l, r) => Equal.SameValue(l, r) || defaults[TypeName.undefined](l, r) || x._zod.def.innerType(l, r)
    case tagged('readonly')(x): return alwaysEqual
    case tagged('nonoptional')(x): return alwaysEqual
    case tagged('nullable')(x): return alwaysEqual

    case tagged('map')(x): return alwaysEqual
    case tagged('intersection')(x): return alwaysEqual
    case tagged('record')(x): return record(x._zod.def.valueType)

    case tagged('union')(x): return alwaysEqual
    case tagged('tuple')(x): return alwaysEqual
    case tagged('object')(x): return alwaysEqual

    case tagged('success')(x): return alwaysEqual
    case tagged('lazy')(x): return alwaysEqual
    case tagged('prefault')(x): return alwaysEqual
    case tagged('transform')(x): return alwaysEqual
    case tagged('catch')(x): return alwaysEqual
    case tagged('custom')(x): return alwaysEqual
    case tagged('default')(x): return alwaysEqual
    case tagged('pipe')(x): return alwaysEqual

    /** @deprecated */
    case tagged('promise')(x): return alwaysEqual
    // not supported
    case tagged('file')(x): return alwaysEqual
  }

})

export const array
  : <T>(equalsFn: Equal<T>) => Equal<readonly T[]>
  = (equalsFn) => (l, r) => {
    if (Equal.SameValue(l, r)) return true
    if (Array_isArray(l)) {
      if (!Array_isArray(r)) return false
      let len = l.length
      if (len !== r.length) return false
      for (let ix = len; ix-- !== 0;)
        if (!equalsFn(l[ix], r[ix])) return false
      return true
    } else return false
  }

export const record
  : <T>(equalsFn: Equal<T>) => Equal<Record<string, T>>
  = (equalsFn) => (l, r) => {
    if (Equal.SameValue(l, r)) return true
    if (!l || typeof l !== 'object' || Array_isArray(l)) return false
    if (!r || typeof r !== 'object' || Array_isArray(r)) return false
    const lhs = Object_keys(l)
    const rhs = Object_keys(r)
    let len = lhs.length
    let k: string
    if (len !== rhs.length) return false
    for (let ix = len; ix-- !== 0;) {
      k = lhs[ix]
      if (!hasOwn(r, k)) return false
      if (!(equalsFn(l[k], r[k]))) return false
    }
    len = rhs.length
    for (let ix = len; ix-- !== 0;) {
      k = rhs[ix]
      if (!hasOwn(l, k)) return false
      if (!(equalsFn(l[k], r[k]))) return false
    }
    return true
  }

export function object<T>(equalsFns: { [x: string]: Equal<T> }): Equal<{ [x: string]: T }> {
  return (l, r) => {
    if (Equal.SameValue(l, r)) return true
    if (!l || typeof l !== 'object' || Array_isArray(l)) return false
    if (!r || typeof r !== 'object' || Array_isArray(r)) return false
    for (const k in equalsFns) {
      const equalsFn = equalsFns[k]
      const lHas = hasOwn(l, k)
      const rHas = hasOwn(r, k)
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
    return true
  }
}

export function tuple<T>(equalsFns: readonly Equal<T>[]): Equal<readonly T[]> {
  return (l, r) => {
    if (Equal.SameValue(l, r)) return true
    if (Array_isArray(l)) {
      if (!Array_isArray(r)) return false
      const len = equalsFns.length
      for (let ix = len; ix-- !== 0;) {
        const equalsFn = equalsFns[ix]
        if (!hasOwn(l, ix) && !hasOwn(r, ix)) continue
        if (hasOwn(l, ix) && !hasOwn(r, ix)) return false
        if (hasOwn(r, ix) && !hasOwn(l, ix)) return false
        if (hasOwn(l, ix) && hasOwn(r, ix)) {
          if (!equalsFn(l[ix], r[ix])) return false
        }
      }
      return true
    } else return false
  }
}

export const union
  : <T>(equalsFns: readonly Equal<T>[]) => Equal<T>
  = (equalsFns) => (l, r) => Equal.SameValue(l, r) || equalsFns.reduce((bool, equalsFn) => bool || equalsFn(l, r), false)


export const intersect
  : <T>(equalsFns: readonly Equal<T>[]) => Equal<T>
  = (equalsFns) => (l, r) => Equal.SameValue(l, r) || equalsFns.reduce((bool, equalsFn) => bool && equalsFn(l, r), true)

export const optional
  : <T>(equalsFn: Equal<T>) => Equal<T>
  = (equalsFn) => (l, r) => Equal.SameValue(l, r) || defaults[URI.undefined](l, r) || equalsFn(l, r)

namespace Recursive {
  function fromSchema_<T>(x: Kind<t.Free, Equal<T>>): Equal<never> {
    switch (true) {
      default: return fn.exhaustive(x)
      case t.isLeaf(x): return defaults[x.tag]
      case x.tag === URI.eq: return defaults[URI.eq]
      case x.tag === URI.optional: return optional(x.def)
      case x.tag === URI.array: return array(x.def)
      case x.tag === URI.record: return record(x.def)
      case x.tag === URI.object: return object(x.def)
      case x.tag === URI.tuple: return tuple(x.def)
      case x.tag === URI.union: return union(x.def)
      case x.tag === URI.intersect: return intersect(x.def)
    }
  }

  export const fromSchema: Algebra<t.Free, Equal<never>> = fromSchema_ as never
}

/** 
 * ## {@link fromSchema `Eq.fromSchema`}
 * 
 * Derive an _equals function_ from a {@link t.Schema `Schema`}.
 * 
 * An "equals function" a.k.a. {@link Eq `Eq`} is kinda like lodash's
 * `deepEquals`, except more performant. This is possible because
 * when the shape of the values being compared is known ahead of time,
 * we can optimize ahead of time, and only check what's necessary.
 */
export const fromSchema
  : <S extends t.Schema>(term: S) => Equal<FixUnknown<S['_type']>>
  = fn.cata(t.Functor)(Recursive.fromSchema) as never
