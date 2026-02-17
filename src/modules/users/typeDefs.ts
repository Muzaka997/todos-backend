export const usersTypeDefs = /* GraphQL */ `
  type User {
    id: Int!
    name: String!
    email: String!
    gender: Gender!
    createdAt: String!
  }

  extend type Query {
    users: [User!]!
    user(id: Int!): User
  }

  input CreateUserInput {
    name: String!
    email: String!
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User!
    deleteUser(id: Int!): Boolean!
  }
`;
