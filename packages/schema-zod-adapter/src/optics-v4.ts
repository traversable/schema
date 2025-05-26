import type { Box } from '@traversable/registry'
import { fn, Object_assign, Object_create, Option, symbol } from '@traversable/registry'

import type { Applicative, Apply } from './instances-v4.js'

export * as Iso from './iso-v4.js'
export interface Iso<S, T> {
  [symbol.tag]: 'Iso'
  decode(s: S): T
  encode(t: T): S
}

/**
 * Law #1: calling `match` then `embed` is the same as doing nothing at all
 * Law #2: `S` can be completely described by the combination of the focus of the prism and the prism itself
 */
export * as Prism from './prism-v4.js'
export interface Prism<S, A> {
  [symbol.tag]: 'Prism'
  match(s: S): Option<A>
  embed(a: A): S
}

export * as Lens from './lens-v4.js'
export interface Lens<S, A> {
  [symbol.tag]: 'Lens'
  get(s: S): A
  set(a: A): (s: S) => S
}

export * as Optional from './optional-v4.js'
export interface Optional<S, A> {
  [symbol.tag]: 'Optional'
  getOption(s: S): Option<A>
  set(a: A): (s: S) => S
}

export * as Traversal from './traversal-v4.js'
export interface Traversal<S, A> {
  [symbol.tag]: 'Traversal'
  modify<F extends Box.any>(F: Applicative<F>): (f: (a: A) => Box<F, A>) => (s: S) => Box<F, S>
}

export interface TraversalWithPredicate<S, A> {
  [symbol.tag]: 'TraversalWithPredicate'
  modifyWithFallback<F extends Box.any>(F: Apply<F>): (f: (a: A) => Box<F, A>, fallback: Box<F, A>) => (s: S) => Box<F, S>
}
