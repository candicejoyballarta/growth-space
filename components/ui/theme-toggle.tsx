"use client";

import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <span
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="relative flex items-center justify-center cursor-pointer 
        rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 
        transition-colors transform hover:scale-110"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.div
            key="sun"
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute"
          >
            <Sun className="h-5 w-5 text-yellow-400 drop-shadow" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -180, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute"
          >
            <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300 drop-shadow" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
