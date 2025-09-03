"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import ColorPicker from "@/components/ui/color-picker";
import { createGoal } from "@/actions/goals";

export default function NewGoalPage() {
  const router = useRouter();

  const [color, setColor] = useState("#34D399");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    emoji: "⭐",
  });

  const [state, formAction] = useActionState(createGoal, {
    success: false,
    message: "",
    errors: {},
    formValues: formData,
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Goal created successfully!");
      router.push("/dashboard/goals");
    }
  }, [state.success, router]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card className="shadow-lg bg-white dark:bg-gray-900 dark:text-gray-100 transition-colors">
        <CardHeader>
          <CardTitle>Create a New Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" action={formAction}>
            {/* Title */}
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="title"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
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
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description (optional)
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your goal"
                className={cn(
                  "w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-sm transition outline-none resize-none",
                  "border-gray-300 dark:border-gray-700",
                  "focus-visible:border-green-600 focus-visible:ring focus-visible:ring-green-200 dark:focus-visible:ring-green-800"
                )}
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            {/* Emoji */}
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="emoji"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
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
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Pick a Color
              </span>
              <ColorPicker color={color} setColor={setColor} />
            </div>

            {/* Error Messages */}
            {state.message && !state.success && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 p-3">
                <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">
                  {state.message}
                </p>
                {Object.values(state.errors).length > 0 && (
                  <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400 space-y-1">
                    {Object.values(state.errors).map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Create Goal
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
