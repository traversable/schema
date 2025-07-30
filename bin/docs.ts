#!/usr/bin/env pnpm dlx tsx
import * as fs from 'node:fs'
import { flow } from 'effect'
import { apply, pipe } from 'effect/Function'
import { Draw, Print, run, tap, topological, INTEGRATIONS_VERSIONS, LIB_VERSIONS } from './util.js'
import { PATH, PATTERN, REG_EXP, RELATIVE_PATH } from './constants.js'
import type { SideEffect, Matcher } from './types.js'

const createChartMatcher
  : (chart: string) => Matcher
  = (chart) => ({
    needle: REG_EXP.DependencyGraph,
    replacement: PATTERN.ChartReplacement(chart),
  })

const createChangelogsMatcher
  : (list: string) => Matcher
  = (list) => ({
    needle: REG_EXP.PackageList,
    replacement: PATTERN.ListReplacement(list),
  })

const mapFile
  : (fn: (file: string) => string) => (filepath: string) => SideEffect
  = (fn) => (filepath) => () => pipe(
    fs.readFileSync(filepath).toString('utf8'),
    fn,
    (content) => fs.writeFileSync(filepath, content),
  )

const write
  : (m: Matcher) => (filepath: string) => SideEffect
  = (m) =>
    mapFile(file => file.replace(m.needle, m.replacement))

const writeChart: (chart: string) => SideEffect = flow(
  createChartMatcher,
  write,
  apply(PATH.readme),
)

const writeChangelogs: (list: string) => SideEffect = flow(
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
 *   { name: '@traversable/registry', dependencies: [], order: 0 },
 *   { name: '@traversable/json', dependencies: ['@traversable/registry'], order: 1 },
 *   { name: '@traversable/schema-core', dependencies: ['@traversable/registry', '@traversable/json'], order: 2 }
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
 *     core(@traversable/schema-core) --> data(@traversable/registry)
 *     node(@traversable/schema-core) --> core(@traversable/json)
 *     node(@traversable/json) --> data(@traversable/registry)
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
const writeChartToReadme: SideEffect = flow(
  topological,
  Draw.relation,
  tap(Print.task(`[bin/docs.ts] Writing dependency graph to '${RELATIVE_PATH.readme}'`)),
  writeChart,
  run,
)

const writeChangelogsToRootReadme: SideEffect = flow(
  topological,
  Draw.changelogLink,
  writeChangelogs,
  run,
)

function docs() {
  void writeChartToReadme()
  void writeChangelogsToRootReadme()
}

const main = docs

void main()
