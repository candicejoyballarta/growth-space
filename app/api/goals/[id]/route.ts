import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Goal } from "@/models/Goal";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/models/User";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, props: Params) {
  const params = await props.params;
  const goalId = params.id;
  try {
    await connectToDB();

    const post = await Goal.findById(goalId).populate("user", "name image");

    if (!post) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("[GET /api/goals/:id] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch goal" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, props: Params) {
  const params = await props.params;
  const goalId = params.id;
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const deletedGoal = await Goal.findOneAndDelete({
      _id: goalId,
      user: user._id,
    });

    if (!deletedGoal) {
      return NextResponse.json(
        { success: false, message: "Goal not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Goal deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE /api/goals/:id] Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete goal" },
      { status: 500 }
    );
  }
}
