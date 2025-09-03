import { NextResponse } from "next/server";
import { Post } from "@/models/Post";
import { connectToDB } from "@/lib/mongoose";

export async function GET() {
  try {
    await connectToDB();

    const post = await Post.aggregate([
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" },
        },
      },
      {
        $addFields: {
          popularity: { $add: ["$likesCount", "$commentsCount"] },
        },
      },
      {
        $sort: { popularity: -1, createdAt: -1 },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $limit: 1 },
    ]);

    if (!post || post.length === 0) {
      return NextResponse.json({ message: "No posts found" }, { status: 404 });
    }

    return NextResponse.json(post[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching hightlight post:", error);
    return NextResponse.json(
      { message: "Failed to fetch highlight post" },
      { status: 500 }
    );
  }
}
