import { t } from '../lib'

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


