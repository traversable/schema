import type { Equal } from '@traversable/registry'
import { SameValueNumber } from "@traversable/registry"

export type equals = Equal<number>
export function equals(left: number, right: number): boolean {
  return SameValueNumber(left, right)
}
