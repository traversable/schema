import { useReducer } from 'react'
import * as fc from 'fast-check'
import { t } from '@traversable/schema'
import '@traversable/schema-to-string'
import '@traversable/schema-to-json-schema'

t.object({
  abc: t.number
}).toString

t.intersect(t.object({ a: t.string }), t.object({ b: t.number })).def

const classes = t.object({
  error: (v) => v instanceof Error,
  typeError: (v) => v instanceof TypeError,
  readableStream: (v) => v instanceof ReadableStream,
  syntaxError: (v) => v instanceof SyntaxError,
  buffer: (v) => v instanceof ArrayBuffer,
  promise: (v) => v instanceof Promise,
  set: (v) => v instanceof Set,
  map: (v) => v instanceof Map,
  weakMap: (v) => v instanceof WeakMap,
  date: (v) => v instanceof Date,
  regex: (v) => v instanceof RegExp,
})

const values = t.object({
  successStatus: (v) => v === 200 || v === 201 || v === 202 || v === 204,
  clientErrorStatus: (v) => v === 400 || v === 401 || v === 403 || v === 404,
  serverErrorStatus: (v) => v === 500 || v === 502 || v === 503,
  teapot: (v) => v === 418,
  true: (v) => v === true,
  false: (v) => v === false,
  mixed: (v) => Array.isArray(v) || v === true,
  startsWith: (v): v is `bill${string}` => typeof v === 'string' && v.startsWith('bill'),
  endsWith: (v): v is `${string}murray` => typeof v === 'string' && v.endsWith('murral'),
  function: (v) => typeof v === 'function',
})

const shorthand = t.object({
  nonnullable: Boolean,
  unknown: () => true,
  never: () => false,
})

const schema_03 = t.object({
  bool: t.optional(t.boolean),
  nested: t.object({
    int: t.integer,
    union: t.union(
      t.eq(1),
      t.tuple(
        t.eq(1),
        t.optional(t.eq(2)),
        t.optional(t.eq(3)),
        // t.eq(4),
        // ^^ Uncommenting this line will raise a TypeError:
        // 🚫 't.null' is not assignable to 'TypeError<"A required element cannot follow an optional element.">'
      ),
    )
  }),
  stringOrNumber: t.union(t.string, t.number),
}).jsonSchema().properties.nested

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

