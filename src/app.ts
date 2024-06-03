import express, { Application } from "express";
import { apiKeyMiddleware } from "middlewares/apiKeyMiddleware";
import { errorHandlingMiddleware } from "middlewares/errorHandlingMiddleware";
import { morganMiddleware } from "middlewares/morganMiddleware";
import ChatRoute from "routes/ChatRoute";
import DiscussionRoute from "routes/DiscussionRoute";

export const app: Application = express();

app.use(morganMiddleware);
app.use(errorHandlingMiddleware);
app.use(apiKeyMiddleware);
app.use("/externalApi/chat/", ChatRoute);
app.use("/externalApi/discussion/", DiscussionRoute);
app.use("/", (req, res) => res.send("Hello World!"));
