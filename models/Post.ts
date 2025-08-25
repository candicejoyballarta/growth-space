import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface IComment extends Document {
  author: IUser["_id"];
  content: string;
  createdAt: Date;
}

export interface IPost extends Document {
  author: IUser["_id"];
  title: string;
  content: string;
  tags: string[];
  likes: IUser["_id"][];
  comments?: [IComment];
}

const CommentSchema = new Schema<IComment>({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

export const Post =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
