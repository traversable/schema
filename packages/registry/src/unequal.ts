import { Array_isArray } from './globalThis.js'
import { map } from './function.js'
import { invalid_value } from './symbol.js'

const isObject = (x: unknown): x is {} => !!x && typeof x === 'object'

const arrayHasOnlyNullableValues = (xs: readonly unknown[]) => xs.length > 0 && xs.every((x) => x == null)
const entriesHaveOnlyNullableValues = (xs: readonly [any, any][]) => xs.length > 0
  && arrayHasOnlyNullableValues(xs.map(([k]) => k))
  && arrayHasOnlyNullableValues(xs.map(([, v]) => v))

export function deriveUnequalValue(x: unknown) {
  let mutated = false
  function go(x: {} | null | undefined): unknown {
    switch (true) {
      default: return x satisfies never
      case x === null: return x
      case x === undefined: return x
      case typeof x === 'boolean': return mutated === true ? x : (void (mutated = true), !x)
      case typeof x === 'bigint': return mutated === true ? x : (void (mutated = true), x + 1n)
      case typeof x === 'symbol': return mutated === true ? x : (void (mutated = true), invalid_value)
      case typeof x === 'number': return mutated === true ? x : (void (mutated = true), x === 0 ? 1 : x !== x ? 0 : -x)
      case typeof x === 'string': return mutated === true ? x : (void (mutated = true), x + ' ')
      case x instanceof Date: return mutated === true ? x : (
        void (mutated = true),
        new Date(x.getTime() !== x.getTime() ? 0 : x.getTime() + 1000)
      )
      case Array_isArray(x): {
        if (x.length === 0)
          return (void (mutated = true), [null])
        else if (arrayHasOnlyNullableValues(x))
          return (void (mutated = true), map(x, (_) => _ === null ? undefined : null))
        else
          return map(x, go)
      }
      case x instanceof Set: {
        const values = Array.from(x)
        if (values.length === 0)
          return (void (mutated = true), new Set([null]))
        else if (arrayHasOnlyNullableValues(values))
          return (void (mutated = true), new Set())
        else
          return new Set(map(values, go))
      }
      case x instanceof Map: {
        const entries = Array.from(x)
        if (entries.length === 0)
          return (void (mutated = true), new Map([[null, null]]))
        else if (entriesHaveOnlyNullableValues(entries))
          return (void (mutated = true), new Map())
        else
          return new Map(map(entries, ([k, v]) => [go(k), go(v)] satisfies [any, any]))
      }
      case isObject(x): {
        const entries = Object.entries(x)
        if (entries.length === 0)
          return (void (mutated = true), { '': null })
        if (arrayHasOnlyNullableValues(entries.map(([, v]) => v)))
          return (void (mutated = true), map(x, (x) => x === null ? undefined : null))
        else
          return map(x, go)
      }
    }
  }

  const out = go(x)
  return mutated ? out : invalid_value
}
