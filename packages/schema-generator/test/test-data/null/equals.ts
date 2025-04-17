import type { Equal } from "@traversable/registry"
import { Object_is } from "@traversable/registry"

export type equals = Equal<null>
export function equals(left: null, right: null): boolean {
  return Object_is(left, right)
}