import { Document, Schema, model } from "mongoose";
import { IUser } from "./DiscussionModel";

export interface IMessageModel extends Document {
  user: IUser;
  content: string;
  timestamp: Date;
}
const messageSchema: Schema = new Schema(
  {
    user: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      image: { type: String, required: false },
    },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { versionKey: false }
);
const messageModel = model<IMessageModel>(
  "Messages",
  messageSchema,
  "messages"
);
export default messageModel;
