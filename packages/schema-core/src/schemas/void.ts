import type { Unknown } from '@traversable/registry'
import { Object_assign, URI } from '@traversable/registry'

export { void_ as void, void_ }

export let userDefinitions: Record<string, any> = {
  //<%= Definitions %>
}

export let userExtensions: Record<string, any> = {
  //<%= Extensions %>
}

interface void_ extends void_.core {
  //<%= Types %>
}

function VoidSchema(src: unknown): src is void { return src === void 0 }
VoidSchema.tag = URI.void
VoidSchema.def = void 0 as void

const void_ = <void_>Object_assign(
  VoidSchema,
  userDefinitions,
) as void_

Object_assign(void_, userExtensions)

declare namespace void_ {
  interface core {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.void
    _type: void
    get def(): this['_type']
  }
}
