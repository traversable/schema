# @traversable/json

## 0.0.37

### Patch Changes

- Updated dependencies [[`b345726`](https://github.com/traversable/schema/commit/b345726d38e2f92f590ade18e9228fbd5468a36c)]:
  - @traversable/registry@0.0.36

## 0.0.36

### Patch Changes

- [#312](https://github.com/traversable/schema/pull/312) [`d9134a9`](https://github.com/traversable/schema/commit/d9134a9a8e765246f63dfda6df1b04afef98bba1) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs: removes MIT license from documentation

- Updated dependencies [[`d9134a9`](https://github.com/traversable/schema/commit/d9134a9a8e765246f63dfda6df1b04afef98bba1)]:
  - @traversable/registry@0.0.35

## 0.0.35

### Patch Changes

- [#298](https://github.com/traversable/schema/pull/298) [`bfd1e7d`](https://github.com/traversable/schema/commit/bfd1e7d6530a78f317e95e7cee98a20bc03c34c3) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - re-license project under the Hippocratic License

- Updated dependencies [[`bfd1e7d`](https://github.com/traversable/schema/commit/bfd1e7d6530a78f317e95e7cee98a20bc03c34c3)]:
  - @traversable/registry@0.0.34

## 0.0.34

### Patch Changes

- [#259](https://github.com/traversable/schema/pull/259) [`8cfec5b`](https://github.com/traversable/schema/commit/8cfec5bb20c2a42488bbbd830ceaaae196f80873) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(json-schema): adds fuzz-tested `JsonSchema.deepEqual`

- Updated dependencies [[`9532291`](https://github.com/traversable/schema/commit/95322918a79954160a72d2f0f24ef9917b33d539), [`5acd458`](https://github.com/traversable/schema/commit/5acd45800f47d942e34789f3c2bfac58d045c71d), [`8cfec5b`](https://github.com/traversable/schema/commit/8cfec5bb20c2a42488bbbd830ceaaae196f80873), [`2ab202c`](https://github.com/traversable/schema/commit/2ab202c5cfdd87dcb7f2bfe089f7a1c102745b43)]:
  - @traversable/registry@0.0.33

## 0.0.33

### Patch Changes

- Updated dependencies [[`2f1b2ad`](https://github.com/traversable/schema/commit/2f1b2ad004b04262847ced9967dcf63a4eac78ea)]:
  - @traversable/registry@0.0.32

## 0.0.32

### Patch Changes

- Updated dependencies [[`f254bac`](https://github.com/traversable/schema/commit/f254bac1d6eca4a2db33f4785b46a2af46d09320)]:
  - @traversable/registry@0.0.31

## 0.0.31

### Patch Changes

- Updated dependencies [[`e84658f`](https://github.com/traversable/schema/commit/e84658f8db4ae2bd3272a8c29683e26f7786b2a9), [`7cd3af3`](https://github.com/traversable/schema/commit/7cd3af34d2cf6647be23a5bd4dd396128a1ef02b), [`c94246a`](https://github.com/traversable/schema/commit/c94246a7cca8455102c46767173c9b605a03b646), [`cc42ee3`](https://github.com/traversable/schema/commit/cc42ee3bd90b3ebbef74de48cdffa28f5fa07ff4)]:
  - @traversable/registry@0.0.30

## 0.0.30

### Patch Changes

- Updated dependencies [[`46b53cb`](https://github.com/traversable/schema/commit/46b53cb0c198554638c2cf146eda139c5313c574)]:
  - @traversable/registry@0.0.29

## 0.0.29

### Patch Changes

- Updated dependencies [[`4f4ae3a`](https://github.com/traversable/schema/commit/4f4ae3a7f3e97071f40a544135bcaa9d65d7ecf9)]:
  - @traversable/registry@0.0.28

## 0.0.28

### Patch Changes

- Updated dependencies [[`97b8829`](https://github.com/traversable/schema/commit/97b88298f4efeabac549d81c47f3c174473cac84), [`b1c2039`](https://github.com/traversable/schema/commit/b1c20395bf548ea0ac00f6025824d077c61e4ea9)]:
  - @traversable/registry@0.0.27

## 0.0.27

### Patch Changes

- [#199](https://github.com/traversable/schema/pull/199) [`4cb8664`](https://github.com/traversable/schema/commit/4cb8664e9a926c68cdbf683c0d46c5680d1a3051) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds `@traversable/zod` package

- Updated dependencies [[`70dd4bb`](https://github.com/traversable/schema/commit/70dd4bb74817923fe18cef4e9fab350d72868f05), [`4cb8664`](https://github.com/traversable/schema/commit/4cb8664e9a926c68cdbf683c0d46c5680d1a3051)]:
  - @traversable/registry@0.0.26

## 0.0.26

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

- [#201](https://github.com/traversable/schema/pull/201) [`0a0d544`](https://github.com/traversable/schema/commit/0a0d544161b71a6e4d292c34aaca4806449058d6) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(json): removes `Arbitrary` module so users don't have to download fast-check as a dep

- Updated dependencies [[`172cf4e`](https://github.com/traversable/schema/commit/172cf4e014ad804d2ee409477c784f4806421b15), [`437011d`](https://github.com/traversable/schema/commit/437011d35e7a7b7532b6b613d76f255f9447c4c2), [`3b4d92d`](https://github.com/traversable/schema/commit/3b4d92d0c7e5e9ec2734fdcf5cff051abd7846ff), [`6a19161`](https://github.com/traversable/schema/commit/6a191613f903f02be7808bb79c8a2d3aae53d110)]:
  - @traversable/registry@0.0.25

## 0.0.25

### Patch Changes

- Updated dependencies [[`fa0fd7a`](https://github.com/traversable/schema/commit/fa0fd7ae692c043346959effe3a3413e27e7a440), [`70cf947`](https://github.com/traversable/schema/commit/70cf947c8c33a9f64a76e3428467d4e9b121be78), [`93786a9`](https://github.com/traversable/schema/commit/93786a9f323ee5b30172e9339070d1617099aa2b)]:
  - @traversable/registry@0.0.24

## 0.0.24

### Patch Changes

- [#188](https://github.com/traversable/schema/pull/188) [`9bdd97c`](https://github.com/traversable/schema/commit/9bdd97c2cb62969968e95f52e4120100ecc12f94) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ## breaking changes
  1. (#187)

  This change removes several schema constraints that turned out to be redundant.

  This is a breaking change, but the migration path is simple and mechanical.

  Usually I would opt for a deprecation, but since no users have raised any issues yet, I think it's safe to assume this won't
  break anybody in real life.

  ### removals

  The following APIs have been removed:
  - `t.bigint.moreThan` - use `t.bigint.min` instead
  - `t.bigint.lessThan` - use `t.bigint.max` instead
  - `t.integer.moreThan` - use `t.integer.min` instead
  - `t.integer.lessThan` - use `t.integer.max` instead

- [#188](https://github.com/traversable/schema/pull/188) [`ce2f333`](https://github.com/traversable/schema/commit/ce2f333ceb1e8a845c65b21d13145519595a3d8d) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ## new features
  1. (#158)
  - Adds validator support for schema constraints (#158)

- Updated dependencies [[`9bdd97c`](https://github.com/traversable/schema/commit/9bdd97c2cb62969968e95f52e4120100ecc12f94), [`ce2f333`](https://github.com/traversable/schema/commit/ce2f333ceb1e8a845c65b21d13145519595a3d8d)]:
  - @traversable/registry@0.0.23

## 0.0.23

### Patch Changes

- Updated dependencies [[`c4dd024`](https://github.com/traversable/schema/commit/c4dd02409f0068b392aacde424f0829def157af8)]:
  - @traversable/registry@0.0.22

## 0.0.22

### Patch Changes

- [#165](https://github.com/traversable/schema/pull/165) [`ba7c8a7`](https://github.com/traversable/schema/commit/ba7c8a73e6b080a5b5047171b33bd2d52857367e) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - removes `@traversable/schema-core` and `@traversable/schema-codec` workspaces

- Updated dependencies [[`9ddb68e`](https://github.com/traversable/schema/commit/9ddb68e6140b22837cede208575ee6b7ee4a076d), [`ba7c8a7`](https://github.com/traversable/schema/commit/ba7c8a73e6b080a5b5047171b33bd2d52857367e)]:
  - @traversable/registry@0.0.21

## 0.0.21

### Patch Changes

- Updated dependencies [[`7cf3f91`](https://github.com/traversable/schema/commit/7cf3f91794aa61d9de21775db93743ff30fb5904)]:
  - @traversable/registry@0.0.20

## 0.0.20

### Patch Changes

- Updated dependencies [[`7f745f2`](https://github.com/traversable/schema/commit/7f745f209d72ed276fd6ced4301117512bfb7710), [`38b1e05`](https://github.com/traversable/schema/commit/38b1e052ac576695fcc13baba037ee07564fdb12)]:
  - @traversable/registry@0.0.19

## 0.0.19

### Patch Changes

- Updated dependencies [[`b99baa8`](https://github.com/traversable/schema/commit/b99baa8ccbbb5202dfd461883644dfedfeff235d)]:
  - @traversable/registry@0.0.18

## 0.0.18

### Patch Changes

- [#137](https://github.com/traversable/schema/pull/137) [`43c3fbb`](https://github.com/traversable/schema/commit/43c3fbb359bbf442f3b88437eb72591389dcd9da) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs: adds inferred type predicates example to readme

- Updated dependencies [[`fc8437d`](https://github.com/traversable/schema/commit/fc8437d1108cce9b0aa51db3b81e3c980ff441e9), [`04ca730`](https://github.com/traversable/schema/commit/04ca73090eea9c0ce6d687982914ec19d61b3e66), [`43c3fbb`](https://github.com/traversable/schema/commit/43c3fbb359bbf442f3b88437eb72591389dcd9da), [`b26076f`](https://github.com/traversable/schema/commit/b26076fe1a9e3da217a9c053272357927cd14615)]:
  - @traversable/registry@0.0.17

## 0.0.17

### Patch Changes

- Updated dependencies [[`c6d3325`](https://github.com/traversable/schema/commit/c6d3325d0f9b9ae91d3a3ab3fa3f5353cf195655), [`53f6727`](https://github.com/traversable/schema/commit/53f6727e95b810187794f10b344b2f6ff7a40978), [`7ae381e`](https://github.com/traversable/schema/commit/7ae381eb6bca21053047c518c9c4ed3e64a5f5c1)]:
  - @traversable/registry@0.0.16

## 0.0.16

### Patch Changes

- [#99](https://github.com/traversable/schema/pull/99) [`82ad3d0`](https://github.com/traversable/schema/commit/82ad3d07334f04e69074a312a7ecae9c39b88692) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - build(root): upgrades TS to v5.8.2; fixes `publishConfig` defaults for workspace generation

- Updated dependencies [[`82ad3d0`](https://github.com/traversable/schema/commit/82ad3d07334f04e69074a312a7ecae9c39b88692)]:
  - @traversable/registry@0.0.15

## 0.0.15

### Patch Changes

- Updated dependencies [[`8869f1d`](https://github.com/traversable/schema/commit/8869f1dcc3fc1ea8bb65ca83f025de03f036d333)]:
  - @traversable/registry@0.0.14

## 0.0.14

### Patch Changes

- [#71](https://github.com/traversable/schema/pull/71) [`c5bb094`](https://github.com/traversable/schema/commit/c5bb09449640e32eb2f1c2a40be67fa161f77000) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(schema): simplify schema types

- Updated dependencies [[`c5bb094`](https://github.com/traversable/schema/commit/c5bb09449640e32eb2f1c2a40be67fa161f77000)]:
  - @traversable/registry@0.0.13

## 0.0.13

### Patch Changes

- [#67](https://github.com/traversable/schema/pull/67) [`3cfb05e`](https://github.com/traversable/schema/commit/3cfb05e186b61f816d3a7ae8c3f0884ff5aceab3) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(registry): moves nested files up a level so they're part of the build

- Updated dependencies [[`3cfb05e`](https://github.com/traversable/schema/commit/3cfb05e186b61f816d3a7ae8c3f0884ff5aceab3)]:
  - @traversable/registry@0.0.12

## 0.0.12

### Patch Changes

- [#65](https://github.com/traversable/schema/pull/65) [`7865d59`](https://github.com/traversable/schema/commit/7865d5955f02e7ba16bfa44d331289ece88e1eb6) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - attempt to fix build

- Updated dependencies [[`7865d59`](https://github.com/traversable/schema/commit/7865d5955f02e7ba16bfa44d331289ece88e1eb6)]:
  - @traversable/registry@0.0.11

## 0.0.11

### Patch Changes

- [#63](https://github.com/traversable/schema/pull/63) [`904a3c9`](https://github.com/traversable/schema/commit/904a3c9d6bd87e573a60f37b8146f199d6994bdf) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix build

- Updated dependencies [[`904a3c9`](https://github.com/traversable/schema/commit/904a3c9d6bd87e573a60f37b8146f199d6994bdf), [`96ec20f`](https://github.com/traversable/schema/commit/96ec20f2d6cff2cd369e095080201171247dc213)]:
  - @traversable/registry@0.0.10

## 0.0.10

### Patch Changes

- Updated dependencies [[`18b24e3`](https://github.com/traversable/schema/commit/18b24e3649c48d176063cb004ca909488ded6528)]:
  - @traversable/registry@0.0.9

## 0.0.9

### Patch Changes

- Updated dependencies [[`a76de78`](https://github.com/traversable/schema/commit/a76de789d85182281bea1f36eac284068f2920d9), [`b7132bb`](https://github.com/traversable/schema/commit/b7132bb14ce51b305259bb9c44d7cc9fd57d55f4), [`67870c7`](https://github.com/traversable/schema/commit/67870c7f889d9a8c69b87ffa8f3ea32edda4e2a8), [`4d278c5`](https://github.com/traversable/schema/commit/4d278c5f2e5810f221570a0b062de085a6ec1a12)]:
  - @traversable/registry@0.0.8

## 0.0.8

### Patch Changes

- [#40](https://github.com/traversable/schema/pull/40) [`b653ec4`](https://github.com/traversable/schema/commit/b653ec4b3f363793f31a46fe84dc30b60f99388a) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - init(sandbox): creates `examples/` folder for creating examples and testing builds

- Updated dependencies [[`b653ec4`](https://github.com/traversable/schema/commit/b653ec4b3f363793f31a46fe84dc30b60f99388a)]:
  - @traversable/registry@0.0.7

## 0.0.7

### Patch Changes

- Updated dependencies [[`fdccb94`](https://github.com/traversable/schema/commit/fdccb94b0bb4e407aabd90936ac426194c062d65)]:
  - @traversable/registry@0.0.6

## 0.0.6

### Patch Changes

- [#26](https://github.com/traversable/schema/pull/26) [`e345c08`](https://github.com/traversable/schema/commit/e345c08f0c81d2446c3f7a017129f44b23020f30) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs(json): renames `Json.Recursive` to `Json.Fixpoint`, adds docs

- [#25](https://github.com/traversable/schema/pull/25) [`e74f4f6`](https://github.com/traversable/schema/commit/e74f4f6eceb307e8e261d6ae2d445142d120560a) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(valibot): adds `schema-valibot-adapter` package

- [#22](https://github.com/traversable/schema/pull/22) [`722ccab`](https://github.com/traversable/schema/commit/722ccab08e842e2fb72dc68c69deae850ff07edb) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(json,registry): adds caching + cycle detection to `Json.mapWithIndex` and `Json.foldWithIndex`

- Updated dependencies [[`722ccab`](https://github.com/traversable/schema/commit/722ccab08e842e2fb72dc68c69deae850ff07edb)]:
  - @traversable/registry@0.0.5

## 0.0.5

### Patch Changes

- [#20](https://github.com/traversable/schema/pull/20) [`effe9f8`](https://github.com/traversable/schema/commit/effe9f845fae6bf7240701bb8997eaa1cd7720cb) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - build(all): updates publishConfig to point to npm registry for all packages

- [#20](https://github.com/traversable/schema/pull/20) [`effe9f8`](https://github.com/traversable/schema/commit/effe9f845fae6bf7240701bb8997eaa1cd7720cb) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - removes npmrc file to trigger re-publish

- [#20](https://github.com/traversable/schema/pull/20) [`effe9f8`](https://github.com/traversable/schema/commit/effe9f845fae6bf7240701bb8997eaa1cd7720cb) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - build(root): point npm config at npm registry

- Updated dependencies [[`effe9f8`](https://github.com/traversable/schema/commit/effe9f845fae6bf7240701bb8997eaa1cd7720cb), [`effe9f8`](https://github.com/traversable/schema/commit/effe9f845fae6bf7240701bb8997eaa1cd7720cb), [`effe9f8`](https://github.com/traversable/schema/commit/effe9f845fae6bf7240701bb8997eaa1cd7720cb)]:
  - @traversable/registry@0.0.4

## 0.0.4

### Patch Changes

- [#18](https://github.com/traversable/schema/pull/18) [`5546948`](https://github.com/traversable/schema/commit/55469480538cd65006f412fff76765f14599b2fd) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - build(all): updates publishConfig to point to npm registry for all packages

- [#18](https://github.com/traversable/schema/pull/18) [`5546948`](https://github.com/traversable/schema/commit/55469480538cd65006f412fff76765f14599b2fd) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - build(root): point npm config at npm registry

- Updated dependencies [[`5546948`](https://github.com/traversable/schema/commit/55469480538cd65006f412fff76765f14599b2fd), [`5546948`](https://github.com/traversable/schema/commit/55469480538cd65006f412fff76765f14599b2fd)]:
  - @traversable/registry@0.0.4

## 0.0.3

### Patch Changes

- [#16](https://github.com/traversable/schema/pull/16) [`7e7bf6a`](https://github.com/traversable/schema/commit/7e7bf6a9a16a7e8b2958e0c1ca270a9c5df73047) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - build(all): updates publishConfig to point to npm registry for all packages

- [#16](https://github.com/traversable/schema/pull/16) [`7e7bf6a`](https://github.com/traversable/schema/commit/7e7bf6a9a16a7e8b2958e0c1ca270a9c5df73047) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - build(root): point npm config at npm registry

- Updated dependencies [[`7e7bf6a`](https://github.com/traversable/schema/commit/7e7bf6a9a16a7e8b2958e0c1ca270a9c5df73047), [`7e7bf6a`](https://github.com/traversable/schema/commit/7e7bf6a9a16a7e8b2958e0c1ca270a9c5df73047)]:
  - @traversable/registry@0.0.3

## 0.0.2

### Patch Changes

- [#14](https://github.com/traversable/schema/pull/14) [`5bf4a01`](https://github.com/traversable/schema/commit/5bf4a01f76b76a1d1b290db3d5825f3c89cd2f4a) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - build(all): updates publishConfig to point to npm registry for all packages

- Updated dependencies [[`5bf4a01`](https://github.com/traversable/schema/commit/5bf4a01f76b76a1d1b290db3d5825f3c89cd2f4a)]:
  - @traversable/registry@0.0.2

## 0.0.1

### Patch Changes

- [#4](https://github.com/traversable/schema/pull/4) [`0955462`](https://github.com/traversable/schema/commit/095546256004bd978cbb29c28fc506fa9ea43666) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat: adds package `schema-zod-adapter`

- Updated dependencies [[`951abe1`](https://github.com/traversable/schema/commit/951abe1ec8024e76fcc84723f982db916ecf83f9), [`0955462`](https://github.com/traversable/schema/commit/095546256004bd978cbb29c28fc506fa9ea43666)]:
  - @traversable/registry@0.0.1
