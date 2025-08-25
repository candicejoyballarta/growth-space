"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Link from "next/link";

export default function Herobar() {
  return (
    <motion.section
      className="relative w-full min-h-[60vh] flex items-center justify-center bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 text-white overflow-hidden"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center px-6 max-w-3xl z-10">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Unlock Your Potential with Growth Space
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Track your goals, reflect weekly, and become the best version of
          yourself.
        </motion.p>
        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            size="lg"
            className="bg-white text-green-600 hover:bg-gray-100"
            asChild
          >
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button size="lg" className="border-white text-white" asChild>
            <Link href="about">Learn More</Link>
          </Button>
        </motion.div>
      </div>

      {/* Floating shapes for subtle animation */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          className="absolute top-10 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
        <motion.div
          className="absolute bottom-10 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-2xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
        />
      </div>
    </motion.section>
  );
}
