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
