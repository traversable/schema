import { symbol } from '@traversable/registry'
import type { Functor } from './functor.js'

export type Cache = WeakMap<{ [x: number]: unknown }, Functor.Index['path']>

const Invariant = {
  CacheHitButPathWasUnresolvable: (currentPath: Functor.Index['path'], cachedPath: Functor.Index['path']) => {
    const path = '#/' + currentPath.join('/')
    const cached = '#/' + cachedPath.join('/')

    throw Error(''
      + '[@traversable/json/cache.js]'
      + '\n\r'
      + '\n\r'
      + `\tWe detected a cycle between paths '${path}' and '${cached}', but were unable to resolve path '${cached}'.`
      + '\n\r'
      + '\n\r'
      + '\tIf both paths exist, this might be a bug. Please consider filing an issue at: '
      + '\n\r'
      + 'https://github.com/traversable/schema/issues'
      + '\n\r'
    )
  },
} as const

/** @internal */
const has_ = <K extends keyof any>(x: unknown, key: K): x is { [P in K]: unknown } =>
  !!x && typeof x === 'object' && key in x // globalThis.Object.hasOwn(x, key)

/** @internal */
function get(x: unknown, ...ks: (keyof any)[]) {
  let out = x
  let k: keyof any | undefined
  while ((k = ks.shift()) !== undefined) {
    if (has_(out, k)) void (out = out[k])
    else if (k === "") continue
    else return symbol.notfound
  }
  return out
}

function create(root: unknown): (x: { [x: string]: unknown }, ix: Functor.Index) => {} | null | undefined | symbol.cache_hit
function create(root: unknown, __test?: Functor.Index['path']) {
  let cache: Cache = new WeakMap()
  return <T>(x: { [x: string]: T }, ix: Functor.Index) => {
    const path = __test || cache.get(x)
    if (path) {
      const cached = get(root, ...path)
      if (cached === symbol.notfound) {
        return Invariant.CacheHitButPathWasUnresolvable(ix.path, path)
      }
      else
        return cached
    }
    else {
      cache.set(x, ix.path)
      return symbol.cache_hit
    }
  }
}

export const Cache = {
  new: create
}
