"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Progress } from "@radix-ui/react-progress";

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
      {/* Colored border wrapper */}
      <div
        className="rounded-2xl p-[2px] transition-shadow hover:shadow-lg"
        style={{ border: `1px solid ${goal.color}` }}
      >
        {/* Inner card */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5">
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
              style={{
                backgroundColor: "#e5e7eb",
                height: 8,
                borderRadius: 4,
              }}
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

          <p className="text-sm text-gray-700 dark:text-gray-300">
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
