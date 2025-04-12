import { fn } from '@traversable/registry'

export interface Bounds<T = number> {
  gte?: T
  lte?: T
  gt?: T
  lt?: T
}

/** @internal */
const isNumeric = (u: unknown) => typeof u === 'number' || typeof u === 'bigint'

/** @internal */
const isNullable = (u: unknown) => u == null

export function within({ gte = Number.MIN_SAFE_INTEGER, lte = Number.MAX_SAFE_INTEGER, gt, lt }: Bounds<number>) {
  return (x: number): boolean => {
    switch (true) {
      case isNullable(gt) && isNullable(lt): return gte <= x && x <= lte
      case isNumeric(gt): return isNumeric(lt) ? gt < x && x < lt : gt < x && x <= lte
      case isNumeric(lt): return gte <= x && x < lt
      default: return fn.assertIsNotCalled(lt, gt)
    }
  }
}

export function withinBig({ gte = void 0, lte = void 0, gt, lt }: Bounds<number | bigint>) {
  return (x: number | bigint): boolean => {
    switch (true) {
      case isNullable(gte) && isNullable(lte) && isNullable(lt) && isNullable(gt): return true
      case isNumeric(gt): return isNullable(lt) ? isNullable(lte) ? gt < x : gt < x && x <= lte : gt < x && x < lt
      case isNumeric(lt): return isNullable(gte) ? x < lt : gte <= x && x < lt
      case isNumeric(gte): return gte <= x && (isNumeric(lte) ? x <= lte : true)
      case isNumeric(lte): return x <= lte
      default: return fn.assertIsNotCalled(lt, gt, gte, lte)
    }
  }
}

export function carryover<T extends {}>(x: T, ...ignoreKeys: (keyof T)[]) {
  let keys = Object.keys(x).filter((k) => !ignoreKeys.includes(k as never) && x[k as keyof typeof x] != null)
  if (keys.length === 0) return {}
  else {
    let out: { [x: string]: unknown } = {}
    for (let k of keys) out[k] = x[k as keyof typeof x]
    return out
  }
}
