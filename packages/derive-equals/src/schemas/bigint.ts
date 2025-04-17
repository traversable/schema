import type { Equal } from '@traversable/registry'
import { Object_is } from '@traversable/registry'

export type equals = Equal<bigint>
export function equals(left: bigint, right: bigint): boolean {
  return Object_is(left, right)
}
