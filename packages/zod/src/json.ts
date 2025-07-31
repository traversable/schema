import { z } from 'zod'
import type { Mut, Primitive, Showable } from '@traversable/registry'
import { fn } from '@traversable/registry'
import { Json } from '@traversable/json'

/**
 * ## {@link fromConstant `zx.fromConstant`}
 * 
 * Convert a blob of JSON data into a zod schema that represents that blob's least upper bound.
 * 
 * @example
 * import { zx } from '@traversable/zod'
 * 
 * let schema = zx.fromConstant({ abc: 'ABC', def: [1, 2, 3] })
 * //  ^? let schema: z.ZodType<{ abc: "ABC", def: [1, 2, 3] }>
 * 
 * console.log(zx.toString(schema))
 * // => 
 * // z.object({
 * //   abc: z.literal("ABC"),
 * //   def: z.tuple([
 * //     z.literal(1),
 * //     z.literal(2),
 * //     z.literal(3)
 * //   ]) 
 * // })
 */

export const fromConstant: {
  <S extends Mut<S>>(term: S): z.ZodType<S>
} = <never>Json.fold<z.ZodType>((x) => {
  switch (true) {
    default: return fn.exhaustive(x)
    case x === undefined:
    case x === null:
    case x === true:
    case x === false:
    case typeof x === 'symbol':
    case typeof x === 'number':
    case typeof x === 'string': return z.literal(x)
    case Json.isObject(x): return z.strictObject(x)
    case Json.isArray(x): return z.tuple(x as [])
  }
})

/**
 * ## {@link fromJson `zx.fromJson`}
 * 
 * Convert a blob of JSON data into a zod schema that represents that blob's greatest lower bound.
 * 
 * @example
 * import { zx } from '@traversable/zod'
 * 
 * let ex_01 = zx.fromJson({ abc: 'ABC', def: [] })
 * //  ^? let ex_01: z.ZodObject<{ abc: z.ZodString, def: z.ZodArray<z.ZodUnknown> }>
 * 
 * console.log(zx.toString(ex_01))
 * // => 
 * // z.object({
 * //   abc: z.string(),
 * //   def: z.array(z.unknown()), 
 * // })
 * 
 * let ex_02 = zx.fromJson({ abc: false, def: [123] })
 * //  ^? let ex_02: z.ZodObject<{ abc: z.ZodBoolean, def: z.ZodArray<z.ZodNumber> }>
 * 
 * console.log(zx.toString(ex_02))
 * // => 
 * // z.object({
 * //   abc: z.boolean(),
 * //   def: z.array(z.number()), 
 * // })
 * 
 * let ex_03 = zx.fromJson({ abc: 123, def: ['ABC', null] })
 * //  ^? let ex_02: z.ZodObject<{ abc: z.ZodNumber, def: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNull]>> }>
 * 
 * console.log(zx.toString(ex_03))
 * // => 
 * // z.object({
 * //   abc: z.number(),
 * //   def: z.array(z.union([z.string(), z.null()])), 
 * // })
 */

export const fromJson: {
  <S extends Mut<S>, T = fromJson<S>>(term: S): T
} = <never>Json.fold<z.ZodType>((x) => {
  switch (true) {
    default: return fn.exhaustive(x)
    case x == null: return z.null()
    case x === true: return z.boolean()
    case x === false: return z.boolean()
    case typeof x === 'number': return z.number()
    case typeof x === 'string': return z.string()
    case Json.isObject(x): return z.looseObject(x)
    case Json.isArray(x): {
      switch (x.length) {
        case 0: return z.array(z.unknown())
        case 1: return z.array(x[0])
        default: return z.array(z.union(x))
      }
    }
  }
})

export type fromJson<T>
  = [T] extends [readonly []] ? z.ZodArray<z.ZodUnknown>
  : [T] extends [readonly [any]] ? z.ZodArray<fromJson<T[0]>>
  : [T] extends [readonly any[]] ? z.ZodArray<z.ZodUnion<{ [K in keyof T]: fromJson<T[K]> }>>
  : [T] extends [Record<string, any>] ? z.ZodObject<{ [K in keyof T]: fromJson<T[K]> }, z.core.$loose>
  : [T] extends [null | undefined] ? z.ZodNull
  : [T] extends [boolean] ? z.ZodBoolean
  : [T] extends [number] ? z.ZodNumber
  : [T] extends [string] ? z.ZodString
  : never


// import type * as T from '@traversable/registry'
// import { fn, Number_isSafeInteger, Number_isNaN, parseKey, Print } from '@traversable/registry'
// import type { ZodType } from './utils.js'
// import * as F from './functor.js'

// let WriteableSchemaConfig: WriteableSchemaBuilder.Config = { format: false, namespaceAlias: 'z' }
// let { namespaceAlias: z } = WriteableSchemaConfig

// /** @internal */
// const Lit = (data: T.Showable) => z.literal(data)

// /** @internal */
// const parseShape = (shape: Record<string, string>): string[] => Object.entries(shape).map(([k, v]) => parseKey(k) + ': ' + v)

// export type Target<T> = never | {
//   null?(data: null | undefined, index: { path: (string | number)[], depth: number }): T
//   boolean?(data: boolean, index: { path: (string | number)[], depth: number }): T
//   nan?(data: number, index: { path: (string | number)[], depth: number }): T
//   int?(data: number, index: { path: (string | number)[], depth: number }): T
//   number?(data: number, index: { path: (string | number)[], depth: number }): T
//   string?(data: string, index: { path: (string | number)[], depth: number }): T
//   object?(shape: Record<string, T>, index: { path: (string | number)[], depth: number }): T
//   array?(items: readonly T[], index: { path: (string | number)[], depth: number }): T
//   mapValue?(value: T, index: { path: (string | number)[], depth: number }, data: Record<string, T>): T
//   mapItem?(item: T, index: { path: (string | number)[], depth: number }, data: readonly T[]): T
// }

// SchemaBuilder.defaults = {
//   ...Json.defaultIndex,
//   null: () => zod.null(),
//   boolean: () => zod.boolean(),
//   nan: () => zod.number(),
//   int: () => zod.number(),
//   number: () => zod.number(),
//   string: () => zod.string(),
//   object: (zs) => zod.object(zs),
//   array: ([z, ...zs]) =>
//     z === undefined ? zod.unknown().array()
//       // TODO: fix `as any`
//       : zs.length === 0 ? (z as any).array()
//         : zod.union([z, ...zs]).array(),
//   mapItem: fn.identity,
//   mapValue: fn.identity,
// } satisfies Required<SchemaBuilder.Options>

// WriteableSchemaBuilder.defaults = {
//   ...Json.defaultIndex,
//   ...WriteableSchemaConfig,
//   mapItem: fn.identity,
//   mapValue: fn.identity,
//   null: () => `${z}.null()`,
//   boolean: () => `${z}.boolean()`,
//   nan: () => `${z}.nan()`,
//   int: () => `${z}.number().int()`,
//   number: () => `${z}.number()`,
//   string: () => `${z}.string()`,
//   array: (zs, { depth }) =>
//     zs.length === 0 ? `${z}.unknown().array()`
//       : zs.length === 1 ? `${zs[0]}.array()`
//         : !WriteableSchemaConfig.format ? `${z}.union([${zs.join(', ')}]).array()`
//           : Print.lines({ indent: depth * 2 })(`${z}.union([`, zs.join(', '), `]).array()`),
//   object: (zs, { depth }) =>
//     !WriteableSchemaConfig.format ? `${z}.object({${parseShape(zs)}})`
//       : Print.lines({ indent: depth * 2 })(`${z}.object({`, ...parseShape(zs), `})`),
// } satisfies Required<WriteableSchemaBuilder.Options>

// export const toSchema = SchemaBuilder()

// export const toWriteableSchema = WriteableSchemaBuilder()

// export const toLooseSchema = SchemaBuilder({
//   object: (shape) => zod.looseObject(shape),
// })

// export const toWriteableLooseSchema = WriteableSchemaBuilder({
//   object: (zs, { depth }) =>
//     !WriteableSchemaConfig.format ? `${z}.looseObject({${parseShape(zs)}})`
//       : Print.lines({ indent: depth * 2 })(`${z}.looseObject({`, ...parseShape(zs), `})`),
// })

// export const toStrictSchema = SchemaBuilder({
//   nan: () => zod.nan(),
//   int: () => zod.number().int(),
//   object: (zs) => zod.strictObject(zs),
// })

// export const toWriteableStrictSchema = WriteableSchemaBuilder({
//   nan: () => `${z}.nan()`,
//   int: () => `${z}.number().int()`,
//   object: (zs, { depth }) =>
//     !WriteableSchemaConfig.format ? `${z}.strictObject({${parseShape(zs)}})`
//       : Print.lines({ indent: depth * 2 })(`${z}.strictObject({`, ...parseShape(zs), `})`),
// })

// export const toExactSchema = SchemaBuilder({
//   nan: () => zod.nan(),
//   null: Lit,
//   boolean: Lit,
//   int: Lit,
//   number: Lit,
//   string: Lit,
//   array: ([z, ...zs]) => z === undefined ? zod.tuple([]) : zod.tuple([z, ...zs]),
//   object: (zs) => zod.strictObject(zs),
// })

// export const toWriteableExactSchema = WriteableSchemaBuilder({
//   nan: () => `${z}.nan()`,
//   null: () => `${z}.null()`,
//   boolean: () => `${z}.boolean()`,
//   int: () => `${z}.number().int()`,
//   number: () => `${z}.number()`,
//   string: () => `${z}.string()`,
//   array: (zs, { depth }) => zs.length === 0 ? `${z}.tuple([])`
//     : !WriteableSchemaConfig.format ? `${z}.tuple([` + zs.join(', ') + `])`
//       : Print.lines({ indent: depth * 2 })(`${z}.tuple([`, zs.join(', '), `])`),
//   object: (zs, { depth }) =>
//     !WriteableSchemaConfig.format ? `${z}.strictObject({${parseShape(zs)}})`
//       : Print.lines({ indent: depth * 2 })(`${z}.strictObject({`, ...parseShape(zs), `})`),
// })


// export declare namespace SchemaBuilder {
//   interface Options extends Target<ZodType>, Partial<SchemaBuilder.Index> {}
//   type Index = {
//     path: (string | number)[]
//     depth: number
//   }
// }


// /** 
//  * ## {@link SchemaBuilder `v4.SchemaBuilder`}
//  * 
//  * Build a zod schema from the shape of a JSON value.
//  * 
//  * Compared to {@link schemaFromConstant `v4.schemaFromConstant`}, {@link schemaFromJson `schemaFromJson`} interpret
//  * JSON nodes as a "hint" to make a best effort guess
//  * 
//  * See example below to get an intuition for its behavior.
//  * 
//  * See also:
//  * - {@link schemaFromConstant `v4.schemaFromConstant`}
//  * - {@link stringifiedSchemaFromJson `v4.stringifiedSchemaFromJson`}
//  * 
//  * @example
//  * import { v4 } from '@traversable/schema-zod-adapter'
//  * 
//  * const MySchema = v4.fromJson({
//  *   ABC: { DEF: null },
//  *   GHI: [false, 1, 'two'],
//  *   JKL: []
//  * })
//  * 
//  * console.log(v4.toString(MySchema)) 
//  * // =>
//  * // z.object({
//  * //   ABC: z.object({ DEF: z.null() }),
//  * //   DEF: z.union([z.boolean(), z.number(), z.string()]).array(),
//  * //   JKL: z.unknown().array()
//  * // })
//  */

// export function SchemaBuilder(options?: SchemaBuilder.Options): (json: Json) => ZodType
// export function SchemaBuilder({
//   null: z_null = SchemaBuilder.defaults.null,
//   nan: z_nan = SchemaBuilder.defaults.nan,
//   boolean: z_boolean = SchemaBuilder.defaults.boolean,
//   int: z_int = SchemaBuilder.defaults.int,
//   number: z_number = SchemaBuilder.defaults.number,
//   string: z_string = SchemaBuilder.defaults.string,
//   object: z_object = SchemaBuilder.defaults.object,
//   array: z_array = SchemaBuilder.defaults.array,
//   mapItem = SchemaBuilder.defaults.mapItem,
//   mapValue = SchemaBuilder.defaults.mapValue,
//   path: rootPath = SchemaBuilder.defaults.path,
//   depth: rootDepth = SchemaBuilder.defaults.depth,
// }: SchemaBuilder.Options = SchemaBuilder.defaults) {
//   return (json: Json) => Json.foldWithIndex<ZodType>((data, index) => {
//     switch (true) {
//       default: return fn.exhaustive(data)
//       case data == null: return z_null(data, index)
//       case Number_isNaN(data): return z_nan(data, index)
//       case Number_isSafeInteger(data): return z_int(data, index)
//       case typeof data === 'number': return z_number(data, index)
//       case typeof data === 'boolean': return z_boolean(data, index)
//       case typeof data === 'string': return z_string(data, index)
//       case Json.isObject(data): return z_object(fn.map(data, (v, k) => mapValue(v, { depth: index.depth + 1, path: [...index.path, k] }, data)), index)
//       case Json.isArray(data): return z_array(fn.map(data, (v, i) => mapItem(v, { depth: index.depth + 1, path: [...index.path, i] }, data)), index)
//     }
//   })(json, { path: rootPath, depth: rootDepth })
// }

// /** 
//  * ## {@link WriteableSchemaBuilder `v4.WriteableSchemaBuilder`}
//  * 
//  * Derive a stringified zod schema from an arbitrary
//  * [value object](https://en.wikipedia.org/wiki/Value_object). 
//  * 
//  * Originally used for codegen to make zod scemas compatible with the JSON Schema spec -- specifically, to support the
//  * [`const` keyword](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-00#rfc.section.6.1.3),
//  * added in [2020-12](https://json-schema.org/draft/2020-12/schema).
//  */
// export declare namespace WriteableSchemaBuilder {
//   interface Options extends
//     Target<string>,
//     Partial<WriteableSchemaBuilder.Index>,
//     Partial<WriteableSchemaBuilder.Config> {}
//   type Index = {
//     path: (string | number)[]
//     depth: number
//   }
//   type Config = {
//     format: boolean
//     namespaceAlias: string
//   }
// }

// export function WriteableSchemaBuilder({
//   array: z_array = WriteableSchemaBuilder.defaults.array,
//   boolean: z_boolean = WriteableSchemaBuilder.defaults.boolean,
//   depth = WriteableSchemaBuilder.defaults.depth,
//   format = WriteableSchemaConfig.format,
//   int: z_int = WriteableSchemaBuilder.defaults.int,
//   mapItem = WriteableSchemaBuilder.defaults.mapItem,
//   mapValue = WriteableSchemaBuilder.defaults.mapValue,
//   namespaceAlias: z = WriteableSchemaConfig.namespaceAlias,
//   nan: z_nan = WriteableSchemaBuilder.defaults.nan,
//   null: z_null = WriteableSchemaBuilder.defaults.null,
//   number: z_number = WriteableSchemaBuilder.defaults.number,
//   object: z_object = WriteableSchemaBuilder.defaults.object,
//   string: z_string = WriteableSchemaBuilder.defaults.string,
// }: WriteableSchemaBuilder.Options = WriteableSchemaBuilder.defaults): (json: Json) => string {
//   if (WriteableSchemaConfig.format !== format) void (WriteableSchemaConfig.format = format)
//   if (WriteableSchemaConfig.namespaceAlias !== z) void (WriteableSchemaConfig.namespaceAlias = z)
//   return (json: Json) => Json.foldWithIndex<string>((data, index) => {
//     switch (true) {
//       default: return fn.exhaustive(data)
//       case data == null: return z_null(data, index)
//       case Number_isNaN(data): return z_nan(data, index)
//       case Number_isSafeInteger(data): return z_int(data, index)
//       case typeof data === 'number': return z_number(data, index)
//       case typeof data === 'boolean': return z_boolean(data, index)
//       case typeof data === 'string': return z_string(data, index)
//       case Json.isObject(data): return z_object(fn.map(data, (v, k) => mapValue(v, { depth: index.depth + 1, path: [...index.path, k] }, data)), index)
//       case Json.isArray(data): return z_array(fn.map(data, (v, i) => mapItem(v, { depth: index.depth + 1, path: [...index.path, i] }, data)), index)
//     }
//   })(json, { depth, path: [] })
// }

// // json: Json, options?: Options, initialIndex?: Json.Functor.Index) => string
// // = (json, options = defaults, ix = Json.defaultIndex) => Json.foldWithIndex<string>((x, { depth }) => {
// //   const z = options.namespaceAlias ?? defaults.namespaceAlias
// //   switch (true) {
// //     default: return fn.exhaustive(x)
// //     case x === null:
// //     case x === undefined:
// //     case typeof x === 'boolean':
// //     case typeof x === 'number': return `${z}.literal(${String(x)})`
// //     case typeof x === 'string': return `${z}.literal("${x}")`
// //     case Json.isArray(x): return x.length === 0 ? `${z}.tuple([])` : Print.lines({ indent: depth * 2 })(`${z}.tuple([`, x.join(', '), `])`)
// //     case Json.isObject(x): return fn.pipe(
// //       Object.entries(x).map(([k, v]) => parseKey(k) + ': ' + v),
// //       (body) => body.length === 0 ? `${z}.object({})` : Print.lines({ indent: depth * 2 })(`${z}.object({`, ...body, `})`)
// //     )
// //   }
// // })(json, ix)


// // /** 
// //  * ## {@link schemaFromJson `v4.schemaFromJson`}
// //  * 
// //  * Infer a zod schema from the shape of a JSON value.
// //  * 
// //  * Compared to {@link schemaFromConstant `v4.schemaFromConstant`}, {@link schemaFromJson `schemaFromJson`} interpret
// //  * JSON nodes as a "hint" to make a best effort guess
// //  * 
// //  * See example below to get an intuition for its behavior.
// //  * 
// //  * See also:
// //  * - {@link schemaFromConstant `v4.schemaFromConstant`}
// //  * - {@link stringifiedSchemaFromJson `v4.stringifiedSchemaFromJson`}
// //  * 
// //  * @example
// //  * import { v4 } from '@traversable/schema-zod-adapter'
// //  * 
// //  * const MySchema = v4.fromJson({
// //  *   ABC: { DEF: null },
// //  *   GHI: [false, 1, 'two'],
// //  *   JKL: []
// //  * })
// //  * 
// //  * console.log(v4.toString(MySchema)) 
// //  * // =>
// //  * // z.object({
// //  * //   ABC: z.object({ DEF: z.null() }),
// //  * //   DEF: z.union([z.boolean(), z.number(), z.string()]).array(),
// //  * //   JKL: z.unknown().array()
// //  * // })
// //  */

// // const schemaFromJson = Json.fold<z.ZodType>(
// //   (x) => {
// //     switch (true) {
// //       default: return fn.exhaustive(x)
// //       case x == null:
// //       case x === true:
// //       case x === false:
// //       case typeof x === 'symbol':
// //       case typeof x === 'number':
// //       case typeof x === 'string': return z.literal(x)
// //       case Json.isObject(x): return z.strictObject(x)
// //       case Json.isArray(x): {
// //         if (x.length === 0) return z.unknown().array()
// //         else if (x.length === 1) return x[0].array()
// //         else return z.union(x).array()
// //       }
// //     }
// //   }
// // )

// // /** 
// //  * ## {@link toSchemaAsString `v4.toSchemaAsString`}
// //  * 
// //  * Derive a stringified zod schema from an arbitrary
// //  * [value object](https://en.wikipedia.org/wiki/Value_object). 
// //  * 
// //  * Originally used for codegen to make zod scemas compatible with the JSON Schema spec -- specifically, to support the
// //  * [`const` keyword](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-00#rfc.section.6.1.3),
// //  * added in [2020-12](https://json-schema.org/draft/2020-12/schema).
// //  */

// // const toSchemaAsString
// //   : (json: Json, options?: Options, initialIndex?: Json.Functor.Index) => string
// //   = (json, options = defaults, ix = Json.defaultIndex) => Json.foldWithIndex<string>((x, { depth }) => {
// //     const z = options.namespaceAlias ?? defaults.namespaceAlias
// //     switch (true) {
// //       default: return fn.exhaustive(x)
// //       case x === null:
// //       case x === undefined:
// //       case typeof x === 'boolean':
// //       case typeof x === 'number': return `${z}.literal(${String(x)})`
// //       case typeof x === 'string': return `${z}.literal("${x}")`
// //       case Json.isArray(x): return x.length === 0 ? `${z}.tuple([])` : Print.lines({ indent: depth * 2 })(`${z}.tuple([`, x.join(', '), `])`)
// //       case Json.isObject(x): return fn.pipe(
// //         Object.entries(x).map(([k, v]) => parseKey(k) + ': ' + v),
// //         (body) => body.length === 0 ? `${z}.object({})` : Print.lines({ indent: depth * 2 })(`${z}.object({`, ...body, `})`)
// //       )
// //     }
// //   })(json, ix)

// // // export const schemaFromUnknown
// // //   : (value: unknown) => z.core.$ZodType | undefined
// // //   = (value) => !Json.is(value) ? void 0 : schemaFromJson(value)


// // // export const fromJson: T.Functor.Algebra<Json.Free, z.core.$ZodType> = (x) => {
// // //   switch (true) {
// // //     default: return fn.exhaustive(x)
// // //     case x === null: return z.null()
// // //     case x === undefined: return z.undefined()
// // //     case typeof x === 'boolean': return z.boolean()
// // //     case typeof x === 'symbol': return z.symbol()
// // //     case typeof x === 'number': return z.number()
// // //     case typeof x === 'string': return z.string()
// // //     case Array_isArray(x):
// // //       return x.length === 0 ? z.tuple([]) : z.tuple([x[0], ...x.slice(1)])
// // //     case !!x && typeof x === 'object': return z.object(x)
// // //   }
// // // }
// // const toLooseSchema = Json.fold<z.ZodType>((x) => {
// //   switch (true) {
// //     default: return fn.exhaustive(x)
// //     case x == null: return z.null()
// //     case x === true:
// //     case x === false: return z.boolean()
// //     case typeof x === 'number': return z.number()
// //     case typeof x === 'string': return z.string(x)
// //     case Json.isObject(x): return z.looseObject(x)
// //     case Json.isArray(x): {
// //       if (x.length === 0) return z.unknown().array()
// //       else if (x.length === 1) return x[0].array()
// //       else return z.union(x).array()
// //     }
// //   }
// // })


// // /** 
// //  * ## {@link fromJsonLiteral `v4.fromJsonLiteral`}
// //  * 
// //  * Derive a zod schema from an arbitrary literal
// //  * [value object](https://en.wikipedia.org/wiki/Value_object). 
// //  * 
// //  * Used to make zod scemas compatible with the JSON Schema spec -- specifically, to support the
// //  * [`const` keyword](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-00#rfc.section.6.1.3),
// //  * added in [2020-12](https://json-schema.org/draft/2020-12/schema).
// //  * 
// //  * See also:
// //  * - {@link schemaFromJson `v4.schemaFromJson`}
// //  * - {@link fromJsonToStringifiedSchema `v4.fromJsonToStringifiedSchema`}
// //  */

// // const fromJsonLiteral: (json: Json) => z.core.$ZodType = Json.fold<z.core.$ZodType>(
// //   (x) => {
// //     switch (true) {
// //       default: return fn.exhaustive(x)
// //       case x == null:
// //       case x === true:
// //       case x === false:
// //       case typeof x === 'symbol':
// //       case typeof x === 'number':
// //       case typeof x === 'string': return z.literal(x)
// //       case Json.isArray(x): return x.length === 0 ? z.tuple([]) : z.tuple([x[0], ...x.slice(1)])
// //       case Json.isObject(x): return z.strictObject(x)
// //     }
// //   }
// // )
