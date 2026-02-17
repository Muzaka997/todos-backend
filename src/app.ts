import express, { Application } from "express";

const app: Application = express();

// Optional health check
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Root helper
app.get("/", (_req, res) => {
  res.send("GraphQL server is running. Visit /graphql");
});

export default app;
