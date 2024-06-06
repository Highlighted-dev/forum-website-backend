import { Document, Schema, model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  image: string;
}

export interface IDiscussionModel extends Document {
  user: IUser;
  title: string;
  content: string;
  createdAt: Date;
  editedAt: Date;
  pinned: boolean;
  category: string;
  answers: IDiscussionModel[];
}

const discussionsSchema: Schema = new Schema(
  {
    user: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      image: { type: String, required: false },
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    editedAt: { type: Date, default: Date.now },
    pinned: { type: Boolean, default: false },
    category: { type: String, required: true },
    answers: [
      {
        type: {
          user: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            image: { type: String, required: false },
          },
          content: { type: String, required: true },
          create_date: { type: Date, default: Date.now },
          edit_date: { type: Date, default: Date.now },
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
