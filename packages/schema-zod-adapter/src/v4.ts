//////////////////////////////////////////////////////////
///    TODO: move to '@traversable/registry' (start)   ///
import type { Box } from '@traversable/registry'
export {
  Applicative,
  Apply,
  Const,
  Foldable,
  Monoid,
  Pointed,
  Semigroup,
  Traversable,
} from './instances-v4.js'

export type { TraversalWithPredicate } from './optics-v4.js'
export { Iso, Lens, Prism, Optional, Traversal } from './optics-v4.js'
///    TODO: move to '@traversable/registry' (end)    ///
/////////////////////////////////////////////////////////

export * as Pro from './profunctor-optics-v4.js'
export { makeLens } from './make-lenses-v4.js'

export {
  RAISE_ISSUE_URL,
  VERSION,
  ZOD_CHANGELOG,
  ZOD_VERSION,
} from './version-v4.js'

export type { Optic } from './proxy-v4.js'
export {
  buildDescriptors,
  buildIntermediateRepresentation,
  buildLenses,
} from './proxy-v4.js'

export { withDefault } from './with-default-v4.js'

export type { Seed } from './seed-v4.js'
export type { Z, Options as FunctorOptions } from './functor-v4.js'
export {
  Functor,
  IndexedFunctor,
  fold,
  functorDefaultOptions,
} from './functor-v4.js'
export { tagged, typeof } from './typename-v4.js'
export { deepNullable } from './deep-nullable-v4.js'
export { deepPartial } from './deep-partial-v4.js'
export { deepReadonly } from './deep-readonly-v4.js'
export { toString } from './toString-v4.js'
// export { makeLenses } from './get-v4.js'

export { paths } from './paths-v4.js'
export {
  toSchema as jsonToSchema,
  toExactSchema as jsonToExactSchema,
  toLooseSchema as jsonToLooseSchema,
  toStrictSchema as jsonToStrictSchema,
  toWriteableSchema as jsonToWriteableScema,
  toWriteableExactSchema as jsonToWriteableExactSchema,
  toWriteableLooseSchema as jsonToWriteableLooseSchema,
  toWriteableStrictSchema as jsonToWriteableStrictSchema,
} from './json-v4.js'
export {
  Gen,
  SchemaGenerator,
  SeedGenerator,
  SeedReproduciblyValidGenerator,
  SeedReproduciblyInvalidGenerator,
  seedToSchema,
  seedToValidData,
  seedToValidDataGenerator,
  seedToInvalidData,
  seedToInvalidDataGenerator,
  SeedMap,
} from './generator-v4.js'
