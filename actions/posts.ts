"use server";
import { connectToDB } from "@/lib/mongoose";
import { postSchema, PostFormValues } from "@/lib/validators/posts";
import { Post } from "@/models/Post";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export interface PostState {
  success: boolean;
  errors: Partial<Record<keyof PostFormValues, string>>;
  formValues?: Partial<PostFormValues>;
  message?: string;
  data?: PostFormValues;
}

export async function createPost(
  prevState: PostState,
  formData: FormData
): Promise<PostState> {
  const raw = {
    title: formData.get("title")?.toString() ?? "",
    content: formData.get("content")?.toString() ?? "",
    tags: formData.get("tags")
      ? JSON.parse(formData.get("tags") as string)
      : [],
  };

  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const path = issue.path[0];
      if (typeof path === "string") {
        fieldErrors[path] = issue.message;
      }
    });

    return {
      success: false,
      errors: fieldErrors,
      formValues: { title: raw.title, content: raw.content, tags: raw.tags },
      message: "Please correct the errors below.",
    };
  }

  try {
    await connectToDB();
    const session = await getServerSession();

    if (!session || !session.user) throw new Error("Unauthorized");

    const user = await User.findOne({ email: session.user.email });

    const postData: PostFormValues = {
      title: parsed.data.title,
      content: parsed.data.content,
      tags: parsed.data.tags,
    };

    await Post.create({
      ...postData,
      author: user?._id,
    });

    return {
      success: true,
      errors: {},
      formValues: postData,
      data: postData,
      message: "Post created successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create post.",
      errors: {},
      formValues: {
        title: raw.title,
        content: raw.content,
        tags: raw.tags,
      },
    };
  }
}

export async function updatePost(
  prevState: PostState,
  formData: FormData,
  postId: string
): Promise<PostState> {
  const raw = {
    title: formData.get("title")?.toString() ?? "",
    content: formData.get("content")?.toString() ?? "",
    tags: formData.get("tags")
      ? (formData.get("tags") as string).split(",").map((tag) => tag.trim())
      : [],
  };

  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const path = issue.path[0];
      if (typeof path === "string") {
        fieldErrors[path] = issue.message;
      }
    });

    return {
      success: false,
      errors: fieldErrors,
      formValues: { title: raw.title, content: raw.content, tags: raw.tags },
      message: "Please correct the errors below.",
    };
  }

  try {
    await connectToDB();
    const session = await getServerSession();
    if (!session || !session.user) throw new Error("Unauthorized");

    const user = await User.findOne({ email: session.user.email });
    if (!user) throw new Error("User not found");

    const updatedPost: PostFormValues = {
      title: parsed.data.title,
      content: parsed.data.content,
      tags: parsed.data.tags,
    };

    await Post.findOneAndUpdate(
      {
        _id: postId,
        author: user._id,
      },
      {
        ...updatePost,
      }
    );

    revalidatePath("/");

    return {
      success: true,
      errors: {},
      formValues: updatedPost,
      data: updatedPost,
      message: "Post updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to edit post.",
      errors: {},
      formValues: {
        title: raw.title,
        content: raw.content,
        tags: raw.tags,
      },
    };
  }
}

export async function deletePost(prevState: PostState, postId: string) {
  try {
    await connectToDB();
    const session = await getServerSession();
    if (!session || !session.user) throw new Error("Unauthorized");

    const user = await User.findOne({ email: session.user.email });
    if (!user) throw new Error("User not found");

    await Post.findOneAndDelete({ _id: postId, author: user._id });

    revalidatePath("/");

    return {
      success: true,
      errors: {},
      message: "Post deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete post.",
      errors: {},
    };
  }
}

export async function likePost(postId: string) {
  try {
    await connectToDB();
    const session = await getServerSession();

    if (!session || !session.user) throw new Error("Unauthorized");

    const user = await User.findOne({ email: session.user.email });
    if (!user) throw new Error("User not found");

    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    // Toggle like (if already liked, remove it)
    const alreadyLiked = post.likes.includes(user._id);
    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id: string) => id.toString() !== user._id.toString()
      );
    } else {
      post.likes.push(user._id);
    }

    await post.save();

    return {
      success: true,
      message: alreadyLiked ? "Like removed" : "Post liked",
      likesCount: post.likes.length,
    };
  } catch (err) {
    return { success: false, message: "Failed to like post" };
  }
}
