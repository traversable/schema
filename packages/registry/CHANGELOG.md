# @traversable/registry

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
  ensure compliance with the [TC-39 spec](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isstrictlyequal).

  2. Users can set their preferred "equals" implementation on a schema-by-schema basis, by passing a second
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
