import type { Equal } from "@traversable/registry"
import { Object_is } from "@traversable/registry"

export type equals = Equal<unknown>
export function equals(left: unknown, right: unknown): boolean {
  return Object_is(left, right)
}