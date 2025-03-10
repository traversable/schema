---
"@traversable/schema-to-json-schema": patch
"@traversable/derive-validators": patch
"@traversable/schema-to-string": patch
"@traversable/schema-core": patch
"@traversable/schema-seed": patch
"@traversable/schema": patch
---

init(toString): initializes schema-to-string package

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
import { t } from '@traversable/schema'

const MySchema = t.string
//    ^? const MySchema: t.string
const MyString = MySchema.toString()
//    ^? const MySchema: "'string'"
```

We don't need to recurse, because this schema doesn't have any children.

Now let's promote this schema to be an object:

```typescript
import { t } from '@traversable/schema'

const MySchema = t.object({ abc: t.string })
//    ^? const MySchema: t.object<{ abc: t.string }>
const MyString = MySchema.toString()
//    ^? const MySchema: "'{ abc: string }"
```

Here, we still didn't need to perform any recursion. `t.object` constructor simply concatenates the strings of each of its children, 
joins the string, and wraps it with `{` and `}`.

Compare this with `Zod`:

```typescript
import { z } from 'zod'

const MySchema = z.object({ abc: t.string })
//    ^? const MySchema: z.ZodObject<{ abc: z.ZodString; }, "strip", z.ZodTypeAny, { abc: string; }, { abc: string; }>
```

To accomplish the same thing, zod uses __5 type parameters__.

Legibility concerns aside, here, the fact that `zod` is leaking implementation details is actually _helpful_,
because it exposes the underlying problem.

How many times does the `abc` property appear in the type?

__Three times__.

That means that for every property you define using zod, you're actually defining 3 properties.

Imagine using `zod` to define a `15x15` schema: __instead of `255` properties, your schema effectively has `765`__.

Keep in mind that when it comes to IDE performance / DX, you can throw Big(O) notation out the window: 

> In userland, when a feature is slow enough that its sluggishness is perceptible, the difference between 1n and 3n makes all the difference.
