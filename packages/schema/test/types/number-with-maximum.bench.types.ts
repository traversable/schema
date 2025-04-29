import { bench } from "@ark/attest"
import { t } from "@traversable/schema"
import { z as zod3 } from "zod3"
import { z as zod4 } from "zod4"
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
    instantiations: 4853
  }
]

bench.baseline(() => void {})

bench("@traversable/schema: number with maximum", () => {
  t.number.max(0)
}).types
  ([48,"instantiations"])

bench("zod@3: number with maximum", () => {
  zod3.number().max(0)
}).types
  ([1,"instantiations"])

bench("zod@4: number with maximum", () => {
  zod4.number().max(0)
}).types
  ([285,"instantiations"])

bench("arktype: number with maximum", () => {
  arktype('number <= 0')
}).types
  ([4853,"instantiations"])

bench("typebox: number with maximum", () => {
  typebox.Number({ maximum: 0 })
}).types
  ([9,"instantiations"])

bench("valibot: number with maximum", () => {
  valibot.pipe(valibot.number(), valibot.maxValue(0))
}).types
  ([2263,"instantiations"])
