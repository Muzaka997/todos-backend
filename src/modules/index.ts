import { usersTypeDefs, usersResolvers } from "./users";
import { authTypeDefs, authResolvers } from "./auth";
import { tasksTypeDefs, tasksResolvers } from "./tasks";
import { suggestionsTypeDefs, suggestionsResolvers } from "./suggestions";

export { usersTypeDefs, usersResolvers };
export { authTypeDefs, authResolvers };
export { tasksTypeDefs, tasksResolvers };
export { suggestionsTypeDefs, suggestionsResolvers };

// Aggregated arrays to import in the schema composer
export const modulesTypeDefs = [
  usersTypeDefs,
  authTypeDefs,
  tasksTypeDefs,
  suggestionsTypeDefs,
];
export const modulesResolvers = [
  usersResolvers,
  authResolvers,
  tasksResolvers,
  suggestionsResolvers,
];
