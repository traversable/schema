import type * as T from '@traversable/registry'
import { fn, NS, parseKey, URI } from '@traversable/registry'
import { Json } from '@traversable/json'
import { t } from '@traversable/schema'

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

export { Recursive as algebra }
namespace Recursive {
  const jsonToString = Json.fold((x: Json<string>) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case Json.isScalar(x): return typeof x === 'string' ? `"${x}"` : `${x}`
      case Json.isArray(x): return `[${x.join(',')}]`
      case Json.isObject(x): return `{ ${Object_entries(x).map(([k, v]) => `${parseKey(k)}: ${v}`).join(', ')} }`
    }
  })

  export const schemaToString: T.Functor.Algebra<t.Free, string> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case t.isLeaf(x): return 't.' + typeName(x)
      case x.tag === URI.eq: return `t.eq(${jsonToString(x.def as never)})`
      case x.tag === URI.ref: return `t.ref(${x.def}, ${x.id})`
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
      case x.tag === URI.eq: return jsonToString(x.def as never)
      case x.tag === URI.ref: return x.id
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

export const schemaToString = t.fold(Recursive.schemaToString)

export const toTypeString
  : <S extends t.Schema>(schema: S) => string
  = (schema) => trim(t.fold(Recursive.toTypeString)(<never>schema))
