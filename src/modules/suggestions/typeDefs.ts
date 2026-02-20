export const suggestionsTypeDefs = /* GraphQL */ `
  type Suggestion {
    id: ID!
    title: String!
    category: String!
    tags: [String!]!
    estimatedMinutes: Int!
  }

  extend type Query {
    suggestions(category: String, limit: Int): [Suggestion!]!
    suggestion(id: ID!): Suggestion
  }

  extend type Mutation {
    # Create a real task from a suggestion id
    addSuggestionToTasks(suggestionId: ID!, type: TaskType = TODO): Task!
  }
`;
