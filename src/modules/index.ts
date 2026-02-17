import { usersTypeDefs, usersResolvers } from "./users";
import { authTypeDefs, authResolvers } from "./auth";

export { usersTypeDefs, usersResolvers };
export { authTypeDefs, authResolvers };

// Aggregated arrays to import in the schema composer
export const modulesTypeDefs = [usersTypeDefs, authTypeDefs];
export const modulesResolvers = [usersResolvers, authResolvers];
