---
"@traversable/schema-zod-adapter": patch
"@traversable/registry": patch
"@traversable/schema": patch
---

### new features

Added for interop with JSON Schema's `const` keyword. Adapter to/from zod should be working, but still 
experimental as I haven't written property tests for it yet.

When adapting to/from zod, the passed value is converted into a zod schema. For example:

```typescript
t.object({ root: t.eq({ a: 1, b: [2, 3] }) })
```

becomes:

```typescript
z.object({
  root: z.object({
    a: z.literal(1), 
    b: z.tuple([
      z.literal(2), 
      z.literal(3),
    ]) 
  })
})
```

Example usage:

```typescript
import { t } from '@traversable/schema'


const isZero = t.eq(0)
//     ^? const isZero: t.eq<0>

console.log(isZero(0))         // true
console.log(isZero([1, 2, 3])) // false


const isJanet = t.eq({ firstName: 'Janet' })
//     ^? const isJanet: t.eq<{ firstName: 'Janet' }>

console.log(isJanet({ firstName: 'Bill' }))  // => false
console.log(isJanet({ firstName: 'Janet' })) // => true
console.log(isJanet([1, 2, 3]))              // => false
```
