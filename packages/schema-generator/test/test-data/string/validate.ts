import type { ValidationError } from '@traversable/derive-validators'
import { NullaryErrors } from '@traversable/derive-validators'

export function validate(this: (u: any) => boolean, u: unknown, path: (keyof any)[] = []): true | ValidationError[] {
  return this(u) || [NullaryErrors.string(u, path)]
}
