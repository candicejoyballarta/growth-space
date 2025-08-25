import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Post } from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mapPosts } from "@/lib/helpers";

interface Params {
  params: { tag: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    const skip = (page - 1) * limit;

    const posts = await Post.find({ tags: params.tag })
      .sort({ createdAt: -1 })
      .populate("author", "name image")
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments({ tags: params.tag });

    return NextResponse.json({
      data: mapPosts(posts, session.user.id),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/posts/tags/:tag] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts by tag" },
      { status: 500 }
    );
  }
}
