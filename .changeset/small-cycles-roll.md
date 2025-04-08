---
"@traversable/schema-to-json-schema": patch
"@traversable/derive-validators": patch
"@traversable/schema-to-string": patch
"@traversable/derive-equals": patch
"@traversable/derive-codec": patch
"@traversable/schema-seed": patch
"@traversable/registry": patch
"@traversable/schema": patch
---

## refactor

This change moves over to using "faux-prototypes" to extend schemas.

This ends up being much simpler to implement in userland, and it also rules 
out certain edge cases that come from trying to compose schema definitions together.
