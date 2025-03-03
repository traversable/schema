import { useReducer } from 'react'
import * as fc from 'fast-check'
import { Json } from '@traversable/json'

const prettyPrint = Json.fold<string>((data) => {
  switch (true) {
    case typeof data === 'bigint': return `${data}n`
    case typeof data === 'string': return `"${data}"`
    case Json.isScalar(data): return `${data}`
    case Json.isArray(data): return `[${data.join(',')}]`
    case Json.isObject(data): return `{ ${Object.entries(data).map(([k, v]) => `"${k}": ${v}`).join(', ')} }`
    default: return data
  }
})

const data = {
  title: {
    href: 'https://github.com/traversable/schema/blob/main/packages/json/README.md',
    pkgName: '@traversable/json',
  }
}

interface Builder<T = null | boolean | number | string> {
  // scalar: T
  array: T[]
  object: { [x: string]: T }
  json: T | Omit<this, 'json'>[Exclude<keyof this, 'json'>]
}

const builder
  : <T extends readonly unknown[]>(...scalars: { [Ix in keyof T]: fc.Arbitrary<T[Ix]>; }) => fc.LetrecValue<Builder<T[number]>>
  = (...scalars) => fc.letrec((loop) => {
    return {
      array: fc.array(loop('json')),
      object: fc.dictionary(fc.string(), loop('json')),
      json: fc.oneof(
        ...scalars,
        loop('array'),
        loop('object'),
      )
    }
  })

const arbitrary = builder(
  fc.constant(null),
  fc.boolean(),
  fc.float(),
  fc.bigInt(),
  fc.string()
)

const Title = () => <h1>
  Example from the {' '}
  <a href={data.title.href} target="_blank"><code>{data.title.pkgName}</code> docs</a>
</h1>

type DataProps<T> = {
  renderCount: number
  data: T
}

const Data = <T,>(_props: DataProps<T>) => <>
  <pre>{prettyPrint(_props.data)}</pre>
</>

export function App() {
  const [renderCount, forceRender] = useReducer(x => x + 1, 0)
  return <>
    <p>Render #{renderCount}</p>

    <Title />
    <button onClick={forceRender}>Regenerate</button>
    <Data renderCount={renderCount} data={fc.sample(arbitrary.json, 1)[0]} />
  </>
}

