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
      const { user, content, icon } = req.body;
      if (!user || !content || !icon) {
        logger.error("User, content and icon are required");
        return res
          .status(400)
          .json({ error: "User, content and icon are required" });
      }
      const newMessage = new messageModel({
        user,
        content,
        icon,
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
