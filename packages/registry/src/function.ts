import type { Functor, Kind, HKT } from './types.js'

/** @internal */
const Object_keys
  : <T>(x: T) => map.keyof<T>[]
  = <never>globalThis.Object.keys

export const identity
  : <T>(x: T) => T
  = (x) => x

export { const_ as const }
export const const_
  : <T>(x: T) => <S>(y?: S) => T
  = (x) => () => x

/** 
 * ## {@link ana `fn.ana`}
 * 
 * Short for _anamorphism_. Dual of {@link cata `fn.cata`}.
 * 
 * Repeatedly apply a "reduce" or _fold_ operation to a functor instance using 
 * co-recursion. 
 * 
 * Since the operation is co-recursive, in practice, you're typically building _up_
 * a data structure (like a tree).
 * 
 * The nice thing about using an anamorphism is that it lets you write the operation
 * without having to worry about the recursive bit. 
 * 
 * tl,dr: 
 * 
 * If you can write a `map` function for the data structure you're targeting, then
 * just give that function to {@link ana `fn.any`} along with the non-recursive
 * operation you want performed, and it will take care of repeatedly applying the
 * operation (called a "coalgebra") to the data structure, returning you the final
 * result.
 * 
 * See also:
 * - the [Wikipedia page](https://en.wikipedia.org/wiki/Anamorphism) on anamorphisms
 * - {@link cata `fn.cata`}
 */

export function ana<F extends HKT, Fixpoint>(Functor: Functor<F, Fixpoint>):
  <T>(coalgebra: Functor.Coalgebra<F, T>)
    => <S extends Fixpoint>(expr: S)
      => Kind<F, T>

/// impl.
export function ana<F extends HKT>(F: Functor<F>) {
  return <T>(coalgebra: Functor.Coalgebra<F, T>) => {
    return function loop(expr: T): Kind<F, T> {
      return F.map(loop)(coalgebra(expr))
    }
  }
}

/** 
 * # {@link cata `cata`}
 * 
 * Short for _catamorphism_. Dual of {@link ana `ana`}.
 * 
 * See also:
 * - the [Wikipedia page](https://en.wikipedia.org/wiki/Catamorphism) on catamorphisms
 * - {@link ana `ana`}
 */
export function cata<F extends HKT, Fixpoint>(Functor: Functor<F, Fixpoint>):
  <T>(algebra: Functor.Algebra<F, T>)
    => <S extends Fixpoint>(term: S)
      => T

export function cata<F extends HKT>(F: Functor<F>) {
  return <T>(algebra: Functor.Algebra<F, T>) => {
    return function loop(term: Kind<F, T>): T {
      return algebra(F.map(loop)(term))
    }
  }
}

export function cataIx
  <Ix, F extends HKT, Fixpoint>(IxFunctor: Functor.Ix<Ix, F, Fixpoint>):
  <T>(algebra: Functor.IndexedAlgebra<Ix, F, T>)
    => <S extends Fixpoint>(term: S, ix: Ix)
      => T

export function cataIx<Ix, F extends HKT, Fixpoint>(F: Functor.Ix<Ix, F, Fixpoint>) {
  return <T>(g: Functor.IndexedAlgebra<Ix, F, T>) => {
    return function loop(term: Kind<F, T>, ix: Ix): T {
      return g(F.mapWithIndex(loop)(term, ix), ix)
    }
  }
}

export function hylo
  <F extends HKT>(F: Functor<F>):
  <S, T>(
    algebra: Functor.Algebra<F, T>,
    coalgebra: Functor.Coalgebra<F, S>
  ) => (s: S)
      => T

export function hylo<F extends HKT>(Functor: Functor<F>) {
  return <S, T>(
    algebra: Functor.Algebra<F, T>,
    coalgebra: Functor.Coalgebra<F, S>
  ) => (s: S) => {
    const g = Functor.map(hylo(Functor)(algebra, coalgebra))
    return algebra(g(coalgebra(s)))
  }
}

export function para
  <F extends HKT, Fixpoint>(F: Functor<F, Fixpoint>):
  <T>(ralgebra: Functor.RAlgebra<F, T>)
    => <S extends Fixpoint>(term: S)
      => T

export function para<F extends HKT>(F: Functor<F>) {
  return <T>(ralgebra: Functor.RAlgebra<F, T>) => {
    function fanout(term: T): Kind<F, [F, T]> { return [term, para(F)(ralgebra)(term)] }
    return flow(
      F.map(fanout),
      ralgebra,
    )
  }
}

export function paraIx
  <Ix, F extends HKT, Fixpoint>(F: Functor.Ix<Ix, F, Fixpoint>):
  <T>(ralgebra: Functor.RAlgebra<F, T>)
    => <S extends Fixpoint>(term: S, ix: Ix)
      => T

export function paraIx<Ix, F extends HKT>(F: Functor.Ix<Ix, F>) {
  return <T>(ralgebra: Functor.RAlgebra<F, T>) => {
    function fanout(term: T, ix: Ix): Kind<F, [F, T]> { return [term, paraIx(F)(ralgebra)(term, ix)] }
    return flow(
      F.mapWithIndex(fanout),
      ralgebra,
    )
  }
}

export function map<const S, T>(mapfn: (value: S[map.keyof<S>], key: map.keyof<S>, src: S) => T): (src: S) => { -readonly [K in keyof S]: T }
export function map<const S, T>(src: S, mapfn: (value: S[map.keyof<S>], key: map.keyof<S>, src: S) => T): { [K in keyof S]: T }
export function map<const S, T>(
  ...args:
    | [mapfn: (value: S[keyof S], key: map.keyof<S>, src: S) => T]
    | [src: S, mapfn: (value: S[keyof S], key: map.keyof<S>, src: S) => T]
) {
  if (args.length === 1) return (src: S) => map(src, args[0])
  else {
    const [src, mapfn] = args
    if (globalThis.Array.isArray(src)) return src.map(mapfn as never)
    const keys = Object_keys(src)
    let out: { [K in keyof S]+?: T } = {}
    for (let ix = 0, len = keys.length; ix < len; ix++) {
      const k = keys[ix]
      out[k] = mapfn(src[k], k, src)
    }
    return out
  }
}

export declare namespace map {
  type keyof<
    T,
    K extends
    | keyof T & ([T] extends [readonly unknown[]] ? [number] extends [T["length"]] ? number : Extract<keyof T, `${number}`> : keyof T)
    = keyof T & ([T] extends [readonly unknown[]] ? [number] extends [T["length"]] ? number : Extract<keyof T, `${number}`> : keyof T)
  > = K;
}

export const exhaustive
  : <_ extends never = never>(..._: _[]) => _
  = (..._) => { throw Error('Exhaustive match failed') }

export const assertIsNotCalled
  : <_ extends void = void>(..._: _[]) => never
  = (..._) => { throw Error('Exhaustive match failed') }

export const fanout
  : <A, B, C>(ab: (a: A) => B, ac: (a: A) => C) => (a: A) => [B, C]
  = (ab, ac) => (a) => [ab(a), ac(a)]

export function flow<A extends readonly unknown[], B>(ab: (...a: A) => B): (...a: A) => B
export function flow<A extends readonly unknown[], B, C>(ab: (...a: A) => B, bc: (b: B) => C): (...a: A) => C
export function flow<A extends readonly unknown[], B, C, D>(ab: (...a: A) => B, bc: (b: B) => C, cd: (c: C) => D): (...a: A) => D
export function flow(
  ...args:
    | [ab: Function]
    | [ab: Function, bc: Function]
    | [ab: Function, bc: Function, cd: Function]
) {
  switch (true) {
    default: return void 0
    case args.length === 1: return args[0]
    case args.length === 2: return function (this: unknown) { return args[1](args[0].apply(this, arguments)) }
    case args.length === 3: return function (this: unknown) { return args[2](args[1](args[0].apply(this, arguments))) }
  }
}

type fn = globalThis.Function
type _ = unknown

export function pipe(): void
export function pipe<const a>(a: a): a
export function pipe<const a, b>(a: a, ab: (a: a) => b): b
export function pipe<const a, b, c>(a: a, ab: (a: a) => b, bc: (b: b) => c): c
export function pipe<const a, b, c, d>(a: a, ab: (a: a) => b, bc: (b: b) => c, cd: (c: c) => d): d
export function pipe<const a, b, c, d, e>(a: a, ab: (a: a) => b, bc: (b: b) => c, cd: (c: c) => d, de: (d: d) => e,): e
export function pipe<const a, b, c, d, e, f>(a: a, ab: (a: a) => b, bc: (b: b) => c, cd: (c: c) => d, de: (d: d) => e, ef: (e: e) => f): f
export function pipe<const a, b, c, d, e, f, g>(
  a: a,
  ab: (a: a) => b,
  bc: (b: b) => c,
  cd: (c: c) => d,
  de: (d: d) => e,
  ef: (e: e) => f,
  fg: (f: f) => g,
): g
export function pipe<const a, b, c, d, e, f, g, h>(
  a: a,
  ab: (a: a) => b,
  bc: (b: b) => c,
  cd: (c: c) => d,
  de: (d: d) => e,
  ef: (e: e) => f,
  fg: (f: f) => g,
  gh: (g: g) => h,
): h
export function pipe<const a, b, c, d, e, f, g, h, i>(
  a: a,
  ab: (a: a) => b,
  bc: (b: b) => c,
  cd: (c: c) => d,
  de: (d: d) => e,
  ef: (e: e) => f,
  fg: (f: f) => g,
  gh: (g: g) => h,
  hi: (h: h) => i,
): i
export function pipe<const a, b, c, d, e, f, g, h, i, j>(
  a: a,
  ab: (a: a) => b,
  bc: (b: b) => c,
  cd: (c: c) => d,
  de: (d: d) => e,
  ef: (e: e) => f,
  fg: (f: f) => g,
  gh: (g: g) => h,
  hi: (h: h) => i,
  ij: (i: i) => j,
): j
export function pipe<const a, b, c, d, e, f, g, h, i, j, k>(
  a: a,
  ab: (a: a) => b,
  bc: (b: b) => c,
  cd: (c: c) => d,
  de: (d: d) => e,
  ef: (e: e) => f,
  fg: (f: f) => g,
  gh: (g: g) => h,
  hi: (h: h) => i,
  ij: (i: i) => j,
  jk: (j: j) => k,
): k
export function pipe<const a, b, c, d, e, f, g, h, i, j, k, l>(
  a: a,
  ab: (a: a) => b,
  bc: (b: b) => c,
  cd: (c: c) => d,
  de: (d: d) => e,
  ef: (e: e) => f,
  fg: (f: f) => g,
  gh: (g: g) => h,
  hi: (h: h) => i,
  ij: (i: i) => j,
  jk: (j: j) => k,
  kl: (k: k) => l,
): l
export function pipe<const a, b, c, d, e, f, g, h, i, j, k, l, m>(
  a: a,
  ab: (a: a) => b,
  bc: (b: b) => c,
  cd: (c: c) => d,
  de: (d: d) => e,
  ef: (e: e) => f,
  fg: (f: f) => g,
  gh: (g: g) => h,
  hi: (h: h) => i,
  ij: (i: i) => j,
  jk: (j: j) => k,
  kl: (k: k) => l,
  lm: (l: l) => m,
): m
export function pipe<const a, b, c, d, e, f, g, h, i, j, k, l, m, n>(
  a: a,
  ab: (a: a) => b,
  bc: (b: b) => c,
  cd: (c: c) => d,
  de: (d: d) => e,
  ef: (e: e) => f,
  fg: (f: f) => g,
  gh: (g: g) => h,
  hi: (h: h) => i,
  ij: (i: i) => j,
  jk: (j: j) => k,
  kl: (k: k) => l,
  lm: (l: l) => m,
  mn: (m: m) => n,
): n
export function pipe<const a, b, c, d, e, f, g, h, i, j, k, l, m, n, o>(
  a: a,
  ab: (a: a) => b,
  bc: (b: b) => c,
  cd: (c: c) => d,
  de: (d: d) => e,
  ef: (e: e) => f,
  fg: (f: f) => g,
  gh: (g: g) => h,
  hi: (h: h) => i,
  ij: (i: i) => j,
  jk: (j: j) => k,
  kl: (k: k) => l,
  lm: (l: l) => m,
  mn: (m: m) => n,
  no: (n: n) => o,
): o
export function pipe<const a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p>(
  a: a,
  ab: (a: a) => b,
  bc: (b: b) => c,
  cd: (c: c) => d,
  de: (d: d) => e,
  ef: (e: e) => f,
  fg: (f: f) => g,
  gh: (g: g) => h,
  hi: (h: h) => i,
  ij: (i: i) => j,
  jk: (j: j) => k,
  kl: (k: k) => l,
  lm: (l: l) => m,
  mn: (m: m) => n,
  no: (n: n) => o,
  op: (o: o) => p,
): p
export function pipe<const a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q>(
  a: a,
  ab: (a: a) => b,
  bc: (b: b) => c,
  cd: (c: c) => d,
  de: (d: d) => e,
  ef: (e: e) => f,
  fg: (f: f) => g,
  gh: (g: g) => h,
  hi: (h: h) => i,
  ij: (i: i) => j,
  jk: (j: j) => k,
  kl: (k: k) => l,
  lm: (l: l) => m,
  mn: (m: m) => n,
  no: (n: n) => o,
  op: (o: o) => p,
  pq: (p: p) => q,
): q
export function pipe<const a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r>(
  a: a,
  ab: (a: a) => b,
  bc: (b: b) => c,
  cd: (c: c) => d,
  de: (d: d) => e,
  ef: (e: e) => f,
  fg: (f: f) => g,
  gh: (g: g) => h,
  hi: (h: h) => i,
  ij: (i: i) => j,
  jk: (j: j) => k,
  kl: (k: k) => l,
  lm: (l: l) => m,
  mn: (m: m) => n,
  no: (n: n) => o,
  op: (o: o) => p,
  pq: (p: p) => q,
  qr: (q: q) => r,
): r
export function pipe<const a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s>(
  a: a,
  ab: (a: a) => b,
  bc: (b: b) => c,
  cd: (c: c) => d,
  de: (d: d) => e,
  ef: (e: e) => f,
  fg: (f: f) => g,
  gh: (g: g) => h,
  hi: (h: h) => i,
  ij: (i: i) => j,
  jk: (j: j) => k,
  kl: (k: k) => l,
  lm: (l: l) => m,
  mn: (m: m) => n,
  no: (n: n) => o,
  op: (o: o) => p,
  pq: (p: p) => q,
  qr: (q: q) => r,
  rs: (r: r) => s,
): s
export function pipe<const a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t>(
  a: a,
  ab: (a: a) => b,
  bc: (b: b) => c,
  cd: (c: c) => d,
  de: (d: d) => e,
  ef: (e: e) => f,
  fg: (f: f) => g,
  gh: (g: g) => h,
  hi: (h: h) => i,
  ij: (i: i) => j,
  jk: (j: j) => k,
  kl: (k: k) => l,
  lm: (l: l) => m,
  mn: (m: m) => n,
  no: (n: n) => o,
  op: (o: o) => p,
  pq: (p: p) => q,
  qr: (q: q) => r,
  rs: (r: r) => s,
  st: (s: s) => t,
): t
export function pipe(
  ...a:
    | [_]
    | [_, fn]
    | [_, fn, fn]
    | [_, fn, fn, fn]
    | [_, fn, fn, fn, fn]
    | [_, fn, fn, fn, fn, fn]
    | [_, fn, fn, fn, fn, fn, fn]
    | [_, fn, fn, fn, fn, fn, fn, fn]
    | [_, fn, fn, fn, fn, fn, fn, fn, fn]
    | [_, fn, fn, fn, fn, fn, fn, fn, fn, fn]
    | [_, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn]
    | [_, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn]
    | [_, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn]
    | [_, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn]
    | [_, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn]
    | [_, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn]
    | [_, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn]
    | [_, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn]
    | [_, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn]
    | [_, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn, fn]
): unknown {
  switch (true) {
    case a.length === 1:
      return a[0]
    case a.length === 2:
      return a[1](a[0])
    case a.length === 3:
      return a[2](a[1](a[0]))
    case a.length === 4:
      return a[3](a[2](a[1](a[0])))
    case a.length === 5:
      return a[4](a[3](a[2](a[1](a[0]))))
    case a.length === 6:
      return a[5](a[4](a[3](a[2](a[1](a[0])))))
    case a.length === 7:
      return a[6](a[5](a[4](a[3](a[2](a[1](a[0]))))))
    case a.length === 8:
      return a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0])))))))
    case a.length === 9:
      return a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0]))))))))
    case a.length === 10:
      return a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0])))))))))
    case a.length === 11:
      return a[10](a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0]))))))))))
    case a.length === 12:
      return a[11](a[10](a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0])))))))))))
    case a.length === 13:
      return a[12](a[11](a[10](a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0]))))))))))))
    case a.length === 14:
      return a[13](a[12](a[11](a[10](a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0])))))))))))))
    case a.length === 15:
      return a[14](a[13](a[12](a[11](a[10](a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0]))))))))))))))
    case a.length === 16:
      return a[15](a[14](a[13](a[12](a[11](a[10](a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0])))))))))))))))
    case a.length === 17:
      return a[16](a[15](a[14](a[13](a[12](a[11](a[10](a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0]))))))))))))))))
    case a.length === 18:
      return a[17](a[16](a[15](a[14](a[13](a[12](a[11](a[10](a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0])))))))))))))))))
    case a.length === 19:
      return a[18](a[17](a[16](a[15](a[14](a[13](a[12](a[11](a[10](a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0]))))))))))))))))))
    case a.length === 20:
      return a[19](a[18](a[17](a[16](a[15](a[14](a[13](a[12](a[11](a[10](a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0])))))))))))))))))))
    default: {
      const args: fn[] = a
      let ret: unknown = args[0]
      for (let ix = 1, len = args.length; ix < len; ix++) ret = args[ix](ret)
      return ret
    }
  }
}
