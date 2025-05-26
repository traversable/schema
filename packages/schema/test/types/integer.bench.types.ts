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
    libraryName: "typebox"
    instantiations: 9
  },
  {
    libraryName: "zod@4"
    instantiations: 275
  },
  {
    libraryName: "arktype"
    instantiations: 537
  },
  {
    libraryName: "valibot"
    instantiations: 2235
  }
]

bench.baseline(() => void {})

bench("@traversable/schema: integer", () => {
  t.integer
}).types
  ([0, "instantiations"])

bench("zod@3: integer", () => {
  zod3.number().int()
}).types
  ([0, "instantiations"])

bench("zod@4: integer", () => {
  zod4.number().int()
}).types
  ([275, "instantiations"])

bench("arktype: integer", () => {
  arktype.keywords.number.integer
}).types
  ([537, "instantiations"])

bench("typebox: integer", () => {
  typebox.Integer()
}).types
  ([9, "instantiations"])

bench("valibot: integer", () => {
  valibot.pipe(valibot.number(), valibot.integer())
}).types
  ([2235, "instantiations"])
