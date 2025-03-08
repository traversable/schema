import type { Algebra, Eq, Kind } from '@traversable/registry'
import { fn, URI } from '@traversable/registry'
import type { Json } from '@traversable/json'
import { t, Equal } from '@traversable/schema-core'
import { Seed } from '@traversable/schema-seed'

/** @internal */
type FixUnknown<T> = 0 extends T & 1 ? unknown : T
/** @internal */
const Object_keys = globalThis.Object.keys
/** @internal */
const Object_fromEntries = globalThis.Object.fromEntries
/** @internal */
const hasOwn = <K extends keyof any>(u: unknown, k: K): u is Record<K, unknown> =>
  !!u && typeof u === 'object' && Object.prototype.hasOwnProperty.call(u, k)
/** @internal */
const Array_isArray = globalThis.Array.isArray

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

const defaults = {
  [URI.unknown]: Equal.deep<unknown>,
  [URI.any]: Equal.deep<any>,
  [URI.never]: Equal.IsStrictlyEqual<never>,
  [URI.void]: Equal.IsStrictlyEqual<void>,
  [URI.undefined]: Equal.IsStrictlyEqual,
  [URI.null]: Equal.IsStrictlyEqual<null>,
  [URI.symbol]: Equal.IsStrictlyEqual<symbol>,
  [URI.boolean]: Equal.IsStrictlyEqual<boolean>,
  [URI.bigint]: Equal.IsStrictlyEqual<bigint>,
  [URI.integer]: Equal.SameValueNumber,
  [URI.number]: Equal.SameValueNumber,
  [URI.string]: Equal.SameValue<string>,
  [URI.eq]: Equal.deep<Json>,
} as const satisfies { [K in keyof typeof TypeMap]: Eq<typeof TypeMap[K]> }

export const array
  : <T>(equalsFn: Eq<T>) => Eq<readonly T[]>
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
  : <T>(equalsFn: Eq<T>) => Eq<Record<string, T>>
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

export const object
  : <T>(equalsFns: { [x: string]: Eq<T> }) => Eq<{ [x: string]: T }>
  = (equalsFns) => (l, r) => {
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

export const tuple
  : <T>(equalsFns: readonly Eq<T>[]) => Eq<readonly T[]>
  = (equalsFns) => (l, r) => {
    if (Equal.SameValue(l, r)) return true
    if (Array_isArray(l)) {
      if (!Array_isArray(r)) return false
      const len = equalsFns.length;
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

export const union
  : <T>(equalsFns: readonly Eq<T>[]) => Eq<T>
  = (equalsFns) => (l, r) => Equal.SameValue(l, r) || equalsFns.reduce((bool, equalsFn) => bool || equalsFn(l, r), false)

export const intersect
  : <T>(equalsFns: readonly Eq<T>[]) => Eq<T>
  = (equalsFns) => (l, r) => Equal.SameValue(l, r) || equalsFns.reduce((bool, equalsFn) => bool && equalsFn(l, r), true)

export const optional
  : <T>(equalsFn: Eq<T>) => Eq<T>
  = (equalsFn) => (l, r) => Equal.SameValue(l, r) || defaults[URI.undefined](l, r) || equalsFn(l, r)

namespace Recursive {
  function fromSchema_<T>(x: Kind<t.Free, Eq<T>>): Eq<never> {
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

  const fromSeed_ = <T>(x: Kind<Seed.Free, Eq<T>>): Eq<never> => {
    switch (true) {
      default: return fn.exhaustive(x)
      case Seed.isNullary(x): return defaults[x]
      case x[0] === URI.eq: return defaults[URI.eq]
      case x[0] === URI.array: return array(x[1])
      case x[0] === URI.record: return record(x[1])
      case x[0] === URI.optional: return optional(x[1])
      case x[0] === URI.tuple: return tuple(x[1])
      case x[0] === URI.union: return union(x[1])
      case x[0] === URI.intersect: return intersect(x[1])
      case x[0] === URI.object: return object(Object_fromEntries(x[1]))
    }
  }

  export const fromSchema: Algebra<t.Free, Eq<never>> = fromSchema_ as never
  export const fromSeed: Algebra<Seed.Free, Eq<never>> = fromSeed_
}

/** 
 * ## {@link fromSeed `Eq.fromSeed`}
 * 
 * Derive an _equals function_ from a {@link Seed `Seed`} value.
 * 
 * An "equals function" a.k.a. {@link Eq `Eq`} is kinda like lodash's
 * `deepEquals`, except more performant. This is possible because
 * when the shape of the values being compared is known ahead of time,
 * we can optimize ahead of time, and only check what's necessary.
 */
export const fromSeed
  : (seed: Seed) => Eq<unknown>
  = fn.cata(Seed.Functor)(Recursive.fromSeed) as never

/** 
 * ## {@link fromSeed `Eq.fromSeed`}
 * 
 * Derive an _equals function_ from a {@link t.Schema `Schema`}.
 * 
 * An "equals function" a.k.a. {@link Eq `Eq`} is kinda like lodash's
 * `deepEquals`, except more performant. This is possible because
 * when the shape of the values being compared is known ahead of time,
 * we can optimize ahead of time, and only check what's necessary.
 */
export const fromSchema
  : <S extends t.Schema>(term: S) => Eq<FixUnknown<S['_type']>>
  = fn.cata(t.Functor)(Recursive.fromSchema) as never
