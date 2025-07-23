import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'

import { JsonSchema } from '@traversable/json-schema'
import { fn } from '@traversable/registry'
import { jsonSchemaTest } from '@traversable/json-schema-test'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

const stringify = (_: string, v: unknown) =>
  typeof v === 'symbol' ? String(v) : typeof v === 'bigint' ? `${v}n` : v

type LogFailureDeps = {
  msg: string
  seed: jsonSchemaTest.Seed.Seed.Fixpoint
  schema: JsonSchema
  errors?: unknown[]
  data: unknown
}

const fail = (e: unknown, { msg, seed, data, schema }: LogFailureDeps) => {
  console.group(`\r\n\nFAILURE: ${msg}`)
  console.error('\r\nError:', e)
  console.debug('\r\nseed: ', JSON.stringify(seed, stringify, 2))
  console.debug('\r\ndata: ', data === '' ? '<empty string>' : data)
  console.debug('\r\ncheck: ', format(JsonSchema.check.writeable(schema)))
  console.debug('\r\nschema: ', JSON.stringify(schema, null, 2))
  console.debug('\r\n\n')
  console.groupEnd()
  vi.assert.fail(`\r\nFAILURE: ${msg}`)
}

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/json-schema❳', () => {
  vi.it('〖️⛳️〗› ❲JsonSchema.equals❳', () => {
    vi.assert.isTrue(true)
  })
})
