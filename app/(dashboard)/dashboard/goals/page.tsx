"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { IMilestone } from "@/models/Goal";
import Link from "next/link";
import GoalCards from "@/components/ui/goal-card";
import { Plus } from "lucide-react";

export type IGoal = {
  _id: string;
  title: string;
  description?: string;
  progress: number;
  color: string;
  emoji: string;
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-4">🎯 My Goals</h1>

        <Button asChild>
          <Link href={"/dashboard/goals/new"}>
            <Plus /> Add Goal
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="p-4 border rounded-xl shadow-sm bg-white space-y-3"
              >
                <div className="h-5 w-32 bg-gray-200 rounded"></div>
                <div className="h-3 w-full bg-gray-200 rounded"></div>
                <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ) : goals.length === 0 ? (
        <p className="text-center mt-10 text-gray-500">
          🌱 You have no goals yet. Start your journey today!
        </p>
      ) : (
        <GoalCards goals={goals} setGoals={setGoals} />
      )}
    </div>
  );
}
