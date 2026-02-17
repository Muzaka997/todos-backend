import app from "./app";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { typeDefs, resolvers } from "./graphql/schema";
import { db } from "./db";
import bodyParser from "body-parser";
import { verifyToken } from "./modules/auth/utils/jwt";

const PORT = process.env.PORT || 8080;

async function start() {
  const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN
    ? process.env.FRONTEND_ORIGIN.split(",")
    : ["http://localhost:5173", "http://localhost:3000"];

  const corsOptions: cors.CorsOptions = {
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "apollographql-client-name",
      "apollographql-client-version",
    ],
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
  });
  await server.start();

  const gqlMiddleware = expressMiddleware(server, {
    context: async ({ req }) => {
      const auth = req.headers["authorization"] || req.headers["Authorization"];
      let userId: string | null = null;
      if (typeof auth === "string" && auth.startsWith("Bearer ")) {
        const token = auth.slice("Bearer ".length).trim();
        const payload = verifyToken(token);
        if (payload && typeof payload.sub === "string") {
          userId = payload.sub;
        }
      }
      return { db, userId };
    },
  }) as unknown as any; // Type shim for Express 5 vs Apollo express4 types

  // Ensure JSON body is parsed exactly once before Apollo middleware.
  app.use("/graphql", cors(corsOptions), bodyParser.json(), gqlMiddleware);

  app.listen(PORT, () => {
    console.log(`HTTP server: http://localhost:${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
