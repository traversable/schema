import * as T from '@traversable/registry'
import { fn, URI } from '@traversable/registry'
import { t } from '@traversable/schema'
import { Json } from '@traversable/json'

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

let getAccessor = (k: string | number | null) => (index: Index) =>
  index.instancePath.reduce<string>((acc, x) => acc + defaultKeyAccessor(x, index), index.inputVarName)

export let defaultOptions = {
  shouldCoerce: defaultConfig.shouldCoerce,
  deriveInputVarName,
  deriveResultVarName,
  errorHandlers,
  deriveBinding: {
    never: () => 'never',
    any: () => 'any',
    unknown: () => 'unknown',
    void: () => 'void',
    null: () => 'null',
    undefined: () => 'undefined',
    boolean: () => 'bool',
    symbol: () => 'symbol',
    integer: () => 'integer',
    bigint: () => 'bigint',
    number: () => 'number',
    string: () => 'string',
    //
    eq: () => 'eq',
    //
    optional: () => getAccessor(null),
    array: () => () => 'value',
    record: () => () => 'value',
    intersect: getAccessor,
    union: getAccessor,
    tuple: getAccessor,
    object: getAccessor,
  },
  deriveSchemaPath: {
    any: () => ['any'],
    array: (i) => () => ['value'],
    bigint: () => ['bigint'],
    boolean: () => ['bool'],
    eq: () => ['eq'],
    integer: () => ['integer'],
    intersect: () => () => ['intersect'],
    union: () => () => ['union'],
    never: () => ['never'],
    null: () => ['null'],
    number: () => ['number'],
    object: () => () => ['object'],
    optional: () => () => ['optional'],
    record: () => () => ['record'],
    string: () => ['string'],
    symbol: () => ['symbol'],
    tuple: () => () => ['tuple'],
    undefined: () => ['undefined'],
    unknown: () => ['unknown'],
    void: () => ['void'],
  }
} satisfies Config

export namespace algebra {
  export const validateJson = Json.foldWithIndex<string>((x, ix) => 'JSON: UNIMPLEMENTED')

  export const validate: Algebra<string, validate.Options> = (x, ix) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.never: return 'false'
      case x.tag === URI.any: return 'true'
      case x.tag === URI.unknown: return 'true'
      case x.tag === URI.void: return ix.getBinding(ix) + ' === void 0'
      case x.tag === URI.null: return ix.getBinding(ix) + ' === null'
      case x.tag === URI.undefined: return ix.getBinding(ix) + ' === undefined'
      case x.tag === URI.symbol: return 'typeof ' + ix.getBinding(ix) + ` === 'symbol'`
      case x.tag === URI.boolean: return 'typeof ' + ix.getBinding(ix) + ` === 'boolean'`
      case x.tag === URI.integer: return 'Number.isInteger(' + ix.getBinding(ix) + `)`
      case x.tag === URI.bigint: return 'typeof ' + ix.getBinding(ix) + ` === 'bigint'`
      case x.tag === URI.number: return 'typeof ' + ix.getBinding(ix) + ` === 'number'`
      case x.tag === URI.string: return 'typeof ' + ix.getBinding(ix) + ` === 'string'`
      case x.tag === URI.eq: return validateJson(x.def, { depth: ix.instancePath.length, path: ix.instancePath })
      case x.tag === URI.optional: return '(' + ix.getBinding(ix) + ' === void 0)' + ' || ' + '\n  ' + '(' + x.def + ')'
      case x.tag === URI.record: {
        let NAME = ix.getBinding(ix)
        return '\n'
          + `(!!${NAME} && typeof ${NAME} === 'object' && !Array.isArray(${NAME}))`
          + ' && Object.entries(' + NAME + ').map(([k, value])) => ' + x.def + ')'
      }
      case x.tag === URI.array: {
        let NAME = ix.getBinding(ix)
        return '\n'
          + 'Array.isArray('
          + NAME
          + ') && '
          + (t.integer(x.minLength) ? (NAME + '.length >= ' + x.minLength + ' && ') : '')
          + (t.integer(x.maxLength) ? (NAME + '.length <= ' + x.maxLength + ' && ') : '')
          + NAME
          + '.every((value) => '
          + x.def
          + ')'
      }
      case x.tag === URI.union: return x.def.map((_) => '(' + _ + ')').join(' || ')
      case x.tag === URI.intersect: return x.def.join(' && ')
      case x.tag === URI.object: {
        let xs = Object.entries(x.def)
        let NAME = ix.getBinding(ix)
        return '\n'
          + `(!!${NAME} && typeof ${NAME} === 'object' && !Array.isArray(${NAME}))`
          + '\n  && '
          + xs.map(([k, v]) => `\n  ('${k}' in ${NAME}) && (` + '\n  ' + '(' + v + ')').join(' && ')
      }
      case x.tag === URI.tuple: {
        let NAME = ix.getBinding(ix)
        return '\n'
          + 'Array.isArray(' + NAME + ')'
          + ' && '
          + '(' + NAME + '.length === ' + x.def.length + ')'
          + ' && '
          + '('
          + x.def.join(' && ')
          + ')'
      }
    }
  }

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
        let opt = Array.of<string>().concat(x.opt)
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

export declare namespace validate {
  interface Options extends Config { }
}

validate.defaultOptions = {
  ...defaultOptions,
} satisfies validate.Options

validate.defaultInitialIndex = {
  ...defaultInitialIndex,
  inputVarName: 'value',
  getBinding: () => 'value',
} satisfies Index

export function validate(schema: t.Schema, options?: validate.Options, initialIndex?: Index): string
export function validate(
  schema: t.Schema,
  options: validate.Options = validate.defaultOptions,
  initialIndex: Index = validate.defaultInitialIndex
): string {
  return fold(options, algebra.validate)(
    schema as never, {
    ...options,
    ...initialIndex,
  })
}


// export declare namespace binding {
//   interface Options extends Config { }
// }

// binding.defaultOptions = {
//   ...defaultOptions
// } satisfies binding.Options

// export function binding(schema: t.Schema, options?: binding.Options, initialIndex?: Index): string
// export function binding(
//   schema: t.Schema,
//   options: binding.Options = binding.defaultOptions,
//   initialIndex: Index = defaultInitialIndex,
// ): string {
//   return fold(options, algebra.binding)(
//     schema as never, {
//     ...options,
//     ...initialIndex,
//   }
//   )
// }

// export const binding: Algebra<string, binding.Options> = (x, ix) => {
//   switch (true) {
//     default: return fn.exhaustive(x)
//     case t.isNullary(x): return ix.parentBinding
//     case t.isBoundable(x): return ix.parentBinding
//     case x.tag === URI.array: return 'value'
//     // case x.tag === URI.object: return Object.entries(x.def).map(([k, v]) => )
//     // case x.tag === URI.union:
//   }
// }

// case x.tag === URI.void: return ix.instancePath.map((_) =>  defaultKeyAccessor(void 0, ix)).join('') + ' === void 0'
// case x.tag === URI.null: return ix.instancePath.map((_) =>  defaultKeyAccessor(void 0, ix)).join('') + ' === null'
// case x.tag === URI.undefined: return ix.instancePath.map((_) =>  defaultKeyAccessor(void 0, ix)).join('') + ' === undefined'
// case x.tag === URI.symbol: return 'typeof ' + ix.instancePath.map((_) =>  defaultKeyAccessor(void 0, ix)).join('') + ` === 'symbol'`
// case x.tag === URI.boolean: return 'typeof ' + ix.instancePath.map((_) =>  defaultKeyAccessor(void 0, ix)).join('') + ` === 'boolean'`
// case x.tag === URI.integer: return 'Number.isInteger(' + ix.instancePath.map((_) =>  defaultKeyAccessor(void 0, ix)).join('') + `)`
// case x.tag === URI.bigint: return 'typeof ' + ix.instancePath.map((_) =>  defaultKeyAccessor(void 0, ix)).join('') + ` === 'bigint'`
// case x.tag === URI.number: return 'typeof ' + ix.instancePath.map((_) =>  defaultKeyAccessor(void 0, ix)).join('') + ` === 'number'`
// case x.tag === URI.string: return 'typeof ' + ix.instancePath.map((_) =>  defaultKeyAccessor(void 0, ix)).join('') + ` === 'string'`

