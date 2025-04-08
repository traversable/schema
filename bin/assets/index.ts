import * as fs from 'node:fs'

export { default as template } from "./_package.json"

export let getReadmeTemplate = () => fs.readFileSync('./_README.md').toString('utf8')
