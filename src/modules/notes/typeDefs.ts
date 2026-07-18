export const notesTypeDefs = /* GraphQL */ `
  type Note {
    id: ID!
    title: String!
    body: String!
    audio: String
    pinned: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    notes: [Note!]!
    note(id: ID!): Note
  }

  extend type Mutation {
    addNote(title: String, body: String, audio: String): Note!
    updateNote(
      id: ID!
      title: String
      body: String
      audio: String
      pinned: Boolean
    ): Note!
    deleteNote(id: ID!): Boolean!
  }
`;
