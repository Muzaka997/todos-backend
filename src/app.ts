import express, { Application } from "express";
import usersRouter from "./routes/users";

const app: Application = express();

app.use(express.json());
app.use("/users", usersRouter);

export default app;
