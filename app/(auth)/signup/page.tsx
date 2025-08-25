"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useActionState, useEffect } from "react";
import SignUpForm from "@/components/forms/SignUpForm";
import { signIn, useSession } from "next-auth/react";
import { signup } from "@/actions/auth";

export default function SignupPage() {
  const { status } = useSession();

  const [state, formAction] = useActionState(signup, {
    success: false,
    message: "",
    errors: {},
    formValues: {},
  });

  useEffect(() => {
    const autoLogin = async () => {
      if (state.success && state.formValues) {
        try {
          await signIn("credentials", {
            email: state.formValues.email,
            password: state.formValues.password,
            redirect: true,
            callbackUrl: "/onboarding",
          });
        } catch (err) {
          console.error("Auto login failed:", err);
        }
      }
    };

    autoLogin();
  }, [state.success, state.formValues]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-white grid md:grid-cols-2">
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
        <h1 className="text-4xl font-bold text-green-700 mb-2">
          Join Growth Space
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          Create your free account and start your journey of self-discovery,
          reflection, and intentional growth.
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
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Sign Up</h2>

          <SignUpForm state={state} action={formAction} />

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-green-600 hover:underline">
              Log In
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
