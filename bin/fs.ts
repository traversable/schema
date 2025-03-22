import * as fs from "node:fs"
import * as Glob from "glob"
import * as Effect from "effect/Effect"
import * as S from "effect/Schema"
import { pipe } from "effect/Function"
import { type ParseError } from "effect/ParseResult"

import { flow } from "effect"
import { Transform } from "./util.js"
import { EMOJI } from "./constants.js"

export * from "node:fs"

export namespace is {
  export const dir = (path: string) => fs.statSync(path).isDirectory()
  export const file = (path: string) => fs.statSync(path).isFile()
  export const link = (path: string) => fs.statSync(path).isSymbolicLink()
}

export namespace config {
  export namespace rmdir {
    export interface options extends fs.RmOptions { }
    export const defaults = { recursive: true, force: true } satisfies config.rmdir.options
  }
  export namespace mkdir {
    export interface options extends fs.MakeDirectoryOptions { recursive: true }
    export const defaults = { recursive: true, mode: 0o777 } satisfies config.mkdir.options
  }
  export namespace glob {
    export interface options extends Glob.GlobOptions { }
    export const defaults = {} satisfies config.glob.options
  }
  export namespace copy {
    export interface options extends fs.CopyOptions { }
    export const defaults = { recursive: true } satisfies config.copy.options
  }
}

/** 
 * ## {@link map `fs.map`} 
 * 
 * Given a schema describing the JSON you expect to parse out of a file,
 * and a function to run on the parsed JSON, {@link file.map `file.map`}
 * returns a function a single argument, which is the path to the file
 * you want to apply the function to.
 * 
 * **Note:** unlike {@link writer `fs.writer`}, {@link map `fs.map`} is pure.
 * 
 * **Note:** if the file at `pathspec` fails to parse with the provided
 * schema, by default, an error will be thrown. Error handling is configurable
 * via {@link map.Options `fs.map.Options`}.
 * 
 * - When **1 argument is provided**, the mapping function will be applied to
 * the file at `pathspec`'s contents, the output is stringified, and `pathspec`
 * is overwritten.
 * 
 * - When **2 arguments are provided**, the mapping function will be applied to
 * the file at `sourcePath`'s contents, and the output will be stringified and 
 * written to `targetPath`.
 */
export function map<T, U>(schema: S.Schema<T>, fn: (t: T) => U): (pathspec: string) => U
export function map<T, U, E = never>(schema: S.Schema<T>, fn: (t: T) => U, options: map.Options<T, E>): (pathspec: string) => U
export function map<T, U, E = never>(schema: S.Schema<T>, fn: (t: T) => U, options?: map.Options<T, E>): (pathspec: string) => U
/// impl.
export function map<T, U, E>(
  schema: S.Schema<T>,
  fn: (t: T) => U, {
    deserialize = map.defaults.deserialize,
    handleFileNotFound = map.defaults.handleFileNotFound,
    handleParseError = map.defaults.handleParseError,
  }: map.Options<T, E> = map.defaults
): (pathspec: string) => U {
  return (pathspec: string) => pipe(
    Effect.try({
      try: () => fs.readFileSync(pathspec).toString("utf8"),
      catch: () => handleFileNotFound(pathspec),
    }),
    Effect.flatMap(
      flow(
        deserialize,
        S.decode(schema, { onExcessProperty: "preserve" }),
        Effect.mapError(handleParseError),
      )
    ),
    Effect.map(fn),
    Effect.runSync,
  )
}

export function mkdir<T extends string>(dirpath: T, options?: config.mkdir.options): void
/// impl.
export function mkdir<T extends string>(
  dirpath: T, {
    recursive = config.mkdir.defaults.recursive,
    mode = config.mkdir.defaults.mode,
    ...options
  }: config.mkdir.options = config.mkdir.defaults
): void {
  if (fs.existsSync(dirpath))
    if (is.dir(dirpath)) return void 0;
    else throw globalThis.Error(
      `${EMOJI.ERR} < Error!\nDid not attempt to create a directory: The item at path '${dirpath
      }' exists, and is not a directory. `
    )
  else return void fs.mkdirSync(
    dirpath,
    { ...options, mode, recursive }
  )
}

export function writeString(pathspec: string): (contents: string) => void
export function writeString(pathspec: string) {
  return (contents: string) =>
    void fs.writeFileSync(
      pathspec,
      contents,
    )
}

type Json =
  | null
  | boolean
  | number
  | string
  | readonly Json[]
  | { [x: string]: Json }

export function writeJson(pathspec: string): {
  (json: Json): void
  (json: {}): void
}
export function writeJson(pathspec: string) {
  return flow(
    globalThis.JSON.stringify,
    Transform.prettify,
    writeString(pathspec),
  )
}

export declare namespace writeFileSync {
  type pathspec = Parameters<typeof fs.writeFileSync>[0]
  type data = Parameters<typeof fs.writeFileSync>[1]
  type unary = never | [pathspec: writeFileSync.pathspec]
  type binary = never | [pathspec: writeFileSync.pathspec, data: writeFileSync.data]
}

export function writeFileSync(pathspec: writeFileSync.pathspec): (data: writeFileSync.data) => void
export function writeFileSync(...args: writeFileSync.binary): void
export function writeFileSync(
  ...args:
    | writeFileSync.unary
    | writeFileSync.binary
) {
  if (args.length === 1)
    return (data: writeFileSync.data) =>
      writeFileSync(...args, data)
  else return fs.writeFileSync(...args)
}

export const rimraf
  : (pathspec: string) => void
  = (pathspec: string) => fs.rmSync(pathspec, { recursive: true, force: true })

export const touch
  : (pathspec: fs.PathOrFileDescriptor) => void
  = (pathspec) => fs.writeFileSync(pathspec, "")

export function glob(
  pattern: string | readonly string[],
  options: config.glob.options = config.glob.defaults,
): string[] | Glob.Path[] {
  return Glob.globSync(
    typeof pattern === "string" ? pattern : [...pattern],
    options,
  )
}

export function rmdir(
  pathspec: string,
  options: config.rmdir.options = config.rmdir.defaults,
) { return fs.rmSync(pathspec, options) }

export function rmAndMkdir(pathspec: string) {
  void rmdir(pathspec, config.rmdir.defaults)
  void mkdir(pathspec)
}

export function copy(
  source: string,
  target: string,
  { recursive = config.copy.defaults.recursive }
    : config.copy.options
    = config.copy.defaults
): void {
  return void fs.cpSync(source, target, { recursive })
}

export function rmAndCopy(
  source: string,
  target: string,
): void {
  return void (
    rmdir(target, config.rmdir.defaults),
    copy(source, target)
  )
}

export declare namespace map {
  interface Options<T, E> {
    handleFileNotFound?(pathspec: string): E
    handleParseError?(e: ParseError): E
    deserialize?(content: string): T
  }
}
export namespace map {
  export const defaults = {
    handleFileNotFound(e) { throw globalThis.Error("File not found:" + JSON.stringify(e, null, 2)) },
    handleParseError(e) { throw globalThis.Error("Parse error:" + JSON.stringify(e, null, 2)) },
    deserialize: globalThis.JSON.parse,
  } satisfies Required<map.Options<any, any>>
}


/** 
 * ## {@link writer `file.writer`} 
 * 
 * Given a schema describing the JSON you expect to parse out of a file,
 * and a function to run on the parsed JSON, {@link writer `file.writer`}
 * returns a function that expects 1 or 2 arguments.
 * 
 * - When **1 argument is provided**, the mapping function will be applied to
 * the file at `pathspec`'s contents, the output is stringified, and `pathspec`
 * is overwritten.
 * 
 * - When **2 arguments are provided**, the mapping function will be applied to
 * the file at `sourcePath`'s contents, and the output will be stringified and 
 * written to `targetPath`.
 */
export function writer<T, U>(schema: S.Schema<T>, fn: (t: T) => U): {
  (pathspec: string): () => void
  (sourcePath: string, targetPath: string): () => void
}
export function writer<T, U, E>(schema: S.Schema<T>, fn: (t: T) => U, options: writer.Options<T, U, E>): {
  (pathspec: string): () => void
  (sourcePath: string, targetPath: string): () => void
}
/// impl.
export function writer<T, U, E>(schema: S.Schema<T>, fn: (t: T) => U, options?: writer.Options<T, U, E>) {
  return (source: string, target: string = source) => {
    pipe(
      source,
      map(schema, fn, options),
      options?.serialize ?? writer.defaults.serialize,
      writeString(target),
    )
  }
}

export declare namespace writer {
  interface withSerializer<U> { serialize?(content: U): string }
  interface Options<T, U, E> extends
    map.Options<T, E>,
    writer.withSerializer<U> { }
}
export namespace writer {
  export const defaults = {
    serialize(content) { return globalThis.JSON.stringify(content, null, 2) },
  } satisfies Required<writer.withSerializer<any>>
}
