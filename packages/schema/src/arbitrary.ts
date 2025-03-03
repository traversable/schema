import * as fc from 'fast-check'
import type { Algebra } from '@traversable/registry'
import { fn, URI } from '@traversable/registry'

import { t } from './schema.js'

const Object_assign = globalThis.Object.assign
const Object_keys = globalThis.Object.keys

namespace Recursive {
  export const fromSchema: Algebra<t.Free, fc.Arbitrary<unknown>> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.never: return fc.constant(null)
      case x.tag === URI.unknown: return fc.constant(void 0)
      case x.tag === URI.any: return fc.jsonValue()
      case x.tag === URI.void: return fc.constant(void 0)
      case x.tag === URI.null: return fc.constant(null)
      case x.tag === URI.undefined: return fc.constant(undefined)
      case x.tag === URI.symbol: return fc.string().map((_) => Symbol.for(_))
      case x.tag === URI.boolean: return fc.boolean()
      case x.tag === URI.bigint: return fc.bigInt()
      case x.tag === URI.number: return fc.float()
      case x.tag === URI.string: return fc.string()
      case x.tag === URI.eq: return fc.constant(x.def)
      case x.tag === URI.optional: return fc.oneof(x.def, fc.constant(undefined))
      case x.tag === URI.union: return fc.oneof(...x.def)
      case x.tag === URI.intersect: return fc.tuple(...x.def).map((_) => _.reduce(Object_assign, {}))
      case x.tag === URI.array: return fc.array(x.def)
      case x.tag === URI.record: return fc.dictionary(fc.string(), x.def)
      case x.tag === URI.tuple: return fc.tuple(...x.def)
      case x.tag === URI.object: return fc.record(x.def, { requiredKeys: Object_keys(x.def).filter((k) => x.opt.includes(k)) })
    }
  }
}

export const fromSchema
  : <S extends t.Schema>(term: S) => fc.Arbitrary<S['_type']>
  = fn.cata<t.Free, any>(t.Functor)(Recursive.fromSchema)
