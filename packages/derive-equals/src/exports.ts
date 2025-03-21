export * from './version.js'

import { Equal } from '@traversable/registry'

export {
  fromSchema,
  fromSeed,
} from './equals.js'

const deep = Equal.deep
const lax = Equal.lax

export {
  deep,
  lax,
}
