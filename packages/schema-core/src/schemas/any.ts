import type { Unknown } from '@traversable/registry'
import { Object_assign, URI } from '@traversable/registry'

export { any_ as any }

export let userDefinitions: Record<string, any> = {
  //<%= Definitions %>
}

export let userExtensions: Record<string, any> = {
  //<%= Extensions %>
}

interface any_ extends any_.core {
  //<%= Types %>
}

function AnySchema(src: unknown): src is any { return true }
AnySchema.tag = URI.any
AnySchema.def = void 0 as any

const any_ = <any_>Object_assign(
  AnySchema,
  userDefinitions,
) as any_

Object_assign(any_, userExtensions)

declare namespace any_ {
  interface core {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.any
    _type: any
    get def(): this['_type']
  }
}
