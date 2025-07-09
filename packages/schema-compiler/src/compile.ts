import type * as T from '@traversable/registry'
import { fn, getConfig, Object_values, parseKey, typeName, URI } from '@traversable/registry'
import { t } from '@traversable/schema'

import type { Algebra } from './functor.js'
import { fold } from './functor.js'
import * as Json from './json.js'
import type { IR } from './shared.js'
import { bindPreSortIndices, buildContext } from './shared.js'

export const MAX_WIDTH = 120

export const WeightByTypeName = {
  never: 0,
  any: 10,
  unknown: 20,
  void: 30,
  undefined: 40,
  null: 50,
  symbol: 60,
  boolean: 70,
  integer: 80,
  bigint: 90,
  number: 100,
  string: 110,
  optional: 120,
  intersect: 130,
  union: 140,
  tuple: 150,
  object: 160,
  array: 170,
  record: 180,
  eq: 190,
} as const

const enumMemberToString = (x: T.Primitive) =>
  typeof x === 'string' ? `"${x}"`
    : typeof x === 'bigint' ? `${x}n`
      : typeof x === 'symbol' ? `Symbol.for("${(x as symbol).description}")`
        : `${x}`

export const interpreter: Algebra<string> = (x, ix) => {
  const ctx = buildContext(ix)
  const { VAR, indent } = ctx
  const { schema: $ } = getConfig()
  const NON_ARRAY_CHECK = $.treatArraysAsObjects ? '' : ` && !Array.isArray(${VAR})`
  const IS_EXACT_OPTIONAL = $.optionalTreatment === 'exactOptional'
  switch (true) {
    default: return fn.exhaustive(x)
    case x.tag === URI.eq: return Json.generate(x.def, { ...ix, varName: VAR, offset: ix.offset + 2 })
    case x.tag === URI.never: return 'false'
    case x.tag === URI.any: return 'true'
    case x.tag === URI.unknown: return 'true'
    case x.tag === URI.void: return `${VAR} === void 0`
    case x.tag === URI.null: return `${VAR} === null`
    case x.tag === URI.undefined: return `${VAR} === undefined`
    case x.tag === URI.symbol: return `typeof ${VAR} === "symbol"`
    case x.tag === URI.boolean: return `typeof ${VAR} === "boolean"`
    case x.tag === URI.integer: {
      const CHECK = `Number.isSafeInteger(${VAR})`
      const MIN_CHECK = t.number(x.minimum) ? ` && ${x.minimum} <= ${VAR}` : ''
      const MAX_CHECK = t.number(x.maximum) ? ` && ${VAR} <= ${x.maximum}` : ''
      const OPEN = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? '(' : ''
      const CLOSE = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? ')' : ''
      return ''
        + OPEN
        + CHECK
        + MIN_CHECK
        + MAX_CHECK
        + CLOSE
    }

    case x.tag === URI.bigint: {
      const CHECK = `typeof ${VAR} === "bigint"`
      const MIN_CHECK = t.bigint(x.minimum) ? ` && ${x.minimum}n <= ${VAR}` : ''
      const MAX_CHECK = t.bigint(x.maximum) ? ` && ${VAR} <= ${x.maximum}n` : ''
      const OPEN = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? '(' : ''
      const CLOSE = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? ')' : ''
      return ''
        + OPEN
        + CHECK
        + MIN_CHECK
        + MAX_CHECK
        + CLOSE
    }

    case x.tag === URI.number: {
      const CHECK = `Number.isFinite(${VAR})`
      const MIN_CHECK = t.number(x.exclusiveMinimum) ? ` && ${x.exclusiveMinimum} < ${VAR}`
        : t.number(x.minimum) ? ` && ${x.minimum} <= ${VAR}` : ''
      const MAX_CHECK = t.number(x.exclusiveMaximum) ? ` && ${VAR} < ${x.exclusiveMaximum}`
        : t.number(x.maximum) ? ` && ${VAR} <= ${x.maximum}` : ''
      const OPEN = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? '(' : ''
      const CLOSE = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? ')' : ''
      return ''
        + OPEN
        + CHECK
        + MIN_CHECK
        + MAX_CHECK
        + CLOSE
    }

    case x.tag === URI.string: {
      const CHECK = `typeof ${VAR} === "string"`
      const MIN_CHECK = t.number(x.minLength) ? ` && ${x.minLength} <= ${VAR}.length` : ''
      const MAX_CHECK = t.number(x.maxLength) ? ` && ${VAR}.length <= ${x.maxLength}` : ''
      const OPEN = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? '(' : ''
      const CLOSE = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? ')' : ''
      return ''
        + OPEN
        + CHECK
        + MIN_CHECK
        + MAX_CHECK
        + CLOSE
    }

    case x.tag === URI.enum as never: {
      const members = (Object_values(x.def) as string[]).map(enumMemberToString)
      const OPEN = x.def.length === 0 || x.def.length === 1 ? '' : '('
      const CLOSE = x.def.length === 0 || x.def.length === 1 ? '' : ')'
      return OPEN + members.map((m) => `${VAR} === ${m}`).join(' || ') + CLOSE
    }

    case x.tag === URI.optional: {
      if (IS_EXACT_OPTIONAL) return x.def
      else {
        const CHECK = `${VAR} === undefined`
        const WIDTH = ix.offset + CHECK.length + ' || '.length + x.def.length
        const SINGLE_LINE = WIDTH < MAX_WIDTH
        const OPEN = SINGLE_LINE ? '(' : ('(' + indent(2))
        const CLOSE = SINGLE_LINE ? ')' : (indent(0) + ')')
        const BODY = SINGLE_LINE ? (CHECK + ' || ' + x.def) : (CHECK + indent(2) + '|| ' + x.def)
        return ''
          + OPEN
          + BODY
          + CLOSE
      }
    }

    case x.tag === URI.array: {
      const MIN_CHECK = t.number(x.minLength) ? `&& ${x.minLength} < ${VAR}.length` : ''
      const MAX_CHECK = t.number(x.maxLength) ? `&& ${VAR}.length < ${x.maxLength}` : ''
      const OUTER_CHECK = `Array.isArray(${VAR})${MIN_CHECK}${MAX_CHECK} && `
      const INNER_CHECK = `${VAR}.every((value) => `
      const WIDTH = ix.offset + OUTER_CHECK.length + INNER_CHECK.length + x.def.length
      const SINGLE_LINE = WIDTH < MAX_WIDTH
      const OPEN = SINGLE_LINE ? '' : indent(4)
      const CLOSE = SINGLE_LINE ? ')' : (indent(2) + ')')
      return ''
        + OUTER_CHECK
        + INNER_CHECK
        + OPEN
        + x.def
        + CLOSE
    }

    case x.tag === URI.record: {
      const OUTER_CHECK = ''
        + `!!${VAR} && typeof ${VAR} === "object"${NON_ARRAY_CHECK} ${indent(2)}&& `
        + `!(${VAR} instanceof Date) && !(${VAR} instanceof Uint8Array) ${indent(2)}&& `
      const INNER_CHECK = `Object.entries(${VAR}).every(([key, value]) => `
      const KEY_CHECK = 'typeof key === "string" && '
      const WIDTH = ix.offset + OUTER_CHECK.length + INNER_CHECK.length + x.def.length
      const SINGLE_LINE = WIDTH < MAX_WIDTH
      const OPEN = SINGLE_LINE ? KEY_CHECK : (indent(4) + KEY_CHECK)
      const CLOSE = SINGLE_LINE ? ')' : (indent(2) + ')')
      return ''
        + OUTER_CHECK
        + INNER_CHECK
        + OPEN
        + x.def
        + CLOSE
    }

    case x.tag === URI.union: {
      const CHILD_COUNT = x.def.length
      const WIDTH = ix.offset + x.def.join(' || ').length
      const SINGLE_LINE = WIDTH < MAX_WIDTH
      const OPEN = SINGLE_LINE || ix.isRoot ? '(' : ('(' + indent(2))
      const CLOSE = SINGLE_LINE || ix.isRoot ? ')' : (indent(0) + ')')
      const BODY = CHILD_COUNT === 0 ? 'false'
        : SINGLE_LINE ? x.def.map((v) => '(' + v + ')').join(' || ')
          : x.def.map((v) => '(' + v + ')').join(indent(2) + '|| ')
      return ''
        + OPEN
        + BODY
        + CLOSE
    }

    case x.tag === URI.intersect: {
      const CHILD_COUNT = x.def.length
      const WIDTH = ix.offset + x.def.join(' || ').length
      const SINGLE_LINE = WIDTH < MAX_WIDTH
      const OPEN = SINGLE_LINE || ix.isRoot ? '(' : ('(' + indent(2))
      const CLOSE = SINGLE_LINE || ix.isRoot ? ')' : (indent(0) + ')')
      const BODY = CHILD_COUNT === 0 ? 'true'
        : SINGLE_LINE ? x.def.join(' && ')
          : x.def.join(indent(2) + '&& ')
      return ''
        + OPEN
        + BODY
        + CLOSE
    }

    case x.tag === URI.tuple: {
      const CHILD_COUNT = x.def.length
      const VALID_LENGTHS = x.opt === -1 ? [x.def.length] : Array.from({ length: x.def.length - x.opt + 1 }, (_, i) => i + x.opt)
      const CHECK_LENGTH_OPEN = VALID_LENGTHS.length === 1 || x.def.length === 1 ? '' : '('
      const CHECK_LENGTH_CLOSE = VALID_LENGTHS.length === 1 || x.def.length === 1 ? '' : ')'
      const CHECK_LENGTH = ` && ${CHECK_LENGTH_OPEN}${VALID_LENGTHS.map(
        (len) => `${VAR}.length === ${len}`).join(' || ')
        }${CHECK_LENGTH_CLOSE}`
      const CHECK = `Array.isArray(${VAR})${CHECK_LENGTH}`
      const WIDTH = ix.offset + CHECK.length + x.def.join(' && ').length
      const SINGLE_LINE = WIDTH < MAX_WIDTH
      const JOIN = SINGLE_LINE ? '' : indent(2)
      const BODY = CHILD_COUNT === 0 ? '' : x.def.map((v) => JOIN + (SINGLE_LINE ? ' && ' : '&& ') + v).join('')
      return CHECK + BODY
    }

    case x.tag === URI.object: {
      const CHILD_COUNT = x.def.length
      const CHECK = `!!${VAR} && typeof ${VAR} === "object"${NON_ARRAY_CHECK}`
      const OPTIONAL_KEYS = Array.of<string>().concat(x.opt)
      const CHILDREN = x.def.map(
        ([k, v]) => IS_EXACT_OPTIONAL && OPTIONAL_KEYS.includes(k)
          ? `(!Object.hasOwn(${VAR}, "${parseKey(k)}") || ${v})`
          : v
      )
      const WIDTH = ix.offset + CHECK.length + CHILDREN.join(' && ').length
      const SINGLE_LINE = WIDTH < MAX_WIDTH
      const JOIN = SINGLE_LINE ? '' : indent(2)
      const BODY = CHILD_COUNT === 0 ? '' : CHILDREN.map((v) => JOIN + (SINGLE_LINE ? ' && ' : '&& ') + v).join('')
      return CHECK + BODY
    }
  }
}

const weightComparator: T.Comparator<IR> = (l, r) => {
  const lw = getWeight(l)
  const rw = getWeight(r)
  return lw < rw ? -1 : rw < lw ? +1 : 0
}

const aggregateWeights
  : (acc: number, curr: t.Schema) => number
  = (acc, curr) => Math.max(acc, getWeight(curr))

function getWeight(x: IR<t.Schema>): number
function getWeight(x: t.Schema): number
function getWeight(_: IR<t.Schema> | t.Schema): number {
  const x = _ as IR<t.Schema>
  const w = WeightByTypeName[typeName(x)]
  switch (true) {
    default: return fn.exhaustive(x)
    case t.isNullary(x): return w
    case t.isBoundable(x): return w
    // TODO: re-think weights
    case x.tag === URI.enum as never: return w + (x.def.length * 10)
    case x.tag === URI.eq: return w
    case x.tag === URI.optional: return w + getWeight(x.def)
    case x.tag === URI.array: return w + getWeight(x.def)
    case x.tag === URI.record: return w + getWeight(x.def)
    case x.tag === URI.union: return w + x.def.reduce(aggregateWeights, 0)
    case x.tag === URI.intersect: return w + x.def.reduce(aggregateWeights, 0)
    case x.tag === URI.tuple: return w + x.def.reduce(aggregateWeights, 0)
    case x.tag === URI.object: return w + x.def.map(([, v]) => v).reduce(aggregateWeights, 0)
  }
}

export const sort: (schema: t.Schema) => IR = fn.flow(
  t.fold<IR>((x) =>
    x.tag !== URI.object ? x
      : t.object.def(
        Object.entries(x.def),
        undefined,
        Array.of<string>().concat(x.opt),
      )
  ),
  fold((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case t.isNullary(x): return x
      case t.isBoundable(x): return x
      case x.tag === URI.enum as never: return x
      case x.tag === URI.eq: return x
      case x.tag === URI.optional: return t.optional.def(x.def)
      case x.tag === URI.array: return t.array.def(x.def)
      case x.tag === URI.record: return t.record.def(x.def)
      case x.tag === URI.union: return t.union.def(x.def.sort(weightComparator))
      case x.tag === URI.intersect: return t.intersect.def([...x.def].sort(weightComparator))
      case x.tag === URI.tuple: return t.tuple.def(bindPreSortIndices(x.def).sort(weightComparator))
      case x.tag === URI.object: return t.object.def(
        x.def.sort(([, l], [, r]) => weightComparator(l, r)),
        undefined,
        x.opt,
      )
    }
  }),
)

export function buildFunctionBody(schema: t.Schema): string {
  let BODY = fn.pipe(
    sort(schema),
    fold(interpreter),
  ).trim()

  if (BODY.startsWith('(') && BODY.endsWith(')'))
    void (BODY = BODY.slice(1, -1))

  const SINGLE_LINE = BODY.length < MAX_WIDTH
  const OPEN = SINGLE_LINE ? '' : `(\r\n${' '.repeat(4)}`
  const CLOSE = SINGLE_LINE ? '' : `\r\n${' '.repeat(2)})`

  return ''
    + OPEN
    + BODY
    + CLOSE
}


export const generate = (schema: t.Schema): string => `

function check(value) {
  return ${buildFunctionBody(schema)}
}

`.trim()


export const generateParser = (schema: t.Schema): string => `

function check(value) {
  return ${buildFunctionBody(schema)}
}
if (check(value)) return value
else throw Error("invalid input")

`.trim()


export function compile<S extends t.Schema>(schema: S): ((x: S['_type'] | T.Unknown) => x is S['_type'])
export function compile(schema: t.Schema): Function {
  return globalThis.Function(
    'value',
    'return ' + buildFunctionBody(schema)
  )
}


export function compileParser<S extends t.Schema>(schema: S): ((x: S['_type'] | T.Unknown) => S['_type'])
export function compileParser(schema: t.Schema): Function {
  return globalThis.Function(
    'value',
    'return' + `

function check(value) {
  return ${buildFunctionBody(schema)}
}
if (check(value)) return value
else throw Error("invalid input")

`
      .trim()
  )
}
