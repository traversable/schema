import { Equal, fn, symbol, typeName, URI } from '@traversable/registry'
import { t } from '@traversable/schema'

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
  // t_of,
  def,
} from '@traversable/schema'

/** @internal */
const Array_isArray = globalThis.Array.isArray

/** @internal */
const Object_assign = globalThis.Object.assign

/** @internal */
const Object_keys = globalThis.Object.keys

/** @internal */
const hasOwn = <K extends keyof any>(u: unknown, k: K): u is Record<K, unknown> =>
  !!u && typeof u === 'object' && globalThis.Object.prototype.hasOwnProperty.call(u, k)

/** @internal */
const isObject = (u: unknown): u is { [x: string]: unknown } =>
  !!u && typeof u === 'object' && !Array_isArray(u)

/** @internal */
const isKeyOf = <T extends {}>(k: keyof any, u: T): k is keyof T => !!u && (typeof u === 'function' || typeof u === 'object') && k in u

exactOptional.ctx = Array.of<keyof any>()
function exactOptional(
  u: { [x: string]: unknown },
  x: { [x: string]: Validator },
  errors: ValidationError[]
) {
  const { ctx } = exactOptional
  const keys = Object_keys(x)
  const len = keys.length;
  for (let i = 0; i < len; i++) {
    const k = keys[i]
    let validationFn = x[k].validate
    const path = [...ctx, k]
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
      const results = validationFn(u[k], path)
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
      const results = validationFn(u[k], path)
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
  const { ctx } = presentButUndefinedIsOK
  const keys = Object_keys(x)
  const len = keys.length;
  for (let i = 0; i < len; i++) {
    const k = keys[i]
    const validationFn = x[k].validate
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
  const validateNever = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => u === void 0 || NULLARY.void(u, ctx));
  validateNever.tag = URI.never
  validateNever.ctx = Array.of<keyof any>()
  void (t_never.validate = validateNever);

  const validateUnknown = <ValidationFn>
    ((_: unknown, __: t.Functor.Index = []) => true);
  validateUnknown.tag = URI.unknown
  validateUnknown.ctx = Array.of<keyof any>()
  void (t_unknown.validate = validateUnknown);

  const validateAny = <ValidationFn>
    ((_: unknown, __: t.Functor.Index = []) => true);
  validateAny.tag = URI.any
  validateAny.ctx = Array.of<keyof any>()
  void (t_any.validate = validateAny);

  const validateVoid = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => u === void 0 || [NULLARY.void(u, ctx)]);
  validateVoid.tag = URI.void
  validateVoid.ctx = Array.of<keyof any>()
  void (t_void.validate = validateVoid);

  const validateNull = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => u === null || [NULLARY.null(u, ctx)]);
  validateNull.tag = URI.null
  validateNull.ctx = Array.of<keyof any>()
  void (t_null.validate = validateNull);

  const validateUndefined = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => u === void 0 || [NULLARY.undefined(u, ctx)]);
  validateUndefined.tag = URI.undefined
  validateUndefined.ctx = Array.of<keyof any>()
  void (t_undefined.validate = validateUndefined);

  const validateBoolean = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => typeof u === 'boolean' || [NULLARY.boolean(u, ctx)]);
  validateBoolean.tag = URI.boolean
  validateBoolean.ctx = Array.of<keyof any>()
  void (t_boolean.validate = validateBoolean);

  const validateSymbol = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => typeof u === 'symbol' || [NULLARY.symbol(u, ctx)]);
  validateSymbol.tag = URI.symbol
  validateSymbol.ctx = Array.of<keyof any>()
  void (t_symbol.validate = validateSymbol);

  const validateInteger = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => globalThis.Number.isInteger(u) || [NULLARY.integer(u, ctx)]);
  validateInteger.tag = URI.integer
  validateInteger.ctx = Array.of<keyof any>()
  void (t_integer.validate = validateInteger);

  const validateBigInt: ValidationFn = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => typeof u === 'bigint' || [NULLARY.bigint(u, ctx)]);
  validateBigInt.tag = URI.bigint
  validateBigInt.ctx = Array.of<keyof any>()
  void (t_bigint.validate = validateBigInt);

  const validateNumber: ValidationFn = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => typeof u === 'number' || [NULLARY.number(u, ctx)]);
  validateNumber.tag = URI.number
  validateNumber.ctx = Array.of<keyof any>()
  void (t_number.validate = validateNumber);

  const validateString: ValidationFn = <ValidationFn>(
    function validateString(u: unknown, ctx: t.Functor.Index = []) {
      return typeof u === 'string' || [NULLARY.string(u, ctx)]
    }
  );
  validateString.tag = URI.string
  validateString.ctx = Array.of<keyof any>()
  void (t_string.validate = validateString);

  void (
    (t_eq.def as any) = function validateEq<V>(x: V, options?: Options) {
      validateEq.tag = URI.eq
      validateEq.def = x
      validateEq.ctx = options?.path || []
      function validateEq(u: unknown, ctx: t.Functor.Index = []): true | ValidationError[] {
        validateEq.ctx ??= []
        validateEq.ctx.push(...ctx)
        const equals = options?.eq?.equalsFn || Equal.lax
        if (equals(x, u)) return true
        else return [ERROR.eq([...ctx], u, x)]
      }
      return Object_assign(def.eq(x, options), { validate: validateEq })
    }
  );

  void (
    (t_optional.def as any) = function validateOptional(x: Validator, options?: Options) {
      validateOptional.tag = x.validate?.tag || (x as any).tag
      validateOptional.ctx = options?.path || []
      validateOptional[symbol.optional] = 1
      function validateOptional(u: unknown, ctx: t.Functor.Index = []): true | ValidationError[] {
        const path = [...validateOptional.ctx, ...ctx]
        validateOptional.ctx = []
        if (u === void 0) return true
        const results = x.validate(u, path)
        if (results === true) return true
        return results
      }
      return Object_assign(def.optional(x), { validate: validateOptional })
    }
  );

  void (
    (t_record.def as any) = function validateRecord(x: Validator, options?: Options) {
      validateRecord.tag = URI.array
      validateRecord.ctx = options?.path || []
      function validateRecord(u: unknown, ctx: t.Functor.Index = []): true | ValidationError[] {
        const path = [...validateRecord.ctx, ...ctx]
        validateRecord.ctx = []
        if (!isObject(u)) return [NULLARY.record(u, path)]
        let errors = Array.of<ValidationError>()
        const keys = Object_keys(u)
        const { validate } = x
        for (let k of keys) {
          const y = u[k]
          const results = validate(y, [...ctx, k])
          if (results === true) continue
          else errors.push(...results)
        }
        return errors.length === 0 || errors
      }
      return Object_assign(def.record(x), { validate: validateRecord });
    }
  )

  void (
    (t_array.def as any) = function validateArray(x: Validator, options?: Options) {
      validateArray.tag = URI.array
      validateArray.ctx = options?.path || []
      function validateArray(u: unknown, ctx: t.Functor.Index = []): true | ValidationError[] {
        const path = [...validateArray.ctx, ...ctx]
        validateArray.ctx = []
        if (!Array.isArray(u)) return [NULLARY.array(u, path)]
        let errors = Array.of<ValidationError>()
        const { validate } = x
        for (let i = 0, len = u.length; i < len; i++) {
          const y = u[i]
          const results = validate(y, [...ctx, i])
          if (results === true) continue
          else errors.push(...results)
        }
        return errors.length === 0 || errors
      }
      return Object_assign(def.array(x), { validate: validateArray })
    }
  );

  void (
    (t_union.def as any) = function validateUnion(xs: readonly Validator[], options?: Options) {
      validateUnion.tag = URI.union
      validateUnion.ctx = options?.path || []
      if (xs.every((v) => isOptional(v.validate))) validateUnion[symbol.optional] = 1
      function validateUnion(u: unknown, ctx: t.Functor.Index = []): true | ValidationError[] {
        const path = [...validateUnion.ctx, ...ctx]
        validateUnion.ctx = []
        const len = xs.length
        let errors = Array.of<ValidationError>()
        for (let i = 0; i < len; i++) {
          const validator = xs[i].validate
          const results = validator(u, path)
          if (results === true) return true
          for (let j = 0; j < results.length; j++) errors.push(results[j])
        }
        return errors.length > 0 ? errors : true
      }
      return Object_assign(def.union(xs), { validate: validateUnion })
    }
  );

  void ((t_intersect.def as any) = function validateIntersect(xs: readonly Validator[], options?: Options) {
    validateIntersect.tag = URI.intersect
    validateIntersect.ctx = options?.path || []
    function validateIntersect(u: unknown, ctx: t.Functor.Index = []): true | ValidationError[] {
      const path = [...validateIntersect.ctx, ...ctx]
      validateIntersect.ctx = []
      const len = xs.length
      let errors = Array.of<ValidationError>()
      for (let i = 0; i < len; i++) {
        const validationFn = xs[i].validate
        const results = validationFn(u, path)
        if (results !== true)
          for (let j = 0; j < results.length; j++) errors.push(results[j])
      }
      return errors.length > 0 ? errors : true
    }
    return Object_assign(def.intersect(xs), { validate: validateIntersect })
  });

  void ((t_tuple.def as any) = function validateTuple(xs: readonly Validator[], options?: Options) {
    validateTuple.tag = URI.tuple
    validateTuple.ctx = options?.path || []
    function validateTuple(u: unknown, ctx: t.Functor.Index = []): true | ValidationError[] {
      const path = [...validateTuple.ctx, ...ctx]
      validateTuple.ctx = []
      let errors = Array.of<ValidationError>()
      if (!Array_isArray(u)) return [ERROR.array(path, u)]
      const len = xs.length
      for (let i = 0; i < len; i++) {
        const validationFn = xs[i].validate
        if (!(i in u) && !(symbol.optional in validationFn)) {
          errors.push(ERROR.missingIndex([...path, i], u))
          continue
        }
        const results = validationFn(u[i], [...path, i])
        if (results !== true) {
          for (let j = 0; j < results.length; j++) errors.push(results[j])
          results.push(ERROR.arrayElement([...path, i], u[i]))
        }
      }
      if (u.length > xs.length) {
        const len = xs.length;
        for (let k = len; k < u.length; k++) {
          const excess = u[k]
          errors.push(ERROR.excessItems([...path, k], excess))
        }
      }
      return errors.length > 0 ? errors : true
    }
    return Object_assign(def.tuple(xs, options), { validate: validateTuple });
  });

  void ((t_object.def as any) = (xs: { [x: string]: Validator }, options?: Options) => {
    validateObject.tag = URI.object
    validateObject.ctx = options?.path || []
    function validateObject(u: unknown, ctx: t.Functor.Index = []): true | ValidationError[] {
      const path = [...validateObject.ctx, ...ctx]
      validateObject.ctx = []
      if (!isObject(u)) return [ERROR.object(path, u)]
      let errors = Array.of<ValidationError>()
      const { schema: { optionalTreatment } } = t.getConfig()
      let fn: (...args: Parameters<typeof exactOptional>) => ReturnType<typeof exactOptional>
      if (optionalTreatment === 'exactOptional') {
        exactOptional.ctx = path
        fn = exactOptional
      }
      else if (optionalTreatment === 'presentButUndefinedIsOK') {
        presentButUndefinedIsOK.ctx = path
        fn = presentButUndefinedIsOK
      }
      else if (optionalTreatment === 'treatUndefinedAndOptionalAsTheSame') {
        presentButUndefinedIsOK.ctx = path
        fn = presentButUndefinedIsOK
      }
      else { fn = (...args: any) => { throw Error('ILLEGAL') } }
      const result = fn(u, xs, errors)
      exactOptional.ctx = []
      presentButUndefinedIsOK.ctx = []
      return result
    }
    return Object_assign(def.object(xs, options), { validate: validateObject })
  })
}
