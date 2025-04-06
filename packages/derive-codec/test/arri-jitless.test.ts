import * as vi from 'vitest'
import { t } from '@traversable/schema'
import { arri } from '@traversable/derive-codec'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/TODO❳', () => {
  vi.it('〖⛳️〗› ❲compile❳', () => {
    let User = t.object({
      UUID: t.union(t.null, t.any),
      NAME: t.optional(t.string),
      // BLAH: t.optional(t.object({
      //   CHILD: t.boolean,
      // }))
    })

    /**
     * @example
     * let result = {};
     * 
     * if (typeof input === 'object' && input !== null) {
     *   const __D1 = {};
     *   if (Array.isArray(input.PET_NAMES)) {
     *     const __D2 = [];
     *     for(const __D2AItem of input.PET_NAMES) {
     *       let __D2AItemAResult;
     *       if (typeof __D2AItem === 'string') {
     *         __D2AItemAResult = __D2AItem;
     *       } else {
     *         $fallback("/PET_NAMES/[i]", "/properties/PET_NAMES/elements/type", "expected string");
     *       }
     *       __D2.push(__D2AItemAResult);
     *     }
     *     __D1.PET_NAMES = __D2;
     *   } else {
     *     $fallback("/PET_NAMES", "/properties/PET_NAMES", "Expected Array");
     *   }
     *   if (typeof input.BLAH === 'undefined') {
     *     // ignore undefined
     *   } else {
     *     if (typeof input.BLAH === 'object' && input.BLAH !== null) {
     *       const __D2 = {};
     *       if (typeof input.BLAH.CHILD === 'boolean') {
     *         __D2.CHILD = input.BLAH.CHILD;
     *       } else {
     *         $fallback("/BLAH/CHILD", "/optionalProperties/BLAH/properties/CHILD/type", "expected boolean");
     *       }
     *       __D1.BLAH = __D2;
     *     } else {
     *       $fallback("/BLAH", "/optionalProperties/BLAH", "Expected object");
     *     }
     *   }
     *   result = __D1;
     * } else {
     *   $fallback("", "", "Expected object");
     * }
     * return result
     */

    vi.expect(arri.compile(User)).toMatchInlineSnapshot(`
      "function $fallback(instancePath, schemaPath, message) {
        context.errors.push({
          message: message,
          instancePath: instancePath,
          schemaPath: schemaPath,
        })
      }
      let result = {}
      if (typeof input) === 'object' && input !== null) {
        let __D1.UUID = {}
        let hasBeenSatisfied = false
        let __D1.NAME = {}

        let __D1.BLAH = {}
      OPTIONAL
        result = __D1
      } else {
        $fallback("", "", "expected object")
      }"
    `)
  })
})

/* 
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
*/
