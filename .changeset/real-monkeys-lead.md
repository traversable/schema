---
"@traversable/schema-seed": patch
---

In preparation for adding support for "equals functions" (picture like, faster and more granular versions of lodash's `_.deepEqual`), we needed to refactor the `@traversable/schema-seed` package.

This refactoring was largely internal; this release includes a few new exports as part of the API, but shouldn't include any breaking changes.

## new features

- feat(seed): adds Seed constructor functions
- feat(seed): adds target type as a phantom prop on seed arrays

## internal changes

- refactor(seed): simplifies the `Seed` API

## fixes 

- fix(seed): fixes a few minor bugs to make seed generation deterministic

