"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle, Goal } from "lucide-react";
import { motion } from "framer-motion";

interface Goal {
  title: string;
  progress: number;
  color: string;
}

interface ActiveGoalProps {
  goals: Goal[];
}

export default function ActiveGoalsCard({ goals }: ActiveGoalProps) {
  return (
    <Card className="shadow-md rounded-2xl border gap-3 border-gray-200 bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 ">
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100">
          Active Goals
        </CardTitle>
        <Goal className="h-5 w-5 text-green-500 dark:text-green-400" />
      </CardHeader>

      <CardContent className="space-y-4">
        {goals.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No active goals.
          </p>
        )}

        {goals.map((goal, i) => {
          const isComplete = goal.progress >= 100;
          return (
            <div key={i} className="space-y-2">
              {/* Goal title and progress */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {isComplete && (
                    <CheckCircle className="w-5 h-5 text-green-500 animate-pulse" />
                  )}
                  <p
                    className={`text-sm font-medium ${
                      isComplete
                        ? "line-through text-gray-400 dark:text-gray-500"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {goal.title}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    isComplete
                      ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {goal.progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${goal.progress}%` }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="h-2 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${goal.color} 0%, ${goal.color}80 100%)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
