import type * as T from '@traversable/registry'
import { fn, parseKey, URI } from '@traversable/registry'
import * as t from './schema.js'
import * as fc from 'fast-check'

import * as S from '@traversable/schema-seed'
import Seed = S.Seed
import seed = S.Seed.seed
import isAssociative = S.Seed.isAssociative
import isPositional = S.Seed.isPositional
import isNullary = S.Seed.isNullary
import is = S.Seed.is
import isSpecialCase = S.Seed.isSpecialCase
import isUnary = S.Seed.isUnary
import Functor = S.Seed.Functor


type Fixpoint = Seed.Fixpoint
interface Free extends Seed.Free { }
type Constraints = Seed.Constraints

export type {
  Constraints,
  Free,
  Fixpoint,
}
export {
  Seed,
  Functor,
  seed,
  is,
  is as isSeed,
  isAssociative,
  isNullary,
  isSpecialCase,
  isPositional,
  isUnary,
}


// export type { Constraints } from '@traversable/schema-seed/dist/seed'

/** @internal */
const Object_fromEntries = globalThis.Object.fromEntries
/** @internal */
const Object_assign = globalThis.Object.assign
/** @internal */
const Array_isArray = globalThis.Array.isArray
/** @internal */
const opts = { optionalTreatment: 'treatUndefinedAndOptionalAsTheSame' } as const
/** @internal */
const isComposite = (u: unknown) => Array_isArray(u) || (u !== null && typeof u === 'object')


const NullarySchemaMap = {
  [URI.never]: t.never,
  [URI.void]: t.void,
  [URI.unknown]: t.unknown,
  [URI.any]: t.any,
  [URI.symbol]: t.symbol,
  [URI.null]: t.null,
  [URI.undefined]: t.undefined,
  [URI.boolean]: t.boolean,
  [URI.integer]: t.integer,
  [URI.number]: t.number,
  [URI.bigint]: t.bigint,
  [URI.string]: t.string,
} as const satisfies Record<Seed.Nullary, t.Fixpoint>

export const sortOptionalsLast = (l: t.Fixpoint, r: t.Fixpoint) => (
  l.tag === URI.optional ? 1 : r.tag === URI.optional ? -1 : 0
);

namespace Recursive {
  export const toSchema: T.Functor.Algebra<Seed.Free, t.F<any>> = (x) => {
    // if (!Seed.isSeed(x)) return fn.exhaustive(x)
    switch (true) {
      default: return fn.exhaustive(x)
      case Seed.isNullary(x): return NullarySchemaMap[x]
      case x[0] === URI.eq: {
        const out = t.eq.fix(x[1])
        return out
      }
      case x[0] === URI.array: { const out = t.array.fix(x[1]); return out }
      case x[0] === URI.record: { const out = t.record.fix(x[1]); return out }
      case x[0] === URI.optional: { const out = t.optional.fix(x[1]); return out }
      case x[0] === URI.tuple: {
        const head: any[] = [...x[1]];
        const arg = head.sort(sortOptionalsLast);
        const out = t.tuple.fix(arg);
        return out
      }
      case x[0] === URI.union: { const out = t.union.fix(x[1]); return out }
      case x[0] === URI.intersect: { const out = t.intersect.fix(x[1]); return out }
      case x[0] === URI.object: { const out = t.object.fix(Object_fromEntries(x[1].map(([k, v]) => [parseKey(k), v])), opts); return out }
    }
  }
}

export const toSchema = fn.cata(Seed.Functor)(Recursive.toSchema)

export function schema<Out = unknown>(constraints?: Seed.Constraints): fc.Arbitrary<Out>
export function schema(constraints?: Seed.Constraints) {
  return Seed.extensibleArbitrary({
    arbitraries: {
      never: t.never,
      unknown: t.unknown,
      void: t.void,
      any: t.any,
      undefined: t.undefined,
      null: t.null,
      symbol: t.symbol,
      boolean: t.boolean,
      bigint: t.bigint,
      integer: t.integer,
      number: t.number,
      string: t.string,
      eq: t.eq,
      array: t.array,
      record: t.record,
      optional: t.optional,
      union: t.union.fix,
      intersect: t.intersect.fix,
      tuple: t.tuple.fix,
      object: t.object.fix,
    },
    ...constraints,
  })
}

// export const schema = (constraints?: Seed.Constraints) => fc.letrec(Seed.seed(constraints)).tree.map(toSchema)
