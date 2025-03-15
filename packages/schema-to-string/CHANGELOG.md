# @traversable/schema-to-string

## 0.0.9

### Patch Changes

- [#99](https://github.com/traversable/schema/pull/99) [`82ad3d0`](https://github.com/traversable/schema/commit/82ad3d07334f04e69074a312a7ecae9c39b88692) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - build(root): upgrades TS to v5.8.2; fixes `publishConfig` defaults for workspace generation

- [#102](https://github.com/traversable/schema/pull/102) [`76c30db`](https://github.com/traversable/schema/commit/76c30dba94b84e25ff8157f7e86b28c35572a66c) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(schema-to-string): adds sideEffects field to package.json

- Updated dependencies [[`82ad3d0`](https://github.com/traversable/schema/commit/82ad3d07334f04e69074a312a7ecae9c39b88692)]:
  - @traversable/schema-seed@0.0.11
  - @traversable/registry@0.0.15
  - @traversable/schema@0.0.22

## 0.0.8

### Patch Changes

- Updated dependencies [[`9a31cda`](https://github.com/traversable/schema/commit/9a31cda9d3570fbece496cc03c6e0dd40ab44715), [`bf8e818`](https://github.com/traversable/schema/commit/bf8e8184d0c843f2d23c9134606d1d2993857066), [`d38ec17`](https://github.com/traversable/schema/commit/d38ec17e8e9cf15369910f10dcc65ec7cfc3db8c)]:
  - @traversable/schema@0.0.21

## 0.0.7

### Patch Changes

- Updated dependencies [[`8869f1d`](https://github.com/traversable/schema/commit/8869f1dcc3fc1ea8bb65ca83f025de03f036d333)]:
  - @traversable/registry@0.0.14
  - @traversable/schema-core@0.0.15
  - @traversable/schema-seed@0.0.10

## 0.0.6

### Patch Changes

- [#71](https://github.com/traversable/schema/pull/71) [`c5bb094`](https://github.com/traversable/schema/commit/c5bb09449640e32eb2f1c2a40be67fa161f77000) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(schema): simplify schema types

- Updated dependencies [[`c5bb094`](https://github.com/traversable/schema/commit/c5bb09449640e32eb2f1c2a40be67fa161f77000)]:
  - @traversable/registry@0.0.13
  - @traversable/schema-core@0.0.14
  - @traversable/schema-seed@0.0.9

## 0.0.5

### Patch Changes

- [#67](https://github.com/traversable/schema/pull/67) [`3cfb05e`](https://github.com/traversable/schema/commit/3cfb05e186b61f816d3a7ae8c3f0884ff5aceab3) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(registry): moves nested files up a level so they're part of the build

- Updated dependencies [[`3cfb05e`](https://github.com/traversable/schema/commit/3cfb05e186b61f816d3a7ae8c3f0884ff5aceab3)]:
  - @traversable/registry@0.0.12
  - @traversable/schema-core@0.0.13
  - @traversable/schema-seed@0.0.8

## 0.0.4

### Patch Changes

- [#65](https://github.com/traversable/schema/pull/65) [`7865d59`](https://github.com/traversable/schema/commit/7865d5955f02e7ba16bfa44d331289ece88e1eb6) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - attempt to fix build

- Updated dependencies [[`7865d59`](https://github.com/traversable/schema/commit/7865d5955f02e7ba16bfa44d331289ece88e1eb6)]:
  - @traversable/schema-seed@0.0.7
  - @traversable/registry@0.0.11
  - @traversable/schema-core@0.0.12

## 0.0.3

### Patch Changes

- [#63](https://github.com/traversable/schema/pull/63) [`904a3c9`](https://github.com/traversable/schema/commit/904a3c9d6bd87e573a60f37b8146f199d6994bdf) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix build

- Updated dependencies [[`904a3c9`](https://github.com/traversable/schema/commit/904a3c9d6bd87e573a60f37b8146f199d6994bdf), [`96ec20f`](https://github.com/traversable/schema/commit/96ec20f2d6cff2cd369e095080201171247dc213)]:
  - @traversable/registry@0.0.10
  - @traversable/schema-core@0.0.11
  - @traversable/schema-seed@0.0.6

## 0.0.2

### Patch Changes

- Updated dependencies [[`18b24e3`](https://github.com/traversable/schema/commit/18b24e3649c48d176063cb004ca909488ded6528)]:
  - @traversable/schema-core@0.0.10
  - @traversable/registry@0.0.9
  - @traversable/schema-seed@0.0.5

## 0.0.1

### Patch Changes

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

- Updated dependencies [[`a76de78`](https://github.com/traversable/schema/commit/a76de789d85182281bea1f36eac284068f2920d9), [`b7132bb`](https://github.com/traversable/schema/commit/b7132bb14ce51b305259bb9c44d7cc9fd57d55f4), [`34783db`](https://github.com/traversable/schema/commit/34783db67cb2ab0707d0e938613dc3b2d2221cb2), [`67870c7`](https://github.com/traversable/schema/commit/67870c7f889d9a8c69b87ffa8f3ea32edda4e2a8), [`4d278c5`](https://github.com/traversable/schema/commit/4d278c5f2e5810f221570a0b062de085a6ec1a12)]:
  - @traversable/registry@0.0.8
  - @traversable/schema-core@0.0.9
  - @traversable/schema-seed@0.0.4
