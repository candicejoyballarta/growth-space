import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isoWeek from "dayjs/plugin/isoWeek";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(utc);
dayjs.extend(isoWeek);
dayjs.extend(isBetween);

import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/mongoose";
import { Goal, IMilestone } from "@/models/Goal";
import { Post } from "@/models/Post";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { IUser, User } from "@/models/User";

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

    const startOfWeek = dayjs().utc().startOf("isoWeek");
    const endOfWeek = dayjs().utc().endOf("isoWeek");

    const posts = await Post.find({
      author: user._id,
      createdAt: { $gte: startOfWeek, $lte: endOfWeek },
    }).lean();

    // --- Fetch milestones completed this week ---
    const goals = await Goal.find({
      user: user._id,
      "milestones.completedAt": {
        $gte: startOfWeek.toDate(),
        $lte: endOfWeek.toDate(),
      },
    }).lean();

    const milestoneEvents: { completedAt: Date }[] = [];
    goals.forEach((goal) => {
      goal.milestones.forEach((m: IMilestone) => {
        if (
          m.completedAt &&
          dayjs(m.completedAt).isBetween(startOfWeek, endOfWeek, "day", "[]")
        ) {
          milestoneEvents.push({ completedAt: m.completedAt });
        }
      });
    });

    const days: Date[] = [];
    let current = startOfWeek.clone();
    while (current.isBefore(endOfWeek) || current.isSame(endOfWeek, "day")) {
      days.push(current.toDate());
      current = current.add(1, "day");
    }

    const data = days.map((day) => ({
      day: dayjs(day).format("ddd"),
      posts: 0,
      milestones: 0,
    }));

    // --- Count posts per day ---
    posts.forEach((post) => {
      const dayIndex = dayjs(post.createdAt).utc().isoWeekday() - 1;
      data[dayIndex].posts += 1;
    });

    // --- Count milestones per day ---
    milestoneEvents.forEach((m) => {
      const dayIndex = dayjs(m.completedAt).utc().isoWeekday() - 1;
      data[dayIndex].milestones += 1;
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/weekly-activity] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weekly activity" },
      { status: 500 }
    );
  }
}
