import { fn, URI } from '@traversable/registry'
import type { t } from '@traversable/schema'

import type { Algebra, Config, Index } from './functor.js'
import {
  defaultConfig,
  defaultErrorHandlers,
  defaultInitialIndex,
  defaultInputVarNameInterpreter,
  defaultResultVarNameInterpreter,
  Explode,
  fold,
  defaultKeyAccessor,
} from './functor.js'

export let errorHandlers = {
  ...defaultErrorHandlers,
  boolean: () => 'expected boolean',
  string: () => 'expected string',
  object: () => 'expected object',
} as const

export let deriveResultVarName = {
  ...defaultResultVarNameInterpreter,
  array: ($) => `__D${$.instancePath.length}AItemAResult`,
  intersect: () => '',
} satisfies Config['deriveResultVarName']

export let deriveInputVarName = {
  ...defaultInputVarNameInterpreter,
  array: ($) => `__D${$.instancePath.length}AItem`,
  intersect: () => '',
} satisfies Config['deriveInputVarName']

export let defaultOptions = {
  shouldCoerce: defaultConfig.shouldCoerce,
  deriveInputVarName,
  deriveResultVarName,
  errorHandlers,
} satisfies Config

export namespace algebra {
  export const compile: Algebra<string, compile.Options> = (x, ix) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.never: return Explode('never', x)
      case x.tag === URI.unknown: return Explode('unknown', x)
      case x.tag === URI.void: return Explode('void', x)
      case x.tag === URI.undefined: return Explode('undefined', x)
      case x.tag === URI.symbol: return Explode('symbol', x)
      case x.tag === URI.bigint: return Explode('bigint', x)
      case x.tag === URI.eq: return Explode('eq', x)
      case x.tag === URI.tuple: return Explode('tuple', x)
      case x.tag === URI.intersect: return Explode('intersect', x)
      case x.tag === URI.null: return ''
      case x.tag === URI.boolean: return [
        `if (typeof ${ix.inputVarName} === 'boolean') {`,
        `  ${ix.resultVarName} = ${ix.inputVarName}`,
        `} else {`,
        `  $fallback("${ix.instancePath}", "${ix.schemaPath}", "${ix.errorHandlers.boolean(ix)}")`,
        `}`,
      ].filter((_) => _ !== null).join('\n')
      case x.tag === URI.integer: return ''
      case x.tag === URI.number: return ''
      case x.tag === URI.string: return ''
      case x.tag === URI.record: return ''
      case x.tag === URI.array: return ''
      case x.tag === URI.object: {
        let opt = ix.optionalKeys || []
        return [
          ix.isRoot ? null : null,
          ix.isRoot ? null : null,
          `if (typeof ${ix.inputVarName}) === 'object' && ${ix.inputVarName} !== null) {`,
          ...Object.entries(x.def).map(([k, v]) => {
            let keyPath = `${ix.resultVarName}${defaultKeyAccessor(k, ix)}`
            return [
              `  const ${keyPath} = {}`,
              opt.includes(k) ? `  if (${keyPath} === void 0) { /* optional, nothing to do */ } else {` : null,
              v,
              opt.includes(k) ? `  }` : null,
            ].join('\n')
          }),
          `  ${ix.resultVarName} = _D${ix.instancePath.length}`,
          `} else {`,
          `  $fallback("${ix.instancePath}", "${ix.schemaPath}", "${ix.errorHandlers.object(ix)}")`,
          `}`
        ].filter((_) => _ !== null).join('\n')
      }
      case x.tag === URI.any: {
        return [
          'ANY'
        ].filter((_) => _ !== null).join('\n')
      }
      case x.tag === URI.optional: {
        return [
          'OPTIONAL'
        ].filter((_) => _ !== null).join('\n')
      }
      case x.tag === URI.union: {
        return [
          'UNION'
        ].filter((_) => _ !== null).join('\n')
      }
    }
  }
}

export declare namespace compile {
  interface Options extends Config { }
}

compile.defaultOptions = {
  ...defaultOptions,
} satisfies compile.Options

export function compile(schema: t.Schema, options?: compile.Options, initialIndex?: Index): string
export function compile(
  schema: t.Schema,
  options: compile.Options = compile.defaultOptions,
  initialIndex: Index = defaultInitialIndex,
): string {
  return fold(options, algebra.compile)(
    schema as never, {
    ...options,
    ...initialIndex
  })
}

/**
 * @example
 * function check(value) {
 *   return (
 *     (typeof value === 'object' && value !== null && !Array.isArray(value)) &&
 *     (((value.UUID === null)) || (true)) &&
 *     Array.isArray(value.PET_NAMES) &&
 *     value.PET_NAMES.every((value) => ((typeof value === 'string'))) &&
 *     (value.BLAH !== undefined ? ((typeof value.BLAH === 'object' && value.BLAH !== null && !Array.isArray(value.BLAH)) && (typeof value.BLAH.CHILD === 'boolean')) : true)
 *   )
 * }
 */
