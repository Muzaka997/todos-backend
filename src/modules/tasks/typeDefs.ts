export const tasksTypeDefs = /* GraphQL */ `
  enum TaskType {
    TODO
    NOT_TODO
  }

  type Task {
    id: ID!
    title: String!
    category: String!
    tags: [String!]!
    estimatedMinutes: Int!
    completed: Boolean!
    type: TaskType!
  }

  extend type Query {
    tasks(type: TaskType!): [Task!]!
    task(id: ID!): Task
  }

  extend type Mutation {
    addTask(
      title: String!
      type: TaskType!
      category: String
      estimatedMinutes: Int
      tags: [String!]
    ): Task!
    toggleTask(id: ID!): Task!
    updateTaskTitle(id: ID!, title: String!): Task!
    deleteTask(id: ID!): Boolean!
  }
`;
