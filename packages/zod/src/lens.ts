// import type { z } from 'zod/v4'
import { z } from 'zod/v4'

import type { Force, Key, newtype, Showable } from '@traversable/registry'
import {
  Array_from,
  Array_isArray,
  fn,
  has,
  Number_isNaN,
  Number_isSafeInteger,
  Number_parseInt,
  Object_assign,
  Object_create,
  Object_hasOwn,
  Object_keys,
  Profunctor,
  symbol,
} from '@traversable/registry'
import { defaultValue } from './default-value.js'
import { tagged } from './typename.js'

export interface RegisterDSL {}
// /** TODO: set up module augmentation */
// type Absorb<S, T> = unknown extends S ? T : S
// export function registerDSL<const T extends { [K in keyof GlobalDSL]+?: keyof any }>(dsl: T): { [K in keyof DSL]: Absorb<T[K], DSL[K]> }
// export function registerDSL<const T extends Partial<GlobalDSL>>(dsl: T) { return setDSL(dsl) }
// function setDSL<T extends { [K in keyof GlobalDSL]+?: keyof any }>(
//   DSL: { [K in keyof T]: T[K] }
// ): { [K in keyof DSL]: Absorb<T[K], DSL[K]> }
// function setDSL(DSL: { [K in keyof GlobalDSL]+?: string }) {
//   fn.map(DSL, (v, k) => { GlobalDSL[k] = v as never })
//   return GlobalDSL
// }


type DSL = typeof DSL
const DSL = {
  chainOptional: 'ʔ' as const,
  coalesceOptional: 'ǃ' as const,
  identity: 'Ⳇ' as const,
  traverseArray: 'ᣔꓸꓸ' as const,
  traverseRecord: 'ᣔꓸꓸ' as const,
  traverseSet: 'ᣔꓸꓸ' as const,
  unionPrefix: 'ꖛ' as const
  // traverseRecord: 'ↆ' as const,
  // traverseArray: 'ↆ' as const,
}

type GlobalDSL = DSL
let GlobalDSL: { [K in keyof typeof DSL]: string } = {
  chainOptional: DSL.chainOptional,
  coalesceOptional: DSL.coalesceOptional,
  identity: DSL.identity,
  traverseArray: DSL.traverseArray,
  traverseRecord: DSL.traverseRecord,
  traverseSet: DSL.traverseSet,
  unionPrefix: DSL.unionPrefix,
} satisfies { [K in keyof typeof DSL]: typeof DSL[K] }

// type LocalDSLKey = typeof LocalDSL[keyof typeof LocalDSL] | (string & {})
// const LocalDSL:
//   & { [K in Exclude<keyof typeof DSL, 'unionPrefix'>]: K }
//   & {
//     unionPrefix: 'union::'
//     disjointPrefix: 'disjoint@'
//     recordKeyPrefix: 'record::'
//   } = {
//   chainOptional: 'chainOptional',
//   coalesceOptional: 'coalesceOptional',
//   identity: 'identity',
//   traverseArray: 'traverseArray',
//   traverseRecord: 'traverseRecord',
//   traverseSet: 'traverseSet',
//   unionPrefix: 'union::',
//   disjointPrefix: 'disjoint@',
//   recordKeyPrefix: 'record::',
// }

function getDSL() { return GlobalDSL }

declare namespace Z {
  type infer<S, T extends [any] = [S]> = T[0][symbol.type]
  interface Type<T> { _output: T }
  interface Indexed { [x: number]: Z.Typed }
  interface Named { [x: string]: Z.Typed }
  type Objects = readonly Z.Object[]
  type Ordered = readonly Z.Typed[]
  interface Infer<
    T extends
    | { _output: unknown }
    = { _output: unknown }
  > { _output: T['_output'] }
  interface Typed<
    T extends
    | { _zod: { def: { type: unknown } } }
    = { _zod: { def: { type: unknown } } }
  > { _zod: { def: { type: T['_zod']['def']['type'] } }, _output: unknown }
  //
  /**
   * TODO: see if `z.set`'s valueType has been added to `_zod.def.valueType` in zod v3.25.0
   */
  interface Set { _zod: { def: { type: 'set' } }, _output: unknown }
  interface Enum<
    T extends
    | { enum: { [x: string | number]: string | number }, output: string | number }
    = { enum: { [x: string | number]: string | number }, output: string | number }
  > { enum: T['enum'], output: string | number }
  interface Literal<
    T extends
    | { _zod: { output: Showable } }
    = { _zod: { output: Showable } }
  > { _zod: { output: T['_zod']['output'] }, _output: unknown }
  interface Optional<
    T extends
    | { _zod: { def: { innerType: Z.Typed } } }
    = { _zod: { def: { innerType: Z.Typed } } }
  > { _zod: { def: { innerType: T['_zod']['def']['innerType'] } }, _output: unknown }
  interface Array<
    T extends
    | { _zod: { def: { element: Z.Typed } } }
    = { _zod: { def: { element: Z.Typed } } }
  > { _zod: { def: { element: T['_zod']['def']['element'] } }, _output: unknown[] }
  interface Record<
    T extends
    | { keyType: unknown, valueType: unknown, _zod: { def: { type: 'record' } }, _output: unknown }
    = { keyType: unknown, valueType: unknown, _zod: { def: { type: 'record' } }, _output: unknown }
  > { keyType: T['keyType'], valueType: T['valueType'], _zod: { def: { type: 'record' } }, _output: unknown }
  interface Map<
    T extends
    | { keyType: unknown, valueType: unknown, _output: unknown, _zod: { def: { type: 'map' } } }
    = { keyType: unknown, valueType: unknown, _output: unknown, _zod: { def: { type: 'map' } } }
  > { keyType: T['keyType'], valueType: T['valueType'], _zod: { def: { type: 'map' } }, _output: unknown }
  interface Union<
    T extends
    | { _zod: { def: { options: Z.Ordered } } }
    = { _zod: { def: { options: Z.Ordered } } }
  > { _zod: { def: { options: T['_zod']['def']['options'] } }, _output: unknown }
  interface Tuple<
    T extends
    | { _zod: { def: { items: Z.Ordered } } }
    = { _zod: { def: { items: Z.Ordered } } }
  > { _zod: { def: { items: T['_zod']['def']['items'] } }, _output: unknown }
  interface Object<
    T extends
    | { _zod: { def: { shape: Z.Named } } }
    = { _zod: { def: { shape: Z.Named } } }
  > { _zod: { def: { shape: T['_zod']['def']['shape'] } }, _output: unknown }
}

export interface Witness { (proxy: unknown): { [PATH_KEY]: string[] } }

const PATH_KEY = ' ~path' as const

function rebuildFallbackSlice(leaf: unknown, root: unknown, ...path: (keyof any)[]) {
  // let slice = path.reverse()
  // const unionIndicies = slice.map((segment, ix) => `${segment}`.startsWith(LocalDSL.unionPrefix) ? ix : null)
  // const firstUnionIndex = unionIndicies.findIndex((x) => x !== null)
  // slice = firstUnionIndex === -1 ? slice : slice.slice(firstUnionIndex)
  let Cmd: keyof any | undefined
  let TOP = root
  let BOTTOM = leaf
  let ix = 0

  while ((Cmd = path.pop()) !== undefined) {
    ix++
    switch (true) {
      case Cmd === symbol.optional: continue
      case Cmd === symbol.coalesce: continue
      // case Cmd === symbol.disjoint: {
      //   Cmd = path.pop()
      //   // TODO: look at the CURSOR to determine discriminant?
      //   continue
      // }
      case Cmd === symbol.union: {
        Cmd = path.pop()
        continue
      }
      case Cmd === symbol.array: {
        Cmd = path.pop()
        BOTTOM = [BOTTOM]
        continue
      }
      case Cmd === symbol.set: {
        Cmd = path.pop()
        BOTTOM = new globalThis.Set([BOTTOM])
        continue
      }
      // TODO:
      case Cmd === symbol.record: {
        Cmd = path.pop()
        continue
      }
      // case `${Cmd}`.startsWith(LocalDSL.recordKeyPrefix): {
      //   Cmd = `${Cmd}`.slice(LocalDSL.recordKeyPrefix.length)
      //   BOTTOM = { [Cmd]: BOTTOM }
      //   continue
      // }
      case Cmd === symbol.object: {
        Cmd = path.pop()
        BOTTOM = { [String(Cmd)]: BOTTOM }
        continue
      }
      case Cmd === symbol.tuple: {
        Cmd = Number_parseInt(String(path.pop()))
        if (!Number_isSafeInteger(Cmd)) throw Error('030')
        else {
          let xs = Array_from({ length: Cmd })
          xs[Cmd] = BOTTOM
          BOTTOM = xs
          continue
        }
      }
    }
  }

  return BOTTOM
}


export interface RevocableProxy<T> {
  proxy: T
  revoke(): void
}

export function createProxy<T extends z.core.$ZodType, P = Proxy<T>>(type: T): RevocableProxy<P>
export function createProxy<T extends z.core.$ZodType>(type: T) {
  let state = Array.of<string>()
  let proxy: RevocableProxy<T> | undefined = undefined
  let handler = Object_create<ProxyHandler<T>>(null)
  handler.get = (target, key) => {
    const index = Number_parseInt(String(key))
    proxy?.revoke?.()
    proxy = globalThis.Proxy.revocable(
      Object_assign(target, Object_assign(Object_create(null), { [PATH_KEY]: state })),
      handler
    )
    if (key === PATH_KEY) {
      proxy.revoke()
      return state
    } else {
      proxy.revoke()
      proxy = globalThis.Proxy.revocable(
        Object_assign(target, Object_assign(Object_create(null), { [PATH_KEY]: state })),
        handler
      )
      Reflect.set(state, state.length, Number_isNaN(index) ? key : index)
      return proxy.proxy
    }
  }
  return globalThis.Proxy.revocable(Object_create(null), handler)
}

const Get = {
  Identity: (op: Profunctor.Optic) => function IdentityGet(data: unknown) { return Profunctor.get(op, data) },
  Iso: (op: Profunctor.Optic) => function IdentityGet(data: unknown) { return Profunctor.get(op, data) },
  Lens: (op: Profunctor.Optic) => function LensGet(data: unknown) { return Profunctor.get(op, data) },
  Traversal: (op: Profunctor.Optic) => function TraversalGet(data: unknown) { return Profunctor.collect(op)(data) },
  Prism: (op: Profunctor.Optic) => function PrismGet(data: unknown) { return Profunctor.preview(op, data) },
}

type ModifyArgs = [update: any, data: unknown]
type AnyModifyArgs = [update: any] | ModifyArgs
type SetterFn = (...args: ModifyArgs) => unknown
type ModifyFn = (...args: ModifyArgs) => unknown
function apply(setter: SetterFn | ModifyFn) {
  return (...args: AnyModifyArgs) => args.length === 2 ? setter(...args) : (data: unknown) => setter(...args, data)
}

const Set = {
  Identity: (op: Profunctor.Optic) => apply(function IdentitySet(update: unknown, data: unknown) { Profunctor.set(op, update, data) }),
  Iso: (op: Profunctor.Optic) => apply(function IdentitySet(update: unknown, data: unknown) { return Profunctor.set(op, update, data) }),
  Lens: (op: Profunctor.Optic) => apply(function LensSet(update: unknown, data: unknown) { return Profunctor.set(op, update, data) }),
  Traversal: (op: Profunctor.Optic) => apply(function TraversalSet(update: unknown, data: unknown) { return Profunctor.set(op, update, data) }),
  Prism: (op: Profunctor.Optic) => apply(function PrismSet(update: unknown, data: unknown) { return Profunctor.set(op, update, data) }),
}

const Modify = {
  Identity: (op: Profunctor.Optic) => apply(function IdentityModify(fn: (x: unknown) => unknown, data: unknown) { return Profunctor.modify(op, fn, data) }),
  Iso: (op: Profunctor.Optic) => apply(function IdentityModify(fn: (x: unknown) => unknown, data: unknown) { return Profunctor.modify(op, fn, data) }),
  Lens: (op: Profunctor.Optic) => apply(function LensModify(fn: (x: unknown) => unknown, data: unknown) { return Profunctor.modify(op, fn, data) }),
  Traversal: (op: Profunctor.Optic) => apply(function TraversalModify(fn: (x: unknown) => unknown, data: unknown) { return Profunctor.modify(op, fn, data) }),
  Prism: (op: Profunctor.Optic) => apply(function PrismModify(fn: (x: any) => unknown, data: unknown) { return Profunctor.modify(op, fn, data) }),
}

function intersectKeys<const T extends unknown[]>(...objects: [...T]): (keyof T[number])[]
function intersectKeys<const T extends unknown[]>(...objects: [...T]) {
  const [x, ...xs] = objects
  let out = !!x && typeof x === 'object' ? Object_keys(x) : []
  let $: T[number] | undefined = x
  while (($ = xs.shift()) !== undefined)
    out = out.filter((k) => Object_hasOwn($, k))
  return out
}

const findDiscrinimant = <K extends string, V extends string | number>(tagKey: K, tagValue: V) => has(
  '_zod', 'def', 'shape', tagKey, '_zod', 'def', 'values',
  (set): set is never => Array_isArray(set) && (
    set.includes(tagValue)
    || set.includes(Number_parseInt(`${tagValue}`))
  )
)

const Invariant = {
  SymbolNotSupported(Cmd) { throw Error('Symbol not supported, got: ' + String(Cmd)) },
  ExpectedInnerType(Cmd) { throw Error('Expected schema to have an inner type, got: ' + String(Cmd)) },
  ExpectedTraversalTarget(Cmd) { throw Error('Expected traversal to have a target, got: ' + String(Cmd)) },
  ExpectedUnionSchema(Cmd) { throw Error('Expected a union schema given union syntax, got: ' + String(Cmd)) },
  ExpectedObjectSchemas(Cmd) { throw Error('Expected an array of object schemas given tagged union syntax, got: ' + String(Cmd)) },
  ExpectedExactlyOneDiscriminant(Cmd) { throw Error('6' + String(Cmd)) },
  NumericDiscriminantOutOfBounds(Cmd) { throw Error('7' + String(Cmd)) },
  TaggedSchemaNotFound(Cmd) { throw Error('8' + String(Cmd)) },
  PropertyNotFound(Cmd) { throw Error('9' + String(Cmd)) },
  IndexNotFound(Cmd) { throw Error('10' + String(Cmd)) },
} satisfies Record<string, (cmd: keyof any) => never>


const previousOpticWasLens = (acc: Profunctor.Optic[]) => acc[acc.length - 1]?.[symbol.tag] === 'Lens'
const isNotNull = (x: unknown) => x !== null
const isNotUndefined = (x: unknown) => x !== undefined
const isNonNullable = (x: unknown) => x != null
function handleNullable(isLastCmd: boolean, schemaCursor: unknown) {
  return !isLastCmd ? isNonNullable
    : tagged('nullable')(schemaCursor) ? isNotNull
      : tagged('optional')(schemaCursor) ? isNotUndefined
        : isNonNullable
}

function interpreter<T extends z.ZodType>(type: T, ..._path: (keyof any)[]) {
  const path = parsePath_(type, ..._path)
  const originalPath = [...path]
  const fallback = getFallback(type, ...originalPath)



  let ix = 0
  let isFirstCoalesce = true
  let Cmd: keyof any | undefined = undefined
  let prev = Array.of<keyof any | undefined>()
  let optics = [Profunctor.id]

  while ((Cmd = path.shift()) !== undefined) {
    ix++
    prev.push(Cmd)
    switch (true) {
      case Cmd === symbol.set:
      case Cmd === symbol.array:
      case Cmd === symbol.record: {
        const next = path[0]
        if (typeof next === 'symbol' || next === undefined) {
          optics.push(Profunctor.traverse)
        } else {
          prev.push(Cmd = path.shift())
          if (Cmd === undefined) throw Error('033')
          optics.push(Profunctor.nonNullableProp(Cmd))
        }
        continue
      }
      case Cmd === symbol.optional: {
        // if (!originalPath.includes(symbol.coalesce)) {
        optics.push(Profunctor.when((x) => x != null))
        // }
        continue
      }
      case Cmd === symbol.coalesce: {
        const previousCmd = prev[ix - 1]
        // console.log('previousCmd', previousCmd)
        // if (previousOpticWasLens(optics) && typeof previousCmd === 'string' || typeof previousCmd === 'number') {
        //   optics.pop()
        //   optics.push(Profunctor.propOr(fallback, previousCmd))
        // }
        if (isFirstCoalesce) {
          optics.push(Profunctor.otherwise((x) => x != null, fallback))
        }
        // else {

        //   optics.push(Profunctor.when((x) => x != null))
        // }

        // optics.push(Profunctor.when((x) => x != null))
        // if (previousOpticWasLens(optics) && typeof previousCmd === 'string' || typeof previousCmd === 'number') {
        //   optics.pop()
        //   optics.push(Profunctor.propOr(fallback, previousCmd))
        // }
        // else {
        //   optics.push(Profunctor.otherwise((x) => x != null, fallback))
        // }
        isFirstCoalesce = false
        continue
      }
      case Cmd === symbol.union: {
        prev.push(path.shift())
        const CURSOR = getSubSchema(type, ...prev)
        const predicate = (x: unknown) => CURSOR.safeParse(x).success
        // const optic = Profunctor.when(predicate)
        // console.log('originalPath', originalPath)
        const fallback = getFallback(type, ...originalPath)
        const optic = Profunctor.when(predicate)
        // const optic = Profunctor.otherwise(predicate, fallback)
        optics.push(optic)
        continue
      }
      // case Cmd === symbol.disjoint: {
      //   Cmd = path.shift()
      //   const CURSOR = getSubSchema(type, ...originalPath)
      //   const predicate = hasSafeParse(CURSOR) ? (x: unknown) => CURSOR.safeParse(x).success : constFalse
      //   const optic = hasCoalesce
      //     ? Profunctor.otherwise(predicate, getFallback(type, ...originalPath))
      //     : Profunctor.when(predicate)
      //   optics.push(optic)
      //   continue
      // }
      case Cmd === symbol.object: {
        prev.push(Cmd = path.shift())
        if (Cmd === undefined) throw Error('033')
        optics.push(Profunctor.nonNullableProp(Cmd))
        continue
      }
      case Cmd === symbol.tuple: {
        prev.push(Cmd = path.shift())
        if (Cmd === undefined) throw Error('034')
        optics.push(Profunctor.prop(Cmd))
        continue
      }
    }
  }

  const optic = Profunctor.pipe(...optics)

  // optics.forEach((optic, i) => console.log(
  //   `\nOptic #${i}: `,
  //   optic,
  //   // has('fallback')(optic) ? '\n\nfallback:\n' : '',
  //   // has('fallback')(optic) ? optic.fallback : '',
  //   // has('fallback')(optic) ? '\n' : '',
  // ))

  // console.log()
  // console.log()
  // console.log('ROOT OPTIC', optic)
  // console.log()
  // console.log()

  const tag = optic[symbol.tag]
  const get = Get[tag](optic) as SchemaLens<unknown, never, []>['get']
  const set = Set[tag](optic) as SchemaLens<unknown, never, []>['set']
  const modify = Modify[tag](optic) as SchemaLens<unknown, never, []>['modify']

  return {
    get,
    set,
    modify,
    type: tag,
  } // satisfies SchemaLens<z.infer<T>, Z.infer<T>, []>
}

// const optics = path.reduce(
//   (acc, Cmd, ix, cmds) => {
//     // const isDefined = handleNullable(ix === cmds.length - 1, schemaCursor)
//     switch (true) {
//       case Cmd === symbol.set:
//       case Cmd === symbol.array:
//       case Cmd === symbol.record: return (
//         void (acc.push(Profunctor.traverse)),
//         acc
//       )
//       case Cmd === symbol.optional: return (
//         void (acc.push(Profunctor.when((x) => x != null))),
//         acc
//       )
//       case Cmd === symbol.coalesce: {
//         // TODO: ix, ix
//         // const fallback = getFallback(ix + 1, rootFallback, ...path)
//         // const CURSOR = getSchemaCursor(type, ...path.slice(0, ix + 1))
//         // const isDefined = handleNullable(ix === cmds.length - 1, CURSOR)
//         /**
//          * If we get the 'coalesceOptional' command and the previous optic was a Lens,
//          * replace it with 'Profunctor.propOr' so we can apply the default value
//          */
//         // if (previousOpticWasLens(acc)) acc.pop() && acc.push(Profunctor.propOr(fallback, cmds[ix - 1]))
//         // else acc.push(Profunctor.when(isDefined))
//         return acc
//       }
//       // TODO:
//       // case `${Cmd}`.startsWith(LocalDSL.recordKeyPrefix): {
//       //   Cmd = `${Cmd}`.slice(LocalDSL.recordKeyPrefix.length)
//       //   return (acc.push(Profunctor.nonNullableProp(Cmd)), acc)
//       // }
//       case Cmd === symbol.union: {
//         const CURSOR = getSubSchema(type, ...originalPath)
//         const predicate = hasSafeParse(CURSOR) ? (x: unknown) => CURSOR.safeParse(x).success : constFalse
//         const optic = hasCoalesce
//           ? Profunctor.otherwise(predicate, getFallback_(type, ...originalPath))
//           : Profunctor.when(predicate)
//         return (
//           void (acc.push(optic)),
//           acc
//         )
//       }
//       case `${Cmd}`.startsWith(LocalDSL.disjointPrefix): {
//         const CURSOR = getSchemaCursor(type, ...path.slice(0, ix + 1))
//         const predicate = hasSafeParse(CURSOR) ? (x: unknown) => CURSOR.safeParse(x).success : constFalse
//         const optic = hasCoalesce
//           ? Profunctor.otherwise(predicate, getFallback(ix + 1, rootFallback, ...path))
//           : Profunctor.when(predicate)
//         return (
//           void (acc.push(optic)),
//           acc
//         )
//       }
//       case typeof Cmd === 'string': return (acc.push(Profunctor.nonNullableProp(Cmd)), acc)
//       // case typeof Cmd === 'string': return (acc.push(Profunctor.prop(Cmd)), acc)
//       case typeof Cmd === 'number': return (acc.push(Profunctor.prop(Cmd)), acc)
//       default: return fn.exhaustive(Cmd)
//     }
//   },
//   empty
// )

// const optic = Profunctor.pipe(...optics)

// optics.forEach((optic, i) => console.log(
//   `\nOptic #${i}: `,
//   optic,
//   has('fallback')(optic) ? '\n\nfallback:\n' : '',
//   has('fallback')(optic) ? optic.fallback : '',
//   // has('fallback')(optic) ? '\n' : '',
// ))

// console.log()
// console.log()
// console.log('ROOT OPTIC', optic)
// console.log()
// console.log()


interface Proxy_object<Args extends [T: unknown, S: unknown], KS extends (keyof any)[]> extends newtype<
  { [K in keyof Args[1]]: Proxy<Args[1][K], [Args[1][K]], [...KS, K]> }
> {
  [symbol.type]: Args[0]
  [symbol.path]: KS
}

interface Proxy_tuple<T, S, KS extends (keyof any)[]> extends newtype<
  { [I in Extract<keyof S, `${number}`>]: Proxy<S[I], [S[I]], [...KS, I]> }
> {
  [symbol.type]: T
  [symbol.path]: KS
}

interface Proxy_optional<T, S, KS extends (keyof any)[]> {
  [DSL.chainOptional]: Proxy<S>
  [DSL.coalesceOptional]: Proxy<S, [defaultValue<S>], KS>
  [symbol.type]: T
  [symbol.path]: [...KS, symbol.optional]
}

interface Proxy_array<T, S, KS extends (keyof any)[]> {
  [DSL.traverseArray]: Proxy<S, [S], [...KS, array: number]>
  [symbol.type]: T
  [symbol.path]: [...KS, array: number]
  // [symbol.path]: [...KS, symbol.array]
}

type Proxy_record<T, S extends [any, any], KS extends (keyof any)[]>
  = S[0] extends { enum: { [x: string | number]: string | number } }
  ? never | Proxy_finiteRecord<T, S, KS>
  : never | Proxy_nonfiniteRecord<T, S, KS>

interface Proxy_nonfiniteRecord<T, S extends [any, any], KS extends (keyof any)[]> {
  [DSL.traverseRecord]: Proxy<S[1], [S[1]], [...KS, nonfiniteRecord: string]>
  // [DSL.traverseRecord]: Proxy<S[1], [S[1]], [...KS, symbol.record]>
  [symbol.type]: T
  [symbol.path]: [...KS, nonfiniteRecord: string]
  // [symbol.path]: [...KS, string]
}

interface Proxy_finiteRecord<T, S extends [any, any], KS extends (keyof any)[]> extends newtype<
  { [K in S[0]['enum'][keyof S[0]['enum']]]: Proxy<S[1], [S[1]], [...KS, finiteRecord: K]> }
> {
  [DSL.traverseRecord]: Proxy<S[1], [S[1]], [...KS, string]>
  // [DSL.traverseRecord]: Proxy<S[1], [S[1]], [...KS, symbol.record]>
  [symbol.type]: T
  [symbol.path]: [...KS, finiteRecord: string]
  // [symbol.path]: [...KS, symbol.record]
}

interface Proxy_primitive<T, KS extends (keyof any)[]> {
  [symbol.type]: T
  [symbol.path]: KS
}

interface Proxy_set<T, S, KS extends (keyof any)[]> {
  [DSL.traverseSet]: Proxy<S>
  [symbol.type]: T
  [symbol.path]: KS
}

type Union<
  T,
  S extends [any],
  KS extends (keyof any)[],
  _ extends S[0] = S[0],
  Disc extends keyof any = keyof _[number]['_zod']['def']['shape'],
  Tag extends keyof any = _[number]['_zod']['def']['shape'][Disc]['_output']
> = [Disc] extends [never]
  ? never | Proxy_union<T, _>
  : never | Disjoint<
    Tag extends Tag
    ? [
      Tag,
      Extract<_[number]['_zod']['def']['shape'], Record<Disc, { _output: Tag }>>,
      Extract<T, Record<Disc, Tag>>
    ]
    : never,
    KS
  >

interface Proxy_union<T, S> extends newtype<
  { [I in Extract<keyof S, `${number}`> as `${GlobalDSL['unionPrefix']}${I}`]: Proxy<S[I]> }
> { [symbol.type]: T }

type Disjoint<U extends [Tag: keyof any, S: unknown, T: unknown], KS extends (keyof any)[]> = never | Proxy_disjointUnion<
  U[2],
  { [M in U as `${GlobalDSL['unionPrefix']}${Key<M[0]>}`]: Proxy_object<[M[2], { [K in keyof M[1]]: M[1][K] }], KS> },
  KS
>

interface Proxy_disjointUnion<T, S extends {}, KS extends (keyof any)[]> extends newtype<S> {
  [symbol.type]: T
  [symbol.path]: KS
}

type Proxy<S, T extends [any] = [S], KS extends (keyof any)[] = []>
  = [S] extends [Z.Object] ? Proxy_object<[T[0]['_output'], S['_zod']['def']['shape']], KS>
  : [S] extends [Z.Optional] ? Proxy_optional<T[0]['_output'], S['_zod']['def']['innerType'], KS>
  : [S] extends [Z.Tuple] ? Proxy_tuple<T[0]['_output'], S['_zod']['def']['items'], KS>
  : [S] extends [Z.Union] ? Union<T[0]['_output'], [S['_zod']['def']['options']], KS>
  : [S] extends [Z.Array] ? Proxy_array<T[0]['_output'], S['_zod']['def']['element'], KS>
  : [S] extends [Z.Record] ? Proxy_record<T[0]['_output'], [S['keyType'], S['valueType']], KS>
  : [S] extends [Z.Set] ? Proxy_set<T[0]['_output'], S extends z.core.$ZodSet<infer V> ? V : never, KS>
  : Proxy_primitive<T[0]['_output'], KS>

export interface SchemaLens<S, A, KS extends (keyof any)[]> {
  get(data: S): A
  set(focus: A, data: S): S
  set(focus: A): (data: S) => S
  modify<B>(fn: (focus: A) => B, source: S): Modify<KS, S, B>
  modify<B>(fn: (focus: A) => B): (source: S) => Modify<KS, S, B>
  type: Profunctor.Optic.Type
}

const areAllObjects = (x: unknown[]): x is Z.Object[] => x.every(tagged('object'))

function isDisjointUnionSchema(CURSOR: Z.Union) {
  const OPTIONS = [...CURSOR._zod.def.options]
  if (areAllObjects(OPTIONS)) {
    const discriminants = intersectKeys(...OPTIONS.map((x: Z.Object) => x._zod.def.shape))
    if (discriminants.length > 1) throw Error('more than 1 discriminant: [' + discriminants.join(', ') + ']')
    const [DISC] = discriminants
    const TAGS = OPTIONS.map((x: Z.Object) => x._zod.def.shape[DISC])
    if (!TAGS.every(tagged('literal'))) return false
    else return [...new globalThis.Set((TAGS as z.ZodLiteral[]).map((lit) => lit._zod.def.values[0])).values()].length === TAGS.length
  } else return false
}

export function parsePath<T extends z.ZodType>(type: T, ...path: (string | number)[]): (keyof any)[] {
  let OUT = Array.of<keyof any>()
  let CURSOR: unknown = type
  let Cmd: string | number | undefined
  while ((Cmd = path.shift()) !== undefined) {
    switch (true) {
      case Cmd === GlobalDSL.identity: continue
      case Cmd === GlobalDSL.chainOptional: {
        if (!tagged('optional')(CURSOR) && !tagged('nullable')(CURSOR)) { throw Error('0') }
        CURSOR = CURSOR._zod.def.innerType
        OUT.push(symbol.optional)
        continue
      }
      case Cmd === GlobalDSL.coalesceOptional: {
        if (!tagged('optional')(CURSOR) && !tagged('nullable')(CURSOR)) { throw Error('1') }
        CURSOR = CURSOR._zod.def.innerType
        OUT.push(symbol.coalesce)
        continue
      }
      case Cmd === GlobalDSL.traverseArray && tagged('array')(CURSOR): {
        CURSOR = CURSOR._zod.def.element
        OUT.push(symbol.array)
        continue
      }
      case Cmd === GlobalDSL.traverseRecord && tagged('record')(CURSOR): {
        CURSOR = CURSOR._zod.def.valueType
        OUT.push(symbol.record)
        continue
      }
      case Cmd === GlobalDSL.traverseSet && tagged('set')(CURSOR): {
        CURSOR = CURSOR._zod.def.valueType
        OUT.push(symbol.set)
        continue
      }
      case Cmd === GlobalDSL.traverseArray || Cmd === GlobalDSL.traverseRecord || Cmd === GlobalDSL.traverseSet: throw Error('2')
      case `${Cmd}`.startsWith(GlobalDSL.unionPrefix): {
        Cmd = `${Cmd}`.slice(GlobalDSL.unionPrefix.length)
        if (!tagged('union')(CURSOR)) { throw Error('3') }
        else if (!isDisjointUnionSchema(CURSOR as never)) {
          const index = Number_parseInt(Cmd)
          if (!Number_isSafeInteger(index)) throw Error('4')
          else {
            // OUT.push(`union::${Cmd}`)
            OUT.push(symbol.union, index)
            CURSOR = CURSOR._zod.def.options[index]
            continue
          }
        } else if (!tagged('union')(CURSOR)) throw Error('7')
        else {
          const OPTIONS = [...CURSOR._zod.def.options]
          if (!areAllObjects(OPTIONS)) throw Error('5')
          const discriminants = intersectKeys(...OPTIONS.map((x) => x._zod.def.shape))
          if (discriminants.length > 1) throw Error('6')
          const [DISC] = discriminants
          const index = OPTIONS.findIndex(
            has(
              '_zod',
              'def',
              'shape',
              DISC,
              (x): x is never => tagged('literal')(x) && (
                x._zod.def.values[0] === Cmd || x._zod.def.values[0] === Number_parseInt(`${Cmd}`)
              )
            )
          )
          OUT.push(symbol.union, index)
          CURSOR = OPTIONS[index]
          continue
        }
      }
      case Number_isSafeInteger(Number_parseInt(`${Cmd}`)) && tagged('tuple')(CURSOR): {
        const index = Number_parseInt(`${Cmd}`)
        OUT.push(symbol.tuple, index)
        CURSOR = CURSOR._zod.def.items[index]
        continue
      }
      case typeof Cmd === 'string' && tagged('object')(CURSOR): {
        if (!has(Cmd)(CURSOR._zod.def.shape)) throw Error('8')
        CURSOR = CURSOR._zod.def.shape[Cmd]
        OUT.push(symbol.object, Cmd)
        continue
      }
      // TODO:
      // case typeof Cmd === 'string' && tagged('record')(CURSOR): {
      //   CURSOR = CURSOR._zod.def.valueType
      //   OUT.push(`${LocalDSL.recordKeyPrefix}${Cmd}`)
      //   continue
      // }
      default: throw Error('9')
    }
  }
  return OUT
}

export function getSubSchema<T extends z.ZodType>(type: T, ...path: (keyof any | undefined)[]): z.ZodType
export function getSubSchema<T extends z.ZodType>(type: T, ...path: (keyof any | undefined)[]) {
  let Cmd: keyof any | undefined
  let CURSOR: unknown = type
  while ((Cmd = path.shift()) !== undefined) {
    switch (true) {
      // case Cmd === symbol.disjoint: {
      //   const index = Number_parseInt(String(path.shift()))
      //   if (!tagged('union')(CURSOR)) throw Error('000')
      //   else if (!Number_isSafeInteger(index)) throw Error('001')
      //   else if (!(index in CURSOR._zod.def.options)) throw Error('002')
      //   else {
      //     CURSOR = CURSOR._zod.def.options[index]
      //     continue
      //   }
      // }
      case Cmd === symbol.union: {
        const index = Number_parseInt(String(path.shift()))
        if (!tagged('union')(CURSOR)) throw Error('003')
        else if (!Number_isSafeInteger(index)) throw Error('004')
        else if (!(index in CURSOR._zod.def.options)) throw Error('005')
        else {
          CURSOR = CURSOR._zod.def.options[index]
          continue
        }
      }
      // case Cmd.startsWith(LocalDSL.recordKeyPrefix): {
      //   if (!tagged('record')(CURSOR)) throw Error('006')
      //   CURSOR = CURSOR._zod.def.valueType
      //   continue
      // }
      case Cmd === symbol.optional: {
        if (!tagged('optional')(CURSOR) && !tagged('nullable')(CURSOR)) throw Error('007')
        CURSOR = CURSOR._zod.def.innerType
        continue
      }
      case Cmd === symbol.coalesce: {
        if (!tagged('optional')(CURSOR) && !tagged('nullable')(CURSOR)) throw Error('008')
        CURSOR = CURSOR._zod.def.innerType
        continue
      }
      case Cmd === symbol.array: {
        if (!tagged('array')(CURSOR)) throw Error('009')
        CURSOR = CURSOR._zod.def.element
        continue
      }
      case Cmd === symbol.record: {
        if (!tagged('record')(CURSOR)) throw Error('010')
        CURSOR = CURSOR._zod.def.valueType
        continue
      }
      case Cmd === symbol.set: {
        if (!tagged('set')(CURSOR)) throw Error('011')
        CURSOR = CURSOR._zod.def.valueType
        continue
      }
      case Cmd === symbol.object: {
        Cmd = String(path.shift())
        if (!tagged('object')(CURSOR)) throw Error('012')
        else if (!(Cmd in CURSOR._zod.def.shape)) throw Error('013: ' + Cmd)
        else {
          CURSOR = CURSOR._zod.def.shape[Cmd]
          continue
        }
      }
      case Cmd === symbol.tuple: {
        Cmd = Number_parseInt(String(path.shift()))
        if (!tagged('tuple')(CURSOR)) throw Error('014')
        else if (!(Cmd in CURSOR._zod.def.items)) throw Error('015')
        else {
          CURSOR = CURSOR._zod.def.items[Cmd]
          continue
        }
      }
    }
  }
  return CURSOR
}

export function getFallback<T extends z.ZodType>(type: T, ...path: (keyof any)[]) {
  const index = path.indexOf(symbol.coalesce)

  if (index === -1) return undefined
  else {
    const [pathToFirstCoalesce, coalescedPath] = [path.slice(0, index + 1), path.slice(index + 1)]
    const subSchema = getSubSchema(type, ...pathToFirstCoalesce)
    if (coalescedPath.findIndex((x) => x === symbol.union || x === symbol.disjoint) === -1) {
      const fallback = defaultValue(subSchema, { unionTreatment: 'undefined' })

      return fallback
    } else {
      // console.log('coalescedPath', coalescedPath)
      const fallback = defaultValue(subSchema, { unionTreatment: coalescedPath })

      let localPath = [...coalescedPath]
      // console.log('fallback in getFallback', fallback)
      // let optic = interpreter(subSchema, ...localPath)
      // console.log('optic', optic)
      // console.log('coalescedPath', coalescedPath)

      return fallback
    }
  }
}

export function parsePath_<T extends z.ZodType>(type: T, ...path: (keyof any)[]): (keyof any)[] {
  let OUT = Array.of<keyof any>()
  let CURSOR: unknown = type
  let Cmd: keyof any | undefined
  while ((Cmd = path.shift()) !== undefined) {
    switch (true) {
      case Cmd === GlobalDSL.identity: continue
      case Cmd === GlobalDSL.chainOptional: {
        if (!tagged('optional')(CURSOR) && !tagged('nullable')(CURSOR)) { throw Error('0') }
        CURSOR = CURSOR._zod.def.innerType
        // OUT.push(LocalDSL.chainOptional)
        OUT.push(symbol.optional)
        continue
      }
      case Cmd === GlobalDSL.coalesceOptional: {
        if (!tagged('optional')(CURSOR) && !tagged('nullable')(CURSOR)) { throw Error('1') }
        CURSOR = CURSOR._zod.def.innerType
        // OUT.push(LocalDSL.coalesceOptional)
        OUT.push(symbol.coalesce)
        continue
      }
      case Cmd === GlobalDSL.traverseArray && tagged('array')(CURSOR): {
        CURSOR = CURSOR._zod.def.element
        // OUT.push(LocalDSL.traverseArray)
        OUT.push(symbol.array)
        continue
      }
      case Cmd === GlobalDSL.traverseRecord && tagged('record')(CURSOR): {
        CURSOR = CURSOR._zod.def.valueType
        // OUT.push(LocalDSL.traverseRecord)
        OUT.push(symbol.record, symbol.string)
        continue
      }
      case Cmd === GlobalDSL.traverseSet && tagged('set')(CURSOR): {
        CURSOR = CURSOR._zod.def.valueType
        // OUT.push(LocalDSL.traverseSet)
        OUT.push(symbol.set)
        continue
      }
      case Cmd === GlobalDSL.traverseArray || Cmd === GlobalDSL.traverseRecord || Cmd === GlobalDSL.traverseSet:
        throw Error('2')
      case String(Cmd).startsWith(GlobalDSL.unionPrefix): {
        Cmd = String(Cmd).slice(GlobalDSL.unionPrefix.length)
        const index = Number_parseInt(Cmd)
        if (!tagged('union')) { throw Error('3') }
        else if (!isDisjointUnionSchema(CURSOR as never)) {
          if (!Number_isSafeInteger(index)) throw Error('4')
          else {
            CURSOR = (CURSOR as Z.Union)._zod.def.options[Number_parseInt(Cmd)]
            // OUT.push(`union::${Cmd}`)
            OUT.push(symbol.union, index)
            continue
          }
        } else {
          if (tagged('union')(CURSOR)) {
            const OPTIONS = [...CURSOR._zod.def.options]
            if (!areAllObjects(OPTIONS))
              throw Error('5')
            const discriminants = intersectKeys(...OPTIONS.map((x) => x._zod.def.shape))
            if (discriminants.length > 1)
              throw Error('6')
            const [DISC] = discriminants
            const index = CURSOR._zod.def.options.findIndex(
              has(
                '_zod',
                'def',
                'shape',
                DISC,
                (x): x is never => tagged('literal')(x) && (
                  x._zod.def.values[0] === Cmd || x._zod.def.values[0] === Number_parseInt(String(Cmd))
                )
              )
            )
            CURSOR = CURSOR._zod.def.options[index]
            OUT.push(symbol.union, index)
            continue
          } else
            throw Error('7')
        }
      }
      case Number_isSafeInteger(Number_parseInt(String(Cmd))) && tagged('tuple')(CURSOR): {
        const index = Number_parseInt(String(Cmd))
        CURSOR = CURSOR._zod.def.items[index]
        // OUT.push(index)
        OUT.push(symbol.tuple, index)
        continue
      }
      case typeof Cmd === 'string' && tagged('object')(CURSOR): {
        if (!has(Cmd)(CURSOR._zod.def.shape)) throw Error('8')
        CURSOR = CURSOR._zod.def.shape[Cmd]
        // OUT.push(Cmd)
        OUT.push(symbol.object, Cmd)
        continue
      }
      case typeof Cmd === 'string' && tagged('record')(CURSOR): {
        CURSOR = CURSOR._zod.def.valueType
        // OUT.push(`${LocalDSL.recordKeyPrefix}${Cmd}`)
        OUT.push(symbol.record, Cmd)
        continue
      }
      default: {
        throw Error('9')
      }
    }
  }
  return OUT
}


export function makeLens<
  Type extends z.ZodType,
  Proxy extends Proxy.new<Type, [Type]>,
  Target,
>(
  type: Type,
  selector: (proxy: Proxy) => Target
  // @ts-ignore
): SchemaLens<z.infer<Type>, Z.infer<Target>, Target[symbol.path]>

export function makeLens<Type extends z.ZodType>(type: Type, selector: Witness) {
  const { proxy, revoke } = createProxy(type)
  const { [PATH_KEY]: path } = selector(proxy)
  return (
    revoke(),
    interpreter(type, ...path)
  )
}

// makeLens.getDSL = getDSL
// makeLens.setDSL = setDSL

export declare namespace Proxy {
  export {
    Proxy as new,
    Proxy_array as array,
    Proxy_disjointUnion as disjointUnion,
    Proxy_object as object,
    Proxy_optional as optional,
    Proxy_primitive as primitive,
    Proxy_record as record,
    Proxy_tuple as tuple,
    Proxy_union as union,
  }
}


export type Omit_<T, K extends keyof any>
  = never | [Exclude<keyof T, K>] extends [never]
  ? unknown
  : { [P in keyof T as P extends K ? never : P]: T[P] }

/**
 * TODO:
 * Make this not break with arrays
 */
export type Modify<KS extends unknown[], T, V>
  = KS extends [infer K extends keyof T] ? Omit_<T, K> & { [P in K]: V }
  : KS extends [infer K, ...infer Todo]
  ? K extends keyof T ? Omit_<T, K> & { [P in K]: Modify<Todo, T[K], V> }
  : T
  : T


// function coalesceFallback(fallback: unknown, ...path: (keyof any)[]) {
//   let Cmd: keyof any | undefined
//   let CURSOR = fallback
//   console.log('PATH BEFORE', path)
//   while ((Cmd = path.shift()) !== undefined) {
//     console.log('Cmd', Cmd)
//     console.log('CURSOR', CURSOR)
//     if (String(Cmd).startsWith(LocalDSL.unionPrefix)) {
//       const index = extractUnionIndex(Cmd) ?? -1
//       if (!has(index)(CURSOR)) {
//         if (!Array_isArray(CURSOR)) {
//           return CURSOR
//         } else {
//           console.log('\n\n\nError("154"), !has(index)(CURSOR), index: ', index, '\n\n\n')
//           console.log('\n\n\nError("154"), !has(index)(CURSOR), CURSOR: ', CURSOR, '\n\n\n')
//           return CURSOR[0]
//         }
//         // throw Error('154')
//       }
//       else CURSOR = CURSOR[index]
//     }
//     else if (`${Cmd}`.startsWith(LocalDSL.disjointPrefix)) {
//       const index = extractUnionIndex(Cmd) ?? -1
//       if (!has(index)(CURSOR)) {
//         console.log('\n\n\nError("155"), !has(index)(CURSOR), index: ', index, '\n\n\n')
//         console.log('\n\n\nError("155"), !has(index)(CURSOR), CURSOR: ', CURSOR, '\n\n\n')
//         return CURSOR
//         // throw Error('155')
//       }
//       else CURSOR = CURSOR[index]
//     }
//     else if (`${Cmd}`.startsWith(LocalDSL.recordKeyPrefix)) {
//       Cmd = `${Cmd}`.slice(LocalDSL.recordKeyPrefix.length)
//       if (!has(Cmd)(CURSOR)) throw Error('160')
//       else {
//         CURSOR = { [Cmd]: coalesceFallback(CURSOR[Cmd], ...path) }
//       }
//     }
//     else if (Cmd === LocalDSL.traverseRecord) {
//       if (!CURSOR || typeof CURSOR !== 'object') {
//         console.log('Error("156"), !has(index)(CURSOR), CURSOR: ', CURSOR)
//         throw Error('156')
//       }
//       else {
//         console.log('Cmd === LocalDSL.traverseRecord, CURSOR', CURSOR)
//         console.log('\n\nrecursive CURSOR BEFORE', CURSOR, '\n\n')
//         CURSOR = fn.map(CURSOR, (v) => coalesceFallback(v, ...path))
//         console.log('\n\nrecursive CURSOR AFTER', CURSOR, '\n\n')
//         continue
//       }
//     }
//     else if (Cmd === LocalDSL.chainOptional) continue
//     else if (Cmd === LocalDSL.coalesceOptional) continue
//     else if (Cmd === LocalDSL.traverseArray) {
//       if (!CURSOR || typeof CURSOR !== 'object') throw Error('156')
//       else {
//         console.log('Cmd === LocalDSL.traverseArray, CURSOR', CURSOR)
//         console.log('\n\nrecursive CURSOR BEFORE', CURSOR, '\n\n')
//         CURSOR = fn.map(CURSOR, (v) => coalesceFallback(v, ...path))
//         console.log('\n\nrecursive CURSOR AFTER', CURSOR, '\n\n')
//         continue
//       }
//     }
//     else if (Cmd === LocalDSL.traverseSet) {
//       if (!(CURSOR instanceof globalThis.Set)) {
//         console.log('\n\n\nError("157"), cursor: ', CURSOR, '\n\n\n')
//         return CURSOR
//         // throw Error('157')
//       }
//       throw Error('TODO: Cmd === LocalDSL.traverseSet')
//     }
//   }
//   console.log('CURSOR AFTER: ', CURSOR)
//   return CURSOR
// }

// function getFallback(startIndex: number, root: unknown, ...path: (keyof any)[]): any {
//   let rootPath = path
//   let slice = path.slice(startIndex)
//   let Cmd: keyof any | undefined
//   let CURSOR: unknown = root
//   while ((Cmd = path.shift()) !== undefined) {
//     switch (true) {
//       case Cmd === LocalDSL.identity: continue
//       case Cmd === LocalDSL.chainOptional: continue
//       case Cmd === LocalDSL.coalesceOptional: {
//         // TODO: make sure this logic makes sense
//         // console.group('\n\nCmd === LocalDSL.coalesceOptional')
//         // console.log('path', path)
//         // console.log('CURSOR', CURSOR)
//         // console.log()
//         // console.groupEnd()
//         return coalesceFallback(CURSOR, ...path)
//       }
//       case `${Cmd}`.startsWith(LocalDSL.disjointPrefix): {
//         const index = extractUnionIndex(Cmd) ?? -1
//         if (has(index)(CURSOR)) CURSOR = CURSOR[index]
//         continue
//         // // const index = Cmd.slice
//         // Cmd = `${Cmd}`.slice(LocalDSL.disjointPrefix.length)
//         // const index = Number_parseInt(Cmd.slice(0, Cmd.indexOf(':')))
//         // Cmd = Cmd.slice(Cmd.lastIndexOf(':') + 1)
//         // if (Array_isArray(CURSOR)) {
//         //   const [DISC] = intersectKeys(...CURSOR)
//         //   const found = CURSOR.find(has(DISC, (x): x is string => x === Cmd || x == Number_parseInt(`${Cmd}`)))
//         //   console.log('found', found)
//         //   CURSOR = found
//         //   continue
//         // } else {
//         //   throw Error('Error: 111')
//         // }
//       }
//       case `${Cmd}`.startsWith(LocalDSL.unionPrefix): {
//         const index = extractUnionIndex(Cmd) ?? -1
//         if (has(index)(CURSOR)) CURSOR = CURSOR[index]
//         continue
//         // Cmd = `${Cmd}`.slice(LocalDSL.unionPrefix.length)
//         // let Ix: string | number = Number_parseInt(`${Cmd}`)
//         // if (Array_isArray(CURSOR))
//         //   if (Number_isSafeInteger(Ix) && Ix in CURSOR) {
//         //     CURSOR = CURSOR[Ix]
//         //     break
//         //   } else {
//         //     // OP = `${Cmd}`.slice(LocalDSL.unionPrefix.length)
//         //     const [DISC] = intersectKeys(...CURSOR)
//         //     const found = [CURSOR.find(has(DISC, (x): x is string => x === Cmd || x == Number_parseInt(`${Cmd}`)))]
//         //     CURSOR = found
//         //     continue
//         //   } else {
//         //   continue
//         // }
//       }
//       case `${Cmd}`.startsWith(LocalDSL.recordKeyPrefix): {
//         Cmd = `${Cmd}`.slice(LocalDSL.recordKeyPrefix.length)
//         if (!(has(Cmd)(CURSOR))) throw Error('112')
//         else {
//           CURSOR = CURSOR[Cmd]
//           continue
//         }
//       }
//       case Cmd === LocalDSL.traverseSet && CURSOR instanceof globalThis.Set: {
//         if (CURSOR.size === 0) break
//         else { CURSOR = [...CURSOR.values()][0]; continue }
//       }
//       case Cmd === LocalDSL.traverseArray && Array_isArray(CURSOR): {
//         if (CURSOR.length === 0) break
//         else { CURSOR = CURSOR[0]; continue }
//       }
//       case Cmd === LocalDSL.traverseRecord && !!CURSOR && typeof CURSOR === 'object': {
//         const values = Object_values(CURSOR)
//         if (values.length === 0) break
//         else { CURSOR = values[0]; continue }
//       }
//       case has(Cmd)(CURSOR): CURSOR = CURSOR[Cmd]; continue
//       default: {
//         // console.log('getFallback default branch, Cmd: ' + Cmd)
//         // console.log('getFallback default branch, CURSOR: ', CURSOR)
//         // throw Error('getFallback default branch, Cmd: ' + Cmd)
//         // return CURSOR
//         //     throw Error
//         //       ('\
//         //                                                                       \
//         //                                                                       \
//         // [make-lenses-v4.ts]:                                                  \
//         //                                                                       \
//         // \'getFallback\' encountered a value it did not know how to interpret: \
//         //                                                                       '
//         //         + String(Cmd)
//         //         + '\
//         //                                                                       \
//         //                                                                       '
//         //       )
//         continue
//       }
//     }
//   }
//   console.log('root (before rebuilding)', root)
//   console.log('fallback (before rebuilding)', CURSOR)
//   const rebuilt = rebuildFallbackSlice(CURSOR, root, ...slice)
//   console.log('REBUILT', rebuilt)
//   return rebuilt
// }

// export function getSchemaCursor<T extends z.ZodType>(type: T, ...path: (keyof any)[]): z.ZodType
// export function getSchemaCursor<T extends z.ZodType>(type: T, ...path: (keyof any)[]) {
//   let CURSOR: unknown = type
//   let Cmd: keyof any | undefined
//   while ((Cmd = path.shift()) !== undefined) {
//     switch (true) {
//       default: return fn.exhaustive(Cmd)
//       case typeof Cmd === 'symbol': return Invariant.SymbolNotSupported(Cmd)
//       case Cmd === LocalDSL.chainOptional:
//       case Cmd == LocalDSL.coalesceOptional: {
//         if (!has('_zod', 'def', 'innerType')(CURSOR)) {
//           return Invariant.ExpectedInnerType(Cmd)
//         } else {
//           CURSOR = CURSOR._zod.def.innerType
//           continue
//         }
//       }
//       case Cmd === LocalDSL.traverseArray:
//       case Cmd === LocalDSL.traverseRecord:
//       case Cmd === LocalDSL.traverseSet: {
//         if (tagged('record')(CURSOR))
//           CURSOR = CURSOR._zod.def.valueType
//         else if (tagged('set')(CURSOR))
//           CURSOR = CURSOR._zod.def.valueType
//         else if (tagged('array')(CURSOR))
//           CURSOR = CURSOR._zod.def.element
//         else
//           return Invariant.ExpectedTraversalTarget(Cmd)
//         continue
//       }
//       case `${Cmd}`.startsWith(LocalDSL.disjointPrefix): {
//         Cmd = `${Cmd}`.slice(LocalDSL.disjointPrefix.length)
//         const index = Number_parseInt(Cmd.slice(0, Cmd.indexOf(':')))
//         Cmd = Cmd.slice(Cmd.lastIndexOf(':') + 1)
//         if (!tagged('union')(CURSOR)) return Invariant.ExpectedUnionSchema(Cmd)
//         const OPTIONS: readonly unknown[] = CURSOR._zod.def.options
//         if (!OPTIONS.every(has('_zod', 'def', 'shape')))
//           return Invariant.ExpectedObjectSchemas(Cmd)
//         else {
//           const discriminants = intersectKeys(...OPTIONS.map((opt) => opt._zod.def.shape))
//           if (discriminants.length !== 1)
//             return Invariant.ExpectedExactlyOneDiscriminant(Cmd)
//           const [DISC] = discriminants
//           const schema = OPTIONS.find(findDiscrinimant(DISC, Cmd))
//           if (!schema)
//             return Invariant.TaggedSchemaNotFound(Cmd)
//           CURSOR = schema
//           continue
//         }
//       }
//       case `${Cmd}`.startsWith(LocalDSL.unionPrefix): {
//         if (!tagged('union')(CURSOR)) return Invariant.ExpectedUnionSchema(Cmd)
//         let tag = `${Cmd}`.slice(LocalDSL.unionPrefix.length)
//         let TAG: string | number = Number_parseInt(tag)
//         const OPTIONS: readonly unknown[] = CURSOR._zod.def.options
//         if (!Number_isSafeInteger(TAG)) {
//           throw Error('113')
//         } else {
//           if (!(TAG in OPTIONS)) {
//             throw Error('114')
//           } else {
//             CURSOR = OPTIONS[TAG]
//             continue
//           }
//         }
//       }
//       case `${Cmd}`.startsWith(LocalDSL.recordKeyPrefix): {
//         Cmd = `${Cmd}`.slice(LocalDSL.recordKeyPrefix.length)
//         if (!tagged('record')(CURSOR)) throw Error('115')
//         CURSOR = CURSOR._zod.def.valueType
//         continue
//       }
//       case typeof Cmd === 'string': {
//         if (tagged('record')(CURSOR)) {
//           CURSOR = CURSOR._zod.def.valueType
//           continue
//         }
//         else if (tagged('object')(CURSOR)) {
//           if (!has('_zod', 'def', 'shape', Cmd)(CURSOR)) {
//             return Invariant.PropertyNotFound(Cmd)
//           } else {
//             CURSOR = CURSOR._zod.def.shape[Cmd]
//             continue
//           }
//         } else {
//           if (has('_zod', 'def', 'items', Cmd)(CURSOR)) {
//             CURSOR = CURSOR._zod.def.items[Cmd]
//             continue
//           } else {
//             return Invariant.PropertyNotFound(Cmd)
//           }
//         }
//       }
//       case typeof Cmd === 'number': {
//         if (has('_zod', 'def', 'items', Cmd)(CURSOR))
//           CURSOR = CURSOR._zod.def.items[Cmd]
//         else if (has('_zod', 'def', 'options', Cmd)(CURSOR))
//           CURSOR = CURSOR._zod.def.options[Cmd]
//         else
//           return Invariant.IndexNotFound(Cmd)
//         continue
//       }
//     }
//   }
//   return CURSOR
// }

// function extractUnionIndex(segment: keyof any) {
//   const Cmd = String(segment)
//   if (Cmd.startsWith(LocalDSL.unionPrefix)) {
//     const index = Number_parseInt(Cmd.slice(LocalDSL.unionPrefix.length))
//     if (!Number_isSafeInteger(index)) throw Error('120')
//     else return index
//   }
//   else if (Cmd.startsWith(LocalDSL.disjointPrefix)) {
//     const index = Number_parseInt(Cmd.slice(LocalDSL.disjointPrefix.length).slice(0, Cmd.indexOf(':')))
//     if (!Number_isSafeInteger(index)) throw Error('121')
//     else return index
//   }
//   else return null
// }

// function getUnionIndices(...path: (string | number)[]): number[] {
//   return path.map(extractUnionIndex).filter((x) => x !== null)
// }
