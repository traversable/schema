import { bench } from '@ark/attest'
import { t as core } from '@traversable/schema-core'
import { z as zod3 } from 'zod3'
import { z as zod4 } from 'zod4'
import { type as arktype } from 'arktype'
import { Type as typebox } from '@sinclair/typebox'
import * as valibot from 'valibot'

export declare let RESULTS: [
  {
    libraryName: "@traversable/schema"
    instantiations: 1149
  },
  {
    libraryName: "zod@4"
    instantiations: 3199
  },
  {
    libraryName: "arktype"
    instantiations: 12359
  },
  {
    libraryName: "@sinclair/typebox"
    instantiations: 14294
  },
  {
    libraryName: "zod@3"
    instantiations: 19292
  },
  {
    libraryName: "valibot"
    instantiations: 40067
  }
]

bench.baseline(() => {
  core.tuple(core.string)
  zod3.tuple([zod3.string()])
  typebox.Tuple([typebox.String()])
  valibot.tuple([valibot.string()])
  arktype(['string'])
})

bench("@traversable/schema: deep object", () =>
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
      core.object({ k: core.array(core.record(core.object({ l: core.string }))) }),
    ),
  })
).types
  ([1149,"instantiations"])

bench("zod@4: deep object", () =>
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
        k: zod4.array(zod4.record(zod4.string(), zod4.object({ l: zod4.string() }))),
      }),
    ),
  })
).types
  ([3199,"instantiations"])

bench("arktype: deep object", () =>
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
  })
).types
  ([12359,"instantiations"])

bench("@sinclair/typebox: deep object", () =>
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
          typebox.Record(typebox.String(), typebox.Object({ l: typebox.String() })),
        ),
      }),
    ),
  })
).types
  ([14294,"instantiations"])

bench("zod@3: deep object", () => zod3.object({
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
      k: zod3.array(zod3.record(zod3.string(), zod3.object({ l: zod3.string() }))),
    }),
  ),
})
).types
  ([19292,"instantiations"])

bench("valibot: deep object", () =>
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
        k: valibot.array(valibot.record(valibot.string(), valibot.object({ l: valibot.string() }))),
      }),
    ),
  })
).types
  ([40067,"instantiations"])
