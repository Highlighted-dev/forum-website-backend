import express, { Router, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import messageModel from "models/MessageModel";
import { logger } from "utils/logger";
import { isMessageValid } from "utils/validators";
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
      const { user, content } = req.body;
      if (!user || !content) {
        logger.error("User, content and icon are required");
        return res.status(400).json({
          error:
            "User, content and icon are required (your message is probably empty)",
        });
      }
      if (!isMessageValid(content)) {
        logger.error("Invalid message");
        return res.status(400).json({
          error:
            "Invalid message. Message must be at least 1 character long and maximum 500 characters long. Message must contain only alphanumeric characters, spaces, special characters and emojis.",
        });
      }
      user._id = user.id;
      const newMessage = new messageModel({
        user,
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
