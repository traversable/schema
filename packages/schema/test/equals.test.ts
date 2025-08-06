import * as vi from 'vitest'
import * as NodeJSUtil from 'node:util'
import * as fc from 'fast-check'

import { Equal } from '@traversable/schema'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema/equal❳', () => {
  vi.test('〖⛳️〗› ❲Equal.deep❳: oracle (NodeJSUtil.isDeepStrictEqual)', () => {
    fc.check(
      fc.property(
        fc.anything(), fc.anything(), (xs, ys) => {
          const x = Equal.deep(xs, ys)
          const y = NodeJSUtil.isDeepStrictEqual(xs, ys)
          try {
            vi.assert.isTrue(x === y)
          } catch (e) {
            vi.assert.fail(''
              + '\n\n\r\
      \r\
      \r\
        Given:\n\n\
        xs\n  ' + JSON.stringify(xs) + '\n\n\r\
        ys\n  ' + JSON.stringify(ys) + '\n\n\r\
      |              TEST              |  RESULT  |\n\
      |--------------------------------+----------|\n\
      | Equal.deep(xs, ys)             |    ' + (x === true ? ' ' : '') + x + ' |\n\r\
      | Node.isDeepStrictEqual(xs, ys) |    ' + (y === true ? ' ' : '') + y + ' |\n\r\
      |--------------------------------+----------|\n\n'
            )
          }
        }
      ), {
      // numRuns: 100_000,
    })
  })
})
