---
"@traversable/derive-validators": patch
"@traversable/derive-codec": patch
"@traversable/registry": patch
"@traversable/schema": patch
---

## new features

The `codec` feature was specifically designed for the BFF use case.

To install the `.pipe` and `.extend` methods on all schemas, simply import the `@traversable/derive-codec` package.

### example

```typescript
import { t } from '@traversable/schema'
import '@traversable/derive-codec'
//      ^^ this installs the `.pipe` and `.extend` methods on all schemas

let User = t
  .object({ name: t.optional(t.string), createdAt: t.string, })
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
