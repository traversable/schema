import type * as T from '@traversable/registry'
import { fn, has, URI } from '@traversable/registry'

import { t } from '@traversable/schema'
import { isSeed, isNullary } from './seed.js'
import * as Seed from './seed.js'

import * as fc from './fast-check.js'

/** @internal */
const Array_isArray = globalThis.Array.isArray

/** @internal */
const Object_assign = globalThis.Object.assign

/** @internal */
const Object_keys = globalThis.Object.keys

/** @internal */
const Object_fromEntries = globalThis.Object.fromEntries

/** @internal */
const isComposite = (u: unknown) => Array_isArray(u) || (u !== null && typeof u === 'object')

const NullaryArbitraryMap = {
  [URI.never]: fc.constant(void 0 as never),
  [URI.void]: fc.constant(void 0 as void),
  [URI.unknown]: fc.jsonValue(),
  [URI.any]: fc.jsonValue() as fc.Arbitrary<any>,
  [URI.symbol]: fc.string().map(Symbol.for),
  [URI.null]: fc.constant(null),
  [URI.undefined]: fc.constant(undefined),
  [URI.boolean]: fc.boolean(),
} as const satisfies Record<Seed.Nullary, fc.Arbitrary>

const BoundableArbitraryMap = {
  [URI.integer]: fc.integer(),
  [URI.number]: fc.float(),
  [URI.bigint]: fc.bigInt(),
  [URI.string]: fc.string(),
}

export const is = <T>(u: unknown): u is fc.Arbitrary<T> => {
  return !!u
    && typeof u === 'object'
    /**
     * Properties taken from the 
     * [`Arbitrary` interface](https://github.com/dubzzz/fast-check/blob/main/packages/fast-check/src/check/arbitrary/definition/Arbitrary.ts)
     */
    && 'generate' in u
    && 'shrink' in u
    && 'filter' in u
    && 'map' in u
    && 'chain' in u
    && 'canShrinkWithoutContext' in u
}

// namespace Recursive {
//   export const fromSeed: T.Functor.Algebra<Seed.Free, fc.Arbitrary> = (x) => {
//     if (!isSeed(x)) return fn.exhaustive(x)
//     switch (true) {
//       default: return fn.exhaustive(x)
//       case isNullary(x): return NullaryArbitraryMap[x]
//       case x[0] === URI.eq: return fc.constant(x[1])
//       case x[0] === URI.array: return fc.array(x[1])
//       case x[0] === URI.record: return fc.dictionary(fc.string(), x[1])
//       case x[0] === URI.optional: return fc.optional(x[1])
//       case x[0] === URI.tuple: return fc.tuple(...x[1])
//       case x[0] === URI.union: return fc.oneof(...x[1])
//       case x[0] === URI.object: return fc.record(Object_fromEntries(x[1]))
//       case x[0] === URI.intersect: {
//         if (x[1].length === 1) return x[1][0]
//         const ys = x[1].filter((_) => !isNullary(_))
//         return ys.length === 0 ? x[1][0] : fc.tuple(...ys).map(
//           ([head, ...tail]) => !isComposite(head) ? head
//             : tail.reduce<typeof head>((acc, y) => isComposite(y) ? Object_assign(acc, y) : acc, head)
//         )
//       }
//     }
//   }

//   export const fromSchema: T.Algebra<t.Free, fc.Arbitrary<unknown>> = (x) => {
//     switch (true) {
//       default: return fn.exhaustive(x)
//       case x.tag === URI.never: return fc.constant(null)
//       case x.tag === URI.unknown: return fc.jsonValue()
//       case x.tag === URI.any: return fc.jsonValue()
//       case x.tag === URI.void: return fc.constant(void 0)
//       case x.tag === URI.null: return fc.constant(null)
//       case x.tag === URI.undefined: return fc.constant(undefined)
//       case x.tag === URI.symbol: return fc.string().map((_) => Symbol.for(_))
//       case x.tag === URI.boolean: return fc.boolean()
//       case x.tag === URI.bigint: return fc.bigInt()
//       case x.tag === URI.integer: return fc.integer()
//       case x.tag === URI.number: return fc.float()
//       case x.tag === URI.string: return fc.string()
//       case x.tag === URI.eq: return fc.constant(x.def)
//       case x.tag === URI.optional: return fc.oneof(x.def, fc.constant(undefined))
//       case x.tag === URI.union: return fc.oneof(...x.def)
//       case x.tag === URI.intersect: return fc.tuple(...x.def).map((_) => _.reduce(Object_assign, {}))
//       case x.tag === URI.array: return fc.array(x.def)
//       case x.tag === URI.record: return fc.dictionary(fc.string(), x.def)
//       case x.tag === URI.tuple: return fc.tuple(...x.def)
//       case x.tag === URI.object: return fc.record(x.def, { requiredKeys: Object_keys(x.def).filter((k) => !x.opt.includes(k)) })
//     }
//   }
// }

// export const fromSeed
//   : <S extends Seed.Fixpoint>(term: S) => fc.Arbitrary<unknown>
//   = Seed.fold(Recursive.fromSeed)

// export const fromSchema
//   : <S extends t.Schema>(term: S) => fc.Arbitrary<unknown>
//   = t.fold(Recursive.fromSchema)
