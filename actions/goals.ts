"use server";

import { authOptions } from "@/lib/auth";
import { toPlainObject } from "@/lib/helpers";
import { connectToDB } from "@/lib/mongoose";
import {
  GoalFormValues,
  goalSchema,
  UpdateGoalFormValues,
} from "@/lib/validators/goals";
import { Activity } from "@/models/Activity";
import { Goal, IMilestone } from "@/models/Goal";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export interface GoalState {
  success: boolean;
  errors: Partial<Record<keyof GoalFormValues, string>>;
  formValues?: Partial<GoalFormValues>;
  message?: string;
  data?: GoalFormValues;
}

export async function createGoal(
  prevState: GoalState,
  formData: FormData
): Promise<GoalState> {
  const raw = {
    title: formData.get("title")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    color: formData.get("color")?.toString() ?? "#000000",
    emoji: formData.get("emoji")?.toString() ?? "⭐",
  };

  const parsed = goalSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const path = issue.path[0];
      if (typeof path === "string") {
        fieldErrors[path] = issue.message;
      }
    });

    return {
      success: false,
      errors: fieldErrors,
      formValues: {
        title: raw.title,
        description: raw.description,
        color: raw.color,
        emoji: raw.emoji,
      },
      message: "Please correct the errors below.",
    };
  }

  try {
    await connectToDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

    const user = await User.findOne({ email: session.user.email });

    const goalData: GoalFormValues = {
      title: parsed.data.title,
      description: parsed.data.description,
      color: parsed.data.color,
      emoji: parsed.data.emoji,
    };

    const goal = await Goal.create({
      ...goalData,
      user: user?._id,
    });

    await Activity.create({
      user: user._id,
      type: "GOAL_CREATED",
      metadata: { goalId: goal._id, title: goal.title },
    });

    return {
      success: true,
      errors: {},
      formValues: goalData,
      data: goalData,
      message: "Goal created successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create post.",
      errors: {},
      formValues: {
        title: raw.title,
        description: raw.description,
        color: raw.color,
        emoji: raw.emoji,
      },
    };
  }
}

export interface UpdateGoalState {
  success: boolean;
  errors: Partial<Record<keyof UpdateGoalFormValues, string>>;
  formValues?: Partial<UpdateGoalFormValues>;
  message?: string;
  data?: GoalFormValues;
}

export async function updateGoal(
  prevState: UpdateGoalState,
  formData: FormData
): Promise<UpdateGoalState> {
  const goalId = formData.get("goalId") as string;
  const raw = {
    title: formData.get("title")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    color: formData.get("color")?.toString() ?? "#000000",
    emoji: formData.get("emoji")?.toString() ?? "⭐",
  };

  const parsed = goalSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const path = issue.path[0];
      if (typeof path === "string") {
        fieldErrors[path] = issue.message;
      }
    });

    return {
      success: false,
      errors: fieldErrors,
      formValues: {
        title: raw.title,
        description: raw.description,
        color: raw.color,
        goalId: goalId,
      },
      message: "Please correct the errors below.",
    };
  }

  try {
    await connectToDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

    const user = await User.findOne({ email: session.user.email });
    if (!user) throw new Error("User not found");

    const updatedGoal: GoalFormValues = {
      title: parsed.data.title,
      description: parsed.data.description,
      color: parsed.data.color,
      emoji: parsed.data.emoji,
    };

    await Goal.findOneAndUpdate(
      {
        _id: goalId,
        user: user._id,
      },
      {
        ...updatedGoal,
      }
    );

    revalidatePath("/");

    return {
      success: true,
      errors: {},
      formValues: updatedGoal,
      data: updatedGoal,
      message: "Goal updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to edit goal.",
      errors: {},
      formValues: {
        title: raw.title,
        description: raw.description,
        color: raw.color,
        emoji: raw.emoji,
      },
    };
  }
}

export async function deletePost(prevState: GoalState, goalId: string) {
  try {
    await connectToDB();
    const session = await getServerSession();
    if (!session || !session.user) throw new Error("Unauthorized");

    const user = await User.findOne({ email: session.user.email });
    if (!user) throw new Error("User not found");

    await Goal.findOneAndDelete({ _id: goalId, user: user._id });

    revalidatePath("/");

    return {
      success: true,
      errors: {},
      message: "Goal deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete goal.",
      errors: {},
    };
  }
}

export async function toggleGoalStatus(goalId: string) {
  await connectToDB();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const goal = await Goal.findById(goalId);
  if (!goal) throw new Error("Goal not found");

  goal.status = goal.status === "active" ? "archived" : "active";

  if (goal.status === "active") {
    goal.completedAt = undefined; // reset if reopening
  }

  await goal.save();
  revalidatePath("/");

  return {
    success: true,
    message: "Goal status updated.",
  };
}

export async function addMilestone(
  goalId: string,
  title: string,
  dueDate?: Date
) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

    const goal = await Goal.findById(goalId);
    if (!goal) throw new Error("Goal not found");

    goal.milestones.push({
      title,
      dueDate,
      completed: false,
      completedAt: undefined,
    });

    await goal.save();
    revalidatePath("/");

    return {
      success: true,
      message: "Milestone added.",
      goal: toPlainObject(goal),
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to add milestone.",
      errors: {},
    };
  }
}

export async function toggleMilestoneCompletion(
  goalId: string,
  milestoneId: string
) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

    const user = await User.findOne({ email: session.user.email });
    if (!user) throw new Error("User not found");

    const goal = await Goal.findById(goalId);
    if (!goal) throw new Error("Goal not found");

    const milestone = goal.milestones.id(milestoneId);
    if (!milestone) throw new Error("Milestone not found");

    milestone.completed = !milestone.completed;
    milestone.completedAt = milestone.completed ? new Date() : undefined;

    if (milestone.completed) {
      user.streak = (user.streak || 0) + 1;
    } else {
      user.streak = Math.max((user.streak || 0) - 1, 0);
    }

    const allCompleted =
      goal.milestones.length > 0 &&
      goal.milestones.every((m: IMilestone) => m.completed);

    goal.completedAt = allCompleted ? new Date() : undefined;
    goal.status = allCompleted ? "completed" : goal.status;

    await Promise.all([goal.save(), user.save()]);
    revalidatePath("/");

    return {
      success: true,
      message: "Milestone status updated.",
      goal: toPlainObject(goal),
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update milestone.",
      errors: {},
    };
  }
}
