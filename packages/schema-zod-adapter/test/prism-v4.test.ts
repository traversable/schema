import * as vi from 'vitest'
import { v4 } from '@traversable/schema-zod-adapter'
import { fn } from '@traversable/registry'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-zod-adapter❳', () => {
  vi.it('〖⛳️〗› ❲v4.Prism❳', () => {
    type Leaf = { _tag: 'Leaf' }
    type Node = {
      _tag: 'Node'
      value: number
      left: Tree
      right: Tree
    }

    type Tree = Leaf | Node

  })
})
