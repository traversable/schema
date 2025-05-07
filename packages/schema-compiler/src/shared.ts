import type * as T from '@traversable/registry'
import { fn, isValidIdentifier, parseKey } from '@traversable/registry'
import { t } from '@traversable/schema'

import type { Index } from './functor.js'

export type IR<T = any> =
  | t.Leaf
  | t.eq<T>
  | t.array<T>
  | t.record<T>
  | t.optional<T>
  | t.union<T[]>
  | t.intersect<readonly T[]>
  | t.tuple<T[]>
  | t.object<[k: string, T][]>


export namespace IR {
  export type Options = { preSortIndex?: number }
  export const defaults = {} satisfies Options
  export function clone<T>(schema: T, { preSortIndex }: Options = defaults) {
    return {
      ...schema,
      ...typeof preSortIndex === 'number' && { preSortIndex }
    }
  }
}


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

export const makeIndent
  : (offset: number) => (numberOfSpaces: number) => string
  = (off) => (n) => `\r${' '.repeat(Math.max(off + n, 0))}`

export const makeDedent
  : (offset: number) => (numberOfSpaces: number) => string
  = (off) => makeIndent(-off)

export const makeJoin
  : (offset: number) => (numberOfSpaces: number) => string
  = (off) => fn.flow(makeIndent(off), (_) => `${_}&& `)

export const buildContext
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
 * Binding the element's index to the element itself is a hack to make sure
 * we preserve the original order of the tuple, even while sorting
 */
export const bindPreSortIndices: <T>(x: T[]) => T[] = (x) => {
  for (let ix = 0, len = x.length; ix < len; ix++) {
    x[ix] = IR.clone(x[ix], { preSortIndex: ix })
  }
  return x
}


/** 
 * Reading `x` to access the "preSortIndex" is a hack to make sure
 * we preserve the original order of the tuple, even while sorting
 */
export function indexAccessor(index: keyof any | undefined, $: { isOptional?: boolean }, x?: any) {
  if ('preSortIndex' in x) {
    return $.isOptional
      ? `?.[${x.preSortIndex}]`
      : `[${x.preSortIndex}]`
  } else if (typeof index === 'number') {
    return $.isOptional ? `?.[${index}]` : `[${index}]`
  } else return ''
}
