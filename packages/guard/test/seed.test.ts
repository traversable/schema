import * as vi from 'vitest'
import { z } from 'zod'
import { fc, test } from '@fast-check/vitest'

import type { Functor } from '@traversable/guard'
import { t, fn, Seed, URI } from '@traversable/guard'

/** @internal */
const stringify = (x: unknown) => JSON.stringify(
  x,
  (_, v) => typeof v === 'symbol' ? 'Sym(' + v.description + ')' : v,
  2
)

/** @internal */
const logFailure = (
  schema: t.Fixpoint,
  zodSchema: z.ZodTypeAny,
  stringifiedSchema: string,
  input: fc.JsonValue,
  parsed: z.SafeParseReturnType<any, any>,
) => {
  console.group('\n\n\r'
    + ' \
╥┬┬╥┬┬╥┬┬╥┬┬╥┬┬╥┬┬╥┬┬╥┬┬╥ \n\r\
╟     PARSE FAILURE     ╢ \n\r\
╨┴┴╨┴┴╨┴┴╨┴┴╨┴┴╨┴┴╨┴┴╨┴┴╨ \n\r\
    '.trim()
  )
  console.debug('\n\n\r', 'Input:', '\n\r', stringify(input))
  console.debug('\n\n\r', 'Internal result:', '\n\r', schema(input))
  console.debug('\n\n\r', 'Internal schema tag:', '\n\r', stringify(schema.def))
  console.debug('\n\n\r', 'Internal schema body:', '\n\r', stringify(schema.def))
  console.debug('\n\n\r', 'Zod Schema:', '\n\r', zodSchema)
  console.debug('\n\n\r', 'Error:', '\n\r', stringify(parsed.error))
  console.debug('\n\n\r', 'String:', '\n\r', stringify(stringifiedSchema))
  console.groupEnd()
}


const ZodNullaryMap = {
  [URI.never]: z.never(),
  [URI.unknown]: z.unknown(),
  [URI.any]: z.any(),
  [URI.void]: z.void(),
  [URI.null]: z.null(),
  [URI.undefined]: z.undefined(),
  [URI.symbol_]: z.symbol(),
  [URI.boolean]: z.boolean(),
  [URI.number]: z.number(),
  [URI.bigint]: z.bigint(),
  [URI.string]: z.string(),
}

const zodAlgebra: Functor.Algebra<Seed.F, z.ZodTypeAny> = (x) => {
  switch (true) {
    default: return fn.exhaustive(x)
    case Seed.isNullary(x): return ZodNullaryMap[x[0]]
    case x[0] === URI.optional: return z.optional(x[1])
    case x[0] === URI.array: return z.array(x[1])
    case x[0] === URI.tuple: return z.tuple([x[1][0], ...x[1].slice(1)])
    case x[0] === URI.object: return z.object(globalThis.Object.fromEntries(x[1]))
    case x[0] === URI.record: return z.record(x[1])
    case x[0] === URI.union: return z.union([x[1][0], x[1][1], ...x[1].slice(2)])
    case x[0] === URI.intersect: return x[1].slice(1).reduce((acc, y) => acc.and(y), x[1][0])
  }
}

/** @internal */
const builder = fc.letrec(Seed.seed())

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/guard/seed❳', () => {

  test.prop([builder.tree], { numRuns: 1000 })(
    '〖⛳️〗› ❲Seed.Functor❳: Seed Functor preserves structure',
    (seed) => vi.assert.deepEqual(Seed.identity(seed), seed)
  )

  const tupleLength_1_3 = fc.letrec(Seed.seed({ tuple: { minLength: 1, maxLength: 3 } })).tuple
  const tupleLength_1_5 = fc.letrec(Seed.seed({ tuple: { minLength: 1, maxLength: 5 } })).tuple
  const tupleLength_3_5 = fc.letrec(Seed.seed({ tuple: { minLength: 3, maxLength: 5 } })).tuple
  test.prop([tupleLength_1_3, tupleLength_1_5, tupleLength_3_5], {})('no options',
    (_1_3, _1_5, _3_5) => {
      vi.assert.equal(_1_3[0], URI.tuple)
      vi.assert.equal(_1_5[0], URI.tuple)
      vi.assert.equal(_3_5[0], URI.tuple)
      vi.assert.isArray(_1_3[1])
      vi.assert.isArray(_1_5[1])
      vi.assert.isArray(_3_5[1])
      vi.assert.isAtLeast(_1_3[1].length, 1)
      vi.assert.isAtMost(_1_3[1].length, 3)
      vi.assert.isAtLeast(_1_5[1].length, 1)
      vi.assert.isAtMost(_1_5[1].length, 5)
      vi.assert.isAtLeast(_3_5[1].length, 3)
      vi.assert.isAtMost(_3_5[1].length, 5)
    }
  );

  const objectKeys_1_3 = fc.letrec(Seed.seed({ object: { minLength: 1, maxLength: 3 } })).object
  const objectKeys_1_5 = fc.letrec(Seed.seed({ object: { minLength: 1, maxLength: 5 } })).object
  const objectKeys_3_5 = fc.letrec(Seed.seed({ object: { minLength: 3, maxLength: 5 } })).object
  test.prop([objectKeys_1_3, objectKeys_1_5, objectKeys_3_5], {})('no options',
    (_1_3, _1_5, _3_5) => {
      vi.assert.equal(_1_3[0], URI.object)
      vi.assert.equal(_1_5[0], URI.object)
      vi.assert.equal(_3_5[0], URI.object)
      vi.assert.isArray(_1_3[1])
      vi.assert.isArray(_1_5[1])
      vi.assert.isArray(_3_5[1])
      vi.assert.isAtLeast(_1_3[1].length, 1)
      vi.assert.isAtMost(_1_3[1].length, 3)
      vi.assert.isAtLeast(_1_5[1].length, 1)
      vi.assert.isAtMost(_1_5[1].length, 5)
      vi.assert.isAtLeast(_3_5[1].length, 3)
      vi.assert.isAtMost(_3_5[1].length, 5)
    }
  );

  const unionSize_1_3 = fc.letrec(Seed.seed({ union: { minLength: 1, maxLength: 3 } })).union
  const unionSize_1_5 = fc.letrec(Seed.seed({ union: { minLength: 1, maxLength: 5 } })).union
  const unionSize_3_5 = fc.letrec(Seed.seed({ union: { minLength: 3, maxLength: 5 } })).union
  test.prop([unionSize_1_3, unionSize_1_5, unionSize_3_5], {})('no options',
    (_1_3, _1_5, _3_5) => {
      vi.assert.equal(_1_3[0], URI.union)
      vi.assert.equal(_1_5[0], URI.union)
      vi.assert.equal(_3_5[0], URI.union)
      vi.assert.isArray(_1_3[1])
      vi.assert.isArray(_1_5[1])
      vi.assert.isArray(_3_5[1])
      vi.assert.isAtLeast(_1_3[1].length, 1)
      vi.assert.isAtMost(_1_3[1].length, 3)
      vi.assert.isAtLeast(_1_5[1].length, 1)
      vi.assert.isAtMost(_1_5[1].length, 5)
      vi.assert.isAtLeast(_3_5[1].length, 3)
      vi.assert.isAtMost(_3_5[1].length, 5)
    }
  )

  const intersectSize_1_3 = fc.letrec(Seed.seed({ intersect: { minLength: 1, maxLength: 3 } })).intersect
  const intersectSize_1_5 = fc.letrec(Seed.seed({ intersect: { minLength: 1, maxLength: 5 } })).intersect
  const intersectSize_3_5 = fc.letrec(Seed.seed({ intersect: { minLength: 3, maxLength: 5 } })).intersect
  test.prop([intersectSize_1_3, intersectSize_1_5, intersectSize_3_5], {})('no options',
    (_1_3, _1_5, _3_5) => {
      vi.assert.equal(_1_3[0], URI.intersect)
      vi.assert.equal(_1_5[0], URI.intersect)
      vi.assert.equal(_3_5[0], URI.intersect)
      vi.assert.isArray(_1_3[1])
      vi.assert.isArray(_1_5[1])
      vi.assert.isArray(_3_5[1])
      vi.assert.isAtLeast(_1_3[1].length, 1)
      vi.assert.isAtMost(_1_3[1].length, 3)
      vi.assert.isAtLeast(_1_5[1].length, 1)
      vi.assert.isAtMost(_1_5[1].length, 5)
      vi.assert.isAtLeast(_3_5[1].length, 3)
      vi.assert.isAtMost(_3_5[1].length, 5)
    }
  )

})
