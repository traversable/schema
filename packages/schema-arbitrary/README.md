<br>
<h1 align="center">ᯓ𝘁𝗿𝗮𝘃𝗲𝗿𝘀𝗮𝗯𝗹𝗲/𝘀𝗰𝗵𝗲𝗺𝗮-𝗮𝗿𝗯𝗶𝘁𝗿𝗮𝗿𝘆</h1>
<br>

<p align="center">
  Derive a [fast-check](https://github.com/dubzzz/fast-check) arbitrary from a schema from `@traversable/schema-core`.
</p>

<div align="center">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40traversable%2Fschema-arbitrary?style=flat-square&logo=npm&label=npm&color=blue">
  &nbsp;
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.5%2B-blue?style=flat-square&logo=TypeScript&logoColor=4a9cf6">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/license-MIT-a094a2?style=flat-square">
  &nbsp;
  <img alt="npm" src="https://img.shields.io/npm/dt/@traversable/schema-arbitrary?style=flat-square">
  &nbsp;
</div>

<div align="center">
  <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/%40traversable/schema-arbitrary?style=flat-square&label=size">
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
  <a href="https://www.npmjs.com/package/@traversable/schema-arbitrary" target="_blank">npm</a>
  <br>
</div>
<br>
<br>

## Installation

`@traversable/schema-arbitrary` has a peer depenency on [fast-check](https://github.com/dubzzz/fast-check). It has
been tested with version 3 and version 4.

## Getting Started

```typescript
import { t } from '@traversable/schema'
import { Arbitrary } from '@traversable/schema-arbitrary'
import * as fc from 'fast-check'

let schema = t.object({
  a: t.optional(t.string),
  b: t.integer.between(0, 100),
})

let arbitrary = Arbitrary.fromSchema(schema)

let giveMe100Mocks = fc.sample(arbitrary, 100)
```
