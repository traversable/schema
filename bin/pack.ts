#!/usr/bin/env pnpm dlx tsx
import * as path from "node:path"
import * as Effect from "effect/Effect"
import * as Order from "effect/Order"
import * as object from "effect/Record"
import { pipe, Schema as S } from "effect"

import * as fs from "./fs.js"
import { Print, run } from "./util.js"
import { PACKAGES, RELATIVE_PATH, SCOPE } from "./constants.js"
import { PackageJson } from "./schema.js"
import type { SideEffect as IO } from "./types.js"

function make(pkgName: string) {
  const ws = path.resolve(pkgName)
  return pipe({
    hasMainEsm: fs.existsSync(`${ws}/build/esm/index.js`),
    hasMainCjs: fs.existsSync(`${ws}/build/cjs/index.js`),
  }, ({ hasMainEsm, hasMainCjs }) => ({
    hasMainEsm,
    hasMainCjs,
    hasMain: hasMainEsm || hasMainCjs,
    hasSrc: fs.existsSync(`${ws}/src`),
    hasDts: fs.existsSync(`${ws}/build/dts`),
    hasEsm: fs.existsSync(`${ws}/build/esm`),
    hasCjs: fs.existsSync(`${ws}/build/cjs`),
    packageJson: pipe(
      fs.readFileSync(`${ws}/package.json`).toString("utf8"),
      globalThis.JSON.parse,
      S.decodeUnknown(PackageJson),
      Effect.runSync,
    ),
  }))
}

const getModules = (pkgName: string) => {
  const ws = path.resolve(pkgName)
  const ctx = make(pkgName)
  return () => pipe(
    {
      include: ctx.packageJson[SCOPE]?.generateExports?.include ?? [],
      exclude: ctx.packageJson[SCOPE]?.generateExports?.exclude ?? [],
    },
    ({ include, exclude }) => fs.glob(
      include.map((_) => `${ws}/src/${_}`),
      {
        nodir: true,
        // cwd: `${ws}/src`,
        ignore: [
          ...exclude.map(_ => `${ws}/${_}`),
          ...RELATIVE_PATH.ignoreGlobs.map((ignore) => `${ws}/${ignore}`),
        ],
      }
    ),
    (xs) => xs.map((x) => x.toString()),
    (xs) => xs.sort(Order.string),
    (modules) => ({
      ctx,
      ws,
      modules,
    })
  )
}

export const workspaceTasks
  : (pkgName: string) => IO
  = (pkgName) => {
    const extractModuleName = (path: string) => path.slice(path.lastIndexOf(`/`) + 1, path.lastIndexOf(`.`))
    const { ctx, modules, ws } = getModules(pkgName)()

    const buildPackageJson = () => {
      const out: globalThis.Record<string, any> = {
        name: ctx.packageJson.name,
        version: ctx.packageJson.version,
        description: ctx.packageJson.description,
        repository: ctx.packageJson.repository,
        sideEffects: ["/dist/cjs/", "/dist/esm/"].flatMap(dir =>
          (ctx.packageJson.sideEffects || []).map(_ =>
            _.replace(".ts", ".js").replace("/src/", dir)
          )
        ),
      }

      const addOptional = (key: keyof PackageJson & string) => {
        if (ctx.packageJson[key])
          out[key] = ctx.packageJson[key]
      }

      addOptional("dependencies")
      addOptional("peerDependencies")
      addOptional("peerDependenciesMeta")
      addOptional("gitHead")
      addOptional("bin")

      void (ctx.hasMainCjs && (out.main = `./dist/cjs/index.js`))
      void (ctx.hasMainEsm && (out.module = `./dist/esm/index.js`))
      void (ctx.hasMain && ctx.hasDts && (out.types = `./dist/dts/index.d.ts`))
      void (out.exports = { "./package.json": `./package.json` })
      void (ctx.hasMain && (out.exports[`.`] = {
        ...ctx.hasDts && { types: `./dist/dts/index.d.ts` },
        ...ctx.hasMainEsm && { import: `./dist/esm/index.js` },
        ...ctx.hasMainCjs && { default: `./dist/cjs/index.js` },
      }))

      if (modules.length > 0) {
        void (out.exports = {
          ...out.exports,
          ...object.fromEntries(
            modules
              .map(extractModuleName)
              .map((_) => {
                const conditions = {
                  ...ctx.hasDts && { types: `./dist/dts/${_}.d.ts` },
                  ...ctx.hasEsm && { import: `./dist/esm/${_}.js` },
                  ...ctx.hasCjs && { default: `./dist/cjs/${_}.js` },
                }
                return [`./${_}`, conditions]
              }),
          ),
        })

        void (
          out.typesVersions = {
            "*": object.fromEntries(
              modules
                .map(extractModuleName)
                .map((_) => [_, [`./dist/dts/${_}.d.ts`]]),
            )
          }
        )
      }

      return out
    }

    const createProxies: IO =
      () => modules
        .map(extractModuleName)
        .forEach((_) => (
          !fs.existsSync(`${ws}/dist/${_}`) && fs.mkdirSync(`${ws}/dist/${_}`),
          void pipe(
            {
              main: path.relative(`dist/${_}`, `dist/dist/cjs/${_}.js`),
              module: path.relative(`dist/${_}`, `dist/dist/esm/${_}.js`),
              types: path.relative(`dist/${_}`, `dist/dist/dts/${_}.d.ts`),
              sideEffects: [],
            },
            fs.writeJson(`${ws}/dist/${_}/package.json`),
          )
        )
        )

    const writePackageJson = (): void => void pipe(
      buildPackageJson(),
      (_) => globalThis.JSON.stringify(_, null, 2).concat("\n"),
      fs.writeString(`${ws}/dist/package.json`),
    )

    const remakeDist: IO = () => void fs.rmAndMkdir(`${ws}/dist`)
    const copyReadme: IO = () => void fs.copy(`${ws}/README.md`, `${ws}/dist/README.md`)

    const copyEsm = (): void => void (
      ctx.hasEsm && (
        fs.rmAndCopy(`${ws}/build/esm`, `${ws}/dist/dist/esm`),
        fs.writeJson(`${ws}/dist/dist/esm/package.json`)({
          type: "module",
          sideEffects: [],
        })
      )
    )

    const copyCjs: IO = () => void (
      ctx.hasCjs && fs.rmAndCopy(`${ws}/build/cjs`, `${ws}/dist/dist/cjs`)
    )

    const copyDts: IO = () => void (
      ctx.hasDts && fs.rmAndCopy(`${ws}/build/dts`, `${ws}/dist/dist/dts`)
    )

    const copySrc: IO = () => ctx.hasSrc && void (
      fs.copy(`${ws}/${RELATIVE_PATH.src}`, `${ws}/${RELATIVE_PATH.dist_src}`)
    )

    const tasks: IO[][] = [
      [remakeDist],
      [
        writePackageJson,
        copyReadme,
        copyEsm,
        copyCjs,
        copyDts,
        copySrc,
        createProxies,
      ]
    ]

    return () => tasks.forEach(ios => ios.forEach(run))
  }

function pack(): void {
  return (
    void Print.task(`[bin/build/pack]: Building \`dist\` folders`),
    void PACKAGES.forEach((pkg) => workspaceTasks(pkg)())
  )
}

const main = pack

void main()
