<br>
<h1 align="center">ᯓ𝘁𝗿𝗮𝘃𝗲𝗿𝘀𝗮𝗯𝗹𝗲/𝘁𝘆𝗽𝗲𝗯𝗼𝘅</h1>
<br>

<p align="center"><code>@traversable/typebox</code> or <strong><code>box</code></strong> is a schema rewriter for <a href="https://github.com/sinclairzx81/typebox" target="_blank"><code>TypeBox</code></a>.</p>

<div align="center">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40traversable%2Ftypebox?style=flat-square&logo=npm&label=npm&color=blue">
  &nbsp;
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.5%2B-blue?style=flat-square&logo=TypeScript&logoColor=4a9cf6">
  &nbsp;
  <img alt="License" src="https://img.shields.io/static/v1?label=License&message=MIT&labelColor=59636e&color=838a93">
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

Because the values have already been validated, clone times are significantly faster than alternatives like [`window.structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone) and [`Lodash.cloneDeep`](https://www.npmjs.com/package/lodash.clonedeep).

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

Because the values have already been validated, comparison times are significantly faster than alternatives like [`NodeJS.isDeepStrictEqual`](https://nodejs.org/api/util.html#utilisdeepstrictequalval1-val2) and [`Lodash.isEqual`](https://www.npmjs.com/package/lodash.isequal).

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
- Works in any environment that supports defining functions using the `Function` constructor, including (as of May 2025) [Cloudflare workers](https://github.com/cloudflare/workerd/pull/4142) 🎉

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

Let's write a function that takes an arbitrary `TypeBox` schema, and generates mock data that satisfies the schema (a.k.a. a "faker").

> [!NOTE]
> You can play with this example on [StackBlitz](https://stackblitz.com/edit/traversable-typebox-faker-example?file=test%2Ffake.test.ts,src%2Ffake.ts&initialPath=__vitest__/)

```typescript
import * as T from '@sinclair/typebox'
import { faker } from '@faker-js/faker'
import { F, tagged } from '@traversable/typebox'

type Fake = () => unknown

const fake = F.fold<Fake>((x) => {
  //                𐙘__𐙘 this type parameter fills in the "holes" below
  switch (true) {
    case tagged('array')(x): return () => faker.helpers.multiple(
      () => x.items()
      //       ^? method items: Fake
      //                        𐙘__𐙘
    )
    case tagged('never')(x): return () => void 0
    case tagged('unknown')(x): return () => void 0
    case tagged('any')(x): return () => void 0
    case tagged('void')(x): return () => void 0
    case tagged('null')(x): return () => null
    case tagged('undefined')(x): return () => undefined
    case tagged('symbol')(x): return () => Symbol()
    case tagged('boolean')(x): return () => faker.datatype.boolean()
    case tagged('integer')(x): return () => faker.number.int()
    case tagged('bigInt')(x): return () => faker.number.bigInt()
    case tagged('number')(x): return () => faker.number.float()
    case tagged('string')(x): return () => faker.lorem.words()
    case tagged('date')(x): return () => faker.date.recent()
    case tagged('literal')(x): return () => x.const
    case tagged('allOf')(x): return () => Object.assign({}, ...x.allOf)
    case tagged('anyOf')(x): return () => faker.helpers.arrayElement(x.anyOf.map((option) => option()))
    case tagged('optional')(x): return () => faker.helpers.arrayElement([x.schema, undefined])
    case tagged('tuple')(x): return () => x.items.map((item) => item())
    case tagged('record')(x): return () => Object.fromEntries(Object.entries(x.patternProperties).map(([k, v]) => [k, v()]))
    case tagged('object')(x): return () => Object.fromEntries(Object.entries(x.properties).map(([k, v]) => [k, v()]))
    default: { x satisfies never; throw Error('Unsupported schema') }
    //         𐙘_______________𐙘
    //        exhaustiveness check works
  }
})

// Let's test it out:
const mock = fake(
  T.Object({
    abc: T.Array(T.String()), 
    def: T.Optional(
      T.Tuple([
        T.Number(), 
        T.Boolean()
      ])
    )
  })
)

console.log(mock())
// => {
//  abc: [
//     'annus iure consequatur',
//     'aer suus autem',
//     'delectus patrocinor deporto',
//     'benevolentia tonsor odit',
//     'stabilis dolor tres',
//     'mollitia quibusdam vociferor'
//   ],
//   def: [-882, false]
// }
```

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
