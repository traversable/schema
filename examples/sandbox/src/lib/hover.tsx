import * as React from 'react'
import type { TermWithTypeTree } from './functor'
import * as t from './namespace'
import * as isReact from './react'
import { symbol } from './shared'
import { parseKey } from '@traversable/registry'

const hasSpan = t.has('props', 'children', 2, isReact.Node)

const lensPath = (...path: (keyof any)[]): string => {
  let out: string[] = []
  for (let ix = 0, len = path.length; ix < len; ix++) {
    let x = path[ix]
    switch (true) {
      case x === symbol.union: out.push(`|:${String(path[++ix])}`); continue
      case x === symbol.intersect: out.push(`&:${String(path[++ix])}`); continue
      case x === symbol.array: out.push('[]'); continue
      case x === symbol.record: out.push('{}'); continue
      case x === symbol.set: out.push('^'); continue
      case x === symbol.map: out.push('^^'); continue
      case typeof x === 'number': out.push(`${x}`); continue
      case typeof x === 'string': out.push(`"${x}"`); continue
      case typeof x === 'symbol': continue
      default: console.warn('Unhandled node: ', x satisfies never)
    }
  }
  return out.join('')
}

const dataPath = (...path: (keyof any)[]): string => {
  let out: string[] = []
  for (let ix = 0, len = path.length; ix < len; ix++) {
    let x = path[ix]
    switch (true) {
      case typeof x === 'symbol': { ix++; continue }
      case typeof x === 'number': out.push(`[${x}]`); continue
      case typeof x === 'string': {
        const key = parseKey(x)
        if (key.startsWith('\"') && key.endsWith('\"')) (console.log('BOOGER', key), out.push('[' + key + ']'))
        else out.push(`.${key}`)
        continue
      }
      default: console.warn('Unhandled node: ', x satisfies never)
    }
  }
  return 'data' + out.join('')
}

const LensPath = (props: Path.Props) => <span>schema path: {lensPath(...props.path)}</span>
const DataPath = (props: Path.Props) => <span>path: {dataPath(...props.path)}</span>
const Type = (props: Type.Props) => <span>type: {props.node}</span>

declare namespace Type {
  type Props = {
    node: TermWithTypeTree | React.ReactNode
  }
}

declare namespace Path {
  type Props = {
    path: (keyof any)[]
  }
}

const Newline = () => <><br /><br /></>

const identifier = (node: React.ReactNode, events: Events) => <span {...events} key="2">{node}</span>

interface Events {
  onMouseOver(e: React.MouseEvent): void;
  onMouseLeave(e: React.MouseEvent): void;
}

export function Hover<T extends { initialState?: boolean, texts: TermWithTypeTree, path?: (keyof any)[] }>(props: T): React.JSX.Element {
  const [state, setState] = React.useState(props.initialState ?? false)
  const [schema, type] = props.texts
  const events = {
    onMouseOver(e: React.MouseEvent) { e.stopPropagation(); return setState(true) },
    onMouseLeave(e: React.MouseEvent) { e.stopPropagation(); return setState(false) }
  }
  let SchemaComponent: React.ReactNode
  if (hasSpan(schema)) {
    schema.props.children[2] = identifier(schema.props.children[2], events)
    SchemaComponent = schema
  }
  else SchemaComponent = <span {...events}>{schema}</span>

  return <span style={{ position: 'relative' }}>
    <span style={Hover.style(state)} {...events}>
      <Type node={type} />
      <Newline />
      <DataPath path={props.path ?? []} />
      {/* <Newline />
      <LensPath path={props.path ?? []} /> */}
    </span>
    {SchemaComponent}
  </span>
}

Hover.style = (state: boolean) => ({
  // display: state ? 'unset' : 'none',
  opacity: state ? 1 : 0,
  boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.1)',
  borderRadius: '4px',
  position: 'absolute',
  left: '0.7rem',
  top: '1.4rem',
  zIndex: state ? 99 : -99,
  marginLeft: 5,
  // transition: 'opacity 0.1s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
  background: '#FFFFAA',
  border: '2px solid #FFAD33',
  padding: '0.6rem 1.2rem',
  lineHeight: 1,
} as const)
