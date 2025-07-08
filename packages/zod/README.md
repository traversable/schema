<br>
<h1 align="center">ᯓ𝘁𝗿𝗮𝘃𝗲𝗿𝘀𝗮𝗯𝗹𝗲/𝘇𝗼𝗱</h1>
<br>

<p align="center"><code>@traversable/zod</code> or <strong><code>zx</code></strong> is an expansion pack for <code>zod</code>.</p>

<p align="center">The primary abstraction that powers <strong><code>zx</code></strong> is an obscure, if surprisingly useful idea from category theory called <a href="https://github.com/recursion-schemes/recursion-schemes" target="_blank">recursion schemes</a> (and don't worry -- I promise you don't need any math to use <strong><code>zx</strong></code> 😌).
</p>

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
  <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/%40traversable/zod?style=flat-square&label=size">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/ESM-supported-2d9574?style=flat-square&logo=JavaScript">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/CJS-supported-2d9574?style=flat-square&logo=Node.JS">
  &nbsp;
</div>

<div align="center">
  <a href="https://stackblitz.com/edit/traversable?file=src%2Fsandbox.tsx" target="_blank">Demo (StackBlitz)</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsplay.dev/w2y29W" target="_blank">TypeScript Playground</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://www.npmjs.com/package/@traversable/zod" target="_blank">npm</a>
  <br>
</div>
<br>
<br>

## Requirements

`@traversable/schema` has 2 peer dependencies:

1. [zod](https://zod.dev/) (v4, classic)
2. [fast-check](https://fast-check.dev/)

## Usage

```bash
$ pnpm add @traversable/schema zod fast-check
```

Here's an example of importing the library:

```typescript
import { z } from 'zod/v4'
import { zx } from '@traversable/zod'

// see below for usage examples
```


## Features

### Combinators

#### `zx.deepNullable`

- Example

```typescript
import { z } from 'zod/v4'
import { zx } from '@traversable/zod'

const MySchema = zx.deepNullable(z.object({ a: z.number(), b: z.object({ c: z.string() }) }))

type MySchema = z.infer<typeof MySchema>
//   ^? type MySchema = { a: number | null, b: { c: string | null } | null }
```

#### `zx.deepPartial`

- Example

```typescript
import { z } from 'zod/v4'
import { zx } from '@traversable/zod'

const MySchema = zx.deepPartial(z.object({ a: z.number(), b: z.object({ c: z.string() }) }))

type MySchema = z.infer<typeof MySchema>
//   ^? type MySchema = { a?: number, b?: { c?: string } }
```

#### `zx.deepReadonly`

- Example

```typescript
import { z } from 'zod/v4'
import { zx } from '@traversable/zod'

const MySchema = zx.deepReadonly(z.object({ a: z.number(), b: z.object({ c: z.string() }) }))

type MySchema = z.infer<typeof MySchema>
//   ^? type MySchema = { readonly a: number, readonly b: { readonly c: string } }
```

#### `zx.defaultValue`

- Example

```typescript
import { z } from 'zod/v4'
import { zx } from '@traversable/zod'

const MySchema = z.object({
  a: z.number(),
  b: z.object({
    c: z.string(),
    d: z.array(z.boolean())
  })
})

const defaultOne = zx.defaultValue(MySchema)
console.log(defaultOne) // => { a: undefined, b: { c: undefined, d: [] } }

const defaultTwo = zx.defaultValue(MySchema, { fallbacks: { number: 0, string: '' } })
console.log(defaultTwo) // => { a: 0, b: { c: '', d: [] } }
```

#### `zx.equals`

- Example

```typescript
import { z } from 'zod/v4'
import { zx } from '@traversable/zod'

const equalsFn = zx.equals(
  z.object({
    a: z.number(),
    b: z.array(z.string()),
    c: z.tuple([z.boolean(), z.literal(1)]),
  })
)

console.log(equalsFn(
  { a: 1, b: ['hey', 'ho'], c: [false, 1] },
  { a: 1, b: ['hey', 'ho'], c: [false, 1] }
)) // => true

console.log(equalsFn(
  { a: 9000, b: [], c: [true, 1] },
  { a: 9000, b: [], c: [true, 1] }
)) //  => true

console.log(equalsFn(
  { a: 1, b: ['hey', 'ho'], c: [false, 1] },
  { a: 1, b: ['hey'], c: [false, 1] }
)) // => false

console.log(equalsFn(
  { a: 9000, b: [], c: [true, 1] },
  { a: 9000, b: [], c: [false, 1] }
)) // => false
```

#### `zx.paths`

- Example

```typescript
import { z } from 'zod/v4'
import { zx } from "@traversable/zod"

console.log(
  zx.classic.paths(z.object({ a: z.object({ c: z.string() }), b: z.number() }))
) // => [[".a", ".c"], [".b"]]
```

#### `zx.toString`

- Example

```typescript
import { z } from 'zod/v4'
import { zx } from "@traversable/zod"

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

### Utilities

#### `zx.typeof`

- Example

```typescript
import { z } from 'zod/v4'
import { zx } from "@traversable/zod"

console.log(
  zx.typeof(
    z.string()
  )
) // => string
```

## Experimental Features

### Combinators

#### `zx.makeLens`

`zx.makeLens` accepts a zod schema (classic, v4) as its first argument, and a
"selector function" as its second argument.

An optic is a generalization of a _lens_, but since most people use "lens" to refer
to optics generally, they are sometimes used interchangeably in this document.

With `zx.makeLens`, you use a selector function to build up an _optic_ via a series of property accesses.

Let's look at a few examples to make things more concrete.

##### Example #1: Lens

For our first example, let's create a lens that focuses on a structure's `"a[0]"` path:

```typescript
import { z } from 'zod/v4'
import { zx } from "@traversable/zod"

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

##### Example #2: Prism

When you use `zx.makeLens` on a __union type__, you get back a different kind
of lens called a __prism__.

Let's see how prisms differ from lenses:

```typescript
import { z } from 'zod/v4'
import { zx } from "@traversable/zod"

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

##### Example #3: Traversal

When you use `zx.makeLens` on a __collection type__ (such as `z.array` or `z.record`),
you get back a different kind of lens called a __traversal__.

Let's see how traversals differ from lenses and prisms:

```typescript
import { z } from 'zod/v4'
import { zx } from "@traversable/zod"

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

### Combinators

#### `zx.fold`

#### `zx.Functor`

#### `zx.seedToSchema`

#### `zx.seedToValidData`

#### `zx.seedToInvalidData`

### Arbitraries

#### `zx.SchemaGenerator`

#### `xs.SeedReproduciblyValidGenerator`

#### `zx.SeedReproduciblyInvalidGenerator`

