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

## new features

- new [zod@4 functor](https://github.com/traversable/schema/blob/8b187406021aeb67f75a1d62f94f2b1e441c70ea/packages/schema-zod-adapter/src/functor-v4.ts)
  - same API as the [zod@3 functor](https://github.com/traversable/schema/blob/main/packages/schema-zod-adapter/src/functor.ts)
  - this has a lot of potential for library authors
  - TODO: build a naive version of [react-hook-form](https://react-hook-form.com/), to demonstrate how much it simplifies the implementation

## test

- adds generated [typelevel benchmarks](https://github.com/traversable/schema/blob/8b187406021aeb67f75a1d62f94f2b1e441c70ea/packages/schema/test/generate-benchmark.test.ts) automation
