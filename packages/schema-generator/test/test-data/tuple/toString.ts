import type { Join } from '@traversable/registry'
import { Array_isArray } from '@traversable/registry'
import { t } from '@traversable/schema'
import { hasToString } from '@traversable/schema-to-string'

export type toString<T> = never | `[${Join<{
  [I in keyof T]: `${
  /* @ts-expect-error */
  T[I] extends { [Symbol_optional]: any } ? `_?: ${ReturnType<T[I]['toString']>}` : ReturnType<T[I]['toString']>
  }`
}, ', '>}]`

export function toString<S>(tupleSchema: t.tuple<S>): toString<S>
export function toString<S>(tupleSchema: t.tuple<S>): string {
  return Array_isArray(tupleSchema.def)
    ? `[${tupleSchema.def.map(
      (x) => t.optional.is(x)
        ? `_?: ${hasToString(x) ? x.toString() : 'unknown'}`
        : hasToString(x) ? x.toString() : 'unknown'
    ).join(', ')}]` : 'unknown[]'
}
