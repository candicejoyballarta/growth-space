import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Post } from "@/models/Post";

export async function GET() {
  try {
    await connectToDB();

    const tags = await Post.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $project: { _id: 0, tag: "$_id", count: 1 } },
      { $sort: { count: -1 } },
      { $limit: 7 },
    ]);

    return NextResponse.json(tags);
  } catch (error) {
    console.error("[GET /api/tags/popular] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular tags" },
      { status: 500 }
    );
  }
}
