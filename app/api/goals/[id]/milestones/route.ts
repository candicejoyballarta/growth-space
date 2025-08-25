import { NextResponse } from "next/server";
import { Goal } from "@/models/Goal";
import { connectToDB } from "@/lib/mongoose";

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { title, description, dueDate } = await req.json();
    if (!title)
      return NextResponse.json({ error: "Title required" }, { status: 400 });

    await connectToDB();
    const goal = await Goal.findById(params.id);
    if (!goal)
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });

    goal.milestones.push({ title, description, dueDate });
    await goal.save();

    return NextResponse.json({ success: true, milestones: goal.milestones });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to add milestone" },
      { status: 500 }
    );
  }
}
