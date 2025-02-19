# @traversable/json

`@traversable/json` is a tiny package that contains types and utilities for
working with JSON data in TypeScript.

It ships a single namespace, `Json`, that let you apply transformations to
any arbitrary JSON value, without having to think about recursion at all.

## Examples

### `Json.fold`

If you've ever used `Array.prototype.reduce` before, similar idea: folding
lets you apply an arbitrary transformation a JSON value. 

Unlike `Json.map`, which is structure-preserving, the function passed to 
`Json.fold` does not need to preserve structure, and can transform values
into any shape (this is what makes it similar to `[].reduce`).


 here's a working implementation of a custom JSON serializer:

```typescript
import { Json } from '@traversable/json'

const toString = Json.fold((x) => {
  switch (true) {
    case Json.isScalar(x): return typeof x === 'string' ? `"${x}"` : String(x)
    case Json.isArray(x): return '[' +  x.join(', ') + ']'
    case Json.isObject(x): return '{' + Object.entries(x).map(([k, v]) => `${k}: ${v}`).join(', ') + '}'
  }
})
```

## How is this possible?

This library heavily exploits a well-founded pattern called __recursion schemes__.

Recursion schemes let you "factor out" recursion. They discovered in the 1990s by
category theorists, and before long they seeped their way into the Haskell community.
Unfortunately they have not yet made their way into the industry.


It is this library's explicit goal to showcase how useful recursion schemes are,
and how you can use them today to write recursive programs that:

1. are simple, almost trivial, to implement
2. are easy to read and understand
3. will, over time, give you a solid intuition for recursion in general
