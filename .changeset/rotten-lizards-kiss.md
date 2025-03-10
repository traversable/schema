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

**Note:**

Upon more thorough testing, the zod issue is _even worse than I thought_.

The when I defined the same `15x15` schema using zod, the type signature was __over 5000 lines long__ when formatted with `prettier`, clocking in at __over 40kb__.

But those numbers don't really mean anything without a point of reference.

What we need to do is compare the size of zod's type, with the size of the target type.

Here are the results, copied directly from the [benchmark]

#### benchmark

Rather than comparing `traversable` and `zod` directly, which is subject to
selection bias, we're going to compare the schema types to TypeScript itself.

That way we have a baseline, and we can more accurately see how the schemas
scale as the size of their input grows.

To keep me honest, I formatted everything using prettier.

Every part of this benchmark is public and available [HERE]().

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

Here's how zod did:

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

Let's see the traversable schema:

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

- __traversable__

  Roughly, a traversable schema comes with a **50% overhead**

  That means that if our TypeScript type is 100 lines long, we can expect the traversable
  schema to consume around 150 lines behind the scenes

  Now let's compare that against zod.

- __zod__

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
the bells and whistles included, __outperforms zod by a factor of 30x__.

`traversable` schemas are faster than `zod` schemas in other ways, too. They're also composable
in ways that zod schemas can never be, and were built from the ground-up to leverage the tools
we already have lying around -- to "use the platform", as it were.

It took a lot of work to get here, and there's still a lot of work to be done, but that's where
the `traversable` project stands today, compared to its largest competitor.
