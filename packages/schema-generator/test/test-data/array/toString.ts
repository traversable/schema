import type { t } from '@traversable/schema'

/* @ts-expect-error */
export type toString<S> = never | `(${ReturnType<S['def']['toString']>})[]`
export function toString<S extends t.array<t.Schema>>(arraySchema: S): () => toString<S>
export function toString<S>(arraySchema: S): () => toString<S>
export function toString({ def: { def } }: { def: { def: unknown } }) {
  return () => {
    let body = (
      !!def
      && typeof def === 'object'
      && 'toString' in def
      && typeof def.toString === 'function'
    ) ? def.toString()
      : '${string}'
    return ('(' + body + ')[]')
  }
}
