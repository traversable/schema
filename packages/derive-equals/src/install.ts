import {
  Array_isArray,
  Equal,
  Object_assign,
  Object_hasOwn,
  Object_is,
  Object_keys,
} from '@traversable/registry'
import { t } from '@traversable/schema-core'

export interface equals {
  equals: Equal<this['_type' & keyof this]>
}

declare module '@traversable/schema-core' {
  interface t_LowerBound<T> extends equals { }
  // interface t_never extends equals { }
  interface t_unknown extends equals { }
  interface t_void extends equals { }
  interface t_any extends equals { }
  interface t_null extends equals { }
  interface t_undefined extends equals { }
  interface t_symbol extends equals { }
  interface t_boolean extends equals { }
  interface t_integer extends equals { }
  interface t_bigint extends equals { }
  interface t_number extends equals { }
  interface t_string extends equals { }
  interface t_eq<V> extends equals { }
  interface t_optional<S> extends equals { }
  interface t_array<S> extends equals { }
  interface t_record<S> extends equals { }
  interface t_union<S> extends equals { }
  interface t_intersect<S> extends equals { }
  interface t_tuple<S> extends equals { }
  interface t_object<S> extends equals { }
}

export function eqEquals<V>(this: t.eq<V>, x: V, y: V): boolean { return t.eq.def(x)(y) }

export function optionalEquals(
  this: t.optional<{ equals: Equal }>,
  l: unknown,
  r: unknown,
): boolean {
  if (Object_is(l, r)) return true
  return this.def.equals(l, r)
}

export function arrayEquals(
  this: t.array<{ equals: Equal }>,
  l: readonly unknown[],
  r: readonly unknown[]
) {
  if (Object_is(l, r)) return true
  if (Array_isArray(l)) {
    if (!Array_isArray(r)) return false
    let len = l.length
    if (len !== r.length) return false
    for (let ix = len; ix-- !== 0;)
      if (!this.def.equals(l[ix], r[ix])) return false
    return true
  } else return false
}

export function recordEquals(
  this: t.record<{ equals: Equal }>,
  l: Record<string, unknown>,
  r: Record<string, unknown>
): boolean {
  if (Object_is(l, r)) return true
  if (!l || typeof l !== 'object' || Array_isArray(l)) return false
  if (!r || typeof r !== 'object' || Array_isArray(r)) return false
  const lhs = Object_keys(l)
  const rhs = Object_keys(r)
  let len = lhs.length
  let k: string
  if (len !== rhs.length) return false
  for (let ix = len; ix-- !== 0;) {
    k = lhs[ix]
    if (!Object_hasOwn(r, k)) return false
    if (!(this.def.equals(l[k], r[k]))) return false
  }
  len = rhs.length
  for (let ix = len; ix-- !== 0;) {
    k = rhs[ix]
    if (!Object_hasOwn(l, k)) return false
    if (!(this.def.equals(l[k], r[k]))) return false
  }
  return true
}

export function unionEquals(
  this: t.union<{ equals: Equal }[]>,
  l: unknown,
  r: unknown
): boolean {
  if (Object_is(l, r)) return true
  for (let ix = this.def.length; ix-- !== 0;)
    if (this.def[ix].equals(l, r)) return true
  return false
}

export function intersectEquals(
  this: t.intersect<readonly { equals: Equal }[]>,
  l: unknown,
  r: unknown
): boolean {
  if (Object_is(l, r)) return true
  for (let ix = this.def.length; ix-- !== 0;)
    if (!this.def[ix].equals(l, r)) return false
  return true
}

export function tupleEquals(
  this: t.tuple<readonly { equals: Equal }[]>,
  l: readonly unknown[],
  r: readonly unknown[]
): boolean {
  if (Object_is(l, r)) return true
  if (Array_isArray(l)) {
    if (!Array_isArray(r)) return false
    for (let ix = this.def.length; ix-- !== 0;) {
      if (!Object_hasOwn(l, ix) && !Object_hasOwn(r, ix)) continue
      if (Object_hasOwn(l, ix) && !Object_hasOwn(r, ix)) return false
      if (!Object_hasOwn(l, ix) && Object_hasOwn(r, ix)) return false
      if (Object_hasOwn(l, ix) && Object_hasOwn(r, ix)) {
        if (!this.def[ix].equals(l[ix], r[ix])) return false
      }
    }
    return true
  }
  return false
}

export function objectEquals(
  this: t.object<{ [x: string]: { equals: Equal } }>,
  l: { [x: string]: unknown },
  r: { [x: string]: unknown }
): boolean {
  if (Object_is(l, r)) return true
  if (!l || typeof l !== 'object' || Array_isArray(l)) return false
  if (!r || typeof r !== 'object' || Array_isArray(r)) return false
  for (const k in this.def) {
    const lHas = Object_hasOwn(l, k)
    const rHas = Object_hasOwn(r, k)
    if (lHas) {
      if (!rHas) return false
      if (!this.def[k].equals(l[k], r[k])) return false
    }
    if (rHas) {
      if (!lHas) return false
      if (!this.def[k].equals(l[k], r[k])) return false
    }
    if (!this.def[k].equals(l[k], r[k])) return false
  }
  return true
}

/////////////////
///  INSTALL  ///
void bind()   ///
///  INSTALL  ///
/////////////////

export function bind() {
  Object_assign(t.never, { equals: function neverEquals(l: never, r: never) { return Object_is(l, r) } })
  Object_assign(t.unknown, { equals: function unknownEquals(l: never, r: never) { return Object_is(l, r) } })
  Object_assign(t.any, { equals: function anyEquals(l: never, r: never) { return Object_is(l, r) } })
  Object_assign(t.void, { equals: function voidEquals(l: never, r: never) { return Object_is(l, r) } })
  Object_assign(t.null, { equals: function nullEquals(l: never, r: never) { return Object_is(l, r) } })
  Object_assign(t.undefined, { equals: function undefinedEquals(l: never, r: never) { return Object_is(l, r) } })
  Object_assign(t.boolean, { equals: function booleanEquals(l: never, r: never) { return Object_is(l, r) } })
  Object_assign(t.symbol, { equals: function symbolEquals(l: never, r: never) { return Object_is(l, r) } })
  Object_assign(t.integer, { equals: function integerEquals(l: never, r: never) { return Object_is(l, r) } })
  Object_assign(t.bigint, { equals: function bigintEquals(l: never, r: never) { return Object_is(l, r) } })
  Object_assign(t.number, { equals: function numberEquals(l: never, r: never) { return Object_is(l, r) } })
  Object_assign(t.string, { equals: function stringEquals(l: never, r: never) { return Object_is(l, r) } })
  Object_assign(t.eq.userDefinitions, { equals: eqEquals })
  Object_assign(t.array.userDefinitions, { equals: arrayEquals })
  Object_assign(t.record.userDefinitions, { equals: recordEquals })
  Object_assign(t.optional.userDefinitions, { equals: optionalEquals })
  Object_assign(t.union.userDefinitions, { equals: unionEquals })
  Object_assign(t.intersect.userDefinitions, { equals: intersectEquals })
  Object_assign(t.tuple.userDefinitions, { equals: tupleEquals })
  Object_assign(t.object.userDefinitions, { equals: objectEquals })
}
