import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Post } from "@/models/Post";
import { IUser, User } from "@/models/User";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, props: Params) {
  const params = await props.params;
  try {
    await connectToDB();

    const user = await User.findById(params.id).lean<IUser>();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tags = await Post.aggregate([
      // Only posts from this author
      { $match: { author: user._id } },

      // Break tags array into individual documents
      { $unwind: "$tags" },

      // Normalize + count
      {
        $group: {
          _id: { $toLower: { $trim: { input: "$tags" } } },
          count: { $sum: 1 },
        },
      },

      // Sort by most used first
      { $sort: { count: -1 } },

      // Limit results
      { $limit: 7 },

      // Format output
      { $project: { _id: 0, tag: "$_id", count: 1 } },
    ]);

    return NextResponse.json(tags);
  } catch (error) {
    console.error("[GET /api/users/:id/tags] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user's most used tags" },
      { status: 500 }
    );
  }
}
