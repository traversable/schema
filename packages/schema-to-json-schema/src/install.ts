import { Object_assign } from '@traversable/registry'
import { t } from '@traversable/schema-core'

import * as JsonSchema from './jsonSchema.js'
import * as toJsonSchema from './prototypes.js'

declare module '@traversable/schema-core' {
  interface t_LowerBound extends JsonSchema.LowerBound { }
  interface t_void extends JsonSchema.Empty { }
  interface t_undefined extends JsonSchema.Empty { }
  interface t_symbol extends JsonSchema.Empty { }
  interface t_bigint extends JsonSchema.Empty { }
  // interface t_never extends JsonSchema.never { }
  interface t_unknown extends JsonSchema.unknown { }
  interface t_any extends JsonSchema.any { }
  interface t_null extends JsonSchema.null { }
  interface t_boolean extends JsonSchema.boolean { }
  interface t_integer extends JsonSchema.integer { }
  interface t_number extends JsonSchema.number { }
  interface t_string extends JsonSchema.string { }
  interface t_eq<V> extends JsonSchema.eq<V> { }
  interface t_optional<S> extends JsonSchema.optional<S> { }
  interface t_array<S> extends JsonSchema.array<S> { }
  interface t_record<S> extends JsonSchema.record<S> { }
  interface t_union<S> extends JsonSchema.union<S> { }
  interface t_intersect<S> extends JsonSchema.intersect<S> { }
  interface t_tuple<S> extends JsonSchema.tuple<S> { }
  interface t_object<S> extends JsonSchema.object<S> { }
  interface t_of<S> extends JsonSchema.inline<S> { }
}

/////////////////
///  INSTALL  ///
void bind()   ///
///  INSTALL  ///
/////////////////

export function bind() {
  /** no JSON schema representation */
  Object_assign(t.never, { toJsonSchema: JsonSchema.empty })
  Object_assign(t.void, { toJsonSchema: JsonSchema.empty })
  Object_assign(t.undefined, { toJsonSchema: JsonSchema.empty })
  Object_assign(t.symbol, { toJsonSchema: JsonSchema.empty })
  Object_assign(t.bigint, { toJsonSchema: JsonSchema.empty })
  /** nullary */
  Object_assign(t.unknown, { toJsonSchema: toJsonSchema.unknown })
  Object_assign(t.any, { toJsonSchema: toJsonSchema.any })
  Object_assign(t.null, { toJsonSchema: toJsonSchema.null })
  Object_assign(t.boolean, { toJsonSchema: toJsonSchema.boolean })
  Object_assign(t.integer, { toJsonSchema: toJsonSchema.integer })
  Object_assign(t.number, { toJsonSchema: toJsonSchema.number })
  Object_assign(t.string, { toJsonSchema: toJsonSchema.string })
  /** unary */
  Object_assign(t.eq.userDefinitions, { toJsonSchema: toJsonSchema.eq })
  Object_assign(t.optional.userDefinitions, { toJsonSchema: toJsonSchema.optional })
  Object_assign(t.array.userDefinitions, { toJsonSchema: toJsonSchema.array })
  Object_assign(t.record.userDefinitions, { toJsonSchema: toJsonSchema.record })
  Object_assign(t.union.userDefinitions, { toJsonSchema: toJsonSchema.union })
  Object_assign(t.intersect.userDefinitions, { toJsonSchema: toJsonSchema.intersect })
  Object_assign(t.tuple.userDefinitions, { toJsonSchema: toJsonSchema.tuple })
  Object_assign(t.object.userDefinitions, { toJsonSchema: toJsonSchema.object })
}
