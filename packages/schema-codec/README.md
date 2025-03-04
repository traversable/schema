# @traversable/schema-codec

This package allows users to promote a schema from `@traversable/schema` or `@traversable/schema-core` to being a _codec_.

A traversable codec is a bi-directional decoder + encoder pair. It was specifically designed for the "BFF" or "middleware"
use case.

All codecs include `.pipe` and `.extend` instance methods that allow users to "stack" an arbitrary number of encodings / decodings.

### Example

```typescript
import * as vi from 'vitest'
import { Codec } from '@traversable/schema-codec'

interface ApiResponse { data: t.typeof<typeof ServerUser> }

const ServerUser = t.object({
  createdAt: t.string,
  updatedAt: t.string,
})

interface ClientUser {
  id: number
  createdAt: Date
  updatedAt: Date
}

const myCodec = Codec
  .new(ServerUser)
  .pipe((user) => ({ ...user, id: makeId() }))
  .unpipe(({ id, ...user }) => user)
  .pipe((user): ClientUser => ({ ...user, createdAt: new Date(user.createdAt), updatedAt: new Date(user.updatedAt) }))
  .unpipe((user) => ({ ...user, createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString() }))
  .extend((fromAPI: ApiResponse) => fromAPI.data)
  .unextend((data) => ({ data }))

type MyCodec = typeof myCodec
//   ^? type MyCodec = Codec<ApiResponse, ClientUser>

const createdAt = new Date(2021, 0, 31)
const updatedAt = new Date()

const clientUser = { id: 0, createdAt, updatedAt } satisfies ClientUser

const serverResponse = {
  data: {
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  }
}

vi.test('codec satisfies the roundtrip property', () => {
  vi.assert.deepEqual(myCodec.decode(serverResponse), clientUser)
  vi.assert.deepEqual(myCodec.encode(myCodec.decode(serverResponse)), serverResponse)
  vi.assert.deepEqual(myCodec.decode(myCodec.encode(myCodec.decode(serverResponse))), clientUser)
})
```

#### `.pipe`

If you've used `zod` before, `z.transform` is a special case of `.pipe`.

Differences between `.pipe` and `z.transform`:

- `.pipe` uses the builder pattern (here's a nice [introductory video by Andrew Burgess](https://www.youtube.com/watch?v=AON1nirWpcc)
  if you're unfamiliar with the pattern), so users can simply chain

- Supports the inverse
  - Almost always, when you use `z.transform`, you end up needing to "unapply" the transformation

- Fewer edge cases / bugs
  - As of March 2025, of the 1500 issues opened against the Zod repository, 
    [1 in 6](https://github.com/colinhacks/zod/issues?q=is%3Aissue%20state%3Aopen%20transform) involve
    `z.transform`.
  - If you dig into those issues, you'll see that they mostly involve _nested_ transforms
    
- More composable
  - Because 

- Better theoretical foundation
  
  This ties into "More composable" above:

  - The `@traversable/schema` codec was inspired by PureScript's 
    [lens encoding](https://pursuit.purescript.org/packages/purescript-profunctor-lenses/8.0.0),
    which have several advantages over the van Laarhoven encoding found in most functional languages.
    The profunctor encoding was chosen `@traversable/schema-codec` because like our schemas,
    profunctor optics _are just functions_.

#### `.extend`

- The `.extend` method works just like `.pipe`, except in reverse: instead of mapping _to_ a new target,
  you "extend" _from_ a new source.

  This can be pretty tricky to implement in userland, since types work 
  [exactly backwards](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html)
  from the way they do normally.

  The use case for `.extend` is typically when you need to extend to preprocess data __before__ it enters
  its "canonical" form.
  