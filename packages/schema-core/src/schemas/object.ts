import type { Force, SchemaOptions as Options, Unknown } from '@traversable/registry'
import {
  applyOptions,
  Array_isArray,
  bindUserExtensions,
  has,
  _isPredicate,
  Object_assign,
  Object_keys,
  record as record$,
  object as object$,
  isAnyObject,
  symbol,
  URI,
} from '@traversable/registry'

import type { Entry, Optional, Required, Schema, SchemaLike } from '../namespace.js'

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
  //<%= Types %>
}

namespace object_ {
  export let userDefinitions: Record<string, any> = {
    //<%= Definitions %>
  } as object_<unknown>
  export function def<T extends { [x: string]: unknown }>(xs: T, $?: Options, opt?: string[]): object_<T>
  export function def<T extends { [x: number]: unknown }>(xs: T, $?: Options, opt?: string[]): object_<T>
  /* v8 ignore next 1 */
  export function def(xs: { [x: string]: unknown }, $?: Options, opt_?: string[]): {} {
    let userExtensions: Record<string, any> = {
      //<%= Extensions %>
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
