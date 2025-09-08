export type {
  Array,
  Boolean,
  Const,
  Enum,
  F,
  Integer,
  Intersection,
  Never,
  Null,
  Nullary,
  Number,
  Object,
  Record,
  Ref,
  String,
  Tuple,
  Union,
  Unknown
} from '@traversable/json-schema-types'
export {
  check,
  fold,
  Functor,
  isArray,
  isBoolean,
  isConst,
  isEnum,
  isInteger,
  isIntersection,
  isNever,
  isNull,
  isNullary,
  isNumber,
  isObject,
  isRecord,
  isRef,
  isString,
  isTuple,
  isUnion,
  isUnknown,
  canonicalizeRefName,
  toType,
  TypeName,
} from '@traversable/json-schema-types'

export { VERSION } from './version.js'
export { deepEqual } from './deep-equal.js'
export { deepClone } from './deep-clone.js'
