import type * as v from 'valibot'
import * as F from './functor.js'
import { fn, Object_entries, parseKey } from '@traversable/registry'
import { tagged } from './utils.js'

function stringifyEntries(x: { [x: string]: unknown }, toString?: (y: unknown) => string): string[] {
  return Object_entries(x).map(([k, v]) => `${parseKey(k)}: ${toString?.(v) ?? v}`)
}

function compileObjectNode<S>(x: F.V.Object<S>) {
  const xs = Object_entries(x.entries).map(([k, v]) => parseKey(k) + ': ' + v)
  return xs.length === 0
    ? `v.object({})`
    : `v.object({ ${xs.join(', ')} })`
}

const fold = F.fold<string>((x) => {
  switch (true) {
    default: return fn.exhaustive(x)
    case tagged('never')(x): return 'v.never()'
    case tagged('any')(x): return 'v.any()'
    case tagged('unknown')(x): return 'v.unknown()'
    case tagged('void')(x): return 'v.void()'
    case tagged('undefined')(x): return 'v.undefined()'
    case tagged('null')(x): return 'v.null()'
    case tagged('symbol')(x): return 'v.symbol()'
    case tagged('NaN')(x): return 'v.nan()'
    case tagged('boolean')(x): return 'v.boolean()'
    case tagged('bigint')(x): return 'v.bigint()'
    case tagged('date')(x): return 'v.date()'
    case tagged('number')(x): return `v.number()`
    case tagged('string')(x): return 'v.string()'
    case tagged('blob')(x): return 'v.blob()'
    case tagged('file')(x): return 'v.file()'
    case tagged('custom')(x): return `v.custom(() => true)`
    case tagged('promise')(x): return `v.promise()`
    case tagged('function')(x): return `v.function()`
    case tagged('enum')(x): return `v.enum({ ${stringifyEntries(x.enum, JSON.stringify).join(', ')} })`
    case tagged('instance')(x): return `v.instance(${x.class.toString()})`
    case tagged('picklist')(x): return `v.picklist([${x.options.join(', ')}])`
    case tagged('literal')(x): return `v.literal(${JSON.stringify(x.literal)})`
    case tagged('nullable')(x): return `v.nullable(${x.wrapped})`
    case tagged('optional')(x): return `v.optional(${x.wrapped})`
    case tagged('exactOptional')(x): return `v.exactOptional(${x.wrapped})`
    case tagged('nullish')(x): return `v.nullish(${x.wrapped})`
    case tagged('nonNullable')(x): return `v.nonNullable(${x.wrapped})`
    case tagged('nonNullish')(x): return `v.nonNullish(${x.wrapped})`
    case tagged('nonOptional')(x): return `v.nonOptional(${x.wrapped})`
    case tagged('undefinedable')(x): return `v.undefinedable(${x.wrapped})`
    case tagged('set')(x): return `v.set(${x.value})`
    case tagged('array')(x): return `v.array(${x.item})`
    case tagged('lazy')(x): return `v.lazy(() => ${x.getter()})`
    case tagged('map')(x): return `v.map(${x.key}, ${x.value})`
    case tagged('record')(x): return `v.record(${x.key}, ${x.value})`
    case tagged('intersect')(x): return `v.intersect([${x.options.join(', ')}])`
    case tagged('union')(x): return `v.union([${x.options.join(', ')}])`
    case tagged('variant')(x): return `v.variant("${String(x.key)}", [${x.options.map(compileObjectNode).join(', ')}])`
    case tagged('tuple')(x): return `v.tuple([${x.items.join(', ')}])`
    case tagged('looseTuple')(x): return `v.looseTuple([${x.items.join(', ')}])`
    case tagged('strictTuple')(x): return `v.strictTuple([${x.items.join(', ')}])`
    case tagged('tupleWithRest')(x): return `v.tupleWithRest([${x.items.join(', ')}], ${x.rest})`
    case tagged('object')(x): return compileObjectNode(x)
    case tagged('looseObject')(x): return `v.looseObject({ ${stringifyEntries(x.entries).join(', ')} })`
    case tagged('strictObject')(x): return `v.strictObject({ ${stringifyEntries(x.entries).join(', ')} })`
    case tagged('objectWithRest')(x): return `v.objectWithRest({ ${stringifyEntries(x.entries).join(', ')} }, ${x.rest})`
  }
})

/** 
 * ## {@link toString `vx.toString`}
 * 
 * Converts an arbitrary valibot schema back into string form. Used internally 
 * for testing/debugging.
 * 
 * @example
 * import * as v from "valibot"
 * import { vx } from "@traversable/valibot"
 * 
 * console.log(
 *   vx.toString(
 *     v.union([
 *       v.object({ tag: v.literal("Left") }), 
 *       v.object({ tag: v.literal("Right") })
 *     ])
 *   )
 * ) 
 * // => 
 * // v.union([
 * //   v.object({ tag: v.literal("Left") }),
 * //   v.object({ tag: v.literal("Right") })
 * // ])
 */

export const toString
  : (schema: F.LowerBound) => string
  = <never>fold
