import type * as T from '@traversable/registry'
import { fn } from '@traversable/registry'
import { fc } from '@fast-check/vitest'
import { Seed as Seed_ } from '@traversable/schema-seed'
import * as t from './namespace'
import {
  URI,
} from './shared'

export const schemaWithMinDepth = Seed_.schemaWithMinDepth

interface map<K, V> extends T.inline<[tag: typeof URI.map, def: [key: K, value: V]]> { _schema?: t.map<K, V> }
interface set<T> extends T.inline<[tag: typeof URI.set, def: T]> { _schema?: t.set<T> }

export type Seed<S> = Seed_.Seed<S> | set<S> | map<S, S>
export type Fixpoint =
  | Seed_.Nullary
  | Seed_.optional<Fixpoint>
  | Seed_.record<Fixpoint>
  | Seed_.array<Fixpoint>
  | Seed_.eq<Fixpoint>
  | Seed_.union<readonly Fixpoint[]>
  | Seed_.intersect<readonly Fixpoint[]>
  | Seed_.tuple<readonly Fixpoint[]>
  | Seed_.object<{ [x: string]: Fixpoint }>
  | [typeof URI.set, Fixpoint]
  | [typeof URI.map, [Fixpoint, Fixpoint]]

export interface Free extends T.HKT { [-1]: Seed<this[0]> }

function set<T>(def: T): [typeof URI.set, T] { return [URI.set, def] as const satisfies [any, any] }
function map<K, V>(key: K, value: V): [typeof URI.map, [K, V]] { return [URI.map, [key, value]] as const satisfies [any, [any, any]] }

export interface Builder extends Seed_.Builder {
  set: set<Fixpoint>
  map: map<Fixpoint, Fixpoint>
}

export function seed<Exclude extends Seed_.TypeName, Include extends Seed_.TypeName>(
  constraints?: Seed_.Constraints<Exclude, Include>
) {
  const $ = Seed_.parseConstraints(constraints)
  return (go: fc.LetrecLooselyTypedTie) => {
    const core = Seed_.seed($)(go)
    return {
      ...core,
      set: go('tree').map((_) => [URI.set, _] as const satisfies [any, any]),
      map: fc.tuple(go('tree'), go('tree')).map(([k, v]) => [URI.map, [k, v]] as const satisfies [any, [any, any]]),
      tree: fc.oneof(
        $.tree,
        ...Object.values(core),
        go('set'),
        go('map'),
      )
    }
  }
}

const isSeed = <T>(u: unknown): u is Seed_<T> => Seed_.isSeed(u)

const Functor: T.Functor<Free, Fixpoint> = {
  map(f) {
    return (x) => {
      type S = Parameters<typeof f>[0]
      switch (true) {
        case x[0] === URI.set: { const s = x[1] as S; return set(f(s)) }
        case x[0] === URI.map: { const s = x[1] as [S, S]; return map(f(s[0]), f(s[1])) }
        default: return Seed_.Functor.map(f)(x as never)
      }
    }
  },
}

export const fold = fn.cata(Functor)

const toSchemaAlgebra: T.Functor.Algebra<Free, t.Schema> = (x) => {
  switch (true) {
    case x[0] === URI.set: return t.set(x[1])
    case x[0] === URI.map: return t.map(x[1][0], x[1][1])
    default: return Seed_.Algebra.toSchema(x as never)
  }
}

export const toSchema = fold(toSchemaAlgebra)

export const schema = <Exclude extends Seed_.TypeName, Include extends Seed_.TypeName>(constraints?: Seed_.Constraints<Exclude, Include>): fc.Arbitrary<t.Schema> =>
  fc.letrec(seed(constraints)).tree.map(toSchema as never)
