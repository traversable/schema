import { z } from 'zod/v4'
import type { Returns } from '@traversable/registry'
import * as F from './functor.js'
import { NS, Sym } from './typename.js'
import { paths as algebra } from './algebra.js'

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

function pathInterpreter<T extends Interpreter>(interpret: T, ...path: (keyof any)[]): (Returns<T[keyof T]> & {})[]
function pathInterpreter(interpret: Interpreter.LeastUpperBound, ...path: (keyof any)[]): unknown[] {
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
    .map(([path, leaf]) => [pathInterpreter($.interpreter, ...path), leaf] satisfies [any, any])
    .map(([path]) => path)
}

paths.defaults = defaults
