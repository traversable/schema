import type { t } from '@traversable/schema-core'

export interface toJsonSchema<S, T = S['def' & keyof S]> { (): { const: T } }
export function toJsonSchema<V>(eqSchema: t.eq<V>): toJsonSchema<typeof eqSchema>
export function toJsonSchema<V>({ def }: t.eq<V>) {
  function eqToJsonSchema() { return { const: def } }
  return eqToJsonSchema
}
