import { fc } from '@fast-check/vitest'

import type { Bounds, TypeName } from '@traversable/registry'
import { fn, pick, typeName, URI } from '@traversable/registry'
import { t } from '@traversable/schema-core'
import type { BoundableTag, NullaryTag, UnaryTag } from '@traversable/schema-core'

type NullaryType = TypeName<NullaryTag>
type BoundableType = TypeName<BoundableTag>
type UnaryType = TypeName<UnaryTag>
type GetType<K extends t.TypeName> = never | t.Catalog[K]['_type']
type GetBounds<K extends keyof t.Catalog.Boundable> = never | Bounds<t.Catalog[K][keyof t.Catalog[K] & BoundableKeys]>
type GetInput<K extends UnaryType> = t.Catalog.Unary<fc.Arbitrary<unknown>>[K]
type GetOutput<K extends UnaryType, T = t.Catalog.Unary<t.unknown>[K]['_type']> = t.unknown extends T ? unknown : T
type BoundableKeys =
  | 'minLength'
  | 'maxLength'
  | 'minimum'
  | 'maximum'

/** @internal */
let empty = fc.constant(void 0 as never)

type Nullary = never | { [K in NullaryType]: fc.Arbitrary<GetType<K>> }
let Nullary = {
  never: empty,
  any: fc.anything() as fc.Arbitrary<any>,
  unknown: fc.anything(),
  void: empty as fc.Arbitrary<void>,
  null: fc.constant(null),
  undefined: fc.constant(undefined),
  symbol: fc.string().map((_) => Symbol(_)),
  boolean: fc.boolean(),
} as const satisfies Nullary

type Boundable = never | { [K in BoundableType]: (bounds?: GetBounds<K>) => fc.Arbitrary<GetType<K>> }
let Boundable = {
  integer: (b) => fc.integer({ min: b?.gte, max: b?.lte }),
  bigint: (b) => fc.bigInt({ min: b?.gte, max: b?.lte }),
  string: (b) => fc.string({ minLength: b?.gte, maxLength: b?.lte }),
  number: (b) => fc.float({
    min: b?.gte,
    max: b?.lte,
    ...t.number(b?.gt) && { minExcluded: true, min: b.gt },
    ...t.number(b?.lt) && { maxExcluded: true, max: b.lt },
  }),
} as const satisfies Boundable

type Unary = never | { [K in UnaryType]: (x: GetInput<K>) => fc.Arbitrary<GetOutput<K>> }
let Unary = {
  eq: (x) => fc.constant(x.def),
  optional: (x) => fc.option(x.def, { nil: void 0 }),
  array: (x) => fc.array(x.def),
  record: (x) => fc.dictionary(fc.string(), x.def),
  union: (xs) => fc.oneof(...xs.def),
  tuple: (xs) => fc.tuple(...xs.def),
  intersect: (xs) => fc.tuple(...xs.def).map((arbs) => arbs.reduce((acc: {}, cur) => cur == null ? acc : Object.assign(acc, cur), {})),
  object: (xs) => fc.record(xs.def, { ...[xs.opt].concat().length > 0 && { requiredKeys: Array.of<string>().concat(xs.req) } }),
} as const satisfies Unary

function getBounds<S extends t.integer>(schema: S): Pick<S, 'minimum' | 'maximum'>
function getBounds<S extends t.number>(schema: S): Pick<S, 'minimum' | 'maximum'>
function getBounds<S extends t.bigint>(schema: S): Pick<S, 'minimum' | 'maximum'>
function getBounds<S extends t.number>(schema: S): Pick<S, 'minimum' | 'maximum' | 'exclusiveMinimum' | 'exclusiveMaximum'>
function getBounds<S extends t.Boundable>(schema: S): Bounds<never>
function getBounds(schema: t.Boundable) {
  return pick(schema, ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'])
}

function fromSchemaAlgebra(options?: fromSchema.Options): t.Functor.Algebra<fc.Arbitrary<unknown>>
function fromSchemaAlgebra(_?: fromSchema.Options): t.Functor.Algebra<fc.Arbitrary<unknown>> {
  return (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case t.isNullary(x): return Nullary[typeName(x)]
      case t.isBoundable(x): return Boundable[typeName(x)](getBounds(x))
      case x.tag === URI.eq: return Unary.eq(x)
      case x.tag === URI.optional: return Unary.optional(x)
      case x.tag === URI.array: return Unary.array(x)
      case x.tag === URI.record: return Unary.record(x)
      case x.tag === URI.union: return Unary.union(x)
      case x.tag === URI.intersect: return Unary.intersect(x)
      case x.tag === URI.tuple: return Unary.tuple(x)
      case x.tag === URI.object: return Unary.object(x)
    }
  }
}

export let defaultOptions = {

} satisfies Required<fromSchema.Options>

declare namespace fromSchema {
  type Options = {

  }
}

/**
 * ## {@link fromSchema `Arbitrary.fromSchema`}
 */
export let fromSchema
  : <S extends t.Schema>(schema: S, options?: fromSchema.Options) => fc.Arbitrary<S['_type']>
  = (schema, options) => t.fold(fromSchemaAlgebra(options))(schema)

  ; (fromSchema as typeof fromSchema & { defaultOptions?: typeof defaultOptions }).defaultOptions = defaultOptions
