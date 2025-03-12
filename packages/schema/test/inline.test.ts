import * as vi from 'vitest'
import { t } from '@traversable/schema'

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳: support for native type predicates', () => {
  vi.it('〖⛳️〗‹‹‹ ❲t.optional❳: supports native type predicates', () => {
    vi.assertType<t.inline<Record<"false" | "true", boolean>>>(t.optional((u): u is Record<`${boolean}`, boolean> => true).def)
    vi.assertType<{ b: string } | undefined>(t.optional(t.object({ b: t.string }))._type)
    vi.assertType<t.optional<t.object<{ c: t.inline<9000> }>>>(t.optional(t.optional(t.object({ c: (u) => u === 9000 }))).def)
    vi.assertType<{ c: 9000 } | undefined>(t.optional(t.optional(t.object({ c: (u) => u === 9000 })))._type)
    vi.assertType<{ a: t.optional<t.number> }>(t.object({ a: t.optional(t.number), }).def)
    vi.assertType<{ a?: number | undefined }>(t.object({ a: t.optional(t.number), })._type)
    vi.assertType<{ a: t.optional<t.number>, b: t.inline<70> }>(t.object({ a: t.optional(t.number), b: (u) => u === 70 }).def)
    vi.assertType<{ b: 70, a?: number | undefined }>(t.object({ a: t.optional(t.number), b: (u) => u === 70 })._type)
  })

  vi.it('〖⛳️〗‹‹‹ ❲t.array❳: supports native type predicates', () => {
    vi.assertType<t.object<{ a: t.number }>>(t.array(t.object({ a: t.number })).def)
    vi.assertType<t.inline<Record<"false" | "true", boolean>>>(t.array((u): u is Record<`${boolean}`, boolean> => true).def)
    vi.assertType<{ b: string }[]>(t.array(t.object({ b: t.string }))._type)
    vi.assertType<Record<"false" | "true", boolean>[]>(t.array((u): u is Record<`${boolean}`, boolean> => true)._type)
    vi.assertType<t.array<t.object<{ c: t.inline<9000> }>>>(t.array(t.array(t.object({ c: (u) => u === 9000 }))).def)
    vi.assertType<{ c: 9000 }[][]>(t.array(t.array(t.object({ c: (u) => u === 9000 })))._type)
  })

  vi.it('〖⛳️〗‹‹‹ ❲t.record❳: supports native type predicates', () => {
    vi.assertType<t.object<{ a: t.number }>>(t.record(t.object({ a: t.number })).def)
    vi.assertType<t.inline<Record<"false" | "true", boolean>>>(t.record((u): u is Record<`${boolean}`, boolean> => true).def)
    vi.assertType<Record<string, { b: string }>>(t.record(t.object({ b: t.string }))._type)
    vi.assertType<Record<string, Record<"false" | "true", boolean>>>(t.record((u): u is Record<`${boolean}`, boolean> => true)._type)
    vi.assertType<t.record<t.object<{ c: t.inline<9000> }>>>(t.record(t.record(t.object({ c: (u) => u === 9000 }))).def)
    vi.assertType<Record<string, Record<string, { c: 9000 }>>>(t.record(t.record(t.object({ c: (u) => u === 9000 })))._type)
  })

  vi.it('〖⛳️〗‹‹‹ ❲t.union❳: supports native type predicates', () => {
    vi.assertType<[t.object<{ a: t.number }>, t.object<{ b: t.string }>]>(t.union(t.object({ a: t.number }), t.object({ b: t.string })).def)
    vi.assertType<[t.object<{ a: t.number }>, t.inline<Record<"false" | "true", boolean>>]>(t.union(t.object({ a: t.number }), (u): u is Record<`${boolean}`, boolean> => true).def)
    vi.assertType<{ a: number } | { b: string }>(t.union(t.object({ a: t.number }), t.object({ b: t.string }))._type)
    vi.assertType<Record<"false" | "true", boolean> | { a: number }>(t.union(t.object({ a: t.number }), (u): u is Record<`${boolean}`, boolean> => true)._type)
    vi.assertType<
      [
        t.object<{ a: t.number }>,
        t.object<{ b: t.optional<t.string> }>,
        t.object<{ c: t.inline<9000> }>
      ]
    >(
      t.union(
        t.object({ a: t.number }),
        t.object({ b: t.optional(t.string) }),
        t.object({ c: (u) => u === 9000 }),
      ).def
    )
    vi.assertType<
      | { a: number }
      | { b?: string }
      | { c: 9000 }
    >(
      t.union(
        t.object({ a: t.number }),
        t.object({ b: t.optional(t.string) }),
        t.object({ c: (u) => u === 9000 }),
      )._type
    )
  })

  vi.it('〖⛳️〗‹‹‹ ❲t.intersect❳: supports native type predicates', () => {
    vi.assertType<[t.object<{ a: t.number }>, t.object<{ b: t.string }>]>(t.intersect(t.object({ a: t.number }), t.object({ b: t.string })).def)
    vi.assertType<{ a: number } & { b: string }>(t.intersect(t.object({ a: t.number }), t.object({ b: t.string }))._type)
    vi.assertType<[
      t.object<{ a: t.number }>,
      t.inline<Record<"false" | "true", boolean>>
    ]>(
      t.intersect(
        t.object({ a: t.number }),
        (u): u is Record<`${boolean}`, boolean> => !!u
      ).def
    )
    vi.assertType<{ a: number } & Record<"false" | "true", boolean>>(t.intersect(t.object({ a: t.number }), (u): u is Record<`${boolean}`, boolean> => !!u)._type)
    vi.assertType<[
      t.object<{ a: t.number }>,
      t.object<{ b: t.optional<t.string> }>,
      t.object<{ c: t.inline<9000> }>
    ]>(
      t.intersect(
        t.object({ a: t.number }),
        t.object({ b: t.optional(t.string) }),
        t.object({ c: (u) => u === 9000 })
      ).def
    )
    vi.assertType<
      & { a: number }
      & { b?: string }
      & { c: 9000 }
    >(
      t.intersect(
        t.object({ a: t.number }),
        t.object({ b: t.optional(t.string) }),
        t.object({ c: (u) => u === 9000 })
      )._type
    )
  })

  vi.it('〖⛳️〗‹‹‹ ❲t.tuple❳: supports native type predicates', () => {
    vi.assertType<[t.number, t.string]>(t.tuple(t.number, t.string).def)
    vi.assertType<[number, string]>(t.tuple(t.number, t.string)._type)
    vi.assertType<[t.number, t.inline<9000>, t.optional<t.string>]>(t.tuple(t.number, (u) => u === 9000, t.optional(t.string)).def)
    vi.assertType<[ᵃ: number, ᵇ: 9000, ᶜ?: string]>(t.tuple(t.number, (u) => u === 9000, t.optional(t.string))._type)
    vi.assertType<[t.number, t.optional<t.string>]>(t.tuple(t.number, t.optional(t.string), { optionalTreatment: 'exactOptional' }).def)
    vi.assertType<[t.number, t.inline<9000>, t.optional<t.string>]>(t.tuple(t.number, (u) => u === 9000, t.optional(t.string), { optionalTreatment: 'exactOptional' }).def)
    vi.assertType<[ᵃ: number, ᵇ?: string]>(t.tuple(t.number, t.optional(t.string), { optionalTreatment: 'exactOptional' })._type)
    vi.assertType<[ᵃ: number, ᵇ: 9000, ᶜ?: string]>(t.tuple(t.number, (u) => u === 9000, t.optional(t.string), { optionalTreatment: 'exactOptional' })._type)
    vi.assertType<[t.number, t.optional<t.string>]>(t.tuple(t.number, t.optional(t.string), { optionalTreatment: 'exactOptional' }).def)
    t.tuple(
      t.number,
      t.optional(t.string),
      /* @ts-expect-error */
      t.string
    ).def
    t.tuple(
      t.number,
      t.optional(t.string),
      /* @ts-expect-error */
      (u) => u === 9000
    ).def
    t.tuple(
      t.number,
      (u) => u === 9000,
      t.optional(t.string),
      /* @ts-expect-error */
      t.number,
      { optionalTreatment: 'exactOptional' }
    )
    t.tuple(
      t.number,
      t.optional(t.string),
      /* @ts-expect-error */
      t.number,
      { optionalTreatment: 'exactOptional' }
    )
  })

  vi.it('〖⛳️〗‹‹‹ ❲t.object❳: supports native type predicates', () => {
    vi.assertType<{ z: t.number }>(t.object({ z: t.number }).def)
    vi.assertType<{ z: number }>(t.object({ z: t.number })._type)

    vi.assertType<{ z: t.number, y: t.object<{ x: t.string }> }>(t.object({ z: t.number, y: t.object({ x: t.string }) }).def)
    vi.assertType<{ z: number, y: { x: string } }>(t.object({ z: t.number, y: t.object({ x: t.string }) })._type)

    vi.assertType<{
      z: t.number,
      y: t.object<{
        x: t.string,
        w: t.object<{
          v: t.eq<"v">
        }>
      }>
    }>(
      t.object({
        z: t.number,
        y: t.object({
          x: t.string,
          w: t.object({
            v: t.eq('v')
          })
        })
      }).def
    )

    vi.assertType<{
      z: number
      y: {
        x: string
        w: { v: "v" }
      }
    }>(
      t.object({
        z: t.number,
        y: t.object({
          x: t.string,
          w: t.object({ v: t.eq('v') })
        })
      })._type
    )

    vi.assertType<{ a: t.inline<1>, z: t.number }>(t.object({ a: (u) => u === 1, z: t.number }).def)
    vi.assertType<{ a: 1, z: number }>(t.object({ a: (u) => u === 1, z: t.number })._type)

    vi.assertType<{
      a: t.inline<"a">
      b: t.object<{
        c: t.inline<"b.c">
        y: t.null
      }>
      z: t.number
    }>(
      t.object({
        a: (u) => u === 'a',
        b: t.object({
          c: (u) => u === 'b.c',
          y: t.null,
        }),
        z: t.number,
      }).def
    )

    vi.assertType<{
      a: "a"
      b: {
        c: "b.c"
        y: null
      }
      z: number
    }>(
      t.object({
        a: (u) => u === 'a',
        b: t.object({
          c: (u) => u === 'b.c',
          y: t.null
        }),
        z: t.number
      })._type
    )

    vi.assertType<{
      a: t.inline<"a">
      v: t.eq<"v">
      b: t.object<{
        c: t.inline<"b.c">
        w: t.integer
      }>
      d: t.object<{
        e: t.object<{
          f: t.inline<"d.e.f">
          x: t.string
        }>
        y: t.null
      }>
      z: t.number
    }>(
      t.object({
        a: (u) => u === 'a',
        v: t.eq('v'),
        b: t.object({
          c: (u) => u === 'b.c',
          w: t.integer,
        }),
        d: t.object({
          e: t.object({
            f: (u) => u === 'd.e.f',
            x: t.string,
          }),
          y: t.null,
        }),
        z: t.number
      }).def
    )

    vi.assertType<{
      a: "a"
      b: {
        c: "b.c"
        w: number
      }
      d: {
        e: {
          x: string
          f: "d.e.f"
        }
        y: null
      }
      z: number
      v: "v"
    }>(
      t.object({
        a: (u) => u === 'a',
        v: t.eq('v'),
        b: t.object({
          c: (u) => u === 'b.c',
          w: t.integer,
        }),
        d: t.object({
          e: t.object({
            f: (u) => u === 'd.e.f',
            x: t.string,
          }),
          y: t.null,
        }),
        z: t.number,
      })._type
    )
  })

})
