import * as vi from 'vitest'
import type { GlobalConfig } from '@traversable/schema-core'
import { configure, getConfig, t } from '@traversable/schema-core'

let config: GlobalConfig

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema/config❳', () => {
  vi.it('〖⛳️〗› ❲config#configure❳', () => {
    vi.assert.equal(config, void 0)
    configure()

    config = getConfig()
    vi.assert.isFalse(config.schema.treatArraysAsObjects)
    vi.assert.equal(config.schema.optionalTreatment, 'presentButUndefinedIsOK')

    configure({ schema: { treatArraysAsObjects: true } })
    config = getConfig()
    vi.assert.isTrue(config.schema.treatArraysAsObjects)

    configure({ schema: { treatArraysAsObjects: false } })
    config = getConfig()
    vi.assert.isFalse(config.schema.treatArraysAsObjects)

    configure({ schema: { optionalTreatment: 'exactOptional' } })
    config = getConfig()
    vi.assert.equal(config.schema.optionalTreatment, 'exactOptional')
  })
})
