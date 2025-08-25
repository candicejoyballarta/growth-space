"use client";

import { useSession } from "next-auth/react";
import { useActionState, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ProfileForm from "@/components/forms/ProfileForm";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/actions/users";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [state, formAction] = useActionState(updateProfile, {
    success: false,
    message: "",
    errors: {},
    formValues: {},
  });
  const [previewAvatar, setPreviewAvatar] = useState<string>();
  const [previewCover, setPreviewCover] = useState<string>();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreviewAvatar(URL.createObjectURL(file));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewCover(previewUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (previewAvatar) URL.revokeObjectURL(previewAvatar);
    };
  }, [previewAvatar]);

  useEffect(() => {
    return () => {
      if (previewCover) URL.revokeObjectURL(previewCover);
    };
  }, [previewCover]);

  useEffect(() => {
    if (state.success) {
      toast.success("Account updated successfully!");
      router.push("/dashboard");
    }
  }, [state.success, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-green-600">
        <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading profile...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-20 text-red-600">
        You must be logged in to view this page.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md border border-green-100">
      <h1 className="text-2xl font-bold text-green-700 mb-6">My Profile</h1>

      <ProfileForm
        state={state}
        preview={previewAvatar}
        handleImageChange={handleAvatarChange}
        coverPreview={previewCover}
        handleCoverChange={handleCoverChange}
        action={formAction}
      />
    </div>
  );
}
