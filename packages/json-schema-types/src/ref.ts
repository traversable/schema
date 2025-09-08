import { get, has } from '@traversable/registry'
import type { Ref } from './types.js'

const DASH = new RegExp('[-_]', 'g')
const DASH_BOUNDARY = new RegExp('([-_][a-z])', 'g')

function camelCase(x: string) {
  return x.replace(DASH_BOUNDARY, (c) => c.toUpperCase().replace(DASH, ''))
}

function pascalCase(x: string) {
  return (x[0] ?? '').toUpperCase() + camelCase(x.slice(1))
}

export function canonicalizeRefName(x: string) {
  return x === '#' || x === '' ? 'Root' : pascalCase(x.slice(x.lastIndexOf('/') + 1) ?? x).replace(/\W/g, '')
}

export function resolve<T>(path: string, guard: (u: unknown) => u is T): (document: { paths: { [x: string]: {} } }) => T | undefined
export function resolve(path: string): (document: { paths: { [x: string]: {} } }) => {} | undefined
export function resolve(_: string, guard?: (u: unknown) => boolean) {
  let seen = new WeakSet()
  function go(_: string, guard: (u: unknown) => boolean, document: { paths: { [x: string]: {} } }) {
    const path = _.startsWith("#/") ? _.slice("#/".length).split("/") : _.split("/")
    let cursor: unknown = get(document, path)
    if (!cursor) return void 0

    while (has("$ref", (_) => typeof _ === 'string')(cursor)) {
      if (seen.has(cursor)) {
        throw Error('Circular')
      }
      seen.add(cursor)
      cursor = go(cursor["$ref"], guard, document)
    }

    return guard(cursor) ? cursor : void 0
  }
  return (document: { paths: { [x: string]: {} } }) => go(_, guard ?? (() => true), document)
}
