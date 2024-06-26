import express, { Router, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { logger } from "utils/logger";
import discussionModel from "models/DiscussionModel";
import {
  isDiscussionContentValid,
  isDiscussionTitleValid,
} from "utils/validators";
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
        user._id = user.id;
        await discussionModel.findByIdAndUpdate(_id, {
          $push: { answers: { user, content } },
        });
        return res.json({ user, content });
      }
      if (!user || !title || !content || !category) {
        return res.status(400).json({ error: "All fields are required" });
      }
      console.log(content);
      if (!isDiscussionTitleValid(title)) {
        return res.status(400).json({ error: "Title is invalid" });
      } else if (!isDiscussionContentValid(content)) {
        return res.status(400).json({ error: "Content is invalid" });
      }
      user._id = user.id;
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
      const { username, title, content, closing } = req.body;
      if (closing == "true" || closing == "false") {
        const updatedDiscussion = await discussionModel.findByIdAndUpdate(
          id,
          { closed: closing },
          { new: true }
        );
        return res.json(updatedDiscussion);
      }
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

// New endpoint to add or update reactions
router.put(
  "/:id/reactions",
  jsonParser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { user, reaction, answerId } = req.body;

      if (!user || !reaction) {
        return res
          .status(400)
          .json({ error: "User and reaction are required" });
      }
      user._id = user.id;
      const discussion = await discussionModel.findById(id);
      if (!discussion) {
        return res.status(404).json({ error: "Discussion not found" });
      }

      if (answerId) {
        const answer = discussion.answers.find(
          (ans) => (ans._id as string).toString() === answerId
        );
        if (!answer) {
          return res.status(404).json({ error: "Answer not found" });
        }

        const existingReaction = answer.reactions?.find(
          (r) => r.user._id === user._id
        );

        if (existingReaction) {
          existingReaction.reaction = reaction;
        } else {
          if (!answer.reactions) {
            answer.reactions = [];
          }
          answer.reactions.push({ user, reaction });
        }
      } else {
        const existingReaction = discussion.reactions.find(
          (r) => r.user._id === user._id
        );

        if (existingReaction) {
          existingReaction.reaction = reaction;
        } else {
          discussion.reactions.push({ user, reaction });
        }
      }

      await discussion.save();
      res.json(discussion);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Failed to update reactions" });
    }
  }
);

export default router;
