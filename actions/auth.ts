"use server";

import bcrypt from "bcryptjs";
import { loginSchema, LoginFormValues } from "@/lib/validators/login";
import { signupSchema, SignupFormValues } from "@/lib/validators/signup";
import { connectToDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { Activity } from "@/models/Activity";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar: "/profile.jpg",
      coverImage: "/default-cover.jpg",
    });

    await Activity.create({
      user: user._id,
      type: "SIGNUP",
      metadata: {
        email: email,
      },
    });

    return {
      success: true,
      message: "🎉 Account created successfully! You can now log in.",
      errors: {},
      formValues: { email, password },
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updatePassword(prevState: any, formData: FormData) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized",
        errors: {},
      };
    }

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || password.length < 8) {
      return {
        success: false,
        message: "Password must be at least 8 characters long.",
        errors: { password: "Too short" },
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        message: "Passwords do not match.",
        errors: { confirmPassword: "Does not match" },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { email: session.user.email },
      { password: hashedPassword }
    );

    return {
      success: true,
      message: "Password updated successfully.",
      errors: {},
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Failed to update password.",
      errors: {},
    };
  }
}
