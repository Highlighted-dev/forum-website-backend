import express, { Router, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { logger } from "../utils/logger";
import userModel from "../models/UserModel";
import discussionModel from "../models/DiscussionModel";
import messageModel from "../models/MessageModel";
import { isUsernameValid } from "../utils/validators";
dotenv.config();

const router: Router = express.Router();

const jsonParser = bodyParser.json();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      logger.error("Invalid id");
      return res.status(400).json({ error: "Invalid id" });
    }
    const user = await userModel.findById(id);
    const numberOfDiscussions = await discussionModel.countDocuments({
      "user._id": id,
    });
    const numberOfReplies = await discussionModel.countDocuments({
      "answers.user._id": id,
    });
    res.json({ ...user?.toObject(), numberOfDiscussions, numberOfReplies });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

router.put(
  "/:id",
  jsonParser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, bio } = req.body;
      console.log(req.body);
      if (!name && !bio) {
        logger.error("Name or bio are required");
        return res.status(400).json({ error: "Name or bio are required" });
      }
      if (!isUsernameValid(name)) {
        logger.error("Invalid username");
        return res.status(400).json({
          error:
            "Invalid username. Must be between 4 and 25 characters long and can contain only letters, numbers, and these special characters: !@#()_.",
        });
      }
      if (name) {
        // alright so if name is defined, we want to change the name of the user in his every discussion and chat message
        await discussionModel.updateMany(
          { "user._id": id },
          { $set: { "user.name": name } }
        );
        await discussionModel.updateMany(
          { "answers.user._id": id },
          { $set: { "answers.$.user.name": name } }
        );
        await messageModel.updateMany(
          { "user._id": id },
          { $set: { "user.name": name } }
        );
      }
      await userModel.findByIdAndUpdate(id, { name, bio }, { new: true });
      res.json({ name, bio });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Failed to update user" });
    }
  }
);

export default router;
