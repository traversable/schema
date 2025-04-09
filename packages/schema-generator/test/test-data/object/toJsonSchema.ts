import type { Returns } from '@traversable/registry'
import { fn, Object_keys } from '@traversable/registry'
import type { RequiredKeys } from '@traversable/schema-to-json-schema'
import { isRequired, property } from '@traversable/schema-to-json-schema'
import { t } from '@traversable/schema'

export interface toJsonSchema<T, KS extends RequiredKeys<T> = RequiredKeys<T>> {
  toJsonSchema(): {
    type: 'object'
    required: { [I in keyof KS]: KS[I] & string }
    properties: { [K in keyof T]: Returns<T[K]['toJsonSchema' & keyof T[K]]> }
  }
}

export function toJsonSchema<S extends t.object>(objectSchema: S): toJsonSchema<S>
export function toJsonSchema<T extends { def: { [x: string]: unknown } }, KS extends RequiredKeys<T>>(objectSchema: T): {
  type: 'object'
  required: { [I in keyof KS]: KS[I] & string }
  properties: { [K in keyof T]: Returns<T[K]['toJsonSchema' & keyof T[K]]> }
}
export function toJsonSchema({ def }: { def: { [x: string]: unknown } }) {
  const required = Object_keys(def).filter(isRequired(def))
  return {
    type: 'object',
    required,
    properties: fn.map(def, (v, k) => property(required)(v, k as number | string)),
  } as never
}
