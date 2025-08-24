import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDB } from "@/lib/mongoose";
import { Comment } from "@/models/Comment";
import { User } from "@/models/User";

export async function GET(
  req: Request,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    await connectToDB();

    const { postId } = await context.params;

    const comments = await Comment.find({ post: postId })
      .populate("author", "name image")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      comments.map((c) => ({
        id: c._id.toString(),
        content: c.content,
        author: {
          id: c.author._id.toString(),
          name: c.author.name,
          image: c.author.image,
        },
        createdAt: c.createdAt,
      }))
    );
  } catch (err) {
    console.error("getComments error", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    await connectToDB();
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const { content } = await req.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Content required" },
        { status: 400 }
      );
    }

    const newComment = await Comment.create({
      content,
      author: user._id,
      post: params.postId,
    });

    await newComment.populate("author", "name image");

    return NextResponse.json({
      success: true,
      comment: {
        id: newComment._id.toString(),
        content: newComment.content,
        author: {
          id: newComment.author._id.toString(),
          name: newComment.author.name,
          image: newComment.author.image,
        },
        createdAt: newComment.createdAt,
      },
    });
  } catch (err) {
    console.error("addComment error", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
