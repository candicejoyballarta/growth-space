import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Post } from "@/models/Post";
import { mapPosts } from "@/lib/helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const posts = await Post.find({ createdAt: { $gte: oneWeekAgo } })
      .sort({ likes: -1 })
      .populate("author", "name image")
      .limit(10)
      .lean();

    const mappedPosts = mapPosts(posts, session.user.id);

    return NextResponse.json(mappedPosts);
  } catch (error) {
    console.error("[GET /api/posts/trending] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending posts" },
      { status: 500 }
    );
  }
}
