import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Goal } from "@/models/Goal";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, props: Params) {
  const params = await props.params;
  try {
    await connectToDB();

    const goals = await Goal.find({ user: params.id })
      .sort({ createdAt: -1 })
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
