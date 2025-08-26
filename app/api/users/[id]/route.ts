import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { Post } from "@/models/Post";
import { mapPost, mapPosts } from "@/lib/helpers";
import { Goal } from "@/models/Goal";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, props: Params) {
  const params = await props.params;
  try {
    await connectToDB();

    const userInfo = await User.findById(params.id).lean();
    if (!userInfo) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userPosts = await Post.find({ author: params.id })
      .sort({ createdAt: -1 })
      .populate("author", "name image")
      .populate({
        path: "goalId",
        select: "title progress color emoji",
        model: Goal,
      })
      .lean();

    const mappedPosts = mapPosts(userPosts, params.id);

    return NextResponse.json({ user: userInfo, posts: mappedPosts });
  } catch (err) {
    console.error("[GET /api/users/:id] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
