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
    instantiations: 9
  },
  {
    libraryName: "zod@4"
    instantiations: 21
  },
  {
    libraryName: "typebox"
    instantiations: 23
  },
  {
    libraryName: "valibot"
    instantiations: 28
  },
  {
    libraryName: "@traversable/schema"
    instantiations: 287
  },
  {
    libraryName: "arktype"
    instantiations: 4563
  }
]

bench.baseline(() => void {})

bench("@traversable/schema: tuple (empty)", () => {
  const x = t.tuple()
}).types
  ([287, "instantiations"])

bench("zod@3: tuple (empty)", () => {
  const x = zod3.tuple([])
}).types
  ([9, "instantiations"])

bench("zod@4: tuple (empty)", () => {
  const x = zod4.tuple([])
}).types
  ([21, "instantiations"])

bench("arktype: tuple (empty)", () => {
  const x = arktype([])
}).types
  ([4563, "instantiations"])

bench("typebox: tuple (empty)", () => {
  const x = typebox.Tuple([])
}).types
  ([23, "instantiations"])

bench("valibot: tuple (empty)", () => {
  const x = valibot.tuple([])
}).types
  ([28, "instantiations"])
