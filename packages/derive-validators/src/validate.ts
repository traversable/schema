import type {
  Primitive,
  Unknown
} from '@traversable/registry'
import {
  Array_isArray,
  Equal,
  Object_hasOwn,
  Object_keys,
  Object_values,
  typeName,
  URI,
} from '@traversable/registry'
import { t, getConfig } from '@traversable/schema-core'

import type { ValidationError } from './errors.js'
import { NULLARY, UNARY, ERROR } from './errors.js'
import type { Validator } from './shared.js'

export {
  validateNever as never,
  validateUnknown as unknown,
  validateAny as any,
  validateVoid as void,
  validateNull as null,
  validateUndefined as undefined,
  validateSymbol as symbol,
  validateBoolean as boolean,
  validateBigInt as bigint,
  validateInteger as integer,
  validateNumber as number,
  validateString as string,
  validateEnum as enum,
  validateEq as eq,
  validateOptional as optional,
  validateArray as array,
  validateRecord as record,
  validateUnion as union,
  validateIntersect as intersect,
  validateTuple as tuple,
  validateObject as object,
}

/** @internal */
let isObject = (u: unknown): u is { [x: string]: unknown } =>
  !!u && typeof u === 'object' && !Array_isArray(u)

/** @internal */
let isKeyOf = <T extends {}>(k: keyof any, u: T): k is keyof T =>
  !!u && (typeof u === 'function' || typeof u === 'object') && k in u

function validateAny(this: t.any, _u: unknown, _path?: (keyof any)[]) { return true }
function validateUnknown(this: t.unknown, _u: unknown, _path?: (keyof any)[]) { return true }
function validateNever(this: t.never, u: unknown, path = Array.of<keyof any>()) { return [NULLARY.never(u, path)] }
function validateVoid(this: t.void, u: unknown, path = Array.of<keyof any>()) { return this(u) || [NULLARY.void(u, path)] }
function validateNull(this: t.null, u: unknown, path = Array.of<keyof any>()) { return this(u) || [NULLARY.null(u, path)] }
function validateUndefined(this: t.undefined, u: unknown, path = Array.of<keyof any>()) { return this(u) || [NULLARY.undefined(u, path)] }
function validateSymbol(this: t.symbol, u: unknown, path = Array.of<keyof any>()) { return this(u) || [NULLARY.symbol(u, path)] }
function validateBoolean(this: t.boolean, u: unknown, path = Array.of<keyof any>()) { return this(u) || [NULLARY.boolean(u, path)] }
function validateBigInt(this: t.bigint, u: unknown, path = Array.of<keyof any>()) { return this(u) || [NULLARY.bigint(u, path)] }
function validateInteger(this: t.integer, u: unknown, path = Array.of<keyof any>()) { return this(u) || [NULLARY.integer(u, path)] }
function validateNumber(this: t.number, u: unknown, path = Array.of<keyof any>()) { return this(u) || [NULLARY.number(u, path)] }
function validateString(this: t.string, u: unknown, path = Array.of<keyof any>()) { return this(u) || [NULLARY.string(u, path)] }

validateAny.tag = URI.any
validateUnknown.tag = URI.unknown
validateNever.tag = URI.never
validateVoid.tag = URI.void
validateNull.tag = URI.null
validateUndefined.tag = URI.undefined
validateSymbol.tag = URI.symbol
validateBoolean.tag = URI.boolean
validateBigInt.tag = URI.bigint
validateInteger.tag = URI.integer
validateNumber.tag = URI.number
validateString.tag = URI.string
validateEnum.tag = URI.enum
validateEq.tag = URI.eq
validateArray.tag = URI.array
validateRecord.tag = URI.record
validateUnion.tag = URI.union
validateIntersect.tag = URI.intersect
validateTuple.tag = URI.tuple
validateObject.tag = URI.object
validateOptional.tag = URI.optional
validateOptional.optional = 1

function validateEnum(
  this: t.enum<readonly Primitive[] | Record<string, Primitive>>,
  u: unknown,
  path: (keyof any)[] = [],
): true | ValidationError[] {
  let values = Object_values(this.def)
  return values.includes(u as never) || [ERROR.enum(u, path, values.join(', '))]
}

function validateOptional<T>(
  this: t.optional<Validator<T>>,
  u: T | Unknown,
  path = Array.of<keyof any>(),
): true | ValidationError[] {
  if (u === void 0) return true
  return this.def.validate(u, path)
}

function validateEq<V>(
  this: t.eq<V>,
  u: V | Unknown,
  path = Array.of<keyof any>(),
): true | ValidationError[] {
  let options = getConfig().schema
  let equals = options?.eq?.equalsFn || Equal.lax
  if (equals(this.def, u)) return true
  else return [ERROR.eq(u, path, this.def)]
}

function validateArray<T>(
  this: t.array<Validator<T>>,
  u: T | Unknown,
  path = Array.of<keyof any>(),
): true | ValidationError[] {
  if (!Array_isArray(u)) return [NULLARY.array(u, path)]
  let errors = Array.of<ValidationError>()
  if (t.integer(this.minLength) && u.length < this.minLength) errors.push(ERROR.arrayMinLength(u, path, this.minLength))
  if (t.integer(this.maxLength) && u.length > this.maxLength) errors.push(ERROR.arrayMaxLength(u, path, this.maxLength))
  for (let i = 0, len = u.length; i < len; i++) {
    let y = u[i]
    let results = this.def.validate(y, [...path, i])
    if (results === true) continue
    else errors.push(...results)
  }
  return errors.length === 0 || errors
}

function validateRecord<T>(
  this: t.record<Validator<T>>,
  u: T | Unknown,
  path = Array.of<keyof any>(),
): true | ValidationError[] {
  if (!isObject(u)) return [NULLARY.record(u, path)]
  let errors = Array.of<ValidationError>()
  let keys = Object_keys(u)
  for (let k of keys) {
    let y = u[k]
    let results = this.def.validate(y, [...path, k])
    if (results === true) continue
    else errors.push(...results)
  }
  return errors.length === 0 || errors
}

function validateUnion<T extends readonly unknown[]>(
  this: t.union<{ [I in keyof T]: Validator<T[I]> }>,
  u: T[number] | Unknown,
  path = Array.of<keyof any>(),
): true | ValidationError[] {
  // validateUnion.optional = 0
  // if (this.def.every((x) => t.optional.is(x.validate))) validateUnion.optional = 1;
  let errors = Array.of<ValidationError>()
  for (let i = 0; i < this.def.length; i++) {
    let results = this.def[i].validate(u, path)
    if (results === true) {
      // validateUnion.optional = 0
      return true
    }
    for (let j = 0; j < results.length; j++) errors.push(results[j])
  }
  // validateUnion.optional = 0
  return errors.length === 0 || errors
}

function validateIntersect(
  this: t.intersect<readonly Validator[]>,
  u: unknown,
  path = Array.of<keyof any>(),
): true | ValidationError[] {
  let errors = Array.of<ValidationError>()
  for (let i = 0; i < this.def.length; i++) {
    let results = this.def[i].validate(u, path)
    if (results !== true)
      for (let j = 0; j < results.length; j++) errors.push(results[j])
  }
  return errors.length === 0 || errors
}


function validateTuple(
  this: t.tuple<readonly Validator[]>,
  u: unknown,
  path = Array.of<keyof any>(),
): true | ValidationError[] {
  let errors = Array.of<ValidationError>()
  if (!Array_isArray(u)) return [ERROR.array(u, path)]
  for (let i = 0; i < this.def.length; i++) {
    if (!(i in u) && !(t.optional.is(this.def[i].validate))) {
      errors.push(ERROR.missingIndex(u, [...path, i]))
      continue
    }
    let results = this.def[i].validate(u[i], [...path, i])
    if (results !== true) {
      for (let j = 0; j < results.length; j++) errors.push(results[j])
      results.push(ERROR.arrayElement(u[i], [...path, i]))
    }
  }
  if (u.length > this.def.length) {
    for (let k = this.def.length; k < u.length; k++) {
      let excess = u[k]
      errors.push(ERROR.excessItems(excess, [...path, k]))
    }
  }
  return errors.length === 0 || errors
}

function validateObject(
  this: t.object<{ [x: string]: Validator }>,
  u: unknown,
  path = Array.of<keyof any>(),
): true | ValidationError[] {
  if (!isObject(u)) return [ERROR.object(u, path)]
  let errors = Array.of<ValidationError>()
  let { schema: { optionalTreatment } } = getConfig()
  let keys = Object_keys(this.def)
  if (optionalTreatment === 'exactOptional') {
    for (let i = 0, len = keys.length; i < len; i++) {
      let k = keys[i]
      let path_ = [...path, k]
      if (Object_hasOwn(u, k) && u[k] === undefined) {
        if (t.optional.is(this.def[k].validate)) {
          let tag = typeName(this.def[k].validate)
          if (isKeyOf(tag, NULLARY)) {
            let args = [u[k], path_, tag] as never as [unknown, (keyof any)[]]
            errors.push(NULLARY[tag](...args))
          }
          else if (isKeyOf(tag, UNARY)) {
            errors.push(UNARY[tag as keyof typeof UNARY].invalid(u[k], path_))
          }
        }
        let results = this.def[k].validate(u[k], path_)
        if (results === true) continue
        let tag = typeName(this.def[k].validate)
        if (isKeyOf(tag, NULLARY)) {
          errors.push(NULLARY[tag](u[k], path_, tag))
        }
        else if (isKeyOf(tag, UNARY)) {
          errors.push(UNARY[tag].invalid(u[k], path_))
        }
        errors.push(...results)
      }
      else if (Object_hasOwn(u, k)) {
        let results = this.def[k].validate(u[k], path_)
        if (results === true) continue
        errors.push(...results)
        continue
      } else {
        errors.push(UNARY.object.missing(u, path_))
        continue
      }
    }
  }
  else {
    for (let i = 0, len = keys.length; i < len; i++) {
      let k = keys[i]
      let path_ = [...path, k]
      if (!Object_hasOwn(u, k)) {
        if (!t.optional.is(this.def[k].validate)) {
          errors.push(UNARY.object.missing(u, path_))
          continue
        }
        else {
          if (!Object_hasOwn(u, k)) continue
          if (t.optional.is(this.def[k].validate) && Object_hasOwn(u, k)) {
            if (u[k] === undefined) continue
            let results = this.def[k].validate(u[k], path_)
            if (results === true) continue
            for (let j = 0; j < results.length; j++) {
              let result = results[j]
              errors.push(result)
              continue
            }
          }
        }
      }
      let results = this.def[k].validate(u[k], path_)
      if (results === true) continue
      for (let l = 0; l < results.length; l++) {
        let result = results[l]
        errors.push(result)
      }
    }
  }
  return errors.length === 0 || errors
}
