"use server";

import { profileSchema, ProfileFormValues } from "@/lib/validators/profile";
import { connectToDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export interface EditProfileState {
  success: boolean;
  message?: string;
  errors: Partial<Record<keyof ProfileFormValues, string>>;
  formValues?: Partial<ProfileFormValues>;
  updatedSession?: Session;
}

export async function editProfile(
  prevState: EditProfileState,
  formData: FormData
): Promise<EditProfileState> {
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
    const errors: EditProfileState["errors"] = {};
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
