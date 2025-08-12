"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SuccessNotificationProps {
  success: boolean;
  message: string;
  duration?: number; // milliseconds
}

export default function SuccessNotification({
  success,
  message,
  duration = 3000,
}: SuccessNotificationProps) {
  const [isVisible, setIsVisible] = useState(success);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 flex items-center gap-2 rounded-xl bg-green-600 text-white px-4 py-3 shadow-lg"
        >
          <CheckCircle className="w-5 h-5" />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
