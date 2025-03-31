import * as React from 'react'
import * as fc from 'fast-check'

import { t } from '../lib'
import { Hover } from '../lib/hover'
import { spacemacs as theme } from '../lib/theme'

/**
 * DEMO: advanced
 * 
 * How to take full advantage of the core primitive that `@traverable/schema` is
 * built on: recursion schemes.
 * 
 * The point of recursion schemes is to "factor out recursion".
 *
 * If this is the first time you've heard of recursion schemes and would like to
 * learn more about how they work, here are a couple articles about it:
 * 
 * - [Recursion in TypeScript (without the tears)](https://dev.to/ahrjarrett/typesafe-recursion-in-typescript-1pe0)
 * - [A Brief Introduction to Recursion Schemes](https://medium.com/@jnkrtech/a-brief-introduction-to-recursion-schemes-6192e55758be)
 * 
 * But if you don't care about the theory at all and just want to see it in use,
 * here's an example that recursively renders an HTML tree based on the schema's
 * content.
 */

const Newline = () => <><br /><br /></>

const Button = ({ forceRerender }: { forceRerender(): void }) =>
  <button onClick={forceRerender} style={{ backgroundColor: theme.blue, color: theme['head2-bg'] }}>Randomize</button>

export const HardcodedSchemaExamples = () => <>
  <Hover texts={t.toHtml(t.set(t.boolean))} />
  <Newline />
  <Hover texts={t.toHtml(t.map(t.array(t.union(t.string, t.number)), t.integer))} />
  <Newline />
  <Hover texts={t.toHtml(t.never)} />
  <Newline />
  <Hover texts={t.toHtml(t.any)} />
  <Newline />
  <Hover texts={t.toHtml(t.unknown)} />
  <Newline />
  <Hover texts={t.toHtml(t.void)} />
  <Newline />
  <Hover texts={t.toHtml(t.null)} />
  <Newline />
  <Hover texts={t.toHtml(t.undefined)} />
  <Newline />
  <Hover texts={t.toHtml(t.symbol)} />
  <Newline />
  <Hover texts={t.toHtml(t.boolean)} />
  <Newline />
  <Hover texts={t.toHtml(t.integer)} />
  <Newline />
  <Hover texts={t.toHtml(t.integer.min(-10))} />
  <Newline />
  <Hover texts={t.toHtml(t.integer.max(255))} />
  <Newline />
  <Hover texts={t.toHtml(t.bigint)} />
  <Newline />
  <Hover texts={t.toHtml(t.number)} />
  <Newline />
  <Hover texts={t.toHtml(t.string)} />
  <Newline />
  <Hover texts={t.toHtml(t.string.min(3))} />
  <Newline />
  <Hover texts={t.toHtml(t.string.max(255))} />
  <Newline />
  <Hover texts={t.toHtml(t.eq({ xyz: [1, "two", false] }))} />
  <Newline />
  <Hover texts={t.toHtml(t.array(t.boolean))} />
  <Newline />
  <Hover texts={t.toHtml(t.record(t.string))} />
  <Newline />
  <Hover texts={t.toHtml(t.optional(t.number))} />
  <Newline />
  <Hover texts={t.toHtml(t.union(t.string, t.boolean))} />
  <Newline />
  <Hover texts={t.toHtml(t.intersect(t.object({ a: t.string }), t.object({ b: t.integer })))} />
  <Newline />
  <Hover texts={t.toHtml(t.tuple(t.string, t.null, t.boolean))} />
  <Newline />
  <Hover texts={t.toHtml(t.tuple(t.string, t.optional(t.null), t.optional(t.boolean)))} />
  <Newline />
  <Hover texts={t.toHtml(
    t.object({
      a: t.null,
      b: t.optional(t.string),
      c: t.object({ d: t.boolean })
    })
  )} />
  <Newline />
</>

export declare namespace RandomlyGeneratedSchemas {
  type Props = {
    howManyToGenerate: number
  }
}

export const RandomlyGeneratedSchemas = (props: RandomlyGeneratedSchemas.Props) => {
  const [, forceRerender] = React.useReducer((x) => x + 1, 0)
  const seed = t.Seed.schemaWithMinDepth({ exclude: ['never', 'any', 'unknown', 'void', 'eq'] }, 3)
  const schemas = fc.sample(seed, props.howManyToGenerate)
  return <>
    <Button forceRerender={forceRerender} />
    <Newline />
    {schemas.map((schema, ix) => <span key={ix}><Hover texts={t.toHtml(schema)} /><Newline /></span>)}
    <Newline />
  </>
}
