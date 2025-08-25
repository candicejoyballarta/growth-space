"use server";

import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/mongoose";
import {
  GoalFormValues,
  goalSchema,
  UpdateGoalFormValues,
} from "@/lib/validators/goals";
import { Goal } from "@/models/Goal";
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
    };

    await Goal.create({
      ...goalData,
      user: user?._id,
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
