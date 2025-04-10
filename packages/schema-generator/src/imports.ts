import type * as T from '@traversable/registry'
import { fn, Array_isArray } from "@traversable/registry"
import { t } from '@traversable/schema'

let stringComparator: T.Comparator<string> = (l, r) => l.localeCompare(r)

export type Import = t.typeof<typeof Import>
export let Import = t.object({
  named: t.array(t.string),
  namespace: t.optional(t.string),
})

export type Imports = t.typeof<typeof Imports>
export let Imports = t.object({ type: Import, term: Import })

export type SchemaDependencies = t.typeof<typeof SchemaDependencies>
export let SchemaDependencies = t.record(t.record(Imports))

export type ExtensionsBySchemaName = T.Record<
  'array' | 'string',
  T.Record<
    'core' | 'equals',
    T.Record<
      '@traversable/registry' | '@traversable/schema',
      Imports
    >
  >
>

export let ExtensionsBySchemaName = t.record(SchemaDependencies)

export type DeduplicatedImport = {
  named: Set<string>
  namespace: Set<string>
}

export type DeduplicatedImports = {
  type: DeduplicatedImport
  term: DeduplicatedImport
}

export type ParsedImport = {
  named: string[]
  namespace: string[]
}
export type ParsedImports = {
  type: ParsedImport
  term: ParsedImport
}

let makeSpacing = (singleLine: boolean) => ({
  bracket: singleLine ? ' ' : '\n',
  indent: singleLine ? '' : '  ',
  separator: singleLine ? ', ' : ',\n',
  space: singleLine ? ' ' : '  ',
})

export function makeImport(dependency: string, { term, type }: ParsedImports, maxPerLine = 3): string[] {
  let out = Array.of<string>()
  if (Array_isArray(type.namespace))
    out.push(...type.namespace.map((ns) => `import type * as ${ns} from '${dependency}'`))
  if (Array_isArray(term.namespace))
    out.push(...term.namespace.map((ns) => `import * as ${ns} from '${dependency}'`))
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

let getDependenciesFromImportsForSchema = (schemaExtensions: ExtensionsBySchemaName[keyof ExtensionsBySchemaName]) => {
  if (!schemaExtensions) return []
  else {
    let xs = Object.values(schemaExtensions)
      .filter((_) => !!_)
      .flatMap((_) => Object.keys(_).filter((_) => _.startsWith('@traversable/')))
    return Array.from(new Set(xs))
  }
}

export function deduplicateImports(extensionsBySchemaName: ExtensionsBySchemaName): Record<string, Record<string, DeduplicatedImports>> {
  return fn.map(
    extensionsBySchemaName,
    (extension) => {
      if (!extension) return {}

      let init: Record<string, DeduplicatedImports> = {}
      let pkgNames = getDependenciesFromImportsForSchema(extension)

      for (let pkgName of pkgNames) {
        init[pkgName] = {
          type: {
            named: new Set<string>(),
            namespace: new Set<string>(),
          },
          term: {
            named: new Set<string>(),
            namespace: new Set<string>(),
          },
        }
      }

      fn.map(extension, (imports) => {
        if (!imports) return {}

        fn.map(imports, (imports, pkgName) => {
          if (!`${pkgName}`.startsWith('@traversable/')) return {}
          if (!imports) return {}
          let { type, term } = imports

          for (let name of type.named) {
            if (!init[pkgName].term.named.has(name))
              init[pkgName].type.named.add(name)
          }
          if (t.string(type.namespace)) {
            if (!init[pkgName].term.namespace.has(type.namespace))
              init[pkgName].type.namespace.add(type.namespace)
          }
          for (let name of term.named) {
            if (init[pkgName].type.named.has(name)) init[pkgName].type.named.delete(name)
            init[pkgName].term.named.add(name)
          }
          if (t.string(term.namespace)) {
            if (init[pkgName].type.namespace.has(term.namespace)) init[pkgName].type.namespace.delete(term.namespace)
            init[pkgName].term.namespace.add(term.namespace)
          }
        })
      })

      return init
    }
  )
}

export function makeImportsBySchemaName<S extends ExtensionsBySchemaName>(extensionsBySchemaName: S) {
  return Object.entries(deduplicateImports(extensionsBySchemaName))
    .map(([schemaName, schemaDeps]) => [
      schemaName,
      fn.map(
        schemaDeps,
        ({ type, term }, depName) => makeImport(
          depName, {
          type: {
            named: [...type.named.values()].sort(stringComparator),
            namespace: [...type.namespace.values()].sort(stringComparator),
          },
          term: {
            named: [...term.named.values()].sort(stringComparator),
            namespace: [...term.namespace.values()].sort(stringComparator),
          },
        })
      )
    ] satisfies [any, any])
    .reduce<Record<string, string[]>>(
      (acc, [k, v]) => (acc[k] = Object.values(v).filter((_) => _.length > 0).map((_) => _.join('\n')), acc),
      {}
    )
}

export function makeImports<S extends ExtensionsBySchemaName>(extensionsBySchemaName: S): { [K in keyof S]: string }
export function makeImports(extensionsBySchemaName: ExtensionsBySchemaName): {} {
  return fn.map(
    makeImportsBySchemaName(extensionsBySchemaName),
    (importArray) => importArray.join('\n'),
  )
}

// let getDependenciesFromImportsBySchemaName = (extensionsBySchemaName: ExtensionsBySchemaName) => {
//   let xs = Object.values(extensionsBySchemaName)
//     .filter((_) => !!_)
//     .flatMap((_) => Object.values(_).filter((_) => !!_))
//     .flatMap((_) => Object.keys(_).filter((_) => _.startsWith('@traversable/')))

//   return Array.from(new Set(xs))
// }
