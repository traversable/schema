import * as fc from 'fast-check'
import * as vi from 'vitest'
import { z } from 'zod/v4'

/** 
 * [2025-07-10]: Removed NodeDeepEqual because its performance is so bad that it skews results
 * // import NodeDeepEqual from 'deep-equal'
 */
import { zx } from '@traversable/zod'
import { Equal } from '@traversable/registry'
import LodashIsEqual from 'lodash.isequal'
import * as NodeJS from 'node:util'
import { deepEqual as FastEquals } from 'fast-equals'
import { isEqual as ReactHooksDeepEqual } from '@react-hookz/deep-equal'
import { fastIsEqual as FastIsEqual } from 'fast-is-equal'
import { deepEqual as JsonJoyDeepEqual } from '@jsonjoy.com/util/lib/json-equal/deepEqual/v6.js'
import { isEqual as UnderscoreIsEqual } from 'underscore'
import { Equal as TypeBoxEqual } from '@sinclair/typebox/value'
import { Schema as EffectSchema } from 'effect'

const StringArrayArbitrary = fc.array(fc.string())
const BooleanArrayArbitrary = fc.array(fc.boolean())
const StringTupleArbitrary = fc.tuple(fc.string(), fc.string(), fc.string())
const BooleanTupleArbitrary = fc.tuple(fc.boolean(), fc.boolean(), fc.boolean())
const StringRecordArbitrary = fc.dictionary(fc.string(), fc.string())
const BooleanRecordArbitrary = fc.dictionary(fc.string(), fc.boolean())
const StringObjectArbitrary = fc.record({ a: fc.string(), b: fc.string(), c: fc.string() })
const BooleanObjectArbitrary = fc.record({ a: fc.boolean(), b: fc.boolean(), c: fc.boolean() })
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
const DeepObjectCloner = fc.clone(DeepObjectArbitrary, 2)

const [StringArraySameData1, StringArraySameData2] = fc.sample(StringArrayCloner, 1)[0]
const [BooleanArraySameData1, BooleanArraySameData2] = fc.sample(BooleanArrayCloner, 1)[0]
const [StringTupleSameData1, StringTupleSameData2] = fc.sample(StringTupleCloner, 1)[0]
const [BooleanTupleSameData1, BooleanTupleSameData2] = fc.sample(BooleanTupleCloner, 1)[0]
const [StringRecordSameData1, StringRecordSameData2] = fc.sample(StringRecordCloner, 1)[0]
const [BooleanRecordSameData1, BooleanRecordSameData2] = fc.sample(BooleanRecordCloner, 1)[0]
const [StringObjectSameData1, StringObjectSameData2] = fc.sample(StringObjectCloner, 1)[0]
const [BooleanObjectSameData1, BooleanObjectSameData2] = fc.sample(BooleanObjectCloner, 1)[0]
const [DeepObjectSameData1, DeepObjectSameData2] = fc.sample(DeepObjectCloner, 1)[0]

const StringArraySchema = z.array(z.string())
const BooleanArraySchema = z.array(z.boolean())
const StringTupleSchema = z.tuple([z.string(), z.string(), z.string()])
const BooleanTupleSchema = z.tuple([z.boolean(), z.boolean(), z.boolean()])
const StringRecordSchema = z.record(z.string(), z.string())
const BooleanRecordSchema = z.record(z.string(), z.boolean())
const StringObjectSchema = z.object({ a: z.string(), b: z.string(), c: z.string() })
const BooleanObjectSchema = z.object({ a: z.boolean(), b: z.boolean(), c: z.boolean() })
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

const StringArrayEffectSchema = EffectSchema.Array(EffectSchema.String)
const BooleanArrayEffectSchema = EffectSchema.Array(EffectSchema.Boolean)
const StringTupleEffectSchema = EffectSchema.Tuple(EffectSchema.String, EffectSchema.String, EffectSchema.String)
const BooleanTupleEffectSchema = EffectSchema.Tuple(EffectSchema.Boolean, EffectSchema.Boolean, EffectSchema.Boolean)
const StringRecordEffectSchema = EffectSchema.Record({ key: EffectSchema.String, value: EffectSchema.String })
const BooleanRecordEffectSchema = EffectSchema.Record({ key: EffectSchema.String, value: EffectSchema.Boolean })
const StringObjectEffectSchema = EffectSchema.Struct({ a: EffectSchema.String, b: EffectSchema.String, c: EffectSchema.String })
const BooleanObjectEffectSchema = EffectSchema.Struct({ a: EffectSchema.Boolean, b: EffectSchema.Boolean, c: EffectSchema.Boolean })
const DeepObjectEffectSchema = EffectSchema.Struct({
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

const StringArrayEquals = zx.equals(StringArraySchema)
const BooleanArrayEquals = zx.equals(BooleanArraySchema)
const StringTupleEquals = zx.equals(StringTupleSchema)
const BooleanTupleEquals = zx.equals(BooleanTupleSchema)
const StringRecordEquals = zx.equals(StringRecordSchema)
const BooleanRecordEquals = zx.equals(BooleanRecordSchema)
const StringObjectEquals = zx.equals(StringObjectSchema)
const BooleanObjectEquals = zx.equals(BooleanObjectSchema)
const DeepObjectEquals = zx.equals(DeepObjectSchema)

const EffectStringArrayEquals = EffectSchema.equivalence(StringArrayEffectSchema)
const EffectBooleanArrayEquals = EffectSchema.equivalence(BooleanArrayEffectSchema)
const EffectStringTupleEquals = EffectSchema.equivalence(StringTupleEffectSchema)
const EffectBooleanTupleEquals = EffectSchema.equivalence(BooleanTupleEffectSchema)
const EffectStringRecordEquals = EffectSchema.equivalence(StringRecordEffectSchema)
const EffectBooleanRecordEquals = EffectSchema.equivalence(BooleanRecordEffectSchema)
const EffectStringObjectEquals = EffectSchema.equivalence(StringObjectEffectSchema)
const EffectBooleanObjectEquals = EffectSchema.equivalence(BooleanObjectEffectSchema)
const EffectDeepObjectEquals = EffectSchema.equivalence(DeepObjectEffectSchema)

vi.describe('〖🏁️〗‹‹‹ ❲zx.equals❳: string array (same data)', () => {
  vi.bench('❲UnderscoreIsEqual❳', () => {
    UnderscoreIsEqual(StringArraySameData1, StringArraySameData2)
  })
  vi.bench('❲LodashIsEqual❳', () => {
    LodashIsEqual(StringArraySameData1, StringArraySameData2)
  })
  vi.bench('❲NodeJS.isDeepStrictEqual❳', () => {
    NodeJS.isDeepStrictEqual(StringArraySameData1, StringArraySameData2)
  })
  vi.bench('❲@traversable/registry/Equal.deep❳', () => {
    Equal.deep(StringArraySameData1, StringArraySameData2)
  })
  vi.bench('❲FastEquals❳', () => {
    FastEquals(StringArraySameData1, StringArraySameData2)
  })
  vi.bench('❲FastIsEqual❳', () => {
    FastIsEqual(StringArraySameData1, StringArraySameData2)
  })
  vi.bench('❲ReactHooksDeepEqual❳', () => {
    ReactHooksDeepEqual(StringArraySameData1, StringArraySameData2)
  })
  vi.bench('❲JsonJoyDeepEqual❳', () => {
    JsonJoyDeepEqual(StringArraySameData1, StringArraySameData2)
  })
  vi.bench('❲TypeBoxEqual❳', () => {
    TypeBoxEqual(StringArraySameData1, StringArraySameData2)
  })
  vi.bench('❲EffectEquals❳', () => {
    EffectStringArrayEquals(StringArraySameData1, StringArraySameData2)
  })
  vi.bench('❲zx.equals❳', () => {
    StringArrayEquals(StringArraySameData1, StringArraySameData2)
  })
})

vi.describe('〖🏁️〗‹‹‹ ❲zx.equals❳: boolean array (same data)', () => {
  vi.bench('❲UnderscoreIsEqual❳', () => {
    UnderscoreIsEqual(BooleanArraySameData1, BooleanArraySameData2)
  })
  vi.bench('❲LodashIsEqual❳', () => {
    LodashIsEqual(BooleanArraySameData1, BooleanArraySameData2)
  })
  vi.bench('❲NodeJS.isDeepStrictEqual❳', () => {
    NodeJS.isDeepStrictEqual(BooleanArraySameData1, BooleanArraySameData2)
  })
  vi.bench('❲@traversable/registry/Equal.deep❳', () => {
    Equal.deep(BooleanArraySameData1, BooleanArraySameData2)
  })
  vi.bench('❲FastEquals❳', () => {
    FastEquals(BooleanArraySameData1, BooleanArraySameData2)
  })
  vi.bench('❲FastIsEqual❳', () => {
    FastIsEqual(BooleanArraySameData1, BooleanArraySameData2)
  })
  vi.bench('❲ReactHooksDeepEqual❳', () => {
    ReactHooksDeepEqual(BooleanArraySameData1, BooleanArraySameData2)
  })
  vi.bench('❲JsonJoyDeepEqual❳', () => {
    JsonJoyDeepEqual(BooleanArraySameData1, BooleanArraySameData2)
  })
  vi.bench('❲TypeBoxEqual❳', () => {
    TypeBoxEqual(BooleanArraySameData1, BooleanArraySameData2)
  })
  vi.bench('❲EffectEquals❳', () => {
    EffectBooleanArrayEquals(BooleanArraySameData1, BooleanArraySameData2)
  })
  vi.bench('❲zx.equals❳', () => {
    BooleanArrayEquals(BooleanArraySameData1, BooleanArraySameData2)
  })
})

vi.describe('〖🏁️〗‹‹‹ ❲zx.equals❳: string tuple (same data)', () => {
  vi.bench('❲UnderscoreIsEqual❳', () => {
    UnderscoreIsEqual(StringTupleSameData1, StringTupleSameData2)
  })
  vi.bench('❲LodashIsEqual❳', () => {
    LodashIsEqual(StringTupleSameData1, StringTupleSameData2)
  })
  vi.bench('❲NodeJS.isDeepStrictEqual❳', () => {
    NodeJS.isDeepStrictEqual(StringTupleSameData1, StringTupleSameData2)
  })
  vi.bench('❲@traversable/registry/Equal.deep❳', () => {
    Equal.deep(StringTupleSameData1, StringTupleSameData2)
  })
  vi.bench('❲FastEquals❳', () => {
    FastEquals(StringTupleSameData1, StringTupleSameData2)
  })
  vi.bench('❲FastIsEqual❳', () => {
    FastIsEqual(StringTupleSameData1, StringTupleSameData2)
  })
  vi.bench('❲ReactHooksDeepEqual❳', () => {
    ReactHooksDeepEqual(StringTupleSameData1, StringTupleSameData2)
  })
  vi.bench('❲JsonJoyDeepEqual❳', () => {
    JsonJoyDeepEqual(StringTupleSameData1, StringTupleSameData2)
  })
  vi.bench('❲TypeBoxEqual❳', () => {
    TypeBoxEqual(StringTupleSameData1, StringTupleSameData2)
  })
  vi.bench('❲EffectEquals❳', () => {
    EffectStringTupleEquals(StringTupleSameData1, StringTupleSameData2)
  })
  vi.bench('❲zx.equals❳', () => {
    StringTupleEquals(StringTupleSameData1, StringTupleSameData2)
  })
})

vi.describe('〖🏁️〗‹‹‹ ❲zx.equals❳: boolean tuple (same data)', () => {
  vi.bench('❲UnderscoreIsEqual❳', () => {
    UnderscoreIsEqual(BooleanTupleSameData1, BooleanTupleSameData2)
  })
  vi.bench('❲LodashIsEqual❳', () => {
    LodashIsEqual(BooleanTupleSameData1, BooleanTupleSameData2)
  })
  vi.bench('❲NodeJS.isDeepStrictEqual❳', () => {
    NodeJS.isDeepStrictEqual(BooleanTupleSameData1, BooleanTupleSameData2)
  })
  vi.bench('❲@traversable/registry/Equal.deep❳', () => {
    Equal.deep(BooleanTupleSameData1, BooleanTupleSameData2)
  })
  vi.bench('❲FastEquals❳', () => {
    FastEquals(BooleanTupleSameData1, BooleanTupleSameData2)
  })
  vi.bench('❲FastIsEqual❳', () => {
    FastIsEqual(BooleanTupleSameData1, BooleanTupleSameData2)
  })
  vi.bench('❲ReactHooksDeepEqual❳', () => {
    ReactHooksDeepEqual(BooleanTupleSameData1, BooleanTupleSameData2)
  })
  vi.bench('❲JsonJoyDeepEqual❳', () => {
    JsonJoyDeepEqual(BooleanTupleSameData1, BooleanTupleSameData2)
  })
  vi.bench('❲TypeBoxEqual❳', () => {
    TypeBoxEqual(BooleanTupleSameData1, BooleanTupleSameData2)
  })
  vi.bench('❲EffectEquals❳', () => {
    EffectBooleanTupleEquals(BooleanTupleSameData1, BooleanTupleSameData2)
  })
  vi.bench('❲zx.equals❳', () => {
    BooleanTupleEquals(BooleanTupleSameData1, BooleanTupleSameData2)
  })
})

vi.describe('〖🏁️〗‹‹‹ ❲zx.equals❳: string record (same data)', () => {
  vi.bench('❲UnderscoreIsEqual❳', () => {
    UnderscoreIsEqual(StringRecordSameData1, StringRecordSameData2)
  })
  vi.bench('❲LodashIsEqual❳', () => {
    LodashIsEqual(StringRecordSameData1, StringRecordSameData2)
  })
  vi.bench('❲NodeJS.isDeepStrictEqual❳', () => {
    NodeJS.isDeepStrictEqual(StringRecordSameData1, StringRecordSameData2)
  })
  vi.bench('❲@traversable/registry/Equal.deep❳', () => {
    Equal.deep(StringRecordSameData1, StringRecordSameData2)
  })
  vi.bench('❲FastEquals❳', () => {
    FastEquals(StringRecordSameData1, StringRecordSameData2)
  })
  vi.bench('❲FastIsEqual❳', () => {
    FastIsEqual(StringRecordSameData1, StringRecordSameData2)
  })
  vi.bench('❲ReactHooksDeepEqual❳', () => {
    ReactHooksDeepEqual(StringRecordSameData1, StringRecordSameData2)
  })
  vi.bench('❲JsonJoyDeepEqual❳', () => {
    JsonJoyDeepEqual(StringRecordSameData1, StringRecordSameData2)
  })
  vi.bench('❲TypeBoxEqual❳', () => {
    TypeBoxEqual(StringRecordSameData1, StringRecordSameData2)
  })
  vi.bench('❲EffectEquals❳', () => {
    EffectStringRecordEquals(StringRecordSameData1, StringRecordSameData2)
  })
  vi.bench('❲zx.equals❳', () => {
    StringRecordEquals(StringRecordSameData1, StringRecordSameData2)
  })
})

vi.describe('〖🏁️〗‹‹‹ ❲zx.equals❳: boolean record (same data)', () => {
  vi.bench('❲UnderscoreIsEqual❳', () => {
    UnderscoreIsEqual(BooleanRecordSameData1, BooleanRecordSameData2)
  })
  vi.bench('❲LodashIsEqual❳', () => {
    LodashIsEqual(BooleanRecordSameData1, BooleanRecordSameData2)
  })
  vi.bench('❲NodeJS.isDeepStrictEqual❳', () => {
    NodeJS.isDeepStrictEqual(BooleanRecordSameData1, BooleanRecordSameData2)
  })
  vi.bench('❲@traversable/registry/Equal.deep❳', () => {
    Equal.deep(BooleanRecordSameData1, BooleanRecordSameData2)
  })
  vi.bench('❲FastEquals❳', () => {
    FastEquals(BooleanRecordSameData1, BooleanRecordSameData2)
  })
  vi.bench('❲FastIsEqual❳', () => {
    FastIsEqual(BooleanRecordSameData1, BooleanRecordSameData2)
  })
  vi.bench('❲ReactHooksDeepEqual❳', () => {
    ReactHooksDeepEqual(BooleanRecordSameData1, BooleanRecordSameData2)
  })
  vi.bench('❲JsonJoyDeepEqual❳', () => {
    JsonJoyDeepEqual(BooleanRecordSameData1, BooleanRecordSameData2)
  })
  vi.bench('❲TypeBoxEqual❳', () => {
    TypeBoxEqual(BooleanRecordSameData1, BooleanRecordSameData2)
  })
  vi.bench('❲EffectEquals❳', () => {
    EffectBooleanRecordEquals(BooleanRecordSameData1, BooleanRecordSameData2)
  })
  vi.bench('❲zx.equals❳', () => {
    BooleanRecordEquals(BooleanRecordSameData1, BooleanRecordSameData2)
  })
})

vi.describe('〖🏁️〗‹‹‹ ❲zx.equals❳: string object (same data)', () => {
  vi.bench('❲UnderscoreIsEqual❳', () => {
    UnderscoreIsEqual(StringObjectSameData1, StringObjectSameData2)
  })
  vi.bench('❲LodashIsEqual❳', () => {
    LodashIsEqual(StringObjectSameData1, StringObjectSameData2)
  })
  vi.bench('❲NodeJS.isDeepStrictEqual❳', () => {
    NodeJS.isDeepStrictEqual(StringObjectSameData1, StringObjectSameData2)
  })
  vi.bench('❲@traversable/registry/Equal.deep❳', () => {
    Equal.deep(StringObjectSameData1, StringObjectSameData2)
  })
  vi.bench('❲FastEquals❳', () => {
    FastEquals(StringObjectSameData1, StringObjectSameData2)
  })
  vi.bench('❲FastIsEqual❳', () => {
    FastIsEqual(StringObjectSameData1, StringObjectSameData2)
  })
  vi.bench('❲ReactHooksDeepEqual❳', () => {
    ReactHooksDeepEqual(StringObjectSameData1, StringObjectSameData2)
  })
  vi.bench('❲JsonJoyDeepEqual❳', () => {
    JsonJoyDeepEqual(StringObjectSameData1, StringObjectSameData2)
  })
  vi.bench('❲TypeBoxEqual❳', () => {
    TypeBoxEqual(StringObjectSameData1, StringObjectSameData2)
  })
  vi.bench('❲EffectEquals❳', () => {
    EffectStringObjectEquals(StringObjectSameData1, StringObjectSameData2)
  })
  vi.bench('❲zx.equals❳', () => {
    StringObjectEquals(StringObjectSameData1, StringObjectSameData2)
  })
})

vi.describe('〖🏁️〗‹‹‹ ❲zx.equals❳: boolean object (same data)', () => {
  vi.bench('❲UnderscoreIsEqual❳', () => {
    UnderscoreIsEqual(BooleanObjectSameData1, BooleanObjectSameData2)
  })
  vi.bench('❲LodashIsEqual❳', () => {
    LodashIsEqual(BooleanObjectSameData1, BooleanObjectSameData2)
  })
  vi.bench('❲NodeJS.isDeepStrictEqual❳', () => {
    NodeJS.isDeepStrictEqual(BooleanObjectSameData1, BooleanObjectSameData2)
  })
  vi.bench('❲@traversable/registry/Equal.deep❳', () => {
    Equal.deep(BooleanObjectSameData1, BooleanObjectSameData2)
  })
  vi.bench('❲FastEquals❳', () => {
    FastEquals(BooleanObjectSameData1, BooleanObjectSameData2)
  })
  vi.bench('❲FastIsEqual❳', () => {
    FastIsEqual(BooleanObjectSameData1, BooleanObjectSameData2)
  })
  vi.bench('❲ReactHooksDeepEqual❳', () => {
    ReactHooksDeepEqual(BooleanObjectSameData1, BooleanObjectSameData2)
  })
  vi.bench('❲JsonJoyDeepEqual❳', () => {
    JsonJoyDeepEqual(BooleanObjectSameData1, BooleanObjectSameData2)
  })
  vi.bench('❲TypeBoxEqual❳', () => {
    TypeBoxEqual(BooleanObjectSameData1, BooleanObjectSameData2)
  })
  vi.bench('❲EffectEquals❳', () => {
    EffectBooleanObjectEquals(BooleanObjectSameData1, BooleanObjectSameData2)
  })
  vi.bench('❲zx.equals❳', () => {
    BooleanObjectEquals(BooleanObjectSameData1, BooleanObjectSameData2)
  })
})

vi.describe('〖🏁️〗‹‹‹ ❲zx.equals❳: deep object (same data)', () => {
  vi.bench('❲UnderscoreIsEqual❳', () => {
    UnderscoreIsEqual(DeepObjectSameData1, DeepObjectSameData2)
  })
  vi.bench('❲LodashIsEqual❳', () => {
    LodashIsEqual(DeepObjectSameData1, DeepObjectSameData2)
  })
  vi.bench('❲NodeJS.isDeepStrictEqual❳', () => {
    NodeJS.isDeepStrictEqual(DeepObjectSameData1, DeepObjectSameData2)
  })
  vi.bench('❲@traversable/registry/Equal.deep❳', () => {
    Equal.deep(DeepObjectSameData1, DeepObjectSameData2)
  })
  vi.bench('❲FastEquals❳', () => {
    FastEquals(DeepObjectSameData1, DeepObjectSameData2)
  })
  vi.bench('❲FastIsEqual❳', () => {
    FastIsEqual(DeepObjectSameData1, DeepObjectSameData2)
  })
  vi.bench('❲ReactHooksDeepEqual❳', () => {
    ReactHooksDeepEqual(DeepObjectSameData1, DeepObjectSameData2)
  })
  vi.bench('❲JsonJoyDeepEqual❳', () => {
    JsonJoyDeepEqual(DeepObjectSameData1, DeepObjectSameData2)
  })
  vi.bench('❲TypeBoxEqual❳', () => {
    TypeBoxEqual(DeepObjectSameData1, DeepObjectSameData2)
  })
  vi.bench('❲EffectEquals❳', () => {
    EffectDeepObjectEquals(DeepObjectSameData1, DeepObjectSameData2)
  })
  vi.bench('❲zx.equals❳', () => {
    DeepObjectEquals(DeepObjectSameData1, DeepObjectSameData2)
  })
})
