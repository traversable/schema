# @traversable/zod

## 0.0.56

### Patch Changes

- [#552](https://github.com/traversable/schema/pull/552) [`2be00a9`](https://github.com/traversable/schema/commit/2be00a95b5e460415bc2b0932edde4a582a8aa00) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fixes `zx.toString` bug (#549) where `z.discriminatedUnion` discriminator was included in the options array (fixed in #551, thanks @TheyCodeMeSilvers!)

## 0.0.55

### Patch Changes

- [#548](https://github.com/traversable/schema/pull/548) [`64af50a`](https://github.com/traversable/schema/commit/64af50a15cd3390a2bc40d76f2615f2f552f1317) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs(zod): adds `zx.fold` usage with `z.clone` example to README (thanks @Refzlund!)

- [#545](https://github.com/traversable/schema/pull/545) [`1767355`](https://github.com/traversable/schema/commit/17673554199b582f8460ca9cb2911caea6c8a359) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod-test): adds `zxTest.fuzz` for generating configurable, overridable fast-check arbitraries from a Zod schema (#544)

- Updated dependencies [[`1767355`](https://github.com/traversable/schema/commit/17673554199b582f8460ca9cb2911caea6c8a359)]:
  - @traversable/zod-types@0.0.30

## 0.0.54

### Patch Changes

- [#542](https://github.com/traversable/schema/pull/542) [`5b36349`](https://github.com/traversable/schema/commit/5b363495c0cf3dc11c131f5fed7d936db1770c9c) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(zod,zod-types): fixes `zx.toString` bug where objects with 1+ props passed to `z.default` included an unmatched closing bracket

- Updated dependencies [[`5b36349`](https://github.com/traversable/schema/commit/5b363495c0cf3dc11c131f5fed7d936db1770c9c)]:
  - @traversable/zod-types@0.0.29

## 0.0.53

### Patch Changes

- [#538](https://github.com/traversable/schema/pull/538) [`efcd10f`](https://github.com/traversable/schema/commit/efcd10f4bb1766f899094771515df8c2378ed2b4) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - optimize(zod,zod-test,zod-types): optimizes type-level performance of `zx.fold`

- Updated dependencies [[`2b54afa`](https://github.com/traversable/schema/commit/2b54afabedd9d317b8e6374cd963ceaa8d91eb3b), [`efcd10f`](https://github.com/traversable/schema/commit/efcd10f4bb1766f899094771515df8c2378ed2b4)]:
  - @traversable/registry@0.0.49
  - @traversable/zod-types@0.0.28
  - @traversable/json@0.0.52

## 0.0.52

### Patch Changes

- [#533](https://github.com/traversable/schema/pull/533) [`5db0e97`](https://github.com/traversable/schema/commit/5db0e977dee743fd3103c9874dc84f4f222e4385) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - ### fixes
  - fix(zod,zod-types): fixes `zx.toType` escaping bug regarding grave quotes in `z.templateLiteral` schemas (#532)
  - fix(zod,zod-types): fixes `zx.toType` not properly supporing `z.enum`, `z.optional` and `z.nullable` schemas in `z.templateLiteral` (#521)

- Updated dependencies [[`5db0e97`](https://github.com/traversable/schema/commit/5db0e977dee743fd3103c9874dc84f4f222e4385)]:
  - @traversable/registry@0.0.48
  - @traversable/json@0.0.51
  - @traversable/zod-types@0.0.27

## 0.0.51

### Patch Changes

- [#529](https://github.com/traversable/schema/pull/529) [`93a20be`](https://github.com/traversable/schema/commit/93a20beca85639a53e44f94a478c7adfd015eda1) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - chore(\*): adds license to built package.json files

- Updated dependencies [[`93a20be`](https://github.com/traversable/schema/commit/93a20beca85639a53e44f94a478c7adfd015eda1)]:
  - @traversable/json@0.0.50
  - @traversable/registry@0.0.47
  - @traversable/zod-types@0.0.26

## 0.0.50

### Patch Changes

- [#525](https://github.com/traversable/schema/pull/525) [`446c164`](https://github.com/traversable/schema/commit/446c1647a7614796edeb694ca2c454e099601d13) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs(zod): adds StackBlitz for `zx.convertCaseCodec`, `zx.deepCamelCaseCodec` and `zx.deepSnakeCaseCodec`

## 0.0.49

### Patch Changes

- [#523](https://github.com/traversable/schema/pull/523) [`bd73ba7`](https://github.com/traversable/schema/commit/bd73ba72acc5f8cd52dcc5d82b464e5b32c90c78) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod):

  ### new features
  - `zx.convertCaseCodec`
  - `zx.deepCamelCaseCodec` (experimental)
  - `zx.deepSnakeCaseCodec` (experimental)

  This change adds a new transformer for the `@traversable/zod` package that uses a new feature that was added in zod v4: [codecs](https://zod.dev/codecs).

  Because of how easy `zx.fold` is to work with, implementing `zx.convertCaseCodec` was relatively simple, and took me about an hour.

  Usually I'd fuzz test the hell out of it before publishing, but this time I figured I'd release these early, to have a chance for users to use it and provide feedback before I go through the trouble.

  If you use this and run into any problems, please don't hesitate to [open an issue](https://github.com/traversable/schema/issues)!

## 0.0.48

### Patch Changes

- [#518](https://github.com/traversable/schema/pull/518) [`e92a183`](https://github.com/traversable/schema/commit/e92a18354226811d4ced1616044fbce8a6333428) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - test(typebox,valibot,zod): adds fuzz tests for `.toString` transformers

## 0.0.47

### Patch Changes

- [#512](https://github.com/traversable/schema/pull/512) [`12f9efc`](https://github.com/traversable/schema/commit/12f9efcb5a97393069e5bffabd7e30b90e707300) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(zod): fixes return type for `zx.defaultValue`

## 0.0.46

### Patch Changes

- [#503](https://github.com/traversable/schema/pull/503) [`9703132`](https://github.com/traversable/schema/commit/9703132499d554324561589c44adc4429f8add0e) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs: applies the MIT license to all projects under the @traversable umbrella

- Updated dependencies [[`9703132`](https://github.com/traversable/schema/commit/9703132499d554324561589c44adc4429f8add0e)]:
  - @traversable/zod-types@0.0.25
  - @traversable/registry@0.0.46
  - @traversable/json@0.0.49

## 0.0.45

### Patch Changes

- [#498](https://github.com/traversable/schema/pull/498) [`be307d7`](https://github.com/traversable/schema/commit/be307d79a42ceb401460f43d252899fc58b95481) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs(valibot,zod,schema-codec,schema-to-validator): adds links to readmes & fixes a few typos

## 0.0.44

### Patch Changes

- [#496](https://github.com/traversable/schema/pull/496) [`e483d4d`](https://github.com/traversable/schema/commit/e483d4dae987927536d08dae196cc3ce9686c5db) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(zod): fixes `zx.defaultValue` error message to display the correct function name (`defaultValue`, not `withDefault`)

## 0.0.43

### Patch Changes

- [#471](https://github.com/traversable/schema/pull/471) [`6b49ac1`](https://github.com/traversable/schema/commit/6b49ac148cdcd3ce6a228287134c0874946a6944) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(\*): adds experimental support for `t.ref` and `JsonSchema` refs

- Updated dependencies [[`6b49ac1`](https://github.com/traversable/schema/commit/6b49ac148cdcd3ce6a228287134c0874946a6944)]:
  - @traversable/json@0.0.48
  - @traversable/registry@0.0.45
  - @traversable/zod-types@0.0.24

## 0.0.42

### Patch Changes

- [#466](https://github.com/traversable/schema/pull/466) [`9b34ac3`](https://github.com/traversable/schema/commit/9b34ac344be2f5fed33b02927d6a8631b7639d1d) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds `noType` option to `zx.deepEqual.writeable`

## 0.0.41

### Patch Changes

- [#461](https://github.com/traversable/schema/pull/461) [`5a24d33`](https://github.com/traversable/schema/commit/5a24d33b410637100575eef8979a86fe7159af48) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - refactor(zod,zod-types): renames `isOptionalDeep` to `hasOptional` and `isDefaultDeep` to `hasDefault`

- Updated dependencies [[`5a24d33`](https://github.com/traversable/schema/commit/5a24d33b410637100575eef8979a86fe7159af48)]:
  - @traversable/zod-types@0.0.23

## 0.0.40

### Patch Changes

- [#454](https://github.com/traversable/schema/pull/454) [`9808848`](https://github.com/traversable/schema/commit/9808848b5906195ac2ec8e5cda5e77961baed24b) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds `zx.deepNoDefaults` (#453)

- Updated dependencies [[`9808848`](https://github.com/traversable/schema/commit/9808848b5906195ac2ec8e5cda5e77961baed24b)]:
  - @traversable/zod-types@0.0.22

## 0.0.39

### Patch Changes

- [#451](https://github.com/traversable/schema/pull/451) [`6ec9d7e`](https://github.com/traversable/schema/commit/6ec9d7e62ac2b7e7b2788c82085832b9bd90018b) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - test(zod,zod-test): adds fuzz tests that exercise all zod schemas

## 0.0.38

### Patch Changes

- Updated dependencies [[`b57c6c7`](https://github.com/traversable/schema/commit/b57c6c7b033bf1792e00e22fab2f7b65af8dbfaf)]:
  - @traversable/registry@0.0.44
  - @traversable/json@0.0.47
  - @traversable/zod-types@0.0.21

## 0.0.37

### Patch Changes

- [#446](https://github.com/traversable/schema/pull/446) [`892c24c`](https://github.com/traversable/schema/commit/892c24c100b7094d70e2921bc728aad42169f4bc) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): implements `zx.deepLoose`, `zx.deepStrict`, `zx.deepNonLoose`, `zx.deepNonStrict`

- Updated dependencies [[`9fbed7c`](https://github.com/traversable/schema/commit/9fbed7c3406da1fbeae3055f2d4373ee2ca3586b)]:
  - @traversable/json@0.0.46
  - @traversable/zod-types@0.0.20

## 0.0.36

### Patch Changes

- [#441](https://github.com/traversable/schema/pull/441) [`9460301`](https://github.com/traversable/schema/commit/946030196d9c80fa02b2eb6bcf6f192e939e87bf) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs(zod): adds intro blog post to README

## 0.0.35

### Patch Changes

- [#437](https://github.com/traversable/schema/pull/437) [`7cc3ea7`](https://github.com/traversable/schema/commit/7cc3ea78c06ac47fe24824662dde5c14f1861f76) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(json-schema,zod): fixes `JsonSchema.fold` type inference

## 0.0.34

### Patch Changes

- [#436](https://github.com/traversable/schema/pull/436) [`35f0b8d`](https://github.com/traversable/schema/commit/35f0b8da144077ce1ea657ec844f2938117048a7) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(zod): fixes `zx.deepPartial` handing of `z.discriminatedUnion`

- [#435](https://github.com/traversable/schema/pull/435) [`ebf8dd9`](https://github.com/traversable/schema/commit/ebf8dd9554fb3c39b55cbbbb11791f7f4ec3fc30) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(zod,zod-types): moves re-export to index file

- [#432](https://github.com/traversable/schema/pull/432) [`9b1c9b6`](https://github.com/traversable/schema/commit/9b1c9b695b0d574144f7e64d1b043487a6cd0fb3) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(zod): fixes `zx.deepNullable`, `zx.deepNonNullable`, `zx.deepReadonly`, `zx.deepOptional`

- Updated dependencies [[`35f0b8d`](https://github.com/traversable/schema/commit/35f0b8da144077ce1ea657ec844f2938117048a7), [`ebf8dd9`](https://github.com/traversable/schema/commit/ebf8dd9554fb3c39b55cbbbb11791f7f4ec3fc30)]:
  - @traversable/zod-types@0.0.19

## 0.0.33

### Patch Changes

- [#427](https://github.com/traversable/schema/pull/427) [`9995791`](https://github.com/traversable/schema/commit/999579183b3e0396c7da6dc492a0d67a45e326e6) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(zod-types,json-schema-types,zod): exports `Functor` modules directly

- Updated dependencies [[`9995791`](https://github.com/traversable/schema/commit/999579183b3e0396c7da6dc492a0d67a45e326e6)]:
  - @traversable/zod-types@0.0.18

## 0.0.32

### Patch Changes

- Updated dependencies [[`a30cebc`](https://github.com/traversable/schema/commit/a30cebcb1cedae6f99aff93975419b312f51201d)]:
  - @traversable/registry@0.0.43
  - @traversable/json@0.0.45
  - @traversable/zod-types@0.0.17

## 0.0.31

### Patch Changes

- Updated dependencies [[`c4ea836`](https://github.com/traversable/schema/commit/c4ea8365502be63b3d27405c05b03b5f5315100a)]:
  - @traversable/registry@0.0.42
  - @traversable/json@0.0.44
  - @traversable/zod-types@0.0.16

## 0.0.30

### Patch Changes

- [#418](https://github.com/traversable/schema/pull/418) [`84bc7ca`](https://github.com/traversable/schema/commit/84bc7ca75e3cd9856cee9f6a56d0f086de547062) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(registry,zod): removes `@internal` directives, moves `@ts-expect-error` directives so they don't get stripped from build output

- Updated dependencies [[`84bc7ca`](https://github.com/traversable/schema/commit/84bc7ca75e3cd9856cee9f6a56d0f086de547062)]:
  - @traversable/registry@0.0.41
  - @traversable/json@0.0.43
  - @traversable/zod-types@0.0.15

## 0.0.29

### Patch Changes

- [#415](https://github.com/traversable/schema/pull/415) [`c16cd5a`](https://github.com/traversable/schema/commit/c16cd5ac3427fbcdbcedf1fd661ed6974b628ea2) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs(typebox,valibot,zod): fixes comment alignment in docs

## 0.0.28

### Patch Changes

- Updated dependencies [[`3988bd7`](https://github.com/traversable/schema/commit/3988bd7cb0ce31d056b97020a37050ed8460fa5e)]:
  - @traversable/registry@0.0.40
  - @traversable/json@0.0.42
  - @traversable/zod-types@0.0.14

## 0.0.27

### Patch Changes

- [#409](https://github.com/traversable/schema/pull/409) [`400f665`](https://github.com/traversable/schema/commit/400f665131decad6c06d484674b4e2a8aedb219b) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs(zod): simplifies docs for `zx.fold`

## 0.0.26

### Patch Changes

- [#406](https://github.com/traversable/schema/pull/406) [`4ae34a2`](https://github.com/traversable/schema/commit/4ae34a2e3fdcbbc5d0d7b23a2442f6e6e8eaceef) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs(zod): simplifies `zx.fold` docs

- Updated dependencies [[`4ae34a2`](https://github.com/traversable/schema/commit/4ae34a2e3fdcbbc5d0d7b23a2442f6e6e8eaceef)]:
  - @traversable/zod-types@0.0.13

## 0.0.25

### Patch Changes

- [#396](https://github.com/traversable/schema/pull/396) [`343d51a`](https://github.com/traversable/schema/commit/343d51ada68132f6a1cc78c137034b9b488bd475) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - prevent(\*): CVE 2025 57820

- [#400](https://github.com/traversable/schema/pull/400) [`18136d0`](https://github.com/traversable/schema/commit/18136d072c5192d1e862eb5699df274ac8ac748d) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - deps(zod,zod-test,zod-types): bump zod dep to v4.1.3

- [#401](https://github.com/traversable/schema/pull/401) [`b5c14fd`](https://github.com/traversable/schema/commit/b5c14fd46417ff4bd96b3200b876a5a3707ae2c6) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(zod): fixes bug where `zx.toString` was returning 'z.default' for `z.prefault` schemas

- [#403](https://github.com/traversable/schema/pull/403) [`c8fc2dd`](https://github.com/traversable/schema/commit/c8fc2dd51c1d8e9f1a1b3830bfa1562fb90b99ea) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(build): adds `pkg.pr.new`

- [#400](https://github.com/traversable/schema/pull/400) [`49c9231`](https://github.com/traversable/schema/commit/49c9231a54c4ba1117b1dfb50bcd68d2d6753288) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs(zod): adds better example for `zx.fold`

- Updated dependencies [[`343d51a`](https://github.com/traversable/schema/commit/343d51ada68132f6a1cc78c137034b9b488bd475), [`18136d0`](https://github.com/traversable/schema/commit/18136d072c5192d1e862eb5699df274ac8ac748d), [`c8fc2dd`](https://github.com/traversable/schema/commit/c8fc2dd51c1d8e9f1a1b3830bfa1562fb90b99ea)]:
  - @traversable/json@0.0.41
  - @traversable/registry@0.0.39
  - @traversable/zod-types@0.0.12

## 0.0.24

### Patch Changes

- [#393](https://github.com/traversable/schema/pull/393) [`7217a48`](https://github.com/traversable/schema/commit/7217a488e07445c92850213ddd2dd7b67e8d4974) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(zod): returns 'transform' schemas without cloning in `zx.deepPartial`

- [#394](https://github.com/traversable/schema/pull/394) [`4aba06d`](https://github.com/traversable/schema/commit/4aba06d8177b1245fa315855d5091a50f790287a) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(zod): fixes type error in test for `zx.deepPartial`

## 0.0.23

### Patch Changes

- [#391](https://github.com/traversable/schema/pull/391) [`36061d5`](https://github.com/traversable/schema/commit/36061d5277c1290fd93376f2590845e58fc059e4) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - test(zod): adds a more robust test suite for `zx.deepPartial`

- [#389](https://github.com/traversable/schema/pull/389) [`56afa95`](https://github.com/traversable/schema/commit/56afa957c4343ddcc7507690d295e51538ddc7f3) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(zod,zod-test,zod-types): uses `z.core.clone` to avoid blowing away input schema in `zx.deepPartial`

- Updated dependencies [[`56afa95`](https://github.com/traversable/schema/commit/56afa957c4343ddcc7507690d295e51538ddc7f3)]:
  - @traversable/zod-types@0.0.11

## 0.0.22

### Patch Changes

- [#386](https://github.com/traversable/schema/pull/386) [`097a863`](https://github.com/traversable/schema/commit/097a863c0e36ca4d499b9264e259b5e9d78ed6ac) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(zod): fixes bug with `zx.deepPartial` unions not preserving schema methods (#385)

- Updated dependencies [[`097a863`](https://github.com/traversable/schema/commit/097a863c0e36ca4d499b9264e259b5e9d78ed6ac)]:
  - @traversable/zod-types@0.0.10

## 0.0.21

### Patch Changes

- [#383](https://github.com/traversable/schema/pull/383) [`fa12c10`](https://github.com/traversable/schema/commit/fa12c10fdefb783bae05cb8f50a9a3e9ecc809bb) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(zod,zod-types): fixes bug with zx.deepPartial not preserving original schema structure

- Updated dependencies [[`fa12c10`](https://github.com/traversable/schema/commit/fa12c10fdefb783bae05cb8f50a9a3e9ecc809bb)]:
  - @traversable/zod-types@0.0.9

## 0.0.20

### Patch Changes

- [#371](https://github.com/traversable/schema/pull/371) [`aac0d24`](https://github.com/traversable/schema/commit/aac0d24683043617126a764de0902f0a425fcd19) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - deps: upgrade to zod v4.0.14

- [#371](https://github.com/traversable/schema/pull/371) [`d3f7ebb`](https://github.com/traversable/schema/commit/d3f7ebb139d308ec32a078835de0afadda2d0a56) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix: fixes random double generator bad interaction with maxExcluded and -0

- [#375](https://github.com/traversable/schema/pull/375) [`0527ac2`](https://github.com/traversable/schema/commit/0527ac280e79f2d4f44a91813f7fa5b5ccd17eac) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - build: adds `docs/` to .gitignore

- [#370](https://github.com/traversable/schema/pull/370) [`005cb7d`](https://github.com/traversable/schema/commit/005cb7d2ccf3c303381cbf30147ae73c84aa1b11) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - optimize(arktype,json-schema,typebox-valibot,zod): optimize key order of record schemas for `deepEqual` implementations

- Updated dependencies [[`aac0d24`](https://github.com/traversable/schema/commit/aac0d24683043617126a764de0902f0a425fcd19), [`d3f7ebb`](https://github.com/traversable/schema/commit/d3f7ebb139d308ec32a078835de0afadda2d0a56), [`0527ac2`](https://github.com/traversable/schema/commit/0527ac280e79f2d4f44a91813f7fa5b5ccd17eac)]:
  - @traversable/zod-types@0.0.8
  - @traversable/registry@0.0.38
  - @traversable/json@0.0.40

## 0.0.19

### Patch Changes

- [#363](https://github.com/traversable/schema/pull/363) [`efd6ed2`](https://github.com/traversable/schema/commit/efd6ed2af4726e252e7cb0fc62586949c3b83ceb) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds `zx.deepClone` support for `z.object(...).catchall`

- [#361](https://github.com/traversable/schema/pull/361) [`2d6794d`](https://github.com/traversable/schema/commit/2d6794df95e1b08d4429410cd71ac2401c198cd7) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fixes links in documentation

- [#363](https://github.com/traversable/schema/pull/363) [`cae5ac9`](https://github.com/traversable/schema/commit/cae5ac9e28c1b24dccf3a02dbc4882628be8976b) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix: deepClone bug with boolean literal schemas

## 0.0.18

### Patch Changes

- [#357](https://github.com/traversable/schema/pull/357) [`51cc9f0`](https://github.com/traversable/schema/commit/51cc9f03b90f5a3356a0bc209a7dadc6e63e7e5a) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - license: updates license to Hippocratic-2.1

- [#359](https://github.com/traversable/schema/pull/359) [`d17c5d4`](https://github.com/traversable/schema/commit/d17c5d46c7be5a41d6e3d031e1ef0352f7c0eca7) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs: adds Bolt sandbox, links to benchmarks in package README

- [#357](https://github.com/traversable/schema/pull/357) [`8a10f2a`](https://github.com/traversable/schema/commit/8a10f2a396320b6144217c24de30471e6b17a426) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - removes `@traversable/schema-valibot-adapter` workspace

- Updated dependencies [[`51cc9f0`](https://github.com/traversable/schema/commit/51cc9f03b90f5a3356a0bc209a7dadc6e63e7e5a), [`8a10f2a`](https://github.com/traversable/schema/commit/8a10f2a396320b6144217c24de30471e6b17a426)]:
  - @traversable/zod-types@0.0.7
  - @traversable/registry@0.0.37
  - @traversable/json@0.0.39

## 0.0.17

### Patch Changes

- [#354](https://github.com/traversable/schema/pull/354) [`6e42d5e`](https://github.com/traversable/schema/commit/6e42d5eee5b6826f2c8a311ca3b60bb77ead90e7) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - upgrade package ecosystem to `fast-check@4.2.0`

- Updated dependencies [[`6e42d5e`](https://github.com/traversable/schema/commit/6e42d5eee5b6826f2c8a311ca3b60bb77ead90e7)]:
  - @traversable/json@0.0.38
  - @traversable/zod-types@0.0.6

## 0.0.16

### Patch Changes

- [#351](https://github.com/traversable/schema/pull/351) [`13e8397`](https://github.com/traversable/schema/commit/13e839705511a7f07bf78ef87483e565de4b1c7e) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(valibot): adds `vx.fromConstant`, `vx.fromJson`

- [#335](https://github.com/traversable/schema/pull/335) [`5aca9a7`](https://github.com/traversable/schema/commit/5aca9a712a4e81c6a4b77f843c0658e74daa2a96) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds `zx.deepEqual` support for `z.custom`, `z.default`, `z.prefault` and `z.success`

- [#332](https://github.com/traversable/schema/pull/332) [`b345726`](https://github.com/traversable/schema/commit/b345726d38e2f92f590ade18e9228fbd5468a36c) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds support for JSDoc annotations in `zx.toType`

- [#344](https://github.com/traversable/schema/pull/344) [`0879479`](https://github.com/traversable/schema/commit/0879479b8f71ae7d5bc94fff23dc94c2f9c33535) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(valibot): adds `vx.toType`

- [#347](https://github.com/traversable/schema/pull/347) [`a0a1de9`](https://github.com/traversable/schema/commit/a0a1de9c11449712494e297f1c36393c74b4444a) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(valibot): adds `vx.deepEqual`

- [#337](https://github.com/traversable/schema/pull/337) [`81583ef`](https://github.com/traversable/schema/commit/81583efaaf953a0bf24ee16d8c37511ed74caaa9) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds `zx.deepClone` support for `z.custom`, `z.success`

- [#341](https://github.com/traversable/schema/pull/341) [`3ab9fde`](https://github.com/traversable/schema/commit/3ab9fdecfe33bb06240ab1721246d30da831cdcf) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(valibot): adds `vx.check`

- Updated dependencies [[`b345726`](https://github.com/traversable/schema/commit/b345726d38e2f92f590ade18e9228fbd5468a36c), [`3ab9fde`](https://github.com/traversable/schema/commit/3ab9fdecfe33bb06240ab1721246d30da831cdcf)]:
  - @traversable/zod-types@0.0.5
  - @traversable/registry@0.0.36
  - @traversable/json@0.0.37

## 0.0.15

### Patch Changes

- [#327](https://github.com/traversable/schema/pull/327) [`e148773`](https://github.com/traversable/schema/commit/e1487731ff5a619eb2f32735164cdd2bde8c6344) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs(zod): adds "See also" section to `zx.fromConstant`, `zx.fromJson`

- [#325](https://github.com/traversable/schema/pull/325) [`8f6906e`](https://github.com/traversable/schema/commit/8f6906ed8d34dd3343b8afbce99f3a17d15dad9b) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs(zod): adds benchmarks to readme

## 0.0.14

### Patch Changes

- [#323](https://github.com/traversable/schema/pull/323) [`b8ff685`](https://github.com/traversable/schema/commit/b8ff685b684f7a95da32f3a3b5e8036b65c1e6f8) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds `zx.fromJson`, `zx.fromJson.writeable`, `zx.fromConstant.writeable`

## 0.0.13

### Patch Changes

- [#312](https://github.com/traversable/schema/pull/312) [`d9134a9`](https://github.com/traversable/schema/commit/d9134a9a8e765246f63dfda6df1b04afef98bba1) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs: removes MIT license from documentation

- Updated dependencies [[`d9134a9`](https://github.com/traversable/schema/commit/d9134a9a8e765246f63dfda6df1b04afef98bba1)]:
  - @traversable/zod-types@0.0.4
  - @traversable/registry@0.0.35
  - @traversable/json@0.0.36

## 0.0.12

### Patch Changes

- [#298](https://github.com/traversable/schema/pull/298) [`bfd1e7d`](https://github.com/traversable/schema/commit/bfd1e7d6530a78f317e95e7cee98a20bc03c34c3) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - re-license project under the Hippocratic License

- Updated dependencies [[`bfd1e7d`](https://github.com/traversable/schema/commit/bfd1e7d6530a78f317e95e7cee98a20bc03c34c3)]:
  - @traversable/json@0.0.35
  - @traversable/registry@0.0.34
  - @traversable/zod-types@0.0.3

## 0.0.11

### Patch Changes

- [#291](https://github.com/traversable/schema/pull/291) [`740809d`](https://github.com/traversable/schema/commit/740809dcf968b42598067610043536af36b2a0e3) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - initializes `@traversable/arktype`, `@traversable/arktype-types`, `@traversable/arktype-test`

- Updated dependencies [[`740809d`](https://github.com/traversable/schema/commit/740809dcf968b42598067610043536af36b2a0e3)]:
  - @traversable/zod-types@0.0.2

## 0.0.10

### Patch Changes

- [#278](https://github.com/traversable/schema/pull/278) [`9532291`](https://github.com/traversable/schema/commit/95322918a79954160a72d2f0f24ef9917b33d539) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(typebox): adds `box.deepClone`

- [#274](https://github.com/traversable/schema/pull/274) [`f4d7da3`](https://github.com/traversable/schema/commit/f4d7da34380044a85ad6b35d59ab9688bbbc870e) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs(json-schema,zod): adds docs for `JsonSchema.fold`, `JsonSchema.Functor`, fixes typo in zod docs

- [#276](https://github.com/traversable/schema/pull/276) [`2856404`](https://github.com/traversable/schema/commit/2856404d6c6216af345df06fcec70c49b78ed808) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - chore(zod): renames `zx.clone` to `zx.deepClone` and `zx.equals` to `zx.deepEquals`

- [#286](https://github.com/traversable/schema/pull/286) [`f5a8507`](https://github.com/traversable/schema/commit/f5a8507a11325a6341c947d0b5705bdb72a4f852) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - optimize(zod): makes `zx.deepClone` simplier & ~5x faster

- [#259](https://github.com/traversable/schema/pull/259) [`5acd458`](https://github.com/traversable/schema/commit/5acd45800f47d942e34789f3c2bfac58d045c71d) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(json-schema-types): adds fuzz-tested Json Schema validator via `JsonSchema.check`

- [#278](https://github.com/traversable/schema/pull/278) [`266efb3`](https://github.com/traversable/schema/commit/266efb3fa90bc1b0eb34e51a6032a882504ddb61) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - chore(zod,zod-test): upgrades to zod@4.0.9

- [#265](https://github.com/traversable/schema/pull/265) [`70b2611`](https://github.com/traversable/schema/commit/70b2611e9f23c42e43a196a395969b432393205e) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - init(typebox-types): initializes `@traversable/typebox-types`

- [#259](https://github.com/traversable/schema/pull/259) [`8cfec5b`](https://github.com/traversable/schema/commit/8cfec5bb20c2a42488bbbd830ceaaae196f80873) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(json-schema): adds fuzz-tested `JsonSchema.deepEqual`

- [#269](https://github.com/traversable/schema/pull/269) [`27dae65`](https://github.com/traversable/schema/commit/27dae6545ce4d319bc9ae392ac26f62e5732c9c7) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(json-schema): adds fuzz-tested `JsonSchema.deepClone`

- Updated dependencies [[`9532291`](https://github.com/traversable/schema/commit/95322918a79954160a72d2f0f24ef9917b33d539), [`f5a8507`](https://github.com/traversable/schema/commit/f5a8507a11325a6341c947d0b5705bdb72a4f852), [`5acd458`](https://github.com/traversable/schema/commit/5acd45800f47d942e34789f3c2bfac58d045c71d), [`70b2611`](https://github.com/traversable/schema/commit/70b2611e9f23c42e43a196a395969b432393205e), [`8cfec5b`](https://github.com/traversable/schema/commit/8cfec5bb20c2a42488bbbd830ceaaae196f80873), [`e032665`](https://github.com/traversable/schema/commit/e032665e60f71bbc10bcca08a53a28ec513d08b2), [`2ab202c`](https://github.com/traversable/schema/commit/2ab202c5cfdd87dcb7f2bfe089f7a1c102745b43)]:
  - @traversable/registry@0.0.33
  - @traversable/zod-types@0.0.1
  - @traversable/json@0.0.34

## 0.0.9

### Patch Changes

- [#256](https://github.com/traversable/schema/pull/256) [`9f8e89b`](https://github.com/traversable/schema/commit/9f8e89b3d288ae0c8d59f6f2bcb3213ca7e294dd) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - init(typebox-test): initializes `@traversable/typebox-test` package

## 0.0.8

### Patch Changes

- [#248](https://github.com/traversable/schema/pull/248) [`9117fb5`](https://github.com/traversable/schema/commit/9117fb5869bab61ae25f1f4c805471f27f07feea) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs(zod): document the rest of the API

- [#248](https://github.com/traversable/schema/pull/248) [`8d468e5`](https://github.com/traversable/schema/commit/8d468e503db486181f22f0833733fc25877857bd) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - optimize(zod): optimize unions in `zx.equals` to inline type-checking for scalar types

- [#243](https://github.com/traversable/schema/pull/243) [`cc8cd9f`](https://github.com/traversable/schema/commit/cc8cd9f217297b014dc25a617741b643cb0563c6) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs(zod): updates documentation

- [#251](https://github.com/traversable/schema/pull/251) [`813d43e`](https://github.com/traversable/schema/commit/813d43e83d5782fbd9f078c2ca7aca482c9296d2) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - init(zod-test): separates zod testing utils into separate package: `@traversable/zod-test`

- [#245](https://github.com/traversable/schema/pull/245) [`06b2ca6`](https://github.com/traversable/schema/commit/06b2ca6dd316b7f7a3e54cfdb587a725ef07a87b) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs(zod): adds docs for `zx.SeedGenerator` and `zx.seedToSchema`

- [#250](https://github.com/traversable/schema/pull/250) [`2f1b2ad`](https://github.com/traversable/schema/commit/2f1b2ad004b04262847ced9967dcf63a4eac78ea) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds `zx.clone` API

- Updated dependencies [[`2f1b2ad`](https://github.com/traversable/schema/commit/2f1b2ad004b04262847ced9967dcf63a4eac78ea)]:
  - @traversable/registry@0.0.32
  - @traversable/json@0.0.33

## 0.0.7

### Patch Changes

- [#238](https://github.com/traversable/schema/pull/238) [`f254bac`](https://github.com/traversable/schema/commit/f254bac1d6eca4a2db33f4785b46a2af46d09320) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - optimize(zod): adds discriminated union detection for `zx.equals`

- Updated dependencies [[`f254bac`](https://github.com/traversable/schema/commit/f254bac1d6eca4a2db33f4785b46a2af46d09320)]:
  - @traversable/registry@0.0.31
  - @traversable/json@0.0.32

## 0.0.6

### Patch Changes

- [#234](https://github.com/traversable/schema/pull/234) [`980f58a`](https://github.com/traversable/schema/commit/980f58adebdc2f8abf631b1ef7fae0942f744a04) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - optimize(zod): micro-optimizations for `zx.equals`

- [#235](https://github.com/traversable/schema/pull/235) [`a1abbba`](https://github.com/traversable/schema/commit/a1abbbabeda1f4c2659b5f6af8ee9ed025485faa) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - bench(zods): adds benchmarks that prevent compiler optimizations, including:
  - dead code elimination
  - loop invariant code motion

## 0.0.5

### Patch Changes

- [#232](https://github.com/traversable/schema/pull/232) [`7cd3af3`](https://github.com/traversable/schema/commit/7cd3af34d2cf6647be23a5bd4dd396128a1ef02b) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(typebox): adds `box.toString`, random typebox schema generator

- [#232](https://github.com/traversable/schema/pull/232) [`c94246a`](https://github.com/traversable/schema/commit/c94246a7cca8455102c46767173c9b605a03b646) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - refactor(registry,zod,typebox): moves `keyAccessor` and `indexAccessor` to registry

- [#232](https://github.com/traversable/schema/pull/232) [`e84658f`](https://github.com/traversable/schema/commit/e84658f8db4ae2bd3272a8c29683e26f7786b2a9) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - optimize(zod): removes spreading from functor instances

- [#232](https://github.com/traversable/schema/pull/232) [`cc42ee3`](https://github.com/traversable/schema/commit/cc42ee3bd90b3ebbef74de48cdffa28f5fa07ff4) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(typebox): adds `box.equals`

- [#231](https://github.com/traversable/schema/pull/231) [`0f8a50a`](https://github.com/traversable/schema/commit/0f8a50a28918a3065e2bc1110ffe174b88a50052) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - chore(schema,zod): migrates to zod@4.0 proper

- Updated dependencies [[`e84658f`](https://github.com/traversable/schema/commit/e84658f8db4ae2bd3272a8c29683e26f7786b2a9), [`7cd3af3`](https://github.com/traversable/schema/commit/7cd3af34d2cf6647be23a5bd4dd396128a1ef02b), [`c94246a`](https://github.com/traversable/schema/commit/c94246a7cca8455102c46767173c9b605a03b646), [`cc42ee3`](https://github.com/traversable/schema/commit/cc42ee3bd90b3ebbef74de48cdffa28f5fa07ff4)]:
  - @traversable/registry@0.0.30
  - @traversable/json@0.0.31

## 0.0.4

### Patch Changes

- [#228](https://github.com/traversable/schema/pull/228) [`5cbffd5`](https://github.com/traversable/schema/commit/5cbffd5de570af9afd6ed4d9f60c5b5fdbf5881f) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds `zx.equals` support for rest elements in `z.tuple`

- [#228](https://github.com/traversable/schema/pull/228) [`7c93e9a`](https://github.com/traversable/schema/commit/7c93e9a0b404a412423588365c51debf8b2f6d0b) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(zod): fixes bug with `z.union([z.file()]).readonly()`

- [#228](https://github.com/traversable/schema/pull/228) [`46b53cb`](https://github.com/traversable/schema/commit/46b53cb0c198554638c2cf146eda139c5313c574) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - test(zod): fuzz test `zx.equals`

- [#228](https://github.com/traversable/schema/pull/228) [`c216632`](https://github.com/traversable/schema/commit/c216632d9b22f4c0e487169f906f77c23ae0820c) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds `zx.equals` support for "catchall" properties in `z.object`

- Updated dependencies [[`46b53cb`](https://github.com/traversable/schema/commit/46b53cb0c198554638c2cf146eda139c5313c574)]:
  - @traversable/registry@0.0.29
  - @traversable/json@0.0.30

## 0.0.3

### Patch Changes

- [#219](https://github.com/traversable/schema/pull/219) [`4f4ae3a`](https://github.com/traversable/schema/commit/4f4ae3a7f3e97071f40a544135bcaa9d65d7ecf9) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds circular schema detection

- [#223](https://github.com/traversable/schema/pull/223) [`4045bdf`](https://github.com/traversable/schema/commit/4045bdf9ed63719c8e3a8778425fb7a53a4e8d97) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - break(zod): renames `zx.paths` to `zx.toPaths`

- [#221](https://github.com/traversable/schema/pull/221) [`38bb502`](https://github.com/traversable/schema/commit/38bb5021ff8d76f3d27be9189da01bf1903d856d) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(zod): fixes `zx.toType(z.lazy(() => z.any()).readonly())`

- Updated dependencies [[`4f4ae3a`](https://github.com/traversable/schema/commit/4f4ae3a7f3e97071f40a544135bcaa9d65d7ecf9)]:
  - @traversable/registry@0.0.28
  - @traversable/json@0.0.29

## 0.0.2

### Patch Changes

- [#205](https://github.com/traversable/schema/pull/205) [`869c071`](https://github.com/traversable/schema/commit/869c07145f749f8b88c58b8833b178162b8e7212) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): convert a zod schema to a blazing fast jit-compiled type-guard

- [#205](https://github.com/traversable/schema/pull/205) [`97b8829`](https://github.com/traversable/schema/commit/97b88298f4efeabac549d81c47f3c174473cac84) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): convert a zod schema to a blazing fast jit-compiled "deepEquals" function

- [#205](https://github.com/traversable/schema/pull/205) [`b1c2039`](https://github.com/traversable/schema/commit/b1c20395bf548ea0ac00f6025824d077c61e4ea9) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat: optimizes zx.equals.compile and zx.equals.writeable functions

- Updated dependencies [[`97b8829`](https://github.com/traversable/schema/commit/97b88298f4efeabac549d81c47f3c174473cac84), [`b1c2039`](https://github.com/traversable/schema/commit/b1c20395bf548ea0ac00f6025824d077c61e4ea9)]:
  - @traversable/registry@0.0.27
  - @traversable/json@0.0.28

## 0.0.1

### Patch Changes

- [#199](https://github.com/traversable/schema/pull/199) [`4cb8664`](https://github.com/traversable/schema/commit/4cb8664e9a926c68cdbf683c0d46c5680d1a3051) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(zod): adds `@traversable/zod` package

- [#204](https://github.com/traversable/schema/pull/204) [`54f650e`](https://github.com/traversable/schema/commit/54f650e7870cd5cfd46936ea66230edc9a80ec2d) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - docs(zod): adds docs for `zx.makeLens`

- Updated dependencies [[`70dd4bb`](https://github.com/traversable/schema/commit/70dd4bb74817923fe18cef4e9fab350d72868f05), [`4cb8664`](https://github.com/traversable/schema/commit/4cb8664e9a926c68cdbf683c0d46c5680d1a3051)]:
  - @traversable/registry@0.0.26
  - @traversable/json@0.0.27
