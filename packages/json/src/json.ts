export { Arbitrary } from './arbitrary.js'

export type {
  Scalar,
  Unary,
  Free,
  Recursive,
} from './functor.js'

export {
  Functor,
  isJson as is,
  isArray,
  isObject,
  isScalar,
  toString,
  fold,
  unfold,
  foldWithIndex,
} from './functor.js'
