<br />
  <h1 align="center">ᯓ𝘁𝗿𝗮𝘃𝗲𝗿𝘀𝗮𝗯𝗹𝗲/𝗱𝗲𝗿𝗶𝘃𝗲-𝘃𝗮𝗹𝗶𝗱𝗮𝘁𝗼𝗿𝘀</h1>
<br />

<p align="center">
Re-use your schema to derive a super fast <b>validation function</b> (with even faster <em>compiled</em> validators coming soon!)
</p>

<div align="center">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40traversable%2Fderive-validators?style=flat-square&logo=npm&label=npm&color=blue">
  &nbsp;
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.5%2B-blue?style=flat-square&logo=TypeScript&logoColor=4a9cf6">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/license-MIT-a094a2?style=flat-square">
  &nbsp;
  <img alt="npm" src="https://img.shields.io/npm/dt/@traversable/derive-validators?style=flat-square">
  &nbsp;
</div>

<div align="center">
  <!-- <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/%40traversable/derive-validators?style=flat-square&label=size">
  &nbsp; -->
  <img alt="Static Badge" src="https://img.shields.io/badge/%F0%9F%8C%B2-tree--shakeable-brightgreen?labelColor=white">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/ESM-supported-2d9574?style=flat-square&logo=JavaScript">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/CJS-supported-2d9574?style=flat-square&logo=Node.JS">
  &nbsp;
</div>

<div align="center">
  <a href="https://stackblitz.com/edit/traversable?file=src%2Fsandbox.tsx" target="_blank">Demo (Stackblitz)</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsplay.dev/NaBEPm" target="_blank">TypeScript Playground</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://www.npmjs.com/package/@traversable/derive-validators" target="_blank">npm</a>
  <br />
</div>
<br />


<br />
<br />

## Overview

`.validate` is similar to `z.safeParse`, except more than an order of magnitude faster*.

- **Instructions:** To install the `.validate` method to all schemas, all you need to do is import `@traversable/derive-validators`.
- [ ] TODO: add benchmarks + write-up

### Example

Play with this example in the [TypeScript playground](https://tsplay.dev/NaBEPm).

```typescript
import { t } from '@traversable/schema'
import '@traversable/derive-validators'

let schema_01 = t.object({ 
  product: t.object({ 
    x: t.integer, 
    y: t.integer 
  }), 
  sum: t.union(
    t.tuple(t.eq(0), t.integer), 
    t.tuple(t.eq(1), t.integer),
  ),
})

let result = schema_01.validate({ product: { x: null }, sum: [2, 3.141592]})
//                     ↑↑ importing `@traversable/derive-validators` installs `.validate`

console.log(result)
// => 
// [
//   { "kind": "TYPE_MISMATCH", "path": [ "product", "x" ], "expected": "number", "got": null },
//   { "kind": "REQUIRED", "path": [ "product" ], "msg": "Missing key 'y'" },
//   { "kind": "TYPE_MISMATCH", "path": [ "sum", 0 ], "expected": 0, "got": 2 },
//   { "kind": "TYPE_MISMATCH", "path": [ "sum", 1 ], "expected": "number", "got": 3.141592 },
//   { "kind": "TYPE_MISMATCH", "path": [ "sum", 0 ], "expected": 1, "got": 2 },
//   { "kind": "TYPE_MISMATCH", "path": [ "sum", 1 ], "expected": "number", "got": 3.141592 },
// ]
```