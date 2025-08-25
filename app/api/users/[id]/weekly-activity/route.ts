import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Post } from "@/models/Post";
import dayjs from "dayjs";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, props: Params) {
  const params = await props.params;
  try {
    await connectToDB();

    const posts = await Post.find({
      author: params.id,
      createdAt: { $gte: dayjs().subtract(6, "day").toDate() },
    }).lean();

    const activity: { day: string; count: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const day = dayjs().subtract(i, "day").format("ddd");
      const count = posts.filter((p) =>
        dayjs(p.createdAt).isSame(dayjs().subtract(i, "day"), "day")
      ).length;
      activity.push({ day, count });
    }

    return NextResponse.json(activity);
  } catch (error) {
    console.error("[GET /api/users/:id/weekly-activity] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user weekly activity" },
      { status: 500 }
    );
  }
}
