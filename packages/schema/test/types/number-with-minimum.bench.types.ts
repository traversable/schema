import { bench } from "@ark/attest"
import { t } from "@traversable/schema"
import { z as zod3 } from "zod"
import { z as zod4 } from "zod"
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
    instantiations: 48
  },
  {
    libraryName: "zod@4"
    instantiations: 285
  },
  {
    libraryName: "valibot"
    instantiations: 2263
  },
  {
    libraryName: "arktype"
    instantiations: 4881
  }
]

bench.baseline(() => void {})

bench("@traversable/schema: number with minimum", () => {
  t.number.min(0)
}).types
  ([48, "instantiations"])

bench("zod@3: number with minimum", () => {
  zod3.number().min(0)
}).types
  ([1, "instantiations"])

bench("zod@4: number with minimum", () => {
  zod4.number().min(0)
}).types
  ([285, "instantiations"])

bench("arktype: number with minimum", () => {
  arktype('number >= 0')
}).types
  ([4881, "instantiations"])

bench("typebox: number with minimum", () => {
  typebox.Number({ minimum: 0 })
}).types
  ([9, "instantiations"])

bench("valibot: number with minimum", () => {
  valibot.pipe(valibot.number(), valibot.minValue(0))
}).types
  ([2263, "instantiations"])
