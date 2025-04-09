import type { Returns, Join, UnionToTuple } from '@traversable/registry'
import { symbol } from '@traversable/registry'
import { t } from '@traversable/schema'

/** @internal */
type Symbol_optional = typeof Symbol_optional
const Symbol_optional: typeof symbol.optional = symbol.optional

/** @internal */
const hasOptionalSymbol = <T>(u: unknown): u is { toString(): T } =>
  !!u && typeof u === 'function'
  && Symbol_optional in u
  && typeof u[Symbol_optional] === 'number'

/** @internal */
const hasToString = (x: unknown): x is { toString(): string } =>
  !!x && typeof x === 'function' && 'toString' in x && typeof x.toString === 'function'

export type toString<T, _ = UnionToTuple<keyof T>> = never
  | [keyof T] extends [never] ? '{}'
  /* @ts-expect-error */
  : `{ ${Join<{ [I in keyof _]: `'${_[I]}${T[_[I]] extends { [Symbol_optional]: any } ? `'?` : `'`}: ${Returns<T[_[I]]['toString']>}` }, ', '>} }`


export function toString<S extends { [x: string]: t.Schema }, _ = UnionToTuple<keyof S>>(objectSchema: t.object<S>): toString<S, _>
export function toString({ def }: t.object) {
  if (!!def && typeof def === 'object') {
    const entries = Object.entries(def)
    if (entries.length === 0) return <never>'{}'
    else return <never>`{ ${entries.map(([k, x]) => `'${k}${hasOptionalSymbol(x) ? "'?" : "'"
      }: ${hasToString(x) ? x.toString() : 'unknown'
      }`).join(', ')
      } }`
  }
  else return <never>'{ [x: string]: unknown }'
}
