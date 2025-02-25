export { Arbitrary } from './arbitrary.js'

export type {
  Scalar,
  Unary,
  Free,
  Fixed,
} from './functor.js'

export {
  Functor,
  IndexedFunctor,
  isJson as is,
  isArray,
  isObject,
  isScalar,
  toString,
  fold,
  unfold,
  foldWithIndex,
} from './functor.js'
