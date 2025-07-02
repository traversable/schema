import { z } from 'zod/v4'
import type { Returns } from '@traversable/registry'
import { fn, Object_entries } from '@traversable/registry'

import * as F from './functor.js'
import { NS, Sym, tagged } from './typename.js'

export type Path = [(keyof any)[], z.ZodType['_zod']['def']['type']]

export type Interpreter<T = unknown> =
  & { [K in keyof Sym]+?: Interpreter.Handler<K, T> }
  & { number?: Interpreter.Handler<number, T>, string?: Interpreter.Handler<string, T>, symbol?: Interpreter.Handler<symbol, T> }

export declare namespace Interpreter {
  type Handler<K extends keyof any = keyof any, T = unknown> = (k: K, ix: number, prev: T[]) => T
  type LeastUpperBound = { [x: string]: Interpreter.Handler }
}

const rmNS = (k: symbol) => k.description?.startsWith(NS) ? k.description.slice(NS.length) : k.description
const rmNil = <T>(x: T) => x == null ? [] : [x]

function interpreter<T extends Interpreter>(interpret: T, ...path: (keyof any)[]): (Returns<T[keyof T]> & {})[]
function interpreter(interpret: Interpreter.LeastUpperBound, ...path: (keyof any)[]): unknown[] {
  let out = Array.of()
  let ix = -1
  let head
  while ((void ix++, head = path.shift()) !== undefined) {
    let unprefixed = typeof head === 'symbol' ? rmNS(head) : null
    if (typeof unprefixed === 'string' && unprefixed in interpret) out.push(...rmNil(interpret[unprefixed](head, ix, out)))
    else if (typeof head === 'string') out.push(...rmNil('string' in interpret ? interpret.string(head, ix, out) : head))
    else if (typeof head === 'number') out.push(...rmNil('number' in interpret ? interpret.number(head, ix, out) : head))
    else if (typeof head === 'symbol') out.push(...rmNil('symbol' in interpret ? interpret.symbol(head, ix, out) : head))
    else { throw Error('Unmatched segment: ' + String(head)) }
  }
  return out
}

function parseOptions(options?: paths.Options): paths.Config
function parseOptions({
  interpreter = defaults.interpreter,
}: paths.Options = defaults): paths.Config {
  return {
    interpreter,
  }
}

const defaults = {
  interpreter: {
    string: (k, ix) => `${ix === 0 ? '' : '.'}${k}`,
    number: (k) => `[${k}]`,
    symbol: () => null,
    optional: () => `?`,
  },
} satisfies Required<paths.Config>

export declare namespace paths {
  type Options = {
    interpreter?: Interpreter
  }
  interface Config extends Required<Options> {}
}

export function paths<T extends z.ZodType>(type: T, options?: paths.Options) {
  const $ = parseOptions(options)
  return algebra(F.in(type))
    .map(([path, leaf]) => [interpreter($.interpreter, ...path), leaf] satisfies [any, any])
    .map(([path]) => path)
}

paths.defaults = defaults

const algebra = F.fold<Path[]>((x) => {
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
