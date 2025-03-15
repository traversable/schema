import * as fc from 'fast-check'
import * as vi from 'vitest'
import lodashIsEqual from 'lodash.isequal'
import * as NodeJSUtil from 'node:util'
import { Equal } from '@traversable/schema'

const isEqual = Equal.deep

type Scalar = string | number | boolean | null
const scalar = fc.oneof(fc.string(), fc.double(), fc.boolean(), fc.constant(null))
const scalars = fc.sample(scalar, 2) as [Scalar, Scalar]

type ShallowObject = Record<string, string | number | boolean | null>
const shallowObject = fc.dictionary(fc.string(), scalar)
const shallowObjects = fc.sample(shallowObject, 2) as [ShallowObject, ShallowObject]

type LongStringDictionary = Record<string, string>
const longStringDictionary = fc.dictionary(fc.string(), fc.string({ minLength: 500 }))
const longStringDictionaries = fc.sample(longStringDictionary, 2) as [LongStringDictionary, LongStringDictionary]

type DeepObject = Record<string, Record<string, Record<string, fc.JsonValue>>>
const deepObject = fc.dictionary(fc.string(), fc.dictionary(fc.string(), fc.dictionary(fc.string(), fc.jsonValue())))
const deepObjects = fc.sample(deepObject, 2) as [DeepObject, DeepObject]

vi.describe('〖🏁️〗‹‹‹ ❲deepEquals❳: scalars (same value)', () => {
  // baseline
  vi.bench('❲lodash.isEqual❳', () => {
    lodashIsEqual(scalars[0], scalars[0])
    lodashIsEqual(scalars[1], scalars[1])
  })
  // builtin
  vi.bench('❲NodeJSUtil.isDeepStrictEqual❳', () => {
    NodeJSUtil.isDeepStrictEqual(scalars[0], scalars[0])
    NodeJSUtil.isDeepStrictEqual(scalars[1], scalars[1])
  })
  // our implementation
  vi.bench('❲@traversable/isEqual❳', () => {
    isEqual(scalars[0], scalars[0])
    isEqual(scalars[1], scalars[1])
  })
})

vi.describe('〖🏁️〗‹‹‹ ❲deepEquals❳: shallow objects (same value)', () => {
  // baseline
  vi.bench('❲lodash.isEqual❳', () => {
    lodashIsEqual(shallowObjects[0], shallowObjects[0])
    lodashIsEqual(shallowObjects[1], shallowObjects[1])
  })
  // builtin
  vi.bench('❲NodeJSUtil.isDeepStrictEqual❳', () => {
    NodeJSUtil.isDeepStrictEqual(shallowObjects[0], shallowObjects[0])
    NodeJSUtil.isDeepStrictEqual(shallowObjects[1], shallowObjects[1])
  })
  // our implementation
  vi.bench('❲@traversable/isEqual❳', () => {
    isEqual(shallowObjects[0], shallowObjects[0])
    isEqual(shallowObjects[1], shallowObjects[1])
  })
})

vi.describe('〖🏁️〗‹‹‹ ❲deepEquals❳: longStringDictionaries (same value)', () => {
  // baseline
  vi.bench('❲lodash.isEqual❳', () => {
    lodashIsEqual(longStringDictionaries[0], longStringDictionaries[0])
    lodashIsEqual(longStringDictionaries[1], longStringDictionaries[1])
  })
  // builtin
  vi.bench('❲NodeJSUtil.isDeepStrictEqual❳', () => {
    NodeJSUtil.isDeepStrictEqual(longStringDictionaries[0], longStringDictionaries[0])
    NodeJSUtil.isDeepStrictEqual(longStringDictionaries[1], longStringDictionaries[1])
  })
  // our implementation
  vi.bench('❲@traversable/isEqual❳', () => {
    isEqual(longStringDictionaries[0], longStringDictionaries[0])
    isEqual(longStringDictionaries[1], longStringDictionaries[1])
  })
})

vi.describe('〖🏁️〗‹‹‹ ❲deepEquals❳: deepObjects (same value)', () => {
  // baseline
  vi.bench('❲lodash.isEqual❳', () => {
    lodashIsEqual(deepObjects[0], deepObjects[0])
    lodashIsEqual(deepObjects[1], deepObjects[1])
  })
  // builtin
  vi.bench('❲NodeJSUtil.isDeepStrictEqual❳', () => {
    NodeJSUtil.isDeepStrictEqual(deepObjects[0], deepObjects[0])
    NodeJSUtil.isDeepStrictEqual(deepObjects[1], deepObjects[1])
  })
  // our implementation
  vi.bench('❲@traversable/isEqual❳', () => {
    isEqual(deepObjects[0], deepObjects[0])
    isEqual(deepObjects[1], deepObjects[1])
  })
})



vi.describe('〖🏁️〗‹‹‹ ❲deepEquals❳: scalars (different values)', () => {
  // baseline
  vi.bench('❲lodash.isEqual❳', () => {
    lodashIsEqual(scalars[0], scalars[1])
    lodashIsEqual(scalars[1], scalars[0])
  })
  // builtin
  vi.bench('❲NodeJSUtil.isDeepStrictEqual❳', () => {
    NodeJSUtil.isDeepStrictEqual(scalars[0], scalars[1])
    NodeJSUtil.isDeepStrictEqual(scalars[1], scalars[0])
  })
  // our implementation
  vi.bench('❲@traversable/isEqual❳', () => {
    isEqual(scalars[0], scalars[1])
    isEqual(scalars[1], scalars[0])
  })
})

vi.describe('〖🏁️〗‹‹‹ ❲deepEquals❳: shallow objects (different values)', () => {
  // baseline
  vi.bench('❲lodash.isEqual❳', () => {
    lodashIsEqual(shallowObjects[0], shallowObjects[1])
    lodashIsEqual(shallowObjects[1], shallowObjects[0])
  })
  // builtin
  vi.bench('❲NodeJSUtil.isDeepStrictEqual❳', () => {
    NodeJSUtil.isDeepStrictEqual(shallowObjects[0], shallowObjects[1])
    NodeJSUtil.isDeepStrictEqual(shallowObjects[1], shallowObjects[0])
  })
  // our implementation
  vi.bench('❲@traversable/isEqual❳', () => {
    isEqual(shallowObjects[0], shallowObjects[1])
    isEqual(shallowObjects[1], shallowObjects[0])
  })
})

vi.describe('〖🏁️〗‹‹‹ ❲deepEquals❳: longStringDictionaries (different values)', () => {
  // baseline
  vi.bench('❲lodash.isEqual❳', () => {
    lodashIsEqual(longStringDictionaries[0], longStringDictionaries[1])
    lodashIsEqual(longStringDictionaries[1], longStringDictionaries[0])
  })
  // builtin
  vi.bench('❲NodeJSUtil.isDeepStrictEqual❳', () => {
    NodeJSUtil.isDeepStrictEqual(longStringDictionaries[0], longStringDictionaries[1])
    NodeJSUtil.isDeepStrictEqual(longStringDictionaries[1], longStringDictionaries[0])
  })
  // our implementation
  vi.bench('❲@traversable/isEqual❳', () => {
    isEqual(longStringDictionaries[0], longStringDictionaries[1])
    isEqual(longStringDictionaries[1], longStringDictionaries[0])
  })
})

vi.describe('〖🏁️〗‹‹‹ ❲deepEquals❳: deepObjects (different values)', () => {
  // baseline
  vi.bench('❲lodash.isEqual❳', () => {
    lodashIsEqual(deepObjects[0], deepObjects[1])
    lodashIsEqual(deepObjects[1], deepObjects[0])
  })
  // builtin
  vi.bench('❲NodeJSUtil.isDeepStrictEqual❳', () => {
    NodeJSUtil.isDeepStrictEqual(deepObjects[0], deepObjects[1])
    NodeJSUtil.isDeepStrictEqual(deepObjects[1], deepObjects[0])
  })
  // our implementation
  vi.bench('❲@traversable/isEqual❳', () => {
    isEqual(deepObjects[0], deepObjects[1])
    isEqual(deepObjects[1], deepObjects[0])
  })
})
