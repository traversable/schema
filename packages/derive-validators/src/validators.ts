import type { IndexedAlgebra, IndexedRAlgebra } from '@traversable/registry'
import { fn, symbol, typeName, URI } from '@traversable/registry'
import { t } from '@traversable/schema-core'

import type { ValidationError } from './errors.js'
import { ERROR } from './errors.js'

export type ValidationFn = never | { (u: unknown): true | ValidationError[] }

/** @internal */
const Array_isArray = globalThis.Array.isArray

/** @internal */
const isObject = (u: unknown): u is { [x: string]: unknown } =>
  !!u && typeof u === 'object' && !Array_isArray(u)

/** @internal */
const Object_keys = globalThis.Object.keys

/** @internal */
const hasOwn = <K extends keyof any>(u: unknown, k: K): u is Record<K, unknown> =>
  !!u && typeof u === 'object' && Object.prototype.hasOwnProperty.call(u, k)

export const array
  : (validationFn: ValidationFn, ctx: t.Functor.Index) => ValidationFn
  = (validationFn, ctx) => (u) => {
    if (!Array_isArray(u)) return [ERROR.array(ctx, u)]
    let errors = Array.of<ValidationError>()
    const len = u.length
    for (let ix = 0; ix < len; ix++) {
      const v = u[ix]
      const results = validationFn(v)
      if (results !== true) {
        for (let iy = 0; iy < results.length; iy++) errors.push(results[iy])
        errors.push(ERROR.arrayElement([...ctx, ix], u[ix]))
      }
    }
    if (errors.length > 0) return errors
    return true
  }

export const record
  : (validationFn: ValidationFn, ctx: t.Functor.Index) => ValidationFn
  = (validationFn, ctx) => (u) => {
    if (!isObject(u)) return [ERROR.object(ctx, u)]
    let errors = Array.of<ValidationError>()
    const keys = Object_keys(u)
    const len = keys.length
    for (let ix = 0; ix < len; ix++) {
      const k = keys[ix]
      const v = u[k]
      const results = validationFn(v)
      if (results !== true) {
        for (let iy = 0; iy < results.length; iy++) {
          const result = results[iy]
          result.path.push(k)
          errors.push(result)
        }
        results.push(ERROR.objectValue([...ctx, k], u[k]))
      }
    }
    return errors.length > 0 ? errors : true
  }

export const object
  : (validationFns: { [x: string]: ValidationFn }, ix: t.Functor.Index) => ValidationFn
  = (validationFns, ctx) => (u) => {
    if (!isObject(u)) return [ERROR.object(ctx, u)]
    let errors = Array.of<ValidationError>()
    const keys = Object_keys(validationFns)
    const len = keys.length;
    for (let ix = 0; ix < len; ix++) {
      const k = keys[ix]
      const validationFn = validationFns[k]
      if (!hasOwn(u, k) && !(symbol.optional in validationFn)) {
        errors.push(ERROR.missingKey([...ctx, k], u))
        continue
      }
      const results = validationFn(u[k])
      if (results !== true) {
        for (let iy = 0; iy < results.length; iy++) errors.push(results[iy])
        results.push(ERROR.objectValue([...ctx, k], u[k]))
      }
    }
    return errors.length > 0 ? errors : true
  }

export const tuple
  : (validationFns: readonly ValidationFn[], ctx: t.Functor.Index) => ValidationFn
  = (validationFns, ctx) => (u) => {
    let errors = Array.of<ValidationError>()
    if (!Array_isArray(u)) return [ERROR.array(ctx, u)]
    const len = validationFns.length
    for (let ix = 0; ix < len; ix++) {
      const validationFn = validationFns[ix]
      if (!(ix in u) && !(symbol.optional in validationFn)) {
        errors.push(ERROR.missingIndex([...ctx, ix], u))
        continue
      }
      const results = validationFn(u[ix])
      if (results !== true) {
        for (let iy = 0; iy < results.length; iy++) errors.push(results[iy])
        results.push(ERROR.arrayElement([...ctx, ix], u[ix]))
      }
    }
    return errors.length > 0 ? errors : true
  }

export const union
  : (validationFns: readonly ValidationFn[], ctx: t.Functor.Index) => ValidationFn
  = (validationFns, _ctx) => (u) => {
    const len = validationFns.length
    let errors = Array.of<ValidationError>()
    for (let ix = 0; ix < len; ix++) {
      const validationFn = validationFns[ix]
      const results = validationFn(u)
      if (results === true) return true
      for (let iy = 0; iy < results.length; iy++) errors.push(results[iy])
    }
    return errors.length > 0 ? errors : true
  }

export const intersect
  : (validationFns: readonly ValidationFn[], ctx: t.Functor.Index) => ValidationFn
  = (validationFns, _ctx) => (u) => {
    const len = validationFns.length
    let errors = Array.of<ValidationError>()
    for (let ix = 0; ix < len; ix++) {
      const validationFn = validationFns[ix]
      const results = validationFn(u)
      if (results !== true)
        for (let iy = 0; iy < results.length; iy++) errors.push(results[iy])
    }
    return errors.length > 0 ? errors : true
  }

export const eq
  : (value: ValidationFn, ctx: t.Functor.Index) => ValidationFn
  = (value, ctx) => (u) => {
    const results = t.eq(value)(u)
    if (results === true) return true
    return [ERROR.eq(ctx, u, value)]
  }

export const optional
  : (validationFn: ValidationFn, ctx: t.Functor.Index) => ValidationFn
  = (validationFn, ctx) => {
    function validateOptional(u: unknown) {
      if (u === void 0) return true
      const results = validationFn(u)
      if (results === true) return true
      results.push(ERROR.optional(ctx, u))
      return results
    }
    validateOptional[symbol.optional] = true
    return validateOptional
  }

const Nullary = {
  unknown: fn.const(fn.const(true)),
  any: fn.const(fn.const(true)),
  never: (ctx) => (u) => [ERROR.never(ctx, u)],
  void: (ctx) => (u) => t.void(u) || [ERROR.void(ctx, u)],
  undefined: (ctx) => (u) => t.undefined(u) || [ERROR.undefined(ctx, u)],
  symbol: (ctx) => (u) => t.symbol(u) || [ERROR.symbol(ctx, u)],
  bigint: (ctx) => (u) => t.bigint(u) || [ERROR.bigint(ctx, u)],
  null: (ctx) => (u) => t.null(u) || [ERROR.null(ctx, u)],
  string: (ctx) => (u) => t.string(u) || [ERROR.string(ctx, u)],
  integer: (ctx) => (u) => t.integer(u) || [ERROR.integer(ctx, u)],
  number: (ctx) => (u) => t.number(u) || [ERROR.number(ctx, u)],
  boolean: (ctx) => (u) => t.boolean(u) || [ERROR.boolean(ctx, u)],
} as const satisfies Record<string, (ctx: t.Functor.Index) => (u: unknown) => true | ValidationError[]>

namespace Recursive {
  export const fromSchema: IndexedAlgebra<t.Functor.Index, t.Free, ValidationFn> = (x, ctx) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case t.isLeaf(x): return Nullary[typeName(x)](ctx)
      case x.tag === URI.eq: return eq(x.def, ctx)
      case x.tag === URI.optional: return optional(x.def, ctx)
      case x.tag === URI.array: return array(x.def, ctx)
      case x.tag === URI.record: return record(x.def, ctx)
      case x.tag === URI.tuple: return tuple(x.def, ctx)
      case x.tag === URI.union: return union(x.def, ctx)
      case x.tag === URI.intersect: return intersect(x.def, ctx)
      case x.tag === URI.object: return object(x.def, ctx)
    }
  }
}

const fromSchema_ = t.foldWithIndex(Recursive.fromSchema)

export const fromSchema
  : <T extends t.Schema>(schema: T) => (u: unknown) => true | {}
  = fromSchema_ as never
