import * as z from 'zod'
import { F, tagged } from '@traversable/zod-types'
import { fn } from '@traversable/registry'

const DASH = new RegExp('[-_]', 'g')
const DASH_BOUNDARY = new RegExp('([-_][a-z])', 'g')
const WORD_BOUNDARY = new RegExp('([a-z])([A-Z])', 'g')

export function camelCase(x: string) {
  return x.replace(DASH_BOUNDARY, (c) => c.toUpperCase().replace(DASH, ''))
}

export function snakeCase(x: string) {
  return x.replace(WORD_BOUNDARY, "$1_$2").toLowerCase()
}

export type ConvertCase = {
  decodeKeys(k: string): string,
  encodeKeys(k: string): string
}

export function convertCaseCodec({ decodeKeys, encodeKeys }: ConvertCase): <T extends z.ZodType>(type: T) => z.ZodType
export function convertCaseCodec({ decodeKeys, encodeKeys }: ConvertCase): <T extends z.core.$ZodType>(type: T) => z.core.$ZodType
export function convertCaseCodec({ decodeKeys, encodeKeys }: ConvertCase) {
  const decode = <T>(x: { [k: string]: T }) => Object.fromEntries(Object.entries(x).map(([k, v]) => [decodeKeys(k), v]))
  const encode = <T>(x: { [k: string]: T }) => Object.fromEntries(Object.entries(x).map(([k, v]) => [encodeKeys(k), v]))
  return F.fold<z.core.$ZodType>((x, _, original) => {
    switch (true) {
      case tagged('object')(x) && tagged('object', original): {
        const { shape, catchall } = original._zod.def
        const encoder = !catchall
          ? z.object(encode(fn.map(shape, (v) => z.clone(v, v._zod.def))))
          : z.object(encode(fn.map(shape, (v) => z.clone(v, v._zod.def)))).catchall(catchall)
        const decoder = !catchall
          ? z.object(decode(x._zod.def.shape))
          : z.object(decode(x._zod.def.shape)).catchall(catchall)
        return z.codec(encoder, decoder, { decode, encode })
      }
      case tagged('transform')(x): return x as never
      default: return z.clone(original, x._zod.def as z.core.$ZodTypeDef)
    }
  })
}

export const deepSnakeCaseCodec = convertCaseCodec({ decodeKeys: snakeCase, encodeKeys: camelCase })
export const deepCamelCaseCodec = convertCaseCodec({ decodeKeys: camelCase, encodeKeys: snakeCase })
