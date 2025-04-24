export * as t from './namespace'

import { t } from '@traversable/schema-core'
import '@traversable/derive-codec/install'
import '@traversable/derive-equals/install'
import '@traversable/derive-validators/install'
import '@traversable/schema-to-json-schema/install'
import '@traversable/schema-to-string/install'
import { bindParse } from './prototype'

export function bind() {
  Object.assign(t.never, bindParse)
  Object.assign(t.unknown, bindParse)
  Object.assign(t.void, bindParse)
  Object.assign(t.null, bindParse)
  Object.assign(t.undefined, bindParse)
  Object.assign(t.boolean, bindParse)
  Object.assign(t.symbol, bindParse)
  Object.assign(t.integer, bindParse)
  Object.assign(t.bigint, bindParse)
  Object.assign(t.number, bindParse)
  Object.assign(t.string, bindParse)
  Object.assign(t.eq.userDefinitions, bindParse)
  Object.assign(t.optional.userDefinitions, bindParse)
  Object.assign(t.array.userDefinitions, bindParse)
  Object.assign(t.record.userDefinitions, bindParse)
  Object.assign(t.union.userDefinitions, bindParse)
  Object.assign(t.intersect.userDefinitions, bindParse)
  Object.assign(t.tuple.userDefinitions, bindParse)
  Object.assign(t.object.userDefinitions, bindParse)
  Object.assign(t.enum.userDefinitions, bindParse)
}


// SIDE-EFFECT
void bind()

export interface parse {
  parse(u: this['_type' & keyof this] | {} | null | undefined): this['_type' & keyof this]
}

declare module '@traversable/schema-core' {
  // interface t_never extends parse { }
  interface t_unknown extends parse { }
  interface t_any extends parse { }
  interface t_void extends parse { }
  interface t_null extends parse { }
  interface t_undefined extends parse { }
  interface t_symbol extends parse { }
  interface t_boolean extends parse { }
  interface t_integer extends parse { }
  interface t_bigint extends parse { }
  interface t_number extends parse { }
  interface t_string extends parse { }
  interface t_eq<V> extends parse { }
  interface t_optional<S> extends parse { }
  interface t_array<S> extends parse { }
  interface t_record<S> extends parse { }
  interface t_union<S> extends parse { }
  interface t_intersect<S> extends parse { }
  interface t_tuple<S> extends parse { }
  interface t_object<S> extends parse { }
  interface t_enum<V> extends parse { }
}
