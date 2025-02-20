# @traversable/schema-zod-adapter

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

- [#8](https://github.com/traversable/schema/pull/8) [`b95cfef`](https://github.com/traversable/schema/commit/b95cfef422bad84a72166bd7927ca56730a15d34) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - chore(schema,zod): prep work for breaking out `schema-core`

- [#4](https://github.com/traversable/schema/pull/4) [`0955462`](https://github.com/traversable/schema/commit/095546256004bd978cbb29c28fc506fa9ea43666) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat: adds package `schema-zod-adapter`

- Updated dependencies [[`951abe1`](https://github.com/traversable/schema/commit/951abe1ec8024e76fcc84723f982db916ecf83f9), [`0955462`](https://github.com/traversable/schema/commit/095546256004bd978cbb29c28fc506fa9ea43666)]:
  - @traversable/registry@0.0.1
