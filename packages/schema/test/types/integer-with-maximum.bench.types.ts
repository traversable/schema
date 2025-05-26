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
    instantiations: 5014
  }
]

bench.baseline(() => void {})

bench("@traversable/schema: integer with maximum", () => {
  t.integer.max(0)
}).types
  ([76, "instantiations"])

bench("zod@3: integer with maximum", () => {
  zod3.number().int().max(0)
}).types
  ([1, "instantiations"])

bench("zod@4: integer with maximum", () => {
  zod4.number().int().max(0)
}).types
  ([357, "instantiations"])

bench("arktype: integer with maximum", () => {
  arktype('number.integer <= 0')
}).types
  ([5014, "instantiations"])

bench("typebox: integer with maximum", () => {
  typebox.Integer({ maximum: 0 })
}).types
  ([9, "instantiations"])

bench("valibot: integer with maximum", () => {
  valibot.pipe(valibot.number(), valibot.integer(), valibot.maxValue(0))
}).types
  ([3017, "instantiations"])
