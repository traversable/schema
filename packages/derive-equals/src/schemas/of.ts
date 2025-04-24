import { Equal } from '@traversable/registry'

export type equals = Equal
export function equals<T>(left: T, right: T): boolean {
  return Equal.lax(left, right)
}
