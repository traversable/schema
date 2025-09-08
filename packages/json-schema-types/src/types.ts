import type { Json } from '@traversable/json'
import type { HKT } from '@traversable/registry'
import { Array_isArray, has, isShowable } from '@traversable/registry'

/**
 * # {@link JsonSchema `JsonSchema`}
 * 
 * If {@link T `T`} is not defined, {@link JsonSchema `JsonSchema`} returns a recursive
 * Json Schema type.
 * 
 * If {@link T `T`} **is** defined, {@link JsonSchema `JsonSchema`} returns a _non-recursive_
 * Json Schema type, where the "holes" (the parts that would be recursive) are filled with {@link T `T`}.
 * This is what allows {@link JsonSchema `JsonSchema`} to support recursion schemes.
 * 
 * See also:
 * - the [spec](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-00)
 */

/** ## {@link Never `JsonSchema.Never`} */
export type Never =
  | { enum: [] }
  | { not: Unknown }

/** ## {@link Unknown `JsonSchema.Unknown`} */
export interface Unknown {}

/** ## {@link Null `JsonSchema.Null`} */
export interface Null { type: 'null' }

/** ## {@link Boolean `JsonSchema.Boolean`} */
export interface Boolean { type: 'boolean' }

/** ## {@link Integer `JsonSchema.Integer`} */
export interface Integer extends Bounds.Numeric { type: 'integer' }

/** ## {@link Number `JsonSchema.Number`} */
export interface Number extends Bounds.Number { type: 'number' }

/** ## {@link String `JsonSchema.String`} */
export interface String extends Bounds.String { type: 'string' }

/** ## {@link Ref `JsonSchema.Ref`} */
export interface Ref { $ref: string }

/** ## {@link Enum `JsonSchema.Enum`} */
export interface Enum {
  /**
   * ### {@link Enum `JsonSchema.Enum.enum`}
   * 
   * See also:
   * - the [spec](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-00#rfc.section.6.1.2)
   */
  enum: Exclude<Json.Scalar, undefined>[]
}

/** ## {@link Const `JsonSchema.Const`} */
export interface Const {
  /**
   * ### {@link Const `JsonSchema.Const.const`}
   * 
   * See also:
   * - the [spec](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-00#rfc.section.6.1.3)
   */
  const: Json
}

/** ## {@link Array `JsonSchema.Array`} */
export interface Array<T> extends Bounds.Items {
  type: 'array'
  /**
   * ### {@link Array `JsonSchema.Array.items`}
   * 
   * See also:
   * - the [spec](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-00#rfc.section.10.3.1.2)
   */
  items: T
}

/** ## {@link Tuple `JsonSchema.Tuple`} */
export interface Tuple<T, R = T> extends Bounds.Items {
  type: 'array'
  /** 
   * ### {@link Tuple `JsonSchema.Tuple.items`}
   * 
   * See also:
   * - the [spec](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-00#rfc.section.10.3.1.2)
   */
  items?: false | R
  /**
   * ### {@link Tuple `JsonSchema.Tuple.prefixItems`}
   * 
   * See also:
   * the [spec](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-00#rfc.section.10.3.1.1)
   */
  prefixItems: readonly T[]
}

/** ## {@link Object `JsonSchema.Object`} */
export interface Object<T> {
  type: 'object'
  required: string[]
  /**
   * ### {@link Object `JsonSchema.Object.properties`}
   * 
   * See also:
   * - the [spec](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-00#rfc.section.10.3.2.1)
   */
  properties: { [x: string]: T }
}

/** ## {@link Record `JsonSchema.Record`} */
export interface Record<T> {
  type: 'object'
  /**
   * ### {@link Record `JsonSchema.Record.additionalProperties`}
   * 
   * See also:
   * - the [spec](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-00#rfc.section.10.3.2.3)
   */
  additionalProperties?: T
  /**
   * ### {@link Record `JsonSchema.Record.patternProperties`}
   * 
   * See also:
   * - the [spec](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-00#rfc.section.10.3.2.2)
   */
  patternProperties?: globalThis.Record<string, T>
}

/** ## {@link Union `JsonSchema.Union`} */
export interface Union<T> {
  /**
   * ### {@link Union `JsonSchema.Union.anyOf`}
   * 
   * See also:
   * - the [spec](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-00#rfc.section.10.2.1.3)
   */
  anyOf: readonly T[]
}

/** ## {@link Intersection `JsonSchema.Intersection`} */
export interface Intersection<T> {
  /**
   * ### {@link Intersection `JsonSchema.Intersection.allOf`}
   * 
   * See also:
   * - the [spec](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-00#rfc.section.10.2.1.1)
   */
  allOf: readonly T[]
}

export type Scalar =
  | Null
  | Boolean
  | Integer
  | Number
  | String

export type Nullary =
  | Never
  | Scalar
  | Enum
  | Const

export type Unary<T> =
  | Array<T>
  | Tuple<T>
  | Object<T>
  | Record<T>
  | Union<T>
  | Intersection<T>

export type F<T> =
  | Nullary
  | Unknown
  | Ref
  | Unary<T>

export type JsonSchema =
  | Nullary
  | Unknown
  | Ref
  | Array<JsonSchema>
  | Tuple<JsonSchema>
  | Object<JsonSchema>
  | Record<JsonSchema>
  | Union<JsonSchema>
  | Intersection<JsonSchema>

export interface Free extends HKT { [-1]: F<this[0]> }

export declare namespace Bounds {
  interface Numeric {
    /**
     * See also:
     * - the [spec](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-00#rfc.section.6.2.4)
     */
    minimum?: number
    /**
     * See also:
     * - the [spec](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-00#rfc.section.6.2.2)
     */
    maximum?: number
    /**
     * See also: 
     * - the [spec](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-00#rfc.section.6.2.1)
     */
    multipleOf?: number
  }

  interface Number extends Bounds.Numeric {
    /**
     * See also:
     * - the [spec](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-00#rfc.section.6.2.5)
     */
    exclusiveMinimum?: number
    /**
     * See also:
     * - the [spec](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-00#rfc.section.6.2.3)
     */
    exclusiveMaximum?: number
  }

  interface String {
    /**
     * See also:
     * - the [spec](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-00#rfc.section.6.3.2)
     */
    minLength?: number
    /**
     * See also:
     * - the [spec](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-00#rfc.section.6.3.1)
     */
    maxLength?: number
    /**
     * See also:
     * - the [spec](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-00#rfc.section.6.3.3)
     */
    pattern?: string
  }

  interface Items {
    /**
     * See also:
     * - the [spec](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-00#rfc.section.6.4.2)
     */
    minItems?: number
    /**
     * See also:
     * - the [spec](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-00#rfc.section.6.4.1)
     */
    maxItems?: number
  }
}

export function isNever(x: unknown): x is Never {
  return has('enum', (_): _ is [] => Array_isArray(_) && _.length === 0)(x)
    || has('not', isUnknown)(x)
}

export function isConst(x: unknown): x is Const {
  return has('const')(x)
}

export function isEnum(x: unknown): x is Enum {
  return has('enum', (_): _ is Scalar[] => Array_isArray(_) && _.length > 0)(x)
}

export function isRef(x: unknown): x is Ref {
  return has('$ref', (_) => typeof _ === 'string')(x)
}

export function isUnknown(x: unknown): x is Unknown {
  if (!x || typeof x !== 'object') return false
  else return !('type' in x)
    && !('allOf' in x)
    && !('anyOf' in x)
    && !('oneOf' in x)
    && !('enum' in x)
    && !('const' in x)
}

export function isNull(x: unknown): x is Null {
  return has('type', (_) => _ === 'null')(x)
}

export function isInteger(x: unknown): x is Integer {
  return has('type', (_) => _ === 'integer')(x)
}

export function isBoolean(x: unknown): x is Boolean {
  return has('type', (_) => _ === 'boolean')(x)
}

export function isNumber(x: unknown): x is Number {
  return has('type', (_) => _ === 'number')(x)
}

export function isString(x: unknown): x is String {
  return has('type', (_) => _ === 'string')(x)
}

export function isArray<T>(x: F<T>): x is Array<T>
export function isArray<T>(x: unknown): x is Array<T>
export function isArray<T>(x: unknown): x is Array<T> {
  return has('type', (_) => _ === 'array')(x)
    && !has('prefixItems')(x)
}

export function isTuple<T>(x: F<T>): x is Tuple<T>
export function isTuple<T>(x: unknown): x is Tuple<T>
export function isTuple<T>(x: unknown): x is Tuple<T> {
  return has('type', (_) => _ === 'array')(x)
    && has('prefixItems')(x)
}

export function isObject<T>(x: F<T>): x is Object<T>
export function isObject<T>(x: unknown): x is Object<T>
export function isObject<T>(x: unknown): x is Object<T> {
  return has('type', (_) => _ === 'object')(x)
    && !has('additionalProperties')(x)
    && !has('patternProperties')(x)
}

export function isRecord<T>(x: F<T>): x is Record<T>
export function isRecord<T>(x: unknown): x is Record<T>
export function isRecord<T>(x: unknown): x is Record<T> {
  return has('type', (_) => _ === 'object')(x)
    && (has('additionalProperties')(x) || has('patternProperties')(x))
}

export function isUnion<T>(x: F<T>): x is Union<T>
export function isUnion<T>(x: unknown): x is Union<T>
export function isUnion<T>(x: unknown): x is Union<T> {
  return has('anyOf', Array_isArray)(x)
}

export function isIntersection<T>(x: F<T>): x is Intersection<T>
export function isIntersection<T>(x: unknown): x is Intersection<T>
export function isIntersection<T>(x: unknown): x is Intersection<T> {
  return has('allOf', Array_isArray)(x)
}

export function isNullary(x: unknown): x is Nullary {
  return isNever(x)
    || isNull(x)
    || isBoolean(x)
    || isInteger(x)
    || isNumber(x)
    || isString(x)
    || isEnum(x)
    || (isConst(x) && isShowable(x.const))
}

export function isUnary<T>(x: F<T>): x is Unary<T>
export function isUnary<T>(x: unknown): x is Unary<T>
export function isUnary<T>(x: unknown): x is Unary<T> {
  return isArray(x)
    || isTuple(x)
    || isObject(x)
    || isRecord(x)
    || isUnion(x)
    || isIntersection(x)
}
