"use server";

import { connectToDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { profileSchema, ProfileFormValues } from "@/lib/validators/profile";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { UpdateUserFormValues, updateUserSchema } from "@/lib/validators/admin";

export interface UpdateProfileState {
  success: boolean;
  message?: string;
  errors: Partial<Record<keyof ProfileFormValues, string>>;
  formValues?: Partial<ProfileFormValues>;
  updatedSession?: Session;
}

export async function updateProfile(
  prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  // Handle optional image upload
  let imageUrl: string | undefined;
  const rawImage = formData.get("image") as File | null;
  if (rawImage && rawImage.size > 0) {
    try {
      imageUrl = await uploadImage(rawImage);
    } catch {
      return {
        success: false,
        message: "Image upload failed.",
        errors: { image: "Failed to upload image" },
        formValues: {
          name: formData.get("name")?.toString() ?? "",
          bio: formData.get("bio")?.toString() ?? "",
        },
      };
    }
  }

  // Handle cover image upload
  let coverImageUrl: string | undefined;
  const rawCover = formData.get("coverImage") as File | null;
  if (rawCover && rawCover.size > 0) {
    try {
      coverImageUrl = await uploadImage(rawCover);
    } catch {
      return {
        success: false,
        message: "Cover image upload failed.",
        errors: { coverImage: "Failed to upload cover image" },
        formValues: {
          name: formData.get("name")?.toString() ?? "",
          bio: formData.get("bio")?.toString() ?? "",
          image: imageUrl,
        },
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentUser: any = await User.findOne({
    email: session.user.email,
  }).lean();

  // Prepare and validate data
  const raw = {
    image: imageUrl || currentUser?.image,
    coverImage: coverImageUrl || currentUser?.coverImage,
    name: formData.get("name")?.toString() ?? "",
    bio: formData.get("bio")?.toString() ?? "",
  };

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: UpdateProfileState["errors"] = {};
    parsed.error.issues.forEach((e) => {
      const key = e.path[0];
      if (typeof key === "string") {
        errors[key as keyof ProfileFormValues] = e.message;
      }
    });

    return {
      success: false,
      message: "Please correct the errors below:",
      errors,
      formValues: { name: raw.name, bio: raw.bio },
    };
  }

  const { name, bio, image, coverImage } = parsed.data;

  // Save changes
  try {
    await connectToDB();
    await User.findOneAndUpdate(
      { email: session.user.email },
      { name, bio, image, coverImage },
      { new: true }
    );

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Profile updated successfully.",
      errors: {},
      formValues: { name, bio, image, coverImage },
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update profile.",
      errors: {},
      formValues: { name, bio, image, coverImage },
    };
  }
}

export interface UpdateProfileState {
  success: boolean;
  message?: string;
  errors: Partial<Record<keyof ProfileFormValues, string>>;
  formValues?: Partial<ProfileFormValues>;
  updatedSession?: Session;
}

export interface UpdateUserState {
  success: boolean;
  message?: string;
  errors: Partial<Record<keyof UpdateUserFormValues, string>>;
  formValues?: Partial<UpdateUserFormValues>;
}

export async function adminUpdateUser(
  prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateUserState> {
  await connectToDB();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const adminUser = await User.findOne({ email: session.user.email });
  if (!adminUser || adminUser.role !== "admin") {
    throw new Error("Forbidden: Admins only");
  }

  // Parse form data
  const raw = {
    id: formData.get("id")?.toString() ?? "",
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    role: formData.get("role")?.toString() ?? "user",
    status: formData.get("status")?.toString() ?? "active",
  };

  const parsed = updateUserSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: UpdateProfileState["errors"] = {};
    parsed.error.issues.forEach((e) => {
      const key = e.path[0];
      if (typeof key === "string") {
        errors[key as keyof ProfileFormValues] = e.message;
      }
    });

    return {
      success: false,
      message: "Please correct the errors below:",
      errors,
      formValues: {
        name: raw.name,
        email: raw.email,
        role:
          raw.role === "admin" || raw.role === "user" ? raw.role : undefined,
        status:
          raw.status === "active" || raw.status === "inactive"
            ? raw.status
            : undefined,
      },
    };
  }

  const { id, name, email, role, status } = parsed.data;

  try {
    await connectToDB();

    await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        role,
        status,
      },
      { new: true }
    );

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User updated successfully.",
      errors: {},
      formValues: {
        name,
        email,
        role,
        status,
      },
    };
  } catch (error) {
    console.error("[updateUser] Error:", error);
    return {
      success: false,
      message: "Failed to update user.",
      errors: {},
      formValues: { name, email, role, status },
    };
  }
}

export interface AdminUserActionState {
  success: boolean;
  message?: string;
  errors: Record<string, string>;
}

export async function adminDeleteUser(
  prevState: AdminUserActionState,
  userId: string
): Promise<AdminUserActionState> {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

    const adminUser = await User.findOne({ email: session.user.email });
    if (!adminUser || adminUser.role !== "admin") {
      throw new Error("Forbidden: Admins only");
    }

    // Prevent admin from deleting themselves accidentally
    if (adminUser._id.toString() === userId) {
      throw new Error("You cannot delete your own account");
    }

    const userToDelete = await User.findById(userId);
    if (!userToDelete) throw new Error("User not found");

    await User.findByIdAndDelete(userId);

    // Optionally revalidate user list page
    revalidatePath("/admin/users");

    return {
      success: true,
      errors: {},
      message: "User deleted successfully.",
    };
  } catch (error) {
    console.error("[deleteUserByAdmin] Error:", error);
    return {
      success: false,
      message: "Failed to delete user.",
      errors: {},
    };
  }
}

export async function adminToggleUserStatus(userId: string) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

    const adminUser = await User.findOne({ email: session.user.email });
    if (!adminUser || adminUser.role !== "admin") {
      throw new Error("Forbidden: Admins only");
    }

    // Prevent admin from deactivating themselves accidentally
    if (adminUser._id.toString() === userId) {
      throw new Error("You cannot delete your own account");
    }

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.status = !user.status;

    await user.save();
    revalidatePath("/");

    return {
      success: true,
      errors: {},
      message: "User status changed successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update user status.",
      errors: {},
    };
  }
}
