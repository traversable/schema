<br />
<h1 align="center">ᯓ𝘁𝗿𝗮𝘃𝗲𝗿𝘀𝗮𝗯𝗹𝗲/𝘀𝗰𝗵𝗲𝗺𝗮-𝘁𝗼-𝘀𝘁𝗿𝗶𝗻𝗴</h1>
<br />

<p align="center">
  Adds a <code>.toType</code> method to all schemas that prints a stringified version of the type that the schema represents.
</p>

<p align="center">
  Works at both the term- and type-level.
</p>
<br />

<div align="center">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40traversable%2Fschema-to-string?style=flat-square&logo=npm&label=npm&color=blue">
  &nbsp;
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.5%2B-blue?style=flat-square&logo=TypeScript&logoColor=4a9cf6">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/license-MIT-a094a2?style=flat-square">
  &nbsp;
  <img alt="npm" src="https://img.shields.io/npm/dt/@traversable/schema-to-string?style=flat-square">
  &nbsp;
</div>

<div align="center">
  <!-- <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/%40traversable/schema-to-string?style=flat-square&label=size">
  &nbsp; -->
  <img alt="Static Badge" src="https://img.shields.io/badge/%F0%9F%8C%B2-tree--shakeable-brightgreen?labelColor=white">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/ESM-supported-2d9574?style=flat-square&logo=JavaScript">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/CJS-supported-2d9574?style=flat-square&logo=Node.JS">
  &nbsp;
</div>


<div align="center">
  <a href="https://github.com/traversable/schema/blob/main/packages/schema-to-string/test/zod-side-by-side.test.ts">Benchmarks</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsplay.dev/mbbv3m" target="_blank">TypeScript Playground</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://www.npmjs.com/package/@traversable/schema-to-string" target="_blank">npm</a>
  <br />
</div>
<br />





Works on both the term- and type-level.

- **Instructions:** To install the `.toType` method on all schemas, simply import `@traversable/schema-to-string/install`.

- Caveat: type-level functionality is provided as a heuristic only; since object keys are unordered in the TS type system, the order that the
keys are printed at runtime might differ from the order they appear on the type-level.

#### Example

Play with this example in the [TypeScript playground](https://tsplay.dev/W49jew)

```typescript
import { t } from '@traversable/schema'
import '@traversable/schema-to-string/install'
//      ↑↑ importing `@traversable/schema-to-string/install` adds the upgraded `.toType` method on all schemas

const schema_02 = t.intersect(
  t.object({
    bool: t.optional(t.boolean),
    nested: t.object({
      int: t.integer,
      union: t.union(t.tuple(t.string), t.null),
    }),
    key: t.union(t.string, t.symbol, t.number),
  }),
  t.object({
    record: t.record(t.string),
    maybeArray: t.optional(t.array(t.string)),
    enum: t.enum('x', 'y', 1, 2, null),
  }),
)

let ex_02 = schema_02.toType()
//  ^? let ex_02: "({ 
//       'bool'?: (boolean | undefined), 
//       'nested': { 'int': number, 'union': ([string] | null) }, 
//       'key': (string | symbol | number) } 
//     & { 
//        'record': Record<string, string>, 
//        'maybeArray'?: ((string)[] | undefined), 
//        'enum': 'x' | 'y' | 1 | 2 | null 
//     })"
```