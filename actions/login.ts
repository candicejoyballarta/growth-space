"use server";

import { loginSchema, LoginFormValues } from "@/lib/validators/login";

export interface LoginState {
  success: boolean;
  errors: Partial<Record<keyof LoginFormValues, string>>;
  formValues?: Partial<LoginFormValues>;
  message?: string;
  data?: LoginFormValues;
}

export async function login(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const raw = {
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
  };

  const parsed = loginSchema.safeParse(raw);
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
      formValues: { email: raw.email?.toString() },
      message: "Please correct the errors below.",
    };
  }

  return {
    success: true,
    errors: {},
    formValues: { email: parsed.data.email },
    data: parsed.data,
  };
}
