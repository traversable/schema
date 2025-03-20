import { Equal, fn, symbol, typeName, URI } from '@traversable/registry'
import { t, getConfig } from '@traversable/schema'

import type { ValidationError } from './errors.js'
import { NULLARY, UNARY, ERROR } from './errors.js'
import type { Options, ValidationFn } from './shared.js'
import { isOptional } from './shared.js'

import {
  NeverSchema,
  UnknownSchema,
  VoidSchema,
  AnySchema,
  NullSchema,
  UndefinedSchema,
  SymbolSchema,
  BooleanSchema,
  IntegerSchema,
  BigIntSchema,
  NumberSchema,
  StringSchema,
  EqSchema,
  OptionalSchema,
  ArraySchema,
  RecordSchema,
  UnionSchema,
  IntersectSchema,
  TupleSchema,
  ObjectSchema,
  InlineSchema,
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

const Def = {
  never: NeverSchema,
  unknown: UnknownSchema,
  void: VoidSchema,
  any: AnySchema,
  null: NullSchema,
  undefined: UndefinedSchema,
  symbol: SymbolSchema,
  boolean: BooleanSchema,
  integer: IntegerSchema,
  bigint: BigIntSchema,
  number: NumberSchema,
  string: StringSchema,
  eq: EqSchema.def,
  optional: OptionalSchema.def,
  array: ArraySchema.def,
  record: RecordSchema.def,
  union: UnionSchema.def,
  intersect: IntersectSchema.def,
  object: ObjectSchema.def,
  tuple: TupleSchema.def,
  inline: InlineSchema.def,
};

exactOptional.ctx = Array.of<keyof any>()
function exactOptional(
  u: { [x: string]: unknown },
  x: { [x: string]: { validate: ValidationFn } },
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
  x: { [x: string]: { validate: ValidationFn } },
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
  void (NeverSchema.validate = validateNever);

  const validateUnknown = <ValidationFn>
    ((_: unknown, __: t.Functor.Index = []) => true);
  validateUnknown.tag = URI.unknown
  validateUnknown.ctx = Array.of<keyof any>()
  void (UnknownSchema.validate = validateUnknown);

  const validateAny = <ValidationFn>
    ((_: unknown, __: t.Functor.Index = []) => true);
  validateAny.tag = URI.any
  validateAny.ctx = Array.of<keyof any>()
  void (AnySchema.validate = validateAny);

  const validateVoid = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => u === void 0 || NULLARY.void(u, ctx));
  validateVoid.tag = URI.void
  validateVoid.ctx = Array.of<keyof any>()
  void (VoidSchema.validate = validateVoid);

  const validateNull = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => u === null || NULLARY.null(u, ctx));
  validateNull.tag = URI.null
  validateNull.ctx = Array.of<keyof any>()
  void (NullSchema.validate = validateNull);

  const validateUndefined = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => u === void 0 || NULLARY.undefined(u, ctx));
  validateUndefined.tag = URI.undefined
  validateUndefined.ctx = Array.of<keyof any>()
  void (UndefinedSchema.validate = validateUndefined);

  const validateBoolean = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => typeof u === 'boolean' || NULLARY.boolean(u, ctx));
  validateBoolean.tag = URI.boolean
  validateBoolean.ctx = Array.of<keyof any>()
  void (BooleanSchema.validate = validateBoolean);

  const validateSymbol = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => typeof u === 'symbol' || NULLARY.symbol(u, ctx));
  validateSymbol.tag = URI.symbol
  validateSymbol.ctx = Array.of<keyof any>()
  void (SymbolSchema.validate = validateSymbol);

  const validateInteger = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => globalThis.Number.isInteger(u) || NULLARY.integer(u, ctx));
  validateInteger.tag = URI.integer
  validateInteger.ctx = Array.of<keyof any>()
  void (IntegerSchema.validate = validateInteger);

  const validateBigInt: ValidationFn = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => typeof u === 'bigint' || [NULLARY.bigint(u, ctx)]);
  validateBigInt.tag = URI.bigint
  validateBigInt.ctx = Array.of<keyof any>()
  void (BigIntSchema.validate = validateBigInt);

  const validateNumber: ValidationFn = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => typeof u === 'number' || [NULLARY.number(u, ctx)]);
  validateNumber.tag = URI.number
  validateNumber.ctx = Array.of<keyof any>()
  void (NumberSchema.validate = validateNumber);

  const validateString: ValidationFn = <ValidationFn>
    ((u: unknown, ctx: t.Functor.Index = []) => typeof u === 'string' || [NULLARY.string(u, ctx)]);
  validateString.tag = URI.string
  validateString.ctx = Array.of<keyof any>()
  void (StringSchema.validate = validateString);

  void (
    (EqSchema.def as any) = <V>(x: V, options?: Options) => {
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
      return Object_assign(Def.eq(x, options), { validate: validateEq })
    }
  );

  void (
    (OptionalSchema.def as any) = (x: { validate: ValidationFn }, options?: Options) => {
      validateOptional.tag = x.validate?.tag || (x as any).tag
      validateOptional.def = x
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
      return Object_assign(Def.optional(x), { validate: validateOptional })
    }
  );

  void (
    (RecordSchema.def as any) = (x: { validate: ValidationFn }, options?: Options) => {
      validateRecord.tag = URI.array
      validateRecord.def = x
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
      return Object_assign(Def.record(x), { validate: validateRecord });
    }
  )

  void (
    (ArraySchema.def as any) = (x: { validate: ValidationFn }, options?: Options) => {
      validateArray.tag = URI.array
      validateArray.def = x
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
      return Object_assign(Def.array(x), { validate: validateArray })
    }
  );

  void (
    (UnionSchema.def as any) = (xs: readonly { validate: ValidationFn }[], options?: Options) => {
      validateUnion.tag = URI.union
      validateUnion.def = xs
      validateUnion.ctx = options?.path || []
      if (xs.every((v) => isOptional(v.validate))) validateUnion[symbol.optional] = 1
      function validateUnion(u: unknown, ctx: t.Functor.Index = []): true | ValidationError[] {
        const path = [...validateUnion.ctx, ...ctx]
        validateUnion.ctx = []
        const len = xs.length
        let errors = Array.of<ValidationError>()
        for (let i = 0; i < len; i++) {
          const validator = xs[i].validate
          const results = validator(u, ctx)
          if (results === true) return true
          for (let j = 0; j < results.length; j++) errors.push(results[j])
        }
        return errors.length > 0 ? errors : true
      }
      return Object_assign(Def.union(xs), { validate: validateUnion })
    }
  );

  void ((IntersectSchema.def as any) = (xs: readonly { validate: ValidationFn }[], options?: Options) => {
    validateIntersection.tag = URI.intersect
    validateIntersection.ctx = options?.path || []
    function validateIntersection(u: unknown, ctx: t.Functor.Index = []): true | ValidationError[] {
      const path = [...validateIntersection.ctx, ...ctx]
      validateIntersection.ctx = []
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
    return Object_assign(Def.intersect(xs), { validate: validateIntersection })
  });

  void ((TupleSchema.def as any) = (xs: readonly { validate: ValidationFn }[], options?: Options) => {
    validateTuple.tag = URI.tuple
    validateTuple.def = xs
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
    return Object_assign(Def.tuple(xs, options), { validate: validateTuple });
  });

  void ((ObjectSchema.def as any) = (xs: { [x: string]: { validate: ValidationFn } }, options?: Options) => {
    validateObject.tag = URI.object
    validateObject.def = xs
    validateObject.ctx = options?.path || []
    function validateObject(u: unknown, ctx: t.Functor.Index = []): true | ValidationError[] {
      const path = [...validateObject.ctx, ...ctx]
      validateObject.ctx = []
      if (!isObject(u)) return [ERROR.object(path, u)]
      let errors = Array.of<ValidationError>()
      const { schema: { optionalTreatment } } = getConfig()
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
    return Object_assign(Def.object(xs, options), { validate: validateObject })
  })
}
