export * from './version.js'

import { Equal } from '@traversable/registry'

export {
  fromSchema,
  // fromSeed,
  defaults,
  array,
  record,
  object,
  optional,
  tuple,
  union,
  intersect,
} from './equals.js'

const deep = Equal.deep
const lax = Equal.lax

export {
  deep,
  lax,
}
