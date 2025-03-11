import { useReducer } from 'react'
import * as fc from 'fast-check'
import { t } from '@traversable/schema'

t.object({
  abc: t.number
}).toString

const data = {
  title: {
    href: 'https://github.com/traversable/schema/blob/main/packages/json/README.md',
    pkgName: '@traversable/json',
  }
}

interface Builder<T = null | boolean | number | string> {
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
  {/* <pre>{prettyPrint(_props.data as Json.Fixpoint)}</pre> */}
</>

export function Sandbox() {
  const [renderCount, forceRender] = useReducer(x => x + 1, 0)
  return <>
    <p>Render #{renderCount}</p>

    <Title />
    <button onClick={forceRender}>Regenerate</button>
    <Data renderCount={renderCount} data={fc.sample(arbitrary.json, 1)[0]} />
  </>
}

