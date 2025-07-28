import * as T from '@traversable/registry'
import {
  accessor,
  escape,
  escapeRegExp,
  fn,
  Number_isSafeInteger,
  Number_isFinite,
  Math_min,
  Math_max,
  Number_isNatural,
  Object_entries,
  Object_keys,
  Object_hasOwn,
  Object_values,
  parseKey,
} from '@traversable/registry'
import { Json } from '@traversable/json'

import * as F from './functor.js'
import { toType } from './to-type.js'
import * as JsonSchema from './types.js'
type JsonSchema<T = unknown> = import('./types.js').JsonSchema<T>

export const checkJson = Json.fold<(x: unknown) => boolean>((x) => {
  switch (true) {
    default: return (void (x satisfies never), () => false)
    case Json.isScalar(x):
      return (u) => u === x
    case Json.isArray(x):
      return (u) => Json.isArray(u)
        && u.length === x.length
        && x.every((predicate, i) => predicate(u[i]))
    case Json.isObject(x): {
      const predicates = Object_entries(x)
      return (u) => {
        if (!Json.isObject(u)) {
          return false
        } else {
          const keys = Object_keys(u)
          if (keys.length !== predicates.map(([k]) => k).length)
            return false
          else
            return predicates.every(
              ([k, predicate]) =>
                Object_hasOwn(u, k)
                && predicate(u[k])
            )
        }
      }
    }
  }
})

const fold = F.fold<(x: unknown) => boolean>((x) => {
  switch (true) {
    default: return (void (x satisfies never), () => false)
    case JsonSchema.isNever(x): return () => false
    case JsonSchema.isConst(x): return checkJson(x.const as Json<(x: unknown) => boolean>)
    case JsonSchema.isNull(x): return (u) => u === null
    case JsonSchema.isBoolean(x): return (u) => u === false || u === true
    case JsonSchema.isUnion(x): {
      if (x.anyOf.length === 0) return () => false
      else if (x.anyOf.length === 1) return x.anyOf[0]
      else return (u) => x.anyOf.some((p) => p(u))
    }
    case JsonSchema.isIntersection(x): {
      if (x.allOf.length === 0) return () => true
      else if (x.allOf.length === 1) return x.allOf[0]
      else return (u) => x.allOf.every((p) => p(u))
    }
    case JsonSchema.isEnum(x): return (u) =>
      u !== undefined
      && Json.isScalar(u)
      && x.enum.includes(u)
    case JsonSchema.isInteger(x): {
      const { maximum, minimum, multipleOf } = x
      if (Number_isSafeInteger(maximum) && Number_isSafeInteger(minimum) && Number_isSafeInteger(multipleOf))
        return (u) => Number_isSafeInteger(u)
          && minimum <= u
          && u <= maximum
          && u % multipleOf === 0
      else if (Number_isSafeInteger(maximum) && Number_isSafeInteger(minimum))
        return (u) => Number_isSafeInteger(u)
          && minimum <= u
          && u <= maximum
      else if (Number_isSafeInteger(maximum) && Number_isSafeInteger(multipleOf))
        return (u) => Number_isSafeInteger(u)
          && u <= maximum
          && u % multipleOf === 0
      else if (Number_isSafeInteger(maximum))
        return (u) => Number_isSafeInteger(u)
          && u <= maximum
      else if (Number_isSafeInteger(minimum) && Number_isSafeInteger(multipleOf))
        return (u) => Number_isSafeInteger(u)
          && minimum <= u
          && u % multipleOf === 0
      else if (Number_isSafeInteger(minimum))
        return (u) => Number_isSafeInteger(u)
          && minimum <= u
      else if (Number_isSafeInteger(multipleOf))
        return (u) => Number_isSafeInteger(u)
          && u % multipleOf === 0
      else
        return (u) => Number_isSafeInteger(u)
    }
    case JsonSchema.isNumber(x): {
      const { exclusiveMaximum: xMax, exclusiveMinimum: xMin, maximum: max, minimum: min, multipleOf } = x
      const maximum = Number_isFinite(xMax) && Number_isFinite(max) ? Math_min(xMax, max) : Number_isFinite(xMax) ? xMax : max
      const minimum = Number_isFinite(xMin) && Number_isFinite(min) ? Math_max(xMin, min) : Number_isFinite(xMin) ? xMin : min
      const exclusiveMaximum = Number_isFinite(xMax) && xMax === maximum
      const exclusiveMinimum = Number_isFinite(xMin) && xMin === minimum
      if (Number_isFinite(maximum) && Number_isFinite(minimum) && Number_isFinite(multipleOf))
        if (exclusiveMaximum && exclusiveMinimum)
          return (u) =>
            Number_isFinite(u)
            && minimum < u
            && u < maximum
            && u % multipleOf === 0
        else if (exclusiveMaximum)
          return (u) =>
            Number_isFinite(u)
            && minimum <= u
            && u < maximum
            && u % multipleOf === 0
        else if (exclusiveMinimum)
          return (u) =>
            Number_isFinite(u)
            && minimum < u
            && u <= maximum
            && u % multipleOf === 0
        else
          return (u) =>
            Number_isFinite(u)
            && minimum <= u
            && u <= maximum
            && u % multipleOf === 0
      else if (Number_isFinite(maximum) && Number_isFinite(minimum))
        if (exclusiveMaximum && exclusiveMinimum)
          return (u) =>
            Number_isFinite(u)
            && minimum < u
            && u < maximum
        else if (exclusiveMaximum)
          return (u) =>
            Number_isFinite(u)
            && minimum <= u
            && u < maximum
        else if (exclusiveMinimum)
          return (u) =>
            Number_isFinite(u)
            && minimum < u
            && u <= maximum
        else
          return (u) =>
            Number_isFinite(u)
            && minimum <= u
            && u <= maximum
      else if (Number_isFinite(maximum) && Number_isFinite(multipleOf))
        if (exclusiveMaximum)
          return (u) =>
            Number_isFinite(u)
            && u < maximum
            && u % multipleOf === 0
        else
          return (u) =>
            Number_isFinite(u)
            && u <= maximum
            && u % multipleOf === 0
      else if (Number_isFinite(maximum))
        if (exclusiveMaximum)
          return (u) =>
            Number_isFinite(u)
            && u < maximum
        else
          return (u) =>
            Number_isFinite(u)
            && u <= maximum
      else if (Number_isFinite(minimum) && Number_isFinite(multipleOf))
        if (exclusiveMinimum)
          return (u) =>
            Number_isFinite(u)
            && minimum < u
            && u % multipleOf === 0
        else
          return (u) =>
            Number_isFinite(u)
            && minimum <= u
            && u % multipleOf === 0
      else if (Number_isFinite(minimum))
        if (exclusiveMinimum)
          return (u) =>
            Number_isFinite(u)
            && minimum < u
        else
          return (u) =>
            Number_isFinite(u)
            && minimum <= u
      else if (Number_isFinite(multipleOf))
        return (u) =>
          Number_isFinite(u)
          && u % multipleOf === 0
      else
        return (u) =>
          Number_isFinite(u)
    }
    case JsonSchema.isString(x): {
      const { maxLength, minLength } = x
      if (Number_isNatural(maxLength) && Number_isNatural(minLength))
        return (u) =>
          typeof u === 'string'
          && minLength <= u.length
          && u.length <= maxLength
      else if (Number_isNatural(maxLength))
        return (u) =>
          typeof u === 'string'
          && u.length <= maxLength
      else if (Number_isNatural(minLength))
        return (u) =>
          typeof u === 'string'
          && minLength <= u.length
      else
        return (u) =>
          typeof u === 'string'
    }
    case JsonSchema.isArray(x): {
      const { items: predicate, maxItems, minItems } = x
      if (predicate)
        if (Number_isNatural(maxItems) && Number_isNatural(minItems))
          return (u) =>
            Json.isArray(u)
            && u.every(predicate)
            && minItems <= u.length
            && u.length <= maxItems
        else if (Number_isNatural(maxItems))
          return (u) =>
            Json.isArray(u)
            && u.every(predicate)
            && u.length <= maxItems
        else if (Number_isNatural(minItems))
          return (u) =>
            Json.isArray(u)
            && u.every(predicate)
            && minItems <= u.length
        else return (u) =>
          Json.isArray(u)
          && u.every(predicate)
      else
        if (Number_isNatural(maxItems) && Number_isNatural(minItems))
          return (u) =>
            Json.isArray(u)
            && minItems <= u.length
            && u.length <= maxItems
        else if (Number_isNatural(maxItems))
          return (u) =>
            Json.isArray(u)
            && u.length <= maxItems
        else if (Number_isNatural(minItems))
          return (u) =>
            Json.isArray(u)
            && minItems <= u.length
        else
          return Json.isArray
    }
    case JsonSchema.isTuple(x): {
      const { items: predicate, maxItems, minItems, prefixItems: predicates } = x
      if (predicate)
        if (Number_isNatural(maxItems) && Number_isNatural(minItems))
          return (u) =>
            Json.isArray(u)
            && minItems <= u.length
            && u.length <= maxItems
            && predicates.every((p, i) => p(u[i]))
            && u.slice(predicates.length).every(predicate)
        else if (Number_isNatural(maxItems))
          return (u) =>
            Json.isArray(u)
            && u.length <= maxItems
            && predicates.every((p, i) => p(u[i]))
            && u.slice(predicates.length).every(predicate)
        else if (Number_isNatural(minItems))
          return (u) =>
            Json.isArray(u)
            && minItems <= u.length
            && predicates.every((p, i) => p(u[i]))
            && u.slice(predicates.length).every(predicate)
        else return (u) =>
          Json.isArray(u)
          && predicates.every((p, i) => p(u[i]))
          && u.slice(predicates.length).every(predicate)
      else
        if (Number_isNatural(maxItems) && Number_isNatural(minItems))
          return (u) =>
            Json.isArray(u)
            && minItems <= u.length
            && u.length <= maxItems
            && predicates.every((p, i) => p(u[i]))
        else if (Number_isNatural(maxItems))
          return (u) =>
            Json.isArray(u)
            && u.length <= maxItems
            && predicates.every((p, i) => p(u[i]))
        else if (Number_isNatural(minItems))
          return (u) =>
            Json.isArray(u)
            && minItems <= u.length
            && predicates.every((p, i) => p(u[i]))
        else return (u) =>
          Json.isArray(u)
          && predicates.every((p, i) => p(u[i]))
    }
    case JsonSchema.isRecord(x): {
      const { additionalProperties, patternProperties } = x
      if (additionalProperties && patternProperties) {
        const patterns = Object_entries(patternProperties)
        return (u) => {
          if (!Json.isObject(u))
            return false
          else {
            const keys = Object_keys(u)
            return keys.every(
              (key) => {
                const [, predicate] = patterns.find(([p]) => new RegExp(escapeRegExp(p)).test(key)) || []
                return (
                  predicate
                  && predicate(u[key])
                )
                  || additionalProperties(u[key])
              }
            )
          }
        }
      } else if (additionalProperties) {
        return (u) =>
          Json.isObject(u)
          && Object_values(u).every(additionalProperties)
      } else if (patternProperties) {
        const patterns = Object_entries(patternProperties)
        return (u) => {
          if (!Json.isObject(u)) {
            return false
          } else {
            const keys = Object_keys(u)
            return keys.every(
              (key) => {
                const [, predicate] = patterns.find(([p]) => new RegExp(escapeRegExp(p)).test(key)) || []
                return predicate && predicate(u[key])
              }
            )
          }
        }
      } else return Json.isObject
    }
    case JsonSchema.isObject(x): {
      const { properties, required } = x
      const predicates = Object_entries(properties)
      return (u) =>
        Json.isObject(u)
        && predicates.every(
          ([k, predicate]) =>
            !required.includes(k)
              ? (
                !Object_hasOwn(u, k)
                || predicate(u[k])
              )
              : (
                Object_hasOwn(u, k)
                && predicate(u[k])
              )
        )
    }
    case JsonSchema.isUnknown(x): return () => true
  }
})

function literalValueToString(x: Json.Scalar) {
  if (typeof x === 'string') {
    const escaped = escape(x)
    return `"${escaped}"`
  } else {
    return typeof x === 'bigint' ? `${x}n` : `${x}`
  }
}

const JsonFunctor: T.Functor.Ix<string, Json.Free, Json.Fixpoint> = {
  map: Json.Functor.map,
  mapWithIndex(f) {
    return (xs, VAR) => {
      switch (true) {
        default: return xs satisfies never
        case Json.isScalar(xs): return xs
        case Json.isArray(xs): return fn.map(xs, (x, i) => f(x, `${VAR}${accessor(i, false)}`, xs))
        case Json.isObject(xs): return fn.map(xs, (x, k) => f(x, `${VAR}${accessor(k, false)}`, xs))
      }
    }
  },
}

const foldJson = fn.catamorphism(JsonFunctor, 'value')

function compileJson(x: Json, varName: string) {
  return foldJson<string>((x, VAR) => {
    switch (true) {
      default: return x satisfies never
      case x == null:
      case x === true:
      case x === false:
      case typeof x === 'number': return `${VAR} === ${x}`
      case typeof x === 'string': return `${VAR} === "${escape(x)}"`
      case Json.isArray(x): return `Array.isArray(${VAR}) && ${VAR}.length === ${x.length}${x.length === 0 ? '' : ' && '}${x.join(' && ')}`
      case Json.isObject(x): {
        const values = Object_values(x)
        return `!!${VAR} && typeof ${VAR} === 'object'${values.length === 0 ? '' : ' && '}${values.join(' && ')}`
      }
    }
  })(x as never, varName)
}

const compile = F.compile<string>((x, ix, input) => {
  const VAR = ix.varName
  switch (true) {
    default: return x satisfies never
    case JsonSchema.isNever(x): return 'false'
    case JsonSchema.isNull(x): return `${VAR} === null`
    case JsonSchema.isBoolean(x): return `typeof ${VAR} === "boolean"`
    case JsonSchema.isUnion(x): {
      if (x.anyOf.length === 0) return 'false'
      else if (x.anyOf.length === 1) return x.anyOf[0]
      else return x.anyOf.length === 0 ? 'false' : `(${x.anyOf.map((v) => `(${v})`).join(' || ')})`
    }
    case JsonSchema.isIntersection(x): {
      if (x.allOf.length === 0) return 'false'
      else if (x.allOf.length === 1) return x.allOf[0]
      return x.allOf.length === 0 ? 'true' : `(${x.allOf.map((v) => `(${v})`).join(' && ')})`
    }
    case JsonSchema.isEnum(x): {
      const members = x.enum.map((v) => `${VAR} === ${literalValueToString(v)}`)
      const OPEN = x.enum.length > 1 ? '(' : ''
      const CLOSE = x.enum.length > 1 ? ')' : ''
      return OPEN + members.join(' || ') + CLOSE
    }
    case JsonSchema.isConst(x): {
      // TODO: handle arrays and objects
      return compileJson(x.const, VAR)
    }
    case JsonSchema.isInteger(x): {
      const { minimum: min, maximum: max, multipleOf } = x
      const CHECK = `Number.isSafeInteger(${VAR})`
      const MIN_CHECK = !Number_isSafeInteger(min) ? '' : ` && ${min} <= ${VAR}`
      const MAX_CHECK = !Number_isSafeInteger(max) ? '' : ` && ${VAR} <= ${max}`
      const MULTIPLE_OF = !Number_isSafeInteger(multipleOf) ? '' : ` && ${VAR} % ${multipleOf} === 0`
      const OPEN = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? '(' : ''
      const CLOSE = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? ')' : ''
      return ''
        + OPEN
        + CHECK
        + MIN_CHECK
        + MAX_CHECK
        + MULTIPLE_OF
        + CLOSE
    }
    case JsonSchema.isNumber(x): {
      const { minimum: min, maximum: max, exclusiveMinimum: xMin, exclusiveMaximum: xMax, multipleOf } = x
      const CHECK = `Number.isFinite(${VAR})`
      const MIN_CHECK
        = Number_isFinite(xMin) ? ` && ${xMin} < ${VAR}`
          : Number_isFinite(min) ? ` && ${min} <= ${VAR}`
            : ''
      const MAX_CHECK
        = Number_isFinite(xMax) ? ` && ${VAR} < ${xMax}`
          : Number_isFinite(max) ? ` && ${VAR} <= ${max}`
            : ''
      const MULTIPLE_OF = !Number_isFinite(multipleOf) ? '' : ` && ${VAR} % ${multipleOf} === 0`
      const OPEN = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? '(' : ''
      const CLOSE = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? ')' : ''
      return ''
        + OPEN
        + CHECK
        + MIN_CHECK
        + MAX_CHECK
        + MULTIPLE_OF
        + CLOSE
    }
    case JsonSchema.isString(x): {
      const { minLength: min, maxLength: max } = x
      const CHECK = `typeof ${VAR} === "string"`
      const MIN_CHECK = Number_isNatural(min) ? ` && ${min} <= ${VAR}.length` : ''
      const MAX_CHECK = Number_isNatural(max) ? ` && ${VAR}.length <= ${max}` : ''
      const OPEN = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? '(' : ''
      const CLOSE = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? ')' : ''
      return ''
        + OPEN
        + CHECK
        + MIN_CHECK
        + MAX_CHECK
        + CLOSE
    }
    case JsonSchema.isTuple(x): {
      const { items: rest, prefixItems, minItems, maxItems } = x
      const REST = typeof rest !== 'string' ? '' : ` && ${VAR}.slice(${prefixItems.length}).every((value) => ${rest})`
      const BODY = `${prefixItems.length > 0 ? ' && (' : ''}${prefixItems.join(' && ')}${prefixItems.length > 0 ? ')' : ''}`
      const MIN_CHECK = Number_isNatural(minItems) ? ` && ${minItems} <= ${VAR}.length` : ''
      const MAX_CHECK = Number_isNatural(maxItems) ? ` && ${VAR}.length <= ${maxItems}` : ''
      return ''
        + `Array.isArray(${VAR})`
        + MIN_CHECK
        + MAX_CHECK
        + BODY
        + REST
    }
    case JsonSchema.isArray(x): {
      const { items, minItems, maxItems } = x
      const BODY = ` && ${VAR}.every((value) => ${items})`
      const MIN_CHECK = Number_isNatural(minItems) ? ` && ${minItems} <= ${VAR}.length` : ''
      const MAX_CHECK = Number_isNatural(maxItems) ? ` && ${VAR}.length <= ${maxItems}` : ''
      return ''
        + `Array.isArray(${VAR})`
        + MIN_CHECK
        + MAX_CHECK
        + BODY
    }
    case JsonSchema.isRecord(x): {
      const { additionalProperties, patternProperties } = x
      const CHECK = `!!${VAR} && typeof ${VAR} === "object"`
      if (patternProperties !== undefined) {
        const patterns = Object_entries(patternProperties)
        return [
          `${CHECK} && Object.entries(${VAR}).every(([key, value]) => {`,
          ...patterns.map(([pattern, predicate]) => `if (/${pattern.length === 0 ? '^$' : pattern}/.test(key)) return ${predicate}`),
          additionalProperties === undefined ? null : `return ${additionalProperties}`,
          `return true`,
          `})`
        ].filter((_) => _ !== null).join('\n')
      } else if (additionalProperties !== undefined) {
        return `${CHECK} && Object.entries(${VAR}).every(([key, value]) => ${additionalProperties})`
      } else {
        return CHECK
      }
    }
    case JsonSchema.isObject(x): {
      const { properties, required = [] } = x
      const CHECK = `!!${VAR} && typeof ${VAR} === "object"`
      const CHILDREN = Object_entries(properties).map(([k, v]) => !required.includes(k)
        ? `(!Object.hasOwn(${VAR}, ${JSON.stringify(parseKey(k))}) || ${v})`
        : v
      )
      const BODY = CHILDREN.length === 0 ? '' : ` && ${CHILDREN.join(' && ')}`
      return ''
        + CHECK
        + BODY
    }
    case JsonSchema.isUnknown(x): return 'true'
  }
})

function buildFunctionBody(schema: JsonSchema): string {
  let BODY = compile(schema)
  if (BODY.startsWith('(') && BODY.endsWith(')')) BODY = BODY.slice(1, -1)
  return BODY
}

export declare namespace check {
  type Options = toType.Options & {
    /**
     * Configure the name of the generated check function
     * @default "check"
     */
    functionName?: string
    /**
     * Whether the returned predicate should infer the return type from
     * the JSON Schema input and act as a type-guard for that type.
     * 
     * For this to work properly, the JSON Schema you pass will need to
     * be a _TypeScript value_ that has been declared with the `as const`
     * modifier, or passed as a literal value  (rather than a JSON value).
     * 
     * **Note:** Inferring a type guard can be expensive, so by default
     * this is an opt-in feature.
     * 
     * @default false
     */
    asTypeGuard?: true
    /**
     * Whether the returned predicate should be output as pure JavaScript,
     * with no types included.
     * 
     * @default false
     */
    stripTypes?: boolean
  }
}

check.classic = check_classic
check.writeable = check_writeable

/**
 * ## {@link check `JsonSchema.check`}
 * 
 * Given a JSON Schema spec, returns a predicate function that accepts any input
 * and returns a boolean indicating whether the input satisfied the spec.
 * 
 * Pros:
 * - {@link check `JsonSchema.check`} has better performance than {@link check_writeable `JsonSchema.check.writeable`}
 * 
 * Cons:
 * - {@link check `JsonSchema.check`} does not work in environments that disallow the use of the native 
 *   [`Function` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function),
 *   which means you can't use it with Cloudflare workers
 * 
 * See also:
 * - {@link check_classic `JsonSchema.check.classic`}
 * - {@link check_writeable `JsonSchema.check.writeable`}
 * 
 * @example
 * import { check } from '@traversable/json-schema-types'
 * 
 * const myCheck = check({ type: 'boolean' })
 * 
 * console.log(myCheck(false))  // => true
 * console.log(myCheck('true')) // => false
 * 
 * const myTypeGuard = check({ type: 'boolean' }, { asTypeGuard: true })
 * 
 * declare const input: unknown
 * 
 * if (myTypeGuard(input)) {
 *   input
 *   // ^? const input: boolean
 * }
 */
export function check<T extends JsonSchema>(schema: T): (x: unknown) => boolean
export function check<const T extends JsonSchema>(schema: T, options: Pick<check.Options, 'asTypeGuard'>): (x: unknown) => x is toType<T>
export function check<T extends JsonSchema>(schema: T) {
  return globalThis.Function(
    'value',
    'return ' + buildFunctionBody(schema)
  )
}

/**
 * ## {@link check_writeable `JsonSchema.check.writeable`}
 * 
 * Given a JSON Schema spec, returns a validation function in **stringified form**.
 * 
 * Pros:
 * - {@link check_writeable `JsonSchema.check.writeable`} has the same performance as
 *   {@link check `JsonSchema.check`} _and_ works in any environment
 * 
 * Cons:
 * - You have to write the schemas to disc somehow, and you'll definitely want to
 *   set up a build step that keeps them in sync with the JSON Schema spec.
 * 
 * See also:
 * - {@link check `JsonSchema.check`}
 * - {@link check_classic `JsonSchema.check.classic`}
 */
function check_writeable<T extends JsonSchema>(schema: T, options?: check.Options): string {
  const inputType = toType(schema, options)
  const INPUT_TYPE = options?.stripTypes === true ? '' : ': any'
  const TARGET_TYPE = options?.stripTypes === true ? '' : `: value is ${options?.typeName ?? inputType}`
  const ANNOTATION = options?.stripTypes || options?.typeName === undefined ? '' : inputType
  const FUNCTION_NAME = options?.functionName ?? 'check'
  const BODY = buildFunctionBody(schema)
  return `
  ${ANNOTATION}
  function ${FUNCTION_NAME} (value${INPUT_TYPE})${TARGET_TYPE} {
    return ${BODY}
  }
  `.trim()
}

/**
 * ## {@link check_classic `JsonSchema.check.classic`}
 * 
 * Given a JSON Schema spec, returns a predicate function that accepts any input
 * and returns a boolean indicating whether the input satisfied the spec.
 * 
 * Pros:
 * - {@link check_classic `JsonSchema.check.classic`} works in any environment, including Cloudflare workers
 * 
 * Cons:
 * - {@link check_classic `JsonSchema.check.classic`} has worse performance than {@link check `JsonSchema.check`}
 * 
 * See also:
 * - {@link check `JsonSchema.check`}
 * - {@link check_writeable `JsonSchema.check.writeable`}
 */
function check_classic<T extends JsonSchema>(schema: T): (x: unknown) => boolean {
  return fold(schema as JsonSchema<(x: unknown) => boolean>)
}
