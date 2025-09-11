import { bench } from "@ark/attest"
import { t as core } from "@traversable/schema"
import { z as zod3 } from "zod"
import { z as zod4 } from "zod"
import { type as arktype } from "arktype"
import { Type as typebox } from "typebox"
import * as valibot from "valibot"

export declare let RESULTS: [
  {
    libraryName: "@traversable/schema"
    instantiations: 1293
  },
  {
    libraryName: "zod@4"
    instantiations: 3328
  },
  {
    libraryName: "typebox"
    instantiations: 14320
  },
  {
    libraryName: "arktype"
    instantiations: 16235
  },
  {
    libraryName: "valibot"
    instantiations: 40168
  },
  {
    libraryName: "zod@3"
    instantiations: 40197
  }
]

bench.baseline(() => void {})

bench("@traversable/schema: deep object (no baseline)", () =>
  core.object({
    a: core.object({
      b: core.object({
        c: core.optional(
          core.object({
            d: core.boolean,
            e: core.integer,
            f: core.array(
              core.object({
                g: core.unknown,
              }),
            ),
          }),
        ),
        h: core.optional(core.record(core.string)),
      }),
      i: core.optional(core.bigint),
    }),
    j: core.optional(
      core.object({
        k: core.array(core.record(core.object({ l: core.string }))),
      }),
    ),
  }),
).types
  ([1293, "instantiations"])

bench("zod@4: deep object (no baseline)", () =>
  zod4.object({
    a: zod4.object({
      b: zod4.object({
        c: zod4.optional(
          zod4.object({
            d: zod4.boolean(),
            e: zod4.number().int(),
            f: zod4.array(zod4.object({ g: zod4.unknown() })),
          }),
        ),
        h: zod4.optional(zod4.record(zod4.string(), zod4.string())),
      }),
      i: zod4.optional(zod4.bigint()),
    }),
    j: zod4.optional(
      zod4.object({
        k: zod4.array(
          zod4.record(zod4.string(), zod4.object({ l: zod4.string() })),
        ),
      }),
    ),
  }),
).types
  ([3328, "instantiations"])

bench("typebox: deep object (no baseline)", () =>
  typebox.Object({
    a: typebox.Object({
      b: typebox.Object({
        c: typebox.Optional(
          typebox.Object({
            d: typebox.Boolean(),
            e: typebox.Integer(),
            f: typebox.Array(typebox.Object({ g: typebox.Unknown() })),
          }),
        ),
        h: typebox.Optional(typebox.Record(typebox.String(), typebox.String())),
      }),
      i: typebox.Optional(typebox.BigInt()),
    }),
    j: typebox.Optional(
      typebox.Object({
        k: typebox.Array(
          typebox.Record(
            typebox.String(),
            typebox.Object({ l: typebox.String() }),
          ),
        ),
      }),
    ),
  }),
).types
  ([14320, "instantiations"])

bench("arktype: deep object (no baseline)", () =>
  arktype({
    a: {
      b: {
        "c?": {
          d: "boolean",
          e: "number.integer",
          f: arktype({
            g: "unknown",
          }).array(),
        },
        "h?": "Record<string, string>",
      },
      "i?": "bigint",
    },
    "j?": {
      k: arktype.Record("string", { l: "string" }).array(),
    },
  }),
).types
  ([16235, "instantiations"])

bench("valibot: deep object (no baseline)", () =>
  valibot.object({
    a: valibot.object({
      b: valibot.object({
        c: valibot.optional(
          valibot.object({
            d: valibot.boolean(),
            e: valibot.pipe(valibot.number(), valibot.integer()),
            f: valibot.array(
              valibot.object({
                g: valibot.unknown(),
              }),
            ),
          }),
        ),
        h: valibot.optional(valibot.record(valibot.string(), valibot.string())),
      }),
      i: valibot.optional(valibot.bigint()),
    }),
    j: valibot.optional(
      valibot.object({
        k: valibot.array(
          valibot.record(
            valibot.string(),
            valibot.object({ l: valibot.string() }),
          ),
        ),
      }),
    ),
  }),
).types
  ([40168, "instantiations"])

bench("zod@3: deep object (no baseline)", () =>
  zod3.object({
    a: zod3.object({
      b: zod3.object({
        c: zod3.optional(
          zod3.object({
            d: zod3.boolean(),
            e: zod3.number().int(),
            f: zod3.array(zod3.object({ g: zod3.unknown() })),
          }),
        ),
        h: zod3.optional(zod3.record(zod3.string(), zod3.string())),
      }),
      i: zod3.optional(zod3.bigint()),
    }),
    j: zod3.optional(
      zod3.object({
        k: zod3.array(
          zod3.record(zod3.string(), zod3.object({ l: zod3.string() })),
        ),
      }),
    ),
  }),
).types
  ([40197, "instantiations"])
