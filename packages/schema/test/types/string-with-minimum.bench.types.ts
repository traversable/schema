import { bench } from "@ark/attest"
import { t } from "@traversable/schema"
import { z as zod3 } from "zod"
import { z as zod4 } from "zod"
import { type as arktype } from "arktype"
import { Type as typebox } from "typebox"
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
    instantiations: 4881
  }
]

bench.baseline(() => void {})

bench("@traversable/schema: string with minimum", () => {
  t.string.min(0)
}).types
  ([65, "instantiations"])

bench("zod@3: string with minimum", () => {
  zod3.string().min(0)
}).types
  ([0, "instantiations"])

bench("zod@4: string with minimum", () => {
  zod4.string().min(0)
}).types
  ([283, "instantiations"])

bench("arktype: string with minimum", () => {
  arktype('string >= 0')
}).types
  ([4881, "instantiations"])

bench("typebox: string with minimum", () => {
  typebox.String({ minimum: 0 })
}).types
  ([9, "instantiations"])

bench("valibot: string with minimum", () => {
  valibot.pipe(valibot.string(), valibot.minLength(0))
}).types
  ([2262, "instantiations"])
