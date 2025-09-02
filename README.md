<br>
<h1 align="center">ᯓ𝘁𝗿𝗮𝘃𝗲𝗿𝘀𝗮𝗯𝗹𝗲/𝘀𝗰𝗵𝗲𝗺𝗮</h1>
<br>

<p align="center">TypeScript schema rewriter</p>

<div align="center">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.5%2B-blue?style=flat-square&logo=TypeScript&logoColor=4a9cf6">
  &nbsp;
  <img alt="License" src="https://img.shields.io/static/v1?label=Hippocratic%20License&message=HL3&labelColor=59636e&color=838a93">
  &nbsp;
  <a href="https://traversable.github.io/schema/"><img src="https://img.shields.io/badge/Documentation-4fb3f5.svg" alt="Documentation" /></a>
  &nbsp;
</div>

<div align="center">
  <!-- <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/%40traversable/schema?style=flat-square&label=size">
  &nbsp; -->
  <img alt="Tree-shakable" src="https://img.shields.io/badge/%F0%9F%8C%B2-tree--shakeable-6d7cff?labelColor=white">
  &nbsp;
  <img alt="ESM Supported" src="https://img.shields.io/badge/ESM-supported-6d7cff?style=flat-square&logo=JavaScript">
  &nbsp;
  <img alt="CJS Supported" src="https://img.shields.io/badge/CJS-supported-6d7cff?style=flat-square&logo=Node.JS">
  &nbsp;
  <img alt="npm" src="https://img.shields.io/npm/dt/@traversable/registry?style=flat-square&color=brightgreen">
  &nbsp;
</div>
<br />

<br />

## Overview

`@traversable/schema` is a general purpose schema rewriting tool.

At the time of writing, it is home to the **fastest deep equal** and **fastest deep clone** functions in the JavaScript ecosystem.

You can learn more about why they're so fast, and how the benchmarks were conducted, below:

<ul>
  <li>Blog post: <a href="https://dev.to/ahrjarrett/how-i-built-javascripts-fastest-deep-equals-function-51n8" target="_blank">Building JavaScript's fastest deep equals function</a></li>
  <li>Blog post: <a href="https://dev.to/ahrjarrett/how-i-built-javascripts-fastest-deep-clone-function-5fe0" target="_blank">Building JavaScript's fastest deep clone function</a></li>
</ul>

## Design

A schema is a syntax tree. ASTs lend themselves to (re)-interpretation. If you're not treating your TypeScript schemas like ASTs, you're missing out.

`@traversable/schema` makes it easy to do anything with a TypeScript schema.

### What's a "schema rewriter"?

The idea of term rewriting comes from the programming language community. Languages like [Racket](https://planet.racket-lang.org/package-source/samsergey/rewrite.plt/1/0/planet-docs/manual/index.html) and [Lean](https://lean-lang.org/doc/reference/latest/The-Simplifier/Rewrite-Rules/) invert control and give users a first-class API for rewriting and extending the language.

Unfortunately, we don't have that kind of power in TypeScript because we're limited by the target language (JavaScript). And frankly, given how flexible JavaScript already is, exposing that kind of API would be a recipe for disaster.

We do however have schemas, and schemas are basically ASTs.

## Integrations

<ul>
  <li>📦 <a href="https://github.com/traversable/schema/tree/main/packages/arktype"><code>@traversable/arktype@0.0.17</code></a>: Production-grade ArkType schema-rewriters</li>
  <li>🔬 <a href="https://github.com/traversable/schema/tree/main/packages/arktype-test"><code>@traversable/arktype-test@0.0.12</code></a>: Configurable ArkType schema-generator (for fuzz testing)</li>
  <li>🌳 <a href="https://github.com/traversable/schema/tree/main/packages/arktype-types"><code>@traversable/arktype-types@0.0.12</code></a>: ArkType Functor (for recursion schemes)</a></li>
  <li>📦 <a href="https://github.com/traversable/schema/tree/main/packages/json-schema"><code>@traversable/json-schema@0.0.17</code></a>: Production-grade JSON Schema schema-rewriters</li>
  <li>🔬 <a href="https://github.com/traversable/schema/tree/main/packages/json-schema-test"><code>@traversable/json-schema-test@0.0.15</code></a>: Configurable JSON Schema generator (for fuzz testing)</li>
  <li>🌳 <a href="https://github.com/traversable/schema/tree/main/packages/json-schema-types"><code>@traversable/json-schema-types@0.0.15</code></a>: JSON Schema Functor (for recursion schemes)</a></li>
  <li>📦 <a href="https://github.com/traversable/schema/tree/main/packages/typebox"><code>@traversable/typebox@0.0.21</code></a>: Production-grade TypeBox schema-rewriters</li>
  <li>🔬 <a href="https://github.com/traversable/schema/tree/main/packages/typebox-test"><code>@traversable/typebox-test@0.0.13</code></a>: Configurable TypeBox schema-generator (for fuzz testing)</li>
  <li>🌳 <a href="https://github.com/traversable/schema/tree/main/packages/typebox-types"><code>@traversable/typebox-types@0.0.13</code></a>: ArkType Functor (for recursion schemes)</a></li>
  <li>📦 <a href="https://github.com/traversable/schema/tree/main/packages/valibot"><code>@traversable/valibot@0.0.12</code></a>: Production-grade Valibot schema-rewriters</li>
  <li>🔬 <a href="https://github.com/traversable/schema/tree/main/packages/valibot-test"><code>@traversable/valibot-test@0.0.10</code></a>: Configurable Valibot schema-generator (for fuzz testing)</li>
  <li>🌳 <a href="https://github.com/traversable/schema/tree/main/packages/valibot-types"><code>@traversable/valibot-types@0.0.10</code></a>: Valibot Functor (for recursion schemes)</a></li>
  <li>📦 <a href="https://github.com/traversable/schema/tree/main/packages/zod"><code>@traversable/zod@0.0.36</code></a>: Production-grade zod schema-rewriters</li>
  <li>🔬 <a href="https://github.com/traversable/schema/tree/main/packages/zod-test"><code>@traversable/zod-test@0.0.17</code></a>: Configurable zod schema-generator (for fuzz testing)</li>
  <li>🌳 <a href="https://github.com/traversable/schema/tree/main/packages/zod-types"><code>@traversable/zod-types@0.0.19</code></a>: zod Functor (for recursion schemes)</a></li>
</ul>

## Libraries

<ul>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/json"><code>@traversable/json@0.0.45</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/registry"><code>@traversable/registry@0.0.43</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/schema"><code>@traversable/schema@0.0.56</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/schema-codec"><code>@traversable/schema-codec@0.0.26</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/schema-compiler"><code>@traversable/schema-compiler@0.0.23</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/schema-errors"><code>@traversable/schema-errors@0.0.22</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/schema-deep-equal"><code>@traversable/schema-deep-equal@0.0.12</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/schema-seed"><code>@traversable/schema-seed@0.0.45</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/schema-to-json-schema"><code>@traversable/schema-to-json-schema@0.0.43</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/schema-to-string"><code>@traversable/schema-to-string@0.0.44</code></a></li>
  <li><a href="https://github.com/traversable/schema/tree/main/packages/schema-to-validator"><code>@traversable/schema-to-validator@0.0.11</code></a></li>
</ul>
