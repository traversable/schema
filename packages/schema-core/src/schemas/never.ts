import type { Unknown } from '@traversable/registry'
import { Object_assign, URI } from '@traversable/registry'

export { never_ as never }

export let userDefinitions: Record<string, any> = {
  //<%= Definitions %>
}

export let userExtensions: Record<string, any> = {
  //<%= Extensions %>
}

interface never_ extends never_.core {
  //<%= Types %>
}

function NeverSchema(src: unknown): src is never { return false }
NeverSchema.tag = URI.never;
NeverSchema.def = void 0 as never

const never_ = <never_>Object_assign(
  NeverSchema,
  userDefinitions,
) as never_

Object_assign(never_, userExtensions)

export declare namespace never_ {
  interface core {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.never
    _type: never
    get def(): this['_type']
  }
}

