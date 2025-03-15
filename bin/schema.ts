import { Schema as S } from "effect"
import { SCOPE, defaults } from "./constants.js"

interface Config extends S.Schema.Type<typeof Config> { }
const Config = S.Struct({
  generateExports: S.optional(
    S.Struct({
      include: S.optional(S.Array(S.String)).pipe(
        S.withConstructorDefault(() => defaults.config.generateExports.include),
      ),
      exclude: S.optional(S.Array(S.String)).pipe(
        S.withConstructorDefault(() => defaults.config.generateExports.exclude),
      ),
    })
  ),
  generateIndex: S.optional(
    S.Struct({
      include: S.optional(S.Array(S.String)).pipe(
        S.withConstructorDefault(() => defaults.config.generateIndex.include)
      ),
      exclude: S.optional(S.Array(S.String)).pipe(
        S.withConstructorDefault(() => defaults.config.generateIndex.exclude),
      )
    }),
  ),
})

export interface PackageJson extends S.Schema.Type<typeof PackageJson> { }
export const PackageJson = S.Struct({
  name: S.String,
  version: S.String,
  description: S.String,
  private: S
    .optional(S.Boolean)
    .pipe(S.withConstructorDefault(() => false)),
  repository: S.Union(
    S.String,
    S.Struct({
      type: S.String,
      url: S.String,
      directory: S.String,
    }),
  ),
  sideEffects: S.optional(S.Array(S.String)).pipe(S.withConstructorDefault(() => [])),
  dependencies: S
    .optional(S.Record({ key: S.String, value: S.String })),
  peerDependencies: S
    .optional(S.Record({ key: S.String, value: S.String }))
    .pipe(S.withConstructorDefault(() => ({}))),
  peerDependenciesMeta: S
    .optional(S.Record({ key: S.String, value: S.Struct({ optional: S.Boolean }) }))
    .pipe(S.withConstructorDefault(() => ({}))),
  optionalDependencies: S
    .optional(S.Record({ key: S.String, value: S.String })),
  devDependencies: S
    .optional(S.Record({ key: S.String, value: S.String }))
    .pipe(S.withConstructorDefault(() => ({}))),
  gitHead: S.optional(S.String),
  bin: S.optional(S.Unknown),
  [SCOPE]: S
    .optional(Config)
    .pipe(S.withConstructorDefault(() => defaults.config)),
})
