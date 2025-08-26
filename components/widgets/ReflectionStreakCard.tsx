"use client";

import React, { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Flame } from "lucide-react";
import { useGetUserStreak } from "@/hooks/useGetUserStreak";
import { useAuth } from "@/context/AuthContext";

const ReflectionStreakCard = () => {
  const { user } = useAuth();
  const { days } = useGetUserStreak(user?.id);

  const streakPercentage = Math.min((days / 7) * 100, 100);
  return (
    <Card className="shadow-md rounded-2xl border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">
          Reflection Streak
        </CardTitle>
        <Flame className="h-5 w-5 text-orange-500" />
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-800">{days}</span>
          <span className="text-sm text-gray-500">day streak</span>
        </div>

        {/* Progress bar instead of dots */}
        <Progress value={streakPercentage} className="h-2" />

        <p className="text-xs text-gray-500">
          {days}/{7} reflections completed this week
        </p>

        {/* Optional mini-dots for visual flair */}
        <div className="flex space-x-1 pt-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i < days ? "bg-orange-400" : "bg-gray-200"
              }`}
            ></div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReflectionStreakCard;
