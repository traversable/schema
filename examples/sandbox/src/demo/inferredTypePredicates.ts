import { t } from '../lib'

/**
 * DEMO: inferred type predicates
 *
 * You can use the built-in `instanceof` operator to create a schema
 * for any JavaScript class:
 */
export let classes = t.object({
  error: (v) => v instanceof Error,
  typeError: (v) => v instanceof TypeError,
  readableStream: (v) => v instanceof ReadableStream,
  syntaxError: (v) => v instanceof SyntaxError,
  buffer: (v) => v instanceof ArrayBuffer,
  promise: (v) => v instanceof Promise,
  set: (v) => v instanceof Set,
  map: (v) => v instanceof Map,
  weakMap: (v) => v instanceof WeakMap,
  date: (v) => v instanceof Date,
  regex: (v) => v instanceof RegExp,
})

/**
 * DEMO: inferred type predicates
 *
 * You can write inline type predicates, and `@traversable/schema-core` keep track of
 * that at the type-level, even when the predicate is used inside a larger schema:
 */
export let values = t.object({
  successStatus: (v) => v === 200 || v === 201 || v === 202 || v === 204,
  clientErrorStatus: (v) => v === 400 || v === 401 || v === 403 || v === 404,
  serverErrorStatus: (v) => v === 500 || v === 502 || v === 503,
  teapot: (v) => v === 418,
  true: (v) => v === true,
  false: (v) => v === false,
  mixed: (v) => Array.isArray(v) || v === true,
  startsWith: (v): v is `bill${string}` => typeof v === 'string' && v.startsWith('bill'),
  endsWith: (v): v is `${string}murray` => typeof v === 'string' && v.endsWith('murral'),
  function: (v) => typeof v === 'function',
})

/**
 * DEMO: inferred type predicates
 *
 * There are a few "shorthand" predicates you can write, if you'd prefer:
 *
 * - `Boolean` -> `t.nonnullable`
 *   - under the hood, `Boolean` gets mapped to `t.nonnullable`, so you get the semantics you want,
 *     without the footgun (i.e., `Boolean(0)` or `Boolean("")` both return `false`)
 * - `() => true` -> `t.unknown`
 * - `() => false` -> `t.optional(t.never)`
 */
export let shorthand = t.object({
  nonnullable: Boolean,
  unknown: () => true,
  never: () => false,
})
