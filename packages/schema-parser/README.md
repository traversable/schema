# @traversable/schema-parser

The primary export of the `@traversable/schema-parser` package is a schema interpreter
that builds up a real parser.

**Note:** Most schema validation libraries on the market today are __data validators__.
They validate data; if the data is valid, they return it; if any part of the data is
invalid, they throw, or return an error report.

> If you haven't read Alexis King's
> [Parse, don't validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)
> article, I'd encourage you to check it out. It's what originally inspired 
> [gcanti](https://github.com/gcanti/) to write [`io-ts`](https://github.com/gcanti/io-ts),
> the library that [zod was based on](https://zod.dev/?id=io-ts).


For example:

```typescript
import { z } from 'zod'

const zodSchema = z.object({ a: z.number() })

console.log(zodSchema.parse({ a: "BAD" })) // throws with { issues: [{ path: ['a'], ... }] }
```

That's great, but sometimes, you want to keep the parts of the data that are valid, and get
an error report about the parts that weren't.

With `zod`, if any of the input fails to parse, you end up throwing out the baby with the bath
water.

## Example

```typescript
import { Parse } from '@traversable/schema-parser`
```
