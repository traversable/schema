import { z } from 'zod'
import {
  escape,
  joinPath,
  Number_isFinite,
  Number_isNatural,
  Number_isSafeInteger,
  Object_keys,
  Object_values,
  Object_entries,
  parseKey,
  Number_MIN_SAFE_INTEGER,
  Number_MAX_SAFE_INTEGER,
  isQuoted,
} from '@traversable/registry'

import type { Z } from '@traversable/zod-types'
import { F, hasTypeName, tagged, isOptional, Invariant } from '@traversable/zod-types'

const unsupported = [
  'custom',
  'default',
  'prefault',
  'promise',
  'success',
  'transform',
] as const satisfies any[]

type UnsupportedSchemas = F.Z.Catalog[typeof unsupported[number]]

type Builder = (path: (string | number)[], isProperty: boolean) => string

function isUnsupported(x: unknown): x is UnsupportedSchemas {
  return hasTypeName(x) && unsupported.includes(x._zod.def.type as never)
}

function literalValueToString(x: z.core.util.Literal) {
  if (typeof x === 'string') {
    const escaped = escape(x)
    return isQuoted(escaped) ? escaped : `"${escaped}"`
  } else {
    return typeof x === 'bigint' ? `${x}n` : `${x}`
  }
}

function foldEnum<T>(x: Z.Enum<T>, VAR: string) {
  const { values } = x._zod
  const members = Array.from(values).map((v) => `${VAR} === ${literalValueToString(v)}`)
  const OPEN = values.size > 1 ? '(' : ''
  const CLOSE = values.size > 1 ? ')' : ''
  return OPEN + members.join(' || ') + CLOSE
}

const fold: F.Algebra<Builder> = F.fold((x, _, input) => {
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
    case tagged('nan')(x):
      return function checkNaN(path) { return `Number.isNaN(${joinPath(path, false)})` }
    case tagged('date')(x):
      return function checkDate(path) { return `${joinPath(path, false)} instanceof Date` }
    case tagged('file')(x):
      return function checkFile(path) { return `${joinPath(path, false)} instanceof File` }
    case tagged('lazy')(x):
      return function checkLazy(...args) { return x._zod.def.getter()(...args) }
    case tagged('pipe')(x):
      return function checkPipe(...args) { return x._zod.def.out(...args) }
    case tagged('readonly')(x):
      return function checkReadonly(...args) { return x._zod.def.innerType(...args) }
    case tagged('nullable')(x):
      return function checkNullable(path, isProperty) {
        return `(${joinPath(path, false)} === null || (${x._zod.def.innerType(path, isProperty)}))`
      }
    case tagged('optional')(x):
      return function checkOptional(path, isProperty) {
        return isProperty
          ? x._zod.def.innerType(path, false)
          : `(${joinPath(path, true)} === undefined || (${x._zod.def.innerType(path, isProperty)}))`
      }
    case tagged('nonoptional')(x):
      return function checkNonOptional(path, isProperty) {
        return `(${joinPath(path, false)} !== undefined && ${x._zod.def.innerType(path, isProperty)})`
      }
    case tagged('literal')(x):
      return function checkLiteral(path) {
        const VAR = joinPath(path, false)
        const values = x._zod.def.values.map((v) => `${VAR} === ${literalValueToString(v as never)}`)
        const OPEN = values.length > 1 ? '(' : ''
        const CLOSE = values.length > 1 ? ')' : ''
        return OPEN + values.join(' || ') + CLOSE
      }
    case tagged('template_literal')(x):
      return function checkTemplateLiteral(path) {
        const VAR = joinPath(path, false)
        return `typeof ${VAR} === 'string' && new globalThis.RegExp(${JSON.stringify(x._zod.pattern.source)}).test(${VAR})`
      }
    case tagged('enum')(x):
      return function checkEnum(path) {
        return foldEnum(x, joinPath(path, false))
      }
    case tagged('int')(x): {
      return function checkInt(path) {
        const { minimum: min, maximum: max, multipleOf } = x._zod.bag
        const VAR = joinPath(path, false)
        const CHECK = `Number.isSafeInteger(${VAR})`
        const MIN_CHECK = min === Number_MIN_SAFE_INTEGER ? '' : !Number_isSafeInteger(min) ? '' : ` && ${min} <= ${VAR}`
        const MAX_CHECK = max === Number_MAX_SAFE_INTEGER ? '' : !Number_isSafeInteger(max) ? '' : ` && ${VAR} <= ${max}`
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
    }
    case tagged('number')(x):
      return function checkNumber(path) {
        const { minimum: min, maximum: max, exclusiveMinimum: xMin, exclusiveMaximum: xMax, multipleOf } = x._zod.bag
        const VAR = joinPath(path, false)
        const CHECK = `Number.isFinite(${VAR})`
        const MIN_CHECK = Number_isFinite(xMin) ? ` && ${xMin} < ${VAR}` : Number_isFinite(min) ? ` && ${min} <= ${VAR}` : ''
        const MAX_CHECK = Number_isFinite(xMax) ? ` && ${VAR} < ${xMax}` : Number_isFinite(max) ? ` && ${VAR} <= ${max}` : ''
        const MULTIPLE_OF = Number_isFinite(multipleOf) ? ` && ${VAR} % ${multipleOf} === 0` : ''
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
        const { minimum: min, maximum: max, exclusiveMinimum: xMin, exclusiveMaximum: xMax, multipleOf } = x._zod.bag
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
        const { minLength: min, maxLength: max } = x
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
    case tagged('catch')(x):
    case tagged('default')(x):
      return function checkCatch() {
        return 'true'
      }
    case tagged('array')(x):
      return function checkArray(path) {
        const { minimum, maximum, length } = x._zod.bag
        const min = length ?? minimum
        const max = length ?? maximum
        const VAR = joinPath(path, false)
        const CHECK = `Array.isArray(${VAR})`
        const BODY = ` && ${VAR}.every((value) => (${x._zod.def.element(['value'], false)}))`
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
          const KEY = fold(input._zod.def.keyType)(['key'], false)
          const KEY_CHECK = KEY.length === 0 ? '' : `${KEY} && `
          const OBJECT_CHECK = `!!${VAR} && typeof ${VAR} === "object"`
          const VALUE = x._zod.def.valueType(['value'], false)
          return `${OBJECT_CHECK} && Object.entries(${VAR}).every(([key, value]) => ${KEY_CHECK}${VALUE})`
        }
      }
    }
    case tagged('set')(x):
      return function checkSet(path) {
        const VAR = joinPath(path, false)
        const VALUE = x._zod.def.valueType(['value'], false)
        return `${VAR} instanceof Set && Array.from(${VAR}).every((value) => ${VALUE})`
      }
    case tagged('map')(x):
      return function checkMap(path) {
        const VAR = joinPath(path, false)
        const KEY = x._zod.def.keyType(['key'], false)
        const VALUE = x._zod.def.valueType(['value'], false)
        return `${VAR} instanceof Map && Array.from(${VAR}).every(([key, value]) => ${KEY} && ${VALUE})`
      }
    case tagged('object')(x):
      return function checkObject(path) {
        if (!tagged('object', input)) {
          return Invariant.IllegalState('check', `expected input to be an object schema`, input)
        } else {
          const { shape, catchall } = x._zod.def
          const VAR = joinPath(path, false)
          const KEYS = Object_keys(shape).map((k) => JSON.stringify(parseKey(k))).join(', ')
          const CHILD_COUNT = Object_values(shape).length
          const CHECK = `!!${VAR} && typeof ${VAR} === "object"`
          const OPTIONAL_KEYS = Object_entries((input as z.ZodObject)._zod.def.shape)
            .filter(([, v]) => isOptional(v))
            .map(([k]) => k)
          const CATCHALL = catchall === undefined
            ? null
            : fold(input._zod.def.catchall!, _)(path, true)
          const REST = CATCHALL === null
            ? ''
            : KEYS.length === 0
              ? ` && Object.values(${VAR}).every((value) => ${CATCHALL})`
              : ` && Object.entries(${VAR}).filter(([key]) => !([${KEYS}]).includes(key)).every(([, value]) => ${CATCHALL})`
          const CHILDREN = Object_entries(x._zod.def.shape).map(([k, continuation]) => OPTIONAL_KEYS.includes(k)
            ? `(!Object.hasOwn(${VAR}, ${JSON.stringify(parseKey(k))}) || ${continuation([...path, k], true)})`
            : continuation([...path, k], true)
          )
          const BODY = CHILD_COUNT === 0 ? '' : CHILDREN.map((v) => ' && ' + v).join('')
          return CHECK + BODY + REST
        }
      }
    case tagged('tuple')(x):
      return function checkTuple(path) {
        const VAR = joinPath(path, false)
        const REST = !x._zod.def.rest
          ? ''
          : ` && ${VAR}.slice(${x._zod.def.items.length}).every((value) => ${x._zod.def.rest(path, false)})`
        const ITEMS = x._zod.def.items.map((continuation, i) => continuation([...path, i], false))
        const BODY = (ITEMS.length > 0 ? ' && ' : '') + ITEMS.join(' && ')
        return `Array.isArray(${VAR})${BODY}${REST}`
      }
    case tagged('intersection')(x):
      return function checkIntersect(...args) {
        return `${x._zod.def.left(...args)} && ${x._zod.def.right(...args)}`
      }
    case tagged('union')(x):
      if (!tagged('union', input)) {
        return Invariant.IllegalState('check', 'expected input to be a union schema', input)
      } else {
        return function checkUnion(path, isProperty) {
          // TODO: optimize discriminator case
          // x._zod.def.discriminator
          return x._zod.def.options.length === 0
            ? 'false'
            : `(${x._zod.def.options.map((continuation) => `(${continuation(path, isProperty)})`).join(' || ')})`
        }
      }
    case isUnsupported(x): return Invariant.Unimplemented(x._zod.def.type, 'check.writeable')
  }
})

export function buildFunctionBody(type: z.core.$ZodType): string {
  let BODY = fold(type)(['value'], false)
  if (BODY.startsWith('(') && BODY.endsWith(')')) BODY = BODY.slice(1, -1)
  return BODY
}

function check_writeable(schema: z.ZodType, options?: check.Options): string
function check_writeable(schema: z.core.$ZodType, options?: check.Options): string
function check_writeable(schema: z.ZodType | z.core.$ZodType, options?: check.Options): string {
  const FUNCTION_NAME = options?.functionName ?? 'check'
  return `
function ${FUNCTION_NAME} (value) {
  return ${buildFunctionBody(schema)}
}
`.trim()
}

export function check<T extends z.ZodType>(type: T): (x: unknown) => x is z.infer<T>
export function check<T extends z.core.$ZodType>(type: T): (x: unknown) => x is z.infer<T>
export function check(type: z.ZodType): Function {
  return globalThis.Function(
    'value',
    'return ' + buildFunctionBody(type)
  )
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
