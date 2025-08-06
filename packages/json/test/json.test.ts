import { Json } from '@traversable/json'
import * as vi from 'vitest'
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
  vi.test('〖⛳️〗› ❲Json#Functor❳: Functor.map preserves structure', () => {
    fc.check(
      fc.property(Arbitrary.any, (json) => {
        vi.assert.deepEqual(Json.Functor.map((x) => x)(json), json)
      }), {
      // numRuns: 50_000
    }
    )
  })

  vi.test('〖⛳️〗› ❲Json#fold + Json#unfold❳', () => {
    fc.check(
      fc.property(Arbitrary.object, (json) => {
        const withMetadata = Json.unfold(addMetadata)(json)
        const withoutMetadata = Json.fold(rmMetadata)(withMetadata)

        vi.assert.notDeepEqual(json, withMetadata)
        vi.assert.notDeepEqual(withoutMetadata, withMetadata)
        vi.assert.deepEqual(json, withoutMetadata)
      })
    )
  })
})
