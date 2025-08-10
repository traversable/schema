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
import type { Discriminated } from '@traversable/json-schema-types'
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

interface Update { type: 'update', path: (string | number)[], value: unknown }
interface Insert { type: 'insert', path: (string | number)[], value: unknown }
interface Delete { type: 'delete', path: (string | number)[] }

type Edit = Update | Insert | Delete
type Diff<T> = (x: T, y: T) => Edit[]

export type Path = (string | number)[]

export interface Scope extends JsonSchema.Index {
  bindings: Map<string, string>
  path: (string | number)[]
}

export type Builder = (left: Path, right: Path, index: Scope) => string

const defaultIndex = () => ({
  ...JsonSchema.defaultIndex,
  bindings: new Map(),
  path: [],
}) satisfies Scope

function jsonPointerFromPath(path: (string | number)[]): unknown {
  if (path.length === 0) return "/"
  else if (path.length === 1 && path[0] === "") return "/"
  else {
    const [head, ...tail] = path
    return [
      ...head === "" ? [head] : ["", head],
      ...tail
    ].map((_) => {
      _ = _ + ""
      if (_.indexOf("~") === -1 && _.indexOf("/") === -1) return _
      let chars = [..._],
        out = "",
        char: string | undefined
      while ((char = chars.shift()) !== undefined)
        out +=
          char === "/" ? "~1" :
            char === "~" ? "~0" :
              char
      return escape(out)
    }).join("/")
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

function StrictlyEqualOrDiff(l: (string | number)[], r: (string | number)[], IX: Scope) {
  const X = joinPath(l, IX.isOptional)
  const Y = joinPath(r, IX.isOptional)
  return [
    `if (${X} !== ${Y}) {`,
    `  diff.push({ type: 'update', path: \`${jsonPointerFromPath(IX.dataPath)}\`, value: ${Y} })`,
    `}`,
  ].join('\n')
}

function SameNumberOrDiff(l: (string | number)[], r: (string | number)[], ix: Scope) {
  const X = joinPath(l, ix.isOptional)
  const Y = joinPath(r, ix.isOptional)
  return [
    `if (${X} !== ${Y} && (${X} === ${X} || ${Y} === ${Y})) {`,
    `  diff.push({ type: 'update', path: \`${jsonPointerFromPath(ix.dataPath)}\`, value: ${Y} })`,
    `}`,
  ].join('\n')
}

function SameValueOrDiff(l: (string | number)[], r: (string | number)[], ix: Scope) {
  const X = joinPath(l, ix.isOptional)
  const Y = joinPath(r, ix.isOptional)
  return [
    `if (!Object.is(${X}, ${Y})) {`,
    `  diff.push({ type: 'update', path: \`${jsonPointerFromPath(ix.dataPath)}\`, value: ${Y} })`,
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

function createEnumDiff(x: JsonSchema.Enum): Builder {
  return function diffEnum(LEFT, RIGHT, IX) {
    return (
      x.enum.every((v) => typeof v === 'number') ? SameNumberOrDiff(LEFT, RIGHT, IX)
        : x.enum.some((v) => typeof v === 'number') ? SameValueOrDiff(LEFT, RIGHT, IX)
          : StrictlyEqualOrDiff(LEFT, RIGHT, IX)
    )
  }
}

function createArrayDiff(x: JsonSchema.Array<Builder>): Builder {
  return function diffArray(LEFT, RIGHT, IX) {
    const LEFT_PATH = joinPath(LEFT, IX.isOptional)
    const RIGHT_PATH = joinPath(RIGHT, IX.isOptional)
    const LEFT_ITEM_IDENT = `${ident(LEFT_PATH, IX.bindings)}_item`
    const RIGHT_ITEM_IDENT = `${ident(RIGHT_PATH, IX.bindings)}_item`
    const LENGTH_IDENT = ident('length', IX.bindings)
    const IX_IDENT = ident('ix', IX.bindings)
    const DOT = IX.isOptional ? '?.' : '.'
    const PATH = [...IX.dataPath, `\${${IX_IDENT}}`]
    return [
      `const ${LENGTH_IDENT} = Math.min(${LEFT_PATH}${DOT}length, ${RIGHT_PATH}${DOT}length);`,
      `let ${IX_IDENT} = 0;`,
      `for (; ${IX_IDENT} < ${LENGTH_IDENT}; ${IX_IDENT}++) {`,
      `  const ${LEFT_ITEM_IDENT} = ${LEFT_PATH}[${IX_IDENT}];`,
      `  const ${RIGHT_ITEM_IDENT} = ${RIGHT_PATH}[${IX_IDENT}];`,
      x.items([LEFT_ITEM_IDENT], [RIGHT_ITEM_IDENT], { ...IX, dataPath: PATH }),
      `}`,
      `if (${LENGTH_IDENT} < ${LEFT_PATH}${DOT}length) {`,
      `  for(; ${IX_IDENT} < ${LEFT_PATH}${DOT}length; ${IX_IDENT}++) {`,
      `     diff.push({ type: 'delete', path: \`${jsonPointerFromPath(PATH)}\` })`,
      `  }`,
      `}`,
      `if (${LENGTH_IDENT} < ${RIGHT_PATH}${DOT}length) {`,
      `  for(; ${IX_IDENT} < ${RIGHT_PATH}${DOT}length; ${IX_IDENT}++) {`,
      `     diff.push({ type: 'insert', path: \`${jsonPointerFromPath(PATH)}\`, value: ${RIGHT_PATH}[${IX_IDENT}] })`,
      `  }`,
      `}`,
    ].join('\n')
  }
}

function createDiffOptional(continuation: Builder): Builder {
  return function diffOptional(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
    return [
      `if (${RIGHT} === undefined && ${LEFT} !== undefined) {`,
      `  diff.push({ type: 'delete', path: \`${jsonPointerFromPath(IX.dataPath)}\` })`,
      `}`,
      `else if (${LEFT} === undefined && ${RIGHT} !== undefined) {`,
      `  diff.push({ type: 'insert', path: \`${jsonPointerFromPath(IX.dataPath)}\`, value: ${RIGHT} })`,
      `}`,
      `else {`,
      continuation(LEFT_PATH, RIGHT_PATH, IX),
      `}`,
    ].join('\n')
  }
}

function createObjectDiff(x: JsonSchema.Object<Builder>): Builder {
  return function diffObject(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, false)   // `false` because `*_PATH` already takes optionality into account
    const RIGHT = joinPath(RIGHT_PATH, false) // `false` because `*_PATH` already takes optionality into account
    return [
      ...Object.entries(x.properties).map(([key, continuation]) => {
        const isOptional = !x.required || !x.required.includes(key)
        const index = { ...IX, dataPath: [...IX.dataPath, key], isOptional }
        return isOptional
          ? createDiffOptional(continuation)(
            [LEFT, key],
            [RIGHT, key],
            index,
          )
          : continuation(
            [LEFT, key],
            [RIGHT, key],
            index
          )
      }),
    ].join('\n')
  }
}

function createRecordDiff(x: JsonSchema.Record<Builder>): Builder {
  return function diffRecord(LEFT, RIGHT, IX) {
    const KEY_IDENT = ident('key', IX.bindings)
    const SEEN_IDENT = ident('seen', IX.bindings)
    const LEFT_PATH = joinPath(LEFT, IX.isOptional)
    const RIGHT_PATH = joinPath(RIGHT, IX.isOptional)
    const PATH = [...IX.dataPath, `\${${KEY_IDENT}}`]
    const patternEntries = !x.patternProperties ? null : Object_entries(x.patternProperties)
    const PATTERN_PROPERTIES = !patternEntries ? null
      : patternEntries.map(([k, continuation], I) => {
        return [
          `${I === 0 ? '' : 'else'} if(/${k.length === 0 ? '^$' : k}/.test(${KEY_IDENT})) {`,
          continuation([`${LEFT_PATH}[${KEY_IDENT}]`], [`${RIGHT_PATH}[${KEY_IDENT}]`], { ...IX, dataPath: PATH }),
          '}',
        ].join('\n')
      }).join('\n')
    const ADDITIONAL_PROPERTIES = !x.additionalProperties ? null
      : [
        x.patternProperties ? 'else {' : null,
        x.additionalProperties([`${LEFT_PATH}[${KEY_IDENT}]`], [`${RIGHT_PATH}[${KEY_IDENT}]`], { ...IX, dataPath: PATH }),
        x.patternProperties ? '}' : null,
      ].filter((_) => _ !== null).join('\n')
    return [
      `const ${SEEN_IDENT} = new Set()`,
      `for (let ${KEY_IDENT} in ${LEFT_PATH}) {`,
      `  ${SEEN_IDENT}.add(${KEY_IDENT})`,
      `  if (!(${KEY_IDENT} in ${RIGHT_PATH})) {`,
      `    diff.push({ type: 'delete', path: \`${jsonPointerFromPath(PATH)}\` })`,
      `    continue`,
      `  }`,
      PATTERN_PROPERTIES,
      ADDITIONAL_PROPERTIES,
      `}`,
      `for (let ${KEY_IDENT} in ${RIGHT_PATH}) {`,
      `  if (${SEEN_IDENT}.has(${KEY_IDENT})) {`,
      `    continue`,
      `  }`,
      `  if (!(${KEY_IDENT} in ${LEFT_PATH})) {`,
      `    diff.push({ type: 'insert', path: \`${jsonPointerFromPath(PATH)}\`, value: ${RIGHT_PATH}[${KEY_IDENT}] })`,
      `    continue`,
      `  }`,
      PATTERN_PROPERTIES,
      ADDITIONAL_PROPERTIES,
      `}`,
    ].filter((_) => _ !== null).join('\n')
  }
}

const fold = JsonSchema.fold<Builder>((x) => {
  switch (true) {
    default: return (void (x satisfies never), SameValueOrDiff)
    // case JsonSchema.isConst(x): return foldJson(x.const as Json.Unary<Builder>)
    case JsonSchema.isNever(x): return diffNever
    case JsonSchema.isNull(x): return diffNull
    case JsonSchema.isBoolean(x): return diffBoolean
    case JsonSchema.isInteger(x): return diffInteger
    case JsonSchema.isNumber(x): return diffNumber
    case JsonSchema.isString(x): return diffString
    case JsonSchema.isEnum(x): return createEnumDiff(x)
    case JsonSchema.isArray(x): return createArrayDiff(x)
    case JsonSchema.isRecord(x): return createRecordDiff(x)
    // case JsonSchema.isIntersection(x): return diffIntersection(x)
    // case JsonSchema.isTuple(x): return diffTuple(x, input as JsonSchema.Tuple<JsonSchema>)
    // case JsonSchema.isUnion(x): return diffUnion(x, input as JsonSchema.Union<JsonSchema>)
    case JsonSchema.isObject(x): return createObjectDiff(x)
    case JsonSchema.isUnknown(x): return diffUnknown
  }
})

export declare namespace diff {
  type Options = toType.Options & {
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
}

diff.writeable = diff_writeable

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
