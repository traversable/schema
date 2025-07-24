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
  <img alt="Static Badge" src="https://img.shields.io/badge/license-MIT-a094a2?style=flat-square">
  &nbsp;
  <img alt="npm" src="https://img.shields.io/npm/dt/@traversable/json-schema?style=flat-square">
  &nbsp;
</div>

<div align="center">
  <!-- <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/%40traversable/json-schema?style=flat-square&label=size">
  &nbsp; -->
  <img alt="Static Badge" src="https://img.shields.io/badge/ESM-supported-2d9574?style=flat-square&logo=JavaScript">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/CJS-supported-2d9574?style=flat-square&logo=Node.JS">
  &nbsp;
</div>
<br>
<br>

> ![NOTE]
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

- Better performance than [`JsonSchema.check.writeable`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemacheckwriteable)
- Works in any environment that supports defining functions using the `Function` constructor
- Generated functions **will not work on Cloudflare workers** due to a CSP that blocks the use of `Function`

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

`JsonSchema.deepClone` lets users derive a specialized ["deep clone"](https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy) function that works with values that have been already validated.

Because the values have already been validated, clone times are significantly faster than alternatives like [`window.structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone) and [`lodash.cloneDeep`](https://www.npmjs.com/package/lodash.clonedeep).

<!-- #### Performance comparison

Here's a [Bolt sandbox](https://bolt.new/~/mitata-kytjqemn) if you'd like to run the benchmarks yourself.

```
                           ┌───────────────┬────────────────┐
                           │  Array (avg)  │  Object (avg)  │
┌──────────────────────────┼───────────────┼────────────────┤
│  window.structuredClone  │  4.8x faster  │   5.3x faster  │
├──────────────────────────┼───────────────┼────────────────┤
│  Lodash.cloneDeep        │  9.1x faster  │  13.7x faster  │
└──────────────────────────┴───────────────┴────────────────┘
``` -->

<!-- [This article](https://dev.to/ahrjarrett) goes into more detail about what makes `JsonSchema.deepClone` so fast. -->

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

const deepClone = JsonSchema.deepClone(Address, { typeName: 'Type' })
const deepEqual = JsonSchema.deepEqual(Address, { typeName: 'Type' })

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
- [`JsonSchema.deepClone.writeable`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemaclonewriteable)


### `JsonSchema.deepClone.writeable`

`JsonSchema.deepClone.writeable` lets users derive a specialized "deep clone" function that works with values that have been already validated.

Because the values have already been validated, clone times are significantly faster than alternatives like [`window.structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone) and [`lodash.cloneDeep`](https://www.npmjs.com/package/lodash.clonedeep).

Compared to [`JsonSchema.clone`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemaclone), `JsonSchema.clone.writeable` returns
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
}, { typeName: 'Type' })

console.log(deepClone) 
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
- [`JsonSchema.deepClone`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemadeepclone)

### `JsonSchema.deepEqual`

`JsonSchema.deepEqual` lets users derive a specialized "deep equal" function that works with values that have been already validated.

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
  { street1: '221B Baker St', city: 'London' },
  { street1: '221B Baker St', city: 'London' }
) // => true

deepEqual(
  { street1: '221B Baker St', city: 'London' },
  { street1: '4 Privet Dr', city: 'Little Whinging' }
) // => false
```

#### See also
- [`JsonSchema.deepEqual.writeable`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemadeepequalwriteable)


### `JsonSchema.deepEqual.writeable`

`JsonSchema.deepEqual.writeable` lets users derive a specialized "deep equal" function that works with values that have been already validated.

Compared to [`JsonSchema.deepEqual`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemadeepequal), `JsonSchema.deepEqual.writeable` returns
the deep equal function in _stringified_ ("writeable") form.

Because the values have already been validated, comparison times are significantly faster than alternatives like [`NodeJS.isDeepStrictEqual`](https://nodejs.org/api/util.html#utilisdeepstrictequalval1-val2) and [`lodash.isEqual`](https://www.npmjs.com/package/lodash.isequal).

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
// function equals(x: Address, y: Address) {
//   if (x === y) return true;
//   if (x.street1 !== y.street1) return false;
//   if (x.street2 !== y.street2) return false;
//   if (x.city !== y.city) return false;
//   return true;
// }
```

#### See also
- [`JsonSchema.deepEqual`](https://github.com/traversable/schema/tree/main/packages/json-schema#jsonschemadeepequal)

