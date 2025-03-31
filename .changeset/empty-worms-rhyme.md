---
"@traversable/derive-equals": patch
---

## new features

This change allows users to install a high-performance ["equals function"](https://en.wikipedia.org/wiki/Equivalence_relation) to their schemas with a single line of JavaScript.

### example

```typescript
import { t } from '@traversable/schema'
import '@traversable/derive-equals/install'
//      ↑↑ importing `@traversable/derive-equals/install` installs `.equal` on all schemas

const Schema = t.object({
  abc: t.boolean,
  def: t.optional(t.number.min(3)),
})

let x = { abc: true, def: 10 }
let y = { ...x }
let z = { ...x, abc: false }

console.log(Object.is(x, y))     // => false 😭

console.log(Schema.equals(x, y)) // => true  😌
console.log(Schema.equals(y, z)) // => false 😌
```
