"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle } from "lucide-react";
import QOTDCard from "@/components/widgets/QOTDCard";
import HighlightPost from "@/components/widgets/HighlightPost";
import PeopleYouMayKnowCard from "@/components/widgets/PeopleYouMayKnowCard";

interface Milestone {
  _id: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
}

interface Goal {
  _id: string;
  title: string;
  description?: string;
  emoji: string;
  color: string;
  progress: number;
  user: {
    _id: string;
    name: string;
    image?: string;
  };
  milestones: Milestone[];
}

const GoalPage = () => {
  const { goalId } = useParams();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const res = await fetch(`/api/goals/${goalId}`);
        if (!res.ok) throw new Error("Failed to fetch goal");

        const data: Goal = await res.json();
        setGoal(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [goalId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!goal) return <p className="text-center mt-10">Goal not found</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Goal Details */}
      <div className="lg:col-span-2 space-y-6">
        <div
          className="rounded-2xl p-6 shadow-lg transition hover:shadow-xl"
          style={{ border: `2px solid ${goal.color}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold" style={{ color: goal.color }}>
              {goal.emoji} {goal.title}
            </h1>
            <span className="text-sm font-medium" style={{ color: goal.color }}>
              {goal.progress}%
            </span>
          </div>
          {goal.description && (
            <p className="text-gray-700 mb-4">{goal.description}</p>
          )}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-700 mb-1">
              <span>Progress</span>
              <span>{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-4 rounded-full" />
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold">📌 Milestones</h2>
            {goal.milestones.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {goal.milestones.map((m) => (
                  <span
                    key={m._id}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                      m.completed
                        ? "bg-green-100 text-green-700 line-through"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {m.completed ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <Circle className="h-3 w-3" />
                    )}
                    {m.title}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No milestones yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Cards */}
      <div className="space-y-6">
        <QOTDCard />
        <HighlightPost />
        <PeopleYouMayKnowCard />
      </div>
    </div>
  );
};

export default GoalPage;
