"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { Loader2, Pencil, Save } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Replace with your server action or API call to update profile
    await new Promise((r) => setTimeout(r, 1500));
    setIsSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md border border-green-100">
      <h1 className="text-2xl font-bold text-green-700 mb-6">My Profile</h1>

      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <Image
            src={session.user?.image || "/default-avatar.png"}
            alt="Profile Picture"
            width={96}
            height={96}
            className="rounded-full object-cover border-4 border-green-200"
          />
          <label className="absolute bottom-0 right-0 bg-green-600 text-white text-xs px-2 py-1 rounded-md cursor-pointer hover:bg-green-700">
            <Pencil className="w-4 h-4 text-white" />
            <input type="file" className="hidden" />
          </label>
        </div>

        <div>
          <p className="text-sm text-green-500">Logged in as</p>
          <p className="text-lg font-semibold">{session.user?.email}</p>
        </div>
      </div>

      {/* Name */}
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-green-700 mb-1"
        >
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-green-200 px-3 py-2 focus:border-green-500 focus:ring focus:ring-green-200"
        />
      </div>

      {/* Bio */}
      <div className="mb-6">
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-green-700 mb-1"
        >
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-green-200 px-3 py-2 focus:border-green-500 focus:ring focus:ring-green-200"
        />
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        Save Changes
      </button>
    </div>
  );
}
