import * as T from '@traversable/registry'

/** @internal */
let Object_hasOwn = (u: unknown, k: keyof any) => !!u && typeof u === 'object' && globalThis.Object.prototype.hasOwnProperty.call(u, k)

/* @ts-expect-error */
export type Key<T> = `${T}` | (T extends `${infer X extends number}` ? X : never) | T

export type KeyOf<T, K extends keyof T = keyof T> = [T] extends [readonly unknown[]] ? Extract<K, `${number}`> : K
export type IndexOf<
  T,
  I extends keyof T = keyof T
> = [T] extends [readonly any[]] ? Exclude<I, keyof []> : I


export function objectFromKeys<T extends keyof any>(...keys: [...T[]]): { [K in T]: K }
export function objectFromKeys<T extends keyof any>(...keys: [...T[]]) {
  let out: { [x: keyof any]: keyof any } = {}
  for (let k of keys) out[k] = k
  return out
}

export type pick<T, K extends keyof T> = never | { [P in K]: T[P] }
export declare namespace pick {
  type Lax<T, K extends keyof any> = never | { [P in K as P extends keyof T ? P : never]: T[P & keyof T] }
  type Where<T, S> = never | { [K in keyof T as T[K] extends S | undefined ? K : never]: T[K] }
}

export type Omit<T, K extends keyof T> = keyof T extends K ? T : { [P in keyof T as P extends K ? never : P]: T[P] }
export type omit<T, K extends keyof T> = never | { [P in keyof T as P extends K ? never : P]: T[P] }
export declare namespace omit {
  type Lax<T, K extends keyof any> = never | { [P in keyof T as P extends K ? never : P]: T[P] }
  type Where<T, S> = never | { [K in keyof T as T[K] extends S ? never : K]: T[K] }
  type When<T, S> = never | { [K in keyof T as T[K] extends S | undefined ? never : K]: T[K] }
  type List<T, K extends keyof T> = never | { [I in keyof T as I extends keyof [] | K | Key<K> ? never : I]: T[I] }
  type Any<T, K extends keyof T> = [T] extends [readonly unknown[]] ? omit.List<T, K> : omit<T, K>
  type NonFiniteObject<T, K extends keyof any> = [string] extends [K] ? T : omit.Lax<T, Key<K>>
  type NonFiniteArray<T extends readonly unknown[], K extends number | string> = string | number extends K ? T : { [x: number]: T[number] }
}

export function pick<T, K extends keyof T>(x: T, ks: K[]): pick<T, K>
export function pick<T, K extends keyof any>(x: T, ks: K[]): pick.Lax<T, K>
export function pick(x: { [x: keyof any]: unknown }, ks: (keyof any)[]) {
  if (!x || typeof x !== 'object') return x
  let allKeys = Object.keys(x)
  if (ks.length === allKeys.length) {
    let keys = Array.of<keyof any>()
    let count = 0
    for (let ix = ks.length; ix-- !== 0;) {
      count++
      let k = ks[ix]
      if (Object_hasOwn(x, k)) keys.push(k)
    }
    if (keys.length === allKeys.length) return x
    else {
      let out: { [x: keyof any]: unknown } = Object.create(null)
      for (let k of keys) out[k] = x[k]
      return out
    }
  }
  else {
    let out: { [x: keyof any]: unknown } = Object.create(null)
    for (let k of ks) if (Object_hasOwn(x, k)) out[k] = x[k]
    return out
  }
}

export function omit<T, K extends keyof T>(x: T, ks: K[]): Omit<T, K>
export function omit<T, K extends keyof T>(x: { [x: keyof any]: unknown }, ks: (keyof any)[]) {
  if (!x || typeof x !== 'object') return x
  if (ks.length === 0) return x
  let out: { [x: keyof any]: unknown } = Object.create(null)
  let keys = Object.keys(x)
  for (let k of keys) if (!ks.includes(k) && !ks.includes(+k)) out[k] = x[k]
  return out
}

export function omit_<T extends T.NonFiniteArray<T>, K extends number | string>(x: T, ...ks: K[]): omit.NonFiniteArray<T, K>
export function omit_<T extends T.NonFiniteObject<T>, K extends string>(x: T, ...ks: K[]): omit.NonFiniteObject<T, K>
export function omit_<
  T extends T.FiniteArray<T>,
  K1 extends keyof T,
  K2 extends Exclude<keyof T, K1>,
  K3 extends Exclude<keyof T, K1 | K2>,
  K4 extends Exclude<keyof T, K1 | K2 | K3>,
  K5 extends Exclude<keyof T, K1 | K2 | K3 | K4>,
  K6 extends Exclude<keyof T, K1 | K2 | K3 | K4 | K5>,
  K7 extends Exclude<keyof T, K1 | K2 | K3 | K4 | K5 | K6>,
  K8 extends Exclude<keyof T, K1 | K2 | K3 | K4 | K5 | K6 | K7>,
  K9 extends Exclude<keyof T, K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8>,
>(x: T, k1: K1, k2: K2, k3: K3, k4: K4, k5: K5, k6: K6, k7: K7, k8: K8, k9: K9):
  omit.Any<T, K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8 | K9>
export function omit_<
  T extends T.FiniteArray<T>,
  K1 extends keyof T,
  K2 extends Exclude<keyof T, K1>,
  K3 extends Exclude<keyof T, K1 | K2>,
  K4 extends Exclude<keyof T, K1 | K2 | K3>,
  K5 extends Exclude<keyof T, K1 | K2 | K3 | K4>,
  K6 extends Exclude<keyof T, K1 | K2 | K3 | K4 | K5>,
  K7 extends Exclude<keyof T, K1 | K2 | K3 | K4 | K5 | K6>,
  K8 extends Exclude<keyof T, K1 | K2 | K3 | K4 | K5 | K6 | K7>,
>(x: T, k1: K1, k2: K2, k3: K3, k4: K4, k5: K5, k6: K6, k7: K7, k8: K8):
  omit.Any<T, K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8>
export function omit_<
  T extends T.FiniteArray<T>,
  K1 extends keyof T,
  K2 extends Exclude<keyof T, K1>,
  K3 extends Exclude<keyof T, K1 | K2>,
  K4 extends Exclude<keyof T, K1 | K2 | K3>,
  K5 extends Exclude<keyof T, K1 | K2 | K3 | K4>,
  K6 extends Exclude<keyof T, K1 | K2 | K3 | K4 | K5>,
  K7 extends Exclude<keyof T, K1 | K2 | K3 | K4 | K5 | K6>,
>(t: T, k1: K1, k2: K2, k3: K3, k4: K4, k5: K5, k6: K6, k7: K7):
  omit.Any<T, K1 | K2 | K3 | K4 | K5 | K6 | K7>
export function omit_<
  T extends T.FiniteArray<T>,
  K1 extends keyof T,
  K2 extends Exclude<keyof T, K1>,
  K3 extends Exclude<keyof T, K1 | K2>,
  K4 extends Exclude<keyof T, K1 | K2 | K3>,
  K5 extends Exclude<keyof T, K1 | K2 | K3 | K4>,
  K6 extends Exclude<keyof T, K1 | K2 | K3 | K4 | K5>,
>(t: T, k1: K1, k2: K2, k3: K3, k4: K4, k5: K5, k6: K6): omit.Any<T, K1 | K2 | K3 | K4 | K5 | K6>
export function omit_<
  T extends T.FiniteArray<T>,
  K1 extends keyof T,
  K2 extends Exclude<keyof T, K1>,
  K3 extends Exclude<keyof T, K1 | K2>,
  K4 extends Exclude<keyof T, K1 | K2 | K3>,
  K5 extends Exclude<keyof T, K1 | K2 | K3 | K4>,
>(t: T, k1: K1, k2: K2, k3: K3, k4: K4, k5: K5): omit.Any<T, K1 | K2 | K3 | K4 | K5>
export function omit_<
  T extends T.FiniteArray<T>,
  K1 extends keyof T,
  K2 extends Exclude<keyof T, K1>,
  K3 extends Exclude<keyof T, K1 | K2>,
  K4 extends Exclude<keyof T, K1 | K2 | K3>,
>(t: T, k1: K1, k2: K2, k3: K3, k4: K4): omit.Any<T, K1 | K2 | K3 | K4>
export function omit_<
  T extends T.FiniteArray<T>,
  K1 extends keyof T,
  K2 extends Exclude<keyof T, K1>,
  K3 extends Exclude<keyof T, K1 | K2>,
>(t: T, k1: K1, k2: K2, k3: K3): omit.Any<T, K1 | K2 | K3>
export function omit_<
  T extends T.FiniteArray<T>,
  K1 extends keyof T,
  K2 extends Exclude<keyof T, K1>,
>(t: T, k1: K1, k2: K2): omit.Any<T, K1 | K2>
export function omit_<
  T extends T.FiniteArray<T>,
  K1 extends keyof T,
>(t: T, k1: K1): omit.Any<T, K1>
export function omit_<
  T extends T.Mut<T>,
  K1 extends keyof T,
  K2 extends Exclude<keyof T, K1>,
  K3 extends Exclude<keyof T, K1 | K2>,
  K4 extends Exclude<keyof T, K1 | K2 | K3>,
  K5 extends Exclude<keyof T, K1 | K2 | K3 | K4>,
  K6 extends Exclude<keyof T, K1 | K2 | K3 | K4 | K5>,
  K7 extends Exclude<keyof T, K1 | K2 | K3 | K4 | K5 | K6>,
  K8 extends Exclude<keyof T, K1 | K2 | K3 | K4 | K5 | K6 | K7>,
  K9 extends Exclude<keyof T, K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8>,
>(x: T, k1: K1, k2: K2, k3: K3, k4: K4, k5: K5, k6: K6, k7: K7, k8: K8, k9: K9): omit.Any<T, K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8 | K9>
export function omit_<
  T extends T.Mut<T>,
  K1 extends keyof T,
  K2 extends Exclude<keyof T, K1>,
  K3 extends Exclude<keyof T, K1 | K2>,
  K4 extends Exclude<keyof T, K1 | K2 | K3>,
  K5 extends Exclude<keyof T, K1 | K2 | K3 | K4>,
  K6 extends Exclude<keyof T, K1 | K2 | K3 | K4 | K5>,
  K7 extends Exclude<keyof T, K1 | K2 | K3 | K4 | K5 | K6>,
  K8 extends Exclude<keyof T, K1 | K2 | K3 | K4 | K5 | K6 | K7>,
>(x: T, k1: K1, k2: K2, k3: K3, k4: K4, k5: K5, k6: K6, k7: K7, k8: K8):
  omit.Any<T, K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8>
export function omit_<
  T extends T.Mut<T>,
  K1 extends keyof T,
  K2 extends Exclude<keyof T, K1>,
  K3 extends Exclude<keyof T, K1 | K2>,
  K4 extends Exclude<keyof T, K1 | K2 | K3>,
  K5 extends Exclude<keyof T, K1 | K2 | K3 | K4>,
  K6 extends Exclude<keyof T, K1 | K2 | K3 | K4 | K5>,
  K7 extends Exclude<keyof T, K1 | K2 | K3 | K4 | K5 | K6>,
>(t: T, k1: K1, k2: K2, k3: K3, k4: K4, k5: K5, k6: K6, k7: K7):
  omit.Any<T, K1 | K2 | K3 | K4 | K5 | K6 | K7>
export function omit_<
  T extends T.Mut<T>,
  K1 extends keyof T,
  K2 extends Exclude<keyof T, K1>,
  K3 extends Exclude<keyof T, K1 | K2>,
  K4 extends Exclude<keyof T, K1 | K2 | K3>,
  K5 extends Exclude<keyof T, K1 | K2 | K3 | K4>,
  K6 extends Exclude<keyof T, K1 | K2 | K3 | K4 | K5>,
>(t: T, k1: K1, k2: K2, k3: K3, k4: K4, k5: K5, k6: K6): omit.Any<T, K1 | K2 | K3 | K4 | K5 | K6>
export function omit_<
  T extends T.Mut<T>,
  K1 extends keyof T,
  K2 extends Exclude<keyof T, K1>,
  K3 extends Exclude<keyof T, K1 | K2>,
  K4 extends Exclude<keyof T, K1 | K2 | K3>,
  K5 extends Exclude<keyof T, K1 | K2 | K3 | K4>,
>(t: T, k1: K1, k2: K2, k3: K3, k4: K4, k5: K5): omit.Any<T, K1 | K2 | K3 | K4 | K5>
export function omit_<
  T extends T.Mut<T>,
  K1 extends keyof T,
  K2 extends Exclude<keyof T, K1>,
  K3 extends Exclude<keyof T, K1 | K2>,
  K4 extends Exclude<keyof T, K1 | K2 | K3>,
>(t: T, k1: K1, k2: K2, k3: K3, k4: K4): omit.Any<T, K1 | K2 | K3 | K4>
export function omit_<
  T extends T.Mut<T>,
  K1 extends keyof T,
  K2 extends Exclude<keyof T, K1>,
  K3 extends Exclude<keyof T, K1 | K2>,
>(t: T, k1: K1, k2: K2, k3: K3): omit.Any<T, K1 | K2 | K3>
export function omit_<
  T extends T.Mut<T>,
  K1 extends keyof T,
  K2 extends Exclude<keyof T, K1>,
>(t: T, k1: K1, k2: K2): omit.Any<T, K1 | K2>
export function omit_<
  T extends T.Mut<T>,
  K extends keyof T
>(t: T, k: K): omit.Any<T, K>
export function omit_<T extends T.Mut<T>>(x: T): T
export function omit_(x: { [x: keyof any]: unknown }, ...ks: (keyof any)[]) { return omit(x, ks) }

export function pick_<T extends T.NonFiniteArray<T>, K extends number | `${number}`>(x: T, ...ks: K[]): pick.Lax<T, K>
export function pick_<T extends T.NonFiniteObject<T>, K extends string>(x: T, ...ks: K[]): pick.Lax<T, K>
export function pick_<T extends T.Mut<T>, K extends KeyOf<T>>(x: T, ...ks: K[]): pick<T, K>
export function pick_(x: { [x: keyof any]: unknown }, ...ks: (keyof any)[]) { return pick(x, ks) }

export function pickWhere<T extends {}, S>(x: T, predicate: (x: unknown) => x is S): pick.Where<T, S>
export function pickWhere<T extends {}, S>(x: T, predicate: (x: unknown) => boolean): pick.Where<T, S>
export function pickWhere(x: { [x: string]: unknown }, predicate: (x: unknown) => boolean) {
  let out: { [x: string]: unknown } = {}
  for (let k in x) if (predicate(x[k])) out[k] = x[k]
  return out
}

export function omitWhere<T extends {}, S>(x: T, predicate: (x: unknown) => x is S): omit.Where<T, S>
export function omitWhere<T extends {}, S>(x: T, predicate: (x: unknown) => boolean): omit.Where<T, S>
export function omitWhere(x: { [x: string]: unknown }, predicate: (x: unknown) => boolean) {
  let out: { [x: string]: unknown } = {}
  for (let k in x) if (!predicate(x[k])) out[k] = x[k]
  return out
}

export const omitMethods = <T extends {}>(x: T) => omitWhere(x, (x) => typeof x === 'function')
