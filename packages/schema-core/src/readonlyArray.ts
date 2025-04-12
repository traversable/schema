import { URI } from '@traversable/registry'

import type { Schema, SchemaLike } from './types.js'
import { array } from './array.js'
import { Inline } from './core.js'

export const readonlyArray: {
  <S extends Schema>(schema: S, readonly: 'readonly'): readonlyArray<S>
  <S extends SchemaLike>(schema: S): readonlyArray<Inline<S>>
} = array
export interface readonlyArray<S> {
  (u: unknown): u is this['_type']
  tag: URI.array
  def: S
  _type: ReadonlyArray<S['_type' & keyof S]>
}
