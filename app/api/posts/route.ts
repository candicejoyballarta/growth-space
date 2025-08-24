// app/api/posts/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Post } from "@/models/Post";

export async function GET(req: Request) {
  await connectToDB();
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag");

  let query = {};
  if (tag) {
    query = { tags: tag }; // find posts containing this tag
  }

  const posts = await Post.find(query).sort({ createdAt: -1 });
  return NextResponse.json(posts);
}
