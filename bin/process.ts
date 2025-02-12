import * as cp from "node:child_process"
import type { ShellOptions } from "./types.js"

/** 
 * ## {@link $ `bin/$`}
 * 
 * Runs a command synchronously. Output goes to terminal.
 */
export const $ 
  : (cmd: string, options?: ShellOptions) => void
  = (cmd: string, { env, ...rest } = {}) => {
  	cp.execSync(cmd, { 
      env: { ...process.env, ...env },
      ...rest,
      stdio: "inherit",
    })
  }

/** 
 * ## {@link shell `bin/shell`}
 * 
 * Runs a command synchronously. Output returned as a string.
 */
export const shell 
  : (cmd: string, options?: ShellOptions) => string
  = (cmd, { env, ...rest } = {}) => cp.execSync(
    cmd, { 
      env: { ...process.env, ...env },
      ...rest, 
      stdio: "pipe" 
    }
  ).toString("utf8")
