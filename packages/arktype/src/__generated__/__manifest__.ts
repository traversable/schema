export default {
  "name": "@traversable/arktype",
  "type": "module",
  "version": "0.0.6",
  "private": false,
  "description": "",
  "license": "Hippocratic-2.1",
  "repository": {
    "type": "git",
    "url": "https://github.com/traversable/schema.git",
    "directory": "packages/arktype"
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
  "dependencies": {
    "@traversable/json-schema": "workspace:^",
    "@traversable/registry": "workspace:^"
  },
  "peerDependencies": {
    "arktype": "2"
  },
  "peerDependenciesMeta": {
    "arktype": {
      "optional": false
    }
  },
  "devDependencies": {
    "@prettier/sync": "catalog:",
    "@traversable/arktype-test": "workspace:^",
    "arktype": "catalog:"
  }
} as const