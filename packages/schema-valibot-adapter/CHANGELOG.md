# @traversable/schema-valibot-adapter

## 0.0.23

### Patch Changes

- [#199](https://github.com/traversable/schema/pull/199) [`4cb8664`](https://github.com/traversable/schema/commit/4cb8664e9a926c68cdbf683c0d46c5680d1a3051) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds `@traversable/zod` package

- Updated dependencies [[`70dd4bb`](https://github.com/traversable/schema/commit/70dd4bb74817923fe18cef4e9fab350d72868f05), [`4cb8664`](https://github.com/traversable/schema/commit/4cb8664e9a926c68cdbf683c0d46c5680d1a3051)]:
  - @traversable/registry@0.0.26
  - @traversable/json@0.0.27

## 0.0.22

### Patch Changes

- Updated dependencies [[`172cf4e`](https://github.com/traversable/schema/commit/172cf4e014ad804d2ee409477c784f4806421b15), [`437011d`](https://github.com/traversable/schema/commit/437011d35e7a7b7532b6b613d76f255f9447c4c2), [`3b4d92d`](https://github.com/traversable/schema/commit/3b4d92d0c7e5e9ec2734fdcf5cff051abd7846ff), [`6a19161`](https://github.com/traversable/schema/commit/6a191613f903f02be7808bb79c8a2d3aae53d110), [`0a0d544`](https://github.com/traversable/schema/commit/0a0d544161b71a6e4d292c34aaca4806449058d6)]:
  - @traversable/registry@0.0.25
  - @traversable/json@0.0.26

## 0.0.21

### Patch Changes

- Updated dependencies [[`fa0fd7a`](https://github.com/traversable/schema/commit/fa0fd7ae692c043346959effe3a3413e27e7a440), [`70cf947`](https://github.com/traversable/schema/commit/70cf947c8c33a9f64a76e3428467d4e9b121be78), [`93786a9`](https://github.com/traversable/schema/commit/93786a9f323ee5b30172e9339070d1617099aa2b)]:
  - @traversable/registry@0.0.24
  - @traversable/json@0.0.25

## 0.0.20

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
  - @traversable/json@0.0.24

## 0.0.19

### Patch Changes

- Updated dependencies [[`c4dd024`](https://github.com/traversable/schema/commit/c4dd02409f0068b392aacde424f0829def157af8)]:
  - @traversable/registry@0.0.22
  - @traversable/json@0.0.23

## 0.0.18

### Patch Changes

- [#165](https://github.com/traversable/schema/pull/165) [`ba7c8a7`](https://github.com/traversable/schema/commit/ba7c8a73e6b080a5b5047171b33bd2d52857367e) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - removes `@traversable/schema-core` and `@traversable/schema-codec` workspaces

- Updated dependencies [[`9ddb68e`](https://github.com/traversable/schema/commit/9ddb68e6140b22837cede208575ee6b7ee4a076d), [`ba7c8a7`](https://github.com/traversable/schema/commit/ba7c8a73e6b080a5b5047171b33bd2d52857367e)]:
  - @traversable/registry@0.0.21
  - @traversable/json@0.0.22

## 0.0.17

### Patch Changes

- Updated dependencies [[`7cf3f91`](https://github.com/traversable/schema/commit/7cf3f91794aa61d9de21775db93743ff30fb5904)]:
  - @traversable/registry@0.0.20
  - @traversable/json@0.0.21

## 0.0.16

### Patch Changes

- Updated dependencies [[`7f745f2`](https://github.com/traversable/schema/commit/7f745f209d72ed276fd6ced4301117512bfb7710), [`38b1e05`](https://github.com/traversable/schema/commit/38b1e052ac576695fcc13baba037ee07564fdb12)]:
  - @traversable/registry@0.0.19
  - @traversable/json@0.0.20

## 0.0.15

### Patch Changes

- Updated dependencies [[`b99baa8`](https://github.com/traversable/schema/commit/b99baa8ccbbb5202dfd461883644dfedfeff235d)]:
  - @traversable/registry@0.0.18
  - @traversable/json@0.0.19

## 0.0.14

### Patch Changes

- [#137](https://github.com/traversable/schema/pull/137) [`43c3fbb`](https://github.com/traversable/schema/commit/43c3fbb359bbf442f3b88437eb72591389dcd9da) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs: adds inferred type predicates example to readme

- Updated dependencies [[`fc8437d`](https://github.com/traversable/schema/commit/fc8437d1108cce9b0aa51db3b81e3c980ff441e9), [`04ca730`](https://github.com/traversable/schema/commit/04ca73090eea9c0ce6d687982914ec19d61b3e66), [`43c3fbb`](https://github.com/traversable/schema/commit/43c3fbb359bbf442f3b88437eb72591389dcd9da), [`b26076f`](https://github.com/traversable/schema/commit/b26076fe1a9e3da217a9c053272357927cd14615)]:
  - @traversable/registry@0.0.17
  - @traversable/json@0.0.18

## 0.0.13

### Patch Changes

- Updated dependencies [[`c6d3325`](https://github.com/traversable/schema/commit/c6d3325d0f9b9ae91d3a3ab3fa3f5353cf195655), [`53f6727`](https://github.com/traversable/schema/commit/53f6727e95b810187794f10b344b2f6ff7a40978), [`7ae381e`](https://github.com/traversable/schema/commit/7ae381eb6bca21053047c518c9c4ed3e64a5f5c1)]:
  - @traversable/registry@0.0.16
  - @traversable/json@0.0.17

## 0.0.12

### Patch Changes

- [#114](https://github.com/traversable/schema/pull/114) [`3f6ddf7`](https://github.com/traversable/schema/commit/3f6ddf7c0dc95649915a6bc83a0e82b74553f2d5) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs: adds docs to root readme

- [#115](https://github.com/traversable/schema/pull/115) [`bdfee56`](https://github.com/traversable/schema/commit/bdfee56a06c57db91f55ec149b4a9390790b882f) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs

## 0.0.11

### Patch Changes

- [#99](https://github.com/traversable/schema/pull/99) [`82ad3d0`](https://github.com/traversable/schema/commit/82ad3d07334f04e69074a312a7ecae9c39b88692) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - build(root): upgrades TS to v5.8.2; fixes `publishConfig` defaults for workspace generation

- Updated dependencies [[`82ad3d0`](https://github.com/traversable/schema/commit/82ad3d07334f04e69074a312a7ecae9c39b88692)]:
  - @traversable/registry@0.0.15
  - @traversable/json@0.0.16

## 0.0.10

### Patch Changes

- Updated dependencies [[`8869f1d`](https://github.com/traversable/schema/commit/8869f1dcc3fc1ea8bb65ca83f025de03f036d333)]:
  - @traversable/registry@0.0.14
  - @traversable/json@0.0.15

## 0.0.9

### Patch Changes

- [#71](https://github.com/traversable/schema/pull/71) [`c5bb094`](https://github.com/traversable/schema/commit/c5bb09449640e32eb2f1c2a40be67fa161f77000) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(schema): simplify schema types

- Updated dependencies [[`c5bb094`](https://github.com/traversable/schema/commit/c5bb09449640e32eb2f1c2a40be67fa161f77000)]:
  - @traversable/json@0.0.14
  - @traversable/registry@0.0.13

## 0.0.8

### Patch Changes

- [#67](https://github.com/traversable/schema/pull/67) [`3cfb05e`](https://github.com/traversable/schema/commit/3cfb05e186b61f816d3a7ae8c3f0884ff5aceab3) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(registry): moves nested files up a level so they're part of the build

- Updated dependencies [[`3cfb05e`](https://github.com/traversable/schema/commit/3cfb05e186b61f816d3a7ae8c3f0884ff5aceab3)]:
  - @traversable/registry@0.0.12
  - @traversable/json@0.0.13

## 0.0.7

### Patch Changes

- [#65](https://github.com/traversable/schema/pull/65) [`7865d59`](https://github.com/traversable/schema/commit/7865d5955f02e7ba16bfa44d331289ece88e1eb6) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - attempt to fix build

- Updated dependencies [[`7865d59`](https://github.com/traversable/schema/commit/7865d5955f02e7ba16bfa44d331289ece88e1eb6)]:
  - @traversable/json@0.0.12
  - @traversable/registry@0.0.11

## 0.0.6

### Patch Changes

- [#63](https://github.com/traversable/schema/pull/63) [`904a3c9`](https://github.com/traversable/schema/commit/904a3c9d6bd87e573a60f37b8146f199d6994bdf) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix build

- Updated dependencies [[`904a3c9`](https://github.com/traversable/schema/commit/904a3c9d6bd87e573a60f37b8146f199d6994bdf), [`96ec20f`](https://github.com/traversable/schema/commit/96ec20f2d6cff2cd369e095080201171247dc213)]:
  - @traversable/json@0.0.11
  - @traversable/registry@0.0.10

## 0.0.5

### Patch Changes

- Updated dependencies [[`18b24e3`](https://github.com/traversable/schema/commit/18b24e3649c48d176063cb004ca909488ded6528)]:
  - @traversable/registry@0.0.9
  - @traversable/json@0.0.10

## 0.0.4

### Patch Changes

- [#52](https://github.com/traversable/schema/pull/52) [`a76de78`](https://github.com/traversable/schema/commit/a76de789d85182281bea1f36eac284068f2920d9) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(schema): composes features from dependencies in `@traversable/schema`

- Updated dependencies [[`a76de78`](https://github.com/traversable/schema/commit/a76de789d85182281bea1f36eac284068f2920d9), [`b7132bb`](https://github.com/traversable/schema/commit/b7132bb14ce51b305259bb9c44d7cc9fd57d55f4), [`67870c7`](https://github.com/traversable/schema/commit/67870c7f889d9a8c69b87ffa8f3ea32edda4e2a8), [`4d278c5`](https://github.com/traversable/schema/commit/4d278c5f2e5810f221570a0b062de085a6ec1a12)]:
  - @traversable/registry@0.0.8
  - @traversable/json@0.0.9

## 0.0.3

### Patch Changes

- Updated dependencies [[`b653ec4`](https://github.com/traversable/schema/commit/b653ec4b3f363793f31a46fe84dc30b60f99388a)]:
  - @traversable/registry@0.0.7
  - @traversable/json@0.0.8

## 0.0.2

### Patch Changes

- [#32](https://github.com/traversable/schema/pull/32) [`abc08a5`](https://github.com/traversable/schema/commit/abc08a5f0ecf000d018aed40d1d7b41374ed5661) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(schema,schema-core): makes `t.toString` behavior consistent; `configure` now applies optionals globally (closes #30, #31)

- Updated dependencies [[`fdccb94`](https://github.com/traversable/schema/commit/fdccb94b0bb4e407aabd90936ac426194c062d65)]:
  - @traversable/registry@0.0.6
  - @traversable/json@0.0.7

## 0.0.1

### Patch Changes

- [#26](https://github.com/traversable/schema/pull/26) [`e345c08`](https://github.com/traversable/schema/commit/e345c08f0c81d2446c3f7a017129f44b23020f30) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs(json): renames `Json.Recursive` to `Json.Fixpoint`, adds docs

- [#25](https://github.com/traversable/schema/pull/25) [`e74f4f6`](https://github.com/traversable/schema/commit/e74f4f6eceb307e8e261d6ae2d445142d120560a) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(valibot): adds `schema-valibot-adapter` package

- Updated dependencies [[`e345c08`](https://github.com/traversable/schema/commit/e345c08f0c81d2446c3f7a017129f44b23020f30), [`e74f4f6`](https://github.com/traversable/schema/commit/e74f4f6eceb307e8e261d6ae2d445142d120560a), [`722ccab`](https://github.com/traversable/schema/commit/722ccab08e842e2fb72dc68c69deae850ff07edb)]:
  - @traversable/json@0.0.6
  - @traversable/registry@0.0.5
