# @traversable/derive-equals

## 0.0.7

### Patch Changes

- [#67](https://github.com/traversable/schema/pull/67) [`3cfb05e`](https://github.com/traversable/schema/commit/3cfb05e186b61f816d3a7ae8c3f0884ff5aceab3) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(registry): moves nested files up a level so they're part of the build

- Updated dependencies [[`3cfb05e`](https://github.com/traversable/schema/commit/3cfb05e186b61f816d3a7ae8c3f0884ff5aceab3)]:
  - @traversable/registry@0.0.12
  - @traversable/json@0.0.13
  - @traversable/schema-core@0.0.13
  - @traversable/schema-seed@0.0.8

## 0.0.6

### Patch Changes

- [#65](https://github.com/traversable/schema/pull/65) [`7865d59`](https://github.com/traversable/schema/commit/7865d5955f02e7ba16bfa44d331289ece88e1eb6) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - attempt to fix build

- Updated dependencies [[`7865d59`](https://github.com/traversable/schema/commit/7865d5955f02e7ba16bfa44d331289ece88e1eb6)]:
  - @traversable/schema-seed@0.0.7
  - @traversable/json@0.0.12
  - @traversable/registry@0.0.11
  - @traversable/schema-core@0.0.12

## 0.0.5

### Patch Changes

- [#63](https://github.com/traversable/schema/pull/63) [`904a3c9`](https://github.com/traversable/schema/commit/904a3c9d6bd87e573a60f37b8146f199d6994bdf) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix build

- Updated dependencies [[`904a3c9`](https://github.com/traversable/schema/commit/904a3c9d6bd87e573a60f37b8146f199d6994bdf), [`96ec20f`](https://github.com/traversable/schema/commit/96ec20f2d6cff2cd369e095080201171247dc213)]:
  - @traversable/json@0.0.11
  - @traversable/registry@0.0.10
  - @traversable/schema-core@0.0.11
  - @traversable/schema-seed@0.0.6

## 0.0.4

### Patch Changes

- [#59](https://github.com/traversable/schema/pull/59) [`18b24e3`](https://github.com/traversable/schema/commit/18b24e3649c48d176063cb004ca909488ded6528) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ### fixes

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

- Updated dependencies [[`18b24e3`](https://github.com/traversable/schema/commit/18b24e3649c48d176063cb004ca909488ded6528)]:
  - @traversable/schema-core@0.0.10
  - @traversable/registry@0.0.9
  - @traversable/schema-seed@0.0.5
  - @traversable/json@0.0.10

## 0.0.3

### Patch Changes

- [#49](https://github.com/traversable/schema/pull/49) [`67870c7`](https://github.com/traversable/schema/commit/67870c7f889d9a8c69b87ffa8f3ea32edda4e2a8) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(validators): move all schemas with `.validate` methods to the `v` namespace for convenience

- [#46](https://github.com/traversable/schema/pull/46) [`4d278c5`](https://github.com/traversable/schema/commit/4d278c5f2e5810f221570a0b062de085a6ec1a12) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(json-schema): adds native support for JSON schema

- Updated dependencies [[`a76de78`](https://github.com/traversable/schema/commit/a76de789d85182281bea1f36eac284068f2920d9), [`b7132bb`](https://github.com/traversable/schema/commit/b7132bb14ce51b305259bb9c44d7cc9fd57d55f4), [`34783db`](https://github.com/traversable/schema/commit/34783db67cb2ab0707d0e938613dc3b2d2221cb2), [`67870c7`](https://github.com/traversable/schema/commit/67870c7f889d9a8c69b87ffa8f3ea32edda4e2a8), [`4d278c5`](https://github.com/traversable/schema/commit/4d278c5f2e5810f221570a0b062de085a6ec1a12)]:
  - @traversable/registry@0.0.8
  - @traversable/schema-core@0.0.9
  - @traversable/schema-seed@0.0.4
  - @traversable/json@0.0.9

## 0.0.2

### Patch Changes

- [#40](https://github.com/traversable/schema/pull/40) [`b653ec4`](https://github.com/traversable/schema/commit/b653ec4b3f363793f31a46fe84dc30b60f99388a) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - init(sandbox): creates `examples/` folder for creating examples and testing builds

- Updated dependencies [[`b653ec4`](https://github.com/traversable/schema/commit/b653ec4b3f363793f31a46fe84dc30b60f99388a)]:
  - @traversable/schema-core@0.0.8
  - @traversable/schema-seed@0.0.3
  - @traversable/registry@0.0.7
  - @traversable/json@0.0.8

## 0.0.1

### Patch Changes

- Updated dependencies [[`fdccb94`](https://github.com/traversable/schema/commit/fdccb94b0bb4e407aabd90936ac426194c062d65), [`f873c28`](https://github.com/traversable/schema/commit/f873c2845a29f55e37deddf76043641a07cf405b), [`abc08a5`](https://github.com/traversable/schema/commit/abc08a5f0ecf000d018aed40d1d7b41374ed5661), [`547df94`](https://github.com/traversable/schema/commit/547df949cdb82d267f4b53b01085e748016d7c6a), [`fdccb94`](https://github.com/traversable/schema/commit/fdccb94b0bb4e407aabd90936ac426194c062d65), [`fdccb94`](https://github.com/traversable/schema/commit/fdccb94b0bb4e407aabd90936ac426194c062d65)]:
  - @traversable/registry@0.0.6
  - @traversable/schema-core@0.0.7
  - @traversable/schema-seed@0.0.2
  - @traversable/json@0.0.7
