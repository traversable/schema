# @traversable/schema-seed

## 0.0.2

### Patch Changes

- [#39](https://github.com/traversable/schema/pull/39) [`fdccb94`](https://github.com/traversable/schema/commit/fdccb94b0bb4e407aabd90936ac426194c062d65) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - In preparation for adding support for "equals functions" (picture like, faster and more granular versions of lodash's `_.deepEqual`), we needed to refactor the `@traversable/schema-seed` package.

  This refactoring was largely internal; this release includes a few new exports as part of the API, but shouldn't include any breaking changes.

  ## new features

  - feat(seed): adds Seed constructor functions
  - feat(seed): adds target type as a phantom prop on seed arrays

  ## internal changes

  - refactor(seed): simplifies the `Seed` API

  ## fixes

  - fix(seed): fixes a few minor bugs to make seed generation deterministic

- Updated dependencies [[`fdccb94`](https://github.com/traversable/schema/commit/fdccb94b0bb4e407aabd90936ac426194c062d65), [`f873c28`](https://github.com/traversable/schema/commit/f873c2845a29f55e37deddf76043641a07cf405b), [`abc08a5`](https://github.com/traversable/schema/commit/abc08a5f0ecf000d018aed40d1d7b41374ed5661), [`547df94`](https://github.com/traversable/schema/commit/547df949cdb82d267f4b53b01085e748016d7c6a), [`fdccb94`](https://github.com/traversable/schema/commit/fdccb94b0bb4e407aabd90936ac426194c062d65)]:
  - @traversable/registry@0.0.6
  - @traversable/schema-core@0.0.7
  - @traversable/json@0.0.7

## 0.0.1

### Patch Changes

- [#28](https://github.com/traversable/schema/pull/28) [`83e30a9`](https://github.com/traversable/schema/commit/83e30a9aa508b1f8ceef66035f43f336201ef515) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(seed): creates new schema.seed for generating arbitrary schemas

- Updated dependencies [[`e345c08`](https://github.com/traversable/schema/commit/e345c08f0c81d2446c3f7a017129f44b23020f30), [`e74f4f6`](https://github.com/traversable/schema/commit/e74f4f6eceb307e8e261d6ae2d445142d120560a), [`722ccab`](https://github.com/traversable/schema/commit/722ccab08e842e2fb72dc68c69deae850ff07edb)]:
  - @traversable/json@0.0.6
  - @traversable/registry@0.0.5
  - @traversable/schema-core@0.0.6
