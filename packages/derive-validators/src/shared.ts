import { symbol } from '@traversable/registry'

import type { t, SchemaOptions } from '@traversable/schema'
import type { ValidationError } from './errors.js'

export interface Options extends SchemaOptions {
  path: (keyof any)[]
}

export type Validate<T> = never | { (u: T | {} | null | undefined): true | ValidationError[] }

export type ValidationFn = never | {
  (u: unknown, path?: (keyof any)[]): true | ValidationError[]
  tag: t.Tag
  def?: unknown
  ctx: (keyof any)[]
}

export interface Validator { validate: ValidationFn }


export const isOptional = <S extends t.Schema>(u: unknown): u is t.optional<S> =>
  !!u && typeof u === 'function' && symbol.optional in u && typeof u[symbol.optional] === 'number'