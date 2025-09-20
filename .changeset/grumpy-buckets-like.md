---
"@traversable/zod": patch
---

feat(zod): 

### new features

- `zx.convertCaseCodec` 
- `zx.deepCamelCaseCodec` (experimental)
- `zx.deepSnakeCaseCodec` (experimental)

This change adds a new transformer for the `@traversable/zod` package that uses a new feature that was added in zod v4: [codecs](https://zod.dev/codecs).

Because of how easy `zx.fold` is to work with, implementing `zx.convertCaseCodec` was relatively simple, and took me about an hour.

Usually I'd fuzz test the hell out of it before publishing, but this time I figured I'd release these early, to have a chance for users to use it and provide feedback before I go through the trouble.

If you use this and run into any problems, please don't hesitate to [open an issue](https://github.com/traversable/schema/issues)!
