import { Equal, getConfig, URI } from '@traversable/registry'
import type { t } from '@traversable/schema-core'
import type { Validate } from '@traversable/derive-validators'
import { Errors } from '@traversable/derive-validators'

export type validate<T> = Validate<T['_type' & keyof T]>
export function validate<V>(eqSchema: t.eq<V>): validate<V>
export function validate<V>({ def }: t.eq<V>): validate<V> {
  validateEq.tag = URI.eq
  function validateEq(u: unknown, path = Array.of<keyof any>()) {
    let options = getConfig().schema
    let equals = options?.eq?.equalsFn || Equal.lax
    if (equals(def, u)) return true
    else return [Errors.eq(u, path, def)]
  }
  return validateEq
}
