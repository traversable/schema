import { t } from '../lib'

/**
 * DEMO: toJsonSchema()
 */
let ex_02 = t.object({
  bool: t.optional(t.boolean),
  nested: t.object({
    int: t.integer,
    union: t.union(
      t.eq(1),
      t.tuple(
        t.eq(1),
        t.optional(t.eq(2)),
        t.optional(t.eq(3)),
        // t.eq(4),
        // ^^ Uncommenting this line will raise a TypeError:
        // 🚫 't.null' is not assignable to 'TypeError<"A required element cannot follow an optional element.">'
      ),
    )
  }),
  stringOrNumber: t.union(t.string, t.number),
})

let JSONSchema = ex_02.toJsonSchema()

console.group('=========================\n\r  DEMO: .toJsonSchema()\n=========================\n\r')
console.debug('JSONSchema:', JSONSchema)
console.assert(t.eq(JSONSchema)({
  type: 'object',
  required: ['nested', 'stringOrNumber'],
  properties: {
    bool: { type: 'boolean' },
    nested: {
      type: 'object',
      required: ['int', 'union'],
      properties: {
        int: { type: 'integer' },
        union: {
          anyOf: [
            { const: 1 },
            {
              type: 'array',
              additionalItems: false,
              minItems: 1,
              maxItems: 3,
              items: [{ 'const': 1 }, { 'const': 2 }, { 'const': 3 }],
            }
          ]
        }
      }
    },
    stringOrNumber: { anyOf: [{ type: 'string' }, { type: 'number' }] }
  }
}))
console.groupEnd()
