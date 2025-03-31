import { t } from '@traversable/schema'

export interface ValidationError {
  kind: string
  path: (keyof any)[]
  got: unknown
  msg?: string
  expected?: unknown
  schemaPath?: (keyof any)[]
}

export interface ErrorHandler {
  (
    got: unknown,
    path: t.Functor.Index,
    expected: string
  ): ValidationError
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
  Excess: 'EXCESSIVE',
  OutOfBounds: 'OUT_OF_BOUNDS',
} as const satisfies Record<string, string>

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

export const NULLARY = {
  never: (got, path) => error(ErrorType.TypeMismatch, path, got, 'Expected not to receive a value', 'never'),
  any: () => { throw globalThis.Error('Illegal state: Error handler for \'any\' schema should never be called') },
  unknown: () => { throw globalThis.Error('Illegal state: Error handler for \'unknown\' schema should never be called') },
  null: (got, path) => error(ErrorType.TypeMismatch, path, got, 'Expected null', 'null'),
  void: (got, path) => error(ErrorType.TypeMismatch, path, got, 'Expected void', 'void'),
  undefined: (got, path) => error(ErrorType.TypeMismatch, path, got, 'Expected undefined', 'undefined'),
  symbol: (got, path) => error(ErrorType.TypeMismatch, path, got, 'Expected a symbol', 'symbol'),
  boolean: (got, path) => error(ErrorType.TypeMismatch, path, got, 'Expected a boolean', 'boolean'),
  integer: (got, path) => error(ErrorType.TypeMismatch, path, got, 'Expected an integer', 'number'),
  bigint: (got, path) => error(ErrorType.TypeMismatch, path, got, 'Expected BigInt', 'bigint'),
  number: (got, path) => error(ErrorType.TypeMismatch, path, got, 'Expected a number', 'number'),
  string: (got, path) => error(ErrorType.TypeMismatch, path, got, 'Expected a string', 'string'),
  eq: (got, path, expected) => error(ErrorType.TypeMismatch, path, got, 'Expected exact value: ' + JSON.stringify(expected), expected),
  array: (got, path) => error(ErrorType.TypeMismatch, path, got, 'Expected array'),
  record: (got, path) => error(ErrorType.TypeMismatch, path, got, 'Expected object'),
  optional: (got, path) => error(ErrorType.TypeMismatch, path, got, 'Expected optional'),
} as const satisfies Record<string, (got: unknown, ctx: t.Functor.Index, expected?: unknown) => ValidationError>

const gteErrorMessage = (type: string) => (x: number | bigint, got: unknown) => 'Expected ' + type + ' to be greater than or equal to ' + x + ', got: ' + globalThis.String(got)
const lteErrorMessage = (type: string) => (x: number | bigint, got: unknown) => 'Expected ' + type + ' to be less than or equal to ' + x + ', got: ' + globalThis.String(got)
const gtErrorMessage = (type: string) => (x: number | bigint, got: unknown) => 'Expected ' + type + ' to be greater than ' + x + ', got: ' + globalThis.String(got)
const ltErrorMessage = (type: string) => (x: number | bigint, got: unknown) => 'Expected ' + type + ' to be less than ' + x + ', got: ' + globalThis.String(got)

const isSafeInteger
  : (u: unknown) => u is number
  = globalThis.Number.isSafeInteger as never

export const BOUNDS = {
  integer: (s: t.integer) => (got, path) => {
    let out = Array.of<ValidationError>()
    if (!isSafeInteger(got)) { out.push(ERROR.integer(got, path)); return out }
    if (t.integer(s.minimum) && got < s.minimum) out.push(error(ErrorType.OutOfBounds, path, got, gteErrorMessage('integer')(s.minimum, got)))
    if (t.integer(s.maximum) && got > s.maximum) out.push(error(ErrorType.OutOfBounds, path, got, lteErrorMessage('integer')(s.maximum, got)))
    return out.length === 0 || out
  },
  number: (s: t.number) => (got, path) => {
    let out = Array.of<ValidationError>()
    if (typeof got !== 'number') { out.push(ERROR.number(got, path)); return out }
    if (t.number(s.minimum) && got < s.minimum) out.push(error(ErrorType.OutOfBounds, path, got, gteErrorMessage('number')(s.minimum, got)))
    if (t.number(s.maximum) && got > s.maximum) out.push(error(ErrorType.OutOfBounds, path, got, lteErrorMessage('number')(s.maximum, got)))
    if (t.number(s.exclusiveMinimum) && got <= s.exclusiveMinimum) out.push(error(ErrorType.OutOfBounds, path, got, gtErrorMessage('number')(s.exclusiveMinimum, got)))
    if (t.number(s.exclusiveMaximum) && got >= s.exclusiveMaximum) out.push(error(ErrorType.OutOfBounds, path, got, ltErrorMessage('number')(s.exclusiveMaximum, got)))
    return out.length === 0 || out
  },
  bigint: (s: t.bigint) => (got, path) => {
    let out = Array.of<ValidationError>()
    if (typeof got !== 'bigint') { out.push(ERROR.bigint(got, path)); return out }
    if (t.bigint(s.minimum) && got < s.minimum) out.push(error(ErrorType.OutOfBounds, path, got, gteErrorMessage('bigint')(s.minimum, got)))
    if (t.bigint(s.maximum) && got > s.maximum) out.push(error(ErrorType.OutOfBounds, path, got, lteErrorMessage('bigint')(s.maximum, got)))
    return out.length === 0 || out
  },
  string: (s: t.string) => (got, path) => {
    let out = Array.of<ValidationError>()
    if (typeof got !== 'string') { out.push(ERROR.string(got, path)); return out }
    if (t.number(s.minLength) && got.length < s.minLength) out.push(error(ErrorType.OutOfBounds, path, got, gteErrorMessage('string length')(s.minLength, got)))
    if (t.number(s.maxLength) && got.length > s.maxLength) out.push(error(ErrorType.OutOfBounds, path, got, lteErrorMessage('string length')(s.maxLength, got)))
    return out.length === 0 || out
  },
} as const satisfies Record<string, (schema: never) => (got: unknown, ctx: t.Functor.Index, expected?: unknown) => ValidationError[] | true>

interface Unary {
  invalid(got: unknown, ctx: t.Functor.Index, expected?: unknown): ValidationError
  excess(got: unknown, ctx: t.Functor.Index, expected?: unknown): ValidationError
  missing(got: unknown, ctx: t.Functor.Index, expected?: unknown): ValidationError
}

export const UNARY = {
  tuple: {
    invalid: NULLARY.array,
    excess: (got, path) => error(ErrorType.Excess, path, got),
    missing: (got, path_, expected_ = void 0) => {
      let path = dataPath(path_)
      const [lead, last] = [path.slice(0, -1), String(path.at(-1))]
      return error(ErrorType.Required, lead, `Missing required index '${last}'`)
    },
  },
  object: {
    invalid: NULLARY.record,
    excess: (got, path) => error(ErrorType.Excess, path, got),
    missing: (got, path_) => {
      let path = dataPath(path_)
      const [lead, last] = [path.slice(0, -1), String(path.at(-1))]
      return error(ErrorType.Required, lead, `Missing key '${last}'`)
    },
  },
} as const satisfies Record<string, Unary>

export const ERROR = {
  ...NULLARY,
  eq: (got, path, expected) => error(ErrorType.TypeMismatch, path, got, 'Expected exact value: ' + JSON.stringify(expected), expected),
  enum: (got, path, expected) => error(ErrorType.TypeMismatch, path, got, 'Expected one of: ' + expected, expected),
  array: (got, path, expected = void 0) => typeof expected === 'string'
    ? error(ErrorType.TypeMismatch, path, got, 'Expected array', `Array<${expected}>`)
    : error(ErrorType.TypeMismatch, path, got, 'Expected array'),
  object: (got, path) => error(ErrorType.TypeMismatch, path, got, 'Expected object'),
  arrayElement: (got, path, expected = void 0) => typeof expected === 'string'
    ? error(ErrorType.TypeMismatch, path, got, `Invalid item at index '${String(path[path.length - 1])}'`, expected)
    : error(ErrorType.TypeMismatch, path, got, `Invalid item at index '${String(path[path.length - 1])}'`),
  objectValue: (got, path, expected = void 0) => typeof expected === 'string'
    ? error(ErrorType.TypeMismatch, path, got, `Invalid value at key '${String(path[path.length - 1])}'`, expected)
    : error(ErrorType.TypeMismatch, path, got, `Invalid value at key '${String(path[path.length - 1])}'`),
  missingKey: (got, path_, expected_ = void 0) => {
    let path = dataPath(path_)
    const [lead, last] = [path.slice(0, -1), String(path.at(-1))]
    const expected = `Record<${last}, any>`
    return error(ErrorType.Required, lead, got, `Missing key '${last}'`, expected)
  },
  missingIndex: (got, path_, expected_ = void 0) => {
    let path = dataPath(path_)
    const [lead, last] = [path.slice(0, -1), String(path.at(-1))]
    return error(ErrorType.Required, path, `Missing required index ${last}`)
  },
  optional: (got, path) => error(ErrorType.TypeMismatch, path, got),
  excessItems: (got, path) => error(ErrorType.Excess, path, got)
} satisfies Record<string, (got: unknown, ctx: t.Functor.Index, expected?: unknown) => ValidationError>
