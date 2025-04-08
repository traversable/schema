import * as vi from 'vitest'
import { t } from '@traversable/schema'
import { typebox } from '@traversable/derive-codec'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/TODO❳', () => {
  vi.it('〖⛳️〗› ❲compile❳', () => {
    // let User = t.object({
    //   id: t.union(t.null, t.any),
    //   name: t.string,
    //   BLAH: t.optional(t.object({
    //     CHILD: t.boolean,
    //   }))
    // })

    let User = t.object({
      A: t.object({
        F: t.any,
        G: t.never,
        H: t.void,
        I: t.never,
      }),
      B: t.array(
        t.union(
          t.object({
            J: t.null,
            K: t.undefined,
          }),
          t.object({
            L: t.boolean,
            M: t.symbol,
          }),
        )),
      C: t.tuple(
        t.object({
          N: t.integer,
          O: t.bigint,
          P: t.number,
        }),
      ),
      D: t.intersect(
        t.object({
          Q: t.string,
          // R: t.(9000),
        }),
        t.record(
          t.object({
            S: t.boolean
            // t.enum({ 
            //   x: 1, 
            //   y: 2 
            // }) 
          }),
        )
      ),
      E: t.optional(
        t.union(
          t.object({
            T: t.array(t.array(t.string)),
            U: t.union(
              t.integer.min(0),
              t.number.max(100),
            ),
          }),
          t.object({
            V: t.optional(t.string)
            // V: t.Const([{ a: 1 }]),
          }),
        ),
      ),
    })



    vi.expect(typebox.validate(User)).toMatchInlineSnapshot(`
      "
      (!!value && typeof value === 'object' && !Array.isArray(value))
        && 
        ('A' in value) && (
        (
      (!!value.A && typeof value.A === 'object' && !Array.isArray(value.A))
        && 
        ('F' in value.A) && (
        (true) && 
        ('G' in value.A) && (
        (false) && 
        ('H' in value.A) && (
        (value.A.H === void 0) && 
        ('I' in value.A) && (
        (false)) && 
        ('B' in value) && (
        (
      Array.isArray(value.B) && value.B.every((value) => (
      (!!value.B && typeof value.B === 'object' && !Array.isArray(value.B))
        && 
        ('J' in value.B) && (
        (value.B.J === null) && 
        ('K' in value.B) && (
        (value.B.K === undefined)) || (
      (!!value.B && typeof value.B === 'object' && !Array.isArray(value.B))
        && 
        ('L' in value.B) && (
        (typeof value.B.L === 'boolean') && 
        ('M' in value.B) && (
        (typeof value.B.M === 'symbol')))) && 
        ('C' in value) && (
        (
      Array.isArray(value.C) && (value.C.length === 1) && (
      (!!value.C && typeof value.C === 'object' && !Array.isArray(value.C))
        && 
        ('N' in value.C) && (
        (Number.isInteger(value.C.N)) && 
        ('O' in value.C) && (
        (typeof value.C.O === 'bigint') && 
        ('P' in value.C) && (
        (typeof value.C.P === 'number'))) && 
        ('D' in value) && (
        (
      (!!value.D && typeof value.D === 'object' && !Array.isArray(value.D))
        && 
        ('Q' in value.D) && (
        (typeof value.D.Q === 'string') && 
      (!!value.D && typeof value.D === 'object' && !Array.isArray(value.D)) && Object.entries(value.D).map(([k, value])) => 
      (!!value && typeof value === 'object' && !Array.isArray(value))
        && 
        ('S' in value) && (
        (typeof value.D["{}"].S === 'boolean'))) && 
        ('E' in value) && (
        ((value.E === void 0) || 
        ((
      (!!value.E && typeof value.E === 'object' && !Array.isArray(value.E))
        && 
        ('T' in value.E) && (
        (
      Array.isArray(value.E.T) && value.E.T.every((value) => 
      Array.isArray(value) && value.every((value) => typeof value === 'string'))) && 
        ('U' in value.E) && (
        ((Number.isInteger(value.E.U)) || (typeof value.E.U === 'number'))) || (
      (!!value.E && typeof value.E === 'object' && !Array.isArray(value.E))
        && 
        ('V' in value.E) && (
        ((value.E.V === void 0) || 
        (typeof value.E.V === 'string')))))"
    `)
  })
})
