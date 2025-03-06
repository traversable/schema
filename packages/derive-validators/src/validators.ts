import type { IndexedAlgebra } from '@traversable/registry'
import { fn, symbol, typeName, URI } from '@traversable/registry'
import { t } from '@traversable/schema-core'

type ValidationFn = never | { (u: unknown): true | Error[] }

/** @internal */
const Array_isArray = globalThis.Array.isArray

/** @internal */
const isObject = (u: unknown): u is { [x: string]: unknown } =>
  !!u && typeof u === 'object' && !Array_isArray(u)

/** @internal */
const Object_keys = globalThis.Object.keys

/** @internal */
const hasOwn = <K extends keyof any>(u: unknown, k: K): u is Record<K, unknown> =>
  !!u && typeof u === 'object' && Object.prototype.hasOwnProperty.call(u, k)

interface Error {
  type: string
  path: (keyof any)[]
  got: unknown
  msg?: string
  expected?: unknown
  schemaPath?: (keyof any)[]
}

function error<T extends string>(type: T, path: (keyof any)[], got: unknown, msg: string | undefined, expected: unknown, schemaPath: (keyof any)[]): {
  type: typeof type
  path: typeof path
  got: typeof got
  msg: typeof msg
  expected: typeof expected
  schemaPath: typeof schemaPath
}
function error<T extends string>(type: T, path: (keyof any)[], got: unknown, msg: string | undefined, expected: unknown): {
  type: typeof type
  path: typeof path
  got: typeof got
  msg: typeof msg
  expected: typeof expected
}
function error<T extends string>(type: T, path: (keyof any)[], got: unknown, msg: string): {
  type: typeof type
  path: typeof path
  got: typeof got
  msg: typeof msg
}
function error<T extends string>(type: T, path: (keyof any)[], got: unknown): {
  type: typeof type
  path: typeof path
  got: typeof got
}
function error<T extends string>(type: T, path: (keyof any)[], got: unknown, msg?: string, expected?: unknown, schemaPath?: (keyof any)[]): Error {
  return {
    type,
    path: path.filter((_) => typeof _ !== 'symbol'),
    got,
    ...msg != null && { msg },
    ...expected != null && { expected },
    ...schemaPath && { schemaPath },
  }
}

export const ERROR = {
  never: (path, got) => error('EXPECTED_TO_NEVER_EVALUTE', path, got, 'Expected to never get a value', 'never', path),
  null: (path, got) => error('EXPECTED_NULL', path, got, 'Expected null', 'null', path),
  void: (path, got) => error('EXPECTED_VOID', path, got, 'Expected void', 'void', path),
  undefined: (path, got) => error('EXPECTED_UNDEFINED', path, got, 'Expected undefined', 'undefined', path),
  symbol: (path, got) => error('EXPECTED_SYMBOL', path, got, 'Expected a symbol', 'symbol', path),
  boolean: (path, got) => error('EXPECTED_BOOLEAN', path, got, 'Expected a boolean', 'boolean', path),
  integer: (path, got) => error('EXPECTED_INTEGER', path, got, 'Expected an integer', 'number', path),
  bigint: (path, got) => error('EXPECTED_BIGINT', path, got, 'Expected BigInt', 'bigint', path),
  number: (path, got) => error('EXPECTED_NUMBER', path, got, 'Expected a number', 'number', path),
  string: (path, got) => error('EXPECTED_STRING', path, got, 'Expected a string', 'string', path),
  eq: (path, got, expected) => error('EXPECTED_VALUE_EQUAL', path, got, 'Expected equal value', expected, path),
  array: (path, got, expected = symbol.notfound) => typeof expected === 'string'
    ? error('INVALID_VALUE', path, got, 'Expected array', `Array<${expected}>`)
    : error('INVALID_VALUE', path, got, 'Expected array'),
  object: (path, got) => error('INVALID_VALUE', path, got, 'Expected object'),
  arrayElement: (path, got, expected = symbol.notfound) => typeof expected === 'string'
    ? error('INVALID_ARRAY_ITEM', path, got, `Invalid item at index '${String(path[path.length - 1])}'`, expected)
    : error('INVALID_ARRAY_ITEM', path, got, `Invalid item at index '${String(path[path.length - 1])}'`),
  objectValue: (path, got, expected = symbol.notfound) => typeof expected === 'string'
    ? error('INVALID_VALUE', path, got, `Invalid value at key '${String(path[path.length - 1])}'`, expected)
    : error('INVALID_VALUE', path, got, `Invalid value at key '${String(path[path.length - 1])}'`),
  missingKey: (path_, got, expected_ = symbol.notfound) => {
    let path = path_.filter((_) => typeof _ !== 'symbol')
    const [lead, last] = [path.slice(0, -1), String(path.at(-1))]
    const expected = `Record<${last}, any>`
    return error('MISSING_KEY', lead, got, `Missing key '${last}' at ${lead.length === 0 ? 'root' : `path '${lead.join('.')}'`}`, expected, path_)
  },
  missingIndex: (path_, got, expected_ = symbol.notfound) => {
    let path = path_.filter((_) => typeof _ !== 'symbol')
    const [lead, last] = [path.slice(0, -1), String(path.at(-1))]
    return error('MISSING_INDEX', lead, got, `Missing index '${last}' at ${lead.length === 0 ? 'root' : `path '${lead.join('.')}'`}`)
    // const expected = typeof expected_ === 'string' ? `${fillTupleIndices(Math.max(1, +last) - 1)}${expected_}, ...any]` : null
    // return expected === null
    //   ? error('MISSING_INDEX', lead, got, `Missing index '${last}' at ${lead.length === 0 ? 'root' : `path '${lead.join('.')}'`}`)
    //   : error('MISSING_INDEX', lead, got, `Missing index '${last}' at ${lead.length === 0 ? 'root' : `path '${lead.join('.')}'`}`, expected)
  },
  optional: (path, got) => error('EXPECTED_OPTIONAL', path, got),
} satisfies Record<string, (ctx: t.Functor.Index, got: unknown, expected?: unknown) => Error>

// const fillTupleIndices = (count: number) => {
//   let out = '['
//   while (count-- !== 0) out += 'any, '
//   return out
// }

export const array
  : (validationFn: ValidationFn, ctx: t.Functor.Index) => ValidationFn
  = (validationFn, ctx) => (u) => {
    if (!Array_isArray(u)) return [ERROR.array(ctx, u)]
    let errors = Array.of<Error>()
    const len = u.length
    for (let ix = 0; ix < len; ix++) {
      const v = u[ix]
      const results = validationFn(v)
      if (results !== true) {
        for (let iy = 0; iy < results.length; iy++) errors.push(results[iy])
        errors.push(ERROR.arrayElement([...ctx, ix], u[ix]))
      }
    }
    if (errors.length > 0) return errors
    return true
  }

export const record
  : (validationFn: ValidationFn, ctx: t.Functor.Index) => ValidationFn
  = (validationFn, ctx) => (u) => {
    if (!isObject(u)) return [ERROR.object(ctx, u)]
    let errors = Array.of<Error>()
    const keys = Object_keys(u)
    const len = keys.length
    for (let ix = 0; ix < len; ix++) {
      const k = keys[ix]
      const v = u[k]
      const results = validationFn(v)
      if (results !== true) {
        for (let iy = 0; iy < results.length; iy++) {
          const result = results[iy]
          result.path.push(k)
          errors.push(result)
        }
        results.push(ERROR.objectValue([...ctx, k], u[k]))
      }
    }
    return errors.length > 0 ? errors : true
  }

export const object
  : (validationFns: { [x: string]: ValidationFn }, ix: t.Functor.Index) => ValidationFn
  = (validationFns, ctx) => (u) => {
    if (!isObject(u)) return [ERROR.object(ctx, u)]
    let errors: Error[] = []
    const keys = Object_keys(validationFns)
    const len = keys.length;
    for (let ix = 0; ix < len; ix++) {
      const k = keys[ix]
      const validationFn = validationFns[k]
      if (!hasOwn(u, k) && !(symbol.optional in validationFn)) {
        errors.push(ERROR.missingKey([...ctx, k], u))
        continue
      }
      const results = validationFn(u[k])
      if (results !== true) {
        for (let iy = 0; iy < results.length; iy++) errors.push(results[iy])
        results.push(ERROR.objectValue([...ctx, k], u[k]))
      }
    }
    return errors.length > 0 ? errors : true
  }

export const tuple
  : (validationFns: readonly ValidationFn[], ctx: t.Functor.Index) => ValidationFn
  = (validationFns, ctx) => (u) => {
    let errors = Array.of<Error>()
    if (!Array_isArray(u)) return [ERROR.array(ctx, u)]
    const len = validationFns.length
    for (let ix = 0; ix < len; ix++) {
      const validationFn = validationFns[ix]
      if (!(ix in u) && !(symbol.optional in validationFn)) {
        errors.push(ERROR.missingIndex([...ctx, ix], u))
        continue
      }
      const results = validationFn(u[ix])
      if (results !== true) {
        for (let iy = 0; iy < results.length; iy++) errors.push(results[iy])
        results.push(ERROR.arrayElement([...ctx, ix], u[ix]))
      }
    }
    return errors.length > 0 ? errors : true
  }

export const union
  : (validationFns: readonly ValidationFn[], ctx: t.Functor.Index) => ValidationFn
  = (validationFns, _ctx) => (u) => {
    const len = validationFns.length
    let errors = Array.of<Error>()
    for (let ix = 0; ix < len; ix++) {
      const validationFn = validationFns[ix]
      const results = validationFn(u)
      if (results === true) return true
      for (let iy = 0; iy < results.length; iy++) errors.push(results[iy])
    }
    return errors.length > 0 ? errors : true
  }

export const intersect
  : (validationFns: readonly ValidationFn[], ctx: t.Functor.Index) => ValidationFn
  = (validationFns, _ctx) => (u) => {
    const len = validationFns.length
    let errors = Array.of<Error>()
    for (let ix = 0; ix < len; ix++) {
      const validationFn = validationFns[ix]
      const results = validationFn(u)
      if (results !== true)
        for (let iy = 0; iy < results.length; iy++) errors.push(results[iy])
    }
    return errors.length > 0 ? errors : true
  }

export const eq
  : (value: ValidationFn, ctx: t.Functor.Index) => ValidationFn
  = (value, ctx) => (u) => {
    const results = t.eq(value)(u)
    if (results === true) return true
    return [ERROR.eq(ctx, u, value)]
  }

export const optional
  : (validationFn: ValidationFn, ctx: t.Functor.Index) => ValidationFn
  = (validationFn, ctx) => {
    function validateOptional(u: unknown) {
      if (u === void 0) return true
      const results = validationFn(u)
      if (results === true) return true
      results.push(ERROR.optional(ctx, u))
      return results
    }
    validateOptional[symbol.optional] = true
    return validateOptional
  }

const Nullary = {
  unknown: fn.const(fn.const(true)),
  any: fn.const(fn.const(true)),
  never: (ctx) => (u) => [ERROR.never(ctx, u)],
  void: (ctx) => (u) => t.void(u) || [ERROR.void(ctx, u)],
  undefined: (ctx) => (u) => t.void(u) || [ERROR.undefined(ctx, u)],
  symbol: (ctx) => (u) => t.symbol(u) || [ERROR.symbol(ctx, u)],
  bigint: (ctx) => (u) => t.bigint(u) || [ERROR.bigint(ctx, u)],
  null: (ctx) => (u) => t.null(u) || [ERROR.null(ctx, u)],
  string: (ctx) => (u) => t.string(u) || [ERROR.string(ctx, u)],
  integer: (ctx) => (u) => t.integer(u) || [ERROR.integer(ctx, u)],
  number: (ctx) => (u) => t.number(u) || [ERROR.number(ctx, u)],
  boolean: (ctx) => (u) => t.boolean(u) || [ERROR.boolean(ctx, u)],
} as const satisfies Record<string, (ctx: t.Functor.Index) => (u: unknown) => true | Error[]>

namespace Recursive {
  export const fromSchema: IndexedAlgebra<t.Functor.Index, t.Free, ValidationFn> = (x, ctx) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case t.isLeaf(x): return Nullary[typeName(x)](ctx)
      case x.tag === URI.eq: return eq(x.def, ctx)
      case x.tag === URI.optional: return optional(x.def, ctx)
      case x.tag === URI.array: return array(x.def, ctx)
      case x.tag === URI.record: return record(x.def, ctx)
      case x.tag === URI.tuple: return tuple(x.def, ctx)
      case x.tag === URI.union: return union(x.def, ctx)
      case x.tag === URI.intersect: return intersect(x.def, ctx)
      case x.tag === URI.object: return object(x.def, ctx)
    }
  }
}

const fromSchema_ = t.foldWithIndex(Recursive.fromSchema)

export const fromSchema
  : <T extends t.Schema>(schema: T) => (u: unknown) => true | {}
  = fromSchema_ as never
