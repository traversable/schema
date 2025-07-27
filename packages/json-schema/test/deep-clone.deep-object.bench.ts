import { barplot, bench, boxplot, do_not_optimize, group, run, summary } from 'mitata'
import * as fc from 'fast-check'
import { JsonSchema } from '@traversable/json-schema'
import Lodash from 'lodash.clonedeep'

type Type = {
  a: Array<{
    b: Array<{ c: string, d: string, e: string }>
    f: Array<{ g: string, h: string, i: string }>
    j: Array<{ k: string, l: string, m: string }>
  }>
  n: Array<{
    o: Array<{ p: string, q: string, r: string }>
    s: Array<{ t: string, u: string, v: string }>
    w: Array<{ x: string, y: string, z: string }>
  }>
  z?: Array<{
    o: Array<{ p: string, q: string, r: string }>
    s: Array<{ t: string, u: string, v: string }>
    w: Array<{ x: string, y: string, z: string }>
  }>
}

/** 
 * @example
 * function handRolled(x: Type): Type {
 *   return {
 *     a: x.a.map((value) => ({
 *       b: value.b.map((value) => ({ c: value.c, d: value.d, e: value.e })),
 *       f: value.f.map((value) => ({ g: value.g, h: value.h, i: value.i })),
 *       j: value.j.map((value) => ({ k: value.k, l: value.l, m: value.m })),
 *     })),
 *     n: x.n.map((value) => ({
 *       o: value.o.map((value) => ({ p: value.p, q: value.q, r: value.r })),
 *       s: value.s.map((value) => ({ t: value.t, u: value.u, v: value.v })),
 *       w: value.w.map((value) => ({ x: value.x, y: value.y, z: value.z })),
 *     })),
 *     ...x.z && {
 *       z: x.z.map((value) => ({
 *         o: value.o.map((value) => ({ p: value.p, q: value.q, r: value.r })),
 *         s: value.s.map((value) => ({ t: value.t, u: value.u, v: value.v })),
 *         w: value.w.map((value) => ({ x: value.x, y: value.y, z: value.z })),
 *       }))
 *     }
 *   }
 * }
 */

const deepClone = JsonSchema.deepClone({
  type: 'object',
  required: ['a', 'n'],
  properties: {
    a: {
      type: 'array',
      items: {
        type: 'object',
        required: ['b', 'f', 'j'],
        properties: {
          b: {
            type: 'array',
            items: {
              type: 'object',
              required: ['c', 'd', 'e'],
              properties: { c: { type: 'string' }, d: { type: 'string' }, e: { type: 'string' } }
            }
          },
          f: {
            type: 'array',
            items: {
              type: 'object',
              required: ['g', 'h', 'i'],
              properties: { g: { type: 'string' }, h: { type: 'string' }, i: { type: 'string' } }
            }
          },
          j: {
            type: 'array',
            items: {
              type: 'object',
              required: ['k', 'l', 'm'],
              properties: { k: { type: 'string' }, l: { type: 'string' }, m: { type: 'string' } }
            }
          }
        }
      }
    },
    n: {
      type: 'array',
      items: {
        type: 'object',
        required: ['o', 's', 'w'],
        properties: {
          o: {
            type: 'array',
            items: {
              type: 'object',
              required: ['p', 'q', 'r'],
              properties: { p: { type: 'string' }, q: { type: 'string' }, r: { type: 'string' } }
            }
          },
          s: {
            type: 'array',
            items: {
              type: 'object',
              required: ['t', 'u', 'v'],
              properties: { t: { type: 'string' }, u: { type: 'string' }, v: { type: 'string' } }
            }
          },
          w: {
            type: 'array',
            items: {
              type: 'object',
              required: ['x', 'y', 'z'],
              properties: { x: { type: 'string' }, y: { type: 'string' }, z: { type: 'string' } }
            }
          }
        }
      }
    },
    z: {
      type: 'array',
      items: {
        type: 'object',
        required: ['o', 's', 'w'],
        properties: {
          o: {
            type: 'array',
            items: {
              type: 'object',
              required: ['p', 'q', 'r'],
              properties: { p: { type: 'string' }, q: { type: 'string' }, r: { type: 'string' } }
            }
          },
          s: {
            type: 'array',
            items: {
              type: 'object',
              required: ['t', 'u', 'v'],
              properties: { t: { type: 'string' }, u: { type: 'string' }, v: { type: 'string' } }
            }
          },
          w: {
            type: 'array',
            items: {
              type: 'object',
              required: ['x', 'y', 'z'],
              properties: { x: { type: 'string' }, y: { type: 'string' }, z: { type: 'string' } }
            }
          }
        }
      }
    },
  }
}) satisfies (cloneMe: Type) => Type

const arbitrary = fc.record({
  a: fc.array(
    fc.record({
      b: fc.array(fc.record({ c: fc.string(), d: fc.string(), e: fc.string() })),
      f: fc.array(fc.record({ g: fc.string(), h: fc.string(), i: fc.string() })),
      j: fc.array(fc.record({ k: fc.string(), l: fc.string(), m: fc.string() })),
    }),
  ),
  n: fc.array(
    fc.record({
      o: fc.array(fc.record({ p: fc.string(), q: fc.string(), r: fc.string() })),
      s: fc.array(fc.record({ t: fc.string(), u: fc.string(), v: fc.string() })),
      w: fc.array(fc.record({ x: fc.string(), y: fc.string(), z: fc.string() })),
    }),
  ),
  z: fc.array(
    fc.record({
      o: fc.array(fc.record({ p: fc.string(), q: fc.string(), r: fc.string() })),
      s: fc.array(fc.record({ t: fc.string(), u: fc.string(), v: fc.string() })),
      w: fc.array(fc.record({ x: fc.string(), y: fc.string(), z: fc.string() })),
    }),
  )
}, { requiredKeys: ['a', 'n'] }) satisfies fc.Arbitrary<Type>

const [data] = fc.sample(arbitrary, 1)

console.log('DATA', JSON.stringify(data, null, 2))

boxplot(() => {
  summary(() => {
    group('〖🏁️〗››› JsonSchema.deepClone: object (deep)', () => {
      barplot(() => {
        bench('Lodash', function* () {
          yield {
            [0]() { return data },
            bench(x: Type) {
              do_not_optimize(
                Lodash(x)
              )
            }
          }
        }).gc('inner')

        bench('structuredClone', function* () {
          yield {
            [0]() { return data },
            bench(x: Type) {
              do_not_optimize(
                structuredClone(x)
              )
            }
          }
        }).gc('inner')

        bench('JSON.stringify + JSON.parse', function* () {
          yield {
            [0]() { return data },
            bench(x: Type) {
              do_not_optimize(
                JSON.parse(JSON.stringify(x))
              )
            }
          }
        }).gc('inner')

        bench('JsonSchema.deepClone', function* () {
          yield {
            [0]() { return data },
            bench(x: Type) {
              do_not_optimize(
                deepClone(x)
              )
            }
          }
        }).gc('inner')

        /**
         * @example
         * bench('handrolled', function* () {
         *   yield {
         *     [0]() { return data },
         *     bench(x: Type) {
         *       do_not_optimize(
         *         handRolled(x)
         *       )
         *     }
         *   }
         * }).gc('inner')
         */
      })
    })
  })
})

await run({ throw: true })
