import type * as T from '@traversable/registry'
import { escape, fn, getConfig, parseKey, URI } from '@traversable/registry'
import { t } from '@traversable/schema-core'

import * as Weighted from './sort.js'
import * as Json from './json.js'
import type { Index } from './functor.js'

export type Context = {
  VAR: string
  RETURN: string
  TABSTOP: string
  JOIN: string
  indent(numberOfSpaces: number): string
  dedent(numberOfSpaces: number): string
  join(numberOfSpaces: number): string
}

export let MAX_WIDTH = 120

export function buildContext(ix: T.Require<Index, 'offset' | 'varName'>): Context {
  let VAR = ix.varName
  let indent = (numberOfSpaces: number) => `\r${' '.repeat(Math.max(ix.offset + numberOfSpaces, 0))}`
  let dedent = (numberOfSpaces: number) => `\r${' '.repeat(Math.max(ix.offset - numberOfSpaces, 0))}`
  let join = (numberOfSpaces: number) => indent(numberOfSpaces) + '&& '
  let JOIN = join(2)
  let RETURN = indent(2)
  let TABSTOP = indent(4)
  return { dedent, indent, join, JOIN, RETURN, TABSTOP, VAR }
}

export namespace Jit {
  export declare namespace checkJson {
    type ReturnTypeLowerBound = {
      tag: URI.bottom | URI.array | URI.object
      def: unknown
    }
  }

  export function checkJson(x: Json.IR<Json.IR<string>>, ix: Json.Index): Json.IR<string>
  export function checkJson(x: Json.IR<Json.IR<string>>, ix: Json.Index): checkJson.ReturnTypeLowerBound {
    let { VAR, join } = buildContext(ix)
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.bottom: {
        let BODY = VAR + ' === '
        switch (true) {
          default: return fn.exhaustive(x.def)
          case x.def === null: BODY += 'null'; break
          case x.def === undefined: BODY += 'undefined'; break
          case x.def === true: BODY += 'true'; break
          case x.def === false: BODY += 'false'; break
          case x.def === 0: BODY += 1 / x.def === Number.NEGATIVE_INFINITY ? '-0' : '+0'; break
          case typeof x.def === 'string': BODY += `"${escape(x.def)}"`; break
          case typeof x.def === 'number': BODY += String(x.def); break
        }
        return {
          tag: URI.bottom,
          def: BODY,
        }
      }

      case x.tag === URI.array: return {
        tag: URI.array,
        def: ''
          + `Array.isArray(${VAR}) && `
          + `${VAR}.length === ${x.def.length}`
          + (x.def.length === 0 ? '' : x.def.map((v, i) => i === 0 ? join(0) + v.def : v.def).join(join(0))),
      }

      case x.tag === URI.object: return {
        tag: URI.object,
        def: ''
          + `!!${VAR} && typeof ${VAR} === "object" && !Array.isArray(${VAR})`
          + (x.def.length === 0 ? '' : x.def.map(([, v], i) => i === 0 ? join(0) + v.def : v.def).join(join(0))),
      }
    }
  }

  export let check: Weighted.Algebra<string> = (x, ix) => {
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
        let MIN_CHECK = t.number(x.exclusiveMinimum) ? ` && ${x.exclusiveMinimum} < ${VAR}` : t.number(x.minimum) ? ` && ${x.minimum} <= ${VAR}` : ''
        let MAX_CHECK = t.number(x.exclusiveMaximum) ? ` && ${VAR} < ${x.exclusiveMaximum}` : t.number(x.maximum) ? ` && ${VAR} <= ${x.maximum}` : ''
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
        return jitJson(
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
        // let OUTER_OPEN = SINGLE_LINE ? '' : indent(2)
        // let OUTER_CLOSE = SINGLE_LINE ? '' : indent(0)
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

        // let OPEN = CHILD_COUNT < 2 ? '' : SINGLE_LINE ? '(' : ('(' + indent(2))
        // let CLOSE = CHILD_COUNT < 2 ? '' : SINGLE_LINE ? ')' : (indent(0) + ')')
        // let OPEN = CHILD_COUNT < 2 ? '' : '('
        // let CLOSE = CHILD_COUNT < 2 ? '' : ')'

        let OPEN = SINGLE_LINE || ix.isRoot ? '(' : ('(' + indent(2))
        let CLOSE = SINGLE_LINE || ix.isRoot ? ')' : (indent(0) + ')')

        let BODY = CHILD_COUNT === 0 ? 'true'
          : SINGLE_LINE ? x.def.join(' && ')
            : x.def.join(indent(2) + '&& ')

        // : SINGLE_LINE ? x.def.join(' && ') 
        // : x.def.join(indent(2) + '&& ')

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
        // let OPEN = SINGLE_LINE ? '' : ('(' + indent(2))
        // let CLOSE = SINGLE_LINE ? '' : (indent(0) + ')')

        let JOIN = SINGLE_LINE ? '' : indent(2)
        let CHILDREN = CHILD_COUNT === 0 ? '' : x.def.map((v) => JOIN + (SINGLE_LINE ? ' && ' : '&& ') + v).join('')
        return ''
          // + OPEN
          + CHECK
          + CHILDREN
        // + CLOSE
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
        // let OPEN = SINGLE_LINE ? '' : ('(' + indent(2))
        // let CLOSE = SINGLE_LINE ? '' : (indent(0) + ')')
        let JOIN = SINGLE_LINE ? '' : indent(2)
        let BODY = CHILD_COUNT === 0 ? '' : CHILDREN.map((v) => JOIN + (SINGLE_LINE ? ' && ' : '&& ') + v).join('')

        return ''
          // + OPEN
          + CHECK
          + BODY
        // + CLOSE

        // + `!!${VAR} && typeof ${VAR} === "object"${NON_ARRAY_CHECK}`
        // + (x.def.length === 0 ? '' : JOIN + x.def.map(
        //   ([k, v]) => IS_EXACT_OPTIONAL && OPTIONAL_KEYS.includes(k)
        //     ? `(!Object.hasOwn(${VAR}, "${parseKey(k)}") || ${v})`
        //     : v
        // ).join(JOIN))
      }
    }
  }


}

export function jitJson(json: Json.Any, index?: Index): string
export function jitJson(json: Json.Any, index?: Index) {
  return fn.pipe(
    Json.sort(json),
    (sorted) => Json.fold(Jit.checkJson)(sorted, index).def,
  )
}

export let check = fn.flow(
  Weighted.sort,
  Weighted.fold(Jit.check),
)

export let jit = (schema: t.Schema) => {
  let BODY = check(schema).trim()
  if (BODY.startsWith('(') && BODY.endsWith(')'))
    void (BODY = BODY.slice(1, -1))

  let SINGLE_LINE = BODY.length < MAX_WIDTH
  let OPEN = SINGLE_LINE ? '' : `(\r${' '.repeat(4)}`
  let CLOSE = SINGLE_LINE ? '' : `\r${' '.repeat(2)})`

  return `

function check(value) {
  return ${OPEN}${BODY}${CLOSE}
}
`
    .trim()
}

export let jitParser = (schema: t.Schema) => {
  let body = check(schema)
  return `

function parse(value) {
  function check(value) {
    return (
      ${body}
    )
  }
  if (check(value)) return value
  else throw Error("invalid input")
}

`
    .trim()
}

export function compile<S extends t.Schema>(schema: S): ((x: S['_type'] | T.Unknown) => x is S['_type'])
export function compile(schema: t.Schema): Function { return globalThis.Function('value', 'return ' + check(schema)) }

export function compileParser<S extends t.Schema>(schema: S): ((x: S['_type'] | T.Unknown) => S['_type'])
export function compileParser(schema: t.Schema): Function { return globalThis.Function('value', 'return ' + check(schema)) }
