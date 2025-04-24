export { VERSION } from './version.js'

export * as Seed from './seed.js'
export type Seed<T = never> = [T] extends [never]
  ? import('./seed.js').Fixpoint
  : import('./seed.js').Seed<T>

// export * as Arbitrary from './arbitrary.js'
