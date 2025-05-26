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
    instantiations: 175
  }
]

bench.baseline(() => void {})

bench("@traversable/schema: string", () => {
  t.string
}).types
  ([0, "instantiations"])

bench("zod@3: string", () => {
  zod3.string()
}).types
  ([0, "instantiations"])

bench("zod@4: string", () => {
  zod4.string()
}).types
  ([0, "instantiations"])

bench("arktype: string", () => {
  arktype.string
}).types
  ([175, "instantiations"])

bench("typebox: string", () => {
  typebox.String()
}).types
  ([9, "instantiations"])

bench("valibot: string", () => {
  valibot.string()
}).types
  ([0, "instantiations"])
