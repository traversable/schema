import * as T from '@traversable/registry'
import { t } from '@traversable/schema'
import type {
  ValidationError,
  Validate,
  Validator,
} from '@traversable/derive-validators'
import { URI, hasToString } from './shared'

export interface map<K, V> {
  tag: typeof URI.map
  def: [key: K, value: V]
  (u: unknown): u is this['_type']
  _type: map.type<K, V>
  parse(u: this['_type'] | T.Unknown): this['_type']
  validate: Validate<this['_type']>
  toJsonSchema(): never
  /* @ts-expect-error */
  toString(): `Map<${T.Returns<K['toString']>}, ${T.Returns<V['toString']>}>`
}

function mapToString<K, V>(this: map<K, V>): T.Returns<map<K, V>['toString']>
function mapToString<K, V>(this: map<K, V>) {
  let [k, v] = this.def
  return ''
    + 'Map<'
    + (hasToString(k) ? k.toString() : '${string}')
    + ', '
    + (hasToString(v) ? v.toString() : '${string}')
    + '>'
}

export function map<K extends t.Schema, V extends t.Schema>(keySchema: K, valueSchema: V): map<K, V>
export function map<K, V>(keySchema: K, valueSchema: V): map<K, V>
export function map<K extends t.Schema, V extends t.Schema>(keySchema: K, valueSchema: V): map<K, V> {
  return map.def(keySchema, valueSchema)
}

function mapToJsonSchema<K, V>(this: map<K, V>) { return void 0 as never }
function parseMap<K, V>(this: map<K, V>, u: unknown) {
  if (this(u)) return u
  else throw Error('invalid input')
}

export namespace map {
  export let prototype = {
    tag: URI.map,
    toString: mapToString,
    parse: parseMap,
    toJsonSchema: mapToJsonSchema,
    validate: validateMap,
  }
  export type type<K, V> = never | Map<K['_type' & keyof K], V['_type' & keyof V]>
  export function def<K, V>(k: K, v: V): map<K, V> {
    type T = Map<K["_type" & keyof K], V["_type" & keyof V]>
    let keyPredicate = t.isPredicate(k) ? k : (_?: any) => true
    let valuePredicate = t.isPredicate(v) ? v : (_?: any) => true
    function MapSchema(u: map<K, V>['_type'] | {} | null | undefined): u is T {
      if (!(u instanceof globalThis.Map)) return false
      else {
        for (let [k, v] of [...u.entries()]) if (!keyPredicate(k) || !valuePredicate(v)) return false
        return true
      }
    }
    MapSchema.def = [k, v] satisfies [any, any]
    MapSchema.toString = toString
    MapSchema._type = void 0 as never
    return Object.assign(MapSchema, map.prototype)
  }
}

validateMap.tag = URI.map
function validateMap<K extends Validator, V extends Validator>(
  this: map<K, V>,
  got: unknown,
  path: (keyof any)[] = []
): true | ValidationError[] {
  if (!(got instanceof Map)) return [{ kind: 'TYPE_MISMATCH', path, got, msg: 'Expected a Map' }]
  let errors = Array.of<ValidationError>()
  for (let member of got.entries()) {
    const keyResults = this.def[0].validate(member[0], path)
    const valueResults = this.def[1].validate(member[1], path)
    if (keyResults === true)
      if (valueResults === true) continue
      else errors.push(...valueResults)
    else if (valueResults === true) errors.push(...keyResults)
    else errors.push(...keyResults, ...valueResults)
  }
  return errors.length === 0 || errors
}
