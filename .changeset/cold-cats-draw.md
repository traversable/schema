---
"@traversable/schema-zod-adapter": patch
---

### new features

- adds `v4.deepPartial` utility

  #### Example

  ```typescript
  import * as vi from "vitest"
  import { v4 } from "@traversable/schema-zod-adapter"
  
  // Here we use `v4.toString` to make it easier to visualize `v4.deepPartial`'s behavior:
  vi.expect(v4.toString(v4.deepPartial(
    z.object({
      a: z.number(),
      b: z.optional(z.string()),
      c: z.object({
        d: z.array(z.object({
          e: z.number().max(1),
          f: z.boolean()
        })).length(10)
      })
    })
  ))).toMatchInlineSnapshot
    (`
    "z.object({
      a: z.number().optional(),
      b: z.string().optional(),
      c: z.object({
        d: z.array(z.object({
          e: z.number().max(1).optional(),
          f: z.boolean().optional()
        })).length(10).optional()
      }).optional()
    })"
  `)
  ```
