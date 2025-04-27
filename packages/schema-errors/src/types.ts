import type * as T from '@traversable/registry'
import type { symbol, Unknown } from '@traversable/registry'
import type { t } from '@traversable/schema'
import type { Json } from '@traversable/json'

export interface ValidationError {
  got: unknown
  message: string
  path: (string | number)[]
}

export interface Validator<T = unknown> {
  (got: T | Unknown, path?: (keyof any)[]): ValidationError[]
  [symbol.optional]?: number
  tag: string
  // def: unknown
}


export type NullaryErrors = Record<
  T.TypeName<t.NullaryTag>,
  (got: unknown, path: (keyof any)[]) => ValidationError[]
>

export type BoundableErrors =
  & Record<T.TypeName<t.BoundableTag>, (got: unknown, path: (keyof any)[]) => ValidationError[]>
  & Record<
    | 'arrayBelowMinimum'
    | 'arrayAboveMaximum'
    | 'integerBelowMinimum'
    | 'integerAboveMaximum'
    | 'bigintBelowMinimum'
    | 'bigintAboveMaximum'
    | 'numberBelowMinimum'
    | 'numberAboveMaximum'
    | 'numberBelowExclusiveMinimum'
    | 'numberAboveExclusiveMaximum'
    | 'stringBelowMinimum'
    | 'stringAboveMaximum'
    , (bound: number | bigint, got: unknown, path: (keyof any)[]) => ValidationError[]
  >

export type UnaryErrors = Record<
  T.TypeName<t.UnaryTag>,
  (got: unknown, path: (keyof any)[]) => ValidationError[]
>

export type JsonErrors = {
  jsonScalar: (literal: Json.Scalar, got: unknown, path: (keyof any)[]) => ValidationError[]
  jsonArray: (got: unknown, path: (keyof any)[]) => ValidationError[]
  jsonObject: (got: unknown, path: (keyof any)[]) => ValidationError[]
  jsonObjectKey: (key: string, got: unknown, path: (keyof any)[]) => ValidationError[]
}

export type MissingErrors = Record<
  | 'tupleIndex'
  | 'objectKey'
  | 'tupleIndexExactOptional'
  | 'objectKeyExactOptional'
  , (k: keyof any, got: unknown, path: (keyof any)[]) => ValidationError[]
>
