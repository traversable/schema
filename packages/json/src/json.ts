export { Arbitrary } from './arbitrary.js'

export type {
  Scalar,
  Unary,
  Fixpoint,
  Free,
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
