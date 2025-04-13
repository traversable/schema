import type { Equal } from '@traversable/registry'

export type equals = Equal<number>
export function equals(left: string, right: string): boolean {
  return left === right
}
