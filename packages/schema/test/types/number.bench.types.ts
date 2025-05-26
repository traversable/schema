import { bench } from "@ark/attest"
import { t } from "@traversable/schema"
import { z as zod3 } from "zod/v3"
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
    libraryName: "zod@3"
    instantiations: 0
  },
  {
    libraryName: "zod@4"
    instantiations: 0
  },
  {
    libraryName: "valibot"
    instantiations: 0
  },
  {
    libraryName: "typebox"
    instantiations: 9
  },
  {
    libraryName: "arktype"
    instantiations: 475
  }
]

bench.baseline(() => void {})

bench("@traversable/schema: number", () => {
  t.number
}).types
  ([0, "instantiations"])

bench("zod@3: number", () => {
  zod3.number()
}).types
  ([0, "instantiations"])

bench("zod@4: number", () => {
  zod4.number()
}).types
  ([0, "instantiations"])

bench("arktype: number", () => {
  arktype.keywords.number
}).types
  ([475, "instantiations"])

bench("typebox: number", () => {
  typebox.Number()
}).types
  ([9, "instantiations"])

bench("valibot: number", () => {
  valibot.number()
}).types
  ([0, "instantiations"])
