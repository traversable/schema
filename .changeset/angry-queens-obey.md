---
"@traversable/derive-validators": patch
"@traversable/registry": patch
"@traversable/schema": patch
---

## new features

This PR adds the following new sub-combinators, all fuzz-tested & 100% covered:
  
1. `t.integer`
  - `t.integer.min`
  - `t.integer.max`
  - `t.integer.lt`
  - `t.integer.gt`
  - `t.integer.btwn`

2. `t.number`
  - `t.number.min`
  - `t.number.max`
  - `t.number.lt`
  - `t.number.gt`
  - `t.number.btwn`

3. `t.bigint`
  - `t.bigint.min`
  - `t.bigint.max`
  - `t.bigint.lt`
  - `t.bigint.gt`
  - `t.bigint.btwn`

4. `t.string`
  - `t.string.min`
  - `t.string.max`
  - `t.string.btwn`

5. `t.array`
  - `t.array.min`
  - `t.array.max`
  - `t.array.btwn`

## todos

- [ ] Add sub-combinators to `t.readonlyArray`

- [ ] Update `@traversable/schema-to-json-schema` package to reflect these constraints when added to a schema

- [ ] Update `@traversable/derive-validators` package to reflect these constraints when added to a schema
