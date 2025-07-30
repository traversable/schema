import { t } from '../lib'

/**
 * DEMO: converting your schema into a bi-directional codec
 *
 * Import from `@traversable/schema-codec` to install the '.codec' method to all schemas.
 * 
 * From there, you'll have access to `.pipe`, `.extend`, `.decode` and `.encode`. You can pipe and extend
 * as many times as you want -- the transformations will be added to a queue (`.pipe` puts a transformation
 * in the "after" queue, `.extend` puts a preprocessor in the "before" queue).
 * 
 * If you need to recover the original schema, you can access it via the `.schema` property on the codec.
 */
let User = t
  .object({ name: t.optional(t.string), createdAt: t.string }).codec
  .pipe(({ name = '', ...user }) => ({ ...user, firstName: name.split(' ')[0], lastName: name.split(' ')[1] ?? '', createdAt: new Date(user.createdAt) }))
  .unpipe(({ firstName, lastName, ...user }) => ({ ...user, name: firstName + ' ' + lastName, createdAt: user.createdAt.toISOString() }))

let payload = { name: 'Bill Murray', createdAt: new Date(0).toISOString() }

let fromAPI = User.parse(payload)
//   ^?  let fromAPI: Error | { name?: string, createdAt: Date}

if (fromAPI instanceof Error) throw fromAPI
fromAPI
// ^? { name?: string, createdAt: Date }

let toAPI = User.encode(fromAPI)
//  ^? let toAPI: { name?: string, createdAt: string }

console.group('===============\n\r  DEMO: .pipe\n===============\n\r')
console.debug('raw data:', payload)
console.debug('decoded:', fromAPI)
console.assert(t.eq(fromAPI)({ firstName: 'Bill', lastName: 'Murray', createdAt: new Date(payload.createdAt) }))
console.debug('encoded:', toAPI)
console.assert(t.eq(toAPI)({ name: 'Bill Murray', createdAt: fromAPI.createdAt.toISOString() }))
console.groupEnd()
