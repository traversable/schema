export * from 'fast-check'
import * as fc from 'fast-check'

import type { Force } from '@traversable/registry'
import { symbol as Symbol } from '@traversable/registry'
import type { Guard } from '@traversable/schema'

export interface Arbitrary<T = unknown> extends fc.Arbitrary<T> {
  readonly [Symbol.optional]?: true
}

export type { typeOf as typeof }
type typeOf<S> = S extends fc.Arbitrary<infer T> ? T : never

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
    Object.prototype.hasOwnProperty.call(u, k) &&
    p(u[k as never])

/** @internal */
// const KEYWORD = {
//   break: 'break', case: 'case', catch: 'catch', class: 'class', const: 'const',
//   continue: 'continue', debugger: 'debugger', default: 'default', delete: 'delete',
//   do: 'do', else: 'else', export: 'export', extends: 'extends', false: 'false',
//   finally: 'finally', for: 'for', function: 'function', if: 'if', import: 'import',
//   in: 'in', instanceof: 'instanceof', new: 'new', null: 'null', return: 'return',
//   super: 'super', switch: 'switch', this: 'this', throw: 'throw', true: 'true',
//   try: 'try', typeof: 'typeof', var: 'var', void: 'void', while: 'while',
//   with: 'with', let: 'let', static: 'static', yield: 'yield',
// } as const satisfies Record<string, string>

// const Keywords = [
//   'break', 'case', 'catch', 'class', 'const',
//   'continue', 'debugger', 'default', 'delete',
//   'do', 'else', 'export', 'extends', 'false',
//   'finally', 'for', 'function', 'if', 'import',
//   'in', 'instanceof', 'new', 'null', 'return',
//   'super', 'switch', 'this', 'throw', 'true',
//   'try', 'typeof', 'var', 'void', 'while',
//   'with', 'let', 'static', 'yield',
// ]

const PATTERN = {
  identifier: '^[$_a-zA-Z][$_a-zA-Z0-9]*$',
  // identifierSpec: '[$_\\p{ID_Start}][$_\\u200C\\u200D\\p{ID_Continue}]*',
} as const

const REGEX = {
  identifier: new globalThis.RegExp(PATTERN.identifier, 'u'),
  // identifierSpec: new globalThis.RegExp(PATTERN.identifierSpec, 'u'),
} as const

export type UniqueArrayDefaults<T = unknown, U = unknown> = fc.UniqueArrayConstraintsRecommended<T, U>

/** 
 * See also:
 * - the MDN docs on 
 * [identifiers in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#identifiers)
 */
export function identifier(constraints?: fc.StringMatchingConstraints): fc.Arbitrary<string>
export function identifier(constraints?: fc.StringMatchingConstraints) {
  return fc.stringMatching(REGEX.identifier, constraints) //.filter((ident) => !(ident in KEYWORD))
}

export const entries
  : <T, U>(model: fc.Arbitrary<T>, constraints?: UniqueArrayDefaults<T, U>) => fc.Arbitrary<[k: string, v: T][]>
  = (model, constraints) => fc.uniqueArray(
    fc.tuple(identifier(), model),
    { ...constraints, selector: ([k]) => k },
  )

/**
 * ### {@link optional `fc.optional`}
 */
export function optional<T>(model: fc.Arbitrary<T>, constraints?: fc.OneOfConstraints): Arbitrary<T>
export function optional<T>(model: fc.Arbitrary<T>, _constraints: fc.OneOfConstraints = {}): fc.Arbitrary<T | undefined> {
  (model as any)[Symbol.optional] = true;
  return model
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

export function record(
  model: { [x: string]: fc.Arbitrary<unknown> },
  constraints: { requiredKeys?: readonly string[] } = {}
) {
  const keys = Object_keys(model)
  const opt = keys.filter((k) => (Symbol.optional in model[k]))
  const requiredKeys = has('requiredKeys', arrayOf(isString))(constraints)
    ? keys
      .filter((k) => constraints.requiredKeys?.includes(k))
      .filter((k) => !opt.includes(k))
    : keys
      .filter((k) => !opt.includes(k))

  return fc.record(model, { ...constraints, requiredKeys })
}

