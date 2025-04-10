import type { Unknown } from '@traversable/registry'
import { has, symbol } from '@traversable/registry'

import type { t, SchemaOptions } from '@traversable/schema'
import type { ValidationError } from './errors.js'

export interface Options extends SchemaOptions {
  path: (keyof any)[]
}

export type Validate<T> = never | { (u: T | Unknown): true | ValidationError[] }
export type ValidationFn<T = any> = never | { (u: T | Unknown, path?: (keyof any)[]): true | ValidationError[] }
export interface Validator<T = any> { validate: ValidationFn<T> }

export let hasOptionalSymbol = <S extends t.Schema>(u: unknown): u is t.optional<S> =>
  !!u && typeof u === 'function' && symbol.optional in u && typeof u[symbol.optional] === 'number'

export let hasValidate
  : <T>(u: unknown) => u is Validator<T>
  = has('validate', (u) => typeof u === 'function') as never

export let callValidate
  : (schema: { validate?: unknown }, u: unknown, path?: (keyof any)[]) => true | ValidationError[]
  = (schema, u, path = Array.of()) => hasValidate(schema) ? schema.validate(u, path) : true
