import { z } from 'zod/v4'
import { fn, Object_entries, Object_values } from '@traversable/registry'
import * as F from './functor.js'
import { Sym, tagged } from './typename.js'
import type { Path } from './paths.js'

export const paths = F.fold<Path[]>((x) => {
  switch (true) {
    case tagged('transform')(x): { throw Error('todo: paths.transform') }
    default: return fn.exhaustive(x)
    // nullary
    case tagged('any')(x): return [[[], x._zod.def.type]]
    case tagged('bigint')(x): return [[[], x._zod.def.type]]
    case tagged('boolean')(x): return [[[], x._zod.def.type]]
    case tagged('date')(x): return [[[], x._zod.def.type]]
    case tagged('enum')(x): return [[[], x._zod.def.type]]
    case tagged('file')(x): return [[[], x._zod.def.type]]
    case tagged('literal')(x): return [[[], x._zod.def.type]]
    case tagged('nan')(x): return [[[], x._zod.def.type]]
    case tagged('never')(x): return [[[], x._zod.def.type]]
    case tagged('null')(x): return [[[], x._zod.def.type]]
    case tagged('number')(x): return [[[], x._zod.def.type]]
    case tagged('string')(x): return [[[], x._zod.def.type]]
    case tagged('symbol')(x): return [[[], x._zod.def.type]]
    case tagged('template_literal')(x): return [[[], x._zod.def.type]]
    case tagged('undefined')(x): return [[[], x._zod.def.type]]
    case tagged('unknown')(x): return [[[], x._zod.def.type]]
    case tagged('void')(x): return [[[], x._zod.def.type]]
    // unary
    case tagged('array')(x): return [[[Sym.array, ...x._zod.def.element[0][0]], x._zod.def.element[0][1]]]
    case tagged('catch')(x): return [[[Sym.catch, ...x._zod.def.innerType[0][0]], x._zod.def.innerType[0][1]]]
    case tagged('default')(x): return [[[Sym.default, ...x._zod.def.innerType[0][0]], x._zod.def.innerType[0][1]]]
    case tagged('lazy')(x): return [[[Sym.lazy, ...x._zod.def.getter()[0][0]], x._zod.def.getter()[0][1]]]
    case tagged('nonoptional')(x): return [[[Sym.nonoptional, ...x._zod.def.innerType[0][0]], x._zod.def.innerType[0][1]]]
    case tagged('nullable')(x): return [[[Sym.nullable, ...x._zod.def.innerType[0][0]], x._zod.def.innerType[0][1]]]
    case tagged('optional')(x): return [[[Sym.optional, ...x._zod.def.innerType[0][0]], x._zod.def.innerType[0][1]]]
    case tagged('prefault')(x): return [[[Sym.prefault, ...x._zod.def.innerType[0][0]], x._zod.def.innerType[0][1]]]
    case tagged('promise')(x): return [[[Sym.promise, ...x._zod.def.innerType[0][0]], x._zod.def.innerType[0][1]]]
    case tagged('readonly')(x): return [[[Sym.readonly, ...x._zod.def.innerType[0][0]], x._zod.def.innerType[0][1]]]
    case tagged('set')(x): return [[[Sym.set, ...x._zod.def.valueType[0][0]], x._zod.def.valueType[0][1]]]
    case tagged('success')(x): return [[[Sym.success, ...x._zod.def.innerType[0][0]], x._zod.def.innerType[0][1]]]
    case tagged('intersection')(x): return [
      [[Sym.intersectionLeft, ...x._zod.def.left[0][0]], x._zod.def.left[0][1]],
      [[Sym.intersectionRight, ...x._zod.def.right[0][0]], x._zod.def.right[0][1]],
    ]
    case tagged('map')(x): return [
      [[Sym.mapKey, ...x._zod.def.keyType[0][0]], x._zod.def.keyType[0][1]],
      [[Sym.mapValue, ...x._zod.def.valueType[0][0]], x._zod.def.valueType[0][1]],
    ]
    case tagged('record')(x): return [
      [[Sym.recordKey, ...x._zod.def.keyType[0][0]], x._zod.def.keyType[0][1]],
      [[Sym.recordValue, ...x._zod.def.valueType[0][0]], x._zod.def.valueType[0][1]],
    ]
    case tagged('pipe')(x): return [
      [[Sym.pipe, ...x._zod.def.in[0][0]], x._zod.def.in[0][1]],
      [[Sym.pipe, ...x._zod.def.out[0][0]], x._zod.def.out[0][1]],
    ]
    case tagged('object')(x): return Object_entries(x._zod.def.shape)
      .flatMap(([k, paths]) => paths.map<Path>(([path, leaf]) => [[Sym.object, k, ...path], leaf]))
    case tagged('tuple')(x): return x._zod.def.items
      .flatMap((paths, i) => paths.map<Path>(([path, leaf]) => [[Sym.tuple, i, ...path], leaf]))
    case tagged('union')(x): return x._zod.def.options
      .flatMap((paths, i) => paths.map<Path>(([path, leaf]) => [[Sym.union, i, ...path], leaf]))
  }
})
