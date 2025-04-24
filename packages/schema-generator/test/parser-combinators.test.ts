import * as vi from "vitest"

import { P } from '@traversable/schema-generator'

/** @internal */
let Object_values
  : <T extends {}>(xs: T) => T[keyof T][]
  = globalThis.Object.values

export let key = P.seq(
  P.optional(P.char('"')),
  P.ident,
  P.optional(P.char('"')),
).map(([, k]) => k)

export let propertyValue = P.char().many({ not: P.alt(P.char(','), P.char('}')) }).map((xs) => xs.join(''))

export let entry = P.seq(
  key,
  P.optional(P.whitespace),
  P.char(':'),
  P.optional(P.whitespace),
  propertyValue,
).map(([key, , , , value]) => [key, value] as [k: string, v: string])

export let comma = P.seq(
  P.spaces,
  P.char(','),
  P.spaces,
).map((_) => _[1])

export let entriesDanglingComma = P.seq(
  P.seq(P.trim(entry), P.char(',')).map(([_]) => _).many(),
  P.optional(P.trim(entry)),
).map(([xs, x]) => x === null ? xs : [...xs, x])

export let parseObjectEntries = P.seq(
  P.char('{'),
  P.trim(entriesDanglingComma),
  P.char('}'),
).map(([, _]) => _ === null ? [] : _)

vi.describe("〖️⛳️〗‹‹‹ ❲@traversable/schema-generator❳", () => {
  vi.it("〖️⛳️〗› ❲P❳", () => {

    vi.expect(P.string('hey jude').run('hey jude')).toMatchInlineSnapshot(`
      {
        "index": 8,
        "success": true,
        "value": "hey jude",
      }
    `)
    vi.expect(P.regexp(/type/g).run('type')).toMatchInlineSnapshot(`
      {
        "index": 4,
        "success": true,
        "value": "type",
      }
    `)

    vi.expect(P.ident.run('abc')).toMatchInlineSnapshot(`
      {
        "index": 3,
        "success": true,
        "value": "abc",
      }
    `)

    vi.expect(P.ident.run('1_ab')).toMatchInlineSnapshot(`
      {
        "index": 0,
        "success": false,
      }
    `)

    vi.expect(P.whitespace.run('')).toMatchInlineSnapshot(`
      {
        "index": 0,
        "success": false,
      }
    `)
    vi.expect(P.whitespace.run(' ')).toMatchInlineSnapshot(`
      {
        "index": 1,
        "success": true,
        "value": " ",
      }
    `)
    vi.expect(P.whitespace.run('  ')).toMatchInlineSnapshot(`
      {
        "index": 2,
        "success": true,
        "value": "  ",
      }
    `)

    vi.expect(P.alpha.run('')).toMatchInlineSnapshot(`
      {
        "index": 0,
        "success": false,
      }
    `)
    vi.expect(P.alpha.run('a')).toMatchInlineSnapshot(`
      {
        "index": 1,
        "success": true,
        "value": "a",
      }
    `)
    vi.expect(P.alpha.run('1')).toMatchInlineSnapshot(`
      {
        "index": 0,
        "success": false,
      }
    `)
    vi.expect(P.alpha.run('ab')).toMatchInlineSnapshot(`
      {
        "index": 1,
        "success": true,
        "value": "a",
      }
    `)
    vi.expect(P.alpha.many().run('ab')).toMatchInlineSnapshot(`
      {
        "index": 2,
        "success": true,
        "value": [
          "a",
          "b",
        ],
      }
    `)

    vi.expect(P.ident.run('hey jude')).toMatchInlineSnapshot(`
      {
        "index": 3,
        "success": true,
        "value": "hey",
      }
    `)

    vi.expect(parseObjectEntries.run('{ "abc": 123, "def": 456 }')).toMatchInlineSnapshot(`
      {
        "index": 26,
        "success": true,
        "value": [
          [
            "abc",
            "123",
          ],
          [
            "def",
            "456 ",
          ],
        ],
      }
    `)

    vi.expect(parseObjectEntries.run('{ "abc": 123 }')).toMatchInlineSnapshot(`
      {
        "index": 14,
        "success": true,
        "value": [
          [
            "abc",
            "123 ",
          ],
        ],
      }
    `)

    vi.expect(entriesDanglingComma.run('abc: 123')).toMatchInlineSnapshot(`
      {
        "index": 8,
        "success": true,
        "value": [
          [
            "abc",
            "123",
          ],
        ],
      }
    `)

    vi.expect(parseObjectEntries.run('{}')).toMatchInlineSnapshot(`
      {
        "index": 2,
        "success": true,
        "value": [],
      }
    `)

    vi.expect(parseObjectEntries.run("{\
      type: `equals: equals<this['_type']>`,\
      term: 'equals: equals(x)',\
    } as const")).toMatchInlineSnapshot(`
      {
        "index": 82,
        "success": true,
        "value": [
          [
            "type",
            "\`equals: equals<this['_type']>\`",
          ],
          [
            "term",
            "'equals: equals(x)'",
          ],
        ],
      }
    `)

  })
})
