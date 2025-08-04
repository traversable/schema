import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'
import type { AnyValibotSchema } from '@traversable/valibot-types'
import { vx } from '@traversable/valibot'
import { vxTest } from '@traversable/valibot-test'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

type LoggerDeps = {
  schema: AnyValibotSchema
  data: unknown
  error: unknown
  clone?: unknown
}

function logger({ schema, data, clone, error }: LoggerDeps) {
  console.group('FAILURE: property test for vx.deepClone')
  console.error('ERROR:', error)
  console.debug('schema:', vx.toString(schema))
  console.debug('deepClone:', format(vx.deepClone.writeable(schema, { typeName: 'Type' })))
  console.debug('data:', data)
  if (data === undefined || clone !== undefined) {
    console.debug('clone:', clone)
  }
  console.groupEnd()
}

const Builder = vxTest.SeedGenerator({
  exclude: vx.deepClone.unfuzzable
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/valibot❳', () => {
  vi.test('〖⛳️〗› ❲vx.deepClone❳: fuzz tests', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          const schema = vxTest.seedToSchema(seed)
          const deepClone = vx.deepClone(schema)
          const deepEqual = vx.deepEqual(schema)
          const data = vxTest.seedToValidData(seed)
          const clone = deepClone(data)
          try {
            vi.expect.soft(clone).to.deep.equal(data)
            vi.assert.isTrue(deepEqual(clone, data))
          } catch (error) {
            logger({ schema, data, clone, error })
            vi.expect.fail('Cloned data was not equal')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })
})
