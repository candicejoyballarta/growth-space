"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Missing verification token.");
        return;
      }

      try {
        const res = await fetch(`/api/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage("Your email has been verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to verify email.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Something went wrong while verifying.");
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
            <p className="mt-4 text-gray-700 dark:text-gray-300">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            <p className="mt-4 font-medium text-gray-800 dark:text-gray-100">
              {message}
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              You may now safely close this tab or return to the app.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            <p className="mt-4 font-medium text-gray-800 dark:text-gray-100">
              {message}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
