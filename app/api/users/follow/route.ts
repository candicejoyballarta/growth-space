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

    await User.findByIdAndUpdate(followerId, {
      $addToSet: { following: followeeId },
    });

    await User.findByIdAndUpdate(followeeId, {
      $addToSet: { followers: followerId },
    });

    return NextResponse.json({
      success: true,
      message: "User successfully followed",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to follow user" },
      { status: 500 }
    );
  }
}
