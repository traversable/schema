import * as vi from 'vitest'
import { t } from '@traversable/schema'
import { typebox } from '@traversable/derive-codec'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/TODO❳', () => {
  vi.it('〖⛳️〗› ❲compile❳', () => {
    let User = t.object({
      id: t.union(t.null, t.any),
      name: t.string,
      BLAH: t.optional(t.object({
        CHILD: t.boolean,
      }))
    })

    vi.expect(typebox.compile(User)).toMatchInlineSnapshot(`
      "function $fallback(instancePath, schemaPath, message) {
        context.errors.push({
          message: message,
          instancePath: instancePath,
          schemaPath: schemaPath,
        })
      }
      let result = {}
      if (typeof input) === 'object' && input !== null) {
        const __D1.name = {}

      if (typeof input.name) === 'object' && input.name !== null) {
        const __D2.id = {}

      if (typeof input.name.id === 'boolean') {
        __D2.id = input.name.id
      } else {
        $fallback("#/name/id", "#/properties/name/properties/id", "expected boolean")
      }

        __D1.name = _D2
      } else {
        $fallback("#/name", "#/properties/name", "expected object")
      }

        result = _D1
      } else {
        $fallback("#", "#", "expected object")
      }"
    `)
  })
})
