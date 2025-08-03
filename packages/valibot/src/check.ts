import * as v from 'valibot'
import {
  escape,
  joinPath,
  Number_isFinite,
  Number_isNatural,
  Number_isSafeInteger,
  Object_keys,
  Object_entries,
  parseKey,
  has,
  Array_isArray,
  accessor,
} from '@traversable/registry'

import { F, Invariant, tagged, hasType } from '@traversable/valibot-types'

const unsupported = [
  'custom',
] as const

type UnsupportedSchema = F.V.Catalog[typeof unsupported[number]]

function isUnsupported(x: unknown): x is UnsupportedSchema {
  return hasType(x) && unsupported.includes(x.type as never)
}

function literalValueToString(x: unknown) {
  return typeof x === 'string' ? `"${escape(x)}"` : `${x}`
}

type Builder = (path: (string | number)[], isProperty: boolean) => string

function getValidationType<V extends string>(type: V): <T>(x: F.V.Hole<T>) => {} | null
function getValidationType<V extends string>(type: V) {
  return <T>(x: F.V.Hole<T>) => {
    if (!has('pipe', Array_isArray)(x)) return null
    else {
      const validation = x.pipe.find(has('type', (_): _ is never => _ === type))
      return has('requirement')(validation) ? validation.requirement : null
    }
  }
}

const getMinValue = getValidationType('min_value')
const getMaxValue = getValidationType('max_value')
const getGtValue = getValidationType('gt_value')
const getLtValue = getValidationType('lt_value')
const getMultipleOf = getValidationType('multiple_of')
const getInteger = getValidationType('integer')
const getMinLength = getValidationType('min_length')
const getMaxLength = getValidationType('max_length')

const fold
  : (src: F.V.Hole<Builder>, ix?: F.Functor.Index | undefined) => Builder
  = F.fold((x, _, input) => {
    switch (true) {
      default: return (void (x satisfies never), () => '')
      case tagged('never')(x):
        return function checkNever() { return 'false' }
      case tagged('any')(x):
        return function checkAny() { return 'true' }
      case tagged('unknown')(x):
        return function checkUnknown() { return 'true' }
      case tagged('void')(x):
        return function checkVoid(path) { return `${joinPath(path, false)} === void 0` }
      case tagged('undefined')(x):
        return function checkUndefined(path) { return `${joinPath(path, false)} === undefined` }
      case tagged('null')(x):
        return function checkNull(path) { return `${joinPath(path, false)} === null` }
      case tagged('boolean')(x):
        return function checkBoolean(path) { return `typeof ${joinPath(path, false)} === "boolean"` }
      case tagged('symbol')(x):
        return function checkSymbol(path) { return `typeof ${joinPath(path, false)} === "symbol"` }
      case tagged('NaN')(x):
        return function checkNaN(path) { return `Number.isNaN(${joinPath(path, false)})` }
      case tagged('function')(x):
        return function checkFunction(path) { return `typeof ${joinPath(path, false)} === "function"` }
      case tagged('instance')(x):
        return function checkInstance(path) { return `${joinPath(path, false)} instanceof ${x.class.name}` }
      case tagged('date')(x):
        return function checkDate(path) { return `${joinPath(path, false)} instanceof Date` }
      case tagged('file')(x):
        return function checkFile(path) { return `${joinPath(path, false)} instanceof File` }
      case tagged('blob')(x):
        return function checkBlob(path) { return `${joinPath(path, false)} instanceof Blob` }
      case tagged('promise')(x):
        return function checkBlob(path) { return `${joinPath(path, false)} instanceof Promise` }
      case tagged('lazy')(x):
        return function checkLazy(...args) { return x.getter()(...args) }
      case tagged('undefinedable')(x):
        return function checkUndefinedable(path, isProperty) {
          return `(${joinPath(path, false)} === undefined || (${x.wrapped(path, isProperty)}))`
        }
      case tagged('nullish')(x):
        return function checkNullish(path, isProperty) {
          return `(${joinPath(path, false)} == null || (${x.wrapped(path, isProperty)}))`
        }
      case tagged('nonNullish')(x):
        return function checkNonNullish(path, isProperty) {
          return `(${joinPath(path, false)} != null && (${x.wrapped(path, isProperty)}))`
        }
      case tagged('nullable')(x):
        return function checkNullable(path, isProperty) {
          return `(${joinPath(path, false)} === null || (${x.wrapped(path, isProperty)}))`
        }
      case tagged('nonNullable')(x):
        return function checkNonNullable(path, isProperty) {
          return `(${joinPath(path, false)} !== null && (${x.wrapped(path, isProperty)}))`
        }
      case tagged('optional')(x):
        return function checkOptional(path, isProperty) {
          return `(${joinPath(path, false)} === undefined || (${x.wrapped(path, isProperty)}))`
        }
      case tagged('exactOptional')(x):
        return function checkExactOptional(path, isProperty) {
          return isProperty
            ? x.wrapped(path, isProperty)
            : `(${joinPath(path, false)} === undefined || (${x.wrapped(path, isProperty)}))`
        }
      case tagged('nonOptional')(x):
        return function checkNonOptional(path, isProperty) {
          return isProperty
            ? `(${joinPath(path, false)} !== undefined && (${x.wrapped(path, isProperty)}))`
            : x.wrapped(path, isProperty)
        }
      case tagged('literal')(x):
        return function checkLiteral(path) {
          const VAR = joinPath(path, false)
          return `${VAR} === ${literalValueToString(x.literal)}`
        }
      case tagged('picklist')(x):
      case tagged('enum')(x):
        return function checkEnum(path) {
          const VAR = joinPath(path, false)
          const members = x.options.map((v) => `${VAR} === ${literalValueToString(v)}`)
          const OPEN = members.length > 1 ? '(' : ''
          const CLOSE = members.length > 1 ? ')' : ''
          return members.length === 0 ? 'true' : OPEN + members.join(' || ') + CLOSE
        }
      case tagged('number')(x):
        return function checkNumber(path) {
          const min = getMinValue(x)
          const max = getMaxValue(x)
          const xMin = getGtValue(x)
          const xMax = getLtValue(x)
          const int = getInteger(x)
          const multipleOf = getMultipleOf(x)
          const check = int === null ? Number_isFinite : Number_isSafeInteger
          const VAR = joinPath(path, false)
          const CHECK = int === null ? `Number.isFinite(${VAR})` : `Number.isSafeInteger(${VAR})`
          const MIN_CHECK = check(xMin) ? ` && ${xMin} < ${VAR}` : check(min) ? ` && ${min} <= ${VAR}` : ''
          const MAX_CHECK = check(xMax) ? ` && ${VAR} < ${xMax}` : check(max) ? ` && ${VAR} <= ${max}` : ''
          const MULTIPLE_OF = check(multipleOf) ? ` && ${VAR} % ${multipleOf} === 0` : ''
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
      case tagged('bigint')(x):
        return function checkBigInt(path) {
          const min = getMinValue(x)
          const max = getMaxValue(x)
          const xMin = getGtValue(x)
          const xMax = getLtValue(x)
          const multipleOf = getMultipleOf(x)
          const VAR = joinPath(path, false)
          const CHECK = `typeof ${VAR} === 'bigint'`
          const MIN_CHECK = typeof xMin === 'bigint' ? ` && ${xMin}n < ${VAR}` : typeof min === 'bigint' ? ` && ${min}n <= ${VAR}` : ''
          const MAX_CHECK = typeof xMax === 'bigint' ? ` && ${VAR} < ${xMax}n` : typeof max === 'bigint' ? ` && ${VAR} <= ${max}n` : ''
          const MULTIPLE_OF = typeof multipleOf === 'bigint' ? ` && ${VAR} % ${multipleOf}n === 0n` : ''
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
      case tagged('string')(x):
        return function checkString(path) {
          const min = getMinLength(x)
          const max = getMaxLength(x)
          const VAR = joinPath(path, false)
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
      case tagged('array')(x):
        return function checkArray(path) {
          const min = getMinLength(input)
          const max = getMaxLength(input)
          const VAR = joinPath(path, false)
          const CHECK = `Array.isArray(${VAR})`
          const BODY = ` && ${VAR}.every((value) => (${x.item(['value'], false)}))`
          const MIN_CHECK = Number_isNatural(min) ? ` && ${min} <= ${VAR}.length` : ''
          const MAX_CHECK = Number_isNatural(max) ? ` && ${VAR}.length <= ${max}` : ''
          const BOUNDS = Number_isNatural(min) && Number_isNatural(max) && min === max ? ` && ${VAR}.length === ${min}` : `${MIN_CHECK}${MAX_CHECK}`
          return ''
            + CHECK
            + BOUNDS
            + BODY
        }
      case tagged('record')(x): {
        if (!tagged('record', input)) {
          return Invariant.IllegalState('check', 'expected input to be a record schema', input)
        } else {
          return function checkRecord(path) {
            const VAR = joinPath(path, false)
            const KEY = fold(input.key)(['key'], false)
            const KEY_CHECK = KEY.length === 0 ? '' : `${KEY} && `
            const OBJECT_CHECK = `!!${VAR} && typeof ${VAR} === "object"`
            const VALUE = x.value(['value'], false)
            return `${OBJECT_CHECK} && Object.entries(${VAR}).every(([key, value]) => ${KEY_CHECK}${VALUE})`
          }
        }
      }
      case tagged('set')(x):
        return function checkSet(path) {
          const VAR = joinPath(path, false)
          const VALUE = x.value(['value'], false)
          return `${VAR} instanceof Set && Array.from(${VAR}).every((value) => ${VALUE})`
        }
      case tagged('map')(x):
        return function checkMap(path) {
          const VAR = joinPath(path, false)
          const KEY = x.key(['key'], false)
          const VALUE = x.value(['value'], false)
          return `${VAR} instanceof Map && Array.from(${VAR}).every(([key, value]) => ${KEY} && ${VALUE})`
        }
      case tagged('looseObject')(x):
      case tagged('strictObject')(x):
      case tagged('object')(x):
        return function checkObject(path) {
          if (!tagged(x.type as 'object', input)) {
            return Invariant.IllegalState('check', `expected input to be a ${x.type} schema`, input)
          } else {
            const VAR = joinPath(path, false)
            const CHECK = `!!${VAR} && typeof ${VAR} === "object"`
            const EXACT_OPTIONAL_KEYS = Object_entries(input.entries).filter(([, v]) => tagged('exactOptional', v)).map(([k]) => k)
            const CHILDREN = Object_entries(x.entries).map(
              ([k, continuation]) =>
                EXACT_OPTIONAL_KEYS.includes(k)
                  ? `(!Object.hasOwn(${VAR}, ${JSON.stringify(parseKey(k))}) || ${continuation([...path, k], true)})`
                  : continuation([...path, k], true)
            )
            const BODY = CHILDREN.length === 0 ? '' : CHILDREN.map((v) => ' && ' + v).join('')
            return CHECK + BODY
          }
        }
      case tagged('objectWithRest')(x):
        return function checkObjectWithRest(path) {
          if (!tagged('objectWithRest', input)) {
            return Invariant.IllegalState('check', 'expected input to be an object with rest schema', input)
          } else {
            const VAR = joinPath(path, false)
            const CHECK = `!!${VAR} && typeof ${VAR} === "object"`
            const EXACT_OPTIONAL_KEYS = Object_entries(input.entries).filter(([, v]) => tagged('exactOptional', v)).map(([k]) => k)
            const KEYS = Object_keys(x.entries).map((k) => JSON.stringify(parseKey(k))).join(', ')
            const REST = KEYS.length === 0
              ? ` && Object.values(${VAR}).every((value) => ${x.rest(['value'], true)})`
              : ` && Object.entries(${VAR}).filter(([key]) => !([${KEYS}]).includes(key)).every(([, value]) => ${x.rest(['value'], true)})`
            const CHILDREN = Object_entries(x.entries).map(
              ([k, continuation]) =>
                EXACT_OPTIONAL_KEYS.includes(k)
                  ? `(!Object.hasOwn(${VAR}, ${JSON.stringify(parseKey(k))}) || ${continuation([...path, k], true)})`
                  : continuation([...path, k], true)
            )
            const BODY = CHILDREN.length === 0 ? '' : CHILDREN.map((v) => ' && ' + v).join('')
            return CHECK + BODY + REST
          }
        }
      case tagged('looseTuple')(x):
      case tagged('strictTuple')(x):
      case tagged('tuple')(x):
        return function checkTuple(path) {
          const VAR = joinPath(path, false)
          const ITEMS = x.items.map((continuation, i) => continuation([...path, i], false))
          const BODY = (ITEMS.length > 0 ? ' && ' : '') + ITEMS.join(' && ')
          return `Array.isArray(${VAR})${BODY}`
        }
      case tagged('tupleWithRest')(x):
        return function checkTupleWithRest(path) {
          const VAR = joinPath(path, false)
          const REST = ` && ${VAR}.slice(${x.items.length}).every((value) => ${x.rest(path, false)})`
          const ITEMS = x.items.map((continuation, i) => continuation([...path, i], false))
          const BODY = (ITEMS.length > 0 ? ' && ' : '') + ITEMS.join(' && ')
          return `Array.isArray(${VAR})${BODY}${REST}`
        }
      case tagged('intersect')(x):
        return function checkIntersect(path, isProperty) {
          return x.options.length === 0
            ? 'true'
            : `(${x.options.map((continuation) => `(${continuation(path, isProperty)})`).join(' && ')})`
        }
      case tagged('union')(x):
        return function checkUnion(path, isProperty) {
          return x.options.length === 0
            ? 'false'
            : `(${x.options.map((continuation) => `(${continuation(path, isProperty)})`).join(' || ')})`
        }
      case tagged('variant')(x): {
        if (!tagged('variant', input)) {
          return Invariant.IllegalState('check', 'expected input to be a variant schema', input)
        } else {
          return function checkVariant(path, isProperty) {
            if (x.options.length === 0) return 'false'
            else {
              const VAR = joinPath(path, isProperty)
              const OPTIONS = x.options.map((options, i) => {
                const tagSchema = input.options[i].entries[x.key]
                if (!tagged('literal', tagSchema)) {
                  return Invariant.IllegalState('check', 'expected discriminant to be a literal schema', tagSchema)
                } else {
                  const tag = tagSchema.literal
                  const BODY = Object_entries(options.entries).map(([k, continuation]) => continuation([...path, k], isProperty))
                  return `${VAR}${accessor(x.key, false)} === ${literalValueToString(tag)} ? (${BODY.join(' && ')})`
                }
              })
              return `!!${VAR} && typeof ${VAR} === "object" && (${OPTIONS.join(' : ')} : false)`
            }
          }
        }
      }
      case isUnsupported(x): return Invariant.Unimplemented(x.type, 'check.writeable')
    }
  })

export function buildFunctionBody(schema: F.LowerBound): string
export function buildFunctionBody(schema: v.BaseSchema<any, any, any>): string {
  let BODY = fold(schema as never)(['value'], false)
  if (BODY.startsWith('(') && BODY.endsWith(')')) BODY = BODY.slice(1, -1)
  return BODY
}

export declare namespace check {
  type Options = {
    /**
     * Configure the name of the generated check function
     * @default "check"
     */
    functionName?: string
    /**
     * Whether to remove TypeScript type annotations from the generated output
     * @default false
     */
    stripTypes?: boolean
  }
  /**
   * ## {@link unsupported `check.Unsupported`} 
   * 
   * These are the schema types that {@link check `zx.check`} does not
   * support, either because they haven't been implemented yet, or because
   * we haven't found a reasonable interpretation of them in this context.
   * 
   * If you'd like to see one of these supported or have an idea for how
   * it could be done, we'd love to hear from you!
   * 
   * Here's the link to [raise an issue](https://github.com/traversable/schema/issues).
   */
  type Unsupported = typeof unsupported
}

check.writeable = check_writeable
check.unsupported = unsupported

export function check<S extends v.BaseSchema<any, any, any>>(schema: S): (x: unknown) => x is v.InferOutput<S>
export function check(schema: v.BaseSchema<any, any, any>): Function {
  return globalThis.Function(
    'value',
    'return ' + buildFunctionBody(schema)
  )
}

function check_writeable(schema: v.BaseSchema<any, any, any>, options?: check.Options): string {
  const FUNCTION_NAME = options?.functionName ?? 'check'
  return `
function ${FUNCTION_NAME} (value) {
  return ${buildFunctionBody(schema)}
}
`.trim()
}
