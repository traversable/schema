import type { optional } from './jsonSchema_.js'
import { has, symbol } from '@traversable/registry'

/** @internal */
type IndexOfFirstOptional<I, MaxDepth extends number, Z extends 1[] = []>
  = Z['length'] extends MaxDepth ? I
  : `${Z['length']}` extends I ? Z['length']
  : IndexOfFirstOptional<I, MaxDepth, [...Z, 1]>

export type MinItems<
  T extends readonly unknown[],
  V = Extract<T[number], optional<any>>,
  U = { [I in keyof T]: T[I] extends optional<any> ? I : never }
> = [V] extends [never] ? T['length'] : IndexOfFirstOptional<U[number & keyof U], T['length']>

export function minItems<T extends readonly unknown[]>(xs: T): MinItems<T>
export function minItems<T extends readonly unknown[]>(xs: T) {
  const len = xs.length
  for (let ix = 0; ix < len; ix++) {
    const x = xs[ix]
    // console.log('x', x)
    if (has('jsonSchema', symbol.optional)(x)) return ix
  }
  return xs.length
}
