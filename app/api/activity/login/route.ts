import { connectToDB } from "@/lib/mongoose";
import { Activity } from "@/models/Activity";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import { email } from "zod";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();
    const { userId } = body;

    if (!userId)
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const user = await User.findById(userId);

    const activity = await Activity.create({
      user: userId,
      type: "LOGIN",
      metadata: {
        email: user.email,
      },
    });

    return NextResponse.json({ success: true, activity });
  } catch (err) {
    console.error("Login activity error:", err);
    return NextResponse.json(
      { error: "Failed to log activity" },
      { status: 500 }
    );
  }
}
