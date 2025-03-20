import type { t, SchemaOptions } from '@traversable/schema'
import { symbol } from '@traversable/registry'

export interface Options extends SchemaOptions {
  path: (keyof any)[]
}

export const isOptional = <S extends t.Schema>(u: unknown): u is t.optional<S> =>
  !!u && typeof u === 'function' && symbol.optional in u && typeof u[symbol.optional] === 'number'