import type * as T from '@traversable/registry'
import { escape, fn, isValidIdentifier, Object_entries, Object_values, URI } from '@traversable/registry'
import { Json } from '@traversable/json'

import type * as F from './functor.js'
import {
  bindPreSortIndices,
  buildContext,
  indexAccessor,
} from './shared.js'

export const isScalar = Json.isScalar
export const isArray = Json.isArray
export const isObject = Json.isObject

export const WeightByType = {
  undefined: 1,
  null: 2,
  boolean: 4,
  number: 8,
  string: 16,
  array: 128,
  object: 256,
} as const

export interface Free extends T.HKT { [-1]: IR<this[0]> }

export type IR<T = any> =
  | { tag: URI.bottom, def: Json.Scalar }
  | { tag: URI.array, def: T[] }
  | { tag: URI.object, def: [k: string, v: T][] }

export type Fixpoint =
  | { tag: URI.bottom, def: Json.Scalar }
  | { tag: URI.array, def: Fixpoint[] }
  | { tag: URI.object, def: [k: string, v: Fixpoint][] }

export type Index = Omit<F.Index, 'schemaPath' | 'isOptional'>
export type Algebra<T> = T.IndexedAlgebra<Index, Free, T>

export const defaultIndex = {
  dataPath: [],
  isRoot: true,
  offset: 2,
  siblingCount: 0,
  varName: 'value',
} satisfies Index

const map
  : T.Functor<Free>['map']
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

export const Functor: T.Functor.Ix<Index, Free> = {
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
            /** 
             * Passing `x` to `indexAccessor` is a hack to make sure
             * we preserve the original order of the tuple while we're
             * applying a sorting optimization
             */
            varName: ix.varName + indexAccessor(i, { ...ix, isOptional: false }, x),
          }, xs))
        }
        case Json.isObject(xs): return {
          tag: xs.tag, def: fn.map(xs.def, ([k, v]) => [k, f(v, {
            dataPath: [...ix.dataPath, k],
            isRoot: false,
            offset: ix.offset + 2,
            siblingCount: Object_values(xs).length,
            varName: ix.varName + (isValidIdentifier(k) ? `.${k}` : `["${k}"]`),
          }, xs)] satisfies [any, any])
        }
      }
    }
  },
}

export function fold<T>(algebra: T.IndexedAlgebra<Index, Free, T>): <S>(json: IR<S>, ix?: Index) => T
export function fold<T>(algebra: T.IndexedAlgebra<Index, Free, T>) {
  return (json: Fixpoint, index = defaultIndex) => fn.cataIx(Functor)(algebra)(json, index)
}

const comparator: T.Comparator<Json> = (l, r) => {
  const lw = getWeight(l)
  const rw = getWeight(r)
  return lw < rw ? -1 : rw < lw ? +1 : 0
}

export const getWeight = (x: Json): number => {
  switch (true) {
    default: return fn.exhaustive(x)
    case x === undefined: return WeightByType.undefined
    case x === null: return WeightByType.null
    case typeof x === 'boolean': return WeightByType.boolean
    case typeof x === 'number': return WeightByType.number
    case typeof x === 'string': return WeightByType.string
    case Json.isArray(x): return WeightByType.array + x.reduce((acc: number, cur) => acc + getWeight(cur), 0)
    case Json.isObject(x): return WeightByType.object + Object_values(x).reduce((acc: number, cur) => acc + getWeight(cur), 0)
  }
}

export const sort = fn.flow(
  Json.fold<Fixpoint>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x === undefined:
      case x === null:
      case typeof x === 'boolean':
      case typeof x === 'number':
      case typeof x === 'string': return { tag: URI.bottom, def: x }
      case Json.isArray(x): {
        return { tag: URI.array, def: [...x] }
      }
      case Json.isObject(x): return { tag: URI.object, def: Object_entries(x) }
    }
  }),
  fold<Fixpoint>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.bottom: return x
      case x.tag === URI.array: return { tag: URI.array, def: bindPreSortIndices(x.def).sort(comparator) }
      case x.tag === URI.object: return { tag: URI.object, def: x.def.sort(([, l], [, r]) => comparator(l, r)) }
    }
  }),
)

export function interpreter(x: IR<IR<string>>, ix: Index): IR<string>
export function interpreter(x: IR<IR<string>>, ix: Index): {
  tag: URI.bottom | URI.array | URI.object
  def: unknown
} {
  const { VAR, join } = buildContext(ix)
  switch (true) {
    default: return fn.exhaustive(x)
    case x.tag === URI.bottom: {
      let BODY = VAR + ' === '
      switch (true) {
        default: return fn.exhaustive(x.def)
        case x.def === null: BODY += 'null'; break
        case x.def === undefined: BODY += 'undefined'; break
        case x.def === true: BODY += 'true'; break
        case x.def === false: BODY += 'false'; break
        case x.def === 0: BODY += 1 / x.def === Number.NEGATIVE_INFINITY ? '-0' : '+0'; break
        case typeof x.def === 'number': BODY += String(x.def); break
        case typeof x.def === 'string': BODY += `"${escape(x.def)}"`; break
      }
      return {
        tag: URI.bottom,
        def: BODY,
      }
    }
    case x.tag === URI.array: return {
      tag: URI.array,
      def: ''
        + `Array.isArray(${VAR}) && `
        + `${VAR}.length === ${x.def.length}`
        + (x.def.length === 0 ? '' : x.def.map((v, i) => i === 0 ? join(0) + v.def : v.def).join(join(0))),
    }
    case x.tag === URI.object: return {
      tag: URI.object,
      def: ''
        + `!!${VAR} && typeof ${VAR} === "object" && !Array.isArray(${VAR})`
        + (x.def.length === 0 ? '' : x.def.map(([, v], i) => i === 0 ? join(0) + v.def : v.def).join(join(0))),
    }
  }
}

export function generate(json: Json, index?: Index): string
export function generate(json: Json, index?: Index) {
  return fn.pipe(
    sort(json),
    (sorted) => fold(interpreter)(sorted, index).def,
  )
}