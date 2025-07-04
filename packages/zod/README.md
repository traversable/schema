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

- Example

```typescript
import { z } from 'zod/v4'
import { zx } from "@traversable/zod"

////////////////////
///  example #1  ///
////////////////////

let schema_01 = z.tuple([z.string(), z.bigint()])
let lens_01 = zx.makeLens(schema_01)

lens_01
// ^? let lens_01: zx.SchemaLens<[string, bigint], string>

let get_01 = lens_01.get(['', 0n])
//    ^? let get_01: string
console.log(get_01) // => ''

let set_01 = lens_01.set('hey', ['', 0n])
//    ^? let set_01: [string, bigint]
console.log(set_01) // => ['hey', 0n]

let modify_01 = lens_01.modify((s) => string.length > 0, ['', 0n])
//    ^? let modify_01: [boolean, bigint]
console.log(modify_01) // => [false, 0n]


////////////////////
///  example #2  ///
////////////////////

let schema_02 = z.union([
  z.object({
    tag: z.literal('ONE'),
    ghi: z.number(),
  }),
  z.object({
    tag: z.literal('TWO'),
    jkl: z.boolean(),
  })
])

let lens_02 = zx.makeLens(
  schema,
  $ => $.ꖛONE.ghi
)

lens_02
// ^? let lens_02: zx.SchemaLens<
//      | { tag: "ONE", ghi: number } 
//      | { tag: "TWO", jkl: boolean }, 
//      number | undefined
//    >

let get_02A = lens_02.get({ tag: 'ONE', ghi: 0 })
//  ^? let get_02A: number | undefined
console.log(get_02A) // => 0

let get_02B = lens_02.get({ tag: 'TWO', jkl: true })
//  ^? let get_02B: number | undefined
console.log(get_02B) // => undefined

let set_02A = lens_02.set(9000, { tag: 'ONE', ghi: 0 })
//  ^? let set_02A: { tag: "ONE", ghi: number } | { tag: "TWO", jkl: boolean }
console.log(set_02A) // => { tag: 'ONE', ghi: 9000 }

let set_02B = lens_02.set(9000, { tag: 'TWO', jkl: true })
//  ^? let set_02B: { tag: "ONE", ghi: number } | { tag: "TWO", jkl: boolean }
console.log(set_02B) // => { tag: 'TWO', jkl: true }

let modify_02A = lens_02.modify((n) => [n, n] as const, { tag: 'ONE', ghi: 0 })
//  ^? let modify_02A: 
//     | { tag: "ONE", ghi: readonly [number, number] } 
//     | { tag: "TWO", jkl: boolean }
console.log(modify_02A) // => { tag: 'ONE', ghi: [0, 0] }

let modify_02B = lens_02.modify((n) => [n, n] as const, { tag: 'TWO', jkl: true })
//  ^? let modify_02B: 
//     | { tag: "ONE", ghi: readonly [number, number] } 
//     | { tag: "TWO", jkl: boolean }
console.log(modify_02B) // => { tag: 'TWO', jkl: true }
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

