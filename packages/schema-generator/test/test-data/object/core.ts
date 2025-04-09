import type { Force } from '@traversable/registry'
import {
  Array_isArray,
  applyOptions,
  bindUserDefinitions,
  map,
  Object_assign,
  Object_keys,
  replaceBooleanConstructor,
  URI,
} from '@traversable/registry'
import type { SchemaOptions as Options } from '@traversable/schema'
import { t, Predicate } from '@traversable/schema'

interface object_<S = { [x: string]: t.Schema }> extends object_.core<S> {
  //<%= types %>
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
function object_<S extends { [x: string]: t.Schema }>(schemas: S, options?: Options) {
  return object_.def(schemas, options)
}

const replaceBoolean = replaceBooleanConstructor(t.nonnullable)

namespace object_ {
  export let proto = {} as object_<unknown>
  export function def<T extends { [x: string]: unknown }>(xs: T, $?: Options, opt?: string[]): object_<T>
  export function def(xs: { [x: string]: unknown }, $?: Options, opt_?: string[]): {} {
    let userDefinitions: Record<string, any> = {
      //<%= terms %>
    }
    const keys = Object_keys(xs)
    const opt = Array_isArray(opt_) ? opt_ : keys.filter((k) => t.optional.is(xs[k]))
    const req = keys.filter((k) => !t.optional.is(xs[k]))
    const objectGuard = !Predicate.record$(t.isPredicate)(xs) ? Predicate.is.anyObject
      : Predicate.is.object(map(xs, replaceBoolean), applyOptions($))
    function ObjectSchema(src: unknown) { return objectGuard(src) }
    ObjectSchema.tag = URI.object
    ObjectSchema.def = xs
    ObjectSchema.opt = opt
    ObjectSchema.req = req
    Object_assign(ObjectSchema, proto)
    return Object_assign(ObjectSchema, bindUserDefinitions(ObjectSchema, userDefinitions))
  }
}

declare namespace object_ {
  interface core<S> {
    tag: URI.object
    def: S
    opt: t.Optional<S>
    req: Required<S>
    _type: object_.type<S>
    (u: unknown): u is this['_type']
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
