<br />
  <h1 align="center">ᯓ𝘁𝗿𝗮𝘃𝗲𝗿𝘀𝗮𝗯𝗹𝗲/𝗷𝘀𝗼𝗻</h1>
<br />

<p align="center">
<code>@traversable/json</code> is a tiny package that contains types and 
<br />
utilities for transforming JSON data in TypeScript.
</p>

<div align="center">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40traversable%2Fjson?style=flat-square&logo=npm&label=npm&color=blue">
  &nbsp;
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.5%2B-blue?style=flat-square&logo=TypeScript&logoColor=4a9cf6">
  &nbsp;
  <img alt="License" src="https://img.shields.io/static/v1?label=Hippocratic%20License&message=HL3&labelColor=59636e&color=838a93">
  &nbsp;
  <img alt="npm" src="https://img.shields.io/npm/dt/@traversable/json?style=flat-square">
  &nbsp;
</div>

<div align="center">
  <!-- <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/%40traversable/json?style=flat-square&label=size">
  &nbsp; -->
  <img alt="Static Badge" src="https://img.shields.io/badge/%F0%9F%8C%B2-tree--shakeable-brightgreen?labelColor=white">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/ESM-supported-2d9574?style=flat-square&logo=JavaScript">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/CJS-supported-2d9574?style=flat-square&logo=Node.JS">
  &nbsp;
</div>

<div align="center">
  <a href="https://stackblitz.com/edit/vitest-dev-vitest-hv2lxhtc?file=src%2Fjson.ts" target="_blank">Demo (StackBlitz)</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsplay.dev/w2y59W" target="_blank">TypeScript Playground</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://dev.to/ahrjarrett/typesafe-recursion-in-typescript-1pe0" target="_blank">Original Blog Post</a>
  <br />
</div>
<br />

<br />
<br />

## API

### Types

#### `Json`

If no type parameter is provided, describes any JSON value.

Note that, like JSON values, the `Json` type is _recursive_. If you'd like to
try out the non-recursive version, provide `Json` a type parameter.

If a type parameter is provided, e.g. `Json<string[]>`, the resulting type will be:

```typescript
import type { Json } from '@traversable/json'

type MyNonRecursiveJsonType = Json<string[]>
//   ^? type MyNonRecursiveJsonType = 
//        | null 
//        | boolean 
//        | number 
//        | string 
//        | string[][] 
//        | { [x: string]: string[] }
//
```

#### Q: What's the point of the non-recursive type?

The non-recursive type comes in handy when you're using an abstraction like `Json.fold`,
which lets you implement a recursive function, without performing any recursion.

This is the main feature of `Json.fold` (which is made possible by `Json.map`) is
that it fully decouples "how to recurse" from "what to do at each step".

For more information, see the docs on [`Json.fold`](https://github.com/traversable/schema/tree/main/packages/json#jsonfold).

### Terms (values)

#### `Json.map`

Like `Array.prototype.map`, `Json.map` takes a function that accepts any JSON
input and returns an arbitrary value, and the JSON you'd like to map over.

If the JSON value is an array, `Json.map` will apply the function to every element
of the array, preserving the structure of the input array.

If the JSON value is an object, `Json.map` will apply the function to every value
of the object, preserving the index signature of the input object.

Note that the function will not have any effect if its input is a scalar value
(`null`, `boolean`, `number` or `string`).

Note that the function will only be applied to a single level. If you need to apply 
a function recursively (to every level of the JSON value), use `Json.fold`.

#### `Json.fold`

Applies a non-recursive function to a JSON value, recursively.

If you only want to apply the function at the top-level, use `Json.map`.

Note that the function is applied from the __bottom-up__ (that is, `Json.fold` is a 
as a post-order traversal / transformation).

##### Examples

Here's a custom JSON serializer:

```typescript
import { Json } from '@traversable/json'
import { parseKey } from '@traversable/registry'

const serialize = Json.fold((x) => {
  switch (true) {
    case Json.isScalar(x): return typeof x === 'string' ? `"${x}"` : String(x)
    case Json.isArray(x): return '[' +  x.join(', ') + ']'
    case Json.isObject(x): return '{' + Object.entries(x).map(([k, v]) => `"${k}": ${v}`).join(', ') + '}'
    // or, if you only want keys to be surrounded by quotes if the key is not a valid identifier:
    case Json.isObject(x): return '{' + Object.entries(x).map(([k, v]) => `${parseKey(k)}: ${v}`).join(', ') + '}'
  }
})
```

Here's a custom deserializer:

```typescript
import { Json } from '@traversable/json'
import { parseKey } from '@traversable/registry'

const isValidDateString = (u: unknown): u is string => 
  typeof u === 'string' && !Number.isNaN(new Date(u).getTime())

// coerce only date strings into Date objects, leaving everything else alone
const handleDateStrings = Json.fold((x) => isValidDateString(x) ? new Date(x) : x)

const deserialize = (u: string) => {
  try {
    return handleDateStrings(JSON.parse(u))
  } catch (e) {
    console.error(e)
  }
}
```

##### Things to keep in mind

As a user of `Json.fold`, the __function you write is not recursive__.

That's the point of using `Json.fold`: it lets you separate concerns.
Implementing recursion by hand is nuanced and error prone. And when you
get it working, it's _expensive to maintain_, since even a seemingly
innocent change can result in a different performance profile.

The main feature of `Json.fold` (which is made possible by `Json.map`) is
that it fully decouples "how to recurse" from "what to do at each step".

`Json.fold` also comes with a few nice-to-haves. For example, when it passes
control back to you, the caller, it actually gives you the correct types.

Let's take a closer look at the JSON serializer example from above:

```typescript
import { Json } from '@traversable/json'
import { parseKey } from '@traversable/registry'

const serializer = (x: Json<string>) => {
  //                   ^^ here I'm using the `Json` type to specify what my JSON will be in the end (a string):

  // Notice that the type of `x` is __not recursive__, and it's also __not `string`__: 
  console.log(x)
  //          ^? const x: null | boolean | number | string | string[] | { [x: string]: string }

  // Recall that recursion happens from the bottom up. If you think about it for a minute, this type makes a lot
  // of sense. In fact, that's the only type that makes sense here -- anything else is incorrect.

  switch (true) {
    case Json.isScalar(x): return typeof x === 'string' ? `"${x}"` : String(x)
    case Json.isArray(x): return '[' +  x.join(', ') + ']'
    //                                  ^ notice that the type of `x` here is `string[]` -- this is because 
    //                                    `Json.fold` has already applied your function to the "lower" levels
    //                                    of the tree, and we're on the way back "up"

    case Json.isObject(x): return '{' + Object.entries(x).map(([k, v]) => `"${k}": ${v}`).join(', ') + '}'
    //                                                 ^ here, the type of `x` is { [x: string]: string }
  }
}
```

## FAQ

### How does it work? _Why_ does it work?

This library actually doesn't introduce anything new. All it does is apply a few ideas
from category theory (a subject I find fascinating, but do not claim to be an expert in)
and ports them to JavaScript.

In the Haskell community (where these ideas first appeared in the industry), they're
called __recursion schemes__, and they've been around since circa 1991, when a famous
paper called 
[Functional Programming with Bananas, Lenses, Envelopes and Barbed Wire](https://maartenfokkinga.github.io/utwente/mmf91m.pdf)
was published.

Since then, dozens of recursion schemes have been discovered / invented. If you're
curious, the one that is used by `Json.fold` is called a "catamorphism".

It is this library's explicit goal to showcase how useful recursion schemes are,
and how you can use them today to write recursive programs that:

  1. are simple, almost trivial, to implement
  2. are easy to read and understand
  3. will, over time, give you a solid intuition for recursion in general
