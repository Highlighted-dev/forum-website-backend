import { Request, Response, NextFunction } from "express";

import AppError from "utils/errorHandler";
import { logger } from "utils/logger";
import dotenv from "dotenv";
import { errorHandlingMiddleware } from "./errorHandlingMiddleware";

dotenv.config();

export const apiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let xApiKey: string;
  const token: string = process.env.API_KEY_TOKEN!;
  if (req.header("x-api-key")) {
    xApiKey = req.header("x-api-key")!.trim();
  }
  if (!!token && xApiKey! === token.trim()) {
    return next();
  }
  logger.error(
    "Missing x-api-key in request header or it does not match with env variable"
  );
  errorHandlingMiddleware(
    new AppError(
      403,
      "Missing x-api-key in request header or it does not match with env variable",
      true
    ),
    req,
    res,
    next
  );
};
