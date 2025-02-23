# @traversable/schema

## 0.0.3

### Patch Changes

- [#14](https://github.com/traversable/schema/pull/14) [`5bf4a01`](https://github.com/traversable/schema/commit/5bf4a01f76b76a1d1b290db3d5825f3c89cd2f4a) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - build(all): updates publishConfig to point to npm registry for all packages

- Updated dependencies [[`5bf4a01`](https://github.com/traversable/schema/commit/5bf4a01f76b76a1d1b290db3d5825f3c89cd2f4a)]:
  - @traversable/schema-core@0.0.2
  - @traversable/registry@0.0.2
  - @traversable/json@0.0.2

## 0.0.2

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

- [#10](https://github.com/traversable/schema/pull/10) [`30fa8da`](https://github.com/traversable/schema/commit/30fa8da4cfd0c3e786d793270cebb84920f877e1) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(schema): adds `Seed.fromSchema`

- [#8](https://github.com/traversable/schema/pull/8) [`b95cfef`](https://github.com/traversable/schema/commit/b95cfef422bad84a72166bd7927ca56730a15d34) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - chore(schema,zod): prep work for breaking out `schema-core`

- [#4](https://github.com/traversable/schema/pull/4) [`0955462`](https://github.com/traversable/schema/commit/095546256004bd978cbb29c28fc506fa9ea43666) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat: adds package `schema-zod-adapter`

- Updated dependencies [[`951abe1`](https://github.com/traversable/schema/commit/951abe1ec8024e76fcc84723f982db916ecf83f9), [`0955462`](https://github.com/traversable/schema/commit/095546256004bd978cbb29c28fc506fa9ea43666)]:
  - @traversable/registry@0.0.1
  - @traversable/json@0.0.1
  - @traversable/schema-core@0.0.1

## 0.0.1

### Patch Changes

- [#3](https://github.com/traversable/schema/pull/3) [`a35dfae`](https://github.com/traversable/schema/commit/a35dfae73d41ad65d2db4e86bd488a7c0561c7d3) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ✨(schema): implements `eq` combinator to support JSON schema `const` and `enum` nodes

- [#3](https://github.com/traversable/schema/pull/3) [`5219b21`](https://github.com/traversable/schema/commit/5219b21e96462d9fd8feca214cf41f9f7e974de8) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ✨(schema): adds support for setting configuration globally

- [#1](https://github.com/traversable/schema/pull/1) [`36970bb`](https://github.com/traversable/schema/commit/36970bbb99c4fff4abe082cca945ab6fba13a40e) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - [traversable/schema]: v0.0.1 release (POC)

- [#3](https://github.com/traversable/schema/pull/3) [`0aaee45`](https://github.com/traversable/schema/commit/0aaee4582ca8191a9050f360cd5407623796189c) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ✨(schema): adds `Json.Functor`, `Json.is`, `Json.toString`

- [#3](https://github.com/traversable/schema/pull/3) [`f8fd82f`](https://github.com/traversable/schema/commit/f8fd82f6dc118c777f800c4364165d9cb456baa4) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - 🐛(schema): fixes circular dependency, missing export
