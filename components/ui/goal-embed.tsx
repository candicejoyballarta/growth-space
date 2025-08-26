"use client";

import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";

interface Goal {
  _id: string;
  title: string;
  progress: number;
  color: string;
  emoji: string;
}

interface GoalEmbedProps {
  goal: Goal | null;
  userId: string;
}

const GoalEmbed = ({ goal, userId }: GoalEmbedProps) => {
  const { user } = useAuth();
  const currentUserId = user?.id;

  if (!goal) return null;

  return (
    <Link href={`/goals/${goal._id}`} className="block">
      {/* Solid colored outline wrapper */}
      <div
        className="rounded-2xl p-[2px] transition-shadow hover:shadow-lg"
        style={{
          border: `1px solid ${goal.color}`,
        }}
      >
        {/* Inner card */}
        <div className="rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-bold" style={{ color: goal.color }}>
              {goal.emoji} {goal.title}
            </h4>
            <span className="text-sm font-medium" style={{ color: goal.color }}>
              {goal.progress}%
            </span>
          </div>

          <div className="mb-3">
            <Progress
              value={goal.progress}
              className="h-3 rounded-full"
              style={{ backgroundColor: `${goal.color}20` }}
            />
          </div>

          <p className="text-sm text-gray-700">
            {userId === currentUserId
              ? `You're crushing it! ${goal.progress}% done 🎯`
              : `Wow! They've completed ${goal.progress}% of this goal! 👏`}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default GoalEmbed;
