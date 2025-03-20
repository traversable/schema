import type { IndexedAlgebra } from '@traversable/registry'
import { fn, symbol, typeName, URI } from '@traversable/registry'
import { t, getConfig } from '@traversable/schema'

import type { ValidationError } from './errors.js'
import { ERROR, UNARY } from './errors.js'
import type { Options } from './shared.js'
import { isOptional } from './shared.js'

export type ValidationFn = never | {
  (u: unknown, path?: t.Functor.Index): true | ValidationError[];
  tag: t.Tag
  def?: unknown
  ctx: (keyof any)[]
}

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

const validateUnknown = <ValidationFn>((_, __ = []) => true)
const validateAny = <ValidationFn>((_, __ = []) => true)
const validateNever = <ValidationFn>((u, ctx = []) => [ERROR.never(ctx, u)])
const validateVoid = <ValidationFn>((u, ctx = []) => u === void 0 || [ERROR.void(ctx, u)])
const validateNull = <ValidationFn>((u, ctx = []) => u === void 0 || [ERROR.null(ctx, u)])
const validateUndefined = <ValidationFn>((u, ctx = []) => u === void 0 || [ERROR.undefined(ctx, u)])
const validateSymbol = <ValidationFn>((u, ctx = []) => typeof u === 'symbol' || [ERROR.symbol(ctx, u)])
const validateBoolean = <ValidationFn>((u, ctx = []) => typeof u === 'boolean' || [ERROR.boolean(ctx, u)])
const validateInteger = <ValidationFn>((u, ctx = []) => globalThis.Number.isInteger(u) || [ERROR.integer(ctx, u)])
const validateBigInt = <ValidationFn>((u, ctx = []) => typeof u === 'bigint' || [ERROR.bigint(ctx, u)])
const validateNumber = <ValidationFn>((u, ctx = []) => typeof u === 'number' || [ERROR.number(ctx, u)])
const validateString = <ValidationFn>((u, ctx = []) => typeof u === 'string' || [ERROR.string(ctx, u)])

const Nullary = {
  [URI.unknown]: validateUnknown,
  [URI.any]: validateAny,
  [URI.never]: validateNever,
  [URI.void]: validateVoid,
  [URI.null]: validateNull,
  [URI.undefined]: validateUndefined,
  [URI.symbol]: validateSymbol,
  [URI.boolean]: validateBoolean,
  [URI.integer]: validateInteger,
  [URI.bigint]: validateBigInt,
  [URI.number]: validateNumber,
  [URI.string]: validateString,
}


const exactOptional = (
  u: { [x: string]: unknown },
  x: { [x: string]: ValidationFn },
  ctx: t.Functor.Index,
  errors: ValidationError[]
) => {
  const keys = Object_keys(x)
  const len = keys.length;
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
  ctx: t.Functor.Index,
  errors: ValidationError[]
) => {
  const keys = Object_keys(x)
  const len = keys.length;
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
  ctx: t.Functor.Index,
  errors: ValidationError[]
) => {
  const keys = Object_keys(x)
  const len = keys.length;
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

const mapArray
  : (validationFn: ValidationFn, ctx: t.Functor.Index) => ValidationFn
  = (validationFn, ctx) => {
    function validateArray(u: unknown): true | ValidationError[] {
      if (!Array_isArray(u)) return [ERROR.array(ctx, u)]
      let errors = Array.of<ValidationError>()
      const len = u.length
      for (let i = 0; i < len; i++) {
        const v = u[i]
        const results = validationFn(v)
        if (results !== true) {
          for (let j = 0; j < results.length; j++) {
            let result = results[j]
            result.path.push(i)
            errors.push(results[j])
          }
          // errors.push(ERROR.arrayElement([...ctx, ix], u[ix]))
        }
      }
      if (errors.length > 0) return errors
      return true
    }
    validateArray.tag = URI.array
    validateArray.ctx = Array.of<keyof any>()
    return validateArray
  }

const mapRecord
  : (validationFn: ValidationFn, ctx: t.Functor.Index) => ValidationFn
  = (validationFn, ctx) => {
    function validateRecord(u: unknown): true | ValidationError[] {
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
    validateRecord.tag = URI.array
    validateRecord.ctx = Array.of<keyof any>()
    return validateRecord
  }

const mapObject
  : (validationFns: { [x: string]: ValidationFn }, ix: t.Functor.Index) => ValidationFn
  = (validationFns, ctx) => {
    function validateObject(u: unknown): true | ValidationError[] {
      if (!isObject(u)) return [ERROR.object(ctx, u)]
      let errors = Array.of<ValidationError>()
      const { schema: { optionalTreatment } } = getConfig()

      if (optionalTreatment === 'exactOptional')
        return exactOptional(u, validationFns, ctx, errors)
      if (optionalTreatment === 'presentButUndefinedIsOK')
        return presentButUndefinedIsOK(u, validationFns, ctx, errors)
      if (optionalTreatment === 'treatUndefinedAndOptionalAsTheSame')
        return treatUndefinedAndOptionalAsTheSame(u, validationFns, ctx, errors)

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
    validateObject.tag = URI.object
    validateObject.ctx = Array.of<keyof any>()
    return validateObject
  }

const mapTuple
  : (validationFns: readonly ValidationFn[], ctx: t.Functor.Index) => ValidationFn
  = (validationFns, ctx) => {
    function validateTuple(u: unknown): true | ValidationError[] {
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
      if (u.length > validationFns.length) {
        const len = validationFns.length;
        for (let iz = len; iz < u.length; iz++) {
          const excess = u[iz]
          errors.push(ERROR.excessItems([...ctx, iz], excess))
        }
      }
      return errors.length > 0 ? errors : true
    }
    validateTuple.tag = URI.tuple
    validateTuple.ctx = Array.of<keyof any>()
    return validateTuple
  }

const mapUnion
  : (validationFns: readonly ValidationFn[], ctx: t.Functor.Index) => ValidationFn
  = (validationFns, _ctx) => {
    function validateUnion(u: unknown): true | ValidationError[] {
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
    if (validationFns.every(isOptional)) validateUnion[symbol.optional] = true
    validateUnion.tag = URI.union
    validateUnion.ctx = Array.of<keyof any>()
    return validateUnion
  }

const mapIntersect
  : (validationFns: readonly ValidationFn[], ctx: t.Functor.Index) => ValidationFn
  = (validationFns, _ctx) => {
    function validateIntersection(u: unknown): true | ValidationError[] {
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
    validateIntersection.tag = URI.intersect
    validateIntersection.ctx = Array.of<keyof any>()
    return validateIntersection
  }

const mapEq
  : (value: ValidationFn, ctx: t.Functor.Index) => ValidationFn
  = (value, ctx) => {
    function validateEq(u: unknown): true | ValidationError[] {
      const results = t.eq(value)(u)
      if (results === true) return true
      return [ERROR.eq(ctx, u, value)]
    }
    validateEq.tag = URI.eq
    validateEq.ctx = Array.of<keyof any>()
    return validateEq
  }

function mapOptional(validationFn: ValidationFn, ctx: t.Functor.Index): ValidationFn {
  function validateOptional(u: unknown) {
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
  export const fromSchema: IndexedAlgebra<t.Functor.Index, t.Free, ValidationFn> = (x, ctx) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case t.isLeaf(x): return Nullary[x.tag]
      case x.tag === URI.eq: return mapEq(x.def, ctx)
      case x.tag === URI.optional: return mapOptional(x.def, ctx)
      case x.tag === URI.array: return mapArray(x.def, ctx)
      case x.tag === URI.record: return mapRecord(x.def, ctx)
      case x.tag === URI.tuple: return mapTuple(x.def, ctx)
      case x.tag === URI.union: return mapUnion(x.def, ctx)
      case x.tag === URI.intersect: return mapIntersect(x.def, ctx)
      case x.tag === URI.object: return mapObject(x.def, ctx)
    }
  }
}

const fromSchema_
  : (x: unknown, ix?: t.Functor.Index) => (u: unknown) => true | ValidationError[]
  = t.foldWithIndex(Recursive.fromSchema) as never

export const fromSchema
  : <T extends t.Schema>(schema: T) => (u: unknown) => true | ValidationError[]
  = fromSchema_ as never
