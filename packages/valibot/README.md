<br>
<h1 align="center">ᯓ𝘁𝗿𝗮𝘃𝗲𝗿𝘀𝗮𝗯𝗹𝗲/𝘃𝗮𝗹𝗶𝗯𝗼𝘁</h1>
<br>

<p align="center"><code>@traversable/valibot</code> or <strong><code>vx</code></strong> is a schema rewriter for <a href="https://github.com/fabian-hiller/valibot" target="_blank"><code>Valibot</code></a>.</p>

<div align="center">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40traversable%2Fvalibot?style=flat-square&logo=npm&label=npm&color=blue">
  &nbsp;
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.5%2B-blue?style=flat-square&logo=TypeScript&logoColor=4a9cf6">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/static/v1?label=Hippocratic%20License&message=HL3-FULL&labelColor=5e2751&color=bc8c3d">
  &nbsp;
  <img alt="npm" src="https://img.shields.io/npm/dt/@traversable/valibot?style=flat-square">
  &nbsp;
</div>

<div align="center">
  <!-- <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/%40traversable/valibot?style=flat-square&label=size">
  &nbsp; -->
  <img alt="Static Badge" src="https://img.shields.io/badge/%F0%9F%8C%B2-tree--shakeable-brightgreen?labelColor=white">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/ESM-supported-2d9574?style=flat-square&logo=JavaScript">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/CJS-supported-2d9574?style=flat-square&logo=Node.JS">
  &nbsp;
</div>
<br>
<br>

## Requirements

`@traversable/valibot` has a peer dependency on [`valibot`](https://valibot.dev).

## Getting started

```bash
$ pnpm add @traversable/valibot valibot
```

Here's an example of importing the library:

```typescript
import * as v from 'valibot'
import { vx } from '@traversable/valibot'

// see below for specific examples
```

## Table of contents

### Fuzz-tested, production ready

- [`vx.check`](https://github.com/traversable/schema/tree/main/packages/valibot#vxcheck)
- [`vx.check.writeable`](https://github.com/traversable/schema/tree/main/packages/valibot#vxcheckwriteable)
- [`vx.deepClone`](https://github.com/traversable/schema/tree/main/packages/valibot#vxdeepclone)
- [`vx.deepClone.writeable`](https://github.com/traversable/schema/tree/main/packages/valibot#vxdeepclonewriteable)
- [`vx.deepEqual`](https://github.com/traversable/schema/tree/main/packages/valibot#vxdeepequal)
- [`vx.deepEqual.writeable`](https://github.com/traversable/schema/tree/main/packages/valibot#vxdeepequalwriteable)
- [`vx.fromConstant`](https://github.com/traversable/schema/tree/main/packages/valibot#vxfromconstant)
- [`vx.fromConstant.writeable`](https://github.com/traversable/schema/tree/main/packages/valibot#vxfromconstantwriteable)
- [`vx.fromJson`](https://github.com/traversable/schema/tree/main/packages/valibot#vxfromjson)
- [`vx.fromJson.writeable`](https://github.com/traversable/schema/tree/main/packages/valibot#vxfromjsonwriteable)
- [`vx.toString`](https://github.com/traversable/schema/tree/main/packages/valibot#vxtostring)
- [`vx.toType`](https://github.com/traversable/schema/tree/main/packages/valibot#vxtotype)

### Advanced

- [`vx.fold`](https://github.com/traversable/schema/tree/main/packages/valibot#vxfold)
- [`vx.Functor`](https://github.com/traversable/schema/tree/main/packages/valibot#vxfunctor)

## Features

### `vx.check`

`vx.check` converts a Valibot schema into a super-performant type-guard.

#### Notes

- Better performance than `v.is`, `v.parse` and `v.safeParse`
- Works in any environment that supports defining functions using the `Function` constructor, including (as of May 2025) [Cloudflare workers](https://github.com/cloudflare/workerd/pull/4142) 🎉

#### Performance comparison

Here's a [Bolt sandbox](https://bolt.new/~/mitata-sjjbvtph) if you'd like to run the benchmarks yourself.

```
                ┌─────────────────┐
                │        Average  │
┌───────────────┼─────────────────┤
│  v.is         │  40.22x faster  │
├───────────────┼─────────────────┤
│  v.parse      │  52.34x faster  │
├───────────────┼─────────────────┤
│  v.safeParse  │  54.18x faster  │
└───────────────┴─────────────────┘
```

`v.parse` and `v.safeParse` clone the object they're parsing, and return an array of issues if any are encountered.

Those features are incredibly useful in the right context.

But in contexts where all you need is to know whether a value is valid or not, it'd be nice to have a faster alternative, that doesn't allocate.

`vx.check` takes a valibot schema, and returns a type guard. It's performance is more than an order of magnitude faster than `v.parse` and `v.safeParse`.


#### Example

```typescript
import * as v from 'valibot'
import { vx } from '@traversable/valibot'

const Address = v.object({
  street1: v.string(),
  street2: v.exactOptional(v.string()),
  city: v.string(),
})

const addressCheck = vx.check(Address)

addressCheck({ street1: '221B Baker St', city: 'London' }) // => true
addressCheck({ street1: '221B Baker St' })                 // => false
```

#### See also
- [`vx.check.writeable`](https://github.com/traversable/schema/tree/main/packages/valibot#vxcheckwriteable)

### `vx.check.writeable`

`vx.check.writable` converts a Valibot schema into a super-performant type-guard.

Compared to [`vx.check`](https://github.com/traversable/schema/tree/main/packages/valibot#vxcheck), `vx.check.writeable` returns
the check function in _stringified_ ("writeable") form.

#### Notes

- Useful when you're consuming a set of valibot schemas and writing them all to disc
- Also useful for testing purposes or for troubleshooting, since it gives you a way to "see" exactly what the check functions check

#### Example

```typescript
import * as v from 'valibot'
import { vx } from '@traversable/valibot'

const addressCheck = vx.check.writeable(
  v.object({
    street1: v.string(),
    street2: v.exactOptional(v.string()),
    city: v.string(),
  }),
  { typeName: 'Address' }
)

console.log(addressCheck) 
// =>
// type Address = { street1: string; street2?: string; city: string; }
// function check(value: Address) {
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
- [`vx.check`](https://github.com/traversable/schema/tree/main/packages/valibot#vxcheck)


### `vx.deepClone`

`vx.deepClone` lets users derive a specialized ["deep copy"](https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy) function that works with values that have been already validated.

Because the values have already been validated, clone times are significantly faster than alternatives like [`window.structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone) and [`Lodash.cloneDeep`](https://www.npmjs.com/package/lodash.clonedeep).

#### Performance comparison

Here's a [Bolt sandbox](https://bolt.new/~/mitata-rgpjpkap) if you'd like to run the benchmarks yourself.

```
                           ┌─────────────────┐
                           │        Average  │
┌──────────────────────────┼─────────────────┤
│  Lodash.cloneDeep        │   9.18x faster  │
├──────────────────────────┼─────────────────┤
│  window.structuredClone  │  19.41x faster  │
└──────────────────────────┴─────────────────┘
```

[This article](https://dev.to/ahrjarrett/how-i-built-javascripts-fastest-deep-clone-function-5fe0) goes into more detail about what makes `vx.deepClone` so fast.

#### Example

```typescript
import { assert } from 'vitest'
import * as v from 'valibot'
import { vx } from '@traversable/valibot'

const Address = v.object({
  street1: v.string(),
  street2: v.exactOptional(v.string()),
  city: v.string(),
})

const clone = vx.deepClone(Address)

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
- [`vx.deepClone.writeable`](https://github.com/traversable/schema/tree/main/packages/valibot#vxdeepclonewriteable)


### `vx.deepClone.writeable`

`vx.deepClone` lets users derive a specialized "deep clone" function that works with values that have been already validated.

Compared to [`vx.deepClone`](https://github.com/traversable/schema/tree/main/packages/valibot#vxdeepclone), `vx.deepClone.writeable` returns
the clone function in _stringified_ ("writeable") form.

#### Example

```typescript
import * as v from 'valibot'
import { vx } from '@traversable/valibot'

const deepClone = vx.deepClone.writeable(
  v.object({
    street1: v.string(),
    street2: v.exactOptional(v.string()),
    city: v.string(),
  }), 
  { typeName: 'Address' }
)

console.log(deepClone) 
// =>
// type Address = { street1: string; street2?: string; city: string; }
// function deepClone(prev: Address) {
//   return {
//     street1: prev.street1,
//     ...prev.street2 !== undefined && { street2: prev.street2 },
//     city: prev.city
//   }
// }
```

#### See also
- [`vx.deepClone`](https://github.com/traversable/schema/tree/main/packages/valibot#vxdeepclone)


### `vx.deepEqual`

`vx.deepEqual` lets users derive a specialized "deep equal" function that works with values that have been already validated.

Because the values have already been validated, comparison times are significantly faster than alternatives like [`NodeJS.isDeepStrictEqual`](https://nodejs.org/api/util.html#utilisdeepstrictequalval1-val2) and [`Lodash.isEqual`](https://www.npmjs.com/package/lodash.isequal).

#### Performance comparison

Here's a [Bolt sandbox](https://bolt.new/~/mitata-ej422lcr) if you'd like to run the benchmarks yourself.

```
                             ┌────────────────┬────────────────┐
                             │   Array (avg)  │  Object (avg)  │
┌────────────────────────────┼────────────────┼────────────────┤
│  NodeJS.isDeepStrictEqual  │  40.3x faster  │  56.5x faster  │
├────────────────────────────┼────────────────┼────────────────┤
│  Lodash.isEqual            │  53.7x faster  │  60.1x faster  │
└────────────────────────────┴────────────────┴────────────────┘
```

[This article](https://dev.to/ahrjarrett/how-i-built-javascripts-fastest-deep-equals-function-51n8) goes into more detail about what makes `vx.deepEqual` so fast.

#### Notes
- Works in any environment that supports defining functions using the `Function` constructor, including (as of May 2025) [Cloudflare workers](https://github.com/cloudflare/workerd/pull/4142) 🎉

#### Example

```typescript
import * as v from 'valibot'
import { vx } from '@traversable/valibot'

const deepEqual = vx.deepEqual(
  v.object({
    street1: v.string(),
    street2: v.exactOptional(v.string()),
    city: v.string(),
  })
)

deepEqual(
  { street1: '221B Baker St', city: 'London' },
  { street1: '221B Baker St', city: 'London' }
) // => true

deepEqual(
  { street1: '221B Baker St', city: 'London' },
  { street1: '4 Privet Dr', city: 'Little Whinging' }
) // => false
```

#### See also
- [`vx.deepEqual.writeable`](https://github.com/traversable/schema/tree/main/packages/valibot#vxdeepequalwriteable)

### `vx.deepEqual.writeable`

#### Notes
- Useful when you're consuming a set of valibot schemas and writing them all to disc
- Also useful for testing purposes or for troubleshooting, since it gives you a way to "see" exactly what the deep equal functions are doing

#### Example

```typescript
import * as v from 'valibot'
import { vx } from '@traversable/valibot'

const deepEqual = vx.deepEqual.writeable(
  v.object({
    street1: v.string(),
    street2: v.exactOptional(v.string()),
    city: v.string(),
  }),
  { typeName: 'Address' }
)

console.log(deepEqual)
// =>
// type Address = { street1: string; street2?: string; city: string; }
// function deepEqual(x: Address, y: Address) {
//   if (x === y) return true;
//   if (x.street1 !== y.street1) return false;
//   if (x.street2 !== y.street2) return false;
//   if (x.city !== y.city) return false;
//   return true;
// }
```

#### See also
- [`vx.deepEqual`](https://github.com/traversable/schema/tree/main/packages/valibot#vxdeepequal)

### `vx.fromConstant`

Convert a blob of JSON data into a valibot schema that represents the blob's least upper bound.

#### Example

```typescript
import type * as v from 'valibot'
import { vx } from '@traversable/valibot'

let example = vx.fromConstant({ abc: 'ABC', def: [1, 2, 3] })
//  ^? let example: v.ObjectSchema<{ readonly abc: 'ABC', readonly def: readonly [1, 2, 3] }>

console.log(vx.toString(example))
// => v.object({ abc: v.literal("ABC"), def: v.tuple([v.literal(1), v.literal(2), v.literal(3)]) })
```

#### See also
- [`vx.fromJson`](https://github.com/traversable/schema/tree/main/packages/valibot#vxfromjson)
- [`vx.fromConstant.writeable`](https://github.com/traversable/schema/tree/main/packages/valibot#vxfromconstantwriteable)


### `vx.fromConstant.writeable`

Convert a blob of JSON data into a _stringified_ valibot schema that represents the blob's [least upper bound](https://en.wikipedia.org/wiki/Infimum_and_supremum).

#### Example

```typescript
import { vx } from '@traversable/valibot'

let ex_01 = vx.fromConstant.writeable({ abc: 'ABC', def: [1, 2, 3] })

console.log(ex_01)
// => v.object({ abc: v.literal("ABC"), def: v.tuple([ v.literal(1), v.literal(2), v.literal(3) ]) })
```

#### See also
- [`vx.fromJson`](https://github.com/traversable/schema/tree/main/packages/valibot#vxfromjson)
- [`vx.fromConstant`](https://github.com/traversable/schema/tree/main/packages/valibot#vxfromconstant)


### `vx.fromJson`

Convert a blob of JSON data into a valibot schema that represents the blob's greatest lower bound.

#### Example

```typescript
import type * as v from '@traversable/valibot'
import { vx } from '@traversable/valibot'

let ex_01 = vx.fromJson({ abc: 'ABC', def: [] })

console.log(vx.toString(ex_01))
// => v.object({ abc: v.string(), def: v.array(v.unknown()) })

let ex_02 = vx.fromJson({ abc: 'ABC', def: [123] })

console.log(vx.toString(ex_02))
// => v.object({ abc: v.string(), def: v.array(v.number()) })

let ex_03 = vx.fromJson({ abc: 'ABC', def: [123, null]})

console.log(vx.toString(ex_03))
// => v.object({ abc: v.string(), def: v.array(v.union([v.number(), v.null()])) })
```

#### See also
- [`vx.fromConstant`](https://github.com/traversable/schema/tree/main/packages/valibot#vxfromconstant)
- [`vx.fromJson.writeable`](https://github.com/traversable/schema/tree/main/packages/valibot#vxfromjsonwriteable)


### `vx.fromJson.writeable`

Convert a blob of JSON data into a _stringified_ valibot schema that represents the blob's greatest lower bound.

#### Example

```typescript
import { vx } from '@traversable/valibot'

let ex_01 = vx.fromJson.writeable({ abc: 'ABC', def: [] })

console.log(ex_01)
// => v.object({ abc: v.string(), def: v.array(v.unknown()) })

let ex_02 = vx.fromJson.writeable({ abc: 'ABC', def: [123] })

console.log(ex_02)
// => v.object({ abc: v.string(), def: v.array(v.number()) })

let ex_03 = vx.fromJson.writeable({ abc: 'ABC', def: [123, null]})

console.log(ex_03)
// => v.object({ abc: v.string(), def: v.array(v.union([v.number(), v.null()])) })
```

#### See also
- [`vx.fromConstant`](https://github.com/traversable/schema/tree/main/packages/valibot#vxfromconstant)
- [`vx.fromJson`](https://github.com/traversable/schema/tree/main/packages/valibot#vxfromjson)


## `vx.toString`

Convert a valibot schema into a string that constructs the same valibot schema.

Useful for writing/debugging tests that involve randomly generated schemas.

#### Example

```typescript
import * as v from 'valibot'
import { vx } from '@traversable/valibot'

console.log(
  vx.toString(
    v.map(v.array(v.boolean()), v.set(v.optional(v.number())))
  )
) // => v.map(v.array(v.boolean()), v.set(v.optional(v.number())))

console.log(
  vx.toString(
    v.tupleWithRest([v.number(), v.number()], v.boolean())
  )
) // => v.tupleWithRest([v.number(), v.number()], v.boolean())
```


### `vx.toType`

Convert a valibot schema into a string that represents its type.

To preserve JSDoc annotations for object properties, pass `preserveJsDocs: true` in the options object.

> [!NOTE]
> By default, the type will be returned as an "inline" type.
> To give the type a name, use the `typeName` option.

#### Example

```typescript
import * as v from 'valibot'
import { vx } from '@traversable/valibot'

console.log(
  vx.toType(
    v.object({
      a: v.exactOptional(v.literal(1)),
      b: v.literal(2),
      c: v.exactOptional(v.literal(3))
    })
  )
) // => { a?: 1, b: 2, c?: 3 }

console.log(
  vx.toType(
    v.intersection([
      v.object({ a: v.literal(1) }),
      v.object({ b: v.literal(2) })
    ])
  )
) // => { a: 1 } & { b: 2 }

// To give the generated type a name, use the `typeName` option:
console.log(
  vx.toType(
    v.object({ a: v.exactOptional(v.number()) }),
    { typeName: 'MyType' }
  )
) // => type MyType = { a?: number }

// To preserve JSDoc annotations, use the `preserveJsDocs` option:
console.log(
  vx.toType(
    v.object({
      street1: v.string().describe('Street 1 description'),
      street2: v.string().exactOptional().describe('Street 2 description'),
      city: v.string(),
    }),
    { typeName: 'Address', preserveJsDocs: true }
  )
) 
// => 
// type Address = {
//   /**
//    * Street 1 description
//    */
//   street1: string 
//   /**
//    * Street 2 description
//    */
//   street2?: string
//   city: string
// }
```


## Advanced Features

### `vx.fold`

> [!NOTE]
> `vx.fold` is an advanced API.

Use `vx.fold` to define a recursive traversal of a valibot schema. Useful when building a schema rewriter.

`vx.fold` is a powertool. Most of `@traversable/valibot` uses `vx.fold` under the hood.

Compared to the rest of the library, it's fairly "low-level", so unless you're doing something pretty advanced you probably won't need to use it directly.

#### Example

Let's write a function that takes an arbitrary valibot schema as input and stringifies it.

> [!NOTE]
> This functionality is already available off-the shelf via `vx.toString`.
> We'll be building this example from scratch using `vx.fold` for illustrative purposes.

```typescript
import { vx } from '@traversable/valibot'

const toString = vx.fold<string>((x) => {
  //                     𐙘____𐙘 this type parameter fills in the "holes" below
  switch (true) {
    case vx.tagged('null')(x): return 'v.null()'
    case vx.tagged('number')(x): return 'v.number()'
    case vx.tagged('string')(x): return 'v.string()'
    case vx.tagged('boolean')(x): return 'v.boolean()'
    case vx.tagged('undefined')(x): return 'v.undefined()'
    case vx.tagged('array')(x): return `v.array(${x.item})`
    //                                               ^? method item: string
    case vx.tagged('exactOptional')(x): return `v.exactOptional(${x.wrapped})`
    //                                                               ^? method wrapped: string
    case vx.tagged('tuple')(x): return `v.tuple([${x.items.join(', ')}])`
    //                                                ^? method items: string[]
    case vx.tagged('record')(x): return `v.record(${x.key}, ${x.value})`
    //                                                 ^? (#1)    ^? (#2)
    //                                                    (#1) method key: string;
    //                                                               (#2) method value: string
    case vx.tagged('object')(x): 
      return `v.object({ ${Object.entries(x.entries).map(([k, v]) => `${k}: ${v}`).join(', ')} })`
    //                                       ^? method entries: { [x: string]: string }
    default: throw Error(`Unimplemented: ${x.type}`)
    //              ^^ there's nothing stopping you from implementing the rest!
  }
})

// Let's test it out:

console.log(
  vx.toString(
    v.object({ abc: v.array(v.string()), def: v.exactOptional(v.tuple([v.number(), v.boolean()])) })
  )
)
// => v.object({ abc: v.array(v.string()), def: v.exactOptional(v.tuple([v.number(), v.boolean()])) })
```

Our "naive" implementation is actually more robust than it might seem -- in fact, that's how `vx.toString` is [actually defined](https://github.com/traversable/schema/blob/main/packages/valibot/src/to-string.ts).


### `vx.Functor`

> [!NOTE]
> `vx.Functor` is an advanced API

`vx.Functor` is the primary abstraction that powers `@traversable/valibot`.

`vx.Functor` is a powertool. Most of `@traversable/valibot` uses `vx.Functor` under the hood.

Compared to the rest of the library, it's fairly "low-level", so unless you're doing something pretty advanced you probably won't need to use it directly.
