import { has, symbol } from '@traversable/registry'
import type { optional } from './jsonSchema.js'

/** @internal */
type IndexOfFirstOptional<I, MaxDepth extends number, Z extends 1[] = []>
  = Z['length'] extends MaxDepth ? I
  : `${Z['length']}` extends I ? Z['length']
  : IndexOfFirstOptional<I, MaxDepth, [...Z, 1]>

export type MinItems<
  T,
  U = { [I in keyof T]: T[I] extends optional<any> ? I : never },
  V = Extract<T[number & keyof T], { [symbol.optional]: any }>,
> = [V] extends [never] ? T['length' & keyof T]
  : IndexOfFirstOptional<U[number & keyof U], T['length' & keyof T] & number>

export function minItems<T extends readonly unknown[], Min = MinItems<T>>(xs: T): Min
export function minItems(xs: unknown[]): number {
  const len = xs.length
  for (let ix = 0; ix < len; ix++) {
    const x = xs[ix]
    if (has(symbol.optional)(x)) return ix
    if (has('toJsonSchema', symbol.optional)(x)) return ix
  }
  return xs.length
}
