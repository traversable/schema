# @traversable/schema-seed

## 0.0.28

### Patch Changes

- Updated dependencies [[`46b53cb`](https://github.com/traversable/schema/commit/46b53cb0c198554638c2cf146eda139c5313c574)]:
  - @traversable/registry@0.0.29
  - @traversable/schema@0.0.40
  - @traversable/json@0.0.30

## 0.0.27

### Patch Changes

- Updated dependencies [[`4f4ae3a`](https://github.com/traversable/schema/commit/4f4ae3a7f3e97071f40a544135bcaa9d65d7ecf9)]:
  - @traversable/registry@0.0.28
  - @traversable/json@0.0.29
  - @traversable/schema@0.0.39

## 0.0.26

### Patch Changes

- Updated dependencies [[`97b8829`](https://github.com/traversable/schema/commit/97b88298f4efeabac549d81c47f3c174473cac84), [`b1c2039`](https://github.com/traversable/schema/commit/b1c20395bf548ea0ac00f6025824d077c61e4ea9)]:
  - @traversable/registry@0.0.27
  - @traversable/schema@0.0.38
  - @traversable/json@0.0.28

## 0.0.25

### Patch Changes

- [#199](https://github.com/traversable/schema/pull/199) [`70dd4bb`](https://github.com/traversable/schema/commit/70dd4bb74817923fe18cef4e9fab350d72868f05) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ## new features
  - zod: random schema generator + reproducibly valid/invalid data generators for zod v4 schemas

- [#199](https://github.com/traversable/schema/pull/199) [`4cb8664`](https://github.com/traversable/schema/commit/4cb8664e9a926c68cdbf683c0d46c5680d1a3051) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds `@traversable/zod` package

- Updated dependencies [[`70dd4bb`](https://github.com/traversable/schema/commit/70dd4bb74817923fe18cef4e9fab350d72868f05), [`4cb8664`](https://github.com/traversable/schema/commit/4cb8664e9a926c68cdbf683c0d46c5680d1a3051)]:
  - @traversable/registry@0.0.26
  - @traversable/schema@0.0.37
  - @traversable/json@0.0.27

## 0.0.24

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

- Updated dependencies [[`8b8522b`](https://github.com/traversable/schema/commit/8b8522bb2ed60114c346c56c47e66763d5d857a1), [`172cf4e`](https://github.com/traversable/schema/commit/172cf4e014ad804d2ee409477c784f4806421b15), [`437011d`](https://github.com/traversable/schema/commit/437011d35e7a7b7532b6b613d76f255f9447c4c2), [`3b4d92d`](https://github.com/traversable/schema/commit/3b4d92d0c7e5e9ec2734fdcf5cff051abd7846ff), [`6a19161`](https://github.com/traversable/schema/commit/6a191613f903f02be7808bb79c8a2d3aae53d110), [`0a0d544`](https://github.com/traversable/schema/commit/0a0d544161b71a6e4d292c34aaca4806449058d6)]:
  - @traversable/schema@0.0.36
  - @traversable/registry@0.0.25
  - @traversable/json@0.0.26

## 0.0.23

### Patch Changes

- [#190](https://github.com/traversable/schema/pull/190) [`9685551`](https://github.com/traversable/schema/commit/9685551af3fe52896b6551721b19bfc941deba9b) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ## refactor

  This change implements a faux-prototype pattern to simplify `.toJsonSchema` conversion.
  It's possible this pattern can be used to programmatically extend traversable schemas.

- [#190](https://github.com/traversable/schema/pull/190) [`70cf947`](https://github.com/traversable/schema/commit/70cf947c8c33a9f64a76e3428467d4e9b121be78) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ## refactor

  This change moves over to using "faux-prototypes" to extend schemas.

  This ends up being much simpler to implement in userland, and it also rules
  out certain edge cases that come from trying to compose schema definitions together.

- Updated dependencies [[`9685551`](https://github.com/traversable/schema/commit/9685551af3fe52896b6551721b19bfc941deba9b), [`fa0fd7a`](https://github.com/traversable/schema/commit/fa0fd7ae692c043346959effe3a3413e27e7a440), [`70cf947`](https://github.com/traversable/schema/commit/70cf947c8c33a9f64a76e3428467d4e9b121be78), [`93786a9`](https://github.com/traversable/schema/commit/93786a9f323ee5b30172e9339070d1617099aa2b)]:
  - @traversable/schema@0.0.35
  - @traversable/registry@0.0.24
  - @traversable/json@0.0.25

## 0.0.22

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
  - @traversable/json@0.0.24

## 0.0.21

### Patch Changes

- Updated dependencies [[`c4dd024`](https://github.com/traversable/schema/commit/c4dd02409f0068b392aacde424f0829def157af8)]:
  - @traversable/registry@0.0.22
  - @traversable/schema@0.0.33
  - @traversable/json@0.0.23

## 0.0.20

### Patch Changes

- [#180](https://github.com/traversable/schema/pull/180) [`759ea4d`](https://github.com/traversable/schema/commit/759ea4d60a10bf2cd7bd7bd84bc4c10fa856ef9f) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(seed): support `.include` and `.exclude` for nullary schemas when generating random schemas

## 0.0.19

### Patch Changes

- Updated dependencies [[`5492d1a`](https://github.com/traversable/schema/commit/5492d1adddece353ece6447fdf3c9c5edc7a99af)]:
  - @traversable/schema@0.0.32

## 0.0.18

### Patch Changes

- [#165](https://github.com/traversable/schema/pull/165) [`ba7c8a7`](https://github.com/traversable/schema/commit/ba7c8a73e6b080a5b5047171b33bd2d52857367e) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - removes `@traversable/schema-core` and `@traversable/schema-codec` workspaces

- Updated dependencies [[`fcbfd2d`](https://github.com/traversable/schema/commit/fcbfd2d38157370f39e40f82cda36901ebeb7cb4), [`9ddb68e`](https://github.com/traversable/schema/commit/9ddb68e6140b22837cede208575ee6b7ee4a076d), [`ba7c8a7`](https://github.com/traversable/schema/commit/ba7c8a73e6b080a5b5047171b33bd2d52857367e)]:
  - @traversable/schema@0.0.31
  - @traversable/registry@0.0.21
  - @traversable/json@0.0.22

## 0.0.17

### Patch Changes

- Updated dependencies [[`7cf3f91`](https://github.com/traversable/schema/commit/7cf3f91794aa61d9de21775db93743ff30fb5904)]:
  - @traversable/registry@0.0.20
  - @traversable/json@0.0.21
  - @traversable/schema-core@0.0.22

## 0.0.16

### Patch Changes

- Updated dependencies [[`7f745f2`](https://github.com/traversable/schema/commit/7f745f209d72ed276fd6ced4301117512bfb7710), [`38b1e05`](https://github.com/traversable/schema/commit/38b1e052ac576695fcc13baba037ee07564fdb12)]:
  - @traversable/registry@0.0.19
  - @traversable/json@0.0.20
  - @traversable/schema-core@0.0.21

## 0.0.15

### Patch Changes

- Updated dependencies [[`b99baa8`](https://github.com/traversable/schema/commit/b99baa8ccbbb5202dfd461883644dfedfeff235d)]:
  - @traversable/registry@0.0.18
  - @traversable/json@0.0.19
  - @traversable/schema-core@0.0.20

## 0.0.14

### Patch Changes

- [#137](https://github.com/traversable/schema/pull/137) [`43c3fbb`](https://github.com/traversable/schema/commit/43c3fbb359bbf442f3b88437eb72591389dcd9da) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs: adds inferred type predicates example to readme

- Updated dependencies [[`fc8437d`](https://github.com/traversable/schema/commit/fc8437d1108cce9b0aa51db3b81e3c980ff441e9), [`04ca730`](https://github.com/traversable/schema/commit/04ca73090eea9c0ce6d687982914ec19d61b3e66), [`43c3fbb`](https://github.com/traversable/schema/commit/43c3fbb359bbf442f3b88437eb72591389dcd9da), [`b26076f`](https://github.com/traversable/schema/commit/b26076fe1a9e3da217a9c053272357927cd14615)]:
  - @traversable/registry@0.0.17
  - @traversable/json@0.0.18
  - @traversable/schema-core@0.0.19

## 0.0.13

### Patch Changes

- Updated dependencies [[`c6d3325`](https://github.com/traversable/schema/commit/c6d3325d0f9b9ae91d3a3ab3fa3f5353cf195655), [`53f6727`](https://github.com/traversable/schema/commit/53f6727e95b810187794f10b344b2f6ff7a40978), [`7ae381e`](https://github.com/traversable/schema/commit/7ae381eb6bca21053047c518c9c4ed3e64a5f5c1)]:
  - @traversable/registry@0.0.16
  - @traversable/json@0.0.17
  - @traversable/schema-core@0.0.18

## 0.0.12

### Patch Changes

- Updated dependencies [[`3f6ddf7`](https://github.com/traversable/schema/commit/3f6ddf7c0dc95649915a6bc83a0e82b74553f2d5), [`bdfee56`](https://github.com/traversable/schema/commit/bdfee56a06c57db91f55ec149b4a9390790b882f)]:
  - @traversable/schema-core@0.0.17

## 0.0.11

### Patch Changes

- [#99](https://github.com/traversable/schema/pull/99) [`82ad3d0`](https://github.com/traversable/schema/commit/82ad3d07334f04e69074a312a7ecae9c39b88692) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - build(root): upgrades TS to v5.8.2; fixes `publishConfig` defaults for workspace generation

- Updated dependencies [[`82ad3d0`](https://github.com/traversable/schema/commit/82ad3d07334f04e69074a312a7ecae9c39b88692)]:
  - @traversable/schema-core@0.0.16
  - @traversable/registry@0.0.15
  - @traversable/json@0.0.16

## 0.0.10

### Patch Changes

- Updated dependencies [[`8869f1d`](https://github.com/traversable/schema/commit/8869f1dcc3fc1ea8bb65ca83f025de03f036d333)]:
  - @traversable/registry@0.0.14
  - @traversable/json@0.0.15
  - @traversable/schema-core@0.0.15

## 0.0.9

### Patch Changes

- [#71](https://github.com/traversable/schema/pull/71) [`c5bb094`](https://github.com/traversable/schema/commit/c5bb09449640e32eb2f1c2a40be67fa161f77000) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(schema): simplify schema types

- Updated dependencies [[`c5bb094`](https://github.com/traversable/schema/commit/c5bb09449640e32eb2f1c2a40be67fa161f77000)]:
  - @traversable/json@0.0.14
  - @traversable/registry@0.0.13
  - @traversable/schema-core@0.0.14

## 0.0.8

### Patch Changes

- [#67](https://github.com/traversable/schema/pull/67) [`3cfb05e`](https://github.com/traversable/schema/commit/3cfb05e186b61f816d3a7ae8c3f0884ff5aceab3) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(registry): moves nested files up a level so they're part of the build

- Updated dependencies [[`3cfb05e`](https://github.com/traversable/schema/commit/3cfb05e186b61f816d3a7ae8c3f0884ff5aceab3)]:
  - @traversable/registry@0.0.12
  - @traversable/json@0.0.13
  - @traversable/schema-core@0.0.13

## 0.0.7

### Patch Changes

- [#65](https://github.com/traversable/schema/pull/65) [`7865d59`](https://github.com/traversable/schema/commit/7865d5955f02e7ba16bfa44d331289ece88e1eb6) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - attempt to fix build

- Updated dependencies [[`7865d59`](https://github.com/traversable/schema/commit/7865d5955f02e7ba16bfa44d331289ece88e1eb6)]:
  - @traversable/json@0.0.12
  - @traversable/registry@0.0.11
  - @traversable/schema-core@0.0.12

## 0.0.6

### Patch Changes

- [#63](https://github.com/traversable/schema/pull/63) [`904a3c9`](https://github.com/traversable/schema/commit/904a3c9d6bd87e573a60f37b8146f199d6994bdf) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix build

- Updated dependencies [[`904a3c9`](https://github.com/traversable/schema/commit/904a3c9d6bd87e573a60f37b8146f199d6994bdf), [`96ec20f`](https://github.com/traversable/schema/commit/96ec20f2d6cff2cd369e095080201171247dc213)]:
  - @traversable/json@0.0.11
  - @traversable/registry@0.0.10
  - @traversable/schema-core@0.0.11

## 0.0.5

### Patch Changes

- Updated dependencies [[`18b24e3`](https://github.com/traversable/schema/commit/18b24e3649c48d176063cb004ca909488ded6528)]:
  - @traversable/schema-core@0.0.10
  - @traversable/registry@0.0.9
  - @traversable/json@0.0.10

## 0.0.4

### Patch Changes

- [#51](https://github.com/traversable/schema/pull/51) [`b7132bb`](https://github.com/traversable/schema/commit/b7132bb14ce51b305259bb9c44d7cc9fd57d55f4) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ## new features

  ### `@traversable/schema`

  This PR adds a new method to all schemas, `toString`.

  The method works at both the term- and type-level.

  Tests for this feature involve generating 1000s of random schemas,
  writing them to disc, then writing their stringified types to disc, and
  running `tsc` against them both to make sure they're aligned.

- [#54](https://github.com/traversable/schema/pull/54) [`34783db`](https://github.com/traversable/schema/commit/34783db67cb2ab0707d0e938613dc3b2d2221cb2) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - init(toString): initializes schema-to-string package

  ## new packages

  This PR separates the `toString` functionality into its own dedicated package. This is to make sure that functionality that
  is separate today, continues to remain separate.

  ### usage

  Consumers of the `@traversable/schema` package don't need to do anything to continue using this feature: it is installed and
  activated for you automatically.

  ### tests

  This PR also adds type-level and term-level stress tests to make sure this feature continues to remain robust.

  If you'd like to see how extensively this feature is tested, here are a **few examples** that showcase the _depth_ and _breadth_ we're
  able to support:
  - https://github.com/traversable/schema/pull/54/files#diff-8079b351faa9086c2497e9abaea8fd97333cfc57828e4acbed94b7464e869dc4R914-R1267
  - https://github.com/traversable/schema/pull/54/files#diff-8079b351faa9086c2497e9abaea8fd97333cfc57828e4acbed94b7464e869dc4R420-R665

  ### performance

  Performance is great. Really great, in fact.

  In my initial benchmarks testing a `15x15` schema (an object schema with 255 properties: 15 levels deep, 15 levels "wide"), IDE performance
  is _better than `zod`_.

  This is possible because the `toString` implementation _isn't recursive_: all it does is build up a string _at the time of declaration_.

  Say you have a schema like this:

  ```typescript
  import { t } from "@traversable/schema";

  const MySchema = t.string;
  //    ^? const MySchema: t.string
  const MyString = MySchema.toString();
  //    ^? const MySchema: "'string'"
  ```

  We don't need to recurse, because this schema doesn't have any children.

  Now let's promote this schema to be an object:

  ```typescript
  import { t } from "@traversable/schema";

  const MySchema = t.object({ abc: t.string });
  //    ^? const MySchema: t.object<{ abc: t.string }>
  const MyString = MySchema.toString();
  //    ^? const MySchema: "'{ abc: string }"
  ```

  Here, we still didn't need to perform any recursion. `t.object` constructor simply concatenates the strings of each of its children,
  joins the string, and wraps it with `{` and `}`.

  Compare this with `Zod`:

  ```typescript
  import { z } from "zod";

  const MySchema = z.object({ abc: t.string });
  //    ^? const MySchema: z.ZodObject<{ abc: z.ZodString; }, "strip", z.ZodTypeAny, { abc: string; }, { abc: string; }>
  ```

  To accomplish the same thing, zod uses **5 type parameters**.

  Legibility concerns aside, here, the fact that `zod` is leaking implementation details is actually _helpful_,
  because it exposes the underlying problem.

  How many times does the `abc` property appear in the type?

  **Three times**.

  That means that for every property you define using zod, you're actually defining 3 properties.

  Imagine using `zod` to define a `15x15` schema: **instead of `255` properties, your schema effectively has `765`**.

  Keep in mind that when it comes to IDE performance / DX, you can throw Big(O) notation out the window:

  > In userland, when a feature is slow enough that its sluggishness is perceptible, the difference between 1n and 3n makes all the difference.

  **Note:**

  Upon more thorough testing, the zod issue is _even worse than I thought_.

  The when I defined the same `15x15` schema using zod, the type signature was **over 5000 lines long** when formatted with `prettier`, clocking in at **over 40kb**.

  But those numbers don't really mean anything without a point of reference.

  What we need to do is compare the size of zod's type, with the size of the target type.

  Here are the results, copied directly from the [benchmark]

  #### benchmark

  Rather than comparing `traversable` and `zod` directly, which is subject to
  selection bias, we're going to compare the schema types to TypeScript itself.

  That way we have a baseline, and we can more accurately see how the schemas
  scale as the size of their input grows.

  To keep me honest, I formatted everything using prettier.

  Every part of this benchmark is public and available [here](https://github.com/traversable/schema/blob/7f25fe276d1d8ca5769035087ac283137b60cec6/packages/schema-to-string/test/zod-side-by-side.test.ts).

  Here's the definition of the
  [Target type](https://github.com/traversable/schema/blob/7f25fe276d1d8ca5769035087ac283137b60cec6/packages/schema-to-string/test/zod-side-by-side.test.ts#L21-L314),
  if you're curious.

  ```typescript
  /**
   * ### Target type
   *
   * |         Metric          |     Value     |
   * |-------------------------|---------------|
   * | span                    |       L21-314 |
   * | line count              |           293 |
   * | formatter               |      prettier |
   * |-------------------------|---------------|
   */
  ```

  Okay, our target type is pretty large -- almost 300 lines long, and 15 levels deep (the max that TypeScript allows).

  Let's see how `zod` did.

  Here's the type of the
  [`zod` schema](https://github.com/traversable/schema/blob/7f25fe276d1d8ca5769035087ac283137b60cec6/packages/schema-to-string/test/zod-side-by-side.test.ts#L1696-L6347), if you're curious.

  ```typescript
  /**
   * ### zod schema
   *
   * |         Metric          |     Value     |
   * |-------------------------|---------------|
   * | span                    |    L1696-6349 |
   * | line count              |          4653 |
   * | formatter               |      prettier |
   * | size compared to target |      1488.05% |
   * |-------------------------|---------------|
   */
  ```

  Phew. That was bigger than I expected. The size in kilobytes was similar -- Zod's schema was well over 1000% larger than the target (40kb _minified_).

  Let's see how the `traversable` library compares. Here's the type of the
  [`traversable` schema](https://github.com/traversable/schema/blob/7f25fe276d1d8ca5769035087ac283137b60cec6/packages/schema-to-string/test/zod-side-by-side.test.ts#L1226-L1670),
  if you're curious.

  ```typescript
  /**
   * ### traversable schema
   *
   * |    Metric               |    Value    |
   * |-------------------------|-------------|
   * | span                    |  L1226-1671 |
   * | line count              |         445 |
   * | formatter               |    prettier |
   * | size compared to target |      51.87% |
   * |-------------------------|-------------|
   */
  ```

  That's not bad.

  ##### summary
  - **traversable**

    Roughly, a traversable schema comes with a **50% overhead**

    That means that if our TypeScript type is 100 lines long, we can expect the traversable
    schema to consume around 150 lines behind the scenes

    Now let's compare that against zod.

  - **zod**

    Roughly, a zod schema comes with almost a **1500% overhead**

    That means that if our TypeScript type is 100 lines long, we can expect the zod
    schema to consume almost 1500 lines behind the scenes.

  No matter how I slice this data, the comparison is pretty dramatic. Benchmarks are tricky
  things, and there's no perfect way to measure IDE performance.

  But it is reassuring to have _something_ concrete I can point at. Before this, all I had
  were _vibes_. Don't get me wrong, vibes are probably the most important part of DX, but
  they're hard to sell unless you're a marketing genius, which I most certainly am not.

  So even if those numbers aren't perfect, they give me enough confidence to make this
  statement:

  To the best of my knowledge, I can in good faith say that `traversable`, even with all
  the bells and whistles included, **outperforms zod by a factor of 30x**.

  `traversable` schemas are faster than `zod` schemas in other ways, too. They're also composable
  in ways that zod schemas can never be, and were built from the ground-up to leverage the tools
  we already have lying around -- to "use the platform", as it were.

  It took a lot of work to get here, and there's still a lot of work to be done, but that's where
  the `traversable` project stands today, compared to its largest competitor.

- [#49](https://github.com/traversable/schema/pull/49) [`67870c7`](https://github.com/traversable/schema/commit/67870c7f889d9a8c69b87ffa8f3ea32edda4e2a8) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(validators): move all schemas with `.validate` methods to the `v` namespace for convenience

- [#46](https://github.com/traversable/schema/pull/46) [`4d278c5`](https://github.com/traversable/schema/commit/4d278c5f2e5810f221570a0b062de085a6ec1a12) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(json-schema): adds native support for JSON schema

- Updated dependencies [[`a76de78`](https://github.com/traversable/schema/commit/a76de789d85182281bea1f36eac284068f2920d9), [`b7132bb`](https://github.com/traversable/schema/commit/b7132bb14ce51b305259bb9c44d7cc9fd57d55f4), [`34783db`](https://github.com/traversable/schema/commit/34783db67cb2ab0707d0e938613dc3b2d2221cb2), [`67870c7`](https://github.com/traversable/schema/commit/67870c7f889d9a8c69b87ffa8f3ea32edda4e2a8), [`4d278c5`](https://github.com/traversable/schema/commit/4d278c5f2e5810f221570a0b062de085a6ec1a12)]:
  - @traversable/registry@0.0.8
  - @traversable/schema-core@0.0.9
  - @traversable/json@0.0.9

## 0.0.3

### Patch Changes

- [#40](https://github.com/traversable/schema/pull/40) [`b653ec4`](https://github.com/traversable/schema/commit/b653ec4b3f363793f31a46fe84dc30b60f99388a) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - init(sandbox): creates `examples/` folder for creating examples and testing builds

- Updated dependencies [[`b653ec4`](https://github.com/traversable/schema/commit/b653ec4b3f363793f31a46fe84dc30b60f99388a)]:
  - @traversable/schema-core@0.0.8
  - @traversable/registry@0.0.7
  - @traversable/json@0.0.8

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
