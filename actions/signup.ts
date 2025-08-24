"use server";

import { signupSchema, SignupFormValues } from "@/lib/validators/signup";
import { connectToDB } from "@/lib/mongoose";
import bcrypt from "bcryptjs";
import { User } from "@/models/User";

export interface SignupState {
  success: boolean;
  message?: string;
  errors: Partial<Record<keyof SignupFormValues, string>>;
  formValues?: Partial<SignupFormValues>;
}

export async function signup(
  prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const raw = {
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: SignupState["errors"] = {};
    parsed.error.issues.forEach((e) => {
      const key = e.path[0];
      if (typeof key === "string")
        errors[key as keyof SignupFormValues] = e.message;
    });

    return {
      success: false,
      message: "Please correct the errors below.",
      errors,
      formValues: { name: raw.name, email: raw.email },
    };
  }

  const { name, email, password } = parsed.data;

  try {
    await connectToDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return {
        success: false,
        message: "Email already in use.",
        errors: { email: "This email is already registered." },
        formValues: { name, email },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      avatar: "/profile.jpg",
      coverImage: "/default-cover.jpg",
    });

    return {
      success: true,
      message: "🎉 Account created successfully! You can now log in.",
      errors: {},
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
      errors: {},
    };
  }
}
