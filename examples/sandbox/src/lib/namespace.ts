export * from '@traversable/schema/namespace'
export { getConfig } from '@traversable/schema'

export type {
  F,
  Fixpoint,
  Free,
} from './shared'
export {
  symbol as Sym,
  URI,
  is,
} from './shared'

export { set } from './set'
export { map } from './map'
export {
  fold,
  foldWithIndex,
  Functor,
  IndexedFunctor,
  Recursive,
  toHtml,
  unfold,
} from './functor'

export * as Seed from './seed'
export type Seed<T = never> = [T] extends [never]
  ? import('./seed').Fixpoint
  : import('./seed').Seed<T>
