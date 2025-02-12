import { guard } from '@traversable/guard'
import * as vi from 'vitest'
import pkg from '../package.json'

vi.describe('guard', () => {
  vi.it('guard.VERSION', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(guard.VERSION, expected)
  })
})