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
      "include": ["**/*.ts", "schemas/*.ts"]
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
    "build:schemas": "pnpm dlx tsx ./src/build.ts",
    "build:schemas:watch": "pnpm dlx tsx  --watch ./src/build.ts",
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
    "@traversable/derive-codec": "workspace:^",
    "@traversable/derive-equals": "workspace:^",
    "@traversable/derive-validators": "workspace:^",
    "@traversable/registry": "workspace:^",
    "@traversable/schema-core": "workspace:^",
    "@traversable/schema-generator": "workspace:^",
    "@traversable/schema-to-json-schema": "workspace:^",
    "@traversable/schema-to-string": "workspace:^"
  },
  "devDependencies": {
    "@traversable/derive-codec": "workspace:^",
    "@traversable/derive-equals": "workspace:^",
    "@traversable/derive-validators": "workspace:^",
    "@traversable/registry": "workspace:^",
    "@traversable/schema-core": "workspace:^",
    "@traversable/schema-generator": "workspace:^",
    "@traversable/schema-to-json-schema": "workspace:^",
    "@traversable/schema-to-string": "workspace:^"
  }
} as const