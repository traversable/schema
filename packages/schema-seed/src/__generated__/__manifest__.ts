export default {
  "name": "@traversable/schema-seed",
  "type": "module",
  "version": "0.0.31",
  "private": false,
  "description": "",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/traversable/schema.git",
    "directory": "packages/schema-seed"
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
    "@traversable/json": "workspace:^",
    "@traversable/registry": "workspace:^",
    "@traversable/schema": "workspace:^"
  },
  "devDependencies": {
    "@fast-check/vitest": "0.2.1",
    "@traversable/json": "workspace:^",
    "@traversable/registry": "workspace:^",
    "@traversable/schema": "workspace:^",
    "fast-check": "^3.23.2"
  }
} as const