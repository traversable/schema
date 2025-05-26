// import type { z } from 'zod/v4'
import { z } from 'zod/v4'

import type { Key, newtype, Showable } from '@traversable/registry'
import {
  Array_isArray,
  fn,
  has,
  Number_isSafeInteger,
  Number_parseInt,
  Object_assign,
  Object_create,
  Object_hasOwn,
  Object_keys,
  Object_values,
  Profunctor,
  symbol,
} from '@traversable/registry'
import { withDefault } from './default-value.js'

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
    | { _zod: { def: { options: Z.Indexed } } }
    = { _zod: { def: { options: Z.Indexed } } }
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

function getFallback(root: unknown, ...path: string[]): any {
  let HEAD: keyof any | undefined
  let CURSOR: unknown = root
  while ((HEAD = path.shift()) !== undefined) {
    switch (true) {
      case HEAD === GlobalDSL.identity: continue
      case HEAD === GlobalDSL.chainOptional: continue
      case HEAD === GlobalDSL.coalesceOptional: continue
      case HEAD.startsWith(GlobalDSL.unionPrefix): {
        const OP = Number_parseInt(HEAD.slice(GlobalDSL.unionPrefix.length))
        if (Array_isArray(CURSOR) && Number_isSafeInteger(OP) && OP in CURSOR) {
          CURSOR = CURSOR[OP]
          break
        } else {
          continue
        }
      }
      case HEAD === GlobalDSL.traverseSet && CURSOR instanceof globalThis.Set: {
        if (CURSOR.size === 0) break
        else { CURSOR = [...CURSOR.values()][0]; continue }
      }
      case HEAD === GlobalDSL.traverseArray && Array_isArray(CURSOR): {
        if (CURSOR.length === 0) break
        else { CURSOR = CURSOR[0]; continue }
      }
      case HEAD === GlobalDSL.traverseRecord && !!CURSOR && typeof CURSOR === 'object': {
        const values = Object_values(CURSOR)
        if (values.length === 0) break
        else { CURSOR = values[0]; continue }
      }
      case has(HEAD)(CURSOR): CURSOR = CURSOR[HEAD]; continue
      default: {
        throw Error
          ('\
                                                                          \
                                                                          \
    [make-lenses-v4.ts]:                                                  \
                                                                          \
    \'getFallback\' encountered a value it did not know how to interpret: \
                                                                          '
            + String(HEAD)
            + '\
                                                                          \
                                                                          '
          )
      }
    }
  }
  return CURSOR
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
      Reflect.set(state, state.length, key)
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

const Set = {
  Identity: (op: Profunctor.Optic) => function IdentitySet(update: unknown, data: unknown) { Profunctor.set(op, update, data) },
  Iso: (op: Profunctor.Optic) => function IdentitySet(update: unknown, data: unknown) { return Profunctor.set(op, update, data) },
  Lens: (op: Profunctor.Optic) => function LensSet(update: unknown, data: unknown) { return Profunctor.set(op, update, data) },
  Traversal: (op: Profunctor.Optic) => function TraversalSet(update: unknown, data: unknown) { return Profunctor.set(op, update, data) },
  Prism: (op: Profunctor.Optic) => function PrismSet(update: unknown, data: unknown) { return Profunctor.set(op, update, data) },
}

const Modify = {
  Identity: (op: Profunctor.Optic) => function IdentityModify(fn: (x: unknown) => unknown, data: unknown) { return Profunctor.modify(op, fn, data) },
  Iso: (op: Profunctor.Optic) => function IdentityModify(fn: (x: unknown) => unknown, data: unknown) { return Profunctor.modify(op, fn, data) },
  Lens: (op: Profunctor.Optic) => function LensModify(fn: (x: unknown) => unknown, data: unknown) { return Profunctor.modify(op, fn, data) },
  Traversal: (op: Profunctor.Optic) => function TraversalModify(fn: (x: unknown) => unknown, data: unknown) { return Profunctor.modify(op, fn, data) },
  Prism: (op: Profunctor.Optic) => function PrismModify(fn: (x: any) => unknown, data: unknown) { return Profunctor.modify(op, fn, data) },
}

function intersectKeys<const T extends {}[]>(...objects: [...T]): (keyof T[number])[]
function intersectKeys<const T extends {}[]>(...objects: [...T]) {
  const [x, ...xs] = objects
  let out = Object_keys(x)
  let $: T[number] | undefined = x
  while (($ = xs.shift()) !== undefined)
    out = out.filter((k) => Object_hasOwn($, k))
  return out
}

const findDiscrinimant = <K extends string, V extends string>(tagKey: K, tagValue: V) => has(
  '_zod', 'def', 'shape', tagKey, '_zod', 'def', 'values',
  (set): set is never => Array_isArray(set) && set.includes(tagValue)
)


function interpreter<T extends z.ZodType>(type: T, ...path: string[]) {
  const rootFallback = withDefault(type)
  const fallback = getFallback(rootFallback, ...path)
  const empty = [Profunctor.id]
  let schemaCursor: unknown = type
  const optics = path.reduce(
    (acc, cmd, ix, cmds) => {
      switch (true) {
        case cmd === GlobalDSL.identity: return (acc.push(Profunctor.id), acc)
        case cmd === GlobalDSL.chainOptional: {
          if (has('_zod', 'def', 'innerType')(schemaCursor)) {
            schemaCursor = schemaCursor._zod.def.innerType
          }
          return (
            acc.push(Profunctor.when((x) => x != null)),
            acc
          )
        }
        case cmd === GlobalDSL.coalesceOptional: {
          const prev = acc[acc.length - 1]?.[symbol.tag]
          if (has('_zod', 'def', 'innerType')(schemaCursor)) {
            schemaCursor = schemaCursor._zod.def.innerType
          }
          /**
           * If we get the 'coalesceOptional' command and the previous optic was a Lens, 
           * replace it with 'Profunctor.propOr' so we can apply the default value
           */
          if (prev === 'Lens')
            acc.pop() && acc.push(Profunctor.propOr(fallback, cmds[ix - 1]))
          else
            acc.push(Profunctor.when((x) => x != null))
          return acc
        }
        case cmd === GlobalDSL.traverseSet:
        case cmd === GlobalDSL.traverseArray:
        case cmd === GlobalDSL.traverseRecord: {
          if (has('_zod', 'def', 'valueType')(schemaCursor)) { schemaCursor = schemaCursor._zod.def.valueType }
          else if (has('_zod', 'def', 'element')(schemaCursor)) { schemaCursor = schemaCursor._zod.def.element }
          return (acc.push(Profunctor.traverse), acc)
        }
        case cmd.startsWith(GlobalDSL.unionPrefix): {
          if (!has('options', Array.isArray)(schemaCursor)) throw Error('no has options')
          else if (schemaCursor.options.length === 0) {
            throw Error('TODO: union has zero elements')
          }

          const RAW = cmd.slice(GlobalDSL.unionPrefix.length)
          const OP = Number_parseInt(RAW)

          if (Number_isSafeInteger(OP)) {
            const schema = schemaCursor.options?.[OP]
            if (!schema) throw Error('could not find schema at index: ' + OP)

            const predicate = (x: unknown) => schema.safeParse(x).success
            acc.push(Profunctor.when(predicate))
            schemaCursor = schemaCursor.options[OP]
            return acc
          }

          else {
            if (!schemaCursor.options.every(has('_zod', 'def', 'shape'))) {
              throw Error('not all objects')
            }
            const tags = intersectKeys(...schemaCursor.options.map((opt) => opt._zod.def.shape))

            if (tags.length !== 1) {
              throw Error('did not have exactly 1 tag: [' + tags.join(', ') + ']')
            }

            const [tag] = tags
            const schema = schemaCursor.options.find(findDiscrinimant(tag, RAW))
            if (!schema) throw Error('could not find schema with discriminant ' + tag + ' whose value is ' + RAW)
            const predicate = (x: unknown) => (schema as any).safeParse(x).success

            acc.push(Profunctor.when(predicate))
            schemaCursor = schema
            return acc
          }


        }
        case typeof cmd === 'string': {
          if (has('_zod', 'def', 'shape', (x): x is { [x: string]: unknown } => !!x && typeof x === 'object')(schemaCursor)) {
            schemaCursor = schemaCursor._zod.def.shape[cmd]
          }
          return (acc.push(Profunctor.prop(cmd)), acc)
        }
        case typeof cmd === 'number': return (acc.push(Profunctor.prop(cmd)), acc)
        case typeof cmd === 'symbol': throw Error('Illegal state')
        default: return fn.exhaustive(cmd)
      }
    },
    empty
  )

  const optic = Profunctor.pipe(...optics)
  const tag = optic[symbol.tag]
  const get = Get[tag](optic)
  const set = Set[tag](optic)
  const modify = Modify[tag](optic)

  return {
    get,
    set,
    modify,
    type: tag,
    fallback,
  } satisfies SchemaLens<z.infer<T>, Z.infer<T>>
}

interface Proxy_object<S, T> extends newtype<{ [K in keyof S]: Proxy<S[K]> }> { [symbol.type]: T }

interface Proxy_tuple<S, T> extends newtype<{ [I in Extract<keyof S, `${number}`>]: Proxy<S[I]> }> { [symbol.type]: T }

interface Proxy_union<S, T> extends newtype<{ [I in Extract<keyof S, `${number}`> as `${GlobalDSL['unionPrefix']}${I}`]: Proxy<S[I]> }> { [symbol.type]: T }

interface Proxy_disjointUnion<S extends [keyof any, unknown], T> extends newtype<{
  [E in S as `${GlobalDSL['unionPrefix']}${Key<E[0]>}`]: { [K in keyof E[1]]: Proxy<E[1][K]> }
}> {
  [symbol.type]: T
}

interface Proxy_optional<S, T> {
  [DSL.chainOptional]: Proxy<S>
  [DSL.coalesceOptional]: Proxy<S, [withDefault<S>]>
  [symbol.type]: T
}

interface Proxy_array<S, T> {
  [DSL.traverseArray]: Proxy<S>
  [symbol.type]: T
}

type Proxy_record<S extends [any, any], T>
  = S[0] extends { enum: { [x: string | number]: string | number } }
  ? never | Proxy_finiteRecord<S, T>
  : never | Proxy_nonfiniteRecord<S, T>

interface Proxy_nonfiniteRecord<S extends [any, any], T> {
  [DSL.traverseRecord]: Proxy<S[1]>
  [symbol.type]: T
}

interface Proxy_finiteRecord<S extends [any, any], T> extends newtype<
  { [K in S[0]['enum'][keyof S[0]['enum']]]: Proxy<S[1]> }
> {
  [DSL.traverseRecord]: Proxy<S[1]>
  [symbol.type]: T
}

interface Proxy_primitive<T> { [symbol.type]: T }

interface Proxy_set<S, T> {
  [DSL.traverseSet]: Proxy<S>
  [symbol.type]: T
}

type Proxy_sumType<
  S extends [any],
  T,
  _ extends S[0] = S[0],
  K extends keyof any = keyof _[number]['_zod']['def']['shape'],
  Disc extends keyof any = _[number]['_zod']['def']['shape'][K]['_output']
> = [K] extends [never]
  ? never | Proxy.union<_, T>
  : never | Proxy.disjointUnion<
    Disc extends Disc
    ? [Disc, Extract<_[number]['_zod']['def']['shape'], Record<K, { _output: Disc }>>]
    : never,
    T
  >

type Proxy<S, T extends [any] = [S]>
  = [S] extends [Z.Object] ? Proxy_object<S['_zod']['def']['shape'], T[0]['_output']>
  : [S] extends [Z.Optional] ? Proxy_optional<S['_zod']['def']['innerType'], T[0]['_output']>
  : [S] extends [Z.Tuple] ? Proxy_tuple<S['_zod']['def']['items'], T[0]['_output']>
  : [S] extends [Z.Union] ? Proxy_sumType<[S['_zod']['def']['options']], T[0]['_output']>
  : [S] extends [Z.Array] ? Proxy_array<S['_zod']['def']['element'], T[0]['_output']>
  : [S] extends [Z.Record] ? Proxy_record<[S['keyType'], S['valueType']], T[0]['_output']>
  : [S] extends [Z.Set] ? Proxy_set<S extends z.core.$ZodSet<infer V> ? V : never, T[0]['_output']>
  : Proxy_primitive<T[0]['_output']>

export interface SchemaLens<S, A> {
  get(data: S): A
  set(focus: A, data: S): S
  modify<B>(fn: (focus: A) => B, source: S): S
  type: Profunctor.Optic.Type
  fallback: withDefault<A>
}

export function makeLens<
  Type extends z.ZodType,
  Proxy extends Proxy.new<Type>,
  Target,
  Focus = Proxy
>(
  type: Type,
  selector: (proxy: Proxy) => Target
): SchemaLens<z.infer<Type>, Z.infer<Target>>
// ): SchemaLens<z.infer<Type>, Z.infer<Target>>

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
    Proxy_sumType as sum,
    Proxy_tuple as tuple,
    Proxy_union as union,
  }
}
