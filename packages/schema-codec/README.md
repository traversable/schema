<br />
<h1 align="center">ᯓ𝘁𝗿𝗮𝘃𝗲𝗿𝘀𝗮𝗯𝗹𝗲/𝗱𝗲𝗿𝗶𝘃𝗲-𝗰𝗼𝗱𝗲𝗰</h1>
<br />

<p align="center">
  Re-use your schema to derive a <b>bi-directional codec</b> (with <em>compiled</em> codecs coming soon!)
</p>
<br />


<div align="center">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40traversable%2Fschema-codec?style=flat-square&logo=npm&label=npm&color=blue">
  &nbsp;
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.5%2B-blue?style=flat-square&logo=TypeScript&logoColor=4a9cf6">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/static/v1?label=Hippocratic%20License&message=HL3-FULL&labelColor=5e2751&color=bc8c3d">
  &nbsp;
  <img alt="npm" src="https://img.shields.io/npm/dt/@traversable/schema-codec?style=flat-square">
  &nbsp;
</div>

<div align="center">
  <!-- <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/%40traversable/schema-codec?style=flat-square&label=size">
  &nbsp; -->
  <img alt="Static Badge" src="https://img.shields.io/badge/%F0%9F%8C%B2-tree--shakeable-brightgreen?labelColor=white">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/ESM-supported-2d9574?style=flat-square&logo=JavaScript">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/CJS-supported-2d9574?style=flat-square&logo=Node.JS">
  &nbsp;
</div>

<div align="center">
  <a href="https://tsplay.dev/mbbv3m" target="_blank">TypeScript Playground</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://www.npmjs.com/package/@traversable/schema-codec" target="_blank">npm</a>
  <br />
</div>
<br />

<br />


## Overview

- **Instructions:** to install the `.codec` method on all schemas, all you need to do is import `@traversable/schema-codec`.
  - To create a covariant codec (similar to zod's `.transform`), use `.codec.pipe`
  - To create a contravariant codec (similar to zod's `.preprocess`), use `.codec.extend` (WIP)

### Example

Play with this example in the [TypeScript playground](https://tsplay.dev/mbbv3m).

```typescript
import { t } from '@traversable/schema'
import '@traversable/schema-codec'
//      ^^ this installs the `.pipe` and `.extend` methods on all schemas

let User = t
  .object({ name: t.optional(t.string), createdAt: t.string }).codec   // <-- notice we're pulling off the `.codec` property
  .pipe((user) => ({ ...user, createdAt: new Date(user.createdAt) }))
  .unpipe((user) => ({ ...user, createdAt: user.createdAt.toISOString() }))

let fromAPI = User.parse({ name: 'Bill Murray', createdAt: new Date().toISOString() })
//   ^?  let fromAPI: Error | { name?: string, createdAt: Date}

if (fromAPI instanceof Error) throw fromAPI
fromAPI
// ^? { name?: string, createdAt: Date }

let toAPI = User.encode(fromAPI)
//  ^? let toAPI: { name?: string, createdAt: string }
```
