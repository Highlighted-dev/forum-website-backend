import { Server } from "http";
import { app } from "@app";
import { logger } from "utils/logger";
import { errorHandler, isTrustedError } from "utils/errorHandler";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const port = 5000;
const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

const server: Server = app.listen(port, async (): Promise<void> => {
  await connectToDatabase().then(
    () => {
      console.log(`Connected to MongoDB. Listening on port ${port}`);
    },
    (error) => logger.error(error)
  );
});

const exitHandler = (): void => {
  if (app) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error): void => {
  errorHandler(error);
  if (!isTrustedError(error)) {
    exitHandler();
  }
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", (reason: Error) => {
  throw reason;
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
