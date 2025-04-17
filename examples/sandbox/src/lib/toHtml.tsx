import * as React from 'react'
import type * as T from '@traversable/registry'
import { fn, parseKey } from '@traversable/registry'
import { t } from '@traversable/schema-core'
import { Json } from '@traversable/json'

import * as isReact from './react'
import type { Free } from './shared'
import { URI, symbol } from './shared'
import { set } from './set'
import { map } from './map'
import { spacemacs } from './theme'
import { Hover } from './hover'
import { fold } from './functor'

const label = ['ᵃ', 'ᵇ', 'ᶜ', 'ᵈ', 'ᵉ', 'ᶠ', 'ᵍ', 'ʰ', 'ⁱ', 'ʲ', 'ᵏ', 'ˡ', 'ᵐ', 'ⁿ', 'ᵒ', 'ᵖ', '𐞥', 'ʳ', 'ˢ', 'ᵗ', 'ᵘ', 'ᵛ', 'ʷ', 'ˣ', 'ʸ', 'ᶻ'] as const

const $text = (
  color: keyof typeof spacemacs,
  style?: React.CSSProperties
) => (
  text: string,
  Elem: React.ElementType<{ style: React.CSSProperties }> = 'span'
): React.ReactNode => <Elem style={{ ...style, color: spacemacs[color] }}>{text}</Elem>

const $line = (...phrases: (isReact.Intrinsic | React.ReactNode)[]): React.ReactNode =>
  <>{phrases.map((X, ix) => isReact.ElementType(X) ? <X key={ix} /> : <span key={ix}>{X}</span>)}</>

const $js = {
  act1: $text('act1'),
  act2: $text('act2'),
  aqua: $text('aqua'),
  aquaBg: $text('aqua-bg'),
  base: $text('base'),
  baseDim: $text('base-dim'),
  bgAlt: $text('bg-alt'),
  bg1: $text('bg1'),
  bg2: $text('bg2'),
  bg3: $text('bg3'),
  bg4: $text('bg4'),
  blue: $text('blue'),
  blueBg: $text('blue-bg'),
  blueBgS: $text('blue-bg-s'),
  border: $text('border'),
  brown: $text('brown'),
  cblk: $text('cblk'),
  cblkBg: $text('cblk-bg'),
  cblkLn: $text('cblk-ln'),
  cblkLnBg: $text('cblk-ln-bg'),
  comment: $text('comment'),
  commentBg: $text('comment-bg'),
  commentLight: $text('comment-light'),
  comp: $text('comp'),
  const: $text('const'),
  cursor: $text('cursor'),
  cyan: $text('cyan'),
  err: $text('err'),
  func: $text('func'),
  green: $text('green'),
  greenBg: $text('green-bg'),
  greenBgS: $text('green-bg-s'),
  h1: $text('head1', { fontWeight: 600 }),
  h2: $text('head2'),
  h3: $text('head3'),
  h4: $text('head4'),
  h1Bg: $text('head1-bg'),
  h2Bg: $text('head2-bg'),
  h3Bg: $text('head3-bg'),
  h4Bg: $text('head4-bg'),
  highlight: $text('highlight'),
  highlightDim: $text('highlight-dim'),
  keyword: $text('keyword'),
  magenta: $text('magenta'),
  mat: $text('mat'),
  meta: $text('meta'),
  prop: $text('prop'),
  red: $text('red'),
  redBg: $text('red-bg'),
  redBgS: $text('red-bg-s'),
  str: $text('str'),
  suc: $text('suc'),
  ttip: $text('ttip'),
  ttipBg: $text('ttip-bg'),
  ttipSl: $text('ttip-sl'),
  ttype: $text('ttype'),
  type: (text: string) => <>{$text('type', { fontStyle: 'italic' })(text)}</>,
  var: $text('var'),
  war: $text('war'),
  yellow: $text('yellow'),
  yellowBg: $text('yellow-bg'),
}

export type TermWithTypeTree =
  | [React.ReactNode, React.ReactNode]
  | [TermWithTypeTree, type: TermWithTypeTree]

export namespace Recursive {
  export const toHtml: T.IndexedAlgebra<t.Functor.Index, Free, TermWithTypeTree> = (x, path) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.never: return Html.Never(x)
      case x.tag === URI.any: return Html.Any(x)
      case x.tag === URI.unknown: return Html.Unknown(x)
      case x.tag === URI.void: return Html.Void(x)
      case x.tag === URI.null: return Html.Null(x)
      case x.tag === URI.undefined: return Html.Undefined(x)
      case x.tag === URI.symbol: return Html.Symbol(x)
      case x.tag === URI.boolean: return Html.Boolean(x)
      case x.tag === URI.integer: return Html.Integer(x)
      case x.tag === URI.bigint: return Html.BigInt(x)
      case x.tag === URI.number: return Html.Number(x)
      case x.tag === URI.string: return Html.String(x)
      case x.tag === URI.eq: return Html.Eq(x)
      case x.tag === URI.array: return Html.Array(x, path)
      case x.tag === URI.record: return Html.Record(x, path)
      case x.tag === URI.optional: return Html.Optional(x, path)
      case x.tag === URI.set: return Html.Set(x, path)
      case x.tag === URI.map: return Html.Map(x, path)
      case x.tag === URI.union: return Html.Union(x, path)
      case x.tag === URI.intersect: return Html.Intersect(x, path)
      case x.tag === URI.tuple: return Html.Tuple(x, path)
      case x.tag === URI.object: return Html.Object(x, path)
    }
  }

  export const jsonToHtml = Json.fold<React.ReactNode>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x == null: return $js.magenta(`${x}`)
      case typeof x === 'string': return $line($js.base('"'), $js.aqua(x), $js.base('"'))
      case typeof x === 'number': return $js.meta(`${x}`)
      case typeof x === 'boolean': return $js.red(`${x}`)
      case Json.isArray(x): return $line(
        $js.aqua('['),
        ...x.flatMap((y, iy) => [...iy === 0 ? [] : [$js.cursor(', ')], y]), $js.aqua(']'),
      )
      case Json.isObject(x): {
        const xs = Object.entries(x)
        return xs.length === 0 ? $js.aqua('{}') : $line(
          $js.aqua('{ '),
          ...xs.flatMap(([k, v], iy) => [...iy === 0 ? [] : [$js.cursor(', ')], $js.prop(`${parseKey(k)}: `), v]),
          $js.aqua(' }'),
        )
      }
    }
  })
}

export namespace Html {
  export function Never(_: t.never): TermWithTypeTree {
    return [
      $line($js.var('t'), $js.cursor('.'), $js.const('never')),
      $js.type('never'),
    ]
  }

  export function Any(_: t.any): TermWithTypeTree {
    return [
      $line($js.var('t'), $js.cursor('.'), $js.const('any')),
      $js.type('any'),
    ]
  }

  export function Unknown(_: t.unknown): TermWithTypeTree {
    return [
      $line($js.var('t'), $js.cursor('.'), $js.const('unknown')),
      $js.type('unknown'),
    ]
  }

  export function Void(_: t.void): TermWithTypeTree {
    return [
      $line($js.var('t'), $js.cursor('.'), $js.const('void')),
      $js.type('void'),
    ]
  }

  export function Null(_: t.null): TermWithTypeTree {
    return [
      $line($js.var('t'), $js.cursor('.'), $js.const('null')),
      $js.type('null'),
    ]
  }

  export function Undefined(_: t.undefined): TermWithTypeTree {
    return [
      $line($js.var('t'), $js.cursor('.'), $js.const('undefined')),
      $js.type('undefined'),
    ]
  }

  export function Symbol(_: t.symbol): TermWithTypeTree {
    return [
      $line($js.var('t'), $js.cursor('.'), $js.const('symbol')),
      $js.type('symbol'),
    ]
  }

  export function Boolean(_: t.boolean): TermWithTypeTree {
    return [
      $line($js.var('t'), $js.cursor('.'), $js.const('boolean')),
      $js.type('boolean'),
    ]
  }

  export function Integer(x: t.integer): TermWithTypeTree {
    let constraints = globalThis.Array.of<React.ReactNode>()
    if (t.integer(x.minimum) && t.integer(x.maximum))
      constraints.push($js.cursor('.'), $js.const('between'), $js.aqua('('), $js.const(`${x.minimum}`), $js.cursor(', '), $js.const(`${x.maximum}`), $js.aqua(')'))
    else if (t.integer(x.minimum))
      constraints.push($js.cursor('.'), $js.const('min'), $js.aqua('('), $js.const(`${x.minimum}`), $js.aqua(')'))
    else if (t.integer(x.maximum))
      constraints.push($js.cursor('.'), $js.const('max'), $js.aqua('('), $js.const(`${x.maximum}`), $js.aqua(')'))
    return [
      $line($js.var('t'), $js.cursor('.'), $js.const('integer'), ...constraints),
      $js.type('number')
    ]
  }

  export function BigInt(x: t.bigint): TermWithTypeTree {
    let constraints = globalThis.Array.of<React.ReactNode>()
    if (t.bigint(x.minimum) && t.bigint(x.maximum))
      constraints.push($js.cursor('.'), $js.const('between'), $js.aqua('('), $js.const(`${x.minimum}n`), $js.cursor(', '), $js.const(`${x.maximum}n`), $js.aqua(')'))
    else if (t.bigint(x.minimum))
      constraints.push($js.cursor('.'), $js.const('min'), $js.aqua('('), $js.const(`${x.minimum}n`), $js.aqua(')'))
    else if (t.bigint(x.maximum))
      constraints.push($js.cursor('.'), $js.const('max'), $js.aqua('('), $js.const(`${x.maximum}n`), $js.aqua(')'))
    return [
      $line($js.var('t'), $js.cursor('.'), $js.const('bigint'), ...constraints),
      $js.type('bigint')
    ]
  }

  export function Number(x: t.number): TermWithTypeTree {
    let constraints = globalThis.Array.of<React.ReactNode>()
    if (t.number(x.exclusiveMinimum))
      constraints.push($js.cursor('.'), $js.const('moreThan'), $js.aqua('('), $js.const(`${x.exclusiveMinimum}`), $js.aqua(')'))
    if (t.number(x.exclusiveMaximum))
      constraints.push($js.cursor('.'), $js.const('lessThan'), $js.aqua('('), $js.const(`${x.exclusiveMaximum}`), $js.aqua(')'))
    if (t.number(x.minimum) && t.number(x.maximum))
      constraints.push($js.cursor('.'), $js.const('between'), $js.aqua('('), $js.const(`${x.minimum}`), $js.cursor(', '), $js.const(`${x.maximum}`), $js.aqua(')'))
    else if (t.number(x.minimum))
      constraints.push($js.cursor('.'), $js.const('min'), $js.aqua('('), $js.const(`${x.minimum}`), $js.aqua(')'))
    else if (t.number(x.maximum))
      constraints.push($js.cursor('.'), $js.const('max'), $js.aqua('('), $js.const(`${x.maximum}`), $js.aqua(')'))
    return [
      $line($js.var('t'), $js.cursor('.'), $js.const('number'), ...constraints),
      $js.type('number')
    ]
  }

  export function String(x: t.string): TermWithTypeTree {
    let constraints = globalThis.Array.of<React.ReactNode>()
    if (t.integer(x.minLength) && t.integer(x.maxLength))
      constraints.push($js.cursor('.'), $js.const('between'), $js.aqua('('), $js.const(`${x.minLength}`), $js.cursor(', '), $js.const(`${x.maxLength}`), $js.aqua(')'))
    else if (t.integer(x.minLength))
      constraints.push($js.cursor('.'), $js.const('min'), $js.aqua('('), $js.const(`${x.minLength}`), $js.aqua(')'))
    else if (t.integer(x.maxLength))
      constraints.push($js.cursor('.'), $js.const('max'), $js.aqua('('), $js.const(`${x.maxLength}`), $js.aqua(')'))
    return [
      $line($js.var('t'), $js.cursor('.'), $js.const('string'), ...constraints,),
      $js.type('string'),
    ]
  }

  export function Eq<T>(x: t.eq<T>): TermWithTypeTree {
    const children = Recursive.jsonToHtml(x.def as never)
    return [
      $line($js.var('t'), $js.cursor('.'), $js.const('eq'), $js.aqua('('), children, $js.aqua(')')),
      children,
    ]
  }

  export function Array<T extends TermWithTypeTree>(x: t.array<T>, path: (keyof any)[]): TermWithTypeTree {
    let constraints = globalThis.Array.of<React.ReactNode>()
    if (t.integer(x.minLength) && t.integer(x.maxLength))
      constraints.push($js.cursor('.'), $js.const('between'), $js.aqua('('), $js.const(`${x.minLength}`), $js.cursor(', '), $js.const(`${x.maxLength}`), $js.aqua(')'))
    else if (t.integer(x.minLength))
      constraints.push($js.cursor('.'), $js.const('min'), $js.aqua('('), $js.const(`${x.minLength}`), $js.aqua(')'))
    else if (t.integer(x.maxLength))
      constraints.push($js.cursor('.'), $js.const('max'), $js.aqua('('), $js.const(`${x.maxLength}`), $js.aqua(')'))
    return [
      $line(
        $js.var('t'),
        $js.cursor('.'),
        $js.const('array'),
        $js.aqua('('),
        <Hover texts={x.def} path={[...path, symbol.array]} />,
        $js.aqua(')'),
        ...constraints,
      ),
      $line($js.const('('), x.def[1], $js.const(')'), $js.const('['), $js.const(']')),
    ]
  }

  export function Record<T extends TermWithTypeTree>(x: t.record<T>, path: (keyof any)[]): TermWithTypeTree {
    return [
      $line(
        $js.var('t'),
        $js.cursor('.'),
        $js.const('record'),
        $js.aqua('('),
        <Hover texts={x.def} path={[...path, symbol.record]} />,
        $js.aqua(')'),
      ),
      $line($js.h1('Record'), $js.aqua('<'), $js.type('string'), $js.cursor(', '), x.def[1], $js.aqua('>')),
    ]
  }

  export function Optional<T extends TermWithTypeTree>(x: t.optional<T>, path: (keyof any)[]): TermWithTypeTree {
    return [
      $line(
        $js.var('t'),
        $js.cursor('.'),
        $js.const('optional'),
        $js.aqua('('),
        <Hover texts={x.def} path={[...path, symbol.optional]} />,
        $js.aqua(')'),
      ),
      $line(x.def[1], $js.blue(' | '), $js.type('undefined')),
    ]
  }

  export function Set<T extends TermWithTypeTree>(x: set<T>, path: (keyof any)[]): TermWithTypeTree {
    return [
      $line(
        $js.var('t'),
        $js.cursor('.'),
        $js.const('set'),
        $js.aqua('('),
        <Hover texts={x.def} path={[...path, symbol.set]} />,
        $js.aqua(')'),
      ),
      $line($js.h1('Set'), $js.aqua('<'), x.def[1], $js.aqua('>')),
    ]
  }

  export function Map<K extends TermWithTypeTree, V extends TermWithTypeTree>(x: map<K, V>, path: (keyof any)[]): TermWithTypeTree {
    return [
      $line(
        $js.var('t'),
        $js.cursor('.'),
        $js.const('map'),
        $js.aqua('('),
        <Hover texts={x.def[0]} path={[...path, symbol.map, 0]} />,
        $js.cursor(', '),
        <Hover texts={x.def[1]} path={[...path, symbol.map, 1]} />,
        $js.aqua(')')
      ),
      $line($js.h1('Map'), $js.aqua('<'), x.def[0][1], $js.base(', '), x.def[1][1], $js.aqua('>')),
    ]
  }

  export function Union<T extends readonly TermWithTypeTree[]>(xs: t.union<T>, path: (keyof any)[]): TermWithTypeTree {
    return [
      $line(
        $js.var('t'),
        $js.cursor('.'),
        $js.const('union'),
        $js.aqua('('),
        ...xs.def.flatMap((x, ix) => [
          ...ix === 0 ? [] : [$js.cursor(', ')],
          <Hover texts={x} path={[...path, symbol.union, ix]} />
        ]),
        $js.aqua(')')
      ),
      $line(...xs.def.flatMap((x, ix) => [...ix === 0 ? [] : [$js.blue(' | ')], x[1]])),
    ]
  }

  export function Intersect<T extends readonly TermWithTypeTree[]>(xs: t.intersect<T>, path: (keyof any)[]): TermWithTypeTree {
    return [
      $line(
        $js.var('t'),
        $js.cursor('.'),
        $js.const('intersect'),
        $js.aqua('('),
        ...xs.def.flatMap((x, ix) => [
          ...ix === 0 ? [] : [$js.cursor(', ')],
          <Hover texts={x} path={[...path, symbol.intersect, ix]} />
        ]),
        $js.aqua(')')
      ),
      $line(...xs.def.flatMap((x, ix) => [...ix === 0 ? [] : [$js.blue(' & ')], x[1]])),
    ]
  }

  export function Tuple<T extends readonly TermWithTypeTree[]>(xs: t.tuple<T>, path: (keyof any)[]): TermWithTypeTree {
    return [
      $line(
        $js.var('t'),
        $js.cursor('.'),
        $js.const('tuple'),
        $js.aqua('('),
        ...xs.def.flatMap((x, ix) => [
          ...ix === 0 ? [] : [$js.cursor(', ')],
          <Hover texts={x} path={[...path, ix]} />
        ]),
        $js.aqua(')')
      ),
      $line(
        $js.h1('['),
        ...xs.def.flatMap((x, ix) => [
          ...ix === 0 ? [] : [$js.cursor(', ')],
          $js.const(label[ix] + (ix >= xs.opt ? '?: ' : ': ')),
          x[1]
        ]),
        $js.h1(']'),
      ),
    ]
  }

  export function Object<T extends { [x: string]: TermWithTypeTree }>(x: t.object<T>, path: (keyof any)[]): TermWithTypeTree {
    const xs = globalThis.Object.entries(x.def)
    const opt: string[] = x.opt as never
    return xs.length === 0 ? [
      $line(
        $js.var('t'),
        $js.cursor('.'),
        $js.const('object'),
        $js.aqua('('),
        $js.brown('{}'),
        $js.aqua(')')
      ),
      $js.aqua('{}'),
    ] : [
      $line(
        $js.var('t'),
        $js.cursor('.'),
        $js.const('object'),
        $js.aqua('('),
        $js.brown('{ '),
        ...xs.flatMap(([k, v], iy) => [
          ...iy === 0 ? [] : [$js.cursor(', ')],
          $js.base(parseKey(k)),
          $js.base(': '),
          <Hover texts={v} path={[...path, k]} />,
        ]),
        $js.brown(' }'),
        $js.aqua(')'),
      ),
      $line(
        $js.aqua('{ '),
        ...xs.flatMap(([k, v], iy) => [
          ...iy === 0 ? [] : [$js.cursor(', ')],
          $js.prop(parseKey(k)),
          $js.blue(opt.includes(k) ? '?: ' : ': '),
          v[1],
        ]),
        $js.aqua(' }'),
      ),
    ]
  }
}

export const toHtml
  : <S extends t.Schema>(term: S, ix?: t.Functor.Index) => TermWithTypeTree
  = (term, ix) => fold(Recursive.toHtml)(term as never, ix ?? [])
