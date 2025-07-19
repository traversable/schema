import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'

import { z } from 'zod'
import { zx } from '@traversable/zod'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

const stringify = (x: unknown) => {
  return JSON.stringify(x, (k, v) => typeof v === 'symbol' ? `Symbol(${v.description})` : typeof v === 'bigint' ? `${v}n` : v, 2)
}

type LogFailureDeps = { schema: z.ZodType, data: unknown, clonedData?: unknown }
const logFailure = ({ schema, data, clonedData }: LogFailureDeps) => {
  console.group('\n\n\rFAILURE: property test for zx.clone\n\n\r')
  console.debug('zx.toString(schema):\n\r', zx.toString(schema), '\n\r')
  console.debug('zx.clone.writeable(schema):\n\r', format(zx.clone.writeable(schema, { typeName: 'Type' })), '\n\r')
  console.debug('stringify(data):\n\r', stringify(data), '\n\r')
  console.debug('data:\n\r', data, '\n\r')
  if (data === undefined || clonedData !== undefined) {
    console.debug('stringify(clonedData):\n\r', stringify(clonedData), '\n\r')
    console.debug('clonedData:\n\r', clonedData, '\n\r')
  }
  console.groupEnd()
}

const Builder = zx.SeedGenerator({
  include: [
    // 'union',
    'array',
    'bigint',
    'boolean',
    'catch',
    'date',
    'default',
    'enum',
    'int',
    'intersection',
    'lazy',
    'literal',
    'map',
    'nan',
    'nonoptional',
    'null',
    'number',
    'object',
    'optional',
    'pipe',
    'prefault',
    'readonly',
    'record',
    'set',
    'string',
    'symbol',
    'template_literal',
    'tuple',
    'undefined',
    'void',
  ],
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: property test suite for zx.clone', () => {
  vi.test('〖⛳️〗› ❲zx.clone❳: Address', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          const schema = zx.seedToSchema(seed)
          const data = zx.seedToValidData(seed)
          const clone = zx.clone(schema)
          try {
            const clonedData = clone(data)
            vi.expect.soft(clonedData).to.deep.equal(data)
          }
          catch (e) {
            console.error('OUTER', e)
            try {
              const clonedData = clone(data)
              logFailure({ schema, data, clonedData })
              vi.expect.fail()
            } catch (e) {
              console.error('INNER', e)
              logFailure({ schema, data })
              vi.expect.fail()
            }
          }
        }
      ), {
      endOnFailure: true,
      examples: [
        // [[1500, [2500, [20]]]],
        [[3500, [2500, [2500, [15]]]]],
        [[8000, [[7500, [["$$NN0$5$$g$", [15]], ["_812", [2500, [15]]]]], [2500, [15]]]]],
        // [[7500, [["f$$R2Ru_1", [2500, [50]]], ["__J0$$5_64_", [15]]]]],
        // [[8500, [[8000, [[15], [15]]], [7000, [15]]]]],
      ],
      numRuns: 10_000,
    })

  })
})

type Address = z.infer<typeof Address>
const Address = z.object({
  street1: z.string(),
  street2: z.optional(z.string()),
  city: z.string(),
})
const addressEquals = zx.equals(Address)
const addressArbitrary = fc.record({
  street1: fc.string(),
  street2: fc.string(),
  city: fc.string(),
}, { requiredKeys: ['street1', 'city'] }) satisfies fc.Arbitrary<Address>
function cloneAddress(x: Address): Address {
  const out: Address = Object.create(null)
  out.street1 = x.street1
  if (x.street2 !== undefined) out.street2 = x.street2
  out.city = x.city
  return out
}

type Addresses = z.infer<typeof Addresses>
const Addresses = z.array(Address)
const addressesEquals = zx.equals(Addresses)
const addressesArbitrary = fc.array(addressArbitrary) satisfies fc.Arbitrary<Addresses>
function cloneAddresses(x: Addresses): Addresses {
  const out: Addresses = []
  for (let ix = 0; ix < x.length; ix++) {
    out.push(Object.create(null))
    out[ix].street1 = x[ix].street1
    if (x[ix].street2 !== undefined) out[ix].street2 = x[ix].street2
    out[ix].city = x[ix].city
  }
  return out
}

type AddressSet = z.infer<typeof AddressSet>
const AddressSet = z.set(Address)
// TODO:
const addressSetEquals = zx.equals(AddressSet)
const addressSetArbitrary = fc.uniqueArray(
  addressArbitrary, {
  selector: ({ street1 }) => street1
}).map((xs) => new Set(xs)) satisfies fc.Arbitrary<AddressSet>
function cloneAddressSet(x: AddressSet): AddressSet {
  const out: AddressSet = new Set()
  for (let value of x) {
    const newValue = Object.create(null)
    newValue.street1 = value.street1
    if (value.street2 !== undefined) newValue.street2 = value.street2
    newValue.city = value.city
    out.add(newValue)
  }
  return out
}

type AddressMap = z.infer<typeof AddressMap>
const AddressMap = z.map(Address, z.string())
// TODO:
const addressMapEquals = zx.equals(AddressMap)
const addressMapArbitrary = fc.uniqueArray(
  fc.tuple(addressArbitrary, fc.string()), {
  selector: (([{ street1 }]) => street1)
}).map((xs) => new Map(xs)) satisfies fc.Arbitrary<AddressMap>
function cloneAddressMap(x: AddressMap): AddressMap {
  const out: AddressMap = new Map()
  for (let [key, value] of x) {
    const newKey = Object.create(null)
    newKey.street1 = key.street1
    if (key.street2 !== undefined) newKey.street2 = key.street2
    newKey.city = key.city
    const newValue = value
    out.set(newKey, newValue)
  }
  return out
}

type AddressRecord = z.infer<typeof AddressRecord>
const AddressRecord = z.record(z.string(), Address)
const addressRecordEquals = zx.equals(AddressRecord)
const addressRecordArbitrary = fc.dictionary(
  fc.string(),
  addressArbitrary
) satisfies fc.Arbitrary<Record<string, Address>>
function cloneAddressRecord(x: AddressRecord): AddressRecord {
  const out: AddressRecord = Object.create(null)
  for (let key in x) {
    const value = x[key]
    const newValue = Object.create(null)
    newValue.street1 = value.street1
    if (value.street2 !== undefined) newValue.street2 = value.street2
    newValue.city = value.city
    out[key] = newValue
  }
  return out
}

type AddressTuple = z.infer<typeof AddressTuple>
const AddressTuple = z.tuple([Address, Address])
const addressTupleEquals = zx.equals(AddressTuple)
const addressTupleArbitrary = fc.tuple(addressArbitrary, addressArbitrary) satisfies fc.Arbitrary<AddressTuple>
function cloneAddressTuple([$1, $2]: AddressTuple) {
  const out: Address[] = []
  const _1: Address = Object.create(null)
  _1.street1 = $1.street1
  if ($1.street2 !== undefined) _1.street2 = $1.street2
  _1.city = $1.city
  out.push(_1)
  const _2: Address = Object.create(null)
  _2.street1 = $2.street1
  if ($2.street2 !== undefined) _2.street2 = $2.street2
  _2.city = $2.city
  out.push(_2)
  return out as AddressTuple
}

type AddressIntersection = z.infer<typeof AddressIntersection>
const AddressIntersection = z.intersection(Address, z.object({ postalCode: z.optional(z.string()) }))
const addressIntersectionEquals = zx.equals(AddressIntersection)
const addressIntersectionArbitrary: fc.Arbitrary<AddressIntersection> = fc.tuple(
  addressArbitrary,
  fc.record({ postalCode: fc.string() }, { requiredKeys: [] })
).map(([x, y]) => Object.assign(Object.create(null), x, y))
function cloneAddressIntersection(x: AddressIntersection) {
  const out: AddressIntersection = Object.create(null)
  out.street1 = x.street1
  if (x.street2 !== undefined) out.street2 = x.street2
  out.city = x.city
  if (x.postalCode !== undefined) out.postalCode = x.postalCode
  return out
}

type AddressUnion = z.infer<typeof AddressUnion>
const AddressUnion = z.union([Address, z.number()])
const addressUnionEquals = zx.equals(AddressUnion)
const addressUnionArbitrary = fc.oneof(fc.nat(), addressArbitrary) satisfies fc.Arbitrary<AddressUnion>
function cloneAddressUnion(x: AddressUnion) {
  if (typeof x === 'number') {
    return x
  }
  const out = Object.create(null)
  out.street1 = x.street1
  if (x.street2 !== undefined) out.street2 = x.street2
  out.city = x.city
  return out
}


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: hardcoded tests', () => {
  vi.test('〖⛳️〗› ❲zx.clone❳: Address', () => {
    fc.assert(
      fc.property(
        addressArbitrary,
        (data) => {
          const clone = cloneAddress(data)
          vi.expect.soft(addressEquals(clone, data)).toBeTruthy()
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖⛳️〗› ❲zx.clone❳: Addresses', () => {
    fc.assert(
      fc.property(
        addressesArbitrary,
        (data) => {
          const clone = cloneAddresses(data)
          vi.expect.soft(addressesEquals(clone, data)).toBeTruthy()
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖⛳️〗› ❲zx.clone❳: AddressSet', () => {
    fc.assert(
      fc.property(
        addressSetArbitrary,
        (data) => {
          const clone = cloneAddressSet(data)
          vi.expect(clone).toEqual(data)
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖⛳️〗› ❲zx.clone❳: AddressMap', () => {
    fc.assert(
      fc.property(
        addressMapArbitrary,
        (data) => {
          const clone = cloneAddressMap(data)
          vi.expect(clone).toEqual(data)
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖⛳️〗› ❲zx.clone❳: AddressRecord', () => {
    fc.assert(
      fc.property(
        addressRecordArbitrary,
        (data) => {
          const clone = cloneAddressRecord(data)
          vi.expect.soft(addressRecordEquals(clone, data)).toBeTruthy()
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖⛳️〗› ❲zx.clone❳: AddressTuple', () => {
    fc.assert(
      fc.property(
        addressTupleArbitrary,
        (data) => {
          const clone = cloneAddressTuple(data)
          vi.expect.soft(addressTupleEquals(clone, data)).toBeTruthy()
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖⛳️〗› ❲zx.clone❳: AddressIntersection', () => {
    fc.assert(
      fc.property(
        addressIntersectionArbitrary,
        (data) => {
          const clone = cloneAddressIntersection(data)
          vi.expect.soft(addressIntersectionEquals(clone, data)).toBeTruthy()
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖⛳️〗› ❲zx.clone❳: AddressUnion', () => {
    fc.assert(
      fc.property(
        addressUnionArbitrary,
        (data) => {
          const clone = cloneAddressUnion(data)
          vi.expect.soft(addressUnionEquals(clone, data)).toBeTruthy()
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

})
