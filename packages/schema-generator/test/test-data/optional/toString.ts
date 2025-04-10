import type { t } from '@traversable/schema'
import { callToString } from '@traversable/schema-to-string'

export interface toString<S, T = S['def' & keyof S]> {
  /* @ts-expect-error */
  (): never | `(${ReturnType<T['toString']>} | undefined)`
}

export function toString<S>(optionalSchema: t.optional<S>): toString<typeof optionalSchema>
export function toString<S>({ def }: t.optional<S>): () => string {
  function optionalToString(): string {
    return '(' + callToString(def) + ' | undefined)'
  }
  return optionalToString
}
