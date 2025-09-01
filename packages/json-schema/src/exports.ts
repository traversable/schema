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
  String,
  Tuple,
  Union,
  Unknown
} from '@traversable/json-schema-types'
export {
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
  isString,
  isTuple,
  isUnion,
  isUnknown,
  toType,
  TypeName,
} from '@traversable/json-schema-types'

export { VERSION } from './version.js'
export { deepEqual } from './deep-equal.js'
export { deepClone } from './deep-clone.js'
