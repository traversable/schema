import type { newtype } from './newtype.js'

export interface HKT<I = unknown, O = unknown> extends newtype<{ [0]: I, [-1]: O }> { _applied?: unknown }

export type Kind<F extends HKT, T extends F[0] = F[0]> = (F & { [0]: T })[-1]

export declare namespace Kind {
  export type infer<G extends HKT> = G extends
    & { [0]: G[0 & keyof G]; _applied: G["_applied" & keyof G] }
    & (infer F extends HKT)
    ? F
    : never
}

export interface Const<T = unknown> extends HKT { [-1]: T }

export interface Identity extends HKT { [-1]: this[0] }
