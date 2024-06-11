import express, { Application } from "express";
import { apiKeyMiddleware } from "middlewares/apiKeyMiddleware";
import { errorHandlingMiddleware } from "middlewares/errorHandlingMiddleware";
import { morganMiddleware } from "middlewares/morganMiddleware";
import ChatRoute from "routes/ChatRoute";
import DiscussionRoute from "routes/DiscussionRoute";
import { getCurrentUrl } from "utils/getCurrentUrl";
import cron from "node-cron";
import { logger } from "utils/logger";
import UserRoute from "routes/UserRoute";
export const app: Application = express();

app.use(morganMiddleware);
app.use(errorHandlingMiddleware);
app.use(apiKeyMiddleware);
app.use("/externalApi/chat/", ChatRoute);
app.use("/externalApi/discussion/", DiscussionRoute);
app.use("/externalApi/user/", UserRoute);
app.use("/", (req, res) => res.send("Hello World!"));

// free servers hosted on render go to sleep after 15 minutes of inactivity, which means the first request sent to the server after these 15 minutes may take up to one minute.
// We dont want that
const stopServerFromSleep = async () => {
  logger.info("Stopping server from sleeping...");
  await fetch(getCurrentUrl() + "/", {
    method: "GET",
    headers: { "x-api-key": process.env.API_KEY_TOKEN! },
  });
};
cron.schedule("*/14 * * * *", stopServerFromSleep);
