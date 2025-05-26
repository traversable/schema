import { bench } from "@ark/attest"
import { t } from "@traversable/schema"
import { z as zod3 } from "zod"
import { z as zod4 } from "zod/v4"
import { type as arktype } from "arktype"
import { Type as typebox } from "@sinclair/typebox"
import * as valibot from "valibot"

export declare let RESULTS: [
  {
    libraryName: "@traversable/schema"
    instantiations: 0
  },
  {
    libraryName: "@traversable/schema"
    instantiations: 7
  },
  {
    libraryName: "@traversable/schema"
    instantiations: 48
  },
  {
    libraryName: "@traversable/schema"
    instantiations: 48
  },
  {
    libraryName: "@traversable/schema"
    instantiations: 48
  },
  {
    libraryName: "@traversable/schema"
    instantiations: 48
  },
  {
    libraryName: "@traversable/schema"
    instantiations: 100
  },
  {
    libraryName: "@traversable/schema"
    instantiations: 111
  }
]

bench.baseline(() => void {})

bench("@traversable/schema: number", () => {
  t.number
}).types
  ([0, "instantiations"])

bench("@traversable/schema: number w/ min", () => {
  t.number.min(0)
}).types
  ([48, "instantiations"])

bench("@traversable/schema: number w/ max", () => {
  t.number.max(0)
}).types
  ([48, "instantiations"])

bench("@traversable/schema: number w/ lessThan", () => {
  t.number.lessThan(0)
}).types
  ([48, "instantiations"])

bench("@traversable/schema: number w/ moreThan", () => {
  t.number.moreThan(0)
}).types
  ([48, "instantiations"])

bench("@traversable/schema: number w/ between", () => {
  t.number.between(0, 1)
}).types
  ([7, "instantiations"])

bench("@traversable/schema: number w/ min and lessThan", () => {
  t.number.min(0).lessThan(1)
}).types
  ([111, "instantiations"])

bench("@traversable/schema: number w/ max and moreThan", () => {
  t.number.moreThan(0).max(1)
}).types
  ([100, "instantiations"])
