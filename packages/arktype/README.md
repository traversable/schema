<br>
<h1 align="center">ᯓ𝘁𝗿𝗮𝘃𝗲𝗿𝘀𝗮𝗯𝗹𝗲/𝗮𝗿𝗸𝘁𝘆𝗽𝗲</h1>
<br>

<p align="center">
  <code>@traversable/arktype</code> is a schema rewriter for <a href="https://github.com/arktypeio/arktype" target="_blank"><code>ArkType</code></a> schemas.
</p>

<div align="center">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40traversable%2Farktype?style=flat-square&logo=npm&label=npm&color=blue">
  &nbsp;
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.5%2B-blue?style=flat-square&logo=TypeScript&logoColor=4a9cf6">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/static/v1?label=Hippocratic%20License&message=HL3-FULL&labelColor=5e2751&color=bc8c3d">
  &nbsp;
  <img alt="npm" src="https://img.shields.io/npm/dt/@traversable/arktype?style=flat-square">
  &nbsp;
</div>

<div align="center">
  <!-- <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/%40traversable/arktype?style=flat-square&label=size">
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
> Currently this package only supports ArkType schemas that can be compiled to <a href="https://json-schema.org/draft/2020-12" target="_blank">JSON Schema Draft 2020-12</a>.
> We're in the process of adding support for all schemas.

## Getting started

```bash
$ pnpm add @traversable/arktype
```

Here's an example of importing the library:

```typescript
import { type } from 'arktype'
import { ark } from '@traversable/arktype'

// or, if you prefer, you can use named imports:
import { deepClone, deepEqual } from '@traversable/arktype'

// see below for specific examples
```


## Table of contents

### Fuzz-tested, production ready

- [`ark.deepClone`](https://github.com/traversable/schema/tree/main/packages/arktype#arkdeepclone)
- [`ark.deepClone.writeable`](https://github.com/traversable/schema/tree/main/packages/arktype#arkdeepclonewriteable)
- [`ark.deepEqual`](https://github.com/traversable/schema/tree/main/packages/arktype#arkdeepequal)
- [`ark.deepEqual.writeable`](https://github.com/traversable/schema/tree/main/packages/arktype#arkdeepequalwriteable)

## Features

### `ark.deepClone`

`ark.deepClone` lets users derive a specialized "deep clone" function that works with values that have been already validated.

Because the values have already been validated, clone times are significantly faster than alternatives like <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone" target="_blank"><code>window.structuredClone</code></a> and <a href="https://www.npmjs.com/package/lodash.clonedeep" target="_blank"><code>lodash.cloneDeep</code></a>.


#### Performance comparison

Here's a <a href="https://bolt.new/~/mitata-rsvrkywj" target="_blank">Bolt sandbox</a> if you'd like to run the benchmarks yourself.

```
                           ┌─────────────────┐
                           │        Average  │
┌──────────────────────────┼─────────────────┤
│  window.structuredClone  │  14.82x faster  │
├──────────────────────────┼─────────────────┤
│  Lodash.cloneDeep        │  18.86x faster  │
└──────────────────────────┴─────────────────┘
``` 

<a href="https://dev.to/ahrjarrett/how-i-built-javascripts-fastest-deep-clone-function-5fe0" target="_blank">This article</a> goes into more detail about what makes `ark.deepClone` so fast.

#### Example

```typescript
import { type } from 'arktype'
import { deepClone, deepEqual } from '@traversable/arktype'

const Address = type({
  street1: 'string',
  "street2?": 'string',
  city: 'string'
})

const cloneAddress = deepClone(Address)
const addressEquals = deepEqual(Address)

const sherlock = { street1: '221 Baker St', street2: '#B', city: 'London' }
const harry = { street1: '4 Privet Dr', city: 'Little Whinging' }

const sherlockCloned = cloneAddress(sherlock)
const harryCloned = cloneAddress(harry)

addressEquals(sherlockCloned, sherlock) // => true
sherlock === sherlockCloned             // => false

addressEquals(harryCloned, harry)       // => true
harry === harryCloned                   // => false
```

#### See also
- [`ark.deepClone.writeable`](https://github.com/traversable/schema/tree/main/packages/arktype#arkdeepclonewriteable)


### `ark.deepClone.writeable`

`ark.deepClone.writeable` lets users derive a specialized "deep clone" function that works with values that have been already validated.

Because the values have already been validated, clone times are significantly faster than alternatives like <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone" target="_blank"><code>window.structuredClone</code></a> and <a href="https://www.npmjs.com/package/lodash.clonedeep" target="_blank"><code>lodash.cloneDeep</code></a>.

Compared to [`ark.deepClone`](https://github.com/traversable/schema/tree/main/packages/arktype#arkdeepclone), `ark.deepClone.writeable` returns
the clone function in _stringified_ ("writeable") form.

#### Example

```typescript
import { type } from 'arktype'
import { deepClone } from '@traversable/arktype'

const cloneAddress = deepClone.writeable(
  type({
    street1: 'string',
    "street2?": 'string',
    city: 'string'
  }),
  { typeName: 'Address' }
)

console.log(cloneAddress)
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
- [`ark.deepClone`](https://github.com/traversable/schema/tree/main/packages/arktype#arkdeepclone)


### `ark.deepEqual`

`ark.deepEqual` lets users derive a specialized "deep equal" function that works with values that have been already validated.

Because the values have already been validated, comparison times are significantly faster than alternatives like <a href="https://nodejs.org/api/util.html#utilisdeepstrictequalval1-val2" target="_blank"><code>NodeJS.isDeepStrictEqual</code></a> and <a href="https://www.npmjs.com/package/lodash.isequal" target="_blank"><code>lodash.isEqual</code></a>.

#### Performance comparison

Here's a <a href="https://bolt.new/~/mitata-ad6vt4ss" target="_blank">Bolt sandbox</a> if you'd like to run the benchmarks yourself.

```
                             ┌─────────────────┐
                             │        Average  │
┌────────────────────────────┼─────────────────┤
│  NodeJS.isDeepStrictEqual  │  23.45x faster  │
├────────────────────────────┼─────────────────┤
│  Lodash.isEqual            │  49.29x faster  │
└────────────────────────────┴─────────────────┘
```

<a href="https://dev.to/ahrjarrett/how-i-built-javascripts-fastest-deep-equals-function-51n8" target="_blank">This article</a> goes into more detail about what makes `ark.deepEqual` so fast.

#### Notes
- Best performance
- Works in any environment that supports defining functions using the `Function` constructor
- **Note:** generated functions will not work on Cloudflare workers due to a CSP that blocks the use of `Function`

#### Example

```typescript
import { type } from 'arktype'
import { deepEqual } from '@traversable/arktype'

const addressEquals = deepEqual(
  type({
    street1: 'string',
    "street2?": 'string',
    city: 'string'
  })
)

addressEquals(
  { street1: '221 Baker St', street2: '#B', city: 'London' },
  { street1: '221 Baker St', street2: '#B', city: 'London' }
) // => true

addressEquals(
  { street1: '221 Baker St', street2: '#B', city: 'London' },
  { street1: '4 Privet Dr', city: 'Little Whinging' }
) // => false
```

#### See also
- [`ark.deepEqual.writeable`](https://github.com/traversable/schema/tree/main/packages/arktype#arkdeepequalwriteable)


### `ark.deepEqual.writeable`

`ark.deepEqual.writeable` lets users derive a specialized "deep equal" function that works with values that have been already validated.

Because the values have already been validated, comparison times are significantly faster than alternatives like <a href="https://nodejs.org/api/util.html#utilisdeepstrictequalval1-val2" target="_blank"><code>NodeJS.isDeepStrictEqual</code></a> and <a href="https://www.npmjs.com/package/lodash.isequal" target="_blank"><code>lodash.isEqual</code></a>.

Compared to [`ark.deepEqual`](https://github.com/traversable/schema/tree/main/packages/arktype#arkdeepequal), `ark.deepEqual.writeable` returns
the deep equal function in _stringified_ ("writeable") form.

#### Notes
- Useful when you're consuming a set of ArkType schemas and writing all them to disc somewhere
- Also useful for testing purposes or for troubleshooting, since it gives you a way to "see" exactly what the deepEqual functions are doing

#### Example

```typescript
import { type } from 'arktype'
import { deepEqual } from '@traversable/arktype'

const addressEquals = deepEqual.writeable(
  type({
    street1: 'string',
    "street2?": 'string',
    city: 'string'
  }), 
  { typeName: 'Address' }
)

console.log(addressEquals)
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
- [`ark.deepEqual`](https://github.com/traversable/schema/tree/main/packages/arktype#arkdeepequal)
