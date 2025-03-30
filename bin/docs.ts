#!/usr/bin/env pnpm dlx tsx
import * as fs from 'node:fs'
import { flow } from 'effect'
import { apply, pipe } from 'effect/Function'
import { Draw, Print, run, tap, topological } from './util.js'
import { PATH, PATTERN, REG_EXP, RELATIVE_PATH } from './constants.js'
import type { SideEffect, Matcher } from './types.js'

let createChartMatcher
  : (chart: string) => Matcher
  = (chart) => ({
    needle: REG_EXP.DependencyGraph,
    replacement: PATTERN.ChartReplacement(chart),
  })

let createChangelogsMatcher
  : (list: string) => Matcher
  = (list) => ({
    needle: REG_EXP.PackageList,
    replacement: PATTERN.ListReplacement(list),
  })

let mapFile
  : (fn: (file: string) => string) => (filepath: string) => SideEffect
  = (fn) => (filepath) => () => pipe(
    fs.readFileSync(filepath).toString('utf8'),
    fn,
    (content) => fs.writeFileSync(filepath, content),
  )

let write
  : (m: Matcher) => (filepath: string) => SideEffect
  = (m) =>
    mapFile(file => file.replace(m.needle, m.replacement))

let writeChart: (chart: string) => SideEffect = flow(
  createChartMatcher,
  write,
  apply(PATH.readme),
)

let writeChangelogs: (list: string) => SideEffect = flow(
  createChangelogsMatcher,
  write,
  apply(PATH.readme),
)

/**
 * {@link writeToReadme `writeToReadme`} creates a text-based diagram of the
 * project's dependency graph and writes it to the root `README.md` file.
 *
 * The dependency graph it consumes looks something like this:
 *
 * ```
 * [
 *   { name: '@traversable/data', dependencies: [], order: 0 },
 *   { name: '@traversable/core', dependencies: ['@traversable/data'], order: 1 },
 *   { name: '@traversable/node', dependencies: ['@traversable/core', '@traversable/data'], order: 2 }
 * ]
 * ```
 *
 * which produces this diagram:
 *
 * ```
 * flowchart TD
 *     core(@traversable/core) --> data(@traversable/data)
 *     node(@traversable/node) --> core(@traversable/core)
 *     node(@traversable/node) --> data(@traversable/data)
 * ```
 *
 * The `README.md` file contains a block that looks like this:
 *
 * ```
 * ```mermaid
 * ```
 * ```
 *
 * The contents of that block (if any) will be replaced with the diagram.
 */
let writeChartToReadme: SideEffect = flow(
  topological,
  Draw.relation,
  tap(Print.task(`[bin/docs.ts] Writing dependency graph to '${RELATIVE_PATH.readme}'`)),
  writeChart,
  run,
)

let writeChangelogsToRootReadme: SideEffect = flow(
  topological,
  Draw.changelogLink,
  writeChangelogs,
  run,
)

let copyReadmeToSchemaWorkspace: SideEffect = () => {
  let README = fs.readFileSync(PATH.readme).toString('utf8').split('## Dependency graph')[0]
  void fs.writeFileSync(PATH.schemaReadme, README)
}

function docs() {
  return (
    void writeChartToReadme(),
    void writeChangelogsToRootReadme(),
    void copyReadmeToSchemaWorkspace()
  )
}

let main = docs

void main()
