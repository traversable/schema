---
"@traversable/schema-to-json-schema": patch
"@traversable/schema-zod-adapter": patch
"@traversable/derive-validators": patch
"@traversable/schema-to-string": patch
"@traversable/derive-equals": patch
"@traversable/schema-errors": patch
"@traversable/schema-seed": patch
"@traversable/registry": patch
"@traversable/schema": patch
"@traversable/json": patch
---

### new features

Adds native support for `.toString` method on all schemas.

### breaking changes

If you were using the `schema-to-string` package, `.toString` has been update to `.toType`, to better
reflect the behavior that the package adds.

I'm considering changing the package name as well, but am punting on that for now.
