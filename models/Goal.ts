import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface IMilestone extends Document {
  _id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  completedAt?: Date;
}

export type GoalStatus = "active" | "archived" | "completed";

export interface IGoal extends Document {
  title: string;
  description?: string;
  milestones: IMilestone[];
  progress: number;
  color?: string;
  emoji?: string;
  status: GoalStatus;
  user: IUser["_id"];
  createdAt: Date;
  completedAt?: Date;
}

const MilestoneSchema = new Schema<IMilestone>({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date },
  completedAt: { type: Date },
});

const GoalSchema = new Schema<IGoal>({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  milestones: [MilestoneSchema],
  progress: { type: Number, default: 0 },
  color: { type: String, default: "#000000" },
  emoji: { type: String, default: "⭐" },
  status: {
    type: String,
    enum: ["active", "archived", "completed"],
    default: "active",
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

GoalSchema.pre("save", function (next) {
  if (this.milestones.length > 0) {
    const completed = this.milestones.filter((m) => m.completed).length;
    this.progress = Math.round((completed / this.milestones.length) * 100);
    if (this.progress === 100) this.status = "completed";
  } else {
    this.progress = 0;
    this.status = "active";
  }
  next();
});

export const Goal =
  mongoose.models.Goal || mongoose.model<IGoal>("Goal", GoalSchema);
