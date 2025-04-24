/**  
 * object_ schema
 * made with ᯓᡣ𐭩 by @traversable/schema@0.0.35
 */
import type * as T from '@traversable/registry'
import type {
  Force,
  Join,
  Returns,
  SchemaOptions as Options,
  UnionToTuple,
  Unknown
} from '@traversable/registry'
import {
  _isPredicate,
  applyOptions,
  Array_isArray,
  bindUserExtensions,
  fn,
  has,
  isAnyObject,
  object as object$,
  Object_assign,
  Object_hasOwn,
  Object_is,
  Object_keys,
  record as record$,
  symbol,
  typeName,
  URI
} from '@traversable/registry'
import type {
  Entry,
  Optional,
  Required,
  Schema,
  SchemaLike
} from '../_namespace.js'
import type { t } from '../_exports.js'
import { getConfig } from '../_exports.js'
import type { RequiredKeys } from '@traversable/schema-to-json-schema'
import { isRequired, property } from '@traversable/schema-to-json-schema'
import type { ValidationError, ValidationFn, Validator } from '@traversable/derive-validators'
import { Errors, NullaryErrors, UnaryErrors } from '@traversable/derive-validators'
////////////////////
///    equals    ///
export type equals<T> = never | T.Equal<T['_type' & keyof T]>
export function equals<S extends { [x: string]: { equals: T.Equal } }>(objectSchema: object_<S>): equals<object_<S>>
export function equals<S extends { [x: string]: t.Schema }>(objectSchema: object_<S>): equals<object_<S>>
export function equals<S extends { [x: string]: { equals: T.Equal } }>({ def }: object_<S>): equals<object_<S>> {
  function objectEquals(l: { [x: string]: unknown }, r: { [x: string]: unknown }) {
    if (Object_is(l, r)) return true
    if (!l || typeof l !== 'object' || Array_isArray(l)) return false
    if (!r || typeof r !== 'object' || Array_isArray(r)) return false
    for (const k in def) {
      const lHas = Object_hasOwn(l, k)
      const rHas = Object_hasOwn(r, k)
      if (lHas) {
        if (!rHas) return false
        if (!def[k].equals(l[k], r[k])) return false
      }
      if (rHas) {
        if (!lHas) return false
        if (!def[k].equals(l[k], r[k])) return false
      }
      if (!def[k].equals(l[k], r[k])) return false
    }
    return true
  }
  return objectEquals
}

// export type equals<T> = never | T.Equal<T['_type' & keyof T]>
// export function equals<S extends { [x: string]: { equals: T.Equal } }>(objectSchema: object_<S>): equals<object_<S>>
// export function equals<S extends { [x: string]: t.Schema }>(objectSchema: object_<S>): equals<object_<S>>
// export function equals({ def }: object_<{ [x: string]: { equals: T.Equal } }>): T.Equal<{ [x: string]: unknown }> {
//   function objectEquals(l: { [x: string]: unknown }, r: { [x: string]: unknown }) {
//     if (Object_is(l, r)) return true
//     if (!l || typeof l !== 'object' || Array_isArray(l)) return false
//     if (!r || typeof r !== 'object' || Array_isArray(r)) return false
//     for (const k in def) {
//       const lHas = Object_hasOwn(l, k)
//       const rHas = Object_hasOwn(r, k)
//       if (lHas) {
//         if (!rHas) return false
//         if (!def[k].equals(l[k], r[k])) return false
//       }
//       if (rHas) {
//         if (!lHas) return false
//         if (!def[k].equals(l[k], r[k])) return false
//       }
//       if (!def[k].equals(l[k], r[k])) return false
//     }
//     return true
//   }
//   return objectEquals
// }
///    equals    ///
////////////////////
//////////////////////////
///    toJsonSchema    ///
export interface toJsonSchema<S, T = S['def' & keyof S], KS extends RequiredKeys<T> = RequiredKeys<T>> {
  (): {
    type: 'object'
    required: { [I in keyof KS]: KS[I] & string }
    properties: { [K in keyof T]: Returns<T[K]['toJsonSchema' & keyof T[K]]> }
  }
}

export function toJsonSchema<S extends { [x: string]: t.Schema }>(objectSchema: object_<S>): toJsonSchema<S>
export function toJsonSchema<S extends { def: { [x: string]: unknown } }>(objectSchema: object_<S>): toJsonSchema<S>
export function toJsonSchema({ def }: { def: { [x: string]: unknown } }): () => { type: 'object', required: string[], properties: {} } {
  const required = Object_keys(def).filter(isRequired(def))
  function objectToJsonSchema() {
    return {
      type: 'object' as const,
      required,
      properties: fn.map(def, (v, k) => property(required)(v, k as number | string)),
    }
  }
  return objectToJsonSchema
}
///    toJsonSchema    ///
//////////////////////////
//////////////////////
///    toString    ///
/** @internal */
type Symbol_optional = typeof Symbol_optional
const Symbol_optional: typeof symbol.optional = symbol.optional

/** @internal */
const hasOptionalSymbol = <T>(u: unknown): u is { toString(): T } =>
  !!u && typeof u === 'function'
  && Symbol_optional in u
  && typeof u[Symbol_optional] === 'number'

/** @internal */
const hasToString = (x: unknown): x is { toString(): string } =>
  !!x && typeof x === 'function' && 'toString' in x && typeof x.toString === 'function'

export interface toString<S, T = S['def' & keyof S], _ = UnionToTuple<keyof T>> {
  (): never
    | [keyof T] extends [never] ? '{}'
    /* @ts-expect-error */
    : `{ ${Join<{ [I in keyof _]: `'${_[I]}${T[_[I]] extends { [Symbol_optional]: any } ? `'?` : `'`}: ${ReturnType<T[_[I]]['toString']>}` }, ', '>} }`
}


export function toString<S extends { [x: string]: t.Schema }, T = S['def'], _ = UnionToTuple<keyof S>>(objectSchema: object_<S>): toString<S, T, _>
export function toString<S extends { [x: string]: t.Schema }>({ def }: object_<S>) {
  function objectToString() {
    if (!!def && typeof def === 'object') {
      const entries = Object.entries(def)
      if (entries.length === 0) return <never>'{}'
      else return <never>`{ ${entries.map(([k, x]) => `'${k}${hasOptionalSymbol(x) ? "'?" : "'"
        }: ${hasToString(x) ? x.toString() : 'unknown'
        }`).join(', ')
        } }`
    }
    else return <never>'{ [x: string]: unknown }'
  }

  return objectToString
}
///    toString    ///
//////////////////////
//////////////////////
///    validate    ///
/** @internal */
let isObject = (u: unknown): u is { [x: string]: unknown } =>
  !!u && typeof u === 'object' && !Array_isArray(u)

/** @internal */
let isKeyOf = <T extends {}>(k: keyof any, u: T): k is keyof T =>
  !!u && (typeof u === 'function' || typeof u === 'object') && k in u

/** @internal */
let isOptional = has('tag', (tag) => tag === URI.optional)


export type validate<S> = never | ValidationFn<S['_type' & keyof S]>

export function validate<S extends { [x: string]: Validator }>(objectSchema: object_<S>): validate<S>
export function validate<S extends { [x: string]: t.Schema }>(objectSchema: object_<S>): validate<S>
export function validate<S extends { [x: string]: Validator }>(objectSchema: object_<S>): validate<{ [x: string]: unknown }> {
  validateObject.tag = URI.object
  function validateObject(u: unknown, path_ = Array.of<keyof any>()) {
    // if (objectSchema(u)) return true
    if (!isObject(u)) return [Errors.object(u, path_)]
    let errors = Array.of<ValidationError>()
    let { schema: { optionalTreatment } } = getConfig()
    let keys = Object_keys(objectSchema.def)
    if (optionalTreatment === 'exactOptional') {
      for (let i = 0, len = keys.length; i < len; i++) {
        let k = keys[i]
        let path = [...path_, k]
        if (Object_hasOwn(u, k) && u[k] === undefined) {
          if (isOptional(objectSchema.def[k].validate)) {
            let tag = typeName(objectSchema.def[k].validate)
            if (isKeyOf(tag, NullaryErrors)) {
              let args = [u[k], path, tag] as never as [unknown, (keyof any)[]]
              errors.push(NullaryErrors[tag](...args))
            }
            else if (isKeyOf(tag, UnaryErrors)) {
              errors.push(UnaryErrors[tag as keyof typeof UnaryErrors].invalid(u[k], path))
            }
          }
          let results = objectSchema.def[k].validate(u[k], path)
          if (results === true) continue
          let tag = typeName(objectSchema.def[k].validate)
          if (isKeyOf(tag, NullaryErrors)) {
            errors.push(NullaryErrors[tag](u[k], path, tag))
          }
          else if (isKeyOf(tag, UnaryErrors)) {
            errors.push(UnaryErrors[tag].invalid(u[k], path))
          }
          errors.push(...results)
        }
        else if (Object_hasOwn(u, k)) {
          let results = objectSchema.def[k].validate(u[k], path)
          if (results === true) continue
          errors.push(...results)
          continue
        } else {
          errors.push(UnaryErrors.object.missing(u, path))
          continue
        }
      }
    }
    else {
      for (let i = 0, len = keys.length; i < len; i++) {
        let k = keys[i]
        let path = [...path_, k]
        if (!Object_hasOwn(u, k)) {
          if (!isOptional(objectSchema.def[k].validate)) {
            errors.push(UnaryErrors.object.missing(u, path))
            continue
          }
          else {
            if (!Object_hasOwn(u, k)) continue
            if (isOptional(objectSchema.def[k].validate) && Object_hasOwn(u, k)) {
              if (u[k] === undefined) continue
              let results = objectSchema.def[k].validate(u[k], path)
              if (results === true) continue
              for (let j = 0; j < results.length; j++) {
                let result = results[j]
                errors.push(result)
                continue
              }
            }
          }
        }
        let results = objectSchema.def[k].validate(u[k], path)
        if (results === true) continue
        for (let l = 0; l < results.length; l++) {
          let result = results[l]
          errors.push(result)
        }
      }
    }
    return errors.length === 0 || errors
  }

  return validateObject
}
///    validate    ///
//////////////////////

export { object_ as object }

function object_<
  S extends { [x: string]: Schema },
  T extends { [K in keyof S]: Entry<S[K]> }
>(schemas: S, options?: Options): object_<T>
function object_<
  S extends { [x: string]: SchemaLike },
  T extends { [K in keyof S]: Entry<S[K]> }
>(schemas: S, options?: Options): object_<T>
function object_<S extends { [x: string]: Schema }>(schemas: S, options?: Options) {
  return object_.def(schemas, options)
}

interface object_<S = { [x: string]: Schema }> extends object_.core<S> {
  equals: equals<this>
  toJsonSchema: toJsonSchema<this>
  toString: toString<this>
  validate: validate<this>
}

namespace object_ {
  export let userDefinitions: Record<string, any> = {
    } as object_<unknown>
  export function def<T extends { [x: string]: unknown }>(xs: T, $?: Options, opt?: string[]): object_<T>
  export function def<T extends { [x: number]: unknown }>(xs: T, $?: Options, opt?: string[]): object_<T>
  export function def(xs: { [x: string]: unknown }, $?: Options, opt_?: string[]): {} {
    let userExtensions: Record<string, any> = {
      toString,
      equals,
      toJsonSchema,
      validate,
    }
    const keys = Object_keys(xs)
    const opt = Array_isArray(opt_) ? opt_ : keys.filter((k) => has(symbol.optional)(xs[k]))
    const req = keys.filter((k) => !has(symbol.optional)(xs[k]))
    const predicate = !record$(_isPredicate)(xs) ? isAnyObject : object$(xs, applyOptions($))
    function ObjectSchema(src: unknown) { return predicate(src) }
    ObjectSchema.tag = URI.object
    ObjectSchema.def = xs
    ObjectSchema.opt = opt
    ObjectSchema.req = req
    Object_assign(ObjectSchema, userDefinitions)
    return Object_assign(ObjectSchema, bindUserExtensions(ObjectSchema, userExtensions))
  }
}

declare namespace object_ {
  interface core<S> {
    (u: this['_type'] | Unknown): u is this['_type']
    _type: object_.type<S>
    tag: URI.object
    get def(): S
    opt: Optional<S> // TODO: use object_.Opt?
    req: Required<S> // TODO: use object_.Req?
  }
  type Opt<S, K extends keyof S> = symbol.optional extends keyof S[K] ? never : K
  type Req<S, K extends keyof S> = symbol.optional extends keyof S[K] ? K : never
  type type<S> = Force<
    & { [K in keyof S as Opt<S, K>]-?: S[K]['_type' & keyof S[K]] }
    & { [K in keyof S as Req<S, K>]+?: S[K]['_type' & keyof S[K]] }
  >
}
