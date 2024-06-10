import express, { Router, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { logger } from "utils/logger";
import userModel from "models/UserModel";
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
    const user = await userModel.findById(id);
    res.json(user);
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
      const { name, email, image } = req.body;
      await userModel.findByIdAndUpdate(id, {
        name,
        email,
        image,
      });
      res.json({ name, email, image });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Failed to update user" });
    }
  }
);

export default router;
