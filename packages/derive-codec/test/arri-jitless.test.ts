import * as vi from 'vitest'
import { t } from '@traversable/schema'
import { arri } from '@traversable/derive-codec'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/TODO❳', () => {
  vi.it('〖⛳️〗› ❲compile❳', () => {
    let User = t.object({
      UUID: t.null,
      NAME: t.optional(t.null),
      BLAH: t.object({ BOOP: t.array(t.string) }),
      UNION: t.union(t.string, t.number),
      //   t.object({
      //   CHILD: t.boolean,
      // }))
    })

    console.log(User.opt)

    /**
     * @example
     * let result = {};
     * 
     * if (typeof input === 'object' && input !== null) {
     *   const __D1 = {};
     * 
     * 
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
     * 
     * 
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
      if (typeof input === 'object' && input !== null) {
        let __D1 = {}
          if (typeof input.UUID === null) {
            __D1.UUID = input.UUID
          } else {
            $fallback(
              "#/UUID",
              "#/UUID",
              "expected null"
            )
          }
        if (input.NAME === void 0) { /* optional, nothing to do */ } else {
          if (typeof input.NAME === null) {
            __D1.NAME = input.NAME
          } else {
            $fallback(
              "#/NAME",
              "#/NAME",
              "expected null"
            )
          }
        }
      if (typeof input.BLAH === 'object' && input.BLAH !== null) {
        let __D1.BLAH = {}
          if (Array.isArray(input.BLAH.BOOP)) {
            let __D3 = []
            for (let __D3_A of input.BLAH.BOOP) {
              let __D3_A_result
                if (typeof __D3_A === 'string') {
              __D3_A_result = __D3_A
            } else {
              $fallback(
                "#/BLAH/BOOP/[i]",
                "#/BLAH/BOOP/Symbol(@traversable/schema/URI::array)/type",
                "expected string")
            }
            __D3.push(__D__D2_result)
          }
      }
        result = __D2
      } else {
        $fallback(
          "#/BLAH",
          "#/BLAH",
          "expected object"
        )
      }
      let hasBeenSatisfied = false
      let __D2_Errors
          if (typeof __D1 === 'string') {
          hasBeenSatisfied = true;
            __D1_result = __D1
          } else {
            $fallback(
              "#/UNION",
              "#/UNION/Symbol(@traversable/schema/URI::union)/0/type",
              "expected string")
          }
      if (typeof input_Object__UNION_Union === 'number') {
      hasBeenSatisfied = true;
        __D2_Union = input_Object__UNION_Union
      } else {
        $fallback(
          "#/UNION",
          "#/UNION/Symbol(@traversable/schema/URI::union)/1/type",
          "expected boolean"
        )
      }
        result = __D1
      } else {
        $fallback(
          "#/",
          "#/",
          "expected object"
        )
      }"
    `)
  })
})

/* 
     * 
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
     * 
*/

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
