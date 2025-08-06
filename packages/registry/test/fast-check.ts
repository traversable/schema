import * as fc from 'fast-check'
export * from 'fast-check'

export type Natural<T> =
  /* @ts-expect-error */
  [`${T}`] extends
  [`${infer Z extends number}`]
  ? `${Z}` extends `-${string}` ? never
  : `${Z}` extends `${string}.${string}` ? never
  : Z : never

export type PickedKeyOf = never | [pickedKey: string, object: Record<string, unknown>]
export let pickKeyOf
  : <T extends Natural<T>>(maxNumberOfKeysInObject: T) => fc.Arbitrary<PickedKeyOf>
  = (x) => fc.tuple(
    fc.nat(Math.max(x - 1, 0)),
    fc.dictionary(fc.string(), fc.anything(), { minKeys: x, maxKeys: x })
  ).map(([k, xs]) => [Object.keys(xs)[k], xs])

export type PickedKeysOf = never | [pickedKeys: string[], object: Record<string, unknown>]
export let pickKeysOf
  : <T extends Natural<T>>(maxNumberOfKeysInObject: T) => fc.Arbitrary<PickedKeysOf>
  = (x) => fc.tuple(
    fc.uniqueArray(fc.nat(Math.max(x - 1, 0)), { minLength: 1, maxLength: x }),
    fc.dictionary(fc.string(), fc.anything(), { minKeys: x, maxKeys: x })
  ).map(([ixs, xs]) => {
    let _keys = Object.keys(xs)
    let keys = ixs.map((ix) => _keys[ix])
    return [keys, xs]
  })

export type PickedIndexOf = never | [pickedIndex: number, array: readonly unknown[]]
export let pickIndexOf
  : <T extends Natural<T>>(maxNumberOfIndicesInArray: T) => fc.Arbitrary<PickedIndexOf>
  = (x) => fc.tuple(
    fc.nat(Math.max(x - 1, 0)),
    fc.array(fc.anything(), { minLength: x, maxLength: x })
  ).map(([ix, xs]) => {
    return [ix, xs]
  })

export type PickedIndicesOf = never | [pickedIndices: number[], array: readonly unknown[]]
export let pickIndicesOf
  : <T extends Natural<T>>(maxNumberOfIndicesInArray: T) => fc.Arbitrary<PickedIndicesOf>
  = (x) => fc.tuple(
    fc.uniqueArray(fc.nat(Math.max(x - 1, 0)), { minLength: 1, maxLength: x }),
    fc.array(fc.anything(), { minLength: x, maxLength: x })
  ).map(([ix, xs]) => {
    return [ix, xs]
  })

export type OmittedKeyOf = never | [omittedKey: string, withoutKey: Record<string, unknown>, originalObject: Record<string, unknown>]
export let omitKeyOf
  : <T extends Natural<T>>(maxNumberOfKeysInObject: T) => fc.Arbitrary<OmittedKeyOf>
  = (x) => fc.tuple(
    fc.nat(Math.max(x - 1, 0)),
    fc.dictionary(fc.string(), fc.anything(), { minKeys: x, maxKeys: x })
  ).map(([ix, ys]) => {
    let xs = structuredClone(ys)
    let ks = Object.keys(xs)
    let k = ks[ix]
    void (delete xs[k])
    return [k, xs, ys]
  })

export type OmittedKeysOf = never | [omittedKeys: string[], withoutKey: Record<string, unknown>, originalObject: Record<string, unknown>]
export let omitKeysOf
  : <T extends Natural<T>>(maxNumberOfKeysInObject: T) => fc.Arbitrary<OmittedKeysOf>
  = (x) => fc.tuple(
    fc.uniqueArray(fc.nat(Math.max(x - 1, 0)), { minLength: 1, maxLength: x }),
    fc.dictionary(fc.string(), fc.anything(), { minKeys: x, maxKeys: x })
  ).map(([ixs, ys]) => {
    let xs = structuredClone(ys)
    let keys_ = Object.keys(xs)
    let keys = ixs.map((ix) => keys_[ix])
    for (let k of keys)
      void (delete xs[k])
    return [keys, xs, ys]
  })

export type OmittedIndexOf = never | [omittedIndex: number, withoutKey: { [x: number]: unknown }, originalArray: readonly unknown[]]
export let omitIndexOf
  : <T extends Natural<T>>(maxNumberOfIndicesInArray: T) => fc.Arbitrary<OmittedIndexOf>
  = (x) => fc.tuple(
    fc.nat(Math.max(x - 1, 0)),
    fc.array(fc.anything(), { minLength: x, maxLength: x })
  ).map(([ix, ys]) => {
    let xs = structuredClone(ys)
    void (delete xs[ix])
    return [ix, xs, ys]
  })

export type OmittedIndicesOf = never | [omittedIndices: number[], withoutKey: { [x: number]: unknown }, originalArray: readonly unknown[]]
export let omitIndicesOf
  : <T extends Natural<T>>(maxNumberOfIndicesInArray: T) => fc.Arbitrary<OmittedIndicesOf>
  = (x) => fc.tuple(
    fc.uniqueArray(fc.nat(Math.max(x - 1, 0)), { minLength: 1, maxLength: x }),
    fc.array(fc.anything(), { minLength: x, maxLength: x })
  ).map(([ixs, ys]) => {
    let xs = structuredClone(ys)
    for (let ix of ixs)
      void (delete xs[ix])
    return [ixs, xs, ys]
  })
