import { Json } from '@traversable/json'
import * as vi from 'vitest'
import { test } from '@fast-check/vitest'
import * as fc from 'fast-check'
import { Arbitrary } from './arbitrary.js'


const addMetadata = (data: Json) =>
  !Json.isObject(data) ? data
    : { ...data, createdAt: new Date().toISOString() }

const rmMetadata = (data: Json) => {
  if (!Json.isObject(data)) return data
  else {
    const { createdAt, ...json } = data
    return json
  }
}

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/json❳', () => {
  test.prop(
    [Arbitrary.any], {
    // numRuns: 50_000
  })(
    '〖⛳️〗› ❲Json#Functor❳: Functor.map preserves structure',
    (json) => {
      vi.assert.deepEqual(Json.Functor.map((x) => x)(json), json)
    }
  )

  test.prop(
    [Arbitrary.object], {
    // numRuns: 50_000,
  })(
    '〖⛳️〗› ❲Json#fold + Json#unfold❳',
    (json) => {
      const withMetadata = Json.unfold(addMetadata)(json)
      const withoutMetadata = Json.fold(rmMetadata)(withMetadata)

      vi.assert.notDeepEqual(json, withMetadata)
      vi.assert.notDeepEqual(withoutMetadata, withMetadata)
      vi.assert.deepEqual(json, withoutMetadata)
    }
  )
})
