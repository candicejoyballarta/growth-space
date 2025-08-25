import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface IMilestone extends Document {
  title: string;
  completed: boolean;
  dueDate: Date;
}

export interface IGoal extends Document {
  title: string;
  description?: string;
  milestones: [IMilestone];
  progress: number;
  color?: string;
  user: IUser["_id"];
  createdAt: Date;
}

const MilestoneSchema = new Schema<IMilestone>({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date },
});

const GoalSchema = new Schema<IGoal>({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  milestones: [MilestoneSchema],
  progress: { type: Number, default: 0 },
  color: { type: String, default: "#000000" },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Goal =
  mongoose.models.Goal || mongoose.model<IGoal>("Goal", GoalSchema);
