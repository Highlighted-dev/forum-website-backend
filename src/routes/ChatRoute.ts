import express, { Router, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import messageModel from "models/MessageModel";
import { logger } from "utils/logger";
dotenv.config();

const router: Router = express.Router();

const jsonParser = bodyParser.json();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await messageModel.find();
    res.json(messages);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to retrieve chat messages" });
  }
});

router.post(
  "/",
  jsonParser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, content } = req.body;
      const newMessage = new messageModel({
        username,
        content,
      });
      await newMessage.save();
      res.json(newMessage);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Failed to send chat message" });
    }
  }
);
export default router;
