"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export default function AnalyticsPage() {
  // 📉 Retention vs Churn
  const retentionData = [
    { month: "Jan", retention: 75, churn: 25 },
    { month: "Feb", retention: 72, churn: 28 },
    { month: "Mar", retention: 70, churn: 30 },
    { month: "Apr", retention: 74, churn: 26 },
    { month: "May", retention: 78, churn: 22 },
  ];

  // 🔥 Engagement Heatmap (mock activity counts)
  const heatmapData = [
    { day: "Mon", hours: [5, 8, 15, 10, 6, 2] },
    { day: "Tue", hours: [4, 12, 18, 9, 7, 3] },
    { day: "Wed", hours: [7, 14, 20, 12, 10, 5] },
    { day: "Thu", hours: [6, 9, 17, 14, 8, 4] },
    { day: "Fri", hours: [8, 15, 22, 18, 12, 6] },
    { day: "Sat", hours: [10, 18, 25, 20, 15, 7] },
    { day: "Sun", hours: [6, 10, 14, 12, 8, 4] },
  ];

  // 🎯 Goal Completion Rate
  const goalCompletion = [
    { category: "Health", completed: 80, total: 100 },
    { category: "Career", completed: 65, total: 100 },
    { category: "Finance", completed: 50, total: 100 },
    { category: "Personal", completed: 70, total: 100 },
  ];

  // ⚡ System Health Metrics
  const systemHealth = [
    { label: "Uptime", value: "99.9%" },
    { label: "Avg Response", value: "250ms" },
    { label: "Error Rate", value: "0.3%" },
    { label: "Requests/min", value: "1.2k" },
  ];

  // 💬 Sentiment Analysis
  const sentimentData = [
    { name: "Positive", value: 65 },
    { name: "Neutral", value: 20 },
    { name: "Negative", value: 15 },
  ];

  const COLORS = ["#4CAF50", "#FFC107", "#F44336"];

  return (
    <div className="p-6 space-y-8 bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-6">
        Insights Dashboard
      </h1>

      {/* Retention / Churn */}
      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-gray-100">
            Retention vs Churn Rate
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={retentionData}>
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="retention"
                stroke="#4CAF50"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="churn"
                stroke="#F44336"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Engagement Heatmap */}
      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-gray-100">
            Engagement Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {heatmapData.map((row, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {row.day}
                </span>
                <div className="grid grid-cols-6 gap-1">
                  {row.hours.map((val, j) => (
                    <div
                      key={j}
                      className="w-6 h-6 rounded"
                      style={{
                        backgroundColor: `rgba(76, 175, 80, ${val / 25})`,
                      }}
                      title={`Hour ${j + 1}: ${val} actions`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goal Completion Rate */}
      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-gray-100">
            Goal Completion Rate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {goalCompletion.map((goal, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span>{goal.category}</span>
                <span>
                  {goal.completed}/{goal.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                <div
                  className="h-3 rounded-full bg-green-500"
                  style={{ width: `${(goal.completed / goal.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* System Health Metrics */}
      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-gray-100">
            System Health Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {systemHealth.map((metric, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-center"
            >
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {metric.label}
              </p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {metric.value}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sentiment Analysis */}
      <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-gray-100">
            Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {sentimentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
