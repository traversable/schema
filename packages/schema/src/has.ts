import type { Target } from '@traversable/registry'
import { has as has_ } from '@traversable/registry'
import * as t from './schema.js'

type Keys = readonly (keyof any)[]

export const key = t.union(t.string, t.number, t.symbol)

/** @internal */
export function parseArgs<KS extends Keys, V extends t.Schema = t.unknown>(args: readonly [...path: KS, leafSchema?: V]): [KS, V]
export function parseArgs<KS extends Keys>(args: readonly [...path: KS]): [KS, t.unknown]
export function parseArgs(
  args:
    | readonly [...path: Keys]
    | readonly [...path: Keys, leafSchema: t.Schema]
): [Keys, t.Predicate] {
  const last = args[args.length - 1]
  const [path, schema]
    = key(last) ? [args as Keys, t.unknown]
      : [args.slice(0, -1) as Keys, last]
  return [path, schema]
}

export function has<KS extends readonly (keyof any)[], V extends t.Predicate>(...args: readonly [...path: KS, leafSchema?: V]): (u: unknown) => u is has_<KS, Target<V>>
export function has<KS extends readonly (keyof any)[]>(...path: readonly [...KS]): (u: unknown) => u is has_<KS, {} | null>
export function has<KS extends readonly (keyof any)[]>(...args: readonly [...KS]) {
  const [path, schema] = parseArgs(args)
  return has_(...path, schema)
}
