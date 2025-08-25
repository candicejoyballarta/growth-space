import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Post } from "@/models/Post";

interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: params.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments({ author: params.id });

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
    console.error("[GET /api/users/:id/posts] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user posts" },
      { status: 500 }
    );
  }
}
