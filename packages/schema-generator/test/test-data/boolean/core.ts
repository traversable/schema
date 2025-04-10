import type { Unknown } from '@traversable/registry'
import { Object_assign, URI } from '@traversable/registry'

export { boolean_ as boolean }

export let userDefinitions: Record<string, any> = {
  //<%= Definitions %>
}

export let userExtensions: Record<string, any> = {
  //<%= Extensions %>
}

interface boolean_ extends boolean_.core {
  //<%= Types %>
}
function BooleanSchema(src: unknown): src is boolean { return src === void 0 }

BooleanSchema.tag = URI.boolean
BooleanSchema.def = false

const boolean_ = <boolean_>Object_assign(
  BooleanSchema,
  userDefinitions,
) as boolean_

Object_assign(boolean_, userExtensions)

declare namespace boolean_ {
  interface core {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.boolean
    _type: boolean
    def: this['_type']
  }
}
