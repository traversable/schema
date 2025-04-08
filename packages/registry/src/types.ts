export type * from './functor.js'
export type * from './hkt.js'
export type * from './newtype.js'
export { Match } from './satisfies.js'

// data types
export type Primitive = null | undefined | symbol | boolean | bigint | number | string
export type Showable = null | undefined | boolean | bigint | number | string
export type Entry<T> = readonly [k: string, v: T]
export type Entries<T = unknown> = readonly Entry<T>[]
export type Unknown = {} | null | undefined

// transforms
export type Force<T> = never | { -readonly [K in keyof T]: T[K] }
export type Intersect<X, _ = unknown> = X extends readonly [infer H, ...infer T] ? Intersect<T, _ & H> : _
export type Autocomplete<T> = T | (string & {})

export type PickIfDefined<
  T,
  K extends keyof any,
  _ extends keyof T = K extends keyof T ? undefined extends T[K] ? never : K : never
> = never | { [K in _]: T[K] }

// infererence
export type Param<T> = T extends (_: infer I) => unknown ? I : never
export type Parameters<T> = T extends (..._: infer I) => unknown ? I : never
export type Returns<T> = T extends (_: never) => infer O ? O : never
export type Conform<S, T, U, _ extends Extract<S, T> = Extract<S, T>> = [_] extends [never] ? Extract<U, S> : _
export type Target<S> = S extends (_: any) => _ is infer T ? T : never

export type UnionToIntersection<
  T,
  U = (T extends T ? (contra: T) => void : never) extends (contra: infer U) => void ? U : never,
> = U

export type UnionToTuple<U, _ = Thunk<U> extends () => infer X ? X : never> = UnionToTuple.loop<[], U, _>
export declare namespace UnionToTuple {
  type loop<Todo extends readonly unknown[], U, _ = Thunk<U> extends () => infer X ? X : never> = [
    U,
  ] extends [never]
    ? Todo
    : loop<[_, ...Todo], Exclude<U, _>>
}

type Thunk<U> = (U extends U ? (_: () => U) => void : never) extends (_: infer _) => void ? _ : never

export type Join<
  T,
  D extends string,
  Out extends string = ''
> = T extends [infer H extends string, ...infer T]
  ? Join<T, D, `${Out extends '' ? '' : `${Out}${D}`}${H}`>
  : Out
