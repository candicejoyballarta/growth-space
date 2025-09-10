"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useTheme } from "next-themes";

const Navigation = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl h-16 px-4 mx-auto sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-green-700 dark:text-green-400"
        >
          {mounted && (
            <Image
              src={
                theme === "light"
                  ? "/growth-space.png"
                  : "/growth-space-dark.png"
              }
              alt="Growth Space Logo"
              width={100}
              height={50}
              className="object-contain"
            />
          )}
        </Link>

        <ThemeToggle />
      </div>
    </header>
  );
};

export default Navigation;
