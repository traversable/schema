import { NS } from './uri.js'

export type TypeName<T> = never | T extends `${NS}${infer S}` ? S : never
export function typeName<T extends { tag: string }>(x: T): TypeName<T['tag']>
export function typeName(x: { tag: string }) {
  console.log('typeName, x:', x)
  return x.tag.substring(NS.length)
}
