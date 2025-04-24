/**  
 * tuple schema
 * made with ᯓᡣ𐭩 by @traversable/schema@0.0.35
 */
import type {
  Equal,
  Join,
  Returns,
  SchemaOptions as Options,
  TypeError,
  Unknown
} from '@traversable/registry'
import {
  _isPredicate,
  Array_isArray,
  bindUserExtensions,
  getConfig,
  has,
  Object_assign,
  Object_hasOwn,
  Object_is,
  parseArgs,
  symbol,
  tuple as tuple$,
  URI
} from '@traversable/registry'
import type {
  Entry,
  FirstOptionalItem,
  invalid,
  Schema,
  SchemaLike,
  TupleType,
  ValidateTuple
} from '../_namespace.js'
import type { optional } from './optional.js'
import type { t } from '../_exports.js'
import type { MinItems } from '@traversable/schema-to-json-schema'
import { applyTupleOptionality, minItems } from '@traversable/schema-to-json-schema'
import { hasToString } from '@traversable/schema-to-string'
import type { Validate, ValidationError, Validator } from '@traversable/derive-validators'
import { Errors } from '@traversable/derive-validators'
////////////////////
///    equals    ///
export type equals<S> = Equal<S['_type' & keyof S]>

export function equals<S extends readonly { equals: Equal }[]>(tupleSchema: tuple<readonly [...S]>): equals<typeof tupleSchema>
export function equals<S extends readonly t.Schema[]>(tupleSchema: tuple<S>): equals<typeof tupleSchema>
export function equals(tupleSchema: tuple<readonly { equals: Equal }[]>) {
  function tupleEquals(l: typeof tupleSchema['_type'], r: typeof tupleSchema['_type']): boolean {
    if (Object_is(l, r)) return true
    if (Array_isArray(l)) {
      if (!Array_isArray(r)) return false
      for (let ix = tupleSchema.def.length; ix-- !== 0;) {
        if (!Object_hasOwn(l, ix) && !Object_hasOwn(r, ix)) continue
        if (Object_hasOwn(l, ix) && !Object_hasOwn(r, ix)) return false
        if (!Object_hasOwn(l, ix) && Object_hasOwn(r, ix)) return false
        if (Object_hasOwn(l, ix) && Object_hasOwn(r, ix)) {
          if (!tupleSchema.def[ix].equals(l[ix], r[ix])) return false
        }
      }
      return true
    }
    return false
  }
  return tupleEquals
}
///    equals    ///
////////////////////
//////////////////////////
///    toJsonSchema    ///
export interface toJsonSchema<S, T = S['def' & keyof S]> {
  (): {
    type: 'array',
    items: { [I in keyof T]: Returns<T[I]['toJsonSchema' & keyof T[I]]> }
    additionalItems: false
    minItems: MinItems<T>
    maxItems: T['length' & keyof T]
  }
}

export function toJsonSchema<S extends readonly unknown[]>(tupleSchema: tuple<S>): toJsonSchema<typeof tupleSchema>
export function toJsonSchema<S extends readonly unknown[]>({ def }: tuple<S>): () => {
  type: 'array'
  items: unknown
  additionalItems: false
  minItems?: {}
  maxItems?: number
} {
  function tupleToJsonSchema() {
    let min = minItems(def)
    let max = def.length
    let items = applyTupleOptionality(def, { min, max })
    return {
      type: 'array' as const,
      additionalItems: false as const,
      items,
      minItems: min,
      maxItems: max,
    }
  }
  return tupleToJsonSchema
}
///    toJsonSchema    ///
//////////////////////////
//////////////////////
///    toString    ///
export interface toString<S, T = S['def' & keyof S]> {
  (): never | `[${Join<{
    [I in keyof T]: `${
    /* @ts-expect-error */
    T[I] extends { [Symbol_optional]: any } ? `_?: ${ReturnType<T[I]['toString']>}` : ReturnType<T[I]['toString']>
    }`
  }, ', '>}]`
}

export function toString<S>(tupleSchema: tuple<S>): toString<S>
export function toString<S>(tupleSchema: tuple<S>): () => string {
  let isOptional = has('tag', (tag) => tag === URI.optional)
  function stringToString() {
    return Array_isArray(tupleSchema.def)
      ? `[${tupleSchema.def.map(
        (x) => isOptional(x)
          ? `_?: ${hasToString(x) ? x.toString() : 'unknown'}`
          : hasToString(x) ? x.toString() : 'unknown'
      ).join(', ')}]` : 'unknown[]'
  }
  return stringToString
}
///    toString    ///
//////////////////////
//////////////////////
///    validate    ///
export type validate<T> = Validate<T['_type' & keyof T]>
export function validate<S extends readonly Validator[]>(tupleSchema: tuple<[...S]>): validate<typeof tupleSchema>
export function validate<S extends readonly t.Schema[]>(tupleSchema: tuple<[...S]>): validate<typeof tupleSchema>
export function validate<S extends readonly Validator[]>(tupleSchema: tuple<[...S]>): Validate<typeof tupleSchema> {
  validateTuple.tag = URI.tuple
  let isOptional = has('tag', (tag) => tag === URI.optional)
  function validateTuple(u: unknown, path = Array.of<keyof any>()) {
    let errors = Array.of<ValidationError>()
    if (!Array_isArray(u)) return [Errors.array(u, path)]
    for (let i = 0; i < tupleSchema.def.length; i++) {
      if (!(i in u) && !(isOptional(tupleSchema.def[i].validate))) {
        errors.push(Errors.missingIndex(u, [...path, i]))
        continue
      }
      let results = tupleSchema.def[i].validate(u[i], [...path, i])
      if (results !== true) {
        for (let j = 0; j < results.length; j++) errors.push(results[j])
        results.push(Errors.arrayElement(u[i], [...path, i]))
      }
    }
    if (u.length > tupleSchema.def.length) {
      for (let k = tupleSchema.def.length; k < u.length; k++) {
        let excess = u[k]
        errors.push(Errors.excessItems(excess, [...path, k]))
      }
    }
    return errors.length === 0 || errors
  }
  return validateTuple
}
///    validate    ///
//////////////////////

export { tuple }

function tuple<S extends readonly SchemaLike[], T extends { [I in keyof S]: Entry<S[I]> }>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, T>>
function tuple<S extends readonly Schema[]>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, S>>
function tuple<S extends readonly SchemaLike[], T extends { [I in keyof S]: Entry<S[I]> }>(...args: [...schemas: tuple.validate<S>, options: Options]): tuple<tuple.from<tuple.validate<S>, T>>
function tuple<S extends readonly Schema[]>(...args: [...schemas: tuple.validate<S>, options: Options]): tuple<tuple.from<tuple.validate<S>, S>>
function tuple<S extends readonly SchemaLike[], T extends { [I in keyof S]: Entry<S[I]> }>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, T>>
function tuple<S extends readonly Schema[]>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, S>>
function tuple(...args: [...SchemaLike[]] | [...SchemaLike[], Options]) {
  return tuple.def(...parseArgs(getConfig().schema, args))
}

interface tuple<S> extends tuple.core<S> {
  equals: equals<this>
  toJsonSchema: toJsonSchema<this>
  toString: toString<this>
  validate: validate<this>
}

namespace tuple {
  export let userDefinitions: Record<string, any> = {
    } as tuple<unknown>
  export function def<T extends readonly unknown[]>(xs: readonly [...T], $?: Options, opt_?: number): tuple<T>
  export function def(xs: readonly unknown[], $: Options = getConfig().schema, opt_?: number): {} {
    let userExtensions: Record<string, any> = {
      toString,
      equals,
      toJsonSchema,
      validate,
    }
    const opt = opt_ || xs.findIndex(has(symbol.optional))
    const options = {
      ...$, minLength: $.optionalTreatment === 'treatUndefinedAndOptionalAsTheSame' ? -1 : xs.findIndex(has(symbol.optional))
    } satisfies tuple.InternalOptions
    const predicate = !xs.every(_isPredicate) ? Array_isArray : tuple$(xs, options)
    function TupleSchema(src: unknown) { return predicate(src) }
    TupleSchema.tag = URI.tuple
    TupleSchema.def = xs
    TupleSchema.opt = opt
    Object_assign(TupleSchema, tuple.userDefinitions)
    return Object_assign(TupleSchema, bindUserExtensions(TupleSchema, userExtensions))
  }
}

declare namespace tuple {
  interface core<S> {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.tuple
    _type: TupleType<S>
    opt: FirstOptionalItem<S>
    def: S
  }
  type type<S, T = TupleType<S>> = never | T
  type InternalOptions = { minLength?: number }
  type validate<T extends readonly unknown[]> = ValidateTuple<T, optional<any>>

  type from<V extends readonly unknown[], T extends readonly unknown[]>
    = TypeError extends V[number] ? { [I in keyof V]: V[I] extends TypeError ? invalid<Extract<V[I], TypeError>> : V[I] } : T
}
