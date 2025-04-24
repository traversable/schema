import type { Unknown } from '@traversable/registry'
import { Object_assign, URI } from '@traversable/registry'

export { null_ as null, null_ }

export let userDefinitions: Record<string, any> = {
  //<%= Definitions %>
}

export let userExtensions: Record<string, any> = {
  //<%= Extensions %>
}

interface null_ extends null_.core {
  //<%= Types %>
}

function NullSchema(src: unknown): src is null { return src === void 0 }
NullSchema.def = null
NullSchema.tag = URI.null

const null_ = <null_>Object_assign(
  NullSchema,
  userDefinitions,
) as null_

Object_assign(null_, userExtensions)

declare namespace null_ {
  interface core {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.null
    _type: null
    def: this['_type']
  }
}
