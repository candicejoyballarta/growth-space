"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import LoginForm from "@/components/forms/LoginForm";
import { useActionState } from "react";
import { login } from "@/actions/login";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const [state] = useActionState(login, {
    success: false,
    errors: {},
    formValues: {},
    data: undefined,
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const result = await login(state, form);

    if (result.success && result.data) {
      await signIn("credentials", {
        email: result.data.email,
        password: result.data.password,
        redirect: true,
        callbackUrl: "/dashboard",
      });
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

          <LoginForm state={state} handleSubmit={handleSubmit} />

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
