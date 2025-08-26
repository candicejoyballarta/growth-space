"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle } from "lucide-react";

interface Goal {
  title: string;
  progress: number; // percentage
  color: string; // Tailwind base color
}

const goals: Goal[] = [
  { title: "Read 10 Books", progress: 40, color: "green" },
  { title: "Meditate Daily", progress: 75, color: "blue" },
  { title: "Exercise 3x a Week", progress: 100, color: "purple" },
];

export default function ActiveGoalsCard() {
  return (
    <Card className="shadow-sm rounded-2xl border border-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Active Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {goals.map((goal, i) => {
          const isComplete = goal.progress >= 100;
          return (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {isComplete && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  <p
                    className={`text-sm font-medium ${
                      isComplete ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {goal.title}
                  </p>
                </div>
                <span className="text-xs font-medium text-gray-500">
                  {goal.progress}%
                </span>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ease-in-out bg-${goal.color}-500`}
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
