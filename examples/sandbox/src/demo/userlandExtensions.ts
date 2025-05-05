import { t } from '../lib'

/**
 * DEMO: extensions in userland
 * 
 * Library authors can use the core library as an extension point.
 * 
 * Keep in mind that as you install new features/methods to all schemas (say, `.toJsonSchema`), that you'll
 * probably need to implement those methods on the schemas you've added.
 * 
 * For this example, I added a `./lib` folder in the current directory, and implemented 2 new schemas:
 * 
 * - `t.set`, which targets the native `Set` data structure
 * - `t.map`, which targets the native `Map` data structure
 * 
 * In addition to implementing the type predicates, I also:
 * 
 * 1. made sure to not break reflection, by appending the respective ASTs to their `.def` property
 * 2. extended the `URI` object with new tags, and appended the respective tag to their `.tag` property
 * 3. implemented `.validate` for each schema
 * 4. imlemented type- and term-level `.toType` methods
 * 5. since `Set` and `Map` don't have a JSON Schema representation, their `.toJsonSchema` methods return `void 0`
 * 6. extended `Functor` and `IndexedFunctor` to make sure we can also traverse over the new schemas
 * 7. extended the `toType` algebra from core (this is the _recursive_ function, not the method on each schema)
 * 8. as an integration test, I exercised the recursive `toType` function using a combination of built-in schemas and our new additions
 * 9. installed the features I wanted to support, and re-exported the core library from a barrel file where I also exported `t.set` and `t.map`
 * 
 * It's a fair bit of work to do, so let's step back and talk through what we've accomplished:
 * 
 * 1. we now have a reusable abstraction that lets us implement arbitrary recursion over any schema tree (including the schemas we added)
 * 2. to promote our new schemas, we needed to implement a lot of stuff, but most of it was to make sure the schemas were compatible with our opt-in features
 * 3. because the core API is consistent, we were able to draw from examples at every step
 * 4. because the core API is not magical, we didn't need to cast any spells or cut deals with the devil to get it done
 * 5. finally, the extension is seamless: our new additions are indistinguishable from the core library -- all users need to do is import the namespace, and they're off
 */

let set = t.set(t.record(t.boolean))

let map = t.map(t.array(t.union(t.string, t.number)), set)
//  ^?
//  ^^ if you look at the schema's type, you'll see that our extensions are indistinguishable from the core library

const setInstance = new Set()
setInstance.add({ abc: false, def: true })
const mapInstance = new Map()
mapInstance.set([1, 2, '3'], setInstance)

console.group('=========================\n\r  DEMO: extension point \n=========================\n\r')
console.log()

/** 
 * t.map 
 */
console.debug('[[map]]: successfully parsed valid data\n', map.parse)
try {
  mapInstance.set([Symbol.for('invalid key entry')], new Set())
  console.error('[[map]]: OOPS! if you see this message, `t.map` let bad data slip through :(', map.parse(mapInstance))
} catch (e) { console.info('[[map]]: successfully filtered out the bad') }
console.debug(`[[map]]: .toType works:\n\r`, map.toType())

/** 
 * t.set 
 */
console.debug('[[set]]: successfully parsed valid data\n', set.parse(setInstance))
try {
  setInstance.add(2)
  console.error('[[set]]: OOPS! if you see this message, `t.set` let bad data slip through :(', set.parse(setInstance))
} catch (e) { console.info('[[set]]: successfully filtered out the bad') }
console.debug(`[[set]]: .toType works:\n\r`, set.toType())
/** 
 * native
 */
console.debug('[[parse]]: `.parse` sucessfully installed on native schemas', t.array(t.string).parse)
console.assert(t.array(t.string).parse !== void 0)
console.debug('[[parse]]: `.parse` successfully parsed valid data', t.array(t.string).parse(['hey']))
try {
  console.error('[[parse]]: OOPS! if you see this message, `t.array(t.string).parse` let bad data slip through :(', t.array(t.string).parse([3.141592]))
} catch (e) { console.info('[[parse]]: successfully filtered out the bad') }
console.groupEnd()

