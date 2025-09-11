import { bench } from "@ark/attest"
import { t } from "@traversable/schema"
import { z as zod3 } from "zod"
import { z as zod4 } from "zod"
import { type as arktype } from "arktype"
import { Type as typebox } from "typebox"
import * as valibot from "valibot"

export declare let RESULTS: [
  {
    libraryName: "@traversable/schema"
    instantiations: 75
  },
  {
    libraryName: "typebox"
    instantiations: 159
  },
  {
    libraryName: "zod@4"
    instantiations: 484
  },
  {
    libraryName: "arktype"
    instantiations: 5011
  },
  {
    libraryName: "valibot"
    instantiations: 15973
  },
  {
    libraryName: "zod@3"
    instantiations: 25146
  }
]

bench.baseline(() => void {})

bench("@traversable/schema: object (no baseline)", () =>
  t.object({
    a: t.boolean,
    b: t.optional(t.number),
  }),
).types
  ([75, "instantiations"])

bench("zod@4: object", () =>
  zod4.object({
    a: zod4.boolean(),
    b: zod4.optional(zod4.number()),
  }),
).types
  ([484, "instantiations"])

bench("arktype: object (no baseline)", () =>
  arktype({
    a: "boolean",
    "b?": "number",
  }),
).types
  ([5011, "instantiations"])

bench("typebox: object (no baseline)", () =>
  typebox.Object({
    a: typebox.Boolean(),
    b: typebox.Optional(typebox.Number()),
  }),
).types
  ([159, "instantiations"])

bench("zod@3: object", () =>
  zod3.object({
    a: zod3.boolean(),
    b: zod3.optional(zod3.number()),
  }),
).types
  ([25146, "instantiations"])

bench("valibot: object (no baseline)", () =>
  valibot.object({
    a: valibot.boolean(),
    b: valibot.optional(valibot.number()),
  }),
).types
  ([15973, "instantiations"])
