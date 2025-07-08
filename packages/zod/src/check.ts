import { z } from 'zod/v4'
import {
  escape,
  fn,
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

import type { CompilerAlgebra as Algebra, Z } from './functor.js'
import * as F from './functor.js'
import { tagged } from './typename.js'
import { Invariant, isOptional } from './utils.js'

const literalValueToString = (x: z.core.util.Literal) => {
  if (typeof x === 'string') {
    const escaped = escape(x)
    return isQuoted(escaped) ? escaped : `"${escaped}"`
  } else {
    return typeof x === 'bigint' ? `${x}n` : `${x}`
  }
  // typeof x === 'string' ? JSON.stringify(escape(x)) : typeof x === 'bigint' ? `${x}n` : `${x}`
}

const compileEnum = (x: Z.Enum<string>, VAR: string) => {
  const { values } = x._zod
  const members = Array.from(values).map((v) => `${VAR} === ${literalValueToString(v)}`)
  const OPEN = values.size > 1 ? '(' : ''
  const CLOSE = values.size > 1 ? ')' : ''
  return OPEN + members.join(' || ') + CLOSE
}

const interpreter: Algebra<string> = (x, ix, input) => {
  const VAR = ix.varName
  switch (true) {
    default: return fn.exhaustive(x)
    case tagged('never')(x): return 'false'
    case tagged('any')(x): return 'true'
    case tagged('unknown')(x): return 'true'
    case tagged('void')(x): return `${VAR} === void 0`
    case tagged('null')(x): return `${VAR} === null`
    case tagged('undefined')(x): return `${VAR} === undefined`
    case tagged('symbol')(x): return `typeof ${VAR} === "symbol"`
    case tagged('boolean')(x): return `typeof ${VAR} === "boolean"`
    case tagged('nan')(x): return `Number.isNaN(${VAR})`
    case tagged('date')(x): return `${VAR} instanceof globalThis.Date`
    case tagged('file')(x): return `${VAR} instanceof globalThis.File`
    case tagged('literal')(x): {
      const values = x._zod.def.values.map((v) => `${VAR} === ${literalValueToString(v as never)}`)
      const OPEN = values.length > 1 ? '(' : ''
      const CLOSE = values.length > 1 ? ')' : ''
      return OPEN + values.join(' || ') + CLOSE
    }
    case tagged('template_literal')(x): return `typeof ${VAR} === 'string' && new globalThis.RegExp(${JSON.stringify(x._zod.pattern.source)}).test(${VAR})`
    case tagged('int')(x): {
      const { minimum: min, maximum: max, multipleOf } = x._zod.bag
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
    case tagged('bigint')(x): {
      const { minimum: min, maximum: max, multipleOf } = x._zod.bag
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
    case tagged('number')(x): {
      const { minimum: min, maximum: max, exclusiveMinimum: xMin, exclusiveMaximum: xMax, multipleOf } = x._zod.bag
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
    case tagged('string')(x): {
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
    case tagged('enum')(x): return compileEnum(x, VAR)
    case tagged('optional')(x): return ix.isProperty ? x._zod.def.innerType : `(${VAR} === undefined || ${x._zod.def.innerType})`
    case tagged('nonoptional')(x): return `(${VAR} !== undefined && ${x._zod.def.innerType})`
    case tagged('nullable')(x): return `(${VAR} === null || ${x._zod.def.innerType})`
    case tagged('readonly')(x): return x._zod.def.innerType
    case tagged('lazy')(x): return x._zod.def.getter()
    case tagged('catch')(x): return `true`
    case tagged('default')(x): return `true`
    case tagged('array')(x): {
      const { minimum, maximum, length } = x._zod.bag
      const min = length ?? minimum
      const max = length ?? maximum
      const MIN_CHECK = Number_isNatural(min) ? ` && ${min} <= ${VAR}.length` : ''
      const MAX_CHECK = Number_isNatural(max) ? ` && ${VAR}.length <= ${max}` : ''
      const BOUNDS = Number_isNatural(min) && Number_isNatural(max) && min === max ? ` && ${VAR}.length === ${min}` : `${MIN_CHECK}${MAX_CHECK}`
      const OUTER_CHECK = `Array.isArray(${VAR})${BOUNDS}`
      return `${OUTER_CHECK} && ${VAR}.every((value) => ${x._zod.def.element})`
    }

    case tagged('set')(x): return `${VAR} instanceof globalThis.Set && globalThis.Array.from(${VAR}).every((value) => ${x._zod.def.valueType})`

    case tagged('map')(x): {
      const { keyType, valueType } = x._zod.def
      return `${VAR} instanceof globalThis.Map && globalThis.Array.from(${VAR}).every(([key, value]) => ${keyType} && ${valueType})`
    }

    case tagged('record')(x): {
      const KEY_CHECK = interpret(input._zod.def.keyType, { ...ix, varName: 'key' })
      return `!!${VAR} && typeof ${VAR} === "object" && Object.entries(${VAR}).every(([key, value]) => ${KEY_CHECK.length === 0 ? '' : `${KEY_CHECK} && `}${x._zod.def.valueType})`
    }

    case tagged('intersection')(x): return `${x._zod.def.left} && ${x._zod.def.right}`
    case tagged('union')(x): return x._zod.def.options.length === 0 ? 'false' : `(${x._zod.def.options.map((v) => `(${v})`).join(' || ')})`

    case tagged('tuple')(x): {
      const { items, rest } = x._zod.def
      const REST = rest == null ? '' : ` && ${VAR}.slice(${items.length}).every((value) => ${rest})`
      const BODY = `${items.length > 0 ? ' && ' : ''}${items.join(' && ')}`
      return `Array.isArray(${VAR})${BODY}${REST}`
    }

    case tagged('object')(x): {
      const { shape, catchall } = x._zod.def
      const KEYS = Object_keys(shape).map((k) => JSON.stringify(parseKey(k))).join(', ')
      const CHILD_COUNT = Object_values(shape).length
      const CHECK = `!!${VAR} && typeof ${VAR} === "object"`
      const OPTIONAL_KEYS = Object_entries((input as z.ZodObject)._zod.def.shape)
        .filter(([, v]) => isOptional(v))
        .map(([k]) => k)
      const CATCHALL = catchall === undefined
        ? null
        : interpret(input._zod.def.catchall, { ...ix, varName: 'value' })
      const REST = CATCHALL === null
        ? ''
        : KEYS.length === 0
          ? ` && Object.values(${VAR}).every((value) => ${CATCHALL})`
          : ` && Object.entries(${VAR}).filter(([key]) => !([${KEYS}]).includes(key)).every(([, value]) => ${CATCHALL})`
      const CHILDREN = Object_entries(x._zod.def.shape).map(([k, v]) => OPTIONAL_KEYS.includes(k)
        ? `(!Object.hasOwn(${VAR}, ${JSON.stringify(parseKey(k))}) || ${v})`
        : v
      )
      const BODY = CHILD_COUNT === 0 ? '' : CHILDREN.map((v) => ' && ' + v).join('')
      return CHECK + BODY + REST
    }

    /** TODO: figure out how to get the prefault value */
    case tagged('prefault')(x): return Invariant.Unimplemented('prefault', 'check.writeable')
    /** TODO: figure out how to make `z.transform` work */
    case tagged('transform')(x): return Invariant.Unimplemented('transform', 'check.writeable')
    /** TODO: figure out how to make `z.pipe` work */
    case tagged('pipe')(x): return Invariant.Unimplemented('pipe', 'check.writeable')
    /** TODO: figure out how to make `z.success` work */
    case tagged('success')(x): return Invariant.Unimplemented('success', 'check.writeable')
    /** TODO: figure out how to make `z.custom` work */
    case tagged('custom')(x): return Invariant.Unimplemented('custom', 'check.writeable')
    /** @deprecated */
    case tagged('promise')(x): return Invariant.Unimplemented('promise', 'check.writeable')
  }
}

const interpret = F.compile(interpreter)

export function buildFunctionBody(type: z.ZodType): string {
  let BODY = F.compile(interpreter)(type)
  if (BODY.startsWith('(') && BODY.endsWith(')')) BODY = BODY.slice(1, -1)
  return BODY
}

const generate = (schema: z.ZodType): string => `

function check(value) {
  return ${buildFunctionBody(schema)}
}

`.trim()

export const generateParser = (type: z.ZodType): string => `

function check(value) {
  return ${buildFunctionBody(type)}
}
if (check(value)) return value
else throw Error("invalid input")

`.trim()


export function check<T extends z.ZodType>(type: T): (x: unknown) => x is z.infer<T>
export function check(type: z.ZodType): Function {
  return globalThis.Function(
    'value',
    'return ' + buildFunctionBody(type)
  )
}

check.writeable = generate

export function compileParser<T extends z.ZodType>(type: T): (x: unknown) => x is z.infer<T>
export function compileParser(type: z.ZodType): Function {
  return globalThis.Function(
    'value',
    'return' + `

function check(value) {
  return ${buildFunctionBody(type)}
}
if (check(value)) return value
else throw Error("invalid input")

`
      .trim()
  )
}

// // Tuple indices:
// const firstOptionalIx = input._zod.def.items.findLastIndex(isOptional)
// const VALID_LENGTHS = rest != null ? []
//   : firstOptionalIx === -1 ? [items.length]
//     : Array.from({ length: items.length - firstOptionalIx + 1 }, (_, i) => i + firstOptionalIx)
// const CHECK_LENGTH_OPEN = VALID_LENGTHS.length > 1 ? '(' : ''
// const CHECK_LENGTH_CLOSE = VALID_LENGTHS.length > 1 ? ')' : ''
// const CHECK_LENGTH = VALID_LENGTHS.length === 0 ? ''
//   : ` && ${CHECK_LENGTH_OPEN}${VALID_LENGTHS.map((l) => `${VAR}.length === ${l}`).join(' || ')}${CHECK_LENGTH_CLOSE}`
// return `Array.isArray(${VAR})${CHECK_LENGTH}${BODY}${REST}`
