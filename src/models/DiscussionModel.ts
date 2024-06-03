import { Document, Schema, model } from "mongoose";

export interface IDiscussionModel extends Document {
  username: string;
  title: string;
  content: string;
  create_date: Date;
  edit_date: Date;
  answers: IDiscussionModel[];
}

const discussionsSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    content: { type: String, required: true },
    create_date: { type: Date, default: Date.now },
    edit_date: { type: Date, default: Date.now },
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
