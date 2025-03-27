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

export { set } from './set'
export { map } from './map'
export {
  fold,
  foldWithIndex,
  Functor,
  IndexedFunctor,
  Recursive,
  toSchemaString,
  toTypeHtml,
  toTermHtml,
  toTermWithTypeHtml,
  toTypeString,
  unfold,
} from './functor'

