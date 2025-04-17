import * as vi from 'vitest'
import { t } from '@traversable/schema-core'

import { Jit } from '@traversable/schema-jit-compiler'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-jit-compiler❳', () => {
  vi.it('〖⛳️〗› ❲sort❳: shallow sort order is correct', () => {
    vi.expect(Jit.generate(
      t.object({
        [Jit.WeightByTypeName.never]: t.never,
        [Jit.WeightByTypeName.any]: t.any,
        [Jit.WeightByTypeName.unknown]: t.unknown,
        [Jit.WeightByTypeName.void]: t.void,
        [Jit.WeightByTypeName.null]: t.null,
        [Jit.WeightByTypeName.undefined]: t.undefined,
        [Jit.WeightByTypeName.symbol]: t.symbol,
        [Jit.WeightByTypeName.boolean]: t.boolean,
        [Jit.WeightByTypeName.integer]: t.integer,
        [Jit.WeightByTypeName.bigint]: t.bigint,
        [Jit.WeightByTypeName.number]: t.number,
        [Jit.WeightByTypeName.string]: t.string,
        [Jit.WeightByTypeName.eq]: t.eq({}),
        [Jit.WeightByTypeName.optional]: t.optional(t.never),
        [Jit.WeightByTypeName.array]: t.array(t.never),
        [Jit.WeightByTypeName.record]: t.record(t.never),
        [Jit.WeightByTypeName.intersect]: t.intersect(),
        [Jit.WeightByTypeName.union]: t.union(),
        [Jit.WeightByTypeName.tuple]: t.tuple(),
        [Jit.WeightByTypeName.object]: t.object({}),
      })
    )).toMatchInlineSnapshot(`
      "function check(value) {
        return (
          !!value && typeof value === "object" && !Array.isArray(value)
          && false
          && true
          && true
          && value["30"] === void 0
          && value["40"] === undefined
          && value["50"] === null
          && typeof value["60"] === "symbol"
          && typeof value["70"] === "boolean"
          && Number.isSafeInteger(value["80"])
          && typeof value["90"] === "bigint"
          && Number.isFinite(value["100"])
          && typeof value["110"] === "string"
          && (value["120"] === undefined || false)
          && (true)
          && (false)
          && Array.isArray(value["150"]) && value["150"].length === 0
          && !!value["160"] && typeof value["160"] === "object" && !Array.isArray(value["160"])
          && Array.isArray(value["170"]) && value["170"].every((value) => false)
          && !!value["180"] && typeof value["180"] === "object" && !Array.isArray(value["180"]) 
            && !(value["180"] instanceof Date) && !(value["180"] instanceof Uint8Array) 
            && Object.entries(value["180"]).every(([key, value]) => 
              typeof key === "string" && false
            )
          && !!value["190"] && typeof value["190"] === "object" && !Array.isArray(value["190"])
        )
      }"
    `)
  })
})
