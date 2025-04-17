import type { Unknown } from '@traversable/registry'
import { bindUserExtensions, Object_assign, URI } from '@traversable/registry'

export { nonnullable }
interface nonnullable extends nonnullable.core {
  //<%= Types %>
}

export let userDefinitions: Record<string, any> = {
  //<%= Definitions %>
}

export let userExtensions: Record<string, any> = {
  //<%= Extensions %>
}

function NonNullableSchema(src: unknown) { return src != null }
const nonnullable = <nonnullable>Object_assign(
  NonNullableSchema,
  userDefinitions,
) as nonnullable

nonnullable.tag = URI.nonnullable;
(nonnullable.def as {}) = {}

declare namespace nonnullable {
  interface core {
    (u: this['_type'] | Unknown): u is this['_type']
    _type: {}
    tag: URI.nonnullable
    get def(): this['_type']
  }
}

Object_assign(
  nonnullable,
  bindUserExtensions(nonnullable, userExtensions),
)
