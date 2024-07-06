import { Document, Schema, model } from "mongoose";

export interface IUserModel extends Document {
  name: string;
  email: string;
  image: string;
  role: string;
  emailVerified?: boolean;
  bio?: string;
  createdAt: Date;
}

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: false },
    role: { type: String, default: "user" },
    emailVerified: { type: Boolean, required: false },
    bio: { type: String, required: false },
    createdAt: { type: Date, required: true, default: Date.now },
  },
  { versionKey: false }
);
const userModel = model<IUserModel>("Users", userSchema, "users");
export default userModel;
