"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import toast from "react-hot-toast";
import { IMilestone } from "@/models/Goal";
import Link from "next/link";
import DeleteGoalButton from "@/components/ui/delete-goal-button";

type IGoal = {
  _id: string;
  title: string;
  description?: string;
  progress: number;
  color: string;
  user: {
    _id: string;
    name: string;
    image?: string;
  };
  milestones?: IMilestone[];
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<IGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch("/api/goals");
        const { data } = await res.json();
        setGoals(data);
      } catch (err) {
        console.error("Failed to fetch goals:", err);
        toast.error("Failed to fetch goals");
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  const handleShare = (goal: IGoal) => {
    toast.success(`Progress of "${goal.title}" shared!`);
  };

  if (loading) return <p className="text-center mt-10">Loading goals...</p>;

  if (goals.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500">You have no goals yet.</p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-4">My Goals</h1>

        <Button asChild>
          <Link href={"/dashboard/goals/new"}>Add Goal</Link>
        </Button>
      </div>

      {goals.length === 0 && (
        <p className="text-gray-500 text-center">
          {"You don't have any goals yet. Create one to get started!"}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <Card
            key={goal._id}
            className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow gap-3"
          >
            <CardHeader>
              <CardTitle className="text-lg">{goal.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {goal.description && (
                <p className="text-sm text-gray-600">{goal.description}</p>
              )}

              <div className="space-y-1">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Progress</span>
                  <span>{goal.progress}%</span>
                </div>
                <Progress
                  value={goal.progress}
                  style={{ backgroundColor: "#e5e7eb", height: 8 }}
                >
                  <div
                    style={{
                      width: `${goal.progress}%`,
                      backgroundColor: goal.color,
                      height: "100%",
                      borderRadius: 4,
                      transition: "width 0.3s ease",
                    }}
                  />
                </Progress>
              </div>

              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/dashboard/goals/${goal._id}/edit`}>Edit</Link>
                </Button>
                <DeleteGoalButton
                  goalId={goal._id}
                  onDelete={(id) =>
                    setGoals((prev) => prev.filter((goal) => goal._id !== id))
                  }
                />
                <Button size="sm" onClick={() => handleShare(goal)}>
                  Share Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
