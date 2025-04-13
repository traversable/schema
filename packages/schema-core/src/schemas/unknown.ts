import type { Unknown } from '@traversable/registry'
import { Object_assign, URI } from '@traversable/registry'

export { unknown_ as unknown }

export let userDefinitions: Record<string, any> = {
  //<%= Definitions %>
}

export let userExtensions: Record<string, any> = {
  //<%= Extensions %>
}

interface unknown_ extends unknown_.core {
  //<%= Types %>
}

function UnknownSchema(src: unknown): src is unknown { return true }
UnknownSchema.tag = URI.unknown
UnknownSchema.def = void 0 as unknown

const unknown_ = <unknown_>Object_assign(
  UnknownSchema,
  userDefinitions,
) as unknown_

Object_assign(unknown_, userExtensions)

declare namespace unknown_ {
  interface core {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.unknown
    _type: unknown
    get def(): this['_type']
  }
}
