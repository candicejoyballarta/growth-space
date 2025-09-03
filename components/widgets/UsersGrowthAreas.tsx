"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type PieDataEntry = {
  name: string;
  value: number;
};

interface cardProps {
  data: PieDataEntry[];
}

export default function UsersGrowthAreas({ data }: cardProps) {
  const COLORS = ["#4CAF50", "#2ECC71", "#27AE60", "#16A34A"];
  return (
    <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-800 dark:text-gray-100">
          Users by Growth Areas
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.map((entry: PieDataEntry, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
