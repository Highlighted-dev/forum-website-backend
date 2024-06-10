import express, { Router, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { logger } from "utils/logger";
import discussionModel from "models/DiscussionModel";
dotenv.config();

const router: Router = express.Router();

const jsonParser = bodyParser.json();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const discussions = await discussionModel.find();
    res.json(discussions);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to retrieve discussions" });
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Id is required" });
    const discussion = await discussionModel.findById(id);
    res.json(discussion);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to retrieve discussion" });
  }
});

router.get(
  "/category/:category",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category } = req.params;
      const discussions = await discussionModel.find({
        category: { $regex: new RegExp(category, "i") },
      });
      res.json(discussions);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Failed to retrieve discussions" });
    }
  }
);

router.post(
  "/",
  jsonParser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, title, content, category, _id } = req.body;
      if (user && _id && content) {
        await discussionModel.findByIdAndUpdate(_id, {
          $push: { answers: { user, content } },
        });
        return res.json({ user, content });
      }
      if (!user || !title || !content || !category) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const newDiscussion = new discussionModel({
        user,
        title,
        content,
        category,
      });
      await newDiscussion.save();
      res.json(newDiscussion);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Failed to create discussion" });
    }
  }
);

router.put(
  "/:id",
  jsonParser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { username, title, content } = req.body;
      if (!username || !title || !content) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const edit_date = new Date();
      const updatedDiscussion = await discussionModel.findByIdAndUpdate(
        id,
        { username, title, content, edit_date },
        { new: true }
      );
      res.json(updatedDiscussion);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Failed to update discussion" });
    }
  }
);
export default router;
