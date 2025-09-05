"use client";

import { use, useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import ColorPicker from "@/components/ui/color-picker";
import { updateGoal } from "@/actions/goals";
import Loading from "@/components/widgets/Loading";

export default function EditGoalPage({
  params,
}: {
  params: Promise<{ goalId: string }>;
}) {
  const router = useRouter();
  const [color, setColor] = useState("#10b981");

  const { goalId } = use(params);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    color,
    goalId,
  });

  const [state, formAction] = useActionState(updateGoal, {
    success: false,
    message: "",
    errors: {},
    formValues,
  });

  // Fetch the goal when the component mounts
  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const res = await fetch(`/api/goals/${goalId}`);
        const data = await res.json();

        setFormValues({
          title: data.title,
          description: data.description || "",
          color: data.color,
          goalId,
        });

        setColor(data.color);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch goal data");
        setLoading(false);
      }
    };

    fetchGoal();
  }, [goalId]);

  useEffect(() => {
    if (state.success) {
      toast.success("Goal edited successfully!");
      router.push("/dashboard/goals");
    }
  }, [state.success, router]);

  if (loading) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" action={formAction}>
            <input
              type="hidden"
              name="goalId"
              value={state?.formValues?.goalId || formValues.goalId}
            />
            <Input
              placeholder="Goal Title"
              name="title"
              required
              value={formValues.title}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <textarea
              placeholder="Description (optional)"
              name="description"
              value={formValues.description}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className={cn(
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-24 w-full min-w-0 rounded-md border bg-transparent px-3 py-3 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
              )}
            />

            {/* Color Picker */}
            <ColorPicker color={color} setColor={setColor} />

            {/* Error Messages */}
            {state.message && !state.success && (
              <div className="mb-4 rounded-md bg-red-50 border border-red-300 p-3">
                <p className="text-sm font-medium text-red-700 mb-2">
                  {state.message}
                </p>
                <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                  {Object.values(state.errors).map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button type="submit" className="w-full">
              {"Update Goal"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
