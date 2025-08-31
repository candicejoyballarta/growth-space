"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import { Pen } from "lucide-react";

interface Reflection {
  id: string;
  title: string;
  goal: string;
  date: string;
}

interface Props {
  reflections: Reflection[];
}

export default function ReflectionHistoryCard({ reflections }: Props) {
  // Get the 3 latest reflections
  const latestReflections = reflections
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <Card className="shadow-sm rounded-2xl border gap-3 border-gray-100 bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100">
          Reflection History
        </CardTitle>
        <Pen className="h-5 w-5 text-primary dark:text-white" />
      </CardHeader>
      <CardContent className="space-y-3 max-h-64 overflow-y-auto">
        {latestReflections.length === 0 ? (
          <p className="text-sm text-gray-500">No reflections yet.</p>
        ) : (
          latestReflections.map((ref) => (
            <div
              key={ref.id}
              className="p-3 rounded-lg border border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-colors dark:border-gray-700 dark:hover:from-gray-800 dark:hover:to-gray-900"
            >
              <p className="text-xs text-gray-400 mb-1 dark:text-gray-500">
                {dayjs(ref.date).format("MMM D, YYYY")}
              </p>
              <div
                className="text-sm text-gray-700 dark:text-white"
                dangerouslySetInnerHTML={{ __html: ref.title }}
              />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
