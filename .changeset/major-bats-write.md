---
"@traversable/schema-compiler": patch
"@traversable/schema-seed": patch
"@traversable/registry": patch
"@traversable/schema": patch
---

### new packages

- adds new package `@traversable/schema-compiler`, which exports functions for
  generating optimized schemas (sometimes called "jit compiled" schemas)

  #### Example

  ```typescript
  import { t } from '@traversable/schema'
  import { Compiler } from '@traversable/schema-compiler'

  const UserSchema = t.object({
      firstName: t.string,
      lastName: t.optional(t.string),
      address: t.optional(
        t.object({
          street: t.tuple(t.string, t.optional(t.string)),
          postalCode: t.optional(t.string),
          state: t.enum('AK', 'AL', 'AZ', /* ... */),
        })
      )
    })


  /** use `Compiler.generate` to generate a validation function in string form: */
  console.log(Compiler.generate(UserSchema)) 
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
  const CompiledSchema = Compiler.compile(UserSchema)
  ```
