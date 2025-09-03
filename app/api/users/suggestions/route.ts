import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { IUser, User } from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const currentUser = await User.findById(userId).lean<IUser>();
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const excludeIds = [
      userId,
      ...(currentUser.following?.map((f) => f.toString()) || []),
    ];

    const users = await User.find({ _id: { $nin: excludeIds } })
      .select("name image")
      .limit(3)
      .lean();

    return NextResponse.json(users);
  } catch (err) {
    console.error("[GET /api/users/suggestions] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}
