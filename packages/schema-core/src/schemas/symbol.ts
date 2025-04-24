import type { Unknown } from '@traversable/registry'
import { Object_assign, URI } from '@traversable/registry'

export { symbol_ as symbol }

export let userDefinitions: Record<string, any> = {
  //<%= Definitions %>
}

export let userExtensions: Record<string, any> = {
  //<%= Extensions %>
}

interface symbol_ extends symbol_.core {
  //<%= Types %>
}

function SymbolSchema(src: unknown): src is symbol { return typeof src === 'symbol' }
SymbolSchema.tag = URI.symbol
SymbolSchema.def = Symbol()

const symbol_ = <symbol_>Object_assign(
  SymbolSchema,
  userDefinitions,
) as symbol_

Object_assign(symbol_, userExtensions)

declare namespace symbol_ {
  interface core {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.symbol
    _type: symbol
    get def(): this['_type']
  }
}
