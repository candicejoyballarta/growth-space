import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()).optional(),
});

export type PostFormValues = z.infer<typeof postSchema>;
