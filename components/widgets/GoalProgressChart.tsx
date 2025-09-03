"use client";

import {
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface GoalChartProps {
  goals: {
    _id: string;
    title: string;
    progress: number;
    color: string;
  }[];
}

export default function GoalProgressRadialChart({ goals }: GoalChartProps) {
  const data = goals.map((goal) => ({
    name: goal.title,
    progress: goal.progress,
    fill: goal.color,
  }));

  return (
    <div className="flex justify-center ml-12">
      <ResponsiveContainer width={400} height={250}>
        <RadialBarChart
          data={data}
          innerRadius="10%"
          outerRadius="70%"
          cx="50%"
          cy="50%"
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar dataKey="progress" background={true} cornerRadius={5} />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            align="left"
            wrapperStyle={{ fontSize: "0.85rem", lineHeight: "1.3rem" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
