export { Arbitrary } from './arbitrary.js'

export type {
  Scalar,
  Fixpoint,
  Free,
  Mut,
  Unary,
} from './functor.js'

export {
  Functor,
  Recursive,
  isJson as is,
  isArray,
  isObject,
  isScalar,
  toString,
  fold,
  unfold,
  foldWithIndex,
} from './functor.js'
