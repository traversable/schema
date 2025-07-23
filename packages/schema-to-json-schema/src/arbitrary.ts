import { fc } from '@fast-check/vitest'
import { PATTERN } from '@traversable/registry'
import type * as Spec from '@traversable/schema-to-json-schema/specification'
import type { JsonSchema } from '@traversable/schema-to-json-schema'

const identifier = fc.stringMatching(new RegExp(PATTERN.identifier, 'u'))

export function withPartialKeysOf<T extends Record<never, unknown>>(
  model: fc.Arbitrary<T>,
  keyCount: number,
) {
  return fc.tuple(
    model,
    fc.array(fc.boolean(), { minLength: keyCount, maxLength: keyCount }),
  ).map(([object, indices]) => {
    const keys = Object.keys(object)
    const out = Array.of<string>()
    for (let ix = 0, len = keys.length; ix < len; ix++)
      if (indices[ix]) out.push(keys[ix])
    return [object, out] satisfies [any, any]
  })
}

const defaultObjectConstraints = {
  keyCount: 10,
} satisfies Builder.Constraints['object']

export const defaults = {
  object: defaultObjectConstraints
} satisfies Required<Builder.Constraints>

const boolean = fc.record({ type: fc.constant('boolean' as const) }) satisfies fc.Arbitrary<Builder['boolean']>
const integer = fc.record({ type: fc.constant('integer' as const) }) satisfies fc.Arbitrary<Builder['integer']>
const number = fc.record({ type: fc.constant('number' as const) }) satisfies fc.Arbitrary<Builder['number']>
const string = fc.record({ type: fc.constant('string' as const) }) satisfies fc.Arbitrary<Builder['string']>

export function tuple(cont: fc.LetrecTypedTie<Builder>): fc.Arbitrary<Builder['tuple']> {
  return fc.record({
    type: fc.constant('array' as const),
    items: fc.array(cont('tree')),
    additionalItems: fc.constant(false as const),
  }).map(
    (node) => ({
      ...node,
      minItems: node.items.length,
      maxItems: node.items.length,
    }) satisfies Builder['tuple']
  )
}

export function object(cont: fc.LetrecTypedTie<Builder>, constraints?: Builder.Constraints['object']): fc.Arbitrary<Builder['object']>
export function object(
  cont: fc.LetrecTypedTie<Builder>,
  { keyCount, ...constraints }: Builder.Constraints['object'] = defaults.object
): fc.Arbitrary<Builder['object']> {
  return fc.record({
    type: fc.constant('object' as const),
    properties: withPartialKeysOf(
      fc.dictionary(identifier, cont('tree'), constraints),
      keyCount ?? defaults.object.keyCount
    ),
  }).map(
    ({ properties: [properties, required], ...node }) => ({
      ...node,
      properties,
      required,
    }) satisfies Builder['object']
  )
}

export function array(cont: fc.LetrecTypedTie<Builder>): fc.Arbitrary<Builder['array']> {
  return fc.record({
    type: fc.constant('array' as const),
    items: cont('tree'),
  }) satisfies fc.Arbitrary<Builder['array']>
}

export function record(cont: fc.LetrecTypedTie<Builder>): fc.Arbitrary<Builder['record']> {
  return fc.record({
    type: fc.constant('object' as const),
    additionalProperties: cont('tree'),
  })
}

export function union(cont: fc.LetrecTypedTie<Builder>): fc.Arbitrary<Builder['union']> {
  return fc.record({
    anyOf: fc.array(cont('tree')),
  })
}

export function intersect(cont: fc.LetrecTypedTie<Builder>): fc.Arbitrary<Builder['intersect']> {
  return fc.record({
    allOf: fc.array(cont('tree')),
  })
}

export type Arbitraries<K extends keyof BuilderNodes = keyof BuilderNodes> = { [P in K]: fc.Arbitrary<BuilderNodes[P]> }

export type ObjectConstraints = Omit<fc.DictionaryConstraints, 'minKeys' | 'maxKeys'> & { keyCount?: number }

export interface BuilderNodes {
  boolean: Spec.boolean
  integer: Spec.integer
  number: Spec.number
  string: Spec.string
  array: Spec.array<JsonSchema>
  record: Spec.record<JsonSchema>
  tuple: Spec.tuple<JsonSchema[]>
  union: Spec.union<JsonSchema[]>
  intersect: Spec.intersect<JsonSchema[]>
  object: Spec.object<{ [x: string]: JsonSchema }>
}

export interface Builder extends BuilderNodes { tree: BuilderNodes[keyof BuilderNodes] }
export declare namespace Builder { type Constraints = { object?: ObjectConstraints } }

export function Builder(constraints?: Builder.Constraints):
  (cont: fc.LetrecTypedTie<Builder>) => { [K in keyof Builder]: fc.Arbitrary<Builder[K]> }

export function Builder<T extends Partial<Arbitraries>>(constraints: Builder.Constraints, arbitraries: T):
  (cont: fc.LetrecTypedTie<Builder>) => { [K in keyof Builder]: fc.Arbitrary<K extends keyof T ? T[K] : Builder[K]> }

export function Builder(constraints: Builder.Constraints = defaults, arbitraries?: Partial<Arbitraries>) {
  return (cont: fc.LetrecTypedTie<Builder>): { [K in keyof Builder]: fc.Arbitrary<Builder[K]> } => ({
    boolean,
    integer,
    number,
    string,
    array: array(cont),
    record: record(cont),
    tuple: tuple(cont),
    union: union(cont),
    intersect: intersect(cont),
    object: object(cont, constraints.object),
    ...arbitraries,
    tree: fc.oneof(
      cont('boolean'),
      cont('integer'),
      cont('number'),
      cont('string'),
      cont('array'),
      cont('record'),
      cont('tuple'),
      cont('object'),
    )
  })
}

export const any
  : (constraints?: Builder.Constraints) => fc.Arbitrary<JsonSchema>
  = (constraints) => fc.letrec(Builder(constraints)).tree
