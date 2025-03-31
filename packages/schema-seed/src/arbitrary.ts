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
