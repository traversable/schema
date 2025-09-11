import * as T from 'typebox'
import { NeverPattern, NumberPattern, StringPattern } from 'typebox/type'
import type * as t from '@traversable/registry'
import type { Kind, HKT } from '@traversable/registry'
import { accessor, fn, has, omit, Object_keys } from '@traversable/registry'

export interface Index {
  path: (keyof any)[]
  isOptional: boolean
  isProperty: boolean
  varName?: string
}

export type CompilerAlgebra<T> = { (src: Kind<Type.Free, T>, ix: CompilerIndex, input: any): T }
export interface CompilerIndex extends Omit<Index, 'path'> {
  dataPath: (string | number)[]
  isOptional: boolean
  isProperty: boolean
  schemaPath: (keyof any)[]
  varName: string
}

export const defaultIndex = {
  path: [],
  isOptional: false,
  isProperty: false,
} satisfies Index

export const defaultCompilerIndex = {
  ...defaultIndex,
  dataPath: [],
  schemaPath: [],
  varName: 'value',
} satisfies CompilerIndex

export const isNullary = (x: unknown): x is Type.Nullary => has('~kind')(x) && (
  x['~kind'] === 'Never'
  || x['~kind'] === 'Any'
  || x['~kind'] === 'Unknown'
  || x['~kind'] === 'Void'
  || x['~kind'] === 'Null'
  || x['~kind'] === 'Undefined'
  || x['~kind'] === 'Symbol'
  || x['~kind'] === 'Boolean'
  || x['~kind'] === 'Integer'
  || x['~kind'] === 'BigInt'
  || x['~kind'] === 'Number'
  || x['~kind'] === 'String'
  || x['~kind'] === 'Literal'
  || x['~kind'] === 'Enum'
  // || x['~kind'] === 'Date'
)

export type TypeName = typeof TypeName[keyof typeof TypeName]
export const TypeName = {
  never: 'Never',
  any: 'Any',
  unknown: 'Unknown',
  void: 'Void',
  null: 'Null',
  undefined: 'Undefined',
  symbol: 'Symbol',
  boolean: 'Boolean',
  integer: 'Integer',
  bigInt: 'BigInt',
  number: 'Number',
  string: 'String',
  literal: 'Literal',
  anyOf: 'anyOf',
  allOf: 'allOf',
  optional: 'Optional',
  array: 'Array',
  record: 'Record',
  tuple: 'Tuple',
  object: 'Object',
  enum: 'Enum'
  // date: 'Date',
} as const

export const TypeNames = Object_keys(TypeName)

export function tagged<Name extends keyof typeof TypeName>(typeName: Name): <T>(x: unknown) => x is Type.Catalog<T>[Name]
export function tagged<Name extends keyof typeof TypeName>(typeName: Name) {
  return (x: unknown) => !!x && typeof x === 'object' &&
    (
      (typeName === TypeName.allOf && TypeName.allOf in x)
      || (typeName === TypeName.anyOf && TypeName.anyOf in x)
      || (
        '~kind' in x && x['~kind'] === TypeName[typeName]
      )
    )
}

function internalIsOptional(x: unknown): boolean {


  // console.log('HIT', (x as any)['~optional'])
  // console.log('T.Optional(T.Number)[\'~optional\']', T.Optional(T.Number)['~optional'])


  return !!x && typeof x === 'object' && '~optional' in x
}

export function isOptional<T>(x: unknown): x is Type.Optional<T> {
  return (!!x && typeof x === 'object' && '~kind' in x && x['~kind'] === TypeName.optional)
}

export declare namespace Type {
  interface Never { ['~kind']: 'Never' }
  interface Any { ['~kind']: 'Any' }
  interface Unknown { ['~kind']: 'Unknown' }
  interface Void { ['~kind']: 'Void' }
  interface Null { ['~kind']: 'Null' }
  interface Undefined { ['~kind']: 'Undefined' }
  interface Symbol { ['~kind']: 'Symbol' }
  interface Boolean { ['~kind']: 'Boolean' }
  // interface Date { ['~kind']: 'Date' }
  interface Literal { ['~kind']: 'Literal', const: string | number | boolean }
  interface Integer extends Integer.Bounds { ['~kind']: 'Integer' }
  namespace Integer { interface Bounds { minimum?: number, maximum?: number, multipleOf?: number } }
  interface BigInt extends BigInt.Bounds { ['~kind']: 'BigInt' }
  namespace BigInt { interface Bounds { minimum?: bigint, maximum?: bigint, multipleOf?: bigint } }
  interface Number extends Number.Bounds { ['~kind']: 'Number' }
  namespace Number { interface Bounds { exclusiveMinimum?: number, exclusiveMaximum?: number, minimum?: number, maximum?: number, multipleOf?: number } }
  interface String extends String.Bounds { ['~kind']: 'String' }
  namespace String { interface Bounds { minLength?: number, maxLength?: number } }
  interface Array<S> extends Array.Bounds { ['~kind']: 'Array', items: S }
  namespace Array { interface Bounds { minItems?: number, maxItems?: number } }
  interface Optional<S> { ['~kind']: 'Optional', schema: S }
  interface Record<S> { ['~kind']: 'Record', patternProperties: Record.PatternProperties<S> }
  namespace Record { type PatternProperties<S> = { [StringPattern]: S, [NumberPattern]: S, [NeverPattern]: S } }
  interface Tuple<S> { ['~kind']: 'Tuple', items: S[] }
  interface Object<S> { ['~kind']: 'Object', properties: { [x: string]: S }, required: string[] }
  interface Enum { ['~kind']: 'Enum', enum: readonly (string | number)[] }
  interface Union<S> { ['~kind']: 'Union', anyOf: S[] }
  interface Intersect<S> { ['~kind']: 'Intersect', allOf: S[] }
  type Nullary =
    | Type.Never
    | Type.Any
    | Type.Unknown
    | Type.Void
    | Type.Null
    | Type.Undefined
    | Type.Symbol
    | Type.Boolean
    | Type.Integer
    | Type.BigInt
    | Type.Number
    | Type.String
    | Type.Literal
    | Type.Enum
  // | Type.Date

  type Unary<S> =
    | Type.Array<S>
    | Type.Record<S>
    | Type.Optional<S>
    | Type.Tuple<S>
    | Type.Union<S>
    | Type.Intersect<S>
    | Type.Object<S>

  interface Free extends HKT { [-1]: F<this[0]> }
  type F<S> = Type.Nullary | Type.Unary<S>
  type Fixpoint =
    | Type.Nullary
    | Type.Array<Fixpoint>
    | Type.Record<Fixpoint>
    | Type.Optional<Fixpoint>
    | Type.Tuple<Fixpoint>
    | Type.Union<Fixpoint>
    | Type.Intersect<Fixpoint>
    | Type.Object<Fixpoint>

  type Catalog<T = unknown> = {
    never: Type.Never
    any: Type.Any
    unknown: Type.Unknown
    void: Type.Void
    null: Type.Null
    undefined: Type.Undefined
    symbol: Type.Symbol
    boolean: Type.Boolean
    integer: Type.Integer
    bigInt: Type.BigInt
    number: Type.Number
    string: Type.String
    // date: Type.Date
    literal: Type.Literal
    anyOf: Type.Union<T>
    allOf: Type.Intersect<T>
    optional: Type.Optional<T>
    array: Type.Array<T>
    record: Type.Record<T>
    tuple: Type.Tuple<T>
    object: Type.Object<T>
    enum: Type.Enum
  }
}

export const Functor: t.Functor.Ix<Index, Type.Free> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case tagged('optional')(x): return { ...x, schema: f(x.schema) }
        case isNullary(x): return { ...x, ['~kind']: x['~kind'] } as Type.Nullary
        case has('$ref')(x): return { ...x, $ref: x.$ref } as never
        // case tagged('enum')(x): return { ...x, enum: x.enum }
        case tagged('anyOf')(x): return { ...x, anyOf: fn.map(x.anyOf, f) }
        case tagged('allOf')(x): return { ...x, allOf: fn.map(x.allOf, f) }
        case tagged('array')(x): return { ...x, items: f(x.items) }
        case tagged('record')(x): return { ...x, patternProperties: fn.map(x.patternProperties, f) }
        case tagged('tuple')(x): return { ...x, items: fn.map(x.items || [], f) }
        case tagged('object')(x): return { ...x, properties: fn.map(x.properties, f) }
      }
    }
  },
  mapWithIndex(f) {
    return (x, ix) => {
      const { path, isOptional, isProperty } = ix
      switch (true) {
        default: return (console.log('EXHAUSTIVE, x:', x, '~kind:', (x as any)['~kind']), fn.exhaustive(x))
        // case isNullary(x): return x
        case isNullary(x): return { ...x, ['~kind']: x['~kind'] } as Type.Nullary
        case has('$ref')(x): return { ...x, $ref: x.$ref } as never
        case tagged('anyOf')(x): return { ...x, anyOf: fn.map(x.anyOf, (v) => f(v, ix, x)) }
        case tagged('allOf')(x): return { ...x, allOf: fn.map(x.allOf, (v) => f(v, ix, x)) }
        case tagged('optional')(x): {
          console.log('Functor.mapWithIndex :: HIT')
          return { ...x, schema: f(x.schema, { path, isProperty, isOptional: true }, x) }
        }
        case tagged('array')(x): return { ...x, items: f(x.items, { path, isOptional, isProperty: false }, x) }
        case tagged('tuple')(x): return { ...x, items: fn.map(x.items || [], (v, i) => f(v, { path: [...path, i], isOptional, isProperty: false }, x)) }
        case tagged('record')(x): return { ...x, patternProperties: fn.map(x.patternProperties, (v) => f(v, { path, isOptional, isProperty: false }, x)) }
        case tagged('object')(x): return { ...x, properties: fn.map(x.properties, (v, k) => f(v, { path: [...path, k], isOptional, isProperty: true }, x)) }
      }
    }
  }
}

export const CompilerFunctor: t.Functor.Ix<CompilerIndex, Type.Free> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isNullary(x): return x
        case tagged('anyOf')(x): return { ...x, anyOf: fn.map(x.anyOf, f) }
        case tagged('allOf')(x): return { ...x, allOf: fn.map(x.allOf, f) }
        case tagged('optional')(x): return { ...x, schema: f(x.schema) }
        case tagged('array')(x): return { ...x, items: f(x.items) }
        case tagged('record')(x): return { ...x, patternProperties: fn.map(x.patternProperties, f) }
        case tagged('tuple')(x): return { ...x, items: fn.map(x.items || [], f) }
        case tagged('object')(x): return { ...x, properties: fn.map(x.properties, f) }
      }
    }
  },
  mapWithIndex(f) {
    return (x, ix) => {
      const { isProperty } = ix
      switch (true) {
        default: return fn.exhaustive(x)
        case isNullary(x): return x
        case tagged('anyOf')(x): return { ...x, anyOf: fn.map(x.anyOf, (v) => f(v, ix, x)) }
        case tagged('allOf')(x): return { ...x, allOf: fn.map(x.allOf, (v) => f(v, ix, x)) }
        case tagged('optional')(x): return { ...x, schema: f(x.schema, { ...ix, isProperty, isOptional: true }, x) }
        case tagged('array')(x): return {
          ...x,
          items: f(x.items, {
            ...ix,
            varName: 'value',
            isProperty: false,
          }, x)
        }
        case tagged('tuple')(x): return {
          ...x,
          items: fn.map(x.items || [], (v, i) => f(v, {
            ...ix,
            dataPath: [...ix.dataPath, i],
            schemaPath: [...ix.schemaPath, i],
            isProperty: false,
            varName: ix.varName + accessor(i, ix.isOptional),
          }, x))
        }
        case tagged('record')(x): return {
          ...x,
          patternProperties: fn.map(x.patternProperties, (v) => f(v, {
            ...ix,
            isProperty: false,
            varName: 'value',
          }, x))
        }
        case tagged('object')(x): return {
          ...x,
          properties: fn.map(x.properties, (v, k) => f(v, {
            ...ix,
            dataPath: [...ix.dataPath, k],
            schemaPath: [...ix.schemaPath, k],
            isProperty: true,
            varName: ix.varName + accessor(k, isOptional(x.properties[k])),
          }, x))
        }
      }
    }
  }
}

const fold_ = fn.catamorphism(Functor, defaultIndex)

export type Algebra<T> = {
  (src: Type.F<T>, ix?: Index): T
  (src: Partial<T.TSchema>, ix?: Index): T
  (src: Type.F<T>, ix?: Index): T
}

export type Fold = <T>(g: (src: Type.F<T>, ix: Index, x: T.TSchema) => T) => Algebra<T>

export const fold = ((g: any) => (src: any, ix = defaultIndex) => fn.catamorphism(Functor, ix)(g)(preprocess(src, ix), ix)) as Fold

const preprocess
  : <T>(schema: Type.F<T>, ix: Index | CompilerIndex) => Type.F<T>
  = <never>fold_((schema) => {


    console.log('preprocessing node:', schema)
    console.log('preprocessing node:', (schema as any)['~optional'])


    if (!internalIsOptional(schema)) return schema
    else {
      const withoutOptionalKind = omit(schema, ['~optional'])
      return { ['~kind']: TypeName.optional, schema: withoutOptionalKind }
    }
  })

export const compile
  : <T>(g: (src: Type.F<T>, ix: CompilerIndex, x: Type.F<unknown>) => T) => (src: Type.F<T>, ix?: CompilerIndex) => T
  = (g) => (src, ix = defaultCompilerIndex) => fn.catamorphism(CompilerFunctor, ix)(g)(preprocess(src, ix), ix)
