export default {
  "name": "@traversable/schema-to-json-schema",
  "type": "module",
  "version": "0.0.9",
  "private": false,
  "description": "",
  "repository": {
    "type": "git",
    "url": "https://github.com/traversable/schema.git",
    "directory": "packages/schema-to-json-schema"
  },
  "sideEffects": ["./src/exports.ts"],
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
    "bench": "echo NOTHING TO BENCH",
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
  "peerDependencies": {
    "@traversable/registry": "workspace:^",
    "@traversable/schema": "workspace:^"
  },
  "devDependencies": {
    "@traversable/registry": "workspace:^",
    "@traversable/schema": "workspace:^",
    "@traversable/schema-seed": "workspace:^"
  }
} as const