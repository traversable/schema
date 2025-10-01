---
"@traversable/zod-types": patch
"@traversable/zod": patch
---

fix(zod,zod-types): fixes `zx.toString` bug where objects with 1+ props passed to `z.default` included an unmatched closing bracket
