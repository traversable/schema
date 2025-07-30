<br>
<h1 align="center">ᯓ𝘁𝗿𝗮𝘃𝗲𝗿𝘀𝗮𝗯𝗹𝗲/𝘀𝗰𝗵𝗲𝗺𝗮-𝗰𝗼𝗺𝗽𝗶𝗹𝗲𝗿</h1>
<br>

<p align="center">
  This package contains the code for compiling highly optimized schemas. 
  
  This technique is sometimes referred to as "jit compiling", or generating "jit-compiled" schemas, although the name is a bit of a misnomer since
  we're actually generating these ahead of time.
/p>

<div align="center">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40traversable%2Fschema-compiler?style=flat-square&logo=npm&label=npm&color=blue">
  &nbsp;
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.5%2B-blue?style=flat-square&logo=TypeScript&logoColor=4a9cf6">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/static/v1?label=Hippocratic%20License&message=HL3-FULL&labelColor=5e2751&color=bc8c3d">
  &nbsp;
  <img alt="npm" src="https://img.shields.io/npm/dt/@traversable/schema-compiler?style=flat-square">
  &nbsp;
</div>

<div align="center">
  <!-- <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/%40traversable/schema-compiler?style=flat-square&label=size">
  &nbsp; -->
  <img alt="Static Badge" src="https://img.shields.io/badge/%F0%9F%8C%B2-tree--shakeable-brightgreen?labelColor=white">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/ESM-supported-2d9574?style=flat-square&logo=JavaScript">
  &nbsp;
  <img alt="Static Badge" src="https://img.shields.io/badge/CJS-supported-2d9574?style=flat-square&logo=Node.JS">
  &nbsp;
</div>

<div align="center">
  <a href="https://stackblitz.com/edit/traversable?file=src%2Fsandbox.tsx" target="_blank">Demo (StackBlitz)</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsplay.dev/w2y29W" target="_blank">TypeScript Playground</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://www.npmjs.com/package/@traversable/schema-compiler" target="_blank">npm</a>
  <br>
</div>
<br>
<br>

<p align="center">
  This package contains the code for installing "JIT compiled" validators to your schemas.
</p>


## Getting started

Users can consume this package in one of several ways:

### Import side effect + module augmentation

To install the `.compile` method on all schemas, simply import `@traversable/schema-compiler/install`.

Once you do, all schemas come with a `.compile` method you can use.

### As a standalone function

To compile a single schema, import `Jit` from `@traversable/schema-jit-compiler/recursive`, and pass the
schema you'd like to compile to `Jit.fromSchema`.

### Usage

Depending on your use case, you'll probably want to use the `@traversable/schema-compiler` package in 1 of 2 ways:

1. to compile predicate functions at runtime, _without_ writing them to disc

  This is definitely the easier of the two options.

    #### Example
  
    ```typescript
    // app.ts
    import { t } from '@traversable/schema'
    import { Compiler } from '@traversable/schema-compiler'
  
    const UserSchema = t.object({
      firstName: t.string,
      lastName: t.optional(t.string),
      address: t.optional(
        t.object({
          street: t.tuple(t.string, t.optional(t.string)),
          postalCode: t.optional(t.string),
          state: t.enum('AK', 'AL', 'AZ', /* ... */),
        })
      )
    })

    const CompiledUser = Compiler.generate(UserSchema)

    CompiledUser({ firstName: null }) 
    // => 🚫 fails, yay

    CompiledUser({ firstName: 'Mark', address: { street: ['123 Main St'], state: 'AZ' }}) 
    // => ✅ succeeds, yay
    ```

  > **Note:** If you're planning on using the predicates in environments that block the use of `eval` or `new Function`
  (e.g., CloudFlare workers), barring any cleverness or cheat codes on your part, **this options will not work for you**. 
  For more information on why, see the _Limitations_ section below.


2. to compile predicate functions (as strings) and write them to disc (codegen)

    > **Note:** If you're planning on using the predicates in environments that block the use of `eval` or `new Function`
    (e.g., CloudFlare workers), **this is your only option**. For more information on why, see the _Limitations_ section below.
  
    Compiling predicates is generally a good option when your schemas change rarely, or when your build pipeline is already
    set up to consume some kind of static artifact (like an OpenAPI document) to generate code.
  
    If not, you'll probably want to set that up, otherwise you might run into bugs when the contract changes and you or
    someone on your team inevitably forgets to regenerate.
  
    #### Example
  
    ```typescript
    ///////////////
    //  main.js
    import { t } from '@traversable/schema'
    import { Compiler } from '@traversable/schema-compiler'
    import * as fs from 'node:fs'
    import * as path from 'node:path'
  
    const User = t.object({ /* ... */ })
    const GeneratedSchema = Compiler.generate(User)

    fs.writeFileSync(
      path.join(path.resolve(), 'user.generated.js'),
      'export ' + GeneratedSchema
    )
    
    /////////////////////////
    //  user.generated.js
    function check(value) {
      return (
        !!value && typeof value === "object" && !Array.isArray(value)
        && typeof value.firstName === "string"
        && (value.lastName === undefined || typeof value.lastName === "string")
        && !!value.address && typeof value.address === "object" && !Array.isArray(value.address)
          && (value.address.postalCode === undefined || typeof value.address.postalCode === "string")
          && Array.isArray(value.address.street) && (value.address.street.length === 1 || value.address.street.length === 2)
            && typeof value.address.street[0] === "string"
            && (value.address.street[1] === undefined || typeof value.address.street[1] === "string")
          && (value.address.state === "AK" || value.address.state === "AL" || value.address.state === "AZ")
      )
    }

    ////////////////////
    //  elsewhere.js
    import * as User from './user.generated'

    User.check({ firstName: null }) 
    // => 🚫 fails, yay

    User.check({ firstName: 'Mark', address: { street: ['123 Main St'], state: 'AZ' }}) 
    // => ✅ succeeds, yay
    ```

### How does it work?

This package uses a [well-known trick](https://romgrk.com/posts/optimizing-javascript#7-use-eval)
for optimizing hot-path code.

The idea is pretty simple: rather than have predicates carry around a bunch of code that lives in
memory (which will have to be interpreted at runtime), we can instead generate the predicates in
string form.

Then, either write the strings to disc, or pass them to `new Function(...)` so they can be evaluated
and used.

The nice thing about this trick is that it allows you to pay the cost once, at compile time. Since
validation is usually in the hot path, this is usually a good tradeoff.


### Limitations

Because compiled schemas produce strings, internally the library needs a way to run the string as JavaScript.

However, certain environments (like CloudFlare workers) enforce a content security policy that blocks certain
globals (like `new Function`) to rule out a whole class of attack vectors.

Since presumably you control your schemas, this isn't actually a security concern in practice.

(Unless of course the schemas come from your users, somehow. Hopefully that's not where they're coming from.
And if that's where they're coming from -- don't use `@traversable/schema-compiler`!)
