import * as vi from 'vitest'
import { zx } from '@traversable/zod'


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.fromConstant', () => {
  vi.test('〖⛳️〗› ❲zx.fromConstant❳: undefined', () => {
    vi.expect(zx.toString(
      zx.fromConstant(undefined)
    )).toMatchInlineSnapshot
      (`"z.literal(undefined)"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromConstant❳: null', () => {
    vi.expect(zx.toString(
      zx.fromConstant(null)
    )).toMatchInlineSnapshot
      (`"z.literal(null)"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromConstant❳: true', () => {
    vi.expect(zx.toString(
      zx.fromConstant(true)
    )).toMatchInlineSnapshot
      (`"z.literal(true)"`)

  })

  vi.test('〖⛳️〗› ❲zx.fromConstant❳: false', () => {
    vi.expect(zx.toString(
      zx.fromConstant(false)
    )).toMatchInlineSnapshot
      (`"z.literal(false)"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromConstant❳: number', () => {
    vi.expect(zx.toString(
      zx.fromConstant(-0)
    )).toMatchInlineSnapshot
      (`"z.literal(0)"`)
    vi.expect(zx.toString(
      zx.fromConstant(0)
    )).toMatchInlineSnapshot
      (`"z.literal(0)"`)
    vi.expect(zx.toString(
      zx.fromConstant(1.1)
    )).toMatchInlineSnapshot
      (`"z.literal(1.1)"`)
    vi.expect(zx.toString(
      zx.fromConstant(1e+29)
    )).toMatchInlineSnapshot
      (`"z.literal(1e+29)"`)
    vi.expect(zx.toString(
      zx.fromConstant(1e-29)
    )).toMatchInlineSnapshot
      (`"z.literal(1e-29)"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromConstant❳: string', () => {
    vi.expect(zx.toString(
      zx.fromConstant('')
    )).toMatchInlineSnapshot
      (`"z.literal("")"`)
    vi.expect(zx.toString(
      zx.fromConstant('abc')
    )).toMatchInlineSnapshot
      (`"z.literal("abc")"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromConstant❳: array', () => {
    vi.expect(zx.toString(
      zx.fromConstant([])
    )).toMatchInlineSnapshot
      (`"z.tuple([])"`)
    vi.expect(zx.toString(
      zx.fromConstant([0])
    )).toMatchInlineSnapshot
      (`"z.tuple([z.literal(0)])"`)
    vi.expect(zx.toString(
      zx.fromConstant([0, [1, [2]]])
    )).toMatchInlineSnapshot
      (`"z.tuple([z.literal(0),z.tuple([z.literal(1),z.tuple([z.literal(2)])])])"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromConstant❳: object', () => {
    vi.expect(zx.toString(
      zx.fromConstant({})
    )).toMatchInlineSnapshot
      (`"z.object({}).catchall(z.never())"`)
    vi.expect(zx.toString(
      zx.fromConstant({ '': '' })
    )).toMatchInlineSnapshot
      (`"z.object({"":z.literal("")}).catchall(z.never())"`)
    vi.expect(zx.toString(
      zx.fromConstant({ 'a': { b: 'B', c: { d: ['D', { e: 'E' }] } } })
    )).toMatchInlineSnapshot
      (`"z.object({a:z.object({b:z.literal("B"),c:z.object({d:z.tuple([z.literal("D"),z.object({e:z.literal("E")}).catchall(z.never())])}).catchall(z.never())}).catchall(z.never())}).catchall(z.never())"`)
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.fromConstant.writeable', () => {
  vi.test('〖⛳️〗› ❲zx.fromConstant.writeable❳: undefined', () => {
    vi.expect(
      zx.fromConstant.writeable(undefined)
    ).toMatchInlineSnapshot
      (`"z.literal(undefined)"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromConstant.writeable❳: null', () => {
    vi.expect(
      zx.fromConstant.writeable(null)
    ).toMatchInlineSnapshot
      (`"z.literal(null)"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromConstant.writeable❳: true', () => {
    vi.expect(
      zx.fromConstant.writeable(true)
    ).toMatchInlineSnapshot
      (`"z.literal(true)"`)

  })

  vi.test('〖⛳️〗› ❲zx.fromConstant.writeable❳: false', () => {
    vi.expect(
      zx.fromConstant.writeable(false)
    ).toMatchInlineSnapshot
      (`"z.literal(false)"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromConstant.writeable❳: number', () => {
    vi.expect(
      zx.fromConstant.writeable(-0)
    ).toMatchInlineSnapshot
      (`"z.literal(0)"`)
    vi.expect(
      zx.fromConstant.writeable(0)
    ).toMatchInlineSnapshot
      (`"z.literal(0)"`)
    vi.expect(
      zx.fromConstant.writeable(1.1)
    ).toMatchInlineSnapshot
      (`"z.literal(1.1)"`)
    vi.expect(
      zx.fromConstant.writeable(1e+29)
    ).toMatchInlineSnapshot
      (`"z.literal(1e+29)"`)
    vi.expect(
      zx.fromConstant.writeable(1e-29)
    ).toMatchInlineSnapshot
      (`"z.literal(1e-29)"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromConstant.writeable❳: string', () => {
    vi.expect(
      zx.fromConstant.writeable('')
    ).toMatchInlineSnapshot
      (`"z.literal("")"`)
    vi.expect(
      zx.fromConstant.writeable('abc')
    ).toMatchInlineSnapshot
      (`"z.literal("abc")"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromConstant.writeable❳: array', () => {
    vi.expect(
      zx.fromConstant.writeable([])
    ).toMatchInlineSnapshot
      (`"z.tuple([])"`)
    vi.expect(
      zx.fromConstant.writeable([0])
    ).toMatchInlineSnapshot
      (`"z.tuple([z.literal(0)])"`)
    vi.expect(
      zx.fromConstant.writeable([0, [1, [2]]])
    ).toMatchInlineSnapshot
      (`"z.tuple([z.literal(0),z.tuple([z.literal(1),z.tuple([z.literal(2)])])])"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromConstant.writeable❳: object', () => {
    vi.expect(
      zx.fromConstant.writeable({})
    ).toMatchInlineSnapshot
      (`"z.object({}).catchall(z.never())"`)
    vi.expect(
      zx.fromConstant.writeable({ '': '' })
    ).toMatchInlineSnapshot
      (`"z.object({"":z.literal("")}).catchall(z.never())"`)
    vi.expect(
      zx.fromConstant.writeable({ 'a': { b: 'B', c: { d: ['D', { e: 'E' }] } } })
    ).toMatchInlineSnapshot
      (`"z.object({a:z.object({b:z.literal("B"),c:z.object({d:z.tuple([z.literal("D"),z.object({e:z.literal("E")}).catchall(z.never())])}).catchall(z.never())}).catchall(z.never())}).catchall(z.never())"`)
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.fromJson', () => {
  vi.test('〖⛳️〗› ❲zx.fromJson❳: undefined', () => {
    vi.expect(zx.toString(
      zx.fromJson(undefined)
    )).toMatchInlineSnapshot
      (`"z.null()"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromJson❳: null', () => {
    vi.expect(zx.toString(
      zx.fromJson(null)
    )).toMatchInlineSnapshot
      (`"z.null()"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromJson❳: true', () => {
    vi.expect(zx.toString(
      zx.fromJson(true)
    )).toMatchInlineSnapshot
      (`"z.boolean()"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromJson❳: false', () => {
    vi.expect(zx.toString(
      zx.fromJson(false)
    )).toMatchInlineSnapshot
      (`"z.boolean()"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromJson❳: number', () => {
    vi.expect(zx.toString(
      zx.fromJson(-0)
    )).toMatchInlineSnapshot
      (`"z.number()"`)
    vi.expect(zx.toString(
      zx.fromJson(0)
    )).toMatchInlineSnapshot
      (`"z.number()"`)
    vi.expect(zx.toString(
      zx.fromJson(1.1)
    )).toMatchInlineSnapshot
      (`"z.number()"`)
    vi.expect(zx.toString(
      zx.fromJson(1e+29)
    )).toMatchInlineSnapshot
      (`"z.number()"`)
    vi.expect(zx.toString(
      zx.fromJson(1e-29)
    )).toMatchInlineSnapshot
      (`"z.number()"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromJson❳: string', () => {
    vi.expect(zx.toString(
      zx.fromJson('')
    )).toMatchInlineSnapshot
      (`"z.string()"`)
    vi.expect(zx.toString(
      zx.fromJson('abc')
    )).toMatchInlineSnapshot
      (`"z.string()"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromJson❳: array', () => {
    vi.expect(zx.toString(
      zx.fromJson([])
    )).toMatchInlineSnapshot
      (`"z.array(z.unknown())"`)
    vi.expect(zx.toString(
      zx.fromJson([0])
    )).toMatchInlineSnapshot
      (`"z.array(z.number())"`)
    vi.expect(zx.toString(
      zx.fromJson([0, [1, [2]]])
    )).toMatchInlineSnapshot
      (`"z.array(z.union([z.number(),z.array(z.union([z.number(),z.array(z.number())]))]))"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromJson❳: object', () => {
    vi.expect(zx.toString(
      zx.fromJson({})
    )).toMatchInlineSnapshot
      (`"z.object({}).catchall(z.unknown())"`)
    vi.expect(zx.toString(
      zx.fromJson({ '': '' })
    )).toMatchInlineSnapshot
      (`"z.object({"":z.string()}).catchall(z.unknown())"`)
    vi.expect(zx.toString(
      zx.fromJson({ 'a': { b: 'B', c: { d: ['D', { e: 'E' }] } } })
    )).toMatchInlineSnapshot
      (`"z.object({a:z.object({b:z.string(),c:z.object({d:z.array(z.union([z.string(),z.object({e:z.string()}).catchall(z.unknown())]))}).catchall(z.unknown())}).catchall(z.unknown())}).catchall(z.unknown())"`)
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.fromJson.writeable', () => {
  vi.test('〖⛳️〗› ❲zx.fromJson.writeable❳: undefined', () => {
    vi.expect(
      zx.fromJson.writeable(undefined)
    ).toMatchInlineSnapshot
      (`"z.null()"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromJson.writeable❳: null', () => {
    vi.expect(
      zx.fromJson.writeable(null)
    ).toMatchInlineSnapshot
      (`"z.null()"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromJson.writeable❳: true', () => {
    vi.expect(
      zx.fromJson.writeable(true)
    ).toMatchInlineSnapshot
      (`"z.boolean()"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromJson.writeable❳: false', () => {
    vi.expect(
      zx.fromJson.writeable(false)
    ).toMatchInlineSnapshot
      (`"z.boolean()"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromJson.writeable❳: number', () => {
    vi.expect(
      zx.fromJson.writeable(-0)
    ).toMatchInlineSnapshot
      (`"z.number()"`)
    vi.expect(
      zx.fromJson.writeable(0)
    ).toMatchInlineSnapshot
      (`"z.number()"`)
    vi.expect(
      zx.fromJson.writeable(1.1)
    ).toMatchInlineSnapshot
      (`"z.number()"`)
    vi.expect(
      zx.fromJson.writeable(1e+29)
    ).toMatchInlineSnapshot
      (`"z.number()"`)
    vi.expect(
      zx.fromJson.writeable(1e-29)
    ).toMatchInlineSnapshot
      (`"z.number()"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromJson.writeable❳: string', () => {
    vi.expect(
      zx.fromJson.writeable('')
    ).toMatchInlineSnapshot
      (`"z.string()"`)
    vi.expect(
      zx.fromJson.writeable('abc')
    ).toMatchInlineSnapshot
      (`"z.string()"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromJson.writeable❳: array', () => {
    vi.expect(
      zx.fromJson.writeable([])
    ).toMatchInlineSnapshot
      (`"z.array(z.unknown())"`)
    vi.expect(
      zx.fromJson.writeable([0])
    ).toMatchInlineSnapshot
      (`"z.array(z.number())"`)
    vi.expect(
      zx.fromJson.writeable([0, [1, [2]]])
    ).toMatchInlineSnapshot
      (`"z.array(z.union([z.number(),z.array(z.union([z.number(),z.array(z.number())]))]))"`)
  })

  vi.test('〖⛳️〗› ❲zx.fromJson.writeable❳: object', () => {
    vi.expect(
      zx.fromJson.writeable({})
    ).toMatchInlineSnapshot
      (`"z.object({}).catchall(z.unknown())"`)
    vi.expect(
      zx.fromJson.writeable({ '': '' })
    ).toMatchInlineSnapshot
      (`"z.object({"":z.string()}).catchall(z.unknown())"`)
    vi.expect(
      zx.fromJson.writeable({ 'a': { b: 'B', c: { d: ['D', { e: 'E' }] } } })
    ).toMatchInlineSnapshot
      (`"z.object({a:z.object({b:z.string(),c:z.object({d:z.array(z.union([z.string(),z.object({e:z.string()}).catchall(z.unknown())]))}).catchall(z.unknown())}).catchall(z.unknown())}).catchall(z.unknown())"`)
  })
})
