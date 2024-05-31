import { Server } from "http";
import { app } from "@app";
import { logger } from "utils/logger";
import { errorHandler, isTrustedError } from "utils/errorHandler";

const port = 5000;

const server: Server = app.listen(port, (): void => {
  console.log(`Listening on port ${port}`);
  logger.info(`Application Forum-Website-Backend listens on PORT: ${port}`);
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
