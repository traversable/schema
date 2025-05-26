export default {
  "name": "@traversable/schema",
  "type": "module",
  "version": "0.0.35",
  "private": false,
  "description": "",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/traversable/schema.git",
    "directory": "packages/schema"
  },
  "bugs": {
    "url": "https://github.com/traversable/schema/issues",
    "email": "ahrjarrett@gmail.com"
  },
  "@traversable": {
    "generateExports": {
      "include": ["**/*.ts"]
    },
    "generateIndex": {
      "include": ["**/*.ts"]
    }
  },
  "publishConfig": {
    "access": "public",
    "directory": "dist",
    "registry": "https://registry.npmjs.org"
  },
  "scripts": {
    "build": "pnpm build:esm && pnpm build:cjs && pnpm build:annotate",
    "build:annotate": "babel build --plugins annotate-pure-calls --out-dir build --source-maps",
    "build:esm": "tsc -b tsconfig.build.json",
    "build:cjs": "babel build/esm --plugins @babel/transform-export-namespace-from --plugins @babel/transform-modules-commonjs --out-dir build/cjs --source-maps",
    "check": "tsc -b tsconfig.json",
    "clean": "pnpm run \"/^clean:.*/\"",
    "clean:build": "rm -rf .tsbuildinfo dist build",
    "clean:deps": "rm -rf node_modules",
    "test": "vitest"
  },
  "devDependencies": {
    "@traversable/schema-zod-adapter": "workspace:^",
    "@sinclair/typebox": "catalog:",
    "@types/lodash.isequal": "catalog:",
    "arktype": "catalog:",
    "lodash.isequal": "catalog:",
    "valibot": "catalog:",
    "zod": "catalog:"
  },
  "peerDependencies": {
    "@traversable/registry": "workspace:^"
  }
} as const