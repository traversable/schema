import type { Equal } from '@traversable/registry'
import { Object_is } from '@traversable/registry'

export type equals = Equal<any>
export function equals(left: any, right: any): boolean {
  return Object_is(left, right)
}
