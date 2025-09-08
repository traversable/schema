import {
  fn,
  URI,
} from '@traversable/registry'
import { Json as JSON } from '@traversable/json'
import { t } from '@traversable/schema'

import type { Validator } from './types.js'
import type { Options } from './options.js'
import { defaults } from './options.js'
import * as Json from './json.js'
import * as v from './validators.js'

export const json
  : (json: JSON, options?: Options) => Validator<JSON>
  = (json, options = defaults) => JSON.fold<Validator>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case JSON.isScalar(x): return Json.scalar(x, options)
      case JSON.isArray(x): return Json.array(x, options)
      case JSON.isObject(x): return Json.object(x, options)
    }
  })(json as JSON.Unary<Validator>)

export const fold
  : <S extends t.Type>(schema: S, options?: Options) => Validator<S['_type']>
  = (schema, options = defaults) => t.fold<Validator>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.any: return v.any(options)
      case x.tag === URI.unknown: return v.unknown(options)
      case x.tag === URI.never: return v.never(options)
      case x.tag === URI.void: return v.void(options)
      case x.tag === URI.null: return v.null(options)
      case x.tag === URI.undefined: return v.undefined(options)
      case x.tag === URI.symbol: return v.symbol(options)
      case x.tag === URI.boolean: return v.boolean(options)
      case x.tag === URI.integer: return v.integer(x, options)
      case x.tag === URI.bigint: return v.bigint(x, options)
      case x.tag === URI.number: return v.number(x, options)
      case x.tag === URI.string: return v.string(x, options)
      case x.tag === URI.ref: return x.def
      case x.tag === URI.eq: return v.eq(x.def, options)
      case x.tag === URI.optional: return v.optional(x)
      case x.tag === URI.array: return v.array(x, options)
      case x.tag === URI.record: return v.record(x, options)
      case x.tag === URI.intersect: return v.intersect(x, options)
      case x.tag === URI.union: return v.union(x, options)
      case x.tag === URI.tuple: return v.tuple(x, options)
      case x.tag === URI.object: return v.object(x, options)
    }
  })(schema)

export const getJsonValidator
  : <T extends JSON.Mut<T>>(json: T, options?: Options) => Validator<T>
  = json

export const getValidator
  : <S extends t.Type>(schema: S, options?: Options) => Validator<S['_type']>
  = (schema, options = defaults) => fold(schema, options)
