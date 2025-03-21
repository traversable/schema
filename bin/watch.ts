#!/usr/bin/env pnpm dlx tsx
import chokidar from "chokidar"
import * as path from "node:path"

const logging = (_?: unknown) => ({
  ...globalThis.console,
})

// const debounce =
function debounce<T>(handler: () => Promise<T>, ms?: number): (_file: string) => void
function debounce<T>(handler: () => Promise<T>, ms: number = 10) {
  let timeout: ReturnType<typeof globalThis.setTimeout> | undefined
  return () => {
    if (timeout) globalThis.clearTimeout(timeout)
    timeout = globalThis.setTimeout(handler, ms)
  }
}

const PATH = {
  dir: path.join(path.resolve(), "packages", "algebra", "__schemas__"),
} as const

function watch(root: string) {
  const configPath = "path"
  const config = {
    dir: PATH.dir
  }
  // resolveConfigPath({ configDirectory: root, })
  const configWatcher = chokidar.watch(configPath)

  let watcher = new chokidar.FSWatcher({})

  const generatorWatcher = () => {
    // const config = getConfig()

    watcher.close()

    console.info(`TSR: Watching schemas in (${config.dir})...`)
    watcher = chokidar.watch(config.dir)

    watcher.on('ready', async () => {
      const handle = async () => {
        try {
          await generator(config, root)
        } catch (err) {
          console.error(err)
          console.info()
        }
      }

      await handle()

      let timeout: ReturnType<typeof setTimeout> | undefined

      const deduped = (_file: string) => {
        if (timeout) {
          clearTimeout(timeout)
        }

        timeout = setTimeout(handle, 10)
      }

      watcher.on('change', deduped)
      watcher.on('add', deduped)
      watcher.on('unlink', deduped)
    })
  }

  configWatcher.on('ready', generatorWatcher)
  configWatcher.on('change', generatorWatcher)
}

async function generator(config: {}, root: string): Promise<string> {
  console.log("calling generator")
  return Promise.resolve("42")
}

watch("root")

// export async function generator(config: Config, root: string) {
//   const logger = logging({ disabled: config.disableLogging })
//   logger.log('')

//   if (!isFirst) {
//     logger.log('♻️  Generating routes...')
//     isFirst = true
//   } else if (skipMessage) {
//     skipMessage = false
//   } else {
//     logger.log('♻️  Regenerating routes...')
//   }

//   const taskId = latestTask + 1
//   latestTask = taskId

//   const checkLatest = () => {
//     if (latestTask !== taskId) {
//       skipMessage = true
//       return false
//     }

//     return true
//   }

//   const start = Date.now()

//   const TYPES_DISABLED = config.disableTypes

//   const prettierOptions: prettier.Options = {
//     semi: config.semicolons,
//     singleQuote: config.quoteStyle === 'single',
//     parser: 'typescript',
//   }

//   let getRouteNodesResult: GetRouteNodesResult

//   if (config.virtualRouteConfig) {
//     getRouteNodesResult = await virtualGetRouteNodes(config, root)
//   } else {
//     getRouteNodesResult = await physicalGetRouteNodes(config, root)
//   }

//   const { rootRouteNode, routeNodes: beforeRouteNodes } = getRouteNodesResult
//   if (rootRouteNode === undefined) {
//     let errorMessage = `rootRouteNode must not be undefined. Make sure you've added your root route into the route-tree.`
//     if (!config.virtualRouteConfig) {
//       errorMessage += `\nMake sure that you add a "${rootPathId}.${config.disableTypes ? 'js' : 'tsx'}" file to your routes directory.\nAdd the file in: "${config.routesDirectory}/${rootPathId}.${config.disableTypes ? 'js' : 'tsx'}"`
//     }
//     throw new Error(errorMessage)
//   }

//   const preRouteNodes = multiSortBy(beforeRouteNodes, [
//     (d) => (d.routePath === '/' ? -1 : 1),
//     (d) => d.routePath?.split('/').length,
//     (d) =>
//       d.filePath.match(new RegExp(`[./]${config.indexToken}[.]`)) ? 1 : -1,
//     (d) =>
//       d.filePath.match(
//         /[./](component|errorComponent|pendingComponent|loader|lazy)[.]/,
//       )
//         ? 1
//         : -1,
//     (d) =>
//       d.filePath.match(new RegExp(`[./]${config.routeToken}[.]`)) ? -1 : 1,
//     (d) => (d.routePath?.endsWith('/') ? -1 : 1),
//     (d) => d.routePath,
//   ]).filter((d) => ![`/${rootPathId}`].includes(d.routePath || ''))

//   const routeTree: Array<RouteNode> = []
//   const routePiecesByPath: Record<string, RouteSubNode> = {}

//   // Loop over the flat list of routeNodes and
//   // build up a tree based on the routeNodes' routePath
//   const routeNodes: Array<RouteNode> = []

//   // the handleRootNode function is not being collapsed into the handleNode function
//   // because it requires only a subset of the logic that the handleNode function requires
//   // and it's easier to read and maintain this way
//   const handleRootNode = async (node?: RouteNode) => {
//     if (!node) {
//       // currently this is not being handled, but it could be in the future
//       // for example to handle a virtual root route
//       return
//     }

//     // from here on, we are only handling the root node that's present in the file system
//     const routeCode = fs.readFileSync(node.fullPath, 'utf-8')

//     if (!routeCode) {
//       const replaced = fillTemplate(
//         [
//           'import * as React from "react"\n',
//           '%%tsrImports%%',
//           '\n\n',
//           '%%tsrExportStart%%{\n component: RootComponent\n }%%tsrExportEnd%%\n\n',
//           'function RootComponent() { return (<React.Fragment><div>Hello "%%tsrPath%%"!</div><Outlet /></React.Fragment>) };\n',
//         ].join(''),
//         {
//           tsrImports:
//             "import { Outlet, createRootRoute } from '@tanstack/react-router';",
//           tsrPath: rootPathId,
//           tsrExportStart: `export const Route = createRootRoute(`,
//           tsrExportEnd: ');',
//         },
//       )

//       logger.log(`🟡 Creating ${node.fullPath}`)
//       fs.writeFileSync(
//         node.fullPath,
//         await prettier.format(replaced, prettierOptions),
//       )
//     }
//   }

//   await handleRootNode(rootRouteNode)

//   const handleNode = async (node: RouteNode) => {
//     let parentRoute = hasParentRoute(routeNodes, node, node.routePath)

//     // if the parent route is a virtual parent route, we need to find the real parent route
//     if (parentRoute?.isVirtualParentRoute && parentRoute.children?.length) {
//       // only if this sub-parent route returns a valid parent route, we use it, if not leave it as it
//       const possibleParentRoute = hasParentRoute(
//         parentRoute.children,
//         node,
//         node.routePath,
//       )
//       if (possibleParentRoute) {
//         parentRoute = possibleParentRoute
//       }
//     }

//     if (parentRoute) node.parent = parentRoute

//     node.path = determineNodePath(node)

//     const trimmedPath = trimPathLeft(node.path ?? '')

//     const split = trimmedPath.split('/')
//     const lastRouteSegment = split[split.length - 1] ?? trimmedPath

//     node.isNonPath =
//       lastRouteSegment.startsWith('_') ||
//       routeGroupPatternRegex.test(lastRouteSegment)

//     node.cleanedPath = removeGroups(
//       removeUnderscores(removeLayoutSegments(node.path)) ?? '',
//     )

//     // Ensure the boilerplate for the route exists, which can be skipped for virtual parent routes and virtual routes
//     if (!node.isVirtualParentRoute && !node.isVirtual) {
//       const routeCode = fs.readFileSync(node.fullPath, 'utf-8')

//       const escapedRoutePath = node.routePath?.replaceAll('$', '$$') ?? ''

//       let replaced = routeCode

//       if (!routeCode) {
//         if (node.isLazy) {
//           replaced = fillTemplate(config.customScaffolding.routeTemplate, {
//             tsrImports:
//               "import { createLazyFileRoute } from '@tanstack/react-router';",
//             tsrPath: escapedRoutePath,
//             tsrExportStart: `export const Route = createLazyFileRoute('${escapedRoutePath}')(`,
//             tsrExportEnd: ');',
//           })
//         } else if (
//           node.isRoute ||
//           (!node.isComponent &&
//             !node.isErrorComponent &&
//             !node.isPendingComponent &&
//             !node.isLoader)
//         ) {
//           replaced = fillTemplate(config.customScaffolding.routeTemplate, {
//             tsrImports:
//               "import { createFileRoute } from '@tanstack/react-router';",
//             tsrPath: escapedRoutePath,
//             tsrExportStart: `export const Route = createFileRoute('${escapedRoutePath}')(`,
//             tsrExportEnd: ');',
//           })
//         }
//       } else {
//         replaced = routeCode
//           .replace(
//             /(FileRoute\(\s*['"])([^\s]*)(['"],?\s*\))/g,
//             (_, p1, __, p3) => `${p1}${escapedRoutePath}${p3}`,
//           )
//           .replace(
//             /(import\s*\{.*)(create(Lazy)?FileRoute)(.*\}\s*from\s*['"]@tanstack\/react-router['"])/gs,
//             (_, p1, __, ___, p4) =>
//               `${p1}${node.isLazy ? 'createLazyFileRoute' : 'createFileRoute'}${p4}`,
//           )
//           .replace(
//             /create(Lazy)?FileRoute(\(\s*['"])([^\s]*)(['"],?\s*\))/g,
//             (_, __, p2, ___, p4) =>
//               `${node.isLazy ? 'createLazyFileRoute' : 'createFileRoute'}${p2}${escapedRoutePath}${p4}`,
//           )
//       }

//       await writeIfDifferent(
//         node.fullPath,
//         prettierOptions,
//         routeCode,
//         replaced,
//         {
//           beforeWrite: () => {
//             logger.log(`🟡 Updating ${node.fullPath}`)
//           },
//         },
//       )
//     }

//     if (
//       !node.isVirtual &&
//       (node.isLoader ||
//         node.isComponent ||
//         node.isErrorComponent ||
//         node.isPendingComponent ||
//         node.isLazy)
//     ) {
//       routePiecesByPath[node.routePath!] =
//         routePiecesByPath[node.routePath!] || {}

//       routePiecesByPath[node.routePath!]![
//         node.isLazy
//           ? 'lazy'
//           : node.isLoader
//             ? 'loader'
//             : node.isErrorComponent
//               ? 'errorComponent'
//               : node.isPendingComponent
//                 ? 'pendingComponent'
//                 : 'component'
//       ] = node

//       const anchorRoute = routeNodes.find((d) => d.routePath === node.routePath)

//       if (!anchorRoute) {
//         await handleNode({
//           ...node,
//           isVirtual: true,
//           isLazy: false,
//           isLoader: false,
//           isComponent: false,
//           isErrorComponent: false,
//           isPendingComponent: false,
//         })
//       }
//       return
//     }

//     const cleanedPathIsEmpty = (node.cleanedPath || '').length === 0
//     const nonPathRoute = node.isRoute && node.isNonPath
//     node.isVirtualParentRequired =
//       node.isLayout || nonPathRoute ? !cleanedPathIsEmpty : false
//     if (!node.isVirtual && node.isVirtualParentRequired) {
//       const parentRoutePath = removeLastSegmentFromPath(node.routePath) || '/'
//       const parentVariableName = routePathToVariable(parentRoutePath)

//       const anchorRoute = routeNodes.find(
//         (d) => d.routePath === parentRoutePath,
//       )

//       if (!anchorRoute) {
//         const parentNode = {
//           ...node,
//           path: removeLastSegmentFromPath(node.path) || '/',
//           filePath: removeLastSegmentFromPath(node.filePath) || '/',
//           fullPath: removeLastSegmentFromPath(node.fullPath) || '/',
//           routePath: parentRoutePath,
//           variableName: parentVariableName,
//           isVirtual: true,
//           isLayout: false,
//           isVirtualParentRoute: true,
//           isVirtualParentRequired: false,
//         }

//         parentNode.children = parentNode.children ?? []
//         parentNode.children.push(node)

//         node.parent = parentNode

//         if (node.isLayout) {
//           // since `node.path` is used as the `id` on the route definition, we need to update it
//           node.path = determineNodePath(node)
//         }

//         await handleNode(parentNode)
//       } else {
//         anchorRoute.children = anchorRoute.children ?? []
//         anchorRoute.children.push(node)

//         node.parent = anchorRoute
//       }
//     }

//     if (node.parent) {
//       if (!node.isVirtualParentRequired) {
//         node.parent.children = node.parent.children ?? []
//         node.parent.children.push(node)
//       }
//     } else {
//       routeTree.push(node)
//     }

//     routeNodes.push(node)
//   }

//   for (const node of preRouteNodes.filter((d) => !d.isAPIRoute)) {
//     await handleNode(node)
//   }
//   checkRouteFullPathUniqueness(
//     preRouteNodes.filter(
//       (d) => !d.isAPIRoute && d.children === undefined && d.isLazy !== true,
//     ),
//     config,
//   )

//   const startAPIRouteNodes: Array<RouteNode> = checkStartAPIRoutes(
//     preRouteNodes.filter((d) => d.isAPIRoute),
//     config,
//   )

//   const handleAPINode = async (node: RouteNode) => {
//     const routeCode = fs.readFileSync(node.fullPath, 'utf-8')

//     const escapedRoutePath = node.routePath?.replaceAll('$', '$$') ?? ''

//     if (!routeCode) {
//       const replaced = fillTemplate(config.customScaffolding.apiTemplate, {
//         tsrImports: "import { createAPIFileRoute } from '@tanstack/start/api';",
//         tsrPath: escapedRoutePath,
//         tsrExportStart: `export const ${CONSTANTS.APIRouteExportVariable} = createAPIFileRoute('${escapedRoutePath}')(`,
//         tsrExportEnd: ');',
//       })

//       logger.log(`🟡 Creating ${node.fullPath}`)
//       fs.writeFileSync(
//         node.fullPath,
//         await prettier.format(replaced, prettierOptions),
//       )
//     } else {
//       await writeIfDifferent(
//         node.fullPath,
//         prettierOptions,
//         routeCode,
//         routeCode.replace(
//           /(createAPIFileRoute\(\s*['"])([^\s]*)(['"],?\s*\))/g,
//           (_, p1, __, p3) => `${p1}${escapedRoutePath}${p3}`,
//         ),
//         {
//           beforeWrite: () => {
//             logger.log(`🟡 Updating ${node.fullPath}`)
//           },
//         },
//       )
//     }
//   }

//   for (const node of startAPIRouteNodes) {
//     await handleAPINode(node)
//   }

//   function buildRouteTreeConfig(nodes: Array<RouteNode>, depth = 1): string {
//     const children = nodes.map((node) => {
//       if (node.isRoot) {
//         return
//       }

//       if (node.isLayout && !node.children?.length) {
//         return
//       }

//       const route = `${node.variableName}Route`

//       if (node.children?.length) {
//         const childConfigs = buildRouteTreeConfig(node.children, depth + 1)

//         const childrenDeclaration = TYPES_DISABLED
//           ? ''
//           : `interface ${route}Children {
//   ${node.children.map((child) => `${child.variableName}Route: typeof ${getResolvedRouteNodeVariableName(child)}`).join(',')}
// }`

//         const children = `const ${route}Children${TYPES_DISABLED ? '' : `: ${route}Children`} = {
//   ${node.children.map((child) => `${child.variableName}Route: ${getResolvedRouteNodeVariableName(child)}`).join(',')}
// }`

//         const routeWithChildren = `const ${route}WithChildren = ${route}._addFileChildren(${route}Children)`

//         return [
//           childConfigs,
//           childrenDeclaration,
//           children,
//           routeWithChildren,
//         ].join('\n\n')
//       }

//       return undefined
//     })

//     return children.filter(Boolean).join('\n\n')
//   }

//   const routeConfigChildrenText = buildRouteTreeConfig(routeTree)

//   const sortedRouteNodes = multiSortBy(routeNodes, [
//     (d) => (d.routePath?.includes(`/${rootPathId}`) ? -1 : 1),
//     (d) => d.routePath?.split('/').length,
//     (d) => (d.routePath?.endsWith(config.indexToken) ? -1 : 1),
//     (d) => d,
//   ])

//   const imports = Object.entries({
//     createFileRoute: sortedRouteNodes.some((d) => d.isVirtual),
//     lazyFn: sortedRouteNodes.some(
//       (node) => routePiecesByPath[node.routePath!]?.loader,
//     ),
//     lazyRouteComponent: sortedRouteNodes.some(
//       (node) =>
//         routePiecesByPath[node.routePath!]?.component ||
//         routePiecesByPath[node.routePath!]?.errorComponent ||
//         routePiecesByPath[node.routePath!]?.pendingComponent,
//     ),
//   })
//     .filter((d) => d[1])
//     .map((d) => d[0])

//   const virtualRouteNodes = sortedRouteNodes.filter((d) => d.isVirtual)

//   function getImportPath(node: RouteNode) {
//     return replaceBackslash(
//       removeExt(
//         path.relative(
//           path.dirname(config.generatedRouteTree),
//           path.resolve(config.routesDirectory, node.filePath),
//         ),
//         config.addExtensions,
//       ),
//     )
//   }
//   const routeImports = [
//     ...config.routeTreeFileHeader,
//     `// This file was automatically generated by TanStack Router.
// // You should NOT make any changes in this file as it will be overwritten.
// // Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.`,
//     imports.length
//       ? `import { ${imports.join(', ')} } from '@tanstack/react-router'\n`
//       : '',
//     '// Import Routes',
//     [
//       `import { Route as rootRoute } from './${getImportPath(rootRouteNode)}'`,
//       ...sortedRouteNodes
//         .filter((d) => !d.isVirtual)
//         .map((node) => {
//           return `import { Route as ${
//             node.variableName
//           }Import } from './${getImportPath(node)}'`
//         }),
//     ].join('\n'),
//     virtualRouteNodes.length ? '// Create Virtual Routes' : '',
//     virtualRouteNodes
//       .map((node) => {
//         return `const ${
//           node.variableName
//         }Import = createFileRoute('${node.routePath}')()`
//       })
//       .join('\n'),
//     '// Create/Update Routes',
//     sortedRouteNodes
//       .map((node) => {
//         const loaderNode = routePiecesByPath[node.routePath!]?.loader
//         const componentNode = routePiecesByPath[node.routePath!]?.component
//         const errorComponentNode =
//           routePiecesByPath[node.routePath!]?.errorComponent
//         const pendingComponentNode =
//           routePiecesByPath[node.routePath!]?.pendingComponent
//         const lazyComponentNode = routePiecesByPath[node.routePath!]?.lazy

//         return [
//           `const ${node.variableName}Route = ${node.variableName}Import.update({
//           ${[
//             `id: '${node.path}'`,
//             !node.isNonPath ? `path: '${node.cleanedPath}'` : undefined,
//             `getParentRoute: () => ${node.parent?.variableName ?? 'root'}Route`,
//           ]
//             .filter(Boolean)
//             .join(',')}
//         }${TYPES_DISABLED ? '' : 'as any'})`,
//           loaderNode
//             ? `.updateLoader({ loader: lazyFn(() => import('./${replaceBackslash(
//                 removeExt(
//                   path.relative(
//                     path.dirname(config.generatedRouteTree),
//                     path.resolve(config.routesDirectory, loaderNode.filePath),
//                   ),
//                   config.addExtensions,
//                 ),
//               )}'), 'loader') })`
//             : '',
//           componentNode || errorComponentNode || pendingComponentNode
//             ? `.update({
//               ${(
//                 [
//                   ['component', componentNode],
//                   ['errorComponent', errorComponentNode],
//                   ['pendingComponent', pendingComponentNode],
//                 ] as const
//               )
//                 .filter((d) => d[1])
//                 .map((d) => {
//                   return `${
//                     d[0]
//                   }: lazyRouteComponent(() => import('./${replaceBackslash(
//                     removeExt(
//                       path.relative(
//                         path.dirname(config.generatedRouteTree),
//                         path.resolve(config.routesDirectory, d[1]!.filePath),
//                       ),
//                       config.addExtensions,
//                     ),
//                   )}'), '${d[0]}')`
//                 })
//                 .join('\n,')}
//             })`
//             : '',
//           lazyComponentNode
//             ? `.lazy(() => import('./${replaceBackslash(
//                 removeExt(
//                   path.relative(
//                     path.dirname(config.generatedRouteTree),
//                     path.resolve(
//                       config.routesDirectory,
//                       lazyComponentNode.filePath,
//                     ),
//                   ),
//                   config.addExtensions,
//                 ),
//               )}').then((d) => d.Route))`
//             : '',
//         ].join('')
//       })
//       .join('\n\n'),
//     ...(TYPES_DISABLED
//       ? []
//       : [
//           '// Populate the FileRoutesByPath interface',
//           `declare module '@tanstack/react-router' {
//   interface FileRoutesByPath {
//     ${routeNodes
//       .map((routeNode) => {
//         const filePathId = routeNode.routePath

//         return `'${filePathId}': {
//           id: '${filePathId}'
//           path: '${inferPath(routeNode)}'
//           fullPath: '${inferFullPath(routeNode)}'
//           preLoaderRoute: typeof ${routeNode.variableName}Import
//           parentRoute: typeof ${
//             routeNode.isVirtualParentRequired
//               ? `${routeNode.parent?.variableName}Route`
//               : routeNode.parent?.variableName
//                 ? `${routeNode.parent.variableName}Import`
//                 : 'rootRoute'
//           }
//         }`
//       })
//       .join('\n')}
//   }
// }`,
//         ]),
//     '// Create and export the route tree',
//     routeConfigChildrenText,
//     ...(TYPES_DISABLED
//       ? []
//       : [
//           `export interface FileRoutesByFullPath {
//   ${[...createRouteNodesByFullPath(routeNodes).entries()].map(
//     ([fullPath, routeNode]) => {
//       return `'${fullPath}': typeof ${getResolvedRouteNodeVariableName(routeNode)}`
//     },
//   )}
// }`,
//           `export interface FileRoutesByTo {
//   ${[...createRouteNodesByTo(routeNodes).entries()].map(([to, routeNode]) => {
//     return `'${to}': typeof ${getResolvedRouteNodeVariableName(routeNode)}`
//   })}
// }`,
//           `export interface FileRoutesById {
//   '__root__': typeof rootRoute,
//   ${[...createRouteNodesById(routeNodes).entries()].map(([id, routeNode]) => {
//     return `'${id}': typeof ${getResolvedRouteNodeVariableName(routeNode)}`
//   })}
// }`,
//           `export interface FileRouteTypes {
//   fileRoutesByFullPath: FileRoutesByFullPath
//   fullPaths: ${routeNodes.length > 0 ? [...createRouteNodesByFullPath(routeNodes).keys()].map((fullPath) => `'${fullPath}'`).join('|') : 'never'}
//   fileRoutesByTo: FileRoutesByTo
//   to: ${routeNodes.length > 0 ? [...createRouteNodesByTo(routeNodes).keys()].map((to) => `'${to}'`).join('|') : 'never'}
//   id: ${[`'__root__'`, ...[...createRouteNodesById(routeNodes).keys()].map((id) => `'${id}'`)].join('|')}
//   fileRoutesById: FileRoutesById
// }`,
//           `export interface RootRouteChildren {
//   ${routeTree.map((child) => `${child.variableName}Route: typeof ${getResolvedRouteNodeVariableName(child)}`).join(',')}
// }`,
//         ]),
//     `const rootRouteChildren${TYPES_DISABLED ? '' : ': RootRouteChildren'} = {
//   ${routeTree.map((child) => `${child.variableName}Route: ${getResolvedRouteNodeVariableName(child)}`).join(',')}
// }`,
//     `export const routeTree = rootRoute._addFileChildren(rootRouteChildren)${TYPES_DISABLED ? '' : '._addFileTypes<FileRouteTypes>()'}`,
//     ...config.routeTreeFileFooter,
//   ]
//     .filter(Boolean)
//     .join('\n\n')

//   const createRouteManifest = () => {
//     const routesManifest = {
//       __root__: {
//         filePath: rootRouteNode.filePath,
//         children: routeTree.map((d) => d.routePath),
//       },
//       ...Object.fromEntries(
//         routeNodes.map((d) => {
//           const filePathId = d.routePath

//           return [
//             filePathId,
//             {
//               filePath: d.filePath,
//               parent: d.parent?.routePath ? d.parent.routePath : undefined,
//               children: d.children?.map((childRoute) => childRoute.routePath),
//             },
//           ]
//         }),
//       ),
//     }

//     return JSON.stringify(
//       {
//         routes: routesManifest,
//       },
//       null,
//       2,
//     )
//   }

//   const routeConfigFileContent = config.disableManifestGeneration
//     ? routeImports
//     : [
//         routeImports,
//         '\n',
//         '/* ROUTE_MANIFEST_START',
//         createRouteManifest(),
//         'ROUTE_MANIFEST_END */',
//       ].join('\n')

//   if (!checkLatest()) return

//   const existingRouteTreeContent = await fsp
//     .readFile(path.resolve(config.generatedRouteTree), 'utf-8')
//     .catch((err) => {
//       if (err.code === 'ENOENT') {
//         return ''
//       }

//       throw err
//     })

//   if (!checkLatest()) return

//   // Ensure the directory exists
//   await fsp.mkdir(path.dirname(path.resolve(config.generatedRouteTree)), {
//     recursive: true,
//   })

//   if (!checkLatest()) return

//   // Write the route tree file, if it has changed
//   const routeTreeWriteResult = await writeIfDifferent(
//     path.resolve(config.generatedRouteTree),
//     prettierOptions,
//     existingRouteTreeContent,
//     routeConfigFileContent,
//     {
//       beforeWrite: () => {
//         logger.log(`🟡 Updating ${config.generatedRouteTree}`)
//       },
//     },
//   )
//   if (routeTreeWriteResult && !checkLatest()) {
//     return
//   }

//   logger.log(
//     `✅ Processed ${routeNodes.length === 1 ? 'route' : 'routes'} in ${
//       Date.now() - start
//     }ms`,
//   )
// }

// function removeGroups(s: string) {
//   return s.replace(possiblyNestedRouteGroupPatternRegex, '')
// }

// /**
//  * The `node.path` is used as the `id` in the route definition.
//  * This function checks if the given node has a parent and if so, it determines the correct path for the given node.
//  * @param node - The node to determine the path for.
//  * @returns The correct path for the given node.
//  */
// function determineNodePath(node: RouteNode) {
//   return (node.path = node.parent
//     ? node.routePath?.replace(node.parent.routePath ?? '', '') || '/'
//     : node.routePath)
// }

// /**
//  * Removes the last segment from a given path. Segments are considered to be separated by a '/'.
//  *
//  * @param {string} routePath - The path from which to remove the last segment. Defaults to '/'.
//  * @returns {string} The path with the last segment removed.
//  * @example
//  * removeLastSegmentFromPath('/workspace/_auth/foo') // '/workspace/_auth'
//  */
// export function removeLastSegmentFromPath(routePath: string = '/'): string {
//   const segments = routePath.split('/')
//   segments.pop() // Remove the last segment
//   return segments.join('/')
// }

// /**
//  * Removes all segments from a given path that start with an underscore ('_').
//  *
//  * @param {string} routePath - The path from which to remove segments. Defaults to '/'.
//  * @returns {string} The path with all underscore-prefixed segments removed.
//  * @example
//  * removeLayoutSegments('/workspace/_auth/foo') // '/workspace/foo'
//  */
// function removeLayoutSegments(routePath: string = '/'): string {
//   const segments = routePath.split('/')
//   const newSegments = segments.filter((segment) => !segment.startsWith('_'))
//   return newSegments.join('/')
// }

// export function hasParentRoute(
//   routes: Array<RouteNode>,
//   node: RouteNode,
//   routePathToCheck: string | undefined,
// ): RouteNode | null {
//   if (!routePathToCheck || routePathToCheck === '/') {
//     return null
//   }

//   const sortedNodes = multiSortBy(routes, [
//     (d) => d.routePath!.length * -1,
//     (d) => d.variableName,
//   ]).filter((d) => d.routePath !== `/${rootPathId}`)

//   for (const route of sortedNodes) {
//     if (route.routePath === '/') continue

//     if (
//       routePathToCheck.startsWith(`${route.routePath}/`) &&
//       route.routePath !== routePathToCheck
//     ) {
//       return route
//     }
//   }

//   const segments = routePathToCheck.split('/')
//   segments.pop() // Remove the last segment
//   const parentRoutePath = segments.join('/')

//   return hasParentRoute(routes, node, parentRoutePath)
// }

// /**
//  * Gets the final variable name for a route
//  */
// export const getResolvedRouteNodeVariableName = (
//   routeNode: RouteNode,
// ): string => {
//   return routeNode.children?.length
//     ? `${routeNode.variableName}RouteWithChildren`
//     : `${routeNode.variableName}Route`
// }

// /**
//  * Creates a map from fullPath to routeNode
//  */
// export const createRouteNodesByFullPath = (
//   routeNodes: Array<RouteNode>,
// ): Map<string, RouteNode> => {
//   return new Map(
//     routeNodes.map((routeNode) => [inferFullPath(routeNode), routeNode]),
//   )
// }

// /**
//  * Create a map from 'to' to a routeNode
//  */
// export const createRouteNodesByTo = (
//   routeNodes: Array<RouteNode>,
// ): Map<string, RouteNode> => {
//   return new Map(
//     dedupeBranchesAndIndexRoutes(routeNodes).map((routeNode) => [
//       inferTo(routeNode),
//       routeNode,
//     ]),
//   )
// }

// /**
//  * Create a map from 'id' to a routeNode
//  */
// export const createRouteNodesById = (
//   routeNodes: Array<RouteNode>,
// ): Map<string, RouteNode> => {
//   return new Map(
//     routeNodes.map((routeNode) => {
//       const id = routeNode.routePath ?? ''
//       return [id, routeNode]
//     }),
//   )
// }

// /**
//  * Infers the full path for use by TS
//  */
// export const inferFullPath = (routeNode: RouteNode): string => {
//   const fullPath = removeGroups(
//     removeUnderscores(removeLayoutSegments(routeNode.routePath)) ?? '',
//   )

//   return routeNode.cleanedPath === '/' ? fullPath : fullPath.replace(/\/$/, '')
// }

// /**
//  * Infers the path for use by TS
//  */
// export const inferPath = (routeNode: RouteNode): string => {
//   return routeNode.cleanedPath === '/'
//     ? routeNode.cleanedPath
//     : (routeNode.cleanedPath?.replace(/\/$/, '') ?? '')
// }

// /**
//  * Infers to path
//  */
// export const inferTo = (routeNode: RouteNode): string => {
//   const fullPath = inferFullPath(routeNode)

//   if (fullPath === '/') return fullPath

//   return fullPath.replace(/\/$/, '')
// }

// /**
//  * Dedupes branches and index routes
//  */
// export const dedupeBranchesAndIndexRoutes = (
//   routes: Array<RouteNode>,
// ): Array<RouteNode> => {
//   return routes.filter((route) => {
//     if (route.children?.find((child) => child.cleanedPath === '/')) return false
//     return true
//   })
// }

// function checkUnique<TElement>(routes: Array<TElement>, key: keyof TElement) {
//   // Check no two routes have the same `key`
//   // if they do, throw an error with the conflicting filePaths
//   const keys = routes.map((d) => d[key])
//   const uniqueKeys = new Set(keys)
//   if (keys.length !== uniqueKeys.size) {
//     const duplicateKeys = keys.filter((d, i) => keys.indexOf(d) !== i)
//     const conflictingFiles = routes.filter((d) =>
//       duplicateKeys.includes(d[key]),
//     )
//     return conflictingFiles
//   }
//   return undefined
// }

// function checkRouteFullPathUniqueness(
//   _routes: Array<RouteNode>,
//   config: Config,
// ) {
//   const routes = _routes.map((d) => {
//     const inferredFullPath = inferFullPath(d)
//     return { ...d, inferredFullPath }
//   })

//   const conflictingFiles = checkUnique(routes, 'inferredFullPath')

//   if (conflictingFiles !== undefined) {
//     const errorMessage = `Conflicting configuration paths were found for the following route${conflictingFiles.length > 1 ? 's' : ''}: ${conflictingFiles
//       .map((p) => `"${p.inferredFullPath}"`)
//       .join(', ')}.
// Please ensure each route has a unique full path.
// Conflicting files: \n ${conflictingFiles.map((d) => path.resolve(config.routesDirectory, d.filePath)).join('\n ')}\n`
//     throw new Error(errorMessage)
//   }
// }

// function checkStartAPIRoutes(_routes: Array<RouteNode>, config: Config) {
//   if (_routes.length === 0) {
//     return []
//   }

//   // Make sure these are valid URLs
//   // Route Groups and Layout Routes aren't being removed since
//   // you may want to have an API route that starts with an underscore
//   // or be wrapped in parentheses
//   const routes = _routes.map((d) => {
//     const routePath = removeTrailingSlash(d.routePath ?? '')
//     return { ...d, routePath }
//   })

//   const conflictingFiles = checkUnique(routes, 'routePath')

//   if (conflictingFiles !== undefined) {
//     const errorMessage = `Conflicting configuration paths were found for the following API route${conflictingFiles.length > 1 ? 's' : ''}: ${conflictingFiles
//       .map((p) => `"${p}"`)
//       .join(', ')}.
//   Please ensure each API route has a unique route path.
// Conflicting files: \n ${conflictingFiles.map((d) => path.resolve(config.routesDirectory, d.filePath)).join('\n ')}\n`
//     throw new Error(errorMessage)
//   }

//   return routes
// }

// export type StartAPIRoutePathSegment = {
//   value: string
//   type: 'path' | 'param' | 'splat'
// }

// /**
//  * This function takes in a path in the format accepted by TanStack Router
//  * and returns an array of path segments that can be used to generate
//  * the pathname of the TanStack Start API route.
//  *
//  * @param src
//  * @returns
//  */
// export function startAPIRouteSegmentsFromTSRFilePath(
//   src: string,
//   config: Config,
// ): Array<StartAPIRoutePathSegment> {
//   const routePath = determineInitialRoutePath(src)

//   const parts = routePath
//     .replaceAll('.', '/')
//     .split('/')
//     .filter((p) => !!p && p !== config.indexToken)
//   const segments: Array<StartAPIRoutePathSegment> = parts.map((part) => {
//     if (part.startsWith('$')) {
//       if (part === '$') {
//         return { value: part, type: 'splat' }
//       }

//       part.replaceAll('$', '')
//       return { value: part, type: 'param' }
//     }

//     return { value: part, type: 'path' }
//   })

//   return segments
// }

// type TemplateTag = 'tsrImports' | 'tsrPath' | 'tsrExportStart' | 'tsrExportEnd'

// function fillTemplate(template: string, values: Record<TemplateTag, string>) {
//   return template.replace(
//     /%%(\w+)%%/g,
//     (_, key) => values[key as TemplateTag] || '',
//   )
// }

