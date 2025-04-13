import type { Equal } from '@traversable/registry'
import { Object_is } from '@traversable/registry'

export type equals = Equal<void>
export function equals(left: void, right: void): boolean {
  return Object_is(left, right)
}
