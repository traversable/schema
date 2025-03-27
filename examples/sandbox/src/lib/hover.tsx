import type { Target } from '@traversable/registry'
import * as React from 'react'
import type { TermWithTypeTree } from './functor'
import * as t from './namespace'
import * as isReact from './react'

const hasSpan = t.has('props', 'children', 2, isReact.Node)

export function Hover<T extends { initialState?: boolean, texts: TermWithTypeTree, path?: (keyof any)[] }>(props: T): React.JSX.Element {
  const [state, setState] = React.useState(props.initialState ?? false)
  const [Term, Type] = props.texts
  const events = {
    onMouseOver(e: React.MouseEvent) { e.stopPropagation(); return setState(true) },
    onMouseLeave(e: React.MouseEvent) { e.stopPropagation(); return setState(false) }
  }
  let Component: React.ReactNode
  if (hasSpan(Term)) {
    Term.props.children[2] = <span {...events} key="2">{Term.props.children[2]}</span>
    Component = Term
  }
  else Component = <span {...events}>{Term}</span>

  return <span style={{ position: 'relative' }}>
    <span style={Hover.style(state)} {...events}>{Type}</span>
    {Component}
  </span>
}

Hover.style = (state: boolean) => ({
  display: state ? 'unset' : 'none',
  boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.1)',
  borderRadius: '4px',
  position: 'absolute',
  left: '0.7rem',
  top: '1.4rem',
  zIndex: 99,
  marginLeft: 5,
  background: '#FFFFAA',
  border: '2px solid #FFAD33',
  padding: '0.6rem 1.2rem',
  lineHeight: 1,
} as const)
