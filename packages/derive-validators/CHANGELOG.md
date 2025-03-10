# @traversable/derive-validators

## 0.0.1

### Patch Changes

- [#51](https://github.com/traversable/schema/pull/51) [`b7132bb`](https://github.com/traversable/schema/commit/b7132bb14ce51b305259bb9c44d7cc9fd57d55f4) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ## new features

  ### `@traversable/schema`

  This PR adds a new method to all schemas, `toString`.

  The method works at both the term- and type-level.

  Tests for this feature involve generating 1000s of random schemas,
  writing them to disc, then writing their stringified types to disc, and
  running `tsc` against them both to make sure they're aligned.

- [#49](https://github.com/traversable/schema/pull/49) [`67870c7`](https://github.com/traversable/schema/commit/67870c7f889d9a8c69b87ffa8f3ea32edda4e2a8) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(validators): move all schemas with `.validate` methods to the `v` namespace for convenience

- [#49](https://github.com/traversable/schema/pull/49) [`67870c7`](https://github.com/traversable/schema/commit/67870c7f889d9a8c69b87ffa8f3ea32edda4e2a8) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - init(derive-validators): initializes the `@traversable/derive-validators` package

- Updated dependencies [[`a76de78`](https://github.com/traversable/schema/commit/a76de789d85182281bea1f36eac284068f2920d9), [`b7132bb`](https://github.com/traversable/schema/commit/b7132bb14ce51b305259bb9c44d7cc9fd57d55f4), [`67870c7`](https://github.com/traversable/schema/commit/67870c7f889d9a8c69b87ffa8f3ea32edda4e2a8), [`4d278c5`](https://github.com/traversable/schema/commit/4d278c5f2e5810f221570a0b062de085a6ec1a12)]:
  - @traversable/registry@0.0.8
  - @traversable/schema-core@0.0.9
  - @traversable/schema-seed@0.0.4
  - @traversable/json@0.0.9
