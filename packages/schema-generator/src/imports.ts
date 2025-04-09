import * as fs from 'node:fs'

import { t } from '@traversable/schema'
// import '@traversable/derive-validators/install'

import type { Comparator, Equal } from '@traversable/registry'
import {
  fn,
  Object_keys,
  ValueSet,
  Array_isArray,
  has,
  omit_ as omit,
  pick_ as pick,
} from "@traversable/registry"

import type { ParsedSourceFile } from './parser.js'
import {
  parseFile,
  replaceExtensions,
} from './parser.js'

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
export let AliasedImport = t.tuple(t.string, t.string)

export type NamedImport = t.typeof<typeof NamedImport>
export let NamedImport = t.union(t.string, AliasedImport)

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
export let DependenciesBySchema = t.record(SchemaDependencies)

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

// export function deduplicateDependencies<FK extends keyof SchemaDependencies>(config: Record<FK, boolean>, dependencies: DependenciesBySchema) {
//   {
//     [x: string]: Record<"@traversable/derive-validators" | "@traversable/registry" | "@traversable/schema" | "@traversable/schema-to-json-schema", DeduplicatedImports>;
// }
// {
//   [x: string]: Record<"@traversable/derive-validators" | "@traversable/registry" | "@traversable/schema" | "@traversable/schema-to-json-schema", DeduplicatedImports>;
// }
export function deduplicateDependencies<FK extends string>(
  config: Record<FK, boolean>,
  dependencies: Record<string, Record<FK, PackageImports>>
): Record<string, { [K in PackageName]: DeduplicatedImports }> {
  return fn.map(
    dependencies,
    (dependency) => {
      let init = initializeIntermediateRepresentation()
      return Object_keys(config)
        .map((k) => dependency[k])
        .reduce(
          (acc, dep) => {
            void fn.map(acc, (accValue, k) => {
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

export function makeImportArraysBySchemaName<FK extends string, Schemas extends Record<string, Record<FK, Record<string, Imports>>>>(
  config: { [K in keyof Schemas]: boolean },
  dependencies: Schemas
) {
  if (!DependenciesBySchema(dependencies)) {
    console.log('dependencies', JSON.stringify(dependencies, null, 2))
    console.error('Received invalid dependencies:', DependenciesBySchema(dependencies))
    throw Error('Received invalid dependencies; see console for full error message')
  }

  let deduplicated = deduplicateDependencies(config, dependencies);

  return Object.entries(deduplicated)
    .map(
      ([schemaName, schemaDeps]) => [
        schemaName, fn.map(
          schemaDeps,
          ({ type, term }, depName) => makeImport(
            depName, {
            type: {
              named: [...type.named.values()].sort(importComparator),
              namespace: [...type.namespace.values()].sort(stringComparator),
            },
            term: {
              named: [...term.named.values()].sort(importComparator),
              namespace: [...term.namespace.values()].sort(stringComparator),
            },
          })
        )
      ] satisfies [any, any]
    )
    .reduce<Record<string, string[]>>(
      (acc, [k, v]) => (acc[k] = Object.values(v).filter((_) => _.length > 0).map((_) => _.join('\n')), acc),
      {}
    )
}

// export function makeImports<FK extends Record<string, boolean>, T extends { [K in keyof FK]: Record<string, Imports> }>(
//   config: FK,
//   dependencies: T
// ): { [K in keyof T]: string }

export function makeImports<FK extends Record<string, boolean>, T extends Record<string, Record<string, Record<string, Imports>>>>(
  config: FK,
  dependencies: T
): { [K in keyof T]: string }

// export function makeImports<FK extends keyof SchemaDependencies, T extends Record<string, Pick<SchemaDependencies, FK>>>(
//   config: Record<FK, boolean>,
//   dependencies: T
// ): { [K in keyof T]: string }

export function makeImports<FK extends Record<string, boolean>, T extends Record<string, Record<string, Record<string, Imports>>>>(
  config: FK,
  dependencies: T
): { [K in keyof T]: string }

export function makeImports<FK extends string>(
  config: Record<FK, boolean>,
  dependencies: Record<string, Record<FK, Record<string, Imports>>>
): {} {
  // console.log('\n\n\nconfig in makeImports', config, '\n\n\n')
  // console.log('\n\n\ndependencies in makeImports', JSON.stringify(dependencies, null, 2), '\n\n\n')

  return fn.map(
    makeImportArraysBySchemaName(config, dependencies),
    (importArray) => importArray.join('\n')
  )
}


let isKeyOf = <T>(k: keyof any, t: T): k is keyof T => !!t && typeof t === 'object' && k in t


let makeSchemaFileHeader = (schemaName: string) => [
  `
/**  
 * t.${schemaName} schema
 * made with ᯓᡣ𐭩 by @traversable/schema
 */
`.trim(),
].join('\n')

let makeHeaderComment = (header: string) => [
  `///////` + '/'.repeat(header.length) + `///////`,
  `///    ` + header + `    ///`,
].join('\n')

let makeFooterComment = (footer: string) => [
  `///    ` + footer + `    ///`,
  `///////` + '/'.repeat(footer.length) + `///////`,
].join('\n')

function makeSchemaFileContent(
  schemaName: string,
  parsedSourceFiles: Record<string, ParsedSourceFile>,
  imports: string,
) {
  let withoutCore = omit(parsedSourceFiles, 'core')
  let extensions = fn.pipe(
    fn.map(withoutCore, (source) => source.body.trim()),
    Object.entries<string>,
    fn.map(([k, body]) => [
      makeHeaderComment(k),
      body,
      makeFooterComment(k),
    ].join('\n')),
  )
  let core = fn.pipe(
    fn.map(withoutCore, (_) => _.extension),
    (xs) => Object.values(xs).filter((_) => _ !== undefined),
    (exts) => replaceExtensions(
      pick(parsedSourceFiles, 'core').core.body,
      exts
    ),
  )
  return [
    makeSchemaFileHeader(schemaName),
    imports,
    ...extensions.map((ext) => '\r' + ext),
    '\r',
    core,
  ]
}

export function generateSchemas<T extends Record<string, Record<string, string>>>(
  config: Record<string, boolean>,
  sources: T,
  targets: Record<string, string>
): [path: string, content: string][]
export function generateSchemas(
  config: Record<string, boolean>,
  sources: Record<string, Record<string, string>>,
  targets: Record<string, string>
): [path: string, content: string][] {
  let parsedSourceFiles = fn.map(sources, fn.map(parseFile))
  let imports_ = fn.map(parsedSourceFiles, fn.map((_) => _.imports))
  let importsBySchemaName = makeImports({ ...config, core: true }, imports_)
  let contentBySchemaName = fn.map(parsedSourceFiles, (v, k) => makeSchemaFileContent(k, v, importsBySchemaName[k]))
  return Object.entries(contentBySchemaName).map(([k, content]) => {
    if (!isKeyOf(k, targets)) throw Error('NO target found for schema type ' + k)
    else return [targets[k], content.join('\n') + '\n'] satisfies [any, any]
  })
}

export function writeSchemas<T extends Record<string, Record<string, string>>>(
  config: Record<string, boolean>,
  sources: T,
  targets: Record<string, string>
): void
export function writeSchemas(
  ...args: [
    config: Record<string, boolean>,
    sources: Record<string, Record<string, string>>,
    targets: Record<string, string>
  ]
): void {
  let schemas = generateSchemas(...args)
  for (let [target, content] of schemas) {
    void fs.writeFileSync(target, content)
  }
}

// import { t } from '@traversable/schema'

// import type {
//   Etc as ForExample,
//   Comparator,
//   Equal,
//   Key,
// } from '@traversable/registry'

// import {
//   Array_isArray,
//   fn,
//   has,
//   Object_keys,
//   objectFromKeys,
//   ValueSet,
// } from "@traversable/registry"

// let stringEquals: Equal<string> = (l, r) => l === r
// let stringComparator: Comparator<string> = (l, r) => l.localeCompare(r)

// let importEquals: Equal<string | [string, string]> = (l, r) => {
//   if (Array_isArray(l)) {
//     if (!Array_isArray(r)) return false
//     else return l[0] === r[0] && l[1] === r[1]
//   }
//   else if (Array_isArray(r)) return false
//   else return l === r
// }

// let importComparator: Comparator<string | [string, string]> = (l, r) => {
//   if (typeof l === 'string') {
//     if (typeof r === 'string') return l.localeCompare(r)
//     else return 1
//   } else if (typeof r === 'string') return -1
//   else {
//     return l[0].localeCompare(r[0])
//   }
// }

// // export let packageNames = [
// //   '@traversable/derive-validators',
// //   '@traversable/registry',
// //   '@traversable/schema',
// //   '@traversable/schema-to-json-schema',
// // ] as const satisfies any[]
// // export type PackageName = typeof packageNames[number]
// // export let PackageName = objectFromKeys(...packageNames)

// // export let methodNames = [
// //   'core',
// //   'equals',
// //   'toJsonSchema',
// //   'toString',
// //   'validate',
// // ] as const satisfies any[]
// // export type MethodName = typeof methodNames[number]
// // export let MethodName = objectFromKeys(...methodNames)

// // export type Config = t.typeof<typeof Config>
// // export let Config = t.object(fn.map(MethodName, () => t.optional(t.eq(true))))

// export type AliasedImport = t.typeof<typeof AliasedImport>
// export const AliasedImport = t.tuple(t.string, t.string)

// export type NamedImport = t.typeof<typeof NamedImport>
// export const NamedImport = t.union(t.string, AliasedImport)

// export type Import = t.typeof<typeof Import>
// export let Import = t.object({
//   named: t.array(NamedImport),
//   namespace: t.optional(t.string),
// })

// export type Imports = t.typeof<typeof Imports>
// export let Imports = t.object({ type: Import, term: Import })

// // export type PackageImports = t.typeof<typeof PackageImports>
// // export let PackageImports = t.object(fn.map(PackageName, () => t.optional(Imports)))

// // export type SchemaDependencies_ = t.typeof<typeof SchemaDependencies>
// // export let SchemaDependencies_ = t.object(fn.map(MethodName, () => PackageImports))

// export type SchemaDependencies = t.typeof<typeof SchemaDependencies>
// export let SchemaDependencies = t.record(t.record(Imports))

// export type DependenciesBySchema = ForExample<{
//   [x in 'array']: ForExample<{
//     [x in 'toString']: ForExample<{
//       [x in `@traversable/${string}`]: Import
//     }>
//   }>
// }>

// export const DependenciesBySchema = t.of((u): u is DependenciesBySchema => t.record(SchemaDependencies)(u))

// export type DeduplicatedImport = {
//   named: ValueSet<NamedImport>
//   namespace: ValueSet<string>
// }

// export type DeduplicatedImports = {
//   type: DeduplicatedImport
//   term: DeduplicatedImport
// }

// export type ParsedImport = {
//   named: NamedImport[]
//   namespace: string[]
// }
// export type ParsedImports = {
//   type: ParsedImport
//   term: ParsedImport
// }

// let makeSpacing = (singleLine: boolean) => ({
//   bracket: singleLine ? ' ' : '\n',
//   indent: singleLine ? '' : '  ',
//   separator: singleLine ? ', ' : ',\n',
//   space: singleLine ? ' ' : '  ',
// })

// let initializeImport = () => ({ named: ValueSet.new(importEquals), namespace: ValueSet.new<string>(stringEquals) })
// let initializeImports = () => ({ type: initializeImport(), term: initializeImport() })

// function initializeIntermediateRepresentation<K extends string>(...packageNames: K[]): Record<string, DeduplicatedImports>
// function initializeIntermediateRepresentation(...packageNames: string[]) {
//   let out: { [x: string]: DeduplicatedImports } = {}
//   for (let name of packageNames) {
//     out[name] = initializeImports()
//   }
//   return out
// }


// export function makeImport(dependency: string, { term, type }: ParsedImports, maxPerLine = 3): string[] {
//   let out = Array.of<string>()
//   if (Array_isArray(type.namespace)) out.push(...type.namespace.map((ns) => `import type * as ${ns} from '${dependency}'`))
//   if (Array_isArray(term.namespace)) out.push(...term.namespace.map((ns) => `import * as ${ns} from '${dependency}'`))
//   if (Array.isArray(type.named) && type.named.length > 0) {
//     let singleLine = type.named.length <= maxPerLine
//     let $$ = makeSpacing(singleLine)
//     out.push(`import type {${$$.bracket}` +
//       type.named
//         .map((_) => typeof _ === 'string' ? `${$$.indent}${_}` : `${$$.space}${_[0]} as ${_[1]}`)
//         .join($$.separator) + `${$$.bracket}} from '${dependency}'`)
//   }
//   if (Array.isArray(term.named) && term.named.length > 0) {
//     let singleLine = term.named.length <= maxPerLine
//     let $$ = makeSpacing(singleLine)
//     out.push(`import {${singleLine ? ' ' : '\n'}` +
//       term.named
//         .map((_) => typeof _ === 'string' ? `${$$.indent}${_}` : `${$$.space}${_[0]} as ${_[1]}`)
//         .join($$.separator) + `${$$.bracket}} from '${dependency}'`)
//   }
//   return out
// }

// export function deduplicateDependencies<FK extends string>(config: Record<FK, boolean>, dependencies: DependenciesBySchema): Record<string, Record<string, DeduplicatedImports>>
// export function deduplicateDependencies(config: Record<string, boolean>, dependencies: DependenciesBySchema): Record<string, Record<string, DeduplicatedImports>> {
//   return fn.map(
//     dependencies,
//     (dependency) => {
//       let init = initializeIntermediateRepresentation()
//       return Object_keys(config)
//         .map((k) => dependency[k])
//         .reduce(
//           (acc, dep) => {
//             void fn.map(acc, (accValue, k) => {
//               if (has(k)(dep)) {
//                 if (has(k, 'type', 'namespace', t.string)(dep)) {
//                   let set = accValue.type.namespace
//                   let termlevelSet = accValue.term.namespace
//                   let ns = dep[k].type.namespace
//                   if (!termlevelSet.has(ns))
//                     set.add(ns)
//                 }
//                 if (has(k, 'type', 'named', NamedImport)(dep)) {
//                   let set = accValue.type.named
//                   let termlevelSet = accValue.term.named
//                   let names = dep[k].type.named
//                   for (let name of names)
//                     if (!termlevelSet.has(name))
//                       set.add(name)
//                 }
//                 if (t.has(k, 'term', 'namespace', t.string)(dep)) {
//                   let set = accValue.term.namespace
//                   let typelevelSet = accValue.type.namespace
//                   let ns = dep[k].term.namespace
//                   set.add(ns)
//                   if (typelevelSet.has(ns))
//                     typelevelSet.delete(ns)
//                 }
//                 if (t.has(k, 'term', 'named', NamedImport)(dep)) {
//                   let set = accValue.term.named
//                   let typelevelSet = accValue.type.named
//                   let names = dep[k].term.named
//                   for (let name of names) {
//                     set.add(name)
//                     if (typelevelSet.has(name))
//                       typelevelSet.delete(name)
//                   }
//                 }
//               }
//             })

//             return acc
//           },
//           init,
//         )
//     }
//   )
// }

// export function makeImportArraysBySchemaName<FK extends string>(
//   config: Record<FK, boolean>,
//   dependencies: Record<string, Pick<SchemaDependencies, FK>>
// ): Record<string, string[]>

// export function makeImportArraysBySchemaName(
//   config: Record<string, boolean>,
//   dependencies: Record<string, SchemaDependencies>
// ): Record<string, string[]>

// export function makeImportArraysBySchemaName(
//   config: Record<string, boolean>,
//   dependencies: Record<string, SchemaDependencies>
// ): Record<string, string[]> {
//   if (!DependenciesBySchema(dependencies)) {
//     console.error('Received invalid dependencies:', DependenciesBySchema(dependencies))
//     throw Error('Received invalid dependencies; see console for full error message')
//   }

//   return Object.entries(deduplicateDependencies(config, dependencies))
//     .map(
//       ([schemaName, schemaDeps]) => [
//         schemaName, fn.map(
//           schemaDeps,
//           ({ type, term }, depName) => makeImport(`${depName}`, {
//             type: {
//               named: [...type.named.values()].sort(importComparator),
//               namespace: [...type.namespace.values()].sort(stringComparator),
//             },
//             term: {
//               named: [...term.named.values()].sort(importComparator),
//               namespace: [...term.namespace.values()].sort(stringComparator),
//             },
//           })
//         )
//       ] satisfies [any, any]
//     )
//     .reduce(
//       (acc, [k, v]) => (acc[k] = Object.values(v).filter((_) => _.length > 0).map((_) => _.join('\n')), acc),
//       {} as Record<string, string[]>
//     )
// }

// export function makeImports<FK extends keyof SchemaDependencies, T extends Record<string, Pick<SchemaDependencies, FK>>>(
//   config: Record<FK, boolean>,
//   dependencies: T
// ): { [K in keyof T]: string }
// export function makeImports<FK extends keyof SchemaDependencies, T extends Record<string, Pick<SchemaDependencies, FK>>>(
//   config: Record<FK, boolean>,
//   dependencies: Record<string, SchemaDependencies>
// ): Record<string, string> {
//   return fn.map(makeImportArraysBySchemaName(config, dependencies), (importArray) => importArray.join('\n'))
// }
