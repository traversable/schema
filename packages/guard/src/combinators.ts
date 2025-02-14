import { URI, symbol as Symbol } from './uri.js'
import * as p from './predicates.js'
import type { type as t } from './type.js'
import type { Force, Guard, _, Predicate } from './types.js'

/** @internal */
const Object_hasOwnProperty = globalThis.Object.prototype.hasOwnProperty
/** @internal */
const Object_keys = globalThis.Object.keys
/** @internal */
/** @internal */
const isObject
  : (u: unknown) => u is { [x: string]: unknown }
  = (u): u is never => !!u && typeof u === "object"
const isComposite = <T>(u: unknown): u is { [x: string]: T } => !!u && typeof u === "object"

/** @internal */
const descriptor = { enumerable: true, configurable: false, writable: false } satisfies PropertyDescriptor
/** @internal */
const Object_defineProperties = globalThis.Object.defineProperties
/** @internal */
function bind<T extends { [x: string]: _ }, S>(props: T, base: S): S & T
function bind<T extends { [x: string]: _ }, S>(props: T, base: S) {
  return Object_defineProperties(
    base,
    Object.fromEntries(Object.keys(props).map(
      (k) => [k, { ...descriptor, value: props[k] }]
    ))
  )
}
/** @internal */
function hasOwn<K extends keyof any>(u: unknown, key: K): u is { [P in K]: unknown }
function hasOwn(u: unknown, key: keyof any): u is { [x: string]: unknown } {
  return typeof key === "symbol"
    ? isComposite(u) && key in u
    : Object_hasOwnProperty.call(u, key)
}

export interface TypeGuard<T = unknown> { (u: unknown): u is T, [Symbol.def]?: _ }

interface guard<S, T extends S> { (src: S): src is T }
type target<S>
  = S extends { [Symbol.def]: _ } ? S[Symbol.def]
  : S extends () => true ? t.any
  : S extends () => false ? t.never
  : S extends Guard<infer T> ? t.inline<T>
  : S extends Predicate ? t.unknown
  : S

// type target<S>
//   = S extends optional<any> ? S
//   : S extends { [Symbol.def]: infer T } ? T
//   : S extends () => true ? unknown
//   : S extends () => false ? never
//   : S extends Guard<infer T> ? T
//   : S extends Predicate<infer T> ? T
//   : S
type extract<S>
  = S extends optional<infer T> ? T
  : S extends t<infer T> ? T
  : S[Symbol.type & keyof S]
//  extends { [Symbol.type]: infer T } ? T
// : S

function has$<K extends string>(keyGuard: (k: string) => k is K): (u: unknown) => u is Record<K, unknown> {
  return (u: unknown): u is never => !!u && typeof u === 'object' && Object_keys(u).find(keyGuard) !== undefined
}

declare namespace schema {
  type infer<T> = T extends (u: any) => u is infer S ? S : never
  interface Options {
    exactOptionalPropertyTypes?: boolean
  }
}

namespace schema {
  export const defaults = {
    exactOptionalPropertyTypes: false,
  } satisfies globalThis.Required<schema.Options>
  export function isOptional<T>
    (u: unknown): u is optional<T> { return !!(u as { [x: symbol]: unknown })[Symbol.optional] }
  export function isRequired<T>
    (u: unknown): u is (_: unknown) => _ is T { return !schema.isOptional(u) }
  export function isOptionalNotUndefined<T>
    (u: unknown): u is optional<T> {
    return schema.isOptional(u) && u(undefined) === false
  }
  export function validateShape<T extends { [x: number]: (u: any) => boolean }>
    (shape: T, u: { [x: number]: unknown }): boolean
  export function validateShape<T extends { [x: string]: (u: any) => boolean }>
    (shape: T, u: { [x: string]: unknown }): boolean
  export function validateShape<T extends { [x: number]: (u: any) => boolean }>
    (shape: T, u: object): boolean
  export function validateShape<T extends { [x: string]: (u: any) => boolean }>
    (shape: T, u: {} | { [x: string]: unknown }) {
    for (const k in shape) {
      const check = shape[k]
      switch (true) {
        case schema.isOptional(shape[k]) && !hasOwn(u, k): continue
        case schema.isOptional(shape[k]) && hasOwn(u, k) && u[k] === undefined: continue
        case schema.isOptional(shape[k]) && hasOwn(u, k) && check(u[k]): continue
        case schema.isOptional(shape[k]) && hasOwn(u, k) && !check(u[k]): return false
        case schema.isRequired(shape[k]) && !hasOwn(u, k): return false
        case schema.isRequired(shape[k]) && hasOwn(u, k) && check(u[k]) === true: continue
        case hasOwn(u, k) && check(u[k]) === true: continue
        default: return false
        // )
        // throw globalThis.Error("in 'validateShape': illegal state")
        // TODO: remove this check and `continue` in default (for the semantics, not behavior) 
        // after you've verified that you haven't missed any cases
        // case hasOwn(u, k) && check(u[k]): continue
        // default: continue
      }
    }
    return true
  }
  export function validateShapeEOPT<T extends { [x: string]: (u: any) => boolean }>
    (shape: T, u: Record<string, unknown>): boolean
  export function validateShapeEOPT<T extends { [x: number]: (u: any) => boolean }>
    (shape: T, u: Record<string, unknown>): boolean
  export function validateShapeEOPT<T extends { [x: string]: (u: any) => boolean }>
    (shape: T, u: Record<string, unknown>) {
    for (const k in shape) {
      const check = shape[k]
      switch (true) {
        case schema.isOptionalNotUndefined(check) && hasOwn(u, k) && u[k] === undefined: return false
        case schema.isOptional(check) && !hasOwn(u, k): continue
        case !check(u[k]): return false
        default: continue
      }
    }
    return true
  }
}


/////////////////////////
///    combinators    ///
const or$ = <S, T>(f: (u: unknown) => u is S, g: (u: unknown) => u is T) => (u: unknown): u is S | T => f(u) || g(u)
const and$ = <S, T>(f: (u: unknown) => u is S, g: (u: unknown) => u is T) => (u: unknown): u is S & T => f(u) && g(u)

// const allOf$ = <S extends readonly Guard[], T = AllOf<S>>(...guards: [...S]) => (u: unknown): u is T => guards.every((f) => f(u))
const keyOf$ = <T extends {}>(keyable: T) => (u: unknown): u is keyof T => p.key(u) && hasOwn(keyable, u)

function intersect<F extends readonly Guard[], T extends intersect.reify<F>>(...guard: F): intersect<T>
function intersect<F extends readonly Predicate[], T extends intersect.reify<F>>(...predicate: [...F]): intersect<T>
function intersect<F extends readonly TypeGuard[]>(...fs: [...F]): {} {
  return bind(
    { [Symbol.tag]: URI.intersect, [Symbol.def]: fs.map((f) => f[Symbol.def]) },
    function intersect(src: _) { return fs.some((f) => f(src)) }
  )
}
interface intersect<T> extends guard<_, intersect.apply<T>>, intersect.def<T> { }
interface intersect<T> extends guard<_, intersect.apply<T>>, intersect.def<T> { }
declare namespace intersect {
  interface def<T> { [Symbol.tag]: Symbol.intersect, [Symbol.def]: target<T> }
  type reify<T> = { [ix in keyof T]: target<T[ix]> }
  type apply<T> = intersect<T>
  type intersect<S, O = unknown> = S extends readonly [infer H, ...infer T] ? intersect<T, O & extract<H>> : O
}

const z = intersect(object$({ a: p.boolean }), object$({ b: p.number }))
const y = z[Symbol.def]

const o = object$({ a: p.boolean })
const pp = o[Symbol.type]


function union<F extends readonly Guard[], T extends union.reify<F>>(...guard: F): union<T>
function union<F extends readonly Predicate[], T extends union.reify<F>>(...predicate: [...F]): union<T>
function union<F extends readonly TypeGuard[]>(...fs: [...F]): {} {
  return bind(
    { [Symbol.tag]: URI.union, [Symbol.def]: fs.map((f) => f[Symbol.def]) },
    function union(src: _) { return fs.some((f) => f(src)) }
  )
}
interface union<T> extends guard<_, union.apply<T>>, union.def<T> { }
interface union<T> extends guard<_, union.apply<T>>, union.def<T> { }
declare namespace union {
  interface def<T> { [Symbol.tag]: Symbol.union, [Symbol.def]: target<T> }
  type reify<T> = { [ix in keyof T]: target<T[ix]> }
  type apply<T> = extract<T[number & keyof T]>
}

// (u: unknown): u is T => guards.some((f) => f(u))

interface array<T> extends guard<_, array.apply<T>>, array.def<T> { }
function array<F extends Guard, T extends array.reify<F>>(guard: F): array<T>
function array<F extends TypeGuard>(f: F) {
  return bind(
    { [Symbol.tag]: Symbol.array, [Symbol.def]: f[Symbol.def] },
    function array(src: _) { return p.array(src) && src.every(f) }
  )
}
declare namespace array {
  interface def<T> { [Symbol.tag]: Symbol.array, [Symbol.def]: target<T> }
  type apply<T> = never | readonly extract<T>[]
  type reify<T> = never | target<T>
}

function record<F extends Guard, T extends record.reify<F>>(guard: F): record<T>
function record<F extends Predicate, T extends record.reify<F>>(guard: F): record<T>
function record<F extends TypeGuard>(f: F) {
  return bind(
    { [Symbol.tag]: Symbol.record, [Symbol.def]: f[Symbol.def] },
    function record(src: _) { return p.object(src) && Object.values(src).every(f) }
  )
}
interface record<T> extends guard<_, record.apply<T>>, record.def<T> { }
declare namespace record {
  interface def<T> { [Symbol.tag]: Symbol.record, [Symbol.def]: target<T> }
  type reify<T> = never | target<T>
  type apply<T, S extends extract<T> = extract<T>> = never | Record<string, S>
}

function tuple<F extends readonly Guard[], T extends tuple.reify<F>>(...guard: F): tuple<T>
function tuple<F extends readonly Predicate[], T extends tuple.reify<F>>(...guard: F): tuple<T>
function tuple<F extends readonly TypeGuard[]>(...fs: F): {} {
  return bind(
    { [Symbol.tag]: URI.tuple, [Symbol.def]: fs.map((f) => f[Symbol.def]) },
    function tuple(src: _) { return p.array(src) && fs.reduce((acc, f, ix) => acc && f(src[ix]), true) }
  )
}
interface tuple<T> extends guard<_, tuple.apply<T>>, tuple.def<T> { }
declare namespace tuple {
  interface def<T> {
    [Symbol.tag]: URI.tuple
    [Symbol.def]: { [ix in keyof T]: target<T[ix]> }
    [Symbol.type]: T[Symbol.type & keyof T]

  }
  type reify<T> = never | { [ix in keyof T]: target<T[ix]> }
  type apply<T, S extends { [ix in keyof T]: extract<T[ix]> } = { [ix in keyof T]: extract<T[ix]> }> = never | S
}


/**
 * ## {@link optional `optional`}
 */
function optional<F extends Guard, T extends optional.reify<F>>(guard: F): optional<T>
function optional<F extends Predicate, T extends optional.reify<F>>(predicate: F): optional<T>
function optional(f: TypeGuard) {
  return bind({
    [Symbol.tag]: URI.optional,
    [Symbol.def]: f[Symbol.def]
  }, function optional(src: unknown) { return f(src) })
}

interface optional<T> extends guard<_, optional.apply<T>>, optional.def<T> { }

const zz = optional(p.boolean)[Symbol.def][Symbol.type]

declare namespace optional {
  interface def<T> {
    [Symbol.tag]: URI.optional
    [Symbol.def]: t.optional<T>
    [Symbol.type]: apply<T>
  }

  type reify<T> = target<T>
  type apply<T> = T[Symbol.type & keyof T]
}


declare namespace object$ {
  type Options = { [K in keyof schema.Options]: schema.Options[K] }
}

interface object$<T extends {}> extends guard<_, object$.apply<T>>, object$.def<T> { }

/**
 * ## {@link object$ `object`} 
 */
function object$<
  const F extends { [x: string]: Guard },
  T extends object$.reify<F> = object$.reify<F>,
>(
  guards: F,
  options?: object$.Options
): object$<T>

function object$<
  const F extends { [x: string]: Predicate },
  T extends object$.reify<F> = object$.reify<F>
>(
  predicates: F,
  options?: object$.Options
): object$<T>

function object$<T extends { [x: string]: (u: any) => boolean }>(
  qs: T,
  _: object$.Options = object$.defaults,
) {
  const def: Record<string, unknown> = {}
  for (const k in qs) def[k] = Symbol.def in qs[k] ? qs[k][Symbol.def] : qs[k]
  return bind(
    { [Symbol.def]: def },
    function object(u: unknown): boolean {
      switch (true) {
        case u === null: return false
        case !isObject(u): return false
        case _.exactOptionalPropertyTypes: return schema.validateShapeEOPT(qs, u)
        case !_.exactOptionalPropertyTypes: return schema.validateShape(qs, u)
        default: throw globalThis.Error("in 'objectGuard': illegal state")
      }
    }
  )
}

void (object$[Symbol.tag] = URI.object)
void (object$.defaults = schema.defaults satisfies globalThis.Required<object$.Options>)

declare namespace object$ {
  interface def<T> {
    [Symbol.def]: t.object<T>
    [Symbol.tag]: URI.object
    [Symbol.type]: apply<T>
  }

  type OptionalKeys<T, K extends keyof T = keyof T>
    = K extends K
    ? T[K] extends () => false ? never : T[K] extends t.optional<_> ? K
    : never : never
  type Optional<T, _ extends OptionalKeys<T> = OptionalKeys<T>> = never | { -readonly [K in _]+?: T[K][Symbol.type & keyof T[K]] }
  type Required<
    T,
    _ extends
    | Exclude<keyof T, OptionalKeys<T>>
    = Exclude<keyof T, OptionalKeys<T>>
  > = never | { -readonly [K in _]: T[K][Symbol.type & keyof T[K]] }

  type reify<
    T,
    S extends
    | { -readonly [K in keyof T]: target<T[K]> }
    = { -readonly [K in keyof T]: target<T[K]> }
  > = never | S

  type apply<
    T,
    S extends
    | Force<Optional<T> & Required<T>>
    = Force<Optional<T> & Required<T>>
  > = never | S
}

// type Pick<T, K extends keyof T> = never | { [P in K]: T[P] }
// type Part<T, K extends keyof T> = never | { [P in K]+?: Target<T[P]> }


const out = object$({
  a: optional(p.boolean),
  z: p.boolean,
  b: (u) => u === 123,
  c: () => true,
  d: () => false,
  e: () => Math.random() > 0.5,
  f: object$({ g: optional(object$({ h: p.number })) })
});

const zzy = optional(p.boolean)[Symbol.def][Symbol.type]

out
const ysd = out[Symbol.def]
const yst = out[Symbol.tag]
const ytt = out[Symbol.type]

out

out


type labels = {
  REQ: {
    1: readonly [ǃ: _]
    2: readonly [ǃ: _, ǃ: _]
    3: readonly [ǃ: _, ǃ: _, ǃ: _]
    4: readonly [ǃ: _, ǃ: _, ǃ: _, ǃ: _]
    5: readonly [ǃ: _, ǃ: _, ǃ: _, ǃ: _, ǃ: _]
    6: readonly [ǃ: _, ǃ: _, ǃ: _, ǃ: _, ǃ: _, ǃ: _]
    7: readonly [ǃ: _, ǃ: _, ǃ: _, ǃ: _, ǃ: _, ǃ: _, ǃ: _]
    8: readonly [ǃ: _, ǃ: _, ǃ: _, ǃ: _, ǃ: _, ǃ: _, ǃ: _, ǃ: _]
    9: readonly [ǃ: _, ǃ: _, ǃ: _, ǃ: _, ǃ: _, ǃ: _, ǃ: _, ǃ: _, ǃ: _]
  }
  OPT: {
    1: readonly [ʔ: _]
    2: readonly [ʔ: _, ʔ: _]
    3: readonly [ʔ: _, ʔ: _, ʔ: _]
    4: readonly [ʔ: _, ʔ: _, ʔ: _, ʔ: _]
    5: readonly [ʔ: _, ʔ: _, ʔ: _, ʔ: _, ʔ: _]
    6: readonly [ʔ: _, ʔ: _, ʔ: _, ʔ: _, ʔ: _, ʔ: _]
    7: readonly [ʔ: _, ʔ: _, ʔ: _, ʔ: _, ʔ: _, ʔ: _, ʔ: _]
    8: readonly [ʔ: _, ʔ: _, ʔ: _, ʔ: _, ʔ: _, ʔ: _, ʔ: _, ʔ: _]
    9: readonly [ʔ: _, ʔ: _, ʔ: _, ʔ: _, ʔ: _, ʔ: _, ʔ: _, ʔ: _, ʔ: _]
  }
}

type label<Todo extends readonly _[], R extends readonly _[] = []>
  = [Todo] extends [readonly [infer H extends {} | null, ...infer T]] ? label<T, [...R, H]>
  : [Todo] extends [readonly [_?: _, ..._[]]] ? [...req<R>, ...opt<globalThis.Required<Todo>>]
  : Todo

type req<
  T extends readonly _[],
  xs extends
  | labels['REQ'][T['length'] & keyof labels['REQ']]
  = labels['REQ'][T['length'] & keyof labels['REQ']]
> = [xs] extends [never] ? T : { [ix in keyof xs]: T[ix & keyof T] }

type opt<
  T extends readonly _[],
  xs extends
  | labels['OPT'][T['length'] & keyof labels['OPT']]
  = labels['OPT'][T['length'] & keyof labels['OPT']]
> = [xs] extends [never] ? T : { [ix in keyof xs]: T[ix & keyof T] }

type __req__ = label<[0, _?: 10, _?: 20]>
