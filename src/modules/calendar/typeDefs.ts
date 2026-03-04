export const calendarTypeDefs = /* GraphQL */ `
  enum EventKind {
    TODO
    NOT_TODO
  }

  type CalendarEvent {
    id: ID!
    title: String!
    start: String! # ISO string
    end: String! # ISO string
    kind: EventKind!
    notes: String
  }

  extend type Query {
    events(timeMin: String!, timeMax: String!): [CalendarEvent!]!
  }

  extend type Mutation {
    addEvent(
      title: String!
      start: String!
      end: String!
      kind: EventKind!
      notes: String
    ): CalendarEvent!
    updateEvent(
      id: ID!
      title: String
      start: String
      end: String
      kind: EventKind
      notes: String
    ): CalendarEvent!
    deleteEvent(id: ID!): Boolean!
  }
`;
