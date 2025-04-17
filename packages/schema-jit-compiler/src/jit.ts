import type * as T from '@traversable/registry'
import { fn, getConfig, parseKey, typeName, URI } from '@traversable/registry'
import { t } from '@traversable/schema-core'

import type { Algebra, IR } from './functor.js'
import { fold } from './functor.js'
import * as Json from './json.js'
import { buildContext } from './shared.js'

export let MAX_WIDTH = 120

export let WeightByTypeName = {
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

export let interpreter: Algebra<string> = (x, ix) => {
  let ctx = buildContext(ix)
  let { VAR, indent } = ctx
  let { schema: $ } = getConfig()
  let NON_ARRAY_CHECK = $.treatArraysAsObjects ? '' : ` && !Array.isArray(${VAR})`
  let IS_EXACT_OPTIONAL = $.optionalTreatment === 'exactOptional'
  switch (true) {
    default: return fn.exhaustive(x)
    case x.tag === URI.never: return 'false'
    case x.tag === URI.any: return 'true'
    case x.tag === URI.unknown: return 'true'
    case x.tag === URI.void: return `${VAR} === void 0`
    case x.tag === URI.null: return `${VAR} === null`
    case x.tag === URI.undefined: return `${VAR} === undefined`
    case x.tag === URI.symbol: return `typeof ${VAR} === "symbol"`
    case x.tag === URI.boolean: return `typeof ${VAR} === "boolean"`
    case x.tag === URI.integer: {
      let CHECK = `Number.isSafeInteger(${VAR})`
      let MIN_CHECK = t.number(x.minimum) ? ` && ${x.minimum} <= ${VAR}` : ''
      let MAX_CHECK = t.number(x.maximum) ? ` && ${VAR} <= ${x.maximum}` : ''
      let OPEN = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? '(' : ''
      let CLOSE = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? ')' : ''
      return ''
        + OPEN
        + CHECK
        + MIN_CHECK
        + MAX_CHECK
        + CLOSE
    }

    case x.tag === URI.bigint: {
      let CHECK = `typeof ${VAR} === "bigint"`
      let MIN_CHECK = t.bigint(x.minimum) ? ` && ${x.minimum}n <= ${VAR}` : ''
      let MAX_CHECK = t.bigint(x.maximum) ? ` && ${VAR} <= ${x.maximum}n` : ''
      let OPEN = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? '(' : ''
      let CLOSE = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? ')' : ''
      return ''
        + OPEN
        + CHECK
        + MIN_CHECK
        + MAX_CHECK
        + CLOSE
    }

    case x.tag === URI.number: {
      let CHECK = `Number.isFinite(${VAR})`
      let MIN_CHECK = t.number(x.exclusiveMinimum)
        ? ` && ${x.exclusiveMinimum} < ${VAR}`
        : t.number(x.minimum) ? ` && ${x.minimum} <= ${VAR}` : ''
      let MAX_CHECK = t.number(x.exclusiveMaximum)
        ? ` && ${VAR} < ${x.exclusiveMaximum}`
        : t.number(x.maximum) ? ` && ${VAR} <= ${x.maximum}` : ''
      let OPEN = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? '(' : ''
      let CLOSE = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? ')' : ''
      return ''
        + OPEN
        + CHECK
        + MIN_CHECK
        + MAX_CHECK
        + CLOSE
    }

    case x.tag === URI.string: {
      let CHECK = `typeof ${VAR} === "string"`
      let MIN_CHECK = t.number(x.minLength) ? ` && ${x.minLength} <= ${VAR}.length` : ''
      let MAX_CHECK = t.number(x.maxLength) ? ` && ${VAR}.length <= ${x.maxLength}` : ''
      let OPEN = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? '(' : ''
      let CLOSE = MIN_CHECK.length > 0 || MAX_CHECK.length > 0 ? ')' : ''
      return ''
        + OPEN
        + CHECK
        + MIN_CHECK
        + MAX_CHECK
        + CLOSE
    }

    case x.tag === URI.eq: {
      return Json.generate(
        x.def, {
        ...ix,
        varName: VAR,
        offset: ix.offset + 2,
      })
    }

    case x.tag === URI.optional: {
      if (IS_EXACT_OPTIONAL) return x.def
      else {
        let CHECK = `${VAR} === undefined`
        let WIDTH = ix.offset + CHECK.length + ' || '.length + x.def.length
        let SINGLE_LINE = WIDTH < MAX_WIDTH
        let OPEN = SINGLE_LINE ? '(' : ('(' + indent(2))
        let CLOSE = SINGLE_LINE ? ')' : (indent(0) + ')')
        let BODY = SINGLE_LINE ? (CHECK + ' || ' + x.def) : (CHECK + indent(2) + '|| ' + x.def)
        return ''
          + OPEN
          + BODY
          + CLOSE
      }
    }

    case x.tag === URI.array: {
      let MIN_CHECK = t.number(x.minLength) ? `&& ${x.minLength} < ${VAR}.length` : ''
      let MAX_CHECK = t.number(x.maxLength) ? `&& ${VAR}.length < ${x.maxLength}` : ''
      let OUTER_CHECK = `Array.isArray(${VAR})${MIN_CHECK}${MAX_CHECK} && `
      let INNER_CHECK = `${VAR}.every((value) => `
      let WIDTH = ix.offset + OUTER_CHECK.length + INNER_CHECK.length + x.def.length
      let SINGLE_LINE = WIDTH < MAX_WIDTH
      let OPEN = SINGLE_LINE ? '' : indent(4)
      let CLOSE = SINGLE_LINE ? ')' : (indent(2) + ')')
      return ''
        + OUTER_CHECK
        + INNER_CHECK
        + OPEN
        + x.def
        + CLOSE
    }

    case x.tag === URI.record: {
      let OUTER_CHECK = ''
        + `!!${VAR} && typeof ${VAR} === "object"${NON_ARRAY_CHECK} ${indent(2)}&& `
        + `!(${VAR} instanceof Date) && !(${VAR} instanceof Uint8Array) ${indent(2)}&& `
      let INNER_CHECK = `Object.entries(${VAR}).every(([key, value]) => `
      let KEY_CHECK = 'typeof key === "string" && '
      let WIDTH = ix.offset + OUTER_CHECK.length + INNER_CHECK.length + x.def.length
      let SINGLE_LINE = WIDTH < MAX_WIDTH
      let OPEN = SINGLE_LINE ? KEY_CHECK : (indent(4) + KEY_CHECK)
      let CLOSE = SINGLE_LINE ? ')' : (indent(2) + ')')
      return ''
        + OUTER_CHECK
        + INNER_CHECK
        + OPEN
        + x.def
        + CLOSE
    }

    case x.tag === URI.union: {
      let CHILD_COUNT = x.def.length
      let WIDTH = ix.offset + x.def.join(' || ').length
      let SINGLE_LINE = WIDTH < MAX_WIDTH
      let OPEN = SINGLE_LINE || ix.isRoot ? '(' : ('(' + indent(2))
      let CLOSE = SINGLE_LINE || ix.isRoot ? ')' : (indent(0) + ')')
      let BODY = CHILD_COUNT === 0 ? 'false'
        : SINGLE_LINE ? x.def.map((v) => '(' + v + ')').join(' || ')
          : x.def.map((v) => '(' + v + ')').join(indent(2) + '|| ')
      return ''
        + OPEN
        + BODY
        + CLOSE
    }

    case x.tag === URI.intersect: {
      let CHILD_COUNT = x.def.length
      let WIDTH = ix.offset + x.def.join(' || ').length
      let SINGLE_LINE = WIDTH < MAX_WIDTH
      let OPEN = SINGLE_LINE || ix.isRoot ? '(' : ('(' + indent(2))
      let CLOSE = SINGLE_LINE || ix.isRoot ? ')' : (indent(0) + ')')
      let BODY = CHILD_COUNT === 0 ? 'true'
        : SINGLE_LINE ? x.def.join(' && ')
          : x.def.join(indent(2) + '&& ')
      return ''
        + OPEN
        + BODY
        + CLOSE
    }

    case x.tag === URI.tuple: {
      let CHILD_COUNT = x.def.length
      let CHECK = `Array.isArray(${VAR}) && ${VAR}.length === ${CHILD_COUNT}`
      let WIDTH = ix.offset + CHECK.length + x.def.join(' && ').length
      let SINGLE_LINE = WIDTH < MAX_WIDTH
      let JOIN = SINGLE_LINE ? '' : indent(2)
      let BODY = CHILD_COUNT === 0 ? '' : x.def.map((v) => JOIN + (SINGLE_LINE ? ' && ' : '&& ') + v).join('')
      return CHECK + BODY
    }

    case x.tag === URI.object: {
      let CHILD_COUNT = x.def.length
      let CHECK = `!!${VAR} && typeof ${VAR} === "object"${NON_ARRAY_CHECK}`
      let OPTIONAL_KEYS = Array.of<string>().concat(x.opt)
      let CHILDREN = x.def.map(
        ([k, v]) => IS_EXACT_OPTIONAL && OPTIONAL_KEYS.includes(k)
          ? `(!Object.hasOwn(${VAR}, "${parseKey(k)}") || ${v})`
          : v
      )
      let WIDTH = ix.offset + CHECK.length + CHILDREN.join(' && ').length
      let SINGLE_LINE = WIDTH < MAX_WIDTH
      let JOIN = SINGLE_LINE ? '' : indent(2)
      let BODY = CHILD_COUNT === 0 ? '' : CHILDREN.map((v) => JOIN + (SINGLE_LINE ? ' && ' : '&& ') + v).join('')
      return CHECK + BODY
    }
  }
}

let weightComparator: T.Comparator<IR> = (l, r) => {
  let lw = getWeight(l)
  let rw = getWeight(r)
  return lw < rw ? -1 : rw < lw ? +1 : 0
}

let aggregateWeights
  : (acc: number, curr: t.Schema) => number
  = (acc, curr) => Math.max(acc, getWeight(curr))

function getWeight(x: IR<t.Schema>): number
function getWeight(x: t.Schema): number
function getWeight(x: IR<t.Schema>): number {
  let w = WeightByTypeName[typeName(x)]
  switch (true) {
    default: return fn.exhaustive(x)
    case t.isNullary(x): return w
    case t.isBoundable(x): return w
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

/**
 * Binding the element's index to the element itself is a hack to make sure
 * we preserve the original order of the tuple, even while sorting
 */
let bindPreSortIndices: <T>(x: T[]) => T[] = (x) => {
  for (let ix = 0, len = x.length; ix < len; ix++)
    (x[ix] as any).preSortIndex = ix
  return x
}

export let sort: (schema: t.Schema) => IR = fn.flow(
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

  let SINGLE_LINE = BODY.length < MAX_WIDTH
  let OPEN = SINGLE_LINE ? '' : `(\r${' '.repeat(4)}`
  let CLOSE = SINGLE_LINE ? '' : `\r${' '.repeat(2)})`

  return ''
    + OPEN
    + BODY
    + CLOSE
}


export let generate = (schema: t.Schema): string => `

function check(value) {
  return ${buildFunctionBody(schema)}
}

`.trim()


export let generateParser = (schema: t.Schema): string => `

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
