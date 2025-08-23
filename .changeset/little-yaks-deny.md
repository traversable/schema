---
"@traversable/zod-types": patch
"@traversable/zod-test": patch
"@traversable/zod": patch
---

fix(zod,zod-test,zod-types): uses `z.core.clone` to avoid blowing away input schema in `zx.deepPartial`
