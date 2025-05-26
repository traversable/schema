import { Either, fn, Number_isSafeInteger, Number_parseInt, Object_assign, Object_create, Object_entries, symbol } from '@traversable/registry'

type UnaryFn = (x: any) => any
type BinaryFn = (x: any, y: any) => any
type Profunctor = any


export interface Optic {
  [symbol.tag]: Optic.Type
  _removable?: true
  (P: Profunctor, optic: Optic): any
}

export declare namespace Optic {
  type Type = keyof Lattice
}

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

const either
  : <E, S, T>(mapLeft: (value: E) => T, mapRight: (value: S) => T, x: Either<E, S>) => T
  = (mapLeft, mapRight, x) => (x._tag === 'Either::Left' ? mapLeft(x.left) : mapRight(x.right))

export function Profunctor() {}
Profunctor.function = {
  dimap(sa: UnaryFn, bt: UnaryFn, ab: UnaryFn) { return (x: any) => bt(ab(sa(x))) },
  first(f: UnaryFn) { return ([x, y]: [any, any]) => [f(x), y] },
  right(f: UnaryFn) { return (x: Either<any, any>): Either<any, any> => Either.isLeft(x) ? x : Either.right(f(x.right)) },
  wander(f: any) { return (xs: { [x: number]: unknown }) => fn.map(xs, f) },
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
  (_P: Profunctor, optic: any) => optic
)

export function lens(view: UnaryFn, update: UnaryFn): Optic {
  return tag(
    'Lens',
    (P: Profunctor, optic: Optic) => P.dimap(
      (x: unknown) => [view(x), x],
      update,
      P.first(optic)
    )
  )
}

export function prism(match: UnaryFn, embed: UnaryFn): Optic {
  return tag(
    'Prism',
    (P: Profunctor, optic: any) => P.dimap(
      match,
      (x: any) => either(fn.identity, embed, x),
      P.right(optic, 'void')
    )
  )
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
  return tag(
    'Iso',
    (P: Profunctor, optic: any): Optic => P.dimap(
      there,
      back,
      optic
    )
  )
}

export const modify = (optic: any, fn: UnaryFn, source: any): any => optic(Profunctor.function, fn)(source)

export function set(optic: Optic, update: any, source: any): any
export function set(optic: BinaryFn, update: any, source: any): any
export function set(optic: any, update: any, source: any): any {
  return optic(Profunctor.function, () => update)(source)
}

export function get(optic: any, source: any): any {
  return optic(Profunctor.const({}), fn.identity)(source)
}

export const preview = (optic: any, source: any): any => optic(Profunctor.const(Monoid.first), fn.identity)(source)

export const prop = (k: string | number): Optic => lens(
  (source: any) => {
    return source?.[k]
    // return source?.[k] ?? symbol.notfound
  },
  ([value, data]: [any, any]) => {
    if (Array.isArray(data)) {
      const index = typeof k === 'string' ? Number_parseInt(k) : k
      if (!Number_isSafeInteger(index))
        throw Error(`'prop' optic received an array and a non-integer offset`)
      else
        return data.slice(0, index).concat(value).concat(data.slice(index + 1))
    } else {
      return {
        ...data,
        [k]: value,
      }
    }
  }
)

const isMissing = (x: unknown) => x === undefined || x === symbol.notfound

export const propOr = (fallback: unknown, key: string): Optic => lens(
  (src: any) => isMissing(src?.[key]) ? fallback : src?.[key],
  ([value, source]: [any, any]) => ({ ...source, [key]: value })
)


export const pick = (keys: string[]): Optic => lens(
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

export const nth = (n: number): Optic => lens(
  (value) => value[n],
  ([value, source]) => {
    const result = source.slice()
    result[n] = value
    return result
  }
)

export const when = (pred: (x: any) => boolean): Optic => prism(
  (x: any) => (pred(x) ? Either.right(x) : Either.left(x)),
  fn.identity,
)

export function collect(optic: any) {
  return (source: any): any => optic(
    Profunctor.const(Monoid.any),
    (x: any) => { return [x] }
  )(source)
}

export const scavenge = (fallback: any, optic: any, source: any): any => optic(Profunctor.const(Monoid.fallback(fallback)), (x: any) => [x])(source)

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
  result._removable = optic2._removable || undefined
  return result
}

export function pipe<T extends Optic[]>(
  ...args: T
): Optic {
  const [first, ...rest] = args
  const optic = typeof first === 'string' ? prop(first) : first
  if (!rest.length) return optic as any
  return compose1(optic, pipe(...(rest as any))) as any
}

