import type { t } from '@traversable/schema'
import { URI } from '@traversable/registry'
import type { ValidationFn } from '@traversable/derive-validators'
import { NullaryErrors } from '@traversable/derive-validators'

export type validate = ValidationFn<symbol>
export function validate(symbolSchema: t.symbol): validate {
  validateSymbol.tag = URI.symbol
  function validateSymbol(u: unknown, path = Array.of<keyof any>()) {
    return symbolSchema(true as const) || [NullaryErrors.symbol(u, path)]
  }
  return validateSymbol
}
