import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export type ActivityType =
  | "SIGNUP"
  | "LOGIN"
  | "GOAL_COMPLETED"
  | "GOAL_CREATED"
  | "POST_ADDED";

export interface IActivity extends Document {
  user: IUser["_id"];
  type: ActivityType;
  metadata: object;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["SIGNUP", "LOGIN", "GOAL_COMPLETED", "GOAL_CREATED", "POST_ADDED"],
      required: true,
    },
    metadata: { type: Object },
  },
  { timestamps: true }
);

export const Activity =
  mongoose.models.Activity ||
  mongoose.model<IActivity>("Activity", ActivitySchema);
