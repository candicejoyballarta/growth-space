import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Goal } from "@/models/Goal";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, props: Params) {
  const params = await props.params;
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

    const user = await User.findOne({ email: session.user.email });
    if (!user) throw new Error("User not found");

    const goals = await Goal.find({ user: params.id })
      .sort({ createdAt: -1 })
      .populate("user", "name image")
      .lean();

    return NextResponse.json(goals);
  } catch (error) {
    console.error("[GET /api/users/:id/goals] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user goals" },
      { status: 500 }
    );
  }
}
