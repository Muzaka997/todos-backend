import { usersTypeDefs, usersResolvers } from "./users";
import { authTypeDefs, authResolvers } from "./auth";
import { tasksTypeDefs, tasksResolvers } from "./tasks";
import { suggestionsTypeDefs, suggestionsResolvers } from "./suggestions";
import { calendarTypeDefs, calendarResolvers } from "./calendar/index";
import { notesTypeDefs, notesResolvers } from "./notes";

export { usersTypeDefs, usersResolvers };
export { authTypeDefs, authResolvers };
export { tasksTypeDefs, tasksResolvers };
export { suggestionsTypeDefs, suggestionsResolvers };
export { calendarTypeDefs, calendarResolvers };
export { notesTypeDefs, notesResolvers };

// Aggregated arrays to import in the schema composer
export const modulesTypeDefs = [
  usersTypeDefs,
  authTypeDefs,
  tasksTypeDefs,
  suggestionsTypeDefs,
  calendarTypeDefs,
  notesTypeDefs,
];
export const modulesResolvers = [
  usersResolvers,
  authResolvers,
  tasksResolvers,
  suggestionsResolvers,
  calendarResolvers,
  notesResolvers,
];
