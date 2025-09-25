import * as vi from 'vitest'
import * as fc from 'fast-check'
import { zx } from '@traversable/zod'
import { zxTest } from '@traversable/zod-test'
import { Schema as Eff } from 'effect'
import { Seed } from '@traversable/zod-test'

const Builder = zxTest.SeedGenerator({
  exclude: [
    ...zx.deepEqual.unfuzzable,
    'nan',
    'optional',
  ]
})

const seedToEffect = Seed.fold<Eff.Schema.Any>((x) => {
  switch (true) {
    default: return x satisfies never
    case x[0] === Seed.byTag.any: return Eff.Any
    case x[0] === Seed.byTag.never: return Eff.Never as never
    case x[0] === Seed.byTag.boolean: return Eff.Boolean
    case x[0] === Seed.byTag.date: return Eff.DateFromSelf
    case x[0] === Seed.byTag.nan: return Eff.Number
    case x[0] === Seed.byTag.null: return Eff.Null
    case x[0] === Seed.byTag.symbol: return Eff.SymbolFromSelf
    case x[0] === Seed.byTag.undefined: return Eff.Undefined
    case x[0] === Seed.byTag.unknown: return Eff.Unknown
    case x[0] === Seed.byTag.void: return Eff.Void
    case x[0] === Seed.byTag.int: return Eff.Int
    case x[0] === Seed.byTag.bigint: return Eff.BigInt
    case x[0] === Seed.byTag.number: return Eff.Number
    case x[0] === Seed.byTag.string: return Eff.String
    case x[0] === Seed.byTag.enum: return Eff.Enums(x[1])
    case x[0] === Seed.byTag.literal: return Eff.Literal(x[1]!)
    case x[0] === Seed.byTag.template_literal: return Eff.String
    case x[0] === Seed.byTag.array: return Eff.Array(x[1])
    case x[0] === Seed.byTag.nullable: return Eff.NullOr(x[1])
    case x[0] === Seed.byTag.optional: return Eff.optional(x[1]) as never
    case x[0] === Seed.byTag.readonly: return x[1]
    case x[0] === Seed.byTag.set: return Eff.Set(x[1])
    case x[0] === Seed.byTag.catch: return x[1]
    case x[0] === Seed.byTag.default: return x[1]
    case x[0] === Seed.byTag.prefault: return x[1]
    case x[0] === Seed.byTag.intersection: return x[1][0].pipe(Eff.extend(x[1][1]))
    case x[0] === Seed.byTag.map: return Eff.Map({ key: x[1][0], value: x[1][1] })
    case x[0] === Seed.byTag.record: return Eff.Record({ key: Eff.String, value: x[1] })
    case x[0] === Seed.byTag.object: return Eff.Struct(Object.fromEntries(x[1]))
    case x[0] === Seed.byTag.tuple: return Eff.Tuple(...x[1])
    case x[0] === Seed.byTag.union: return Eff.Union(...x[1])
    case x[0] === Seed.byTag.pipe: return x[1][1]
    case x[0] === Seed.byTag.lazy: return x[1]()
    case x[0] === Seed.byTag.file: throw Error('file schema is unsupported')
    case x[0] === Seed.byTag.nonoptional: throw Error('nonOptional schema is unsupported')
    case x[0] === Seed.byTag.success: throw Error('success schema is unsupported')
    case x[0] === Seed.byTag.custom: throw Error('custom schema is unsupported')
    case x[0] === Seed.byTag.transform: throw Error('transform schema is unsupported')
    case x[0] === Seed.byTag.promise: throw Error('promise schema is unsupported')
  }
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.deepEqual', () => {
  vi.test('〖⛳️〗› ❲zx.deepEqual❳: parity w/ Effect', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          const schema = zxTest.seedToSchema(seed)
          const deepEqual = zx.deepEqual(schema)
          const arbitrary = zxTest.seedToValidDataGenerator(seed)
          const [left, right] = fc.sample(arbitrary, 2)
          const effect = Eff.equivalence(seedToEffect(seed))

          if (effect(left, right)) {
            vi.assert.isTrue(deepEqual(left, right))
          } else {
            vi.assert.isFalse(deepEqual(left, right))
          }
        }
      ), {
      endOnFailure: true,
      // numRuns: 10_000,
    })
  })
})
