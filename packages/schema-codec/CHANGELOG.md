# @traversable/schema-codec

## 0.0.6

### Patch Changes

- [#67](https://github.com/traversable/schema/pull/67) [`3cfb05e`](https://github.com/traversable/schema/commit/3cfb05e186b61f816d3a7ae8c3f0884ff5aceab3) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix(registry): moves nested files up a level so they're part of the build

- Updated dependencies [[`3cfb05e`](https://github.com/traversable/schema/commit/3cfb05e186b61f816d3a7ae8c3f0884ff5aceab3)]:
  - @traversable/registry@0.0.12
  - @traversable/schema-core@0.0.13

## 0.0.5

### Patch Changes

- [#65](https://github.com/traversable/schema/pull/65) [`7865d59`](https://github.com/traversable/schema/commit/7865d5955f02e7ba16bfa44d331289ece88e1eb6) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - attempt to fix build

- Updated dependencies [[`7865d59`](https://github.com/traversable/schema/commit/7865d5955f02e7ba16bfa44d331289ece88e1eb6)]:
  - @traversable/registry@0.0.11
  - @traversable/schema-core@0.0.12

## 0.0.4

### Patch Changes

- [#63](https://github.com/traversable/schema/pull/63) [`904a3c9`](https://github.com/traversable/schema/commit/904a3c9d6bd87e573a60f37b8146f199d6994bdf) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - fix build

- Updated dependencies [[`904a3c9`](https://github.com/traversable/schema/commit/904a3c9d6bd87e573a60f37b8146f199d6994bdf), [`96ec20f`](https://github.com/traversable/schema/commit/96ec20f2d6cff2cd369e095080201171247dc213)]:
  - @traversable/registry@0.0.10
  - @traversable/schema-core@0.0.11

## 0.0.3

### Patch Changes

- Updated dependencies [[`18b24e3`](https://github.com/traversable/schema/commit/18b24e3649c48d176063cb004ca909488ded6528)]:
  - @traversable/schema-core@0.0.10
  - @traversable/registry@0.0.9

## 0.0.2

### Patch Changes

- [#52](https://github.com/traversable/schema/pull/52) [`a76de78`](https://github.com/traversable/schema/commit/a76de789d85182281bea1f36eac284068f2920d9) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(schema): composes features from dependencies in `@traversable/schema`

- [#46](https://github.com/traversable/schema/pull/46) [`4d278c5`](https://github.com/traversable/schema/commit/4d278c5f2e5810f221570a0b062de085a6ec1a12) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - feat(json-schema): adds native support for JSON schema

- Updated dependencies [[`a76de78`](https://github.com/traversable/schema/commit/a76de789d85182281bea1f36eac284068f2920d9), [`b7132bb`](https://github.com/traversable/schema/commit/b7132bb14ce51b305259bb9c44d7cc9fd57d55f4), [`34783db`](https://github.com/traversable/schema/commit/34783db67cb2ab0707d0e938613dc3b2d2221cb2), [`67870c7`](https://github.com/traversable/schema/commit/67870c7f889d9a8c69b87ffa8f3ea32edda4e2a8), [`4d278c5`](https://github.com/traversable/schema/commit/4d278c5f2e5810f221570a0b062de085a6ec1a12)]:
  - @traversable/registry@0.0.8
  - @traversable/schema-core@0.0.9

## 0.0.1

### Patch Changes

- [#43](https://github.com/traversable/schema/pull/43) [`85d89ef`](https://github.com/traversable/schema/commit/85d89efd34bf1f737ecc2e5050994dc47de354fc) Thanks [@ahrjarrett](https://github.com/ahrjarrett)! - init(codec): adds `@traversable/schema-codec` package

  ## new packages

  - `@traversable/schema-codec`

    This package allows users to promote a schema from `@traversable/schema` or `@traversable/schema-core` to being a _codec_.

    A traversable codec is a bi-directional decoder + encoder pair. It was specifically designed for the "BFF" or "middleware"
    use case.

    All codecs include `.pipe` and `.extend` instance methods that allow users to "stack" an arbitrary number of encodings / decodings.

    ### Example

    ```typescript
    import * as vi from "vitest";
    import { Codec } from "@traversable/schema-codec";

    interface ApiResponse {
      data: t.typeof<typeof ServerUser>;
    }

    const ServerUser = t.object({
      createdAt: t.string,
      updatedAt: t.string,
    });

    interface ClientUser {
      id: number;
      createdAt: Date;
      updatedAt: Date;
    }

    const myCodec = Codec.new(ServerUser)
      .pipe((user) => ({ ...user, id: makeId() }))
      .unpipe(({ id, ...user }) => user)
      .pipe(
        (user): ClientUser => ({
          ...user,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        })
      )
      .unpipe((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      }))
      .extend((fromAPI: ApiResponse) => fromAPI.data)
      .unextend((data) => ({ data }));

    type MyCodec = typeof myCodec;
    //   ^? type MyCodec = Codec<ApiResponse, ClientUser>

    const createdAt = new Date(2021, 0, 31);
    const updatedAt = new Date();

    const clientUser = { id: 0, createdAt, updatedAt } satisfies ClientUser;

    const serverResponse = {
      data: {
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      },
    };

    vi.test("codec satisfies the roundtrip property", () => {
      vi.assert.deepEqual(myCodec.decode(serverResponse), clientUser);
      vi.assert.deepEqual(
        myCodec.encode(myCodec.decode(serverResponse)),
        serverResponse
      );
      vi.assert.deepEqual(
        myCodec.decode(myCodec.encode(myCodec.decode(serverResponse))),
        clientUser
      );
    });
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

      The use case for `.extend` is typically when you need to extend to preprocess data **before** it enters
      its "canonical" form.

- Updated dependencies [[`b653ec4`](https://github.com/traversable/schema/commit/b653ec4b3f363793f31a46fe84dc30b60f99388a)]:
  - @traversable/schema-core@0.0.8
  - @traversable/registry@0.0.7
