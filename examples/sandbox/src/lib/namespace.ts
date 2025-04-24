export * from '@traversable/schema-core/namespace'
export { getConfig } from '@traversable/schema-core'

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
  Functor,
} from './functor'
export { toHtml } from './toHtml'

export * as Seed from './seed'
export type Seed<T = never> = [T] extends [never]
  ? import('./seed').Fixpoint
  : import('./seed').Seed<T>
