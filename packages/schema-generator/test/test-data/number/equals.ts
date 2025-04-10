import { Equal } from "@traversable/registry"

export type equals = Equal<number>
export function equals(left: number, right: number): boolean {
  return Equal.SameValueNumber(left, right)
}
