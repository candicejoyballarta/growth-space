// app/api/users/onboarding/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/mongoose";
import { User } from "@/models/User";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    const { growthAreas, intentions } = await req.json();

    await User.findByIdAndUpdate(session.user.id, {
      growthAreas,
      intentions,
      onboardingComplete: true,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Onboarding PATCH]", err);
    return NextResponse.json(
      { error: "Failed to update onboarding" },
      { status: 500 }
    );
  }
}
