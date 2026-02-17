export const authTypeDefs = /* GraphQL */ `
  enum Gender {
    MALE
    FEMALE
    OTHER
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  extend type Query {
    me: User
  }

  extend type Mutation {
    signup(
      email: String!
      password: String!
      name: String!
      gender: Gender!
    ): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }
`;
