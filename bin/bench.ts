#!/usr/bin/env pnpm dlx tsx
import * as fs from 'node:fs'
import * as path from 'node:path'
import { execSync } from 'node:child_process'

import { PACKAGES as packagePaths } from 'bin/constants.js'

let TAB = ' '.repeat(4)
let NEWLINE = '\r\n'
let CR = '\r'
let INIT_CWD = process.env.INIT_CWD ?? path.resolve()
let PACKAGES = packagePaths.map((path) => path.startsWith('packages/') ? path.slice('packages/'.length) : path)

let PATHSPEC = {
  BENCH_DIR: 'bench',
  TSCONFIG: 'tsconfig.json',
  TSCONFIG_BENCH: 'tsconfig.bench.json',
  TSCONFIG_TMP: 'tsconfig.tmp.json',
  TYPELEVEL_BENCHMARK_SUFFIX: '.bench.types.ts',
} as const

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
    console.group(`${NEWLINE}Preparing benchmark run for workspace: ${pkgName}${NEWLINE}`)
    console.info(`${CR}${TAB}Temporarily moving... ${NEWLINE}${TAB} -> ${PATH.tsconfig}${NEWLINE}${TAB} -> ${PATH.tsconfigTmp}${NEWLINE}`)
    console.info(`${CR}${TAB}Temporarily moving... ${NEWLINE}${TAB} -> ${PATH.tsconfigBench}${NEWLINE}${TAB} -> ${PATH.tsconfig}${NEWLINE}`)
    console.groupEnd()
  },
  onRun: (filePath: string) => {
    console.info(`Running typelevel benchmark: ` + filePath)
  },
  onCleanup: (pkgName: string, PATH: Paths) => {
    console.group(`${NEWLINE}Cleaning up benchmark run for workspace: ${pkgName}${NEWLINE}`)
    console.info(`${CR}${TAB}Putting back... ${NEWLINE}${TAB} -> ${PATH.tsconfig}${NEWLINE}${TAB} -> ${PATH.tsconfigBench}${NEWLINE}`)
    console.info(`${CR}${TAB}Putting back... ${NEWLINE}${TAB} -> ${PATH.tsconfigTmp}${NEWLINE}${TAB} -> ${PATH.tsconfig}${NEWLINE}`)
    console.groupEnd()
  },
}

let isKeyOf = <T>(x: T, k: keyof any): k is keyof T => !!x && typeof x === 'object' && k in x
let has
  : <K extends keyof any, V = unknown>(k: K, guard?: (u: unknown) => u is V) => (x: unknown) => x is Record<K, V>
  = (k, guard) => (x): x is never => !!x && typeof x === 'object'
    && globalThis.Object.prototype.hasOwnProperty.call(x, k)
    && (guard ? guard(x[k as never]) : true)

interface Paths {
  benchDir: string
  tsconfig: string
  tsconfigBench: string
  tsconfigTmp: string
}

let makePaths
  : (pkgName: string) => Paths
  = (pkgName) => {
    let WS = path.join(path.resolve(), 'packages', pkgName)
    return {
      benchDir: path.join(WS, PATHSPEC.BENCH_DIR),
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
      fs.existsSync(PATH.benchDir)
      && fs.existsSync(PATH.tsconfig)
      && fs.existsSync(PATH.tsconfigBench)
    ) {
      let tsconfig = appendTsConfigBenchPathToTsConfig(PATH.tsconfig)
      void LOG.onPrepare(pkgName, PATH)
      void fs.rmSync(PATH.tsconfig)
      void fs.writeFileSync(PATH.tsconfigTmp, JSON.stringify(tsconfig, null, 2))
      void fs.renameSync(PATH.tsconfigBench, PATH.tsconfig)
    }
  })
}

function cleanupTypelevelBenchmarks(packages: string[]) {
  packages.forEach((pkgName) => {
    let PATH = makePaths(pkgName)
    if (
      fs.existsSync(PATH.benchDir)
      && fs.existsSync(PATH.tsconfig)
      && fs.existsSync(PATH.tsconfigTmp)
    ) {
      let tsconfig = unappendTsConfigBenchPathFromTsConfig(PATH.tsconfigTmp)
      void LOG.onCleanup(pkgName, PATH)
      void fs.rmSync(PATH.tsconfigTmp)
      void fs.renameSync(PATH.tsconfig, PATH.tsconfigBench)
      void fs.writeFileSync(PATH.tsconfig, JSON.stringify(tsconfig, null, 2))
    }
  })
}

function runTypelevelBenchmarks(packages: string[]): void {
  return void packages.forEach((pkgName) => {
    let PATH = makePaths(pkgName)
    if (
      fs.existsSync(PATH.benchDir)
      && fs.existsSync(PATH.tsconfig)
      && fs.existsSync(PATH.tsconfigTmp)
    ) {
      let packagePath = `${INIT_CWD}/packages/${pkgName}`
      let filePaths = fs
        .readdirSync(PATH.benchDir, { withFileTypes: true })
        .filter((dirent) => dirent.isFile() && dirent.name.endsWith(PATHSPEC.TYPELEVEL_BENCHMARK_SUFFIX))
        .map(({ parentPath, name }) => path.join(parentPath, name))
        .map((path) => path.startsWith(packagePath) ? '.' + path.slice(packagePath.length) : '.' + path)
      return void filePaths.forEach((filePath) => {
        void LOG.onRun(filePath)
        try { Cmd.Types(pkgName, filePath) }
        catch (e) { process.exit(1) }
      })
    }
  })
}

function main(arg: string) {
  console.log('main, arg:', arg)
  if (!isKeyOf(Script, arg)) {
    throw Error(''
      + `[bin/bench.ts]: bench script expected to receive command to run. Available commands:${NEWLINE}`
      + Object.keys(Script).join(`${NEWLINE}${TAB} - `)
    )
  }
  else return void Script[arg]()
}

main(arg)
