import { Json } from '@traversable/json'
import {
  Equal,
  escape,
  ident,
  joinPath,
  Object_keys,
  Object_entries,
  stringifyLiteral,
} from '@traversable/registry'
import type { Discriminated, TypeName } from '@traversable/json-schema-types'
import {
  check,
  JsonSchema,
  toType,
  areAllObjects,
  getTags,
  deepEqualInlinePrimitiveCheck as inlinePrimitiveCheck,
  deepEqualIsPrimitive as isPrimitive,
  deepEqualSchemaOrdering as schemaOrdering,
  Invariant,
} from '@traversable/json-schema-types'

interface Update { type: 'update', path: string, value: unknown }
interface Insert { type: 'insert', path: string, value: unknown }
interface Delete { type: 'delete', path: string }

type Edit = Update | Insert | Delete
type Diff<T> = (x: T, y: T) => Edit[]

export type Path = (string | number)[]

export interface Scope extends JsonSchema.Index {
  bindings: Map<string, string>
  path: (string | number)[]
}

export type Builder = (left: Path, right: Path, index: Scope) => string

const diff_unfuzzable = [
  'union',
  'unknown',
] satisfies TypeName[]

const defaultIndex = () => ({
  ...JsonSchema.defaultIndex,
  bindings: new Map(),
  path: [],
}) satisfies Scope

function jsonPointer(path: (string | number)[]): string {
  if (path.length === 0) return `""`
  else if (path.length === 1 && path[0] === "") return `"/"`
  else {
    const [head, ...tail] = path
    let out = [
      ...head === "" ? [head] : ["", head],
      ...tail
    ].map((s) => {
      s = String(s)
      if (s.indexOf("~") === -1 && s.indexOf("/") === -1) return s
      let chars = [...s],
        out = "",
        char: string | undefined
      while ((char = chars.shift()) !== undefined) {
        out +=
          char === "/" ? "~1" :
            char === "~" ? "~0" :
              char
      }
      return escape(out)
    }).join("/")
    return out.includes('${') ? `\`${out}\`` : `"${out}"`
  }
}

function requiresObjectIs(x: unknown): boolean {
  return JsonSchema.isNever(x)
    || JsonSchema.isInteger(x)
    || JsonSchema.isNumber(x)
    || JsonSchema.isEnum(x)
    || JsonSchema.isUnion(x) && x.anyOf.some(requiresObjectIs)
    || JsonSchema.isUnknown(x)
}

function StrictlyEqualOrDiff(x: (string | number)[], y: (string | number)[], IX: Scope) {
  const X = joinPath(x, IX.isOptional)
  const Y = joinPath(y, IX.isOptional)
  return [
    `if (${X} !== ${Y}) {`,
    `  diff.push({ type: "update", path: ${jsonPointer(IX.dataPath)}, value: ${Y} })`,
    `}`,
  ].join('\n')
}

function SameNumberOrDiff(x: (string | number)[], y: (string | number)[], ix: Scope) {
  const X = joinPath(x, ix.isOptional)
  const Y = joinPath(y, ix.isOptional)
  return [
    `if (${X} !== ${Y} && (${X} === ${X} || ${Y} === ${Y})) {`,
    `  diff.push({ type: "update", path: ${jsonPointer(ix.dataPath)}, value: ${Y} })`,
    `}`,
  ].join('\n')
}

function SameValueOrDiff(x: (string | number)[], y: (string | number)[], ix: Scope) {
  const X = joinPath(x, ix.isOptional)
  const Y = joinPath(y, ix.isOptional)
  return [
    `if (!Object.is(${X}, ${Y})) {`,
    `  diff.push({ type: "update", path: ${jsonPointer(ix.dataPath)}, value: ${Y} })`,
    `}`,
  ].join('\n')
}

function diffNever(...args: Parameters<Builder>) { return SameValueOrDiff(...args) }
function diffUnknown(...args: Parameters<Builder>) { return SameValueOrDiff(...args) }
function diffNull(...args: Parameters<Builder>) { return StrictlyEqualOrDiff(...args) }
function diffBoolean(...args: Parameters<Builder>) { return StrictlyEqualOrDiff(...args) }
function diffInteger(...args: Parameters<Builder>) { return SameNumberOrDiff(...args) }
function diffNumber(...args: Parameters<Builder>) { return SameNumberOrDiff(...args) }
function diffString(...args: Parameters<Builder>) { return StrictlyEqualOrDiff(...args) }

const foldJson = Json.fold<Builder>((x) => {
  switch (true) {
    default: return (void (x satisfies never), SameValueOrDiff)
    case x == null: return diffNull
    case x === true:
    case x === false: return diffBoolean
    case typeof x === 'number': return diffNumber
    case typeof x === 'string': return diffString
    case Json.isArray(x): return function diffConstArray(X, Y, IX) {
      const X_PATH = joinPath(X, IX.isOptional)
      const Y_PATH = joinPath(Y, IX.isOptional)
      return x.length === 0
        ? [
          `if (${X_PATH}.length !== ${Y_PATH}.length) {`,
          `  diff.push({ type: "update", path: ${jsonPointer(IX.dataPath)}, value: ${Y_PATH} })`,
          `}`,
        ].join('\n')
        : x.map(
          (continuation, I) => continuation(
            [X_PATH, I],
            [Y_PATH, I],
            { ...IX, dataPath: [...IX.dataPath, I] }
          )
        ).join('\n')
    }
    case Json.isObject(x): return function diffConstObject(X, Y, IX) {
      const X_PATH = joinPath(X, IX.isOptional)
      const Y_PATH = joinPath(Y, IX.isOptional)
      const BODY = Object_entries(x).map(
        ([k, continuation]) => continuation(
          [X_PATH, k],
          [Y_PATH, k],
          { ...IX, dataPath: [...IX.dataPath, k] }
        )
      )
      return BODY.length === 0
        ? [
          `if (Object.keys(${X_PATH}).length !== Object.keys(${Y_PATH}).length) {`,
          `  diff.push({ type: "update", path: ${jsonPointer(IX.dataPath)}, value: ${Y_PATH} })`,
          `}`,
        ].join('\n')
        : BODY.join('\n')
    }
  }
})

function createEnumDiff(x: JsonSchema.Enum): Builder {
  return function diffEnum(X, Y, IX) {
    return (
      x.enum.every((v) => typeof v === 'number') ? SameNumberOrDiff(X, Y, IX)
        : x.enum.some((v) => typeof v === 'number') ? SameValueOrDiff(X, Y, IX)
          : StrictlyEqualOrDiff(X, Y, IX)
    )
  }
}

function createArrayDiff(x: JsonSchema.Array<Builder>): Builder {
  return function diffArray(X, Y, IX) {
    const X_PATH = joinPath(X, IX.isOptional)
    const Y_PATH = joinPath(Y, IX.isOptional)
    const X_ITEM_IDENT = `${ident(X_PATH, IX.bindings)}_item`
    const Y_ITEM_IDENT = `${ident(Y_PATH, IX.bindings)}_item`
    const LENGTH_IDENT = ident('length', IX.bindings)
    const IX_IDENT = ident('ix', IX.bindings)
    const DOT = IX.isOptional ? '?.' : '.'
    const PATH = [...IX.dataPath, `\${${IX_IDENT}}`]
    return [
      `const ${LENGTH_IDENT} = Math.min(${X_PATH}${DOT}length, ${Y_PATH}${DOT}length);`,
      `let ${IX_IDENT} = 0;`,
      `for (; ${IX_IDENT} < ${LENGTH_IDENT}; ${IX_IDENT}++) {`,
      `  const ${X_ITEM_IDENT} = ${X_PATH}[${IX_IDENT}];`,
      `  const ${Y_ITEM_IDENT} = ${Y_PATH}[${IX_IDENT}];`,
      x.items([X_ITEM_IDENT], [Y_ITEM_IDENT], { ...IX, dataPath: PATH }),
      `}`,
      `if (${LENGTH_IDENT} < ${X_PATH}${DOT}length) {`,
      `  for(; ${IX_IDENT} < ${X_PATH}${DOT}length; ${IX_IDENT}++) {`,
      `     diff.push({ type: "delete", path: ${jsonPointer(PATH)} })`,
      `  }`,
      `}`,
      `if (${LENGTH_IDENT} < ${Y_PATH}${DOT}length) {`,
      `  for(; ${IX_IDENT} < ${Y_PATH}${DOT}length; ${IX_IDENT}++) {`,
      `     diff.push({ type: "insert", path: ${jsonPointer(PATH)}, value: ${Y_PATH}[${IX_IDENT}] })`,
      `  }`,
      `}`,
    ].join('\n')
  }
}

function createRecordDiff(x: JsonSchema.Record<Builder>): Builder {
  return function diffRecord(X, Y, IX) {
    const KEY_IDENT = ident('key', IX.bindings)
    const SEEN_IDENT = ident('seen', IX.bindings)
    const X_PATH = joinPath(X, IX.isOptional)
    const Y_PATH = joinPath(Y, IX.isOptional)
    const PATH = [...IX.dataPath, `\${${KEY_IDENT}}`]
    const patternEntries = !x.patternProperties ? null : Object_entries(x.patternProperties)
    const PATTERN_PROPERTIES = !patternEntries ? null
      : patternEntries.map(([k, continuation], I) => {
        return [
          `${I === 0 ? '' : 'else'} if(/${k.length === 0 ? '^$' : k}/.test(${KEY_IDENT})) {`,
          continuation([`${X_PATH}[${KEY_IDENT}]`], [`${Y_PATH}[${KEY_IDENT}]`], { ...IX, dataPath: PATH }),
          '}',
        ].join('\n')
      }).join('\n')
    const ADDITIONAL_PROPERTIES = !x.additionalProperties ? null
      : [
        x.patternProperties ? 'else {' : null,
        x.additionalProperties([`${X_PATH}[${KEY_IDENT}]`], [`${Y_PATH}[${KEY_IDENT}]`], { ...IX, dataPath: PATH }),
        x.patternProperties ? '}' : null,
      ].filter((_) => _ !== null).join('\n')
    return [
      `const ${SEEN_IDENT} = new Set()`,
      `for (let ${KEY_IDENT} in ${X_PATH}) {`,
      `  ${SEEN_IDENT}.add(${KEY_IDENT})`,
      `  if (!(${KEY_IDENT} in ${Y_PATH})) {`,
      `    diff.push({ type: "delete", path: ${jsonPointer(PATH)} })`,
      `    continue`,
      `  }`,
      PATTERN_PROPERTIES,
      ADDITIONAL_PROPERTIES,
      `}`,
      `for (let ${KEY_IDENT} in ${Y_PATH}) {`,
      `  if (${SEEN_IDENT}.has(${KEY_IDENT})) {`,
      `    continue`,
      `  }`,
      `  if (!(${KEY_IDENT} in ${X_PATH})) {`,
      `    diff.push({ type: "insert", path: ${jsonPointer(PATH)}, value: ${Y_PATH}[${KEY_IDENT}] })`,
      `    continue`,
      `  }`,
      PATTERN_PROPERTIES,
      ADDITIONAL_PROPERTIES,
      `}`,
    ].filter((_) => _ !== null).join('\n')
  }
}

function createDiffOptional(continuation: Builder): Builder {
  return function diffOptional(X, Y, IX) {
    const X_PATH = joinPath(X, IX.isOptional)
    const Y_PATH = joinPath(Y, IX.isOptional)
    return [
      `if (${Y_PATH} === undefined && ${X_PATH} !== undefined) {`,
      `  diff.push({ type: "delete", path: ${jsonPointer(IX.dataPath)} })`,
      `}`,
      `else if (${X_PATH} === undefined && ${Y_PATH} !== undefined) {`,
      `  diff.push({ type: "insert", path: ${jsonPointer(IX.dataPath)}, value: ${Y_PATH} })`,
      `}`,
      `else {`,
      continuation(X, Y, IX),
      `}`,
    ].join('\n')
  }
}

function createObjectDiff(x: JsonSchema.Object<Builder>): Builder {
  return function diffObject(X, Y, IX) {
    const X_PATH = joinPath(X, false) // `false` because `*_PATH` already takes optionality into account
    const Y_PATH = joinPath(Y, false) // `false` because `*_PATH` already takes optionality into account
    const BODY = Object.entries(x.properties).map(([key, continuation]) => {
      const isOptional = !x.required || !x.required.includes(key)
      const index = { ...IX, dataPath: [...IX.dataPath, key], isOptional }
      return isOptional
        ? createDiffOptional(continuation)(
          [X_PATH, key],
          [Y_PATH, key],
          index
        )
        : continuation(
          [X_PATH, key],
          [Y_PATH, key],
          index
        )
    })

    return BODY.length === 0
      ? [
        `if (${X_PATH} !== ${Y_PATH}) {`,
        `  diff.push({ type: "update", path: ${jsonPointer(IX.dataPath)}, value: ${Y_PATH} })`,
        `}`,
      ].join('\n')
      : BODY.join('\n')
  }
}

function createTupleDiff(x: JsonSchema.Tuple<Builder>): Builder {
  return function diffTuple(X, Y, IX) {
    const X_PATH = joinPath(X, false) // `false` because `*_PATH` already takes optionality into account
    const Y_PATH = joinPath(Y, false) // `false` because `*_PATH` already takes optionality into account
    if (x.prefixItems.length === 0) {
      return [
        `if (${X_PATH}.length !== ${Y_PATH}.length) {`,
        `  diff.push({ type: "update", path: ${jsonPointer(IX.dataPath)}, value: ${Y_PATH} })`,
        `}`,
      ].join('\n')
    }
    else return x.prefixItems.map(
      (continuation, I) => continuation(
        [X_PATH, I],
        [Y_PATH, I],
        { ...IX, dataPath: [...IX.dataPath, I] }
      )
    ).join('\n')
  }
}

function createIntersectionDiff(x: JsonSchema.Intersection<Builder>): Builder {
  return function diffUnion(X, Y, IX) {
    const X_PATH = joinPath(X, IX.isOptional)
    const Y_PATH = joinPath(Y, IX.isOptional)
    return x.allOf.length === 0
      ? diffUnknown(X, Y, IX)
      : x.allOf.map((continuation) => continuation([X_PATH], [Y_PATH], IX)).join('\n')
  }
}

function createUnionDiff(
  x: JsonSchema.Union<Builder>,
  input: JsonSchema.F<JsonSchema.Fixpoint>
): Builder {
  if (!JsonSchema.isUnion(input)) {
    return Invariant.IllegalState('diff', 'expected input to be a union schema', input)
  }
  if (x.anyOf.length === 0) {
    return diffNever
  } else if (x.anyOf.length === 1) {
    return x.anyOf[0]
  } else {
    if (!areAllObjects(input.anyOf)) {
      return createInclusiveUnionDiff(x, input)
    } else {
      const withTags = getTags(input.anyOf)
      return withTags === null
        ? createInclusiveUnionDiff(x, input)
        : createExclusiveUnionDiff(x, withTags)
    }
  }
}

function createInclusiveUnionDiff(
  x: JsonSchema.Union<Builder>,
  input: JsonSchema.Union<JsonSchema.Fixpoint>
): Builder {
  return function diffUnion(X, Y, IX) {
    const X_PATH = joinPath(X, IX.isOptional)
    const Y_PATH = joinPath(Y, IX.isOptional)
    const sorted = input.anyOf
      .map((option, i) => [option, i] satisfies [any, any])
      .toSorted(schemaOrdering)
    const PREDICATES = sorted.map(([option]) => {
      if (isPrimitive(option)) {
        return null
      } else {
        const FUNCTION_NAME = ident('check', IX.bindings)
        return {
          FUNCTION_NAME: FUNCTION_NAME,
          PREDICATE: check.writeable(option, { functionName: FUNCTION_NAME, stripTypes: true })
        }
      }
    })
    const CHECKS = sorted.map(([option, I], i, xs) => {
      const continuation = x.anyOf[I]
      const isFirst = i === 0
      const isLast = i === xs.length - 1
      const BODY = continuation([X_PATH], [Y_PATH], IX)
      const IF_ELSEIF = isFirst ? 'if ' : 'else if '
      if (isPrimitive(option)) {
        const CHECK = isLast ? null : inlinePrimitiveCheck(
          option,
          { path: X, ident: X_PATH },
          { path: Y, ident: Y_PATH },
          false
        )
        return [
          `${IF_ELSEIF} (${CHECK}) {`,
          BODY,
          `}`,
        ].filter((_) => _ !== null).join('\n')
      } else {
        const PREDICATE = PREDICATES[i]
        const FUNCTION_NAME = PREDICATE === null ? null : PREDICATE.FUNCTION_NAME
        const CHECK = `${FUNCTION_NAME}(${X_PATH}) && ${FUNCTION_NAME}(${Y_PATH})`
        return [
          `${IF_ELSEIF} (${CHECK}) {`,
          BODY,
          `}`
        ].filter((_) => _ !== null).join('\n')
      }
    })
    return [
      ...PREDICATES.map((_) => _ === null ? null : _.PREDICATE),
      CHECKS.join('\n'),
      `else {`,
      `  diff.push({ type: "update", path: ${jsonPointer(IX.dataPath)}, value: ${Y_PATH} })`,
      `}`,
    ].filter((_) => _ !== null).join('\n')
  }
}

function createExclusiveUnionDiff(
  x: JsonSchema.Union<Builder>,
  [discriminant, TAGGED]: Discriminated
): Builder {
  return function diffUnion(X, Y, IX) {
    const X_PATH = joinPath(X, false)
    const Y_PATH = joinPath(Y, false)
    return [
      ...TAGGED.map(({ tag }, i) => {
        const TAG = stringifyLiteral(tag)
        const continuation = x.anyOf[i]
        const X_ACCESSOR = joinPath([X_PATH, discriminant], IX.isOptional)
        const Y_ACCESSOR = joinPath([Y_PATH, discriminant], IX.isOptional)
        const IF_ELSEIF = i === 0 ? 'if ' : 'else if '
        return [
          `${IF_ELSEIF} (${X_ACCESSOR} === ${TAG} && ${Y_ACCESSOR} === ${TAG}) {`,
          continuation([X_PATH], [Y_PATH], IX),
          `}`,
        ].join('\n')
      }),
      `else {`,
      `  diff.push({ type: "update", path: ${jsonPointer(IX.dataPath)}, value: ${Y_PATH} })`,
      `}`,
    ].join('\n')
  }
}

const fold = JsonSchema.fold<Builder>((x, _, input) => {
  switch (true) {
    default: return (void (x satisfies never), SameValueOrDiff)
    case JsonSchema.isConst(x): return foldJson(x.const as Json.Unary<Builder>)
    case JsonSchema.isNever(x): return diffNever
    case JsonSchema.isNull(x): return diffNull
    case JsonSchema.isBoolean(x): return diffBoolean
    case JsonSchema.isInteger(x): return diffInteger
    case JsonSchema.isNumber(x): return diffNumber
    case JsonSchema.isString(x): return diffString
    case JsonSchema.isEnum(x): return createEnumDiff(x)
    case JsonSchema.isArray(x): return createArrayDiff(x)
    case JsonSchema.isRecord(x): return createRecordDiff(x)
    case JsonSchema.isTuple(x): return createTupleDiff(x)
    case JsonSchema.isObject(x): return createObjectDiff(x)
    case JsonSchema.isUnion(x): return createUnionDiff(x, input)
    case JsonSchema.isIntersection(x): return createIntersectionDiff(x)
    case JsonSchema.isUnknown(x): return diffUnknown
  }
})

export declare namespace diff {
  export type Options = toType.Options & {
    /**
     * Configure the name of the generated diff function
     * @default "diff"
     */
    functionName?: string
    /**
     * Whether to remove TypeScript type annotations from the generated output
     * @default false
     */
    stripTypes?: boolean
  }
  export {
    Diff,
    Edit,
    Delete,
    Insert,
    Update,
  }
}

diff.writeable = diff_writeable
diff.unfuzzable = diff_unfuzzable

export function diff<const S extends JsonSchema, T = toType<S>>(schema: S): Diff<T>
export function diff(schema: JsonSchema) {
  const index = defaultIndex()
  const ROOT_CHECK = requiresObjectIs(schema) ? `if (Object.is(x, y)) return diff` : `if (x === y) return diff`
  const BODY = fold(schema)(['x'], ['y'], index)
  return JsonSchema.isNullary(schema)
    ? globalThis.Function('x', 'y', [
      `const diff = []`,
      BODY,
      'return diff'
    ].join('\n'))
    : globalThis.Function('x', 'y', [
      `const diff = []`,
      ROOT_CHECK,
      BODY,
      'return diff'
    ].join('\n'))
}

function diff_writeable(schema: JsonSchema, options?: diff.Options): string {
  const index = { ...defaultIndex(), ...options } satisfies Scope
  const compiled = fold(schema)(['x'], ['y'], index)
  const FUNCTION_NAME = options?.functionName ?? 'diff'
  const inputType = options?.stripTypes ? '' : toType(schema, options)
  const TYPE = options?.stripTypes ? '' : `: ${options?.typeName ?? inputType}`
  const ROOT_DIFF = requiresObjectIs(schema) ? `if (Object.is(x, y)) return diff` : `if (x === y) return diff`
  const BODY = compiled.length === 0 ? null : compiled
  return (
    JsonSchema.isNullary(schema)
      ? [
        options?.typeName === undefined ? null : inputType,
        `function ${FUNCTION_NAME} (x${TYPE}, y${TYPE}) {`,
        `const diff = []`,
        BODY,
        `return diff;`,
        `}`,
      ]
      : [
        options?.typeName === undefined ? null : inputType,
        `function ${FUNCTION_NAME} (x${TYPE}, y${TYPE}) {`,
        `const diff = []`,
        ROOT_DIFF,
        BODY,
        `return diff;`,
        `}`
      ]
  ).filter((_) => _ !== null).join('\n')
}
