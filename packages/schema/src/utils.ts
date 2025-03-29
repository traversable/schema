import { __get as get_ } from '@traversable/registry'

import type * as t from './schema.js'

export { get }

function get<
  S extends t.Schema,
  K1 extends keyof S['def'],
  /* @ts-expect-error */
  K2 extends keyof S['def'][K1]['def'],
  /* @ts-expect-error */
  K3 extends keyof S['def'][K1]['def'][K2]['def'],
  /* @ts-expect-error */
  K4 extends keyof S['def'][K1]['def'][K2]['def'][K3]['def'],
  /* @ts-expect-error */
  K5 extends keyof S['def'][K1]['def'][K2]['def'][K3]['def'][K4]['def'],
  /* @ts-expect-error */
  K6 extends keyof S['def'][K1]['def'][K2]['def'][K3]['def'][K4]['def'][K5]['def'],
  /* @ts-expect-error */
  K7 extends keyof S['def'][K1]['def'][K2]['def'][K3]['def'][K4]['def'][K5]['def'][K6]['def'],
  /* @ts-expect-error */
  K8 extends keyof S['def'][K1]['def'][K2]['def'][K3]['def'][K4]['def'][K5]['def'][K6]['def'][K7]['def'],
  /* @ts-expect-error */
  K9 extends keyof S['def'][K1]['def'][K2]['def'][K3]['def'][K4]['def'][K5]['def'][K6]['def'][K7]['def'][K8]['def'],
  /* @ts-expect-error */
  V = S['def'][K1]['def'][K2]['def'][K3]['def'][K4]['def'][K5]['def'][K6]['def'][K7]['def'][K8]['def'][K9]
>(schema: S, ...path: [K1, K2, K3, K4, K5, K6, K7, K8, K9]): V

function get<
  S extends t.Schema,
  K1 extends keyof S['def'],
  /* @ts-expect-error */
  K2 extends keyof S['def'][K1]['def'],
  /* @ts-expect-error */
  K3 extends keyof S['def'][K1]['def'][K2]['def'],
  /* @ts-expect-error */
  K4 extends keyof S['def'][K1]['def'][K2]['def'][K3]['def'],
  /* @ts-expect-error */
  K5 extends keyof S['def'][K1]['def'][K2]['def'][K3]['def'][K4]['def'],
  /* @ts-expect-error */
  K6 extends keyof S['def'][K1]['def'][K2]['def'][K3]['def'][K4]['def'][K5]['def'],
  /* @ts-expect-error */
  K7 extends keyof S['def'][K1]['def'][K2]['def'][K3]['def'][K4]['def'][K5]['def'][K6]['def'],
  /* @ts-expect-error */
  K8 extends keyof S['def'][K1]['def'][K2]['def'][K3]['def'][K4]['def'][K5]['def'][K6]['def'][K7]['def'],
  /* @ts-expect-error */
  V = S['def'][K1]['def'][K2]['def'][K3]['def'][K4]['def'][K5]['def'][K6]['def'][K7]['def'][K8]
>(schema: S, ...path: [K1, K2, K3, K4, K5, K6, K7, K8]): V

function get<
  S extends t.Schema,
  K1 extends keyof S['def'],
  /* @ts-expect-error */
  K2 extends keyof S['def'][K1]['def'],
  /* @ts-expect-error */
  K3 extends keyof S['def'][K1]['def'][K2]['def'],
  /* @ts-expect-error */
  K4 extends keyof S['def'][K1]['def'][K2]['def'][K3]['def'],
  /* @ts-expect-error */
  K5 extends keyof S['def'][K1]['def'][K2]['def'][K3]['def'][K4]['def'],
  /* @ts-expect-error */
  K6 extends keyof S['def'][K1]['def'][K2]['def'][K3]['def'][K4]['def'][K5]['def'],
  /* @ts-expect-error */
  K7 extends keyof S['def'][K1]['def'][K2]['def'][K3]['def'][K4]['def'][K5]['def'][K6]['def'],
  /* @ts-expect-error */
  V = S['def'][K1]['def'][K2]['def'][K3]['def'][K4]['def'][K5]['def'][K6]['def'][K7]
>(schema: S, ...path: [K1, K2, K3, K4, K5, K6, K7]): V

function get<
  S extends t.Schema,
  K1 extends keyof S['def'],
  /* @ts-expect-error */
  K2 extends keyof S['def'][K1]['def'],
  /* @ts-expect-error */
  K3 extends keyof S['def'][K1]['def'][K2]['def'],
  /* @ts-expect-error */
  K4 extends keyof S['def'][K1]['def'][K2]['def'][K3]['def'],
  /* @ts-expect-error */
  K5 extends keyof S['def'][K1]['def'][K2]['def'][K3]['def'][K4]['def'],
  /* @ts-expect-error */
  K6 extends keyof S['def'][K1]['def'][K2]['def'][K3]['def'][K4]['def'][K5]['def'],
  /* @ts-expect-error */
  V = S['def'][K1]['def'][K2]['def'][K3]['def'][K4]['def'][K5]['def'][K6]
>(schema: S, ...path: [K1, K2, K3, K4, K5, K6]): V

function get<
  S extends t.Schema,
  K1 extends keyof S['def'],
  /* @ts-expect-error */
  K2 extends keyof S['def'][K1]['def'],
  /* @ts-expect-error */
  K3 extends keyof S['def'][K1]['def'][K2]['def'],
  /* @ts-expect-error */
  K4 extends keyof S['def'][K1]['def'][K2]['def'][K3]['def'],
  /* @ts-expect-error */
  K5 extends keyof S['def'][K1]['def'][K2]['def'][K3]['def'][K4]['def'],
  /* @ts-expect-error */
  V = S['def'][K1]['def'][K2]['def'][K3]['def'][K4]['def'][K5]
>(schema: S, ...path: [K1, K2, K3, K4, K5]): V

function get<
  S extends t.Schema,
  K1 extends keyof S['def'],
  /* @ts-expect-error */
  K2 extends keyof S['def'][K1]['def'],
  /* @ts-expect-error */
  K3 extends keyof S['def'][K1]['def'][K2]['def'],
  /* @ts-expect-error */
  K4 extends keyof S['def'][K1]['def'][K2]['def'][K3]['def'],
  /* @ts-expect-error */
  V = S['def'][K1]['def'][K2]['def'][K3]['def'][K4]
>(schema: S, ...path: [K1, K2, K3, K4]): V

function get<
  S extends t.Schema,
  K1 extends keyof S['def'],
  /* @ts-expect-error */
  K2 extends keyof S['def'][K1]['def'],
  /* @ts-expect-error */
  K3 extends keyof S['def'][K1]['def'][K2]['def'],
  /* @ts-expect-error */
  V = S['def'][K1]['def'][K2]['def'][K3]
>(schema: S, ...path: [K1, K2, K3]): V

function get<
  S extends t.Schema,
  K1 extends keyof S['def'],
  /* @ts-expect-error */
  K2 extends keyof S['def'][K1]['def'],
  /* @ts-expect-error */
  V = S['def'][K1]['def'][K2]
>(schema: S, ...path: [K1, K2]): V

function get<
  S extends t.Schema,
  K1 extends keyof S['def'], V = S['def'][K1]
>(schema: S, ...key: [K1]): V

function get<
  S extends t.Schema,
  K1 extends keyof S['def'],
  V = S['def'][K1]
>(schema: S, ...path: [K1]): V

function get<
  S extends t.Schema,
>(schema: S, ...path: []): S

function get<S extends t.Schema>(schema: S, ...path: (keyof any)[]) {
  return get_(schema, path.flatMap((segment) => ['def', segment]))
}

export { get$ }

function get$<
  S extends t.Schema,
  K1 extends keyof S['def'],
  K2 extends keyof S['def'][K1],
  K3 extends keyof S['def'][K1][K2],
  K4 extends keyof S['def'][K1][K2][K3],
  K5 extends keyof S['def'][K1][K2][K3][K4],
  K6 extends keyof S['def'][K1][K2][K3][K4][K5],
  K7 extends keyof S['def'][K1][K2][K3][K4][K5][K6],
  K8 extends keyof S['def'][K1][K2][K3][K4][K5][K6][K7],
  K9 extends keyof S['def'][K1][K2][K3][K4][K5][K6][K7][K8],
  V = S['def'][K1][K2][K3][K4][K5][K6][K7][K8][K9]
>(schema: S, ...path: [K1, K2, K3, K4, K5, K6, K7, K8, K9]): V

function get$<
  S extends t.Schema,
  K1 extends keyof S['def'],
  K2 extends keyof S['def'][K1],
  K3 extends keyof S['def'][K1][K2],
  K4 extends keyof S['def'][K1][K2][K3],
  K5 extends keyof S['def'][K1][K2][K3][K4],
  K6 extends keyof S['def'][K1][K2][K3][K4][K5],
  K7 extends keyof S['def'][K1][K2][K3][K4][K5][K6],
  K8 extends keyof S['def'][K1][K2][K3][K4][K5][K6][K7],
  V = S['def'][K1][K2][K3][K4][K5][K6][K7][K8]
>(schema: S, ...path: [K1, K2, K3, K4, K5, K6, K7, K8]): V

function get$<
  S extends t.Schema,
  K1 extends keyof S['def'],
  K2 extends keyof S['def'][K1],
  K3 extends keyof S['def'][K1][K2],
  K4 extends keyof S['def'][K1][K2][K3],
  K5 extends keyof S['def'][K1][K2][K3][K4],
  K6 extends keyof S['def'][K1][K2][K3][K4][K5],
  K7 extends keyof S['def'][K1][K2][K3][K4][K5][K6],
  V = S['def'][K1][K2][K3][K4][K5][K6][K7]
>(schema: S, ...path: [K1, K2, K3, K4, K5, K6, K7]): V

function get$<
  S extends t.Schema,
  K1 extends keyof S['def'],
  K2 extends keyof S['def'][K1],
  K3 extends keyof S['def'][K1][K2],
  K4 extends keyof S['def'][K1][K2][K3],
  K5 extends keyof S['def'][K1][K2][K3][K4],
  K6 extends keyof S['def'][K1][K2][K3][K4][K5],
  V = S['def'][K1][K2][K3][K4][K5][K6]
>(schema: S, ...path: [K1, K2, K3, K4, K5, K6]): V

function get$<
  S extends t.Schema,
  K1 extends keyof S['def'],
  K2 extends keyof S['def'][K1],
  K3 extends keyof S['def'][K1][K2],
  K4 extends keyof S['def'][K1][K2][K3],
  K5 extends keyof S['def'][K1][K2][K3][K4],
  V = S['def'][K1][K2][K3][K4][K5]
>(schema: S, ...path: [K1, K2, K3, K4, K5]): V

function get$<
  S extends t.Schema,
  K1 extends keyof S['def'],
  K2 extends keyof S['def'][K1],
  K3 extends keyof S['def'][K1][K2],
  K4 extends keyof S['def'][K1][K2][K3],
  V = S['def'][K1][K2][K3][K4]
>(schema: S, ...path: [K1, K2, K3, K4]): V

function get$<
  S extends t.Schema,
  K1 extends keyof S['def'],
  K2 extends keyof S['def'][K1],
  K3 extends keyof S['def'][K1][K2],
  V = S['def'][K1][K2][K3]
>(schema: S, ...path: [K1, K2, K3]): V

function get$<
  S extends t.Schema,
  K1 extends keyof S['def'],
  K2 extends keyof S['def'][K1],
  V = S['def'][K1][K2]
>(schema: S, ...path: [K1, K2]): V

function get$<S extends t.Schema, K1 extends keyof S['def'], V = S['def'][K1]>(schema: S, ...path: [K1]): V
function get$<S extends t.Schema>(schema: S, ...path: []): S
/// impl.
function get$<S extends t.Schema>(schema: S, ...path: (keyof any)[]) {
  return get_(schema, path.length === 0 ? [] : ['def', ...path])
}
