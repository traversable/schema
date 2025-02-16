
// import { Extension, is, tree } from "@traversable/core"

import { newtype } from "@traversable/guard/src/types";

// interface Foo { type: "Foo" }
// interface Bar { type: "Bar" }
// interface Baz { type: "Baz" }

// const myExt = Extension.register({
//   Foo: (u: unknown): u is Foo => tree.has("type", is.literally("Foo"))
//   Bar: (u: unknown): u is Bar => tree.has("type", is.literally("Bar"))
//   Baz: (u: unknown): u is Baz => tree.has("type", is.literally("Baz"))
// })

// declare module "@traversable/core" { interface Extension extends Extension.register<typeof myExt> {} }

export const nullary = new globalThis.Map()
export const Registry: Registry = { nullary: nullary as never }

export interface Registry {
  nullary: globalThis.Map<unknown, unknown>
}

export interface extend<T extends Registry> extends newtype<T> { }

// function Extension_register<S extends { [ext: string]: (u: any) => u is any }>(exts: S): Extension_register<S>
// function Extension_register<S extends { [ext: string]: (u: any) => u is any }>(exts: S) { 
//   void Object.entries(exts).forEach(([k, v]) => (registry as never as globalThis.Map<any, any>).set(k, v)) 
//   return exts
// }
