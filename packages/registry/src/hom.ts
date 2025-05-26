import type { HKT, Kind } from './hkt.js'

const Functions = {
  [0]: (ks: readonly [string]) =>
    (v0: any) =>
      ({ [ks[0]]: v0 }),
  [1]: (ks: readonly [string, string]) =>
    (v0: any) =>
      (v1: any) =>
        ({ [ks[0]]: v0, [ks[1]]: v1 }),
  [2]: (ks: readonly [string, string, string]) =>
    (v0: any) =>
      (v1: any) =>
        (v2: any) =>
          ({ [ks[0]]: v0, [ks[1]]: v1, [ks[2]]: v2 }),
  [3]:
    (ks: readonly [string, string, string, string]) =>
      (v0: any) =>
        (v1: any) =>
          (v2: any) =>
            (v3: any) =>
              ({ [ks[0]]: v0, [ks[1]]: v1, [ks[2]]: v2, [ks[3]]: v3 }),
  [4]:
    (ks: readonly [string, string, string, string, string]) =>
      (v0: any) =>
        (v1: any) =>
          (v2: any) =>
            (v3: any) =>
              (v4: any) =>
                ({ [ks[0]]: v0, [ks[1]]: v1, [ks[2]]: v2, [ks[3]]: v3, [ks[4]]: v4 }),
  [-1]:
    (ks: readonly string[]) => (...args: any[]) => {
      const len = ks.length
      let out: { [x: string]: any } = {}
      for (let i = 0; i < len; i++) out[ks[i]] = args[i]
      return out
    }
}

function curried(f: Function, n: number, acc: ReadonlyArray<unknown>) {
  return function (x: unknown) {
    const combined = Array(acc.length + 1)
    for (let i = 0; i < acc.length; i++) {
      combined[i] = acc[i]
    }
    combined[acc.length] = x
    return n === 0 ? f.apply(null, combined) : curried(f, n - 1, combined)
  }
}

/** @internal */
const isIndexOf = (x: number, xs: unknown): x is -1 => !!xs && typeof xs === 'object' && x in xs

export function hom<KS extends string[]>(ks: readonly [...KS]): hom<KS>
export function hom(ks: readonly string[]) {
  const len = ks.length - 1
  return isIndexOf(len, Functions)
    ? Functions[len](ks)
    : curried(Functions[-1](ks), len, [])
}

export type FromEntries<T extends [k: string, v: unknown]> = never | { [E in T as E[0]]: E[1] }

export type NonFinite<T extends string> = never | { (x: unknown): { (y: unknown): { [K in T]: any } } }

export type hom<
  KS extends string[],
  Ix = KS['length'],
  T extends
  | Ix extends keyof Functions ? Functions[Ix] : never
  = Ix extends keyof Functions ? Functions[Ix] : never
> = [T] extends [never]
  ? NonFinite<KS[number]>
  : Kind<T, KS & T[0]>

export interface Args extends HKT<string[]> {
  [0x00]: []
  [0x01]: [...this[0x00], k01: string]
  [0x02]: [...this[0x01], k02: string]
  [0x03]: [...this[0x02], k03: string]
  [0x04]: [...this[0x03], k04: string]
  [0x05]: [...this[0x04], k05: string]
  [0x06]: [...this[0x05], k06: string]
  [0x07]: [...this[0x06], k07: string]
  [0x08]: [...this[0x07], k08: string]
  [0x09]: [...this[0x08], k09: string]
  [0x0a]: [...this[0x09], k10: string]
  [0x0b]: [...this[0x0a], k11: string]
  [0x0c]: [...this[0x0b], k12: string]
  [0x0d]: [...this[0x0c], k13: string]
  [0x0e]: [...this[0x0d], k14: string]
  [0x0f]: [...this[0x0e], k15: string]
}

interface Functions {
  [0x00]: Function00
  [0x01]: Function01
  [0x02]: Function02
  [0x03]: Function03
  [0x04]: Function04
  [0x05]: Function05
  [0x06]: Function06
  [0x07]: Function07
  [0x08]: Function08
  [0x09]: Function09
  [0x0a]: Function10
  [0x0b]: Function11
  [0x0c]: Function12
  [0x0d]: Function13
  [0x0e]: Function14
  [0x0f]: Function15
}

interface Function00 extends HKT<Args[0x00]> { [-1]: () => {} }
interface Function01 extends HKT<Args[0x01]> { [-1]: <A>(a: A) => FromEntries<[this[0x00][0x00], A]> }
interface Function02 extends HKT<Args[0x02]> {
  [-1]:
  <A>(a: A) =>
    <B>(b: B) =>
      FromEntries<
        | [this[0x00][0x00], A]
        | [this[0x00][0x01], B]
      >
}

interface Function03 extends HKT<Args[0x03]> {
  [-1]:
  <A>(a: A) =>
    <B>(b: B) =>
      <C>(c: C) =>
        FromEntries<
          | [this[0x00][0x00], A]
          | [this[0x00][0x01], B]
          | [this[0x00][0x02], C]
        >
}

interface Function04 extends HKT<Args[0x04]> {
  [-1]:
  <A>(a: A) =>
    <B>(b: B) =>
      <C>(c: C) =>
        <D>(d: D) =>
          FromEntries<
            | [this[0x00][0x00], A]
            | [this[0x00][0x01], B]
            | [this[0x00][0x02], C]
            | [this[0x00][0x03], D]
          >
}


interface Function05 extends HKT<Args[0x05]> {
  [-1]:
  <A>(a: A) =>
    <B>(b: B) =>
      <C>(c: C) =>
        <D>(d: D) =>
          <E>(e: E) =>
            FromEntries<
              | [this[0x00][0x00], A]
              | [this[0x00][0x01], B]
              | [this[0x00][0x02], C]
              | [this[0x00][0x03], D]
              | [this[0x00][0x04], E]
            >
}


interface Function06 extends HKT<Args[0x06]> {
  [-1]:
  <A>(a: A) =>
    <B>(b: B) =>
      <C>(c: C) =>
        <D>(d: D) =>
          <E>(e: E) =>
            <F>(f: F) =>
              FromEntries<
                | [this[0x00][0x00], A]
                | [this[0x00][0x01], B]
                | [this[0x00][0x02], C]
                | [this[0x00][0x03], D]
                | [this[0x00][0x04], E]
                | [this[0x00][0x05], F]
              >
}


interface Function07 extends HKT<Args[0x07]> {
  [-1]:
  <A>(a: A) =>
    <B>(b: B) =>
      <C>(c: C) =>
        <D>(d: D) =>
          <E>(e: E) =>
            <F>(f: F) =>
              <G>(g: G) =>
                FromEntries<
                  | [this[0x00][0x00], A]
                  | [this[0x00][0x01], B]
                  | [this[0x00][0x02], C]
                  | [this[0x00][0x03], D]
                  | [this[0x00][0x04], E]
                  | [this[0x00][0x05], F]
                  | [this[0x00][0x06], G]
                >
}


interface Function08 extends HKT<Args[0x08]> {
  [-1]:
  <A>(a: A) =>
    <B>(b: B) =>
      <C>(c: C) =>
        <D>(d: D) =>
          <E>(e: E) =>
            <F>(f: F) =>
              <G>(g: G) =>
                <H>(h: H) =>
                  FromEntries<
                    | [this[0x00][0x00], A]
                    | [this[0x00][0x01], B]
                    | [this[0x00][0x02], C]
                    | [this[0x00][0x03], D]
                    | [this[0x00][0x04], E]
                    | [this[0x00][0x05], F]
                    | [this[0x00][0x06], G]
                    | [this[0x00][0x07], H]
                  >
}


interface Function09 extends HKT<Args[0x09]> {
  [-1]:
  <A>(a: A) =>
    <B>(b: B) =>
      <C>(c: C) =>
        <D>(d: D) =>
          <E>(e: E) =>
            <F>(f: F) =>
              <G>(g: G) =>
                <H>(h: H) =>
                  <I>(i: I) =>
                    FromEntries<
                      | [this[0x00][0x00], A]
                      | [this[0x00][0x01], B]
                      | [this[0x00][0x02], C]
                      | [this[0x00][0x03], D]
                      | [this[0x00][0x04], E]
                      | [this[0x00][0x05], F]
                      | [this[0x00][0x06], G]
                      | [this[0x00][0x07], H]
                      | [this[0x00][0x08], I]
                    >
}

interface Function10 extends HKT<Args[0x0a]> {
  [-1]:
  <A>(a: A) =>
    <B>(b: B) =>
      <C>(c: C) =>
        <D>(d: D) =>
          <E>(e: E) =>
            <F>(f: F) =>
              <G>(g: G) =>
                <H>(h: H) =>
                  <I>(i: I) =>
                    <J>(j: J) =>
                      FromEntries<
                        | [this[0x00][0x00], A]
                        | [this[0x00][0x01], B]
                        | [this[0x00][0x02], C]
                        | [this[0x00][0x03], D]
                        | [this[0x00][0x04], E]
                        | [this[0x00][0x05], F]
                        | [this[0x00][0x06], G]
                        | [this[0x00][0x07], H]
                        | [this[0x00][0x08], I]
                        | [this[0x00][0x09], J]
                      >
}


interface Function11 extends HKT<Args[0x0b]> {
  [-1]:
  <A>(a: A) =>
    <B>(b: B) =>
      <C>(c: C) =>
        <D>(d: D) =>
          <E>(e: E) =>
            <F>(f: F) =>
              <G>(g: G) =>
                <H>(h: H) =>
                  <I>(i: I) =>
                    <J>(j: J) =>
                      <K>(k: K) =>
                        FromEntries<
                          | [this[0x00][0x00], A]
                          | [this[0x00][0x01], B]
                          | [this[0x00][0x02], C]
                          | [this[0x00][0x03], D]
                          | [this[0x00][0x04], E]
                          | [this[0x00][0x05], F]
                          | [this[0x00][0x06], G]
                          | [this[0x00][0x07], H]
                          | [this[0x00][0x08], I]
                          | [this[0x00][0x09], J]
                          | [this[0x00][0x0a], K]
                        >
}

interface Function12 extends HKT<Args[0x0c]> {
  [-1]:
  <A>(a: A) =>
    <B>(b: B) =>
      <C>(c: C) =>
        <D>(d: D) =>
          <E>(e: E) =>
            <F>(f: F) =>
              <G>(g: G) =>
                <H>(h: H) =>
                  <I>(i: I) =>
                    <J>(j: J) =>
                      <K>(k: K) =>
                        <L>(l: L) =>
                          FromEntries<
                            | [this[0x00][0x00], A]
                            | [this[0x00][0x01], B]
                            | [this[0x00][0x02], C]
                            | [this[0x00][0x03], D]
                            | [this[0x00][0x04], E]
                            | [this[0x00][0x05], F]
                            | [this[0x00][0x06], G]
                            | [this[0x00][0x07], H]
                            | [this[0x00][0x08], I]
                            | [this[0x00][0x09], J]
                            | [this[0x00][0x0a], K]
                            | [this[0x00][0x0b], L]
                          >
}

interface Function13 extends HKT<Args[0x0d]> {
  [-1]:
  <A>(a: A) =>
    <B>(b: B) =>
      <C>(c: C) =>
        <D>(d: D) =>
          <E>(e: E) =>
            <F>(f: F) =>
              <G>(g: G) =>
                <H>(h: H) =>
                  <I>(i: I) =>
                    <J>(j: J) =>
                      <K>(k: K) =>
                        <L>(l: L) =>
                          <M>(m: M) =>
                            FromEntries<
                              | [this[0x00][0x00], A]
                              | [this[0x00][0x01], B]
                              | [this[0x00][0x02], C]
                              | [this[0x00][0x03], D]
                              | [this[0x00][0x04], E]
                              | [this[0x00][0x05], F]
                              | [this[0x00][0x06], G]
                              | [this[0x00][0x07], H]
                              | [this[0x00][0x08], I]
                              | [this[0x00][0x09], J]
                              | [this[0x00][0x0a], K]
                              | [this[0x00][0x0b], L]
                              | [this[0x00][0x0c], M]
                            >
}

interface Function14 extends HKT<Args[0x0e]> {
  [-1]:
  <A>(a: A) =>
    <B>(b: B) =>
      <C>(c: C) =>
        <D>(d: D) =>
          <E>(e: E) =>
            <F>(f: F) =>
              <G>(g: G) =>
                <H>(h: H) =>
                  <I>(i: I) =>
                    <J>(j: J) =>
                      <K>(k: K) =>
                        <L>(l: L) =>
                          <M>(m: M) =>
                            <N>(n: N) =>
                              FromEntries<
                                | [this[0x00][0x00], A]
                                | [this[0x00][0x01], B]
                                | [this[0x00][0x02], C]
                                | [this[0x00][0x03], D]
                                | [this[0x00][0x04], E]
                                | [this[0x00][0x05], F]
                                | [this[0x00][0x06], G]
                                | [this[0x00][0x07], H]
                                | [this[0x00][0x08], I]
                                | [this[0x00][0x09], J]
                                | [this[0x00][0x0a], K]
                                | [this[0x00][0x0b], L]
                                | [this[0x00][0x0c], M]
                                | [this[0x00][0x0d], N]
                              >
}

interface Function15 extends HKT<Args[0x0f]> {
  [-1]:
  <A>(a: A) =>
    <B>(b: B) =>
      <C>(c: C) =>
        <D>(d: D) =>
          <E>(e: E) =>
            <F>(f: F) =>
              <G>(g: G) =>
                <H>(h: H) =>
                  <I>(i: I) =>
                    <J>(j: J) =>
                      <K>(k: K) =>
                        <L>(l: L) =>
                          <M>(m: M) =>
                            <N>(n: N) =>
                              <O>(o: O) =>
                                FromEntries<
                                  | [this[0x00][0x00], A]
                                  | [this[0x00][0x01], B]
                                  | [this[0x00][0x02], C]
                                  | [this[0x00][0x03], D]
                                  | [this[0x00][0x04], E]
                                  | [this[0x00][0x05], F]
                                  | [this[0x00][0x06], G]
                                  | [this[0x00][0x07], H]
                                  | [this[0x00][0x08], I]
                                  | [this[0x00][0x09], J]
                                  | [this[0x00][0x0a], K]
                                  | [this[0x00][0x0b], L]
                                  | [this[0x00][0x0c], M]
                                  | [this[0x00][0x0d], N]
                                  | [this[0x00][0x0e], O]
                                >
}
