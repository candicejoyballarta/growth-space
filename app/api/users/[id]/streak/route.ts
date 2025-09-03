import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Post } from "@/models/Post";
import dayjs from "dayjs";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, props: Params) {
  const params = await props.params;
  try {
    await connectToDB();

    const posts = await Post.find({
      author: params.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    let streak = 0;
    let today = dayjs().startOf("day");

    for (const post of posts) {
      const postDate = dayjs(post.createdAt).startOf("day");
      if (postDate.isSame(today)) {
        streak++;
        today = today.subtract(1, "day");
      } else if (postDate.isBefore(today)) {
        break;
      }
    }

    return NextResponse.json(streak);
  } catch (error) {
    console.error("[GET /api/users/:id/streak] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user streak" },
      { status: 500 }
    );
  }
}
