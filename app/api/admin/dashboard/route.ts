import { connectToDB } from "@/lib/mongoose";
import { IUser, User } from "@/models/User";
import { Goal } from "@/models/Goal";
import { Activity } from "@/models/Activity";
import { NextResponse } from "next/server";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id).lean<IUser>();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = dayjs();

    // --- Total active users & % change ---
    const totalUsers = await User.countDocuments({ status: "active" });
    const prevMonthUsers = await User.countDocuments({
      status: "active",
      createdAt: {
        $gte: now.subtract(1, "month").startOf("month").toDate(),
        $lte: now.subtract(1, "month").endOf("month").toDate(),
      },
    });
    const totalUsersChange =
      prevMonthUsers === 0
        ? "+100%"
        : `${(((totalUsers - prevMonthUsers) / prevMonthUsers) * 100).toFixed(
            1
          )}%`;

    // --- Total goals completed & % change ---
    const totalGoalsCompleted = await Goal.countDocuments({
      status: "completed",
    });
    const prevGoalsCompleted = await Goal.countDocuments({
      status: "completed",
      completedAt: {
        $gte: now.subtract(1, "month").startOf("month").toDate(),
        $lte: now.subtract(1, "month").endOf("month").toDate(),
      },
    });
    const totalGoalsChange =
      prevGoalsCompleted === 0
        ? "+100%"
        : `${(
            ((totalGoalsCompleted - prevGoalsCompleted) / prevGoalsCompleted) *
            100
          ).toFixed(1)}%`;

    // --- Average streak & % change ---
    const usersThisMonth = await User.find({
      createdAt: { $gte: now.startOf("month").toDate() },
    });

    const usersPrevMonth = await User.find({
      createdAt: {
        $gte: now.subtract(1, "month").startOf("month").toDate(),
        $lte: now.subtract(1, "month").endOf("month").toDate(),
      },
    });

    // Current month average streak
    const avgStreak =
      usersThisMonth.reduce((acc, u) => acc + (u.streak || 0), 0) /
        (usersThisMonth.length || 1) || 0;

    // Previous month average streak
    const avgStreakPrev =
      usersPrevMonth.reduce((acc, u) => acc + (u.streak || 0), 0) /
        (usersPrevMonth.length || 1) || 0;

    // Percentage change
    const avgStreakChange =
      avgStreakPrev === 0
        ? "+100%"
        : `${(((avgStreak - avgStreakPrev) / avgStreakPrev) * 100).toFixed(
            1
          )}%`;

    // --- New signups this month & % change ---
    const newSignups = await User.countDocuments({
      createdAt: { $gte: now.startOf("month").toDate() },
    });
    const prevMonthSignups = await User.countDocuments({
      createdAt: {
        $gte: now.subtract(1, "month").startOf("month").toDate(),
        $lte: now.subtract(1, "month").endOf("month").toDate(),
      },
    });
    const newSignupsChange =
      prevMonthSignups === 0
        ? "+100%"
        : `${(
            ((newSignups - prevMonthSignups) / prevMonthSignups) *
            100
          ).toFixed(1)}%`;

    // --- Line chart: last 6 months ---
    const lineData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = now.subtract(i, "month").startOf("month").toDate();
      const monthEnd = now.subtract(i, "month").endOf("month").toDate();
      const count = await User.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd },
      });
      lineData.push({
        month: dayjs(monthStart).format("MMM"),
        users: count,
      });
    }

    // --- Pie chart: goals by growth area ---
    const growthOptions = [
      { name: "Health", emoji: "💪" },
      { name: "Career", emoji: "💼" },
      { name: "Relationships", emoji: "❤️" },
      { name: "Mindfulness", emoji: "🧘‍♀️" },
      { name: "Learning", emoji: "📚" },
      { name: "Personal Finance", emoji: "💰" },
      { name: "Creativity", emoji: "🎨" },
      { name: "Fitness", emoji: "🏃‍♂️" },
      { name: "Self-Care", emoji: "🛀" },
    ];

    // Aggregate counts for each growth area
    const pieDataRaw = await User.aggregate([
      { $unwind: "$growthAreas" },
      { $group: { _id: "$growthAreas", count: { $sum: 1 } } },
    ]);

    // Map to full growthOptions to ensure missing categories show as 0
    const pieData = growthOptions.map((opt) => {
      const found = pieDataRaw.find((d) => d._id === opt.name);
      return {
        name: opt.name,
        emoji: opt.emoji,
        value: found ? found.count : 0,
      };
    });

    // --- Recent activities ---
    const activities = await Activity.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    // --- Top users by goals completed ---
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const startOfLastMonth = new Date(startOfMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    const endOfLastMonth = new Date(startOfMonth);

    // Aggregate goals for this month
    const thisMonthGoals = await Goal.aggregate([
      {
        $match: {
          status: "completed",
          completedAt: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      { $group: { _id: "$user", count: { $sum: 1 } } },
    ]);

    // Aggregate goals for last month
    const lastMonthGoals = await Goal.aggregate([
      {
        $match: {
          status: "completed",
          completedAt: { $gte: startOfLastMonth, $lt: endOfLastMonth },
        },
      },
      { $group: { _id: "$user", count: { $sum: 1 } } },
    ]);

    // Convert last month goals to map for quick lookup
    const lastMonthMap = new Map(
      lastMonthGoals.map((u) => [u._id.toString(), u.count])
    );

    // Join with user info and compute trend
    const topUsers = await Goal.aggregate([
      {
        $match: {
          status: "completed",
          completedAt: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      { $group: { _id: "$user", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
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
          user: "$userInfo.name",
          count: 1,
          trend: {
            $let: {
              vars: {
                lastCount: { $literal: 0 },
              },
              in: "▲", // temporary
            },
          },
        },
      },
    ]);

    const topUsersWithTrend = topUsers.map((u) => {
      const lastCount = lastMonthMap.get(u._id?.toString() ?? "") || 0;
      let trend: "▲" | "▼" | "=" = "=";
      if (u.count > lastCount) trend = "▲";
      else if (u.count < lastCount) trend = "▼";
      return { ...u, trend };
    });

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        image: user.image,
      },
      kpis: {
        totalUsers,
        totalUsersChange,
        totalGoalsCompleted,
        totalGoalsChange,
        avgStreak,
        avgStreakChange,
        newSignups,
        newSignupsChange,
      },
      lineData,
      pieData,
      activities,
      topUsers: topUsersWithTrend,
    });
  } catch (err) {
    console.error("[GET /api/admin/dashboard]", err);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
