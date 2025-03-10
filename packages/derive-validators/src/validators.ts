import type { IndexedAlgebra } from '@traversable/registry'
import { fn, symbol, typeName, URI } from '@traversable/registry'
import { t, SchemaOptions as Options, getConfig } from '@traversable/schema-core'

import type { ValidationError } from './errors.js'
import { ERROR, UNARY } from './errors.js'

export type ValidationFn = never | { (u: unknown): true | ValidationError[] }
export interface Validator<Tag extends string> { validate: ValidationFn, tag: Tag }
export interface UnaryValidator<Tag extends string, Def> { validate: ValidationFn, tag: Tag, def: Def }
export interface Binary<Tag extends string, Def> { validate: ValidationFn, tag: Tag, def: Def, options: Options }

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
    // if ('tag' in y && y.tag === URI.undefined) {
    //   if (!hasOwn(u, k)) {
    //     // console.log('exactOptional: 1', k, ctx.path)
    //     errors.push(UNARY.object.missing(u, [...ctx, k]))
    //     continue
    //   }
    // }
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
    if (validationFns.every(optional.is)) validateUnion[symbol.optional] = true
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
  return validateOptional
}

const isOptional = <S extends t.Schema>(u: unknown): u is t.optional<S> =>
  !!u && typeof u === 'function' && symbol.optional in u && u[symbol.optional] === true

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

export { never_ as never }
interface never_ extends t.never { validate: ValidationFn }
const never_: never_ = Object.assign(t.never, { validate: Nullary.never([]) })

export { unknown_ as unknown }
interface unknown_ extends t.unknown { validate: ValidationFn }
const unknown_: unknown_ = Object.assign(t.unknown, { validate: Nullary.unknown([]) })

export { any_ as any }
interface any_ extends t.any { validate: ValidationFn }
const any_: any_ = Object.assign(t.any, { validate: Nullary.any([]) })

export { void_ as void }
interface void_ extends t.void { validate: ValidationFn }
const void_: void_ = Object.assign(t.void, { validate: Nullary.void([]) })

export { string_ as string }
interface string_ extends t.string { validate: ValidationFn }
const string_: string_ = Object.assign(t.string, { validate: Nullary.string([]) })

export { number_ as number }
interface number_ extends t.number { validate: ValidationFn }
const number_: number_ = Object.assign(t.number, { validate: Nullary.number([]) })

export { boolean_ as boolean }
interface boolean_ extends t.boolean { validate: ValidationFn }
const boolean_: boolean_ = Object.assign(t.boolean, { validate: Nullary.boolean([]) })

export { null_ as null }
interface null_ extends t.null { validate: ValidationFn }
const null_: null_ = Object.assign(t.null, { validate: Nullary.null([]) })

export { integer_ as integer }
interface integer_ extends t.integer { validate: ValidationFn }
const integer_: integer_ = Object.assign(t.integer, { validate: Nullary.integer([]) })


export { symbol_ as symbol }
interface symbol_ extends t.symbol { validate: ValidationFn }
const symbol_: symbol_ = Object.assign(t.symbol, { validate: Nullary.symbol([]) })

export { bigint_ as bigint }
interface bigint_ extends t.bigint { validate: ValidationFn }
const bigint_: bigint_ = Object.assign(t.bigint, { validate: Nullary.bigint([]) })

export { undefined_ as undefined }
interface undefined_ extends t.undefined { validate: ValidationFn }
const undefined_: undefined_ = Object.assign(t.undefined, { validate: Nullary.undefined([]) })

export interface eq<V> extends t.eq.def<V> { validate: ValidationFn }
export const eq
  : <V>(value: V, options?: Options) => eq<V>
  = (x, $) => {
    const schema = t.eq.def(x, $)
    const validate = fromSchema(schema)
    return Object.assign(schema, { validate })
  }

export interface optional<S> extends t.optional.def<S> { validate: ValidationFn }
export function optional<S>(x: S): optional<S> {
  const _ = t.optional.def(x)
  const validate = fromSchema(_)
  return Object.assign(_, { validate })
}

optional.is = isOptional

export interface array<S> extends t.array.def<S> { validate: ValidationFn }
export function array<S>(x: S): array<S> {
  const _ = t.array.def(x)
  const validate = fromSchema(_)
  return Object.assign(_, { validate })
}

export interface record<S> extends t.record.def<S> { validate: ValidationFn }
export function record<S>(x: S): record<S> {
  const schema = t.record.def(x)
  const validate = fromSchema(schema)
  return Object.assign(schema, { validate })
}

export interface union<S extends readonly unknown[]> extends t.union.def<S> { validate: ValidationFn }
export function union<S extends readonly unknown[]>(xs: S): union<S> {
  const schema = t.union.def(xs)
  const validate = fromSchema(schema)
  return Object.assign(schema, { validate })
}

export interface intersect<S extends readonly unknown[]> extends t.intersect.def<S> { validate: ValidationFn }
export function intersect<S extends readonly unknown[]>(xs: S): intersect<S> {
  const schema = t.intersect.def(xs)
  const validate = fromSchema(schema)
  return Object.assign(schema, { validate })
}


export interface tuple<S extends readonly unknown[]> extends t.tuple.def<S> { validate: ValidationFn }
export function tuple<S extends readonly unknown[]>(xs: S, options?: Options): tuple<S> {
  const schema = t.tuple.def<S>(xs, options)
  const validate = fromSchema(schema)
  return Object.assign(schema, { validate })
}

export { object_ as object }

interface object_<S extends { [x: string]: unknown }> extends t.object.def<S> { validate: ValidationFn }
function object_<S extends { [x: string]: unknown }>(xs: S, options?: Options): object_<S> {
  const schema = t.object.def(xs, options)
  const validate = fromSchema(schema)
  return Object.assign(schema, { validate })
}

namespace Recursive {
  export const fromSchema: IndexedAlgebra<t.Functor.Index, t.Free, ValidationFn> = (x, ctx) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case t.isLeaf(x): return Nullary[typeName(x)](ctx)
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
