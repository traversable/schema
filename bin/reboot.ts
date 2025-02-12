#!/usr/bin/env pnpm dlx tsx
import { pipe } from "effect"
import { $ } from "./process.js"
import type { ShellCommand, SideEffect } from "./types.js"
import { Print, diff } from "./util.js"

type StdIn = [name: string, stdio: string]

export const stdins = [
  ["clean", "pnpm run clean"],
  ["install", "pnpm i"],
  ["check", "pnpm run check"],
  ["test", "pnpm run test"],
  ["describe", "pnpm run describe"],
  ["bench", "pnpm run bench"],
  ["build", "pnpm run build"],
  ["build_dist", "pnpm run build:dist"],
] as const satisfies StdIn[]

const log
  : (...cmd: ShellCommand) => SideEffect
  = (...[name, run]: ShellCommand) => 
    () => (
      void Print.task(`${Print.hush("Running")} ${Print.with.bold(name)}`), 
      void run()
    )

const report
  : (...cmd: ShellCommand) => SideEffect
  = (...[name, run]) => 
    () => (
      void globalThis.console.time(Print.hush(name)),
      void run(),
      void globalThis.console.timeLog(Print.hush(name)),
      void globalThis.console.timeEnd(Print.hush(name))
    )

const time 
  : (name: string) => (run: SideEffect) => SideEffect
  = (name) => (run) => () => {
    const START = process.hrtime.bigint()
    run()
    const END = process.hrtime.bigint()
    return (
      void Print(Print.hush(`${name}: `) + `${diff(END - START)}s`)
    )
  }

const withLogging
  : (cmd: ShellCommand) => ShellCommand
  = ([name, run]) => [name, log(name, run)]

const sequence
  : (sequenceName: string) => (cmds: ShellCommand[]) => SideEffect
  = (sequenceName) => (cmds) => time(sequenceName)(
    () => cmds.forEach(([name, run]) => void time(name)(run)())
  )
  
function reboot(stdins: StdIn[]): SideEffect {
  return () => void pipe(
    stdins.map(([k, stdin]) => [k, () => $(stdin)] satisfies ShellCommand),
    (cmds) => cmds.map(withLogging),
    sequence("reboot"),
    (run) => run(),
    () => console.log(""),
  )
}

const main = reboot(stdins)

void main()
