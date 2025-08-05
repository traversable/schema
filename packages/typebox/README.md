<br>
<h1 align="center">ᯓ𝘁𝗿𝗮𝘃𝗲𝗿𝘀𝗮𝗯𝗹𝗲/𝘁𝘆𝗽𝗲𝗯𝗼𝘅</h1>
<br>

<p align="center"><code>@traversable/typebox</code> or <strong><code>box</code></strong> is a schema rewriter for <a href="https://github.com/sinclairzx81/typebox" target="_blank"><code>TypeBox</code></a>.</p>

<div align="center">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40traversable%2Ftypebox?style=flat-square&logo=npm&label=npm&color=blue">
  &nbsp;
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.5%2B-blue?style=flat-square&logo=TypeScript&logoColor=4a9cf6">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/static/v1?label=Hippocratic%20License&message=HL3-FULL&labelColor=5e2751&color=bc8c3d">
  &nbsp;
  <img alt="npm" src="https://img.shields.io/npm/dt/@traversable/typebox?style=flat-square">
  &nbsp;
</div>

<div align="center">
  <!-- <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/%40traversable/typebox?style=flat-square&label=size">
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

`@traversable/typebox` has a peer dependency on [TypeBox](https://github.com/sinclairzx81/typebox) (v0.34).

## Getting started

```bash
$ pnpm add @traversable/typebox @sinclair/typebox
```

Here's an example of importing the library:

```typescript
import * as T from '@sinclair/typebox'
import { box } from '@traversable/typebox'

// or, if you prefer, you can use named imports:
import { deepClone, deepEqual } from '@traversable/typebox'

// see below for specific examples
```


## Table of contents

### Fuzz-tested, production ready

- [`box.deepClone`](https://github.com/traversable/schema/tree/main/packages/box#boxdeepclone)
- [`box.deepClone.writeable`](https://github.com/traversable/schema/tree/main/packages/box#boxdeepclonewriteable)
- [`box.deepEqual`](https://github.com/traversable/schema/tree/main/packages/box#boxdeepequal)
- [`box.deepEqual.writeable`](https://github.com/traversable/schema/tree/main/packages/box#boxdeepequalwriteable)

### Advanced

- [`box.fold`](https://github.com/traversable/schema/tree/main/packages/box#boxfold)
- [`box.Functor`](https://github.com/traversable/schema/tree/main/packages/box#boxfunctor)

## Features

### `box.deepClone`

`box.deepClone` lets users derive a specialized ["deep copy"](https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy) function that works with values that have been already validated.

Because the values have already been validated, clone times are significantly faster than alternatives like [`window.structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone) and [lodash.cloneDeep](https://www.npmjs.com/package/lodash.clonedeep).

#### Performance comparison

Here's a [Bolt sandbox](https://bolt.new/~/mitata-hbbbyims) if you'd like to run the benchmarks yourself.

```
                           ┌─────────────────┐
                           │         (avg)   │
┌──────────────────────────┼─────────────────┤
│  Lodash.cloneDeep        │  31.32x faster  │
├──────────────────────────┼─────────────────┤
│  window.structuredClone  │  54.36x faster  │
└──────────────────────────┴─────────────────┘
```

[This article](https://dev.to/ahrjarrett/how-i-built-javascripts-fastest-deep-clone-function-5fe0) goes into more detail about what makes `box.deepClone` so fast.

#### Example

```typescript
import * as T from '@sinclair/typebox'
import { box } from '@traversable/typebox'

const Address = T.Object({
  street1: T.String(),
  street2: T.Optional(T.String()),
  city: T.String(),
})

const deepClone = box.deepClone(Address)
const deepEqual = box.deepEqual(Address)

const sherlock = { street1: '221 Baker St', street2: '#B', city: 'London' }
const harry = { street1: '4 Privet Dr', city: 'Little Whinging' }

const sherlockCloned = deepClone(sherlock)
const harryCloned = deepClone(harry)

deepEqual(sherlockCloned, sherlock) // => true
deepEqual(harryCloned, harry)       // => true

sherlock === sherlockCloned         // => false
harry === harryCloned               // => false
```

#### See also
- [`box.deepClone.writeable`](https://github.com/traversable/schema/tree/main/packages/box#boxdeepclonewriteable)


### `box.deepClone.writeable`

`box.deepClone.writeable` lets users derive a specialized "deep clone" function that works with values that have been already validated.

Compared to [`box.deepClone`](https://github.com/traversable/schema/tree/main/packages/box#boxdeepclone), `box.deepClone.writeable` returns
the clone function in _stringified_ ("writeable") form.

#### Example

```typescript
import { box } from '@traversable/typebox'

const deepClone = box.deepClone.writeable({
  type: 'object',
  required: ['street1', 'city'],
  properties: {
    street1: { type: 'string' },
    street2: { type: 'string' },
    city: { type: 'string' },
  }
}, { typeName: 'Address' })

console.log(deepClone) 
// =>
// type Address = { street1: string; street2?: string; city: string; }
// function deepClone(prev: Address): Address {
//   return {
//     street1: prev.street1,
//     ...prev.street2 !== undefined && { street2: prev.street2 },
//     city: prev.city
//   }
// }
```

#### See also
- [`box.deepClone`](https://github.com/traversable/schema/tree/main/packages/box#boxdeepclone)

### `box.deepEqual`

`box.deepEqual` lets users derive a specialized "deep equal" function that works with values that have been already validated.

Because the values have already been validated, comparison times are significantly faster than alternatives like [`NodeJS.isDeepStrictEqual`](https://nodejs.org/api/util.html#utilisdeepstrictequalval1-val2) and [lodash.isEqual](https://www.npmjs.com/package/lodash.isequal).

#### Performance comparison

Here's a [Bolt sandbox](https://bolt.new/~/mitata-aqekgmyt) if you'd like to run the benchmarks yourself.

```
                             ┌────────────────┬────────────────┐
                             │   Array (avg)  │  Object (avg)  │
┌────────────────────────────┼────────────────┼────────────────┤
│  NodeJS.isDeepStrictEqual  │  40.3x faster  │  56.5x faster  │
├────────────────────────────┼────────────────┼────────────────┤
│  Lodash.isEqual            │  53.7x faster  │  60.1x faster  │
└────────────────────────────┴────────────────┴────────────────┘
```

[This article](https://dev.to/ahrjarrett/how-i-built-javascripts-fastest-deep-equals-function-51n8) goes into more detail about what makes `box.deepEqual` so fast.

#### Notes
- Best performance
- Works in any environment that supports defining functions using the `Function` constructor
- **Note:** generated functions will not work on Cloudflare workers due to a CSP that blocks the use of `Function`

#### Example

```typescript
import { box } from '@traversable/typebox'

const deepEqual = box.deepEqual({
  type: 'object',
  required: ['street1', 'city'],
  properties: {
    street1: { type: 'string' },
    street2: { type: 'string' },
    city: { type: 'string' },
  }
})

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
- [`box.deepEqual.writeable`](https://github.com/traversable/schema/tree/main/packages/box#boxdeepequalwriteable)


### `box.deepEqual.writeable`

`box.deepEqual.writeable` lets users derive a specialized "deep equal" function that works with values that have been already validated.

Compared to [`box.deepEqual`](https://github.com/traversable/schema/tree/main/packages/box#boxdeepequal), `box.deepEqual.writeable` returns
the deep equal function in _stringified_ ("writeable") form.

#### Notes
- Useful when you're consuming a set of TypeBox schemas and writing all them to disc somewhere
- Also useful for testing purposes or for troubleshooting, since it gives you a way to "see" exactly what the deepEqual functions are doing

#### Example

```typescript
import { box } from '@traversable/typebox'

const deepEqual = box.deepEqual.writeable({
  type: 'object',
  required: ['street1', 'city'],
  properties: {
    street1: { type: 'string' },
    street2: { type: 'string' },
    city: { type: 'string' },
  }
}, { typeName: 'Address' })

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
- [`box.deepEqual`](https://github.com/traversable/schema/tree/main/packages/box#boxdeepequal)


### `box.fold`

> [!NOTE]
> `box.fold` is an advanced API.

Use `box.fold` to define a recursive traversal of a TypeBox schema. Useful when building a schema rewriter.

#### What does it do?

Writing an arbitrary traversal with `box.fold` is:

1. non-recursive
2. 100% type-safe

The way it works is pretty simple: if you imagine all the places in the TypeBox schema that are recursive, those "holes" will be the type that you provide via type parameter.

#### Example

As an example, let's write a function called `check` that takes a TypeBox schema, and returns a function that validates its input against the schema.

Here's how you could use `box.fold` to implement it:

```typescript
import * as T from '@sinclair/typebox'
import { box } from '@traversable/typebox'

const isObject = (u: unknown): u is { [x: string]: unknown } => 
  !!u && typeof u === 'object' && !Array.isArray(u)

const check = box.fold<(data: unknown) => boolean>((schema, original) => { 
                //      𐙘_______________________𐙘
                //   this type will fill the "holes" in our schema
    switch (true) {
      case box.isNull(schema): 
        return (data) => data === null
      case box.isBoolean(schema): 
        return (data) => typeof data === 'boolean'
      case box.isInteger(schema): 
        return (data) => Number.isSafeInteger(data)
      case box.isNumber(schema): 
        return (data) => Number.isFinite(data)
      case box.isArray(schema): 
        return (data) => Array.isArray(data) 
          && schema.every(schema.items)
          //                     𐙘___𐙘
          //                     items: (data: unknown) => boolean
      case box.isObject(schema): 
        return (data) => isObject(data) 
          && Object.entries(schema.properties).every(
            // here we peek at the original schema to see if it's optional:
            ([key, property]) => box.isOptional(original.properties[key])
              //   𐙘______𐙘 
              //   property: (data: unknown) => boolean
              ? (!Object.hasOwn(data, key) || property(data[key]))
              : (Object.hasOwn(data, key) && property(data[key]))
          )
      default: return () => false
    }
  }
)

// Let's use `check` to create a predicate:
const isBooleanArray = check(T.Array(T.Boolean))

// Using the predicate looks like this:
isBooleanArray([false])    // true
isBooleanArray([true, 42]) // false
```

That's it! 

If you'd like to see a more complex example, here's [how `box.check` is actually implemented](https://github.com/traversable/schema/blob/main/packages/typebox-types/src/check.ts).

#### Theory

`box.fold` is similar to, but more powerful than, the [visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern). 

If you're curious about the theory behind it, its implementation was based on a 1991 paper called [Functional Programming with Bananas, Lenses, Envelopes and Barbed Wire](https://maartenfokkinga.github.io/utwente/mmf91m.pdf).

#### See also
- [`box.Functor`](https://github.com/traversable/schema/tree/main/packages/box#boxfunctor)

### `box.Functor`

> [!NOTE]
> `box.Functor` is an advanced API.

`box.Functor` is the primary abstraction that powers `@traversable/typebox`.

`box.Functor` is a powertool. Most of `@traversable/typebox` uses `box.Functor` under the hood.

Compared to the rest of the library, it's fairly "low-level", so unless you're doing something pretty advanced you probably won't need to use it directly.

#### See also
- [`box.fold`](https://github.com/traversable/schema/tree/main/packages/box#boxfold)
