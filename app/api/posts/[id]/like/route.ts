import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { Post } from "@/models/Post";

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

    const post = await Post.findById(params.postId);
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    const alreadyLiked = post.likes.includes(user._id);
    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id: string) => id.toString() !== user._id.toString()
      );
    } else {
      post.likes.push(user._id);
    }

    await post.save();

    return NextResponse.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });
  } catch (err) {
    console.error("likePost error", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
