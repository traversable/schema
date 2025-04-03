export type pickWhere<T, S> = never | { [K in keyof T as T[K] extends S | undefined ? K : never]: T[K] }

export function pickWhere<T extends {}, S>(x: T, predicate: (x: unknown) => x is S): pickWhere<T, S>
export function pickWhere<T extends {}, S>(x: T, predicate: (x: unknown) => boolean): pickWhere<T, S>
export function pickWhere(x: { [x: string]: unknown }, predicate: (x: unknown) => boolean) {
  let out: { [x: string]: unknown } = {}
  for (let k in x) if (predicate(x[k])) out[k] = x[k]
  return out
}
