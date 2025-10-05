import * as fc from 'fast-check'
import type * as T from '@traversable/registry'
import { Object_keys, PATTERN } from '@traversable/registry'
import type { OperationType } from '@traversable/graphql-types'
import * as F from '@traversable/graphql-types'

import { Config } from './generator-options.js'

type Constraints = Config.Options
// type Constraints = Required<Config.Constraints>

export function invert<T extends Record<keyof any, keyof any>>(x: T): { [K in keyof T as T[K]]: K }
export function invert(x: Record<keyof any, keyof any>) {
  return Object_keys(x).reduce((acc, k) => (acc[x[k]] = k, acc), {} as typeof x)
}

const EXAMPLE = [
  360, [
    [
      400, // OperationDefinition
      "ornare",
      "query",
      [
        420,
        []
      ],
      [
        [
          330,
          "suscipit",
          [
            270,
            [
              20,
              "turpis"
            ]
          ],
          [
            110,
            true
          ],
          []
        ]
      ],
      [
        340,
        "fermentum",
        [
          [
            290,
            "egestas",
            [
              130,
              -4.442196362483118e+172
            ]
          ]
        ]
      ]
    ]
  ]
]

export type Tag = byTag[keyof byTag]
export type byTag = typeof byTag
export const byTag = {
  Name: 10,
  NamedType: 20,
  /* scalars */
  Boolean: 30,
  Float: 40,
  ID: 50,
  Int: 60,
  Null: 70,
  Number: 80,
  ScalarTypeDefinition: 90,
  String: 100,
  /* values */
  BooleanValue: 110,
  EnumValue: 120,
  FloatValue: 130,
  IntValue: 140,
  ListValue: 150,
  NullValue: 160,
  ObjectValue: 170,
  StringValue: 180,
  /* type definitions */
  EnumTypeDefinition: 190,
  EnumValueDefinition: 200,
  Field: 210,
  FieldDefinition: 220,
  ObjectField: 230,
  ObjectTypeDefinition: 240,
  InterfaceTypeDefinition: 250,
  /* modifiers */
  ListType: 260,
  NonNullType: 270,
  UnionTypeDefinition: 280,
  /* args */
  Argument: 290,
  InputObjectTypeDefinition: 300,
  InputValueDefinition: 310,
  Variable: 320,
  VariableDefinition: 330,
  /* special */
  Directive: 340,
  DirectiveDefinition: 350,
  Document: 360,
  FragmentDefinition: 370,
  FragmentSpread: 380,
  InlineFragment: 390,
  OperationDefinition: 400,
  OperationTypeDefinition: 410,
  SelectionSet: 420,
  SchemaDefinition: 430,
  // SchemaExtension: 440,
} as const satisfies Record<'Name' | F.Kind | F.NamedType, number>

export type bySeed = typeof bySeed
export const bySeed = invert(byTag)

export const identifier = fc.stringMatching(new RegExp(PATTERN.identifierNoDollar, 'u')).map((x) => `${x.charAt(0).toUpperCase()}${x.slice(1)}`)
// export const name = fc.lorem({ maxCount: 1 })
export const alias = identifier
export const target = fc.constantFrom(...F.DirectiveTargets)

export const description = ($: Constraints) => $.noDescriptions ? fc.constant(null) : fc.oneof(
  fc.constant(null),
  fc.constant(null),
  fc.tuple(
    fc.lorem(),
    fc.boolean(),
  )
) satisfies fc.Arbitrary<Seed.Description>

export const operationType = fc.constantFrom(
  'query',
  'mutation',
  'subscription',
) satisfies fc.Arbitrary<OperationType>

export declare namespace Seed {
  type Name = [
    Name: byTag['Name'],
    value: string,
  ]

  type NamedType = [
    NamedType: byTag['NamedType'],
    name: string,
  ]

  type Description = null | [description: string, block: boolean]

  ////////////////////////
  ///  Terminal nodes  ///
  type Boolean = [Boolean: byTag['Boolean']]
  type Float = [Float: byTag['Float']]
  type ID = [ID: byTag['ID']]
  type Int = [Int: byTag['Int']]
  type Null = [Null: byTag['Null']]
  type Number = [Number: byTag['Number']]
  type String = [String: byTag['String']]

  type ScalarTypeDefinition = [
    ScalarTypeDefinition: byTag['ScalarTypeDefinition'],
    name: string,
    description: Description,
  ]
  ///  Terminal nodes  ///
  ////////////////////////

  /////////////////////
  ///  Value nodes  ///
  type NullValue = [
    NullValue: byTag['NullValue']
  ]

  type BooleanValue = [
    BooleanValue: byTag['BooleanValue'],
    value: boolean,
  ]

  type EnumValue = [
    EnumValue: byTag['EnumValue'],
    value: string,
  ]

  type FloatValue = [
    FloatValue: byTag['FloatValue'],
    value: number,
  ]

  type IntValue = [
    IntValue: byTag['IntValue'],
    value: number,
  ]

  type StringValue = [
    StringValue: byTag['StringValue'],
    value: string,
    block: boolean,
  ]

  type EnumValueDefinition = [
    EnumValueDefinition: byTag['EnumValueDefinition'],
    value: string,
  ]

  type ListValue<T = unknown> = [
    ListValue: byTag['ListValue'],
    value: readonly T[],
  ]

  type ObjectValue<T = unknown> = [
    ObjectValue: byTag['ObjectValue'],
    value: readonly T[],
  ]
  ///  Value nodes  ///
  /////////////////////

  type ListType<T = unknown> = [
    ListType: byTag['ListType'],
    type: T,
  ]

  type NonNullType<T = unknown> = [
    NonNullType: byTag['NonNullType'],
    type: T,
  ]

  type UnionTypeDefinition<T = unknown> = [
    UnionTypeDefinition: byTag['UnionTypeDefinition'],
    name: string,
    types: readonly T[],
    directives: readonly T[]
  ]

  type Variable = [
    Variable: byTag['Variable'],
    name: string,
    description: Description,
  ]

  type EnumTypeDefinition<T = unknown> = [
    EnumTypeDefinition: byTag['EnumTypeDefinition'],
    name: string,
    description: Description,
    values: readonly string[],
    directives: readonly T[],
  ]

  type Field<T = unknown> = [
    Field: byTag['Field'],
    name: string,
    alias: string,
    selectionSet: T | null,
    arguments: readonly T[],
    directives: readonly T[],
  ]

  type FieldDefinition<T = unknown> = [
    FieldDefinition: byTag['FieldDefinition'],
    name: string,
    description: Description,
    type: T,
    arguments: readonly T[],
    directives: readonly T[],
  ]

  type ObjectField<T = unknown> = [
    ObjectField: byTag['ObjectField'],
    name: string,
    value: T
  ]

  type ObjectTypeDefinition<T = unknown> = [
    ObjectTypeDefinition: byTag['ObjectTypeDefinition'],
    name: string,
    description: Description,
    fields: readonly T[],
    interfaces: readonly T[],
    directives: readonly T[],
  ]

  type InterfaceTypeDefinition<T = unknown> = [
    InterfaceTypeDefinition: byTag['InterfaceTypeDefinition'],
    name: string,
    description: Description,
    fields: readonly T[],
    interfaces: readonly T[],
    directives: readonly T[],
  ]

  type Argument<T = unknown> = [
    Argument: byTag['Argument'],
    name: string,
    value: T,
  ]

  type InputObjectTypeDefinition<T = unknown> = [
    InputObjectTypeDefinition: byTag['InputObjectTypeDefinition'],
    name: string,
    description: Description,
    fields: readonly T[],
    directives: readonly T[],
  ]

  type InputValueDefinition<T = unknown> = [
    InputValueDefinition: byTag['InputValueDefinition'],
    name: string,
    description: Description,
    type: T,
    defaultValue: T,
    directives: readonly T[],
  ]

  type VariableDefinition<T = unknown> = [
    VariableDefinition: byTag['VariableDefinition'],
    variable: string,
    type: T,
    defaultValue: T,
    directives: readonly T[],
  ]

  type Directive<T = unknown> = [
    Directive: byTag['Directive'],
    name: string,
    arguments: readonly T[],
  ]

  type DirectiveDefinition<T = unknown> = [
    DirectiveDefinition: byTag['DirectiveDefinition'],
    name: string,
    description: Description,
    repeatable: boolean,
    locations: readonly F.DirectiveTarget[],
    arguments: readonly T[],
  ]

  type Document<T = unknown> = [
    Document: byTag['Document'],
    definition: readonly T[],
  ]

  type FragmentDefinition<T = unknown> = [
    FragmentDefinition: byTag['FragmentDefinition'],
    name: string,
    typeCondition: string,
    selectionSet: T,
    directives: readonly T[],
  ]

  type FragmentSpread<T = unknown> = [
    FragmentSpread: byTag['FragmentSpread'],
    name: string,
    directives: readonly T[],
  ]

  type InlineFragment<T = unknown> = [
    InlineFragment: byTag['InlineFragment'],
    typeCondition: string,
    selectionSet: T,
    directives: readonly T[],
  ]

  /**
   * @example
   * [
   *   400, // OperationDefinition
   *   "ornare",
   *   "query",
   *   [
   *     420,
   *     []
   *   ],
   *   [
   *     [
   *       330,
   *       "suscipit",
   *       [
   *         270,
   *         [
   *           20,
   *           "turpis"
   *         ]
   *       ],
   *       [
   *         110,
   *         true
   *       ],
   *       []
   *     ]
   *   ],
   *   [
   *     340,
   *     "fermentum",
   *     [
   *       [
   *         290,
   *         "egestas",
   *         [
   *           130,
   *           -4.442196362483118e+172
   *         ]
   *       ]
   *     ]
   *   ]
   * ]
   */

  type OperationDefinition<T = unknown> = [
    OperationDefinition: byTag['OperationDefinition'],
    name: string,
    operation: OperationType,
    selectionSet: T,
    variableDefinitions: readonly T[],
    directives: readonly T[],
  ]

  type OperationTypeDefinition = [
    OperationTypeDefinition: byTag['OperationTypeDefinition'],
    type: string,
    operation: F.OperationType,
  ]

  type SelectionSet<T = unknown> = [
    SelectionSet: byTag['SelectionSet'],
    selections: readonly T[],
  ]

  type SchemaDefinition<T = unknown> = [
    SchemaDefinition: byTag['SchemaDefinition'],
    _unused: string,
    description: Description,
    operationTypes: readonly Seed.OperationTypeDefinition[],
    directives: readonly T[],
  ]

  // type SchemaExtension<T = unknown> = [
  //   SchemaExtension: byTag['SchemaExtension'],
  //   operationTypes: readonly T[],
  //   directives: readonly T[],
  // ]

  type Terminal = TerminalMap[keyof TerminalMap]
  type TerminalMap = {
    Boolean: Boolean
    Float: Float
    ID: ID
    Int: Int
    Name: Name
    NamedType: NamedType
    Null: Null
    Number: Number
    ScalarTypeDefinition: ScalarTypeDefinition
    String: String
    Variable: Variable
    OperationTypeDefinition: OperationTypeDefinition
  }

  type Value = ValueMap[keyof ValueMap]
  type ValueMap = {
    BooleanValue: BooleanValue
    FloatValue: FloatValue
    IntValue: IntValue
    NullValue: NullValue
    StringValue: StringValue
    EnumValue: EnumValue
    EnumValueDefinition: EnumValueDefinition
    ListValue: ListValue
    ObjectValue: ObjectValue
    ObjectField: ObjectField
  }

  type UnaryMap<T = unknown> = {
    ListType: ListType<T>
    NonNullType: NonNullType<T>
    UnionTypeDefinition: UnionTypeDefinition<T>
    EnumTypeDefinition: EnumTypeDefinition<T>
    Field: Field<T>
    FieldDefinition: FieldDefinition<T>
    ObjectTypeDefinition: ObjectTypeDefinition<T>
    InterfaceTypeDefinition: InterfaceTypeDefinition<T>
    Argument: Argument<T>
    InputObjectTypeDefinition: InputObjectTypeDefinition<T>
    InputValueDefinition: InputValueDefinition<T>
    VariableDefinition: VariableDefinition<T>
    Directive: Directive<T>
    DirectiveDefinition: DirectiveDefinition<T>
    Document: Document<T>
    FragmentDefinition: FragmentDefinition<T>
    FragmentSpread: FragmentSpread<T>
    InlineFragment: InlineFragment<T>
    OperationDefinition: OperationDefinition<T>
    SelectionSet: SelectionSet<T>
    SchemaDefinition: SchemaDefinition<T>
    // SchemaExtension: SchemaExtension<T>
  }

  type Nullary =
    | Seed.Terminal
    | Seed.Value
    | Seed.EnumValueDefinition

  type Unary<T> =
    | Seed.ListType<T>
    | Seed.NonNullType<T>
    | Seed.UnionTypeDefinition<T>
    | Seed.EnumTypeDefinition<T>
    | Seed.Field<T>
    | Seed.FieldDefinition<T>
    | Seed.ObjectTypeDefinition<T>
    | Seed.InterfaceTypeDefinition<T>
    | Seed.Argument<T>
    | Seed.InputObjectTypeDefinition<T>
    | Seed.InputValueDefinition<T>
    | Seed.VariableDefinition<T>
    | Seed.Directive<T>
    | Seed.DirectiveDefinition<T>
    | Seed.Document<T>
    | Seed.FragmentDefinition<T>
    | Seed.FragmentSpread<T>
    | Seed.InlineFragment<T>
    | Seed.OperationDefinition<T>
    | Seed.SelectionSet<T>
    | Seed.SchemaDefinition<T>
  // | Seed.SchemaExtension<T>

  type F<T> =
    | Seed.Nullary
    | Seed.Value
    | Seed.Unary<T>

  type Fixpoint =
    | Seed.Nullary
    | Seed.Value
    | Seed.ListType
    | Seed.NonNullType
    | Seed.UnionTypeDefinition
    | Seed.Variable
    | Seed.EnumTypeDefinition
    | Seed.Field
    | Seed.FieldDefinition
    | Seed.ObjectTypeDefinition
    | Seed.InterfaceTypeDefinition
    | Seed.Argument
    | Seed.InputObjectTypeDefinition
    | Seed.InputValueDefinition
    | Seed.VariableDefinition
    | Seed.Directive
    | Seed.DirectiveDefinition
    | Seed.Document
    | Seed.FragmentDefinition
    | Seed.FragmentSpread
    | Seed.InlineFragment
    | Seed.OperationDefinition
    | Seed.OperationTypeDefinition
    | Seed.SelectionSet
    | Seed.SchemaDefinition
  // | Seed.SchemaExtension

  interface Free extends T.HKT { [-1]: Seed.F<this[0]> }
}

export type Seed<T = unknown> = (
  & Seed.TerminalMap
  & Seed.ValueMap
  & Seed.UnaryMap<T>
)

const NamedType = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.NamedType> => fc.tuple(
  fc.constant(byTag['NamedType']),
  identifier,
)

const Boolean = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.Boolean> => fc.constant([byTag['Boolean']])
const Float = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.Float> => fc.constant([byTag['Float']])
const Int = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.Int> => fc.constant([byTag['Int']])
const ID = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.ID> => fc.constant([byTag['ID']])
const Null = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.Null> => fc.constant([byTag['Null']])
const Number = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.Number> => fc.constant([byTag['Number']])
const String = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.String> => fc.constant([byTag['String']])

const NullValue = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.NullValue> => fc.constant([byTag['NullValue']])
const BooleanValue = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.BooleanValue> => fc.tuple(fc.constant(byTag['BooleanValue']), fc.boolean())
const FloatValue = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.FloatValue> => fc.tuple(fc.constant(byTag['FloatValue']), fc.double())
const IntValue = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.IntValue> => fc.tuple(fc.constant(byTag['IntValue']), fc.integer())
const StringValue = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.StringValue> => fc.tuple(
  fc.constant(byTag['StringValue']),
  fc.string(),
  fc.boolean(),
)

const ScalarTypeDefinition = (_tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.ScalarTypeDefinition> => fc.tuple(
  fc.constant(byTag['ScalarTypeDefinition']),
  identifier,
  description($),
)

const EnumValue = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.EnumValue> => fc.tuple(
  fc.constant(byTag['EnumValue']),
  identifier,
)

const EnumValueDefinition = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.EnumValueDefinition> => fc.tuple(
  fc.constant(byTag['EnumValueDefinition']),
  identifier,
)

/**
 * @example
 * type ListValue = [
 *   ListValue: byTag['ListValue'],
 *   value: readonly unknown[],
 * ]
 * export interface ListValueNode {
 *   readonly kind: Kind.LIST;
 *   readonly loc?: Location;
 *   readonly values: ReadonlyArray<ValueNode>;
 * }
 */
const ListValue = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.ListValue> => fc.tuple(
  fc.constant(byTag['ListValue']),
  fc.array(ValueNode(tie, $)),
)

/**
 * @example
 * type ListType<T = unknown> = [
 *   ListType: byTag['ListType'],
 *   type: T,
 * ]
 * export interface ListTypeNode {
 *   readonly kind: Kind.LIST_TYPE;
 *   readonly loc?: Location;
 *   readonly type: TypeNode;
 * }
 */
const ListType = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.ListType> => fc.tuple(
  fc.constant(byTag['ListType']),
  TypeNode(tie, $),
)

/**
 * @example
 * export interface NonNullTypeNode {
 *   readonly kind: Kind.NON_NULL_TYPE;
 *   readonly loc?: Location;
 *   readonly type: NamedTypeNode | ListTypeNode;
 * }
 * type NonNullType<T = unknown> = [
 *   NonNullType: byTag['NonNullType'],
 *   type: T,
 * ]
 */
const NonNullType = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.NonNullType> => fc.tuple(
  fc.constant(byTag['NonNullType']),
  fc.oneof(
    NamedType(tie, $),
    tie('ListType'),
  )
)

/**
 * @example
 * type UnionTypeDefinition<T = unknown> = [
 *    UnionTypeDefinition: byTag['UnionTypeDefinition'],
 *    name: string,
 *    types: readonly T[],
 *    directives: readonly T[]
 * ]
 * export interface UnionTypeDefinitionNode {
 *   readonly kind: Kind.UNION_TYPE_DEFINITION;
 *   readonly loc?: Location;
 *   readonly description?: StringValueNode;
 *   readonly name: NameNode;
 *   readonly directives?: ReadonlyArray<ConstDirectiveNode>;
 *   readonly types?: ReadonlyArray<NamedTypeNode>;
 * }
 */
const UnionTypeDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.UnionTypeDefinition> => fc.tuple(
  fc.constant(byTag['UnionTypeDefinition']),
  identifier,
  fc.uniqueArray(
    NamedType(tie, $),
    $.NamedType!
  ),
  fc.uniqueArray(
    // TODO:
    // ConstDirective(tie, $),
    Directive(tie, $),
    $.Directive!,
  )
)

/**
 * @example
 * type Variable<T = unknown> = [
 *   Variable: byTag['Variable'],
 *   name: string,
 *   description: Description,
 *   directives: readonly T[],
 * ]
 * export interface VariableNode {
 *   readonly kind: Kind.VARIABLE;
 *   readonly loc?: Location;
 *   readonly name: NameNode;
 * }
 */
const Variable = (_tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.Variable> => fc.tuple(
  fc.constant(byTag['Variable']),
  identifier,
  description($),
)

/**
 * @example
 * type EnumTypeDefinition<T = unknown> = [
 *   EnumTypeDefinition: byTag['EnumTypeDefinition'],
 *   name: string,
 *   description: Description,
 *   values: readonly string[],
 *   directives: readonly T[],
 * ]
 * export interface EnumTypeDefinitionNode {
 *   readonly kind: Kind.ENUM_TYPE_DEFINITION;
 *   readonly loc?: Location;
 *   readonly description?: StringValueNode;
 *   readonly name: NameNode;
 *   readonly directives?: ReadonlyArray<ConstDirectiveNode>;
 *   readonly values?: ReadonlyArray<EnumValueDefinitionNode>;
 * }
 */
const EnumTypeDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.EnumTypeDefinition> => fc.tuple(
  fc.constant(byTag['EnumTypeDefinition']),
  identifier,
  description($),
  fc.uniqueArray(identifier),
  fc.uniqueArray(
    // TODO:
    // ConstDirective(tie, $),
    Directive(tie, $),
    $.Directive!
  ),
)

/**
 * @example
 * type Field<T = unknown> = [
 *   Field: byTag['Field'],
 *   name: string,
 *   alias: string,
 *   selectionSet: T,
 *   arguments: readonly T[],
 *   directives: readonly T[],
 * ]
 * export interface FieldNode {
 *   readonly kind: Kind.FIELD;
 *   readonly loc?: Location;
 *   readonly alias?: NameNode;
 *   readonly name: NameNode;
 *   readonly arguments?: ReadonlyArray<ArgumentNode>;
 *   readonly directives?: ReadonlyArray<DirectiveNode>;
 *   readonly selectionSet?: SelectionSetNode;
 * }
 */
const Field = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.Field> => fc.tuple(
  fc.constant(byTag['Field']),
  identifier,
  alias,
  fc.oneof(
    fc.constant(null), NonEmptySelectionSet(tie, $)
  ),
  fc.uniqueArray(
    tie('Argument'),
    $.Argument!
  ),
  fc.uniqueArray(
    tie('Directive'),
    $.Directive!
  ),
)

/**
 * @example
 * type FieldDefinition<T = unknown> = [
 *   FieldDefinition: byTag['FieldDefinition'],
 *   name: string,
 *   description: Description,
 *   type: T,
 *   arguments: readonly T[],
 *   directives: readonly T[],
 * ]
 * export interface FieldDefinitionNode {
 *   readonly kind: Kind.FIELD_DEFINITION;
 *   readonly loc?: Location;
 *   readonly description?: StringValueNode;
 *   readonly name: NameNode;
 *   readonly arguments?: ReadonlyArray<InputValueDefinitionNode>;
 *   readonly type: TypeNode;
 *   readonly directives?: ReadonlyArray<ConstDirectiveNode>;
 * }
 */
const FieldDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.FieldDefinition> => fc.tuple(
  fc.constant(byTag['FieldDefinition']),
  identifier,
  description($),
  TypeNode(tie, $),
  fc.uniqueArray(
    tie('InputValueDefinition'),
    $.InputValueDefinition!
  ),
  fc.uniqueArray(
    // TODO:
    // ConstDirective(tie, $),
    Directive(tie, $),
    $.Directive!
  )
)

/**
 * @example
 * type ObjectTypeDefinition<T = unknown> = [
 *   ObjectTypeDefinition: byTag['ObjectTypeDefinition'],
 *   name: string,
 *   description: Description,
 *   fields: readonly T[],
 *   interfaces: readonly T[],
 *   directives: readonly T[],
 * ]
 * export interface ObjectTypeDefinitionNode {
 *   readonly kind: Kind.OBJECT_TYPE_DEFINITION;
 *   readonly loc?: Location;
 *   readonly description?: StringValueNode;
 *   readonly name: NameNode;
 *   readonly interfaces?: ReadonlyArray<NamedTypeNode>;
 *   readonly directives?: ReadonlyArray<ConstDirectiveNode>;
 *   readonly fields?: ReadonlyArray<FieldDefinitionNode>;
 * }
 */
const ObjectTypeDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.ObjectTypeDefinition> => fc.tuple(
  fc.constant(byTag['ObjectTypeDefinition']),
  identifier,
  description($),
  fc.uniqueArray(
    tie('FieldDefinition'),
    $.FieldDefinition!
  ),
  fc.uniqueArray(
    NamedType(tie, $),
    $.NamedType!
  ),
  fc.uniqueArray(
    // TODO: ConstDirective(tie, $),
    Directive(tie, $),
    $.Directive!
  )
)

/**
 * @example
 * type InterfaceTypeDefinition<T = unknown> = [
 *   InterfaceTypeDefinition: byTag['InterfaceTypeDefinition'],
 *   name: string,
 *   description: Description,
 *   fields: readonly T[],
 *   interfaces: readonly T[],
 *   directives: readonly T[],
 * ]
 * export interface InterfaceTypeDefinitionNode {
 *   readonly kind: Kind.INTERFACE_TYPE_DEFINITION;
 *   readonly loc?: Location;
 *   readonly description?: StringValueNode;
 *   readonly name: NameNode;
 *   readonly interfaces?: ReadonlyArray<NamedTypeNode>;
 *   readonly directives?: ReadonlyArray<ConstDirectiveNode>;
 *   readonly fields?: ReadonlyArray<FieldDefinitionNode>;
 * }
 */
const InterfaceTypeDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.InterfaceTypeDefinition> => fc.tuple(
  fc.constant(byTag['InterfaceTypeDefinition']),
  identifier,
  description($),
  fc.uniqueArray(
    tie('FieldDefinition'),
    $.FieldDefinition!
  ),
  fc.uniqueArray(
    NamedType(tie, $),
    $.NamedType!
  ),
  fc.uniqueArray(
    // TODO:
    // ConstDirective(tie, $),
    Directive(tie, $),
    $.Directive!
  )
)

/**
 * @example
 * type Argument<T = unknown> = [
 *   Argument: byTag['Argument'],
 *   name: string,
 *   value: T,
 * ]
 * export interface ArgumentNode {
 *   readonly kind: Kind.ARGUMENT;
 *   readonly loc?: Location;
 *   readonly name: NameNode;
 *   readonly value: ValueNode;
 * }
 */
const Argument = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.Argument> => fc.tuple(
  fc.constant(byTag['Argument']),
  identifier,
  ValueNode(tie, $),
)

/**
 * @example
 * type InputObjectTypeDefinition<T = unknown> = [
 *   InputObjectTypeDefinition: byTag['InputObjectTypeDefinition'],
 *   name: string,
 *   description: Description,
 *   fields: readonly T[],
 *   directives: readonly T[],
 * ]
 * export interface InputObjectTypeDefinitionNode {
 *   readonly kind: Kind.INPUT_OBJECT_TYPE_DEFINITION;
 *   readonly loc?: Location;
 *   readonly description?: StringValueNode;
 *   readonly name: NameNode;
 *   readonly directives?: ReadonlyArray<ConstDirectiveNode>;
 *   readonly fields?: ReadonlyArray<InputValueDefinitionNode>;
 * }
 */
const InputObjectTypeDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.InputObjectTypeDefinition> => fc.tuple(
  fc.constant(byTag['InputObjectTypeDefinition']),
  identifier,
  description($),
  fc.uniqueArray(
    tie('InputValueDefinition'),
    $.InputValueDefinition!
  ),
  fc.uniqueArray(
    // TODO:
    // ConstDirective(tie, $),
    Directive(tie, $),
    $.Directive!
  ),
)

/**
 * @example
 * type InputValueDefinition<T = unknown> = [
 *   InputValueDefinition: byTag['InputValueDefinition'],
 *   name: string,
 *   description: Description,
 *   type: T,
 *   defaultValue: T,
 *   directives: readonly T[],
 * ]
 * export interface InputValueDefinitionNode {
 *   readonly kind: Kind.INPUT_VALUE_DEFINITION;
 *   readonly loc?: Location;
 *   readonly description?: StringValueNode;
 *   readonly name: NameNode;
 *   readonly type: TypeNode;
 *   readonly defaultValue?: ConstValueNode;
 *   readonly directives?: ReadonlyArray<ConstDirectiveNode>;
 * }
 */
const InputValueDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.InputValueDefinition> => fc.tuple(
  fc.constant(byTag['InputValueDefinition']),
  identifier,
  description($),
  TypeNode(tie, $),
  ConstValueNode(tie, $),
  fc.uniqueArray(
    // TODO:
    // ConstDirective(tie, $),
    Directive(tie, $),
    $.Directive!
  ),
)

/**
 * @example
 * type VariableDefinition<T = unknown> = [
 *   kind: byTag['VariableDefinition'],
 *   variable: string,
 *   type: T,
 *   defaultValue: T,
 *   directives: readonly T[],
 * ]
 * export interface VariableDefinitionNode {
 *   readonly kind: Kind.VARIABLE_DEFINITION;
 *   readonly variable: VariableNode;
 *   readonly type: TypeNode;
 *   readonly defaultValue?: ConstValueNode;
 *   readonly directives?: ReadonlyArray<ConstDirectiveNode>;
 * }
 */
const VariableDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.VariableDefinition> => fc.tuple(
  fc.constant(byTag['VariableDefinition']),
  identifier,
  TypeNode(tie, $),
  ConstValueNode(tie, $),
  fc.uniqueArray(
    // TODO:
    // ConstDirective(tie, $),
    Directive(tie, $),
    $.Directive!
  ),
)

/**
 * @example
 * type Directive<T = unknown> = [
 *   Directive: byTag['Directive'],
 *   name: string,
 *   arguments: readonly T[],
 * ]
 * export interface DirectiveNode {
 *   readonly kind: Kind.DIRECTIVE;
 *   readonly loc?: Location;
 *   readonly name: NameNode;
 *   readonly arguments?: ReadonlyArray<ArgumentNode>;
 * }
 */
const Directive = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.Directive> => {
  return fc.tuple(
    fc.constant(byTag['Directive']),
    identifier,
    fc.uniqueArray(
      tie('Argument'),
      $.Argument!
    ),
  )
}

/**
 * @example
 * type DirectiveDefinition<T = unknown> = [
 *   DirectiveDefinition: byTag['DirectiveDefinition'],
 *   name: string,
 *   description: Description,
 *   repeatable: boolean,
 *   locations: readonly F.Target[],
 *   arguments: readonly T[],
 * ]
 * export interface DirectiveDefinitionNode {
 *   readonly kind: Kind.DIRECTIVE_DEFINITION;
 *   readonly loc?: Location;
 *   readonly description?: StringValueNode;
 *   readonly name: NameNode;
 *   readonly arguments?: ReadonlyArray<InputValueDefinitionNode>;
 *   readonly repeatable: boolean;
 *   readonly locations: ReadonlyArray<NameNode>;
 * }
 */
const DirectiveDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.DirectiveDefinition> => fc.tuple(
  fc.constant(byTag['DirectiveDefinition']),
  identifier,
  description($),
  fc.boolean(),
  fc.uniqueArray(
    target,
    { minLength: 1, maxLength: 3 },
  ),
  fc.uniqueArray(
    tie('InputValueDefinition'),
    $.InputValueDefinition!
  ),
)

/**
 * @example
 * type FragmentDefinition<T = unknown> = [
 *   FragmentDefinition: byTag['FragmentDefinition'],
 *   name: string,
 *   typeCondition: string,
 *   selectionSet: T,
 *   directives: readonly T[],
 * ]
 * export interface FragmentDefinitionNode {
 *   readonly kind: Kind.FRAGMENT_DEFINITION;
 *   readonly loc?: Location;
 *   readonly name: NameNode;
 *   readonly typeCondition: NamedTypeNode;
 *   readonly directives?: ReadonlyArray<DirectiveNode>;
 *   readonly selectionSet: SelectionSetNode;
 * }
 */
const FragmentDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.FragmentDefinition> => fc.tuple(
  fc.constant(byTag['FragmentDefinition']),
  identifier,
  identifier,
  tie('SelectionSet'),
  fc.uniqueArray(
    tie('Directive'),
    $.Directive!
  ),
)

/**
 * @example
 * 
 * type FragmentSpread<T = unknown> = [
 *   FragmentSpread: byTag['FragmentSpread'],
 *   name: string,
 *   directives: readonly T[],
 * ]
 * export interface FragmentSpreadNode {
 *   readonly kind: Kind.FRAGMENT_SPREAD;
 *   readonly loc?: Location;
 *   readonly name: NameNode;
 *   readonly directives?: ReadonlyArray<DirectiveNode>;
 * }
 */
const FragmentSpread = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.FragmentSpread> => fc.tuple(
  fc.constant(byTag['FragmentSpread']),
  identifier,
  fc.uniqueArray(
    tie('Directive'),
    $.Directive!
  ),
)

/**
 * @example
 * type InlineFragment<T = unknown> = [
 *   InlineFragment: byTag['InlineFragment'],
 *   typeCondition: string,
 *   selectionSet: string,
 *   directives: readonly T[],
 * ]
 * export interface InlineFragmentNode {
 *   readonly kind: Kind.INLINE_FRAGMENT;
 *   readonly loc?: Location;
 *   readonly typeCondition?: NamedTypeNode;
 *   readonly directives?: ReadonlyArray<DirectiveNode>;
 *   readonly selectionSet: SelectionSetNode;
 * }
 */
const InlineFragment = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.InlineFragment> => fc.tuple(
  fc.constant(byTag['InlineFragment']),
  identifier,
  NonEmptySelectionSet(tie, $),
  fc.uniqueArray(
    tie('Directive'),
    $.Directive!
  ),
)

// used in OperationDefinition
const NonEmptySelectionSet = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.SelectionSet> => fc.tuple(
  fc.constant(byTag['SelectionSet']),
  fc.uniqueArray(
    Selection(tie, $),
    { ...$.SelectionSet, minLength: 1 },
  ),
)

/**
 * @example
 * type OperationDefinition<T = unknown> = [
 *   OperationDefinition: byTag['OperationDefinition'],
 *   name: string,
 *   operation: OperationType,
 *   selectionSet: T,
 *   variableDefinitions: readonly T[],
 *   directives: readonly T[],
 * ]
 * export interface OperationDefinitionNode {
 *   readonly kind: Kind.OPERATION_DEFINITION;
 *   readonly loc?: Location;
 *   readonly operation: OperationTypeNode;
 *   readonly name?: NameNode;
 *   readonly variableDefinitions?: ReadonlyArray<VariableDefinitionNode>;
 *   readonly directives?: ReadonlyArray<DirectiveNode>;
 *   readonly selectionSet: SelectionSetNode;
 * }
 */
const OperationDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.OperationDefinition> => fc.tuple(
  fc.constant(byTag['OperationDefinition']),
  identifier,
  operationType,
  NonEmptySelectionSet(tie, $),
  fc.uniqueArray(
    tie('VariableDefinition'),
    $.VariableDefinition!
  ),
  fc.uniqueArray(
    tie('Directive'),
    $.Directive!
  ),
)

/**
 * @example
 * type OperationTypeDefinition<T = unknown> = [
 *   OperationTypeDefinition: byTag['OperationTypeDefinition'],
 *   type: string,
 *   operation: T,
 * ]
 * export interface OperationTypeDefinitionNode {
 *   readonly kind: Kind.OPERATION_TYPE_DEFINITION;
 *   readonly loc?: Location;
 *   readonly operation: OperationTypeNode;
 *   readonly type: NamedTypeNode;
 * }
 */
const OperationTypeDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.OperationTypeDefinition> => fc.tuple(
  fc.constant(byTag['OperationTypeDefinition']),
  identifier,
  operationType,
  // tie('OperationT'),
)

/**
 * @example
 * type SelectionSet<T = unknown> = [
 *   SelectionSet: byTag['SelectionSet'],
 *   selections: readonly T[],
 * ]
 * export interface SelectionSetNode {
 *   kind: Kind.SELECTION_SET;
 *   loc?: Location;
 *   selections: ReadonlyArray<SelectionNode>;
 * }
 */
const SelectionSet = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.SelectionSet> => fc.tuple(
  fc.constant(byTag['SelectionSet']),
  fc.uniqueArray(
    Selection(tie, $),
    $.SelectionSet!
  ),
)

/**
 * @example
 * type SchemaDefinition<T = unknown> = [
 *   SchemaDefinition: byTag['SchemaDefinition'],
 *   description: Description,
 *   operationTypes: readonly (readonly [name: string, operation: T])[],
 *   directives: readonly T[],
 * ]
 * export interface SchemaDefinitionNode {
 *   readonly kind: Kind.SCHEMA_DEFINITION;
 *   readonly loc?: Location;
 *   readonly description?: StringValueNode;
 *   readonly directives?: ReadonlyArray<ConstDirectiveNode>;
 *   readonly operationTypes: ReadonlyArray<OperationTypeDefinitionNode>;
 * }
 */
const SchemaDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.SchemaDefinition> => fc.tuple(
  fc.constant(byTag['SchemaDefinition']),
  identifier,
  description($),
  fc.uniqueArray(
    OperationTypeDefinition(tie, $),
    $.SchemaDefinition!,
  ),
  fc.uniqueArray(
    // TODO:
    // ConstDirective(tie, $),
    Directive(tie, $),
    $.Directive!
  )
)

/** 
 * @example
 * type Document<T = unknown> = [
 *   Document: byTag['Document'],
 *   definition: readonly T[],
 * ]
 * export interface DocumentNode {
 *   readonly kind: Kind.DOCUMENT;
 *   readonly loc?: Location;
 *   readonly definitions: ReadonlyArray<DefinitionNode>;
 *   readonly tokenCount?: number | undefined;
 * }
 */
const Document = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.Document> => {
  return fc.tuple(
    fc.constant(byTag['Document']),
    fc.uniqueArray(
      Definition(tie, $),
      $.Document!
    ),
  )
}

/////////////////
///  DERIVED  ///
/////////////////

/**
 * @example
 * type Argument<T = unknown> = [
 *   Argument: byTag['Argument'],
 *   name: string,
 *   value: T,
 * ]
 * export interface ConstArgumentNode {
 *   readonly kind: Kind.ARGUMENT;
 *   readonly loc?: Location;
 *   readonly name: NameNode;
 *   readonly value: ConstValueNode;
 * }
 */
const ConstArgument = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.Argument> => fc.tuple(
  fc.constant(byTag['Argument']),
  identifier,
  ConstValueNode(tie, $),
)

/**
 * @example
 * type Directive<T = unknown> = [
 *   Directive: byTag['Directive'],
 *   name: string,
 *   arguments: readonly T[],
 * ]
 * export interface ConstDirectiveNode {
 *   readonly kind: Kind.DIRECTIVE;
 *   readonly loc?: Location;
 *   readonly name: NameNode;
 *   readonly arguments?: ReadonlyArray<ConstArgumentNode>;
 * }
 */
const ConstDirective = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.Directive> => fc.tuple(
  fc.constant(byTag['Directive']),
  identifier,
  fc.uniqueArray(
    ConstArgument(tie, $),
    $.Argument!
  ),
)

/**
 * ## {@link TypeNode `TypeNode`}
 * See also:
 * - https://github.com/graphql/graphql-js/blob/16.x.x/src/language/ast.ts#L524
 */
const TypeNode = (tie: fc.LetrecTypedTie<Seed>, $: Constraints) => fc.oneof(
  NamedType(tie, $),
  tie('ListType'),
  tie('NonNullType'),
)

/**
 * ## {@link Selection `Selection`}
 * See also:
 * - https://github.com/graphql/graphql-js/blob/16.x.x/src/language/ast.ts#L355
 */
const Selection = (tie: fc.LetrecTypedTie<Seed>, $: Constraints) => fc.oneof(
  tie('Field'),
  tie('FragmentSpread'),
  tie('InlineFragment'),
)

/**
 * @example
 * type ObjectValue = [
 *   ObjectValue: byTag['ObjectValue'],
 *   value: { [x: string]: unknown },
 * ]
 * export interface ObjectValueNode {
 *   readonly kind: Kind.OBJECT;
 *   readonly loc?: Location;
 *   readonly fields: ReadonlyArray<ObjectFieldNode>;
 * }
 */
const ObjectValue = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.ObjectValue> => fc.tuple(
  fc.constant(byTag['ObjectValue']),
  fc.uniqueArray(
    ObjectField(tie, $),
    $.ObjectValue!
  ),
)

/**
 * ## {@link ValueNode `ValueNode`}
 * See also:
 * - https://github.com/graphql/graphql-js/blob/16.x.x/src/language/ast.ts#L411-L420
 */
const ValueNode = (_tie: fc.LetrecTypedTie<Seed>, $: Constraints) => fc.oneof(
  IntValue(_tie, $),
  FloatValue(_tie, $),
  StringValue(_tie, $),
  BooleanValue(_tie, $),
  NullValue(_tie, $),
  EnumValue(_tie, $),
  // Variable(_tie, $),
  // ObjectValue(),
  // ListValue(),
)

/**
 * @example
 * type ObjectField<T = unknown> = [
 *   ObjectField: byTag['ObjectField'],
 *   name: string,
 *   value: T
 * ]
 * export interface ObjectFieldNode {
 *   readonly kind: Kind.OBJECT_FIELD;
 *   readonly loc?: Location;
 *   readonly name: NameNode;
 *   readonly value: ValueNode;
 * }
 */
const ObjectField = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.ObjectField> => fc.tuple(
  fc.constant(byTag['ObjectField']),
  identifier,
  ValueNode(tie, $),
)

/**
 * @example
 * type ListValue = [
 *   ListValue: byTag['ListValue'],
 *   value: readonly Json[],
 * ]
 * export interface ConstListValueNode {
 *   readonly kind: Kind.LIST;
 *   readonly loc?: Location;
 *   readonly values: ReadonlyArray<ConstValueNode>;
 * }
 */
const ConstListValue = (tie: fc.LetrecTypedTie<Seed>, $: Constraints) => fc.tuple(
  fc.constant(byTag['ListValue']),
  fc.array(ConstValueNode(tie, $)),
)

/**
 * ## {@link ConstValueNode `ConstValueNode`}
 * See also:
 * - https://github.com/graphql/graphql-js/blob/16.x.x/src/language/ast.ts#L422
 */
const ConstValueNode = (tie: fc.LetrecTypedTie<Seed>, $: Constraints) => fc.oneof(
  IntValue(tie, $),
  FloatValue(tie, $),
  StringValue(tie, $),
  BooleanValue(tie, $),
  NullValue(tie, $),
  EnumValue(tie, $),
  // tie('ConstListValue'),
  // tie('ConstObjectValue'),
)

/**
 * ## {@link ExecutableDefinition `ExecutableDefinition`}
 * See also:
 * - https://github.com/graphql/graphql-js/blob/16.x.x/src/language/ast.ts#L313-L315
 */
const ExecutableDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints) => fc.oneof(
  tie('OperationDefinition'),
  // tie('FragmentDefinition'),
)

/**
 * ## {@link TypeDefinition `TypeDefinition`}
 * See also:
 * -   https://github.com/graphql/graphql-js/blob/16.x.x/src/language/ast.ts#L568-L574
 */
const TypeDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints) => fc.oneof(
  tie('ScalarTypeDefinition'),
  tie('ObjectTypeDefinition'),
  tie('InterfaceTypeDefinition'),
  tie('UnionTypeDefinition'),
  tie('EnumTypeDefinition'),
  tie('InputObjectTypeDefinition'),
)

/**
 * ## {@link TypeSystemDefinition `TypeSystemDefinition`}
 * See also:
 * - https://github.com/graphql/graphql-js/blob/16.x.x/src/language/ast.ts#L546-L549
 */
const TypeSystemDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints) => fc.oneof(
  TypeDefinition(tie, $),
  tie('SchemaDefinition'),
  tie('DirectiveDefinition'),
  // TypeSystemExtension(tie),
)

/**
 * ## {@link Definition `Definition`}
 * See also:
 * - https://github.com/graphql/graphql-js/blob/16.x.x/src/language/ast.ts#L308-L311
 */
const Definition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints) => fc.oneof(
  ExecutableDefinition(tie, $),
  TypeSystemDefinition(tie, $),
)

export const Seed = {
  Boolean,
  Float,
  Int,
  ID,
  Null,
  Number,
  String,
  NamedType,
  NullValue,
  BooleanValue,
  FloatValue,
  IntValue,
  StringValue,
  ScalarTypeDefinition,
  EnumValue,
  Variable,
  EnumValueDefinition,
  ObjectValue,
  ObjectField,
  ListValue,
  ListType,
  NonNullType,
  UnionTypeDefinition,
  EnumTypeDefinition,
  Field,
  FieldDefinition,
  ObjectTypeDefinition,
  InterfaceTypeDefinition,
  Argument,
  InputObjectTypeDefinition,
  InputValueDefinition,
  VariableDefinition,
  Directive,
  DirectiveDefinition,
  Document,
  FragmentDefinition,
  FragmentSpread,
  InlineFragment,
  OperationDefinition,
  OperationTypeDefinition,
  SelectionSet,
  SchemaDefinition,
  // SchemaExtension,
} satisfies { [K in F.Kind | F.NamedType]: (tie: fc.LetrecTypedTie<Seed>, $: Constraints) => fc.Arbitrary<Seed[K]> }

// const SchemaExtension = (tie: fc.LetrecTypedTie<Seed>) => fc.tuple(
//   fc.constant(byTag['SchemaExtension']),
//   fc.uniqueArray(tie('*')),
//   directives(tie('*')),
// )
