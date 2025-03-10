export default {
  "name": "@traversable/schema",
  "type": "module",
  "version": "0.0.9",
  "private": false,
  "description": "",
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
  "devDependencies": {
    "@traversable/derive-validators": "workspace:^",
    "@traversable/json": "workspace:^",
    "@traversable/registry": "workspace:^",
    "@traversable/schema-codec": "workspace:^",
    "@traversable/schema-core": "workspace:^",
    "@traversable/schema-to-json-schema": "workspace:^",
    "@traversable/schema-seed": "workspace:^",
    "@traversable/schema-zod-adapter": "workspace:^",
    "zod": "^3.24.2"
  },
  "peerDependencies": {
    "@traversable/derive-validators": "workspace:^",
    "@traversable/json": "workspace:^",
    "@traversable/registry": "workspace:^",
    "@traversable/schema-codec": "workspace:^",
    "@traversable/schema-core": "workspace:^",
    "@traversable/schema-to-json-schema": "workspace:^",
    "@traversable/schema-seed": "workspace:^"
  },
  "peerDependenciesMeta": {
    "@traversable/derive-validators": { "optional": false },
    "@traversable/json": { "optional": false },
    "@traversable/schema-codec": { "optional": false },
    "@traversable/schema-core": { "optional": false },
    "@traversable/schema-seed": { "optional": false },
    "@traversable/schema-to-json-schema": { "optional": false },
    "@traversable/registry": { "optional": false }
  }
} as const