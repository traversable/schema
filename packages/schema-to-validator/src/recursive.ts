import type { IndexedAlgebra } from '@traversable/registry'
import { Equal, fn, symbol, URI } from '@traversable/registry'
import { t, defaultIndex, getConfig } from '@traversable/schema'

import type { ValidationError } from './errors.js'
import { BOUNDS, ERROR, UNARY } from './errors.js'
import type { Options, ValidationFn } from './shared.js'
import { isOptional } from './shared.js'

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

const validateUnknown = <ValidationFn>((_, __ = Array.of<keyof any>()) => true)
const validateAny = <ValidationFn>((_, __ = Array.of<keyof any>()) => true)
const validateNever = <ValidationFn>((u, ctx = Array.of<keyof any>()) => [ERROR.never(u, ctx)])
const validateVoid = <ValidationFn>((u, ctx = Array.of<keyof any>()) => u === void 0 || [ERROR.void(u, ctx)])
const validateNull = <ValidationFn>((u, ctx = Array.of<keyof any>()) => u === null || [ERROR.null(u, ctx)])
const validateUndefined = <ValidationFn>((u, ctx = Array.of<keyof any>()) => u === void 0 || [ERROR.undefined(u, ctx)])
const validateSymbol = <ValidationFn>((u, ctx = Array.of<keyof any>()) => typeof u === 'symbol' || [ERROR.symbol(u, ctx)])
const validateBoolean = <ValidationFn>((u, ctx = Array.of<keyof any>()) => typeof u === 'boolean' || [ERROR.boolean(u, ctx)])

const Nullary = {
  [URI.unknown]: validateUnknown,
  [URI.any]: validateAny,
  [URI.never]: validateNever,
  [URI.void]: validateVoid,
  [URI.null]: validateNull,
  [URI.undefined]: validateUndefined,
  [URI.symbol]: validateSymbol,
  [URI.boolean]: validateBoolean,
}

const Boundable = {
  [URI.integer]: BOUNDS.integer,
  [URI.bigint]: BOUNDS.bigint,
  [URI.number]: BOUNDS.number,
  [URI.string]: BOUNDS.string,
}

const exactOptional = (
  u: { [x: string]: unknown },
  x: { [x: string]: ValidationFn },
  ctx: (keyof any)[],
  errors: ValidationError[]
) => {
  const keys = Object_keys(x)
  const len = keys.length
  for (let ix = 0; ix < len; ix++) {
    const k = keys[ix]
    const validationFn = x[k]
    const path = [...ctx, k]
    if (symbol.optional in validationFn) {
      if (hasOwn(u, k) && u[k] === undefined) {
        let results = validationFn(u[k])
        if (results === true) {
          errors.push(UNARY.object.invalid(u[k], path))
          continue
        }
        errors.push(...results)
        continue
      }
      if (!hasOwn(u, k)) { continue }
    }
    if (!hasOwn(u, k)) {
      errors.push(UNARY.object.missing(u, [...ctx, k]))
      continue
    }
    let results = validationFn(u[k])
    if (results !== true) {
      for (let iz = 0; iz < results.length; iz++) {
        let result = results[iz]
        errors.push(result)
      }
    }
  }
  return errors.length > 0 ? errors : true
}

const presentButUndefinedIsOK = (
  u: { [x: string]: unknown },
  x: { [x: string]: ValidationFn },
  ctx: (keyof any)[],
  errors: ValidationError[]
) => {
  const keys = Object_keys(x)
  const len = keys.length
  for (let i = 0; i < len; i++) {
    const k = keys[i]
    const validationFn = x[k]
    if (symbol.optional in validationFn) {
      if (!hasOwn(u, k)) continue
      if (symbol.optional in validationFn && hasOwn(u, k)) {
        if (u[k] === undefined) continue
        let results = validationFn(u[k])
        if (results === true) continue
        for (let j = 0; j < results.length; j++) {
          let result = results[j]
          errors.push(result)
          continue
        }
      }
    }
    if (!hasOwn(u, k)) {
      errors.push(UNARY.object.missing(u, [...ctx, k]))
      continue
    }
    let results = validationFn(u[k])
    if (results === true) continue
    for (let iz = 0; iz < results.length; iz++) {
      let result = results[iz]
      errors.push(result)
    }
  }
  return errors.length > 0 ? errors : true
}

const treatUndefinedAndOptionalAsTheSame = (
  u: { [x: string]: unknown },
  x: { [x: string]: ValidationFn },
  ctx: (keyof any)[],
  errors: ValidationError[]
) => {
  const keys = Object_keys(x)
  const len = keys.length
  for (let ix = 0; ix < len; ix++) {
    const k = keys[ix]
    const validationFn = x[k]
    if (!hasOwn(u, k) && !(symbol.optional in validationFn)) {
      errors.push(UNARY.object.missing(u, [...ctx, k]))
      continue
    }
    let results = validationFn(u[k])
    if (results === true) continue
    for (let iz = 0; iz < results.length; iz++) {
      let result = results[iz]
      errors.push(result)
    }
  }
  return errors.length > 0 ? errors : true
}

const array
  : (validationFn: ValidationFn, ctx: (keyof any)[]) => ValidationFn
  = (validationFn, ctx) => {
    function validateArray(u: unknown, path = Array.of<keyof any>()): true | ValidationError[] {
      if (!Array_isArray(u)) return [ERROR.array(u, [...ctx, ...path])]
      let errors = Array.of<ValidationError>()
      const len = u.length
      for (let i = 0; i < len; i++) {
        const v = u[i]
        const results = validationFn(v, [i, ...path])
        if (results !== true) errors.push(...results)
      }
      if (errors.length > 0) return errors
      return true
    }
    validateArray.tag = URI.array
    validateArray.ctx = Array.of<keyof any>()
    return validateArray
  }

const record
  : (validationFn: ValidationFn, ctx: (keyof any)[]) => ValidationFn
  = (validationFn, ctx) => {
    function validateRecord(u: unknown, path = Array.of<keyof any>()): true | ValidationError[] {
      // const path = [...ctx || [], ...path]
      if (!isObject(u)) return [ERROR.object(u, [...ctx, ...path])]
      let errors = Array.of<ValidationError>()
      const keys = Object_keys(u)
      const len = keys.length
      for (let ix = 0; ix < len; ix++) {
        const k = keys[ix]
        const v = u[k]
        const results = validationFn(v, [...path, k])
        if (results !== true) errors.push(
          ...results,
          ERROR.objectValue(u[k], [...path, k]),
        )
      }
      return errors.length > 0 ? errors : true
    }
    validateRecord.tag = URI.array
    validateRecord.ctx = Array.of<keyof any>()
    return validateRecord
  }

const object
  : (validationFns: { [x: string]: ValidationFn }, options: Options) => ValidationFn
  = (validationFns, options) => {
    function validateObject(u: unknown, ctx = Array.of<keyof any>()): true | ValidationError[] {
      const path = [...options.path, ...ctx]
      // const path = [...options?.path || [], ...ctx]
      if (!isObject(u)) return [ERROR.object(u, path)]
      let errors = Array.of<ValidationError>()
      const { schema: { optionalTreatment } } = getConfig()

      if (optionalTreatment === 'exactOptional')
        return exactOptional(u, validationFns, path, errors)
      if (optionalTreatment === 'presentButUndefinedIsOK')
        return presentButUndefinedIsOK(u, validationFns, path, errors)
      if (optionalTreatment === 'treatUndefinedAndOptionalAsTheSame')
        return treatUndefinedAndOptionalAsTheSame(u, validationFns, path, errors)

      const keys = Object_keys(validationFns)
      const len = keys.length
      for (let ix = 0; ix < len; ix++) {
        const k = keys[ix]
        const validationFn = validationFns[k]
        if (!hasOwn(u, k) && !(symbol.optional in validationFn)) {
          errors.push(ERROR.missingKey(u, [...path, k]))
          continue
        }
        const results = validationFn(u[k])
        if (results !== true) {
          for (let iy = 0; iy < results.length; iy++) errors.push(results[iy])
          results.push(ERROR.objectValue(u[k], [...path, k]))
        }
      }
      return errors.length > 0 ? errors : true
    }
    validateObject.tag = URI.object
    validateObject.ctx = Array.of<keyof any>()
    return validateObject
  }

const tuple
  : (validationFns: readonly ValidationFn[], options: Options) => ValidationFn
  = (validationFns, options) => {
    function validateTuple(u: unknown, ctx = Array.of<keyof any>()): true | ValidationError[] {
      const path = [...options?.path || [], ...ctx]
      let errors = Array.of<ValidationError>()
      if (!Array_isArray(u)) return [ERROR.array(u, path)]
      const len = validationFns.length
      for (let i = 0; i < len; i++) {
        const validationFn = validationFns[i]
        if (!(i in u) && !(symbol.optional in validationFn)) {
          errors.push(ERROR.missingIndex(u, [...path, i]))
          continue
        }
        const results = validationFn(u[i], [...path, i])
        if (results !== true) {
          for (let j = 0; j < results.length; j++) errors.push(results[j])
          results.push(ERROR.arrayElement(u[i], [...path, i]))
        }
      }
      if (u.length > validationFns.length) {
        const len = validationFns.length
        for (let j = len; j < u.length; j++) {
          const excess = u[j]
          errors.push(ERROR.excessItems(excess, [...path, j]))
        }
      }
      return errors.length > 0 ? errors : true
    }
    validateTuple.tag = URI.tuple
    validateTuple.ctx = Array.of<keyof any>()
    return validateTuple
  }

const union
  : (validationFns: readonly ValidationFn[], path: (keyof any)[]) => ValidationFn
  = (validationFns, path) => {
    function validateUnion(u: unknown, ctx = Array.of<keyof any>()): true | ValidationError[] {
      const len = validationFns.length
      let errors = Array.of<ValidationError>()
      for (let ix = 0; ix < len; ix++) {
        const validationFn = validationFns[ix]
        const results = validationFn(u, [...path, ...ctx])
        if (results === true) return true
        for (let iy = 0; iy < results.length; iy++) errors.push(results[iy])
      }
      return errors.length > 0 ? errors : true
    }
    if (validationFns.every(isOptional)) validateUnion[symbol.optional] = true
    validateUnion.tag = URI.union
    validateUnion.ctx = Array.of<keyof any>()
    return validateUnion
  }

const intersect
  : (validationFns: readonly ValidationFn[], path: (keyof any)[]) => ValidationFn
  = (validationFns, path) => {
    function validateIntersection(u: unknown, ctx = Array.of<keyof any>()): true | ValidationError[] {
      // const path = [...options?.path || [], ...ctx]
      const len = validationFns.length
      let errors = Array.of<ValidationError>()
      for (let ix = 0; ix < len; ix++) {
        const validationFn = validationFns[ix]
        const results = validationFn(u, [...path, ...ctx])
        if (results !== true)
          for (let iy = 0; iy < results.length; iy++) errors.push(results[iy])
      }
      return errors.length > 0 ? errors : true
    }
    validateIntersection.tag = URI.intersect
    validateIntersection.ctx = Array.of<keyof any>()
    return validateIntersection
  }

const eq
  : (value: ValidationFn, options?: Options) => ValidationFn
  = (value, options) => {
    function validateEq(u: unknown, ctx = Array.of<keyof any>()): true | ValidationError[] {
      const equals = options?.eq?.equalsFn || Equal.lax
      if (equals(value, u)) return true
      return [ERROR.eq(u, ctx, value)]
    }
    validateEq.tag = URI.eq
    validateEq.ctx = Array.of<keyof any>()
    return validateEq
  }

function optional(validationFn: ValidationFn, _path: (keyof any)[]): ValidationFn {
  function validateOptional(u: unknown, _ctx = Array.of<keyof any>()) {
    // const path = [..._path, ..._ctx]
    if (u === void 0) return true
    const results = validationFn(u)
    const { schema: { optionalTreatment } } = getConfig()
    if (results === true) return true
    if (optionalTreatment === 'exactOptional') {
      for (let i = 0; i < results.length; i++) {
        let result = results[i]
        // if (!result.msg?.endsWith(' or optional')) {
        //   result.msg += ' or optional'
        // }
      }
    }
    return results
  }
  validateOptional[symbol.optional] = true
  validateOptional.tag = URI.eq
  validateOptional.ctx = Array.of<keyof any>()
  return validateOptional
}

namespace Recursive {
  export const fromSchema
    : (options?: Options) => IndexedAlgebra<t.Functor.Index, t.Free, ValidationFn>
    = (options) => (x, ctx) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case x.tag === URI.integer: return <ValidationFn>((u, path) => Boundable[x.tag](x)(u, [...ctx.path, ...path || []]))
        case x.tag === URI.bigint: return <ValidationFn>((u, path) => Boundable[x.tag](x)(u, [...ctx.path, ...path || []]))
        case x.tag === URI.number: return <ValidationFn>((u, path) => Boundable[x.tag](x)(u, [...ctx.path, ...path || []]))
        case x.tag === URI.string: return <ValidationFn>((u, path) => Boundable[x.tag](x)(u, [...ctx.path, ...path || []]))
        case t.isNullary(x): return <ValidationFn>((u, path) => Nullary[x.tag](u, [...ctx.path, ...path || []]))
        case x.tag === URI.eq: return eq(x.def, { ...options, path: ctx.path })
        case x.tag === URI.optional: return optional(x.def, ctx.path)
        case x.tag === URI.array: return array(x.def, ctx.path)
        case x.tag === URI.record: return record(x.def, ctx.path)
        case x.tag === URI.tuple: return tuple(x.def, { ...options, path: ctx.path })
        case x.tag === URI.union: return union(x.def, ctx.path)
        case x.tag === URI.intersect: return intersect(x.def, ctx.path)
        case x.tag === URI.object: return object(x.def, { ...options, path: ctx.path })
      }
    }
}

export const fromSchemaWithOptions
  : (options: Options) => <S extends t.Schema>(x: S, ix?: t.Functor.Index) => (u: unknown) => true | ValidationError[]
  = (options) => (x, ix = defaultIndex) => t.foldWithIndex(Recursive.fromSchema(options))(x as never, ix)

export const fromSchema
  : <S extends t.Schema>(x: S, ix?: t.Functor.Index) => (u: unknown) => true | ValidationError[]
  = (x, ix = defaultIndex) => t.foldWithIndex(Recursive.fromSchema({ path: [] }))(x as never, ix)
