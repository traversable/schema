import { assert, describe, it, vi } from 'vitest'
import { t } from '@traversable/schema-core'

describe('〖⛳️〗‹‹‹ ❲@traversable/derive-equals❳', async () => {
  it('〖⛳️〗› ❲pre-install❳', () => assert.isFalse(t.has('equals')(t.string)))

  it('〖⛳️〗› ❲post-install❳', async () => {
    assert.isFalse(t.has('equals')(t.string))
    assert.isFalse(t.has('equals')(t.array(t.string)))

    await vi.waitFor(() => import('@traversable/derive-equals/install'))

    assert.isTrue(t.has('equals')(t.string))
    assert.isTrue(t.has('equals')(t.array(t.string)))

    assert.isTrue(t.string.equals('', ''))
    assert.isFalse(t.string.equals('a', 'b'))

    assert.isTrue(t.array(t.string).equals([], []))
    assert.isTrue(t.array(t.string).equals([''], ['']))
    assert.isFalse(t.array(t.string).equals(['a'], []))
    assert.isFalse(t.array(t.string).equals(['a'], ['b']))

    assert.isTrue(t.array(t.array(t.string)).equals([], []))
    assert.isTrue(t.array(t.array(t.string)).equals([[]], [[]]))
    assert.isTrue(t.array(t.array(t.string)).equals([['a']], [['a']]))
    assert.isTrue(t.array(t.array(t.string)).equals([[], ['b']], [[], ['b']]))

    assert.isFalse(t.array(t.array(t.string)).equals([[]], [['c']]))
    assert.isFalse(t.array(t.array(t.string)).equals([['d']], [['e']]))
    assert.isFalse(t.array(t.array(t.string)).equals([['f']], [['f', 'g']]))
  })
})
