import { rootTypeDefs, rootResolvers } from "./root";
import { modulesTypeDefs, modulesResolvers } from "../modules";

export const typeDefs = [rootTypeDefs, ...modulesTypeDefs];
export const resolvers = [rootResolvers, ...modulesResolvers];
