import * as vi from 'vitest'
import {
  bindJsonSchemas,
  bindPipes,
  bindToStrings,
  t,
  JsonSchema,
  core,
  // toString,
  pipe,
} from '@traversable/schema'

declare module '@traversable/schema' {
  interface NeverSchema extends JsonSchema.NeverJsonSchema { }
  interface UnknownSchema extends JsonSchema.UnknownJsonSchema { }
  interface VoidSchema extends JsonSchema.VoidJsonSchema { }
  interface AnySchema extends JsonSchema.AnyJsonSchema { }
  interface NullSchema extends JsonSchema.NullJsonSchema { }
  interface UndefinedSchema extends JsonSchema.UndefinedJsonSchema { }
  interface SymbolSchema extends JsonSchema.SymbolJsonSchema { }
  interface BooleanSchema extends JsonSchema.BooleanJsonSchema { }
  interface IntegerSchema extends JsonSchema.IntegerJsonSchema { }
  interface BigIntSchema extends JsonSchema.BigIntJsonSchema { }
  interface NumberSchema extends JsonSchema.NumberJsonSchema { }
  interface StringSchema extends JsonSchema.StringJsonSchema { }
  interface EqSchema<V> extends JsonSchema.EqJsonSchema<V> { }
  interface OptionalSchema<S> extends JsonSchema.OptionalJsonSchema<S> { }
  interface ArraySchema<S> extends JsonSchema.ArrayJsonSchema<S> { }
  interface RecordSchema<S> extends JsonSchema.RecordJsonSchema<S> { }
  interface UnionSchema<S extends readonly unknown[]> extends JsonSchema.UnionJsonSchema<S> { }
  interface IntersectSchema<S extends readonly unknown[]> extends JsonSchema.IntersectJsonSchema<S> { }
  interface TupleSchema<S extends readonly unknown[]> extends JsonSchema.TupleJsonSchema<S> { }
  interface ObjectSchema<S extends { [x: string]: unknown }> extends JsonSchema.ObjectJsonSchema<S> { }
}

// declare module '@traversable/schema' {
//   interface NeverSchema extends toString.toString_never { }
//   interface UnknownSchema extends toString.toString_unknown { }
//   interface VoidSchema extends toString.toString_void { }
//   interface AnySchema extends toString.toString_any { }
//   interface NullSchema extends toString.toString_null { }
//   interface UndefinedSchema extends toString.toString_undefined { }
//   interface SymbolSchema extends toString.toString_symbol { }
//   interface BooleanSchema extends toString.toString_boolean { }
//   interface IntegerSchema extends toString.toString_integer { }
//   interface BigIntSchema extends toString.toString_bigint { }
//   interface NumberSchema extends toString.toString_number { }
//   interface StringSchema extends toString.toString_string { }
//   interface EqSchema<V> extends toString.toString_eq<V> { }
//   interface OptionalSchema<S> extends toString.toString_optional<S> { }
//   interface ArraySchema<S> extends toString.toString_array<S> { }
//   interface RecordSchema<S> extends toString.toString_record<S> { }
//   interface UnionSchema<S extends readonly unknown[]> extends toString.toString_union<S> { }
//   interface IntersectSchema<S extends readonly unknown[]> extends toString.toString_intersect<S> { }
//   interface TupleSchema<S extends readonly unknown[]> extends toString.toString_tuple<S> { }
//   interface ObjectSchema<S extends { [x: string]: unknown }> extends toString.toString_object<S> { }
// }

declare module '@traversable/schema' {
  interface NeverSchema extends pipe<core.never> { }
  interface UnknownSchema extends pipe<core.unknown> { }
  interface VoidSchema extends pipe<core.void> { }
  interface AnySchema extends pipe<core.any> { }
  interface NullSchema extends pipe<core.null> { }
  interface UndefinedSchema extends pipe<core.undefined> { }
  interface SymbolSchema extends pipe<core.symbol> { }
  interface BooleanSchema extends pipe<core.boolean> { }
  interface IntegerSchema extends pipe<core.integer> { }
  interface BigIntSchema extends pipe<core.bigint> { }
  interface NumberSchema extends pipe<core.number> { }
  interface StringSchema extends pipe<core.string> { }
  interface EqSchema<V> extends pipe<core.eq.def<V>> { }
  interface OptionalSchema<S> extends pipe<core.optional.def<S>> { }
  interface ArraySchema<S> extends pipe<core.array.def<S>> { }
  interface RecordSchema<S> extends pipe<core.record.def<S>> { }
  interface UnionSchema<S extends readonly unknown[]> extends pipe<core.union.def<S>> { }
  interface IntersectSchema<S extends readonly unknown[]> extends pipe<core.intersect.def<S>> { }
  interface TupleSchema<S extends readonly unknown[]> extends pipe<core.tuple.def<S>> { }
  interface ObjectSchema<S extends { [x: string]: unknown }> extends pipe<core.object.def<S>> { }
}

const getSchema = () => t.object({
  never: t.never,
  unknown: t.unknown,
  any: t.any,
  void: t.void,
  null: t.null,
  undefined: t.undefined,
  symbol: t.symbol,
  boolean: t.boolean,
  integer: t.integer,
  bigint: t.bigint,
  number: t.number,
  string: t.string,
  eq: t.eq(100),
  array: t.array(t.null),
  arrays: t.array(t.array(t.integer)),
  record: t.record(t.integer),
  records: t.record(t.record(t.integer)),
  emptyUnion: t.union(),
  union: t.union(t.number),
  unions: t.union(t.union(t.string)),
  emptyIntersect: t.intersect(),
  intersects: t.intersect(t.object({ x: t.string }), t.object({ y: t.boolean })),
  emptyTuple: t.tuple(),
  tuple: t.tuple(),
  tuples: t.tuple(t.tuple(t.undefined, t.string), t.tuple(t.integer, t.null)),
  emptyObject: t.object({}),
  object: t.object({ a: t.string, b: t.boolean }),
  objects: t.object({ a: t.object({ b: t.string }), c: t.object({ d: t.boolean }) }),
  optional: t.optional(t.never),
  optionals: t.optional(t.optional(t.boolean)),
})

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳: bind*', () => {
  vi.it('〖⛳️〗‹‹‹ ❲t.bindJsonSchemas❳: `.jsonSchema` method does not exist before binding', () => {
    const schema = getSchema()
    vi.assert.equal(schema.jsonSchema, void 0 as never)
  })
  vi.it('〖⛳️〗‹‹‹ ❲t.bindtoStrings❳: `.toString` method does not exist before binding', () => {
    const schema = getSchema()
    vi.assert.equal(schema.toString(), '(src) => objectGuard(src)')
  })
  vi.it('〖⛳️〗‹‹‹ ❲t.bindPipes❳: `.pipe` method does not exist before binding', () => {
    const schema = getSchema()
    vi.assert.equal((schema as any).pipe, void 0)
  })
  vi.it('〖⛳️〗‹‹‹ ❲t.bindPipes❳: `.extend` method does not exist before binding', () => {
    const schema = getSchema()
    vi.assert.equal((schema as any).extend, void 0)
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳', () => {
  vi.it('〖⛳️〗‹‹‹ ❲t.bindToStrings❳: `.toString` method works as expected once bound', () => {
    void bindToStrings()
    const schema = getSchema()
    vi.assert.equal(t.string.toString(), 'string')
    vi.expect(schema.toString()).toMatchInlineSnapshot(`"{ 'never': never, 'unknown': unknown, 'any': any, 'void': void, 'null': null, 'undefined': undefined, 'symbol': symbol, 'boolean': boolean, 'integer': number, 'bigint': bigint, 'number': number, 'string': string, 'eq': 100, 'array': (null)[], 'arrays': ((number)[])[], 'record': Record<string, number>, 'records': Record<string, Record<string, number>>, 'emptyUnion': never, 'union': (number), 'unions': ((string)), 'emptyIntersect': unknown, 'intersects': ({ 'x': string } & { 'y': boolean }), 'emptyTuple': [], 'tuple': [], 'tuples': [[undefined, string], [number, null]], 'emptyObject': {}, 'object': { 'a': string, 'b': boolean }, 'objects': { 'a': { 'b': string }, 'c': { 'd': boolean } }, 'optional'?: (never | undefined), 'optionals'?: ((boolean | undefined) | undefined) }"`)
  })

  vi.it('〖⛳️〗‹‹‹ ❲t.bindPipes❳: the `pipe` method exists once bound', () => {
    void bindPipes()
    // vi.assert.equal(typeof t.never.pipe, 'function')
    // vi.assert.equal(typeof t.unknown.pipe, 'function')
    // vi.assert.equal(typeof t.any.pipe, 'function')
    // vi.assert.equal(typeof t.void.pipe, 'function')
    // vi.assert.equal(typeof t.null.pipe, 'function')
    // vi.assert.equal(typeof t.undefined.pipe, 'function')
    // vi.assert.equal(typeof t.boolean.pipe, 'function')
    // vi.assert.equal(typeof t.symbol.pipe, 'function')
    // vi.assert.equal(typeof t.integer.pipe, 'function')
    // vi.assert.equal(typeof t.bigint.pipe, 'function')
    // vi.assert.equal(typeof t.number.pipe, 'function')
    // vi.assert.equal(typeof t.string.pipe, 'function')

    vi.assert.equal(typeof t.eq(null).pipe, 'function')
    vi.assert.equal(typeof t.optional(t.never).pipe, 'function')
    vi.assert.equal(typeof t.array(t.never).pipe, 'function')
    vi.assert.equal(typeof t.record(t.never).pipe, 'function')
    vi.assert.equal(typeof t.union().pipe, 'function')
    vi.assert.equal(typeof t.intersect().pipe, 'function')
    vi.assert.equal(typeof t.tuple().pipe, 'function')
    vi.assert.equal(typeof t.object({}).pipe, 'function')
  })

  vi.it('〖⛳️〗‹‹‹ ❲t.bindPipes❳: the `.extend` method exists once bound', () => {
    void bindPipes()
    const schema = getSchema()
    vi.assert.equal(typeof schema.extend, 'function')
  })

  vi.it('〖⛳️〗‹‹‹ ❲t.bindJsonSchemas❳: `.jsonSchema` method works as expected once bound', () => {
    void bindJsonSchemas()
    const schema = getSchema()
    vi.expect(schema.jsonSchema).toMatchInlineSnapshot(`
      {
        "properties": {
          "any": {
            "nullable": true,
            "properties": {},
            "type": "object",
          },
          "array": {
            "items": {
              "enum": [
                null,
              ],
              "type": "null",
            },
            "type": "array",
          },
          "arrays": {
            "items": {
              "items": {
                "type": "integer",
              },
              "type": "array",
            },
            "type": "array",
          },
          "bigint": undefined,
          "boolean": {
            "type": "boolean",
          },
          "emptyIntersect": {
            "allOf": [],
          },
          "emptyObject": {
            "properties": {},
            "required": [],
            "type": "object",
          },
          "emptyTuple": {
            "additionalItems": false,
            "items": [],
            "maxItems": 0,
            "minItems": 0,
            "type": "array",
          },
          "emptyUnion": {
            "anyOf": [],
          },
          "eq": {
            "const": 100,
          },
          "integer": {
            "type": "integer",
          },
          "intersects": {
            "allOf": [
              {
                "properties": {
                  "x": {
                    "type": "string",
                  },
                },
                "required": [
                  "x",
                ],
                "type": "object",
              },
              {
                "properties": {
                  "y": {
                    "type": "boolean",
                  },
                },
                "required": [
                  "y",
                ],
                "type": "object",
              },
            ],
          },
          "never": undefined,
          "null": {
            "enum": [
              null,
            ],
            "type": "null",
          },
          "number": {
            "type": "number",
          },
          "object": {
            "properties": {
              "a": {
                "type": "string",
              },
              "b": {
                "type": "boolean",
              },
            },
            "required": [
              "a",
              "b",
            ],
            "type": "object",
          },
          "objects": {
            "properties": {
              "a": {
                "properties": {
                  "b": {
                    "type": "string",
                  },
                },
                "required": [
                  "b",
                ],
                "type": "object",
              },
              "c": {
                "properties": {
                  "d": {
                    "type": "boolean",
                  },
                },
                "required": [
                  "d",
                ],
                "type": "object",
              },
            },
            "required": [
              "a",
              "c",
            ],
            "type": "object",
          },
          "optional": {},
          "optionals": {
            "type": "boolean",
            Symbol(@traversable/schema/URI::optional): 1,
          },
          "record": {
            "additionalProperties": {
              "type": "integer",
            },
            "type": "object",
          },
          "records": {
            "additionalProperties": {
              "additionalProperties": {
                "type": "integer",
              },
              "type": "object",
            },
            "type": "object",
          },
          "string": {
            "type": "string",
          },
          "symbol": undefined,
          "tuple": {
            "additionalItems": false,
            "items": [],
            "maxItems": 0,
            "minItems": 0,
            "type": "array",
          },
          "tuples": {
            "additionalItems": false,
            "items": [
              {
                "additionalItems": false,
                "items": [
                  undefined,
                  {
                    "type": "string",
                  },
                ],
                "maxItems": 2,
                "minItems": 2,
                "type": "array",
              },
              {
                "additionalItems": false,
                "items": [
                  {
                    "type": "integer",
                  },
                  {
                    "enum": [
                      null,
                    ],
                    "type": "null",
                  },
                ],
                "maxItems": 2,
                "minItems": 2,
                "type": "array",
              },
            ],
            "maxItems": 2,
            "minItems": 2,
            "type": "array",
          },
          "undefined": undefined,
          "union": {
            "anyOf": [
              {
                "type": "number",
              },
            ],
          },
          "unions": {
            "anyOf": [
              {
                "anyOf": [
                  {
                    "type": "string",
                  },
                ],
              },
            ],
          },
          "unknown": {
            "nullable": true,
            "properties": {},
            "type": "object",
          },
          "void": undefined,
        },
        "required": [
          "never",
          "unknown",
          "any",
          "void",
          "null",
          "undefined",
          "symbol",
          "boolean",
          "integer",
          "bigint",
          "number",
          "string",
          "eq",
          "array",
          "arrays",
          "record",
          "records",
          "emptyUnion",
          "union",
          "unions",
          "emptyIntersect",
          "intersects",
          "emptyTuple",
          "tuple",
          "tuples",
          "emptyObject",
          "object",
          "objects",
        ],
        "type": "object",
      }
    `)
  })
})

// declare module '@traversable/schema' {
//   interface NeverSchema extends pipe<core.never> { }
//   interface UnknownSchema extends pipe<core.unknown> { }
//   interface VoidSchema extends pipe<core.void> { }
//   interface AnySchema extends pipe<core.any> { }
//   interface NullSchema extends pipe<core.null> { }
//   interface UndefinedSchema extends pipe<core.undefined> { }
//   interface SymbolSchema extends pipe<core.symbol> { }
//   interface BooleanSchema extends pipe<core.boolean> { }
//   interface IntegerSchema extends pipe<core.integer> { }
//   interface BigIntSchema extends pipe<core.bigint> { }
//   interface NumberSchema extends pipe<core.number> { }
//   interface StringSchema extends pipe<core.string> { }
//   interface EqSchema<V> extends pipe<core.eq.def<V>> { }
//   interface OptionalSchema<S> extends pipe<core.optional.def<S>> { }
//   interface ArraySchema<S> extends pipe<core.array.def<S>> { }
//   interface RecordSchema<S> extends pipe<core.record.def<S>> { }
//   interface UnionSchema<S extends readonly unknown[]> extends pipe<core.union.def<S>> { }
//   interface IntersectSchema<S extends readonly unknown[]> extends pipe<core.intersect.def<S>> { }
//   interface TupleSchema<S extends readonly unknown[]> extends pipe<core.tuple.def<S>> { }
//   interface ObjectSchema<S extends { [x: string]: unknown }> extends pipe<core.object.def<S>> { }
// }

