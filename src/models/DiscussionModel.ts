import { Document, Schema, model } from "mongoose";

export interface IDiscussionModel extends Document {
  username: string;
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
    title: { type: String, required: true },
    username: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    editedAt: { type: Date, default: Date.now },
    pinned: { type: Boolean, default: false },
    category: { type: String, required: true },
    answers: [
      {
        type: {
          username: { type: String, required: true },
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
