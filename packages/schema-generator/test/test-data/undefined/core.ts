import type { Unknown } from '@traversable/registry'
import { Object_assign, URI } from '@traversable/registry'

export { undefined_ as undefined }

export let userDefinitions: Record<string, any> = {
  //<%= Definitions %>
}

export let userExtensions: Record<string, any> = {
  //<%= Extensions %>
}

interface undefined_ extends undefined_.core {
  //<%= Types %>
}

function UndefinedSchema(src: unknown): src is undefined { return src === void 0 }
UndefinedSchema.tag = URI.undefined
UndefinedSchema.def = void 0 as undefined

const undefined_ = <undefined_>Object_assign(
  UndefinedSchema,
  userDefinitions,
) as undefined_

Object_assign(undefined_, userExtensions)

declare namespace undefined_ {
  interface core {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.undefined
    _type: undefined
    def: this['_type']
  }
}
