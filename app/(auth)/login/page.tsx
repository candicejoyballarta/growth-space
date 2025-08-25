"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import LoginForm from "@/components/forms/LoginForm";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const { status } = useSession();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const res = await login(email, password);

    if (res.error) {
      setFormError(res.error);
    }
  }

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <main className="min-h-screen bg-white grid md:grid-cols-2">
      {/* Left Panel */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex flex-col items-center justify-center bg-green-50 p-12"
      >
        <Image
          src="/growth-space.png"
          alt="Growth Space Logo"
          width={120}
          height={120}
          className="mb-6"
        />
        <h1 className="text-4xl font-bold text-green-700 mb-2">Welcome Back</h1>
        <p className="text-gray-600 text-center max-w-md">
          Log in to continue growing, reflecting, and reaching your personal
          goals with Growth Space.
        </p>
      </motion.div>

      {/* Right Panel (Form) */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col justify-center px-6 py-12 lg:px-16 overflow-y-auto"
      >
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Log In</h2>

          <LoginForm formError={formError} handleSubmit={handleSubmit} />

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-green-600 hover:underline">
              Get Started
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-gray-600">
            <Link
              href="/"
              className="inline-block text-gray-500 hover:text-green-600 hover:underline transition"
            >
              ← Back to Home
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
