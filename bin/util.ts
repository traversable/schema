import * as fs from "node:fs"
import * as path from "node:path"
import { Schema as S } from "effect"
import { graphSequencer } from '@pnpm/deps.graph-sequencer'
import prettifySync from "@prettier/sync"
import type { any } from "any-ts"
import { Effect, Order, Array as array, flow, Record as object, pipe } from "effect"

import { PackageJson } from "./schema.js"
import { 
  PACKAGES,
  REPO,
  REG_EXP,
} from "./constants.js"
import type { 
  Graph,
  Node,
  SideEffect,
  Workspace,
} from "./types.js"

export const PACKAGE_JSONS
  : () => PackageJson[] 
  = () => PACKAGES.map(
    flow(
      (dirpath) => path.join(dirpath, `package.json`),
      (file) => fs.readFileSync(file),
      (buffer) => buffer.toString(`utf8`),
      (string) => globalThis.JSON.parse(string),
      (unknown) => S.decodeUnknown(PackageJson)(unknown),
      (effect) => Effect.runSync(effect),
    )
  )

export interface Tree<T> {
  value: T
  children: readonly Tree<T>[]
}
export namespace Tree {
  /**
   * @example
   *  assert.equal(
   *    Tree.draw({
   *      value: "abc",
   *      children: [
   *        { value: "def", children: [] },
   *        {
   *          value: "ghi",
   *          children: [
   *            { value: "jkl", children: [] },
   *            { value: "mno", children: [] },
   *          ]
   *        }
   *      ]
   *    }),
   *    `├─ abc
   *     │  └─ def
   *     └─ ghi
   *       ├─ jkl
   *       └─ mno`
   *  )
   */
  export const draw
    : (indentation: string, children: Tree<string>[`children`]) => Tree<string>[`value`]
    = (indentation, children) => {
      let r = ``
      let tree: Tree<string>
      for (let ix = 0, len = children.length; ix < len; ix++) {
        tree = children[ix]
        const isLast = ix === len - 1
        r += indentation.concat(isLast ? `└` : `├`).concat(`─ `).concat(tree.value)
        r += Tree.draw(indentation.concat(len > 1 && !isLast ? `│  ` : `   `), tree.children)
      }
      return r
    }
}

export type indexBy<K extends any.index, T extends { [P in K]: keyof any }> = never | { [U in T as U[K]]: U }

export function indexBy<const K extends keyof any>(index: K):
  <const T extends readonly ({ [P in K]: keyof any })[]>(array: T) => { [U in T[number] as U[K]]: U }
export function indexBy<const K extends keyof any>(index: K) {
  return (array: readonly ({ [P in K]: keyof any })[]) => 
    array.reduce((acc, x) => ({ ...acc, [x[index]]: x }), {})
}

export const run 
  : <T>(eff: SideEffect<T>) => T
  = (eff) => eff()


/** 
 * ## {@link localTime `localTime`}
 * @example
 *  const now = localTime()
 * 
 *  console.log(now) 
 *  // => 
 */
export const localTime = () => {
  const d = new globalThis.Date()
  const ts = d.toLocaleTimeString()
  return ts.slice(0, -3) + "." + `${Math.round(d.getMilliseconds() / 10)}`.padStart(2, "0").concat(ts.slice(-2))
}

const throw_
  : (x: unknown) => never
  = (x) => { throw x }

export const rimraf 
  : (path: string) => void
  = (path) => fs.rmSync(path, { recursive: true, force: true })

export const log
  : (...args: globalThis.Parameters<typeof globalThis.console.log>) => void
  = (...args) => () => globalThis.console.log(...args)

const reset 
  : (string: string) => string
  = (string) => `\x1B[0m${string}\x1B[0m`

const Print_format
  : (open: string, close: string, replace?: string) => (text: string | number) => string
  = (open, close, replace) => text => `${open}${text}${replace ?? close}`

export declare namespace Print {
  export {
    _with as with,
    Print_format as format,
  }
}

export function Print(...args: Parameters<typeof globalThis.console.log>): void 
export function Print(...args: Parameters<typeof globalThis.console.log>) {
  return globalThis.console.log(...args)
}

export namespace Print {
  export const indent = `    `
  export const lightBlue = Print_format(`\x1B[104m`, `\x1B[254m`, `\x1B[0m`)
  export const task = (text: string) => Print(`\n\n${Print.hush(`❲🌳❳`)} ${text}\n`)
  export const subtask = (text: string) => Print(`\n\n${Print.hush(`❲🌳❳`)} ${text}\n`)
  // export const task = (text: string) => lightBlue(`𝜟  ${text}`)
  export const hush = Print_format(`\x1B[2m`, `\x1B[22m`)
  export const strong = Print_format(`\x1B[1m`, `\x1B[22m`, `\x1B[22m\x1B[0m`)
  export const greenText = Print_format(`\x1B[32m`, `\x1B[39m`)
  // 234 bg 254 foreground   234 foreground 12 background
  export const whiteText = Print_format(`\x1B[37m`, `\x1B[39m`)
  export const blackBackground = Print_format(`\x1B[40m`, `\x1B[49m`)
  export const invert = Print_format(`\x1B[7m`, `\x1B[27m`)
  // export const toplevel = (text: string) => lightBlue(text)

  export const _with = {
    reset,
    invert,
    underline: Print_format(`\x1B[4m`, `\x1B[24m`),
    bold: Print_format(`\x1B[1m`, `\x1B[22m`, `\x1B[22m\x1B[0m`),
    italic: Print_format(`\x1B[3m`, `\x1B[23m`),
    fg: {
      green: Print_format(`\x1B[32m`, `\x1B[39m`),
      gray: Print_format(`\x1B[90m`, `\x1B[39m`),
      dim: Print_format(`\x1B[2m`, `\x1B[22m`),
    },
    bg: {
      black: blackBackground,
    },
  } as const
  export const toString 
    : (x: unknown) => string
    = (x) => globalThis.JSON.stringify(x, null, 2)

  Print.with = _with
  Print.format = Print_format
}

export namespace Transform {
  /** @internal */
  const Ends = {
    before: "export default ",
    after: " as const",
  } as const

  export const toMetadata 
    : (_: readonly [readPath: string, writePath: string]) => void
    = ([readPath, writePath]) => fs.writeFileSync(
      writePath, 
      Ends.before.concat(
        Transform.prettify(
          fs.readFileSync(readPath)
            .toString(`utf8`))
            .trim()
            .concat(Ends.after),
      )
    )

  export const toCamelCase
    : (s: string) => string
    = (s) => s.replace(REG_EXP.WordBoundary, (m) => m.toUpperCase().replace('-', '').replace('_', ''))

  export function prettify(input: unknown): string {
    if (typeof input === "string") {
      try { return prettifySync.format(input, { parser: `json`, printWidth: 80 }) }
      catch (e) { return prettifySync.format(input, { parser: `babel` }) }
    }
    else {
      return prettify(globalThis.JSON.stringify(input))
    }
  }
}

export const deriveShortView
  : (graph: Graph) => string
  = (graph) => Tree.draw(
    "\n",
    graph.map(n => ({
      value: n.name,
      children: n.dependencies.map(d => ({ value: d, children: [] })),
    })),
  )

const prefix = `${REPO.scope}/`
/**
 * @example
 *  assert.equal(
 *    withoutPrefix("@traversable/core"),
 *    "core",
 *  )
 */
const withoutPrefix = (name: string) => name.substring(prefix.length)

/**
 * @example
 *  assert.equal(
 *    wrap("@traversable/core"),
 *    "core(@traversable/core)",
 *  )
 */
const wrap = (name: string) => withoutPrefix(name).concat(`(${name})`)

/**
 * @example
 *  assert.equal(
 *    bracket("@traversable/core"),
 *    "[@traversable/core](./packages/core)",
 *  )
 */
const bracket = (name: string, version: string): `[${string}](./packages/${string})` => 
  `[\`${name + "@" + version}\`](./packages/${withoutPrefix(name)})` as const

/**
 * @example
 *  assert.equal(
 *    drawRelation({ name: "@traversable/core" })("@traversable/data"),
 *    "core(@traversable/core) -.-> data(@traversable/data)",
 *  )
 */
const drawRelation
  : (pkg: Node) => (dep: string) => string
  = (pkg) => (dep) => wrap(pkg.name).concat(` -.-> `).concat(wrap(dep))

export const drawChangelogLineItem = (pkg: { name: string, version: string }) => `${
  bracket(pkg.name, pkg.version)
} - [CHANGELOG](${
  `https://github.com/traversable/shared/blob/main/packages/${withoutPrefix(pkg.name)}/CHANGELOG.md`
})`

export namespace Draw {
  export const relation
    : (graph: Graph) => string
    = flow(
      array.flatMap(pkg => pkg.dependencies.length === 0 ? [wrap(pkg.name)] : pkg.dependencies.map(drawRelation(pkg))),
      (xs) => [...xs.slice(0, -1), xs[xs.length -1].replace("-.->", "-.depends on.->")],
      array.prepend(`flowchart TD`),
      array.join(`\n    `),
    )

  export const changelogLink
    : (graph: Graph) => string
    = flow(
      array.map(
        flow(
          drawChangelogLineItem,
          (md) => `- ${md}` as const,
        ),
      ),
      array.join(`\n`),
    )
}

const isLocalWorkspace 
  : (dep: string) => boolean
  = (dep) => dep.startsWith(REPO.scope)

const filterDependencies
  : (ws: Workspace) => Workspace["dependencies"]
  = (ws) => ws.dependencies.filter(isLocalWorkspace)

export const topological
  : () => Graph
  = () => {
    const deps = 
      PACKAGE_JSONS().map(({ name, version, devDependencies: deps }) => ({
        name,
        version,
        dependencies: globalThis.Object.keys(deps ?? {}).filter(isLocalWorkspace),
      }))

    const chunks: string[][] = pipe(
      deps,
      array.map((ws) => [ws.name, filterDependencies(ws)] as const),
      (xss) => new globalThis.Map(xss),
      graphSequencer,
      (seq) => seq.chunks,
    )

    const pkgByName: globalThis.Record<string, Workspace> = pipe(
      deps,
      indexBy(`name`),
      object.map((byName) => ({
        ...byName,
        dependencies: filterDependencies(byName),
      })),
    )

    const graph: Graph = pipe(
      chunks,
      array.flatMap(
        (chunk, ix) => chunk.map(
          (pkgName) => pkgName in pkgByName
            ? ({ ...pkgByName[pkgName], order: ix, })
            : throw_(`Unrecognized package name: ${pkgName}`),
        ),
      ),
      array.sort(Order.struct({ name: Order.string })),
      array.sort(Order.struct({ order: Order.number })),
    )

    return graph
  }

// export const tap 
//   : <T, U>(fn: (t: T) => U) => (t: T) => T
//   = (fn) => (t) => (fn(t), t)
export function tap<T>(msg?: string): (x: T) => T 
export function tap<T>(msg?: string | void): (x: T) => T 
export function tap<T>(msg?: string, toString?: (x: T) => string): (x: T) => T 
export function tap<T>(msg: string | void = "", toString: (x: T) => string = (x: T) => JSON.stringify(x, null, 2)): (x: T) => T {
  return (x: T) => (
    console.debug(msg, toString(x)),
    x
  )
}

export const toMilli 
  : (nano: number) => number
  = (n) => n / 1e6

export const fromMilli 
  : (milli: number) => number
  = (m) => m * 1e6

export const toSeconds
  : (milli: number) => number
  = (m) => m / 1e3

export const fromSeconds
  : (seconds: number) => number
  = (s) => s * 1e3

export const fromNumber
  : (n: number) => bigint
  = globalThis.BigInt
 
export const toNumber
  : (n: bigint) => number
  = globalThis.Number

/** 
 * ## {@link Big `bin/Big`}
 * 
 * Represents the natural isomorphism between
 * `number` and `bigint`.
 */
export const Big = {
  toNumber,
  fromNumber,
}

/** 
 * ## {@link Nano `bin/Nano`}
 * 
 * Natural isomorphism between milliseconds <> nanoseconds
 */
export const Nano = {
  toMilli,
  fromMilli,
}

/** 
 * ## {@link Milli `bin/Milli`}
 * 
 * Natural isomorphism between milliseconds <> seconds
 */
export const Milli = {
  toSeconds,
  fromSeconds,
}

/** 
 * ## {@link Fix `bin/Fix`}
 * 
 * Adjunction between floating point numbers and
 * their fixpoint, given a number of fractional digits.
 */
export const Fix = {
  toFixed: (digits: number) => (float: number): string => float.toFixed(digits),
  fromFixed: (fixed: string): number => globalThis.Number.parseFloat(fixed),
}

/** 
 * ## {@link diff `bin/diff`}
 * 
 * Converts a bigint to a human-readable format. Useful when used
 * with, for example, {@link process.hrtime.bigint `process.hrtime.bigint`}.
 */
export const diff = flow(
  Big.toNumber,
  Nano.toMilli,
  Milli.toSeconds,
  Fix.toFixed(3),
)
