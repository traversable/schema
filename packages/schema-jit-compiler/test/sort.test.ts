import * as vi from 'vitest'
import { t } from '@traversable/schema-core'

import { jit, WeightByTypeName } from '@traversable/schema-jit-compiler'

let SHALLOW_ORDER = {
  [WeightByTypeName.never]: t.never,
  [WeightByTypeName.any]: t.any,
  [WeightByTypeName.unknown]: t.unknown,
  [WeightByTypeName.void]: t.void,
  [WeightByTypeName.null]: t.null,
  [WeightByTypeName.undefined]: t.undefined,
  [WeightByTypeName.symbol]: t.symbol,
  [WeightByTypeName.boolean]: t.boolean,
  [WeightByTypeName.integer]: t.integer,
  [WeightByTypeName.bigint]: t.bigint,
  [WeightByTypeName.number]: t.number,
  [WeightByTypeName.string]: t.string,
  [WeightByTypeName.eq]: t.eq({}),
  [WeightByTypeName.optional]: t.optional(t.never),
  [WeightByTypeName.array]: t.array(t.never),
  [WeightByTypeName.record]: t.record(t.never),
  [WeightByTypeName.intersect]: t.intersect(),
  [WeightByTypeName.union]: t.union(),
  [WeightByTypeName.tuple]: t.tuple(),
  [WeightByTypeName.object]: t.object({}),
}

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-jit-compiler❳', () => {
  vi.it('〖⛳️〗› ❲sort❳: shallow sort order is correct', () => {
    vi.expect(jit(t.object(SHALLOW_ORDER))).toMatchInlineSnapshot(`
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
