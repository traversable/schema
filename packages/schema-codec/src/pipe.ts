import type { Pipe, Extend } from './codec.js'
import { Codec } from './codec.js'
import type { t } from '@traversable/schema'

export interface pipe<T> {
  pipe<B>(map: (src: T['_type' & keyof T]) => B):
    Pipe<T['_type' & keyof T], T['_type' & keyof T], T, B>
  extend<B>(premap: (b: B) => T['_type' & keyof T]):
    Extend<T['_type' & keyof T], T['_type' & keyof T], T, B>
}

export function pipe<S extends t.Schema>(schema: S): pipe<S> {
  return Codec.new(schema)
}

