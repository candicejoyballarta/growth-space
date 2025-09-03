import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Post } from "@/models/Post";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, props: Params) {
  const params = await props.params;
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const posts = await Post.find({ author: params.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      //   .populate("goal", "title")
      .lean();

    const history = posts.map((post) => ({
      id: post._id,
      content: post.content.slice(0, 100),
      goal: post.goal?.title || "No Goal",
      date: post.createdAt,
    }));

    return NextResponse.json(history);
  } catch (error) {
    console.error("[GET /api/users/:id/reflect-history] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user reflection history" },
      { status: 500 }
    );
  }
}
