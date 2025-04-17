#!/usr/bin/env pnpm dlx tsx
import * as fs from 'node:fs'
import * as path from 'node:path'
import { execSync as x } from 'node:child_process'

import * as p from '@clack/prompts'
import color from 'picocolors'
import { VERSION } from './version.js'

import { t } from '@traversable/schema-core'

let Primitives = t.eq([
  { value: 'null', label: 'null' },
  { value: 'undefined', label: 'undefined' },
  { value: 'boolean', label: 'boolean' },
  { value: 'number', label: 'number' },
  { value: 'string', label: 'string' },
  { value: 'bigint', label: 'bigint' },
  { value: 'integer', label: 'integer' },
  { value: 'unknown', label: 'unknown' },
  { value: 'never', label: 'never' },
  { value: 'void', label: 'void' },
  { value: 'any', label: 'any' },
  { value: 'symbol', label: 'symbol' },
]).def

let Combinators = t.eq([
  { value: 'object', label: 'object' },
  { value: 'array', label: 'array' },
  { value: 'union', label: 'union' },
  { value: 'intersect', label: 'intersect' },
  { value: 'record', label: 'record' },
  { value: 'optional', label: 'optional' },
  { value: 'tuple', label: 'tuple' },
  { value: 'eq', label: 'eq' },
]).def

let Features = t.eq([
  { value: 'equals', label: 'equals' },
  { value: 'toJsonSchema', label: 'toJsonSchema' },
  { value: 'toString', label: 'toString' },
  { value: 'validate', label: 'validate' },
]).def

async function prompt() {
  p.intro(' 🌳 ' + color.underline(VERSION) + ' ')

  let $ = await p.group({
    target: () => p.text({
      message: 'Where would you like to install your schemas?',
      placeholder: 'Path to an empty directory',
      validate(path) {
        if (!path.startsWith('./'))
          return 'Please enter a relative path (e.g., \'./schemas\''
      },
    }),
    primitives: () => p.multiselect({
      message: 'Pick your primitives',
      initialValues: ['*'],
      options: [
        { value: '*', label: '* (all)' },
        ...Primitives,
      ],
    }),
    combinators: () => p.multiselect({
      message: 'Pick your combinators',
      initialValues: ['*'],
      options: [
        { value: '*', label: '* (all)' },
        ...Combinators,
      ]
    }),
    features: () => p.multiselect({
      message: 'Which methods methods would you like to install?',
      options: Features,
    })
  }, {
    onCancel: () => {
      p.cancel('Operation cancelled.')
      process.exit(0)
    },
  })

  let TARGET = path.join(process.cwd(), $.target)
  let PACKAGE_JSON = path.join(TARGET, 'package.json')
  let NODE_MODULES = path.join(TARGET, 'node_modules')
  let TRAVERSABLE_SCHEMA = path.join(NODE_MODULES, '@traversable/schema-core')


  if (!fs.existsSync(TARGET)) {
    throw Error('The path ' + TARGET + ' does not exist.')
  }
  if (!fs.statSync(TARGET).isDirectory()) {
    console.log(TARGET + ' is not a directory.')
    process.exit(1)
  }
  try {
    fs.accessSync(TARGET, fs.constants.R_OK | fs.constants.W_OK)
  } catch (e) {
    console.log('\n'
      + 'Unable to write to path '
      + TARGET
      + '. It\'s likely you do not have permissions for this folder.')
  }
  if (!fs.statSync(NODE_MODULES).isDirectory()) {
    console.log(''
      + '\n'
      + 'The path '
      + TARGET
      + ' does not contain a node_modules folder.'
      + '\n'
    )
    process.exit(1)
  }
  if (!fs.statSync(TRAVERSABLE_SCHEMA).isDirectory()) {
    let installCore = await p.confirm({
      message: 'This script will install \'@traversable/schema\' to ' + NODE_MODULES + '. Proceed?',
      initialValue: true,
    })
    if (installCore === false) {
      console.log('Exiting...')
      process.exit(0)
    }
  }

  return $
}

function postinstall() {
  let USER_DIR = process.env.INIT_CWD
  let LIB_DIR = process.cwd()
  console.log('USER_DIR', USER_DIR)
  console.log('LIB_DIR', LIB_DIR)

  if (!USER_DIR) {
    throw Error('Unable to infer the initial working directory')
  }
  try {
    const USER_PKG_JSON = JSON.parse(fs.readFileSync(path.resolve(USER_DIR, 'package.json'), 'utf8'))
    const LIB_PKG_JSON = JSON.parse(fs.readFileSync(path.resolve(LIB_DIR, 'package.json'), 'utf8'))
    console.log('\n\nuser package.json: \n', USER_PKG_JSON)
    console.log('\n\nlib package.json: \n', LIB_PKG_JSON)
  } catch (e) {
    console.log(e)
    throw Error('Could not read package.json')
  }

  setTimeout(() => {
    x('echo hey')

    // let answers = prompt()
    // console.log('answers', answers)
  }, 3000)
}

postinstall()


// type SchemaByName = typeof SchemaByName
// let SchemaByName = {
//   any: t.any,
//   array: t.array,
//   bigint: t.bigint,
//   boolean: t.boolean,
//   eq: t.eq,
//   integer: t.integer,
//   intersect: t.intersect,
//   never: t.never,
//   null: t.null,
//   number: t.number,
//   object: t.object,
//   optional: t.optional,
//   record: t.record,
//   string: t.string,
//   symbol: t.symbol,
//   tuple: t.tuple,
//   undefined: t.undefined,
//   union: t.union,
//   unknown: t.unknown,
//   void: t.void,
// } satisfies Record<t.TypeName, any>

// type SchemaName = t.typeof<typeof SchemaName>
// let SchemaName = t.enum(...t.typeNames)

// type Options = t.typeof<typeof Options>
// interface Config<S extends SchemaName = SchemaName> extends Required<Omit<Options, 'schemas'>> {
//   schemas: { [K in S]: SchemaByName[K] }
// }

// let Options = t.object({
//   cwd: t.optional(t.string),
//   schemas: t.optional(t.array(SchemaName)),
// })

// // let getTarget = await p.text({
// //   message: 'Where would you like to install your schemas?',
// //   placeholder: 'Path to an empty directory',
// //   validate(value) {
// //     if (!t.filter(t.string, (s) => s.startsWith('./')))
// //       return 'Please enter a relative path (e.g., \'./schemas\''
// //   },
// // })

// // let multiselectOptions = Object
// //   .entries(SchemaByName)
// //   .map(([schemaName]) => ({ value: schemaName } satisfies p.Option<string>))

// // .map(([schemaName]) => ({ value: schemaName } satisfies Prompt.Option<string>));

// // let multiselect = p.multiselect({
// //   message: 'Select your schemas',
// //   options: multiselectOptions,
// //   required: true,
// //   initialValues: Object.keys(SchemaName),
// // })


// // let confirm = await p.confirm({
// //   message: 'Ready?',
// // })

// // p.intro('create-my-app');
// // p.outro('You're all set!');


// // type PromptGroup<T> = {
// //   [P in keyof T]: (opts: {
// //       results: Prettify<Partial<PromptGroupAwaitedReturn<Omit<T, P>>>>;
// //   }) => undefined | Promise<T[P] | undefined>;
// // };

// let RelativePath = t.filter(t.string, (s) => s.startsWith('./'))

// let spinner = p.spinner()

// let Primitives = [
//   { value: 'null', label: 'null' },
//   { value: 'undefined', label: 'undefined' },
//   { value: 'boolean', label: 'boolean' },
//   { value: 'number', label: 'number' },
//   { value: 'string', label: 'string' },
//   { value: 'bigint', label: 'bigint' },
//   { value: 'integer', label: 'integer' },
//   { value: 'unknown', label: 'unknown' },
//   { value: 'never', label: 'never' },
//   { value: 'void', label: 'void' },
//   { value: 'any', label: 'any' },
//   { value: 'symbol', label: 'symbol' },
// ] as const satisfies p.Option<string>[]

// let Combinators = [
//   { value: 'object', label: 'object' },
//   { value: 'array', label: 'array' },
//   { value: 'union', label: 'union' },
//   { value: 'intersect', label: 'intersect' },
//   { value: 'record', label: 'record' },
//   { value: 'optional', label: 'optional' },
//   { value: 'tuple', label: 'tuple' },
//   { value: 'eq', label: 'eq' },
// ] as const satisfies p.Option<string>[]

// let Features = [
//   { value: 'equals', label: 'equals' },
//   { value: 'toJsonSchema', label: 'toJsonSchema' },
//   { value: 'toString', label: 'toString' },
//   { value: 'validate', label: 'validate' },
// ] as const satisfies p.Option<string>[]

// async function main() {
//   p.intro(' 🌳 ' + color.underline(VERSION) + ' ')

//   let $ = await p.group({
//     target: () => p.text({
//       message: 'Where would you like to install your schemas?',
//       placeholder: 'Path to an empty directory',
//       validate(path) {
//         if (!path.startsWith('./'))
//           return 'Please enter a relative path (e.g., \'./schemas\''
//       },
//     }),
//     primitives: () => p.multiselect({
//       message: 'Pick your primitives',
//       initialValues: ['*'],
//       options: [
//         { value: '*', label: '* (all)' },
//         ...Primitives,
//       ],
//     }),
//     combinators: () => p.multiselect({
//       message: 'Pick your combinators',
//       initialValues: ['*'],
//       options: [
//         { value: '*', label: '* (all)' },
//         ...Combinators,
//       ]
//     }),
//     features: () => p.multiselect({
//       message: 'Which methods methods would you like to install?',
//       options: Features,
//     })
//   }, {
//     onCancel: () => {
//       p.cancel('Operation cancelled.')
//       process.exit(0)
//     },
//   })

//   let TARGET = path.join(process.cwd(), $.target)
//   let PACKAGE_JSON = path.join(TARGET, 'package.json')
//   let NODE_MODULES = path.join(TARGET, 'node_modules')
//   let TRAVERSABLE_SCHEMA = path.join(NODE_MODULES, '@traversable/schema-core')


//   if (!fs.existsSync(TARGET)) {
//     throw Error('The path ' + TARGET + ' does not exist.')
//   }
//   if (!fs.statSync(TARGET).isDirectory()) {
//     console.log(TARGET + ' is not a directory.')
//     process.exit(1)
//   }
//   try {
//     fs.accessSync(TARGET, fs.constants.R_OK | fs.constants.W_OK)
//   } catch (e) {
//     console.log('\n'
//       + 'Unable to write to path '
//       + TARGET
//       + '. It\'s likely you do not have permissions for this folder.')
//   }
//   if (!fs.statSync(NODE_MODULES).isDirectory()) {
//     console.log(''
//       + '\n'
//       + 'The path '
//       + TARGET
//       + ' does not contain a node_modules folder.'
//       + '\n'
//     )
//     process.exit(1)
//   }
//   if (!fs.statSync(TRAVERSABLE_SCHEMA).isDirectory()) {
//     let installCore = await p.confirm({
//       message: 'This script will install \'@traversable/schema\' to ' + NODE_MODULES + '. Proceed?',
//       initialValue: true,
//     })
//     if (installCore === false) {
//       console.log('Exiting...')
//       process.exit(0)
//     }
//   }

//   // console.log('target', TARGET)
//   // console.log('NODE_MODULES', NODE_MODULES)
//   console.log('@traversable/schema path:', TRAVERSABLE_SCHEMA)

//   // console.log('primitives', primitives)
//   // console.log('combinators', combinators)
// }

// await main()


// // let defaultOptions = {
// //   cwd: process.cwd(),
// //   schemas: SchemaByName,
// // } satisfies Config<SchemaName>

// // function configure<S extends SchemaName>(options?: Options): Config<S>
// // function configure(options?: Options) {
// //   if (!options) return defaultOptions
// //   else if (Options(options)) {
// //     if (options.schemas) {
// //       let schemas: { [K in SchemaName]+?: SchemaByName[keyof SchemaByName] } = {}
// //       for (let schemaName of options.schemas) {
// //         schemas[schemaName] = SchemaByName[schemaName]
// //       }
// //       return {
// //         cwd: options.cwd ?? defaultOptions.cwd,
// //         schemas,
// //       } satisfies Config<never>
// //     }
// //   }
// //   else return defaultOptions
// // }

// // interface Error<Tag extends string> extends globalThis.Error {
// //   tag: Tag
// // }

// // function createError<Tag extends string>(tag: Tag, defineError: ($: Config) => string): ($: Config) => Error<Tag>
// // function createError<Tag extends string>(tag: Tag, defineError: ($: Config) => string): ($: Config) => globalThis.Error {
// //   return ($: Config) => {
// //     let error: globalThis.Error & { tag?: string } = globalThis.Error(defineError($))
// //     error.tag = tag
// //     return error
// //   }
// // }

// // let UnableToResolveCwd = createError(
// //   'UnableToResolveCwd',
// //   ($) => 'The path ' + $.cwd + ' does not exist.'
// // )

// // let NoWriteAccessToCwd = createError(
// //   'NoWriteAccessToCwd',
// //   ($) => 'Unable to write to path ' + $.cwd + '. It\'s likely you do not have permissions for this folder.'
// // )

// // let UnableToFindPackageJson = createError(
// //   'UnableToFindPackageJson',
// //   ($) => 'Unable to locate a package.json file in ' + $.cwd + '.'
// // )

// // let MalformedPackageJson = createError(
// //   'UnableToFindPackageJson',
// //   ($) => 'Unable to read package.json file at ' + $.cwd + '.'
// // )

// // function init(options?: Options) {
// //   let $ = configure(options)
// //   let ERRORS = Array.of<Error<string>>()
// //   if (!fs.existsSync($.cwd)) ERRORS.push(UnableToResolveCwd($))

// //   try { fs.accessSync($.cwd, fs.constants.R_OK | fs.constants.W_OK) }
// //   catch (e) { ERRORS.push(NoWriteAccessToCwd($)) }

// //   let PACKAGE_JSON_PATH = path.resolve($.cwd, 'package.json')
// //   if (!fs.existsSync(PACKAGE_JSON_PATH)) ERRORS.push(UnableToFindPackageJson($))

// //   try { let PACKAGE_JSON = fs.readFileSync(PACKAGE_JSON_PATH) }
// //   catch (e) { ERRORS.push(MalformedPackageJson($)) }

// //   if (ERRORS.length > 0) {
// //     for (let error of ERRORS) {
// //       console.error('\n[Error]: ' + error.tag + '\r\n\n' + error.message)
// //       console.debug()
// //     }
// //     process.exit(1)
// //   }

// // }
