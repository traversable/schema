import { fn, Equal, Primitive, symbol, typeName, URI } from '@traversable/registry'
import { t, getConfig } from '@traversable/schema'

import type { ValidationError } from './errors.js'
import { NULLARY, UNARY, ERROR } from './errors.js'
import type { Options, Validator, ValidationFn } from './shared.js'
import { isOptional } from './shared.js'

import {
  t_never,
  t_unknown,
  t_void,
  t_any,
  t_null,
  t_undefined,
  t_symbol,
  t_boolean,
  t_integer,
  t_bigint,
  t_number,
  t_string,
  t_eq,
  t_optional,
  t_array,
  t_record,
  t_union,
  t_intersect,
  t_tuple,
  t_object,
  t_enum,
  // InlineSchema,
} from '@traversable/schema'

let def = {
  never: t.never.def,
  any: t.any.def,
  unknown: t.unknown.def,
  void: t.void.def,
  null: t.null.def,
  undefined: t.undefined.def,
  symbol: t.symbol.def,
  boolean: t.boolean.def,
  integer: t.integer.def,
  bigint: t.bigint.def,
  number: t.number.def,
  string: t.string.def,
  eq: t.eq.def,
  optional: t.optional.def,
  array: t.array.def,
  record: t.record.def,
  union: t.union.def,
  intersect: t.intersect.def,
  tuple: t.tuple.def,
  object: t.object.def,
  of: t.of.def,
  enum: t.enum.def,
}

/** @internal */
let Array_isArray = globalThis.Array.isArray

/** @internal */
let Object_assign = globalThis.Object.assign

/** @internal */
let Object_keys = globalThis.Object.keys

/** @internal */
let hasOwn = <K extends keyof any>(u: unknown, k: K): u is Record<K, unknown> =>
  !!u && typeof u === 'object' && globalThis.Object.prototype.hasOwnProperty.call(u, k)

/** @internal */
let isObject = (u: unknown): u is { [x: string]: unknown } =>
  !!u && typeof u === 'object' && !Array_isArray(u)

/** @internal */
let isKeyOf = <T extends {}>(k: keyof any, u: T): k is keyof T => !!u && (typeof u === 'function' || typeof u === 'object') && k in u

/** @internal */
let isSafeInteger
  : (u: unknown) => u is number
  = globalThis.Number.isSafeInteger as never

exactOptional.ctx = Array.of<keyof any>()
function exactOptional(
  u: { [x: string]: unknown },
  x: { [x: string]: Validator },
  errors: ValidationError[]
) {
  let { ctx } = exactOptional
  let keys = Object_keys(x)
  let len = keys.length
  for (let i = 0; i < len; i++) {
    let k = keys[i]
    let validationFn = x[k].validate
    let path = [...ctx, k]
    if (hasOwn(u, k) && u[k] === undefined) {
      if (symbol.optional in validationFn) {
        let tag = typeName(validationFn)
        if (isKeyOf(tag, NULLARY)) {
          errors.push(NULLARY[tag](u[k], path, tag))
        }
        else if (isKeyOf(tag, UNARY)) {
          errors.push(UNARY[tag].invalid(u[k], path))
        }
      }
      let results = validationFn(u[k], path)
      if (results === true) continue
      let tag = typeName(validationFn)
      if (isKeyOf(tag, NULLARY)) {
        errors.push(NULLARY[tag](u[k], path, tag))
      }
      else if (isKeyOf(tag, UNARY)) {
        errors.push(UNARY[tag].invalid(u[k], path))
      }
      errors.push(...results)
    }
    else if (hasOwn(u, k)) {
      let results = validationFn(u[k], path)
      if (results === true) continue
      errors.push(...results)
      continue
    } else {
      errors.push(UNARY.object.missing(u, path))
      continue
    }
  }
  return errors.length > 0 ? errors : true
}

presentButUndefinedIsOK.ctx = Array.of<keyof any>()
function presentButUndefinedIsOK(
  u: { [x: string]: unknown },
  x: { [x: string]: Validator },
  errors: ValidationError[]
) {
  let { ctx } = presentButUndefinedIsOK
  let keys = Object_keys(x)
  let len = keys.length
  for (let i = 0; i < len; i++) {
    let k = keys[i]
    let validationFn = x[k].validate
    if (!hasOwn(u, k)) {
      if (!(symbol.optional in validationFn)) {
        errors.push(UNARY.object.missing(u, [...ctx, k]))
        continue
      }
      else {
        if (!hasOwn(u, k)) continue
        if (symbol.optional in validationFn && hasOwn(u, k)) {
          if (u[k] === undefined) continue
          let results = validationFn(u[k], [...ctx, k])
          if (results === true) continue
          for (let j = 0; j < results.length; j++) {
            let result = results[j]
            errors.push(result)
            continue
          }
        }
      }
    }
    let results = validationFn(u[k], [...ctx, k])
    if (results === true) continue
    for (let l = 0; l < results.length; l++) {
      let result = results[l]
      errors.push(result)
    }
  }
  return errors.length > 0 ? errors : true
}

export function bindValidators() {
  let validateNever = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => u === void 0 || [NULLARY.never(u, ctx)])
  void (validateNever.tag = URI.never)
  void (validateNever.ctx = Array.of<keyof any>())
  void (t_never.validate = validateNever)

  let validateUnknown = <ValidationFn>
    ((_: unknown, __: t.Functor.Index = []) => true)
  void (validateUnknown.tag = URI.unknown)
  void (validateUnknown.ctx = Array.of<keyof any>())
  void (t_unknown.validate = validateUnknown)

  let validateAny = <ValidationFn>
    ((_: unknown, __: t.Functor.Index = []) => true)
  void (validateAny.tag = URI.any)
  void (validateAny.ctx = Array.of<keyof any>())
  void (t_any.validate = validateAny)

  let validateVoid = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => u === void 0 || [NULLARY.void(u, ctx)])
  void (validateVoid.tag = URI.void)
  void (validateVoid.ctx = Array.of<keyof any>())
  void (t_void.validate = validateVoid)

  let validateNull = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => u === null || [NULLARY.null(u, ctx)])
  void (validateNull.tag = URI.null)
  void (validateNull.ctx = Array.of<keyof any>())
  void (t_null.validate = validateNull)

  let validateUndefined = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => u === void 0 || [NULLARY.undefined(u, ctx)])
  void (validateUndefined.tag = URI.undefined)
  void (validateUndefined.ctx = Array.of<keyof any>())
  void (t_undefined.validate = validateUndefined)

  let validateBoolean = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => typeof u === 'boolean' || [NULLARY.boolean(u, ctx)])
  void (validateBoolean.tag = URI.boolean)
  void (validateBoolean.ctx = Array.of<keyof any>())
  void (t_boolean.validate = validateBoolean)

  let validateSymbol = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => typeof u === 'symbol' || [NULLARY.symbol(u, ctx)])
  void (validateSymbol.tag = URI.symbol)
  void (validateSymbol.ctx = Array.of<keyof any>())
  void (t_symbol.validate = validateSymbol)

  let validateInteger = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => isSafeInteger(u) || [NULLARY.integer(u, ctx)])
  void (validateInteger.tag = URI.integer)
  void (validateInteger.ctx = Array.of<keyof any>())
  void (t_integer.validate = validateInteger)

  let validateBigInt: ValidationFn = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => typeof u === 'bigint' || [NULLARY.bigint(u, ctx)])
  void (validateBigInt.tag = URI.bigint)
  void (validateBigInt.ctx = Array.of<keyof any>())
  void (t_bigint.validate = validateBigInt)

  let validateNumber: ValidationFn = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => typeof u === 'number' || [NULLARY.number(u, ctx)])
  void (validateNumber.tag = URI.number)
  void (validateNumber.ctx = Array.of<keyof any>())
  void (t_number.validate = validateNumber)

  let validateString: ValidationFn = <ValidationFn>(
    function validateString(u: unknown, ctx: t.Functor.Index = []) {
      return typeof u === 'string' || [NULLARY.string(u, ctx)]
    }
  )
  void (validateString.tag = URI.string)
  void (validateString.ctx = Array.of<keyof any>())
  void (t_string.validate = validateString)

  void (
    (t_eq.def as any) = function validateEq<V>(x: V, options?: Options) {
      void (validateEq.tag = URI.eq)
      void (validateEq.def = x)
      void (validateEq.ctx = options?.path || [])
      function validateEq(u: unknown, ctx: t.Functor.Index = []): true | ValidationError[] {
        validateEq.ctx ??= []
        validateEq.ctx.push(...ctx)
        let equals = options?.eq?.equalsFn || Equal.lax
        if (equals(x, u)) return true
        else return [ERROR.eq(u, [...ctx], x)]
      }
      return Object_assign(def.eq(x, options), { validate: validateEq })
    }
  )

  void (
    (t_optional.def as any) = function validateOptional(x: Validator, options?: Options) {
      void (validateOptional.tag = x.validate?.tag || (x as any).tag)
      void (validateOptional.ctx = options?.path || [])
      void (validateOptional[symbol.optional] = 1)
      function validateOptional(u: unknown, ctx: t.Functor.Index = []): true | ValidationError[] {
        let path = [...validateOptional.ctx, ...ctx]
        validateOptional.ctx = []
        if (u === void 0) return true
        return x.validate(u, path)
      }
      return Object_assign(def.optional(x), { validate: validateOptional })
    }
  )

  void (
    (t_record.def as any) = function validateRecord(x: Validator, options?: Options) {
      void (validateRecord.tag = URI.array)
      void (validateRecord.ctx = options?.path || [])
      function validateRecord(u: unknown, ctx: t.Functor.Index = []): true | ValidationError[] {
        let path = [...validateRecord.ctx, ...ctx]
        validateRecord.ctx = []
        if (!isObject(u)) return [NULLARY.record(u, path)]
        let errors = Array.of<ValidationError>()
        let keys = Object_keys(u)
        let { validate } = x
        for (let k of keys) {
          let y = u[k]
          let results = validate(y, [...ctx, k])
          if (results === true) continue
          else errors.push(...results)
        }
        return errors.length === 0 || errors
      }
      return Object_assign(def.record(x), { validate: validateRecord })
    }
  )

  void (
    (t_array.def as any) = function validateArray(x: Validator, options?: Options) {
      void (validateArray.tag = URI.array)
      void (validateArray.ctx = options?.path || [])
      function validateArray(u: unknown, ctx: t.Functor.Index = []): true | ValidationError[] {
        let path = [...validateArray.ctx, ...ctx]
        validateArray.ctx = []
        if (!Array.isArray(u)) return [NULLARY.array(u, path)]
        let errors = Array.of<ValidationError>()
        let { validate } = x
        for (let i = 0, len = u.length; i < len; i++) {
          let y = u[i]
          let results = validate(y, [...ctx, i])
          if (results === true) continue
          else errors.push(...results)
        }
        return errors.length === 0 || errors
      }
      return Object_assign(def.array(x), { validate: validateArray })
    }
  )

  void (
    (t_union.def as any) = function validateUnion(xs: readonly Validator[], options?: Options) {
      void (validateUnion.tag = URI.union)
      void (validateUnion.ctx = options?.path || [])
      if (xs.every((v) => isOptional(v.validate))) validateUnion[symbol.optional] = 1
      function validateUnion(u: unknown, ctx: t.Functor.Index = []): true | ValidationError[] {
        let path = [...validateUnion.ctx, ...ctx]
        validateUnion.ctx = []
        let len = xs.length
        let errors = Array.of<ValidationError>()
        for (let i = 0; i < len; i++) {
          let validator = xs[i].validate
          let results = validator(u, path)
          if (results === true) return true
          for (let j = 0; j < results.length; j++) errors.push(results[j])
        }
        return errors.length === 0 || errors
      }
      return Object_assign(def.union(xs), { validate: validateUnion })
    }
  )

  void ((t_intersect.def as any) = function validateIntersect(xs: readonly Validator[], options?: Options) {
    void (validateIntersect.tag = URI.intersect)
    void (validateIntersect.ctx = options?.path || [])
    function validateIntersect(u: unknown, ctx: t.Functor.Index = []): true | ValidationError[] {
      let path = [...validateIntersect.ctx, ...ctx]
      validateIntersect.ctx = []
      let len = xs.length
      let errors = Array.of<ValidationError>()
      for (let i = 0; i < len; i++) {
        let validationFn = xs[i].validate
        let results = validationFn(u, path)
        if (results !== true)
          for (let j = 0; j < results.length; j++) errors.push(results[j])
      }
      return errors.length === 0 || errors
    }
    return Object_assign(def.intersect(xs), { validate: validateIntersect })
  })

  void ((t_tuple.def as any) = function validateTuple(...args: Parameters<typeof t_tuple.def>) {
    // xs: readonly Validator[], options?: Options
    const xs = args[0] as Validator[]
    const options = args[1] as Options
    void (validateTuple.tag = URI.tuple)
    void (validateTuple.ctx = options?.path || [])
    function validateTuple(u: unknown, ctx: t.Functor.Index = []): true | ValidationError[] {
      let path = [...validateTuple.ctx, ...ctx]
      validateTuple.ctx = []
      let errors = Array.of<ValidationError>()
      if (!Array_isArray(u)) return [ERROR.array(u, path)]
      let len = xs.length
      for (let i = 0; i < len; i++) {
        let validationFn = xs[i].validate
        if (!(i in u) && !(symbol.optional in validationFn)) {
          errors.push(ERROR.missingIndex(u, [...path, i]))
          continue
        }
        let results = validationFn(u[i], [...path, i])
        if (results !== true) {
          for (let j = 0; j < results.length; j++) errors.push(results[j])
          results.push(ERROR.arrayElement(u[i], [...path, i]))
        }
      }
      if (u.length > xs.length) {
        let len = xs.length
        for (let k = len; k < u.length; k++) {
          let excess = u[k]
          errors.push(ERROR.excessItems(excess, [...path, k]))
        }
      }
      return errors.length === 0 || errors
    }
    return Object_assign(def.tuple(...args), { validate: validateTuple })
  })

  void ((t_object.def as any) = (...args: Parameters<typeof t_object.def>) => {
    let xs = args[0] as { [x: string]: Validator }
    let options = args[1] as Options
    void (validateObject.tag = URI.object)
    void (validateObject.ctx = options?.path || [])
    function validateObject(u: unknown, ctx: (keyof any)[] = []): true | ValidationError[] {
      let path = [...validateObject.ctx, ...ctx]
      validateObject.ctx = []
      if (!isObject(u)) return [ERROR.object(u, path)]
      let errors = Array.of<ValidationError>()
      let { schema: { optionalTreatment } } = getConfig()
      let predicate: (...args: Parameters<typeof exactOptional>) => ReturnType<typeof exactOptional>
      if (optionalTreatment === 'exactOptional') {
        exactOptional.ctx = path
        predicate = exactOptional
      }
      else if (optionalTreatment === 'presentButUndefinedIsOK') {
        presentButUndefinedIsOK.ctx = path
        predicate = presentButUndefinedIsOK
      }
      else if (optionalTreatment === 'treatUndefinedAndOptionalAsTheSame') {
        presentButUndefinedIsOK.ctx = path
        predicate = presentButUndefinedIsOK
      }
      else { predicate = fn.exhaustive as never }
      let result = predicate(u, xs, errors)
      exactOptional.ctx = []
      presentButUndefinedIsOK.ctx = []
      return result
    }
    return Object_assign(def.object(...args), { validate: validateObject })
  })

  void (
    (t_enum.def as any) = function validateEnum(xs: readonly Primitive[] | Record<string, Primitive>, options?: Options) {
      void (validateEnum.tag = URI.enum)
      void (validateEnum.ctx = options?.path || [])
      let values = Object.values(xs)
      function validateEnum(u: unknown, ctx: (keyof any)[]): true | ValidationError[] {
        let path = [...validateEnum.ctx, ...ctx]
        validateEnum.ctx = []
        return values.includes(u as never) || [ERROR.enum(u, path, values.join(', '))]
      }
      return Object_assign(def.enum([values]), { validate: validateEnum })
    }
  )
}
