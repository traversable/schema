#!/usr/bin/env pnpm dlx tsx
import * as fs from 'node:fs'
import * as path from 'node:path'
import { execSync } from 'node:child_process'

import { PACKAGES as packagePaths } from 'bin/constants.js'

let CR = '\r'
let INIT_CWD = process.env.INIT_CWD ?? path.resolve()
let PACKAGES = packagePaths.map((path) => path.startsWith('packages/') ? path.slice('packages/'.length) : path)

let WS = {
  NEWLINE: '\r\n',
  2: ' '.repeat(2),
  4: ' '.repeat(4),
}

let PATHSPEC = {
  BENCH_SOURCE_DIR: ['test', 'types'],
  BENCH_TARGET_DIR: 'bench',
  TSCONFIG: 'tsconfig.json',
  TSCONFIG_BENCH: 'tsconfig.bench.json',
  TSCONFIG_TMP: 'tsconfig.tmp.json',
  TYPELEVEL_BENCHMARK_SUFFIX: '.bench.types.ts',
} as const

let PATTERN = {
  RESULTS_START: 'export declare let RESULTS: [',
  RESULTS_END: ']',
}

let esc = (xs: string) => {
  let char: string | undefined = undefined
  let chars = [...xs]
  let out = ''
  while ((char = chars.shift()) !== undefined) {
    if (char === '[' || char === ']') out += `\\${char}`
    else out += char
  }
  return char
}

let REG_EXP = {
  LIBRARY_NAME: /bench\(["'`](.+):.+"/g,
  INSTANTIATION_COUNT: /\.types\s*\(\[(.+),\s*["'`]instantiations["'`]\]\)/g,
  RESULTS: new RegExp(esc(PATTERN.RESULTS_START) + '([^]*?)' + esc(PATTERN.RESULTS_END), 'g'),
}

let [, , arg /* , ...worspaces */] = process.argv
let exec = (cmd: string) => execSync(cmd, { stdio: 'inherit' })

let Cmd = {
  Terms: () => exec('BENCH=true pnpm vitest bench --outputJson benchmarks/benchmark--$(date -Iseconds).json'),
  Types: (pkg: string, path: string) => exec(`cd packages/${pkg} && pnpm dlx tsx ${path} --tsVersions '*'`),
}

let Script = {
  run: runBenchmarks,
  prepareTypes: () => prepareTypelevelBenchmarks(PACKAGES),
  runTypes: () => runTypelevelBenchmarks(PACKAGES),
  cleanupTypes: () => cleanupTypelevelBenchmarks(PACKAGES),
}

let LOG = {
  onPrepare: (pkgName: string, PATH: Paths) => {
    console.group(`${WS.NEWLINE}Preparing benchmark run for workspace: ${pkgName}${WS.NEWLINE}`)
    console.info(`${CR}${WS[4]}Temporarily moving... ${WS.NEWLINE}${WS[4]} -> ${PATH.tsconfig}${WS.NEWLINE}${WS[4]} -> ${PATH.tsconfigTmp}${WS.NEWLINE}`)
    console.info(`${CR}${WS[4]}Temporarily moving... ${WS.NEWLINE}${WS[4]} -> ${PATH.tsconfigBench}${WS.NEWLINE}${WS[4]} -> ${PATH.tsconfig}${WS.NEWLINE}`)
    console.info(`${CR}${WS[4]}Temporarily moving... ${WS.NEWLINE}${WS[4]} -> ${PATH.benchSourceDir}${WS.NEWLINE}${WS[4]} -> ${PATH.benchTargetDir}${WS.NEWLINE}`)
    console.groupEnd()
  },
  onCleanup: (pkgName: string, PATH: Paths) => {
    console.group(`${WS.NEWLINE}Cleaning up benchmark run for workspace: ${pkgName}${WS.NEWLINE}`)
    console.info(`${CR}${WS[4]}Putting back... ${WS.NEWLINE}${WS[4]} -> ${PATH.tsconfig}${WS.NEWLINE}${WS[4]} -> ${PATH.tsconfigBench}${WS.NEWLINE}`)
    console.info(`${CR}${WS[4]}Putting back... ${WS.NEWLINE}${WS[4]} -> ${PATH.tsconfigTmp}${WS.NEWLINE}${WS[4]} -> ${PATH.tsconfig}${WS.NEWLINE}`)
    console.info(`${CR}${WS[4]}Putting back... ${WS.NEWLINE}${WS[4]} -> ${PATH.benchTargetDir}${WS.NEWLINE}${WS[4]} -> ${PATH.benchSourceDir}${WS.NEWLINE}`)
    console.groupEnd()
  },
  onRun: (filePath: string) => {
    console.info(`Running typelevel benchmark: ` + filePath)
  },
}

let isKeyOf = <T>(x: T, k: keyof any): k is keyof T => !!x && typeof x === 'object' && k in x
let has
  : <K extends keyof any, V = unknown>(k: K, guard?: (u: unknown) => u is V) => (x: unknown) => x is Record<K, V>
  = (k, guard) => (x): x is never => !!x && typeof x === 'object'
    && globalThis.Object.prototype.hasOwnProperty.call(x, k)
    && (guard ? guard(x[k as never]) : true)

interface Paths {
  benchSourceDir: string
  benchTargetDir: string
  tsconfig: string
  tsconfigBench: string
  tsconfigTmp: string
}

let makePaths
  : (pkgName: string) => Paths
  = (pkgName) => {
    let WS = path.join(path.resolve(), 'packages', pkgName)
    return {
      benchSourceDir: path.join(WS, ...PATHSPEC.BENCH_SOURCE_DIR),
      benchTargetDir: path.join(WS, PATHSPEC.BENCH_TARGET_DIR),
      tsconfig: path.join(WS, PATHSPEC.TSCONFIG),
      tsconfigBench: path.join(WS, PATHSPEC.TSCONFIG_BENCH),
      tsconfigTmp: path.join(WS, PATHSPEC.TSCONFIG_TMP),
    }
  }

function runBenchmarks() {
  try { Cmd.Terms() }
  catch (_) { process.exit(0) }
}

interface TsConfig {
  references: { path: string }[]
}

let hasPath = has('path', (u) => typeof u === 'string')
let isArrayOf
  : <T>(guard: (u: unknown) => u is T) => (xs: unknown) => xs is T[]
  = (guard) => (xs): xs is never => Array.isArray(xs) && xs.every(guard)

let References = isArrayOf(hasPath)

let isTsConfig
  : (u: unknown) => u is TsConfig
  = has('references', References)

function appendTsConfigBenchPathToTsConfig(filepath: string): TsConfig {
  let tsconfig: TsConfig | undefined = void 0
  try {
    let _ = JSON.parse(fs.readFileSync(filepath).toString('utf8'))
    if (!isTsConfig(_))
      throw Error(`Expected '${PATHSPEC.TSCONFIG}' to match type \'TsConfig\' type.`)
    else {
      void (tsconfig = _)
    }
  }
  catch (e) {
    throw Error(`Could not parse '${PATHSPEC.TSCONFIG}' . Check to make sure the file is valid JSON.`)
  }
  finally {
    if (!tsconfig) throw Error('Illegal state')
    else if (!tsconfig.references.find(({ path }) => path === PATHSPEC.TSCONFIG_BENCH)) {
      tsconfig.references.push({ path: PATHSPEC.TSCONFIG_BENCH })
    }
  }
  return tsconfig
}

function unappendTsConfigBenchPathFromTsConfig(filepath: string): TsConfig {
  let tsconfig: TsConfig | undefined = void 0
  try {
    let _ = JSON.parse(fs.readFileSync(filepath).toString('utf8'))
    if (!isTsConfig(_))
      throw Error(`Expected temporary 'tsconfig.json' file at '${PATHSPEC.TSCONFIG_TMP}' to match type \'TsConfig\' type.`)
    else {
      void (tsconfig = _)
    }
  } catch (e) {
    throw Error(`Could not parse '${PATHSPEC.TSCONFIG_TMP}' . Check to make sure the file is valid JSON.`)
  } finally {
    if (!tsconfig) throw Error('Illegal state')
    let tsconfigBenchIndex = tsconfig.references.findIndex(({ path }) => path === PATHSPEC.TSCONFIG_BENCH)
    if (tsconfigBenchIndex === -1) {
      return tsconfig
    } else {
      void (tsconfig.references.splice(tsconfigBenchIndex, 1))
      return tsconfig
    }
  }
}

function prepareTypelevelBenchmarks(packages: string[]): void {
  return void packages.forEach((pkgName) => {
    let PATH = makePaths(pkgName)
    if (
      fs.existsSync(PATH.tsconfig)
      && fs.existsSync(PATH.tsconfigBench)
    ) {
      let tsconfig = appendTsConfigBenchPathToTsConfig(PATH.tsconfig)
      void LOG.onPrepare(pkgName, PATH)
      void fs.rmSync(PATH.tsconfig)
      void fs.writeFileSync(PATH.tsconfigTmp, JSON.stringify(tsconfig, null, 2))
      void fs.renameSync(PATH.tsconfigBench, PATH.tsconfig)
      void fs.renameSync(PATH.benchSourceDir, PATH.benchTargetDir)
    }
  })
}

function cleanupTypelevelBenchmarks(packages: string[]) {
  packages.forEach((pkgName) => {
    let PATH = makePaths(pkgName)
    if (
      fs.existsSync(PATH.tsconfig)
      && fs.existsSync(PATH.tsconfigTmp)
    ) {
      let tsconfig = unappendTsConfigBenchPathFromTsConfig(PATH.tsconfigTmp)
      void LOG.onCleanup(pkgName, PATH)
      void fs.renameSync(PATH.benchTargetDir, PATH.benchSourceDir)
      void fs.renameSync(PATH.tsconfig, PATH.tsconfigBench)
      void fs.rmSync(PATH.tsconfigTmp)
      void fs.writeFileSync(PATH.tsconfig, JSON.stringify(tsconfig, null, 2))
    }
  })
}

function runTypelevelBenchmarks(packages: string[]) {
  return void packages.forEach((pkgName) => {
    let PATH = makePaths(pkgName)
    if (
      fs.existsSync(PATH.tsconfig)
      && fs.existsSync(PATH.tsconfigTmp)
    ) {
      let packagePath = `${INIT_CWD}/packages/${pkgName}`
      let benchTargetPath = PATH.benchTargetDir
      let filePaths = fs
        .readdirSync(PATH.benchTargetDir, { withFileTypes: true })
        .filter((dirent) => dirent.isFile() && dirent.name.endsWith(PATHSPEC.TYPELEVEL_BENCHMARK_SUFFIX))
        .map(({ parentPath, name }) => path.join(parentPath, name))
        .map((path) => path.startsWith(packagePath) ? '.' + path.slice(packagePath.length) : '.' + path)

      void filePaths.forEach((filePath) => {
        void LOG.onRun(filePath)
        try { Cmd.Types(pkgName, filePath) }
        catch (e) { process.exit(1) }
      })

      void parseBenchFiles(benchTargetPath).forEach(({ content, filePath }) => {
        return fs.writeFileSync(filePath, content)
      })
    }
  })
}

let zip = <T>(xs: T[], ys: T[]): [T, T][] => {
  let out = Array.of<[T, T]>()
  let len = Math.min(xs.length, ys.length)
  for (let ix = 0; ix < len; ix++) {
    let x = xs[ix]
    let y = ys[ix]
    out.push([x, y])
  }
  return out
}

let resultsComparator = ({ instantiations: l }: BenchResult, { instantiations: r }: BenchResult) =>
  Number.parseInt(l) < Number.parseInt(r) ? -1
    : Number.parseInt(r) < Number.parseInt(l) ? +1
      : 0

interface BenchResult {
  libraryName: string
  instantiations: string
}

function createResults(benchResults: BenchResult[]) {
  console.log('benchResults', JSON.stringify(benchResults, null, 2))
  return `${PATTERN.RESULTS_START}${WS.NEWLINE}${benchResults.map(({ libraryName, instantiations }) =>
    `${WS[2]}{${WS.NEWLINE}${WS[4]}libraryName: "${libraryName}"${WS.NEWLINE}${WS[4]}instantiations: ${instantiations}${WS.NEWLINE}${WS[2]}}`
  ).join(`,${WS.NEWLINE}`)}\r\n${PATTERN.RESULTS_END}`
}

function parseBenchFile(benchFile: string): BenchResult[] {
  let libs = benchFile.matchAll(REG_EXP.LIBRARY_NAME)
  let results = benchFile.matchAll(REG_EXP.INSTANTIATION_COUNT)
  if (libs === null) throw Error('parseBenchFile did not find any matches in libNames')
  if (results === null) throw Error('parseBenchFile did not find any matches in instantiations')
  let libraryNames = [...libs].map(([, libName]) => libName)
  let counts = [...results].map(([, count]) => count)
  let zipped = zip(libraryNames, counts)
  return zipped
    .map(([libraryName, instantiations]) => ({ libraryName, instantiations }))
    .sort(resultsComparator)
}

interface ParsedBenchFile {
  filePath: string
  content: string
}
function parseBenchFiles(dirpath: string): ParsedBenchFile[] {
  let files = fs
    .readdirSync(dirpath, { withFileTypes: true })
  let parsedFiles = files
    .map(({ name, parentPath }) => path.join(parentPath, name))
    .map((filePath) => {
      let originalContent = fs.readFileSync(filePath).toString('utf8')
      let parsed = parseBenchFile(originalContent)
      let index = originalContent.indexOf('bench.baseline')
      let before_ = originalContent.slice(0, index).trim()
      let after_ = originalContent.slice(index).trim()
      let resultsStart = originalContent.indexOf(PATTERN.RESULTS_START)
      let resultsEnd = resultsStart === -1 ? -1 : originalContent.indexOf(PATTERN.RESULTS_END, resultsStart)
      let before = resultsStart === -1 ? before_ : originalContent.slice(0, resultsStart).trim()
      let after = resultsStart === -1 ? after_ : originalContent.slice(resultsEnd + 1).trim()
      return {
        filePath,
        content: ''
          + before
          + WS.NEWLINE
          + WS.NEWLINE
          + createResults(parsed)
          + WS.NEWLINE
          + WS.NEWLINE
          + after
          + WS.NEWLINE
      }
    })
  return parsedFiles
}

function main(arg: string) {
  if (!isKeyOf(Script, arg)) {
    throw Error(''
      + `[bin/bench.ts]: bench script expected to receive command to run. Available commands:${WS.NEWLINE}`
      + Object.keys(Script).join(`${WS.NEWLINE}${WS[4]} - `)
    )
  }
  else return void Script[arg]()
}

main(arg)
