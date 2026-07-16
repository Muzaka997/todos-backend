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
  // read the allowed origin(s) from an env var.  Render stores them as a
  // single string, so we support a comma-separated list and normalize it.
  const rawOrigin = process.env.FRONTEND_ORIGIN ?? "";
  const FRONTEND_ORIGIN = rawOrigin
    ? rawOrigin.split(",").map((u) => u.trim().replace(/\/+$/, "")) // strip trailing slashes
    : ["http://localhost:5173", "http://localhost:3000"];
  // Any localhost / 127.0.0.1 origin on any port is allowed for local dev, so
  // it doesn't matter whether the browser hits :5173 via `localhost` or the
  // `127.0.0.1` alias (which is otherwise a distinct, non-matching origin).
  const isLocalhost = (origin: string) =>
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  console.log("CORS allowed origins:", FRONTEND_ORIGIN, "(+ any localhost)");

  const corsOptions: cors.CorsOptions = {
    origin(origin, callback) {
      // No Origin header => non-browser client (curl, same-origin) => allow.
      if (!origin || FRONTEND_ORIGIN.includes(origin) || isLocalhost(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
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
