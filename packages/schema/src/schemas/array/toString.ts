import type { t } from '../../_exports.js'

export interface toString<T> {
  /* @ts-expect-error */
  (): never | `(${ReturnType<T['def']['toString']>})[]`
}

export function toString<S extends t.Schema>(arraySchema: t.array<S>): toString<typeof arraySchema>
export function toString<S>(arraySchema: t.array<S>): toString<typeof arraySchema>
export function toString({ def }: { def: unknown }) {
  function arrayToString() {
    let body = (
      !!def
      && typeof def === 'object'
      && 'toString' in def
      && typeof def.toString === 'function'
    ) ? def.toString()
      : '${string}'
    return ('(' + body + ')[]')
  }
  return arrayToString
}
