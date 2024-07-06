import { Document, Schema, model } from "mongoose";
import { IUserModel } from "./UserModel";

export interface IReactionsModel {
  user: IUserModel;
  reaction: string;
}
export interface IDiscussionModel extends Document {
  user: IUserModel;
  title: string;
  content: string;
  createdAt: Date;
  editedAt: Date;
  pinned: boolean;
  category: string;
  closed: boolean;
  reactions: IReactionsModel[];
  answers: IDiscussionModel[];
}

const discussionsSchema: Schema = new Schema(
  {
    user: {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      image: { type: String, required: false },
      role: { type: String, required: false },
      bio: { type: String, required: false },
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    editedAt: { type: Date, default: Date.now },
    pinned: { type: Boolean, default: false },
    category: { type: String, required: true },
    closed: { type: Boolean, default: false },
    reactions: [
      {
        user: {
          _id: { type: String, required: true },
          name: { type: String, required: true },
          email: { type: String, required: true },
          image: { type: String, required: false },
          role: { type: String, required: false },
          bio: { type: String, required: false },
        },
        reaction: { type: String, required: true },
      },
    ],
    answers: [
      {
        type: {
          user: {
            _id: { type: String, required: true },
            name: { type: String, required: true },
            email: { type: String, required: true },
            image: { type: String, required: false },
            role: { type: String, required: false },
            bio: { type: String, required: false },
          },
          content: { type: String, required: true },
          reactions: [
            {
              user: {
                _id: { type: String, required: true },
                name: { type: String, required: true },
                email: { type: String, required: true },
                image: { type: String, required: false },
                role: { type: String, required: false },
                bio: { type: String, required: false },
              },
              reaction: { type: String, required: true },
            },
          ],
          createdAt: { type: Date, default: Date.now },
          editedAt: { type: Date, default: Date.now },
        },
      },
    ],
  },
  { versionKey: false }
);
const discussionModel = model<IDiscussionModel>(
  "Discussions",
  discussionsSchema,
  "discussions"
);
export default discussionModel;
