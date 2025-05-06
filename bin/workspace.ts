import * as process from 'node:child_process'
import * as path from 'node:path'
import { identity, pipe, Effect } from 'effect'

import * as fs from './fs.js'
import { template, getReadmeTemplate } from './assets/index.js'
import { Print, tap, Transform } from './util.js'
import * as S from 'effect/Schema'
import { ALPHABET_MAP, TEMPLATE as Template, SCOPE } from 'bin/constants.js'

const $$ = (command: string) => process.execSync(command, { stdio: 'inherit' })
let ix = 0


const PATH = {
  packages: path.join(path.resolve(), 'packages'),
  vitestSharedConfig: path.join(path.resolve(), 'vite.config.ts'),
  rootTsConfig: path.join(path.resolve(), 'tsconfig.json'),
  rootTsConfigBase: path.join(path.resolve(), 'tsconfig.base.json'),
  rootTsConfigBuild: path.join(path.resolve(), 'tsconfig.build.json'),
} as const

const PATTERN = {
  PkgName: Template.new('pkgName'), // `${Template.Start}([^]*?)${Template.End}`,
  PkgHeader: Template.new('pkgHeader'),
} as const

const REG_EXP = {
  PkgName: new RegExp(PATTERN.PkgName, 'g'),
  PkgHeader: new RegExp(PATTERN.PkgHeader, 'g'),
} as const

const TEMPLATE = {
  RootKey: 'packages/',
  BuildKey: { pre: 'packages/', post: '/tsconfig.build.json' },
  BaseKey: `${SCOPE}/`,
  BaseKey$: { pre: `${SCOPE}/`, post: '/*' },
  BaseValue: { pre: 'packages/', post: '/src/index.js' },
  BaseValue$: { pre: 'packages/', post: '/*.js' },
} as const

interface Deps {
  tsconfig: TsConfig
  pkgName: string
  description?: string
  localDeps?: readonly string[]
  env?: WorkspaceEnv
  force?: boolean
  debug?: boolean
  private?: boolean
  dryRun?: boolean
}

interface Effect {
  create: (deps: Required<Deps>) => void,
  cleanup: (deps: Required<Deps>) => void,
}

interface Reference extends S.Schema.Type<typeof Reference> {}
const Reference = S.Struct({ path: S.String })

interface Paths extends S.Schema.Type<typeof Paths> {}
const Paths = S.Record({ key: S.String, value: S.Array(S.String) })

interface CompilerOptions extends S.Schema.Type<typeof CompilerOptions> {}
const CompilerOptions = S.Struct({ paths: S.optional(Paths) })

interface TsConfig extends S.Schema.Type<typeof TsConfig> {}
const TsConfig = S.Struct({
  references: S.optional(S.Array(Reference)),
  compilerOptions: S.optional(CompilerOptions),
})

type WorkspaceEnv = typeof WorkspaceEnv[keyof typeof WorkspaceEnv]
const WorkspaceEnv = {
  React: 'react',
  Node: 'node',
} as const

export interface CleanupOptions extends globalThis.Pick<Options, 'pkgName' | 'force'> {}
export interface Options {
  pkgName: string,
  description?: string,
  localDeps?: readonly string[],
  env?: WorkspaceEnv,
  force?: boolean
  debug?: boolean
  private?: boolean
  dryRun?: boolean
}

export namespace Config {
  export const defaults = {
    tsconfig: {},
    env: WorkspaceEnv.Node,
    localDeps: [],
    description: '',
    force: false,
    debug: false,
    private: true,
    dryRun: false,
  } satisfies Required<Omit<Deps, 'pkgName'>>

  const isNonEmptyString = <T extends string>(string: T): string is globalThis.Exclude<T, ''> => string.length > 0

  export const fromOptions
    : (userProvided: Options) => Required<Options> & Deps
    = (userProvided) => ({
      ...defaults,
      ...userProvided,
      localDeps:
        userProvided.localDeps === undefined ? []
          : userProvided.localDeps.filter(isNonEmptyString),
    })
}

namespace vitest {
  export const sharedConfig = fs.readFileSync(PATH.vitestSharedConfig).toString('utf8')
  export const nodeConfig = ([
    `import { defineConfig, mergeConfig } from 'vitest/config'`,
    `import sharedConfig from '../../vite.config.js'`,
    ``,
    `const localConfig = defineConfig({})`,
    ``,
    `export default mergeConfig(sharedConfig, localConfig)`,
  ]).join('\n')
  export const reactConfig = ([
    `import react from '@vitejs/plugin-react'`,
    `import { defineConfig, mergeConfig } from 'vitest/config'`,
    `import sharedConfig from '../../vite.config.js'`,
    ``,
    `export default mergeConfig(`,
    `  sharedConfig,`,
    `  defineConfig({`,
    `    plugins: [react()],`,
    `    test: {`,
    // `      environment: 'jsdom',`,
    `      globals: false,`,
    `    },`,
    `  }),`,
    `)`,
  ]).join('\n')
  export const configMap = {
    react: vitest.reactConfig,
    node: vitest.nodeConfig,
  } as const
}

namespace order {
  export const lexico = (
    left: string,
    right: string
  ) => left.toLowerCase() > right.toLowerCase() ? 1
      : right.toLowerCase() > left.toLowerCase() ? -1
        : left > right ? 1
          : right > left ? -1
            : 0
    
  export const byReference = (
    { path: left }: Reference,
    { path: right }: Reference
  ) => order.lexico(left, right)
  export const byKey = (
    [left]: [string, ...any],
    [right]: [string, ...any]
  ) => order.lexico(left, right)
}

export const force
  : ($: Deps) => void
  = ($) => ($).force
    ? fs.rimraf(path.join(PATH.packages, $.pkgName))
    : void 0

const defineEffect
  : (create: Effect['create'], cleanup: Effect['cleanup']) => Effect
  = (create, cleanup) => ({ create, cleanup })

const makeRootKey = ($: Deps) => `${TEMPLATE.RootKey}${$.pkgName}`
const unmakeRootKey = (k: string) =>
  !k.startsWith(TEMPLATE.RootKey) ? k
    : k.slice(TEMPLATE.RootKey.length)

const makeBuildKey = ($: Deps) => `${TEMPLATE.BuildKey.pre}${$.pkgName}${TEMPLATE.BuildKey.post}`
const unmakeBuildKey = (k: string) =>
  k.startsWith(TEMPLATE.BuildKey.pre) && k.endsWith(TEMPLATE.BuildKey.post)
    ? k.slice(TEMPLATE.BuildKey.pre.length, -(TEMPLATE.BuildKey.post).length)
    : k

const makeBaseKey = ($: Deps) => `${TEMPLATE.BaseKey}${$.pkgName}`
const unmakeBaseKey = (k: string) =>
  !k.startsWith(TEMPLATE.BaseKey) ? k
    : k.slice(TEMPLATE.BaseKey.length)

const makeBaseKey$ = ($: Deps) => `${TEMPLATE.BaseKey$.pre}${$.pkgName}/*`
const unmakeBaseKey$ = (k: string) =>
  k.startsWith(TEMPLATE.BaseKey$.pre) && k.endsWith(TEMPLATE.BaseKey$.post)
    ? k.slice(TEMPLATE.BaseKey$.pre.length, -(TEMPLATE.BaseKey$.post).length)
    : k

const makeBaseEntries = ($: Deps) => [
  [makeBaseKey($), [`${TEMPLATE.BaseValue.pre}${$.pkgName}${TEMPLATE.BaseValue.post}`]],
  [makeBaseKey$($), [`${TEMPLATE.BaseValue$.pre}${$.pkgName}${TEMPLATE.BaseValue$.post}`]]
] as [string, string[]][]

const filterBaseRefs = ($: Deps) => ([path]: [string, any]) =>
  unmakeBaseKey(path) !== $.pkgName && unmakeBaseKey$(path) !== $.pkgName

namespace make {
  export const _ref = (dep: string) => ({ path: `../${dep}` } as const)
  export const _dep = (dep: string) => ([`${SCOPE}/${dep}`, 'workspace:^'] as const)
  export const refs = ($: Deps) => ([...$.localDeps ?? []]).sort(order.lexico).map(make._ref)
  export const deps = ($: Deps) => ([...$.localDeps ?? []]).sort(order.lexico).map(make._dep)
}

namespace write {
  export const updateRootReferences = defineEffect(
    ($) => pipe(
      PATH.rootTsConfig,
      (($.dryRun ? fs.map : fs.writer) as typeof fs.writer)(
        TsConfig,
        ({ references, ...ts }) => ({
          ...ts,
          references
            : !references ? []
              : pipe(
                references,
                (xs) => xs.filter((x) => unmakeRootKey(x.path) !== $.pkgName),
                (xs) => xs.concat({ path: makeRootKey($) }),
                (xs) => xs.sort(order.byReference),
              )
        }),
        { serialize: Transform.prettify },
      ),
      $.dryRun ? tap(`\n\n[CREATE #${++ix}]: update references in root tsconfig.json\n`) : identity
    ),
    ($) => pipe(
      PATH.rootTsConfig,
      (($.dryRun ? fs.map : fs.writer) as typeof fs.writer)(
        TsConfig,
        (x) => ({
          ...x,
          references
            : !x.references ? []
              : x.references.filter(({ path }) => unmakeRootKey(path) !== $.pkgName),
        }),
        { serialize: Transform.prettify },
      ),
      $.dryRun ? tap(`\n\n[CLEANUP #${ix}]: update references in root tsconfig.json\n`) : identity
    )
  )

  export const updateBaseReferences = defineEffect(
    ($) => pipe(
      PATH.rootTsConfigBase,
      (($.dryRun ? fs.map : fs.writer) as typeof fs.writer)(
        TsConfig,
        ({ compilerOptions, ...ts }) => pipe(
          {
            ...ts,
            compilerOptions
              : !compilerOptions ? {} : {
                ...compilerOptions,
                paths
                  : !compilerOptions?.paths ? {}
                    : pipe(
                      compilerOptions.paths,
                      globalThis.Object.entries,
                      (xs) => xs.filter(filterBaseRefs($)),
                      (xs) => [...xs, ...makeBaseEntries($)],
                      (xs) => xs.sort(order.byKey),
                      globalThis.Object.fromEntries
                    )
              }
          },
        ),
        { serialize: Transform.prettify },
      ),
      $.dryRun ? tap(`\n\n[CREATE #${++ix}]: update references in root tsconfig.base.json\n`) : identity
    ),
    ($) => pipe(
      PATH.rootTsConfigBase,
      (($.dryRun ? fs.map : fs.writer) as typeof fs.writer)(
        TsConfig,
        ({ references, ...ts }) => ({
          ...ts,
          compilerOptions: !ts.compilerOptions ? {} : {
            ...ts.compilerOptions,
            paths: !ts.compilerOptions?.paths ? {} : pipe(
              ts.compilerOptions.paths,
              globalThis.Object.entries,
              (xs) => xs.filter(filterBaseRefs($)),
              globalThis.Object.fromEntries,
            )
          }
        }),
        { serialize: Transform.prettify },
      ),
      $.dryRun ? tap(`\n\n[CLEANUP #${ix}]: update references in root tsconfig.base.json\n`) : identity
    )
  )

  export const updateBuildReferences = defineEffect(
    ($) => pipe(
      PATH.rootTsConfigBuild,
      (($.dryRun ? fs.map : fs.writer) as typeof fs.writer)(
        TsConfig,
        ({ references, ...ts }) => ({
          ...ts,
          references
            : !references ? []
              : pipe(
                references.filter(({ path }) => unmakeBuildKey(path) !== $.pkgName),
                (xs) => [...xs, { path: makeBuildKey($) }],
                (xs) => xs.sort(order.byReference),
              )
        }),
        { serialize: Transform.prettify },
      ),
      $.dryRun ? tap(`\n\n[CREATE #${++ix}]: update references in root tsconfig.build.json\n`) : identity
    ),
    ($) => pipe(
      PATH.rootTsConfigBuild,
      (($.dryRun ? fs.map : fs.writer) as typeof fs.writer)(
        TsConfig,
        ({ references, ...ts }) => ({
          ...ts,
          references
            : !references ? []
              : references.filter(({ path }) => unmakeBuildKey(path) !== $.pkgName),
        }),
        { serialize: Transform.prettify },
      ),
      $.dryRun ? tap(`\n\n[CLEANUP #${ix}]: update references in root tsconfig.build.json\n`) : identity
    ),
  )

  export const workspaceDir = defineEffect(
    ($) => pipe(
      path.join(PATH.packages, $.pkgName),
      $.dryRun ? tap(`\n\n[CREATE #${++ix}]: workspaceDir`) : fs.mkdir,
    ),
    ($) => pipe(
      path.join(PATH.packages, $.pkgName),
      $.dryRun ? tap(`\n\n[CLEANUP #${ix}]: workspaceDir`) : fs.rimraf,
    ),
  )

  export const workspaceSrcDir = defineEffect(
    ($) => pipe(
      path.join(PATH.packages, $.pkgName, 'src'),
      $.dryRun ? tap(`\n\n[CREATE #${ix}], workspaceSrcDir`) : fs.mkdir,
    ),
    ($) => pipe(
      path.join(PATH.packages, $.pkgName, 'src'),
      $.dryRun ? tap(`\n\n[CLEANUP #${ix}]: workspaceSrcDir`) : fs.rimraf,
    )
  )

  export const workspaceTestDir = defineEffect(
    ($) => pipe(
      path.join(PATH.packages, $.pkgName, 'test'),
      $.dryRun ? tap(`\n\n[CREATE #6]: workspaceTestDir`) : fs.mkdir,
    ),
    ($) => pipe(
      path.join(PATH.packages, $.pkgName, 'test'),
      $.dryRun ? tap(`\n\n[CLEANUP #6]: workspaceTestDir`) : fs.rimraf,
    )
  )

  export const workspaceGeneratedDir = defineEffect(
    ($) => pipe(
      path.join(PATH.packages, $.pkgName, 'src', '__generated__'),
      $.dryRun ? tap(`\n\n[CREATE #7]: workspaceGeneratedDir`) : fs.mkdir,
    ),
    ($) => pipe(
      path.join(PATH.packages, $.pkgName, 'src', '__generated__'),
      $.dryRun ? tap(`\n\n[CLEANUP #7]: workspaceGeneratedDir`) : fs.rimraf,
    )
  )

  export const workspaceGeneratedManifest = defineEffect(
    ($) => pipe(
      path.join(PATH.packages, $.pkgName, 'src', '__generated__', '__manifest__.ts'),
      $.dryRun ? tap(`\n\n[CREATE #8]: workspaceGeneratedManifest`) : fs.touch,
    ),
    ($) => pipe(
      path.join(PATH.packages, $.pkgName, 'src', '__generated__', '__manifest__.ts'),
      $.dryRun ? tap(`\n\n[CLEANUP #8]: workspaceGeneratedManifest`) : fs.rimraf,
    ),
  )

  export const workspacePackageJson = defineEffect(
    ($) => {
      const pkg = globalThis.structuredClone(template)
      const devDependencies = pipe(
        globalThis.Object.entries(pkg.devDependencies),
        (xs) => [...xs, ...make.deps($)] as [string, string][],
        (xs) => xs.sort(order.byKey),
      )
      return pipe(
        {
          ...pkg,
          name: pkg.name.concat($.pkgName),
          private: $.private ?? true,
          description: $.description ?? '',
          repository: {
            ...pkg.repository,
            directory: pkg.repository.directory + $.pkgName,
          },
          publishConfig: $.private ? { access: 'private' } : {
            access: 'public',
            directory: 'dist',
            registry: 'https://registry.npmjs.org'
          },
          devDependencies: globalThis.Object.fromEntries(devDependencies),
          peerDependencies: globalThis.Object.fromEntries(devDependencies),
        },
        $.dryRun ? tap(`\n\n[CREATE #9]: workspacePackageJson\n`)
          : fs.writeJson(path.join(PATH.packages, $.pkgName, 'package.json')),
      )
    },
    ($) =>
      $.dryRun
        ? tap(`\n\n[CLEANUP #9]: workspacePackageJson\n`)
        : fs.rimraf(path.join(PATH.packages, $.pkgName, 'package.json')),
  )

  export const workspaceSrcIndex = defineEffect(
    ($) => pipe(
      [
        `export * from './exports.js'`,
      ].join('\n'),
      $.dryRun ? tap(`\n\n[CREATE #10]: workspaceIndex\n`, globalThis.String)
        : fs.writeString(path.join(PATH.packages, $.pkgName, 'src', 'index.ts')),
    ),
    ($) =>
      $.dryRun
        ? tap(`\n\n[CLEANUP #10]: workspaceIndex\n`, globalThis.String)
        : fs.rimraf(path.join(PATH.packages, $.pkgName, 'src', 'index.ts')),
  )

  export const workspaceSrcExports = defineEffect(
    ($) => pipe(
      [
        `export * from './version.js'`,
      ].join('\n'),
      $.dryRun ? tap(`\n\n[CREATE #11]: workspaceSrcExports\n`, globalThis.String)
        : fs.writeString(path.join(PATH.packages, $.pkgName, 'src', 'exports.ts')),
    ),
    ($) =>
      $.dryRun
        ? tap(`\n\n[CLEANUP #11]: workspaceSrcExports\n`, globalThis.String)
        : fs.rimraf(path.join(PATH.packages, $.pkgName, 'src', 'exports.ts')),
  )


  export const workspaceVitestConfig = defineEffect(
    ($) => pipe(
      [
        vitest.configMap[$.env ?? 'node']
      ].join('\n'),
      $.dryRun ? tap(`\n\n[CREATE #12]: workspaceVitestConfig\n`, globalThis.String)
        : fs.writeString(path.join(PATH.packages, $.pkgName, 'vite.config.ts')),
    ),
    ($) =>
      $.dryRun
        ? tap(`\n\n[CLEANUP #12]: workspaceVitestConfig\n`, globalThis.String)
        : fs.rimraf(path.join(PATH.packages, $.pkgName, 'vite.config.ts')),
  )

  let toPackageHeader = (pkgName: string) => [...pkgName].map((char) => char in ALPHABET_MAP ? ALPHABET_MAP[char as keyof typeof ALPHABET_MAP] : char).join('')

  export let workspaceReadme = defineEffect(
    ($) => pipe(
      getReadmeTemplate(),
      (readme) => readme.replace(REG_EXP.PkgHeader, toPackageHeader($.pkgName)),
      (readme) => readme.replace(REG_EXP.PkgName, $.pkgName),
      $.dryRun ? tap(`\n\n[CREATE #13]: readmeTemplate\n`, globalThis.String)
        : fs.writeString(path.join(PATH.packages, $.pkgName, 'README.md')),
    ),
    ($) =>
      $.dryRun
        ? tap(`\n\n[CLEANUP #13]: workspaceReadme\n`, globalThis.String)
        : fs.rimraf(path.join(PATH.packages, $.pkgName, 'README.md')),
  )

  // export const workspaceReadme = defineEffect(
  //   ($) => pipe(
  //     [
  //       `# ${SCOPE}/${$.pkgName}`
  //     ].join('\n'),
  //     $.dryRun ? tap(`\n\n[CREATE #14]: workspaceReadme\n`, globalThis.String)
  //       : fs.writeString(path.join(PATH.packages, $.pkgName, 'README.md')),
  //   ),
  //   ($) =>
  //     $.dryRun
  //       ? tap(`\n\n[CLEANUP #14]: workspaceReadme\n`, globalThis.String)
  //       : fs.rimraf(path.join(PATH.packages, $.pkgName, 'README.md')),
  // )

  export const workspaceSrcVersion = defineEffect(
    ($) => pipe(
      [
        `import pkg from './__generated__/__manifest__.js'`,
        `export const VERSION = \`\${pkg.name}@\${pkg.version}\` as const`,
        `export type VERSION = typeof VERSION`,
        ``,
      ].join('\n'),
      $.dryRun ? tap(`\n\n[CREATE #14]: workspaceVersionSrc\n`, globalThis.String)
        : fs.writeString(path.join(PATH.packages, $.pkgName, 'src', 'version.ts')),
    ),
    ($) =>
      $.dryRun
        ? tap(`\n\n[CLEANUP #14]: workspaceVersionSrc\n`)
        : fs.rimraf(path.join(PATH.packages, $.pkgName, 'src', 'version.ts')),
  )

  export const workspaceTestVersion = defineEffect(
    ($) => pipe(
      ([
        `import * as vi from 'vitest'`,
        `import pkg from '../package.json' with { type: 'json' }`,
        `import { VERSION } from '${SCOPE}/${$.pkgName}'`,
        ``,
        `vi.describe('〖⛳️〗‹‹‹ ❲${SCOPE}/${$.pkgName}❳', () => {`,
        `  vi.it('〖⛳️〗› ❲VERSION❳', () => {`,
        `    const expected = \`\${pkg.name}@\${pkg.version}\``,
        `    vi.assert.equal(VERSION, expected)`,
        `  })`,
        `})`,
        ``,
      ]).join('\n'),
      $.dryRun ? tap(`\n\n[CREATE #15]: workspaceVersionTest\n`, globalThis.String)
        : fs.writeString(path.join(PATH.packages, $.pkgName, 'test', 'version.test.ts')),
    ),
    ($) =>
      $.dryRun
        ? tap(`\n\n[CLEANUP #15]: workspaceVersionTest\n`, globalThis.String)
        : fs.rimraf(path.join(PATH.packages, $.pkgName, 'test', 'version.test.ts')),
  )

  export const workspaceTsConfig = defineEffect(
    ($) => pipe(
      {
        'extends': '../../tsconfig.base.json',
        'include': [],
        'references': [
          { 'path': 'tsconfig.src.json' },
          { 'path': 'tsconfig.test.json' },
        ],
      },
      $.dryRun ? tap(`\n\n[CREATE #16]: workspaceTsConfig\n`)
        : fs.writeJson(path.join(PATH.packages, $.pkgName, 'tsconfig.json')),
    ),
    ($) =>
      $.dryRun
        ? tap(`\n\n[CLEANUP #16]: workspaceTsConfig\n`)
        : fs.rimraf(path.join(PATH.packages, $.pkgName, 'tsconfig.json')),
  )

  export const workspaceTsConfigBuild = defineEffect(
    ($) => pipe(
      {
        'extends': './tsconfig.src.json',
        'compilerOptions': {
          'tsBuildInfoFile': '.tsbuildinfo/build.tsbuildinfo',
          'types': ['node'],
          'declarationDir': 'build/dts',
          'outDir': 'build/esm',
          'stripInternal': true,
        },
        'references': make.refs($),
      },
      $.dryRun
        ? tap(`\n\n[CREATE #17]: workspaceTsConfigBuild\n`)
        : fs.writeJson(path.join(PATH.packages, $.pkgName, 'tsconfig.build.json')),
    ),
    ($) =>
      $.dryRun
        ? tap(`\n\n[CLEANUP #17]: workspaceTsConfigBuild\n`)
        : fs.rimraf(path.join(PATH.packages, $.pkgName, 'tsconfig.build.json')),
  )

  export const workspaceTsConfigSrc = defineEffect(
    ($) => pipe(
      {
        'extends': '../../tsconfig.base.json',
        'compilerOptions': {
          'tsBuildInfoFile': '.tsbuildinfo/src.tsbuildinfo',
          'rootDir': 'src',
          'types': ['node'],
          'outDir': 'build/src'
        },
        'references': [
          ...make.refs($),
        ],
        'include': ['src']
      },
      $.dryRun
        ? tap(`\n\n[CREATE #18]: workspaceTsConfigSrc\n`)
        : fs.writeJson(path.join(PATH.packages, $.pkgName, 'tsconfig.src.json')),
    ),
    ($) =>
      $.dryRun
        ? tap(`\n\n[CLEANUP #18]: workspaceTsConfigSrc\n`)
        : fs.rimraf(path.join(PATH.packages, $.pkgName, 'tsconfig.src.json')),
  )

  export const workspaceTsConfigTest = defineEffect(
    ($) => pipe(
      {
        'extends': '../../tsconfig.base.json',
        'compilerOptions': {
          'tsBuildInfoFile': '.tsbuildinfo/test.tsbuildinfo',
          'rootDir': 'test',
          'types': ['node'],
          'noEmit': true,
        },
        'references': [
          { 'path': 'tsconfig.src.json' },
          ...make.refs($),
        ],
        'include': ['test'],
      },
      $.dryRun
        ? tap(`\n\n[CREATE #19]: workspaceTsConfigTest\n`)
        : fs.writeJson(path.join(PATH.packages, $.pkgName, 'tsconfig.test.json')),
    ),
    ($) =>
      $.dryRun
        ? tap(`\n\n[CLEANUP #19]: workspaceTsConfigTest\n`)
        : fs.rimraf(path.join(PATH.packages, $.pkgName, 'tsconfig.test.json')),
  )
}

export function main(opts: Options) {
  const $ = Config.fromOptions(opts)
  const rootTasks = (): void => {
    void write.updateRootReferences.create($)
    void write.updateBaseReferences.create($)
    void write.updateBuildReferences.create($)
  }
  const workspaceTasks = (): void => {
    void force($)
    void write.workspaceDir.create($)
    void write.workspaceSrcDir.create($)
    void write.workspaceTestDir.create($)
    void write.workspaceGeneratedDir.create($)
    void write.workspaceGeneratedManifest.create($)
    void write.workspacePackageJson.create($)
    void write.workspaceSrcIndex.create($)
    void write.workspaceSrcExports.create($)
    void write.workspaceVitestConfig.create($)
    void write.workspaceReadme.create($)
    void write.workspaceSrcVersion.create($)
    void write.workspaceTestVersion.create($)
    void write.workspaceTsConfig.create($)
    void write.workspaceTsConfigBuild.create($)
    void write.workspaceTsConfigSrc.create($)
    void write.workspaceTsConfigTest.create($)
  }

  void rootTasks()
  void workspaceTasks()
  void $$(`pnpm dlx tsx ./bin/bump.ts`)
  // void $$(`pnpm reboot`)
  void Print(Print.task(`Workspace '${$.pkgName
    }' created at 'packages/${$.pkgName
    }'`))
  void $$(`pnpm reboot`)
}

main.cleanup = (opts: Options) => {
  const $ = Config.fromOptions(opts)
  const rootCleanup = () => {
    void write.updateRootReferences.cleanup($)
    void write.updateBaseReferences.cleanup($)
    void write.updateBuildReferences.cleanup($)
  }
  const workspaceCleanup = () => {
    void force($)
    void write.workspaceDir.cleanup($)
    void write.workspaceSrcDir.cleanup($)
    void write.workspaceTestDir.cleanup($)
    void write.workspaceGeneratedDir.cleanup($)
    void write.workspaceGeneratedManifest.cleanup($)
    void write.workspacePackageJson.cleanup($)
    void write.workspaceSrcIndex.cleanup($)
    void write.workspaceSrcExports.cleanup($)
    void write.workspaceVitestConfig.cleanup($)
    void write.workspaceReadme.cleanup($)
    void write.workspaceSrcVersion.cleanup($)
    void write.workspaceTestVersion.cleanup($)
    void write.workspaceTsConfig.cleanup($)
    void write.workspaceTsConfigBuild.cleanup($)
    void write.workspaceTsConfigSrc.cleanup($)
    void write.workspaceTsConfigTest.cleanup($)
  }

  void rootCleanup()
  void workspaceCleanup()
  void Print(Print.task(`Workspace '${$.pkgName
    }' cleaned up from 'packages/${$.pkgName
    }'`))

  void $$(`pnpm reboot`)
}
