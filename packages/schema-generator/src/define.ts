import type { ParsedExtensionFile } from './parser.js'

export type DefineExtension = Required<ParsedExtensionFile>

export function defineExtension(extension: DefineExtension): DefineExtension {
  return extension
}
