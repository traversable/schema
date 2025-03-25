---
"@traversable/schema": patch
---

## changes

This PR renames a few schema constraints to make the semantics more explicit / less ambiguous.

This is not a breaking change, since the schema constraints API has not yet been published.

1. renames `.btwn` to `.between`
  - `t.integer.btwn` -> `t.integer.between`
  - `t.bigint.btwn` -> `t.bigint.between`
  - `t.number.btwn` -> `t.number.between`
  - `t.string.btwn` -> `t.string.between`
  - `t.array.btwn` -> `t.array.between`

2. renames `.lt` to `.lessThan`
  - `t.integer.lt` -> `t.integer.lessThan`
  - `t.bigint.lt` -> `t.bigint.lessThan`
  - `t.number.lt` -> `t.number.lessThan`

3. renames `.gt` to `.moreThan`
  - `t.integer.gt` -> `t.integer.moreThan`
  - `t.bigint.gt` -> `t.bigint.moreThan`
  - `t.number.gt` -> `t.number.moreThan`
