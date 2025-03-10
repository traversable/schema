# `@traversable/schema`

A schema library that does a lot more, by doing strictly less.

This library exploits a TypeScript feature called 
[inferred type predicates](https://devblogs.microsoft.com/typescript/announcing-typescript-5-5/#inferred-type-predicates)
to do what libaries like `zod` do, natively.

> tl;dr: The schemas in `@traversable/schema` __aren't schemas__: they're 
> just functions that return true or false.

```typescript
import { t } from '@traversable/schema'

declare let ex_01: unknown

if (t.bigint(ex_01)) {
    ex_01
    // ^? const ex_01: bigint
}
```

Predicates, and functions that accept predicates, and return predicates:

```typescript
import { t } from '@traversable/schema'

declare let ex_01: unknown
if (t.object({ a: t.optional(t.number), b: t.union(t.boolean, t.null) })) {
    ex_01
    // ^? const ex_01: { a?: number, b: boolean | null }
}
```

Since TypeScript v5.5, type narrowing "flows through" inline predicates. So
you don't really need `zod` to get type narrowing to work in userland anymore.

That doesn't mean you don't need a schema library anymore, since a schema can
go places that TypeScript can't. Libraries like `react-hook-form` use the schema
you provide and adapt their behavior accordingly.

If you've ever used a library that does this, then you know how magical it feels.

Libraries like `zod` are an important part of a developer's toolkit.

So what makes `@traversable/schema` different?

## Tiny

Like, really tiny. Even libraries like `valibot` seem enormous in comparison.

But will you miss some of the gadgets that come with pre-5.5 libraries?

## Feature parity

Out of the box, `@traversable/schema` ships the usual suspects:

- `t.object`
- `t.array`
- `t.record`
- `t.tuple`
- `t.string`
- `t.number`
- `t.bigint`
- `t.null`
- `t.undefined`
- `t.symbol`
- `t.void`
- `t.never`
- `t.unknown`
- `t.any`

Importantly, __all schemas behave identically__ to the version you're used to.

And by identically, we mean _exactly_ that: our test suite uses the same library
that `jest` uses internally to test their own assertions (`fast-check`). The
strategy is simple: 

1. we use a seed value to generate an arbitrary `@traversable/schema` schema
2. we use the same seed to generate the correlating `zod` schema
3. we fuzz test them both, generating random data, and making sure we get
   the same result in every case
4. repeat 1000s of times for PR we stand up against main

It took a lot of work to get there, but taking this approach undercovered
dozens of corner cases. Without it, it would have taken years of user-reported
bugs to get to the same level of reliability.


## Keep it stupid simple

Using `@traversable/schema` is intuitive, because there's really not much to it.
You can pick the schemas you need off the shelf, or you can write the components
yourself, and stitch them together with a few `t.object`s or `t.array`s.

Here's what that might look like in practice:

```typescript
import { t } from '@traversable/schema'

const territoryProps = {
}

const AddressSchema = t.object({
  street_1: t.string,
  street_2: t.optional(t.string),
  state: t.memberOf('AK', 'AL', 'AZ', 'AR', 'CA', 'CO', 'CT' /* , ... */),
  city: t.string,
  postal_code: t.refine(
    (x) => typeof x === 'string',
    (x) => /^\d{5}?$/.test(x),
  ),
})

// Hovering over `AddressSchema`, we see:
const AddressSchema: t.object<{
  street_1: t.string;
  street_2: t.optional<t.string>;
  state: t.memberOf<["AK", "AL", "AZ", "AR", "CA", "CO", "CT"]>;
  city: t.string;
  postal_code: t.inline<string>;
}>

// Let's infer the target type of our schema:
type Address = t.typeof<typeof AddressSchema>

// Hovering over `Address`, we see:
type Address = {
  street_1: string;
  street_2?: string;
  state: "AK" | "AL" | "AZ" | "AR" | "CA" | "CO" | "CT";
  city: string;
  postal_code: string;
}
```

## Eminently extensible

Of course, nothing is free, so there _is_ a tradeoff:

If you need something specific to your use case, currently (since there is not
an ecosystem), you'll have to build it yourself.

That said, there's plenty of upside.

By removing the unnecessary layer of indirection, we remove the need for expensive 
overrides, or fancy recursive types.

Again, it's worth repeating:

> The magic here is that there is no magic. TypeScript does its thing, and we just get 
> out of the way.



## Runtime reflection




** In some cases required us to add
options (like `treatUndefinedAndOptionalAsTheSame`) to support both.





```mermaid
flowchart TD
    registry(@traversable/registry)
    json(@traversable/json) -.-> registry(@traversable/registry)
    schema-core(@traversable/schema-core) -.-> json(@traversable/json)
    schema-core(@traversable/schema-core) -.-> registry(@traversable/registry)
    schema-valibot-adapter(@traversable/schema-valibot-adapter) -.-> json(@traversable/json)
    schema-valibot-adapter(@traversable/schema-valibot-adapter) -.-> registry(@traversable/registry)
    schema-zod-adapter(@traversable/schema-zod-adapter) -.-> json(@traversable/json)
    schema-zod-adapter(@traversable/schema-zod-adapter) -.-> registry(@traversable/registry)
    schema-codec(@traversable/schema-codec) -.-> registry(@traversable/registry)
    schema-codec(@traversable/schema-codec) -.-> schema-core(@traversable/schema-core)
    schema-seed(@traversable/schema-seed) -.-> json(@traversable/json)
    schema-seed(@traversable/schema-seed) -.-> registry(@traversable/registry)
    schema-seed(@traversable/schema-seed) -.-> schema-core(@traversable/schema-core)
    derive-equals(@traversable/derive-equals) -.-> json(@traversable/json)
    derive-equals(@traversable/derive-equals) -.-> registry(@traversable/registry)
    derive-equals(@traversable/derive-equals) -.-> schema-core(@traversable/schema-core)
    derive-equals(@traversable/derive-equals) -.-> schema-seed(@traversable/schema-seed)
    derive-validators(@traversable/derive-validators) -.-> json(@traversable/json)
    derive-validators(@traversable/derive-validators) -.-> registry(@traversable/registry)
    derive-validators(@traversable/derive-validators) -.-> schema-core(@traversable/schema-core)
    derive-validators(@traversable/derive-validators) -.-> schema-seed(@traversable/schema-seed)
    schema-to-json-schema(@traversable/schema-to-json-schema) -.-> registry(@traversable/registry)
    schema-to-json-schema(@traversable/schema-to-json-schema) -.-> schema-core(@traversable/schema-core)
    schema-to-json-schema(@traversable/schema-to-json-schema) -.-> schema-seed(@traversable/schema-seed)
    schema-to-string(@traversable/schema-to-string) -.-> registry(@traversable/registry)
    schema-to-string(@traversable/schema-to-string) -.-> schema-core(@traversable/schema-core)
    schema-to-string(@traversable/schema-to-string) -.-> schema-seed(@traversable/schema-seed)
    schema(@traversable/schema) -.-> derive-validators(@traversable/derive-validators)
    schema(@traversable/schema) -.-> json(@traversable/json)
    schema(@traversable/schema) -.-> registry(@traversable/registry)
    schema(@traversable/schema) -.-> schema-codec(@traversable/schema-codec)
    schema(@traversable/schema) -.-> schema-core(@traversable/schema-core)
    schema(@traversable/schema) -.-> schema-to-json-schema(@traversable/schema-to-json-schema)
    schema(@traversable/schema) -.-> schema-seed(@traversable/schema-seed)
    schema(@traversable/schema) -.depends on.-> schema-zod-adapter(@traversable/schema-zod-adapter)
```