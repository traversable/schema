---
"@traversable/zod": patch
---

fixes `zx.toString` bug (#549) where `z.discriminatedUnion` discriminator was included in the options array (fixed in #551, thanks @TheyCodeMeSilvers!)
