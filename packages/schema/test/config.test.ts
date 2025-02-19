import * as vi from 'vitest'
import type { GlobalConfig } from '@traversable/schema'
import { configure } from '@traversable/schema'

let config: GlobalConfig

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema/config❳', () => {
  vi.it('〖⛳️〗› ❲config#configure❳', () => {
    vi.assert.equal(config, void 0)
    config = configure()
    vi.assert.isFalse(config.schema.treatArraysAsObjects)
    vi.assert.equal(config.schema.optionalTreatment, 'presentButUndefinedIsOK')

    config = configure({ schema: { treatArraysAsObjects: true } })
    vi.assert.isTrue(config.schema.treatArraysAsObjects)

    config = configure({ schema: { treatArraysAsObjects: false } })
    vi.assert.isFalse(config.schema.treatArraysAsObjects)

    config = configure({ schema: { optionalTreatment: 'exactOptional' } })
    vi.assert.equal(config.schema.optionalTreatment, 'exactOptional')
  })
})
