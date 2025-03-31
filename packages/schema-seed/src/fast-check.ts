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
    Object.hasOwn(u, k) &&
    p(u[k as never])

const PATTERN = {
  identifier: /^[$_a-zA-Z][$_a-zA-Z0-9]*$/,
} as const

export type UniqueArrayDefaults<T = unknown, U = unknown> = fc.UniqueArrayConstraintsRecommended<T, U>

export function identifier(constraints?: fc.StringMatchingConstraints): fc.Arbitrary<string>
export function identifier(constraints?: fc.StringMatchingConstraints) {
  return fc.stringMatching(PATTERN.identifier, constraints) //.filter((ident) => !(ident in KEYWORD))
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
export function optional<T>(model: fc.Arbitrary<T>): Arbitrary<T>
export function optional<T>(model: fc.Arbitrary<T>): fc.Arbitrary<T | undefined> {
  (model as any)[Symbol.optional] = true;
  return model
}

// /** @internal */
// type Keyword = keyof typeof Keyword
// const Keyword = {
//   break: "break", case: "case", catch: "catch", class: "class", const: "const",
//   continue: "continue", debugger: "debugger", default: "default", delete: "delete",
//   do: "do", else: "else", export: "export", extends: "extends", false: "false",
//   finally: "finally", for: "for", function: "function", if: "if", import: "import",
//   in: "in", instanceof: "instanceof", new: "new", null: "null", return: "return",
//   super: "super", switch: "switch", this: "this", throw: "throw", true: "true",
//   try: "try", typeof: "typeof", var: "var", void: "void", while: "while",
//   with: "with", let: "let", static: "static", yield: "yield",
// } as const satisfies Record<string, string>
