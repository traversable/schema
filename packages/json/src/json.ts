export { Arbitrary } from './arbitrary.js'

export type {
  Fixpoint,
  Free,
  Mut,
  Scalar,
  Unary,
} from './functor.js'

export {
  Functor,
  Recursive,
  defaultIndex,
  isJson as is,
  isArray,
  isObject,
  isScalar,
  toString,
  fold,
  unfold,
  foldWithIndex,
} from './functor.js'
