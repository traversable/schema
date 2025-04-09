/** @internal */
const isBooleanConstructor = (u: unknown): u is globalThis.BooleanConstructor => u === globalThis.Boolean

export function replaceBooleanConstructor(replacement: (u: unknown) => u is {}):
  <T>(fn: typeof globalThis.Boolean | T) => T | ((u: unknown) => u is {}) {
  return (fn) => isBooleanConstructor(fn) ? replacement : fn
}
