import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Post } from "@/models/Post";
import { IUser, User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mapPosts } from "@/lib/helpers";

export async function GET(req: Request) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id).lean<IUser>();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const followingIds = user.following ?? [];

    const queryIds =
      followingIds.length > 0 ? [user._id, ...followingIds] : [user._id];

    const posts = await Post.find({
      author: { $in: queryIds },
    })
      .populate("author", "name image")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(mapPosts(posts, session.user.id));
  } catch (error) {
    console.error("[GET /api/posts/following] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch following posts" },
      { status: 500 }
    );
  }
}
