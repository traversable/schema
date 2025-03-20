export * from './exports.js'
export * as Validator from './exports.js'

/**
 * ## {@link Validator `Validator`}
 * 
 * Derive a {@link Validator.ValidationFn `ValidationFn`} from a 
 * {@link t.Schema `@traversable/schema`} schema.
 * 
 * A {@link Validator.ValidationFn `ValidationFn`} is a function that accepts an
 * `unknown` input and returns:
 * 
 * - `true` if the input satisfies the validation function's constraints
 * - an array of {@link Validator.ValidationError `ValidationError`}s otherwise
 * 
 * @example
 * import { Validator } from '@traversable/derive-validator'
 * import { t } from '@traversable/schema'
 * 
 * const UserSchema = t.object({
 *   name: t.object({
 *     firstName: t.string,
 *     lastName: t.string,
 *   })
 * })
 * 
 * const UserValidator = Validator.fromSchema(UserSchema)
 * 
 * console.log(UserValidator({ name: { first: 'Janet', last: 'Planet' } })) 
 * // => true
 * 
 * console.log(UserValidator({ name: { first: 'Babycakes' } })) 
 * /**
 *  *  [
 *  *     { "kind": "REQUIRED", "expected": "Record<'last', string>", "got": { "first": 'Babycakes' }, "path": [] }, 
 *  *     { "kind": "TYPE_MISMATCH", "expected": "string", "got": undefined, "path": ["name", "last"], "path": ["name"] }
 *  *  ]
 *  *\/
 */
// declare module "./exports.js" { }

import type * as Validator from "./exports.js"
import type { t } from "@traversable/schema"
