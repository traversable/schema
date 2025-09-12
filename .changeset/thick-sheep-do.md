---
"@traversable/json-schema-types": patch
"@traversable/json-schema-test": patch
"@traversable/arktype-test": patch
"@traversable/json-schema": patch
"@traversable/arktype": patch
---

break(json-schema,json-schema-test,json-schema-types): renames `JsonSchema.Union` to `JsonSchema.AnyOf` and `JsonSchema.Intersection` to `JsonSchema.AllOf`

feat(json-schema,json-schema-test,json-schema-types): adds `JsonSchema.OneOf`
