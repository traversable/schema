import * as T from '@traversable/registry'
import { t } from '@traversable/schema-core'
import type {
  ValidationError,
  ValidationFn,
  Validate,
  Validator,
} from '@traversable/derive-validators'
import { URI, hasToString } from './shared'
import { parse } from './prototype'

export interface set<S> {
  tag: typeof URI.set
  def: S
  (u: unknown): u is this['_type']
  _type: globalThis.Set<S['_type' & keyof S]>
  parse(u: this['_type'] | T.Unknown): this['_type']
  validate: Validate<this['_type']>
  toJsonSchema(): never
  /* @ts-expect-error */
  toString(): `Set<${T.Returns<S['toString']>}>`
}

function setToString<S>(this: set<S>): T.Returns<set<S>['toString']>
function setToString<S>(this: set<S>) {
  if (hasToString(this.def)) return 'Set<' + this.def.toString() + '>'
  else return 'Set<' + '${string}' + '>'
}

export function set<S extends t.Schema>(schema: S): set<S>
export function set<S>(schema: S): set<S>
export function set<S>(schema: S): set<S> { return set.def(schema) }
export namespace set {
  export let prototype = {
    tag: URI.set,
    toString: setToString,
    parse: parse as never,
    validate: validateSet,
  }

  export function def<S>(x: S): set<S> {
    type T = Set<S['_type' & keyof S]>
    const predicate = T.isPredicate(x) ? x : (_?: any) => true
    function SetSchema(u: unknown): u is T {
      if (!(u instanceof globalThis.Set)) return false
      else {
        for (let member of [...u.values()]) if (!predicate(member)) return false
        return true
      }
    }
    SetSchema.def = x
    // SetSchema.validate = validateSet(x)
    SetSchema.toJsonSchema = () => void 0 as never
    SetSchema._type = void 0 as never

    return Object.assign(SetSchema, set.prototype)
  }
}

validateSet.tag = URI.map
function validateSet<S extends Validator>(
  this: set<S>,
  got: unknown,
  path: (keyof any)[] = []
): true | ValidationError[] {
  if (!(got instanceof Set)) return [{ kind: 'TYPE_MISMATCH', path, got, msg: 'Expected a set' }]
  let errors = Array.of<ValidationError>()
  for (let member of got.values()) {
    const results = this.def.validate(member, path)
    if (results === true) continue
    else errors.push(...results)
  }
  return errors.length === 0 || errors
}
