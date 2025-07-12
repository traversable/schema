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
    instantiations: 0
  },
  {
    libraryName: "typebox"
    instantiations: 9
  },
  {
    libraryName: "@traversable/schema"
    instantiations: 65
  },
  {
    libraryName: "zod@4"
    instantiations: 283
  },
  {
    libraryName: "valibot"
    instantiations: 2262
  },
  {
    libraryName: "arktype"
    instantiations: 4853
  }
]

bench.baseline(() => void {})

bench("@traversable/schema: string with maximum", () => {
  t.string.max(0)
}).types
  ([65, "instantiations"])

bench("zod@3: string with maximum", () => {
  zod3.string().max(0)
}).types
  ([0, "instantiations"])

bench("zod@4: string with maximum", () => {
  zod4.string().max(0)
}).types
  ([283, "instantiations"])

bench("arktype: string with maximum", () => {
  arktype('string <= 0')
}).types
  ([4853, "instantiations"])

bench("typebox: string with maximum", () => {
  typebox.String({ maximum: 0 })
}).types
  ([9, "instantiations"])

bench("valibot: string with maximum", () => {
  valibot.pipe(valibot.string(), valibot.maxLength(0))
}).types
  ([2262, "instantiations"])
