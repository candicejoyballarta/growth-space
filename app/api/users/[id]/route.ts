import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { Post } from "@/models/Post";
import { mapPost, mapPosts } from "@/lib/helpers";
import { Goal } from "@/models/Goal";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, props: Params) {
  const params = await props.params;
  try {
    await connectToDB();

    const userInfo = await User.findById(params.id).lean();
    if (!userInfo) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userPosts = await Post.find({ author: params.id })
      .sort({ createdAt: -1 })
      .populate("author", "name image")
      .populate({
        path: "goalId",
        select: "title progress color emoji",
        model: Goal,
      })
      .lean();

    const mappedPosts = mapPosts(userPosts, params.id);

    return NextResponse.json({ user: userInfo, posts: mappedPosts });
  } catch (err) {
    console.error("[GET /api/users/:id] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, props: Params) {
  const params = await props.params;
  try {
    await connectToDB();
    const body = await req.json();
    const { name, email, role = "user", status = "active" } = body;

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      { name, email, role, status },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser.toObject(), { status: 200 });
  } catch (err) {
    console.error("[PUT /api/users/:id] Error:", err);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, props: Params) {
  const params = await props.params;
  try {
    await connectToDB();

    const deletedUser = await User.findByIdAndDelete(params.id).lean();
    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(deletedUser, { status: 200 });
  } catch (err) {
    console.error("[DELETE /api/users/:id] Error:", err);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
