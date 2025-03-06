import { t } from '@traversable/schema-core'

export interface ValidationError {
  kind: string
  path: (keyof any)[]
  got: unknown
  msg?: string
  expected?: unknown
  schemaPath?: (keyof any)[]
}

export const dataPath
  : (schemaPath: (keyof any)[]) => (string | number)[]
  = (schemaPath: (keyof any)[]) => {
    let out = Array.of<string | number>()
    for (let ix = 0, len = schemaPath.length; ix < len; ix++) {
      const x = schemaPath[ix]
      if (typeof x === 'string' || typeof x === 'number') out.push(x)
      else ix++
    }
    return out
  }

export type ErrorType = typeof ErrorType[keyof typeof ErrorType]

export const ErrorType = {
  TypeMismatch: 'TYPE_MISMATCH',
  Required: 'REQUIRED',
} as const satisfies Record<string, string>

// const fillTupleIndices = (count: number) => {
//   let out = '['
//   while (count-- !== 0) out += 'any, '
//   return out
// }

function error<T extends string>(kind: T, path: (keyof any)[], got: unknown, msg: string | undefined, expected: unknown, schemaPath: (keyof any)[]): {
  kind: typeof kind
  path: typeof path
  got: typeof got
  msg: typeof msg
  expected: typeof expected
  schemaPath: typeof schemaPath
}
function error<T extends string>(kind: T, path: (keyof any)[], got: unknown, msg: string | undefined, expected: unknown): {
  kind: typeof kind
  path: typeof path
  got: typeof got
  msg: typeof msg
  expected: typeof expected
}
function error<T extends string>(kind: T, path: (keyof any)[], got: unknown, msg: string): {
  kind: typeof kind
  path: typeof path
  got: typeof got
  msg: typeof msg
}
function error<T extends string>(kind: T, path: (keyof any)[], got: unknown): {
  kind: typeof kind
  path: typeof path
  got: typeof got
}
function error<T extends string>(kind: T, path: (keyof any)[], got: unknown, msg?: string, expected?: unknown, schemaPath?: (keyof any)[]): ValidationError {
  return {
    kind,
    path: dataPath(path),
    got,
    ...msg != null && { msg },
    ...expected != null && { expected },
    ...schemaPath && { schemaPath },
  }
}

export const ERROR = {
  never: (path, got) => error(ErrorType.TypeMismatch, path, got, 'Expected not receive a value', 'never'),
  null: (path, got) => error(ErrorType.TypeMismatch, path, got, 'Expected null', 'null'),
  void: (path, got) => error(ErrorType.TypeMismatch, path, got, 'Expected void', 'void'),
  undefined: (path, got) => error(ErrorType.TypeMismatch, path, got, 'Expected undefined', 'undefined'),
  symbol: (path, got) => error(ErrorType.TypeMismatch, path, got, 'Expected a symbol', 'symbol'),
  boolean: (path, got) => error(ErrorType.TypeMismatch, path, got, 'Expected a boolean', 'boolean'),
  integer: (path, got) => error(ErrorType.TypeMismatch, path, got, 'Expected an integer', 'number'),
  bigint: (path, got) => error(ErrorType.TypeMismatch, path, got, 'Expected BigInt', 'bigint'),
  number: (path, got) => error(ErrorType.TypeMismatch, path, got, 'Expected a number', 'number'),
  string: (path, got) => error(ErrorType.TypeMismatch, path, got, 'Expected a string', 'string'),
  eq: (path, got, expected) => error(ErrorType.TypeMismatch, path, got, 'Expected equal value', expected),
  array: (path, got, expected = void 0) => typeof expected === 'string'
    ? error(ErrorType.TypeMismatch, path, got, 'Expected array', `Array<${expected}>`)
    : error(ErrorType.TypeMismatch, path, got, 'Expected array'),
  object: (path, got) => error(ErrorType.TypeMismatch, path, got, 'Expected object'),
  arrayElement: (path, got, expected = void 0) => typeof expected === 'string'
    ? error(ErrorType.TypeMismatch, path, got, `Invalid item at index '${String(path[path.length - 1])}'`, expected)
    : error(ErrorType.TypeMismatch, path, got, `Invalid item at index '${String(path[path.length - 1])}'`),
  objectValue: (path, got, expected = void 0) => typeof expected === 'string'
    ? error(ErrorType.TypeMismatch, path, got, `Invalid value at key '${String(path[path.length - 1])}'`, expected)
    : error(ErrorType.TypeMismatch, path, got, `Invalid value at key '${String(path[path.length - 1])}'`),
  missingKey: (path_, got, expected_ = void 0) => {
    let path = dataPath(path_)
    const [lead, last] = [path.slice(0, -1), String(path.at(-1))]
    const expected = `Record<${last}, any>`
    return error(ErrorType.Required, lead, got, `Missing key '${last}' at ${lead.length === 0 ? 'root' : `path '${lead.join('.')}'`}`, expected)
  },
  missingIndex: (path_, got, expected_ = void 0) => {
    let path = dataPath(path_)
    const [lead, last] = [path.slice(0, -1), String(path.at(-1))]
    return error(ErrorType.Required, lead, got, `Missing index '${last}' at ${lead.length === 0 ? 'root' : `path '${lead.join('.')}'`}`)
    // const expected = typeof expected_ === 'string' ? `${fillTupleIndices(Math.max(1, +last) - 1)}${expected_}, ...any]` : null
    // return expected === null
    //   ? error('MISSING_INDEX', lead, got, `Missing index '${last}' at ${lead.length === 0 ? 'root' : `path '${lead.join('.')}'`}`)
    //   : error('MISSING_INDEX', lead, got, `Missing index '${last}' at ${lead.length === 0 ? 'root' : `path '${lead.join('.')}'`}`, expected)
  },
  optional: (path, got) => error(ErrorType.TypeMismatch, path, got),
} satisfies Record<string, (ctx: t.Functor.Index, got: unknown, expected?: unknown) => ValidationError>
