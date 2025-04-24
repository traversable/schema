import type { Equal } from '@traversable/registry'
import { Object_is } from '@traversable/registry'

export type equals = Equal<symbol>
export function equals(left: symbol, right: symbol): boolean {
  return Object_is(left, right)
}
