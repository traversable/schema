---
"@traversable/schema-to-json-schema": patch
---

## new features

This PR adds a missing piece of the `@traversable/schema` story -- validation functions.

To add the `.validate` method to all schemas, users simply need to import the `@traversable/derive-validators` package, like so:

```typescript
import { t } from '@traversable/schema'
import '@traversable/derive-validators'

const ex_01 = t.object({ a: t.number }).validate({})
//                                      ^^ new method
const ex_02 = t.object({ a: t.number }).validate({ a: 0 })

console.log(ex_01)
// => [{ errorType: "MISSING", path: ["a"], expected: "number" }]
console.log(ex_02)
// => true
```

**Note:** pending issue #126, the package might be named `@traversable/schema-to-validate` or `@traversable/schema-to-validation` in the future
