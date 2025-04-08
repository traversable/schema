/* @ts-expect-error */
export type arrayToString<T> = never | `(${ReturnType<T['toString']>})[]`

export function arrayToString<S>(x: { def: S }): arrayToString<S>
export function arrayToString<S>(x: S): arrayToString<S>
export function arrayToString({ def }: { def: unknown }) {
  let body = (
    !!def
    && typeof def === 'object'
    && 'toString' in def
    && typeof def.toString === 'function'
  ) ? def.toString()
    : '${string}'
  return ('(' + body + ')[]')
}

let xs = arrayToString({ def: { toString() { return 'hey' as const } } })
