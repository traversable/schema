import { assert, it, describe, vi } from 'vitest'

import { t } from '@traversable/schema-core'

describe('〖⛳️〗‹‹‹ ❲@traversable/derive-codec❳', async () => {
  it('〖⛳️〗› ❲pre-install❳', async () => {
    assert.isFalse(t.has('pipe')(t.string))
    assert.isFalse(t.has('extend')(t.string))
  })

  it('〖⛳️〗› ❲post-install❳', async () => {
    assert.isFalse(t.has('pipe')(t.string))
    assert.isFalse(t.has('extend')(t.string))

    await vi.waitFor(() => import('@traversable/derive-codec/install'))

    assert.isTrue(t.has('pipe')(t.string))
    assert.isTrue(t.has('extend')(t.string))

    let codec_01 = t.array(t.string)
      .pipe((ss) => ss.map(Number))
      .unpipe((xs) => xs.map(String))

    assert.deepEqual(codec_01.decode(['1', '2', '3']), [1, 2, 3])
    assert.deepEqual(codec_01.encode([1, 2, 3]), ['1', '2', '3'])

    let codec_02 = t.array(t.array(t.integer))
      .pipe((xss) => xss.map((xs) => xs.map((x) => [x] satisfies [any])))
      .unpipe((yss) => yss.map((ys) => ys.map(([y]) => y)))
      .pipe((xss) => xss.map((xs) => xs.map(([x]) => [x - 1] satisfies [any])))
      .unpipe((yss) => yss.map((ys) => ys.map(([y]) => [y + 1])))

    assert.deepEqual(codec_02.decode(
      [[0, 1, 2], [3, 4, 5], [6, 7, 8]]
    ), [[[-1], [0], [1]], [[2], [3], [4]], [[5], [6], [7]]])

    assert.deepEqual(codec_02.encode(
      [[[-1], [0], [1]], [[2], [3], [4]], [[5], [6], [7]]]
    ), [[0, 1, 2], [3, 4, 5], [6, 7, 8]])
  })
})
