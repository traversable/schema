export interface Success<T> {
  success: true
  index: number
  value: T
}

export interface Failure {
  success: false
  index: number
}

export type Result<T> = Success<T> | Failure

export type ResultTypes<U> = U extends [infer Head, ...infer Tail] ? [Parser.typeof<Head>, ...ResultTypes<Tail>] : [];

export type ParserHandler<T> = (input: string, index: number, state: any) => Result<T>

export type Options<T> = {
  handler: ParserHandler<T>
  name?: string
  info?: string
}

export type Found<T> = {
  index: number
  input: string
  result: Result<T>
}

export interface ParserContext<T> {
  handler(input: string, index: number, state: any): Result<T>
}

let PATTERN = {
  Alpha: /[a-z]/i,
  Digit: /[0-9]/,
  Whitespace: /\s+/,
  Alphanum: /[a-zA-Z0-9]/,
  Id: /^[_$a-zA-Z][_$a-zA-Z0-9]*/,
} satisfies { [x: string]: RegExp }

export function success<T>(index: number, value: T): Success<T> {
  return {
    success: true,
    value: value,
    index: index,
  }
}

export function failure(index: number): Failure {
  return {
    success: false,
    index: index
  }
}

export function succeed<U>(value: U): Parser<U> {
  return Parser.new((_, index) => {
    return success(index, value);
  }, 'succeeded');
}

function withTrace<T>(handler: ParserHandler<T>, tag: string): ParserHandler<T> {
  return (input, index, state) => {
    if (state.trace) {
      const pos = `${index}`
      console.log(`${pos.padEnd(6, ' ')}enter ${tag}`)
      const result = handler(input, index, state)
      if (result.success) {
        const pos = `${index}:${result.index}`
        console.log(`${pos.padEnd(6, ' ')}success ${tag}`)
      } else {
        const pos = `${index}`
        console.log(`${pos.padEnd(6, ' ')}failure ${tag}`)
      }
      return result
    }
    return handler(input, index, state)
  }
}

export class Parser<S> {
  static new
    : <T>(
      handler: ParserHandler<T>,
      tag?: string,
      info?: string,
    ) => Parser<T>
    = (handler, tag, info) => new Parser(handler, tag ?? '', info)

  find(text: string): Found<S> | undefined
  find<State>(text: string, state: State): Found<S> | undefined
  find(text: string, state?: { [x: string]: unknown }) { return find(this, text, state) }

  many(): Parser<S[]>
  many(options: many.Options): Parser<S[]>
  many($: many.Options = {}): Parser<S[]> { return many(this, $) }

  map<T>(f: (value: S) => T): Parser<T> { return map(this, f) }

  parse<State>(input: string, state?: State): Result<S>
  parse(input: string, state = {}): Result<S> { return parse(this, input, state) }

  run(input: string): Result<S>
  run<State>(input: string, state?: State, offset?: number, debug?: boolean): Result<S>
  run(input: string, state = {}, offset: number = 0, debug = false): Result<S> {
    let handler = debug ? withTrace(this.handler, this.tag) : this.handler
    return handler(input, offset, state)
  }

  times(n: 1): Parser<[S]>
  times(n: 2): Parser<[S, S]>
  times(n: 3): Parser<[S, S, S]>
  times(n: 4): Parser<[S, S, S, S]>
  times(n: 5): Parser<[S, S, S, S, S]>
  times(n: 6): Parser<[S, S, S, S, S, S]>
  times(n: 7): Parser<[S, S, S, S, S, S, S]>
  times(n: 8): Parser<[S, S, S, S, S, S, S, S]>
  times(n: 9): Parser<[S, S, S, S, S, S, S, S, S]>
  times(n: 0): Parser<[]>
  times(n: number): Parser<S[]>
  times(n: number): Parser<S[]> { return times(this, n) }

  trim(): Parser<S> { return index([spaces, this, spaces], 1) }

  private constructor(
    private handler: ParserHandler<S>,
    public tag: string,
    public info?: string,
  ) { }
}

export declare namespace Parser {
  export { typeOf as typeof }
  export type typeOf<P> = P extends Parser<infer T> ? T : never
}

function find<T>(parser: Parser<T>, text: string): Found<T> | undefined
function find<T, State extends Record<string, unknown>>(parser: Parser<T>, text: string, state: State): Found<T> | undefined
function find<T, State extends Record<string, unknown>>(parser: Parser<T>, text: string, state?: State): Found<T> | undefined
function find<T>(parser: Parser<T>, text: string, state?: Record<string, unknown>): Found<T> | undefined {
  for (let index = 0; index < text.length; index++) {
    const innerState = Object.assign({}, state)
    const result = parser.run(text, innerState, index)
    if (result.success) return {
      index,
      result,
      input: text,
    }
  }
  return undefined;
}

function map<S, T>(parser: Parser<S>, f: (s: S) => T): Parser<T> {
  return Parser.new((input, index, state) => {
    const result = parser.run(input, state, index)
    if (!result.success) {
      return result
    }
    return success(result.index, f(result.value))
  }, 'map', parser.tag)
}

function parse<T, State>(parser: Parser<T>, input: string, state: State): Result<T>
function parse<T, State extends { [x: string]: unknown }>(p: Parser<T>, input: string, state: State): Result<T> {
  let parser = index([p, eof], 0)
  return parser.run(input, state, 0)
}

function times<T>(parser: Parser<T>, n: number): Parser<T[]> {
  if (n < 1 || !Number.isInteger(n))
    throw Error('Expected "n" to be a non-negative, non-zero integer')
  return Parser.new((input, ix, state) => {
    let result
    let cursor = ix
    const seed = Array.of<T>()
    while (cursor < input.length) {
      result = parser.run(input, state, cursor)
      if (!result.success) break
      cursor = result.index
      seed.push(result.value)
    }
    if (seed.length < n) return failure(cursor)
    else return success(cursor, seed)
  })
}


export function seq<T extends readonly unknown[]>(...parsers: { [I in keyof T]: Parser<T[I]> }): Parser<T>
export function seq<T>(...parsers: Parser<T>[]): Parser<T[]> {
  return Parser.new((input, index, state) => {
    let result
    let latestIndex = index
    let seed = Array.of<T>()
    for (let i = 0; i < parsers.length; i++) {
      result = parsers[i].run(input, state, latestIndex)
      if (!result.success) {
        return result
      }
      latestIndex = result.index
      seed.push(result.value)
    }
    return success(latestIndex, seed)
  }, 'seq', `length=${parsers.length}`)
}

export function alt<T extends readonly unknown[]>(...parsers: { [I in keyof T]: Parser<T[I]> }): Parser<T[number]> {
  return Parser.new((input, index, state) => {
    let result
    for (let ix = 0, len = parsers.length; ix < len; ix++) {
      result = parsers[ix].run(input, state, index)
      if (result.success) return result
    }
    return failure(index)
  }, `alt length=${parsers.length}`)
}

export function string<T extends string>(value: T): Parser<T> {
  return Parser.new((input, index) => {
    if ((input.length - index) < value.length)
      return failure(index)
    else if (input.slice(index, index + value.length) !== value)
      return failure(index)
    else return success(index + value.length, value)
  }, `string=${value}`)
}

export function index<
  T extends readonly unknown[],
  I extends keyof T & number
>(
  parsers: { [I in keyof T]: Parser<T[I]> },
  index: I
): Parser<T[I]> {
  return seq(...parsers).map(values => values[index]);
}

export function regexp(pattern: RegExp): Parser<string> {
  const expr = RegExp(`^(?:${pattern.source})`, pattern.flags);
  return Parser.new((input, index) => {
    const text = input.slice(index);
    const result = expr.exec(text);
    if (result == null) {
      return failure(index);
    }
    return success(index + result[0].length, result[0]);
  }, `pattern=${pattern}`);
}

export type Char<T> = [T] extends [`${string}${infer T}`] ? T extends '' ? string : never : never
export function char(): Parser<string>
export function char<const T extends Char<T>>(char: T): Parser<T>
export function char(char: string = '') {
  return char === '' ? anyChar : string(char)
}

export const anyChar = Parser.new((input, index) => {
  if ((input.length - index) < 1)
    return failure(index)
  const value = input[index]
  return success(index + 1, value)
}, 'any')


export function not(parser: Parser<unknown>): Parser<null> {
  return Parser.new((input, index, state) => {
    const result = parser.run(input, state, index)
    return !result.success
      ? success(index, null)
      : failure(index)
  }, 'not')
}

export function many<T>(parser: Parser<T>, options?: many.Options): Parser<T[]>
export function many<T>(parser: Parser<T>, $: many.Options = {}): Parser<T[]> {
  if (!!$.not) return many(
    index([not($.not), parser], 1),
    { min: $.min, max: $.max }
  )
  else return Parser.new((input, ix, state) => {
    let result
    let cursor = ix
    const seed = Array.of<T>()
    while (cursor < input.length) {
      result = parser.run(input, state, cursor)
      if (!result.success) break
      cursor = result.index
      seed.push(result.value)
    }
    if ($.min != null && seed.length < $.min)
      return failure(cursor)
    else if ($.max != null && seed.length > $.max)
      return failure(cursor)
    else return success(cursor, seed)
  }, 'many')
}

export declare namespace many {
  type Options<T = unknown> = {
    min?: number
    max?: number
    not?: Parser<T>
  }
}

export let trim = <T>(parser: Parser<T>) => index([
  spaces,
  parser,
  spaces,
], 1)

export let eof
  : Parser<null>
  = Parser.new(
    (input, index) => index >= input.length ? success(index, null) : failure(index),
    'eof'
  )

export let optional
  : <T>(parser: Parser<T>) => Parser<T | null>
  = (parser) => alt(parser, succeed(null))

export let CR = char('\r')
export let LF = char('\n')
export let CRLF = string('\r\n')
export let newline = alt(CRLF, CR, LF)
export let whitespace = regexp(PATTERN.Whitespace)
export let spaces = optional(regexp(/[ \t\r\n]/).many())

export let alpha = regexp(PATTERN.Alpha)
export let digit = regexp(PATTERN.Digit)
export let alphanum = regexp(PATTERN.Alphanum)
export let ident = regexp(PATTERN.Id)

export function lazy<U>(thunk: () => Parser<U>, tag?: string): Parser<U> {
  return Parser.new((input, index, state) => {
    let parser = thunk()
    return parser.run(input, state, index)
  })
}

export type Language<U> = { [K in keyof U]: U[K] extends Parser<unknown> ? U[K] : never };

export type LanguageSource<U /* extends Language<U> */> = { [K in keyof U]: (lang: U) => U[K] };

export function language<T extends Language<T>>(source: LanguageSource<T>): T
export function language(source: { [x: string]: (go: Record<string, Parser<unknown>>) => Parser<unknown> }) {
  let lang: Record<string, Parser<unknown>> = {}
  for (const k of Object.keys(source)) {
    let loop = source[k]
    lang[k] = lazy(() => {
      const parser = loop(lang)
      console.log('parser', parser)
      if (parser == null || !(parser instanceof Parser)) {
        throw new Error('syntax must return a Parser.')
      }
      parser.tag = `${parser.tag} key=${k}`
      return parser
    })
  }
  return lang
}
