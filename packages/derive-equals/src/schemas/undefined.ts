import type { Equal } from '@traversable/registry'
import { Object_is } from '@traversable/registry'

export type equals = Equal<undefined>
export function equals(left: undefined, right: undefined): boolean {
  return Object_is(left, right)
}
