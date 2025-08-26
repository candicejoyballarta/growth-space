import { IGoal } from "@/app/(dashboard)/dashboard/goals/page";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { CheckCircle, Circle, MoreVertical, Plus } from "lucide-react";
import Link from "next/link";
import DeleteGoalButton from "./delete-goal-button";
import { Progress } from "./progress";
import toast from "react-hot-toast";
import PostContent from "./post-content";
import AddMilestoneButton from "./add-milestone-button";
import { IMilestone } from "@/models/Goal";

interface IGoalCard {
  setGoals: React.Dispatch<React.SetStateAction<IGoal[]>>;
  goals: IGoal[];
}

const GoalCards = ({ goals, setGoals }: IGoalCard) => {
  const handleShare = (goal: IGoal) => {
    toast.success(`📤 Shared progress for "${goal.title}"!`);
  };

  const handleArchive = (goalId: string) => {
    toast.success("📦 Goal archived!");
    setGoals((prev) => prev.filter((g) => g._id !== goalId));
  };

  const handleAddMilestone =
    (goalId: string) => (title: string, dueDate?: Date) => {
      setGoals((prevGoals) =>
        prevGoals.map((goal) => {
          if (goal._id !== goalId) return goal;

          const tempId = `temp-${Date.now()}`;

          const newMilestone: IMilestone = {
            _id: tempId,
            title,
            completed: false,
            dueDate: dueDate || null,
          } as IMilestone;

          const updatedMilestones = [...(goal.milestones || []), newMilestone];

          const completedCount = updatedMilestones.filter(
            (m) => m.completed
          ).length;
          const progress = Math.round(
            (completedCount / updatedMilestones.length) * 100
          );

          return {
            ...goal,
            milestones: updatedMilestones,
            progress,
          };
        })
      );
    };

  const handleMilestoneComplete = (goalId: string, milestoneId: string) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal._id !== goalId) return goal;

        const updatedMilestones = (goal.milestones ?? []).map((m) =>
          m._id === milestoneId
            ? ({ ...m, completed: !m.completed } as IMilestone)
            : m
        );

        const completedCount = updatedMilestones.filter(
          (m) => m.completed
        ).length;
        const progress = Math.round(
          (completedCount / updatedMilestones.length) * 100
        );

        return { ...goal, milestones: updatedMilestones, progress };
      })
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {goals.map((goal) => (
        <Card
          key={goal._id}
          className="relative rounded-2xl shadow-lg overflow-hidden border transition hover:shadow-xl"
          style={{ borderColor: goal.color }}
        >
          {/* Menu */}
          <div className="absolute top-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="rounded-full">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/goals/${goal._id}/edit`}>Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleArchive(goal._id)}>
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-xl truncate">
              <span className="text-2xl">{goal.emoji || "🌟"}</span>
              {goal.title}
            </CardTitle>
            {goal.description && <PostContent content={goal.description} />}
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Progress</span>
                <span>{goal.progress}%</span>
              </div>
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

            {/* Milestones as playful pills */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold">📌 Milestones</h3>
                <AddMilestoneButton onAdd={handleAddMilestone(goal._id)} />
              </div>

              {goal.milestones && goal.milestones.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {goal.milestones.map((m, idx) => (
                    <span
                      key={idx}
                      onClick={() => handleMilestoneComplete(goal._id, m.id)}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium cursor-pointer transition-all ${
                        m.completed
                          ? "bg-green-100 text-green-700 line-through"
                          : "bg-gray-100 text-gray-700"
                      }`}
                      style={{ borderColor: goal.color, borderWidth: 1 }}
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
                <p className="text-xs text-gray-400">
                  No milestones yet. Add one to track progress!
                </p>
              )}
            </div>

            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" asChild>
                <Link href={`/dashboard/goals/${goal._id}/edit`}>✏️ Edit</Link>
              </Button>
              <DeleteGoalButton
                goalId={goal._id}
                onDelete={(id) =>
                  setGoals((prev) => prev.filter((goal) => goal._id !== id))
                }
              />
              {/* <Button size="sm" onClick={() => handleShare(goal)}>
                📤 Share
              </Button> */}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GoalCards;
