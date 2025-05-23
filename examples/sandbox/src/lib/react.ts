import type * as React from 'react'
import { t } from '@traversable/schema'

export interface Key extends t.union<[t.null, t.string]> {}
export const Key = t.union(t.null, t.string) satisfies Key

export const Scalar = t.union(
  t.null,
  t.undefined,
  t.boolean,
  t.bigint,
  t.number,
  t.string,
)

export function ElementSchema<P extends { [x: string]: t.Schema } = {}>(propsSchema?: P): t.object<{
  type: t.any
  props: t.object<P>
  key: Key
}>
export function ElementSchema<P extends { [x: string]: t.Schema } = {}>(propsSchema: P = {} as never) {
  return t.object({
    type: t.any,
    props: t.object(propsSchema),
    key: Key,
  })
}

export const Element = <P extends { [x: string]: t.Schema } = {}>(u: unknown, propsSchema?: P): u is React.ReactElement<P> =>
  ElementSchema(propsSchema)(u)

export function NodeSchema<P extends { [x: string]: t.Schema } = {}>(propsSchema?: P) {
  return t.union(
    ...Scalar.def,
    ElementSchema(propsSchema),
  )
}

export const Node
  : (u: unknown) => u is React.ReactNode
  = NodeSchema()

export function FC<P = {}>(u: unknown): u is React.FC<P> {
  return typeof u === 'function'
}

const intrinsic = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'big',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'center',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'keygen',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'menu',
  'menuitem',
  'meta',
  'meter',
  'nav',
  'noindex',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'search',
  'slot',
  'script',
  'section',
  'select',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'template',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr',
  'webview',
  'svg',
  'animate',
  'animateMotion',
  'animateTransform',
  'circle',
  'clipPath',
  'defs',
  'desc',
  'ellipse',
  'feBlend',
  'feColorMatrix',
  'feComponentTransfer',
  'feComposite',
  'feConvolveMatrix',
  'feDiffuseLighting',
  'feDisplacementMap',
  'feDistantLight',
  'feDropShadow',
  'feFlood',
  'feFuncA',
  'feFuncB',
  'feFuncG',
  'feFuncR',
  'feGaussianBlur',
  'feImage',
  'feMerge',
  'feMergeNode',
  'feMorphology',
  'feOffset',
  'fePointLight',
  'feSpecularLighting',
  'feSpotLight',
  'feTile',
  'feTurbulence',
  'filter',
  'foreignObject',
  'g',
  'image',
  'line',
  'linearGradient',
  'marker',
  'mask',
  'metadata',
  'mpath',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'set',
  'stop',
  'switch',
  'symbol',
  'text',
  'textPath',
  'tspan',
  'use',
  'view',
] as const satisfies (keyof React.JSX.IntrinsicElements)[]

export type Intrinsic = typeof intrinsic[number]
export const Intrinsic = t.enum(...intrinsic)

export const ElementType = (u: unknown): u is React.ElementType => t.union(Intrinsic, FC)(u)
