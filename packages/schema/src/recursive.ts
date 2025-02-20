import type * as T from '@traversable/registry'
import { fn, NS, URI } from '@traversable/registry'
import { Json } from '@traversable/json'
import { t } from './model.js'
import { parseKey } from '../../registry/src/parse.js'
import { Functor, fold, unfold } from './functor.js'

/** @internal */
const Object_entries = globalThis.Object.entries
/** @internal */
const OPT = '<<>>' as const
/** @internal */
const trim = (s?: string) =>
  s == null ? String(s)
    : s.startsWith(OPT) ? s.substring(OPT.length)
      : s

type TypeName<T> = never | T extends `${NS}${infer S}` ? S : never
function typeName<T extends { tag: string }>(x: T): TypeName<T['tag']>
function typeName(x: { tag: string }) {
  return x.tag.substring(NS.length)
}

export namespace Recursive {
  export const toString: T.Functor.Algebra<t.Free, string> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case t.isLeaf(x): return 't.' + typeName(x)
      case x.tag === URI.eq: return `t.eq(${JSON.stringify(x.def)})`
      case x.tag === URI.array: return `t.${typeName(x)}(${x.def})`
      case x.tag === URI.record: return `t.${typeName(x)}(${x.def})`
      case x.tag === URI.optional: return `t.${typeName(x)}(${x.def})`
      case x.tag === URI.tuple: return `t.${typeName(x)}(${x.def.join(', ')})`
      case x.tag === URI.union: return `t.${typeName(x)}(${x.def.join(', ')})`
      case x.tag === URI.intersect: return `t.${typeName(x)}(${x.def.join(', ')})`
      case x.tag === URI.object: {
        const xs = Object_entries(x.def)
        return xs.length === 0
          ? `t.${typeName(x)}({})`
          : `t.${typeName(x)}({ ${xs.map(([k, v]) => parseKey(k) + `: ${v}`).join(', ')} })`
      }
    }
  }

  export const toTypeString: T.Functor.Algebra<t.Free, string> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case t.isLeaf(x): return typeName(x)
      case x.tag === URI.eq: return JSON.stringify(x.def)
      case x.tag === URI.array: return `(${trim(x.def)})[]`
      case x.tag === URI.record: return `Record<string, ${trim(x.def)}>`
      case x.tag === URI.optional: return `${OPT}(${trim(x.def)} | undefined)`
      case x.tag === URI.union: return `(${x.def.map(trim).join(' | ')})`
      case x.tag === URI.intersect: return `(${x.def.map(trim).join(' & ')})`
      case x.tag === URI.tuple:
        return `[${x.def.map((y) => (y?.startsWith(OPT) ? '_?: ' : '') + trim(y)).join(', ')}]`
      case x.tag === URI.object: {
        const xs = Object_entries(x.def)
        return xs.length === 0
          ? `{}`
          : `{ ${xs.map(([k, v]) => parseKey(k) + (v?.startsWith(OPT) ? '?' : '') + `: ${trim(v)}`).join(', ')} }`
      }
    }
  }
}

export const toString = fold(Recursive.toString)

export const toTypeString
  : <S extends t.Fixpoint>(schema: S) => string
  = (schema) => trim(fold(Recursive.toTypeString)(schema))
