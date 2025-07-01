# @traversable/schema-errors

## 0.0.1

### Patch Changes

- [#195](https://github.com/traversable/schema/pull/195) [`437011d`](https://github.com/traversable/schema/commit/437011d35e7a7b7532b6b613d76f255f9447c4c2) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ## new packages

  - new `schema-errors` package

  ## new features

  - new [zod@4 functor](https://github.com/traversable/schema/blob/8b187406021aeb67f75a1d62f94f2b1e441c70ea/packages/schema-zod-adapter/src/functor-v4.ts)
    - same API as the [zod@3 functor](https://github.com/traversable/schema/blob/main/packages/schema-zod-adapter/src/functor.ts)
    - this has a lot of potential for library authors

  ## test

  - adds generated [typelevel benchmarks](https://github.com/traversable/schema/blob/8b187406021aeb67f75a1d62f94f2b1e441c70ea/packages/schema/test/generate-benchmark.test.ts) automation

- [#195](https://github.com/traversable/schema/pull/195) [`6a19161`](https://github.com/traversable/schema/commit/6a191613f903f02be7808bb79c8a2d3aae53d110) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ### new features

  Adds native support for `.toString` method on all schemas.

  ### breaking changes

  If you were using the `schema-to-string` package, `.toString` has been update to `.toType`, to better
  reflect the behavior that the package adds.

  I'm considering changing the package name as well, but am punting on that for now.

- Updated dependencies [[`8b8522b`](https://github.com/traversable/schema/commit/8b8522bb2ed60114c346c56c47e66763d5d857a1), [`172cf4e`](https://github.com/traversable/schema/commit/172cf4e014ad804d2ee409477c784f4806421b15), [`437011d`](https://github.com/traversable/schema/commit/437011d35e7a7b7532b6b613d76f255f9447c4c2), [`3b4d92d`](https://github.com/traversable/schema/commit/3b4d92d0c7e5e9ec2734fdcf5cff051abd7846ff), [`6a19161`](https://github.com/traversable/schema/commit/6a191613f903f02be7808bb79c8a2d3aae53d110), [`0a0d544`](https://github.com/traversable/schema/commit/0a0d544161b71a6e4d292c34aaca4806449058d6)]:
  - @traversable/schema@0.0.36
  - @traversable/registry@0.0.25
  - @traversable/json@0.0.26
