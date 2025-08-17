import mongoose, { Schema, Document } from "mongoose";

export interface ITag extends Document {
  name: string;
  description?: string;
}

const TagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, optional: true },
  },
  { timestamps: true }
);

export const Tag =
  mongoose.models.Tag || mongoose.model<ITag>("Tag", TagSchema);
