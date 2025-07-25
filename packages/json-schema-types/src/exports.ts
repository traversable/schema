export * from './version.js'

export * from './types.js'
export * from './utils.js'
export * as F from './functor.js'

export type { Algebra, CompilerIndex, Index } from './functor.js'
export { CompilerFunctor, Functor, fold, defaultCompilerIndex, defaultIndex } from './functor.js'

export { check, checkJson } from './check.js'
export { toType } from './to-type.js'
export { TypeName, TypeNames } from './typename.js'
