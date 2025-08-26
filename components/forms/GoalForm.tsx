"use client";

import { IGoal, IMilestone } from "@/models/Goal";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ColorPicker from "@/components/ui/color-picker";

export interface GoalFormData {
  title: string;
  description?: string;
  emoji?: string;
  color?: string;
  milestones?: IMilestone[];
}

interface GoalFormProps {
  initialData?: GoalFormData;
  onSubmit?: string | ((formData: FormData) => void | Promise<void>);
  onCancel?: () => void;
  showSkip?: boolean;
  onSkip?: () => void;
}

export default function GoalForm({
  initialData,
  onSubmit,
  onCancel,
  showSkip = false,
  onSkip,
}: GoalFormProps) {
  const [color, setColor] = useState(initialData?.color || "#34D399");
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    emoji: initialData?.emoji || "⭐",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-xl mx-auto shadow-lg p-4">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Goal" : "Create a New Goal"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" action={onSubmit}>
          {/* Title */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="title" className="text-sm font-medium">
              Goal Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Enter your goal title"
              required
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="description" className="text-sm font-medium">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your goal"
              className={cn(
                "w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-sm transition focus-visible:border-green-600 focus-visible:ring focus-visible:ring-green-200 outline-none",
                "resize-none"
              )}
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* Emoji */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="emoji" className="text-sm font-medium">
              Emoji (optional)
            </label>
            <Input
              id="emoji"
              name="emoji"
              placeholder="⭐"
              value={formData.emoji}
              onChange={(e) => handleChange("emoji", e.target.value)}
              className="w-24 text-center"
            />
          </div>

          {/* Color Picker */}
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium">Pick a Color</span>
            <ColorPicker color={color} setColor={setColor} />
          </div>

          {/* Live Preview */}
          <div
            className="mt-4 p-5 rounded-2xl shadow-lg border border-gray-200 bg-gradient-to-br from-white to-green-50 text-left transition-all"
            style={{ borderColor: color }}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="text-3xl">{formData.emoji}</div>
              <h3 className="text-xl font-bold text-gray-900 truncate">
                {formData.title || "Goal Preview"}
              </h3>
            </div>
            <p className="text-gray-700 text-sm">
              {formData.description ||
                "Your goal description will appear here."}
            </p>
            <div
              className="mt-3 h-1 w-full rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <div className="flex gap-3">
              {showSkip && onSkip && (
                <Button type="button" variant="outline" onClick={onSkip}>
                  Skip
                </Button>
              )}
              <Button variant="main" type="submit" disabled={!formData.title}>
                {initialData ? "Save Goal" : "Create Goal"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
