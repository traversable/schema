# @traversable/derive-codec

## 0.0.10

### Patch Changes

- Updated dependencies [[`70dd4bb`](https://github.com/traversable/schema/commit/70dd4bb74817923fe18cef4e9fab350d72868f05), [`4cb8664`](https://github.com/traversable/schema/commit/4cb8664e9a926c68cdbf683c0d46c5680d1a3051)]:
  - @traversable/registry@0.0.26
  - @traversable/schema@0.0.37

## 0.0.9

### Patch Changes

- Updated dependencies [[`8b8522b`](https://github.com/traversable/schema/commit/8b8522bb2ed60114c346c56c47e66763d5d857a1), [`172cf4e`](https://github.com/traversable/schema/commit/172cf4e014ad804d2ee409477c784f4806421b15), [`437011d`](https://github.com/traversable/schema/commit/437011d35e7a7b7532b6b613d76f255f9447c4c2), [`3b4d92d`](https://github.com/traversable/schema/commit/3b4d92d0c7e5e9ec2734fdcf5cff051abd7846ff), [`6a19161`](https://github.com/traversable/schema/commit/6a191613f903f02be7808bb79c8a2d3aae53d110)]:
  - @traversable/schema@0.0.36
  - @traversable/registry@0.0.25

## 0.0.8

### Patch Changes

- [#190](https://github.com/traversable/schema/pull/190) [`70cf947`](https://github.com/traversable/schema/commit/70cf947c8c33a9f64a76e3428467d4e9b121be78) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ## refactor

  This change moves over to using "faux-prototypes" to extend schemas.

  This ends up being much simpler to implement in userland, and it also rules
  out certain edge cases that come from trying to compose schema definitions together.

- Updated dependencies [[`9685551`](https://github.com/traversable/schema/commit/9685551af3fe52896b6551721b19bfc941deba9b), [`fa0fd7a`](https://github.com/traversable/schema/commit/fa0fd7ae692c043346959effe3a3413e27e7a440), [`70cf947`](https://github.com/traversable/schema/commit/70cf947c8c33a9f64a76e3428467d4e9b121be78), [`93786a9`](https://github.com/traversable/schema/commit/93786a9f323ee5b30172e9339070d1617099aa2b)]:
  - @traversable/schema@0.0.35
  - @traversable/registry@0.0.24

## 0.0.7

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
  - @traversable/schema@0.0.34

## 0.0.6

### Patch Changes

- Updated dependencies [[`c4dd024`](https://github.com/traversable/schema/commit/c4dd02409f0068b392aacde424f0829def157af8)]:
  - @traversable/registry@0.0.22
  - @traversable/schema@0.0.33

## 0.0.5

### Patch Changes

- Updated dependencies [[`5492d1a`](https://github.com/traversable/schema/commit/5492d1adddece353ece6447fdf3c9c5edc7a99af)]:
  - @traversable/schema@0.0.32

## 0.0.4

### Patch Changes

- [#165](https://github.com/traversable/schema/pull/165) [`9ddb68e`](https://github.com/traversable/schema/commit/9ddb68e6140b22837cede208575ee6b7ee4a076d) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ## new features

  - adds schema constraints to JSON schema

  ## examples

  - adds proper demo to sandbox app with editor-like UI (hover states, etc.)

  ## test

  - adds ~50 tests to core library to edge coverage closer to 100%

- [#165](https://github.com/traversable/schema/pull/165) [`ba7c8a7`](https://github.com/traversable/schema/commit/ba7c8a73e6b080a5b5047171b33bd2d52857367e) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - removes `@traversable/schema-core` and `@traversable/schema-codec` workspaces

- [#165](https://github.com/traversable/schema/pull/165) [`5f636ba`](https://github.com/traversable/schema/commit/5f636bacc373b2eb3914b19f34b48be991b7f7bc) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - registers side-effects in package.json file

- Updated dependencies [[`fcbfd2d`](https://github.com/traversable/schema/commit/fcbfd2d38157370f39e40f82cda36901ebeb7cb4), [`9ddb68e`](https://github.com/traversable/schema/commit/9ddb68e6140b22837cede208575ee6b7ee4a076d), [`ba7c8a7`](https://github.com/traversable/schema/commit/ba7c8a73e6b080a5b5047171b33bd2d52857367e)]:
  - @traversable/schema@0.0.31
  - @traversable/registry@0.0.21

## 0.0.3

### Patch Changes

- Updated dependencies [[`7cf3f91`](https://github.com/traversable/schema/commit/7cf3f91794aa61d9de21775db93743ff30fb5904), [`c66a1b3`](https://github.com/traversable/schema/commit/c66a1b32aad913cfddb451bc597f503570d032a7), [`c66a1b3`](https://github.com/traversable/schema/commit/c66a1b32aad913cfddb451bc597f503570d032a7)]:
  - @traversable/registry@0.0.20
  - @traversable/schema@0.0.30

## 0.0.2

### Patch Changes

- [#149](https://github.com/traversable/schema/pull/149) [`7f745f2`](https://github.com/traversable/schema/commit/7f745f209d72ed276fd6ced4301117512bfb7710) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - examples(lib): adds extensibility example showing how library authors can use traversable core to build their own schema library

- [#149](https://github.com/traversable/schema/pull/149) [`38b1e05`](https://github.com/traversable/schema/commit/38b1e052ac576695fcc13baba037ee07564fdb12) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(codec, validators, json-schema, schema-to-string): fixes overwriting defs bug when extending core schemas

- [#149](https://github.com/traversable/schema/pull/149) [`e7718cb`](https://github.com/traversable/schema/commit/e7718cb422e0bd53a0ea33b10f9029c7d5f1df25) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(validators): removes self-reference to `t.object.def`

- Updated dependencies [[`7f745f2`](https://github.com/traversable/schema/commit/7f745f209d72ed276fd6ced4301117512bfb7710), [`38b1e05`](https://github.com/traversable/schema/commit/38b1e052ac576695fcc13baba037ee07564fdb12)]:
  - @traversable/registry@0.0.19
  - @traversable/schema@0.0.29

## 0.0.1

### Patch Changes

- [#144](https://github.com/traversable/schema/pull/144) [`b99baa8`](https://github.com/traversable/schema/commit/b99baa8ccbbb5202dfd461883644dfedfeff235d) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ## new features

  The `codec` feature was specifically designed for the BFF use case.

  To install the `.pipe` and `.extend` methods on all schemas, simply import the `@traversable/derive-codec` package.

  ### example

  ```typescript
  import { t } from "@traversable/schema";
  import "@traversable/derive-codec";
  //      ^^ this installs the `.pipe` and `.extend` methods on all schemas

  let User = t
    .object({ name: t.optional(t.string), createdAt: t.string })
    .pipe((user) => ({ ...user, createdAt: new Date(user.createdAt) }))
    .unpipe((user) => ({ ...user, createdAt: user.createdAt.toISOString() }));

  let fromAPI = User.parse({
    name: "Bill Murray",
    createdAt: new Date().toISOString(),
  });
  //   ^?  let fromAPI: Error | { name?: string, createdAt: Date}

  if (fromAPI instanceof Error) throw fromAPI;
  fromAPI;
  // ^? { name?: string, createdAt: Date }

  let toAPI = User.encode(fromAPI);
  //  ^? let toAPI: { name?: string, createdAt: string }
  ```

- Updated dependencies [[`b99baa8`](https://github.com/traversable/schema/commit/b99baa8ccbbb5202dfd461883644dfedfeff235d)]:
  - @traversable/registry@0.0.18
  - @traversable/schema@0.0.28
