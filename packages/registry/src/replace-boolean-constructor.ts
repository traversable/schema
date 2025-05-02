
export const nonnullable = (got: unknown): got is {} => !!got
export const any = (got: unknown): got is unknown => true

export function replaceBooleanConstructor<T>(fn: T, got: unknown): boolean
export function replaceBooleanConstructor<T>(fn: T, got: unknown): boolean {
  return fn === globalThis.Boolean ? !!got : typeof fn !== 'function' ? true : fn(got)
}
