import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { Post } from "@/models/Post";
import { mapPost, mapPosts } from "@/lib/helpers";

interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    await connectToDB();

    const userInfo = await User.findById(params.id).lean();
    if (!userInfo) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userPosts = await Post.find({ author: params.id })
      .sort({ createdAt: -1 })
      .populate("author", "name image")
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
