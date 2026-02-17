import { usersTypeDefs, usersResolvers } from "./users";

export { usersTypeDefs, usersResolvers };

// Aggregated arrays to import in the schema composer
export const modulesTypeDefs = [usersTypeDefs];
export const modulesResolvers = [usersResolvers];
