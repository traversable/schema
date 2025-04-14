export default {
  "name": "@traversable/schema-generator",
  "type": "module",
  "version": "0.0.0",
  "private": false,
  "description": "",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/traversable/schema.git",
    "directory": "packages/schema-generator"
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
  "bin": "./src/cli.ts",
  "scripts": {
    "bench": "echo NOTHING TO BENCH",
    "build": "pnpm build:esm && pnpm build:cjs && pnpm build:annotate",
    "build:annotate": "babel build --plugins annotate-pure-calls --out-dir build --source-maps",
    "build:cjs": "babel build/esm --plugins @babel/transform-export-namespace-from --plugins @babel/transform-modules-commonjs --out-dir build/cjs --source-maps",
    "build:esm": "tsc -b tsconfig.build.json",
    "gen": "pnpm dlx tsx ./src/build.ts",
    "gen:w": "pnpm dlx tsx --watch ./src/build.ts",
    "check": "tsc -b tsconfig.json",
    "clean": "pnpm run \"/^clean:.*/\"",
    "clean:build": "rm -rf .tsbuildinfo dist build",
    "clean:deps": "rm -rf node_modules",
    "clean:gen": "rm -rf src/__schemas__ src/temp test/__generated__",
    "_postinstall": "pnpm dlx tsx ./src/build.ts",
    "test": "vitest"
  },
  "peerDependencies": {
    "@traversable/derive-validators": "workspace:^",
    "@traversable/derive-equals": "workspace:^",
    "@traversable/registry": "workspace:^",
    "@traversable/schema-core": "workspace:^",
    "@traversable/schema-to-json-schema": "workspace:^",
    "@traversable/schema-to-string": "workspace:^"
  },
  "devDependencies": {
    "@clack/prompts": "^0.10.1",
    "@traversable/derive-validators": "workspace:^",
    "@traversable/derive-equals": "workspace:^",
    "@traversable/registry": "workspace:^",
    "@traversable/schema-core": "workspace:^",
    "@traversable/schema-to-json-schema": "workspace:^",
    "@traversable/schema-to-string": "workspace:^",
    "picocolors": "^1.1.1"
  }
} as const