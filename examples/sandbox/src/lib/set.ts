import * as T from '@traversable/registry'
import { t } from '@traversable/schema'
import type {
  ValidationError,
  ValidationFn,
  Validate,
  Options as ValidationOptions
} from '@traversable/derive-validators'
import { URI, hasToString, unsafeParse } from './shared'

export interface set<S> {
  tag: typeof URI.set
  def: S
  (u: unknown): u is this['_type']
  _type: globalThis.Set<S['_type' & keyof S]>
  unsafeParse: unsafeParse<this['_type']>
  validate: Validate<this['_type']>
  /* @ts-expect-error - see [[Note]] below */
  toString(): `Set<${T.Returns<S['toString']>}>`
  /*\* 
   * [[Note]]: it's important that we keep `S` unconstrained, otherwise recursion would
   * be closed over {@link Functor}'s category, and the only algebra we'd be able to implement
   * would be `f(x) = x`, which isn't terribly useful.
   * 
   * Since we don't care about bringing this implementation of `toString` along with us,
   * we _could_ jump through some type-level hoops to "recover" that `S` was a schema, but
   * that proof ends up being expensive, since we'd have to prove that `S` has a property
   * called 'toString', that that property is a function, and that that function returns a string.
   * 
   * This trade-off should be re-evaluated once TSv7 is released, but for now, since IDE responsiveness 
   * is a priority, the juice is worth the squeeze.
   */
}

export function set<S extends t.Schema>(schema: S): set<S>
export function set<S>(schema: S): set<S>
export function set<S>(schema: S): set<S> { return set.def(schema) }
export namespace set {
  export function def<S>(x: S): set<S> {
    type T = Set<S['_type' & keyof S]>
    const predicate = t.isPredicate(x) ? x : (_?: any) => true
    const toString = hasToString(x) ? x.toString : () => '${string}'
    function SetSchema(u: unknown): u is T {
      if (!(u instanceof globalThis.Set)) return false
      else {
        for (let member of [...u.values()]) if (!predicate(member)) return false
        return true
      }
    }
    SetSchema.tag = URI.set
    SetSchema.def = x
    SetSchema.validate = validateSet(x)
    SetSchema.toString = () => 'Set<' + toString() + '>' as T.Returns<set<S>['toString']>
    SetSchema._type = void 0 as never
    return unsafeParse(SetSchema)
  }
}

function validateSet<S>(schema: S, options?: ValidationOptions): (data: Set<S['_type' & keyof S]> | {} | null | undefined) => true | ValidationError[]
function validateSet<S extends t.Schema>(schema: S, options?: ValidationOptions): (data: Set<S['_type']> | {} | null | undefined) => true | ValidationError[] {
  validateSet.tag = URI.array
  validateSet.ctx = options?.path || []
  function validateSet(
    got: Set<S['_type']> | {} | null | undefined,
    ctx: (keyof any)[] = []
  ): true | ValidationError[] {
    const path = [...validateSet.ctx, ...ctx]
    validateSet.ctx = []
    if (!(got instanceof Set)) return [{ kind: 'TYPE_MISMATCH', path, got, msg: 'Expected a set' }]
    let errors = Array.of<ValidationError>()
    const validate = (schema as any).validate
    for (let member of got.entries()) {
      const results = (validate as ValidationFn)(member, ctx)
      if (results === true) continue
      else errors.push(...results)
    }
    return errors.length === 0 || errors
  }
  return validateSet
}
