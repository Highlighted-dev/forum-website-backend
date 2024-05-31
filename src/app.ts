import express, { Application } from "express";
import { apiKeyMiddleware } from "middlewares/apiKeyMiddleware";
import { errorHandlingMiddleware } from "middlewares/errorHandlingMiddleware";
import { morganMiddleware } from "middlewares/morganMiddleware";

export const app: Application = express();

app.use(morganMiddleware);
app.use(errorHandlingMiddleware);
app.use(apiKeyMiddleware);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello World!" });
});
