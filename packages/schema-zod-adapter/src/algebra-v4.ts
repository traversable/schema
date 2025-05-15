import { z } from 'zod4'
import { fn } from '@traversable/registry'
import * as F from './functor-v4.js'
import { tagged } from './typename-v4.js'

/** @internal */
const readonly = (x: z.core.$ZodType) => tagged('readonly', x) ? x : z.readonly(x)

/** @internal */
const optional = (x: z.core.$ZodType) => tagged('optional', x) ? x : z.optional(x)

/** @internal */
const nullable = (x: z.core.$ZodType) => tagged('nullable', x) ? x._zod.def.innerType : z.nullable(x)

export const deepNullable = F.lift(nullable)

export const deepPartial = F.lift((x: z.core.$ZodType) => !tagged('object', x) ? x : z.object(fn.map(x._zod.def.shape, optional)))

export const deepReadonly = F.lift((x: z.core.$ZodType) => {
  switch (true) {
    default: return x
    case tagged('readonly', x): return x
    case tagged('map', x): return z.map(readonly(x._zod.def.keyType), readonly(x._zod.def.valueType))
    case tagged('set', x): return z.set(readonly(x._zod.def.valueType))
    case tagged('array', x): return z.array(readonly(x._zod.def.element))
    case tagged('object', x): return z.object(fn.map(x._zod.def.shape, readonly))
    case tagged('tuple', x): return !x._zod.def.rest
      ? z.tuple(fn.map(x._zod.def.items, readonly))
      : z.tuple(fn.map(x._zod.def.items, readonly), readonly(x._zod.def.rest))
  }
})
