<br>
<h1 align="center">ᯓ𝘁𝗿𝗮𝘃𝗲𝗿𝘀𝗮𝗯𝗹𝗲/𝘇𝗼𝗱</h1>
<br>

<p align="center"><code>@traversable/zod</code> or <strong><code>zx</code></strong> is a schema rewriter for <code>zod</code>.</p>

<div align="center">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40traversable%2Fzod?style=flat-square&logo=npm&label=npm&color=blue">
  &nbsp;
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.5%2B-blue?style=flat-square&logo=TypeScript&logoColor=4a9cf6">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/license-MIT-a094a2?style=flat-square">
  &nbsp;
  <img alt="npm" src="https://img.shields.io/npm/dt/@traversable/zod?style=flat-square">
  &nbsp;
</div>

<div align="center">
  <!-- <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/%40traversable/zod?style=flat-square&label=size">
  &nbsp; -->
  <img alt="Static Badge" src="https://img.shields.io/badge/ESM-supported-2d9574?style=flat-square&logo=JavaScript">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/CJS-supported-2d9574?style=flat-square&logo=Node.JS">
  &nbsp;
</div>

<div align="center">
  <a href="https://bolt.new/~/mitata-b2vwmctk" target="_blank">Bolt Sandbox</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://www.npmjs.com/package/@traversable/zod" target="_blank">npm</a>
  <br>
</div>
<br>
<br>

## Requirements

`@traversable/zod` has a peer dependency on [zod](https://zod.dev/) (v4, classic).

## Getting started

```bash
$ pnpm add @traversable/zod zod
```

Here's an example of importing the library:

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

// see below for specific examples
```

## Table of contents

### Fuzz-tested, production ready

- [`zx.check`](https://github.com/traversable/schema/tree/main/packages/zod#zxcheck)
- [`zx.check.writeable`](https://github.com/traversable/schema/tree/main/packages/zod#zxcheckwriteable)
- [`zx.clone`](https://github.com/traversable/schema/tree/main/packages/zod#zxclone)
- [`zx.clone.writeable`](https://github.com/traversable/schema/tree/main/packages/zod#zxclonewriteable)
- [`zx.equals`](https://github.com/traversable/schema/tree/main/packages/zod#zxequals)
- [`zx.equals.writeable`](https://github.com/traversable/schema/tree/main/packages/zod#zxequalswriteable)
- [`zx.equals.classic`](https://github.com/traversable/schema/tree/main/packages/zod#zxequalsclassic)
- [`zx.fromConstant`](https://github.com/traversable/schema/tree/main/packages/zod#zxfromconstant)
- [`zx.deepPartial`](https://github.com/traversable/schema/tree/main/packages/zod#zxdeeppartial)
- [`zx.deepPartial.writeable`](https://github.com/traversable/schema/tree/main/packages/zod#zxdeeppartialwriteable)
- [`zx.deepNullable`](https://github.com/traversable/schema/tree/main/packages/zod#zxdeepnullable)
- [`zx.deepNullable.writeable`](https://github.com/traversable/schema/tree/main/packages/zod#zxdeepnullablewriteable)
- [`zx.deepNonNullable`](https://github.com/traversable/schema/tree/main/packages/zod#zxdeepnonnullable)
- [`zx.deepNonNullable.writeable`](https://github.com/traversable/schema/tree/main/packages/zod#zxdeepnonnullablewriteable)
- [`zx.deepRequired`](https://github.com/traversable/schema/tree/main/packages/zod#zxdeeprequired)
- [`zx.deepRequired.writeable`](https://github.com/traversable/schema/tree/main/packages/zod#zxdeeprequiredwriteable)
- [`zx.defaultValue`](https://github.com/traversable/schema/tree/main/packages/zod#zxdefaultvalue)
- [`zx.toPaths`](https://github.com/traversable/schema/tree/main/packages/zod#zxtopaths)
- [`zx.toString`](https://github.com/traversable/schema/tree/main/packages/zod#zxtostring)
- [`zx.toType`](https://github.com/traversable/schema/tree/main/packages/zod#zxtotype)
- [`zx.typeof`](https://github.com/traversable/schema/tree/main/packages/zod#zxtypeof)
- [`zx.tagged`](https://github.com/traversable/schema/tree/main/packages/zod#zxtagged)

### Experimental

- [`zx.makeLens`](https://github.com/traversable/schema/tree/main/packages/zod#zxmakelens) (🔬)

### Advanced

- [`zx.fold`](https://github.com/traversable/schema/tree/main/packages/zod#zxfold)
- [`zx.Functor`](https://github.com/traversable/schema/tree/main/packages/zod#zxfunctor)


## Features

### `zx.check`

`zx.check` converts a zod-schema into a super-performant type-guard.

#### Notes

- Better performance than [`zx.check.writeable`](https://github.com/traversable/schema/tree/main/packages/zod#zxcheckwriteable)
- Works in any environment that supports defining functions using the `Function` constructor
- Generated functions **will not work on Cloudflare workers** due to a CSP that blocks the use of `Function`

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

const Address = z.object({
  street1: z.string(),
  street2: z.optional(z.string()),
  city: z.string(),
})

const addressCheck = zx.check(Address)

addressCheck({ street1: '221B Baker St', city: 'London' }) // => true
addressCheck({ street1: '221B Baker St' })                 // => false
```

#### See also
- [`zx.check.writeable`](https://github.com/traversable/schema/tree/main/packages/zod#zxcheckwriteable)

### `zx.check.writeable`

`zx.check` converts a zod-schema into a super-performant type-guard.

Compared to [`zx.check`](https://github.com/traversable/schema/tree/main/packages/zod#zxcheck), `zx.check.writeable` returns
the check function in _stringified_ ("writeable") form.

#### Notes

- Useful when you're consuming a set of zod schemas and writing them all to disc
- Also useful for testing purposes or for troubleshooting, since it gives you a way to "see" exactly what the check functions check
- Since you're presumably writing to disc a build-time, **works with Cloudflare workers**

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

const Address = z.object({
  street1: z.string(),
  street2: z.optional(z.string()),
  city: z.string(),
})

const addressCheck = zx.check.writeable(Address)

console.log(addressCheck) // =>
// function check(value) {
//   return (
//     !!value &&
//     typeof value === "object" &&
//     typeof value.street1 === "string" &&
//     (!Object.hasOwn(value, "street2") || typeof value?.street2 === "string") &&
//     typeof value.city === "string"
//   );
// }
```

#### See also
- [`zx.check`](https://github.com/traversable/schema/tree/main/packages/zod#zxcheck)


### `zx.clone`

`zx.clone` lets users derive a specialized ["deep clone"](https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy) function that works with values that have been already validated.

Because the values have already been validated, clone times are significantly faster than alternatives like [`window.structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone) and [`lodash.cloneDeep`](https://www.npmjs.com/package/lodash.clonedeep).

#### Performance comparison

Here's a [Bolt sandbox](https://bolt.new/~/mitata-kytjqemn) if you'd like to run the benchmarks yourself.

```
                           ┌───────────────┬────────────────┐
                           │  Array (avg)  │  Object (avg)  │
┌──────────────────────────┼───────────────┼────────────────┤
│  window.structuredClone  │  4.8x faster  │   5.3x faster  │
├──────────────────────────┼───────────────┼────────────────┤
│  Lodash.cloneDeep        │  9.1x faster  │  13.7x faster  │
└──────────────────────────┴───────────────┴────────────────┘
```

<!-- [This article](https://dev.to/ahrjarrett) goes into more detail about what makes `zx.clone` so fast. -->

#### Example

```typescript
import { assert } from 'vitest'
import { z } from 'zod'
import { zx } from '@traversable/zod'

const Address = z.object({
  street1: z.string(),
  strret2: z.optional(z.string()),
  city: z.string(),
})

const clone = zx.clone(Address)

const sherlock = { street1: '221 Baker St', street2: '#B', city: 'London' }
const harry = { street1: '4 Privet Dr', city: 'Little Whinging' }

const sherlockCloned = clone(sherlock)
const harryCloned = clone(harry)

// values are deeply equal:
assert.deepEqual(sherlockCloned, sherlock) // ✅
assert.deepEqual(harryCloned, harry)       // ✅

// values are fresh copies:
assert.notEqual(sherlockCloned, sherlock)  // ✅
assert.notEqual(harryCloned, harry)        // ✅
```

#### See also
- [`zx.clone.writeable`](https://github.com/traversable/schema/tree/main/packages/zod#zxclonewriteable)


### `zx.clone.writeable`

`zx.clone` lets users derive a specialized "deep clone" function that works with values that have been already validated.

Because the values have already been validated, clone times are significantly faster than alternatives like [`window.structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone) and [`lodash.cloneDeep`](https://www.npmjs.com/package/lodash.clonedeep).

Compared to [`zx.clone`](https://github.com/traversable/schema/tree/main/packages/zod#zxclone), `zx.clone.writeable` returns
the clone function in _stringified_ ("writeable") form.

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

const Address = z.object({
  street1: z.string(),
  strret2: z.optional(z.string()),
  city: z.string(),
})

const clone = zx.clone.writeable(Address, {
  typeName: 'Address',
  functionName: 'cloneAddress',
})

console.log(clone) 
// =>
// type Address = {
//   street1: string;
//   street2?: string;
//   city: string;
// }
// function cloneAddress(prev: Address): Address {
//   const next = Object.create(null)
//   const prev_street1 = prev.street1
//   const next_street1 = prev_street1
//   next.street1 = next_street1
//   const prev_street2 = prev.street2
//   let next_street2
//   if (prev_street2 !== undefined) {
//     next_street2 = prev_street2
//     next.street2 = next_street2
//   }
//   const prev_city = prev.city
//   const next_city = prev_city
//   next.city = next_city
//   return next
// }
```

#### See also
- [`zx.clone`](https://github.com/traversable/schema/tree/main/packages/zod#zxclone)


### `zx.equals`

`zx.equals` lets users derive a specialized "deep equals" function that works with values that have been already validated.

Because the values have already been validated, comparison times are significantly faster than alternatives like [`NodeJS.isDeepStrictEqual`](https://nodejs.org/api/util.html#utilisdeepstrictequalval1-val2) and [`lodash.isEqual`](https://www.npmjs.com/package/lodash.isequal).

#### Performance comparison

Here's a [Bolt sandbox](https://bolt.new/~/mitata-b2vwmctk) if you'd like to run the benchmarks yourself.

```
                             ┌────────────────┬────────────────┐
                             │   Array (avg)  │  Object (avg)  │
┌────────────────────────────┼────────────────┼────────────────┤
│  NodeJS.isDeepStrictEqual  │  40.3x faster  │  56.5x faster  │
├────────────────────────────┼────────────────┼────────────────┤
│  Lodash.isEqual            │  53.7x faster  │  60.1x faster  │
└────────────────────────────┴────────────────┴────────────────┘
```

[This article](https://dev.to/ahrjarrett/how-i-built-javascripts-fastest-deep-equals-function-51n8) goes into more detail about what makes `zx.equals` so fast.

#### Notes
- Best performance
- Works in any environment that supports defining functions using the `Function` constructor
- **Note:** generated functions will not work on Cloudflare workers due to a CSP that blocks the use of `Function`

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

const Address = z.object({
  street1: z.string(),
  street2: z.optional(z.string()),
  city: z.string(),
})

const addressEquals = zx.equals(Address)

addressEquals(
  { street1: '221B Baker St', city: 'London' },
  { street1: '221B Baker St', city: 'London' }
) // => true

addressEquals(
  { street1: '221B Baker St', city: 'London' },
  { street1: '4 Privet Dr', city: 'Little Whinging' }
) // => false
```

#### See also
- [`zx.equals.writeable`](https://github.com/traversable/schema/tree/main/packages/zod#zxequalswriteable)
- [`zx.equals.classic`](https://github.com/traversable/schema/tree/main/packages/zod#zxequalsclassic)

### `zx.equals.writeable`

#### Notes
- Useful when you're consuming a set of zod schemas and writing them all to disc
- Also useful for testing purposes or for troubleshooting, since it gives you a way to "see" exactly what the equals functions are doing

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

const Address = z.object({
  street1: z.string(),
  street2: z.optional(z.string()),
  city: z.string(),
})

const addressEquals = zx.equals.writeable(Address)

console.log(addressEquals)
// =>
// function equals(
//   x: { street1: string; street2?: string; city: string; },
//   y: { street1: string; street2?: string; city: string; }
// ) => {
//   if (x === y) return true;
//   if (x.street1 !== y.street1) return false;
//   if (x.street2 !== y.street2) return false;
//   if (x.city !== y.city) return false;
//   return true;
// }

/**
 * If you'd prefer parameter types to not be inlined,
 * use the `typeName` option:
 */
const addressEquals = zx.equals.writeable(
  Address, { typeName: 'Address' }
)

console.log(addressEquals)
// =>
// type Address = { street1: string; street2?: string; city: string; }
//
// function equals(x: Address, y: Address) => {
//   if (x === y) return true;
//   if (x.street1 !== y.street1) return false;
//   if (x.street2 !== y.street2) return false;
//   if (x.city !== y.city) return false;
//   return true;
// }
```

#### See also
- [`zx.equals`](https://github.com/traversable/schema/tree/main/packages/zod#zxequals)
- [`zx.equals.classic`](https://github.com/traversable/schema/tree/main/packages/zod#zxequalsclassic)

### `zx.equals.classic`

#### Notes
- This option is provided as a fallback in case users cannot work with either #1 or #2

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'
import * as vi from 'vitest'

const Address = z.object({
  street1: z.string(),
  street2: z.optional(z.string()),
  city: z.string(),
})

const addressEquals = zx.equals.classic(Address)

addressEquals(
  { street1: '221B Baker St', city: 'London' },
  { street1: '221B Baker St', city: 'London' },
) // => true

addressEquals(
  { street1: '221B Baker St', city: 'London' },
  { street1: '4 Privet Dr', city: 'Little Whinging' },
) // => false
```

#### See also
- [`zx.equals`](https://github.com/traversable/schema/tree/main/packages/zod#zxequals)
- [`zx.equals.writeable`](https://github.com/traversable/schema/tree/main/packages/zod#zxequalswriteable)


### `zx.fromConstant`

Convert a blob of JSON data into a zod schema that validates exactly that blob.

#### Example

```typescript
import { zx } from '@traversable/zod'

const blob = {
  abc: 'ABC',
  def: [1, 2, 3]
} as const

const schema = zx.fromConstant(blob)

console.log(zx.toString(schema))
// =>
// z.object({
//   abc: z.literal("ABC"),
//   def: z.tuple([
//     z.literal(1),
//     z.literal(2),
//     z.literal(3)
//   ])
// })
```


### `zx.deepPartial`

#### Prior art

Credit goes to @jaens for [their work](https://gist.github.com/jaens/7e15ae1984bb338c86eb5e452dee3010)
to detect circular schemas and prevent stack overflow.

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

const MySchema = zx.deepPartial(z.object({ a: z.number(), b: z.object({ c: z.string() }) }))

type MySchema = z.infer<typeof MySchema>
//   ^? type MySchema = { a?: number, b?: { c?: string } }
```

#### See also
- [`zx.deepPartial.writeable`](https://github.com/traversable/schema/tree/main/packages/zod#zxdeeppartialwriteable)

### `zx.deepPartial.writeable`

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

const MySchema = z.object({ a: z.number(), b: z.object({ c: z.string() }) })

console.log(zx.deepPartial.writeable(MySchema))
// =>
// z.object({
//   a: z.number().optional(),
//   b: z.object({
//     c: z.string().optional(),
//     d: z.array(z.boolean()).optional()
//   }).optional()
// }).optional()
```

#### See also
- [`zx.deepPartial`](https://github.com/traversable/schema/tree/main/packages/zod#zxdeeppartial)

### `zx.deepRequired`

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

const MySchema = zx.deepRequired(z.object({ a: z.number().optional(), b: z.object({ c: z.string().optional() }) }))

type MySchema = z.infer<typeof MySchema>
//   ^? type MySchema = { a: number, b: { c: string } }
```

#### See also
- [`zx.deepRequired.writeable`](https://github.com/traversable/schema/tree/main/packages/zod#zxdeeprequiredwriteable)

### `zx.deepRequired.writeable`

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

const MySchema = z.object({
  a: z.number().optional(),
  b: z.optional(
    z.object({
      c: z.string(),
      d: z.array(z.boolean()).optional()
    })
  )
})

console.log(zx.deepRequired.writeable(MySchema))
// =>
// z.object({
//   a: z.number(),
//   b: z.object({
//     c: z.string(),
//     d: z.array(z.boolean())
//   })
// })
```

#### See also
- [`zx.deepRequired`](https://github.com/traversable/schema/tree/main/packages/zod#zxdeeprequired)

### `zx.deepNullable`

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

const MySchema = zx.deepNullable(z.object({ a: z.number(), b: z.object({ c: z.string() }) }))

type MySchema = z.infer<typeof MySchema>
//   ^? type MySchema = { a: number | null, b: { c: string | null } | null }
```

#### See also
- [`zx.deepNullable.writeable`](https://github.com/traversable/schema/tree/main/packages/zod#zxdeepnullablewriteable)

### `zx.deepNullable.writeable`

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

const MySchema = z.object({
  a: z.number().optional(),
  b: z.object({
    c: z.string(),
    d: z.array(z.boolean()).optional()
  })
})

console.log(zx.deepNullable.writeable(MySchema))
// =>
// z.object({
//   a: z.number().nullable(),
//   b: z.object({
//     c: z.string().nullable(),
//     d: z.array(z.boolean().nullable()).nullable()
//   }).nullable()
// }).nullable()
```

#### See also
- [`zx.deepNullable`](https://github.com/traversable/schema/tree/main/packages/zod#zxdeepnullable)

### `zx.deepNonNullable`

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

const MySchema = zx.deepNonNullable(
  z.object({
    a: z.number().nullable(),
    b: z.object({
      c: z.string().nullable(),
    }),
  })
)

type MySchema = z.infer<typeof MySchema>
//   ^? type MySchema = { a: number, b: { c: string } }
```

#### See also
- [`zx.deepNonNullable.writeable`](https://github.com/traversable/schema/tree/main/packages/zod#zxdeepnonnullablewriteable)

### `zx.deepNonNullable.writeable`

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

const MySchema = z.object({
  a: z.number().nullable(),
  b: z.object({
    c: z.string().nullable(),
  })
})

console.log(zx.deepNullable.writeable(MySchema))
// =>
// z.object({
//   a: z.number(),
//   b: z.object({
//     c: z.string(),
//   })
// })
```

#### See also
- [`zx.deepNonNullable`](https://github.com/traversable/schema/tree/main/packages/zod#zxdeepnonnullable)

### `zx.deepReadonly`

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

const MySchema = zx.deepReadonly(z.object({ a: z.number(), b: z.object({ c: z.string() }) }))

type MySchema = z.infer<typeof MySchema>
//   ^? type MySchema = { readonly a: number, readonly b: { readonly c: string } }
```

#### See also
- [`zx.deepReadonly.writeable`](https://github.com/traversable/schema/tree/main/packages/zod#zxdeepreadonlywriteable)

### `zx.deepReadonly.writeable`

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

const MySchema = z.object({ a: z.number(), b: z.object({ c: z.string() }) })

console.log(zx.deepReadonly.writeable(MySchema))
// =>
// z.object({
//   a: z.number().readonly(),
//   b: z.object({
//     c: z.string().readonly(),
//   }.readonly())
// }.readonly())
```

#### See also
- [`zx.deepReadonly`](https://github.com/traversable/schema/tree/main/packages/zod#zxdeepreadonly)

### `zx.defaultValue`

`zx.defaultValues` converts a zod schema into a "default value' that respects the structure of the schema.

A common use case for `zx.defaultValue` is creating default values for forms.

> [!NOTE]
> By default, `zx.defaultValue` does not make any assumptions about what "default" means for primitive types,
> which is why it returns `undefined` when it encounters a leaf value. This behavior is configurable.

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

const MySchema = z.object({
  a: z.number(),
  b: z.object({
    c: z.string(),
    d: z.array(z.boolean())
  })
})

// by default, primitives are initialized as `undefined`:
const defaultOne = zx.defaultValue(MySchema)
console.log(defaultOne) // => { a: undefined, b: { c: undefined, d: [] } }

// to configure this behavior, use the `fallbacks` property:
const defaultTwo = zx.defaultValue(MySchema, { fallbacks: { number: 0, string: '' } })
console.log(defaultTwo) // => { a: 0, b: { c: '', d: [] } }
```

### `zx.toPaths`

`zx.toPaths` converts a zod schema into an array of "paths" that represent the schema.

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

console.log(
  zx.toPaths(z.object({ a: z.object({ c: z.string() }), b: z.number() }))
) // => [["a", "c"], ["b"]]
```

### `zx.toString`

Convert a zod schema into a string that constructs the same zod schema.

Useful for writing/debugging tests that involve randomly generated schemas.

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

console.log(
  zx.toString(
    z.templateLiteral([1n])
  )
) // => z.templateLiteral([1n])

console.log(
  zx.toString(
    z.map(z.array(z.boolean()), z.set(z.number().optional()))
  )
) // => z.map(z.array(z.boolean()), z.set(z.number().optional()))

console.log(
  zx.toString(
    z.tuple([
      z.number().min(0).lt(2),
      z.number().multipleOf(2).nullable(),
    ])
  )
) // => z.tuple([z.number().min(0).lt(2), z.number().multipleOf(2).nullable()])
```

### `zx.toType`

Convert a zod schema into a string that represents its type.

> [!NOTE]
> By default, the type will be returned as an "inline" type.
> To give the type a name, use the `typeName` option.

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

console.log(
  zx.toType(
    z.object({
      a: z.optional(z.literal(1)),
      b: z.literal(2),
      c: z.optional(z.literal(3))
    })
  )
) // => { a?: 1, b: 2, c?: 3 }

console.log(
  zx.toType(
    z.intersection(
      z.object({ a: z.literal(1) }),
      z.object({ b: z.literal(2) })
    )
  )
) // => { a: 1 } & { b: 2 }

console.log(
  z.templateLiteral([
    z.literal(['a', 'b']),
    ' ',
    z.literal(['c', 'd']),
    ' ',
    z.literal(['e', 'f'])
  ])
) // => "a c e" | "a c f" | "a d e" | "a d f" | "b c e" | "b c f" | "b d e" | "b d f"

// To give the generated type a name, use the `typeName` option:
console.log(
  zx.toType(
    z.object({ a: z.optional(z.number()) }),
    { typeName: 'MyType' }
  )
) // => type MyType = { a?: number }
```

### `zx.typeof`

`zx.typeof` returns the "type" (or _tag_) of a zod schema.

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

console.log(zx.typeof(z.string())) // => "string"
```

### `zx.tagged`

`zx.tagged` lets you construct a type-guard that identifies the type of zod schema you have.

#### Example

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

zx.tagged('object', z.object({})) // true
zx.tagged('array', z.string())    // false
```

### `zx.makeLens`

> [!NOTE]
> `zx.makeLens` still experimental (🔬). Use in production with care.

`zx.makeLens` accepts a zod schema (classic, v4) as its first argument, and a
"selector function" as its second argument.

An optic is a generalization of a _lens_, but since most people use "lens" to refer
to optics generally, they are sometimes used interchangeably in this document.

With `zx.makeLens`, you use a selector function to build up an _optic_ via a series of property accesses.

Let's look at a few examples to make things more concrete.

#### Example #1: Lens

For our first example, let's create a lens that focuses on a structure's `"a[0]"` path:

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

//////////////////////////
///  example #1: Lens  ///
//////////////////////////

const Schema = z.object({ a: z.tuple([z.string(), z.bigint()]) })

//    Use autocompletion to "select" what you want to focus:
//                                    ↆↆↆↆↆↆ
const Lens = zx.makeLens(Schema, $ => $.a[0])

Lens
// ^? const Lens: zx.Lens<{ a: [string, bigint] }, string>
//                         𐙘___________________𐙘   𐙘____𐙘
//                                     structure         focus

// Lenses have 3 properties:

///////////////
// #1:
// Lens.get -- Given a structure,
//             returns the focus

const ex_01 = Lens.get({ a: ['hi', 0n] })
//                      𐙘_____________𐙘
//                         structure

console.log(ex_01) // => "hi"
//                        𐙘𐙘
//                      focus


///////////////
// #2:
// Lens.set -- Given a new focus and a structure,
//             sets the new focus & returns the structure

const ex_02 = Lens.set(`hey, ho, let's go`, { a: ['', 0n] })
//                      𐙘_______________𐙘    𐙘___________𐙘
//                          new focus          structure

console.log(ex_02) // => { a: ["hey, ho, let's go", 0n] }
//                              𐙘_______________𐙘
//                                  new focus


/////////////////
// #3:
// Lens.modify -- Given a "modify" callback and a structure,
//                applies the callback to the focus & returns the structure

const ex_03 = Lens.modify((str) => str.toUpperCase(), { a: [`hey, ho`, 0n] })
//                         𐙘_______________________𐙘   𐙘__________________𐙘
//                                 callback                 structure

console.log(ex_03) // => { a: ["HEY, HO", 0n] }
//                              𐙘_____𐙘
//                             new focus

// Note that if your callback changes the focus type,
// that will be reflected in the return type as well:

const ex_04 = Lens.modify((str) => str.length > 0, { a: ['', 0n] })
//                         𐙘____________________𐙘   𐙘___________𐙘
//                                callback            structure

console.log(ex_04) // => { a: [false, 0n] }
//           ^? const ex_04: { a: [boolean, bigint] }
//                                 𐙘_____𐙘
//                                new focus
```

#### Example #2: Prism

When you use `zx.makeLens` on a __union type__, you get back a different kind
of lens called a __prism__.

Let's see how prisms differ from lenses:

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

///////////////////////////
///  example #2: Prism  ///
///////////////////////////

const Schema = z.union([
  z.object({ tag: z.literal('ONE'), ghi: z.number() }),
  z.object({ tag: z.literal('TWO') })
])

// Let's focus on the first union member's "ghi" property.

// If a discriminant can be inferred, autocompletion allows
// you to select that member by its discriminant,
// prefixed by `ꖛ`:
//
//                                       ↆↆↆↆↆ
const Prism = zx.makeLens(Schema, $ => $.ꖛONE.ghi)

Prism
// ^? Prism: zx.Prism<{ tag: "ONE", ghi: number } | { tag: "TWO" }, number | undefined>
//                     𐙘________________________________________𐙘   𐙘________________𐙘
//                                          structure                          focus

// Prisms have the same 3 properties as lenses,
// but they behave like **pattern matchers**
// instead of _property accessors_

///////////////
// #1:
// Prism.get -- Given a matching structure,
//              returns the focus

const ex_01 = Prism.get({ tag: 'ONE', ghi: 123 })
//                       𐙘____________________𐙘
//                            structure

console.log(ex_01) // => 123
//                       𐙘𐙘𐙘
//                      focus

// Prism.get -- If the match fails,
//              returns undefined

const ex_02 = Prism.get({ tag: 'TWO' })
//                       𐙘___________𐙘
//                         structure

console.log(ex_02) // => undefined
//                          𐙘𐙘𐙘
//                       no match


///////////////
// #2:
// Prism.set -- Given a new focus and a matching structure,
//              sets the new focus & returns the structure

const ex_03 = Prism.set(9_000, { tag: 'ONE', ghi: 123 })
//                      𐙘___𐙘   𐙘____________________𐙘
//                    new focus        structure

console.log(ex_03) // => { tag: 'ONE', ghi: 9000 }
//                                          𐙘__𐙘
//                                        new focus

// Prism.set -- If the match fails,
//              returns the structure unchanged

const ex_04 = Prism.set(9000, { tag: 'TWO' })

console.log(ex_04) // => { tag: 'TWO' }
//                        𐙘__________𐙘
//                          no match


//////////////////
// #3:
// Prism.modify -- Given a "modify" callback and a matching structure,
//                 applies the callback to the focus & returns the structure

// Just like with lenses, if your callback changes the focus type,
// that will be reflected in the return type:

const ex_05 = Prism.modify((n) => [n, n], { tag: 'ONE', ghi: 123 })
//                         𐙘___________𐙘   𐙘____________________𐙘
//                            callback           structure

console.log(ex_05) // => { tag: 'ONE', ghi: [123, 123] }
//           ^? const ex_05: { tag: "ONE", ghi: number[] } | { tag: "TWO" }

// Prism.modify -- If the match fails,
//                 returns the structure unchanged

const ex_06 = Prism.modify((n) => n + 1, { tag: 'TWO' })
//                         𐙘__________𐙘   𐙘___________𐙘
//                           callback       structure

console.log(ex_06) // => { tag: 'TWO' }
//           ^? const ex_06: { tag: "ONE", ghi: number } | { tag: "TWO" }
```

#### Example #3: Traversal

When you use `zx.makeLens` on a __collection type__ (such as `z.array` or `z.record`),
you get back a different kind of lens called a __traversal__.

Let's see how traversals differ from lenses and prisms:

```typescript
import { z } from 'zod'
import { zx } from '@traversable/zod'

///////////////////////////////
///  example #3: Traversal  ///
///////////////////////////////

const Schema = z.object({
  a: z.array(
    z.object({
      b: z.number(),
      c: z.string()
    })
  )
})

// Let's focus on the `"b"` property of each of the elements of the structure's `"a"` property:

// To indicate that you want to traverse the array,
// autocomplete the `ᣔꓸꓸ` field:
//                                                  ↆↆ
const Traversal = zx.makeLens(Schema, $ => $ => $.a.ᣔꓸꓸ.b)


Traversal
// ^? Traversal: zx.Traversal<{ a: { b: number, c: string }[] }, number>
//                             𐙘_____________________________𐙘   𐙘____𐙘
//                                       structure               focus

// Traversals have the same 3 properties as lenses and prisms,
// but they behave like **for-of loops**
// instead of _property accessors_ or _patterns matchers_


///////////////
// #1:
// Traversal.get -- Given a matching structure,
//                  returns all of the focuses

const ex_01 = Traversal.get({ a: [{ b: 0, c: '' }, { b: 1, c: '' }] })
//                           𐙘_____________________________________𐙘
//                                         structure

console.log(ex_01) // => [0, 1]
//                        𐙘__𐙘
//                       focus


///////////////
// #2:
// Traversal.set -- Given a new focus and a matching structure, sets all of the elements
//                  of the collection to the new focus & returns the structure

const ex_02 = Traversal.set(9_000, { a: [{ b: 0, c: '' }, { b: 1, c: '' }] })
//                          𐙘___𐙘   𐙘_____________________________________𐙘
//                        new focus               structure

console.log(ex_02) // => { a: [{ b: 9000, c: '' }, { b: 9000, c: '' }] }
//                                  𐙘__𐙘                𐙘__𐙘
//                                new focus           new focus


//////////////////
// #3:
// Traversal.modify -- Given a "modify" callback and a matching structure,
//                     applies the callback to _each_ focus & returns the structure

// Just like with lenses & prisms, if your callback changes the focus type,
// that will be reflected in the return type:

const ex_03 = Traversal.modify((n) => [n, n + 1], { a: [{ b: 0, c: '' }, { b: 1, c: '' }] })
//                             𐙘______________𐙘    𐙘_____________________________________𐙘
//                                 callback                      structure

console.log(ex_03) // => { a: [{ b: [0, 1], c: '' }, { b: [1, 2], c: '' }] }
//           ^? const ex_03: { a: { b: number[], c: string }[] }
//                                     𐙘______𐙘
//                                    new focus
```


## Advanced Features

### `zx.fold`

> [!NOTE]
> `zx.fold` is an advanced API.

Use `zx.fold` to define a recursive traversal of a zod schema. Useful when building a schema rewriter.

`zx.fold` is a powertool. Most of `@traversable/zod` uses `zx.fold` under the hood.

Compared to the rest of the library, it's fairly "low-level", so unless you're doing something pretty advanced you probably won't need to use it directly.

#### Example

Let's write a function that takes an arbitrary zod schema as input and stringifies it.

> [!NOTE]
> This functionality is already available off-the shelf via `zx.toString`.
> We'll be building this example from scratch using `zx.fold` for illustrative purposes.

```typescript
import { zx } from '@traversable/schema'

const toString = zx.fold<string>((x) => {
  //                     𐙘____𐙘 this type parameter fills in the "holes" below
  switch (true) {
    case zx.tagged('null')(x): return 'z.null()'
    case zx.tagged('number')(x): return 'z.number()'
    case zx.tagged('string')(x): return 'z.string()'
    case zx.tagged('boolean')(x): return 'z.boolean()'
    case zx.tagged('undefined')(x): return 'z.undefined()'
    case zx.tagged('array')(x): return `${x._zod.def.element}.array()`
    //                                                 ^? method element: string
    case zx.tagged('optional')(x): return `${x._zod.def.innerType}.optional()`
    //                                                     ^? method innerType: string
    case zx.tagged('tuple')(x): return `z.tuple([${x._zod.def.items.join(', ')}])`
    //                                                         ^? method items: string[]
    case zx.tagged('record')(x): return `z.record(${x._zod.def.keyType}, ${x._zod.def.valueType})`
    //                                                            ^? method keyType: string
    case zx.tagged('object')(x): 
      return `z.object({ ${Object.entries(x._zod.def.shape).map(([k, v]) => `${k}: ${v}`).join(', ')} })`
    //                                                ^? method shape: { [x: string]: string }
    default: throw Error(`Unimplemented: ${x._zod.def.type}`)
    //              ^^ there's nothing stopping you from implementing the rest!
  }
})

// Let's test it out:

console.log(
  zx.toString(
    z.object({ A: z.array(z.string()), B: z.optional(z.tuple([z.number(), z.boolean()])) })
  )
)
// => z.object({ A: z.array(z.string()), B: z.optional(z.tuple([z.number(), z.boolean()])) })
```

Our "naive" implementation is actually more robust than it might seem -- in fact, that's how `zx.toString` is [actually defined](https://github.com/traversable/schema/blob/main/packages/zod/src/to-string.ts).


### `zx.Functor`

> [!NOTE]
> `zx.Functor` is an advanced API

`zx.Functor` is the primary abstraction that powers `@traversable/zod`.

`zx.Functor` is a powertool. Most of `@traversable/zod` uses `zx.Functor` under the hood.

Compared to the rest of the library, it's fairly "low-level", so unless you're doing something pretty advanced you probably won't need to use it directly.
