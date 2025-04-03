import { t } from '@traversable/schema'
import * as JsonSchema from './jsonSchema.js'
import * as prototypes from './prototypes.js'

declare module '@traversable/schema' {
  interface t_LowerBound extends JsonSchema.LowerBound { }
  interface t_never extends JsonSchema.never { }
  interface t_unknown extends JsonSchema.unknown { }
  interface t_void extends JsonSchema.void { }
  interface t_any extends JsonSchema.any { }
  interface t_null extends JsonSchema.null { }
  interface t_undefined extends JsonSchema.undefined { }
  interface t_symbol extends JsonSchema.symbol { }
  interface t_boolean extends JsonSchema.boolean { }
  interface t_integer extends JsonSchema.integer { }
  interface t_bigint extends JsonSchema.bigint { }
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
  /** @internal */
  let Object_assign = globalThis.Object.assign
  /** no JSON schema representation */
  Object_assign(t.never, { toJsonSchema: JsonSchema.empty })
  Object_assign(t.void, { toJsonSchema: JsonSchema.empty })
  Object_assign(t.undefined, { toJsonSchema: JsonSchema.empty })
  Object_assign(t.symbol, { toJsonSchema: JsonSchema.empty })
  Object_assign(t.bigint, { toJsonSchema: JsonSchema.empty })
  /** nullary */
  Object_assign(t.unknown, { toJsonSchema: prototypes.unknown })
  Object_assign(t.any, { toJsonSchema: prototypes.any })
  Object_assign(t.null, { toJsonSchema: prototypes.null })
  Object_assign(t.boolean, { toJsonSchema: prototypes.boolean })
  Object_assign(t.integer, { toJsonSchema: prototypes.integer })
  Object_assign(t.number, { toJsonSchema: prototypes.number })
  Object_assign(t.string, { toJsonSchema: prototypes.string })
  /** unary */
  Object_assign(t.eq.prototype, { toJsonSchema: prototypes.eq })
  Object_assign(t.optional.prototype, { toJsonSchema: prototypes.optional })
  Object_assign(t.array.prototype, { toJsonSchema: prototypes.array })
  Object_assign(t.record.prototype, { toJsonSchema: prototypes.record })
  Object_assign(t.union.prototype, { toJsonSchema: prototypes.union })
  Object_assign(t.intersect.prototype, { toJsonSchema: prototypes.intersect })
  Object_assign(t.tuple.prototype, { toJsonSchema: prototypes.tuple })
  Object_assign(t.object.prototype, { toJsonSchema: prototypes.object })
}
