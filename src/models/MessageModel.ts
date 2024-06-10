import { Document, Schema, model } from "mongoose";
import { IUserModel } from "./UserModel";

export interface IMessageModel extends Document {
  user: IUserModel;
  content: string;
  timestamp: Date;
}
const messageSchema: Schema = new Schema(
  {
    user: {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      image: { type: String, required: false },
      role: { type: String, required: false },
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
