import * as typebox from '@sinclair/typebox'
import type * as T from '@traversable/registry'
import { fn, Number_isFinite, Number_isNatural, Number_isSafeInteger, Object_entries, parseKey } from '@traversable/registry'

import type { Type } from './functor.js'

export type Options = {
  initialOffset?: number
  maxWidth?: number
  namespaceAlias?: string
}

interface Config extends Required<Options> {}

const defaults = {
  initialOffset: 0,
  maxWidth: 99,
  namespaceAlias: 'typebox',
} satisfies Config

export function parseOptions(options?: Options): Config
export function parseOptions({
  initialOffset = defaults.initialOffset,
  maxWidth = defaults.maxWidth,
  namespaceAlias = defaults.namespaceAlias,
}: Options = defaults) {
  return {
    initialOffset,
    maxWidth,
    namespaceAlias,
  }
}

// function stringFromTypebox_(options?: Options): T.IndexedAlgebra<Index, Type.Free, string> {
//   const $ = parseOptions(options)
//   const { namespaceAlias: Type, initialOffset: OFF, maxWidth: MAX_WIDTH } = $
//   return fold((x, ix) => {
//     const { depth } = ix
//     const OFFSET = OFF + depth * 2
//     const JOIN = ',\n' + '  '.repeat(depth + 1)
//     switch (true) {
//       default: return fn.exhaustive(x)
//       case x[typebox.Kind] === 'Never': return `${Type}.Never()`
//       case x[typebox.Kind] === 'Any': return `${Type}.Any()`
//       case x[typebox.Kind] === 'Unknown': return `${Type}.Unknown()`
//       case x[typebox.Kind] === 'Void': return `${Type}.Void()`
//       case x[typebox.Kind] === 'Null': return `${Type}.Null()`
//       case x[typebox.Kind] === 'Undefined': return `${Type}.Undefined()`
//       case x[typebox.Kind] === 'Symbol': return `${Type}.Symbol()`
//       case x[typebox.Kind] === 'Boolean': return `${Type}.Boolean()`
//       case x[typebox.Kind] === 'Literal': return `${Type}.Literal(${x.const})`
//       case x[typebox.Kind] === 'Integer': {
//         const bounds = [
//           Number_isSafeInteger(x.minimum) ? `minimum: ${x.minimum}` : null,
//           Number_isSafeInteger(x.maximum) ? `maximum: ${x.maximum}` : null,
//         ].filter((_) => _ !== null)
//         const BOUNDS = bounds.length === 0 ? '' : `{ ${bounds.join(', ')} }`
//         return `${Type}.Integer(${BOUNDS})`
//       }
//       case x[typebox.Kind] === 'BigInt': {
//         const bounds = [
//           typeof x.minimum === 'bigint' ? `minimum: ${x.minimum}` : null,
//           typeof x.maximum === 'bigint' ? `maximum: ${x.maximum}` : null,
//         ].filter((_) => _ !== null)
//         const BOUNDS = bounds.length === 0 ? '' : `{ ${bounds.join(', ')} }`
//         return `${Type}.BigInt(${BOUNDS})`
//       }
//       case x[typebox.Kind] === 'Number': {
//         const bounds = [
//           Number_isFinite(x.exclusiveMinimum) ? `exclusiveMinimum: ${x.exclusiveMinimum}` : null,
//           Number_isFinite(x.exclusiveMaximum) ? `exclusiveMaximum: ${x.exclusiveMaximum}` : null,
//           Number_isFinite(x.minimum) ? `minimum: ${x.minimum}` : null,
//           Number_isFinite(x.maximum) ? `maximum: ${x.maximum}` : null,
//         ].filter((_) => _ !== null)
//         const BOUNDS = bounds.length === 0 ? '' : `{ ${bounds.join(', ')} }`
//         return `${Type}.Number(${BOUNDS})`
//       }
//       case x[typebox.Kind] === 'String': {
//         const bounds = [
//           Number_isNatural(x.minLength) ? `minLength: ${x.minLength}` : null,
//           Number_isNatural(x.maxLength) ? `maxLength: ${x.maxLength}` : null,
//         ].filter((_) => _ !== null)
//         const BOUNDS = bounds.length === 0 ? '' : `{ ${bounds.join(', ')} }`
//         return `${Type}.String(${BOUNDS})`
//       }
//       case x[typebox.Kind] === 'Array': {
//         const bounds = [
//           Number_isNatural(x.minItems) ? `minItems: ${x.minItems}` : null,
//           Number_isNatural(x.maxItems) ? `maxItems: ${x.maxItems}` : null,
//         ].filter((_) => _ !== null)
//         const BOUNDS = bounds.length === 0 ? '' : `, { ${bounds.join(', ')} }`
//         const SINGLE_LINE = `${Type}.Array(${x.items}${BOUNDS})`
//         if (!FORMAT) return SINGLE_LINE
//         else {
//           const WIDTH = OFFSET + SINGLE_LINE.length
//           const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
//           return !IS_MULTI_LINE
//             ? SINGLE_LINE
//             : `${Type}.Array(`
//             + '\n'
//             + ' '.repeat(OFFSET + 2)
//             + x.items
//             + '\n'
//             + ' '.repeat(OFFSET + 0)
//             + `)`
//         }
//       }
//       case x[typebox.Kind] === 'Optional': {
//         const SINGLE_LINE = ix.isProperty
//           ? `${Type}.Optional(${x.schema})`
//           : `${Type}.Union([${Type}.Undefined(), ${x.schema}])`
//         if (!FORMAT) return SINGLE_LINE
//         else {
//           const WIDTH = OFFSET + SINGLE_LINE.length
//           const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
//           return !IS_MULTI_LINE
//             ? SINGLE_LINE
//             : ix.isProperty
//               ? `${Type}.Optional(`
//               + '\n'
//               + ' '.repeat(OFFSET + 2)
//               + x.schema
//               + '\n'
//               + ' '.repeat(OFFSET + 0)
//               + `)`
//               : `${Type}.Union([`
//               + '\n'
//               + ' '.repeat(OFFSET + 2)
//               + `${Type}.Undefined(),`
//               + '\n'
//               + ' '.repeat(OFFSET + 2)
//               + x.schema
//               + '\n'
//               + ' '.repeat(OFFSET + 0)
//               + `])`
//         }
//       }
//       case x[typebox.Kind] === 'Record': {
//         const SINGLE_LINE = `${Type}.Record(${Type}.String(), ${x.patternProperties['^(.*)$']})`
//         if (!FORMAT) return SINGLE_LINE
//         else {
//           const WIDTH = OFFSET + SINGLE_LINE.length
//           const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
//           return !IS_MULTI_LINE
//             ? SINGLE_LINE
//             : `${Type}.Record(`
//             + '\n'
//             + ' '.repeat(OFFSET + 2)
//             + `${Type}.String(),`
//             + '\n'
//             + ' '.repeat(OFFSET + 2)
//             + x.patternProperties['^(.*)$']
//             + '\n'
//             + ' '.repeat(OFFSET + 0)
//             + `)`
//         }
//       }
//       case 'anyOf' in x: {
//         const SINGLE_LINE = `${Type}.Union([${x.anyOf.join(', ')}])`
//         if (!FORMAT) return SINGLE_LINE
//         else {
//           const WIDTH = OFFSET + SINGLE_LINE.length
//           const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
//           return !IS_MULTI_LINE
//             ? SINGLE_LINE
//             : `${Type}.Union([`
//             + '\n'
//             + ' '.repeat(OFFSET + 2)
//             + x.anyOf.join(JOIN)
//             + '\n'
//             + ' '.repeat(OFFSET + 0)
//             + `])`
//         }
//       }
//       case 'allOf' in x: {
//         const SINGLE_LINE = `${Type}.Intersect([${x.allOf.join(', ')}])`
//         if (!FORMAT) return SINGLE_LINE
//         else {
//           const WIDTH = OFFSET + SINGLE_LINE.length
//           const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
//           return !IS_MULTI_LINE
//             ? SINGLE_LINE
//             : `${Type}.Intersect([`
//             + '\n'
//             + ' '.repeat(OFFSET + 2)
//             + x.allOf.join(JOIN)
//             + '\n'
//             + ' '.repeat(OFFSET + 0)
//             + `])`
//         }
//       }
//       case x[typebox.Kind] === 'Tuple': {
//         const SINGLE_LINE = `${Type}.Tuple([${x.items.join(', ')}])`
//         if (!FORMAT) return SINGLE_LINE
//         else {
//           const WIDTH = OFFSET + SINGLE_LINE.length
//           const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
//           return !IS_MULTI_LINE
//             ? SINGLE_LINE
//             : `${Type}.Tuple([`
//             + '\n'
//             + ' '.repeat(OFFSET + 2)
//             + x.items.join(JOIN)
//             + '\n'
//             + ' '.repeat(OFFSET + 0)
//             + `])`
//         }
//       }
//       case x[typebox.Kind] === 'Object': {
//         const BODY = Object_entries(x.properties).map(([k, v]) => parseKey(k) + ': ' + v)
//         if (BODY.length === 0) return `${Type}.Object({})`
//         else {
//           const SINGLE_LINE = `${Type}.Object({ ${BODY.join(', ')} })`
//           if (!FORMAT) return SINGLE_LINE
//           else {
//             const WIDTH = OFFSET + SINGLE_LINE.length
//             const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
//             return !IS_MULTI_LINE
//               ? SINGLE_LINE
//               : `${Type}.Object({`
//               + '\n'
//               + ' '.repeat(OFFSET + 2)
//               + BODY.join(JOIN)
//               + '\n'
//               + ' '.repeat(OFFSET + 0)
//               + `})`
//           }
//         }
//       }
//     }
//   })
// }

// export function stringFromTypebox(
//   schema: typebox.TAnySchema,
//   options?: Options,
//   index?: t.Functor.Index
// ): string
// export function stringFromTypebox(
//   schema: typebox.TAnySchema,
//   options: Options = defaults,
//   index: t.Functor.Index = defaultIndex
// ): string {
//   return stringFromTypebox_(options)(
//     preprocessTypeboxSchema(schema, index),
//     index,
//   )
// }

// export function stringFromJson(json: Json, options?: Options, initialIndex?: Json.Functor.Index): string
// export function stringFromJson(json: Json, options: Options = defaults, initialIndex: Json.Functor.Index = Json.defaultIndex) {
//   const $ = parseOptions(options)
//   const { namespaceAlias: typebox, initialOffset: OFF, maxWidth: MAX_WIDTH } = $
//   return Json.foldWithIndex<string>((x, ix) => {
//     const { depth } = ix
//     const OFFSET = OFF + depth * 2
//     const JOIN = ',\n' + ' '.repeat(OFFSET + 2)
//     switch (true) {
//       default: return fn.exhaustive(x)
//       case x == null: return `${typebox}.Null()`
//       case x === true:
//       case x === false:
//       case typeof x === 'number': return `${typebox}.Literal(${x})`
//       case typeof x === 'string': return `${typebox}.Literal("${escape(x)}")`
//       case Json.isArray(x): {
//         if (x.length === 0) return `${typebox}.Tuple([])`
//         else {
//           const SINGLE_LINE = `${typebox}.Tuple([${x.join(', ')}])`
//           if (!FORMAT) return SINGLE_LINE
//           else {
//             const WIDTH = OFFSET + SINGLE_LINE.length
//             const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
//             return !IS_MULTI_LINE
//               ? SINGLE_LINE
//               : `${typebox}.Tuple([`
//               + '\n'
//               + ' '.repeat(OFFSET + 2)
//               + x.join(JOIN)
//               + '\n'
//               + ' '.repeat(OFFSET + 0)
//               + `])`
//           }
//         }
//       }
//       case Json.isObject(x): {
//         const BODY = Object.entries(x).map(([k, v]) => `${parseKey(k)}: ${v}`)
//         if (BODY.length === 0) return `${typebox}.Object({})`
//         else {
//           const SINGLE_LINE = `${typebox}.Object({ ${BODY.join(', ')} })`
//           if (!FORMAT) return SINGLE_LINE
//           else {
//             const WIDTH = OFFSET + SINGLE_LINE.length
//             const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
//             return !IS_MULTI_LINE
//               ? SINGLE_LINE
//               : `${typebox}.Object({`
//               + '\n'
//               + ' '.repeat(OFFSET + 2)
//               + BODY.join(JOIN)
//               + '\n'
//               + ' '.repeat(OFFSET + 0)
//               + `})`
//           }
//         }
//       }
//     }
//   })(json, initialIndex)
// }
