"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

const Navigation = () => {
  const router = useRouter();

  const handleFeatures = () => {
    router.push("/#features");
  };

  const handleHowItWorks = () => {
    router.push("/#how-it-works");
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl h-16 px-4 mx-auto sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-green-700"
        >
          <Image
            src="/growth-space.png"
            alt="Growth Space Logo"
            width={100}
            height={50}
            className="object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-green-600 transition">
            Home
          </Link>
          <a
            onClick={handleFeatures}
            className="hover:text-green-600 transition"
          >
            Features
          </a>
          <a
            onClick={handleHowItWorks}
            className="hover:text-green-600 transition"
          >
            How It Works
          </a>
          <Link href="/login" className="hover:text-green-600 transition">
            Log In
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-3/4 sm:w-1/2">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="mt-6 flex flex-col gap-4 text-base font-medium px-4">
              <Link href="/" className="hover:text-green-600 transition">
                Home
              </Link>
              <a
                onClick={handleFeatures}
                className="hover:text-green-600 transition"
              >
                Features
              </a>
              <a
                onClick={handleHowItWorks}
                className="hover:text-green-600 transition"
              >
                How It Works
              </a>
              <Link href="/login" className="hover:text-green-600 transition">
                Log In
              </Link>
              <Button asChild className="mt-4 w-full">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navigation;
