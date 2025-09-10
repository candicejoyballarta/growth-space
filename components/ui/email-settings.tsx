"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useGetUser } from "@/hooks/useGetUser";
import { useSession } from "next-auth/react";

const EmailSettingsSkeleton = () => {
  return (
    <div className="p-6 space-y-4 bg-white dark:bg-gray-800 rounded-xl shadow-md animate-pulse">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        Email Settings
      </h2>

      <div className="flex flex-col space-y-2">
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded" />
      </div>

      <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
    </div>
  );
};

export default function EmailSettings() {
  const { data: session, status, update } = useSession();
  const {
    profile,
    refresh,
    loading: profileLoading,
  } = useGetUser(session?.user?.email);
  const [newEmail, setNewEmail] = useState(session?.user?.email || "");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = async () => {
    try {
      const updatedSession = await update({
        user: { ...session?.user, email: newEmail },
      });

      if (updatedSession?.user?.email === newEmail) {
        toast.success("Email updated successfully!");
      } else {
        toast.error("Failed to update email");
      }
    } catch (err) {
      console.error("Email update error:", err);
      toast.error("Something went wrong");
    }
  };

  const handleSendVerification = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });

      if (res.ok) {
        toast.success("Verification email sent!");
      } else {
        toast.error("Failed to send verification email");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send verification email");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      refresh(`/api/users?email=${session?.user?.email}`);
      setNewEmail(session?.user.email);
    }
  }, [session?.user?.email]);

  if (profileLoading || status === "loading") {
    return <EmailSettingsSkeleton />;
  }

  return (
    <div className="p-6 space-y-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        Email Settings
      </h2>

      <div className="flex flex-col space-y-2">
        <label className="text-gray-600 dark:text-gray-300">
          Current Email
        </label>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        />
      </div>

      <Button onClick={handleEmailChange} disabled={profileLoading}>
        {profileLoading ? "Updating..." : "Change Email"}
      </Button>

      {!profile?.emailVerified && (
        <div className="mt-4 p-4 border border-yellow-400 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-600">
          <p className="text-yellow-800 dark:text-yellow-200">
            Your email is not verified yet.
          </p>
          <Button
            onClick={handleSendVerification}
            className="mt-2"
            disabled={loading}
            variant="outline"
          >
            {loading ? "Sending..." : "Send Verification Email"}
          </Button>
        </div>
      )}
    </div>
  );
}
