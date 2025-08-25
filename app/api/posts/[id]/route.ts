import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Post } from "@/models/Post";

interface Params {
  params: { postId: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    await connectToDB();

    const post = await Post.findById(params.postId)
      .populate("author", "username avatar")
      .populate("comments.author", "username");

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("[GET /api/posts/:id] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action, content, userId } = await req.json();

    if (!params.id) {
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    }

    await connectToDB();

    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    switch (action) {
      case "addComment":
        if (!content || !userId) {
          return NextResponse.json(
            { error: "Missing comment content or userId" },
            { status: 400 }
          );
        }
        post.comments.push({
          content,
          author: userId,
          createdAt: new Date(),
        });
        await post.save();
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}
