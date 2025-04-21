---
"@traversable/schema": patch
---

## fixes

At some point, I broke object schemas.

Previously, object schemas _preserved the structure_ of object they were given, even
across the type-level transformation of applying property optionality.

The fancy name for this kind of transformation (one that _preserves structure_) is a
[_homomorphism_](https://en.wikipedia.org/wiki/Homomorphism).

If you're curious how this idea applies to TypeScript, specifically, see this
excellent [StackOverflow answer](https://stackoverflow.com/a/59791889) by @jcalz: his
explanation is approachable, thorough, and enjoyable to read.

Anyway, at some point I made a change that caused the compiler to lose its reference
to the property it was mapping over, which means that any metadata that was attached
to the original node (like JSDoc comments, for example) is no longer preserved.

This PR fixes that.

```typescript
import { t } from '@traversable/schema'

let User = t.object({
  /** ## {@link User.def.quirks `User.quirks`} */
  quirks: t.array(t.string)
})

declare let x: unknown

if (User(x)) {
  x.quirks
  // Hovering over `x.quirks` property now shows the JSDoc annotations 
  // we added to `User.quirks`
}
```
