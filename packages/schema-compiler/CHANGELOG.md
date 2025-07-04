# @traversable/schema-compiler

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
