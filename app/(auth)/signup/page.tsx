"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useActionState, useEffect } from "react";
import SignUpForm from "@/components/forms/SignUpForm";
import { signIn, useSession } from "next-auth/react";
import { signup } from "@/actions/auth";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const { theme } = useTheme();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [state, formAction] = useActionState(signup, {
    success: false,
    message: "",
    errors: {},
    formValues: {},
  });

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [status, session, router]);

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
    <main className="min-h-screen grid md:grid-cols-2 bg-white dark:bg-gray-950 transition-colors">
      {/* Left Panel (branding) */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex flex-col items-center justify-center 
                   bg-green-50 dark:bg-green-900/20 
                   px-12 transition-colors"
      >
        <Image
          src={
            theme === "light" ? "/growth-space.png" : "/growth-space-dark.png"
          }
          alt="Growth Space Logo"
          width={120}
          height={120}
          className="mb-6"
        />
        <h1 className="text-4xl font-bold text-green-700 dark:text-green-400 mb-2">
          Welcome to Growth Space
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
          Join a community built around reflection and intentional growth.
        </p>
      </motion.div>

      {/* Right Panel (form) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex flex-col justify-center px-6 py-12 lg:px-16 overflow-y-auto"
      >
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center md:text-left">
            Create Your Account
          </h2>

          <SignUpForm state={state} action={formAction} />

          {/* Links */}
          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-green-600 dark:text-green-400 hover:underline"
              >
                Log in
              </Link>
            </p>

            <Link
              href="/"
              className="inline-block text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:underline transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
