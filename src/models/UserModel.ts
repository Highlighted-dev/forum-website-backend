import { Document, Schema, model } from "mongoose";

export interface IUserModel extends Document {
  name: string;
  email: string;
  image: string;
  role?: string;
  emailVerified?: boolean;
  bio?: string;
}

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: false },
    role: { type: String, required: false },
    emailVerified: { type: Boolean, required: false },
    bio: { type: String, required: false },
  },
  { versionKey: false }
);
const userModel = model<IUserModel>("Users", userSchema, "users");
export default userModel;
