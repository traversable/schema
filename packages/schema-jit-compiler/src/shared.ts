import type * as T from '@traversable/registry'
import { isValidIdentifier, parseKey } from '@traversable/registry'
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
  // RETURN: string
  // TABSTOP: string
  // JOIN: string
  indent(numberOfSpaces: number): string
  dedent(numberOfSpaces: number): string
  join(numberOfSpaces: number): string
}

export function buildContext(ix: T.Require<Index, 'offset' | 'varName'>): Context {
  let VAR = ix.varName
  let indent = (numberOfSpaces: number) => `\r${' '.repeat(Math.max(ix.offset + numberOfSpaces, 0))}`
  let dedent = (numberOfSpaces: number) => `\r${' '.repeat(Math.max(ix.offset - numberOfSpaces, 0))}`
  let join = (numberOfSpaces: number) => indent(numberOfSpaces) + '&& '
  // let JOIN = join(2)
  // let RETURN = indent(2)
  // let TABSTOP = indent(4)
  return { dedent, indent, join, VAR }
}

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
