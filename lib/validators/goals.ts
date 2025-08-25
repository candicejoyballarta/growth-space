import { z } from "zod";

export const goalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i, {
    message:
      "Invalid color format. Must be a 7-character hex code (e.g., #RRGGBB).",
  }),
});

export type GoalFormValues = z.infer<typeof goalSchema>;

export const updateGoalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i, {
    message:
      "Invalid color format. Must be a 7-character hex code (e.g., #RRGGBB).",
  }),
  goalId: z.string().min(1, "Goal ID is required"),
});

export type UpdateGoalFormValues = z.infer<typeof updateGoalSchema>;
