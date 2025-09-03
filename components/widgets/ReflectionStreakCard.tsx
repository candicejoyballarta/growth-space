"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Flame } from "lucide-react";
import { Progress } from "../ui/progress";

interface ReflectionStreakCardProps {
  days: number;
}

const ReflectionStreakCard = ({ days }: ReflectionStreakCardProps) => {
  const streakPercentage = Math.min((days / 7) * 100, 100);

  return (
    <Card className="shadow-lg rounded-2xl border-0 bg-gradient-to-br dark:from-gray-800 dark:to-gray-900">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100">
          Reflection Streak
        </CardTitle>
        <Flame className="h-5 w-5 text-orange-500 dark:text-orange-400" />
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {days}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            day streak
          </span>
        </div>

        {/* Progress bar */}
        <Progress
          value={streakPercentage}
          className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 [&>div]:bg-orange-400"
        />

        <p className="text-xs text-gray-500 dark:text-gray-400">
          {days}/{7} reflections completed this week
        </p>

        {/* Mini-dots */}
        <div className="flex space-x-1 pt-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i < days
                  ? "bg-orange-400 dark:bg-orange-400"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            ></div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReflectionStreakCard;
