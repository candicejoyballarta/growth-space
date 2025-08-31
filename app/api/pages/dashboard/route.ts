import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { IUser, User } from "@/models/User";
import { Post } from "@/models/Post";
import { Goal } from "@/models/Goal";
import { mapPosts } from "@/lib/helpers";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "Asia/Manila";

export async function GET(req: Request) {
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

    const followingIds = user.following ?? [];

    const queryIds =
      followingIds.length > 0 ? [user._id, ...followingIds] : [user._id];

    const following = await Post.find({
      author: { $in: queryIds },
    })
      .populate("author", "_id name image")
      .populate({
        path: "goalId",
        select: "title progress color emoji",
        model: Goal,
      })
      .sort({ createdAt: -1 })
      .lean();

    const mappedFollowingPosts = mapPosts(following, session.user.id);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const trendingPosts = await Post.find({ createdAt: { $gte: oneWeekAgo } })
      .sort({ likes: -1 })
      .populate("author", "name image")
      .populate({
        path: "goalId",
        select: "title progress color emoji",
        model: Goal,
      })
      .limit(10)
      .lean();

    const mappedTrendingPosts = mapPosts(trendingPosts, session.user.id);

    const posts = await Post.find({
      author: user._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    let streak = 0;
    let hasPostedToday = false;

    const today = dayjs().startOf("day");
    const yesterday = today.subtract(1, "day");

    hasPostedToday = posts.some((p) =>
      dayjs(p.createdAt).startOf("day").isSame(today)
    );

    let pointer: dayjs.Dayjs | null = null;

    if (hasPostedToday) {
      pointer = today;
    } else if (
      posts.some((p) => dayjs(p.createdAt).startOf("day").isSame(yesterday))
    ) {
      pointer = yesterday;
    } else {
      streak = 0; // no streak
    }

    if (pointer) {
      for (const post of posts) {
        const postDate = dayjs(post.createdAt).startOf("day");

        if (postDate.isSame(pointer)) {
          streak++;
          pointer = pointer.subtract(1, "day");
        } else if (postDate.isBefore(pointer)) {
          // missed a day → streak ends
          break;
        }
      }
    }

    const dashboardData = {
      user: {
        id: user._id,
        name: user.name,
        bio: user.bio,
        image: user.image,
        followersCount: user.followers ? user.followers.length : 0,
        followingCount: user.following ? user.following.length : 0,
      },
      followingPosts: mappedFollowingPosts,
      trendingPosts: mappedTrendingPosts,
      streak,
      hasPostedToday,
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("[GET /api/pages/dashboard] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
