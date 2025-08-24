import { NextRequest, NextResponse } from "next/server";
import { getPeopleYouMayKnow } from "@/actions/users";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const people = await getPeopleYouMayKnow(userId);
    return NextResponse.json(people);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch people" },
      { status: 500 }
    );
  }
}
