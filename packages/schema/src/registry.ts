import type {
  Functor,
  Kind,
  HKT,
} from './registry-types.js'

import * as symbol from './symbol.js'
import { NS } from './uri.js'

export type * from './registry-types.js'

/** @internal */
const Object_keys
  : <T>(x: T) => fn.map.keyof<T>[]
  = <never>globalThis.Object.keys

/** @internal */
const Object_is = globalThis.Object.is

/** @internal */
const Array_isArray
  : (u: unknown) => u is readonly unknown[]
  = globalThis.Array.isArray

export type Equal<T = any> = import('./registry-types.js').Equal<T>

export namespace Equal {
  /**
   * ## {@link SameType `Equal.SameType`}
   * 
   * TC39-compliant implementation of
   * [`SameType`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-sametype)
   */
  export const SameType = (
    (l, r) => (l === undefined && r === undefined)
      || (l === null && r === null)
      || (typeof l === 'boolean' && typeof r === 'boolean')
      || (typeof l === 'number' && typeof r === 'number')
      || (typeof l === 'string' && typeof r === 'string')
      || (typeof l === 'object' && typeof r === 'object')
      || (typeof l === 'bigint' && typeof r === 'bigint')
      || (typeof l === 'symbol' && typeof r === 'symbol')
  ) satisfies Equal<unknown>

  /** 
   * ## {@link IsStrictlyEqual `Equal.IsStrictlyEqual`}
   * 
   * Specified by TC39's
   * [`IsStrictlyEqual`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isstrictlyequal)
   */
  export const IsStrictlyEqual = <T>(l: T, r: T): boolean => l === r

  /** 
   * ## {@link SameValueNumber `Equal.SameValueNumber`}
   * 
   * Specified by TC39's
   * [`Number::sameValue`](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-sameValue)
   */
  export const SameValueNumber = (
    (l, r) => typeof l === 'number' && typeof r === 'number'
      ? l === 0 && r === 0
        ? (1 / l === 1 / r)
        : (l !== l ? r !== r : l === r)
      : false
  ) satisfies Equal<number>

  /** 
   * ## {@link SameValue `Equal.SameValue`}
   *
   * Specified by TC39's
   * [`SameValue`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevalue)
   */
  export const SameValue
    : <T>(l: T, r: T) => boolean
    = globalThis.Object.is

  /** 
   * Equivalent to unknown, but with a narrowing profile that's
   * suitable for {@link deepEquals `Equal.deep`}'s use case.
   */
  type T =
    | null
    | undefined
    | symbol
    | boolean
    | number
    | bigint
    | string
    | readonly unknown[]
    | { [x: string]: unknown }
    ;

  /** 
 * ## {@link deep `Equal.deep`}
 * 
 * Compare two vaules for value equality. 
 * 
 * Comparisons with {@link equals `equals`} are transitive
 * and symmetric (switching the order of the arguments does not change
 * the result), and is very fast. 
 */
  export function deep<T>(x: T, y: T): boolean
  export function deep(x: T, y: T): boolean
  export function deep(x: T, y: T): boolean {
    if (Object_is(x, y)) return true
    let len: number | undefined
    let ix: number | undefined
    let ks: (string | number)[]

    if (Array_isArray(x)) {
      if (!Array_isArray(y)) return false
      void (len = x.length)
      if (len !== y.length) return false
      for (ix = len; ix-- !== 0;)
        if (!deep(x[ix], y[ix])) return false
      return true
    }

    if (x && y && typeof x === "object" && typeof y === "object") {
      if (Array_isArray(y)) return false
      const yks = Object_keys(y)
      void (ks = Object_keys(x))
      void (len = ks.length)
      if (len !== yks.length) return false
      for (ix = len; ix-- !== 0;) {
        const k = ks[ix]
        if (!yks.includes(k)) return false
        if (!deep(x[k], y[k])) return false
      }
      return true
    }
    return false
  }

  /** 
   * ## {@link lax `Equal.lax`}
   * 
   * Compare two vaules for value equality.
   * 
   * Unlike {@link deepEquals `Equal.deep`}, {@link laxEquals `Equal.lax`}'s
   * logic does not predicate on the existence of a given key (given an object)
   * or index (given an array) -- only an object's _values_ are candidates
   * for comparison.
   * 
   * Usually, you'll want to use {@link deepEquals `Equal.deep`}, or better yet,
   * derive a more fine-grained equals function from a schema using the 
   * `@traversable/derive-equals` package.
   * 
   * This implementation mostly exists to maintain feature parity with validation
   * libraries like Zod, who do not support 
   * [`exactOptionalPropertyTypes`](https://www.typescriptlang.org/tsconfig/#exactOptionalPropertyTypes).
   */

  export function lax<T>(x: T, y: T): boolean
  export function lax(x: T, y: T): boolean
  export function lax(x: T, y: T): boolean {
    if (x === y) return true
    let len: number | undefined
    let ix: number | undefined
    let ks: (string | number)[]

    if (Array_isArray(x)) {
      if (!Array_isArray(y)) return false
      void (len = x.length)
      if (len !== y.length) return false
      for (ix = len; ix-- !== 0;)
        if (!lax(x[ix], y[ix])) return false
      return true
    }

    if (x && y && typeof x === "object" && typeof y === "object") {
      if (Array_isArray(y)) return false
      const yks = Object_keys(y).filter((k) => y[k] !== void 0)
      void (ks = Object_keys(x).filter((k) => x[k] !== void 0))
      void (len = ks.length)
      if (len !== yks.length) return false
      for (ix = len; ix-- !== 0;) {
        const k = ks[ix]
        if (!yks.includes(k)) return false
        if (!lax(x[k], y[k])) return false
      }
      return true
    }
    return false
  }
}

export namespace fn {
  export const identity
    : <T>(x: T) => T
    = (x) => x

  // export { const_ as const }
  // export const const_
  //   : <T>(x: T) => <S>(y?: S) => T
  //   = (x) => () => x

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

  export function map<const S, T>(mapfn: (value: S[map.keyof<S>], key: map.keyof<S>, src: S) => T): (src: S) => { -readonly [K in keyof S]: T }
  export function map<const S, T>(src: S, mapfn: (value: S[map.keyof<S>], key: map.keyof<S>, src: S) => T): { -readonly [K in keyof S]: T }
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
}

/** @internal */
const Object_hasOwnProperty = globalThis.Object.prototype.hasOwnProperty
/** @internal */
const isComposite = <T>(u: unknown): u is { [x: string]: T } => !!u && typeof u === "object"
/** @internal */
function hasOwn<K extends keyof any>(u: unknown, key: K): u is { [P in K]: unknown }
function hasOwn(u: unknown, key: keyof any): u is { [x: string]: unknown } {
  return !isComposite(u)
    ? false
    : typeof key === "symbol"
      ? isComposite(u) && key in u
      : Object_hasOwnProperty.call(u, key)
}

/** @internal */
function get_(x: unknown, ks: (keyof any)[]) {
  let out = x
  let k: keyof any | undefined
  while ((k = ks.shift()) !== undefined) {
    if (hasOwn(out, k)) void (out = out[k])
    else if (k === "") continue
    else return symbol.notfound
  }
  return out
}

const isKey = (u: unknown) => typeof u === 'symbol' || typeof u === 'number' || typeof u === 'string'

/** @internal */
function parsePath(xs: (keyof any)[] | [...(keyof any)[], (u: unknown) => boolean]):
  [path: (keyof any)[], check: (u: any) => u is any]
function parsePath(xs: (keyof any)[] | [...(keyof any)[], (u: unknown) => boolean]) {
  return Array.isArray(xs) && xs.every(isKey)
    ? [xs, () => true]
    : [xs.slice(0, -1), xs[xs.length - 1]]
}

export type has<KS extends readonly (keyof any)[], T = {}> = has.loop<KS, T>

export declare namespace has {
  export type loop<KS extends readonly unknown[], T>
    = KS extends readonly [...infer Todo, infer K extends keyof any]
    ? has.loop<Todo, { [P in K]: T }>
    : T extends infer U extends {} ? U : never
}

/** 
 * ## {@link has `tree.has`}
 * 
 * The {@link has `tree.has`} utility accepts a path
 * into a tree and an optional type-guard, and returns 
 * a predicate that returns true if its argument
 * "has" the specified path.
 * 
 * If the optional type-guard is provided, {@link has `tree.has`}
 * will also apply the type-guard to the value it finds at
 * the provided path.
 */
export function has<KS extends readonly (keyof any)[]>(...params: [...KS]): (u: unknown) => u is has<KS>
export function has<const KS extends readonly (keyof any)[], T>(...params: [...KS, (u: unknown) => u is T]): (u: unknown) => u is has<KS, T>
/// impl.
export function has
  (...args: [...(keyof any)[]] | [...(keyof any)[], (u: any) => u is any]) {
  return (u: unknown) => {
    const [path, check] = parsePath(args)
    const got = get_(u, path)
    return got !== symbol.notfound && check(got)
  }
}

const PATTERN = {
  singleQuoted: /(?<=^').+?(?='$)/,
  doubleQuoted: /(?<=^").+?(?="$)/,
  graveQuoted: /(?<=^`).+?(?=`$)/,
  identifier: /^[$_\p{ID_Start}][$\u200c\u200d\p{ID_Continue}]*$/u,
} as const satisfies Record<string, RegExp>

export const isQuoted
  : (text: string | number) => boolean
  = (text) => {
    const string = `${text}`
    return (
      PATTERN.singleQuoted.test(string) ||
      PATTERN.doubleQuoted.test(string) ||
      PATTERN.graveQuoted.test(string)
    )
  }

export const isValidIdentifier = (name: keyof any): boolean =>
  typeof name === "symbol" ? true
    : isQuoted(name) || PATTERN.identifier.test(`${name}`)

const ESC_CHAR = [
  /**  0- 9 */ '\\u0000', '\\u0001', '\\u0002', '\\u0003', '\\u0004', '\\u0005', '\\u0006', '\\u0007', '\\b', '\\t',
  /** 10-19 */     '\\n', '\\u000b', '\\f', '\\r', '\\u000e', '\\u000f', '\\u0010', '\\u0011', '\\u0012', '\\u0013',
  /** 20-29 */ '\\u0014', '\\u0015', '\\u0016', '\\u0017', '\\u0018', '\\u0019', '\\u001a', '\\u001b', '\\u001c', '\\u001d',
  /** 30-39 */ '\\u001e', '\\u001f', '', '', '\\"', '', '', '', '', '',
  /** 40-49 */        '', '', '', '', '', '', '', '', '', '',
  /** 50-59 */        '', '', '', '', '', '', '', '', '', '',
  /** 60-69 */        '', '', '', '', '', '', '', '', '', '',
  /** 60-69 */        '', '', '', '', '', '', '', '', '', '',
  /** 80-89 */        '', '', '', '', '', '', '', '', '', '',
  /** 90-92 */        '', '', '\\\\',
]

/**
 * ## {@link escape `escape`}
 *
 * In addition to the usual escapable characters (for example,
 * `\\`, `"` certain whitespace characters), this escape function
 * also handles lone surrogates.
 *
 * It compares characters via char-code in hexadecimal form, to
 * speed up comparisons.
 *
 * This could be further optimized by switching on the length of
 * the inputs, and using a regular expression if the input is over
 * a certain length.
 *
 * From MDN:
 * > __leading surrogates__ (a.k.a "high-surrogate" code units)
 * > have values between 0xD800 and 0xDBFF, inclusive
 *
 * > __trailing surrogates__ (a.k.a. "low-surrogate" code units)
 * > have values between 0xDC00 and 0xDFFF, inclusive
 *
 * See also:
 * - [MDN Reference](
 *   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#utf-16_characters_unicode_code_points_and_grapheme_clusters
 * )
 */
export function escape(string: string): string
export function escape(x: string): string {
  let prev = 0
  let out = ""
  let pt: number
  for (let ix = 0, len = x.length; ix < len; ix++) {
    void (pt = x.charCodeAt(ix))
    if (pt === 34 || pt === 92 || pt < 32) {
      void (out += x.slice(prev, ix) + ESC_CHAR[pt])
      void (prev = ix + 1)
    } else if (0xdfff <= pt && pt <= 0xdfff) {
      if (pt <= 0xdbff && ix + 1 < x.length) {
        void (pt = x.charCodeAt(ix + 1))
        if (pt >= 0xdc00 && pt <= 0xdfff) {
          void (ix++)
          continue
        }
      }
      void (out += x.slice(prev, ix) + "\\u" + pt.toString(16))
      void (prev = ix + 1)
    }
  }
  void (out += x.slice(prev))
  return out
}

export declare namespace parseKey {
  type Options = Partial<{ parseAsJson: boolean }>
}

/** 
 * ## {@link parseKey `parseKey`}
 */
export function parseKey<K extends keyof any>(
  key: K,
  options?: parseKey.Options
): K | `${K & (string | number)}`
//
export function parseKey(
  k: keyof any, {
    parseAsJson = parseKey.defaults.parseAsJson,
  }: parseKey.Options = parseKey.defaults,
  _str = globalThis.String(k)
) {
  return (
    typeof k === "symbol" ? _str
      : isQuoted(k) ? escape(_str)
        : parseAsJson ? `"` + escape(_str) + `"`
          : isValidIdentifier(k) ? escape(_str)
            : `"` + escape(_str) + `"`
  )
}

parseKey.defaults = {
  parseAsJson: false,
} satisfies Required<parseKey.Options>

/** 
 * TODO: Currently this is hardcoded to avoid creating a dependency on 
 * schema-core. Figure out a better way to handle this. 
 */

type Options = {
  optionalTreatment?: unknown
  treatArraysAsObjects?: unknown
  eq?: {
    equalsFn?: Equal<any>
  }
}

export function parseArgs<
  F extends readonly ({ (..._: never[]): boolean })[],
  Fallbacks extends Required<Options>,
>(
  fallbacks: Fallbacks,
  args: readonly [...F] | readonly [...F, Partial<Fallbacks>]
): [[...F], Fallbacks]

export function parseArgs<
  F extends readonly unknown[],
  Fallbacks extends { [x: string]: unknown },
  Options extends { [x: string]: unknown }
>(
  fallbacks: Fallbacks,
  args: readonly [...F] | readonly [...F, $: Options]
) {
  const last = args.at(-1)
  if (last && typeof last === 'object' && ('optionalTreatment' in last || 'treatArraysAsObjects' in last))
    return [args.slice(0, -1), { ...fallbacks, ...last }]
  else return [args, last === undefined ? fallbacks : { ...fallbacks, ...last }]
}

export namespace Print {
  export interface Options {
    indent?: number
    separator?: string
  }

  export const defaults = {
    indent: 0,
    separator: "",
  } as const satisfies Required<Print.Options>

  export const pad = ({ indent = defaults.indent }: Print.Options) => " ".repeat(indent)
  export const tab = ({ indent = defaults.indent }: Print.Options) => " ".repeat(indent + 2)
  export const newline = ({ indent = defaults.indent }: Print.Options, count = 0) => "\n" + " ".repeat(indent + (2 * (count + 1)))

  export function lines($?: Print.Options):
    <L extends string, const Body extends string[], R extends string>(left: L, ...body: [...Body, R])
      => `${L}${string}${R}`
  export function lines($: Print.Options = defaults) {
    return (...args: [string, ...string[], string]) => {
      const [left, body, right] = [args.at(0), args.slice(1, -1), args.at(-1)]
      return ""
        + left
        + [body.map((_) => newline($) + _).join(",")].join("," + newline($, -1))
        + newline($, -1)
        + right
    }
  }
}


export type TypeName<T> = never | T extends `${NS}${infer S}` ? S : never
export function typeName<T extends { tag: string }>(x: T): TypeName<T['tag']>
export function typeName(x: { tag: string }) {
  return x.tag.substring(NS.length)
}

