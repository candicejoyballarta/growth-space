import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  image?: string;
  name: string;
  email: string;
  bio?: string;
  role?: "user" | "admin";
  password: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    image: { type: String, default: "/profile.jpg" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
