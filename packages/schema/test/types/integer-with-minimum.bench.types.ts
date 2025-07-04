import { bench } from "@ark/attest"
import { t } from "@traversable/schema"
import { z as zod3 } from "zod"
import { z as zod4 } from "zod/v4"
import { type as arktype } from "arktype"
import { Type as typebox } from "@sinclair/typebox"
import * as valibot from "valibot"

export declare let RESULTS: [
  {
    libraryName: "zod@3"
    instantiations: 1
  },
  {
    libraryName: "typebox"
    instantiations: 9
  },
  {
    libraryName: "@traversable/schema"
    instantiations: 76
  },
  {
    libraryName: "zod@4"
    instantiations: 357
  },
  {
    libraryName: "valibot"
    instantiations: 3017
  },
  {
    libraryName: "arktype"
    instantiations: 5042
  }
]

bench.baseline(() => void {})

bench("@traversable/schema: integer with minimum", () => {
  t.integer.min(0)
}).types
  ([76, "instantiations"])

bench("zod@3: integer with minimum", () => {
  zod3.number().int().min(0)
}).types
  ([1, "instantiations"])

bench("zod@4: integer with minimum", () => {
  zod4.number().int().min(0)
}).types
  ([357, "instantiations"])

bench("arktype: integer with minimum", () => {
  arktype('number.integer >= 0')
}).types
  ([5042, "instantiations"])

bench("typebox: integer with minimum", () => {
  typebox.Integer({ minimum: 0 })
}).types
  ([9, "instantiations"])

bench("valibot: integer with minimum", () => {
  valibot.pipe(valibot.number(), valibot.integer(), valibot.minValue(0))
}).types
  ([3017, "instantiations"])
