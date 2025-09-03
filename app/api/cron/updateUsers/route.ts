import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { connectToDB } from "@/lib/mongoose";

export async function GET() {
  await connectToDB();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  await User.updateMany(
    { lastLogin: { $lt: sixMonthsAgo } },
    { $set: { status: "inactive" } }
  );

  return NextResponse.json({
    success: true,
    message: "Inactive users updated",
  });
}
