import { connectToDB } from "@/lib/mongoose";
import { Comment } from "@/models/Comment";
import { Post } from "@/models/Post";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";

export async function getComments(postId: string) {
  await connectToDB();

  const comments = await Comment.find({ post: postId })
    .populate("author", "name image")
    .sort({ createdAt: -1 })
    .lean();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return comments.map((c: any) => ({
    id: c._id.toString(),
    content: c.content,
    createdAt: c.createdAt,
    author: {
      id: c.author._id.toString(),
      name: c.author.name,
      image: c.author.image,
    },
  }));
}

export async function addComment(postId: string, content: string) {
  try {
    await connectToDB();
    const session = await getServerSession();

    if (!session || !session.user) throw new Error("Unauthorized");

    const user = await User.findOne({ email: session.user.email });
    if (!user) throw new Error("User not found");

    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    const newComment = await Comment.create({
      content,
      author: user._id,
      post: post._id,
    });

    return {
      success: true,
      message: "Comment added",
      comment: {
        id: newComment._id.toString(),
        content: newComment.content,
        author: {
          id: user._id.toString(),
          name: user.name,
          image: user.image,
        },
        createdAt: newComment.createdAt,
      },
    };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Failed to add comment" };
  }
}
