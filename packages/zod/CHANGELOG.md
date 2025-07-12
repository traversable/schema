# @traversable/zod

## 0.0.4

### Patch Changes

- [#228](https://github.com/traversable/schema/pull/228) [`5cbffd5`](https://github.com/traversable/schema/commit/5cbffd5de570af9afd6ed4d9f60c5b5fdbf5881f) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds `zx.equals` support for rest elements in `z.tuple`

- [#228](https://github.com/traversable/schema/pull/228) [`7c93e9a`](https://github.com/traversable/schema/commit/7c93e9a0b404a412423588365c51debf8b2f6d0b) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(zod): fixes bug with `z.union([z.file()]).readonly()`

- [#228](https://github.com/traversable/schema/pull/228) [`46b53cb`](https://github.com/traversable/schema/commit/46b53cb0c198554638c2cf146eda139c5313c574) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - test(zod): fuzz test `zx.equals`

- [#228](https://github.com/traversable/schema/pull/228) [`c216632`](https://github.com/traversable/schema/commit/c216632d9b22f4c0e487169f906f77c23ae0820c) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds `zx.equals` support for "catchall" properties in `z.object`

- Updated dependencies [[`46b53cb`](https://github.com/traversable/schema/commit/46b53cb0c198554638c2cf146eda139c5313c574)]:
  - @traversable/registry@0.0.29
  - @traversable/json@0.0.30

## 0.0.3

### Patch Changes

- [#219](https://github.com/traversable/schema/pull/219) [`4f4ae3a`](https://github.com/traversable/schema/commit/4f4ae3a7f3e97071f40a544135bcaa9d65d7ecf9) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds circular schema detection

- [#223](https://github.com/traversable/schema/pull/223) [`4045bdf`](https://github.com/traversable/schema/commit/4045bdf9ed63719c8e3a8778425fb7a53a4e8d97) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - break(zod): renames `zx.paths` to `zx.toPaths`

- [#221](https://github.com/traversable/schema/pull/221) [`38bb502`](https://github.com/traversable/schema/commit/38bb5021ff8d76f3d27be9189da01bf1903d856d) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(zod): fixes `zx.toType(z.lazy(() => z.any()).readonly())`

- Updated dependencies [[`4f4ae3a`](https://github.com/traversable/schema/commit/4f4ae3a7f3e97071f40a544135bcaa9d65d7ecf9)]:
  - @traversable/registry@0.0.28
  - @traversable/json@0.0.29

## 0.0.2

### Patch Changes

- [#205](https://github.com/traversable/schema/pull/205) [`869c071`](https://github.com/traversable/schema/commit/869c07145f749f8b88c58b8833b178162b8e7212) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): convert a zod schema to a blazing fast jit-compiled type-guard

- [#205](https://github.com/traversable/schema/pull/205) [`97b8829`](https://github.com/traversable/schema/commit/97b88298f4efeabac549d81c47f3c174473cac84) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): convert a zod schema to a blazing fast jit-compiled "deepEquals" function

- [#205](https://github.com/traversable/schema/pull/205) [`b1c2039`](https://github.com/traversable/schema/commit/b1c20395bf548ea0ac00f6025824d077c61e4ea9) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat: optimizes zx.equals.compile and zx.equals.writeable functions

- Updated dependencies [[`97b8829`](https://github.com/traversable/schema/commit/97b88298f4efeabac549d81c47f3c174473cac84), [`b1c2039`](https://github.com/traversable/schema/commit/b1c20395bf548ea0ac00f6025824d077c61e4ea9)]:
  - @traversable/registry@0.0.27
  - @traversable/json@0.0.28

## 0.0.1

### Patch Changes

- [#199](https://github.com/traversable/schema/pull/199) [`4cb8664`](https://github.com/traversable/schema/commit/4cb8664e9a926c68cdbf683c0d46c5680d1a3051) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds `@traversable/zod` package

- [#204](https://github.com/traversable/schema/pull/204) [`54f650e`](https://github.com/traversable/schema/commit/54f650e7870cd5cfd46936ea66230edc9a80ec2d) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs(zod): adds docs for `zx.makeLens`

- Updated dependencies [[`70dd4bb`](https://github.com/traversable/schema/commit/70dd4bb74817923fe18cef4e9fab350d72868f05), [`4cb8664`](https://github.com/traversable/schema/commit/4cb8664e9a926c68cdbf683c0d46c5680d1a3051)]:
  - @traversable/registry@0.0.26
  - @traversable/json@0.0.27
