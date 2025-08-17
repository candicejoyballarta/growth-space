import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface IPost extends Document {
  title: string;
  content: string;
  tags?: string[];
  author: IUser["_id"];
  likes?: IUser["_id"][];
  createdAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Post =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
