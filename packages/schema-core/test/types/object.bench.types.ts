import { bench } from "@ark/attest"
import { t as core } from "@traversable/schema-core"
import { z as zod3 } from "zod3"
import { z as zod4 } from "zod4"
import { type as arktype } from "arktype"
import { Type as typebox } from "@sinclair/typebox"
import * as valibot from "valibot"

export declare let RESULTS: [
  {
    libraryName: "@traversable/schema"
    instantiations: 86
  },
  {
    libraryName: "@sinclair/typebox"
    instantiations: 150
  },
  {
    libraryName: "zod@4"
    instantiations: 356
  },
  {
    libraryName: "arktype"
    instantiations: 1663
  },
  {
    libraryName: "zod@3"
    instantiations: 4541
  },
  {
    libraryName: "valibot"
    instantiations: 16091
  }
]

bench.baseline(() => {
  core.tuple(core.string)
  zod3.tuple([zod3.string()])
  typebox.Tuple([typebox.String()])
  valibot.tuple([valibot.string()])
  arktype(["string"])
})

bench("@traversable/schema: object", () =>
  core.object({
    a: core.boolean,
    b: core.optional(core.number),
  }),
).types
  ([86, "instantiations"])

bench("zod@4: object", () =>
  zod4.object({
    a: zod4.boolean(),
    b: zod4.optional(zod4.number()),
  }),
).types
  ([356, "instantiations"])

bench("arktype: object", () =>
  arktype({
    a: "boolean",
    "b?": "number",
  }),
).types
  ([1663, "instantiations"])

bench("@sinclair/typebox: object", () =>
  typebox.Object({
    a: typebox.Boolean(),
    b: typebox.Optional(typebox.Number()),
  }),
).types
  ([150, "instantiations"])

bench("zod@3: object", () =>
  zod3.object({
    a: zod3.boolean(),
    b: zod3.optional(zod3.number()),
  }),
).types
  ([4541, "instantiations"])

bench("valibot: object", () =>
  valibot.object({
    a: valibot.boolean(),
    b: valibot.optional(valibot.number()),
  }),
).types
  ([16091, "instantiations"])
