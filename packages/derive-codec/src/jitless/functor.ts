import type * as T from '@traversable/registry'
import { fn, URI, symbol as Sym } from '@traversable/registry'
import { t } from '@traversable/schema'

export type Index = {
  indent: number
  instancePath: (string | number)[]
  isChildOfUnion: boolean
  isDirectChildOfUnion: boolean
  isNullable: boolean
  isOptional: boolean
  isRoot: boolean,
  schemaPath: (keyof any)[]
  resultVarName: T.Autocomplete<`${string}.${string}`>
  inputVarName: T.Autocomplete<`${string}.${string}`>
  getBinding: (ix: Index) => string
  getSchemaPath: (ix: Index) => string[]
}

export type Tag = T.TypeName<t.Tag>

export type NullaryTag = Exclude<Tag, UnaryTag>

export type UnaryTag = T.TypeName<
  | URI.optional
  | URI.array
  | URI.record
  | URI.union
  | URI.intersect
  | URI.tuple
  | URI.object
>

export type VarNameInterpreter = Record<
  UnaryTag,
  (index: Index, next?: string | number) => string
>

export type PathInterpreter<T> =
  & Record<NullaryTag, (index: Index) => T>
  & Record<
    UnaryTag,
    (key: string | number | null) => (index: Index) => T
  >


export type Errors = Record<
  Tag,
  (index: Index) => string
>

export type Config = {
  shouldCoerce: boolean
  /** ## {@link defaultResultVarNameInterpreter `Config.deriveResultVarName`} */
  deriveResultVarName: VarNameInterpreter
  /** ## {@link defaultInputVarNameInterpreter `Config.defaultInputVarName`} */
  deriveInputVarName: VarNameInterpreter
  /** ## {@link defaultSchemaPathInterpreter `Config.deriveSchemaPath`} */
  deriveBinding: PathInterpreter<string>
  /** ## {@link defaultSchemaPathInterpreter `Config.deriveSchemaPath`} */
  deriveSchemaPath: PathInterpreter<string[]>
  /** ## {@link defaultErrorHandlers `Config.errorHandlers`} */
  errorHandlers: Errors
}

export type Algebra<T, Opts> = T.IndexedAlgebra<Index & Opts, t.Free, T>

export let defaultInitialIndex = {
  indent: 0,
  inputVarName: 'input',
  instancePath: [],
  isChildOfUnion: false,
  isDirectChildOfUnion: false,
  isNullable: false,
  isOptional: false,
  // parentBinding: 'input',
  isRoot: true,
  getBinding: () => `__D1`,
  getSchemaPath: () => [],
  // optionalKeys: [],
  resultVarName: 'result',
  schemaPath: [],
} satisfies Index

export let PATTERN = {
  Ident: /^[_$a-zA-Z][_$a-zA-Z0-9]*$/,
}

export let isNaturalNumber = (x: unknown): x is number => typeof x === 'number' && Number.isInteger(x) && x >= 0
export let isValidIdentifier = (x: unknown): x is string => typeof x === 'string' && PATTERN.Ident.test(x)

export let defaultKeyAccessor = (key: keyof any | undefined, $: Index) => typeof key === 'string' ? isValidIdentifier(key) ? $.isOptional
  ? `?.${key}`
  : `.${key}`
  : `["${key}"]`
  : ''

export let pathToAccessor = (ix: Index, base: string) => {
  let out = base
  for (let segment of ix.instancePath) {
    out += defaultAccessor(segment, ix)
  }
  return out
}

export let defaultIndexAccessor = (index: keyof any | undefined, $: Index) => typeof index === 'number' ? $.isOptional
  ? `?.[${index}]`
  : `[${index}]`
  : ''

export let defaultAccessor = (key: keyof any | undefined, $: Index) =>
  typeof key === 'number' ? defaultIndexAccessor(key, $)
    : typeof key === 'string' ? defaultKeyAccessor(key, $)
      : ''

export let Explode = (schemaType: string, x: any) => (
  console.error(''
    + '\r\nError: unhandled schema type:'
    + '\r\n\n  "' + schemaType + '"'
    + '\r\n\n'
    + 'If you\'d like to support "' + schemaType + '" schemas, you\'ll need to define a handler.'
    + '\r\n\n'
  ),
  fn.assertIsNotCalled('Unimplemented: ' + <never>schemaType, x)
)

export let accessor = {
  optional: ($, k) => `${$.instancePath}${defaultAccessor(k, $)}`,
  record: ($, k) => `${$.instancePath}${defaultKeyAccessor(k, $)}`,
  array: ($, k) => `${$.instancePath}${defaultIndexAccessor(k, $)}`,
  tuple: ($, k) => `${$.instancePath}${defaultIndexAccessor(k, $)}`,
  object: ($, k) => `${$.instancePath}${defaultKeyAccessor(k, $)}`,
  union: ($, k) => `${$.instancePath}${defaultAccessor(k, $)}`,
  intersect: ($, k) => `${$.instancePath}${defaultAccessor(k, $)}`,
} satisfies Config['deriveResultVarName']

export let defaultResultVarNameInterpreter = {
  optional: ($) => `__${$.instancePath.length}_Optional`,
  union: ($) => `__${$.instancePath.length}_Union`,
  intersect: ($) => `__${$.instancePath.length}_Intersect`,
  record: ($, k) => `__${$.instancePath.length}_Record${isValidIdentifier(k) ? `_${k}` : ''}`,
  array: ($, k) => `__${$.instancePath.length}_Array${isNaturalNumber(k) ? `_${k}` : ''}`,
  tuple: ($, k) => `__${$.instancePath.length}_Tuple${isNaturalNumber(k) ? `_${k}` : ''}`,
  object: ($, k) => `__${$.instancePath.length}_Object${isValidIdentifier(k) ? `_${k}` : ''}`,
} satisfies Config['deriveResultVarName']

export let defaultInputVarNameInterpreter = {
  optional: () => '',
  record: ($) => `${$.inputVarName}_Record`,
  array: ($) => `${$.inputVarName}_Array`,
  union: ($) => `${$.inputVarName}_Union`,
  intersect: ($) => `${$.inputVarName}_Intersect`,
  tuple: ($, k) => `${$.inputVarName}_Tuple${isNaturalNumber(k) ? `_${k}` : ''}`,
  object: ($, k) => `${$.inputVarName}_Object_${isValidIdentifier(k) ? `_${k}` : ''}`,
} satisfies Config['deriveInputVarName']

export let defaultErrorHandlers = {
  any: () => 'expected any',
  array: () => 'expected array',
  bigint: () => 'expected bigint',
  boolean: () => 'expected boolean',
  eq: () => 'N/A',
  integer: () => 'expected integer',
  intersect: () => 'expected interesect',
  never: () => 'expected never',
  null: () => 'expected null',
  number: () => 'expected number',
  object: () => 'expected object',
  optional: () => 'expected optional',
  record: () => 'expected record',
  string: () => 'expected string',
  symbol: () => 'expected symbol',
  tuple: () => 'expected tuple',
  undefined: () => 'expected undefined',
  union: () => 'expected union',
  unknown: () => 'expected unknown',
  void: () => 'expected void',
} satisfies Config['errorHandlers']

let deriveSchemaPath = (k: string | number | null) => (ix: Index) => {
  console.log('k in deriveSchemaPath', k)
  let { schemaPath: path, instancePath } = ix
  let depth = instancePath.length
  let out = [`/__D${depth}`]
  for (let segment of path) {
    switch (true) {
      case segment === Sym.array: out.push('elements'); break
      case typeof segment === 'string': out.push(segment); break
      // case typeof segment === 'number': out += segment; break
    }
  }
  return out
}

let deriveBinding = (k: string | number | null) => (ix: Index) => {
  console.log('k in deriveBinding', k)
  let { schemaPath: path, instancePath } = ix
  let depth = instancePath.length
  let out = [`__D${depth}`]
  for (let segment of path) {
    switch (true) {
      case segment === Sym.array: out.push('_A_'); break
      case segment === Sym.record: out.push('_R_'); break
    }
  }
  return out.join('')
}

export let defaultDeriveBinding = {
  any: deriveBinding(null),
  array: deriveBinding,
  bigint: deriveBinding(null),
  boolean: deriveBinding(null),
  eq: deriveBinding(null),
  integer: deriveBinding(null),
  intersect: deriveBinding,
  never: deriveBinding(null),
  null: deriveBinding(null),
  number: deriveBinding(null),
  object: deriveBinding,
  optional: deriveBinding,
  record: deriveBinding,
  string: deriveBinding(null),
  symbol: deriveBinding(null),
  tuple: deriveBinding,
  undefined: deriveBinding(null),
  union: deriveBinding,
  unknown: deriveBinding(null),
  void: deriveBinding(null),
} satisfies Config['deriveBinding']

export let defaultSchemaPathInterpreter = {
  any: deriveSchemaPath(null),
  array: deriveSchemaPath,
  bigint: deriveSchemaPath(null),
  boolean: deriveSchemaPath(null),
  eq: deriveSchemaPath(null),
  integer: deriveSchemaPath(null),
  intersect: deriveSchemaPath,
  never: deriveSchemaPath(null),
  null: deriveSchemaPath(null),
  number: deriveSchemaPath(null),
  object: deriveSchemaPath,
  optional: deriveSchemaPath,
  record: deriveSchemaPath,
  string: deriveSchemaPath(null),
  symbol: deriveSchemaPath(null),
  tuple: deriveSchemaPath,
  undefined: deriveSchemaPath(null),
  union: deriveSchemaPath,
  unknown: deriveSchemaPath(null),
  void: deriveSchemaPath(null),
} satisfies Config['deriveSchemaPath']

export let defaultConfig = {
  errorHandlers: defaultErrorHandlers,
  deriveInputVarName: defaultInputVarNameInterpreter,
  deriveResultVarName: defaultResultVarNameInterpreter,
  deriveSchemaPath: defaultSchemaPathInterpreter,
  deriveBinding: defaultDeriveBinding,
  shouldCoerce: false,
} satisfies Config

let map: T.Functor<t.Free>['map'] = (f) => (x) => {
  switch (true) {
    default: return fn.exhaustive(x)
    case t.isNullary(x): return x
    case t.isBoundable(x): return x
    case x.tag === URI.eq: return t.eq(x.def as never)
    case x.tag === URI.optional: return t.optional.def(f(x.def))
    case x.tag === URI.array: return t.array.def(f(x.def))
    case x.tag === URI.record: return t.record.def(f(x.def))
    case x.tag === URI.union: return t.union.def(fn.map(x.def, f))
    case x.tag === URI.intersect: return t.intersect.def(fn.map(x.def, f))
    case x.tag === URI.tuple: return t.tuple.def(fn.map(x.def, f))
    case x.tag === URI.object: return t.object.def(fn.map(x.def, f), {}, Array.of<string>().concat(x.opt))
  }
}

export interface Functor<Config> extends T.Functor.Ix<Index & Config, t.Free> { }
export const Functor
  : <Opts extends Config>(options: Opts) => T.Functor.Ix<Index & Opts, t.Free>
  = ($) => ({
    map,
    mapWithIndex(f) {
      return (x, ix) => {
        switch (true) {
          // default: return (console.error('EXHAUSTIVE CASE, x: ' + x), fn.exhaustive(x))
          default: return fn.exhaustive(x)
          case t.isNullary(x): return x
          case t.isBoundable(x): return x
          case x.tag === URI.eq: return x as never
          case x.tag === URI.optional: {
            // let previouslyOptional = ix.isOptional
            // void (ix.isOptional = true)
            let out = t.optional.def(f(x.def, {
              ...ix,
              getSchemaPath: ix.deriveSchemaPath.optional
            }))
            // void (ix.isOptional = previouslyOptional)
            return out
          }
          case x.tag === URI.tuple: return t.tuple.def(fn.map(x.def, (v, i) => f(v, {
            ...$,
            indent: ix.indent + 2,
            inputVarName: ix.inputVarName, // $.deriveInputVarName.tuple(ix, i),
            instancePath: [...ix.instancePath, i],
            isChildOfUnion: ix.isChildOfUnion,
            isDirectChildOfUnion: false,
            isNullable: ix.isNullable,
            isOptional: ix.isOptional,
            getBinding: ix.deriveBinding.tuple(i),
            getSchemaPath: ix.deriveSchemaPath.tuple(i),
            isRoot: false,
            // optionalKeys: ix.optionalKeys,
            // optionalKeys: ix.optionalKeys,
            resultVarName: $.deriveResultVarName.tuple(ix, i),
            schemaPath: [...ix.schemaPath, i],
            shouldCoerce: $.shouldCoerce,
          })))
          case x.tag === URI.array: return t.array.def(f(x.def, {
            ...$,
            indent: ix.indent + 2,
            inputVarName: ix.inputVarName, // $.deriveInputVarName.array(ix),
            instancePath: ix.instancePath,
            isChildOfUnion: ix.isChildOfUnion,
            isDirectChildOfUnion: false,
            isNullable: ix.isNullable,
            isOptional: ix.isOptional,
            getSchemaPath: ix.deriveSchemaPath.array(null),
            getBinding: ix.deriveBinding.array(null),
            isRoot: false,
            // optionalKeys: ix.optionalKeys,
            resultVarName: $.deriveResultVarName.array(ix),
            schemaPath: [...ix.schemaPath, Sym.array],
            shouldCoerce: $.shouldCoerce,
          }))
          case x.tag === URI.record: return t.record.def(f(x.def, {
            ...$,
            indent: ix.indent + 2,
            inputVarName: ix.inputVarName, // $.deriveInputVarName.record(ix),
            instancePath: [...ix.instancePath, '{}'],
            isChildOfUnion: ix.isChildOfUnion,
            isDirectChildOfUnion: false,
            isNullable: ix.isNullable,
            isOptional: ix.isOptional,
            getSchemaPath: ix.deriveSchemaPath.record(null),
            getBinding: ix.deriveBinding.record(null),
            isRoot: false,
            // optionalKeys: ix.optionalKeys,
            // optionalKeys: [],
            resultVarName: $.deriveResultVarName.record(ix),
            schemaPath: [...ix.schemaPath, Sym.record],
            shouldCoerce: $.shouldCoerce,
          }))
          case x.tag === URI.object: return t.object.def(fn.map(x.def, (v, k) => f(v, {
            ...$,
            indent: ix.indent + 2,
            inputVarName: ix.inputVarName, // $.deriveInputVarName.object(ix, k),
            instancePath: [...ix.instancePath, k],
            isChildOfUnion: ix.isChildOfUnion,
            isDirectChildOfUnion: false,
            isNullable: ix.isNullable,
            isOptional: ix.isOptional,
            getSchemaPath: ix.deriveSchemaPath.object(k),
            getBinding: ix.deriveBinding.object(k),
            isRoot: false,
            optionalKeys: Array.of<string>().concat(x.opt),
            resultVarName: $.deriveResultVarName.object(ix, k),
            schemaPath: [...ix.schemaPath, k],
            shouldCoerce: $.shouldCoerce,
          })), {}, Array.of<string>().concat(x.opt))
          case x.tag === URI.intersect: return t.intersect.def(fn.map(x.def, (v, i) => f(v, {
            ...$,
            indent: ix.indent + 2,
            inputVarName: ix.inputVarName, // $.deriveInputVarName.intersect(ix, i),
            instancePath: ix.instancePath,
            isChildOfUnion: ix.isChildOfUnion,
            isDirectChildOfUnion: false,
            isNullable: ix.isNullable,
            isOptional: ix.isOptional,
            isRoot: false,
            // optionalKeys: ix.optionalKeys,
            resultVarName: $.deriveResultVarName.intersect(ix, i),
            getSchemaPath: ix.deriveSchemaPath.intersect(i),
            getBinding: ix.deriveBinding.intersect(i),
            schemaPath: [...ix.schemaPath, Sym.intersect, i],
            shouldCoerce: $.shouldCoerce,
          })))
          case x.tag === URI.union: {
            let previouslyChildOfUnion = ix.isChildOfUnion
            void (ix.isDirectChildOfUnion = true)
            let out = t.union.def(fn.map(x.def, (v, i) => f(v, {
              ...$,
              indent: ix.indent + 2,
              inputVarName: ix.inputVarName, //$.deriveInputVarName.union(ix, i),
              instancePath: ix.instancePath,
              isChildOfUnion: true,
              isDirectChildOfUnion: true,
              isNullable: ix.isNullable,
              isOptional: ix.isOptional,
              getSchemaPath: $.deriveSchemaPath.union(i),
              getBinding: $.deriveBinding.union(i),
              isRoot: false,
              // optionalKeys: ix.optionalKeys,
              resultVarName: $.deriveResultVarName.union(ix, i),
              schemaPath: [...ix.schemaPath, Sym.union, i],
              shouldCoerce: $.shouldCoerce,
            })))
            void (ix.isChildOfUnion = previouslyChildOfUnion)
            return out
          }
        }
      }
    }
  })


export let fold = <T, Opts extends Config>(options: Opts, algebra: Algebra<T, Opts>) => fn.cataIx(Functor(options))(algebra)
