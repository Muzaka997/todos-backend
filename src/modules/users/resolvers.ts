// The `users`/`user` queries and `createUser`/`deleteUser` mutations were
// removed: they were unauthenticated and let anyone enumerate accounts or
// create/delete users without a password. Account creation now goes solely
// through the auth module (signup/login). The `User` type lives in typeDefs
// and is populated by the auth resolvers (`me`, signup, login).
export const usersResolvers = {};
