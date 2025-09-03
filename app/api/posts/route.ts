import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Post } from "@/models/Post";
import { Goal } from "@/models/Goal";
import { mapPosts } from "@/lib/helpers";

export async function GET(req: Request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tag");
    const author = searchParams.get("author");
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (tag) query.tags = tag;
    if (author) query.author = author;

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch posts
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name image")
      .populate({
        path: "goalId",
        select: "title progress color emoji",
        model: Goal,
      })
      .lean();

    const total = await Post.countDocuments(query);

    return NextResponse.json({
      data: posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/posts] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
