import * as React from 'react'
import * as fc from 'fast-check'
import { expectTypeOf } from 'expect-type'

import { t } from './lib'
import { Hover } from './lib/hover'

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

expectTypeOf<
  | "{ 'abc': number, 'def': { 'ghi': (number)[] } }"
  | "{ 'def': { 'ghi': (number)[] }, 'abc': number }"
>(stringified)

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


/**
 * DEMO: validation
 *
 * Import from `@traversable/derive-validators` to install the '.validate' method to all schemas:
 */
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


/**
 * DEMO: converting your schema into a bi-directional codec
 *
 * Import from `@traversable/derive-codec` to install the '.codec' method to all schemas.
 * 
 * From there, you'll have access to `.pipe`, `.extend`, `.decode` and `.encode`. You can pipe and extend
 * as many times as you want -- the transformations will be added to a queue (`.pipe` puts a transformation
 * in the "after" queue, `.extend` puts a preprocessor in the "before" queue).
 * 
 * If you need to recover the original schema, you can access it via the `.schema` property on the codec.
 */
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


/**
 * DEMO: advanced use
 * 
 * Library authors can use the core library as an extension point.
 * 
 * Keep in mind that as you install new features/methods to all schemas (say, `.toJsonSchema`), that you'll
 * probably need to implement those methods on the schemas you've added.
 * 
 * For this example, I added a `./lib` folder in the current directory, and implemented 2 new schemas:
 * 
 * - `t.set`, which targets the native `Set` data structure
 * - `t.map`, which targets the native `Map` data structure
 * 
 * In addition to implementing the type predicates, I also:
 * 
 * 1. made sure to not break reflection, by appending the respective ASTs to their `.def` property
 * 2. extended the `URI` object with new tags, and appended the respective tag to their `.tag` property
 * 3. implemented `.validate` for each schema
 * 4. imlemented type- and term-level `.toString` methods
 * 5. since `Set` and `Map` don't have a JSON Schema representation, their `.toJsonSchema` methods return `void 0`
 * 6. extended `Functor` and `IndexedFunctor` to make sure we can also traverse over the new schemas
 * 7. extended the `toString` algebra from core (this is the _recursive_ function, not the method on each schema)
 * 8. as an integration test, I exercised the recursive `toString` function using a combination of built-in schemas and our new additions
 * 9. installed the features I wanted to support, and re-exported the core library from a barrel file where I also exported `t.set` and `t.map`
 * 
 * It's a fair bit of work to do, so let's step back and talk through what we've accomplished:
 * 
 * 1. we now have a reusable abstraction that lets us implement arbitrary recursion over any schema tree (including the schemas we added)
 * 2. to promote our new schemas, we needed to implement a lot of stuff, but most of it was to make sure the schemas were compatible with our opt-in features
 * 3. because the core API is consistent, we were able to draw from examples at every step
 * 4. because the core API is not magical, we didn't need to cast any spells or cut deals with the devil to get it done
 * 5. finally, the extension is seamless: our new additions are indistinguishable from the core library -- all users need to do is import the namespace, and they're off
 */

let set = t.set(t.record(t.boolean))

let map = t.map(t.array(t.union(t.string, t.number)), set)
//  ^?
//  ^^ if you look at the schema's type, you'll see that our extensions are indistinguishable from the core library

const setInstance = new Set()
setInstance.add({ abc: false, def: true })
const mapInstance = new Map()
mapInstance.set([1, 2, '3'], setInstance)

console.group('=========================\n\r  DEMO: extension point \n=========================\n\r')
console.log()
/** 
 * t.map 
 */
console.debug('[[map]]: successfully parsed valid data\n', map.unsafeParse(mapInstance))
try {
  mapInstance.set([Symbol.for('invalid key entry')], new Set());
  console.error('[[map]]: OOPS! if you see this message, `t.map` let bad data slip through :(', map.unsafeParse(mapInstance))
} catch (e) { console.info('[[map]]: successfully filtered out the bad') }
console.debug(`[[map]]: .toString works:\n\r`, map.toString())
/** 
 * t.set 
 */
console.debug('[[set]]: successfully parsed valid data\n', set.unsafeParse(setInstance))
try {
  setInstance.add(2);
  console.error('[[set]]: OOPS! if you see this message, `t.set` let bad data slip through :(', set.unsafeParse(setInstance))
} catch (e) { console.info('[[set]]: successfully filtered out the bad') }
console.debug(`[[set]]: .toString works:\n\r`, set.toString())
/** 
 * native
 */
console.debug('[[unsafeParse]]: `.unsafeParse` sucessfully installed on native schemas', t.array(t.string).unsafeParse)
console.assert(t.array(t.string).unsafeParse !== void 0)
console.debug('[[unsafeParse]]: `.unsafeParse` successfully parsed valid data', t.array(t.string).unsafeParse(['hey']))
try {
  console.error('[[unsafeParse]]: OOPS! if you see this message, `t.array(t.string).unsfaeParse` let bad data slip through :(', t.array(t.string).unsafeParse([3.141592]))
} catch (e) { console.info('[[unsafeParse]]: successfully filtered out the bad') }
console.groupEnd()

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

const Newline = () => <><br /><br /></>

const seed = t.Seed.schema()

const Button = ({ forceRerender }: { forceRerender(): void }) =>
  <button onClick={forceRerender}>Randomize</button>

export function Sandbox() {
  const [, forceRerender] = React.useReducer((x) => x + 1, 0)
  const schemas = fc.sample(seed, 100)
  return <>
    <pre style={{ padding: '1rem', position: 'relative' }}>
      <Hover texts={t.toTermWithTypeHtml(t.never)} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.any)} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.unknown)} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.void)} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.null)} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.undefined)} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.symbol)} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.boolean)} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.integer)} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.integer.min(-10))} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.integer.moreThan(-10))} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.integer.lessThan(100))} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.integer.max(255))} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.bigint)} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.number)} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.string)} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.string.min(3))} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.string.max(255))} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.eq({ xyz: [1, "two", false] }))} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.array(t.boolean))} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.record(t.string))} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.optional(t.number))} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.union(t.string, t.boolean))} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.intersect(t.object({ a: t.string }), t.object({ b: t.integer })))} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.tuple(t.string, t.null, t.boolean))} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.tuple(t.string, t.optional(t.null), t.optional(t.boolean)))} />
      <Newline />
      <Hover texts={t.toTermWithTypeHtml(t.object({ a: t.null, b: t.optional(t.string), c: t.object({ d: t.boolean }) }))} />
      <Newline />

      <Button forceRerender={forceRerender} />
      <Newline />
      {schemas.map((schema, ix) => <span key={ix}><Hover texts={t.toTermWithTypeHtml(schema)} /><Newline /></span>)}

    </pre>
  </>
}

/* 
*/
