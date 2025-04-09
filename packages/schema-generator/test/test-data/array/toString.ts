export const extension = {
  type: 'toString(): toString<S>',
  term: 'toString: toString(x)',
}

/* @ts-expect-error */
export type toString<S> = never | `(${ReturnType<S['toString']>})[]`
///
export function toString<S>(x: { def: S }): () => toString<S>
export function toString<S>(x: S): () => toString<S>
export function toString({ def }: { def: unknown }) {
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
