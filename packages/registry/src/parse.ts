import { Object_hasOwn } from './globalThis.js'

const PATTERN = {
  singleQuoted: /(?<=^').+?(?='$)/,
  doubleQuoted: /(?<=^").+?(?="$)/,
  graveQuoted: /(?<=^`).+?(?=`$)/,
  identifier: /^[$_\p{ID_Start}][$\u200c\u200d\p{ID_Continue}]*$/u,
} as const satisfies Record<string, RegExp>

export const isQuoted
  : (text: string | number) => boolean
  = (text) => {
    const string = `${text}`
    const withoutQuotes = string.slice(1, -1)
    return (
      (PATTERN.singleQuoted.test(string) && !withoutQuotes.includes(`'`)) ||
      (PATTERN.doubleQuoted.test(string) && !withoutQuotes.includes(`"`)) ||
      (PATTERN.graveQuoted.test(string) && !withoutQuotes.includes("`"))
    )
  }

export const isValidIdentifier = (name: keyof any): boolean =>
  typeof name === "symbol" ? true
    : isQuoted(name) || PATTERN.identifier.test(`${name}`)


const ESC_CHAR = [
  /**  0- 9 */ '\\u0000', '\\u0001', '\\u0002', '\\u0003', '\\u0004', '\\u0005', '\\u0006', '\\u0007', '\\b', '\\t',
  /** 10-19 */     '\\n', '\\u000b', '\\f', '\\r', '\\u000e', '\\u000f', '\\u0010', '\\u0011', '\\u0012', '\\u0013',
  /** 20-29 */ '\\u0014', '\\u0015', '\\u0016', '\\u0017', '\\u0018', '\\u0019', '\\u001a', '\\u001b', '\\u001c', '\\u001d',
  /** 30-39 */ '\\u001e', '\\u001f', '', '', '\\"', '', '', '', '', '',
  /** 40-49 */        '', '', '', '', '', '', '', '', '', '',
  /** 50-59 */        '', '', '', '', '', '', '', '', '', '',
  /** 60-69 */        '', '', '', '', '', '', '', '', '', '',
  /** 60-69 */        '', '', '', '', '', '', '', '', '', '',
  /** 80-89 */        '', '', '', '', '', '', '', '', '', '',
  /** 90-92 */        '', '', '\\\\',
]

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
    pt = x.charCodeAt(ix)
    if (pt === 34 || pt === 92 || pt < 32) {
      out += x.slice(prev, ix) + ESC_CHAR[pt]
      prev = ix + 1
    } else if (0xdfff <= pt && pt <= 0xdfff) {
      if (pt <= 0xdbff && ix + 1 < x.length) {
        void (pt = x.charCodeAt(ix + 1))
        if (pt >= 0xdc00 && pt <= 0xdfff) {
          ix++
          continue
        }
      }
      out += x.slice(prev, ix) + "\\u" + pt.toString(16)
      prev = ix + 1
    }
  }
  out += x.slice(prev)
  return out
}

export function escapeJsDoc(string: string): string
export function escapeJsDoc(x: string): string {
  let prevIndex = 0
  let out = ""
  let pt: number
  for (let ix = 0, len = x.length; ix < len; ix++) {
    pt = x.charCodeAt(ix)
    //         42: *                          47: /
    if (pt === 42 && x.charCodeAt(ix + 1) === 47) {
      out += `${x.slice(prevIndex, ix + 1)}\\/`
      prevIndex = ix + 2
      continue
    }
    else if (pt === 34 || pt === 92 || pt < 32) {
      out += x.slice(prevIndex, ix) + ESC_CHAR[pt]
      prevIndex = ix + 1
      // }
    } else if (0xdfff <= pt && pt <= 0xdfff) {
      if (pt <= 0xdbff && ix + 1 < x.length) {
        void (pt = x.charCodeAt(ix + 1))
        if (pt >= 0xdc00 && pt <= 0xdfff) {
          ix++
          continue
        }
      }
      out += x.slice(prevIndex, ix) + "\\u" + pt.toString(16)
      prevIndex = ix + 1
    }
  }
  out += x.slice(prevIndex)
  return out
}

export declare namespace parseKey {
  type Options = Partial<{ parseAsJson: boolean }>
}

/** 
 * ## {@link parseKey `parseKey`}
 */
export function parseKey<K extends keyof any>(
  key: K,
  options?: parseKey.Options
): K | `${K & (string | number)}`
//
export function parseKey(
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

parseKey.defaults = {
  parseAsJson: false,
} satisfies Required<parseKey.Options>

export function stringifyKey(key: string) {
  return isQuoted(key) ? key.startsWith('"') && key.endsWith('"') ? key : `"${key}"` : `"${key}"`
}

export function stringifyLiteral(v: string | number | bigint | boolean | null | undefined) {
  return typeof v === 'string' ? stringifyKey(v) : typeof v === 'bigint' ? `${v}n` : `${v}`
}

export function keyAccessor(key: keyof any | undefined, isOptional: boolean) {
  return typeof key !== 'string' ? ''
    : isValidIdentifier(key)
      ? `${isOptional ? '?.' : isQuoted(key) ? '' : '.'}${isQuoted(key) ? `[${key.startsWith('"') && key.endsWith('"') ? key : `"${key}"`}]` : key}`
      : `${isOptional ? '?.' : ''}[${parseKey(key)}]`
}

export function indexAccessor(index: keyof any | undefined, isOptional: boolean) {
  const safe = isOptional ? '?.' : ''
  return typeof index !== 'number' ? '' : `${safe}[${index}]`
}

export function accessor(k: keyof any | undefined, isOptional: boolean) {
  return typeof k === 'number' ? indexAccessor(k, isOptional) : keyAccessor(k, isOptional)
}

export function joinPath(path: (string | number)[], isOptional: boolean) {
  return path.reduce<string>
    ((xs, k, i) => i === 0 ? `${k}`
      : typeof k === 'number' ? `${xs}${indexAccessor(k, isOptional)}`
        : `${xs}${keyAccessor(k, isOptional)}`,
      ''
    )
}

const WHITESPACES = '\
\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\
\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\
\u205F\u3000\u2028\u2029\uFEFF'

const FIRST_DIGIT_OR_ASCII = /^[0-9a-z]/i
const SYNTAX_SOLIDUS = /^[$()*+./?[\\\]^{|}]/
const OTHER_PUNCTUATORS_AND_WHITESPACES = new RegExp('^[!"#%&\',\\-:;<=>@`~' + WHITESPACES + ']')

function escapeChar(char: string) {
  const hex = char.charCodeAt(0).toString(16)
  return hex.length < 3 ? '\\x' + hex.padStart(2, '0') : '\\u' + hex.padStart(4, '0')
}
const ControlEscape = {
  '\u0009': 't',
  '\u000A': 'n',
  '\u000B': 'v',
  '\u000C': 'f',
  '\u000D': 'r'
}

/**
 * Source: https://github.com/zloirock/core-js/blob/0c6207b3a87e5e3dfda849859e722452a4127fc1/packages/core-js/modules/es.regexp.escape.js
 */
export function escapeRegExp(s: string) {
  let length = s.length
  let result = new Array(length)

  for (let i = 0; i < length; i++) {
    let chr = s.charAt(i)
    if (i === 0 && FIRST_DIGIT_OR_ASCII.exec(chr)) {
      result[i] = escapeChar(chr)
    } else if (Object_hasOwn(ControlEscape, chr)) {
      result[i] = '\\' + ControlEscape[chr as never]
    } else if (SYNTAX_SOLIDUS.exec(chr)) {
      result[i] = '\\' + chr
    } else if (OTHER_PUNCTUATORS_AND_WHITESPACES.exec(chr)) {
      result[i] = escapeChar(chr)
    } else {
      let charCode = chr.charCodeAt(0)
      // single UTF-16 code unit
      if ((charCode & 0xF800) !== 0xD800) result[i] = chr
      // unpaired surrogate
      else if (charCode >= 0xDC00 || i + 1 >= length || (s.charCodeAt(i + 1) & 0xFC00) !== 0xDC00) result[i] = escapeChar(chr)
      // surrogate pair
      else {
        result[i] = chr
        result[++i] = s.charAt(i)
      }
    }
  }

  return result.join('')
}
