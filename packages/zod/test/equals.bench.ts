import * as fc from 'fast-check'
import * as m from 'mitata'
import { z } from 'zod'


/** 
 * [2025-07-10]: Removed NodeDeepEqual because its performance is so bad that it skews results
 * // import NodeDeepEqual from 'deep-equal'
 */
import { zx } from '@traversable/zod'
import Lodash from 'lodash.isequal'
import { isDeepStrictEqual as NodeJS } from 'node:util'
import { deepEqual as FastEquals } from 'fast-equals'
import { isEqual as ReactHooks } from '@react-hookz/deep-equal'
import { fastIsEqual as FastIsEqual } from 'fast-is-equal'
import { deepEqual as JsonJoy } from '@jsonjoy.com/util/lib/json-equal/deepEqual/v6.js'
import { isEqual as Underscore } from 'underscore'
import { Equal as TypeBox } from '@sinclair/typebox/value'
import { Schema as EffectSchema, Equal as EffectEqual } from 'effect'
import { Equal } from '@traversable/registry'
const traversable = Equal.deep

const StringArrayArbitrary = fc.array(fc.string())
const BooleanArrayArbitrary = fc.array(fc.boolean())
const StringTupleArbitrary = fc.tuple(fc.string(), fc.string(), fc.string())
const BooleanTupleArbitrary = fc.tuple(fc.boolean(), fc.boolean(), fc.boolean())
const StringRecordArbitrary = fc.dictionary(fc.string(), fc.string())
const BooleanRecordArbitrary = fc.dictionary(fc.string(), fc.boolean())
const StringObjectArbitrary = fc.record({ a: fc.string(), b: fc.string(), c: fc.string() })
const BooleanObjectArbitrary = fc.record({ a: fc.boolean(), b: fc.boolean(), c: fc.boolean() })
const DisjoinUnionArbitrary = fc.oneof(
  fc.record({ tag: fc.constant('A'), a: fc.boolean() }),
  fc.record({ tag: fc.constant('B'), b: fc.integer() }),
)
const DeepObjectArbitrary = fc.record({
  a: fc.string(),
  b: fc.record({
    c: fc.string(),
    d: fc.record({
      e: fc.string(),
      f: fc.record({
        g: fc.string(),
        h: fc.record({
          i: fc.string(),
          j: fc.boolean(),
          k: fc.string(),
          l: fc.boolean(),
        }),
        m: fc.string(),
        n: fc.boolean(),
      }),
      o: fc.string(),
      p: fc.boolean(),
    }),
    q: fc.string(),
    r: fc.boolean(),
  }),
  s: fc.string(),
  t: fc.boolean(),
})

const StringArrayCloner = fc.clone(StringArrayArbitrary, 2)
const BooleanArrayCloner = fc.clone(BooleanArrayArbitrary, 2)
const StringTupleCloner = fc.clone(StringTupleArbitrary, 2)
const BooleanTupleCloner = fc.clone(BooleanTupleArbitrary, 2)
const StringRecordCloner = fc.clone(StringRecordArbitrary, 2)
const BooleanRecordCloner = fc.clone(BooleanRecordArbitrary, 2)
const StringObjectCloner = fc.clone(StringObjectArbitrary, 2)
const BooleanObjectCloner = fc.clone(BooleanObjectArbitrary, 2)
const DisjoinUnionCloner = fc.clone(DisjoinUnionArbitrary, 2)
const DeepObjectCloner = fc.clone(DeepObjectArbitrary, 2)

const [StringArray1, StringArray2] = fc.sample(StringArrayCloner, 1)[0]
const [BooleanArray1, BooleanArray2] = fc.sample(BooleanArrayCloner, 1)[0]
const [StringTuple1, StringTuple2] = fc.sample(StringTupleCloner, 1)[0]
const [BooleanTuple1, BooleanTuple2] = fc.sample(BooleanTupleCloner, 1)[0]
const [StringRecord1, StringRecord2] = fc.sample(StringRecordCloner, 1)[0]
const [BooleanRecord1, BooleanRecord2] = fc.sample(BooleanRecordCloner, 1)[0]
const [StringObject1, StringObject2] = fc.sample(StringObjectCloner, 1)[0]
const [BooleanObject1, BooleanObject2] = fc.sample(BooleanObjectCloner, 1)[0]
const [DisjointUnion1, DisjointUnion2] = fc.sample(DisjoinUnionCloner, 1)[0]
const [DeepObject1, DeepObject2] = fc.sample(DeepObjectCloner, 1)[0]

type BooleanArray = z.infer<typeof BooleanArraySchema>
const BooleanArraySchema = z.array(z.boolean())
type StringArray = z.infer<typeof StringArraySchema>
const StringArraySchema = z.array(z.string())
type BooleanTuple = z.infer<typeof BooleanTupleSchema>
const BooleanTupleSchema = z.tuple([z.boolean(), z.boolean(), z.boolean()])
type StringTuple = z.infer<typeof StringTupleSchema>
const StringTupleSchema = z.tuple([z.string(), z.string(), z.string()])
type BooleanRecord = z.infer<typeof BooleanRecordSchema>
const BooleanRecordSchema = z.record(z.string(), z.boolean())
type StringRecord = z.infer<typeof StringRecordSchema>
const StringRecordSchema = z.record(z.string(), z.string())
type BooleanObject = z.infer<typeof BooleanObjectSchema>
const BooleanObjectSchema = z.object({ a: z.boolean(), b: z.boolean(), c: z.boolean() })
type StringObject = z.infer<typeof StringObjectSchema>
const StringObjectSchema = z.object({ a: z.string(), b: z.string(), c: z.string() })
type DisjointUnion = z.infer<typeof DisjointUnionSchema>
const DisjointUnionSchema = z.union([
  z.object({ tag: z.literal('A'), a: z.boolean() }),
  z.object({ tag: z.literal('B'), b: z.number().int() }),
])

type DeepObject = z.infer<typeof DeepObjectSchema>
const DeepObjectSchema = z.object({
  a: z.string(),
  b: z.object({
    c: z.string(),
    d: z.object({
      e: z.string(),
      f: z.object({
        g: z.string(),
        h: z.object({
          i: z.string(),
          j: z.boolean(),
          k: z.string(),
          l: z.boolean(),
        }),
        m: z.string(),
        n: z.boolean(),
      }),
      o: z.string(),
      p: z.boolean(),
    }),
    q: z.string(),
    r: z.boolean(),
  }),
  s: z.string(),
  t: z.boolean(),
})

const BooleanArrayEquals = zx.equals(BooleanArraySchema)
const StringArrayEquals = zx.equals(StringArraySchema)
const BooleanTupleEquals = zx.equals(BooleanTupleSchema)
const StringTupleEquals = zx.equals(StringTupleSchema)
const BooleanRecordEquals = zx.equals(BooleanRecordSchema)
const StringRecordEquals = zx.equals(StringRecordSchema)
const BooleanObjectEquals = zx.equals(BooleanObjectSchema)
const StringObjectEquals = zx.equals(StringObjectSchema)
const DisjointUnionEquals = zx.equals(DisjointUnionSchema)
const DeepObjectEquals = zx.equals(DeepObjectSchema)

const EffectBooleanArraySchema = EffectSchema.Array(EffectSchema.Boolean)
const EffectStringArraySchema = EffectSchema.Array(EffectSchema.String)
const EffectBooleanTupleSchema = EffectSchema.Tuple(EffectSchema.Boolean, EffectSchema.Boolean, EffectSchema.Boolean)
const EffectStringTupleSchema = EffectSchema.Tuple(EffectSchema.String, EffectSchema.String, EffectSchema.String)
const EffectBooleanRecordSchema = EffectSchema.Record({ key: EffectSchema.String, value: EffectSchema.Boolean })
const EffectStringRecordSchema = EffectSchema.Record({ key: EffectSchema.String, value: EffectSchema.String })
const EffectBooleanObjectSchema = EffectSchema.Struct({ a: EffectSchema.Boolean, b: EffectSchema.Boolean, c: EffectSchema.Boolean })
const EffectStringObjectSchema = EffectSchema.Struct({ a: EffectSchema.String, b: EffectSchema.String, c: EffectSchema.String })

// Effect's performance with unions is ~4x better with `EffectSchema.Data`
const EffectDisjointUnionSchema = EffectSchema.Data(EffectSchema.Union(
  EffectSchema.Struct({ tag: EffectSchema.Literal('A'), a: EffectSchema.Boolean }),
  EffectSchema.Struct({ tag: EffectSchema.Literal('B'), b: EffectSchema.Int }),
))

const EffectDeepObjectSchema = EffectSchema.Struct({
  a: EffectSchema.String,
  b: EffectSchema.Struct({
    c: EffectSchema.String,
    d: EffectSchema.Struct({
      e: EffectSchema.String,
      f: EffectSchema.Struct({
        g: EffectSchema.String,
        h: EffectSchema.Struct({
          i: EffectSchema.String,
          j: EffectSchema.Boolean,
          k: EffectSchema.String,
          l: EffectSchema.Boolean,
        }),
        m: EffectSchema.String,
        n: EffectSchema.Boolean,
      }),
      o: EffectSchema.String,
      p: EffectSchema.Boolean,
    }),
    q: EffectSchema.String,
    r: EffectSchema.Boolean,
  }),
  s: EffectSchema.String,
  t: EffectSchema.Boolean,
})

const EffectBooleanArrayEquals = EffectSchema.equivalence(EffectBooleanArraySchema)
const EffectStringArrayEquals = EffectSchema.equivalence(EffectStringArraySchema)
const EffectBooleanTupleEquals = EffectSchema.equivalence(EffectBooleanTupleSchema)
const EffectStringTupleEquals = EffectSchema.equivalence(EffectStringTupleSchema)
const EffectBooleanRecordEquals = EffectSchema.equivalence(EffectBooleanRecordSchema)
const EffectStringRecordEquals = EffectSchema.equivalence(EffectStringRecordSchema)
const EffectBooleanObjectEquals = EffectSchema.equivalence(EffectBooleanObjectSchema)
const EffectStringObjectEquals = EffectSchema.equivalence(EffectStringObjectSchema)
const EffectDeepObjectEquals = EffectSchema.equivalence(EffectDeepObjectSchema)
const EffectDisjointUnionDecode = EffectSchema.decode(EffectDisjointUnionSchema)

m.summary(() => {
  m.group('〖🏁️〗››› boolean array', () => {
    m.barplot(() => {
      m.bench('Underscore', function* () {
        yield {
          [0]() { return BooleanArray1 },
          [1]() { return BooleanArray2 },
          bench(x: BooleanArray, y: BooleanArray) {
            m.do_not_optimize(
              Underscore(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('Lodash', function* () {
        yield {
          [0]() { return BooleanArray1 },
          [1]() { return BooleanArray2 },
          bench(x: BooleanArray, y: BooleanArray) {
            m.do_not_optimize(
              Lodash(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('NodeJS', function* () {
        yield {
          [0]() { return BooleanArray1 },
          [1]() { return BooleanArray2 },
          bench(x: BooleanArray, y: BooleanArray) {
            m.do_not_optimize(
              NodeJS(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('traversable', function* () {
        yield {
          [0]() { return BooleanArray1 },
          [1]() { return BooleanArray2 },
          bench(x: BooleanArray, y: BooleanArray) {
            m.do_not_optimize(
              traversable(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('FastEquals', function* () {
        yield {
          [0]() { return BooleanArray1 },
          [1]() { return BooleanArray2 },
          bench(x: BooleanArray, y: BooleanArray) {
            m.do_not_optimize(
              FastEquals(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('FastIsEqual', function* () {
        yield {
          [0]() { return BooleanArray1 },
          [1]() { return BooleanArray2 },
          bench(x: BooleanArray, y: BooleanArray) {
            m.do_not_optimize(
              FastIsEqual(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('ReactHooks', function* () {
        yield {
          [0]() { return BooleanArray1 },
          [1]() { return BooleanArray2 },
          bench(x: BooleanArray, y: BooleanArray) {
            m.do_not_optimize(
              ReactHooks(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('JsonJoy', function* () {
        yield {
          [0]() { return BooleanArray1 },
          [1]() { return BooleanArray2 },
          bench(x: BooleanArray, y: BooleanArray) {
            m.do_not_optimize(
              JsonJoy(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('TypeBox', function* () {
        yield {
          [0]() { return BooleanArray1 },
          [1]() { return BooleanArray2 },
          bench(x: BooleanArray, y: BooleanArray) {
            m.do_not_optimize(
              TypeBox(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('Effect', function* () {
        yield {
          [0]() { return BooleanArray1 },
          [1]() { return BooleanArray2 },
          bench(x: BooleanArray, y: BooleanArray) {
            m.do_not_optimize(
              EffectBooleanArrayEquals(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('❲zx.equals❳', function* () {
        yield {
          [0]() { return BooleanArray1 },
          [1]() { return BooleanArray2 },
          bench(x: BooleanArray, y: BooleanArray) {
            m.do_not_optimize(
              BooleanArrayEquals(x, y)
            )
          }
        }
      }).gc('inner')
    })
  })
})

m.summary(() => {
  m.group('〖🏁️〗››› string array', () => {
    m.barplot(() => {
      m.bench('Underscore', function* () {
        yield {
          [0]() { return StringArray1 },
          [1]() { return StringArray2 },
          bench(x: StringArray, y: StringArray) {
            m.do_not_optimize(
              Underscore(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('Lodash', function* () {
        yield {
          [0]() { return StringArray1 },
          [1]() { return StringArray2 },
          bench(x: StringArray, y: StringArray) {
            m.do_not_optimize(
              Lodash(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('NodeJS', function* () {
        yield {
          [0]() { return StringArray1 },
          [1]() { return StringArray2 },
          bench(x: StringArray, y: StringArray) {
            m.do_not_optimize(
              NodeJS(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('traversable', function* () {
        yield {
          [0]() { return StringArray1 },
          [1]() { return StringArray2 },
          bench(x: StringArray, y: StringArray) {
            m.do_not_optimize(
              traversable(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('FastEquals', function* () {
        yield {
          [0]() { return StringArray1 },
          [1]() { return StringArray2 },
          bench(x: StringArray, y: StringArray) {
            m.do_not_optimize(
              FastEquals(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('FastIsEqual', function* () {
        yield {
          [0]() { return StringArray1 },
          [1]() { return StringArray2 },
          bench(x: StringArray, y: StringArray) {
            m.do_not_optimize(
              FastIsEqual(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('JsonJoy', function* () {
        yield {
          [0]() { return StringArray1 },
          [1]() { return StringArray2 },
          bench(x: StringArray, y: StringArray) {
            m.do_not_optimize(
              JsonJoy(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('TypeBox', function* () {
        yield {
          [0]() { return StringArray1 },
          [1]() { return StringArray2 },
          bench(x: StringArray, y: StringArray) {
            m.do_not_optimize(
              TypeBox(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('Effect', function* () {
        yield {
          [0]() { return StringArray1 },
          [1]() { return StringArray2 },
          bench(x: StringArray, y: StringArray) {
            m.do_not_optimize(
              EffectStringArrayEquals(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('❲zx.equals❳', function* () {
        yield {
          [0]() { return StringArray1 },
          [1]() { return StringArray2 },
          bench(x: StringArray, y: StringArray) {
            m.do_not_optimize(
              StringArrayEquals(x, y)
            )
          }
        }
      }).gc('inner')
    })
  })
})

m.summary(() => {
  m.group('〖🏁️〗››› boolean tuple', () => {
    m.barplot(() => {
      m.bench('Underscore', function* () {
        yield {
          [0]() { return BooleanTuple1 },
          [1]() { return BooleanTuple2 },
          bench(x: BooleanTuple, y: BooleanTuple) {
            m.do_not_optimize(
              Underscore(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('Lodash', function* () {
        yield {
          [0]() { return BooleanTuple1 },
          [1]() { return BooleanTuple2 },
          bench(x: BooleanTuple, y: BooleanTuple) {
            m.do_not_optimize(
              Lodash(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('NodeJS', function* () {
        yield {
          [0]() { return BooleanTuple1 },
          [1]() { return BooleanTuple2 },
          bench(x: BooleanTuple, y: BooleanTuple) {
            m.do_not_optimize(
              NodeJS(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('traversable', function* () {
        yield {
          [0]() { return BooleanTuple1 },
          [1]() { return BooleanTuple2 },
          bench(x: BooleanTuple, y: BooleanTuple) {
            m.do_not_optimize(
              traversable(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('FastEquals', function* () {
        yield {
          [0]() { return BooleanTuple1 },
          [1]() { return BooleanTuple2 },
          bench(x: BooleanTuple, y: BooleanTuple) {
            m.do_not_optimize(
              FastEquals(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('FastIsEqual', function* () {
        yield {
          [0]() { return BooleanTuple1 },
          [1]() { return BooleanTuple2 },
          bench(x: BooleanTuple, y: BooleanTuple) {
            m.do_not_optimize(
              FastIsEqual(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('ReactHooks', function* () {
        yield {
          [0]() { return BooleanTuple1 },
          [1]() { return BooleanTuple2 },
          bench(x: BooleanTuple, y: BooleanTuple) {
            m.do_not_optimize(
              ReactHooks(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('JsonJoy', function* () {
        yield {
          [0]() { return BooleanTuple1 },
          [1]() { return BooleanTuple2 },
          bench(x: BooleanTuple, y: BooleanTuple) {
            m.do_not_optimize(
              JsonJoy(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('TypeBox', function* () {
        yield {
          [0]() { return BooleanTuple1 },
          [1]() { return BooleanTuple2 },
          bench(x: BooleanTuple, y: BooleanTuple) {
            m.do_not_optimize(
              TypeBox(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('Effect', function* () {
        yield {
          [0]() { return BooleanTuple1 },
          [1]() { return BooleanTuple2 },
          bench(x: BooleanTuple, y: BooleanTuple) {
            m.do_not_optimize(
              EffectBooleanTupleEquals(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('❲zx.equals❳', function* () {
        yield {
          [0]() { return BooleanTuple1 },
          [1]() { return BooleanTuple2 },
          bench(x: BooleanTuple, y: BooleanTuple) {
            m.do_not_optimize(
              BooleanTupleEquals(x, y)
            )
          }
        }
      }).gc('inner')
    })
  })
})

m.summary(() => {
  m.group('〖🏁️〗››› string tuple', () => {
    m.barplot(() => {
      m.bench('Underscore', function* () {
        yield {
          [0]() { return StringTuple1 },
          [1]() { return StringTuple2 },
          bench(x: StringTuple, y: StringTuple) {
            m.do_not_optimize(
              Underscore(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('Lodash', function* () {
        yield {
          [0]() { return StringTuple1 },
          [1]() { return StringTuple2 },
          bench(x: StringTuple, y: StringTuple) {
            m.do_not_optimize(
              Lodash(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('NodeJS', function* () {
        yield {
          [0]() { return StringTuple1 },
          [1]() { return StringTuple2 },
          bench(x: StringTuple, y: StringTuple) {
            m.do_not_optimize(
              NodeJS(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('traversable', function* () {
        yield {
          [0]() { return StringTuple1 },
          [1]() { return StringTuple2 },
          bench(x: StringTuple, y: StringTuple) {
            m.do_not_optimize(
              traversable(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('FastEquals', function* () {
        yield {
          [0]() { return StringTuple1 },
          [1]() { return StringTuple2 },
          bench(x: StringTuple, y: StringTuple) {
            m.do_not_optimize(
              FastEquals(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('FastIsEqual', function* () {
        yield {
          [0]() { return StringTuple1 },
          [1]() { return StringTuple2 },
          bench(x: StringTuple, y: StringTuple) {
            m.do_not_optimize(
              FastIsEqual(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('ReactHooks', function* () {
        yield {
          [0]() { return StringTuple1 },
          [1]() { return StringTuple2 },
          bench(x: StringTuple, y: StringTuple) {
            m.do_not_optimize(
              ReactHooks(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('JsonJoy', function* () {
        yield {
          [0]() { return StringTuple1 },
          [1]() { return StringTuple2 },
          bench(x: StringTuple, y: StringTuple) {
            m.do_not_optimize(
              JsonJoy(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('TypeBox', function* () {
        yield {
          [0]() { return StringTuple1 },
          [1]() { return StringTuple2 },
          bench(x: StringTuple, y: StringTuple) {
            m.do_not_optimize(
              TypeBox(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('Effect', function* () {
        yield {
          [0]() { return StringTuple1 },
          [1]() { return StringTuple2 },
          bench(x: StringTuple, y: StringTuple) {
            m.do_not_optimize(
              EffectStringTupleEquals(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('❲zx.equals❳', function* () {
        yield {
          [0]() { return StringTuple1 },
          [1]() { return StringTuple2 },
          bench(x: StringTuple, y: StringTuple) {
            m.do_not_optimize(
              StringTupleEquals(x, y)
            )
          }
        }
      }).gc('inner')
    })
  })
})

m.summary(() => {
  m.group('〖🏁️〗››› boolean record', () => {
    m.barplot(() => {
      m.bench('Underscore', function* () {
        yield {
          [0]() { return BooleanRecord1 },
          [1]() { return BooleanRecord2 },
          bench(x: BooleanRecord, y: BooleanRecord) {
            m.do_not_optimize(
              Underscore(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('Lodash', function* () {
        yield {
          [0]() { return BooleanRecord1 },
          [1]() { return BooleanRecord2 },
          bench(x: BooleanRecord, y: BooleanRecord) {
            m.do_not_optimize(
              Lodash(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('NodeJS', function* () {
        yield {
          [0]() { return BooleanRecord1 },
          [1]() { return BooleanRecord2 },
          bench(x: BooleanRecord, y: BooleanRecord) {
            m.do_not_optimize(
              NodeJS(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('traversable', function* () {
        yield {
          [0]() { return BooleanRecord1 },
          [1]() { return BooleanRecord2 },
          bench(x: BooleanRecord, y: BooleanRecord) {
            m.do_not_optimize(
              traversable(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('FastEquals', function* () {
        yield {
          [0]() { return BooleanRecord1 },
          [1]() { return BooleanRecord2 },
          bench(x: BooleanRecord, y: BooleanRecord) {
            m.do_not_optimize(
              FastEquals(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('FastIsEqual', function* () {
        yield {
          [0]() { return BooleanRecord1 },
          [1]() { return BooleanRecord2 },
          bench(x: BooleanRecord, y: BooleanRecord) {
            m.do_not_optimize(
              FastIsEqual(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('ReactHooks', function* () {
        yield {
          [0]() { return BooleanRecord1 },
          [1]() { return BooleanRecord2 },
          bench(x: BooleanRecord, y: BooleanRecord) {
            m.do_not_optimize(
              ReactHooks(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('JsonJoy', function* () {
        yield {
          [0]() { return BooleanRecord1 },
          [1]() { return BooleanRecord2 },
          bench(x: BooleanRecord, y: BooleanRecord) {
            m.do_not_optimize(
              JsonJoy(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('TypeBox', function* () {
        yield {
          [0]() { return BooleanRecord1 },
          [1]() { return BooleanRecord2 },
          bench(x: BooleanRecord, y: BooleanRecord) {
            m.do_not_optimize(
              TypeBox(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('Effect', function* () {
        yield {
          [0]() { return BooleanRecord1 },
          [1]() { return BooleanRecord2 },
          bench(x: BooleanRecord, y: BooleanRecord) {
            m.do_not_optimize(
              EffectBooleanRecordEquals(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('❲zx.equals❳', function* () {
        yield {
          [0]() { return BooleanRecord1 },
          [1]() { return BooleanRecord2 },
          bench(x: BooleanRecord, y: BooleanRecord) {
            m.do_not_optimize(
              BooleanRecordEquals(x, y)
            )
          }
        }
      }).gc('inner')
    })
  })
})

m.summary(() => {
  m.group('〖🏁️〗››› string record', () => {
    m.barplot(() => {
      m.bench('Underscore', function* () {
        yield {
          [0]() { return StringRecord1 },
          [1]() { return StringRecord2 },
          bench(x: StringRecord, y: StringRecord) {
            m.do_not_optimize(
              Underscore(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('Lodash', function* () {
        yield {
          [0]() { return StringRecord1 },
          [1]() { return StringRecord2 },
          bench(x: StringRecord, y: StringRecord) {
            m.do_not_optimize(
              Lodash(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('NodeJS', function* () {
        yield {
          [0]() { return StringRecord1 },
          [1]() { return StringRecord2 },
          bench(x: StringRecord, y: StringRecord) {
            m.do_not_optimize(
              NodeJS(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('traversable', function* () {
        yield {
          [0]() { return StringRecord1 },
          [1]() { return StringRecord2 },
          bench(x: StringRecord, y: StringRecord) {
            m.do_not_optimize(
              traversable(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('FastEquals', function* () {
        yield {
          [0]() { return StringRecord1 },
          [1]() { return StringRecord2 },
          bench(x: StringRecord, y: StringRecord) {
            m.do_not_optimize(
              FastEquals(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('FastIsEqual', function* () {
        yield {
          [0]() { return StringRecord1 },
          [1]() { return StringRecord2 },
          bench(x: StringRecord, y: StringRecord) {
            m.do_not_optimize(
              FastIsEqual(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('ReactHooks', function* () {
        yield {
          [0]() { return StringRecord1 },
          [1]() { return StringRecord2 },
          bench(x: StringRecord, y: StringRecord) {
            m.do_not_optimize(
              ReactHooks(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('JsonJoy', function* () {
        yield {
          [0]() { return StringRecord1 },
          [1]() { return StringRecord2 },
          bench(x: StringRecord, y: StringRecord) {
            m.do_not_optimize(
              JsonJoy(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('TypeBox', function* () {
        yield {
          [0]() { return StringRecord1 },
          [1]() { return StringRecord2 },
          bench(x: StringRecord, y: StringRecord) {
            m.do_not_optimize(
              TypeBox(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('Effect', function* () {
        yield {
          [0]() { return StringRecord1 },
          [1]() { return StringRecord2 },
          bench(x: StringRecord, y: StringRecord) {
            m.do_not_optimize(
              EffectStringRecordEquals(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('❲zx.equals❳', function* () {
        yield {
          [0]() { return StringRecord1 },
          [1]() { return StringRecord2 },
          bench(x: StringRecord, y: StringRecord) {
            m.do_not_optimize(
              StringRecordEquals(x, y)
            )
          }
        }
      }).gc('inner')
    })
  })
})

m.summary(() => {
  m.group('〖🏁️〗››› boolean object', () => {
    m.barplot(() => {
      m.bench('Underscore', function* () {
        yield {
          [0]() { return BooleanObject1 },
          [1]() { return BooleanObject2 },
          bench(x: BooleanObject, y: BooleanObject) {
            m.do_not_optimize(
              Underscore(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('Lodash', function* () {
        yield {
          [0]() { return BooleanObject1 },
          [1]() { return BooleanObject2 },
          bench(x: BooleanObject, y: BooleanObject) {
            m.do_not_optimize(
              Lodash(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('NodeJS', function* () {
        yield {
          [0]() { return BooleanObject1 },
          [1]() { return BooleanObject2 },
          bench(x: BooleanObject, y: BooleanObject) {
            m.do_not_optimize(
              NodeJS(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('traversable', function* () {
        yield {
          [0]() { return BooleanObject1 },
          [1]() { return BooleanObject2 },
          bench(x: BooleanObject, y: BooleanObject) {
            m.do_not_optimize(
              traversable(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('FastEquals', function* () {
        yield {
          [0]() { return BooleanObject1 },
          [1]() { return BooleanObject2 },
          bench(x: BooleanObject, y: BooleanObject) {
            m.do_not_optimize(
              FastEquals(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('FastIsEqual', function* () {
        yield {
          [0]() { return BooleanObject1 },
          [1]() { return BooleanObject2 },
          bench(x: BooleanObject, y: BooleanObject) {
            m.do_not_optimize(
              FastIsEqual(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('ReactHooks', function* () {
        yield {
          [0]() { return BooleanObject1 },
          [1]() { return BooleanObject2 },
          bench(x: BooleanObject, y: BooleanObject) {
            m.do_not_optimize(
              ReactHooks(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('JsonJoy', function* () {
        yield {
          [0]() { return BooleanObject1 },
          [1]() { return BooleanObject2 },
          bench(x: BooleanObject, y: BooleanObject) {
            m.do_not_optimize(
              JsonJoy(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('TypeBox', function* () {
        yield {
          [0]() { return BooleanObject1 },
          [1]() { return BooleanObject2 },
          bench(x: BooleanObject, y: BooleanObject) {
            m.do_not_optimize(
              TypeBox(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('Effect', function* () {
        yield {
          [0]() { return BooleanObject1 },
          [1]() { return BooleanObject2 },
          bench(x: BooleanObject, y: BooleanObject) {
            m.do_not_optimize(
              EffectBooleanObjectEquals(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('❲zx.equals❳', function* () {
        yield {
          [0]() { return BooleanObject1 },
          [1]() { return BooleanObject2 },
          bench(x: BooleanObject, y: BooleanObject) {
            m.do_not_optimize(
              BooleanObjectEquals(x, y)
            )
          }
        }
      }).gc('inner')
    })
  })
})

m.summary(() => {
  m.group('〖🏁️〗››› string object', () => {
    m.barplot(() => {
      m.bench('Underscore', function* () {
        yield {
          [0]() { return StringObject1 },
          [1]() { return StringObject2 },
          bench(x: StringObject, y: StringObject) {
            m.do_not_optimize(
              Underscore(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('Lodash', function* () {
        yield {
          [0]() { return StringObject1 },
          [1]() { return StringObject2 },
          bench(x: StringObject, y: StringObject) {
            m.do_not_optimize(
              Lodash(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('NodeJS', function* () {
        yield {
          [0]() { return StringObject1 },
          [1]() { return StringObject2 },
          bench(x: StringObject, y: StringObject) {
            m.do_not_optimize(
              NodeJS(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('traversable', function* () {
        yield {
          [0]() { return StringObject1 },
          [1]() { return StringObject2 },
          bench(x: StringObject, y: StringObject) {
            m.do_not_optimize(
              traversable(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('FastEquals', function* () {
        yield {
          [0]() { return StringObject1 },
          [1]() { return StringObject2 },
          bench(x: StringObject, y: StringObject) {
            m.do_not_optimize(
              FastEquals(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('FastIsEqual', function* () {
        yield {
          [0]() { return StringObject1 },
          [1]() { return StringObject2 },
          bench(x: StringObject, y: StringObject) {
            m.do_not_optimize(
              FastIsEqual(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('ReactHooks', function* () {
        yield {
          [0]() { return StringObject1 },
          [1]() { return StringObject2 },
          bench(x: StringObject, y: StringObject) {
            m.do_not_optimize(
              ReactHooks(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('JsonJoy', function* () {
        yield {
          [0]() { return StringObject1 },
          [1]() { return StringObject2 },
          bench(x: StringObject, y: StringObject) {
            m.do_not_optimize(
              JsonJoy(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('TypeBox', function* () {
        yield {
          [0]() { return StringObject1 },
          [1]() { return StringObject2 },
          bench(x: StringObject, y: StringObject) {
            m.do_not_optimize(
              TypeBox(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('Effect', function* () {
        yield {
          [0]() { return StringObject1 },
          [1]() { return StringObject2 },
          bench(x: StringObject, y: StringObject) {
            m.do_not_optimize(
              EffectStringObjectEquals(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('❲zx.equals❳', function* () {
        yield {
          [0]() { return StringObject1 },
          [1]() { return StringObject2 },
          bench(x: StringObject, y: StringObject) {
            m.do_not_optimize(
              StringObjectEquals(x, y)
            )
          }
        }
      }).gc('inner')
    })
  })
})

m.summary(() => {
  m.group('〖🏁️〗››› disjoint union', () => {
    m.barplot(() => {
      m.bench('Underscore', function* () {
        yield {
          [0]() { return DisjointUnion1 },
          [1]() { return DisjointUnion2 },
          bench(x: DisjointUnion, y: DisjointUnion) {
            m.do_not_optimize(
              Underscore(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('Lodash', function* () {
        yield {
          [0]() { return DisjointUnion1 },
          [1]() { return DisjointUnion2 },
          bench(x: DisjointUnion, y: DisjointUnion) {
            m.do_not_optimize(
              Lodash(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('NodeJS', function* () {
        yield {
          [0]() { return DisjointUnion1 },
          [1]() { return DisjointUnion2 },
          bench(x: DisjointUnion, y: DisjointUnion) {
            m.do_not_optimize(
              NodeJS(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('traversable', function* () {
        yield {
          [0]() { return DisjointUnion1 },
          [1]() { return DisjointUnion2 },
          bench(x: DisjointUnion, y: DisjointUnion) {
            m.do_not_optimize(
              traversable(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('FastEquals', function* () {
        yield {
          [0]() { return DisjointUnion1 },
          [1]() { return DisjointUnion2 },
          bench(x: DisjointUnion, y: DisjointUnion) {
            m.do_not_optimize(
              FastEquals(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('FastIsEqual', function* () {
        yield {
          [0]() { return DisjointUnion1 },
          [1]() { return DisjointUnion2 },
          bench(x: DisjointUnion, y: DisjointUnion) {
            m.do_not_optimize(
              FastIsEqual(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('ReactHooks', function* () {
        yield {
          [0]() { return DisjointUnion1 },
          [1]() { return DisjointUnion2 },
          bench(x: DisjointUnion, y: DisjointUnion) {
            m.do_not_optimize(
              ReactHooks(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('JsonJoy', function* () {
        yield {
          [0]() { return DisjointUnion1 },
          [1]() { return DisjointUnion2 },
          bench(x: DisjointUnion, y: DisjointUnion) {
            m.do_not_optimize(
              JsonJoy(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('TypeBox', function* () {
        yield {
          [0]() { return DisjointUnion1 },
          [1]() { return DisjointUnion2 },
          bench(x: DisjointUnion, y: DisjointUnion) {
            m.do_not_optimize(
              TypeBox(x, y)
            )
          }
        }
      }).gc('inner')

      // Effect's peformance with unions ~4x better when the input is decoded first
      // because it installs an equality "trait" on the objects themselves:
      m.bench('Effect', function* () {
        yield {
          [0]() { return EffectDisjointUnionDecode(DisjointUnion1) },
          [1]() { return EffectDisjointUnionDecode(DisjointUnion2) },
          bench(x: DisjointUnion, y: DisjointUnion) {
            m.do_not_optimize(
              EffectEqual.equals(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('❲zx.equals❳', function* () {
        yield {
          [0]() { return DisjointUnion1 },
          [1]() { return DisjointUnion2 },
          bench(x: DisjointUnion, y: DisjointUnion) {
            m.do_not_optimize(
              DisjointUnionEquals(x, y)
            )
          }
        }
      }).gc('inner')
    })
  })
})

m.summary(() => {
  m.group('〖🏁️〗››› deep object', () => {
    m.barplot(() => {
      m.bench('Underscore', function* () {
        yield {
          [0]() { return DeepObject1 },
          [1]() { return DeepObject2 },
          bench(x: DeepObject, y: DeepObject) {
            m.do_not_optimize(
              Underscore(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('Lodash', function* () {
        yield {
          [0]() { return DeepObject1 },
          [1]() { return DeepObject2 },
          bench(x: DeepObject, y: DeepObject) {
            m.do_not_optimize(
              Lodash(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('NodeJS', function* () {
        yield {
          [0]() { return DeepObject1 },
          [1]() { return DeepObject2 },
          bench(x: DeepObject, y: DeepObject) {
            m.do_not_optimize(
              NodeJS(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('traversable', function* () {
        yield {
          [0]() { return DeepObject1 },
          [1]() { return DeepObject2 },
          bench(x: DeepObject, y: DeepObject) {
            m.do_not_optimize(
              traversable(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('FastEquals', function* () {
        yield {
          [0]() { return DeepObject1 },
          [1]() { return DeepObject2 },
          bench(x: DeepObject, y: DeepObject) {
            m.do_not_optimize(
              FastEquals(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('FastIsEqual', function* () {
        yield {
          [0]() { return DeepObject1 },
          [1]() { return DeepObject2 },
          bench(x: DeepObject, y: DeepObject) {
            m.do_not_optimize(
              FastIsEqual(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('ReactHooks', function* () {
        yield {
          [0]() { return DeepObject1 },
          [1]() { return DeepObject2 },
          bench(x: DeepObject, y: DeepObject) {
            m.do_not_optimize(
              ReactHooks(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('JsonJoy', function* () {
        yield {
          [0]() { return DeepObject1 },
          [1]() { return DeepObject2 },
          bench(x: DeepObject, y: DeepObject) {
            m.do_not_optimize(
              JsonJoy(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('TypeBox', function* () {
        yield {
          [0]() { return DeepObject1 },
          [1]() { return DeepObject2 },
          bench(x: DeepObject, y: DeepObject) {
            m.do_not_optimize(
              TypeBox(x, y)
            )
          }
        }
      }).gc('inner')

      m.bench('Effect', function* () {
        yield {
          [0]() { return DeepObject1 },
          [1]() { return DeepObject2 },
          bench(x: DeepObject, y: DeepObject) {
            m.do_not_optimize(
              EffectDeepObjectEquals(x, y)
            )
          }
        }
      }).gc('inner')

      // m.bench('Effect.Data', function* () {
      //   yield {
      //     [0]() { return EffectDeepObjectDecode(DeepObject1) },
      //     [1]() { return EffectDeepObjectDecode(DeepObject2) },
      //     bench(x: DeepObject, y: DeepObject) {
      //       m.do_not_optimize(
      //         EffectEqual.equals(x, y)
      //       )
      //     }
      //   }
      // }).gc('inner')

      m.bench('❲zx.equals❳', function* () {
        yield {
          [0]() { return DeepObject1 },
          [1]() { return DeepObject2 },
          bench(x: DeepObject, y: DeepObject) {
            m.do_not_optimize(
              DeepObjectEquals(x, y)
            )
          }
        }
      }).gc('inner')
    })
  })
})

m.run()
