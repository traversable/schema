import * as fs from 'node:fs'
import * as path from 'node:path'

const PATH = {
  README: path.join(path.resolve(), 'bin', 'assets', '_README.md')
} as const

export { default as template } from "./_package.json"

export let getReadmeTemplate = () => fs.readFileSync(PATH.README).toString('utf8')
