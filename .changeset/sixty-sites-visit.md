---
"@traversable/registry": patch
"@traversable/zod-test": patch
"@traversable/zod": patch
---

### fixes

- fix(zod,zod-types): fixes `zx.toType` escaping bug regarding grave quotes in `z.templateLiteral` schemas (#532)
- fix(zod,zod-types): fixes `zx.toType` not properly supporing `z.enum`, `z.optional` and `z.nullable` schemas in `z.templateLiteral` (#521)
