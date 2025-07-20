# @traversable/zod

## 0.0.8

### Patch Changes

- [#248](https://github.com/traversable/schema/pull/248) [`9117fb5`](https://github.com/traversable/schema/commit/9117fb5869bab61ae25f1f4c805471f27f07feea) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs(zod): document the rest of the API

- [#248](https://github.com/traversable/schema/pull/248) [`8d468e5`](https://github.com/traversable/schema/commit/8d468e503db486181f22f0833733fc25877857bd) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - optimize(zod): optimize unions in `zx.equals` to inline type-checking for scalar types

- [#243](https://github.com/traversable/schema/pull/243) [`cc8cd9f`](https://github.com/traversable/schema/commit/cc8cd9f217297b014dc25a617741b643cb0563c6) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs(zod): updates documentation

- [#251](https://github.com/traversable/schema/pull/251) [`813d43e`](https://github.com/traversable/schema/commit/813d43e83d5782fbd9f078c2ca7aca482c9296d2) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - init(zod-test): separates zod testing utils into separate package: `@traversable/zod-test`

- [#245](https://github.com/traversable/schema/pull/245) [`06b2ca6`](https://github.com/traversable/schema/commit/06b2ca6dd316b7f7a3e54cfdb587a725ef07a87b) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs(zod): adds docs for `zx.SeedGenerator` and `zx.seedToSchema`

- [#250](https://github.com/traversable/schema/pull/250) [`2f1b2ad`](https://github.com/traversable/schema/commit/2f1b2ad004b04262847ced9967dcf63a4eac78ea) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds `zx.clone` API

- Updated dependencies [[`2f1b2ad`](https://github.com/traversable/schema/commit/2f1b2ad004b04262847ced9967dcf63a4eac78ea)]:
  - @traversable/registry@0.0.32
  - @traversable/json@0.0.33

## 0.0.7

### Patch Changes

- [#238](https://github.com/traversable/schema/pull/238) [`f254bac`](https://github.com/traversable/schema/commit/f254bac1d6eca4a2db33f4785b46a2af46d09320) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - optimize(zod): adds discriminated union detection for `zx.equals`

- Updated dependencies [[`f254bac`](https://github.com/traversable/schema/commit/f254bac1d6eca4a2db33f4785b46a2af46d09320)]:
  - @traversable/registry@0.0.31
  - @traversable/json@0.0.32

## 0.0.6

### Patch Changes

- [#234](https://github.com/traversable/schema/pull/234) [`980f58a`](https://github.com/traversable/schema/commit/980f58adebdc2f8abf631b1ef7fae0942f744a04) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - optimize(zod): micro-optimizations for `zx.equals`

- [#235](https://github.com/traversable/schema/pull/235) [`a1abbba`](https://github.com/traversable/schema/commit/a1abbbabeda1f4c2659b5f6af8ee9ed025485faa) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - bench(zods): adds benchmarks that prevent compiler optimizations, including:
  - dead code elimination
  - loop invariant code motion

## 0.0.5

### Patch Changes

- [#232](https://github.com/traversable/schema/pull/232) [`7cd3af3`](https://github.com/traversable/schema/commit/7cd3af34d2cf6647be23a5bd4dd396128a1ef02b) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(typebox): adds `box.toString`, random typebox schema generator

- [#232](https://github.com/traversable/schema/pull/232) [`c94246a`](https://github.com/traversable/schema/commit/c94246a7cca8455102c46767173c9b605a03b646) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - refactor(registry,zod,typebox): moves `keyAccessor` and `indexAccessor` to registry

- [#232](https://github.com/traversable/schema/pull/232) [`e84658f`](https://github.com/traversable/schema/commit/e84658f8db4ae2bd3272a8c29683e26f7786b2a9) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - optimize(zod): removes spreading from functor instances

- [#232](https://github.com/traversable/schema/pull/232) [`cc42ee3`](https://github.com/traversable/schema/commit/cc42ee3bd90b3ebbef74de48cdffa28f5fa07ff4) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(typebox): adds `box.equals`

- [#231](https://github.com/traversable/schema/pull/231) [`0f8a50a`](https://github.com/traversable/schema/commit/0f8a50a28918a3065e2bc1110ffe174b88a50052) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - chore(schema,zod): migrates to zod@4.0 proper

- Updated dependencies [[`e84658f`](https://github.com/traversable/schema/commit/e84658f8db4ae2bd3272a8c29683e26f7786b2a9), [`7cd3af3`](https://github.com/traversable/schema/commit/7cd3af34d2cf6647be23a5bd4dd396128a1ef02b), [`c94246a`](https://github.com/traversable/schema/commit/c94246a7cca8455102c46767173c9b605a03b646), [`cc42ee3`](https://github.com/traversable/schema/commit/cc42ee3bd90b3ebbef74de48cdffa28f5fa07ff4)]:
  - @traversable/registry@0.0.30
  - @traversable/json@0.0.31

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
