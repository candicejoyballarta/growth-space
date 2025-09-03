import { z } from "zod";

export const updateUserSchema = z.object({
  id: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || val.length > 0, "Invalid goal ID"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["user", "admin"]).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["user", "admin"]).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
