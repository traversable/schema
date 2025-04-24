import type { Join } from '@traversable/registry/types'

export function join<L extends readonly unknown[], R extends readonly unknown[]>(left: readonly [...L], right: readonly [...R]): [...L, ...R]
export function join<L extends readonly unknown[], R extends readonly unknown[]>(left: readonly [...L], right: readonly [...R]) {
  return [...left, ...right]
}
