---
"@traversable/derive-validators": patch
"@traversable/schema-core": patch
"@traversable/schema-seed": patch
"@traversable/registry": patch
"@traversable/schema": patch
---

## new features

### `@traversable/schema`

This PR adds a new method to all schemas, `toString`.

The method works at both the term- and type-level. 

Tests for this feature involve generating 1000s of random schemas,
writing them to disc, then writing their stringified types to disc, and
running `tsc` against them both to make sure they're aligned.
