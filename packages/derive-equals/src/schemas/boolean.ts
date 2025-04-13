import type { Equal } from '@traversable/registry'
import { Object_is } from '@traversable/registry'

export type equals = Equal<boolean>
export function equals(left: boolean, right: boolean): boolean {
  return Object_is(left, right)
}
