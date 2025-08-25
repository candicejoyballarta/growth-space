import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Goal } from "@/models/Goal";

export async function GET(req: Request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const user = searchParams.get("user");
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (user) query.user = user;

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch posts
    const goals = await Goal.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name image")
      .lean();

    const total = await Goal.countDocuments(query);

    return NextResponse.json({
      data: goals,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/goals] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}
