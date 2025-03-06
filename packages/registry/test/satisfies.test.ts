import type { NonUnion } from '@traversable/registry'
import * as vi from 'vitest'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/registry❳', () => {
  vi.it('〖⛳️〗› ❲NonUnion❳', () => {
    function nonunion<T extends NonUnion<T>>(x: T): T
    function nonunion(x: unknown) { return x }

    vi.assertType<1>(nonunion(1))
    vi.assertType<number>(nonunion(1 as number))

    /* @ts-expect-error */
    vi.assertType<never>(nonunion(1 as 1 | 2))
    /* @ts-expect-error */
    nonunion(Math.random() > 0.5)
  })
})
