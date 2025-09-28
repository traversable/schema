import * as vi from 'vitest'
import * as AST from '@traversable/graphql-types'
import * as graphql from 'graphql'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(
  src,
  { parser: 'graphql', semi: false, printWidth: 60 }
)

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/graphql-types❳', () => {
  vi.test('〖⛳️〗› ❲AST.toString❳: AST.ScalarTypeDefinition', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      scalar Date
    `))))).toMatchInlineSnapshot
      (`
      "scalar Date
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.NullNode', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      type Test {
        abc: Null
      }
    `))))).toMatchInlineSnapshot
      (`
      "type Test {
        abc: Null
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.BooleanNode', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      type Test {
        abc: Boolean
      }
    `))))).toMatchInlineSnapshot
      (`
      "type Test {
        abc: Boolean
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.IntNode', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      type Test {
        abc: Int
      }
    `))))).toMatchInlineSnapshot
      (`
      "type Test {
        abc: Int
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.NumberNode', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      type Test {
        abc: Number
      }
    `))))).toMatchInlineSnapshot
      (`
      "type Test {
        abc: Number
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.FloatNode', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      type Test {
        abc: Float
      }
    `))))).toMatchInlineSnapshot
      (`
      "type Test {
        abc: Float
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.StringNode', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      type Test {
        abc: String
      }
    `))))).toMatchInlineSnapshot
      (`
      "type Test {
        abc: String
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.IDNode', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      type Test {
        abc: ID
      }
    `))))).toMatchInlineSnapshot
      (`
      "type Test {
        abc: ID
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.NonNullTypeNode', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      type Test {
        abc: String!
      }
    `))))).toMatchInlineSnapshot
      (`
      "type Test {
        abc: String!
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.ListNode', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      type Test {
        abc: [String]
        def: [String!]
        ghi: [String]!
        jkl: [String!]!
      }
    `))))).toMatchInlineSnapshot
      (`
      "type Test {
        abc: [String]
        def: [String!]
        ghi: [String]!
        jkl: [String!]!
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.EnumTypeDefinition', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      enum Role {
        USER
        ADMIN
      }
    `))))).toMatchInlineSnapshot
      (`
      "enum Role {
        USER
        ADMIN
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.OperationDefinitionNode', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      query {
        abc: Boolean
      }
    `))))).toMatchInlineSnapshot
      (`
      "query {
        abc: Boolean
      }
      "
    `)

    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      query {
        empireHero: hero {
          stuff
        }
      }
    `))))).toMatchInlineSnapshot
      (`
      "query {
        empireHero: hero {
          stuff
        }
      }
      "
    `)

    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      query {
        empireHero: hero(episode: EMPIRE) {
          name
        }
        jediHero: hero(episode: JEDI) {
          name
        }
      }
    `))))).toMatchInlineSnapshot
      (`
      "query {
        empireHero: hero(episode: EMPIRE) {
          name
        }
        jediHero: hero(episode: JEDI) {
          name
        }
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.QueryOperation', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      type Query {
        createReview(episode: Episode, review: ReviewInput!): Review
      }
    `))))).toMatchInlineSnapshot
      (`
      "type Query {
        createReview(
          episode: Episode
          review: ReviewInput!
        ): Review
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.MutationOperation', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      type Mutation {
        createReview(
          episode: Episode,
          review: ReviewInput!
        ): Review
      }
    `))))).toMatchInlineSnapshot
      (`
      "type Mutation {
        createReview(
          episode: Episode
          review: ReviewInput!
        ): Review
      }
      "
    `)

    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      mutation CreateReviewForEpisode(
        $ep: Episode!,
        $review: ReviewInput!
      ) {
        createReview(episode: $ep, review: $review) {
          stars
          commentary
        }
      }
    `))))).toMatchInlineSnapshot
      (`
      "mutation CreateReviewForEpisode(
        $ep: Episode!
        $review: ReviewInput!
      ) {
        createReview(episode: $ep, review: $review) {
          stars
          commentary
        }
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.SubscriptionOperation', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      type Subscription {
        createReview(
          episode: Episode,
          review: ReviewInput!
        ): Review
      }
    `))))).toMatchInlineSnapshot
      (`
      "type Subscription {
        createReview(
          episode: Episode
          review: ReviewInput!
        ): Review
      }
      "
    `)

    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      subscription {
        episode: Episode,
        review: ReviewInput
      }
    `))))).toMatchInlineSnapshot
      (`
      "subscription {
        episode: Episode
        review: ReviewInput
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.DirectiveNode', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      directive @directive1 on FIELD_DEFINITION | ENUM_VALUE

      directive @directive2(
        reason: String = "No longer supported"
      ) on FIELD_DEFINITION | ENUM_VALUE
    `))))).toMatchInlineSnapshot
      (`
      "directive @directive1 on FIELD_DEFINITION | ENUM_VALUE

      directive @directive2(
        reason: String = "No longer supported"
      ) on FIELD_DEFINITION | ENUM_VALUE
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.FieldDefinitionNode', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      type Character {
        "The name of the character." 
        name: String!
      }
    `))))).toMatchInlineSnapshot
      (`
      "type Character {
        "The name of the character."
        name: String!
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.InputObjectTypeDefinitionNode', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      input ReviewInput {
        stars: Int!
        commentary: String
      }
    `))))).toMatchInlineSnapshot
      (`
      "input ReviewInput {
        stars: Int!
        commentary: String
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.VariableDefinitionNode', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      query HeroNameAndFriends($episode: Episode = JEDI) {
        hero(episode: $episode) {
          name
          friends {
            name
          }
        }
      }
    `))))).toMatchInlineSnapshot
      (`
      "query HeroNameAndFriends($episode: Episode = JEDI) {
        hero(episode: $episode) {
          name
          friends {
            name
          }
        }
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.FragmentDefinitionNode', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      fragment comparisonFields on Character {
        name
        appearsIn
        friends {
          name
        }
      }
    `))))).toMatchInlineSnapshot
      (`
      "fragment comparisonFields on Character {
        name
        appearsIn
        friends {
          name
        }
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.FragmentSpreadNode', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      query findUser($userId: ID!) {
        user(id: $userId) {
          ...UserFields
        }
      }
    `))))).toMatchInlineSnapshot
      (`
      "query findUser($userId: ID!) {
        user(id: $userId) {
          ...UserFields
        }
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.InputValueDefinitionNode', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      type Starship {
        id: ID!
        name: String!
        length(unit: LengthUnit = METER): Float
      }
    `))))).toMatchInlineSnapshot
      (`
      "type Starship {
        id: ID!
        name: String!
        length(unit: LengthUnit = METER): Float
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.ObjectNode', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      type Pet {
        petName: [String!]
      }

      type Human {
        humanName: String!
        pet: Pet
      }
    `))))).toMatchInlineSnapshot
      (`
      "type Pet {
        petName: [String!]
      }

      type Human {
        humanName: String!
        pet: Pet
      }
      "
    `)

    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      """
      A character from the Star Wars universe
      """
      type Character {
        "The name of the character."
        name: String!
      }
    `))))).toMatchInlineSnapshot
      (`
      """"
      A character from the Star Wars universe
      """
      type Character {
        "The name of the character."
        name: String!
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.InterfaceNode', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
    interface Node {
      id: ID!
    }

    interface Character implements Node {
      id: ID!
      name: String!
      friends: [Character]
      appearsIn: [Episode]!
    }

    type Episode {
      id: ID!
    }
  `))))).toMatchInlineSnapshot
      (`
    "interface Node {
      id: ID!
    }

    interface Character implements Node {
      id: ID!
      name: String!
      friends: [Character]
      appearsIn: [Episode]!
    }

    type Episode {
      id: ID!
    }
    "
  `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.UnionNode', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      union SearchResult = Human | Droid | Starship
    `))))).toMatchInlineSnapshot
      (`
      "union SearchResult = Human | Droid | Starship
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: AST.ArgumentNode', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      query {
        search(text: "an") {
          __typename
          ... on Human {
            name
            height
          }
          ... on Droid {
            name
            primaryFunction
          }
          ... on Starship {
            name
            length
          }
        }
      }
    `))))).toMatchInlineSnapshot
      (`
      "query {
        search(text: "an") {
          __typename
          ... on Human {
            name
            height
          }
          ... on Droid {
            name
            primaryFunction
          }
          ... on Starship {
            name
            length
          }
        }
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲AST.toString❳: kitchen sink', () => {
    vi.expect.soft(format(AST.toString(graphql.parse(format(`
      scalar Date

      # This line is treated like whitespace and ignored by GraphQL
      schema {
        query: Query
      }

      """
      The query type, represents all of the entry points into our object graph
      """
      type Query {
        me: User!
        """
        Fetches the hero of a specified Star Wars film.
        """
        user(
          "The name of the film that the hero appears in."
          id: ID!
        ): User
        allUsers: [User]
        search(term: String!): [SearchResult!]!
        myChats: [Chat!]!
      }

      enum Role {
        USER
        ADMIN
      }

      interface Node {
        id: ID!
      }

      union SearchResult = User | Chat | ChatMessage

      type User implements Node {
        id: ID!
        username: String!
        email: String!
        role: Role!
      }

      type Chat implements Node {
        id: ID!
        users: [User!]!
        messages: [ChatMessage!]!
      }

      type ChatMessage implements Node {
        id: ID!
        content: String!
        time: Date!
        user: User!
      }

      query findUser($userId: ID!) {
        user(id: $userId) {
          ...UserFields
        }
      }

      query HeroComparison($first: Int = 3) {
        leftComparison: hero(episode: EMPIRE) {
          ...comparisonFields
        }
        rightComparison: hero(episode: JEDI) {
          ...comparisonFields
        }
      }

      fragment comparisonFields on Character {
        name
        friendsConnection(first: $first) {
          totalCount
          edges {
            node {
              name
            }
          }
        }
      }

      query Hero($episode: Episode, $withFriends: Boolean!) {
        hero(episode: $episode) {
          name
          friends @include(if: $withFriends) {
            name
          }
        }
      }
    `))))).toMatchInlineSnapshot
      (`
      "scalar Date

      schema {
        query: Query
      }

      """
      The query type, represents all of the entry points into our object graph
      """
      type Query {
        me: User!
        """
        Fetches the hero of a specified Star Wars film.
        """
        user(
          "The name of the film that the hero appears in."
          id: ID!
        ): User
        allUsers: [User]
        search(term: String!): [SearchResult!]!
        myChats: [Chat!]!
      }

      enum Role {
        USER
        ADMIN
      }

      interface Node {
        id: ID!
      }

      union SearchResult = User | Chat | ChatMessage

      type User implements Node {
        id: ID!
        username: String!
        email: String!
        role: Role!
      }

      type Chat implements Node {
        id: ID!
        users: [User!]!
        messages: [ChatMessage!]!
      }

      type ChatMessage implements Node {
        id: ID!
        content: String!
        time: Date!
        user: User!
      }

      query findUser($userId: ID!) {
        user(id: $userId) {
          ...UserFields
        }
      }

      query HeroComparison($first: Int = 3) {
        leftComparison: hero(episode: EMPIRE) {
          ...comparisonFields
        }
        rightComparison: hero(episode: JEDI) {
          ...comparisonFields
        }
      }

      fragment comparisonFields on Character {
        name
        friendsConnection(first: $first) {
          totalCount
          edges {
            node {
              name
            }
          }
        }
      }

      query Hero($episode: Episode, $withFriends: Boolean!) {
        hero(episode: $episode) {
          name
          friends @include(if: $withFriends) {
            name
          }
        }
      }
      "
    `)
  })

})
