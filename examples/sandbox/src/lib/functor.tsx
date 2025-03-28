import * as React from 'react'
import * as fc from 'fast-check'
import type * as T from '@traversable/registry'
import { parseKey } from '@traversable/registry'
import { fn } from '@traversable/registry'
import { t } from '@traversable/schema'
import { Json } from '@traversable/json'

import * as isReact from './react'
import {
  MapSymbol,
  SetSymbol,
  URI,
} from './shared'

import type { Free, Fixpoint } from './shared'
import { set } from './set'
import { map } from './map'
import { spacemacs } from './theme'
import { Hover } from './hover'

export const Functor: T.Functor<Free, t.Schema> = {
  map(f) {
    return (x) => {
      switch (true) {
        case x.tag === URI.set: return set(f(x.def))
        case x.tag === URI.map: return map(f(x.def[0]), f(x.def[1]))
        default: return t.Functor.map(f)(x)
      }
    }
  }
}

export const IndexedFunctor: T.Functor.Ix<t.Functor.Index, Free, Fixpoint> = {
  ...Functor,
  mapWithIndex(f) {
    return (x, ix) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case x.tag === URI.set: return set(f(x.def, [...ix, SetSymbol]))
        case x.tag === URI.map: return map(f(x.def[0], [...ix, MapSymbol, 0]), f(x.def[1], [...ix, MapSymbol, 1]))
        case t.isCore(x): return t.IndexedFunctor.mapWithIndex(f)(x, ix)
      }
    }
  },
}

export const fold = fn.cata(Functor)
export const unfold = fn.ana(Functor)
export const foldWithIndex = fn.cataIx(IndexedFunctor)

const $ts = {
  typeName: (typeName: string) => <span style={{ color: spacemacs.var, fontStyle: 'italic' }}>{typeName}</span>,
  typeKeyword: <span style={{ color: spacemacs.var, fontStyle: 'italic' }}>type </span>,
  angle: {
    lhs: <span style={{ color: spacemacs.head1 }}>{'<'}</span>,
    rhs: <span style={{ color: spacemacs.head1 }}>{'>'}</span>,
  },
  brace: {
    lhs: <span style={{ color: spacemacs.head1 }}>{'{'}</span>,
    rhs: <span style={{ color: spacemacs.head1 }}>{'}'}</span>,
  },
  brack: {
    lhs: <span style={{ color: spacemacs.head1 }}>{'['}</span>,
    rhs: <span style={{ color: spacemacs.head1 }}>{']'}</span>,
  },
  paren: {
    lhs: <span style={{ color: spacemacs.head1 }}>{'('}</span>,
    rhs: <span style={{ color: spacemacs.head1 }}>{')'}</span>,
  },
  pipe: <span style={{ color: spacemacs.head1 }}>{' | '}</span>,
  amp: <span style={{ color: spacemacs.head1 }}>{' & '}</span>,
}

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
  type: ({ state = false, text }: { state?: boolean, text: string }) => () => <>{$text('type', { fontStyle: 'italic' })(text)}</>,
  // type: $text('type'),
  var: $text('var'),
  war: $text('war'),
  yellow: $text('yellow'),
  yellowBg: $text('yellow-bg'),
}

const base = (text: string) => <span style={{ color: spacemacs.base, fontWeight: 600 }}>{text}</span>

export type TermWithTypeTree =
  | [React.ReactNode, React.ReactNode]
  | [TermWithTypeTree, type: TermWithTypeTree]

export namespace Recursive {
  export const toTypeString: T.Algebra<Free, string> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.set: return 'Set<' + x.def + '>'
      case x.tag === URI.map: return 'Map<' + x.def + '>'
      case t.isCore(x): return t.recurse.Recursive.toTypeString(x)
    }
  }

  export const toTypeHtml: T.Algebra<Free, React.ReactNode> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.never: return $js.type({ text: 'never' })() satisfies React.ReactNode
      case x.tag === URI.any: return $js.type({ text: 'any' })() satisfies React.ReactNode
      case x.tag === URI.unknown: return $js.type({ text: 'unknown' })() satisfies React.ReactNode
      case x.tag === URI.void: return $js.type({ text: 'void' })() satisfies React.ReactNode
      case x.tag === URI.null: return $js.type({ text: 'null' })() satisfies React.ReactNode
      case x.tag === URI.undefined: return $js.type({ text: 'undefined' })() satisfies React.ReactNode
      case x.tag === URI.symbol: return $js.type({ text: 'symbol' })() satisfies React.ReactNode
      case x.tag === URI.boolean: return $js.type({ text: 'boolean' })() satisfies React.ReactNode
      case x.tag === URI.integer: return $js.type({ text: 'integer' })() satisfies React.ReactNode
      case x.tag === URI.bigint: return $js.type({ text: 'bigint' })() satisfies React.ReactNode
      case x.tag === URI.number: return $js.type({ text: 'number' })() satisfies React.ReactNode
      case x.tag === URI.string: return $js.type({ text: 'string' })() satisfies React.ReactNode
      case x.tag === URI.array: return $line($js.const('('), x.def, $js.const(')'), $js.const('['), $js.const(']')) satisfies React.ReactNode
      case x.tag === URI.record: return $line($js.h1('Record'), $js.aqua('<'), $js.type({ text: 'string' })(), $js.cursor(','), x.def, $js.aqua('>')) satisfies React.ReactNode
      case x.tag === URI.optional: return $line(x.def, $js.blue(' | '), $js.type({ text: 'undefined' })()) satisfies React.ReactNode
      case x.tag === URI.eq: return $line(x.def, $js.cblkLn('?')) satisfies React.ReactNode
      case x.tag === URI.set: return $line($js.h1('Set'), $js.aqua('<'), x.def, $js.aqua('>')) satisfies React.ReactNode
      case x.tag === URI.map: return $line($js.h1('Map'), $js.aqua('<'), x.def[0], base(', '), x.def[1], $js.aqua('>')) satisfies React.ReactNode
      case x.tag === URI.union: return $line(x.def[0], ...x.def.slice(1).flatMap((y) => [$js.blue(' | '), y])) satisfies React.ReactNode
      case x.tag === URI.intersect: return $line(x.def[0], ...x.def.slice(1).flatMap((y) => [$js.blue(' & '), y])) satisfies React.ReactNode
      case x.tag === URI.tuple: return $line($ts.brack.lhs, x.def[0], ...x.def.slice(1).flatMap((y) => [$ts.typeName(', '), y]), $ts.brack.rhs) satisfies React.ReactNode
      case x.tag === URI.object: {
        const xs = Object.entries(x.def)
        return xs.length === 0
          ? $js.aqua('{}')
          : $line(
            $js.aqua('{ '),
            ...xs.flatMap(([k, v], ix) => [
              ...ix === 0 ? [] : [$js.cursor(', ')],
              $js.prop(parseKey(k)),
              $js.blue(x.opt.includes(k) ? '?: ' : ': '),
              v,
            ]),
            $js.aqua(' }'),
          ) satisfies React.ReactNode
      }
    }
  }

  const label = ['ᵃ', 'ᵇ', 'ᶜ', 'ᵈ', 'ᵉ', 'ᶠ', 'ᵍ', 'ʰ', 'ⁱ', 'ʲ', 'ᵏ', 'ˡ', 'ᵐ', 'ⁿ', 'ᵒ', 'ᵖ', '𐞥', 'ʳ', 'ˢ', 'ᵗ', 'ᵘ', 'ᵛ', 'ʷ', 'ˣ', 'ʸ', 'ᶻ'] as const

  const jsonToHtml = Json.fold<React.ReactNode>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x == null: return $js.magenta(`${x}`)
      case typeof x === 'string': return $line($js.base('"'), $js.aqua(x), $js.base('"'))
      case typeof x === 'number': return $js.meta(`${x}`)
      case typeof x === 'boolean': return $js.red(`${x}`)
      case Json.isArray(x): return $line($js.aqua('['), ...x.flatMap((y, iy) => [...iy === 0 ? [] : [$js.cursor(', ')], y]), $js.aqua(']'))
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

  export const toTermWithTypeHtml: T.IndexedAlgebra<t.Functor.Index, Free, TermWithTypeTree> = (x, ix) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.never: return [$line($js.var('t'), $js.cursor('.'), $js.const('never')), $js.type({ text: 'never' })()] satisfies TermWithTypeTree
      case x.tag === URI.any: return [$line($js.var('t'), $js.cursor('.'), $js.const('any')), $js.type({ text: 'any' })()] satisfies TermWithTypeTree
      case x.tag === URI.unknown: return [$line($js.var('t'), $js.cursor('.'), $js.const('unknown')), $js.type({ text: 'unknown' })()] satisfies TermWithTypeTree
      case x.tag === URI.void: return [$line($js.var('t'), $js.cursor('.'), $js.const('void')), $js.type({ text: 'void' })()] satisfies TermWithTypeTree
      case x.tag === URI.null: return [$line($js.var('t'), $js.cursor('.'), $js.const('null')), $js.type({ text: 'null' })()] satisfies TermWithTypeTree
      case x.tag === URI.undefined: return [$line($js.var('t'), $js.cursor('.'), $js.const('undefined')), $js.type({ text: 'undefined' })()] satisfies TermWithTypeTree
      case x.tag === URI.symbol: return [$line($js.var('t'), $js.cursor('.'), $js.const('symbol')), $js.type({ text: 'symbol' })()] satisfies TermWithTypeTree
      case x.tag === URI.boolean: return [$line($js.var('t'), $js.cursor('.'), $js.const('boolean')), $js.type({ text: 'boolean' })()] satisfies TermWithTypeTree
      case x.tag === URI.integer: switch (true) {
        default: return [$line($js.var('t'), $js.cursor('.'), $js.const('integer')), $js.type({ text: 'number' })()] satisfies TermWithTypeTree
        case isNumber(x.exclusiveMinimum):
          return [$line($js.var('t'), $js.cursor('.'), $js.const('integer'), $js.cursor('.'), $js.const('moreThan'), $js.aqua('('), $js.const(`${x.exclusiveMinimum}`), $js.aqua(')')), $js.type({ text: 'number' })()] satisfies TermWithTypeTree
        case isNumber(x.exclusiveMaximum):
          return [$line($js.var('t'), $js.cursor('.'), $js.const('integer'), $js.cursor('.'), $js.const('lessThan'), $js.aqua('('), $js.const(`${x.exclusiveMaximum}`), $js.aqua(')')), $js.type({ text: 'number' })()] satisfies TermWithTypeTree
        case isNumber(x.minimum):
          return [$line($js.var('t'), $js.cursor('.'), $js.const('integer'), $js.cursor('.'), $js.const('min'), $js.aqua('('), $js.const(`${x.minimum}`), $js.aqua(')')), $js.type({ text: 'number' })()] satisfies TermWithTypeTree
        case isNumber(x.maximum):
          return [$line($js.var('t'), $js.cursor('.'), $js.const('integer'), $js.cursor('.'), $js.const('max'), $js.aqua('('), $js.const(`${x.maximum}`), $js.aqua(')')), $js.type({ text: 'number' })()] satisfies TermWithTypeTree
      }
      case x.tag === URI.bigint: switch (true) {
        default: return [$line($js.var('t'), $js.cursor('.'), $js.const('bigint')), $js.type({ text: 'bigint' })()] satisfies TermWithTypeTree
        case isBigInt(x.exclusiveMinimum):
          return [$line($js.var('t'), $js.cursor('.'), $js.const('bigint'), $js.cursor('.'), $js.const('moreThan'), $js.aqua('('), $js.const(`${x.exclusiveMinimum}`), $js.aqua(')')), $js.type({ text: 'bigint' })()] satisfies TermWithTypeTree
        case isBigInt(x.exclusiveMaximum):
          return [$line($js.var('t'), $js.cursor('.'), $js.const('bigint'), $js.cursor('.'), $js.const('lessThan'), $js.aqua('('), $js.const(`${x.exclusiveMaximum}`), $js.aqua(')')), $js.type({ text: 'bigint' })()] satisfies TermWithTypeTree
        case isBigInt(x.minimum):
          return [$line($js.var('t'), $js.cursor('.'), $js.const('bigint'), $js.cursor('.'), $js.const('min'), $js.aqua('('), $js.const(`${x.minimum}`), $js.aqua(')')), $js.type({ text: 'bigint' })()] satisfies TermWithTypeTree
        case isBigInt(x.maximum):
          return [$line($js.var('t'), $js.cursor('.'), $js.const('bigint'), $js.cursor('.'), $js.const('max'), $js.aqua('('), $js.const(`${x.maximum}`), $js.aqua(')')), $js.type({ text: 'bigint' })()] satisfies TermWithTypeTree
      }
      case x.tag === URI.number: switch (true) {
        default: return [$line($js.var('t'), $js.cursor('.'), $js.const('number')), $js.type({ text: 'number' })()] satisfies TermWithTypeTree
        case isNumber(x.exclusiveMinimum):
          return [$line($js.var('t'), $js.cursor('.'), $js.const('number'), $js.cursor('.'), $js.const('moreThan'), $js.aqua('('), $js.const(`${x.exclusiveMinimum}`), $js.aqua(')')), $js.type({ text: 'number' })()] satisfies TermWithTypeTree
        case isNumber(x.exclusiveMaximum):
          return [$line($js.var('t'), $js.cursor('.'), $js.const('number'), $js.cursor('.'), $js.const('lessThan'), $js.aqua('('), $js.const(`${x.exclusiveMaximum}`), $js.aqua(')')), $js.type({ text: 'number' })()] satisfies TermWithTypeTree
        case isNumber(x.minimum):
          return [$line($js.var('t'), $js.cursor('.'), $js.const('number'), $js.cursor('.'), $js.const('min'), $js.aqua('('), $js.const(`${x.minimum}`), $js.aqua(')')), $js.type({ text: 'number' })()] satisfies TermWithTypeTree
        case isNumber(x.maximum):
          return [$line($js.var('t'), $js.cursor('.'), $js.const('number'), $js.cursor('.'), $js.const('max'), $js.aqua('('), $js.const(`${x.maximum}`), $js.aqua(')')), $js.type({ text: 'number' })()] satisfies TermWithTypeTree
      }
      case x.tag === URI.string: switch (true) {
        default: return [$line($js.var('t'), $js.cursor('.'), $js.const('string')), $js.type({ text: 'string' })()] satisfies TermWithTypeTree
        case isNumber(x.minLength):
          return [$line($js.var('t'), $js.cursor('.'), $js.const('string'), $js.cursor('.'), $js.const('min'), $js.aqua('('), $js.const(`${x.minLength}`), $js.aqua(')')), $js.type({ text: 'string' })()] satisfies TermWithTypeTree
        case isNumber(x.maxLength):
          return [$line($js.var('t'), $js.cursor('.'), $js.const('string'), $js.cursor('.'), $js.const('max'), $js.aqua('('), $js.const(`${x.maxLength}`), $js.aqua(')')), $js.type({ text: 'string' })()] satisfies TermWithTypeTree
      }
      case x.tag === URI.eq: {
        const children = jsonToHtml(x.def as never)
        return [
          $line($js.var('t'), $js.cursor('.'), $js.const('eq'), $js.aqua('('), children, $js.aqua(')')),
          children,
        ] satisfies TermWithTypeTree
      }
      case x.tag === URI.array: return [
        $line($js.var('t'), $js.cursor('.'), $js.const('array'), $js.aqua('('), <Hover texts={x.def} path={ix} />, $js.aqua(')')),
        $line($js.const('('), x.def[1], $js.const(')'), $js.const('['), $js.const(']')),
      ] satisfies TermWithTypeTree
      case x.tag === URI.record: return [
        $line($js.var('t'), $js.cursor('.'), $js.const('record'), $js.aqua('('), <Hover texts={x.def} path={ix} />, $js.aqua(')')),
        $line($js.h1('Record'), $js.aqua('<'), $js.type({ text: 'string' })(), $js.cursor(', '), x.def[1], $js.aqua('>')),
      ] satisfies TermWithTypeTree
      case x.tag === URI.optional: return [
        $line($js.var('t'), $js.cursor('.'), $js.const('optional'), $js.aqua('('), <Hover texts={x.def} path={ix} />, $js.aqua(')')),
        $line(x.def[1], $js.blue(' | '), $js.type({ text: 'undefined' })()),
      ] satisfies TermWithTypeTree
      case x.tag === URI.set: return [
        $line($js.var('t'), $js.cursor('.'), $js.const('set'), $js.aqua('('), <Hover texts={x.def} path={ix} />, $js.aqua(')')),
        $line($js.h1('Set'), $js.aqua('<'), x.def[1], $js.aqua('>')),
      ] satisfies TermWithTypeTree
      case x.tag === URI.map: {
        console.log(x.def)
        return [
          $line(
            $js.var('t'),
            $js.cursor('.'),
            $js.const('map'),
            $js.aqua('('),
            <Hover texts={x.def[0]} path={[...ix, 0]} />,
            $js.cursor(', '),
            <Hover texts={x.def[1]} path={[...ix, 1]} />,
            $js.aqua(')')
          ),
          $line(
            $js.h1('Map'),
            $js.aqua('<'),
            x.def[0][1],
            $js.base(', '),
            x.def[1][1],
            $js.aqua('>')
          ),
        ] satisfies TermWithTypeTree
      }
      case x.tag === URI.union: return [
        $line(
          $js.var('t'),
          $js.cursor('.'),
          $js.const('union'),
          $js.aqua('('),
          ...x.def.flatMap((y, iy) => [...iy === 0 ? [] : [$js.cursor(', ')], <Hover texts={y} path={[...ix, iy]} />]),
          $js.aqua(')')
        ),
        $line(...x.def.flatMap((y, iy) => [...iy === 0 ? [] : [$js.blue(' | ')], y[1]])),
      ] satisfies TermWithTypeTree
      case x.tag === URI.intersect: return [
        $line(
          $js.var('t'),
          $js.cursor('.'),
          $js.const('intersect'),
          $js.aqua('('),
          ...x.def.flatMap((y, iy) => [...iy === 0 ? [] : [$js.cursor(', ')], <Hover texts={y} path={[...ix, iy]} />]),
          $js.aqua(')')
        ),
        $line(...x.def.flatMap((y, iy) => [...iy === 0 ? [] : [$js.blue(' & ')], y[1]])),
      ] satisfies TermWithTypeTree
      case x.tag === URI.tuple: return [
        $line(
          $js.var('t'),
          $js.cursor('.'),
          $js.const('tuple'),
          $js.aqua('('),
          ...x.def.flatMap((y, iy) => [...iy === 0 ? [] : [$js.cursor(', ')], <Hover texts={y} path={[...ix, iy]} />]),
          $js.aqua(')')
        ),
        $line(
          $ts.brack.lhs,
          ...x.def.flatMap((y, iy) => [
            ...iy === 0 ? [] : [$js.cursor(', ')],
            $js.const(label[iy] + (iy >= x.opt ? '?: ' : ': ')),
            y[1]
          ]),
          $ts.brack.rhs,
        ),
      ] satisfies TermWithTypeTree
      case x.tag === URI.object: {
        const xs = Object.entries(x.def)
        return xs.length === 0
          ? [
            $line($js.var('t'), $js.cursor('.'), $js.const('object'), $js.aqua('('), $js.brown('{}'), $js.aqua(')')),
            $js.aqua('{}'),
          ] satisfies TermWithTypeTree
          : [
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
                <Hover texts={v} path={[...ix, k]} />,
              ]),
              $js.brown(' }'),
              $js.aqua(')'),
            ),
            $line(
              $js.aqua('{ '),
              ...xs.flatMap(([k, v], iy) => [
                ...iy === 0 ? [] : [$js.cursor(', ')],
                $js.prop(parseKey(k)),
                $js.blue(x.opt.includes(k) ? '?: ' : ': '),
                v[1],
              ]),
              $js.aqua(' }'),
            ),
          ] satisfies TermWithTypeTree
      }
    }
  }

  export const toTermHtml: T.Algebra<Free, React.ReactNode> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.eq:
      case x.tag === URI.never: return $line($js.var('t'), $js.cursor('.'), $js.const('never'))
      case x.tag === URI.any: return $line($js.var('t'), $js.cursor('.'), $js.const('any'))
      case x.tag === URI.unknown: return $line($js.var('t'), $js.cursor('.'), $js.const('unknown'))
      case x.tag === URI.void: return $line($js.var('t'), $js.cursor('.'), $js.const('void'))
      case x.tag === URI.null: return $line($js.var('t'), $js.cursor('.'), $js.const('null'))
      case x.tag === URI.undefined: return $line($js.var('t'), $js.cursor('.'), $js.const('undefined'))
      case x.tag === URI.symbol: return $line($js.var('t'), $js.cursor('.'), $js.const('symbol'))
      case x.tag === URI.boolean: return $line($js.var('t'), $js.cursor('.'), $js.const('boolean'))
      case x.tag === URI.integer: return $line($js.var('t'), $js.cursor('.'), $js.const('integer'))
      case x.tag === URI.bigint: return $line($js.var('t'), $js.cursor('.'), $js.const('bigint'))
      case x.tag === URI.number: return $line($js.var('t'), $js.cursor('.'), $js.const('number'))
      case x.tag === URI.string: return $line($js.var('t'), $js.cursor('.'), $js.const('string'))
      case x.tag === URI.array: return $line($js.var('t'), $js.cursor('.'), $js.const('array'), $js.aqua('('), x.def, $js.aqua(')'))
      case x.tag === URI.record: return $line($js.var('t'), $js.cursor('.'), $js.const('record'), $js.aqua('('), x.def, $js.aqua(')'))
      case x.tag === URI.optional: return $line($js.var('t'), $js.cursor('.'), $js.const('optional'), $js.aqua('('), x.def, $js.aqua(')'))
      case x.tag === URI.set: return $line($js.var('t'), $js.cursor('.'), $js.const('set'), $js.aqua('('), x.def, $js.aqua(')'))
      case x.tag === URI.map: return $line($js.var('t'), $js.cursor('.'), $js.const('map'), $js.aqua('('), x.def[0], $js.cursor(', '), x.def[1], $js.aqua(')'))
      case x.tag === URI.union: return $line(
        $js.var('t'),
        $js.cursor('.'),
        $js.const('union'),
        $js.aqua('('),
        ...x.def.flatMap((y, iy) => [...iy === 0 ? [] : [$js.cursor(', ')], y]),
        $js.aqua(')'),
      )
      case x.tag === URI.intersect: return $line(
        $js.var('t'),
        $js.cursor('.'),
        $js.const('intersect'),
        $js.aqua('('),
        ...x.def.flatMap((y, iy) => [...iy === 0 ? [] : [$js.cursor(', ')], y]),
        $js.aqua(')'),
      )
      case x.tag === URI.tuple: return $line(
        $js.var('t'),
        $js.cursor('.'),
        $js.const('tuple'),
        $js.aqua('('),
        ...x.def.flatMap((y, iy) => [...iy === 0 ? [] : [$js.cursor(', '), y]]),
        $js.aqua(')'),
      )
      case x.tag === URI.object: {
        const xs = Object.entries(x.def)
        return xs.length === 0
          ? $line(
            $js.var('t'),
            $js.cursor('.'),
            $js.const('object'),
            $js.aqua('('),
            $js.brown('{}'),
            $js.aqua(')')
          )
          : $line(
            $js.var('t'),
            $js.cursor('.'),
            $js.const('object'),
            $js.aqua('('),
            $js.brown('{ '),
            ...xs.flatMap(([k, v], iy) => [
              ...iy === 0 ? [] : [$js.cursor(', ')],
              $js.base(parseKey(k)),
              $js.base(': '),
              v,
            ]),
            $js.brown(' }'),
            $js.aqua(')'),
          )
      }
    }
  }

  const jsonToString = Json.fold<string>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case typeof x === 'string': return `"${x}"`
      case Json.isScalar(x): return `${x}`
      case Json.isArray(x): return '[' + x.join(', ') + ']'
      case Json.isObject(x): {
        const xs = Object.entries(x)
        return xs.length === 0 ? '{}' : '{ ' + xs.map(([k, v]) => `${parseKey(k)}: ${v}`).join(', ') + ' }'
      }
    }
  })

  const isNumber = (u: unknown): u is number => typeof u === 'number'
  const isBigInt = (u: unknown): u is bigint => typeof u === 'bigint'

  export const toSchemaString: T.Algebra<Free, string> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.any: return 't.any'
      case x.tag === URI.never: return 't.never'
      case x.tag === URI.unknown: return 't.unknown'
      case x.tag === URI.void: return 't.void'
      case x.tag === URI.null: return 't.null'
      case x.tag === URI.undefined: return 't.undefined'
      case x.tag === URI.symbol: return 't.symbol'
      case x.tag === URI.boolean: return 't.boolean'
      case x.tag === URI.integer: switch (true) {
        case isNumber(x.exclusiveMinimum): return 't.integer.moreThan(' + x.exclusiveMinimum + ')'
        case isNumber(x.exclusiveMaximum): return 't.integer.lessThan(' + x.exclusiveMaximum + ')'
        case isNumber(x.minimum): return 't.integer.min(' + x.minimum + ')'
        case isNumber(x.maximum): return 't.integer.max(' + x.maximum + ')'
        default: return 't.integer'
      }
      case x.tag === URI.bigint: switch (true) {
        case isBigInt(x.exclusiveMinimum): return 't.bigint.moreThan(' + x.exclusiveMinimum + ')'
        case isBigInt(x.exclusiveMaximum): return 't.bigint.lessThan(' + x.exclusiveMinimum + ')'
        case isBigInt(x.minimum): return 't.bigint.min(' + x.minimum + ')'
        case isBigInt(x.maximum): return 't.bigint.max(' + x.maximum + ')'
        default: return 't.bigint'
      }
      case x.tag === URI.number: switch (true) {
        case isNumber(x.exclusiveMinimum): return 't.number.moreThan(' + x.exclusiveMinimum + ')'
        case isNumber(x.exclusiveMaximum): return 't.number.lessThan(' + x.exclusiveMaximum + ')'
        case isNumber(x.minimum): return 't.number.min(' + x.minimum + ')'
        case isNumber(x.maximum): return 't.number.max(' + x.maximum + ')'
        default: return 't.number'
      }
      case x.tag === URI.string: switch (true) {
        case isNumber(x.minLength): return 't.string.min(' + x.minLength + ')'
        case isNumber(x.maxLength): return 't.string.max(' + x.maxLength + ')'
        default: return 't.string'
      }
      case x.tag === URI.string: return 't.string'   // TODO
      case x.tag === URI.eq: return 't.eq(' + jsonToString(x.def) + ')'
      case x.tag === URI.optional: return 't.optional(' + x.def + ')'
      case x.tag === URI.array: return 't.array(' + x.def + ')'
      case x.tag === URI.record: return 't.record(' + x.def + ')'
      case x.tag === URI.enum as never: return 't.enum(' + Object.values(x.def).join(', ') + ')'
      case x.tag === URI.nonnullable as never: return 't.enum(' + Object.values(x.def).join(', ') + ')'
      case x.tag === URI.union: return 't.union(' + x.def.join(', ') + ')'
      case x.tag === URI.intersect: return 't.intersect(' + x.def.join(', ') + ')'
      case x.tag === URI.tuple: return 't.tuple(' + x.def.join(', ') + ')'
      case x.tag === URI.set: return 't.set(' + x.def + ')'
      case x.tag === URI.map: return 't.map(' + x.def[0] + ', ' + x.def[1] + ')'
      case x.tag === URI.object: {
        const xs = Object.entries(x.def)
        return xs.length === 0 ? 't.object({})' : 't.object({ ' + xs.map(([k, v]) => `${parseKey(k)}: ${v}`).join(', ') + ' })'
      }
    }
  }
}

export const toTypeString = fold(Recursive.toTypeString)
export const toSchemaString = fold(Recursive.toSchemaString)

export const toTypeHtml
  : <S extends t.Schema>(term: S) => React.JSX.Element
  = (term) => {
    const ui = fold(Recursive.toTypeHtml)(term)
    const Elem = isReact.FC(ui) ? ui : () => ui
    return <pre style={{ position: 'relative' }}><Elem /></pre>
  }

export const toTermHtml
  : <S extends t.Schema>(term: S) => React.JSX.Element
  = (term) => {
    return <pre>
      {fold(Recursive.toTermHtml)(term)}
    </pre>
  }

export const toTermWithTypeHtml
  : <S extends t.Schema>(term: S, ix?: t.Functor.Index) => TermWithTypeTree
  = (term, ix) => foldWithIndex(Recursive.toTermWithTypeHtml)(term as never, ix ?? [])
