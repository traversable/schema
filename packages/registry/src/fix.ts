import type { HKT, Kind } from './types.js'

export interface Fix<F extends HKT, T> { unfix: Unfix<F, T> }
export type Unfix<F extends HKT, T> = Kind<F, Fix<F, T>>

export const fix
  : <F extends HKT, T>(unfixed: Unfix<F, T>) => Fix<F, T>
  = (unfix) => ({ unfix })

export const unfix
  : <F extends HKT, T>(fixed: Fix<F, T>) => Unfix<F, T>
  = (fixed) => fixed.unfix
