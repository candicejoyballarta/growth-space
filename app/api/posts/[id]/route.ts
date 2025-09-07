import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Goal } from "@/models/Goal";
import { User } from "@/models/User";
import { Post } from "@/models/Post";
import { mapPost } from "@/lib/helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface IAuthor {
  _id: string;
  name: string;
  image: string;
}

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, props: Params) {
  const params = await props.params;
  const postId = params.id;
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await Post.findById(postId)
      .populate("author", "name image")
      .populate({
        path: "goalId",
        select: "title progress color emoji",
        model: Goal,
      });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(mapPost(post, session.user.id));
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
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const postId = params.id;
    const { action, content, userId, commentId } = await req.json();

    if (!postId)
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });

    await connectToDB();

    const post = await Post.findById(postId).populate("author", "name image");
    if (!post)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    switch (action) {
      case "addComment":
        if (!content || !userId)
          return NextResponse.json(
            { error: "Missing content or userId" },
            { status: 400 }
          );

        const user = await User.findById(userId).lean<IAuthor>();
        if (!user)
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );

        const newComment = {
          content,
          author: {
            _id: user._id,
            name: user.name,
            image: user.image || "/profile.jpg",
          },
          createdAt: new Date(),
        };

        post.comments.push(newComment);
        await post.save();

        return NextResponse.json({ success: true, comment: newComment });

      case "deleteComment":
        if (!commentId || !userId)
          return NextResponse.json(
            { error: "Missing commentId" },
            { status: 400 }
          );

        post.comments = post.comments.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (c: any) =>
            !(
              c._id.toString() === commentId &&
              c.author._id.toString() === userId
            )
        );

        await post.save();
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, props: Params) {
  const params = await props.params;
  const postId = params.id;

  try {
    await connectToDB();

    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("[DELETE /api/posts/:id] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
