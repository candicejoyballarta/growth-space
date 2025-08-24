import { z } from "zod";

export const profileSchema = z.object({
  image: z.string().optional(),
  coverImage: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
