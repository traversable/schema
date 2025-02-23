import { symbol as Symbol, isQuoted } from '@traversable/registry'

export type ParseResult =
  | undefined
  | null
  | boolean
  | symbol
  | bigint
  | number
  | string
  ;

/** 
 * ## {@link parseInline `parse.inline`}
 */
export function parseInline(fn: (_: any) => any): ParseResult {
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

