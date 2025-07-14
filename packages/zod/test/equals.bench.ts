import * as fc from 'fast-check'
import * as vi from 'vitest'
import { z } from 'zod'
import * as m from 'mitata'


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
import { Schema as EffectSchema } from 'effect'
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

const [StringArray1, StringArray2] = fc.sample(StringArrayCloner, 1)[0]
const [BooleanArray1, BooleanArray2] = fc.sample(BooleanArrayCloner, 1)[0]
const [StringTuple1, StringTuple2] = fc.sample(StringTupleCloner, 1)[0]
const [BooleanTuple1, BooleanTuple2] = fc.sample(BooleanTupleCloner, 1)[0]
const [StringRecord1, StringRecord2] = fc.sample(StringRecordCloner, 1)[0]
const [BooleanRecord1, BooleanRecord2] = fc.sample(BooleanRecordCloner, 1)[0]
const [StringObject1, StringObject2] = fc.sample(StringObjectCloner, 1)[0]
const [BooleanObject1, BooleanObject2] = fc.sample(BooleanObjectCloner, 1)[0]
const [DeepObject1, DeepObject2] = fc.sample(DeepObjectCloner, 1)[0]

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

const BooleanArrayEquals = zx.equals(BooleanArraySchema)
const StringArrayEquals = zx.equals(StringArraySchema)
const BooleanTupleEquals = zx.equals(BooleanTupleSchema)
const StringTupleEquals = zx.equals(StringTupleSchema)
const BooleanRecordEquals = zx.equals(BooleanRecordSchema)
const StringRecordEquals = zx.equals(StringRecordSchema)
const BooleanObjectEquals = zx.equals(BooleanObjectSchema)
const StringObjectEquals = zx.equals(StringObjectSchema)
const DeepObjectEquals = zx.equals(DeepObjectSchema)

const EffectBooleanArrayEquals = EffectSchema.equivalence(BooleanArrayEffectSchema)
const EffectStringArrayEquals = EffectSchema.equivalence(StringArrayEffectSchema)
const EffectBooleanTupleEquals = EffectSchema.equivalence(BooleanTupleEffectSchema)
const EffectStringTupleEquals = EffectSchema.equivalence(StringTupleEffectSchema)
const EffectBooleanRecordEquals = EffectSchema.equivalence(BooleanRecordEffectSchema)
const EffectStringRecordEquals = EffectSchema.equivalence(StringRecordEffectSchema)
const EffectBooleanObjectEquals = EffectSchema.equivalence(BooleanObjectEffectSchema)
const EffectStringObjectEquals = EffectSchema.equivalence(StringObjectEffectSchema)
const EffectDeepObjectEquals = EffectSchema.equivalence(DeepObjectEffectSchema)

m.summary(() => {
  m.group('〖🏁️〗‹‹‹ boolean array', () => {
    m.barplot(() => {
      m.bench('Underscore', () => {
        m.do_not_optimize(
          Underscore(
            BooleanArray1,
            BooleanArray2
          )
        )
      }).gc('inner')
      m.bench('Lodash', () => {
        m.do_not_optimize(
          Lodash(
            BooleanArray1,
            BooleanArray2
          )
        )
      }).gc('inner')
      m.bench('NodeJS', () => {
        m.do_not_optimize(
          NodeJS(
            BooleanArray1,
            BooleanArray2
          )
        )
      }).gc('inner')
      m.bench('traversable', () => {
        m.do_not_optimize(
          traversable(
            BooleanArray1,
            BooleanArray2
          )
        )
      }).gc('inner')
      m.bench('FastEquals', () => {
        m.do_not_optimize(
          FastEquals(
            BooleanArray1,
            BooleanArray2
          )
        )
      }).gc('inner')
      m.bench('FastIsEqual', () => {
        m.do_not_optimize(
          FastIsEqual(
            BooleanArray1,
            BooleanArray2
          )
        )
      }).gc('inner')
      m.bench('ReactHooks', () => {
        m.do_not_optimize(
          ReactHooks(
            BooleanArray1,
            BooleanArray2
          )
        )
      }).gc('inner')
      m.bench('JsonJoy', () => {
        m.do_not_optimize(
          JsonJoy(
            BooleanArray1,
            BooleanArray2
          )
        )
      }).gc('inner')
      m.bench('TypeBox', () => {
        m.do_not_optimize(
          TypeBox(
            BooleanArray1,
            BooleanArray2
          )
        )
      }).gc('inner')
      m.bench('EffectTS', () => {
        m.do_not_optimize(
          EffectBooleanArrayEquals(
            BooleanArray1,
            BooleanArray2
          )
        )
      }).gc('inner')
      m.bench('❲zx.equals❳', () => {
        m.do_not_optimize(
          BooleanArrayEquals(
            BooleanArray1,
            BooleanArray2
          )
        )
      }).gc('inner')
    })
  })
})

m.summary(() => {
  m.group('〖🏁️〗‹‹‹ string array', () => {
    m.barplot(() => {
      m.bench('Underscore', () => {
        m.do_not_optimize(
          Underscore(
            StringArray1,
            StringArray2
          )
        )
      }).gc('inner')
      m.bench('Lodash', () => {
        m.do_not_optimize(
          Lodash(
            StringArray1,
            StringArray2
          )
        )
      }).gc('inner')
      m.bench('NodeJS', () => {
        m.do_not_optimize(
          NodeJS(
            StringArray1,
            StringArray2
          )
        )
      }).gc('inner')
      m.bench('traversable', () => {
        m.do_not_optimize(
          traversable(
            StringArray1,
            StringArray2
          )
        )
      }).gc('inner')
      m.bench('FastEquals', () => {
        m.do_not_optimize(
          FastEquals(
            StringArray1,
            StringArray2
          )
        )
      }).gc('inner')
      m.bench('FastIsEqual', () => {
        m.do_not_optimize(
          FastIsEqual(
            StringArray1,
            StringArray2
          )
        )
      }).gc('inner')
      m.bench('JsonJoy', () => {
        m.do_not_optimize(
          JsonJoy(
            StringArray1,
            StringArray2
          )
        )
      }).gc('inner')
      m.bench('TypeBox', () => {
        m.do_not_optimize(
          TypeBox(
            StringArray1,
            StringArray2
          )
        )
      }).gc('inner')
      m.bench('EffectTS', () => {
        m.do_not_optimize(
          EffectStringArrayEquals(
            StringArray1,
            StringArray2
          )
        )
      }).gc('inner')
      m.bench('❲zx.equals❳', () => {
        m.do_not_optimize(
          StringArrayEquals(
            StringArray1,
            StringArray2
          )
        )
      }).gc('inner')
    })
  })
})

m.summary(() => {
  m.group('〖🏁️〗‹‹‹ boolean tuple', () => {
    m.barplot(() => {
      m.bench('Underscore', () => {
        m.do_not_optimize(
          Underscore(
            BooleanTuple1,
            BooleanTuple2
          )
        )
      }).gc('inner')
      m.bench('Lodash', () => {
        m.do_not_optimize(
          Lodash(
            BooleanTuple1,
            BooleanTuple2
          )
        )
      }).gc('inner')
      m.bench('NodeJS', () => {
        m.do_not_optimize(
          NodeJS(
            BooleanTuple1,
            BooleanTuple2
          )
        )
      }).gc('inner')
      m.bench('traversable', () => {
        m.do_not_optimize(
          traversable(
            BooleanTuple1,
            BooleanTuple2
          )
        )
      }).gc('inner')
      m.bench('FastEquals', () => {
        m.do_not_optimize(
          FastEquals(
            BooleanTuple1,
            BooleanTuple2
          )
        )
      }).gc('inner')
      m.bench('FastIsEqual', () => {
        m.do_not_optimize(
          FastIsEqual(
            BooleanTuple1,
            BooleanTuple2
          )
        )
      }).gc('inner')
      m.bench('ReactHooks', () => {
        m.do_not_optimize(
          ReactHooks(
            BooleanTuple1,
            BooleanTuple2
          )
        )
      }).gc('inner')
      m.bench('JsonJoy', () => {
        m.do_not_optimize(
          JsonJoy(
            BooleanTuple1,
            BooleanTuple2
          )
        )
      }).gc('inner')
      m.bench('TypeBox', () => {
        m.do_not_optimize(
          TypeBox(
            BooleanTuple1,
            BooleanTuple2
          )
        )
      }).gc('inner')
      m.bench('EffectTS', () => {
        m.do_not_optimize(
          EffectBooleanTupleEquals(
            BooleanTuple1,
            BooleanTuple2
          )
        )
      }).gc('inner')
      m.bench('❲zx.equals❳', () => {
        m.do_not_optimize(
          BooleanTupleEquals(
            BooleanTuple1,
            BooleanTuple2
          )
        )
      }).gc('inner')
    })
  })
})

m.summary(() => {
  m.group('〖🏁️〗‹‹‹ string tuple', () => {
    m.barplot(() => {
      m.bench('Underscore', () => {
        m.do_not_optimize(
          Underscore(
            StringTuple1,
            StringTuple2
          )
        )
      }).gc('inner')
      m.bench('Lodash', () => {
        m.do_not_optimize(
          Lodash(
            StringTuple1,
            StringTuple2
          )
        )
      }).gc('inner')
      m.bench('NodeJS', () => {
        m.do_not_optimize(
          NodeJS(
            StringTuple1,
            StringTuple2
          )
        )
      }).gc('inner')
      m.bench('traversable', () => {
        m.do_not_optimize(
          traversable(
            StringTuple1,
            StringTuple2
          )
        )
      }).gc('inner')
      m.bench('FastEquals', () => {
        m.do_not_optimize(
          FastEquals(
            StringTuple1,
            StringTuple2
          )
        )
      }).gc('inner')
      m.bench('FastIsEqual', () => {
        m.do_not_optimize(
          FastIsEqual(
            StringTuple1,
            StringTuple2
          )
        )
      }).gc('inner')
      m.bench('ReactHooks', () => {
        m.do_not_optimize(
          ReactHooks(
            StringTuple1,
            StringTuple2
          )
        )
      }).gc('inner')
      m.bench('JsonJoy', () => {
        m.do_not_optimize(
          JsonJoy(
            StringTuple1,
            StringTuple2
          )
        )
      }).gc('inner')
      m.bench('TypeBox', () => {
        m.do_not_optimize(
          TypeBox(
            StringTuple1,
            StringTuple2
          )
        )
      }).gc('inner')
      m.bench('EffectTS', () => {
        m.do_not_optimize(
          EffectStringTupleEquals(
            StringTuple1,
            StringTuple2
          )
        )
      }).gc('inner')
      m.bench('❲zx.equals❳', () => {
        m.do_not_optimize(
          StringTupleEquals(
            StringTuple1,
            StringTuple2
          )
        )
      }).gc('inner')
    })
  })
})

m.summary(() => {
  m.group('〖🏁️〗‹‹‹ boolean record', () => {
    m.barplot(() => {
      m.bench('Underscore', () => {
        m.do_not_optimize(
          Underscore(
            BooleanRecord1,
            BooleanRecord2
          )
        )
      }).gc('inner')
      m.bench('Lodash', () => {
        m.do_not_optimize(
          Lodash(
            BooleanRecord1,
            BooleanRecord2
          )
        )
      }).gc('inner')
      m.bench('NodeJS', () => {
        m.do_not_optimize(
          NodeJS(
            BooleanRecord1,
            BooleanRecord2
          )
        )
      }).gc('inner')
      m.bench('traversable', () => {
        m.do_not_optimize(
          traversable(
            BooleanRecord1,
            BooleanRecord2
          )
        )
      }).gc('inner')
      m.bench('FastEquals', () => {
        m.do_not_optimize(
          FastEquals(
            BooleanRecord1,
            BooleanRecord2
          )
        )
      }).gc('inner')
      m.bench('FastIsEqual', () => {
        m.do_not_optimize(
          FastIsEqual(
            BooleanRecord1,
            BooleanRecord2
          )
        )
      }).gc('inner')
      m.bench('ReactHooks', () => {
        m.do_not_optimize(
          ReactHooks(
            BooleanRecord1,
            BooleanRecord2
          )
        )
      }).gc('inner')
      m.bench('JsonJoy', () => {
        m.do_not_optimize(
          JsonJoy(
            BooleanRecord1,
            BooleanRecord2
          )
        )
      }).gc('inner')
      m.bench('TypeBox', () => {
        m.do_not_optimize(
          TypeBox(
            BooleanRecord1,
            BooleanRecord2
          )
        )
      }).gc('inner')
      m.bench('EffectTS', () => {
        m.do_not_optimize(
          EffectBooleanRecordEquals(
            BooleanRecord1,
            BooleanRecord2
          )
        )
      }).gc('inner')
      m.bench('❲zx.equals❳', () => {
        m.do_not_optimize(
          BooleanRecordEquals(
            BooleanRecord1,
            BooleanRecord2
          )
        )
      }).gc('inner')
    })
  })
})

m.summary(() => {
  m.group('〖🏁️〗‹‹‹ string record', () => {
    m.barplot(() => {
      m.bench('Underscore', () => {
        m.do_not_optimize(
          Underscore(
            StringRecord1,
            StringRecord2
          )
        )
      }).gc('inner')
      m.bench('Lodash', () => {
        m.do_not_optimize(
          Lodash(
            StringRecord1,
            StringRecord2
          )
        )
      }).gc('inner')
      m.bench('NodeJS', () => {
        m.do_not_optimize(
          NodeJS(
            StringRecord1,
            StringRecord2
          )
        )
      }).gc('inner')
      m.bench('traversable', () => {
        m.do_not_optimize(
          traversable(
            StringRecord1,
            StringRecord2
          )
        )
      }).gc('inner')
      m.bench('FastEquals', () => {
        m.do_not_optimize(
          FastEquals(
            StringRecord1,
            StringRecord2
          )
        )
      }).gc('inner')
      m.bench('FastIsEqual', () => {
        m.do_not_optimize(
          FastIsEqual(
            StringRecord1,
            StringRecord2
          )
        )
      }).gc('inner')
      m.bench('ReactHooks', () => {
        m.do_not_optimize(
          ReactHooks(
            StringRecord1,
            StringRecord2
          )
        )
      }).gc('inner')
      m.bench('JsonJoy', () => {
        m.do_not_optimize(
          JsonJoy(
            StringRecord1,
            StringRecord2
          )
        )
      }).gc('inner')
      m.bench('TypeBox', () => {
        m.do_not_optimize(
          TypeBox(
            StringRecord1,
            StringRecord2
          )
        )
      }).gc('inner')
      m.bench('EffectTS', () => {
        m.do_not_optimize(
          EffectStringRecordEquals(
            StringRecord1,
            StringRecord2
          )
        )
      }).gc('inner')
      m.bench('❲zx.equals❳', () => {
        m.do_not_optimize(
          StringRecordEquals(
            StringRecord1,
            StringRecord2
          )
        )
      }).gc('inner')
    })
  })
})

m.summary(() => {
  m.group('〖🏁️〗‹‹‹ boolean object', () => {
    m.barplot(() => {
      m.bench('Underscore', () => {
        m.do_not_optimize(
          Underscore(
            BooleanObject1,
            BooleanObject2
          )
        )
      }).gc('inner')
      m.bench('Lodash', () => {
        m.do_not_optimize(
          Lodash(
            BooleanObject1,
            BooleanObject2
          )
        )
      }).gc('inner')
      m.bench('NodeJS', () => {
        m.do_not_optimize(
          NodeJS(
            BooleanObject1,
            BooleanObject2
          )
        )
      }).gc('inner')
      m.bench('traversable', () => {
        m.do_not_optimize(
          traversable(
            BooleanObject1,
            BooleanObject2
          )
        )
      }).gc('inner')
      m.bench('FastEquals', () => {
        m.do_not_optimize(
          FastEquals(
            BooleanObject1,
            BooleanObject2
          )
        )
      }).gc('inner')
      m.bench('FastIsEqual', () => {
        m.do_not_optimize(
          FastIsEqual(
            BooleanObject1,
            BooleanObject2
          )
        )
      }).gc('inner')
      m.bench('ReactHooks', () => {
        m.do_not_optimize(
          ReactHooks(
            BooleanObject1,
            BooleanObject2
          )
        )
      }).gc('inner')
      m.bench('JsonJoy', () => {
        m.do_not_optimize(
          JsonJoy(
            BooleanObject1,
            BooleanObject2
          )
        )
      }).gc('inner')
      m.bench('TypeBox', () => {
        m.do_not_optimize(
          TypeBox(
            BooleanObject1,
            BooleanObject2
          )
        )
      }).gc('inner')
      m.bench('EffectTS', () => {
        m.do_not_optimize(
          EffectBooleanObjectEquals(
            BooleanObject1,
            BooleanObject2
          )
        )
      }).gc('inner')
      m.bench('❲zx.equals❳', () => {
        m.do_not_optimize(
          BooleanObjectEquals(
            BooleanObject1,
            BooleanObject2
          )
        )
      }).gc('inner')
    })
  })
})

m.summary(() => {
  m.group('〖🏁️〗‹‹‹ string object', () => {
    m.barplot(() => {
      m.bench('Underscore', () => {
        m.do_not_optimize(
          Underscore(
            StringObject1,
            StringObject2
          )
        )
      }).gc('inner')
      m.bench('Lodash', () => {
        m.do_not_optimize(
          Lodash(
            StringObject1,
            StringObject2
          )
        )
      }).gc('inner')
      m.bench('NodeJS', () => {
        m.do_not_optimize(
          NodeJS(
            StringObject1,
            StringObject2
          )
        )
      }).gc('inner')
      m.bench('traversable', () => {
        m.do_not_optimize(
          traversable(
            StringObject1,
            StringObject2
          )
        )
      }).gc('inner')
      m.bench('FastEquals', () => {
        m.do_not_optimize(
          FastEquals(
            StringObject1,
            StringObject2
          )
        )
      }).gc('inner')
      m.bench('FastIsEqual', () => {
        m.do_not_optimize(
          FastIsEqual(
            StringObject1,
            StringObject2
          )
        )
      }).gc('inner')
      m.bench('ReactHooks', () => {
        m.do_not_optimize(
          ReactHooks(
            StringObject1,
            StringObject2
          )
        )
      }).gc('inner')
      m.bench('JsonJoy', () => {
        m.do_not_optimize(
          JsonJoy(
            StringObject1,
            StringObject2
          )
        )
      }).gc('inner')
      m.bench('TypeBox', () => {
        m.do_not_optimize(
          TypeBox(
            StringObject1,
            StringObject2
          )
        )
      }).gc('inner')
      m.bench('EffectTS', () => {
        m.do_not_optimize(
          EffectStringObjectEquals(
            StringObject1,
            StringObject2
          )
        )
      }).gc('inner')
      m.bench('❲zx.equals❳', () => {
        m.do_not_optimize(
          StringObjectEquals(
            StringObject1,
            StringObject2
          )
        )
      }).gc('inner')
    })
  })
})

m.summary(() => {
  m.group('〖🏁️〗‹‹‹ deep object', () => {
    m.barplot(() => {
      m.bench('Underscore', () => {
        m.do_not_optimize(
          Underscore(
            DeepObject1,
            DeepObject2
          )
        )
      }).gc('inner')
      m.bench('Lodash', () => {
        m.do_not_optimize(
          Lodash(
            DeepObject1,
            DeepObject2
          )
        )
      }).gc('inner')
      m.bench('NodeJS', () => {
        m.do_not_optimize(
          NodeJS(
            DeepObject1,
            DeepObject2
          )
        )
      }).gc('inner')
      m.bench('traversable', () => {
        m.do_not_optimize(
          traversable(
            DeepObject1,
            DeepObject2
          )
        )
      }).gc('inner')
      m.bench('FastEquals', () => {
        m.do_not_optimize(
          FastEquals(
            DeepObject1,
            DeepObject2
          )
        )
      }).gc('inner')
      m.bench('FastIsEqual', () => {
        m.do_not_optimize(
          FastIsEqual(
            DeepObject1,
            DeepObject2
          )
        )
      }).gc('inner')
      m.bench('ReactHooks', () => {
        m.do_not_optimize(
          ReactHooks(
            DeepObject1,
            DeepObject2
          )
        )
      }).gc('inner')
      m.bench('JsonJoy', () => {
        m.do_not_optimize(
          JsonJoy(
            DeepObject1,
            DeepObject2
          )
        )
      }).gc('inner')
      m.bench('TypeBox', () => {
        m.do_not_optimize(
          TypeBox(
            DeepObject1,
            DeepObject2
          )
        )
      }).gc('inner')
      m.bench('EffectTS', () => {
        m.do_not_optimize(
          EffectDeepObjectEquals(
            DeepObject1,
            DeepObject2
          )
        )
      }).gc('inner')
      m.bench('❲zx.equals❳', () => {
        m.do_not_optimize(
          DeepObjectEquals(
            DeepObject1,
            DeepObject2
          )
        )
      }).gc('inner')
    })
  })
})

m.run()
