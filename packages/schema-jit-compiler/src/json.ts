import type * as T from '@traversable/registry'
import { fn, isValidIdentifier, Object_entries, Object_values, URI } from '@traversable/registry'
import { Json } from '@traversable/json'

import type { Index as Ix } from './functor.js'

export let isScalar = Json.isScalar
export let isArray = Json.isArray
export let isObject = Json.isObject

export let WeightByType = {
  undefined: 1,
  null: 2,
  boolean: 4,
  number: 8,
  string: 16,
  array: 128,
  object: 256,
} as const

export type Any = import('@traversable/json').Json
export type Unary<T> = import('@traversable/json').Unary<T>
export interface IRFree extends T.HKT { [-1]: IR<this[0]> }

export type IR<T = any> =
  | { tag: URI.bottom, def: Json.Scalar }
  | { tag: URI.array, def: T[] }
  | { tag: URI.object, def: [k: string, v: T][] }

export type IRFixpoint =
  | { tag: URI.bottom, def: Json.Scalar }
  | { tag: URI.array, def: IRFixpoint[] }
  | { tag: URI.object, def: [k: string, v: IRFixpoint][] }

export type Index = Omit<Ix, 'schemaPath' | 'isOptional'>
export type Algebra<T> = T.IndexedAlgebra<Index, IRFree, T>

export let defaultIndex = {
  dataPath: [],
  isRoot: true,
  offset: 2,
  siblingCount: 0,
  varName: 'value',
} satisfies Index

let map
  : T.Functor<IRFree, IRFixpoint>['map']
  = (f) => (xs) => {
    switch (true) {
      default: return fn.exhaustive(xs)
      case xs.tag === URI.bottom: return xs
      case xs.tag === URI.array: return { tag: xs.tag, def: fn.map(xs.def, f) }
      case xs.tag === URI.object: return {
        tag: xs.tag,
        def: fn.map(xs.def, ([k, v]) => [k, f(v)] satisfies [any, any]),
      }
    }
  }

export let Functor: T.Functor.Ix<Index, IRFree, IRFixpoint> = {
  map,
  mapWithIndex(f) {
    return function mapFn(xs, ix) {
      switch (true) {
        default: return fn.exhaustive(xs)
        case xs.tag === URI.bottom: return xs
        case xs.tag === URI.array: return {
          tag: xs.tag, def: fn.map(xs.def, (x, i) => f(x, {
            dataPath: [...ix.dataPath, i],
            isRoot: false,
            offset: ix.offset + 2,
            siblingCount: xs.def.length,
            varName: ix.varName + `[${i}]`,
          }))
        }
        case Json.isObject(xs): return {
          tag: xs.tag, def: fn.map(xs.def, ([k, v]) => [k, f(v, {
            dataPath: [...ix.dataPath, k],
            isRoot: false,
            offset: ix.offset + 2,
            siblingCount: Object_values(xs).length,
            varName: ix.varName + (isValidIdentifier(k) ? `.${k}` : `["${k}"]`),
          })] satisfies [any, any])
        }
      }
    }
  },
}

export let fold
  : <T>(algebra: T.IndexedAlgebra<Index, IRFree, T>) => <S>(json: IR<S>, ix?: Index) => T
  = (algebra) => (json, index = defaultIndex) => fn.cataIx(Functor)(algebra)(json as /* FIXME */ never, index)

export let toIR = Json.fold<IRFixpoint>((x) => {
  switch (true) {
    default: return fn.exhaustive(x)
    case x === undefined:
    case x === null:
    case typeof x === 'boolean':
    case typeof x === 'number':
    case typeof x === 'string': return { tag: URI.bottom, def: x }
    case Json.isArray(x): return { tag: URI.array, def: [...x] }
    case Json.isObject(x): return { tag: URI.object, def: Object_entries(x) }
  }
})

let aggregateWeights
  : (acc: number, curr: T.Param<typeof getWeight>) => number
  = (acc, curr) => acc + getWeight(curr)


export let weightComparator: T.Comparator<Any> = (l, r) => {
  let lw = getWeight(l)
  let rw = getWeight(r)
  return lw < rw ? -1 : rw < lw ? +1 : 0
}

export let getWeight = (x: Any): number => {
  switch (true) {
    default: return fn.exhaustive(x)
    case x === undefined: return WeightByType.undefined
    case x === null: return WeightByType.null
    case typeof x === 'boolean': return WeightByType.boolean
    case typeof x === 'number': return WeightByType.number
    case typeof x === 'string': return WeightByType.string
    case Json.isArray(x): return WeightByType.array + x.reduce(aggregateWeights, 0)
    case Json.isObject(x): return WeightByType.object + Object_values(x).reduce(aggregateWeights, 0)
  }
}

let sortAlgebra: Algebra<IRFixpoint> = (x) => {
  switch (true) {
    default: return fn.exhaustive(x)
    case x.tag === URI.bottom: return x
    case x.tag === URI.array: return { tag: URI.array, def: x.def.sort(weightComparator) }
    case x.tag === URI.object: return { tag: URI.object, def: x.def.sort(([, l], [, r]) => weightComparator(l, r)) }
  }
}

export let sort = fn.flow(
  toIR,
  fold(sortAlgebra),
)
