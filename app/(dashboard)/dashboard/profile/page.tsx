"use client";

import { useSession } from "next-auth/react";
import { ChangeEvent, useActionState, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ProfileForm from "@/components/forms/ProfileForm";
import { editProfile } from "@/actions/profile";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [state, formAction] = useActionState(editProfile, {
    success: false,
    message: "",
    errors: {},
    formValues: {},
  });
  const [preview, setPreview] = useState<string>();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  // Cleanup preview URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

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
        preview={preview}
        handleImageChange={handleImageChange}
        action={formAction}
      />
    </div>
  );
}
