import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { Goal } from "@/models/Goal";
import { Post } from "@/models/Post";

export async function GET() {
  try {
    await connectToDB();

    // Total users
    const totalUsers = await User.countDocuments();

    // Active vs Archived vs Completed goals
    const goalStats = await Goal.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Posts per day (last 7 days)
    const postsPerDay = await Post.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 7 },
    ]);

    // Top users by completed goals (monthly)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const topUsersByCompletedGoals = await Goal.aggregate([
      {
        $match: {
          status: "completed",
          completedAt: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: "$user",
          completedCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 0,
          userId: "$userInfo._id",
          name: "$userInfo.name",
          email: "$userInfo.email",
          completedCount: 1,
        },
      },
      { $sort: { completedCount: -1 } },
      { $limit: 5 },
    ]);

    return NextResponse.json({
      totalUsers,
      goalStats,
      postsPerDay,
      topUsersByCompletedGoals,
    });
  } catch (err) {
    console.error("[GET /api/admin/analytics] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
