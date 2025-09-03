"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

export default function MilestoneForm({ goalId }: { goalId: string }) {
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);

  const handleAddMilestone = async () => {
    if (!title.trim()) return alert("Title required");

    const res = await fetch(`/api/goals/${goalId}/milestones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, completed }),
    });
    const data = await res.json();
    if (data.success) {
      setTitle("");
      setCompleted(false);
    } else {
      alert("Failed to add milestone");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Milestone</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a Milestone</DialogTitle>
          <DialogDescription className="text-gray-600">
            Break your goal into achievable steps and track your progress. Every
            small milestone brings you closer to your dreams!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Input
            placeholder="Milestone Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-gray-300 focus:border-green-400 focus:ring-green-200"
          />
          <div className="flex items-start gap-3">
            <Checkbox id="toggle" disabled />
            <Label htmlFor="toggle">Enable notifications</Label>
          </div>
          <Button className="w-full" onClick={handleAddMilestone}>
            Add Milestone
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
