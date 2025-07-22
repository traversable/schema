export * from './version.js'

export type JsonSchema<T = never> = import('./types.js').JsonSchema<T>
export * as JsonSchema from './types.js'
export { TypeName, TypeNames } from './typename.js'
export type { Algebra, Index } from './functor.js'
export { Functor, fold, defaultIndex } from './functor.js'
export { check, checkJson } from './check.js'
