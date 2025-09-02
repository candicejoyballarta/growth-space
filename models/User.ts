import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  image?: string;
  name: string;
  email: string;
  bio?: string;
  coverImage?: string;
  role: "user" | "admin";
  password: string;
  following?: [{ type: Schema.Types.ObjectId; ref: "User" }];
  followers?: [{ type: Schema.Types.ObjectId; ref: "User" }];
  growthAreas: string[];
  intentions: string;
  onboardingComplete: boolean;
  streak: number;
  status: "active" | "inactive";
  emailVerified: boolean;
  createdAt: Date;
  lastLogin: Date;
  verificationToken: string;
  verificationTokenExpires: Date;
}

const UserSchema = new Schema<IUser>(
  {
    image: { type: String, default: "/profile.jpg" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    coverImage: { type: String, default: "default-cover.jpg" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    growthAreas: [{ type: String }],
    intentions: { type: String, default: "" },
    onboardingComplete: { type: Boolean, default: false },
    streak: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    emailVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  if (!this.lastLogin) {
    this.status = "inactive";
  } else {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    if (this.lastLogin < sixMonthsAgo) {
      this.status = "inactive";
    } else {
      this.status = "active";
    }
  }
  next();
});

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
