import type * as T from '@traversable/registry'
import { fn, isValidIdentifier, parseKey } from '@traversable/registry'
import { t } from '@traversable/schema-core'

import type { Index } from './functor.js'

export type F<T> =
  | t.Leaf
  | t.eq<T>
  | t.array<T>
  | t.record<T>
  | t.optional<T>
  | t.union<T[]>
  | t.intersect<readonly T[]>
  | t.tuple<T[]>
  | t.object<[k: string, v: T][]>

export type Fixpoint =
  | t.Leaf
  | t.eq<Fixpoint>
  | t.array<Fixpoint>
  | t.record<Fixpoint>
  | t.optional<Fixpoint>
  | t.union<Fixpoint[]>
  | t.intersect<Fixpoint[]>
  | t.tuple<Fixpoint[]>
  | t.object<[k: string, v: Fixpoint][]>

export interface Free extends T.HKT { [-1]: F<this[0]> }

export type Context = {
  VAR: string
  indent(numberOfSpaces: number): string
  dedent(numberOfSpaces: number): string
  join(numberOfSpaces: number): string
}

export let makeIndent
  : (offset: number) => (numberOfSpaces: number) => string
  = (off) => (n) => `\r${' '.repeat(Math.max(off + n, 0))}`

export let makeDedent
  : (offset: number) => (numberOfSpaces: number) => string
  = (off) => makeIndent(-off)

export let makeJoin
  : (offset: number) => (numberOfSpaces: number) => string
  = (off) => fn.flow(makeIndent(off), (_) => `${_}&& `)

export let buildContext
  : (ix: T.Require<Index, 'offset' | 'varName'>) => Context
  = ({ offset, varName: VAR }) => ({
    VAR,
    indent: makeIndent(offset),
    dedent: makeDedent(offset),
    join: makeJoin(offset),
  })

export function keyAccessor(key: keyof any | undefined, $: Index) {
  return typeof key === 'string' ? isValidIdentifier(key) ? $.isOptional
    ? `?.${key}`
    : `.${key}`
    : `[${parseKey(key)}]`
    : ''
}

/** 
 * Reading `x` to access the "preSortIndex" is a hack to make sure
 * we preserve the original order of the tuple, even while sorting
 */
export function indexAccessor(index: keyof any | undefined, $: { isOptional?: boolean }, x?: any) {
  return 'preSortIndex' in x
    ? $.isOptional ? `?.[${x.preSortIndex}]` : `[${x.preSortIndex}]`
    : typeof index === 'number' ? $.isOptional
      ? `?.[${index}]`
      : `[${index}]`
      : ''
}
