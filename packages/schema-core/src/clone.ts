import type { Param } from '@traversable/registry'
import type { LowerBound } from './types.js'

export function clone<S extends LowerBound>(schema: S): S
export function clone<S extends LowerBound>(schema: S) {
  function cloned(u: Param<typeof schema>) { return schema(u) }
  for (const k in schema) (cloned as typeof schema)[k] = schema[k]
  return cloned
}
