import { fn, symbol as Sym, URI } from '@traversable/registry'
import type { t } from '@traversable/schema'

import type { Algebra, Config, Index } from './functor.js'
import {
  defaultConfig,
  defaultErrorHandlers,
  defaultInitialIndex,
  defaultInputVarNameInterpreter,
  Explode,
  fold,
  defaultKeyAccessor,
  pathToAccessor,
  isValidIdentifier,
  isNaturalNumber,
  defaultIndexAccessor,
  defaultSchemaPathInterpreter,
  defaultDeriveBinding,
} from './functor.js'

export let CompilerFragment = {
  root: [
    `function $fallback(instancePath, schemaPath, message) {`,
    `  context.errors.push({`,
    `    message: message,`,
    `    instancePath: instancePath,`,
    `    schemaPath: schemaPath,`,
    `  })`,
    `}`,
  ].join('\n'),
  object: `let result = {}`,
}

export let SerializerFragment = {
  root: [
    `let json = ''`,
    `const STR_ESCAPE = /[\\u0000-\\u001f\\u0022\\u005c\\ud800-\\udfff]|[\\ud800-\\udbff](?![\\udc00-\\udfff])|(?:[^\\ud800-\\udbff]|^)[\\udc00-\\udfff]/`,
  ].join('\n'),
  object: [
    `json += ''`,
  ].join('\n'),
}

export let errorHandlers = {
  ...defaultErrorHandlers,
  boolean: () => 'expected boolean',
  string: () => 'expected string',
  object: () => 'expected object',
} as const

export let deriveResultVarName = {
  optional: ($) => `__D${$.instancePath.length + 1}_Optional`,
  union: ($) => `__D${$.instancePath.length + 1}_Union`,
  intersect: ($) => `__D${$.instancePath.length + 1}_Intersect`,
  record: ($, k) => `__D${$.instancePath.length + 1}_Record${isValidIdentifier(k) ? `_${k}` : ''}`,
  array: ($, k) => `__D${$.instancePath.length + 1}_Array${isNaturalNumber(k) ? `_${k}` : ''}`,
  tuple: ($, k) => `__D${$.instancePath.length + 1}_Tuple${isNaturalNumber(k) ? `_${k}` : ''}`,
  // object: ($, k) => `__D${$.instancePath.length + 1}_Object${isValidIdentifier(k) ? `_${k}` : ''}`,
  // array: ($) => `__D${$.instancePath.length + 1}AItemAResult`,
  object: ($, k) => `__D${$.instancePath.length + 1}${defaultKeyAccessor(k, $)}`,
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
  deriveSchemaPath: defaultSchemaPathInterpreter,
  deriveBinding: defaultDeriveBinding,
  errorHandlers,
} satisfies Config

export let defaultIndex = {
  ...defaultInitialIndex,
  resultVarName: '__D1'
} satisfies Index

let ind = (ix: Index) => ' '.repeat(ix.indent)
let tab = (ix: Index) => ' '.repeat(ix.indent + 2)

let pathToDepthIdentifier = (ix: Index) => {
  let { schemaPath: path, instancePath } = ix
  let depth = instancePath.length
  let out = `__D${depth}`
  for (let segment of path) {
    switch (true) {
      case segment === Sym.array: out += '_A'; break
      case segment === Sym.record: out += '_R'; break
      // case typeof segment === 'string': out += segment; break
      // case typeof segment === 'number': out += segment; break
    }
  }
  return out
}

export namespace algebra {
  let hasBeenSatisfied = 'hasBeenSatisfied'

  export const compile: Algebra<string, compile.Options> = (x, ix) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.never: return Explode('never', x)
      case x.tag === URI.unknown: return Explode('unknown', x)
      case x.tag === URI.any: return `${ix.resultVarName} = ${ix.inputVarName}`
      case x.tag === URI.void: return Explode('void', x)
      case x.tag === URI.undefined: return Explode('undefined', x)
      case x.tag === URI.symbol: return Explode('symbol', x)
      case x.tag === URI.bigint: return Explode('bigint', x)
      case x.tag === URI.record: return ''
      case x.tag === URI.optional: return x.def
      case x.tag === URI.eq: return Explode('eq', x)
      case x.tag === URI.tuple: return Explode('tuple', x)
      case x.tag === URI.intersect: return Explode('intersect', x)
      case x.tag === URI.integer: return [
        `if (Number.isInteger(${ix.inputVarName})) {`,
        ix.isDirectChildOfUnion ? `${hasBeenSatisfied} = true;` : null,
        `  ${ix.resultVarName} = ${ix.inputVarName}`,
        `} else {`,
        `  $fallback(`,
        `    "#/${ix.instancePath.join('/')}",`,
        `    "#/${ix.schemaPath.map(String).join('/')}/type",`,
        `    "${ix.errorHandlers.boolean(ix)}"`,
        `  )`,
        `}`,
      ].filter((_) => _ !== null).join('\n')
      case x.tag === URI.number: return [
        `if (typeof ${ix.inputVarName} === 'number') {`,
        ix.isDirectChildOfUnion ? `${hasBeenSatisfied} = true;` : null,
        `  ${ix.resultVarName} = ${ix.inputVarName}`,
        `} else {`,
        `  $fallback(`,
        `    "#/${ix.instancePath.join('/')}",`,
        `    "#/${ix.schemaPath.map(String).join('/')}/type",`,
        `    "${ix.errorHandlers.boolean(ix)}"`,
        `  )`,
        `}`,
      ].filter((_) => _ !== null).join('\n')

      case x.tag === URI.null: {
        let inputVarName = 'input' + ix.instancePath.map((_) => defaultKeyAccessor(_, ix)).join('')
        return [
          `if (typeof ${inputVarName} === null) {`,
          ix.isDirectChildOfUnion ? `${hasBeenSatisfied} = true;` : null,
          `  ${ix.resultVarName} = ${inputVarName}`,
          `} else {`,
          `  $fallback(`,
          `    "#/${ix.instancePath.join('/')}",`,
          `    "#/${ix.schemaPath.map(String).join('/')}",`,
          `    "${ix.errorHandlers.null(ix)}"`,
          `  )`,
          `}`,
        ].filter((_) => _ !== null).map((_) => tab(ix) + _).join('\n')

      }
      case x.tag === URI.boolean: return [
        `if (typeof ${ix.inputVarName} === 'boolean') {`,
        ix.isDirectChildOfUnion ? `${hasBeenSatisfied} = true;` : null,
        `  ${ix.resultVarName} = ${ix.inputVarName}`,
        `} else {`,
        `  $fallback(`,
        `    "#/${ix.instancePath.join('/')}",`,
        `    "#/${ix.schemaPath.map(String).join('/')}/type",`,
        `    "${ix.errorHandlers.boolean(ix)}"`,
        `  )`,
        `}`,
      ].filter((_) => _ !== null).join('\n')

      case x.tag === URI.string: {
        let depthIdentifier = pathToDepthIdentifier(ix)
        let resultIdentifier = depthIdentifier + '_result'
        return [
          `if (typeof ${depthIdentifier} === 'string') {`,
          ix.isDirectChildOfUnion ? `${hasBeenSatisfied} = true;` : null,
          `  ${resultIdentifier} = ${depthIdentifier}`,
          `} else {`,
          `  $fallback(`,
          `    "#/${ix.instancePath.join('/')}",`,
          `    "#/${ix.schemaPath.map(String).join('/') + '/type'}",`,
          `    "${ix.errorHandlers.string(ix)}")`,
          `}`,
        ].filter((_) => _ !== null).map((_) => ind(ix) + _).join('\r')
      }

      case x.tag === URI.array: {
        let varName = pathToAccessor(ix, 'input')
        return [
          ind(ix) + `if (Array.isArray(${varName})) {`,
          ind(ix) + `  let __D${ix.instancePath.length + 1} = []`,
          ind(ix) + `  for (let __D${ix.instancePath.length + 1}_A of ${varName}) {`,
          ind(ix) + `    let __D${ix.instancePath.length + 1}_A_result`,
          ind(ix) + x.def,
          ind(ix) + `  __D${ix.instancePath.length + 1}.push(__D${pathToDepthIdentifier(ix)}_result)`,
          ind(ix) + `}`,
          `}`,
        ].filter((_) => _ !== null).join('\r\n')
      }

      case x.tag === URI.object: {
        const optionalKeys = Array.of<string>().concat(x.opt)
        let inputVarName = 'input' + ix.instancePath.map((_) => defaultKeyAccessor(_, ix)).join('')

        return [
          ix.isRoot ? CompilerFragment.root : null,
          ix.isRoot ? CompilerFragment.object : null,
          `if (typeof ${inputVarName} === 'object' && ${inputVarName} !== null) {`,
          `  let ${ix.resultVarName} = {}`,
          ...Object.entries(x.def).map(([k, v]) => {
            let keyPath = ix.resultVarName + defaultKeyAccessor(k, ix)
            return [
              optionalKeys.includes(k) ? `  if (${ix.inputVarName}.${k} === void 0) { /* optional, nothing to do */ } else {` : null,
              v,
              optionalKeys.includes(k) ? `  }` : null,
            ].filter((_) => _ !== null).join('\n')
          }),
          `  result = __D${ix.instancePath.length + 1}`,
          `} else {`,
          `  $fallback(`,
          `    "#/${ix.instancePath.join('/')}",`,
          `    "#/${ix.schemaPath.map(String).join('/')}",`,
          `    "${ix.errorHandlers.object(ix)}"`,
          `  )`,
          `}`
        ].filter((_) => _ !== null).join('\n')
      }
      case x.tag === URI.union: {
        return [
          `let hasBeenSatisfied = false`,
          `let __D${ix.instancePath.length + 1}_Errors`,
          ...x.def,
        ].filter((_) => _ !== null).join('\n')
        ''
        // [
        //   `${ind(ix)}let ${hasBeenSatisfied} = false`,
        //   ...x.def,
        // ].filter((_) => _ !== null).join('\n')

        // for (let j of x.def) {


        // }

        // return Explode('union', x)
      }
    }
  }

  export const serialize
    : Algebra<string, serialize.Options>
    = (x, ix) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case x.tag === URI.never: return Explode('never', x)
        case x.tag === URI.unknown: return Explode('unknown', x)
        case x.tag === URI.any: return Explode('any', x)
        case x.tag === URI.void: return Explode('void', x)
        case x.tag === URI.undefined: return Explode('undefined', x)
        case x.tag === URI.symbol: return Explode('symbol', x)
        case x.tag === URI.bigint: return Explode('bigint', x)
        case x.tag === URI.union: return Explode('union', x)
        case x.tag === URI.optional: return Explode('optional', x)
        case x.tag === URI.eq: return Explode('eq', x)
        case x.tag === URI.tuple: return Explode('tuple', x)
        case x.tag === URI.intersect: return Explode('intersect', x)
        case x.tag === URI.null: {
          let outputPrefix = ix.instancePath.slice(ix.instancePath.lastIndexOf('/'))
          if (ix.isRoot) {
            return '"null"'
          } else return [
            `if (${ix.inputVarName} === null) {`,
            `  json += '"${outputPrefix}":null'`,
            `} else {`,
            `  if (${ix.inputVarName} !== void 0) {`,
            `    join += '"${outputPrefix}":' + JSON.stringify(${ix.inputVarName})`,
            `  }`,
            `}`,
          ].filter((_) => _ !== null).join('\n')
        }
        case x.tag === URI.boolean: {
          if (ix.isRoot) {
            return `return \`\${${ix.inputVarName}}\``
          } else {
            let template = `${ix.resultVarName} += \`${ix?.outputPrefix ?? ''}\${${ix.inputVarName}}\``
            if (ix.isNullable) {
              return [
                `if (typeof ${ix.inputVarName} === 'boolean') {`,
                `  ${template}`,
                `} else {`,
                `  ${ix.resultVarName} += '${ix?.outputPrefix ?? ''}null'`,
                `}`
              ].filter((_) => _ !== null).join('\n')
            }
            else return template
          }
        }
        case x.tag === URI.integer: return ''
        case x.tag === URI.number: return ''
        case x.tag === URI.string: return ''
        case x.tag === URI.record: return ''
        case x.tag === URI.array: return ''
        case x.tag === URI.object: {
          return [
            `json += '{'`,
            ...Object.values(x.def),
            `json += '}'`,
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
  initialIndex: Index = defaultIndex,
): string {
  return fold(options, algebra.compile)(
    schema as never, {
    ...options,
    ...initialIndex,
  })
}

export declare namespace serialize {
  interface Options extends Config {
    outputPrefix?: string
    needsSanitization?: string[]
  }
}

serialize.defaultOptions = {
  ...defaultOptions,
} satisfies serialize.Options

export function serialize(schema: t.Schema, options?: serialize.Options, initialIndex?: Index): string
export function serialize(schema: t.LowerBound, options?: serialize.Options, initialIndex?: Index): string
export function serialize(
  schema: unknown,
  options: serialize.Options = serialize.defaultOptions,
  initialIndex: Index = defaultIndex,
) {
  return fold(options, algebra.serialize)(
    schema as never, {
    ...options,
    ...initialIndex,
  })
}

/**
 * // object serializer for schema:
 * 
 * @example
 * const User = a.object({
 *   id: a.nullable(a.any()),
 *   name: a.string(),
 *   BLAH: a.optional(a.object({
 *     CHILD: a.boolean(),
 *   }))
 * })
 * 
 * let json = ''
 *      
 * const STR_ESCAPE = /[\\u0000-\\u001f\\u0022\\u005c\\ud800-\\udfff]|[\\ud800-\\udbff](?![\\udc00-\\udfff])|(?:[^\\ud800-\\udbff]|^)[\\udc00-\\udfff]/
 *      
 * json += ''
 * json += '{'
 * 
 * if (input.id === null)
 *   json += '"id":null'
 * 
 * else 
 *   if (typeof input.id !== 'undefined') 
 *     json += '"id":' + JSON.stringify(input.id)
 *
 * json += ',"name":'
 * 
 * if (input.name.length < 42) {
 *   let __result__ = ""
 *   let __last__ = -1
 *   let __point__ = 255
 *   let __finished__ = false
 *   for (let i = 0; i < input.name.length; i++) {
 *     __point__ = input.name.charCodeAt(i)
 *     if (__point__ < 32 || (__point__ >= 0xd800 && __point__ <= 0xdfff)) {
 *       json += JSON.stringify(input.name)
 *         __finished__ = true
 *         break
 *     }
 *     if (__point__ === 0x22 || __point__ === 0x5c) {
 *       __last__ === -1 && (__last__ = 0)
 *       __result__ += input.name.slice(__last__, i) + '\\\\'
 *       __last__ = i
 *     }
 *   }
 *   if(!__finished__) {
 *     if (__last__ === -1) {
 *       json += '"\${input.name}"'
 *     } else {
 *       json += '"\${__result__}\${input.name.slice(__last__)}"'
 *     }
 *   }
 * } else if (input.name.length < 5000 && !STR_ESCAPE.test(input.name)) {
 *   json += '"\${input.name}"'
 * } else {
 *   json += JSON.stringify(input.name)
 * }
 * 
 * if (input.BLAH !== void 0) {
 *   json += ',"BLAH":'
 *   json += '{'
 *   json += '"CHILD":\${input.BLAH.CHILD}'
 *   json += '}'
 * }
 * json += '}'
 * 
 * return json
 */
