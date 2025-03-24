export * from '@traversable/schema/namespace'

export type {
  F,
  Fixpoint,
  Free,
} from './shared'
export {
  MapSymbol,
  SetSymbol,
  URI,
} from './shared'

export { set, set as t_set } from './set'
export { map, map as t_map } from './map'
export {
  Functor,
  IndexedFunctor,
  Recursive as recurse,
  fold,
  foldWithIndex,
  unfold,
} from './functor'

