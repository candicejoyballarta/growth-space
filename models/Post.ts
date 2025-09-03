import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { IGoal } from "./Goal";

export interface IComment extends Document {
  author: {
    _id: IUser["_id"];
    name: string;
    image?: string;
  };
  content: string;
  createdAt: Date;
}

export interface IPost extends Document {
  author: IUser["_id"];
  goalId?: IGoal["_id"];
  title: string;
  content: string;
  tags: string[];
  likes: IUser["_id"][];
  comments?: [IComment];
}

const CommentSchema = new Schema<IComment>({
  content: { type: String, required: true },
  author: {
    _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    image: { type: String, default: "/profile.jpg" },
  },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    goalId: { type: Schema.Types.ObjectId, ref: "Goal" },
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
