---
"@traversable/derive-equals": patch
"@traversable/schema-core": patch
"@traversable/registry": patch
"@traversable/schema": patch
---

### fixes

- fix(schema): `t.eq(0)(-0) === false` is correct, but in tension with our goal of zod parity (#58)

This bug was [caught in CI](https://github.com/traversable/schema/actions/runs/13773472926) by [fast-check](https://github.com/dubzzz/fast-check)

Personally, I think treating `0` and `-0` as distinct cases is more correct, but having this be
the default behavior is in tension with our goal of zod parity / the interop story.

To fix this, with this PR we've decided to invert control completely, by making 2 changes:

1. Going forward, `t.eq` is "B.Y.O.Eq" -- you can choose to roll your own, or pick one off the shelf

If you're not sure which to use, all of the ones provided by the `@traversable/registry#Equal` module
are thoroughly tested (also using `fast-check`, serious props to @dubzzz for this gem of a library) to 
ensure compliance with the [TC-39 spec](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isstrictlyequal).

2. Users can set their preferred "equals" implementation on a schema-by-schema basis, by passing a second
argument to `t.eq`, or globally using `configure` from `@traversable/schema-core`.

### breaking changes

Since this PR changes which function `t.eq` uses [by default](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isstrictlyequal) to determine equality, this change is breaking.

Since we're pre-1.0, the breaking change is not be reflected in the version bump.
