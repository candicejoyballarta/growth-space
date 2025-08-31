"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader2, Pencil } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSession } from "next-auth/react";
import { useGetUser } from "@/hooks/useGetUser";
import { UpdateProfileState } from "@/actions/users";

type ProfileFormProps = {
  state: UpdateProfileState;
  preview?: string;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  coverPreview?: string;
  handleCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  action: (formData: FormData) => void;
};

export default function ProfileForm({
  state,
  preview,
  handleImageChange,
  coverPreview,
  handleCoverChange,
  action,
}: ProfileFormProps) {
  const { user, loading } = useAuth();
  const { update } = useSession();
  const { profile, refresh } = useGetUser(user?.email);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-green-600 dark:text-green-400">
        <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading profile...
      </div>
    );
  }

  const handleSubmit = async (formData: FormData) => {
    refresh({ ...profile, ...formData }, false);
    await action(formData);

    if (state.success) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatedValues: Record<string, any> = {
        name: state.formValues?.name,
        bio: state.formValues?.bio,
      };

      if (
        state.formValues?.image &&
        state.formValues.image !== profile?.image
      ) {
        updatedValues.image = state.formValues.image;
      }

      await update(updatedValues);
    }

    refresh();
  };

  return (
    <form className="space-y-6" action={handleSubmit}>
      {/* Profile Image */}
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24">
          <Image
            src={
              preview ||
              state.formValues?.image ||
              profile?.image ||
              "/profile.jpg"
            }
            alt="Profile"
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
          <label
            htmlFor="fileInput"
            className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 p-2 rounded-full cursor-pointer shadow-lg"
          >
            <Pencil className="w-4 h-4 text-white" />
          </label>
          <input
            type="file"
            id="fileInput"
            name="image"
            className="hidden"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {state.formValues?.name || profile?.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{profile?.email}</p>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Name
        </label>
        <Input
          type="text"
          placeholder="Enter your name"
          name="name"
          defaultValue={state.formValues?.name || profile?.name || ""}
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Bio
        </label>
        <textarea
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="Tell us about yourself"
          name="bio"
          defaultValue={state.formValues?.bio || profile?.bio || ""}
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
          Cover Image
        </label>

        <input
          type="file"
          id="coverInput"
          name="coverImage"
          accept="image/png, image/jpeg"
          onChange={handleCoverChange}
          className="hidden"
        />

        <div className="relative w-full h-40 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 group cursor-pointer">
          <Image
            fill
            src={coverPreview || profile?.coverImage || "/default-cover.jpg"}
            alt="Cover Preview"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <label
              htmlFor="coverInput"
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium rounded-md shadow cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
            >
              <Pencil className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              Change Cover
            </label>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {state.message && !state.success && (
        <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 p-3">
          <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">
            {state.message}
          </p>
          <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400 space-y-1">
            {Object.values(state.errors).map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600"
      >
        Save Changes
      </Button>
    </form>
  );
}
