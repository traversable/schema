import { z } from 'zod4'
import { has, Object_keys } from '@traversable/registry'

import type { Z } from './functor-v4.js'

export { typeOf as typeof }
/** 
 * ## {@link typeOf `v4.typeof`}
 * 
 * Extract the type (previously called 'typeName') from a zod@4 schema.
 */
const typeOf
    : <S extends z.ZodType>(schema: S) => S["_zod"]["def"]["type"]
    = (schema) => schema._zod.def.type

export type AnyTag = Exclude<z.ZodType['_zod']['def']['type'], 'interface'>
export type Tag = { [K in AnyTag]: K }
export const Tag = {
    any: 'any',
    array: 'array',
    bigint: 'bigint',
    boolean: 'boolean',
    catch: 'catch',
    custom: 'custom',
    date: 'date',
    default: 'default',
    enum: 'enum',
    file: 'file',
    int: 'int',
    intersection: 'intersection',
    lazy: 'lazy',
    literal: 'literal',
    map: 'map',
    nan: 'nan',
    never: 'never',
    nonoptional: 'nonoptional',
    null: 'null',
    nullable: 'nullable',
    number: 'number',
    object: 'object',
    optional: 'optional',
    pipe: 'pipe',
    promise: 'promise',
    readonly: 'readonly',
    record: 'record',
    set: 'set',
    string: 'string',
    success: 'success',
    symbol: 'symbol',
    template_literal: 'template_literal',
    transform: 'transform',
    tuple: 'tuple',
    undefined: 'undefined',
    union: 'union',
    unknown: 'unknown',
    void: 'void',
} satisfies Tag

export const tagged
    : <K extends keyof Tag>(tag: K) => <S>(u: unknown) => u is Z.lookup<K, S>
    = (tag) => has('_zod', 'def', 'type', (x): x is never => x === tag) as never

export type TypeName = z.ZodType['_zod']['def']['type']
export const TypeName = {
    ///////////////////////////
    ///    nullary          ///
    any: 'any',
    bigint: 'bigint',
    boolean: 'boolean',
    date: 'date',
    file: 'file',
    int: 'int',
    nan: 'nan',
    never: 'never',
    null: 'null',
    number: 'number',
    string: 'string',
    symbol: 'symbol',
    undefined: 'undefined',
    unknown: 'unknown',
    void: 'void',
    ///    nullary          ///
    ///////////////////////////
    ///    values           ///
    enum: 'enum',
    literal: 'literal',
    template_literal: 'template_literal',
    ///    values           ///
    ///////////////////////////
    ///    unary            ///
    array: 'array',
    nonoptional: 'nonoptional',
    nullable: 'nullable',
    optional: 'optional',
    readonly: 'readonly',
    set: 'set',
    success: 'success',
    ///    unary            ///
    ///////////////////////////
    ///    applicative      ///
    object: 'object',
    tuple: 'tuple',
    union: 'union',
    ///    applicative      ///
    ///////////////////////////
    ///    binary-like      ///
    catch: 'catch',
    default: 'default',
    ///    binary-like      ///
    ///////////////////////////
    ///    binary           ///
    intersection: 'intersection',
    map: 'map',
    pipe: 'pipe',
    record: 'record',
    ///    binary           ///
    ///////////////////////////
    ///    special cases    ///
    custom: 'custom',
    lazy: 'lazy',
    transform: 'transform',
    ///    special cases    ///
    ///////////////////////////
    ///    deprecated       ///
    /** @deprecated */
    interface: 'interface',
    /** @deprecated */
    promise: 'promise',
    ///    deprecated       ///
    ///////////////////////////
} as const satisfies { [K in TypeName]: K }

export const TypeNames = Object_keys(TypeName)
