import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { IPost } from "./Post";

export interface IComment extends Document {
  content: string;
  author: IUser["_id"];
  post: IPost["_id"];
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Comment =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
