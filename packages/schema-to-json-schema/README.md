<br />
<h1 align="center">ᯓ𝘁𝗿𝗮𝘃𝗲𝗿𝘀𝗮𝗯𝗹𝗲/𝘀𝗰𝗵𝗲𝗺𝗮-𝘁𝗼-𝗷𝘀𝗼𝗻-𝘀𝗰𝗵𝗲𝗺𝗮</h1>
<br />

<p align="center">
  Re-use your schema to derive the equivalent <a href="https://json-schema.org/" target="_blank">JSON Schema</a>.
</p>
<br />

<div align="center">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40traversable%2Fschema-to-json-schema?style=flat-square&logo=npm&label=npm&color=blue">
  &nbsp;
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.5%2B-blue?style=flat-square&logo=TypeScript&logoColor=4a9cf6">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/license-MIT-a094a2?style=flat-square">
  &nbsp;
  <img alt="npm" src="https://img.shields.io/npm/dt/@traversable/schema-to-json-schema?style=flat-square">
  &nbsp;
</div>

<div align="center">
  <!-- <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/%40traversable/schema-to-json-schema?style=flat-square&label=size">
  &nbsp; -->
  <img alt="Static Badge" src="https://img.shields.io/badge/ESM-supported-2d9574?style=flat-square&logo=JavaScript">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/CJS-supported-2d9574?style=flat-square&logo=Node.JS">
  &nbsp;
</div>

<div align="center">
  <a href="https://stackblitz.com/edit/vitest-dev-vitest-hv2lxhtc?file=src%2Fjson.ts" target="_blank">Demo (Stackblitz)</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsplay.dev/NB98Vw" target="_blank">TypeScript Playground</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://www.npmjs.com/package/@traversable/schema-to-json-schema" target="_blank">npm</a>
  <br />
</div>
<br />

<br />

## Quick Start

To install the `.toJsonSchema` method on all schemas, simply import `@traversable/schema-to-json-schema/install`.

### Example

Play with this example in the [TypeScript playground](https://tsplay.dev/NB98Vw).

```typescript
import * as vi from 'vitest'

import { t } from '@traversable/schema'
import '@traversable/schema-to-json-schema/install'
//      ↑↑ importing `@traversable/schema-to-json-schema/install` adds `.toJsonSchema` on all schemas

const schema_02 = t.intersect(
  t.object({
    stringWithMaxExample: t.optional(t.string.max(255)),
    nestedObjectExample: t.object({
      integerExample: t.integer,
      tupleExample: t.tuple(
        t.eq(1),
        t.optional(t.eq(2)),
        t.optional(t.eq(3)),
      ),
    }),
    stringOrNumberExample: t.union(t.string, t.number),
  }),
  t.object({
    recordExample: t.record(t.string),
    arrayExample: t.optional(t.array(t.string)),
    enumExample: t.enum('x', 'y', 1, 2, null),
  }),
)

vi.assertType<{
  allOf: [
    {
      type: "object"
      required: ("nestedObjectExample" | "stringOrNumberExample")[]
      properties: {
        stringWithMaxExample: { type: "string", minLength: 3 }
        stringOrNumberExample: { anyOf: [{ type: "string" }, { type: "number" }] }
        nestedObjectExample: {
          type: "object"
          required: ("integerExample" | "tupleExample")[]
          properties: {
            integerExample: { type: "integer" }
            tupleExample: {
              type: "array"
              minItems: 1
              maxItems: 3
              items: [{ const: 1 }, { const: 2 }, { const: 3 }]
              additionalItems: false
            }
          }
        }
      }
    },
    {
      type: "object"
      required: ("recordExample" | "enumExample")[]
      properties: {
        recordExample: { type: "object", additionalProperties: { type: "string" } }
        arrayExample: { type: "array", items: { type: "string" } }
        enumExample: { enum: ["x", "y", 1, 2, null] }
      }
    }
  ]
}>(schema_02.toJsonSchema())
//           ↑↑ importing `@traversable/schema-to-json-schema` installs `.toJsonSchema`
```
