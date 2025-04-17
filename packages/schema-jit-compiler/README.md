<br>
<h1 align="center">ᯓ𝘁𝗿𝗮𝘃𝗲𝗿𝘀𝗮𝗯𝗹𝗲/𝘀𝗰𝗵𝗲𝗺𝗮-𝗷𝗶𝘁-𝗰𝗼𝗺𝗽𝗶𝗹𝗲𝗿</h1>
<br>

<p align="center">
  This package contains the code for installing "JIT compiled" validators to your schemas.
</p>

<div align="center">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40traversable%2Fschema-jit-compiler?style=flat-square&logo=npm&label=npm&color=blue">
  &nbsp;
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.5%2B-blue?style=flat-square&logo=TypeScript&logoColor=4a9cf6">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/license-MIT-a094a2?style=flat-square">
  &nbsp;
  <img alt="npm" src="https://img.shields.io/npm/dt/@traversable/schema-jit-compiler?style=flat-square">
  &nbsp;
</div>

<div align="center">
  <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/%40traversable/schema-jit-compiler?style=flat-square&label=size">
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
  <a href="https://www.npmjs.com/package/@traversable/schema-jit-compiler" target="_blank">npm</a>
  <br>
</div>
<br>
<br>

## Getting started

Users can consume this package in one of several ways:

### Import side effect + module augmentation

To install the `.compile` method on all schemas, simply import `@traversable/schema-jit-compiler/install`.

Once you do, all schemas come with a `.compile` method you can use.

### As a standalone function

To compile a single schema, import `Jit` from `@traversable/schema-jit-compiler/recursive`, and pass the
schema you'd like to compile to `Jit.fromSchema`.

### As a transitive dependency

Schemas created using `@traversable/schema` include the `.compile` method out of the box, so if you've 
installed that package, you don't need to do anything extra to take advantage of this feature.

If you don't need this feature and would prefer not to have it installed, you can either:

1. use a lower-level package like `@traversable/schema-core`, which does not install the `.compile` method

2. configure `@traversable/schema` to not include it when building your schemas
