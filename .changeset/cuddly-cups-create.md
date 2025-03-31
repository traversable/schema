---
"@traversable/schema-valibot-adapter": patch
"@traversable/schema-to-json-schema": patch
"@traversable/schema-zod-adapter": patch
"@traversable/derive-validators": patch
"@traversable/schema-to-string": patch
"@traversable/derive-equals": patch
"@traversable/derive-codec": patch
"@traversable/schema-seed": patch
"@traversable/registry": patch
"@traversable/schema": patch
"@traversable/json": patch
---

## breaking changes

This PR removes a few schema constraints that turned out to be redundant.

This is a breaking change, but the migration path is simple and mechanical.

Usually I would opt for a deprecation, but since no users have raised any issues yet, I think it's safe to assume this won't
break anybody in real life.

### removals

The following APIs have been removed:

- `t.bigint.moreThan` - use `t.bigint.min` instead
- `t.bigint.lessThan` - use `t.bigint.max` instead
- `t.integer.moreThan` - use `t.integer.min` instead
- `t.integer.lessThan` - use `t.integer.max` instead

## new features

- Adds validator support for schema constraints (#158)
