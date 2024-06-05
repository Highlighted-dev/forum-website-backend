import { Document, Schema, model } from "mongoose";

export interface IMessageModel extends Document {
  username: string;
  content: string;
  timestamp: Date;
  icon?: string;
}

const messageSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    icon: { type: String, required: false },
  },
  { versionKey: false }
);
const messageModel = model<IMessageModel>(
  "Messages",
  messageSchema,
  "messages"
);
export default messageModel;
