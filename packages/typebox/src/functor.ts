import * as typebox from '@sinclair/typebox'
import {
  PatternNeverExact,
  PatternNumberExact,
  PatternStringExact,
} from '@sinclair/typebox/type'
import type * as T from '@traversable/registry'
import { fn } from '@traversable/registry'

interface Index {
  path: (keyof any)[]
  depth: number
  isProperty: boolean
}

const defaultIndex = {
  depth: 0,
  path: [],
  isProperty: false,
} satisfies Index

export const isNullary = (x: unknown): x is Type.Nullary =>
  (!!x && typeof x === 'object' && typebox.Kind in x)
  && (
    x[typebox.Kind] === 'Never'
    || x[typebox.Kind] === 'Any'
    || x[typebox.Kind] === 'Unknown'
    || x[typebox.Kind] === 'Void'
    || x[typebox.Kind] === 'Null'
    || x[typebox.Kind] === 'Undefined'
    || x[typebox.Kind] === 'Symbol'
    || x[typebox.Kind] === 'Boolean'
    || x[typebox.Kind] === 'Integer'
    || x[typebox.Kind] === 'BigInt'
    || x[typebox.Kind] === 'Number'
    || x[typebox.Kind] === 'String'
    || x[typebox.Kind] === 'Literal'
    || x[typebox.Kind] === 'Date'
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
  date: 'Date',
} as const

export function tagged<Name extends keyof typeof TypeName>(typeName: Name): <T>(x: unknown) => x is Type.Catalog<T>[Name]
export function tagged<Name extends keyof typeof TypeName>(typeName: Name) {
  return (x: unknown) => !!x && typeof x === 'object' &&
    (
      (typeName === TypeName.allOf && TypeName.allOf in x)
      || (typeName === TypeName.anyOf && TypeName.anyOf in x)
      || (
        typebox.Kind in x && x[typebox.Kind] === TypeName[typeName]
      )
    )
}

function internalIsOptional(x: unknown): boolean {
  return !!x && typeof x === 'object' && typebox.OptionalKind in x
}

export function isOptional(x: unknown): boolean {
  return !!x && typeof x === 'object' && typebox.Kind in x && x[typebox.Kind] === TypeName.optional
}


export declare namespace Type {
  interface Never { [typebox.Kind]: 'Never' }
  interface Any { [typebox.Kind]: 'Any' }
  interface Unknown { [typebox.Kind]: 'Unknown' }
  interface Void { [typebox.Kind]: 'Void' }
  interface Null { [typebox.Kind]: 'Null' }
  interface Undefined { [typebox.Kind]: 'Undefined' }
  interface Symbol { [typebox.Kind]: 'Symbol' }
  interface Boolean { [typebox.Kind]: 'Boolean' }
  interface Date { [typebox.Kind]: 'Date' }
  interface Literal { [typebox.Kind]: 'Literal', const: string | number | boolean }
  interface Integer extends Integer.Bounds { [typebox.Kind]: 'Integer' }
  namespace Integer { interface Bounds { minimum?: number, maximum?: number } }
  interface BigInt extends BigInt.Bounds { [typebox.Kind]: 'BigInt' }
  namespace BigInt { interface Bounds { minimum?: bigint, maximum?: bigint } }
  interface Number extends Number.Bounds { [typebox.Kind]: 'Number' }
  namespace Number { interface Bounds { exclusiveMinimum?: number, exclusiveMaximum?: number, minimum?: number, maximum?: number } }
  interface String extends String.Bounds { [typebox.Kind]: 'String' }
  namespace String { interface Bounds { minLength?: number, maxLength?: number } }
  interface Array<S> extends Array.Bounds { [typebox.Kind]: 'Array', items: S }
  namespace Array { interface Bounds { minItems?: number, maxItems?: number } }
  interface Optional<S> { [typebox.Kind]: 'Optional', schema: S }
  interface Record<S> { [typebox.Kind]: 'Record', patternProperties: Record.PatternProperties<S> }
  namespace Record { type PatternProperties<S> = { [PatternStringExact]: S, [PatternNumberExact]: S, [PatternNeverExact]: S } }
  interface Tuple<S> { [typebox.Kind]: 'Tuple', items: S }
  interface Object<S> { [typebox.Kind]: 'Object', properties: S }
  interface Union<S> { [typebox.Kind]: 'Union', anyOf: S }
  interface Intersect<S> { [typebox.Kind]: 'Intersect', allOf: S }
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
    | Type.Date

  type Unary<S> =
    | Type.Array<S>
    | Type.Record<S>
    | Type.Optional<S>
    | Type.Tuple<S[]>
    | Type.Union<S[]>
    | Type.Intersect<S[]>
    | Type.Object<{ [x: string]: S }>

  interface Free extends T.HKT { [-1]: F<this[0]> }
  type F<S> = Type.Nullary | Type.Unary<S>
  type Fixpoint =
    | Type.Nullary
    | Type.Array<Fixpoint>
    | Type.Record<Fixpoint>
    | Type.Tuple<Fixpoint[]>
    | Type.Union<Fixpoint[]>
    | Type.Intersect<Fixpoint[]>
    | Type.Object<{ [x: string]: Fixpoint }>

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
    date: Type.Date
    literal: Type.Literal
    anyOf: Type.Union<T>
    allOf: Type.Intersect<T>
    optional: Type.Optional<T>
    array: Type.Array<T>
    record: Type.Record<T>
    tuple: Type.Tuple<T>
    object: Type.Object<T>
  }
}

export const Functor: T.Functor.Ix<Index, Type.Free> = {
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
        case tagged('tuple')(x): return { ...x, items: fn.map(x.items, f) }
        case tagged('object')(x): return { ...x, properties: fn.map(x.properties, f) }
      }
    }
  },
  mapWithIndex(f) {
    return (x, ix) => {
      const { path, isProperty } = ix
      const depth = ix.depth + 1
      switch (true) {
        default: return fn.exhaustive(x)
        case isNullary(x): return x
        case tagged('anyOf')(x): return { ...x, anyOf: fn.map(x.anyOf, (v) => f(v, { path, depth, isProperty }, x)) }
        case tagged('allOf')(x): return { ...x, allOf: fn.map(x.allOf, (v) => f(v, { path, depth, isProperty }, x)) }
        case tagged('optional')(x): return { ...x, schema: f(x.schema, { path, depth, isProperty }, x) }
        case tagged('array')(x): return { ...x, items: f(x.items, { path, depth, isProperty: false }, x) }
        case tagged('tuple')(x): return { ...x, items: fn.map(x.items, (v, i) => f(v, { path: [...path, i], depth, isProperty: false }, x)) }
        case tagged('record')(x): return { ...x, patternProperties: fn.map(x.patternProperties, (v) => f(v, { path, depth, isProperty: false }, x)) }
        case tagged('object')(x): return { ...x, properties: fn.map(x.properties, (v, k) => f(v, { path: [...path, k], depth, isProperty: true }, x)) }
      }
    }
  }
}

const internalFold = fn.catamorphism(Functor, defaultIndex)

export const fold
  : <T>(g: (src: Type.F<T>, ix: Index, x: Type.F<Type.F<unknown>>) => T) => (src: Type.F<T>, ix?: Index) => T
  = (g) => (src, ix = defaultIndex) => fn.catamorphism(Functor, ix)(g)(preprocess(src, ix), ix)

const preprocess
  : <T>(schema: Type.F<T>, ix: Index) => Type.F<T>
  = <never>internalFold((schema) => {
    if (!internalIsOptional(schema)) return schema
    else {
      delete (schema as any)[typebox.OptionalKind]
      return { [typebox.Kind]: TypeName.optional, schema }
    }
  })
