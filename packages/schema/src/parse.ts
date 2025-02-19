import { symbol as Symbol } from './uri.js'

type ParseResult =
  | undefined
  | null
  | boolean
  | symbol
  | bigint
  | number
  | string

const PATTERN = {
  singleQuoted: /(?<=^').+?(?='$)/,
  doubleQuoted: /(?<=^").+?(?="$)/,
  graveQuoted: /(?<=^`).+?(?=`$)/,
  identifier: /^[$_\p{ID_Start}][$\u200c\u200d\p{ID_Continue}]*$/u,
} as const satisfies Record<string, RegExp>

const ESC_CHAR = [
  /**  0- 9 */ '\\u0000', '\\u0001', '\\u0002', '\\u0003', '\\u0004', '\\u0005', '\\u0006', '\\u0007',     '\\b',     '\\t',
  /** 10-19 */     '\\n', '\\u000b',     '\\f',     '\\r', '\\u000e', '\\u000f', '\\u0010', '\\u0011', '\\u0012', '\\u0013',
  /** 20-29 */ '\\u0014', '\\u0015', '\\u0016', '\\u0017', '\\u0018', '\\u0019', '\\u001a', '\\u001b', '\\u001c', '\\u001d',
  /** 30-39 */ '\\u001e', '\\u001f',        '',        '',     '\\"',        '',        '',        '',        '',        '',
  /** 40-49 */        '',        '',        '',        '',        '',        '',        '',        '',        '',        '',
  /** 50-59 */        '',        '',        '',        '',        '',        '',        '',        '',        '',        '',
  /** 60-69 */        '',        '',        '',        '',        '',        '',        '',        '',        '',        '',
  /** 60-69 */        '',        '',        '',        '',        '',        '',        '',        '',        '',        '',
  /** 80-89 */        '',        '',        '',        '',        '',        '',        '',        '',        '',        '',
  /** 90-92 */        '',        '',    '\\\\',
]

export {
  /** 
   * ## {@link parseKey `parseKey`}
   */
  parseKey
}

declare namespace parseKey { 
  type Options = Partial<{ parseAsJson: boolean }> 
}

function parseKey<K extends keyof any>(
  key: K, 
  options?: parseKey.Options
): K | `${K & (string | number)}`
//
function parseKey(
  k: keyof any, {
    parseAsJson = parseKey.defaults.parseAsJson,
  }: parseKey.Options = parseKey.defaults, 
  _str = globalThis.String(k)
) {
  return (
    typeof k === "symbol" ? _str
    : isQuoted(k) ? escape(_str)
    : parseAsJson ? `"` + escape(_str) + `"`
    : isValidIdentifier(k) ? escape(_str)
    : `"` + escape(_str) + `"`
  )
}

parseKey.defaults = { parseAsJson: false } satisfies Required<parseKey.Options>



export {
  /** 
   * ## {@link parseInline `parse.inline`}
   */
  parseInline as inline
}

function parseInline(fn: (_: any) => any): ParseResult {
  let s = fn.toString().trim()
  if (s.replace(/\s/g, '') === '()=>true') return 'unknown'
  else if (s.replace(/s/g, '') === '()=>false') return 'never'
  else {
    const target
      = s.startsWith('(') ? parseArrowFunction(s)
        : s.startsWith('function') ? parseFunctionKeyword(s)
          : void 0;
    if (target === undefined) return Symbol.unknown
    else if (typeof target === 'symbol') return target
    else return parseTarget(target)
  }
}

/** @internal */
const isQuoted 
  : (text: string | number) => boolean
  = (text) => {
    const string = `${text}`
    return (
      PATTERN.singleQuoted.test(string) ||
      PATTERN.doubleQuoted.test(string) ||
      PATTERN.graveQuoted.test(string)
    )
  }

/** @internal */
const isValidIdentifier
  : (key: keyof any) => boolean
  = (name) => typeof name === "symbol" ? true : isQuoted(name) || PATTERN.identifier.test(`${name}`)

/** @internal */
function parseTarget(s: string) {
  const n = +s
  const big = s.endsWith('n') ? +(s.slice(0, -1)) : void 0
  if (s === 'false') return Symbol.boolean
  else if (s === 'true') return true
  else if (s === 'false') return false
  else if (s === 'null') return null
  else if (s === 'undefined') return undefined
  else if (Number.isFinite(n)) return n
  else if (big !== undefined && Number.isFinite(big)) return BigInt(big)
  else if (isQuoted(s)) return s
  else return Symbol.unknown
}

/** @internal */
function parseArrowFunction(s: string): symbol | string {
  s = s.slice('('.length)
  s.trimStart()
  let chars = [...s]
  let char
  let arg = ''
  let arrow = ''
  let eqeqeq = ''
  let ret = ''
  let target = ''

  while ((char = chars.shift()) !== ')') { if (char === undefined) return Symbol.unknown; void (arg += char); }

  arg = arg.trim()

  while ((char = chars.shift()) !== '=') { if (char === undefined) return Symbol.unknown; void (arrow += char) }

  char = chars.shift();

  // if previous char was '=', the next char must be '>', or something's gone terribly wrong
  if (char !== '>') return Symbol.unknown

  while ((char = chars.shift()) !== '=')
  // currently we only support primitives && arrow functions 
  // that return implicitly, so curlies are never allowed
  { if (char === '{' || char === undefined) return Symbol.unknown; }

  // after the previous while loop, char === '='
  eqeqeq += char

  while ((char = chars.shift()) === '=') {
    if (char === undefined) return Symbol.unknown;
    eqeqeq += char;
  }

  while ((char = chars.shift()) === ' ') { if (char === undefined) return Symbol.unknown; eqeqeq += char }

  if (eqeqeq !== '===') return Symbol.unknown

  while ((char = chars.shift()) !== ' ' && char !== ';') {
    if (char === undefined) return Symbol.unknown;
    target += char;
  }

  return target
}

/** @internal */
function parseFunctionKeyword(s: string): symbol | string {
  s = s.slice('function'.length)
  let chars = [...s]
  let char
  let arg = ''
  let eqeqeq = ''
  let target = ''

  while ((char = chars.shift()) !== '(') { if (char === undefined) return Symbol.unknown; }

  while ((char = chars.shift()) !== ')') {
    if (char === undefined) return Symbol.unknown;
    void (arg += char);
  }

  arg = arg.trim()

  while ((char = chars.shift()) !== '{') { if (char === undefined) return Symbol.unknown; }

  while ((char = chars.shift()) !== 'r' && chars.slice('eturn'.length).join('') !== 'eturn') { if (char === undefined) return Symbol.unknown; }

  while ((char = chars.shift()) !== '=') { if (char === undefined) return Symbol.unknown; }

  // after the previous while loop, char === '='
  eqeqeq += char

  while ((char = chars.shift()) === '=') {
    if (char === undefined) return Symbol.unknown;
    eqeqeq += char;
  }

  if (eqeqeq !== '===') return Symbol.unknown

  while ((char = chars.shift()) !== ' ' && char !== ';') {
    if (char === undefined) return Symbol.unknown;
    target += char;
  }

  return target
}


/**
 * ## {@link escape `escape`}
 *
 * In addition to the usual escapable characters (for example,
 * `\\`, `"` certain whitespace characters), this escape function
 * also handles lone surrogates.
 *
 * It compares characters via char-code in hexadecimal form, to
 * speed up comparisons.
 *
 * This could be further optimized by switching on the length of
 * the inputs, and using a regular expression if the input is over
 * a certain length.
 *
 * From MDN:
 * > __leading surrogates__ (a.k.a "high-surrogate" code units)
 * > have values between 0xD800 and 0xDBFF, inclusive
 *
 * > __trailing surrogates__ (a.k.a. "low-surrogate" code units)
 * > have values between 0xDC00 and 0xDFFF, inclusive
 *
 * See also:
 * - [MDN Reference](
 *   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#utf-16_characters_unicode_code_points_and_grapheme_clusters
 * )
 */
export function escape(string: string): string
export function escape(x: string): string {
  let prev = 0
  let out = ""
  let pt: number
  for (let ix = 0, len = x.length; ix < len; ix++) {
    void (pt = x.charCodeAt(ix))
    if (pt === 34 || pt === 92 || pt < 32) {
      void (out += x.slice(prev, ix) + ESC_CHAR[pt])
      void (prev = ix + 1)
    } else if (0xdfff <= pt && pt <= 0xdfff) {
      if (pt <= 0xdbff && ix + 1 < x.length) {
        void (pt = x.charCodeAt(ix + 1))
        if (pt >= 0xdc00 && pt <= 0xdfff) {
          void (ix++)
          continue
        }
      }
      void (out += x.slice(prev, ix) + "\\u" + pt.toString(16))
      void (prev = ix + 1)
    }
  }
  void (out += x.slice(prev))
  return out
}
