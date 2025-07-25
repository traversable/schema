# @traversable/registry

## 0.0.32

### Patch Changes

- [#250](https://github.com/traversable/schema/pull/250) [`2f1b2ad`](https://github.com/traversable/schema/commit/2f1b2ad004b04262847ced9967dcf63a4eac78ea) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds `zx.clone` API

## 0.0.31

### Patch Changes

- [#238](https://github.com/traversable/schema/pull/238) [`f254bac`](https://github.com/traversable/schema/commit/f254bac1d6eca4a2db33f4785b46a2af46d09320) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(registry): adds `intersectKeys` helper

## 0.0.30

### Patch Changes

- [#232](https://github.com/traversable/schema/pull/232) [`e84658f`](https://github.com/traversable/schema/commit/e84658f8db4ae2bd3272a8c29683e26f7786b2a9) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(registry): adds `stringifyKey` to registry

- [#232](https://github.com/traversable/schema/pull/232) [`7cd3af3`](https://github.com/traversable/schema/commit/7cd3af34d2cf6647be23a5bd4dd396128a1ef02b) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(typebox): adds `box.toString`, random typebox schema generator

- [#232](https://github.com/traversable/schema/pull/232) [`c94246a`](https://github.com/traversable/schema/commit/c94246a7cca8455102c46767173c9b605a03b646) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - refactor(registry,zod,typebox): moves `keyAccessor` and `indexAccessor` to registry

- [#232](https://github.com/traversable/schema/pull/232) [`cc42ee3`](https://github.com/traversable/schema/commit/cc42ee3bd90b3ebbef74de48cdffa28f5fa07ff4) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(typebox): adds `box.equals`

## 0.0.29

### Patch Changes

- [#228](https://github.com/traversable/schema/pull/228) [`46b53cb`](https://github.com/traversable/schema/commit/46b53cb0c198554638c2cf146eda139c5313c574) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - test(zod): fuzz test `zx.equals`

## 0.0.28

### Patch Changes

- [#219](https://github.com/traversable/schema/pull/219) [`4f4ae3a`](https://github.com/traversable/schema/commit/4f4ae3a7f3e97071f40a544135bcaa9d65d7ecf9) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds circular schema detection

## 0.0.27

### Patch Changes

- [#205](https://github.com/traversable/schema/pull/205) [`97b8829`](https://github.com/traversable/schema/commit/97b88298f4efeabac549d81c47f3c174473cac84) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): convert a zod schema to a blazing fast jit-compiled "deepEquals" function

- [#205](https://github.com/traversable/schema/pull/205) [`b1c2039`](https://github.com/traversable/schema/commit/b1c20395bf548ea0ac00f6025824d077c61e4ea9) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat: optimizes zx.equals.compile and zx.equals.writeable functions

## 0.0.26

### Patch Changes

- [#199](https://github.com/traversable/schema/pull/199) [`70dd4bb`](https://github.com/traversable/schema/commit/70dd4bb74817923fe18cef4e9fab350d72868f05) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ## new features
  - zod: random schema generator + reproducibly valid/invalid data generators for zod v4 schemas

- [#199](https://github.com/traversable/schema/pull/199) [`4cb8664`](https://github.com/traversable/schema/commit/4cb8664e9a926c68cdbf683c0d46c5680d1a3051) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds `@traversable/zod` package

## 0.0.25

### Patch Changes

- [#198](https://github.com/traversable/schema/pull/198) [`172cf4e`](https://github.com/traversable/schema/commit/172cf4e014ad804d2ee409477c784f4806421b15) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ### new packages
  - adds new package `@traversable/schema-compiler`, which exports functions for
    generating optimized schemas (sometimes called "jit compiled" schemas)

    #### Example

    ```typescript
    import { t } from "@traversable/schema";
    import { Compiler } from "@traversable/schema-compiler";

    const UserSchema = t.object({
      firstName: t.string,
      lastName: t.optional(t.string),
      address: t.optional(
        t.object({
          street: t.tuple(t.string, t.optional(t.string)),
          postalCode: t.optional(t.string),
          state: t.enum("AK", "AL", "AZ" /* ... */),
        }),
      ),
    });

    /** use `Compiler.generate` to generate a validation function in string form: */
    console.log(Compiler.generate(UserSchema));
    //
    // function check(value) {
    //     return (
    //       !!value && typeof value === "object" && !Array.isArray(value)
    //       && typeof value.firstName === "string"
    //       && (value.lastName === undefined || typeof value.lastName === "string")
    //       && !!value.address && typeof value.address === "object" && !Array.isArray(value.address)
    //         && (value.address.postalCode === undefined || typeof value.address.postalCode === "string")
    //         && Array.isArray(value.address.street)
    //         && (value.address.street.length === 1 || value.address.street.length === 2)
    //           && typeof value.address.street[0] === "string"
    //           && (value.address.street[1] === undefined || typeof value.address.street[1] === "string")
    //         && (value.address.state === "AK" || value.address.state === "AL" || value.address.state === "AZ")
    //     )
    //   }

    /** use `Compiler.compile` to generate a validation function in-memory, using `new Function(...)`: */
    const CompiledSchema = Compiler.compile(UserSchema);
    ```

- [#195](https://github.com/traversable/schema/pull/195) [`437011d`](https://github.com/traversable/schema/commit/437011d35e7a7b7532b6b613d76f255f9447c4c2) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ## new packages
  - new `schema-errors` package

  ## new features
  - new [zod@4 functor](https://github.com/traversable/schema/blob/8b187406021aeb67f75a1d62f94f2b1e441c70ea/packages/schema-zod-adapter/src/functor-v4.ts)
    - same API as the [zod@3 functor](https://github.com/traversable/schema/blob/main/packages/schema-zod-adapter/src/functor.ts)
    - this has a lot of potential for library authors

  ## test
  - adds generated [typelevel benchmarks](https://github.com/traversable/schema/blob/8b187406021aeb67f75a1d62f94f2b1e441c70ea/packages/schema/test/generate-benchmark.test.ts) automation

- [#197](https://github.com/traversable/schema/pull/197) [`3b4d92d`](https://github.com/traversable/schema/commit/3b4d92d0c7e5e9ec2734fdcf5cff051abd7846ff) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ### changes
  - upgrades TS to v5.8.3

- [#195](https://github.com/traversable/schema/pull/195) [`6a19161`](https://github.com/traversable/schema/commit/6a191613f903f02be7808bb79c8a2d3aae53d110) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ### new features

  Adds native support for `.toString` method on all schemas.

  ### breaking changes

  If you were using the `schema-to-string` package, `.toString` has been update to `.toType`, to better
  reflect the behavior that the package adds.

  I'm considering changing the package name as well, but am punting on that for now.

## 0.0.24

### Patch Changes

- [#190](https://github.com/traversable/schema/pull/190) [`fa0fd7a`](https://github.com/traversable/schema/commit/fa0fd7ae692c043346959effe3a3413e27e7a440) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(registry): adds `pick` and `omit` utilities

- [#190](https://github.com/traversable/schema/pull/190) [`70cf947`](https://github.com/traversable/schema/commit/70cf947c8c33a9f64a76e3428467d4e9b121be78) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ## refactor

  This change moves over to using "faux-prototypes" to extend schemas.

  This ends up being much simpler to implement in userland, and it also rules
  out certain edge cases that come from trying to compose schema definitions together.

- [#190](https://github.com/traversable/schema/pull/190) [`93786a9`](https://github.com/traversable/schema/commit/93786a9f323ee5b30172e9339070d1617099aa2b) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(registry): adds magic `merge` utility

## 0.0.23

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

## 0.0.22

### Patch Changes

- [#183](https://github.com/traversable/schema/pull/183) [`c4dd024`](https://github.com/traversable/schema/commit/c4dd02409f0068b392aacde424f0829def157af8) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(schema,registry): revert back to ES2020-compatible exports

## 0.0.21

### Patch Changes

- [#165](https://github.com/traversable/schema/pull/165) [`9ddb68e`](https://github.com/traversable/schema/commit/9ddb68e6140b22837cede208575ee6b7ee4a076d) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ## new features
  - adds schema constraints to JSON schema

  ## examples
  - adds proper demo to sandbox app with editor-like UI (hover states, etc.)

  ## test
  - adds ~50 tests to core library to edge coverage closer to 100%

- [#165](https://github.com/traversable/schema/pull/165) [`ba7c8a7`](https://github.com/traversable/schema/commit/ba7c8a73e6b080a5b5047171b33bd2d52857367e) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - removes `@traversable/schema-core` and `@traversable/schema-codec` workspaces

## 0.0.20

### Patch Changes

- [#155](https://github.com/traversable/schema/pull/155) [`7cf3f91`](https://github.com/traversable/schema/commit/7cf3f91794aa61d9de21775db93743ff30fb5904) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ## new features

  This PR adds the following new sub-combinators, all fuzz-tested & 100% covered:
  1. `t.integer`
  - `t.integer.min`
  - `t.integer.max`
  - `t.integer.lt`
  - `t.integer.gt`
  - `t.integer.btwn`
  2. `t.number`
  - `t.number.min`
  - `t.number.max`
  - `t.number.lt`
  - `t.number.gt`
  - `t.number.btwn`
  3. `t.bigint`
  - `t.bigint.min`
  - `t.bigint.max`
  - `t.bigint.lt`
  - `t.bigint.gt`
  - `t.bigint.btwn`
  4. `t.string`
  - `t.string.min`
  - `t.string.max`
  - `t.string.btwn`
  5. `t.array`
  - `t.array.min`
  - `t.array.max`
  - `t.array.btwn`

  ## todos
  - [ ] Add sub-combinators to `t.readonlyArray`
  - [ ] Update `@traversable/schema-to-json-schema` package to reflect these constraints when added to a schema
  - [ ] Update `@traversable/derive-validators` package to reflect these constraints when added to a schema

## 0.0.19

### Patch Changes

- [#149](https://github.com/traversable/schema/pull/149) [`7f745f2`](https://github.com/traversable/schema/commit/7f745f209d72ed276fd6ced4301117512bfb7710) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - examples(lib): adds extensibility example showing how library authors can use traversable core to build their own schema library

- [#149](https://github.com/traversable/schema/pull/149) [`38b1e05`](https://github.com/traversable/schema/commit/38b1e052ac576695fcc13baba037ee07564fdb12) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(codec, validators, json-schema, schema-to-string): fixes overwriting defs bug when extending core schemas

## 0.0.18

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

## 0.0.17

### Patch Changes

- [#130](https://github.com/traversable/schema/pull/130) [`fc8437d`](https://github.com/traversable/schema/commit/fc8437d1108cce9b0aa51db3b81e3c980ff441e9) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - chore(validators): cleanup

- [#135](https://github.com/traversable/schema/pull/135) [`04ca730`](https://github.com/traversable/schema/commit/04ca73090eea9c0ce6d687982914ec19d61b3e66) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - refactor(schema): refactors core `schema` package to remove 2 layers of abstraction + removes 3 modules :tada:

- [#137](https://github.com/traversable/schema/pull/137) [`43c3fbb`](https://github.com/traversable/schema/commit/43c3fbb359bbf442f3b88437eb72591389dcd9da) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs: adds inferred type predicates example to readme

- [#135](https://github.com/traversable/schema/pull/135) [`b26076f`](https://github.com/traversable/schema/commit/b26076fe1a9e3da217a9c053272357927cd14615) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - breaking(schema): renames `t.inline` to `t.of`

## 0.0.16

### Patch Changes

- [#123](https://github.com/traversable/schema/pull/123) [`c6d3325`](https://github.com/traversable/schema/commit/c6d3325d0f9b9ae91d3a3ab3fa3f5353cf195655) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(validator): adds `Validator.fromSchemaWithOptions`

- [#128](https://github.com/traversable/schema/pull/128) [`53f6727`](https://github.com/traversable/schema/commit/53f6727e95b810187794f10b344b2f6ff7a40978) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs: documents `.validate` method

- [#123](https://github.com/traversable/schema/pull/123) [`7ae381e`](https://github.com/traversable/schema/commit/7ae381eb6bca21053047c518c9c4ed3e64a5f5c1) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(validators): adds modular "validation" functions (works like z.safeParse)

## 0.0.15

### Patch Changes

- [#99](https://github.com/traversable/schema/pull/99) [`82ad3d0`](https://github.com/traversable/schema/commit/82ad3d07334f04e69074a312a7ecae9c39b88692) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - build(root): upgrades TS to v5.8.2; fixes `publishConfig` defaults for workspace generation

## 0.0.14

### Patch Changes

- [#81](https://github.com/traversable/schema/pull/81) [`8869f1d`](https://github.com/traversable/schema/commit/8869f1dcc3fc1ea8bb65ca83f025de03f036d333) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(schema): adds JSON schema as first-class target

## 0.0.13

### Patch Changes

- [#71](https://github.com/traversable/schema/pull/71) [`c5bb094`](https://github.com/traversable/schema/commit/c5bb09449640e32eb2f1c2a40be67fa161f77000) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(schema): simplify schema types

## 0.0.12

### Patch Changes

- [#67](https://github.com/traversable/schema/pull/67) [`3cfb05e`](https://github.com/traversable/schema/commit/3cfb05e186b61f816d3a7ae8c3f0884ff5aceab3) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(registry): moves nested files up a level so they're part of the build

## 0.0.11

### Patch Changes

- [#65](https://github.com/traversable/schema/pull/65) [`7865d59`](https://github.com/traversable/schema/commit/7865d5955f02e7ba16bfa44d331289ece88e1eb6) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - attempt to fix build

## 0.0.10

### Patch Changes

- [#63](https://github.com/traversable/schema/pull/63) [`904a3c9`](https://github.com/traversable/schema/commit/904a3c9d6bd87e573a60f37b8146f199d6994bdf) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix build

- [#61](https://github.com/traversable/schema/pull/61) [`96ec20f`](https://github.com/traversable/schema/commit/96ec20f2d6cff2cd369e095080201171247dc213) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(re-exports): hopefully

## 0.0.9

### Patch Changes

- [#59](https://github.com/traversable/schema/pull/59) [`18b24e3`](https://github.com/traversable/schema/commit/18b24e3649c48d176063cb004ca909488ded6528) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ### fixes
  - fix(schema): `t.eq(0)(-0) === false` is correct, but in tension with our goal of zod parity (#58)

  This bug was [caught in CI](https://github.com/traversable/schema/actions/runs/13773472926) by [fast-check](https://github.com/dubzzz/fast-check)

  Personally, I think treating `0` and `-0` as distinct cases is more correct, but having this be
  the default behavior is in tension with our goal of zod parity / the interop story.

  To fix this, with this PR we've decided to invert control completely, by making 2 changes:
  1. Going forward, `t.eq` is "B.Y.O.Eq" -- you can choose to roll your own, or pick one off the shelf

  If you're not sure which to use, all of the ones provided by the `@traversable/registry#Equal` module
  are thoroughly tested (also using `fast-check`, serious props to @dubzzz for this gem of a library) to
  ensure compliance with the [TC-39 spec](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isstrictlyequal). 2. Users can set their preferred "equals" implementation on a schema-by-schema basis, by passing a second
  argument to `t.eq`, or globally using `configure` from `@traversable/schema-core`.

  ### breaking changes

  Since this PR changes which function `t.eq` uses [by default](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isstrictlyequal) to determine equality, this change is breaking.

  Since we're pre-1.0, the breaking change is not be reflected in the version bump.

## 0.0.8

### Patch Changes

- [#52](https://github.com/traversable/schema/pull/52) [`a76de78`](https://github.com/traversable/schema/commit/a76de789d85182281bea1f36eac284068f2920d9) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(schema): composes features from dependencies in `@traversable/schema`

- [#51](https://github.com/traversable/schema/pull/51) [`b7132bb`](https://github.com/traversable/schema/commit/b7132bb14ce51b305259bb9c44d7cc9fd57d55f4) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ## new features

  ### `@traversable/schema`

  This PR adds a new method to all schemas, `toString`.

  The method works at both the term- and type-level.

  Tests for this feature involve generating 1000s of random schemas,
  writing them to disc, then writing their stringified types to disc, and
  running `tsc` against them both to make sure they're aligned.

- [#49](https://github.com/traversable/schema/pull/49) [`67870c7`](https://github.com/traversable/schema/commit/67870c7f889d9a8c69b87ffa8f3ea32edda4e2a8) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(validators): move all schemas with `.validate` methods to the `v` namespace for convenience

- [#46](https://github.com/traversable/schema/pull/46) [`4d278c5`](https://github.com/traversable/schema/commit/4d278c5f2e5810f221570a0b062de085a6ec1a12) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(json-schema): adds native support for JSON schema

## 0.0.7

### Patch Changes

- [#40](https://github.com/traversable/schema/pull/40) [`b653ec4`](https://github.com/traversable/schema/commit/b653ec4b3f363793f31a46fe84dc30b60f99388a) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - init(sandbox): creates `examples/` folder for creating examples and testing builds

## 0.0.6

### Patch Changes

- [#39](https://github.com/traversable/schema/pull/39) [`fdccb94`](https://github.com/traversable/schema/commit/fdccb94b0bb4e407aabd90936ac426194c062d65) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(registry): adds `Comparator` interface (the function you pass to `Array.prototype.sort`, for example)

## 0.0.5

### Patch Changes

- [#22](https://github.com/traversable/schema/pull/22) [`722ccab`](https://github.com/traversable/schema/commit/722ccab08e842e2fb72dc68c69deae850ff07edb) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(json,registry): adds caching + cycle detection to `Json.mapWithIndex` and `Json.foldWithIndex`

## 0.0.4

### Patch Changes

- [#20](https://github.com/traversable/schema/pull/20) [`effe9f8`](https://github.com/traversable/schema/commit/effe9f845fae6bf7240701bb8997eaa1cd7720cb) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - build(all): updates publishConfig to point to npm registry for all packages

- [#20](https://github.com/traversable/schema/pull/20) [`effe9f8`](https://github.com/traversable/schema/commit/effe9f845fae6bf7240701bb8997eaa1cd7720cb) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - removes npmrc file to trigger re-publish

- [#20](https://github.com/traversable/schema/pull/20) [`effe9f8`](https://github.com/traversable/schema/commit/effe9f845fae6bf7240701bb8997eaa1cd7720cb) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - build(root): point npm config at npm registry

## 0.0.4

### Patch Changes

- [#18](https://github.com/traversable/schema/pull/18) [`5546948`](https://github.com/traversable/schema/commit/55469480538cd65006f412fff76765f14599b2fd) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - build(all): updates publishConfig to point to npm registry for all packages

- [#18](https://github.com/traversable/schema/pull/18) [`5546948`](https://github.com/traversable/schema/commit/55469480538cd65006f412fff76765f14599b2fd) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - build(root): point npm config at npm registry

## 0.0.3

### Patch Changes

- [#16](https://github.com/traversable/schema/pull/16) [`7e7bf6a`](https://github.com/traversable/schema/commit/7e7bf6a9a16a7e8b2958e0c1ca270a9c5df73047) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - build(all): updates publishConfig to point to npm registry for all packages

- [#16](https://github.com/traversable/schema/pull/16) [`7e7bf6a`](https://github.com/traversable/schema/commit/7e7bf6a9a16a7e8b2958e0c1ca270a9c5df73047) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - build(root): point npm config at npm registry

## 0.0.2

### Patch Changes

- [#14](https://github.com/traversable/schema/pull/14) [`5bf4a01`](https://github.com/traversable/schema/commit/5bf4a01f76b76a1d1b290db3d5825f3c89cd2f4a) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - build(all): updates publishConfig to point to npm registry for all packages

## 0.0.1

### Patch Changes

- [#6](https://github.com/traversable/schema/pull/6) [`951abe1`](https://github.com/traversable/schema/commit/951abe1ec8024e76fcc84723f982db916ecf83f9) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ### new features

  Added for interop with JSON Schema's `const` keyword. Adapter to/from zod should be working, but still
  experimental as I haven't written property tests for it yet.

  When adapting to/from zod, the passed value is converted into a zod schema. For example:

  ```typescript
  t.object({ root: t.eq({ a: 1, b: [2, 3] }) });
  ```

  becomes:

  ```typescript
  z.object({
    root: z.object({
      a: z.literal(1),
      b: z.tuple([z.literal(2), z.literal(3)]),
    }),
  });
  ```

  Example usage:

  ```typescript
  import { t } from "@traversable/schema";

  const isZero = t.eq(0);
  //     ^? const isZero: t.eq<0>

  console.log(isZero(0)); // true
  console.log(isZero([1, 2, 3])); // false

  const isJanet = t.eq({ firstName: "Janet" });
  //     ^? const isJanet: t.eq<{ firstName: 'Janet' }>

  console.log(isJanet({ firstName: "Bill" })); // => false
  console.log(isJanet({ firstName: "Janet" })); // => true
  console.log(isJanet([1, 2, 3])); // => false
  ```

- [#4](https://github.com/traversable/schema/pull/4) [`0955462`](https://github.com/traversable/schema/commit/095546256004bd978cbb29c28fc506fa9ea43666) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat: adds package `schema-zod-adapter`
