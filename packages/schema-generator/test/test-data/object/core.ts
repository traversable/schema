import type { Force, Unknown } from '@traversable/registry'
import {
  Array_isArray,
  applyOptions,
  bindUserExtensions,
  isPredicate,
  map,
  Object_assign,
  Object_keys,
  safeCoerce,
  URI,
} from '@traversable/registry'
import { SchemaOptions as Options } from '@traversable/schema-core'
import { t, Predicate } from '@traversable/schema-core'

interface object_<S = { [x: string]: t.Schema }> extends object_.core<S> {
  //<%= Types %>
}

export { object_ as object }
function object_<
  S extends { [x: string]: t.Schema },
  T extends { [K in keyof S]: t.Entry<S[K]> }
>(schemas: S, options?: Options): object_<T>
function object_<
  S extends { [x: string]: t.Predicate },
  T extends { [K in keyof S]: t.Entry<S[K]> }
>(schemas: S, options?: Options): object_<T>
function object_(schemas: { [x: string]: t.Schema }, options?: Options) {
  return object_.def(schemas, options)
}

namespace object_ {
  export let userDefinitions: Record<string, any> = {
    //<%= Definitions %>
  } as object_<unknown>
  export function def<T extends { [x: string]: unknown }>(xs: T, $?: Options, opt?: string[]): object_<T>
  export function def(xs: { [x: string]: unknown }, $?: Options, opt_?: string[]): {} {
    let userExtensions: Record<string, any> = {
      //<%= Extensions %>
    }
    const keys = Object_keys(xs)
    const opt = Array_isArray(opt_) ? opt_ : keys.filter((k) => t.optional.is(xs[k]))
    const req = keys.filter((k) => !t.optional.is(xs[k]))
    const objectGuard = !Predicate.record$(isPredicate)(xs) ? Predicate.is.anyObject
      : Predicate.is.object(map(xs, safeCoerce), applyOptions($))
    function ObjectSchema(src: unknown) { return objectGuard(src) }
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
    def: S
    opt: t.Optional<S>
    req: t.Required<S>
  }
  type type<
    S,
    Opt extends t.Optional<S> = t.Optional<S>,
    Req extends t.Required<S> = t.Required<S>,
    T = Force<
      & { [K in Req]-?: S[K]['_type' & keyof S[K]] }
      & { [K in Opt]+?: S[K]['_type' & keyof S[K]] }
    >
  > = never | T
}
