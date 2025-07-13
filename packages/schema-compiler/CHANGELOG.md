# @traversable/schema-compiler

## 0.0.6

### Patch Changes

- Updated dependencies [[`e84658f`](https://github.com/traversable/schema/commit/e84658f8db4ae2bd3272a8c29683e26f7786b2a9), [`7cd3af3`](https://github.com/traversable/schema/commit/7cd3af34d2cf6647be23a5bd4dd396128a1ef02b), [`c94246a`](https://github.com/traversable/schema/commit/c94246a7cca8455102c46767173c9b605a03b646), [`cc42ee3`](https://github.com/traversable/schema/commit/cc42ee3bd90b3ebbef74de48cdffa28f5fa07ff4), [`0f8a50a`](https://github.com/traversable/schema/commit/0f8a50a28918a3065e2bc1110ffe174b88a50052)]:
  - @traversable/registry@0.0.30
  - @traversable/schema@0.0.41
  - @traversable/json@0.0.31

## 0.0.5

### Patch Changes

- Updated dependencies [[`46b53cb`](https://github.com/traversable/schema/commit/46b53cb0c198554638c2cf146eda139c5313c574)]:
  - @traversable/registry@0.0.29
  - @traversable/schema@0.0.40
  - @traversable/json@0.0.30

## 0.0.4

### Patch Changes

- Updated dependencies [[`4f4ae3a`](https://github.com/traversable/schema/commit/4f4ae3a7f3e97071f40a544135bcaa9d65d7ecf9)]:
  - @traversable/registry@0.0.28
  - @traversable/json@0.0.29
  - @traversable/schema@0.0.39

## 0.0.3

### Patch Changes

- [#205](https://github.com/traversable/schema/pull/205) [`97b8829`](https://github.com/traversable/schema/commit/97b88298f4efeabac549d81c47f3c174473cac84) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): convert a zod schema to a blazing fast jit-compiled "deepEquals" function

- [#205](https://github.com/traversable/schema/pull/205) [`b1c2039`](https://github.com/traversable/schema/commit/b1c20395bf548ea0ac00f6025824d077c61e4ea9) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat: optimizes zx.equals.compile and zx.equals.writeable functions

- Updated dependencies [[`97b8829`](https://github.com/traversable/schema/commit/97b88298f4efeabac549d81c47f3c174473cac84), [`b1c2039`](https://github.com/traversable/schema/commit/b1c20395bf548ea0ac00f6025824d077c61e4ea9)]:
  - @traversable/registry@0.0.27
  - @traversable/schema@0.0.38
  - @traversable/json@0.0.28

## 0.0.2

### Patch Changes

- [#199](https://github.com/traversable/schema/pull/199) [`4cb8664`](https://github.com/traversable/schema/commit/4cb8664e9a926c68cdbf683c0d46c5680d1a3051) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds `@traversable/zod` package

- Updated dependencies [[`70dd4bb`](https://github.com/traversable/schema/commit/70dd4bb74817923fe18cef4e9fab350d72868f05), [`4cb8664`](https://github.com/traversable/schema/commit/4cb8664e9a926c68cdbf683c0d46c5680d1a3051)]:
  - @traversable/registry@0.0.26
  - @traversable/schema@0.0.37
  - @traversable/json@0.0.27

## 0.0.1

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

- Updated dependencies [[`8b8522b`](https://github.com/traversable/schema/commit/8b8522bb2ed60114c346c56c47e66763d5d857a1), [`172cf4e`](https://github.com/traversable/schema/commit/172cf4e014ad804d2ee409477c784f4806421b15), [`437011d`](https://github.com/traversable/schema/commit/437011d35e7a7b7532b6b613d76f255f9447c4c2), [`3b4d92d`](https://github.com/traversable/schema/commit/3b4d92d0c7e5e9ec2734fdcf5cff051abd7846ff), [`6a19161`](https://github.com/traversable/schema/commit/6a191613f903f02be7808bb79c8a2d3aae53d110), [`0a0d544`](https://github.com/traversable/schema/commit/0a0d544161b71a6e4d292c34aaca4806449058d6)]:
  - @traversable/schema@0.0.36
  - @traversable/registry@0.0.25
  - @traversable/json@0.0.26
