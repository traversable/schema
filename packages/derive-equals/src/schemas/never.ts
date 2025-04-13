import type { Equal } from "@traversable/registry"

export type equals = Equal<never>
export function equals(left: never, right: never): boolean {
  return false
}
