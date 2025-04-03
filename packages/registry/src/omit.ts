export type omitWhere<T, S> = never | { [K in keyof T as T[K] extends S ? never : K]: T[K] }
export function omitWhere<T extends {}, S>(x: T, predicate: (x: unknown) => x is S): omitWhere<T, S>
export function omitWhere<T extends {}, S>(x: T, predicate: (x: unknown) => boolean): omitWhere<T, S>
export function omitWhere(x: { [x: string]: unknown }, predicate: (x: unknown) => boolean) {
  let out: { [x: string]: unknown } = {}
  for (let k in x) if (!predicate(x[k])) out[k] = x[k]
  return out
}

export const omitMethods = <T extends {}>(x: T) => omitWhere(x, (x) => typeof x === 'function')
