import * as vi from 'vitest'
import { vx } from '@traversable/valibot'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/valibot❳: vx.fromConstant', () => {
  vi.test('〖⛳️〗› ❲vx.fromConstant❳: undefined', () => {
    vi.expect.soft(format(vx.toString(
      vx.fromConstant(undefined)
    ))).toMatchInlineSnapshot
      (`
      "v.undefined()
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromConstant❳: null', () => {
    vi.expect.soft(format(vx.toString(
      vx.fromConstant(null)
    ))).toMatchInlineSnapshot
      (`
      "v.null()
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromConstant❳: true', () => {
    vi.expect.soft(format(vx.toString(
      vx.fromConstant(true)
    ))).toMatchInlineSnapshot
      (`
      "v.literal(true)
      "
    `)

  })

  vi.test('〖⛳️〗› ❲vx.fromConstant❳: false', () => {
    vi.expect.soft(format(vx.toString(
      vx.fromConstant(false)
    ))).toMatchInlineSnapshot
      (`
      "v.literal(false)
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromConstant❳: number', () => {
    vi.expect.soft(format(vx.toString(
      vx.fromConstant(-0)
    ))).toMatchInlineSnapshot
      (`
      "v.literal(0)
      "
    `)
    vi.expect.soft(format(vx.toString(
      vx.fromConstant(0)
    ))).toMatchInlineSnapshot
      (`
      "v.literal(0)
      "
    `)
    vi.expect.soft(format(vx.toString(
      vx.fromConstant(1.1)
    ))).toMatchInlineSnapshot
      (`
      "v.literal(1.1)
      "
    `)
    vi.expect.soft(format(vx.toString(
      vx.fromConstant(1e+29)
    ))).toMatchInlineSnapshot
      (`
      "v.literal(1e29)
      "
    `)
    vi.expect.soft(format(vx.toString(
      vx.fromConstant(1e-29)
    ))).toMatchInlineSnapshot
      (`
      "v.literal(1e-29)
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromConstant❳: string', () => {
    vi.expect.soft(format(vx.toString(
      vx.fromConstant('')
    ))).toMatchInlineSnapshot
      (`
      "v.literal("")
      "
    `)
    vi.expect.soft(format(vx.toString(
      vx.fromConstant('abc')
    ))).toMatchInlineSnapshot
      (`
      "v.literal("abc")
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromConstant❳: array', () => {
    vi.expect.soft(format(vx.toString(
      vx.fromConstant([])
    ))).toMatchInlineSnapshot
      (`
      "v.strictTuple([])
      "
    `)
    vi.expect.soft(format(vx.toString(
      vx.fromConstant([0])
    ))).toMatchInlineSnapshot
      (`
      "v.strictTuple([v.literal(0)])
      "
    `)
    vi.expect.soft(format(vx.toString(
      vx.fromConstant([0, [1, [2]]])
    ))).toMatchInlineSnapshot
      (`
      "v.strictTuple([
        v.literal(0),
        v.strictTuple([v.literal(1), v.strictTuple([v.literal(2)])]),
      ])
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromConstant❳: object', () => {
    vi.expect.soft(format(vx.toString(
      vx.fromConstant({})
    ))).toMatchInlineSnapshot
      (`
      "v.strictObject({})
      "
    `)
    vi.expect.soft(format(vx.toString(
      vx.fromConstant({ '': '' })
    ))).toMatchInlineSnapshot
      (`
      "v.strictObject({ "": v.literal("") })
      "
    `)
    vi.expect.soft(format(vx.toString(
      vx.fromConstant({ 'a': { b: 'B', c: { d: ['D', { e: 'E' }] } } })
    ))).toMatchInlineSnapshot
      (`
      "v.strictObject({
        a: v.strictObject({
          b: v.literal("B"),
          c: v.strictObject({
            d: v.strictTuple([v.literal("D"), v.strictObject({ e: v.literal("E") })]),
          }),
        }),
      })
      "
    `)
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: vx.fromConstant.writeable', () => {
  vi.test('〖⛳️〗› ❲vx.fromConstant.writeable❳: undefined', () => {
    vi.expect.soft(format(
      vx.fromConstant.writeable(undefined)
    )).toMatchInlineSnapshot
      (`
      "v.undefined()
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromConstant.writeable❳: null', () => {
    vi.expect.soft(format(
      vx.fromConstant.writeable(null)
    )).toMatchInlineSnapshot
      (`
      "v.null()
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromConstant.writeable❳: true', () => {
    vi.expect.soft(format(
      vx.fromConstant.writeable(true)
    )).toMatchInlineSnapshot
      (`
      "v.literal(true)
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromConstant.writeable❳: false', () => {
    vi.expect.soft(format(
      vx.fromConstant.writeable(false)
    )).toMatchInlineSnapshot
      (`
      "v.literal(false)
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromConstant.writeable❳: number', () => {
    vi.expect.soft(format(
      vx.fromConstant.writeable(-0)
    )).toMatchInlineSnapshot
      (`
      "v.literal(0)
      "
    `)
    vi.expect.soft(format(
      vx.fromConstant.writeable(0)
    )).toMatchInlineSnapshot
      (`
      "v.literal(0)
      "
    `)
    vi.expect.soft(format(
      vx.fromConstant.writeable(1.1)
    )).toMatchInlineSnapshot
      (`
      "v.literal(1.1)
      "
    `)
    vi.expect.soft(format(
      vx.fromConstant.writeable(1e+29)
    )).toMatchInlineSnapshot
      (`
      "v.literal(1e29)
      "
    `)
    vi.expect.soft(format(
      vx.fromConstant.writeable(1e-29)
    )).toMatchInlineSnapshot
      (`
      "v.literal(1e-29)
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromConstant.writeable❳: string', () => {
    vi.expect.soft(format(
      vx.fromConstant.writeable('')
    )).toMatchInlineSnapshot
      (`
      "v.literal("")
      "
    `)
    vi.expect.soft(format(
      vx.fromConstant.writeable('abc')
    )).toMatchInlineSnapshot
      (`
      "v.literal("abc")
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromConstant.writeable❳: array', () => {
    vi.expect.soft(format(
      vx.fromConstant.writeable([])
    )).toMatchInlineSnapshot
      (`
      "v.strictTuple([])
      "
    `)
    vi.expect.soft(format(
      vx.fromConstant.writeable([0])
    )).toMatchInlineSnapshot
      (`
      "v.strictTuple([v.literal(0)])
      "
    `)
    vi.expect.soft(format(
      vx.fromConstant.writeable([0, [1, [2]]])
    )).toMatchInlineSnapshot
      (`
      "v.strictTuple([
        v.literal(0),
        v.strictTuple([v.literal(1), v.strictTuple([v.literal(2)])]),
      ])
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromConstant.writeable❳: object', () => {
    vi.expect.soft(format(
      vx.fromConstant.writeable({})
    )).toMatchInlineSnapshot
      (`
      "v.strictObject({})
      "
    `)
    vi.expect.soft(format(
      vx.fromConstant.writeable({ '': '' })
    )).toMatchInlineSnapshot
      (`
      "v.strictObject({ "": v.literal("") })
      "
    `)
    vi.expect.soft(format(
      vx.fromConstant.writeable({ 'a': { b: 'B', c: { d: ['D', { e: 'E' }] } } })
    )).toMatchInlineSnapshot
      (`
      "v.strictObject({
        a: v.strictObject({
          b: v.literal("B"),
          c: v.strictObject({
            d: v.strictTuple([v.literal("D"), v.strictObject({ e: v.literal("E") })]),
          }),
        }),
      })
      "
    `)
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: vx.fromJson', () => {
  vi.test('〖⛳️〗› ❲vx.fromJson❳: undefined', () => {
    vi.expect.soft(format(vx.toString(
      vx.fromJson(undefined)
    ))).toMatchInlineSnapshot
      (`
      "v.null()
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromJson❳: null', () => {
    vi.expect.soft(format(vx.toString(
      vx.fromJson(null)
    ))).toMatchInlineSnapshot
      (`
      "v.null()
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromJson❳: true', () => {
    vi.expect.soft(format(vx.toString(
      vx.fromJson(true)
    ))).toMatchInlineSnapshot
      (`
      "v.boolean()
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromJson❳: false', () => {
    vi.expect.soft(format(vx.toString(
      vx.fromJson(false)
    ))).toMatchInlineSnapshot
      (`
      "v.boolean()
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromJson❳: number', () => {
    vi.expect.soft(format(vx.toString(
      vx.fromJson(-0)
    ))).toMatchInlineSnapshot
      (`
      "v.number()
      "
    `)
    vi.expect.soft(format(vx.toString(
      vx.fromJson(0)
    ))).toMatchInlineSnapshot
      (`
      "v.number()
      "
    `)
    vi.expect.soft(format(vx.toString(
      vx.fromJson(1.1)
    ))).toMatchInlineSnapshot
      (`
      "v.number()
      "
    `)
    vi.expect.soft(format(vx.toString(
      vx.fromJson(1e+29)
    ))).toMatchInlineSnapshot
      (`
      "v.number()
      "
    `)
    vi.expect.soft(format(vx.toString(
      vx.fromJson(1e-29)
    ))).toMatchInlineSnapshot
      (`
      "v.number()
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromJson❳: string', () => {
    vi.expect.soft(format(vx.toString(
      vx.fromJson('')
    ))).toMatchInlineSnapshot
      (`
      "v.string()
      "
    `)
    vi.expect.soft(format(vx.toString(
      vx.fromJson('abc')
    ))).toMatchInlineSnapshot
      (`
      "v.string()
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromJson❳: array', () => {
    vi.expect.soft(format(vx.toString(
      vx.fromJson([])
    ))).toMatchInlineSnapshot
      (`
      "v.array(v.unknown())
      "
    `)
    vi.expect.soft(format(vx.toString(
      vx.fromJson([0])
    ))).toMatchInlineSnapshot
      (`
      "v.array(v.number())
      "
    `)
    vi.expect.soft(format(vx.toString(
      vx.fromJson([0, [1, [2]]])
    ))).toMatchInlineSnapshot
      (`
      "v.array(
        v.union([v.number(), v.array(v.union([v.number(), v.array(v.number())]))]),
      )
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromJson❳: object', () => {
    vi.expect.soft(format(vx.toString(
      vx.fromJson({})
    ))).toMatchInlineSnapshot
      (`
      "v.looseObject({})
      "
    `)
    vi.expect.soft(format(vx.toString(
      vx.fromJson({ '': '' })
    ))).toMatchInlineSnapshot
      (`
      "v.looseObject({ "": v.string() })
      "
    `)
    vi.expect.soft(format(vx.toString(
      vx.fromJson({ 'a': { b: 'B', c: { d: ['D', { e: 'E' }] } } })
    ))).toMatchInlineSnapshot
      (`
      "v.looseObject({
        a: v.looseObject({
          b: v.string(),
          c: v.looseObject({
            d: v.array(v.union([v.string(), v.looseObject({ e: v.string() })])),
          }),
        }),
      })
      "
    `)
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: vx.fromJson.writeable', () => {
  vi.test('〖⛳️〗› ❲vx.fromJson.writeable❳: undefined', () => {
    vi.expect.soft(format(
      vx.fromJson.writeable(undefined)
    )).toMatchInlineSnapshot
      (`
      "v.null()
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromJson.writeable❳: null', () => {
    vi.expect.soft(format(
      vx.fromJson.writeable(null)
    )).toMatchInlineSnapshot
      (`
      "v.null()
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromJson.writeable❳: true', () => {
    vi.expect.soft(format(
      vx.fromJson.writeable(true)
    )).toMatchInlineSnapshot
      (`
      "v.boolean()
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromJson.writeable❳: false', () => {
    vi.expect.soft(format(
      vx.fromJson.writeable(false)
    )).toMatchInlineSnapshot
      (`
      "v.boolean()
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromJson.writeable❳: number', () => {
    vi.expect.soft(format(
      vx.fromJson.writeable(-0)
    )).toMatchInlineSnapshot
      (`
      "v.number()
      "
    `)
    vi.expect.soft(format(
      vx.fromJson.writeable(0)
    )).toMatchInlineSnapshot
      (`
      "v.number()
      "
    `)
    vi.expect.soft(format(
      vx.fromJson.writeable(1.1)
    )).toMatchInlineSnapshot
      (`
      "v.number()
      "
    `)
    vi.expect.soft(format(
      vx.fromJson.writeable(1e+29)
    )).toMatchInlineSnapshot
      (`
      "v.number()
      "
    `)
    vi.expect.soft(format(
      vx.fromJson.writeable(1e-29)
    )).toMatchInlineSnapshot
      (`
      "v.number()
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromJson.writeable❳: string', () => {
    vi.expect.soft(format(
      vx.fromJson.writeable('')
    )).toMatchInlineSnapshot
      (`
      "v.string()
      "
    `)
    vi.expect.soft(format(
      vx.fromJson.writeable('abc')
    )).toMatchInlineSnapshot
      (`
      "v.string()
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromJson.writeable❳: array', () => {
    vi.expect.soft(format(
      vx.fromJson.writeable([])
    )).toMatchInlineSnapshot
      (`
      "v.array(v.unknown())
      "
    `)
    vi.expect.soft(format(
      vx.fromJson.writeable([0])
    )).toMatchInlineSnapshot
      (`
      "v.array(v.number())
      "
    `)
    vi.expect.soft(format(
      vx.fromJson.writeable([0, [1, [2]]])
    )).toMatchInlineSnapshot
      (`
      "v.array(
        v.union([v.number(), v.array(v.union([v.number(), v.array(v.number())]))]),
      )
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.fromJson.writeable❳: object', () => {
    vi.expect.soft(format(
      vx.fromJson.writeable({})
    )).toMatchInlineSnapshot
      (`
      "v.looseObject({})
      "
    `)
    vi.expect.soft(format(
      vx.fromJson.writeable({ '': '' })
    )).toMatchInlineSnapshot
      (`
      "v.looseObject({ "": v.string() })
      "
    `)
    vi.expect.soft(format(
      vx.fromJson.writeable({ 'a': { b: 'B', c: { d: ['D', { e: 'E' }] } } })
    )).toMatchInlineSnapshot
      (`
      "v.looseObject({
        a: v.looseObject({
          b: v.string(),
          c: v.looseObject({
            d: v.array(v.union([v.string(), v.looseObject({ e: v.string() })])),
          }),
        }),
      })
      "
    `)
  })
})
