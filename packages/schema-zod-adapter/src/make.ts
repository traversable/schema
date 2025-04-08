import { t } from '@traversable/schema'
import '@traversable/derive-validators/install'

import type { Comparator, Equal } from '@traversable/registry'
import { fn, Object_keys, ValueSet, Array_isArray, has } from "@traversable/registry"

// TODO: move
function objectFromKeys<T extends keyof any>(...keys: [...T[]]): { [K in T]: K }
function objectFromKeys<T extends keyof any>(...keys: [...T[]]) {
  let out: { [x: keyof any]: keyof any } = {}
  for (let k of keys) out[k] = k
  return out
}

let stringEquals: Equal<string> = (l, r) => l === r
let stringComparator: Comparator<string> = (l, r) => l.localeCompare(r)

let importEquals: Equal<string | [string, string]> = (l, r) => {
  if (Array_isArray(l)) {
    if (!Array_isArray(r)) return false
    else return l[0] === r[0] && l[1] === r[1]
  }
  else if (Array_isArray(r)) return false
  else return l === r
}

let importComparator: Comparator<string | [string, string]> = (l, r) => {
  if (typeof l === 'string') {
    if (typeof r === 'string') return l.localeCompare(r)
    else return 1
  } else if (typeof r === 'string') return -1
  else {
    return l[0].localeCompare(r[0])
  }
}

export let packageNames = [
  '@traversable/derive-validators',
  '@traversable/registry',
  '@traversable/schema',
  '@traversable/schema-to-json-schema',
] as const satisfies any[]
export type PackageName = typeof packageNames[number]
export let PackageName = objectFromKeys(...packageNames)

export let methodNames = [
  'core',
  'equals',
  'toJsonSchema',
  'toString',
  'validate',
] as const satisfies any[]
export type MethodName = typeof methodNames[number]
export let MethodName = objectFromKeys(...methodNames)

export type Config = t.typeof<typeof Config>
export let Config = t.object(fn.map(MethodName, () => t.optional(t.eq(true))))

export type AliasedImport = t.typeof<typeof AliasedImport>
export const AliasedImport = t.tuple(t.string, t.string)

export type NamedImport = t.typeof<typeof NamedImport>
export const NamedImport = t.union(t.string, AliasedImport)

export type Import = t.typeof<typeof Import>
export let Import = t.object({
  named: t.array(NamedImport),
  namespace: t.optional(t.string),
})

export type Imports = t.typeof<typeof Imports>
export let Imports = t.object({ type: Import, term: Import })

export type PackageImports = t.typeof<typeof PackageImports>
export let PackageImports = t.object(fn.map(PackageName, () => t.optional(Imports)))

export type SchemaDependencies = t.typeof<typeof SchemaDependencies>
export let SchemaDependencies = t.object(fn.map(MethodName, () => PackageImports))

export type DependenciesBySchema = t.typeof<typeof DependenciesBySchema>
export const DependenciesBySchema = t.record(SchemaDependencies)

export type DeduplicatedImport = {
  named: ValueSet<NamedImport>
  namespace: ValueSet<string>
}

export type DeduplicatedImports = {
  type: DeduplicatedImport
  term: DeduplicatedImport
}

export type ParsedImport = {
  named: NamedImport[]
  namespace: string[]
}
export type ParsedImports = {
  type: ParsedImport
  term: ParsedImport
}

export function makeArraySchema({ equals, toJsonSchema, toString, validate }: Config) {
}

let makeSpacing = (singleLine: boolean) => ({
  bracket: singleLine ? ' ' : '\n',
  indent: singleLine ? '' : '  ',
  separator: singleLine ? ', ' : ',\n',
  space: singleLine ? ' ' : '  ',
})

export function makeImport(dependency: string, { term, type }: ParsedImports, maxPerLine = 3): string[] {
  let out = Array.of<string>()
  if (Array_isArray(type.namespace)) out.push(...type.namespace.map((ns) => `import type * as ${ns} from '${dependency}'`))
  if (Array_isArray(term.namespace)) out.push(...term.namespace.map((ns) => `import * as ${ns} from '${dependency}'`))
  if (Array.isArray(type.named) && type.named.length > 0) {
    let singleLine = type.named.length <= maxPerLine
    let $$ = makeSpacing(singleLine)

    out.push(`import type {${$$.bracket}` +
      type.named
        .map((_) => typeof _ === 'string' ? `${$$.indent}${_}` : `${$$.space}${_[0]} as ${_[1]}`)
        .join($$.separator) + `${$$.bracket}} from '${dependency}'`)

  }
  if (Array.isArray(term.named) && term.named.length > 0) {
    let singleLine = term.named.length <= maxPerLine
    let $$ = makeSpacing(singleLine)
    out.push(`import {${singleLine ? ' ' : '\n'}` +
      term.named
        .map((_) => typeof _ === 'string' ? `${$$.indent}${_}` : `${$$.space}${_[0]} as ${_[1]}`)
        .join($$.separator) + `${$$.bracket}} from '${dependency}'`)
  }
  return out
}


let initializeImport = () => ({ named: ValueSet.new(importEquals), namespace: ValueSet.new<string>(stringEquals) })
let initializeImports = () => ({ type: initializeImport(), term: initializeImport() })

function initializeIntermediateRepresentation(): Record<PackageName, DeduplicatedImports>
function initializeIntermediateRepresentation() {
  let out: { [K in PackageName]?: DeduplicatedImports } = {}
  for (let name of packageNames) {
    out[name] = initializeImports()
  }
  return out
}

export function deduplicateDependencies<FK extends keyof SchemaDependencies>(config: Record<FK, boolean>, dependencies: DependenciesBySchema) {
  return fn.map(
    dependencies,
    (dependency) => {
      let init = initializeIntermediateRepresentation()
      return Object_keys(config)
        .map((k) => dependency[k])
        .reduce(
          (acc, dep) => {
            void fn.map(acc, (accValue, k) => {
              // let 
              if (has(k)(dep)) {
                if (has(k, 'type', 'namespace')(dep)) {
                  let set = accValue.type.namespace
                  let termlevelSet = accValue.term.namespace
                  let ns = dep[k].type.namespace
                  if (!termlevelSet.has(ns))
                    set.add(ns)
                }
                if (has(k, 'type', 'named')(dep)) {
                  let set = accValue.type.named
                  let termlevelSet = accValue.term.named
                  let names = dep[k].type.named
                  for (let name of names)
                    if (!termlevelSet.has(name))
                      set.add(name)
                }
                if (t.has(k, 'term', 'namespace', t.string)(dep)) {
                  let set = accValue.term.namespace
                  let typelevelSet = accValue.type.namespace
                  let ns = dep[k].term.namespace
                  set.add(ns)
                  if (typelevelSet.has(ns))
                    typelevelSet.delete(ns)
                }
                if (t.has(k, 'term', 'named')(dep)) {
                  let set = accValue.term.named
                  let typelevelSet = accValue.type.named
                  let names = dep[k].term.named
                  for (let name of names) {
                    set.add(name)
                    if (typelevelSet.has(name))
                      typelevelSet.delete(name)
                  }
                }
              }
            })

            return acc
          },
          init,
        )
    }
  )
}

// export function makeImportArraysBySchemaName<FK extends keyof SchemaDependencies, T extends Record<string, Pick<SchemaDependencies, FK>>>(
//   config: Record<FK, boolean>,
//   dependencies: T
// ): { [K in keyof T]: { [P in FK]: string[] } }
export function makeImportArraysBySchemaName<FK extends keyof SchemaDependencies, T extends Record<string, Pick<SchemaDependencies, FK>>>(
  config: Record<FK, boolean>,
  dependencies: Record<string, Pick<SchemaDependencies, FK>>
) {
  // <K extends keyof SchemaDependencies>(
  //   config: Record<K, boolean>,
  //   dependencies: Record<string, Pick<SchemaDependencies, K>>
  // ) {
  if (!DependenciesBySchema(dependencies)) {
    console.error('Received invalid dependencies:', DependenciesBySchema.validate(dependencies))
    throw Error('Received invalid dependencies; see console for full error message')
  }

  let deduplicated = deduplicateDependencies(config, dependencies);

  return Object.entries(deduplicated)
    .map(
      ([schemaName, schemaDeps]) => [
        schemaName, fn.map(
          schemaDeps,
          ({ type, term }, depName) => makeImport(
            depName,
            {
              type: { namespace: [...type.namespace.values()].sort(stringComparator), named: [...type.named.values()].sort(importComparator) },
              term: { namespace: [...term.namespace.values()].sort(stringComparator), named: [...term.named.values()].sort(importComparator) },
            }
          )
        )
      ] satisfies [any, any]
    )
    .reduce(
      (acc, [k, v]) => (acc[k] = Object.values(v).filter((_) => _.length > 0).map((_) => _.join('\n')), acc),
      {} as Record<string, string[]>
    )
}

export function makeImports<FK extends keyof SchemaDependencies, T extends Record<string, Pick<SchemaDependencies, FK>>>(
  config: Record<FK, boolean>,
  dependencies: T
): { [K in keyof T]: string }
export function makeImports<FK extends keyof SchemaDependencies, T extends Record<string, Pick<SchemaDependencies, FK>>>(
  config: Record<FK, boolean>,
  dependencies: Record<string, SchemaDependencies>
): {} {
  return fn.map(makeImportArraysBySchemaName(config, dependencies), (importArray) => importArray.join('\n'))
}
