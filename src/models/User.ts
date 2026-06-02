import mongoose from "mongoose";

export interface IUser {
  name: string;
  email: string;
  color: string;
  avatarUrl?: string;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: String,
    email: String,
    color: {
      type: String,
      default: "#808080",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
  },
  { collection: "user" },
);

export default (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
