import type * as cp from "node:child_process"

export interface SideEffect<T = void> { (): T }

export type ShellCommand = readonly [name: string, $: SideEffect]
export type ShellOptions = Omit<cp.ExecSyncOptions, "stdio"> & {
	env?: Record<string, string | undefined>
}

export interface Matcher {
  needle: string | globalThis.RegExp
  replacement: string
}

export interface Workspace {
  name: string
  dependencies: string[]
  version: string
}

export interface Repo {
  name: string
  scope: `@${string}`
  url: string
}

export type Graph = readonly Node[]
export interface Node {
  name: string
  order: number
  dependencies: readonly string[]
  version: string
}
