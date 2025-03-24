import { useReducer } from 'react'
import * as fc from 'fast-check'
import { expectTypeOf } from 'expect-type'

import { t } from './lib'
window.t = t

/**
 * DEMO: toString()
 */
let ex_01 = t.object({
  abc: t.number,
  def: t.object({
    ghi: t.array(t.integer)
  })
})

let stringified = ex_01.toString()
//  ^?

expectTypeOf<| "{ 'abc': number, 'def': { 'ghi': (number)[] } }">(stringified)

console.group('=====================\n\r  DEMO: .toString()\n=====================\n\r')
console.debug('stringified:', stringified)
console.assert(stringified === "{ 'abc': number, 'def': { 'ghi': (number)[] } }" as string)
console.groupEnd()

/**
 * DEMO: toJsonSchema()
 */
let ex_02 = t.object({
  bool: t.optional(t.boolean),
  nested: t.object({
    int: t.integer,
    union: t.union(
      t.eq(1),
      t.tuple(
        t.eq(1),
        t.optional(t.eq(2)),
        t.optional(t.eq(3)),
        // t.eq(4),
        // ^^ Uncommenting this line will raise a TypeError:
        // 🚫 't.null' is not assignable to 'TypeError<"A required element cannot follow an optional element.">'
      ),
    )
  }),
  stringOrNumber: t.union(t.string, t.number),
})

let JSONSchema = ex_02.toJsonSchema()

console.group('=========================\n\r  DEMO: .toJsonSchema()\n=========================\n\r')
console.debug('JSONSchema:', JSONSchema)
console.assert(t.eq(JSONSchema)({
  type: 'object',
  required: ['nested', 'stringOrNumber'],
  properties: {
    bool: { type: 'boolean' },
    nested: {
      type: 'object',
      required: ['int', 'union'],
      properties: {
        int: { type: 'integer' },
        union: {
          anyOf: [
            { const: 1 },
            {
              type: 'array',
              additionalItems: false,
              minItems: 1,
              maxItems: 3,
              items: [{ 'const': 1 }, { 'const': 2 }, { 'const': 3 }],
            }
          ]
        }
      }
    },
    stringOrNumber: { anyOf: [{ type: 'string' }, { type: 'number' }] }
  }
}))
console.groupEnd()


/**
 * DEMO: inferred type predicates
 *
 * You can use the built-in `instanceof` operator to create a schema
 * for any JavaScript class:
 */
export let classes = t.object({
  error: (v) => v instanceof Error,
  typeError: (v) => v instanceof TypeError,
  readableStream: (v) => v instanceof ReadableStream,
  syntaxError: (v) => v instanceof SyntaxError,
  buffer: (v) => v instanceof ArrayBuffer,
  promise: (v) => v instanceof Promise,
  set: (v) => v instanceof Set,
  map: (v) => v instanceof Map,
  weakMap: (v) => v instanceof WeakMap,
  date: (v) => v instanceof Date,
  regex: (v) => v instanceof RegExp,
})

/**
 * DEMO: inferred type predicates
 *
 * You can write inline type predicates, and `@traversable/schema` keep track of
 * that at the type-level, even when the predicate is used inside a larger schema:
 */
export let values = t.object({
  successStatus: (v) => v === 200 || v === 201 || v === 202 || v === 204,
  clientErrorStatus: (v) => v === 400 || v === 401 || v === 403 || v === 404,
  serverErrorStatus: (v) => v === 500 || v === 502 || v === 503,
  teapot: (v) => v === 418,
  true: (v) => v === true,
  false: (v) => v === false,
  mixed: (v) => Array.isArray(v) || v === true,
  startsWith: (v): v is `bill${string}` => typeof v === 'string' && v.startsWith('bill'),
  endsWith: (v): v is `${string}murray` => typeof v === 'string' && v.endsWith('murral'),
  function: (v) => typeof v === 'function',
})

/**
 * DEMO: inferred type predicates
 *
 * There are a few "shorthand" predicates you can write, if you'd prefer:
 *
 * - `Boolean` -> `t.nonnullable`
 *   - under the hood, `Boolean` gets mapped to `t.nonnullable`, so you get the semantics you want,
 *     without the footgun (i.e., `Boolean(0)` or `Boolean("")` both return `false`)
 * - `() => true` -> `t.unknown`
 * - `() => false` -> `t.optional(t.never)`
 */
export let shorthand = t.object({
  nonnullable: Boolean,
  unknown: () => true,
  never: () => false,
})

export type Ex03 = t.typeof<typeof ex_03>
let ex_03 = t.object({
  tuples: t.tuple(
    t.tuple(
      t.any,
      t.tuple(
        t.unknown,
        t.void,
      ),
      t.never,
    ),
    t.null,
    t.undefined,
    t.tuple(
      t.tuple(
        t.tuple(
          t.symbol,
          t.boolean,
        ),
        t.integer,
        t.number,
      ),
      t.string,
      t.tuple(
        t.eq({
          arbitrary: [
            { json: [] },
            { value: {} },
          ]
        }),
        t.array(t.string),
      ),
      t.tuple(
        t.tuple(
          t.record(t.boolean),
          t.tuple(
            t.tuple(
              t.union(t.number, t.bigint),
              t.intersect(
                t.object({ null: t.null }),
                t.object({ void: t.void }),
              ),
            ),
            t.tuple(
              t.enum('8 ball', '9 ball', '10 ball'),
            ),
          ),
          t.enum({ x: 0, y: 1 }),
        )
      ),
    ),
    // t.tuple(t.nonnullable),
    // t.filter(t.string, (s) => s.length >= 0 && s.length <= 255),
  ),
  objects: t.object({
    A: t.eq('#/A'),
    B: t.object({
      C: t.eq('#/B/C'),
      D: t.object({
        E: t.eq('#/B/D/E'),
        F: t.object({
          G: t.eq('#/B/D/F/G'),
          H: t.eq('#/B/D/F/H')
        }),
        I: t.eq('#/B/D/I')
      }),
      J: t.eq('#/B/J')
    }),
    K: t.object({
      L: t.eq('#/K/L'),
      M: t.object({
        N: t.eq('#/K/M/N'),
        O: t.object({
          P: t.eq('#/K/M/O/P'),
          Q: t.eq('#/K/M/O/Q')
        }),
        R: t.eq('#/L/M/R')
      }),
      S: t.eq('#/K/S'),
    }),
    T: t.eq('#/T')
  }),
})

let validated = ex_03.validate({
  tuples:
    [
      [
        [0, 0],
        [
          [0, 1, 0],
          [0, 1, 1]
        ],
        [0, 2]
      ],
      [1],
      [2],
      [
        [
          [
            [3, 0, 0, 0],
            [3, 0, 0, 1],
          ],
          [3, 0, 1],
          [3, 0, 2],
        ],
        [3, 1],
        [
          [3, 2, 0],
          [3, 2, 1],
        ],
        [
          [
            [3, 3, 0, 0],
          ],
          [
            [
              [3, 3, 1, 0, 0],
              [3, 3, 1, 0, 1],
            ]
          ],
          [3, 3, 1, 1],
        ],
        [3, 3, 2],
      ],
      [4],
    ],
  objects: {
    A: 'HI',
    B: {
      C: 'HOW',
      D: {
        E: 'R',
      },
    },
    K: {
      M: {
        R: 'YOU?',
      },
    },
  }
})

console.group('=====================\n\r  DEMO: .validate()\n=====================\n\r')
console.debug('validated:', validated)
console.assert(t.eq(validated)([
  { kind: 'TYPE_MISMATCH', path: ['tuples', 0, 1, 1], expected: 'void', got: [0, 1, 1], msg: 'Expected void' },
  { kind: 'TYPE_MISMATCH', path: ['tuples', 0, 2], expected: 'never', got: [0, 2], msg: 'Expected not to receive a value' },
  { kind: 'TYPE_MISMATCH', path: ['tuples', 1], expected: 'null', got: [1], msg: 'Expected null' },
  { kind: 'TYPE_MISMATCH', path: ['tuples', 2], expected: 'undefined', got: [2], msg: 'Expected undefined' },
  { kind: 'TYPE_MISMATCH', path: ['tuples', 3, 0, 0, 0], expected: 'symbol', got: [3, 0, 0, 0], msg: 'Expected a symbol' },
  { kind: 'TYPE_MISMATCH', path: ['tuples', 3, 0, 0, 1], expected: 'boolean', got: [3, 0, 0, 1], msg: 'Expected a boolean' },
  { kind: 'TYPE_MISMATCH', path: ['tuples', 3, 0, 1], expected: 'number', got: [3, 0, 1], msg: 'Expected an integer' },
  { kind: 'TYPE_MISMATCH', path: ['tuples', 3, 0, 2], expected: 'number', got: [3, 0, 2], msg: 'Expected a number' },
  { kind: 'TYPE_MISMATCH', path: ['tuples', 3, 1], expected: 'string', got: [3, 1], msg: 'Expected a string' },
  { kind: 'TYPE_MISMATCH', path: ['tuples', 3, 2, 0], expected: { 'arbitrary': [{ 'json': [] }, { 'value': {} }] }, got: [3, 2, 0], msg: 'Expected exact value: {"arbitrary":[{"json":[]},{"value":{}}]}' },
  { kind: 'TYPE_MISMATCH', path: ['tuples', 3, 2, 1, 0], expected: 'string', got: 3, msg: 'Expected a string' },
  { kind: 'TYPE_MISMATCH', path: ['tuples', 3, 2, 1, 1], expected: 'string', got: 2, msg: 'Expected a string' },
  { kind: 'TYPE_MISMATCH', path: ['tuples', 3, 2, 1, 2], expected: 'string', got: 1, msg: 'Expected a string' },
  { kind: 'TYPE_MISMATCH', path: ['tuples', 3, 3, 0, 0], got: [3, 3, 0, 0], msg: 'Expected object' },
  { kind: 'REQUIRED', path: ['tuples', 3, 3, 0, 1], got: 'Missing required index 1' },
  { kind: 'REQUIRED', path: ['tuples', 3, 3, 0, 2], got: 'Missing required index 2' },
  { kind: 'EXCESSIVE', path: ['tuples', 3, 3, 1], got: [[[3, 3, 1, 0, 0], [3, 3, 1, 0, 1]]] },
  { kind: 'EXCESSIVE', path: ['tuples', 3, 3, 2], got: [3, 3, 1, 1] },
  { kind: 'EXCESSIVE', path: ['tuples', 3, 4], got: [3, 3, 2] },
  { kind: 'EXCESSIVE', path: ['tuples', 4], got: [4] },
  { kind: 'TYPE_MISMATCH', path: ['objects', 'A'], expected: '#/A', got: 'HI', msg: 'Expected exact value: "#/A"' },
  { kind: 'TYPE_MISMATCH', path: ['objects', 'B', 'C'], expected: '#/B/C', got: 'HOW', msg: 'Expected exact value: "#/B/C"' },
  { kind: 'TYPE_MISMATCH', path: ['objects', 'B', 'D', 'E'], expected: '#/B/D/E', got: 'R', msg: 'Expected exact value: "#/B/D/E"' },
  { kind: 'REQUIRED', path: ['objects', 'B', 'D'], got: 'Missing key \'F\'' },
  { kind: 'REQUIRED', path: ['objects', 'B', 'D'], got: 'Missing key \'I\'' },
  { kind: 'REQUIRED', path: ['objects', 'B'], got: 'Missing key \'J\'' },
  { kind: 'REQUIRED', path: ['objects', 'K'], got: 'Missing key \'L\'' },
  { kind: 'REQUIRED', path: ['objects', 'K', 'M'], got: 'Missing key \'N\'' },
  { kind: 'REQUIRED', path: ['objects', 'K', 'M'], got: 'Missing key \'O\'' },
  { kind: 'TYPE_MISMATCH', path: ['objects', 'K', 'M', 'R'], expected: '#/L/M/R', got: 'YOU?', msg: 'Expected exact value: "#/L/M/R"' },
  { kind: 'REQUIRED', path: ['objects', 'K'], got: 'Missing key \'S\'' },
  { kind: 'REQUIRED', path: ['objects'], got: 'Missing key \'T\'' }
]))
console.groupEnd()

let User = t
  .object({ name: t.optional(t.string), createdAt: t.string }).codec
  .pipe(({ name = '', ...user }) => ({ ...user, firstName: name.split(' ')[0], lastName: name.split(' ')[1] ?? '', createdAt: new Date(user.createdAt) }))
  .unpipe(({ firstName, lastName, ...user }) => ({ ...user, name: firstName + ' ' + lastName, createdAt: user.createdAt.toISOString() }))

let payload = { name: 'Bill Murray', createdAt: new Date(0).toISOString() }

let fromAPI = User.parse(payload)
//   ^?  let fromAPI: Error | { name?: string, createdAt: Date}

if (fromAPI instanceof Error) throw fromAPI
fromAPI
// ^? { name?: string, createdAt: Date }

let toAPI = User.encode(fromAPI)
//  ^? let toAPI: { name?: string, createdAt: string }

console.group('===============\n\r  DEMO: .pipe\n===============\n\r')
console.debug('raw data:', payload)
console.debug('decoded:', fromAPI)
console.assert(t.eq(fromAPI)({ firstName: 'Bill', lastName: 'Murray', createdAt: new Date(payload.createdAt) }))
console.debug('encoded:', toAPI)
console.assert(t.eq(toAPI)({ name: 'Bill Murray', createdAt: fromAPI.createdAt.toISOString() }))
console.groupEnd()


let data = {
  title: {
    href: 'https://github.com/traversable/schema/blob/main/packages/json/README.md',
    pkgName: '@traversable/json',
  }
}

interface Builder<T = null | boolean | number | string> {
  array: T[]
  object: { [x: string]: T }
  json: T | Omit<this, 'json'>[Exclude<keyof this, 'json'>]
}

const builder
  : <T extends readonly unknown[]>(...scalars: { [Ix in keyof T]: fc.Arbitrary<T[Ix]>; }) => fc.LetrecValue<Builder<T[number]>>
  = (...scalars) => fc.letrec((loop) => {
    return {
      array: fc.array(loop('json')),
      object: fc.dictionary(fc.string(), loop('json')),
      json: fc.oneof(
        ...scalars,
        loop('array'),
        loop('object'),
      )
    }
  })

const arbitrary = builder(
  fc.constant(null),
  fc.boolean(),
  fc.float(),
  fc.bigInt(),
  fc.string()
)

const Title = () => <h1>
  Example from the {' '}
  <a href={data.title.href} target="_blank"><code>{data.title.pkgName}</code> docs</a>
</h1>

type DataProps<T> = {
  renderCount: number
  data: T
}

const Data = <T,>(_props: DataProps<T>) => <>
  {/* <pre>{prettyPrint(_props.data as Json.Fixpoint)}</pre> */}
</>

export function Sandbox() {
  const [renderCount, forceRender] = useReducer(x => x + 1, 0)
  return <>
    <p>Render #{renderCount}</p>

    <Title />
    <button onClick={forceRender}>Regenerate</button>
    <Data renderCount={renderCount} data={fc.sample(arbitrary.json, 1)[0]} />
  </>
}

