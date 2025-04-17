import { fc } from '@fast-check/vitest'
import { fn, URI } from '@traversable/registry'
import { t } from '@traversable/schema-core'

export let defaultOptions = {} satisfies Required<fromSchema.Options>
declare namespace fromSchema { type Options = {} }

/**
 * ## {@link fromSchema `Arbitrary.fromSchema`}
 */
export let fromSchema
  : <S extends t.Schema>(schema: S, options?: fromSchema.Options) => fc.Arbitrary<S['_type']>
  = (schema) => t.fold<fc.Arbitrary<unknown>>(
    (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case x.tag === URI.never: return fc.constant(void 0)
        case x.tag === URI.any: return fc.anything()
        case x.tag === URI.unknown: return fc.anything()
        case x.tag === URI.void: return fc.constant(void 0)
        case x.tag === URI.null: return fc.constant(null)
        case x.tag === URI.undefined: return fc.constant(undefined)
        case x.tag === URI.symbol: return fc.string().map((_) => Symbol(_))
        case x.tag === URI.boolean: return fc.boolean()
        case x.tag === URI.integer: return fc.integer({ min: x.minimum, max: x.maximum })
        case x.tag === URI.bigint: return fc.bigInt({ min: x.minimum, max: x.maximum })
        case x.tag === URI.string: return fc.string({ minLength: x.minLength, maxLength: x.maxLength })
        case x.tag === URI.number: return fc.float({
          min: t.number(x.exclusiveMinimum) ? x.exclusiveMinimum : x.minimum,
          max: t.number(x.exclusiveMaximum) ? x.exclusiveMaximum : x.minimum,
          minExcluded: t.number(x.exclusiveMinimum),
          maxExcluded: t.number(x.exclusiveMaximum),
        })
        case x.tag === URI.eq: return fc.constant(x.def)
        case x.tag === URI.optional: return fc.option(x.def, { nil: void 0 })
        case x.tag === URI.array: return fc.array(x.def)
        case x.tag === URI.record: return fc.dictionary(fc.string(), x.def)
        case x.tag === URI.union: return fc.oneof(...x.def)
        case x.tag === URI.tuple: return fc.tuple(...x.def)
        case x.tag === URI.intersect: return fc.tuple(...x.def).map((xs) => xs.reduce<{}>(
          (acc, cur) => cur == null ? acc : Object.assign(acc, cur), {}
        ))
        case x.tag === URI.object: {
          let requiredKeys = Array.of<string>().concat(x.req)
          let optionalKeys = Array.of<string>().concat(x.opt)
          return fc.record(x.def, { ...optionalKeys.length > 0 && { requiredKeys } })
        }
      }
    }
  )(schema)
