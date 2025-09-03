import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/mongoose";
import { Post } from "@/models/Post";
import { Goal } from "@/models/Goal";
import mongoose from "mongoose";
import dayjs from "dayjs";
import { IUser, User } from "@/models/User";

export async function GET() {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id).lean<IUser>();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    // --- Fetch posts ---
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .lean();

    // --- Total posts ---
    const totalPosts = posts.length;

    // --- Top tags ---
    const tagCounts: Record<string, number> = {};
    posts.forEach((post) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      post.tags.forEach((tag: any) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    // --- Completed goals ---
    const goals = await Goal.find({ user: userId }).lean();
    let totalGoalsCompleted = 0;
    const activeGoals: typeof goals = [];

    goals.forEach((goal) => {
      if (goal.progress === 100) totalGoalsCompleted++;
      if (goal.status === "active") activeGoals.push(goal);
    });

    // --- Reflection history ---
    const reflectHistory = posts
      .map((post) => ({
        id: post._id,
        title: post.title,
        goal: post.goalId ? post.goalId.toString() : "No Goal",
        date: post.createdAt,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

    const stats = [
      { label: "Posts", value: totalPosts },
      { label: "Goals Completed", value: totalGoalsCompleted },
    ];

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        bio: user.bio,
        image: user.image,
        followersCount: user.followers ? user.followers.length : 0,
        followingCount: user.following ? user.following.length : 0,
      },
      stats,
      topTags,
      streak,
      activeGoals,
      reflectHistory,
    });
  } catch (error) {
    console.error("[GET /api/activity] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch insights" },
      { status: 500 }
    );
  }
}
