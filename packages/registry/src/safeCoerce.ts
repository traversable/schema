/** @internal */
let isBooleanConstructor = (u: unknown): u is globalThis.BooleanConstructor => u === globalThis.Boolean

/** @internal */
let isNonNullable = (u: unknown) => u != null

export function safeCoerce<T>(fn: T): T
export function safeCoerce<T>(fn: T): T {
  return isBooleanConstructor(fn) ? isNonNullable as never : fn
}
