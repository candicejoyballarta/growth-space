"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EditProfileState } from "@/actions/profile";
import Image from "next/image";
import { Loader2, Pencil } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";

type ProfileFormProps = {
  state: EditProfileState;
  preview?: string;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  action: (formData: FormData) => void;
};

export default function ProfileForm({
  state,
  preview,
  handleImageChange,
  action,
}: ProfileFormProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-green-600">
        <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading profile...
      </div>
    );
  }

  return (
    <form className="space-y-6" action={action}>
      {/* Profile Image */}
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24">
          <Image
            src={
              preview ||
              state.formValues?.image ||
              user?.image ||
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
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">
            {state.formValues?.name || user?.name}
          </h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input
          type="text"
          placeholder="Enter your name"
          name="name"
          defaultValue={state.formValues?.name || user?.name || ""}
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="Tell us about yourself"
          name="bio"
          defaultValue={state.formValues?.bio || user?.bio || ""}
        />
      </div>

      {/* Error Messages */}
      {state.message && !state.success && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-300 p-3">
          <p className="text-sm font-medium text-red-700 mb-2">
            {state.message}
          </p>
          <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
            {Object.values(state.errors).map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
      >
        Save Changes
      </Button>
    </form>
  );
}
