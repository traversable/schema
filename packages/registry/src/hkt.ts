import type { newtype } from './newtype.js'
import type { Either } from './either.js'
import type { Option } from './option.js'
import type { Tuple } from './tuple.js'
import { typeclass as kind } from './symbol.js'

export interface HKT<I = unknown, O = unknown> extends newtype<{ [0]: I, [-1]: O }> {}
export interface HKT2<A = unknown, B = unknown, Z = unknown> extends newtype<{ [0]: { [0]: A, [1]: B }, [-1]: Z }> {}

export type Kind<F extends HKT, T extends F[0] = F[0]> = (F & { [0]: T })[-1]
export type Kind2<F extends HKT2, S extends F[0][0], T extends F[0][1]> = (F & { [0]: { [0]: S, [1]: T } })[-1]
export type Bind<T> = { [kind]?: T }

export type Box<F = {
  [-1]: unknown;
  /** @ts-expect-error */
}, T = unknown> = (F & {
  [0]: T;
})[-1];
export type Boxed<F> = Box.infer<F>
export declare namespace Box { export { Any as any } }
export declare namespace Box {
  type Any = Bind<any> & Partial<HKT>
  /** @ts-expect-error */
  type from<F, _ = Exclude<F[kind], undefined>> = _ extends Box.any ? _ : never
  /** 
   * ## {@link bind `Box.bind`}
   * 
   * Given a `Box` of type {@link F `F`}, instantiate a new `Box` of 
   * type {@link F `F`} bound to {@link T `T`}.
   */
  /** @ts-expect-error */
  type bind<F, T = unknown> = (Kind.infer<F> & {
    [0]: T;
  })[-1];

  type infer<F> = F extends Box.bind<F, infer T> ? T : never
  type of<T> = Bind<HKT<T>>
}

export declare namespace Kind { export { Any as any, Box as lax } }
export declare namespace Kind {
  type Product<F extends Box.any, T> = Box<F, Tuple<Box<F, T>, T>>
  type Coproduct<F extends Box.any, T> = Box<F, Either<Box<F, T>, T>>
  type infer<G> = Exclude<G[kind & keyof G], undefined>
  type of<F> = F extends Kind.apply<F, infer T> ? T : never
  type Any = Bind<any>
  /** @ts-expect-error */
  type apply<F, T = unknown, _ = Kind.infer<F>> = (_ & { [0]: T })[-1]
}

export type Identity<T> = T

export interface Comparator<in T> extends Bind<F.Comparator> { (left: T, right: T): number }
export interface Equal<in T> extends Bind<F.Equal> { (left: T, right: T): boolean }
export interface Record<T = unknown> extends Bind<F.Record> { [x: string]: T }
export interface Array<T = unknown> extends newtype<T[]>, Bind<F.Array> {}
export interface ReadonlyArray<T = unknown> extends newtype<readonly T[]>, Bind<F.Record> {}
export interface Duplicate<T = unknown> extends newtype<{ [0]: T, [1]: T }>, Bind<F.Duplicate> { [Symbol.iterator](): Iterator<T> }

export declare namespace Type {
  export {
    Array,
    Comparator,
    Duplicate,
    Either,
    Equal,
    Identity,
    Option,
    ReadonlyArray,
    Record,
    Tuple,
  }
}

export interface Const<T = unknown> extends HKT { [-1]: T }

export type { F as TypeConstructor }
export declare namespace F { export { Const } }
export declare namespace F {
  interface Array extends HKT, Bind<Type.Array<never>> { [-1]: Type.Array<this[0]> }
  interface Comparator extends HKT, Bind<Type.Comparator<never>> { [-1]: Type.Comparator<this[0]> }
  interface Duplicate extends HKT, Bind<Type.Duplicate<never>> { [-1]: Type.Duplicate<this[0]> }
  interface Either extends HKT<[unknown, unknown]>, Bind<Type.Either<never, never>> { [-1]: Type.Either<this[0][0], this[0][1]> }
  interface Equal extends HKT, Bind<Type.Equal<never>> { [-1]: Type.Equal<this[0]> }
  interface Identity extends HKT, Bind<Type.Identity<never>> { [-1]: Type.Identity<this[0]> }
  interface Option extends HKT, Bind<Type.Option<never>> { [-1]: Type.Option<this[0]> }
  interface ReadonlyArray extends HKT, Bind<Type.ReadonlyArray<never>> { [-1]: Type.ReadonlyArray<this[0]> }
  interface Record extends HKT, Bind<Type.Record<never>> { [-1]: Type.Record<this[0]> }
  interface Tuple extends HKT<[unknown, unknown]>, Bind<Type.Tuple<never, never>> { [-1]: Type.Tuple<this[0][0], this[0][1]> }
}
