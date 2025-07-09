import * as fc from 'fast-check'
import * as vi from 'vitest'
import lodashIsEqual from 'lodash.isequal'
import * as NodeJS from 'node:util'
import { Equal } from '@traversable/registry'
import { zx } from '@traversable/zod'
import { z } from 'zod/v4'

const deepEquals = Equal.deep

type Scalar = string | number | boolean | null
const scalarSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
const scalarEquals = zx.equals.compile(scalarSchema)
const scalarArbitrary = fc.oneof(fc.string(), fc.double(), fc.boolean(), fc.constant(null))
const scalars = fc.sample(scalarArbitrary, 2) as [Scalar, Scalar]

const shallowObjectSchema = z.record(z.string(), z.string())
const shallowObjectEquals = zx.equals.compile(shallowObjectSchema)
const shallowObjectArbitrary = fc.dictionary(fc.string(), fc.string())
const shallowObjects = fc.sample(shallowObjectArbitrary, 2)
const shallowObjectClones = shallowObjects.map((_) => globalThis.structuredClone(_))

const deepObjectSchema = z.record(z.string(), z.record(z.string(), z.record(z.string(), z.string())))
const deepObjectEquals = zx.equals.compile(deepObjectSchema)
const deepObjectArbitrary = fc.dictionary(fc.string(), fc.dictionary(fc.string(), fc.dictionary(fc.string(), fc.string())))
const deepObjects = fc.sample(deepObjectArbitrary, 2)
const deepObjectClones = deepObjects.map((_) => globalThis.structuredClone(_))

type KnownObject = z.infer<typeof knownObjectSchema>
const knownObjectArbitrary = fc.record({
  a: fc.record({
    b: fc.string(),
    c: fc.string(),
  }),
  d: fc.string(),
  e: fc.record({
    f: fc.string(),
    g: fc.record({
      h: fc.string(),
      i: fc.string(),
    })
  })
})

const knownObjectSchema = z.object({
  a: z.object({
    b: z.string(),
    c: z.string(),
  }),
  d: z.string(),
  e: z.object({
    f: z.string(),
    g: z.object({
      h: z.string(),
      i: z.string(),
    })
  })
})

const knownObjectEquals = zx.equals.compile(knownObjectSchema)
const hardcodedObjectEquals = (l: KnownObject, r: KnownObject) => {
  return l === r || (
    l.a.b === r.a.b
    && l.a.c === r.a.c
    && l.d === r.d
    && l.e.f === r.e.f
    && l.e.g.h === r.e.g.h
    && l.e.g.i === r.e.g.i
  )
}

const knownObject = fc.sample(knownObjectArbitrary, 1)[0]
const knownObjectClone = structuredClone(knownObject)

console.log('knownObject', JSON.stringify(knownObject, null, 2))

vi.describe('〖🏁️〗‹‹‹ ❲zx.equals❳: known object (same value)', () => {
  // baseline
  vi.bench('❲lodash.isEqual❳', () => {
    lodashIsEqual(knownObject, knownObjectClone)
    lodashIsEqual(knownObject, knownObjectClone)
  })
  // builtin
  vi.bench('❲NodeJS.isDeepStrictEqual❳', () => {
    NodeJS.isDeepStrictEqual(knownObject, knownObjectClone)
    NodeJS.isDeepStrictEqual(knownObject, knownObjectClone)
  })
  // deepEquals from @traversable/registry
  vi.bench('❲Equal.deep❳', () => {
    deepEquals(knownObject, knownObjectClone)
    deepEquals(knownObject, knownObjectClone)
  })
  // our implementation
  vi.bench('❲zx.equals.compile❳', () => {
    knownObjectEquals(knownObject, knownObjectClone)
    knownObjectEquals(knownObject, knownObjectClone)
  })
  // hardcoded
  vi.bench('❲zx.equals.hardcoded❳', () => {
    hardcodedObjectEquals(knownObject, knownObjectClone)
    hardcodedObjectEquals(knownObject, knownObjectClone)
  })
})


vi.describe('〖🏁️〗‹‹‹ ❲zx.equals❳: scalars (same value)', () => {
  // baseline
  vi.bench('❲lodash.isEqual❳', () => {
    lodashIsEqual(scalars[0], scalars[0])
    lodashIsEqual(scalars[1], scalars[1])
  })
  // builtin
  vi.bench('❲NodeJS.isDeepStrictEqual❳', () => {
    NodeJS.isDeepStrictEqual(scalars[0], scalars[0])
    NodeJS.isDeepStrictEqual(scalars[1], scalars[1])
  })
  // our implementation
  vi.bench('❲zx.equals.compile❳', () => {
    scalarEquals(scalars[0], scalars[0])
    scalarEquals(scalars[1], scalars[1])
  })
})

// vi.describe('〖🏁️〗‹‹‹ ❲zx.equals❳: shallow objects (same value)', () => {
//   // baseline
//   vi.bench('❲lodash.isEqual❳', () => {
//     lodashIsEqual(shallowObjects[0], shallowObjectClones[0])
//     lodashIsEqual(shallowObjects[1], shallowObjectClones[1])
//   })
//   // builtin
//   vi.bench('❲NodeJS.isDeepStrictEqual❳', () => {
//     NodeJS.isDeepStrictEqual(shallowObjects[0], shallowObjectClones[0])
//     NodeJS.isDeepStrictEqual(shallowObjects[1], shallowObjectClones[1])
//   })
//   // our implementation
//   vi.bench('❲zx.equals.compile❳', () => {
//     shallowObjectEquals(shallowObjects[0], shallowObjectClones[0])
//     shallowObjectEquals(shallowObjects[1], shallowObjectClones[1])
//   })
// })

// vi.describe('〖🏁️〗‹‹‹ ❲zx.equals❳: deepObjects (same value)', () => {
//   // baseline
//   vi.bench('❲lodash.isEqual❳', () => {
//     lodashIsEqual(deepObjects[0], deepObjectClones[0])
//     lodashIsEqual(deepObjects[1], deepObjectClones[1])
//   })
//   // builtin
//   vi.bench('❲NodeJS.isDeepStrictEqual❳', () => {
//     NodeJS.isDeepStrictEqual(deepObjects[0], deepObjectClones[0])
//     NodeJS.isDeepStrictEqual(deepObjects[1], deepObjectClones[1])
//   })
//   // our implementation
//   vi.bench('❲zx.equals.compile❳', () => {
//     deepObjectEquals(deepObjects[0], deepObjectClones[0])
//     deepObjectEquals(deepObjects[1], deepObjectClones[1])
//   })
// })

// vi.describe('〖🏁️〗‹‹‹ ❲zx.equals❳: scalars (different values)', () => {
//   // baseline
//   vi.bench('❲lodash.isEqual❳', () => {
//     lodashIsEqual(scalars[0], scalars[1])
//     lodashIsEqual(scalars[1], scalars[0])
//   })
//   // builtin
//   vi.bench('❲NodeJS.isDeepStrictEqual❳', () => {
//     NodeJS.isDeepStrictEqual(scalars[0], scalars[1])
//     NodeJS.isDeepStrictEqual(scalars[1], scalars[0])
//   })
//   // our implementation
//   vi.bench('❲zx.equals.compile❳', () => {
//     scalarEquals(scalars[0], scalars[1])
//     scalarEquals(scalars[1], scalars[0])
//   })
// })

// vi.describe('〖🏁️〗‹‹‹ ❲zx.equals❳: shallow objects (different values)', () => {
//   // baseline
//   vi.bench('❲lodash.isEqual❳', () => {
//     lodashIsEqual(shallowObjects[0], shallowObjects[1])
//     lodashIsEqual(shallowObjects[1], shallowObjects[0])
//   })
//   // builtin
//   vi.bench('❲NodeJS.isDeepStrictEqual❳', () => {
//     NodeJS.isDeepStrictEqual(shallowObjects[0], shallowObjects[1])
//     NodeJS.isDeepStrictEqual(shallowObjects[1], shallowObjects[0])
//   })
//   // our implementation
//   vi.bench('❲zx.equals.compile❳', () => {
//     shallowObjectEquals(shallowObjects[0], shallowObjects[1])
//     shallowObjectEquals(shallowObjects[1], shallowObjects[0])
//   })
// })

// vi.describe('〖🏁️〗‹‹‹ ❲zx.equals❳: deepObjects (different values)', () => {
//   // baseline
//   vi.bench('❲lodash.isEqual❳', () => {
//     lodashIsEqual(deepObjects[0], deepObjects[1])
//     lodashIsEqual(deepObjects[1], deepObjects[0])
//   })
//   // builtin
//   vi.bench('❲NodeJS.isDeepStrictEqual❳', () => {
//     NodeJS.isDeepStrictEqual(deepObjects[0], deepObjects[1])
//     NodeJS.isDeepStrictEqual(deepObjects[1], deepObjects[0])
//   })
//   // our implementation
//   vi.bench('❲zx.equals.compile❳', () => {
//     deepObjectEquals(deepObjects[0], deepObjects[1])
//     deepObjectEquals(deepObjects[1], deepObjects[0])
//   })
// })
