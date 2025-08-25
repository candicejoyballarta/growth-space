import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { User } from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const role = searchParams.get("role");
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (name) query.name = name;
    if (email) query.email = email;
    if (role) query.role = role;

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch users
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(query);

    return NextResponse.json({
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/users] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
