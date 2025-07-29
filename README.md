<br>
<h1 align="center">ᯓ𝘁𝗿𝗮𝘃𝗲𝗿𝘀𝗮𝗯𝗹𝗲/𝘀𝗰𝗵𝗲𝗺𝗮</h1>
<br>

<p align="center">TypeScript schema rewriter</p>

<div align="center">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.5%2B-blue?style=flat-square&logo=TypeScript&logoColor=4a9cf6">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/ESM-supported-2d9574?style=flat-square&logo=JavaScript">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/CJS-supported-2d9574?style=flat-square&logo=Node.JS">
  &nbsp;
</div>

<div align="center">
  <!-- <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/%40traversable/schema?style=flat-square&label=size">
  &nbsp; -->
  <img alt="Static Badge" src="https://img.shields.io/badge/%F0%9F%8C%B2-tree--shakeable-brightgreen?labelColor=white">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/static/v1?label=Hippocratic%20License&message=HL3-FULL&labelColor=5e2751&color=bc8c3d">
  &nbsp;
  <img alt="npm" src="https://img.shields.io/npm/dt/@traversable/registry?style=flat-square">
</div>
<br />

<br />

## Overview

A schema is a syntax tree. ASTs lend themselves to (re)-interpretation. If you're not treating your TypeScript schemas like ASTs, you're missing out.

`@traversable/schema` makes it easy to do anything with a TypeScript schema.

### What's a "schema rewriter"?

The idea of term rewriting comes from the programming language community. Languages like [Racket](https://planet.racket-lang.org/package-source/samsergey/rewrite.plt/1/0/planet-docs/manual/index.html) and [Lean](https://lean-lang.org/doc/reference/latest/The-Simplifier/Rewrite-Rules/) invert control and give users a first-class API for rewriting and extending the language.

Unfortunately, we don't have that kind of power in TypeScript because we're limited by the target language (JavaScript). And frankly, given how flexible JavaScript already is, exposing that kind of API would be a recipe for disaster.

We do however have schemas, and schemas are basically ASTs.

## Integrations

<ul>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>arktype@0.0.1</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>arktype-test@0.0.1</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>arktype-types@0.0.1</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>json-schema@0.0.2</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>json-schema-test@0.0.2</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>json-schema-types@0.0.2</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>typebox@0.0.6</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>typebox-test@0.0.3</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>typebox-types@0.0.2</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>zod@0.0.11</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>zod-test@0.0.4</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>zod-types@0.0.2</code></a></li>
</ul>

## Libraries

<ul>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>json@0.0.34</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>registry@0.0.33</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>schema@0.0.44</code></a></li>
  <!-- <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>schema-codec@0.0.0</code></a></li> -->
  <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>schema-compiler@0.0.9</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>schema-errors@0.0.9</code></a></li>
  <!-- <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>schema-deep-equal@0.0.0</code></a></li> -->
  <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>schema-seed@0.0.32</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>schema-to-json-schema@0.0.31</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>schema-to-string@0.0.31</code></a></li>
  <!-- <li><a href="https://github.com/traversable/schema/tree/main/packages/"><code>schema-to-validator@0.0.0</code></a></li> -->
</ul>

## Dependency graph

```mermaid
flowchart TD
    arktype(arktype)
    json-schema(json-schema)
    json-schema-test(json-schema-test)
    registry(registry)
    typebox(typebox)
    zod(zod)
    arktype-test(arktype-test) -.-> registry(registry)
    json(json) -.-> registry(registry)
    schema(schema) -.-> registry(registry)
    typebox-test(typebox-test) -.-> registry(registry)
    zod-test(zod-test) -.-> registry(registry)
    arktype-types(arktype-types) -.-> json(json)
    arktype-types(arktype-types) -.-> registry(registry)
    derive-codec(derive-codec) -.-> registry(registry)
    derive-codec(derive-codec) -.-> schema(schema)
    derive-equals(derive-equals) -.-> json(json)
    derive-equals(derive-equals) -.-> registry(registry)
    derive-equals(derive-equals) -.-> schema(schema)
    derive-validators(derive-validators) -.-> json(json)
    derive-validators(derive-validators) -.-> registry(registry)
    derive-validators(derive-validators) -.-> schema(schema)
    json-schema-types(json-schema-types) -.-> json(json)
    json-schema-types(json-schema-types) -.-> registry(registry)
    schema-compiler(schema-compiler) -.-> json(json)
    schema-compiler(schema-compiler) -.-> registry(registry)
    schema-compiler(schema-compiler) -.-> schema(schema)
    schema-errors(schema-errors) -.-> json(json)
    schema-errors(schema-errors) -.-> registry(registry)
    schema-errors(schema-errors) -.-> schema(schema)
    schema-seed(schema-seed) -.-> json(json)
    schema-seed(schema-seed) -.-> registry(registry)
    schema-seed(schema-seed) -.-> schema(schema)
    schema-to-json-schema(schema-to-json-schema) -.-> registry(registry)
    schema-to-json-schema(schema-to-json-schema) -.-> schema(schema)
    schema-to-string(schema-to-string) -.-> registry(registry)
    schema-to-string(schema-to-string) -.-> schema(schema)
    schema-valibot-adapter(schema-valibot-adapter) -.-> json(json)
    schema-valibot-adapter(schema-valibot-adapter) -.-> registry(registry)
    typebox-types(typebox-types) -.-> json(json)
    typebox-types(typebox-types) -.-> registry(registry)
    zod-types(zod-types) -.-> json(json)
    zod-types(zod-types) -.depends on.-> registry(registry)
```
