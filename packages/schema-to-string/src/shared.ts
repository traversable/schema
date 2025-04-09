
export const hasToString = (x: unknown): x is { toString(): string } =>
  !!x && typeof x === 'function' && 'toString' in x && typeof x.toString === 'function'

export const isShowable = (u: unknown) => u == null
  || typeof u === 'boolean'
  || typeof u === 'number'
  || typeof u === 'bigint'
  || typeof u === 'string'
  ;

export function callToString(x: unknown): string { return hasToString(x) ? x.toString() : 'unknown' }
