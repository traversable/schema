export * from 'fast-check'

import * as fc from 'fast-check'
import type { _, Entries, Force, Guard } from './types.js'
import { symbol as Symbol } from './uri.js'

export interface Arbitrary<T> extends fc.Arbitrary<T> {
  readonly [Symbol.optional]?: true
}

export type typeOf<S> = S extends fc.Arbitrary<infer T> ? T : never

/** @internal */
const Object_keys = globalThis.Object.keys
/** @internal */
const Array_isArray = globalThis.Array.isArray
/** @internal */
const isString: Guard<string> = (u): u is never => typeof u === 'string'
/** @internal */
const arrayOf
  : <T>(p: Guard<T>) => Guard<T[]>
  = (p) => (u): u is never => Array_isArray(u) && u.every(p)
/** @internal */
const has
  : <K extends keyof any, T>(k: K, p: Guard<T>) => Guard<{ [P in K]: T }>
  = (k, p) => (u: unknown): u is never =>
    !!u &&
    typeof u === 'object' &&
    Object.hasOwn(u, k) &&
    p(u[k as never])

export type UniqueArrayDefaults<T, U> = fc.UniqueArrayConstraintsRecommended<T, U>

export const entries
  : <T, U>(model: fc.Arbitrary<T>, constraints?: UniqueArrayDefaults<T, U>) => fc.Arbitrary<Entries<T>>
  = (model, constraints) => fc.uniqueArray(
    fc.tuple(fc.string(), model),
    { ...constraints, selector: ([k]) => k },
  )

/**
 * ### {@link optional `fc.optional`}
 */
export function optional<T>(model: fc.Arbitrary<T>, constraints?: fc.OneOfConstraints): Arbitrary<T>
export function optional<T>(model: fc.Arbitrary<T>, constraints: fc.OneOfConstraints = {}): fc.Arbitrary<T | undefined> {
  // const arbitrary = fc.oneof(constraints, model, fc.constant(undefined));
  (model as any)[Symbol.optional] = true;
  return model
  // arbitrary
}

export declare namespace record {
  type Keep<T, K extends keyof T> = never | { [P in K]: T[P] }
  type Part<T, K extends keyof T = keyof T> = never | { [P in K]+?: T[P] }
  type Forget<T> = never | { [K in keyof T]: T[K] }
  type Require<T, K extends keyof T = never> = [K] extends [never] ? T : Forget<
    & Keep<T, K>
    & Part<T, globalThis.Exclude<keyof T, K>>
  >
}

export function record<
  T extends globalThis.Record<string, fc.Arbitrary<unknown>>,
  _K extends keyof T = keyof T,
  Opt extends
  | _K extends _K ? T[_K] extends { [Symbol.optional]: true } ? _K : never : never
  = _K extends _K ? T[_K] extends { [Symbol.optional]: true } ? _K : never : never,
  Req extends Exclude<_K, Opt> = Exclude<_K, Opt>
>(model: T): fc.Arbitrary<Force<
  & { [K in Opt]+?: typeOf<T[K]> }
  & { [K in Req]-?: typeOf<T[K]> }
>>

export function record<T>(model: { [K in keyof T]: fc.Arbitrary<T[K]> }): fc.Arbitrary<T>

export function record<T, K extends never>(
  model: { [K in keyof T]: fc.Arbitrary<T[K]> },
  constraints: { requiredKeys?: readonly [] }
): fc.Arbitrary<{ [K in keyof T]+?: T[K] }>

export function record<T, K extends keyof T>(
  model: { [K in keyof T]: fc.Arbitrary<T[K]> },
  constraints: { requiredKeys?: K[] }
): fc.Arbitrary<record.Require<T, K>>

export function record<T, K extends keyof T>(
  model: { [K in keyof T]: fc.Arbitrary<T[K]> },
  constraints: { withDeletedKeys?: boolean, requiredKeys?: never }
): fc.Arbitrary<record.Require<T, K>>

export function record<T, K extends keyof T>(
  model: { [K in keyof T]: fc.Arbitrary<T[K]> },
  constraints: { withDeletedKeys: never, requiredKeys: never }
): fc.Arbitrary<record.Require<T, K>>

// export function record<T, K extends keyof T>(
//   model: { [K in keyof T]: fc.Arbitrary<T[K]> },
//   constraints?: fc.RecordConstraints<T>
// ): fc.Arbitrary<record.Require<T, K>>

export function record(
  model: { [x: string]: fc.Arbitrary<unknown> },
  constraints: { requiredKeys?: readonly string[] } = {}
) {
  const keys = Object_keys(model)
  const opt = keys.filter((k) => (Symbol.optional in model[k]))
  const requiredKeys = has("requiredKeys", arrayOf(isString))(constraints)
    ? keys
      .filter((k) => constraints.requiredKeys?.includes(k))
      .filter((k) => !opt.includes(k))
    : keys
      .filter((k) => !opt.includes(k))

  return fc.record(model, { ...constraints, requiredKeys })
}