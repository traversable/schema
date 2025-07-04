import type { HKT, Kind } from './hkt.js'
import {
  Number_isSafeInteger,
  Number_parseInt,
  Object_assign,
  Object_create,
  Object_entries,
} from './globalThis.js'

import * as symbol from './symbol.js'
import * as fn from './function.js'
import * as Either from './either.js'
type Either<L, R> = import('./either.js').Either<L, R>

type UnaryFn = (x: any) => any
type BinaryFn = (x: never, y: never) => any
type Profunctor = any

export interface Optic {
  [symbol.tag]: Optic.Type
  _removable?: true
  (P: Profunctor, optic: Optic): any
}

export declare namespace Optic {
  type Type = keyof Lattice
}

/** @internal */
const isMissing = (x: unknown) => x === undefined

export type Lattice = typeof Lattice
export const Lattice = {
  Identity: {
    Identity: 'Identity',
    Iso: 'Iso',
    Lens: 'Lens',
    Prism: 'Prism',
    Traversal: 'Traversal',
  },
  Iso: {
    Identity: 'Iso',
    Iso: 'Iso',
    Lens: 'Lens',
    Prism: 'Prism',
    Traversal: 'Traversal',
  },
  Lens: {
    Identity: 'Lens',
    Iso: 'Lens',
    Lens: 'Lens',
    Prism: 'Prism',
    Traversal: 'Traversal',
  },
  Prism: {
    Identity: 'Prism',
    Iso: 'Prism',
    Lens: 'Prism',
    Prism: 'Prism',
    Traversal: 'Traversal',
  },
  Traversal: {
    Identity: 'Traversal',
    Iso: 'Traversal',
    Lens: 'Traversal',
    Prism: 'Traversal',
    Traversal: 'Traversal',
  },
} as const

export function Profunctor() {}
Profunctor.arrow = {
  dimap(sa: UnaryFn, bt: UnaryFn, ab: UnaryFn) { return (x: any) => bt(ab(sa(x))) },
  first(f: UnaryFn) { return ([x, y]: [any, any]) => [f(x), y] },
  right(f: UnaryFn) { return (x: Either<any, any>): Either<any, any> => Either.isLeft(x) ? x : Either.right(f(x.right)) },
  wander(f: any) { return (xs: { [x: number]: unknown }) => xs == null ? xs : fn.map(xs, f) },
}

Profunctor.const = (M: any) => ({
  dimap(f: UnaryFn, _g: UnaryFn, pure: UnaryFn) { return (x: any) => pure(f(x)) },
  first(pure: UnaryFn) { return ([x]: [any, any]) => pure(x) },
  right(pure: UnaryFn, hint?: string) { return (x: Either.Any) => Either.isLeft(x) ? M.empty(hint) : pure(x.right) },
  wander(pure: UnaryFn) { return (xs: any[]) => M.foldMap(pure, xs) },
})

const UnknownMonoid = {
  empty(hint?: string) { return hint === 'void' ? undefined : hint === 'array' ? [] : {} },
  foldMap(f: UnaryFn, xs: { [x: number]: unknown }) {
    return xs instanceof Set
      ? SetMonoid.foldMap(f, xs)
      : Array.isArray(xs)
        ? ArrayMonoid.foldMap(f, xs)
        : Object_entries(xs).reduce(
          (acc, [k, v]) => k in acc ? acc : { ...acc, [k]: f(v) },
          {} as { [x: number]: unknown }
        )
  }
}

const ArrayMonoid = {
  empty() { return [] },
  foldMap(f: UnaryFn, xs: any[]) {
    let acc = Array.of()
    xs.forEach((x) => acc = acc.concat(f(x)))
    return acc
  },
}

const SetMonoid = {
  empty() { return new Set() },
  foldMap(f: UnaryFn, xs: Set<unknown>) {
    let tmp = Array.of()
    xs.forEach((x) => tmp = tmp.concat(f(x)))
    return tmp
  }
}

const ObjectMonoid = {
  empty() { return Object_create(null) },
  foldMap(f: UnaryFn, xs: { [x: string]: unknown }) {
    return Object_entries(xs).reduce(
      (acc, [k, v]) => k in acc ? acc : { ...acc, [k]: f(v) },
      {} as { [x: number]: unknown }
    )
  }
}

const FirstMonoid = {
  empty() { return undefined },
  // empty() { return symbol.notfound },
  foldMap(f: UnaryFn, xs: any[]) {
    for (let ix = 0, len = xs.length; ix < len; ix++) {
      const x = f(xs[ix])
      if (!isMissing(x)) return x
    }
    return undefined
    // return symbol.notfound
  },
}

const FallbackSemigroup = (fallback: unknown) => ({
  empty() { return [fallback] },
  foldMap(f: UnaryFn, xs: any[]) {
    if (Array.isArray(xs)) {
      let acc = Array.of()
      xs.forEach((x) => acc = acc.concat(f(isMissing(x) ? fallback : x)))
      return acc
    }
    else {
      Object_entries(xs).reduce(
        (acc, [k, v]) => k in acc ? acc : { ...acc, [k]: f(isMissing(v) ? fallback : v) },
        {} as { [x: number]: unknown }
      )
    }
  },
})

export function Monoid() {}
Monoid.any = UnknownMonoid
Monoid.array = ArrayMonoid
Monoid.fallback = FallbackSemigroup
Monoid.first = FirstMonoid
Monoid.object = ObjectMonoid
Monoid.set = SetMonoid

interface OpticLike extends BinaryFn { [symbol.tag]?: unknown }

function tag<Tag extends keyof any>(tag: Tag, x: BinaryFn): Optic
function tag(tag: string, x: OpticLike): BinaryFn {
  return (
    x[symbol.tag] = tag,
    x
  )
}

export const id = tag(
  'Identity',
  (_P, optic) => optic
)

export function lens(view: UnaryFn, update: UnaryFn): Optic {
  const out = tag(
    'Lens',
    (P: Profunctor, optic: Optic) => P.dimap(
      (x: unknown) => [view(x), x],
      update,
      P.first(optic)
    )
  )
  return out
}

export function prism(match: UnaryFn, embed: UnaryFn): Optic {
  const out = tag(
    'Prism',
    (P: Profunctor, optic: any) => P.dimap(
      match,
      Either.either(fn.identity, embed),
      P.right(optic, 'void')
    )
  )
  return out
}

export const traverse = tag(
  'Traversal',
  (P: Profunctor, optic: any): Optic => P.dimap(
    fn.identity,
    fn.identity,
    P.wander(optic)
  ),
)

export function iso(there: UnaryFn, back: UnaryFn): Optic {
  const out = tag(
    'Iso',
    (P: Profunctor, optic: any): Optic => P.dimap(
      there,
      back,
      optic
    )
  )
  return Object_assign(out, { [symbol.top]: 'iso' })
}

export function modify(optic: any, fn: UnaryFn, source: any): any {
  return optic(Profunctor.arrow, fn)(source)
}

export function set(optic: Optic, update: any, source: any): any
export function set(optic: BinaryFn, update: any, source: any): any
export function set(optic: any, update: any, source: any): any {
  return optic(Profunctor.arrow, () => update)(source)
}

export function get(optic: any, source: any): any {
  return optic(Profunctor.const({}), fn.identity)(source)
}

export function preview(optic: any, source: any): any {
  return optic(Profunctor.const(Monoid.first), fn.identity)(source)
}

export function prop(key: keyof any): Optic {
  const out = lens(
    (source: any) => {
      return source?.[key]
      // return source?.[key] ?? symbol.notfound
    },
    ([value, data]: [any, any]) => {
      if (Array.isArray(data)) {
        const index = typeof key === 'string' ? Number_parseInt(key) : key
        if (!Number_isSafeInteger(index)) {
          throw Error(`'prop' optic received an array and a non-integer offset`)
        }
        else
          return data.slice(0, index).concat(value).concat(data.slice(index + 1))
      } else {
        return {
          ...data,
          [key]: value,
        }
      }
    }
  )
  return Object_assign(out, { key, [symbol.top]: 'prop' })
}

export function nonNullableProp(key: keyof any): Optic {
  const out = lens(
    (source: any) => {
      return source?.[key]
      // return source?.[key] ?? symbol.notfound
    },
    ([value, data]: [any, any]) => {
      if (Array.isArray(data) && Number_isSafeInteger(key)) {
        // const index = typeof key === 'string' ? Number_parseInt(key) : key
        // if (!Number_isSafeInteger(index)) {
        //   console.log(`'nonNullableProp' optic received an array and a non-integer offset, index: `, index)
        //   throw Error(`'nonNullableProp' optic received an array and a non-integer offset`)
        // }
        // else
        return data.slice(0, key).concat(value).concat(data.slice(key + 1))
      } else {
        return value == null ? data : {
          ...data,
          [key]: value,
        }
      }
    }
  )

  return Object_assign(out, { [symbol.top]: 'nonNullableProp', key })
}

export function propOr(fallback: unknown, key: string | number): Optic {
  const out = lens(
    (src: any) => isMissing(src?.[key]) ? fallback : src?.[key],
    ([value, source]: [any, any]) => ({ ...source, [key]: value })
  )
  return Object_assign(out, { [symbol.top]: 'propOr', fallback, key })
}

export function pick(keys: string[]): Optic {
  const out = lens(
    (source: any) => {
      const value: any = {}
      for (const key of keys) {
        value[key] = source[key]
      }
      return value
    },
    ([value, source]: [any, any]) => {
      const result = { ...source }
      for (const key of keys) {
        delete result[key]
      }
      return Object_assign(result, value)
    }
  )
  return Object_assign(out, { [symbol.top]: 'pick', keys })
}

export function nth(n: number): Optic {
  const out = lens(
    (value) => value[n],
    ([value, source]) => {
      const result = source.slice()
      result[n] = value
      return result
    }
  )
  return Object_assign(out, { [symbol.top]: 'nth', nth: n })
}

export function when(pred: (x: any) => boolean): Optic {
  const out = prism(
    (x: any) => (pred(x) ? Either.right(x) : Either.left(x)),
    fn.identity,
  )
  return Object_assign(out, { [symbol.top]: 'when' })
}

export function otherwise(pred: (x: any) => boolean, otherwise: unknown): Optic {
  const out = prism(
    (x: any) => Either.right(pred(x) ? x : otherwise),
    (x: any) => pred(x) ? x : otherwise,
  )
  return Object_assign(out, { [symbol.top]: 'otherwise', fallback: otherwise })
}

export function collect(optic: any) {
  return (source: any): any => optic(
    Profunctor.const(Monoid.any),
    (x: any) => { return [x] }
  )(source)
}

export function scavenge(fallback: any, optic: any, source: any): any {
  return optic(Profunctor.const(Monoid.fallback(fallback)), (x: any) => [x])(source)
}

export function compose(optic1: Optic, optic2: Optic, optic3?: Optic): Optic {
  switch (arguments.length) {
    case 2: {
      const next = (P: Profunctor, optic: Optic) =>
        optic1(P, optic2(P, optic))
        ; (next as any)[symbol.tag] = Lattice[optic1[symbol.tag]][optic2[symbol.tag]]!
        ; (next as any)._removable = optic2._removable || false
      return next as Optic
    }
    default: {
      const tag1 = Lattice[optic1[symbol.tag]][optic2[symbol.tag]]!
      const next = (P: Profunctor, optic: Optic) =>
        optic1(P, optic2(P, optic3!(P, optic)))
        ; (next as any)[symbol.tag] = Lattice[tag1][optic3![symbol.tag]]!
        ; (next as any)._removable = optic3!._removable || false
      return next as Optic
    }
  }
}

/** @internal */
function compose1(optic1: any, optic2: any) {
  const result = (P: Profunctor, optic: any) => optic1(P, optic2(P, optic))
  result[symbol.tag] = Lattice[optic1[symbol.tag] as Optic.Type][optic2[symbol.tag] as Optic.Type]
  result._removable = optic2._removable ?? undefined
  return result
}

export function pipe<T extends Optic[]>(
  ...args: T
): Optic {
  const [optic, ...rest] = args
  if (!rest.length) return optic
  return compose1(optic, pipe(...(rest)))
}
