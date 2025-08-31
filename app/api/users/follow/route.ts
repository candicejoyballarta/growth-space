import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { followerId, followeeId } = await req.json();
    if (!followerId || !followeeId) {
      return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
    }

    await connectToDB();

    const user = await User.findById(followerId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isAlreadyFollowing = user.following.includes(followeeId);

    if (isAlreadyFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(followerId, {
        $pull: { following: followeeId },
      });

      await User.findByIdAndUpdate(followeeId, {
        $pull: { followers: followerId },
      });

      return NextResponse.json({
        success: true,
        action: "unfollowed",
        message: "User successfully unfollowed",
      });
    } else {
      // Follow
      await User.findByIdAndUpdate(followerId, {
        $addToSet: { following: followeeId },
      });

      await User.findByIdAndUpdate(followeeId, {
        $addToSet: { followers: followerId },
      });

      return NextResponse.json({
        success: true,
        action: "followed",
        message: "User successfully followed",
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update follow status" },
      { status: 500 }
    );
  }
}
