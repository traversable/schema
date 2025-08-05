<br>
<h1 align="center">ᯓ𝘁𝗿𝗮𝘃𝗲𝗿𝘀𝗮𝗯𝗹𝗲/𝗷𝘀𝗼𝗻-𝘀𝗰𝗵𝗲𝗺𝗮</h1>
<br>

<p align="center">
  <code>@traversable/json-schema</code> is a schema rewriter for <a href="https://json-schema.org" target="_blank"><code>JSON Schema</code></a> specs.
</p>

<div align="center">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40traversable%2Fjson-schema?style=flat-square&logo=npm&label=npm&color=blue">
  &nbsp;
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.5%2B-blue?style=flat-square&logo=TypeScript&logoColor=4a9cf6">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/static/v1?label=Hippocratic%20License&message=HL3-FULL&labelColor=5e2751&color=bc8c3d">
  &nbsp;
  <img alt="npm" src="https://img.shields.io/npm/dt/@traversable/json-schema?style=flat-square">
  &nbsp;
</div>

<div align="center">
  <!-- <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/%40traversable/json-schema?style=flat-square&label=size">
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

> [!NOTE]
> Currently this package only supports [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12)

## Getting started

```bash
$ pnpm add @traversable/json-schema
```

Here's an example of importing the library:

```typescript
import { JsonSchema } from '@traversable/json-schema'

// or, if you prefer, you can use named imports:
import { deepClone, deepEqual } from '@traversable/json-schema'

// see below for specific examples
```


## Table of contents

### Fuzz-tested, production ready

- [`JsonSchema.check`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemacheck)
- [`JsonSchema.check.writeable`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemacheckwriteable)
- [`JsonSchema.deepClone`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemadeepclone)
- [`JsonSchema.deepClone.writeable`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemadeepclonewriteable)
- [`JsonSchema.deepEqual`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemadeepequal)
- [`JsonSchema.deepEqual.writeable`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemadeepequalwriteable)

### Advanced

- [`JsonSchema.fold`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemafold)
- [`JsonSchema.Functor`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemafunctor)

## Features

### `JsonSchema.check`

`JsonSchema.check` converts a JSON Schema into a super-performant type-guard.

#### Notes

- Consistently better performance than [Ajv](https://ajv.js.org)
- Works in any environment that supports defining functions using the `Function` constructor
- Generated functions **will not work on Cloudflare workers** due to a CSP that blocks the use of `Function`

#### Performance comparison

Here's a [Bolt sandbox](https://bolt.new/~/mitata-zdx4oa8x) if you'd like to run the benchmarks yourself.

```
        ┌────────────────┐
        │       Average  │
┌───────┼────────────────┤
│  Ajv  │  1.57x faster  │
└───────┴────────────────┘
```

#### Example

```typescript
import { JsonSchema } from '@traversable/json-schema'

const check = JsonSchema.check({
  type: 'object',
  required: ['street1', 'city'],
  properties: {
    street1: { type: 'string' },
    street2: { type: 'string' },
    city: { type: 'string' },
  }
})

check({ street1: '221B Baker St', city: 'London' }) // => true
check({ street1: '221B Baker St' })                 // => false
```

#### See also
- [`JsonSchema.check.writeable`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemacheckwriteable)


### `JsonSchema.check.writeable`

`JsonSchema.check` converts a JSON Schema into a super-performant type-guard.

Compared to [`JsonSchema.check`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemacheck), `JsonSchema.check.writeable` returns
the check function in _stringified_ ("writeable") form.

#### Notes

- Useful when you're consuming a set of JSON Schemas schemas and writing them all to disc
- Also useful for testing purposes or for troubleshooting, since it gives you a way to "see" exactly what the check functions check
- Since you're presumably writing to disc a build-time, **works with Cloudflare workers**

#### Example

```typescript
import { JsonSchema } from '@traversable/json-schema'

const check = JsonSchema.check.writeable({
  type: 'object',
  required: ['street1', 'city'],
  properties: {
    street1: { type: 'string' },
    street2: { type: 'string' },
    city: { type: 'string' },
  }
}, { typeName: 'Address' })

console.log(check)
// =>
// type Address = { street1: string; street2?: string; city: string }
// function check(value: Address) {
//   return (
//     !!value &&
//     typeof value === "object" &&
//     typeof value.street1 === "string" &&
//     (!Object.hasOwn(value, "street2") || typeof value.street2 === "string") &&
//     typeof value.city === "string"
//   )
// }
```

#### See also
- [`JsonSchema.check`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemacheck)


### `JsonSchema.deepClone`

`JsonSchema.deepClone` lets users derive a specialized ["deep copy"](https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy) function that works with values that have been already validated.

Because the values have already been validated, clone times are significantly faster than alternatives like [`window.structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone) and [lodash.cloneDeep](https://www.npmjs.com/package/lodash.clonedeep).

#### Performance comparison

Here's a [Bolt sandbox](https://bolt.new/~/mitata-4mmmdyre) if you'd like to run the benchmarks yourself.

```
                           ┌─────────────────┐
                           │        Average  │
┌──────────────────────────┼─────────────────┤
│  Lodash.cloneDeep        │  13.99x faster  │
├──────────────────────────┼─────────────────┤
│  window.structuredClone  │  17.23x faster  │
└──────────────────────────┴─────────────────┘
```

[This article](https://dev.to/ahrjarrett/how-i-built-javascripts-fastest-deep-clone-function-5fe0) goes into more detail about what makes `JsonSchema.deepClone` so fast.


<details>
<summary>Click to see the detailed benchmark summary</summary>

```
Lodash                       868.72 ns/iter   1.00 µs                 ▇█
                      (269.22 ns … 1.20 µs)   1.14 µs                 ██
                    (  8.05  b … 963.18  b) 307.93  b ▃▂▁▁▁▁▆▅▇▃▂▁▁▂▃███▅▃▁
                  3.64 ipc (  1.47% stalls)  98.24% L1 data cache
          2.41k cycles   8.77k instructions  38.66% retired LD/ST (  3.39k)

structuredClone                1.07 µs/iter   1.08 µs    ▄█▄
                        (1.02 µs … 1.24 µs)   1.22 µs   ▃███▄▂
                    ( 13.91  b … 369.62  b)  38.79  b ▁▅██████▄▂▄▃▁▂▂▂▂▂▁▁▁
                  4.35 ipc (  1.33% stalls)  98.23% L1 data cache
          3.10k cycles  13.50k instructions  34.90% retired LD/ST (  4.71k)

JSON.stringify + JSON.parse  527.05 ns/iter 575.48 ns       █    ▃
                      (367.58 ns … 2.30 µs) 732.21 ns      ██    █▇
                    (  3.97  b … 383.93  b)  75.70  b ▃▃▁▂▆███▃▅███▆▄▂▂▂▁▁▁
                  4.41 ipc (  1.07% stalls)  98.42% L1 data cache
          1.53k cycles   6.73k instructions  36.86% retired LD/ST (  2.48k)

JsonSchema.deepClone          62.08 ns/iter  65.56 ns     █▅
                      (8.95 ns … 255.66 ns) 208.93 ns     ██▄
                    (  1.92  b … 214.18  b)  47.77  b ▄▁▁▇███▅▂▁▁▁▁▁▁▁▁▂▂▂▁
                  2.94 ipc (  1.29% stalls)  98.86% L1 data cache
         164.89 cycles  485.47 instructions  44.83% retired LD/ST ( 217.63)

                      Lodash ┤■■■■■■■■■■■■■■■■■■■■■■■■■■■ 868.72 ns
             structuredClone ┤■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 1.07 µs
 JSON.stringify + JSON.parse ┤■■■■■■■■■■■■■■■■ 527.05 ns
        JsonSchema.deepClone ┤ 62.08 ns
                             └                                            ┘

                             ┌                                            ┐
                                       ╷              ┌──────┬────┐    ╷
                      Lodash           ├──────────────┤      │    ├────┤
                                       ╵              └──────┴────┘    ╵
                                                                   ╷┬┐    ╷
             structuredClone                                       ├│├────┤
                                                                   ╵┴┘    ╵
                                          ╷   ┌─┬─┐     ╷
 JSON.stringify + JSON.parse              ├───┤ │ ├─────┤
                                          ╵   └─┴─┘     ╵
                             ╷┌┬    ╷
        JsonSchema.deepClone ├┤│────┤
                             ╵└┴    ╵
                             └                                            ┘
                             8.95 ns           613.29 ns            1.22 µs

summary
  JsonSchema.deepClone
   8.49x faster than JSON.stringify + JSON.parse
   13.99x faster than Lodash
   17.23x faster than structuredClone
```

For a more detailed breakdown, see [all the benchmark results](https://github.com/traversable/schema/tree/main/benchmarks).

</details>

#### Example

```typescript
import { JsonSchema } from '@traversable/json-schema'

const Address = {
  type: 'object',
  required: ['street1', 'city'],
  properties: {
    street1: { type: 'string' },
    street2: { type: 'string' },
    city: { type: 'string' },
  }
} as const

const deepClone = JsonSchema.deepClone(Address)
const deepEqual = JsonSchema.deepEqual(Address)

const sherlock = { street1: '221 Baker St', street2: '#B', city: 'London' }
const harry = { street1: '4 Privet Dr', city: 'Little Whinging' }

const sherlockCloned = deepClone(sherlock)
const harryCloned = deepClone(harry)

deepEqual(sherlockCloned, sherlock) // => true
sherlock === sherlockCloned         // => false

deepEqual(harryCloned, harry)       // => true
harry === harryCloned               // => false
```

#### See also
- [`JsonSchema.deepClone.writeable`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemadeepclonewriteable)


### `JsonSchema.deepClone.writeable`

`JsonSchema.deepClone.writeable` lets users derive a specialized "deep clone" function that works with values that have been already validated.

Compared to [`JsonSchema.deepClone`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemadeepclone), `JsonSchema.deepClone.writeable` returns
the clone function in _stringified_ ("writeable") form.

#### Example

```typescript
import { JsonSchema } from '@traversable/json-schema'

const deepClone = JsonSchema.deepClone.writeable({
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
- [`JsonSchema.deepClone`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemadeepclone)

### `JsonSchema.deepEqual`

`JsonSchema.deepEqual` lets users derive a specialized "deep equal" function that works with values that have been already validated.

Because the values have already been validated, comparison times are significantly faster than alternatives like [`NodeJS.isDeepStrictEqual`](https://nodejs.org/api/util.html#utilisdeepstrictequalval1-val2) and [lodash.isEqual](https://www.npmjs.com/package/lodash.isequal).

#### Performance comparison

Here's a [Bolt sandbox](https://bolt.new/~/mitata-fmcqx1bx) if you'd like to run the benchmarks yourself.

```
                             ┌────────────────┬────────────────┐
                             │   Array (avg)  │  Object (avg)  │
┌────────────────────────────┼────────────────┼────────────────┤
│  NodeJS.isDeepStrictEqual  │  40.3x faster  │  56.5x faster  │
├────────────────────────────┼────────────────┼────────────────┤
│  Lodash.isEqual            │  53.7x faster  │  60.1x faster  │
└────────────────────────────┴────────────────┴────────────────┘
```

[This article](https://dev.to/ahrjarrett/how-i-built-javascripts-fastest-deep-equals-function-51n8) goes into more detail about what makes `JsonSchema.deepEqual` so fast.

#### Notes
- Best performance
- Works in any environment that supports defining functions using the `Function` constructor
- **Note:** generated functions will not work on Cloudflare workers due to a CSP that blocks the use of `Function`

#### Example

```typescript
import { JsonSchema } from '@traversable/json-schema'

const deepEqual = JsonSchema.deepEqual({
  type: 'object',
  required: ['street1', 'city'],
  properties: {
    street1: { type: 'string' },
    street2: { type: 'string' },
    city: { type: 'string' },
  }
})

deepEqual(
  { street1: '221 Baker St', street2: '#B', city: 'London' },
  { street1: '221 Baker St', street2: '#B', city: 'London' }
) // => true

deepEqual(
  { street1: '221 Baker St', street2: '#B', city: 'London' },
  { street1: '4 Privet Dr', city: 'Little Whinging' }
) // => false
```

#### See also
- [`JsonSchema.deepEqual.writeable`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemadeepequalwriteable)


### `JsonSchema.deepEqual.writeable`

`JsonSchema.deepEqual.writeable` lets users derive a specialized "deep equal" function that works with values that have been already validated.

Compared to [`JsonSchema.deepEqual`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemadeepequal), `JsonSchema.deepEqual.writeable` returns
the deep equal function in _stringified_ ("writeable") form.

#### Notes
- Useful when you're consuming a set of JSON Schemas and writing all them to disc somewhere
- Also useful for testing purposes or for troubleshooting, since it gives you a way to "see" exactly what the deepEqual functions are doing

#### Example

```typescript
import { JsonSchema } from '@traversable/json-schema'

const deepEqual = JsonSchema.deepEqual.writeable({
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
- [`JsonSchema.deepEqual`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemadeepequal)


### `JsonSchema.fold`

> [!NOTE]
> `JsonSchema.fold` is an advanced API.

Use `JsonSchema.fold` to define a recursive traversal of a JSON Schema. Useful when building a schema rewriter.

#### What does it do?

Writing an arbitrary traversal with `JsonSchema.fold` is:

1. non-recursive
2. 100% type-safe

The way it works is pretty simple: if you imagine all the places in the JSON Schema specification that are recursive, those "holes" will be the type that you provide via type parameter.

#### Example

As an example, let's write a function called `check` that takes a JSON Schema, and returns a function that validates its input against the schema.

Here's how you could use `JsonSchema.fold` to implement it:

```typescript
import { JsonSchema } from '@traversable/json-schema'

const isObject = (u: unknown): u is { [x: string]: unknown } => 
  !!u && typeof u === 'object' && !Array.isArray(u)

const check = JsonSchema.fold<(data: unknown) => boolean>(
  (schema) => { //             𐙘_______________________𐙘
                //   this type will fill the "holes" in our schema
    switch (true) {
      case JsonSchema.isNull(schema): 
        return (data) => data === null
      case JsonSchema.isBoolean(schema): 
        return (data) => typeof data === 'boolean'
      case JsonSchema.isInteger(schema): 
        return (data) => Number.isSafeInteger(data)
      case JsonSchema.isNumber(schema): 
        return (data) => Number.isFinite(data)
      case JsonSchema.isArray(schema): 
        return (data) => Array.isArray(data) 
          && schema.every(schema.items)
          //                     𐙘___𐙘
          //                     items: (data: unknown) => boolean
      case JsonSchema.isObject(schema): 
        return (data) => isObject(data) 
          && Object.entries(schema.properties).every(
            ([key, property]) => schema.required.includes(key) 
              //   𐙘______𐙘 
              //   property: (data: unknown) => boolean
              ? (Object.hasOwn(data, key) && property(data[key]))
              : (!Object.hasOwn(data, key) || property(data[key]))
          )
      default: return () => false
    }
  }
)

// Let's use `check` to create a predicate:
const isBooleanArray = check({
  type: 'array',
  items: { type: 'boolean' } 
})

// Using the predicate looks like this:
isBooleanArray([false])    // true
isBooleanArray([true, 42]) // false
```

That's it! 

If you'd like to see a more complex example, here's [how `JsonSchema.check` is actually implemented](https://github.com/traversable/schema/blob/main/packages/json-schema-types/src/check.ts).

#### Theory

`JsonSchema.fold` is similar to, but more powerful than, the [visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern). 

If you're curious about the theory behind it, its implementation was based on a 1991 paper called [Functional Programming with Bananas, Lenses, Envelopes and Barbed Wire](https://maartenfokkinga.github.io/utwente/mmf91m.pdf).

#### See also
- [`JsonSchema.Functor`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemafunctor)

### `JsonSchema.Functor`

> [!NOTE]
> `JsonSchema.Functor` is an advanced API.

`JsonSchema.Functor` is the primary abstraction that powers `@traversable/json-schema`.

`JsonSchema.Functor` is a powertool. Most of `@traversable/json-schema` uses `JsonSchema.Functor` under the hood.

Compared to the rest of the library, it's fairly "low-level", so unless you're doing something pretty advanced you probably won't need to use it directly.

#### See also
- [`JsonSchema.fold`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemafold)
