import * as fs from 'node:fs'
import {
  fn,
  omit_ as omit,
  pick_ as pick,
} from "@traversable/registry"

import type { ParsedSourceFile, ParsedExtensionFile } from './parser.js'
import {
  parseExtensionFile,
  parseFile,
  replaceExtensions,
} from './parser.js'
import { makeImports } from './imports.js'

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
  parsedExtensionFile: ParsedExtensionFile,
  imports: string,
) {
  let core = replaceExtensions(pick(parsedSourceFiles, 'core').core.body, parsedExtensionFile)
  let noCore = omit(parsedSourceFiles, 'core')
  let files = fn.pipe(
    fn.map(noCore, (source) => source.body.trim()),
    Object.entries<string>,
    fn.map(([k, body]) => [
      makeHeaderComment(k),
      body,
      makeFooterComment(k),
    ].join('\n')),
  )

  return [
    makeSchemaFileHeader(schemaName),
    imports,
    ...files.map((ext) => '\r' + ext),
    '\r',
    core,
  ]
}

export function generateSchemas<T extends Record<string, Record<string, string>>>(
  sources: T,
  targets: Record<string, string>
): [path: string, content: string][]

export function generateSchemas(
  sources: Record<string, Record<string, string>>,
  targets: Record<string, string>
): [path: string, content: string][] {
  let parsedSourceFiles = fn.map(sources, fn.map(parseFile))
  let exts = fn.map(sources, (src) => pick(src, 'extension').extension)
  let noExts = fn.map(parsedSourceFiles, (src) => omit(src, 'extension'))
  let parsedExtensionFiles = fn.map(exts, parseExtensionFile)
  let importsBySchemaName = makeImports(fn.map(parsedSourceFiles, fn.map((_) => _.imports)))
  let contentBySchemaName = fn.map(
    noExts,
    (v, k) => makeSchemaFileContent(k, v, parsedExtensionFiles[k], importsBySchemaName[k])
  )

  return Object.entries(contentBySchemaName).map(([k, content]) => {
    if (!isKeyOf(k, targets)) throw Error('No write target found for schema type "' + k + '"')
    else return [targets[k], content.join('\n') + '\n'] satisfies [any, any]
  })
}

export function writeSchemas<T extends Record<string, Record<string, string>>>(sources: T, targets: Record<string, string>): void
export function writeSchemas(...args: [sources: Record<string, Record<string, string>>, targets: Record<string, string>]): void {
  let schemas = generateSchemas(...args)
  for (let [target, content] of schemas) {
    void fs.writeFileSync(target, content)
  }
}
