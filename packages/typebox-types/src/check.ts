import * as T from '@sinclair/typebox'
import {
  escape,
  fn,
  Number_isFinite,
  Number_isNatural,
  Number_isSafeInteger,
  Object_keys,
  Object_entries,
  parseKey,
  Number_MIN_SAFE_INTEGER,
  Number_MAX_SAFE_INTEGER,
} from '@traversable/registry'

import * as F from './functor.js'

const compile = F.compile<string>((x, ix, input) => {
  const VAR = ix.varName ?? 'value'
  switch (true) {
    default: return fn.exhaustive(x)
    case F.tagged('never')(x): return 'false'
    case F.tagged('any')(x): return 'true'
    case F.tagged('unknown')(x): return 'true'
    case F.tagged('void')(x): return `${VAR} === void 0`
    case F.tagged('null')(x): return `${VAR} === null`
    case F.tagged('undefined')(x): return `${VAR} === undefined`
    case F.tagged('symbol')(x): return `typeof ${VAR} === "symbol"`
    case F.tagged('boolean')(x): return `typeof ${VAR} === "boolean"`
    case F.tagged('date')(x): return `${VAR} instanceof globalThis.Date`
    case F.tagged('literal')(x): return `${VAR} === ${typeof x.const === 'string' ? `"${escape(x.const)}"` : x.const}`
    case F.tagged('integer')(x): {
      const { minimum: min, maximum: max, multipleOf } = x
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
    case F.tagged('bigInt')(x): {
      const { minimum: min, maximum: max, multipleOf } = x
      const CHECK = `typeof ${VAR} === "bigint"`
      const MIN_CHECK = typeof min === 'bigint' ? ` && ${min}n <= ${VAR}` : ''
      const MAX_CHECK = typeof max === 'bigint' ? ` && ${VAR} <= ${max}n` : ''
      const MULTIPLE_OF = typeof multipleOf !== 'bigint' ? '' : ` && ${VAR} % ${multipleOf}n === 0n`
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
    case F.tagged('number')(x): {
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
    case F.tagged('string')(x): {
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
    case F.tagged('optional')(x): return ix.isProperty ? x.schema : `(${VAR} === undefined || ${x.schema})`
    case F.tagged('allOf')(x): return x.allOf.length === 0 ? 'true' : x.allOf.join(' && ')
    case F.tagged('anyOf')(x): return x.anyOf.length === 0 ? 'false' : `(${x.anyOf.map((v) => `(${v})`).join(' || ')})`
    case F.tagged('tuple')(x): return `Array.isArray(${VAR})${x.items.length > 0 ? ' && ' : ''}${x.items.join(' && ')}`
    case F.tagged('object')(x): {
      const { properties } = x
      const CHILD_COUNT = Object_keys(properties).length
      const CHECK = `!!${VAR} && typeof ${VAR} === "object"`
      const OPTIONAL_KEYS = Object_entries((input as T.TObject).properties).filter(([, v]) => F.isOptional(v)).map(([k]) => k)
      const CHILDREN = Object_entries(properties).map(([k, v]) => OPTIONAL_KEYS.includes(k)
        ? `(!Object.hasOwn(${VAR}, ${JSON.stringify(parseKey(k))}) || ${v})`
        : v
      )
      const BODY = CHILD_COUNT === 0 ? '' : CHILDREN.map((v) => ' && ' + v).join('')
      return CHECK + BODY
    }
    case F.tagged('array')(x): {
      const { minItems: min, maxItems: max } = x
      const MIN_CHECK = Number_isNatural(min) ? ` && ${min} <= ${VAR}.length` : ''
      const MAX_CHECK = Number_isNatural(max) ? ` && ${VAR}.length <= ${max}` : ''
      const BOUNDS = Number_isNatural(min) && Number_isNatural(max) && min === max ? ` && ${VAR}.length === ${min}` : `${MIN_CHECK}${MAX_CHECK}`
      const OUTER_CHECK = `Array.isArray(${VAR})${BOUNDS}`
      return `${OUTER_CHECK} && ${VAR}.every((value) => ${x.items})`
    }
    case F.tagged('record')(x): {
      const CHECK = `!!${VAR} && typeof ${VAR} === "object"`
      const patterns = Object_entries(x.patternProperties)
      return [
        `${CHECK} && Object.entries(${VAR}).every(([key, value]) => {`,
        ...patterns.map(
          ([pattern, predicate]) => `if (/${pattern.length === 0 ? '^$' : pattern}/.test(key)) return ${predicate}`
        ),
        `return true`,
        `})`
      ].filter((_) => _ !== null).join('\n')
    }
  }
})

export function buildFunctionBody(schema: T.TSchema): string {
  let BODY = compile(schema as never)
  if (BODY.startsWith('(') && BODY.endsWith(')')) BODY = BODY.slice(1, -1)
  return BODY
}

function check_writeable(schema: T.TSchema, options?: check.Options): string
function check_writeable(schema: T.TSchema, options?: check.Options): string
function check_writeable(schema: T.TSchema, options?: check.Options): string {
  const FUNCTION_NAME = options?.functionName ?? 'check'
  return `
function ${FUNCTION_NAME} (value) {
  return ${buildFunctionBody(schema)}
}
`.trim()
}

export function check<T extends T.TSchema>(schema: T): (x: unknown) => x is T.Static<T>
export function check(schema: T.TSchema): Function {
  return globalThis.Function(
    'value',
    'return ' + buildFunctionBody(schema)
  )
}

export declare namespace check {
  type Options = {
    functionName?: string
    stripTypes?: boolean
  }
}

check.writeable = check_writeable

